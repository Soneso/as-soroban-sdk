import { RawVal } from "./val";
import { ObjectVal } from "./val";
import { SymbolVal } from "./val";





/***********************************************
* ledger - Functions concerned with the ledger *
************************************************/

// @ts-ignore
@external("l", "_")
export declare function put_contract_data(k:RawVal, v:RawVal): RawVal;

// @ts-ignore
@external("l", "0")
export declare function has_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "1")
export declare function get_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "2")
export declare function del_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "3")
export declare function create_contract_from_ed25519(v:ObjectVal, salt:ObjectVal, key:ObjectVal, sig:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "4")
export declare function create_contract_from_contract(v:ObjectVal, salt:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "5")
export declare function create_token_from_ed25519(salt:ObjectVal, key:ObjectVal, sig:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "6")
export declare function create_token_from_contract(salt:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "7")
export declare function create_token_wrapper(asset:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "8")
export declare function create_contract_from_source_account(v:ObjectVal, salt:ObjectVal): ObjectVal;


/*************************************************
* call - Functions concerned with contract calls *
**************************************************/

/// Calls a function in another contract with arguments contained in vector `args`.
/// If the call is successful, forwards the result of the called function. Traps otherwise.
// @ts-ignore
@external("c", "_")
export declare function call(contract:ObjectVal, func:SymbolVal, args:ObjectVal): RawVal;

/// Calls a function in another contract with arguments contained in vector `args`. Returns:
/// - if successful, result of the called function.
/// - otherwise, an `SCStatus` containing the error status code.
// @ts-ignore
@external("c", "0")
export declare function try_call(contract:ObjectVal, func:SymbolVal, args:ObjectVal): RawVal;


/*******************************************
* bigint - Functions concerned with BigInt *
********************************************/

/// Constructs a BigInt from an u64.
// @ts-ignore
@external("g", "_")
export declare function bigint_from_u64(x:u64): ObjectVal;

/// Converts a BigInt to an u64. Traps if the value cannot fit into u64.
// @ts-ignore
@external("g", "0")
export declare function bigint_to_u64(x:ObjectVal): u64;

/// Constructs a BigInt from an i64.
// @ts-ignore
@external("g", "1")
export declare function bigint_from_i64(x:i64): ObjectVal;

/// Converts a BigInt to an i64. Traps if the value cannot fit into i64.
// @ts-ignore
@external("g", "2")
export declare function bigint_to_i64(x:ObjectVal): i64;

/// Performs the `+` operation.
// @ts-ignore
@external("g", "3")
export declare function bigint_add(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `-` operation.
// @ts-ignore
@external("g", "4")
export declare function bigint_sub(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `*` operation.
// @ts-ignore
@external("g", "5")
export declare function bigint_mul(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `/` operation.
// @ts-ignore
@external("g", "6")
export declare function bigint_div(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `%` operation. Traps if `y` is zero.
// @ts-ignore
@external("g", "7")
export declare function bigint_rem(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `&` operation.
// @ts-ignore
@external("g", "8")
export declare function bigint_and(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `|` operation.
// @ts-ignore
@external("g", "9")
export declare function bigint_or(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `^` operation.
// @ts-ignore
@external("g", "A")
export declare function bigint_xor(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `<<` operation. Traps if `y` is negative or larger than the size of u64.
// @ts-ignore
@external("g", "B")
export declare function bigint_shl(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Performs the `>>` operation. Traps if `y` is negative or larger than the size of u64.
// @ts-ignore
@external("g", "C")
export declare function bigint_shr(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Returns true if `x` is equal to the additive identity.
// @ts-ignore
@external("g", "D")
export declare function bigint_is_zero(x:ObjectVal): RawVal;

/// Performs the unary `-` operation.
// @ts-ignore
@external("g", "E")
export declare function bigint_neg(x:ObjectVal): ObjectVal;

/// Performs the unary `!` operation.
// @ts-ignore
@external("g", "F")
export declare function bigint_not(x:ObjectVal): ObjectVal;

/// Calculates the Greatest Common Divisor (GCD) of `x` and `y`.
// @ts-ignore
@external("g", "G")
export declare function bigint_gcd(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Calculates the Lowest Common Multiple (LCM) of `x` and `y`.
// @ts-ignore
@external("g", "H")
export declare function bigint_lcm(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Calculates `x` to the power `y`. Traps if `y` is negative or larger than the size of u64.
// @ts-ignore
@external("g", "I")
export declare function bigint_pow(x:ObjectVal, y:ObjectVal): ObjectVal;

/// Calculates `(p ^ q) mod m`. Note that this rounds like `mod_floor`, not like the `%` operator, which makes a difference when given a negative `p` or `m`.
/// The result will be in the interval `[0, m)` for `m > 0`, or in the interval `(m, 0]` for `m < 0`.
/// Traps if the `q` is negative or the `m` is zero.
// @ts-ignore
@external("g", "J")
export declare function bigint_pow_mod(p:ObjectVal, q:ObjectVal, m:ObjectVal): ObjectVal;

/// Calculates the truncated principal square root of `x`. Traps if `x` is negative.
// @ts-ignore
@external("g", "K")
export declare function bigint_sqrt(x:ObjectVal): ObjectVal;

/// Determines the fewest bits necessary to express `x`, not including the sign.
// @ts-ignore
@external("g", "L")
export declare function bigint_bits(x:ObjectVal): u64;

/// Outputs the BigInt's magnitude in big-endian byte order into a byte array. The sign is dropped.n.
// @ts-ignore
@external("g", "M")
export declare function bigint_to_bytes_be(x:ObjectVal): ObjectVal;

/// Outputs the BigInt's magnitude in the requested base in big-endian digit order into a byte array.
/// The sign is dropped. Radix must be in the range 2...256.
// @ts-ignore
@external("g", "N")
export declare function bigint_to_radix_be(x:ObjectVal, radix: RawVal): ObjectVal;

/// Creates a BigInt from a byte array and i32 sign.
/// Bytes are in big-endian order. Sign is interpreted: -1 as negative, 0 as zero, 1 as positive
/// If sign is 0, then the input bytes are ignored and will return a BigInt of 0.
// @ts-ignore
@external("g", "O")
export declare function bigint_from_bytes_be(sign: RawVal, bytes:ObjectVal): ObjectVal;

/// Creates a BigInt from a byte array `buf`, an i32 sign and an u32 radix.
/// Each u8 of the byte array is interpreted as one digit of the number and
/// must therefore be less than the radix. The bytes are in big-endian byte order.
/// Radix must be in the range 2..=256. Sign follows same rule as in `bigint_from_bytes_be`.
// @ts-ignore
@external("g", "P")
export declare function bigint_from_radix_be(sign: RawVal, buf:ObjectVal, radix: RawVal): ObjectVal;

/*****************************************
* bytes - Functions concerned with bytes *
******************************************/

/// Serializes an (SC)Val into XDR opaque `Bytes` object.
// @ts-ignore
@external("b", "_")
export declare function serialize_to_bytes(v:RawVal): ObjectVal;

/// Deserialize a `Bytes` object to get back the (SC)Val.
// @ts-ignore
@external("b", "0")
export declare function deserialize_from_bytes(b:ObjectVal): RawVal;

/// Copies a slice of bytes from a `Bytes` object specified at offset `b_pos` with
/// length `len` into the linear memory at position `lm_pos`.
/// Traps if either the `Bytes` object or the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "1")
export declare function bytes_copy_to_linear_memory(b:ObjectVal, b_pos:RawVal, lm_pos:RawVal, len:RawVal): RawVal;

/// Copies a segment of the linear memory specified at position `lm_pos` with
/// length `len`, into a `Bytes` object at offset `b_pos`. The `Bytes` object may
/// grow in size to accommodate the new bytes.
/// Traps if the linear memory doesn't have enough bytes.
// @ts-ignore
@external("b", "2")
export declare function bytes_copy_from_linear_memory(b:ObjectVal, b_pos:RawVal, lm_pos:RawVal, len:RawVal): ObjectVal;

/// Constructs a new `Bytes` object initialized with bytes copied from a linear memory slice specified at position `lm_pos` with length `len`.
// @ts-ignore
@external("b", "3")
export declare function bytes_new_from_linear_memory(lm_pos:RawVal, len:RawVal): ObjectVal;

// --------------------------------------------------------
// These functions below ($3-$F) mirror vector operations +
// --------------------------------------------------------

/// Create an empty new `Bytes` object.
// @ts-ignore
@external("b", "4")
export declare function bytes_new(): ObjectVal;

/// Update the value at index `i` in the `Bytes` object. Return the new `Bytes`.
/// Trap if the index is out of bounds.
// @ts-ignore
@external("b", "5")
export declare function bytes_put(v:ObjectVal, i:RawVal, u:RawVal): ObjectVal;

/// Returns the element at index `i` of the `Bytes` object. Traps if the index is out of bound.
// @ts-ignore
@external("b", "6")
export declare function bytes_get(b:ObjectVal, i:RawVal): RawVal;

/// Delete an element in a `Bytes` object at index `i`, shifting all elements after it to the left.
/// Return the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "7")
export declare function bytes_del(v:ObjectVal, i:RawVal): ObjectVal;

/// Returns length of the `Bytes` object.
// @ts-ignore
@external("b", "8")
export declare function bytes_len(v:ObjectVal): RawVal;

/// Appends an element to the back of the `Bytes` object.
// @ts-ignore
@external("b", "9")
export declare function bytes_push(v:ObjectVal, u:RawVal): ObjectVal;

/// Removes the last element from the `Bytes` object and returns the new `Bytes`.
/// Traps if original `Bytes` is empty.
// @ts-ignore
@external("b", "A")
export declare function bytes_pop(b:ObjectVal): ObjectVal;

/// Return the first element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "B")
export declare function bytes_front(b:ObjectVal): RawVal;

/// Return the last element in the `Bytes` object. Traps if the `Bytes` is empty
// @ts-ignore
@external("b", "C")
export declare function bytes_back(v:ObjectVal): RawVal;

/// Inserts an element at index `i` within the `Bytes` object, shifting all elements after it to the right.
/// Traps if the index is out of bound
// @ts-ignore
@external("b", "D")
export declare function bytes_insert(v:ObjectVal, i:RawVal, u:RawVal): ObjectVal;

/// Clone the `Bytes` object `b1`, then moves all the elements of `Bytes` object `b2` into it.
/// Return the new `Bytes`. Traps if its length overflows a u32.
// @ts-ignore
@external("b", "E")
export declare function bytes_append(b1:ObjectVal, b2:ObjectVal): ObjectVal;

/// Copies the elements from `start` index until `end` index, exclusive, in the `Bytes` object and creates a new `Bytes` from it.
/// Returns the new `Bytes`. Traps if the index is out of bound.
// @ts-ignore
@external("b", "F")
export declare function bytes_slice(b:ObjectVal, start:RawVal, end:RawVal): ObjectVal;


/*****************************************
* hash - Functions concerned with hashes *
******************************************/

// @ts-ignore
@external("h", "_")
export declare function hash_from_bytes(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("h", "0")
export declare function hash_to_bytes(x:ObjectVal): ObjectVal;

/**************************************
* key - Functions concerned with keys *
***************************************/

// @ts-ignore
@external("k", "_")
export declare function public_key_from_bytes(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("k", "0")
export declare function public_key_to_bytes(x:ObjectVal): ObjectVal;

/*******************************************
* crypto - Functions concerned with crypto *
********************************************/

// @ts-ignore
@external("c", "_")
export declare function compute_hash_sha256(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("c", "0")
export declare function verify_sig_ed25519(x:ObjectVal, k:ObjectVal, s:ObjectVal): RawVal;


/**********************************************
* account - Functions concerned with accounts *
***********************************************/

/// Get the low threshold for the account with ed25519 public
/// key `a` (`a` is `Bytes`). Traps if no such account exists.
// @ts-ignore
@external("a", "_")
export declare function account_get_low_threshold(a:ObjectVal): RawVal;

/// Get the medium threshold for the account with ed25519 public
/// key `a` (`a` is `Bytes`). Traps if no such account exists.
// @ts-ignore
@external("a", "0")
export declare function account_get_medium_threshold(a:ObjectVal): RawVal;

/// Get the high threshold for the account with ed25519 public
/// key `a` (`a` is `Bytes`). Traps if no such account exists.
// @ts-ignore
@external("a", "1")
export declare function account_get_high_threshold(a:ObjectVal): RawVal;

/// Get the signer weight for the signer with ed25519 public key
/// `s` (`s` is `Bytes`) on the account with ed25519 public key `a` (`a`
/// is `Bytes`). Returns the master weight if the signer is the
/// master, and returns 0 if no such signer exists. Traps if no
/// such account exists.
// @ts-ignore
@external("a", "2")
export declare function account_get_signer_weight(a:ObjectVal, s:ObjectVal): RawVal;

/// Given an ed25519 public key `a` (`a` is `Bytes`) of an account,
/// check if it exists. Returns (SCStatic) TRUE/FALSE.
// @ts-ignore
@external("a", "3")
export declare function account_exists(a:ObjectVal): RawVal;