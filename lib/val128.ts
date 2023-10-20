// Offers arithmetic helper functions for positive I128Val and U128Val host values.

import * as context from "./context";
import { ge, gt, le, lt, eq, isZero, add, __hi, sub, mul, div, muldiv, sqrt, pow, ord } from "./u128_math";
import { I128Val, U128Val, fromI128Pieces, fromI128Small, fromU128Pieces, fromU128Small, 
    isI128Object, isI128Small, isU128Object, isU128Small, toI128High64, toI128Low64, 
    toI128Small, toU128High64, toU128Low64, toU128Small } from "./value";


/**
 * Checks if a given I128Val is negative. Traps if not I128Val (I128Object or I128SmallVal)
 * @param value the I128Val to check.
 * @returns true if negative otherwise false.
 */
export function isNegative(value:I128Val) : bool {
    let alo = getI128Parts(value);
    return lt(alo, __reshi, 0, 0);
}

/**
 * Checks if first given I128Val is lower then - operator('<') - second I128Val.
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns true if a < b
 */
export function i128lt(a:I128Val, b:I128Val) : bool {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    return lt(alo, ahi, blo, bhi);
}

/**
 * Checks if first given I128Val is lower or equal - operator('<=') - second I128Val.
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns true if a <= b
 */
export function i128le(a:I128Val, b:I128Val) : bool {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    return le(alo, ahi, blo, bhi);
}

/**
 * Checks if first given I128Val is equal - operator('==') - second I128Val.
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns true if a == b
 */
export function i128eq(a:I128Val, b:I128Val) : bool {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    return eq(alo, ahi, blo, bhi);
}

/**
 * Checks if first given I128Val is greater then - operator('>') - second I128Val.
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns true if a > b
 */
export function i128gt(a:I128Val, b:I128Val) : bool {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    return gt(alo, ahi, blo, bhi);
}

/**
 * Checks if first given I128Val is greater or equal - operator('>=') - second I128Val.
 * Supports positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns true if a >= b
 */
export function i128ge(a:I128Val, b:I128Val) : bool {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    return ge(alo, ahi, blo, bhi);
}

/**
 * Get ordering.
 * if a > b then result is  1
 * if a < b then result is -1
 * if a = b then result is  0
 * Supports positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns order
 */
export function i128ord(a:I128Val, b:I128Val) : i32 {
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    return ord(alo, ahi, blo, bhi);
}

/**
 * Checks if the given I128Val is zero.
 * Traps if not I128Val (I128Object or I128SmallVal) value.
 * @param value I128Val to check.
 * @returns true if zero
 */
export function i128isZero(value:I128Val) : bool {
    let vlo = getI128Parts(value);
    let vhi = __reshi;
    return isZero(vlo, vhi);
}

/**
 * Checks if first given U128Val is lower then - operator('<') - second U128Val.
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns true if a < b
 */
export function u128lt(a:U128Val, b:U128Val) : bool {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    return lt(alo, ahi, blo, bhi);
}

/**
 * Checks if first given U128Val is lower or equal - operator('<=') - second U128Val.
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns true if a <= b
 */
export function u128eq(a:U128Val, b:U128Val) : bool {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    return eq(alo, ahi, blo, bhi);
}

/**
 * Checks if first given U128Val is equal - operator('==') - second U128Val.
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns true if a == b
 */
export function u128le(a:U128Val, b:U128Val) : bool {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    return le(alo, ahi, blo, bhi);
}

/**
 * Checks if first given U128Val is greater then - operator('>') - second U128Val.
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns true if a > b
 */
export function u128gt(a:U128Val, b:U128Val) : bool {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    return gt(alo, ahi, blo, bhi);
}

/**
 * Checks if first given U128Val is greater then - operator('>=') - second U128Val.
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns true if a >= b
 */
export function u128ge(a:U128Val, b:U128Val) : bool {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    return ge(alo, ahi, blo, bhi);
}

/**
 * Get ordering.
 * if a > b then result is  1
 * if a < b then result is -1
 * if a = b then result is  0
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns order.
 */
export function u128ord(a:U128Val, b:U128Val) : i32 {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    return ord(alo, ahi, blo, bhi);
}

/**
 * Checks if the given U128Val is zero.
 * Traps if not U128Val (U128Object or U128SmallVal) value.
 * @param value U128Val to check.
 * @returns true if zero
 */
export function u128isZero(value:U128Val) : bool {
    let vlo = getU128Parts(value);
    let vhi = __reshi;
    return isZero(vlo, vhi);
}

/**
 * Adds two positive i128 numbers (a + b).
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns I128Val as the result of a + b
 */
export function i128add(a:I128Val, b:I128Val) : I128Val {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    let reslo = add(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packI128Val(reshi, reslo);
}

/**
 * Adds two u128 numbers (a + b).
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns U128Val as the result of a + b
 */
export function u128add(a:U128Val, b:U128Val) : U128Val {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    let reslo = add(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packU128Val(reshi, reslo);
}

/**
 * Substraction of two positive i128 numbers (a - b).
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns I128Val as the result of a - b
 */
export function i128sub(a:I128Val, b:I128Val) : I128Val {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    let reslo = sub(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packI128Val(reshi, reslo);
}

/**
 * Substraction of two u128 numbers (a - b).
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns U128Val as the result of a - b
 */
export function u128sub(a:U128Val, b:U128Val) : U128Val {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    let reslo = sub(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packU128Val(reshi, reslo);
}

/**
 * Multipies two positive i128 numbers (a * b).
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns I128Val as the result of a * b
 */
export function i128mul(a:I128Val, b:I128Val) : I128Val {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    let reslo = mul(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packI128Val(reshi, reslo);
}

/**
 * Multipies two u128 numbers (a - b).
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns U128Val as the result of a * b
 */
export function u128mul(a:U128Val, b:U128Val) : U128Val {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    let reslo = mul(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packU128Val(reshi, reslo);
}

/**
 * Devides two positive i128 numbers (a / b).
 * Supports only positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if one or both of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns I128Val as the result of a / b
 */
export function i128div(a:I128Val, b:I128Val) : I128Val {
    if (isNegative(a) || isNegative(b)) {
        context.fail();
    }
    let alo = getI128Parts(a);
    let ahi = __reshi;
    let blo = getI128Parts(b);
    let bhi = __reshi;
    let reslo = div(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packI128Val(reshi, reslo);
}

/**
 * Devides two u128 numbers (a / b).
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first U128Val.
 * @param b second U128Val.
 * @returns U128Val as the result of a / b
 */
export function u128div(a:U128Val, b:U128Val) : U128Val {
    let alo = getU128Parts(a);
    let ahi = __reshi;
    let blo = getU128Parts(b);
    let bhi = __reshi;
    let reslo = div(alo, ahi, blo, bhi);
    let reshi = __hi;
    return packU128Val(reshi, reslo);
}

/**
 * Multiplies and devides i128 numbers without overflow in multiplication part (number * numerator / denominator).
 * Supports positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) values.
 * Traps if any of the given values are negative. To avoid, use "isNegative()".
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns I128Val as the result of number * numerator / denominator.
 */
export function i128muldiv(number:I128Val, numerator:I128Val, denominator: I128Val) : I128Val {
    if (isNegative(number) || isNegative(numerator) || isNegative(denominator)) {
        context.fail();
    }
    let alo = getI128Parts(number);
    let ahi = __reshi;
    let blo = getI128Parts(numerator);
    let bhi = __reshi;
    let clo = getI128Parts(denominator);
    let chi = __reshi;
    let reslo = muldiv(alo, ahi, blo, bhi, clo, chi);
    let reshi = __hi;
    return packI128Val(reshi, reslo);
}

/**
 * Multiplies and devides u128 numbers without overflow in multiplication part (number * numerator / denominator).
 * Traps if not U128Val (U128Object or U128SmallVal) values.
 * @param a first I128Val.
 * @param b second I128Val.
 * @returns U128Val as the result of a / b
 */
export function u128muldiv(number:U128Val, numerator:U128Val, denominator: U128Val) : U128Val {

    let alo = getU128Parts(number);
    let ahi = __reshi;
    let blo = getU128Parts(numerator);
    let bhi = __reshi;
    let clo = getU128Parts(denominator);
    let chi = __reshi;
    let reslo = muldiv(alo, ahi, blo, bhi, clo, chi);
    let reshi = __hi;
    return packU128Val(reshi, reslo);
}

/**
 * Compute floor(sqrt(val)).
 * Supports positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) value.
 * Traps if value is negative. To avoid, use "isNegative()".
 * @param val value
 * @returns result.
 */
export function i128sqrt(val:I128Val) : I128Val {
    if (isNegative(val) || isNegative(val)) {
        context.fail();
    }
    let vlo = getI128Parts(val);
    let vhi = __reshi;
    let reslo = sqrt(vlo, vhi);
    let reshi = __hi;
    return packI128Val(reshi, reslo);
}

/**
 * Compute floor(sqrt(val)).
 * Traps if not U128Val (U128Object or U128SmallVal) value.
 * @param val value
 * @returns result
 */
export function u128sqrt(val:U128Val) : U128Val {
    let vlo = getU128Parts(val);
    let vhi = __reshi;
    let reslo = sqrt(vlo, vhi);
    let reshi = __hi;
    return packU128Val(reshi, reslo);
}

/**
 * Calculate power of base with exponent.
 * Supports positive values.
 * Traps if not I128Val (I128Object or I128SmallVal) value.
 * Traps if value is negative. To avoid, use "isNegative()".
 * @param base base
 * @param exponent exponent
 * @returns result
 */
export function i128pow(base:I128Val, exponent:i32) : I128Val {
    if (isNegative(base) || isNegative(base)) {
        context.fail();
    }
    let vlo = getI128Parts(base);
    let vhi = __reshi;
    let reslo = pow(vlo, vhi, exponent);
    let reshi = __hi;
    return packI128Val(reshi, reslo);
}

/**
 * Calculate power of base with exponent.
 * Traps if not U128Val (U128Object or U128SmallVal) value.
 * @param base base
 * @param exponent exponent
 * @returns result.
 */
export function u128pow(base:U128Val, exponent:i32) : U128Val {
    let vlo = getU128Parts(base);
    let vhi = __reshi;
    let reslo = pow(vlo, vhi, exponent);
    let reshi = __hi;
    return packU128Val(reshi, reslo);
}

/*****************
HELPERS
*****************/

// for internal usage only.
var __reshi: u64 = 0;

// returns lo part of the given i128 host val. Hi part is stored in __hi.
// trasps if value does not represent an i128 host value (I128Object or I128SmallVal)
function getI128Parts(value:I128Val) : u64 {
    let alo:u64 = 0;
    if (isI128Small(value)) {
        alo = toI128Small(value);
        __reshi = 0;
    } else if (isI128Object(value)) {
        alo = toI128Low64(value);
        __reshi = toI128High64(value);
    } else {
        context.fail();
    }
    return alo;
}

// returns lo part of the given u128 host val. Hi part is stored in __hi.
// trasps if value does not represent an u128 host value (U128Object or U128SmallVal)
function getU128Parts(value:U128Val) : u64 {
    let alo:u64 = 0;
    if (isU128Small(value)) {
        alo = toU128Small(value);
        __reshi = 0;
    } else if (isU128Object(value)) {
        alo = toU128Low64(value);
        __reshi = toU128High64(value);
    } else {
        context.fail();
    }
    return alo;
}

// converts a positive i128 into a raw host value. If it fits into 56 bits it returns I128SmallVal
// otherwise it returns an I128Object.
function packI128Val(vhi: u64, vlo: u64) : I128Val {
    if (vhi == 0 && vlo <= 0xFFFFFFFFFFFF) { // 56 bits
        return fromI128Small(vlo);
    } else {
        return fromI128Pieces(vhi, vlo);
    }
}

// converts a positive u128 into a raw host value. If it fits into 56 bits it returns U128SmallVal
// otherwise it returns an U128Object.
function packU128Val(vhi: u64, vlo: u64) : U128Val {
    if (vhi == 0 && vlo <= 0xFFFFFFFFFFFF) { // 56 bits
        return fromU128Small(vlo);
    } else {
        return fromU128Pieces(vhi, vlo);
    }
}

