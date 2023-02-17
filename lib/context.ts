
import { Bytes } from "./bytes";
import { RawVal, BytesObject, Unsigned64BitIntObject,
     VectorObject, toU32, toU64, StatusVal, contractError, fromSymbolStr, AddressObject } from "./value";
import { Vec } from "./vec";


/**
 * Log a formated message. Builds a string from the format string, and a list of arguments. 
 * Arguments are substituted wherever the {} value appears in the format string. 
 * @param msg the format string. E.g. "Hello {}".
 * @param args The arguments as values in the Vector.
 */
export function logFtm(msg: string, args:Vec): void {
    let b = Bytes.fromString(msg);
    host_log_fmt_values(b.getHostObject(), args.getHostObject());
}

/**
* Log string during execution on host. Good for debugging.
* @param msg the message to log
*/
export function logStr(msg: string): void {
    let b = Bytes.fromString(msg);
    let args = new Vec();
    host_log_fmt_values(b.getHostObject(), args.getHostObject());
}

/**
* Log value during execution on host. Good for debugging.
* @param value the value to log
*/
export function logValue(value: RawVal): void {
    host_log_value(value);
}

/**
 * Returns whether the contract invocation is from an account or another contract.
 * @returns 0 for account, 1 for contract.
 */
 export function getInvokerType(): u64 {
    return get_invoker_type();
}

/**
 * Returns the address `Object` which invoked the
 * running contract.
 * @returns the invoking address as AddressObject
 */
export function getCurrentContractAddress(): AddressObject {
    return get_current_contract_address();
}

/**
 * Returns the contractID `Bytes` of the contract which invoked the
 * running contract. Traps if the running contract was not
 * invoked by a contract.
 * @returns the invoking contractID Bytes as BytesObject
 */
export function getInvokingContract(): BytesObject {
    return get_invoking_contract();
}

/**
* Returns the current contractID `Bytes` of the running contract.
* @returns current contractID `Bytes` of the running contract  (Type: BytesObject)
*/
export function getCurrentContractID(): BytesObject {
    return get_current_contract_id();
}

/**
 * Compares to values as described here: https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046.md#comparison
 * @param val1 first value to compare
 * @param val2 second value to compare
 * @returns result  -1  if val1 < val2, 0  if val1 == val2, 1  if val1 > val2,
 */
export function compare(val1: RawVal, val2: RawVal): i64 {
    return obj_cmp(val1, val2);
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

export function getLedgerTimestamp(): u64 {
    return toU64(get_ledger_timestamp());
}

/**
 * Return the network id (sha256 hash of network passphrase) of the current ledger as `Bytes`. The value is always 32 bytes in length.
 * @returns Return the network id of the current ledger as `Bytes` (type:  BytesObject)
 */
export function getLedgerNetworkId(): BytesObject {
    return get_ledger_network_id();
}

/**
 * Returns the full call stack from the first contract call
 * to the current one as a vector of vectors, where the inside
 * vector contains the contract id as Hash, and a function as
 * a Symbol.
 * @returns the full call stack (type: VectorObject)
 */
export function getCurrentCallStack(): VectorObject {
    return get_current_call_stack();
}

/**
 * Causes the currently executing contract to fail immediately.
 * It traps with with contract error status code and error code 0
 */
export function fail() : void {
    fail_with_status(contractError(0));
}

/**
 * Causes the currently executing contract to fail immediately.
 * It traps with with contract error status code and error code as given by parameter.
 * @param errCode the error code to use.
 */
export function failWithErrorCode(errCode: u32) : void {
    fail_with_status(contractError(errCode));
}

/**
 * Lets the host publish a contract event. 
 * `topics` is expected to be a `Vec` with length <= 4 that CANNOT contain `Vec`, `Map`, or `Bytes` with length > 32
 * Returns nothing on success, and panics on failure
 * @param topics the vector containing the topics.
 * @param data the data value to publish in the event
 */
export function publishEvent(topics: Vec, data: RawVal): void {
    contract_event(topics.getHostObject(), data);
}

/**
 * Lets the host publish a "simple" contract event that has only one topic given as a symbol.
 * @param topicSymbol the symbol string to be used as a topic. max 10 characters. [_0-9A-Za-z]
 * @param data datat to be published in the event.
 */
export function publishSimpleEvent(topicSymbol: string, data: RawVal): void {
    let topic = fromSymbolStr(topicSymbol);
    let topics = new Vec();
    topics.pushBack(topic);
    contract_event(topics.getHostObject(), data);
}

/******************
 * HOST FUNCTIONS *
 ******************/

// This one variant of logging does not take a format string and
// is live in both Env=Guest and Env=Host configurations.
// @ts-ignore
@external("x", "_")
declare function host_log_value(v: RawVal): RawVal;

/// Get the contractID `Bytes` of the contract which invoked the
/// running contract. Traps if the running contract was not
/// invoked by a contract.
// @ts-ignore
@external("x", "0")
declare function get_invoking_contract(): BytesObject;

// @ts-ignore
@external("x", "1")
declare function obj_cmp(a: RawVal, b: RawVal): i64;

/// Records a contract event. `topics` is expected to be a `SCVec` with
/// length <= 4 that CANNOT contain `Vec`, `Map`, or `Bytes` with length > 32
/// On success, returns an `SCStatus::Ok`
// @ts-ignore
@external("x", "2")
declare function contract_event(topics: VectorObject, data: RawVal): StatusVal;

/// Gets the 32-byte identifer of the current contract.
/// Traps if the running contract was notinvoked by a contract.
// @ts-ignore
@external("x", "3")
declare function get_current_contract_id(): BytesObject;

/// Return the protocol version of the current ledger as a u32.
// @ts-ignore
@external("x", "4")
declare function get_ledger_version(): RawVal;

/// Return the sequence number of the current ledger as a u32.
// @ts-ignore
@external("x", "5")
declare function get_ledger_sequence(): RawVal;

/// Return the timestamp number of the current ledger as a u64.
// @ts-ignore
@external("x", "6")
declare function get_ledger_timestamp(): Unsigned64BitIntObject;

/// Returns the full call stack from the first contract call
/// to the current one as a vector of vectors, where the inside
/// vector contains the contract id as Hash, and a function as
/// a Symbol.
// @ts-ignore
@external("x", "7")
declare function get_current_call_stack(): VectorObject;

/// Causes the currently executing contract to fail immediately
/// with a provided status code, which must be of error-type
/// `ScStatusType::ContractError`. Does not actually return.
// @ts-ignore
@external("x", "8")
declare function fail_with_status(status: StatusVal): RawVal;

// Record a debug event. Fmt must be a Bytes. Args must be a
// Vec. Void is returned.
// @ts-ignore
@external("x", "9")
declare function host_log_fmt_values(fmt: BytesObject, args: VectorObject): RawVal;

/// Get whether the contract invocation is from an account or
/// another contract. Returns 0 for account, 1 for contract.
// @ts-ignore
@external("x", "a")
declare function get_invoker_type(): u64;

/// Return the network id (sha256 hash of network passphrase) of the current ledger as `Bytes`. The value is always 32 bytes in length.
// @ts-ignore
@external("x", "c")
declare function get_ledger_network_id(): BytesObject;

/// Get the Address object for the current contract.
// @ts-ignore
@external("x", "d")
declare function get_current_contract_address(): AddressObject;
