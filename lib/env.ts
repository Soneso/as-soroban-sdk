import { Val, BytesObject, VecObject, ErrorVal, AddressObject, MuxedAddressObject, U32Val, VoidVal, 
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

/// Compare two objects, or at least one object to a non-object, structurally. 
/// Returns -1 if a<b, 1 if a>b, or 0 if a==b.
// @ts-ignore
@external("x", "0")
export declare function obj_cmp(a: Val, b: Val): i64;

/// Records a contract event. `topics` is expected to be a `SCVec` with
/// length <= 4 that cannot contain `Vec`, `Map`, or `Bytes` with length > 32
// @ts-ignore
@external("x", "1")
export declare function contract_event(topics: VecObject, data: Val): VoidVal;

/// Return the protocol version of the current ledger as a U32Val.
// @ts-ignore
@external("x", "2")
export declare function get_ledger_version(): U32Val;

/// Return the sequence number of the current ledger as a U32Val.
// @ts-ignore
@external("x", "3")
export declare function get_ledger_sequence(): U32Val;

/// Return the timestamp number of the current ledger as a U64Val.
// @ts-ignore
@external("x", "4")
export declare function get_ledger_timestamp(): U64Val;

/// Causes the currently executing contract to fail immediately with a provided error code, 
/// which must be of error-type `ScErrorType::Contract`. Does not actually return.
// @ts-ignore
@external("x", "5")
export declare function fail_with_error(error: ErrorVal): VoidVal;

/// Return the network id (sha256 hash of network passphrase) of the current ledger as `Bytes`. The value is always 32 bytes in length.
// @ts-ignore
@external("x", "6")
export declare function get_ledger_network_id(): BytesObject;

/// Get the Address object for the current contract.
// @ts-ignore
@external("x", "7")
export declare function get_current_contract_address(): AddressObject;

/// Returns the max ledger sequence that an entry can live to (inclusive).
// @ts-ignore
@external("x", "8")
export declare function get_max_live_until_ledger(): U32Val;

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

/// Performs checked Euclidean modulo. Computes `lhs % rhs`, returning `ScError` if `rhs == 0` or overflow occurred.. 
// @ts-ignore
@external("i", "r")
export declare function u256_rem_euclid(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked exponentiation. Computes `lhs.exp(rhs)`, returning `ScError` if overflow occurred. 
// @ts-ignore
@external("i", "s")
export declare function u256_pow(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked shift left. Computes `lhs << rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "t")
export declare function u256_shl(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked shift right. Computes `lhs >> rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "u")
export declare function u256_shr(lhs:U256Val, rhs: U256Val): U256Val;

/// Performs checked integer addition. Computes `lhs + rhs`, returning `ScError` if overflow occurred.
// @ts-ignore
@external("i", "v")
export declare function i256_add(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked integer subtraction. Computes `lhs - rhs`, returning `ScError` if overflow occurred. 
// @ts-ignore
@external("i", "w")
export declare function i256_sub(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked integer multiplication. Computes `lhs * rhs`, returning `ScError` if overflow occurred. 
// @ts-ignore
@external("i", "x")
export declare function i256_mul(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked integer division. Computes `lhs / rhs`, returning `ScError` if `rhs == 0` or overflow occurred. 
// @ts-ignore
@external("i", "y")
export declare function i256_div(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked Euclidean modulo. Computes `lhs % rhs`, returning `ScError` if `rhs == 0` or overflow occurred. 
// @ts-ignore
@external("i", "z")
export declare function i256_rem_euclid(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked exponentiation. Computes `lhs.exp(rhs)`, returning `ScError` if overflow occurred.
// @ts-ignore
@external("i", "A")
export declare function i256_pow(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked shift left. Computes `lhs << rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "B")
export declare function i256_shl(lhs:I256Val, rhs: I256Val): I256Val;

/// Performs checked shift right. Computes `lhs >> rhs`, returning `ScError` if `rhs` is larger than or equal to the number of bits in `lhs`.
// @ts-ignore
@external("i", "C")
export declare function i256_shr(lhs:I256Val, rhs: I256Val): I256Val;

/// Convert a `u64` to a `Timepoint` object.
// @ts-ignore
@external("i", "D")
export declare function timepoint_obj_from_u64(v:u64): TimepointObject;

/// Convert a `Timepoint` object to a `u64`.
// @ts-ignore
@external("i", "E")
export declare function timepoint_obj_to_u64(obj:TimepointObject): u64;

/// Convert a `u64` to a `Duration` object.
// @ts-ignore
@external("i", "F")
export declare function duration_obj_from_u64(v:u64): DurationObject;

/// Convert a `Duration` object a `u64`.
// @ts-ignore
@external("i", "G")
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
export declare function map_put(m:MapObject, k:Val, v:Val): MapObject;

/// Get the value for a key from a map. Traps if key is not found.
// @ts-ignore
@external("m", "1")
export declare function map_get(m:MapObject, k:Val): Val;

/// Remove a key/value mapping from a map if it exists, traps if doesn't.
// @ts-ignore
@external("m", "2")
export declare function map_del(m:MapObject, k:Val): MapObject;

/// Get the size of a map.
// @ts-ignore
@external("m", "3")
export declare function map_len(m:MapObject): U32Val;

/// Test for the presence of a key in a map. Returns BoolVal.
// @ts-ignore
@external("m", "4")
export declare function map_has(m:MapObject, k:Val): BoolVal;

/// Get the key from a map at position `i`. If `i` is an invalid position, return ScError.
// @ts-ignore
@external("m", "5")
export declare function map_key_by_pos(m:MapObject, i:U32Val): Val;

/// Get the value from a map at position `i`. If `i` is an invalid position, return ScError.
// @ts-ignore
@external("m", "6")
export declare function map_val_by_pos(m:MapObject, i:U32Val): Val;

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

/// Return a new map initialized from a pair of equal-length arrays, 
/// one for keys and one for values, given by a pair of linear-memory 
/// addresses and a length in Vals.
// @ts-ignore
@external("m", "9")
export declare function map_new_from_linear_memory(keys_pos: U32Val, vals_pos :U32Val, len: U32Val): MapObject;

/// Copy Vals from `map` to the array `vals_pos`, selecting only the keys
/// identified by the array `keys_pos`. Both arrays have `len` elements 
/// and are identified by linear-memory addresses.
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
export declare function vec_put(v: VecObject, i: U32Val, x: Val): VecObject;

/// Returns the element at index `i` of the vector. Traps if the index is out of bound.
// @ts-ignore
@external("v", "1")
export declare function vec_get(v: VecObject, i: U32Val): Val;

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
export declare function vec_push_front(v: VecObject, x: Val): VecObject;

/// Removes the first element from the vector and returns the new vector.
/// Traps if original vector is empty.
// @ts-ignore
@external("v", "5")
export declare function vec_pop_front(v: VecObject): VecObject;

/// Appends an element to the back of the vector.
// @ts-ignore
@external("v", "6")
export declare function vec_push_back(v: VecObject, x: Val): VecObject;

/// Removes the last element from the vector and returns the new vector.
/// Traps if original vector is empty.
// @ts-ignore
@external("v", "7")
export declare function vec_pop_back(v: VecObject): VecObject;

/// Return the first element in the vector. Traps if the vector is empty
// @ts-ignore
@external("v", "8")
export declare function vec_front(v: VecObject): Val;

/// Return the last element in the vector. Traps if the vector is empty
// @ts-ignore
@external("v", "9")
export declare function vec_back(v: VecObject): Val;

/// Inserts an element at index `i` within the vector, shifting all elements after it to the right.
/// Traps if the index is out of bound
// @ts-ignore
@external("v", "a")
export declare function vec_insert(v: VecObject, i: U32Val, x: Val): VecObject;

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
export declare function vec_first_index_of(v: VecObject, x: Val): Val;

/// Get the index of the last occurrence of a given element in the vector.
/// Returns the u32 index of the value if it's there. Otherwise, it returns `ScStatic::Void`.
// @ts-ignore
@external("v", "e")
export declare function vec_last_index_of(v: VecObject, x:Val): Val;

/// Binary search a sorted vector for a given element.
/// If it exists, the high 32 bits of the return value is 0x0000_0001 and the low 32 bits
/// contain the u32 index of the element.
/// If it does not exist, the high-32 bits of the return value is 0x0000_0000 and the low 32 bits
/// contain the u32 index at which the element would need to be inserted into the vector to
/// maintain sorted order.
// @ts-ignore
@external("v", "f")
export declare function vec_binary_search(v: VecObject, x: Val): u64;

/// Return a new vec initialized from an input slice of Vals given by a linear-memory address and length in Vals.
// @ts-ignore
@external("v", "g")
export declare function vec_new_from_linear_memory(vals_pos: U32Val, len: U32Val): VecObject;

/// Copy the Vals of a vec into an array at a given linear-memory address and length in Vals.
// @ts-ignore
@external("v", "h")
export declare function vec_unpack_to_linear_memory(vec: VecObject, vals_pos: U32Val, len: U32Val): VoidVal;


/******************
 * LEDGER *
 ******************/

// @ts-ignore
@external("l", "_")
export declare function put_contract_data(k:Val, v:Val, t:StorageType): VoidVal;

// @ts-ignore
@external("l", "0")
export declare function has_contract_data(k:Val, t:StorageType): BoolVal;

// @ts-ignore
@external("l", "1")
export declare function get_contract_data(k:Val, t:StorageType): Val;

// @ts-ignore
@external("l", "2")
export declare function del_contract_data(k:Val, t:StorageType): VoidVal;

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

/// If the entry's TTL is below `threshold` ledgers, 
/// extend `live_until_ledger_seq` such that TTL == `extend_to`, 
/// where TTL is defined as live_until_ledger_seq - current ledger"
// @ts-ignore
@external("l", "7")
export declare function extend_contract_data_ttl(k:Val, t:StorageType, threshold: U32Val, extend_to:U32Val): VoidVal;

/// If the TTL for the current contract instance and code (if applicable) is below `threshold` ledgers, 
/// extend `live_until_ledger_seq` such that TTL == `extend_to`, 
/// where TTL is defined as live_until_ledger_seq - current ledger
// @ts-ignore
@external("l", "8")
export declare function extend_current_contract_instance_and_code_ttl(threshold: U32Val, extend_to:U32Val): VoidVal;

/// If the TTL for the provided contract instance and code (if applicable) is below `threshold` ledgers, 
/// extend `live_until_ledger_seq` such that TTL == `extend_to`, 
/// where TTL is defined as live_until_ledger_seq - current ledger
// @ts-ignore
@external("l", "9")
export declare function extend_contract_instance_and_code_ttl(contract:AddressObject, threshold: U32Val, extend_to:U32Val): VoidVal;

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

// If the TTL for the provided contract instance is below `threshold` ledgers, extend `live_until_ledger_seq` 
// such that TTL == `extend_to`, where TTL is defined as live_until_ledger_seq - current ledger. 
// If attempting to extend past the maximum allowed value (defined as the current ledger + `max_entry_ttl` - 1),
// the new `live_until_ledger_seq` will be clamped to the max.
// @ts-ignore
@external("l", "c")
export declare function extend_contract_instance_ttl(contract:AddressObject, threshold: U32Val, extend_to:U32Val): VoidVal;

// If the TTL for the provided contract's code (if applicable) is below `threshold` ledgers, extend `live_until_ledger_seq`
// such that TTL == `extend_to`, where TTL is defined as live_until_ledger_seq - current ledger. 
// If attempting to extend past the maximum allowed value (defined as the current ledger + `max_entry_ttl` - 1), 
// the new `live_until_ledger_seq` will be clamped to the max.
// @ts-ignore
@external("l", "d")
export declare function extend_contract_code_ttl(contract:AddressObject, threshold: U32Val, extend_to:U32Val): VoidVal;

// Creates the contract instance on behalf of `deployer`. Created contract must be created from a Wasm that has a constructor.
// `deployer` must authorize this call via Soroban auth framework, i.e. this calls `deployer.require_auth` with respective arguments.
// `wasm_hash` must be a hash of the contract code that has already been uploaded on this network. 
// `salt` is used to create a unique contract id. 
// `constructor_args` are forwarded into created contract's constructor (`__constructor`) function. 
// Returns the address of the created contract.
// @ts-ignore
@external("l", "e")
export declare function create_contract_with_constructor(deployer:AddressObject, wasm_hash: BytesObject, salt:BytesObject, constructor_args:VecObject): AddressObject;

/******************
 * CALL *
 ******************/

/// Calls a function in another contract with arguments contained in vector `args`.
/// If the call is successful, forwards the result of the called function. Traps otherwise.
// @ts-ignore
@external("d", "_")
export declare function call(contract: AddressObject, func: Symbol, args: VecObject): Val;

/// Calls a function in another contract with arguments contained in vector `args`. Returns:
/// - if successful, result of the called function.
/// - otherwise, an `ScError` if the called function failed.
// @ts-ignore
@external("d", "0")
export declare function try_call(contract: AddressObject, func: Symbol, args: VecObject): Val;



/*****************
* BUFF *
******************/

/// Serializes an (SC)Val into XDR opaque `Bytes` object.
// @ts-ignore
@external("b", "_")
export declare function serialize_to_bytes(v:Val): BytesObject;

/// Deserialize a `Bytes` object to get back the (SC)Val.
// @ts-ignore
@external("b", "0")
export declare function deserialize_from_bytes(b:BytesObject): Val;

/// Copies a slice of bytes from a `Bytes` object specified at offset `b_pos` with
/// length `len` into the linear memory at position `lm_pos`.
/// Traps if either the `Bytes` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "1")
export declare function bytes_copy_to_linear_memory(b:BytesObject, b_pos:U32Val, lm_pos:U32Val, len:U32Val): Val;

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
export declare function bytes_push(v:BytesObject, u:U32Val): BytesObject;

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

// Verifies the `signature` using an ECDSA secp256r1 `public_key` on a 32-byte `msg_digest`. 
// Warning: The `msg_digest` must be produced by a secure cryptographic hash 
// function on the message, otherwise the attacker can potentially forge signatures. 
// The `public_key` is expected to be 65 bytes in length, representing a SEC-1 encoded point in uncompressed format.
// The `signature` is the ECDSA signature `(r, s)` serialized as fixed-size big endian scalar values, 
// both `r`, `s` must be non-zero and `s` must be in the lower range.
// @ts-ignore
@external("c", "3")
export declare function verify_sig_ecdsa_secp256r1(public_key:BytesObject, msg_digest:BytesObject, signature: BytesObject): VoidVal;

/// Checks if the input G1 point is in the correct subgroup. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "4")
export declare function bls12_381_check_g1_is_in_subgroup(point:BytesObject): BoolVal;

/// Adds two BLS12-381 G1 points given in bytes format and returns the resulting G1 point in bytes format.
/// G1 serialization format: `concat(be_bytes(X), be_bytes(Y))` and the most significant three bits of 
/// X encodes flags, i.e.  bits(X) = [compression_flag, infinity_flag, sort_flag, bit_3, .. bit_383]. 
/// This function does NOT perform subgroup check on the inputs. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "5")
export declare function bls12_381_g1_add(point1:BytesObject, point2:BytesObject): BytesObject;

/// Multiplies a BLS12-381 G1 point by a scalar (Fr), and returns the resulting G1 point in bytes format. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "6")
export declare function bls12_381_g1_mul(point:BytesObject, scalar:U256Val): BytesObject;

/// Performs multi-scalar-multiplication (inner product) on a vector of BLS12-381 G1 points (`Vec<BytesObject>`) 
/// by a vector of scalars (`Vec<U256Val>`), and returns the resulting G1 point in bytes format. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "7")
export declare function bls12_381_g1_msm(vp:VecObject, vs:VecObject): BytesObject;

/// Maps a BLS12-381 field element (Fp) to G1 point. The input is a BytesObject 
/// containing Fp serialized in big-endian order (min_supported_protocol: 22)
// @ts-ignore
@external("c", "8")
export declare function bls12_381_map_fp_to_g1(fp:BytesObject): BytesObject;

/// Hashes a message to a BLS12-381 G1 point, with implementation following the specification in 
/// [Hashing to Elliptic Curves](https://datatracker.ietf.org/doc/html/rfc9380) (ciphersuite 'BLS12381G1_XMD:SHA-256_SSWU_RO_').
///  `dst` is the domain separation tag that will be concatenated with the `msg` during hashing, 
/// it is intended to keep hashing inputs of different applications separate. 
/// It is required `0 < len(dst_bytes) < 256`. DST **must** be chosen with care to avoid compromising the application's security properties.
///  Refer to section 3.1 in the RFC on requirements of DST. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "9")
export declare function bls12_381_hash_to_g1(msg:BytesObject, dst:BytesObject): BytesObject;

/// Checks if the input G2 point is in the correct subgroup. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "a")
export declare function bls12_381_check_g2_is_in_subgroup(point:BytesObject): BoolVal;

/// Adds two BLS12-381 G2 points given in bytes format and returns the resulting G2 point in bytes format. 
/// G2 serialization format: concat(be_bytes(X_c1), be_bytes(X_c0), be_bytes(Y_c1), be_bytes(Y_c0)), 
/// and the most significant three bits of X_c1 are flags i.e. bits(X_c1) = [compression_flag, infinity_flag, sort_flag, bit_3, .. bit_383].
/// This function does NOT perform subgroup check on the inputs. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "b")
export declare function bls12_381_g2_add(point1:BytesObject, point2:BytesObject): BytesObject;

/// Multiplies a BLS12-381 G2 point by a scalar (Fr), and returns the resulting G2 point in bytes format. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "c")
export declare function bls12_381_g2_mul(point:BytesObject, scalar:U256Val): BytesObject;

/// Performs multi-scalar-multiplication (inner product) on a vector of BLS12-381 G2 points (`Vec<BytesObject>`) 
// by a vector of scalars (`Vec<U256Val>`) , and returns the resulting G2 point in bytes format. (min_supported_protocol: 22)
// @ts-ignore
@external("c", "d")
export declare function bls12_381_g2_msm(vp:VecObject, vs:VecObject): BytesObject;

/// Maps a BLS12-381 quadratic extension field element (Fp2) to G2 point.
/// Fp2 serialization format: concat(be_bytes(c1), be_bytes(c0)) 
/// (min_supported_protocol: 22)
// @ts-ignore
@external("c", "e")
export declare function bls12_381_map_fp2_to_g2(fp2:BytesObject): BytesObject;

/// Hashes a message to a BLS12-381 G2 point, with implementation following the specification 
/// in [Hashing to Elliptic Curves](https://datatracker.ietf.org/doc/html/rfc9380) 
/// (ciphersuite 'BLS12381G2_XMD:SHA-256_SSWU_RO_'). 
/// `dst` is the domain separation tag that will be concatenated with the `msg` during hashing, 
/// it is intended to keep hashing inputs of different applications separate. 
/// It is required `0 < len(dst_bytes) < 256`. DST **must** be chosen with care to avoid compromising
/// the application's security properties. Refer to section 3.1 in the RFC on requirements of DST.
/// (min_supported_protocol: 22)
// @ts-ignore
@external("c", "f")
export declare function bls12_381_hash_to_g2(msg:BytesObject, dst:BytesObject): BytesObject;

/// Performs pairing operation on a vector of `G1` (`Vec<BytesObject>`)  and a vector of `G2` points (`Vec<BytesObject>`) ,
/// return true if the result equals `1_fp12` (min_supported_protocol: 22)
// @ts-ignore
@external("c", "g")
export declare function bls12_381_multi_pairing_check(vp1:VecObject, vp2:VecObject): BoolVal;

/// Performs addition `(lhs + rhs) mod r` between two BLS12-381 scalar elements (Fr), 
/// where r is the subgroup order (min_supported_protocol: 22)
// @ts-ignore
@external("c", "h")
export declare function bls12_381_fr_add(lhs:U256Val, rhs:U256Val): U256Val;

/// Performs subtraction `(lhs - rhs) mod r` between two BLS12-381 scalar elements (Fr), 
/// where r is the subgroup order (min_supported_protocol: 22)
// @ts-ignore
@external("c", "i")
export declare function bls12_381_fr_sub(lhs:U256Val, rhs:U256Val): U256Val;

/// Performs multiplication `(lhs * rhs) mod r` between two BLS12-381 scalar elements (Fr), 
/// where r is the subgroup order (min_supported_protocol: 22)
// @ts-ignore
@external("c", "j")
export declare function bls12_381_fr_mul(lhs:U256Val, rhs:U256Val): U256Val;

/// Performs exponentiation of a BLS12-381 scalar element (Fr) with a u64 exponent 
/// i.e. `lhs.exp(rhs) mod r`, where r is the subgroup order (min_supported_protocol: 22)
// @ts-ignore
@external("c", "k")
export declare function bls12_381_fr_pow(lhs:U256Val, rhs:U256Val): U256Val;

/// Performs inversion of a BLS12-381 scalar element (Fr) modulo r (the subgroup order)
///  (min_supported_protocol: 22)
// @ts-ignore
@external("c", "l")
export declare function bls12_381_fr_inv(lhs:U256Val): U256Val;

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
export declare function require_auth(address: AddressObject): Val;

/// Converts a provided Stellar strkey address of an account or a contract ('G...' or 'C...' respectively) to an address object.
/// `strkey` can be either `BytesObject` or `StringObject` (the contents should represent the `G.../C...` string in both cases).
/// Any other valid or invalid strkey (e.g. 'S...') will trigger an error. Prefer directly using the Address objects whenever possible.
/// This is only useful in the context of custom messaging protocols (e.g. cross-chain).
// @ts-ignore
@external("a", "1")
export declare function strkey_to_address(strkey: Val): AddressObject;

/// Converts a provided address to Stellar strkey format ('G...' for account or 'C...' for contract). 
/// Prefer directly using the Address objects whenever possible. This is only useful in the context 
/// of custom messaging protocols (e.g. cross-chain).
// @ts-ignore
@external("a", "2")
export declare function address_to_strkey(address: AddressObject): StringObject;

/// Authorizes sub-contract calls for the next contract call on behalf of the current contract. 
/// Every entry in the argument vector corresponds to `InvokerContractAuthEntry` contract type that 
/// authorizes a tree of `require_auth` calls on behalf of the current contract. The entries must not
/// contain any authorizations for the direct contract call, i.e. if current contract needs to 
/// call contract function F1 that calls function F2 both of which require auth, only F2 should be present in `auth_entries`.
// @ts-ignore
@external("a", "3")
export declare function authorize_as_curr_contract(auth_entires: VecObject): VoidVal;

/// Returns the address corresponding to the provided MuxedAddressObject as a new AddressObject. 
/// Note, that MuxedAddressObject consists of the address and multiplexing id, 
/// so this conversion just strips the multiplexing id from the input muxed address.
/// (min_supported_protocol: 23)
// @ts-ignore
@external("a", "4")
export declare function get_address_from_muxed_address(muxed_address: MuxedAddressObject): AddressObject;

/// Returns the multiplexing id corresponding to the provided MuxedAddressObject as a U64Val.
/// (min_supported_protocol: 23)
// @ts-ignore
@external("a", "5")
export declare function get_id_from_muxed_address(muxed_address: MuxedAddressObject): U64Val;

/// Returns the executable corresponding to the provided address. When the address does not exist on-chain, 
/// returns `Void` value. When it does exist, returns a value of `AddressExecutable` contract type. 
/// It is an enum with `Wasm` value and the corresponding Wasm hash for the Wasm contracts, 
/// `StellarAsset` value for Stellar Asset contract instances, and `Account` value for the 'classic' (G-) accounts.
/// (min_supported_protocol: 23)
// @ts-ignore
@external("a", "6")
export declare function get_address_executable(address: AddressObject): Val;

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

/// Converts the provided string to bytes with exactly the same contents. (min_supported_protocol: 23)
// @ts-ignore
@external("b", "n")
export declare function string_to_bytes(str:StringObject): BytesObject;

/// Converts the provided bytes array to string with exactly the same contents. 
/// No encoding checks are performed and thus the output string's encoding should be interpreted 
/// by the consumer of the string. (min_supported_protocol: 23)
// @ts-ignore
@external("b", "o")
export declare function bytes_to_string(bytes:BytesObject): StringObject;


/******************
 * TEST *
 ******************/

/// A dummy function taking 0 arguments and performs no-op.
/// This function is for test purpose only, for measuring the 
/// roundtrip cost of invoking a host function, i.e. host->Vm->host. 
// @ts-ignore
@external("t", "_")
export declare function dummy0(): Val;


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