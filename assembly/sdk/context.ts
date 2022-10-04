
import { RawVal, BinaryObject, Unsigned64BitIntObject, Signed64BitIntObject,
     VectorObject, AccountIDObject, toU32, toU64, toI64, StatusObject } from "./host_value";


/**
* TODO
* @param value the value to log
*/
export function log(value: RawVal): void {
    host_log_value(value);
}

/**
 * Returns the contractID `Bytes` of the contract which invoked the
 * running contract. Traps if the running contract was not
 * invoked by a contract.
 * @returns the invoking contractID Bytes as BinaryObject
 */
export function invoking_contract(): BinaryObject {
    return get_invoking_contract();
}

/**
* Returns the current contractID `Bytes` of the running contract.
* @returns current contractID `Bytes` of the running contract  (Type: BinaryObject)
*/
export function current_contract(): BinaryObject {
    return get_current_contract();
}

/**
 * Compares to values as described here: https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046.md#comparison
 * @param val1 first value to compare
 * @param val2 second value to compare
 * @returns result? TBD (Type i64)
 */
export function compare(val1: RawVal, val2: RawVal): i64 {
    return toI64(obj_cmp(val1, val2));
}

/**
 * Return the protocol version of the current ledger as a u32.
 * @returns protocol version of the current ledger as a u32.
 */
export function ledger_version(): u32 {
    return toU32(get_ledger_version());
}

/**
 * Return the sequence number of the current ledger as a u32.
 * @returns sequence number of the current ledger as a u32.
 */
 export function ledger_sequence(): u32 {
    return toU32(get_ledger_sequence());
}

export function ledger_timestamp(): u64 {
    return toU64(get_ledger_timestamp());
}

/**
 * Return the network passphrase of the current ledger as `Bytes`.
 * @returns Return the network passphrase of the current ledger as `Bytes` (type:  BinaryObject)
 */
export function ledger_network_passphrase(): BinaryObject {
    return get_ledger_network_passphrase();
}

/**
 * Returns the full call stack from the first contract call
 * to the current one as a vector of vectors, where the inside
 * vector contains the contract id as Hash, and a function as
 * a Symbol.
 * @returns the full call stack (type: VectorObject)
 */
export function current_call_stack(): VectorObject {
    return get_current_call_stack();
}

/**
 * Causes the currently executing contract to fail immediately.
 */
export function fail() : void {
    // TODO fail_with_status
}

/**
 * Record a debug event. Fmt must be a Bytes. Args must be a Vec.
 * @param fmt values (Type: BinaryObject)
 * @param args arguments ()
 */
export function log_fmt_values(fmt: BinaryObject, args: VectorObject) : void {
    host_log_fmt_values(fmt, args);
}

/**
 * Returns whether the contract invocation is from an account or another contract.
 * @returns 0 for account, 1 for contract.
 */
export function invoker_type(): u64 {
    return toU64(get_invoker_type());
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
declare function get_invoking_contract(): BinaryObject;

// @ts-ignore
@external("x", "1")
export declare function obj_cmp(a: RawVal, b: RawVal): Signed64BitIntObject;

/// Records a contract event. `topics` is expected to be a `SCVec` with
/// length <= 4 that cannot contain `Vec`, `Map`, or `Bytes` with length > 32
/// On success, returns an `SCStatus::Ok`.
// @ts-ignore
@external("x", "2")
export declare function contract_event(topics: VectorObject, data: RawVal): RawVal;

/// Get the contractID `Bytes` of the contract which invoked the
/// running contract. Traps if the running contract was not
/// invoked by a contract.
// @ts-ignore
@external("x", "3")
export declare function get_current_contract(): BinaryObject;

/// Return the protocol version of the current ledger as a u32.
// @ts-ignore
@external("x", "4")
declare function get_ledger_version(): RawVal;

/// Return the sequence number of the current ledger as a u32.
// @ts-ignore
@external("x", "5")
export declare function get_ledger_sequence(): RawVal;

/// Return the timestamp number of the current ledger as a u64.
// @ts-ignore
@external("x", "6")
declare function get_ledger_timestamp(): Unsigned64BitIntObject;

/// Return the network passphrase of the current ledger as `Bytes`.
// @ts-ignore
@external("x", "7")
declare function get_ledger_network_passphrase(): BinaryObject;

/// Returns the full call stack from the first contract call
/// to the current one as a vector of vectors, where the inside
/// vector contains the contract id as Hash, and a function as
/// a Symbol.
// @ts-ignore
@external("x", "8")
declare function get_current_call_stack(): VectorObject;

/// Causes the currently executing contract to fail immediately
/// with a provided status code, which must be of error-type
/// `ScStatusType::ContractError`. Does not actually return.
// @ts-ignore
@external("x", "9")
declare function fail_with_status(status: StatusObject): RawVal;

// Record a debug event. Fmt must be a Bytes. Args must be a
// Vec. Void is returned.
// @ts-ignore
@external("x", "a")
declare function host_log_fmt_values(fmt: BinaryObject, args: VectorObject): RawVal;

/// Get whether the contract invocation is from an account or
/// another contract. Returns 0 for account, 1 for contract.
// @ts-ignore
@external("x", "b")
declare function get_invoker_type(): Unsigned64BitIntObject;


/// Get the AccountID object type of the account which invoked
/// the running contract. Traps if the running contract was not
/// invoked by an account.
// @ts-ignore
@external("x", "c")
declare function get_invoking_account(): AccountIDObject;