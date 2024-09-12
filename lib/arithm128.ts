// Offers arithmetic helper functions for I128Val and U128Val host values.
// Uses u256 and i256 host functions to make the calculations.
// Supports positive values (TODO: negative values).

import * as context from "./context";
import { i256_add, i256_div, i256_mul, i256_pow, i256_rem_euclid, i256_shl, i256_shr, i256_sub, u256_add, u256_div, u256_mul, u256_pow, u256_rem_euclid, u256_shl, u256_shr } from "./env";
import { I128Val, I256Val, U128Val, U256Val, U32Val, Val, errorCodeArithDomain, errorTypeObject, fromError, fromI128Pieces, fromI128Small, fromI256Pieces,
    fromI256Small,fromU128Pieces, fromU128Small, fromU256Pieces, fromU256Small, isError, isI128Object, isI128Small, isI256Object, isI256Small, isU128Object, isU128Small, isU256Object, 
    isU256Small, toI128High64, toI128Low64, toI128Small, toI256HiHi, toI256HiLo, toI256LoHi, toI256LoLo, toI256Small, toU128High64, toU128Low64, toU128Small, 
    toU256HiHi, toU256HiLo, toU256LoHi, toU256LoLo, toU256Small} from "./value";

/*****************
Unsigned U128 
*****************/

// Performs checked unsigned integer addition. Computes `lhs + rhs`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the u256_add host function to perform the addition.
export function u128Add(lhs:U128Val, rhs:U128Val) : Val {
    let a256 = getU256FromU128(lhs);
    let b256 = getU256FromU128(rhs);
    let ru256 = u256_add(a256, b256);
    return getU128FromU256(ru256);
}

// Performs unsigned integer addition. Computes `lhs + rhs`, 
// returning U256Val (U256Small or U256Object) so that no overflow can occur.
// Uses the u256_add host function to perform the addition.
export function u128AddToU256(lhs:U128Val, rhs:U128Val) : U256Val {
    let a256 = getU256FromU128(lhs);
    let b256 = getU256FromU128(rhs);
    return u256_add(a256, b256);
}

// Performs checked unsigned integer subtraction. Computes `lhs - rhs`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if underflow occurred (result < 0).
// Uses the i256_sub host function to perform the subtraction.
export function u128Sub(lhs:U128Val, rhs:U128Val) : Val {
    let a256 = getI256FromU128(lhs);
    let b256 = getI256FromU128(rhs);
    let ri256 = i256_sub(a256, b256);
    return getU128FromI256(ri256);
}

// Performs unsigned integer subtraction. Computes `lhs - rhs`, 
// returning I256Val (I256Small or I256Object) so that no underflow can occur.
// Uses the i256_sub host function to perform the subtraction.
export function u128SubToI256(lhs:U128Val, rhs:U128Val) : I256Val {
    let a256 = getI256FromU128(lhs);
    let b256 = getI256FromU128(rhs);
    return i256_sub(a256, b256);
}

// Performs checked unsigned integer multiplication. Computes `lhs * rhs`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the u256_mul host function to perform the multiplication.
export function u128Mul(lhs:U128Val, rhs:U128Val) : Val {
    let a256 = getU256FromU128(lhs);
    let b256 = getU256FromU128(rhs);
    let ru256 = u256_mul(a256, b256);
    return getU128FromU256(ru256);
}

// Performs unsigned integer multiplication. Computes `lhs * rhs`, 
// returning U256Val (U256Small or U256Object) so that no overflow can occur.
// Uses the u256_mul host function to perform the multiplication.
export function u128MulToU256(lhs:U128Val, rhs:U128Val) : U256Val {
    let a256 = getU256FromU128(lhs);
    let b256 = getU256FromU128(rhs);
    return u256_mul(a256, b256);
}

// Performs checked unsigned integer division. Computes `lhs / rhs`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if rhs == 0. 
// Uses the u256_div host function to perform the division.
export function u128Div(lhs:U128Val, rhs:U128Val) : Val {
    let b256 = getU256FromU128OrErrorIfZero(rhs);
    if (isError(b256)) {
        return b256;
    }
    let a256 = getU256FromU128(lhs);
    let ru256 = u256_div(a256, b256);
    return getU128FromU256(ru256);
}

// Performs checked unsigned integer Euclidean modulo. Computes `lhs % rhs`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if rhs == 0. 
// Uses the u256_rem_euclid host function to perform the modulo.
export function u128RemEuclid(lhs:U128Val, rhs:U128Val) : Val {
    let b256 = getU256FromU128OrErrorIfZero(rhs);
    if (isError(b256)) {
        return b256;
    }
    let a256 = getU256FromU128(lhs);
    let ru256 = u256_rem_euclid(a256, b256);
    return getU128FromU256(ru256);
}

// Performs checked unsigned integer exponentiation. Computes `lhs.exp(rhs)`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the u256_pow host function to perform the exponentiation.
export function u128Pow(lhs:U128Val, rhs:U32Val) : Val {
    let a256 = getU256FromU128(lhs);
    let ru256 = u256_pow(a256, rhs);
    return getU128FromU256(ru256);
}

// Performs unsigned integer exponentiation. Computes `lhs.exp(rhs)`, 
// returning U256Val (U256Small or U256Object). Traps if u256 overflow occurs.
// Uses the u256_pow host function to perform the exponentiation.
export function u128PowToU256(lhs:U128Val, rhs:U32Val) : U256Val {
    let a256 = getU256FromU128(lhs);
    return u256_pow(a256, rhs);
}

// Performs checked unsigned integer shift left. Computes `lhs << rhs`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the u256_shl host function to perform the shift left. 
// Traps if u256_shl error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function u128Shl(lhs:U128Val, rhs:U32Val) : Val {
    let a256 = getU256FromU128(lhs);
    let ru256 = u256_shl(a256, rhs);
    return getU128FromU256(ru256);
}

// Performs unsigned integer shift left. Computes `lhs << rhs`, 
// returning U256Val (U256Small or U256Object). Traps if u256 overflow occurs.
// Uses the u256_shl host function to perform the shift left. 
// Traps if u256_shl error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function u128ShlToU256(lhs:U128Val, rhs:U32Val) : Val {
    let a256 = getU256FromU128(lhs);
    return u256_shl(a256, rhs);
}

// Performs checked unsigned integer shift right. Computes `lhs >> rhs`, 
// returning U128Val (U128Small or U128Object).
// Uses the u256_shr host function to perform the shift right. 
// Traps if u256_shr error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function u128Shr(lhs:U128Val, rhs:U32Val) : Val {
    let a256 = getU256FromU128(lhs);
    let ru256 = u256_shr(a256, rhs);
    return getU128FromU256(ru256);
}

// Performs unsigned integer shift right. Computes `lhs >> rhs`, 
// returning U256Val (U256Small or U256Object). 
// Uses the u256_shr host function to perform the shift right. 
// Traps if u256_shr error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function u128ShrToU256(lhs:U128Val, rhs:U32Val) : Val {
    let a256 = getU256FromU128(lhs);
    return u256_shr(a256, rhs);
}


/********************************************************************
Signed I128 (only positive values allowed at this time)
********************************************************************/

// Performs checked signed integer addition. Computes `lhs + rhs`, 
// returning `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the i256_add host function to perform the addition.
// Performs checked unsigned integer addition. Computes `lhs + rhs`, 
// returning U128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the u256_add host function to perform the addition.
export function i128Add(lhs:I128Val, rhs:I128Val) : Val {
    let a256 = getI256FromI128(lhs);
    let b256 = getI256FromI128(rhs);
    let ru256 = i256_add(a256, b256);
    return getI128FromI256(ru256);
}

// Performs signed integer addition. Computes `lhs + rhs`, 
// returning I256Val (I256Small or I256Object) so that no overflow can occur.
// Uses the i256_add host function to perform the addition.
export function i128AddToI256(lhs:I128Val, rhs:I128Val) : I256Val {
    let a256 = getI256FromI128(lhs);
    let b256 = getI256FromI128(rhs);
    return i256_add(a256, b256);
}

// Performs checked signed integer subtraction. Computes `lhs - rhs`, 
// returning I128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred.
// Uses the i256_sub host function to perform the subtraction.
export function i128Sub(lhs:I128Val, rhs:I128Val) : Val {
    let a256 = getI256FromI128(lhs);
    let b256 = getI256FromI128(rhs);
    let ru256 = i256_sub(a256, b256);
    return getI128FromI256(ru256);
}

// Performs signed integer subtraction. Computes `lhs - rhs`, 
// returning I256Val (I256Small or I256Object) so that no overflow can occur.
// Uses the i256_sub host function to perform the subtraction.
export function i128SubToI256(lhs:I128Val, rhs:I128Val) : I256Val {
    let a256 = getI256FromI128(lhs);
    let b256 = getI256FromI128(rhs);
    return i256_sub(a256, b256);
}

// Performs checked signed integer multiplication. Computes `lhs * rhs`, 
// returning I128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the i256_mul host function to perform the multiplication.
export function i128Mul(lhs:I128Val, rhs:I128Val) : Val {
    let a256 = getI256FromI128(lhs);
    let b256 = getI256FromI128(rhs);
    let ru256 = i256_mul(a256, b256);
    return getI128FromI256(ru256);
}

// Performs signed integer multiplication. Computes `lhs * rhs`, 
// returning I256Val (I256Small or I256Object) so that no overflow can occur.
// Uses the i256_mul host function to perform the multiplication.
export function i128MulToI256(lhs:I128Val, rhs:I128Val) : I256Val {
    let a256 = getI256FromI128(lhs);
    let b256 = getI256FromI128(rhs);
    return i256_mul(a256, b256);
}

// Performs checked signed integer division. Computes `lhs / rhs`, 
// returning I128Val or `Error` (errorTypeObject, errorCodeArithDomain) if rhs == 0. 
// Uses the i256_div host function to perform the division.
export function i128Div(lhs:I128Val, rhs:I128Val) : Val {
    let b256 = getI256FromI128OrErrorIfZero(rhs);
    if (isError(b256)) {
        return b256;
    }
    let a256 = getI256FromI128(lhs);
    let ri256 = i256_div(a256, b256);
    return getI128FromI256(ri256);
}

// Performs checked signed integer Euclidean modulo. Computes `lhs % rhs`, 
// returning I128Val or `Error` (errorTypeObject, errorCodeArithDomain) if rhs == 0. 
// Uses the i256_rem_euclid host function to perform the modulo.
export function i128RemEuclid(lhs:I128Val, rhs:I128Val) : Val {
    let b256 = getI256FromI128OrErrorIfZero(rhs);
    if (isError(b256)) {
        return b256;
    }
    let a256 = getI256FromI128(lhs);
    let ri256 = i256_rem_euclid(a256, b256);
    return getI128FromI256(ri256);
}

// Performs checked signed integer exponentiation. Computes `lhs.exp(rhs)`, 
// returning I128Val or `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the i256_pow host function to perform the exponentiation.
export function i128Pow(lhs:I128Val, rhs:U32Val) : Val {
    let a256 = getI256FromI128(lhs);
    let ri256 = i256_pow(a256, rhs);
    return getI128FromI256(ri256);
}

// Performs signed integer exponentiation. Computes `lhs.exp(rhs)`, 
// returning I256Val (I256Small or I256Object). Traps if i256 overflow occurs.
// Uses the i256_pow host function to perform the exponentiation.
export function i128PowToI256(lhs:I128Val, rhs:U32Val) : I256Val {
    let a256 = getI256FromI128(lhs);
    return i256_pow(a256, rhs);
}

// Performs checked signed integer shift left. Computes `lhs << rhs`, 
// returning `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the i256_shl host function to perform the shift left. 
// Traps if i256_shl error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function i128Shl(lhs:I128Val, rhs:U32Val) : Val {
    let a256 = getI256FromI128(lhs);
    let ri256 = i256_shl(a256, rhs);
    return getI128FromI256(ri256);
}

// Performs signed integer shift left. Computes `lhs << rhs`, 
// returning I256Val (I256Small or I256Object). Traps if i256 overflow occurs.
// Uses the i256_shl host function to perform the shift left. 
// Traps if i256_shl error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function i128ShlToI256(lhs:I128Val, rhs:U32Val) : Val {
    let a256 = getI256FromI128(lhs);
    return i256_shl(a256, rhs);
}

// Performs checked signed integer shift right. Computes `lhs >> rhs`, 
// returning `Error` (errorTypeObject, errorCodeArithDomain) if overflow occurred. 
// Uses the i256_shr host function to perform the shift right. 
// Traps if i256_shr error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function i128Shr(lhs:I128Val, rhs:U32Val) : Val {
    let a256 = getI256FromI128(lhs);
    let ri256 = i256_shr(a256, rhs);
    return getI128FromI256(ri256);
}

// Performs signed integer shift right. Computes `lhs >> rhs`, 
// returning I256Val (I256Small or I256Object). 
// Uses the i256_shr host function to perform the shift right. 
// Traps if i256_shr error occurs (if `rhs` is larger than or equal to the number of bits in `lhs`)
export function i128ShrToI256(lhs:U128Val, rhs:U32Val) : Val {
    let a256 = getI256FromI128(lhs);
    return i256_shr(a256, rhs);
}

/*****************
HELPERS
*****************/

function getU256FromU128(value:U128Val) : U256Val {
    if (isU128Small(value)) {
        return fromU256Small(toU128Small(value));
    } else if (isU128Object(value)) {
        let u128lo = toU128Low64(value);
        let u128hi = toU128High64(value);
        return fromU256Pieces(0, 0, u128hi, u128lo);
    } else {
        context.fail();
        return 0;
    }
}

function getU256FromU128OrErrorIfZero(value:U128Val) : U256Val {
    if (isU128Small(value)) {
        let small = toU128Small(value);
        if (small == 0) {
            return fromError(errorTypeObject, errorCodeArithDomain);
        }
        return fromU256Small(small);
    } else if (isU128Object(value)) {
        let u128lo = toU128Low64(value);
        let u128hi = toU128High64(value);
        if (u128lo == 0 && u128hi == 0) {
            return fromError(errorTypeObject, errorCodeArithDomain);
        }
        return fromU256Pieces(0, 0, u128hi, u128lo);
    } else {
        context.fail();
        return 0;
    }
}

function getI256FromU128(value:U128Val) : I256Val {
    if (isU128Small(value)) {
        return fromI256Small(toU128Small(value));
    } else if (isU128Object(value)) {
        let u128lo = toU128Low64(value);
        let u128hi = toU128High64(value);
        return fromI256Pieces(0, 0, u128hi, u128lo);
    } else {
        context.fail();
        return 0;
    }
}

function getU128FromU256(value:U256Val) : Val {
    if(isU256Small(value)) {
        let rlo = toU256Small(value);
        return fromU128Small(rlo);
    } else if (isU256Object(value) && toU256HiLo(value) == 0 && toU256HiHi(value) == 0) {
        let u256lolo = toU256LoLo(value);
        let u256lohi = toU256LoHi(value);
        return fromU128Pieces(u256lohi, u256lolo);
    } else {
        return fromError(errorTypeObject, errorCodeArithDomain);
    }
}

function getU128FromI256(value:I256Val) : Val {
    if(isI256Small(value)) {
        let rlo = toI256Small(value);
        if (rlo < 0) {
            return fromError(errorTypeObject, errorCodeArithDomain);
        }
        return fromU128Small(rlo);
    } else if (isI256Object(value) && toI256HiLo(value) == 0 && toI256HiHi(value) == 0) {
        let i256lolo = toI256LoLo(value);
        let i256lohi = toI256LoHi(value);
        return fromU128Pieces(i256lohi, i256lolo);
    } else {
        return fromError(errorTypeObject, errorCodeArithDomain);
    }
}

function isNegative(value:I128Val) : bool {
    if (isI128Small(value)) {
        return toI128Small(value) < 0;
    } else if (isI128Object(value)) {
        return toI128High64(value) < 0;
    } else {
        context.fail();
        return 0;
    }
}

function getI256FromI128(value:I128Val) : I256Val {
    if (isI128Small(value)) {
        let smallValue = toI128Small(value);
        if (smallValue < 0) {
            // TODO: negative values
            return fromError(errorTypeObject, errorCodeArithDomain);
        }
        return fromI256Small(toI128Small(value));
    } else if (isI128Object(value)) {
        let i128hi = toI128High64(value);
        if (i128hi < 0) {
            // TODO: negative values
            return fromError(errorTypeObject, errorCodeArithDomain);
        }
        let i128lo = toI128Low64(value);
        return fromI256Pieces(0, 0, i128hi as u64, i128lo);
    } else {
        context.fail();
        return 0;
    }
}

function getI256FromI128OrErrorIfZero(value:I128Val) : Val {
    if (isI128Small(value)) {
        let small = toI128Small(value);
        if (small <= 0) {
            // TODO: negative values
            return fromError(errorTypeObject, errorCodeArithDomain);
        }
        return fromI256Small(small);
    }
    else if (isI128Object(value)) {
        let lo = toI128Low64(value);
        let hi = toI128High64(value);
        if (hi < 0 || (lo == 0 && hi == 0)) {
            // TODO: negative values
            return fromError(errorTypeObject, errorCodeArithDomain);
        }
        return fromI256Pieces(0, 0, hi as u64, lo);
    } else {
        context.fail();
        return 0;
    }
}

function getI128FromI256(value:I256Val) : Val {
    if(isI256Small(value)) {
        let rlo = toI256Small(value);
        return fromI128Small(rlo);
    } else if (isI256Object(value) && toI256HiLo(value) == 0) {
        let i256lohi = toI256LoHi(value);
        let i256hihi = toI256HiHi(value);
        if (i256hihi == 0 && i256lohi <= (i64.MAX_VALUE as u64)) {
            return fromI128Pieces((i256lohi as i64), toI256LoLo(value));
        } else if (i256hihi == -1 && i256lohi <= ((i64.MIN_VALUE * -1) as u64)) {
            // TODO: fix this (i256lohi may be different for neg. values)
            return fromI128Pieces((i256lohi as i64) * -1, toI256LoLo(value));
        }
    } 
    return fromError(errorTypeObject, errorCodeArithDomain);

}