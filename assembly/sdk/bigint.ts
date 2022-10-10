import { BigIntObject, RawVal, BinaryObject, toBool, fromU32, fromI32} from "./host_value";

export class BigInt {
    obj: BigIntObject;

    constructor(obj:BigIntObject) {
      this.obj = obj;
    }

    /**
     * Constructs a BigInt on the host from an u64.
     * @param value the u64 value to construct the BigInt from
     * @returns the BigInt object containing its host object
     */
    static from_u64(value: u64): BigInt {
        return new BigInt(bigint_from_u64(value));
    }

    /**
     * Constructs a BigInt on the host from an i64.
     * @param value the i64 value to construct the BigInt from
     * @returns the BigInt object containing its host object
     */
    static from_i64(value: i64): BigInt {
        return new BigInt(bigint_from_i64(value));
    }

    /**
     * Creates a BigInt from a byte array and i32 sign.
     * Bytes are in big-endian order. Sign is interpreted: -1 as negative, 0 as zero, 1 as positive
     * If sign is 0, then the input bytes are ignored and will return a BigInt of 0.
     * @param sign the i32 sign [-1 | 0 | 1]
     * @param bytes the byte array (Type: BinaryObject)
     * @returns the new BigInt
     */
    static from_bytes_be(sign: i32, bytes: BinaryObject): BigInt {
        return new BigInt(bigint_from_bytes_be(fromI32(sign), bytes));
    }

    /**
     * Creates a BigInt from a byte array `buf`, an i32 sign and an u32 radix.
     * Each u8 of the byte array is interpreted as one digit of the number and
     * must therefore be less than the radix. The bytes are in big-endian byte order.
     * Radix must be in the range 2..=256. Sign follows same rule as in `bigint_from_bytes_be`.
     * @param sign the sign [-1 | 0 | 1]
     * @param buf the byte array (Type: BinaryObject)
     * @param radix the radix [2 ... 256]
     * @returns the new BigInt
     */
    static from_radix_be(sign: i32, buf: BinaryObject, radix: u32): BigInt {
        return new BigInt(bigint_from_radix_be(fromI32(sign), buf, fromU32(radix)));
    }

    /**
     * Returns the handle to the host object as BigIntObject.
     * @returns handle to the host object.
     */
    getHostObject() : BigIntObject {
        return this.obj;
    }

    /**
     * Converts this BigInt to an u64. Traps if the value cannot fit into u64.
     * @returns the u64 value of this BigInt
     */
    to_u64(): u64 {
        return bigint_to_u64(this.obj);
    }

    /**
     * Converts this BigInt to an i64. Traps if the value cannot fit into i64.
     * @returns the i64 value of the bigint
     */
    to_i64(): i64 {
        return bigint_to_i64(this.obj);
    }

    /**
     * Performs the `+` operation on the host and returns the result as a new BigInt.
     * @param value to add to this BigInt
     * @returns the new BigInt as a result
     */
    add(value: BigInt): BigInt {
        return new BigInt(bigint_add(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `+` operation on the host and assigns the result to this BigInt.
     * @param value to add to this BigInt
     * @returns void
     */
    add_assign(value: BigInt): void {
        this.obj = bigint_add(this.obj, value.getHostObject());
    }

    /**
     * Performs the `-` operation on the host and returns the result as a new BigInt.
     * @param value to substract from this BigInt
     * @returns the new BigInt as a result
     */
    sub(value: BigInt): BigInt {
        return new BigInt(bigint_sub(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `-` operation on the host and assigns the result to this BigInt.
     * @param value to substract from this BigInt
     * @returns void
     */
    sub_assign(value: BigInt): void {
        this.obj = bigint_sub(this.obj, value.getHostObject());
    }

    /**
     * Performs the `*` operation on the host and returns the result as a new BigInt.
     * @param value value to multiply this BigInt with
     * @returns the new BigInt as a result
     */
    mul(value: BigInt): BigInt {
        return new BigInt(bigint_mul(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `*` operation on the host and assigns the result to this BigInt.
     * @param value to multiply this BigInt with
     * @returns void
     */
    mul_assign(value: BigInt): void {
        this.obj = bigint_mul(this.obj, value.getHostObject());
    }

    /**
     * Performs the `/` operation on the host and returns the result as a new BigInt.
     * @param value value to divide this BigInt with
     * @returns the new BigInt as a result
     */
    div(value: BigInt): BigInt {
        return new BigInt(bigint_div(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `/` operation on the host and assigns the result to this BigInt.
     * @param value to devide this BigInt with
     * @returns void
     */
    div_assign(value: BigInt): void {
        this.obj = bigint_div(this.obj, value.getHostObject());
    }

    /**
     * Performs the `%` operation on the host and returns the result as a new BigInt.
     * @param value value to perform the `%` operation to this BigInt
     * @returns the new BigInt as a result
     */
    rem(value: BigInt): BigInt {
        return new BigInt(bigint_rem(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `%` operation on the host and assigns the result to this BigInt.
     * @param value value to perform the `%` operation to this BigInt
     * @returns void
     */
    rem_assign(value: BigInt): void {
        this.obj = bigint_rem(this.obj, value.getHostObject());
    }

    /**
     * Performs the `&` operation on the host and returns the result as a new BigInt.
     * @param value value to perform the `&` operation to this BigInt
     * @returns the new BigInt as a result
     */
    and(value: BigInt): BigInt {
        return new BigInt(bigint_and(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `&` operation on the host and assigns the result to this BigInt.
     * @param value value to perform the `&` operation to this BigInt
     * @returns void
    */
    and_assign(value: BigInt): void {
        this.obj = bigint_and(this.obj, value.getHostObject());
    }

    /**
     * Performs the `|` operation on the host and returns the result as a new BigInt.
     * @param value value to perform the `|` operation to this BigInt
     * @returns the new BigInt as a result
     */
    or(value: BigInt): BigInt {
        return new BigInt(bigint_or(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `|` operation on the host and assigns the result to this BigInt.
     * @param value value to perform the `|` operation to this BigInt
     * @returns void
     */
    or_assign(value: BigInt): void {
        this.obj = bigint_or(this.obj, value.getHostObject());
    }
    
    /**
     * Performs the `^` operation on the host and returns the result as a new BigInt.
     * @param value value to perform the `^` operation to this BigInt
     * @returns the new BigInt as a result
     */
    xor(value: BigInt): BigInt {
        return new BigInt(bigint_xor(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `^` operation on the host and assigns the result to this BigInt.
     * @param value value to perform the `^` operation to this BigInt
     * @returns void
     */
    xor_assign(value: BigInt): void {
        this.obj = bigint_xor(this.obj, value.getHostObject());
    }

    /**
     * Performs the `<<` operation on the host and returns the result as a new BigInt.
     * @param value value to perform the `<<` operation to this BigInt
     * @returns the new BigInt as a result
     */
    shl(value: BigInt): BigInt {
        return new BigInt(bigint_shl(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `<<` operation on the host and assigns the result to this BigInt.
     * @param value value to perform the `<<` operation to this BigInt
     * @returns void
     */
    shl_assign(value: BigInt): void {
        this.obj = bigint_shl(this.obj, value.getHostObject());
    }

    /**
     * Performs the `>>` operation on the host and returns the result as a new BigInt.
     * @param value value to perform the `>>` operation to this BigInt
     * @returns the new BigInt as a result
     */
     shr(value: BigInt): BigInt {
        return new BigInt(bigint_shr(this.obj, value.getHostObject()));
    }

    /**
     * Performs the `>>` operation on the host and assigns the result to this BigInt.
     * @param value value to perform the `>>` operation to this BigInt
     * @returns void
     */
     shr_assign(value: BigInt): void {
        this.obj = bigint_shr(this.obj, value.getHostObject());
    }

    /**
     * Returns true if this BigInt is equal to the additive identity.
     * @returns true or false
     */
    is_zero(): bool {
        return toBool(bigint_is_zero(this.obj));
    }

    /**
     * Performs the unary `-` operation to this BigInt on the host and returns the result as a new BigInt.
     * @returns the new BigInt as a result
     */
    neg(): BigInt {
        return new BigInt(bigint_neg(this.obj));
    }

    /**
     * Performs the unary `-` operation to this BigInt and assigns the result to this BigInt.
     * @returns void
     */
    neg_assign(): void {
        this.obj = bigint_neg(this.obj);
    }

    /**
     * Performs the unary `!` operation to this BigInt on the host and returns the result as a new BigInt.
     * @returns the new BigInt as a result
     */
    not(): BigInt {
        return new BigInt(bigint_not(this.obj));
    }

    /**
     * Performs the unary `!` operation to this BigInt and assigns the result to this BigInt.
     * @returns void
     */
    not_assign(): void {
        this.obj = bigint_not(this.obj);
    }

    /**
     * Calculates the Greatest Common Divisor (GCD) of this BigInt and the value given by parameter. Returns the result as a new BigInt.
     * @param value value to perform the gdc operation with this BigInt
     * @returns the new BigInt as a result
     */
    gcd(value: BigInt): BigInt {
        return new BigInt(bigint_gcd(this.obj, value.getHostObject()));
    }

    /**
     * Calculates the Greatest Common Divisor (GCD) of this BigInt and the value given by parameter. Assigns the result to this BigInt.
     * @param value value to perform the gdc operation with this BigInt
     * @returns void
     */
    gcd_assign(value: BigInt): void {
        this.obj = bigint_gcd(this.obj, value.getHostObject());
    }

    /**
     * Calculates the Greatest Common Divisor (GCD) of this BigInt and the value given by parameter. Returns the result as a new BigInt.
     * @param value value to perform the gdc operation with this BigInt
     * @returns the new BigInt as a result
     */
    lcm(value: BigInt): BigInt {
        return new BigInt(bigint_lcm(this.obj, value.getHostObject()));
    }

    /**
     * Calculates the Lowest Common Multiple (LCM) of this BigInt and the value given by parameter. Assigns the result to this BigInt.
     * @param value value to perform the lcm operation with this BigInt
     * @returns void
     */
    lcm_assign(value: BigInt): void {
        this.obj = bigint_lcm(this.obj, value.getHostObject());
    }

    /**
     * Calculates this BigInt` to the power `value`. Traps if `value` is negative or larger than the size of u64. Returns the result as a new BigInt.
     * @param value value to be used for the pow operation
     * @returns the new BigInt as a result
     */
    pow(value: BigInt): BigInt {
        return new BigInt(bigint_pow(this.obj, value.getHostObject()));
    }

    /**
     * Calculates this BigInt` to the power `value`. Traps if `value` is negative or larger than the size of u64. Assigns the result to this BigInt.
     * @param value value to be used for the pow operation
     * @returns void
     */
    pow_assign(value: BigInt): void {
        this.obj = bigint_pow(this.obj, value.getHostObject());
    }

    /**
    * Calculates `(this ^ q) mod m`. Note that this rounds like `mod_floor`, not like the `%` operator, which makes a difference when given a negative `this` or `m`.
    * The result will be in the interval `[0, m)` for `m > 0`, or in the interval `(m, 0]` for `m < 0`.
    * Traps if the `q` is negative or the `m` is zero.
    * Resturns the result as a new BigInt
    * @param valueQ handle to the q value (Type: BigIntObject)
    * @param valueM handle to the m value (Type: BigIntObject)
    * @returns the new BigInt as a result
    */
    pow_mod(valueQ: BigInt, valueM: BigInt): BigInt {
        return new BigInt(bigint_pow_mod(this.obj, valueQ.getHostObject(), valueM.getHostObject()));
    }

    /**
    * Calculates `(this ^ q) mod m`. Note that this rounds like `mod_floor`, not like the `%` operator, which makes a difference when given a negative `this` or `m`.
    * The result will be in the interval `[0, m)` for `m > 0`, or in the interval `(m, 0]` for `m < 0`.
    * Traps if the `q` is negative or the `m` is zero.
    * Assigns the result to this BigInt
    * @param valueQ handle to the q value (Type: BigIntObject)
    * @param valueM handle to the m value (Type: BigIntObject)
    * @returns void
    */
    pow_mod_assign(valueQ: BigInt, valueM: BigInt): void {
        this.obj = bigint_pow_mod(this.obj, valueQ.getHostObject(), valueM.getHostObject());
    }

    /**
     * Calculates this BigInt` to the power `value`. Traps if `value` is negative or larger than the size of u64. Returns the result as a new BigInt.
     * @returns the new BigInt as a result
     */
    sqrt(): BigInt {
        return new BigInt(bigint_sqrt(this.obj));
    }

    /**
     * Calculates the truncated principal square root of the this BigInt. Traps if the BigInt is negative. Assigns the result to this BigInt.
     * @returns void
     */
    sqrt_assign(): void {
        this.obj = bigint_sqrt(this.obj);
    }

    /**
     * Determines the fewest bits necessary to express this BigInt, not including the sign.
     * @returns the bits (Type: u64)
     */
    bits(): u64 {
        return bigint_bits(this.obj);
    }

    /**
     * Outputs the BigInt's magnitude in big-endian byte order into a byte array. The sign is dropped.
     * @returns the byte array (Type: BinaryObject)
     */
    to_bytes_be(): BinaryObject {
        return bigint_to_bytes_be(this.obj);
    }

    /**
     * Outputs the BigInt's magnitude in the requested base in big-endian digit order into a byte array.
     * The sign is dropped. Radix must be in the range 2...256.
     * @param radix the radix [2 ... 256]
     * @returns the byte array (Type: BinaryObject)
     */
    to_radix_be(radix: u32): BinaryObject {
        return bigint_to_radix_be(this.obj, fromU32(radix));
    }
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