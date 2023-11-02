import { RawVal, BytesObject, VecObject, ErrorVal, AddressObject, U32Val, VoidVal, 
    U64Val, U64Object, I64Object, U128Object, I128Object, U256Object, U256Val, I256Object, 
    I256Val, TimepointObject, DurationObject, MapObject, BoolVal, StorageType, Symbol, SymbolObject, StringObject} from "./value";

/******************
 * HOST FUNCTIONS *
 ******************/


/******************
 * CONTEXT *
 ******************/
// Emit a diagnostic event containing a message and sequence of `Val`s.
// @ts-ignore
@external("x", "_")
export declare function log_from_linear_memory(msg_pos: U32Val, msg_len: U32Val, vals_pos: U32Val, vals_len: U32Val): VoidVal;

// Get the address object of the contract which invoked the running contract. 
// Traps if the running contract was not invoked by a contract.
// @ts-ignore
@external("x", "0")
export declare function get_invoking_contract(): AddressObject;

/// Compare two objects, or at least one object to a non-object, structurally. 
/// Returns -1 if a<b, 1 if a>b, or 0 if a==b.
// @ts-ignore
@external("x", "1")
export declare function obj_cmp(a: RawVal, b: RawVal): i64;

/// Records a contract event. `topics` is expected to be a `SCVec` with
/// length <= 4 that CANNOT contain `Vec`, `Map`, or `Bytes` with length > 32
// @ts-ignore
@external("x", "2")
export declare function contract_event(topics: VecObject, data: RawVal): VoidVal;

/// Return the protocol version of the current ledger as a U32Val.
// @ts-ignore
@external("x", "3")
export declare function get_ledger_version(): U32Val;

/// Return the sequence number of the current ledger as a U32Val.
// @ts-ignore
@external("x", "4")
export declare function get_ledger_sequence(): U32Val;

/// Return the timestamp number of the current ledger as a U64Val.
// @ts-ignore
@external("x", "5")
export declare function get_ledger_timestamp(): U64Val;

/// Returns the full call stack from the first contract call
/// to the current one as a vector (VecObject) of vectors, where the inside
/// vector contains the contract id as Hash, and a function as
/// a Symbol.
// @ts-ignore
@external("x", "6")
export declare function get_current_call_stack(): VecObject;

/// Causes the currently executing contract to fail immediately with a provided error code, 
/// which must be of error-type `ScErrorType::Contract`. Does not actually return.
// @ts-ignore
@external("x", "7")
export declare function fail_with_error(error: ErrorVal): VoidVal;

// Record a debug event. Fmt must be a Bytes. Args must be a
// Vec. Void is returned.
// @ts-ignore
// @external("x", "9")
// declare function host_log_fmt_values(fmt: BytesObject, args: VecObject): VoidVal;

/// Return the network id (sha256 hash of network passphrase) of the current ledger as `Bytes`. The value is always 32 bytes in length.
// @ts-ignore
@external("x", "8")
export declare function get_ledger_network_id(): BytesObject;

/// Get the Address object for the current contract.
// @ts-ignore
@external("x", "9")
export declare function get_current_contract_address(): AddressObject;

/// Returns the max ledger sequence that an entry can live to (inclusive).
// @ts-ignore
@external("x", "a")
export declare function get_max_expiration_ledger(): U32Val;

/******************
 * INT *
 ******************/


/// Convert an u64 to an object containing an u64.
// @ts-ignore
@external("i", "_")
export declare function obj_from_u64(v:u64): U64Object;

/// Convert an object containing an u64 to an u64.
// @ts-ignore
@external("i", "0")
export declare function obj_to_u64(ojb:U64Object): u64;

/// Convert an i64 to an object containing an i64.
// @ts-ignore
@external("i", "1")
export declare function obj_from_i64(v:i64): I64Object;

/// Convert an object containing an i64 to an i64.
// @ts-ignore
@external("i", "2")
export declare function obj_to_i64(ojb:I64Object): i64;

/// Convert the high and low 64-bit words of a u128 to an object containing a u128.
// @ts-ignore
@external("i", "3")
export declare function obj_from_u128_pieces(hi:u64, lo:u64): U128Object;

/// Extract the low 64 bits from an object containing a u128.
// @ts-ignore
@external("i", "4")
export declare function obj_to_u128_lo64(obj:U128Object): u64;

/// Extract the high 64 bits from an object containing a u128.
// @ts-ignore
@external("i", "5")
export declare function obj_to_u128_hi64(obj:U128Object): u64;

/// Convert the high and low 64-bit words of an i128 to an object containing an i128.
// @ts-ignore
@external("i", "6")
export declare function obj_from_i128_pieces(hi:i64, lo:u64): I128Object;

/// Extract the low 64 bits from an object containing an i128.
// @ts-ignore
@external("i", "7")
export declare function obj_to_i128_lo64(obj:I128Object): u64;

/// Extract the high 64 bits from an object containing an i128.
// @ts-ignore
@external("i", "8")
export declare function obj_to_i128_hi64(obj:I128Object): i64;

/// Convert the four 64-bit words of an u256 (big-endian) to an object containing an u256.
// @ts-ignore
@external("i", "9")
export declare function obj_from_u256_pieces(hi_hi:u64, hi_lo:u64, lo_hi:u64, lo_lo:u64): U256Object;

/// Create a U256 `Val` from its representation as a byte array in big endian.
// @ts-ignore
@external("i", "a")
export declare function u256_val_from_be_bytes(bytes:BytesObject): U256Val;

/// Return the memory representation of this U256 `Val` as a byte array in big endian byte order.
// @ts-ignore
@external("i", "b")
export declare function u256_val_to_be_bytes(val:U256Val): BytesObject;

/// Extract the highest 64-bits (bits 192-255) from an object containing an u256.
// @ts-ignore
@external("i", "c")
export declare function obj_to_u256_hi_hi(obj:U256Object): u64;

/// Extract bits 128-191 from an object containing an u256.
// @ts-ignore
@external("i", "d")
export declare function obj_to_u256_hi_lo(obj:U256Object): u64;

/// Extract bits 64-127 from an object containing an u256.
// @ts-ignore
@external("i", "e")
export declare function obj_to_u256_lo_hi(obj:U256Object): u64;

/// Extract the lowest 64-bits (bits 0-63) from an object containing an u256.
// @ts-ignore
@external("i", "f")
export declare function obj_to_u256_lo_lo(obj:U256Object): u64;

/// Convert the four 64-bit words of an i256 (big-endian) to an object containing an i256.
// @ts-ignore
@external("i", "g")
export declare function obj_from_i256_pieces(hi_hi:i64, hi_lo:u64, lo_hi:u64, lo_lo:u64): I256Object;

/// Create a I256 `Val` from its representation as a byte array in big endian.
// @ts-ignore
@external("i", "h")
export declare function i256_val_from_be_bytes(bytes:BytesObject): I256Val;

/// Return the memory representation of this I256 `Val` as a byte array in big endian byte order.
// @ts-ignore
@external("i", "i")
export declare function i256_val_to_be_bytes(val:I256Val): BytesObject;

/// Extract the highest 64-bits (bits 192-255) from an object containing an u256.
// @ts-ignore
@external("i", "j")
export declare function obj_to_i256_hi_hi(obj:U256Object): i64;

/// Extract bits 128-191 from an object containing an u256.
// @ts-ignore
@external("i", "k")
export declare function obj_to_i256_hi_lo(obj:U256Object): u64;

/// Extract bits 64-127 from an object containing an u256.
// @ts-ignore
@external("i", "l")
export declare function obj_to_i256_lo_hi(obj:U256Object): u64;

/// Extract the lowest 64-bits (bits 0-63) from an object containing an u256.
// @ts-ignore
@external("i", "m")
export declare function obj_to_i256_lo_lo(obj:U256Object): u64;

/// Performs checked integer addition. Computes `lhs + rhs`, returning `ScError` if overflow occurred.
// @ts-ignore
@external("i", "n")
export declare function u256_add(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked integer subtraction. Computes `lhs - rhs`, returning `ScError` if overflow occurred.
// @ts-ignore
@external("i", "o")
export declare function u256_sub(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked integer multiplication. Computes `lhs * rhs`, returning `ScError` if overflow occurred. 
// @ts-ignore
@external("i", "p")
export declare function u256_mul(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked integer division. Computes `lhs / rhs`, returning `ScError` if `rhs == 0` or overflow occurred. 
// @ts-ignore
@external("i", "q")
export declare function u256_div(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked exponentiation. Computes `lhs.exp(rhs)`, returning `ScError` if overflow occurred. 
// @ts-ignore
@external("i", "r")
export declare function u256_pow(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked shift left. Computes `lhs << rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "s")
export declare function u256_shl(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked shift right. Computes `lhs >> rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "t")
export declare function u256_shr(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked integer addition. Computes `lhs + rhs`, returning `ScError` if overflow occurred.
// @ts-ignore
@external("i", "u")
export declare function i256_add(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked integer subtraction. Computes `lhs - rhs`, returning `ScError` if overflow occurred. 
// @ts-ignore
@external("i", "v")
export declare function i256_sub(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked integer multiplication. Computes `lhs * rhs`, returning `ScError` if overflow occurred. 
// @ts-ignore
@external("i", "w")
export declare function i256_mul(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked integer division. Computes `lhs / rhs`, returning `ScError` if `rhs == 0` or overflow occurred. 
// @ts-ignore
@external("i", "x")
export declare function i256_div(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked exponentiation. Computes `lhs.exp(rhs)`, returning `ScError` if overflow occurred.
// @ts-ignore
@external("i", "y")
export declare function i256_pow(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked shift left. Computes `lhs << rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "z")
export declare function i256_shl(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked shift right. Computes `lhs >> rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "A")
export declare function i256_shr(lhs:I256Val, rhs: I256Val): I256Val;

/// Convert a `u64` to a `Timepoint` object.
// @ts-ignore
@external("i", "B")
export declare function timepoint_obj_from_u64(v:u64): TimepointObject;

/// Convert a `Timepoint` object to a `u64`.
// @ts-ignore
@external("i", "C")
export declare function timepoint_obj_to_u64(obj:TimepointObject): u64;

/// Convert a `u64` to a `Duration` object.
// @ts-ignore
@external("i", "D")
export declare function duration_obj_from_u64(v:u64): DurationObject;

/// Convert a `Duration` object a `u64`.
// @ts-ignore
@external("i", "E")
export declare function duration_obj_to_u64(obj:DurationObject): u64;


/******************
 * MAP *
 ******************/

/// Create an empty new map.
// @ts-ignore
@external("m", "_")
export declare function map_new(): MapObject;

/// Insert a key/value mapping into an existing map, and return the map object handle.
/// If the map already has a mapping for the given key, the previous value is overwritten.
// @ts-ignore
@external("m", "0")
export declare function map_put(m:MapObject, k:RawVal, v:RawVal): MapObject;

/// Get the value for a key from a map. Traps if key is not found.
// @ts-ignore
@external("m", "1")
export declare function map_get(m:MapObject, k:RawVal): RawVal;

/// Remove a key/value mapping from a map if it exists, traps if doesn't.
// @ts-ignore
@external("m", "2")
export declare function map_del(m:MapObject, k:RawVal): MapObject;

/// Get the size of a map.
// @ts-ignore
@external("m", "3")
export declare function map_len(m:MapObject): U32Val;

/// Test for the presence of a key in a map. Returns BoolVal.
// @ts-ignore
@external("m", "4")
export declare function map_has(m:MapObject, k:RawVal): BoolVal;

/// Get the key from a map at position `i`. If `i` is an invalid position, return ScError.
// @ts-ignore
@external("m", "5")
export declare function map_key_by_pos(m:MapObject, i:U32Val): RawVal;

/// Get the value from a map at position `i`. If `i` is an invalid position, return ScError.
// @ts-ignore
@external("m", "6")
export declare function map_val_by_pos(m:MapObject, i:U32Val): RawVal;

/// Return a new vector containing all the keys in a map.
/// The new vector is ordered in the original map's key-sorted order.
// @ts-ignore
@external("m", "7")
export declare function map_keys(m:MapObject): VecObject;

/// Return a new vector containing all the values in a map.
/// The new vector is ordered in the original map's key-sorted order.
// @ts-ignore
@external("m", "8")
export declare function map_values(m:MapObject): VecObject;

/// Return a new map initialized from a set of input slices given by linear-memory addresses and lengths.
// @ts-ignore
@external("m", "9")
export declare function map_new_from_linear_memory(keys_pos: U32Val, vals_pos :U32Val, len: U32Val): MapObject;

/// Copy the RawVal values of a map, as described by set of input keys, into an array at a given linear-memory address.
// @ts-ignore
@external("m", "a")
export declare function map_unpack_to_linear_memory(map: MapObject, keys_pos: U32Val, vals_pos: U32Val, len: U32Val): VoidVal;


/******************
 * VEC *
 ******************/

/// Creates an empty new vector.
// @ts-ignore
@external("v", "_")
export declare function vec_new(): VecObject;

/// Update the value at index `i` in the vector. Return the new vector.
/// Trap if the index is out of bounds.
// @ts-ignore
@external("v", "0")
export declare function vec_put(v: VecObject, i: U32Val, x: RawVal): VecObject;

/// Returns the element at index `i` of the vector. Traps if the index is out of bound.
// @ts-ignore
@external("v", "1")
export declare function vec_get(v: VecObject, i: U32Val): RawVal;

/// Delete an element in a vector at index `i`, shifting all elements after it to the left.
/// Return the new vector. Traps if the index is out of bound.
// @ts-ignore
@external("v", "2")
export declare function vec_del(v: VecObject, i: U32Val): VecObject;

/// Returns length of the vector.
// @ts-ignore
@external("v", "3")
export declare function vec_len(v: VecObject): U32Val;

/// Push a value to the front of a vector.
// @ts-ignore
@external("v", "4")
export declare function vec_push_front(v: VecObject, x: RawVal): VecObject;

/// Removes the first element from the vector and returns the new vector.
/// Traps if original vector is empty.
// @ts-ignore
@external("v", "5")
export declare function vec_pop_front(v: VecObject): VecObject;

/// Appends an element to the back of the vector.
// @ts-ignore
@external("v", "6")
export declare function vec_push_back(v: VecObject, x: RawVal): VecObject;

/// Removes the last element from the vector and returns the new vector.
/// Traps if original vector is empty.
// @ts-ignore
@external("v", "7")
export declare function vec_pop_back(v: VecObject): VecObject;

/// Return the first element in the vector. Traps if the vector is empty
// @ts-ignore
@external("v", "8")
export declare function vec_front(v: VecObject): RawVal;

/// Return the last element in the vector. Traps if the vector is empty
// @ts-ignore
@external("v", "9")
export declare function vec_back(v: VecObject): RawVal;

/// Inserts an element at index `i` within the vector, shifting all elements after it to the right.
/// Traps if the index is out of bound
// @ts-ignore
@external("v", "a")
export declare function vec_insert(v: VecObject, i: U32Val, x: RawVal): VecObject;

/// Clone the vector `v1`, then moves all the elements of vector `v2` into it.
/// Return the new vector. Traps if number of elements in the vector overflows a u32.
// @ts-ignore
@external("v", "b")
export declare function vec_append(v1: VecObject, v2: VecObject): VecObject;

/// Copy the elements from `start` index until `end` index, exclusive, in the vector and create a new vector from it.
/// Return the new vector. Traps if the index is out of bound.
// @ts-ignore
@external("v", "c")
export declare function vec_slice(v: VecObject, start: U32Val, end: U32Val): VecObject;

/// Get the index of the first occurrence of a given element in the vector.
/// Returns the u32 index of the value if it's there. Otherwise, it returns `ScStatic::Void`.
// @ts-ignore
@external("v", "d")
export declare function vec_first_index_of(v: VecObject, x: RawVal): RawVal;

/// Get the index of the last occurrence of a given element in the vector.
/// Returns the u32 index of the value if it's there. Otherwise, it returns `ScStatic::Void`.
// @ts-ignore
@external("v", "e")
export declare function vec_last_index_of(v: VecObject, x:RawVal): RawVal;

/// Binary search a sorted vector for a given element.
/// If it exists, the high-32 bits of the return value is 0x0001 and the low-32 bits
/// contain the u32 index of the element.
/// If it does not exist, the high-32 bits of the return value is 0x0000 and the low-32 bits
/// contain the u32 index at which the element would need to be inserted into the vector to
/// maintain sorted order.
// @ts-ignore
@external("v", "f")
export declare function vec_binary_search(v: VecObject, x: RawVal): u64;

/// Return a new vec initialized from an input slice of RawVals given by a linear-memory address and length.
// @ts-ignore
@external("v", "g")
export declare function vec_new_from_linear_memory(vals_pos: U32Val, len: U32Val): VecObject;

/// Copy the RawVals of a vec into an array at a given linear-memory address.
// @ts-ignore
@external("v", "h")
export declare function vec_unpack_to_linear_memory(vec: VecObject, vals_pos: U32Val, len: U32Val): VoidVal;


/******************
 * LEDGER *
 ******************/

/// If `f` is `Void`, then there will be no changes to flags for an existing entry, 
/// and none will be set if this is a new entry. Otherwise, `f` is parsed as a `u32`. 
/// If the value is 0, then all flags are cleared. If it's not 0, then flags will 
/// be set to the passed in value.
// @ts-ignore
@external("l", "_")
export declare function put_contract_data(k:RawVal, v:RawVal, t:StorageType): VoidVal;

// @ts-ignore
@external("l", "0")
export declare function has_contract_data(k:RawVal, t:StorageType): BoolVal;

// @ts-ignore
@external("l", "1")
export declare function get_contract_data(k:RawVal, t:StorageType): RawVal;

// @ts-ignore
@external("l", "2")
export declare function del_contract_data(k:RawVal, t:StorageType): VoidVal;

/// Creates the contract instance on behalf of `deployer`. 
/// `deployer` must authorize this call via Soroban auth framework, i.e. this calls `deployer.require_auth` with respective arguments. 
/// `wasm_hash` must be a hash of the contract code that has already been uploaded on this network. 
/// `salt` is used to create a unique contract id. Returns the address of the created contract.
// @ts-ignore
@external("l", "3")
export declare function create_contract(deployer:AddressObject, wasm_hash: BytesObject, salt:BytesObject): AddressObject;

/// Creates the instance of Stellar Asset contract corresponding to the provided asset. 
/// `serialized_asset` is `stellar::Asset` XDR serialized to bytes format. 
/// Returns the address of the created contract.
// @ts-ignore
@external("l", "4")
export declare function create_asset_contract(serialized_asset:BytesObject): AddressObject;

/// Uploads provided `wasm` bytecode to the network and returns its identifier (SHA-256 hash). 
/// No-op in case if the same Wasm object already exists.
// @ts-ignore
@external("l", "5")
export declare function upload_wasm(wasm:BytesObject): BytesObject;

/// Replaces the executable of the current contract with the provided Wasm code identified by a hash. 
/// Wasm entry corresponding to the hash has to already be present in the ledger. 
/// The update happens only after the current contract invocation has successfully finished, 
/// so this can be safely called in the middle of a function.
// @ts-ignore
@external("l", "6")
export declare function update_current_contract_wasm(hash:BytesObject): VoidVal;

/// If the entry expiration is below `low_expiration_watermark` ledgers from the current ledger (inclusive), 
/// then bump the expiration to be `high_expiration_watermark` from the current ledger (inclusive)"
// @ts-ignore
@external("l", "7")
export declare function bump_contract_data(k:RawVal, t:StorageType, low_expiration_watermark: U32Val, high_expiration_watermark:U32Val): VoidVal;

/// If expiration for the current contract instance and code (if applicable) is below `low_expiration_watermark` 
/// ledgers from the current ledger (inclusive), then bump the expiration to be `high_expiration_watermark` 
/// from the current ledger (inclusive)
// @ts-ignore
@external("l", "8")
export declare function bump_current_contract_instance_and_code(low_expiration_watermark: U32Val, high_expiration_watermark:U32Val): VoidVal;

/// If expiration of the provided contract instance and code (if applicable) is below `low_expiration_watermark` 
/// ledgers from the current ledger (inclusive), then bump the expiration to be `high_expiration_watermark` 
/// from the current ledger (inclusive)
// @ts-ignore
@external("l", "9")
export declare function bump_contract_instance_and_code(contract:AddressObject, low_expiration_watermark: U32Val, high_expiration_watermark:U32Val): VoidVal;

/// Get the id of a contract without creating it. `deployer` is address of the contract deployer. 
/// `salt` is used to create a unique contract id. Returns the address of the would-be contract.
// @ts-ignore
@external("l", "a")
export declare function get_contract_id(deployer: AddressObject, salt: BytesObject): AddressObject;

/// Get the id of the Stellar Asset contract corresponding to the provided asset without creating the instance. 
/// `serialized_asset` is `stellar::Asset` XDR serialized to bytes format. Returns the address of the would-be asset contract.
// @ts-ignore
@external("l", "b")
export declare function get_asset_contract_id(serialized_asset: BytesObject): AddressObject;

/******************
 * CALL *
 ******************/

/// Calls a function in another contract with arguments contained in vector `args`.
/// If the call is successful, forwards the result of the called function. Traps otherwise.
// @ts-ignore
@external("d", "_")
export declare function call(contract: AddressObject, func: Symbol, args: VecObject): RawVal;

/// Calls a function in another contract with arguments contained in vector `args`. Returns:
/// - if successful, result of the called function.
/// - otherwise, an `ScError` if the called function failed.
// @ts-ignore
@external("d", "0")
export declare function try_call(contract: AddressObject, func: Symbol, args: VecObject): RawVal;



/*****************
* BUFF *
******************/

/// Serializes an (SC)Val into XDR opaque `Bytes` object.
// @ts-ignore
@external("b", "_")
export declare function serialize_to_bytes(v:RawVal): BytesObject;

/// Deserialize a `Bytes` object to get back the (SC)Val.
// @ts-ignore
@external("b", "0")
export declare function deserialize_from_bytes(b:BytesObject): RawVal;

/// Copies a slice of bytes from a `Bytes` object specified at offset `b_pos` with
/// length `len` into the linear memory at position `lm_pos`.
/// Traps if either the `Bytes` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "1")
export declare function bytes_copy_to_linear_memory(b:BytesObject, b_pos:U32Val, lm_pos:U32Val, len:U32Val): RawVal;

/// Copies a segment of the linear memory specified at position `lm_pos` with
/// length `len`, into a `Bytes` object at offset `b_pos`. The `Bytes` object may
/// grow in size to accommodate the new bytes.
/// Traps if the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "2")
export declare function bytes_copy_from_linear_memory(b:BytesObject, b_pos:U32Val, lm_pos:U32Val, len:U32Val): BytesObject;

/// Constructs a new `Bytes` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
// @ts-ignore
@external("b", "3")
export declare function bytes_new_from_linear_memory(lm_pos:U32Val, len:U32Val): BytesObject;

/// Create an empty new `Bytes` object.
// @ts-ignore
@external("b", "4")
export declare function bytes_new(): BytesObject;

/// Update the value at index `i` in the `Bytes` object. Return the new `Bytes`.
/// Trap if the index is out of bounds.
// @ts-ignore
@external("b", "5")
export declare function bytes_put(v:BytesObject, i:U32Val, u:U32Val): BytesObject;

/// Returns the element at index `i` of the `Bytes` object. Traps if the index is out of bound.
// @ts-ignore
@external("b", "6")
export declare function bytes_get(b:BytesObject, i:U32Val): U32Val;

/// Delete an element in a `Bytes` object at index `i`, shifting all elements after it to the left.
/// Return the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "7")
export declare function bytes_del(v:BytesObject, i:U32Val): BytesObject;

/// Returns length of the `Bytes` object.
// @ts-ignore
@external("b", "8")
export declare function bytes_len(v:BytesObject): U32Val;

/// Appends an element to the back of the `Bytes` object.
// @ts-ignore
@external("b", "9")
export declare function bytes_push(v:BytesObject, u:RawVal): BytesObject;

/// Removes the last element from the `Bytes` object and returns the new `Bytes`.
/// Traps if original `Bytes` is empty.
// @ts-ignore
@external("b", "a")
export declare function bytes_pop(b:BytesObject): BytesObject;

/// Return the first element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "b")
export declare function bytes_front(b:BytesObject): U32Val;

/// Return the last element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "c")
export declare function bytes_back(v:BytesObject): U32Val;

/// Inserts an element at index `i` within the `Bytes` object, shifting all elements after it to the right.
/// Traps if the index is out of bound
// @ts-ignore
@external("b", "d")
export declare function bytes_insert(v:BytesObject, i:U32Val, u:U32Val): BytesObject;

/// Clone the `Bytes` object `b1`, then moves all the elements of `Bytes` object `b2` into it.
/// Return the new `Bytes`. Traps if its length overflows a u32.
// @ts-ignore
@external("b", "e")
export declare function bytes_append(b1:BytesObject, b2:BytesObject): BytesObject;

/// Copies the elements from `start` index until `end` index, exclusive, in the `Bytes` object and creates a new `Bytes` from it.
/// Returns the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "f")
export declare function bytes_slice(b:BytesObject, start:U32Val, end:U32Val): BytesObject;

/********
* CRYPTO *
*********/

// @ts-ignore
@external("c", "_")
export declare function compute_hash_sha256(x:BytesObject): BytesObject;

// @ts-ignore
@external("c", "0")
export declare function verify_sig_ed25519(k:BytesObject, x:BytesObject, s:BytesObject): VoidVal;

/// Returns the keccak256 hash of given input bytes
// @ts-ignore
@external("c", "1")
export declare function compute_hash_keccak256(x:BytesObject): BytesObject;

/// Recovers the SEC-1-encoded ECDSA secp256k1 public key that produced a given 64-byte signature over a given 32-byte message digest, for a given recovery_id byte.
// @ts-ignore
@external("c", "2")
export declare function recover_key_ecdsa_secp256k1(msg_digest:BytesObject, signature: BytesObject, recovery_id: U32Val): BytesObject;

/******************
 * ADDRESS *
 ******************/

/// Checks if the address has authorized the invocation of the 
/// current contract function with the provided arguments. 
/// Traps if the invocation hasn't been authorized.
// @ts-ignore
@external("a", "_")
export declare function require_auth_for_args(address: AddressObject, args:VecObject): VoidVal;


/// Checks if the address has authorized the invocation of the 
/// current contract function with all the arguments of the invocation.
/// Traps if the invocation hasn't been authorized.
// @ts-ignore
@external("a", "0")
export declare function require_auth(address: AddressObject): RawVal;

/// Converts a provided 32-byte Stellar account public key to the corresponding address. 
/// This is only useful in the context of cross-chain interoperability. 
/// Prefer directly using the Address objects whenever possible.
// @ts-ignore
@external("a", "1")
export declare function account_public_key_to_address(pk_bytes: BytesObject): AddressObject;

/// Converts a provided 32-byte contract identifier to a corresponding Address object.
// @ts-ignore
@external("a", "2")
export declare function contract_id_to_address(contract_id_bytes: BytesObject): AddressObject;

/// Returns the 32-byte public key of the Stellar account corresponding to the provided Address object. 
/// If the Address doesn't belong to an account, returns RawVal corresponding to the unit type (`()`).
// @ts-ignore
@external("a", "3")
export declare function address_to_account_public_key(address: AddressObject): RawVal;

/// Returns the 32-byte contract identifier corresponding to the provided Address object. 
// If the Address doesn't belong to a contract, returns RawVal corresponding to the unit type (`()`).
// @ts-ignore
@external("a", "4")
export declare function address_to_contract_id(address: AddressObject): RawVal;

/// Authorizes sub-contract calls for the next contract call on behalf of the current contract. 
/// Every entry in the argument vector corresponds to `InvokerContractAuthEntry` contract type that 
/// authorizes a tree of `require_auth` calls on behalf of the current contract. The entries must not
/// contain any authorizations for the direct contract call, i.e. if current contract needs to 
/// call contract function F1 that calls function F2 both of which require auth, only F2 should be present in `auth_entries`.
// @ts-ignore
@external("a", "5")
export declare function authorize_as_curr_contract(auth_entires: VecObject): VoidVal;


/*****************
* SYMBOLS *
******************/


/// Copies a slice of bytes from a `Symbol` object specified at offset `s_pos` with length `len` into the linear memory at position `lm_pos`. 
/// Traps if either the `Symbol` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "h")
export declare function symbol_copy_to_linear_memory(s:SymbolObject, s_pos:U32Val, lm_pos:U32Val, len:U32Val): VoidVal;

/// Constructs a new `Symbol` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
// @ts-ignore
@external("b", "j")
export declare function symbol_new_from_linear_memory(lm_pos:U32Val, len:U32Val): SymbolObject;


/// Returns length of the `Symbol` object.
// @ts-ignore
@external("b", "l")
export declare function symbol_len(s:SymbolObject): U32Val;

/// Return the index of a Symbol in an array of linear-memory byte-slices, or trap if not found.
// @ts-ignore
@external("b", "m")
export declare function symbol_index_in_linear_memory(s:SymbolObject, slices_pos: U32Val, len:U32Val): U32Val;


/*****************
* STRINGS *
******************/

/// Copies a slice of bytes from a `String` object specified at offset `s_pos` with length `len` into the linear memory at position `lm_pos`.
/// Traps if either the `String` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "g")
export declare function string_copy_to_linear_memory(s:StringObject, s_pos:U32Val, lm_pos:U32Val, len:U32Val): VoidVal;

/// Constructs a new `String` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
// @ts-ignore
@external("b", "i")
export declare function string_new_from_linear_memory(lm_pos:U32Val, len:U32Val): StringObject;

/// Returns length of the `String` object.
// @ts-ignore
@external("b", "k")
export declare function string_len(s:StringObject): U32Val;

/******************
 * TEST *
 ******************/

/// A dummy function taking 0 arguments and performs no-op.
/// This function is for test purpose only, for measuring the 
/// roundtrip cost of invoking a host function, i.e. host->Vm->host. 
// @ts-ignore
@external("t", "_")
export declare function dummy0(): RawVal;


/******************
 * PRNG *
 ******************/

/// Reseed the frame-local PRNG with a given BytesObject, which should be 32 bytes long.
// @ts-ignore
@external("p", "_")
export declare function prng_reseed(seed:BytesObject): VoidVal;

/// Construct a new BytesObject of the given length filled with bytes drawn from the frame-local PRNG.
// @ts-ignore
@external("p", "0")
export declare function prng_bytes_new(length:U32Val): BytesObject;

/// Return a u64 uniformly sampled from the inclusive range [lo,hi] by the frame-local PRNG.
// @ts-ignore
@external("p", "1")
export declare function prng_u64_in_inclusive_range(lo:u64, hi:u64): u64;

/// Return a (Fisher-Yates) shuffled clone of a given vector, using the frame-local PRNG.
// @ts-ignore
@external("p", "2")
export declare function prng_vec_shuffle(vec:VecObject): VecObject;