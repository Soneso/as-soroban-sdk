import { Bytes } from "./bytes";
import { contract_event, fail_with_error, get_current_call_stack, get_current_contract_address, 
    get_invoking_contract, get_ledger_network_id, get_ledger_sequence, get_ledger_timestamp, 
    get_ledger_version, get_max_expiration_ledger, log_from_linear_memory, obj_cmp, vec_unpack_to_linear_memory } from "./env";
import { Val, toU32, toU64, ErrorVal, contractError, 
    fromSmallSymbolStr, AddressObject, isU64Small, toU64Small, fromU32} from "./value";
import { Vec } from "./vec";


/**
* Emit a diagnostic event containing a message.
* To do so it copies the message to linear memory starting from position 0.
* If you already have data there, consider using `logFromLinearMemory`.
* @param msg the message to log
*/
export function logStr(msg: string): void {
    let b = Bytes.fromString(msg);
    let len = b.len();
    b.copyToLinearMemory(0, 0, len);
    let zero = fromU32(0);
    log_from_linear_memory(zero, fromU32(len), zero, zero);
}

/**
* Emit a diagnostic event containing the given value.
* To do so it copies the value to linear memory starting from position 0.
* If you already have data there, consider using `logFromLinearMemory`.
* @param value the value to log
*/
export function logValue(value: Val): void {
    let vec = new Vec()
    vec.pushBack(value);
    log("", vec);
}

/**
* Emit a diagnostic event containing the given message and value.
* To do so it copies the message and value to linear memory starting from position 0.
* If you already have data there, consider using `logFromLinearMemory`.
* @param value the value to log
*/
export function logMgsAndValue(msg: string, value: Val): void {
    let vec = new Vec()
    vec.pushBack(value);
    log(msg, vec);
}

/**
 * Emit a diagnostic event containing a message and the values from the given vector.
 * To do so it copies the message and the values to linear memory starting from position 0.
 * If you already have data there, consider using `logFromLinearMemory`.
 * @param msg the message string
 * @param args The values in the Vector.
 */
export function log(msg: string, vals: Vec): void {

    // Copy message to linear memory
    let msgBytes = Bytes.fromString(msg);
    let msgLen = msgBytes.len();
    msgBytes.copyToLinearMemory(0, 0, msgLen); // starts at position 0

    // Copy vals to linear memory
    let valsLen = fromU32(vals.len())
    let valsPos = fromU32(msgLen + 1)
    vec_unpack_to_linear_memory(vals.getHostObject(), valsPos, valsLen);

    // Log from linear memory
    log_from_linear_memory(fromU32(0), fromU32(msgLen), valsPos, valsLen);
}

/**
 * Emit a diagnostic event containing a message and sequence of `Val`s from a Vec.
 * @param msgPos u32 starting position of message in linear memory
 * @param msgLen u32 length of message in linear memory
 * @param valsPos u32 starting position of the values in linear memory
 * @param valsLen u32 length (nr. of elements from the vec) of the values in linear memory
 */
export function logFromLinearMemory(msgPos: u32, msgLen: u32, valsPos: u32, valsLen: u32): void {
    log_from_linear_memory(fromU32(msgPos), fromU32(msgLen), fromU32(valsPos), fromU32(valsLen))
}

/**
 * Get the address object for the current contract.
 * @returns the current contract address as AddressObject
 */
export function getCurrentContractAddress(): AddressObject {
    return get_current_contract_address();
}

/**
 * Returns the address object of the contract which invoked the running contract. 
 * Traps if the running contract was not invoked by a contract.
 * @returns the invoking contract address as AddressObject
 */
export function getInvokingContract(): AddressObject {
    return get_invoking_contract();
}

/**
 * Compare two objects, or at least one object to a non-object, structurally. Returns -1 if a<b, 1 if a>b, or 0 if a==b.
 * @param a first obj to compare.
 * @param b second obj to compare.
 * @returns result  -1 if a<b, 1 if a>b, or 0 if a==b.
 */
export function compareObj(a: Val, b: Val): i64 {
    return obj_cmp(a, b);
}

/**
 * Return the protocol version of the current ledger as a u32.
 * @returns protocol version of the current ledger as a u32.
 */
export function getLedgerVersion(): u32 {
    return toU32(get_ledger_version());
}

/**
 * Return the sequence number of the current ledger as a u32.
 * @returns sequence number of the current ledger as a u32.
 */
export function getLedgerSequence(): u32 {
    return toU32(get_ledger_sequence());
}

/**
 * Returns the max ledger sequence that an entry can live to (inclusive).
 * @returns the max ledger sequence that an entry can live to as u32
 */
export function getMaxExpirationLedger(): u32 {
    return toU32(get_max_expiration_ledger());
}

/**
 * Return the timestamp number of the current ledger as a u64.
 * @returns the timestamp number of the current ledger as a u64.
 */
export function getLedgerTimestamp(): u64 {
    let tmp = get_ledger_timestamp();
    if (isU64Small(tmp)) {
        return toU64Small(tmp);
    }
    return toU64(tmp);
}

/**
 * Return the network id (sha256 hash of network passphrase) of the current ledger as `Bytes`. The value is always 32 bytes in length.
 * @returns Return the network id of the current ledger as `Bytes`
 */
export function getLedgerNetworkId(): Bytes {
    return new Bytes(get_ledger_network_id());
}

/**
 * Returns the full call stack from the first contract call
 * to the current one as a vector of vectors, where the inside
 * vector contains the contract id as Hash, and a function as
 * a Symbol.
 * @returns the full call stack
 */
export function getCurrentCallStack(): Vec {
    return new Vec(get_current_call_stack());
}

/**
 * Causes the currently executing contract to fail immediately.
 * It traps with with contract error status code and error code 0
 */
export function fail(): void {
    fail_with_error(contractError(0));
}

/**
 * Causes the currently executing contract to fail immediately.
 * It traps with contract error type and error code as given by parameter.
 * @param errCode the error code to use.
 */
export function failWithErrorCode(errCode: u32): void {
    fail_with_error(contractError(errCode));
}

/**
 * Causes the currently executing contract to fail immediately.
 * It traps with the error given by parameter.
 * @param error ErrorVal
 */
export function failWithError(error: ErrorVal): void {
    fail_with_error(error);
}

/**
 * Lets the host publish a contract event. 
 * `topics` is expected to be a `Vec` with length <= 4 that CANNOT contain `Vec`, `Map`, or `Bytes` with length > 32
 * Returns nothing on success, and panics on failure
 * @param topics the vector containing the topics.
 * @param data the data (host) value to publish in the event
 */
export function publishEvent(topics: Vec, data: Val): void {
    contract_event(topics.getHostObject(), data);
}

/**
 * Lets the host publish a "simple" contract event that has only one topic given as a small symbol.
 * @param topicSymbol the symbol string to be used as a topic. max 9 characters. [_0-9A-Za-z]
 * @param data data (host value) to be published in the event.
 */
export function publishSimpleEvent(topicSymbol: string, data: Val): void {
    let topic = fromSmallSymbolStr(topicSymbol);
    let topics = new Vec();
    topics.pushBack(topic);
    contract_event(topics.getHostObject(), data);
}
