import { BigIntObject, RawVal, BinaryObject, toBool, fromU32, fromI32} from "./val";

/**
 * Constructs a BigInt on the host from an u64.
 * @param value the u64 value to construct the BigInt from
 * @returns the handle to the created BigInt object (Type: BigIntObject)
 */
export function from_u64(value: u64): BigIntObject {
    return bigint_from_u64(value);
}

/**
 * Converts a BigInt to an u64. Traps if the value cannot fit into u64.
 * @param object the handle to the BigInt object (Type: BigIntObject)
 * @returns the u64 value of the bigint
 */
export function to_u64(object: BigIntObject): u64 {
    return bigint_to_u64(object);
}

/**
 * Constructs a BigInt on the host from an i64.
 * @param value the i64 value to construct the BigInt from
 * @returns the handle to the created BigInt object (Type: BigIntObject)
 */
export function from_i64(value: i64): BigIntObject {
    return bigint_from_i64(value);
}

/**
 * Converts a BigInt to an i64. Traps if the value cannot fit into i64.
 * @param object the handle to the BigInt object (Type: BigIntObject)
 * @returns the i64 value of the bigint
*/
export function to_i64(object: BigIntObject): i64 {
    return bigint_to_i64(object);
}

/**
 * Performs the `+` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
export function add(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_add(object1, object2);
}

/**
 * Performs the `-` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
export function sub(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_sub(object1, object2);
}

/**
 * Performs the `*` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function mul(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_mul(object1, object2);
}

/**
 * Performs the `/` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function div(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_div(object1, object2);
}

/**
 * Performs the `%` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function rem(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_rem(object1, object2);
}

/**
 * Performs the `&` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param value2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function and(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_and(object1, object2);
}

/**
 * Performs the `|` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function or(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_or(object1, object2);
}

/**
 * Performs the `^` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function xor(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_xor(object1, object2);
}

/**
 * Performs the `<<` operation on the host and returns the handle to the result.
 * @param value1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function shl(value1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_shl(value1, object2);
}

/**
 * Performs the `>>` operation on the host and returns the handle to the result.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function shr(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_shr(object1, object2);
}

/**
 * Returns true if the BigInt is equal to the additive identity.
 * @param object the handle to the BigInt to check (Type: BigIntObject)
 * @returns true or false
 */
export function is_zero(object: BigIntObject): bool {
    return toBool(bigint_is_zero(object));
}

/**
 * Performs the unary `-` operation.
 * @param object the handle to the BigInt value on the host (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
export function neg(object: BigIntObject): BigIntObject {
    return bigint_neg(object);
}

/**
 * Performs the unary `!` operation.
 * @param object the handle to the BigInt value on the host (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
export function not(object: BigIntObject): BigIntObject {
    return bigint_not(object);
}

/**
 * Calculates the Greatest Common Divisor (GCD) of `object1` and `object2`.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
export function gcd(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_gcd(object1, object2);
}

/**
 * Calculates the Lowest Common Multiple (LCM) of `object1` and `object2`.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function lcm(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_lcm(object1, object2);
}

/**
 * Calculates `object1` to the power `object2`. Traps if `object2` is negative or larger than the size of u64.
 * @param object1 handle to the first value (Type: BigIntObject)
 * @param object2 handle to the second value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function pow(object1: BigIntObject, object2: BigIntObject): BigIntObject {
    return bigint_pow(object1, object2);
}

/**
* Calculates `(p ^ q) mod m`. Note that this rounds like `mod_floor`, not like the `%` operator, which makes a difference when given a negative `p` or `m`.
* The result will be in the interval `[0, m)` for `m > 0`, or in the interval `(m, 0]` for `m < 0`.
* Traps if the `q` is negative or the `m` is zero.
 * @param objectP handle to the p value (Type: BigIntObject)
 * @param objectQ handle to the q value (Type: BigIntObject)
 * @param objectM handle to the m value (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
 export function pow_mod(objectP: BigIntObject, objectQ: BigIntObject, objectM: BigIntObject): BigIntObject {
    return bigint_pow_mod(objectP, objectQ, objectM);
}

/**
 * Calculates the truncated principal square root of the given bigint. Traps if the bigint is negative.
 * @param object handle to the bigint value on the host (Type: BigIntObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
export function sqrt(object: BigIntObject): BigIntObject {
    return bigint_sqrt(object);
}

/**
 * Determines the fewest bits necessary to express the bigint, not including the sign.
 * @param object handle to the bigint value on the host (Type: BigIntObject)
 * @returns the bits (Type: u64)
 */
 export function bits(object: BigIntObject): u64 {
    return bigint_bits(object);
}

/**
 * Outputs the BigInt's magnitude in big-endian byte order into a byte array. The sign is dropped.n.
 * @param object handle to the bigint value on the host (Type: BigIntObject)
 * @returns the byte array (Type: BinaryObject)
 */
export function to_bytes_be(object: BigIntObject): BinaryObject {
    return bigint_to_bytes_be(object);
}

/**
 * Outputs the BigInt's magnitude in the requested base in big-endian digit order into a byte array.
 * The sign is dropped. Radix must be in the range 2...256.
 * @param object handle to the bigint value on the host (Type: BigIntObject)
 * @param radix the radix [2 ... 256]
 * @returns the byte array (Type: BinaryObject)
 */
 export function to_radix_be(object: BigIntObject, radix: u32): BinaryObject {
    return bigint_to_radix_be(object, fromU32(radix));
}

/**
 * Creates a BigInt from a byte array and i32 sign.
 * Bytes are in big-endian order. Sign is interpreted: -1 as negative, 0 as zero, 1 as positive
 * If sign is 0, then the input bytes are ignored and will return a BigInt of 0.
 * @param sign the i32 sign [-1 | 0 | 1]
 * @param bytes the byte array (Type: BinaryObject)
 * @returns the handle to the result (Type: BigIntObject)
 */
export function from_bytes_be(sign: i32, bytes: BinaryObject): BigIntObject {
    return bigint_from_bytes_be(fromI32(sign), bytes);
}

/**
 * Creates a BigInt from a byte array `buf`, an i32 sign and an u32 radix.
 * Each u8 of the byte array is interpreted as one digit of the number and
 * must therefore be less than the radix. The bytes are in big-endian byte order.
 * Radix must be in the range 2..=256. Sign follows same rule as in `bigint_from_bytes_be`.
 * @param sign the sign [-1 | 0 | 1]
 * @param buf the byte array (Type: BinaryObject)
 * @param radix the radix [2 ... 256]
 * @returns the handle to the result (Type: BigIntObject)
 */
export function from_radix_be(sign: i32, buf: BinaryObject, radix: u32): BigIntObject {
    return bigint_from_radix_be(fromI32(sign), buf, fromU32(radix));
}

/******************
 * HOST FUNCTIONS *
 ******************/

/// Constructs a BigInt from an u64.
// @ts-ignore
@external("g", "_")
declare function bigint_from_u64(x: u64): BigIntObject;

/// Converts a BigInt to an u64. Traps if the value cannot fit into u64.
// @ts-ignore
@external("g", "0")
declare function bigint_to_u64(x: BigIntObject): u64;

/// Constructs a BigInt from an i64.
// @ts-ignore
@external("g", "1")
declare function bigint_from_i64(x: i64): BigIntObject;

/// Converts a BigInt to an i64. Traps if the value cannot fit into i64.
// @ts-ignore
@external("g", "2")
declare function bigint_to_i64(x: BigIntObject): i64;

/// Performs the `+` operation.
// @ts-ignore
@external("g", "3")
declare function bigint_add(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `-` operation.
// @ts-ignore
@external("g", "4")
declare function bigint_sub(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `*` operation.
// @ts-ignore
@external("g", "5")
declare function bigint_mul(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `/` operation.
// @ts-ignore
@external("g", "6")
declare function bigint_div(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `%` operation. Traps if `y` is zero.
// @ts-ignore
@external("g", "7")
declare function bigint_rem(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `&` operation.
// @ts-ignore
@external("g", "8")
declare function bigint_and(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `|` operation.
// @ts-ignore
@external("g", "9")
declare function bigint_or(x:BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `^` operation.
// @ts-ignore
@external("g", "A")
declare function bigint_xor(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `<<` operation. Traps if `y` is negative or larger than the size of u64.
// @ts-ignore
@external("g", "B")
declare function bigint_shl(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Performs the `>>` operation. Traps if `y` is negative or larger than the size of u64.
// @ts-ignore
@external("g", "C")
declare function bigint_shr(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Returns true if `x` is equal to the additive identity.
// @ts-ignore
@external("g", "D")
declare function bigint_is_zero(x: BigIntObject): RawVal;

/// Performs the unary `-` operation.
// @ts-ignore
@external("g", "E")
declare function bigint_neg(x: BigIntObject): BigIntObject;

/// Performs the unary `!` operation.
// @ts-ignore
@external("g", "F")
declare function bigint_not(x: BigIntObject): BigIntObject;

/// Calculates the Greatest Common Divisor (GCD) of `x` and `y`.
// @ts-ignore
@external("g", "G")
declare function bigint_gcd(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Calculates the Lowest Common Multiple (LCM) of `x` and `y`.
// @ts-ignore
@external("g", "H")
declare function bigint_lcm(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Calculates `x` to the power `y`. Traps if `y` is negative or larger than the size of u64.
// @ts-ignore
@external("g", "I")
declare function bigint_pow(x: BigIntObject, y: BigIntObject): BigIntObject;

/// Calculates `(p ^ q) mod m`. Note that this rounds like `mod_floor`, not like the `%` operator, which makes a difference when given a negative `p` or `m`.
/// The result will be in the interval `[0, m)` for `m > 0`, or in the interval `(m, 0]` for `m < 0`.
/// Traps if the `q` is negative or the `m` is zero.
// @ts-ignore
@external("g", "J")
declare function bigint_pow_mod(p: BigIntObject, q: BigIntObject, m: BigIntObject): BigIntObject;

/// Calculates the truncated principal square root of `x`. Traps if `x` is negative.
// @ts-ignore
@external("g", "K")
declare function bigint_sqrt(x: BigIntObject): BigIntObject;

/// Determines the fewest bits necessary to express `x`, not including the sign.
// @ts-ignore
@external("g", "L")
declare function bigint_bits(x: BigIntObject): u64;

/// Outputs the BigInt's magnitude in big-endian byte order into a byte array. The sign is dropped.n.
// @ts-ignore
@external("g", "M")
declare function bigint_to_bytes_be(x: BigIntObject): BinaryObject;

/// Outputs the BigInt's magnitude in the requested base in big-endian digit order into a byte array.
/// The sign is dropped. Radix must be in the range 2...256.
// @ts-ignore
@external("g", "N")
declare function bigint_to_radix_be(x: BigIntObject, radix: RawVal): BinaryObject;

/// Creates a BigInt from a byte array and i32 sign.
/// Bytes are in big-endian order. Sign is interpreted: -1 as negative, 0 as zero, 1 as positive
/// If sign is 0, then the input bytes are ignored and will return a BigInt of 0.
// @ts-ignore
@external("g", "O")
declare function bigint_from_bytes_be(sign: RawVal, bytes: BinaryObject): BigIntObject;

/// Creates a BigInt from a byte array `buf`, an i32 sign and an u32 radix.
/// Each u8 of the byte array is interpreted as one digit of the number and
/// must therefore be less than the radix. The bytes are in big-endian byte order.
/// Radix must be in the range 2..=256. Sign follows same rule as in `bigint_from_bytes_be`.
// @ts-ignore
@external("g", "P")
declare function bigint_from_radix_be(sign: RawVal, buf: BinaryObject, radix: RawVal): BigIntObject;