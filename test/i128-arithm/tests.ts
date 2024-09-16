import {BoolVal, errorCodeArithDomain, errorTypeObject, fromFalse, fromTrue, 
    fromI128Pieces, getErrorCode, getErrorType, isError, isI128Small, 
    fromI128Small, toI128Small, isI128Object, toI128Low64,toI128High64,
    fromU32} from "../../lib/value";
import { i128Add, i128Compare, i128Div, i128IsEqual, i128IsGreaterThan, i128IsLowerThan, i128Mul, i128MulDiv, i128Pow, i128RemEuclid, i128Shl, i128Shr, i128Sub, isI128Negative } from "../../lib/arithm128";
import * as u128 from "../../lib/u128_math";

export function testI128Add():BoolVal {
    let falseVal = fromFalse();

    // small + small
    let lhs =  fromI128Small(2);
    let rhs =  fromI128Small(2);
    let res = i128Add(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 4) {
        return falseVal;
    }

    // small + ( - small)
    rhs = fromI128Small(-4);
    res = i128Add(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != -2) {
        return falseVal;
    }

    // (- small) + ( - small)
    lhs = fromI128Small(-2);
    rhs = fromI128Small(-4);
    res = i128Add(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != -6) {
        return falseVal;
    }

    // @ts-ignore
    const i64Max = i64.MAX_VALUE;

    // @ts-ignore
    const u64Max = u64.MAX_VALUE;

    // small + obj
    rhs = fromI128Small(2);
    lhs = fromI128Pieces(i64Max, 10)
    res = i128Add(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 12 || hi != i64Max) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // - small + obj
    rhs = fromI128Small(-2);
    lhs = fromI128Pieces(i64Max, 10)
    res = i128Add(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 8 || hi != i64Max) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // @ts-ignore
    const i64Min = i64.MIN_VALUE;

    // small + -obj
    rhs = fromI128Small(2);
    lhs = fromI128Pieces(i64Min, 10)
    res = i128Add(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 12 || hi != i64Min) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // -small + -obj
    rhs = fromI128Small(-2);
    lhs = fromI128Pieces(i64Min, 10)
    res = i128Add(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 8 || hi != i64Min) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj + obj
    lhs = fromI128Pieces(1, u64Max);
    rhs = fromI128Pieces(10, 1);
    res = i128Add(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 0 || hi != 12) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj + -obj
    lhs = fromI128Pieces(1, u64Max);
    rhs = fromI128Pieces(-10, 1);
    res = i128Add(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 0 || hi != -8) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj + -obj
    lhs = fromI128Pieces(1, u64Max - 2);
    rhs = fromI128Pieces(-1, u64Max - 2);
    res = i128Add(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != u64Max - 5 || hi != 1) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // overflow
    lhs = fromI128Pieces(i64Max, u64Max);
    res = i128Add(lhs, fromI128Small(1));
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testI128Sub():BoolVal {
    let falseVal = fromFalse();

    // small - small
    let lhs =  fromI128Small(4);
    let rhs =  fromI128Small(2);
    let res = i128Sub(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 2) {
        return falseVal;
    }

    // small - ( - small)
    rhs = fromI128Small(-4);
    res = i128Sub(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 8) {
        return falseVal;
    }

    // (- small) - ( - small)
    lhs = fromI128Small(-2);
    rhs = fromI128Small(-4);
    res = i128Sub(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 2) {
        return falseVal;
    }

    // small - small neg res
    lhs =  fromI128Small(4);
    rhs =  fromI128Small(8);
    res = i128Sub(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != -4) {
        return falseVal;
    }

    // @ts-ignore
    const i64Max = i64.MAX_VALUE;
    
    // obj - small
    lhs = fromI128Pieces(i64Max, 10)
    rhs =  fromI128Small(2);
    res = i128Sub(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 8 || hi != i64Max) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj - (-small)
    lhs = fromI128Pieces(i64Max, 10)
    rhs =  fromI128Small(-2);
    res = i128Sub(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 12 || hi != i64Max) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }
        
    
    // obj - obj
    lhs = fromI128Pieces(10, i64Max);
    rhs =  fromI128Pieces(9, 10);
    res = i128Sub(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != i64Max - 10 || hi != 1) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }
   
    
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;

    // obj - obj neg result
    lhs = fromI128Pieces(1, u64Max - 2);
    rhs = fromI128Pieces(1, u64Max);
    res = i128Sub(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != -2) {
        return falseVal;
    }

    return fromTrue();
 
}

export function testI128Mul():BoolVal {
    let falseVal = fromFalse();

    // small * small
    let lhs =  fromI128Small(2);
    let rhs =  fromI128Small(2);
    let res = i128Mul(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 4) {
        return falseVal;
    }

    // small * -small
    rhs =  fromI128Small(-2);
    res = i128Mul(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != -4) {
        return falseVal;
    }
    
    // small * obj
    lhs = fromI128Pieces(10, 10)
    rhs =  fromI128Small(2);
    res = i128Mul(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 20 || hi != 20) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj * (-small)
    lhs = fromI128Pieces(10, 10)
    rhs =  fromI128Small(-2);
    res = i128Mul(lhs, rhs);
    res = i128Div(res, rhs);
    if (isI128Object(res)) {
        let resLo = toI128Low64(res);
        let resHi = toI128High64(res);
        let lo = toI128Low64(lhs);
        let hi = toI128High64(lhs);
        if (lo != resLo || hi != resHi) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }
    
    // obj * obj
    lhs = fromI128Pieces(0, 75057594000000000);
    rhs =  fromI128Pieces(0, 75057594000000000);
    res = i128Mul(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 219342094686224384 || hi != 305400367379626) {
            return falseVal;
        }
    } else {
        return falseVal;
    }

    rhs = fromI128Pieces(-1, 75057594000000000);
    res = i128Mul(lhs, rhs);
    res = i128Div(res, rhs);
    if (isI128Object(res)) {
        let resLo = toI128Low64(res);
        let resHi = toI128High64(res);
        let lo = toI128Low64(lhs);
        let hi = toI128High64(lhs);
        if (lo != resLo || hi != resHi) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj * obj / obj (muldiv)
    let number = fromI128Pieces(0, 75057594000000000);
    let nominator =  fromI128Pieces(1000, 75057594000000000);
    let denominator =  fromI128Pieces(0, 300);
    res = i128MulDiv(number, nominator, denominator);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 13897278342510149632 || hi != 250192998001224598) {
            return falseVal;
        }
        
        let b_lo = u128.muldiv(75057594000000000, 0, 75057594000000000, 1000, 300, 0);
        let b_hi = u128.__hi;

        if (!i128IsEqual(res, fromI128Pieces(b_hi, b_lo))) {
            return falseVal;
        }
    } else {
        return falseVal;
    }

    // @ts-ignore
    const i64Max = i64.MAX_VALUE;
    
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    // overflow
    lhs = fromI128Pieces(i64Max, u64Max);
    rhs = fromI128Pieces(i64Max, u64Max);
    res = i128Mul(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testI128Div():BoolVal {
    let falseVal = fromFalse();

    // small / small
    let lhs =  fromI128Small(4);
    let rhs =  fromI128Small(2);
    let res = i128Div(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 2) {
        return falseVal;
    }

    // small / -small
    rhs =  fromI128Small(-2);
    res = i128Div(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != -2) {
        return falseVal;
    }
    
    // obj / small
    lhs = fromI128Pieces(10, 10)
    rhs =  fromI128Small(2);
    res = i128Div(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 5 || hi != 5) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj / (-small)
    lhs = fromI128Pieces(10, 10)
    rhs =  fromI128Small(-2);
    res = i128Div(lhs, rhs);
    res = i128Mul(res, rhs);
    if (isI128Object(res)) {
        let resLo = toI128Low64(res);
        let resHi = toI128High64(res);
        let lo = toI128Low64(lhs);
        let hi = toI128High64(lhs);
        if (lo != resLo || hi != resHi) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    // @ts-ignore
    const i64Max = i64.MAX_VALUE;

    // obj / obj
    lhs = fromI128Pieces(i64Max, u64Max);
    rhs = fromI128Pieces(0, 75057594000000000);
    res = i128Div(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 16305608318443096371 || hi != 122) {
            return falseVal;
        }
    } else {
        return falseVal;
    }

    // obj / -obj
    lhs = fromI128Pieces(i64Max, u64Max);
    rhs = fromI128Pieces(-1, 200);
    res = i128Div(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 9223372036854775708 || hi != -1) {
            return falseVal;
        }
    } else {
        return falseVal;
    }

    // overflow
    lhs = fromI128Pieces(i64Max, u64Max);
    rhs = fromI128Small(0);
    res = i128Div(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testI128RemEuclid():BoolVal {
    let falseVal = fromFalse();

    // small % small
    let lhs =  fromI128Small(4);
    let rhs =  fromI128Small(3);
    let res = i128RemEuclid(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 1) {
        return falseVal;
    }

    // small % -small
    rhs =  fromI128Small(-3);
    res = i128RemEuclid(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 1) {
        return falseVal;
    }

    // obj % -small
    lhs = fromI128Pieces(0, 7505759400002)
    res = i128RemEuclid(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 2) {
        return falseVal;
    }

    // obj % small
    lhs = fromI128Pieces(0, 7505759400002)
    rhs =  fromI128Small(3);
    res = i128RemEuclid(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 2) {
        return falseVal;
    }

    // obj % obj
    lhs = fromI128Pieces(0, 75057594000000015);
    rhs = fromI128Pieces(0, 75057594000000000);
    res = i128RemEuclid(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 15) {
        return falseVal;
    }

    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    // @ts-ignore
    const i64Max = i64.MAX_VALUE;

    // overflow
    lhs = fromI128Pieces(i64Max, u64Max);
    rhs = fromI128Small(0);
    res = i128RemEuclid(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testI128Pow():BoolVal {
    let falseVal = fromFalse();

    // small ^ u32
    let lhs =  fromI128Small(2);
    let rhs =  fromU32(2);
    let res = i128Pow(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 4) {
        return falseVal;
    }

    // obj ^ u32
    lhs = fromI128Pieces(0, 75057594000000000);
    res = i128Pow(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 219342094686224384 || hi != 305400367379626) {
            return falseVal;
        }
        
        let b_lo = u128.pow(75057594000000000, 0, 2);
        let b_hi = u128.__hi;

        if (!u128.eq(b_lo, b_hi, lo, hi)) {
            return falseVal;
        }

    } else {
        return falseVal;
    }

    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    // @ts-ignore
    const i64Max = i64.MAX_VALUE;

    // overflow
    lhs = fromI128Pieces(i64Max, u64Max);
    res = i128Pow(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testI128Shl():BoolVal {
    let falseVal = fromFalse();

    // small << u32
    let lhs =  fromI128Small(2);
    let rhs =  fromU32(2);
    let res = i128Shl(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 8) {
        return falseVal;
    }

    // obj << small
    lhs = fromI128Pieces(0, 75057594000000000);
    rhs =  fromU32(10);
    res = i128Shl(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 3071999961161793536 || hi != 4) {
            return falseVal;
        }
    } else {
        return falseVal;
    }

    // @ts-ignore
    const u64Max = u64.MAX_VALUE;    
    // @ts-ignore
    const i64Max = i64.MAX_VALUE;

    // overflow
    lhs = fromI128Pieces(i64Max, u64Max);
    res = i128Shl(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testI128Shr():BoolVal {
    let falseVal = fromFalse();

    // small << u32
    let lhs =  fromI128Small(8);
    let rhs =  fromU32(2);
    let res = i128Shr(lhs, rhs);
    if (!isI128Small(res) || toI128Small(res) != 2) {
        return falseVal;
    }
        
    // obj << small
    lhs = fromI128Pieces(4, 3071999961161793536);
    rhs =  fromU32(10);
    res = i128Shr(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 75057594000000000 || hi != 0) {
            return falseVal;
        }
    } else {
        return falseVal;
    }

    // this will trap:
    /*lhs = fromI128Small(0);
    rhs =  fromU32(4294967290);
    res = i128Shr(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }*/

    return fromTrue();
}

export function testI128Util():BoolVal {
    let falseVal = fromFalse();

    if (!isI128Negative(fromI128Small(-8))) {
        return falseVal;
    }
    if (!isI128Negative(fromI128Pieces(-1,1))) {
        return falseVal;
    }
    if (isI128Negative(fromI128Pieces(1,1))) {
        return falseVal;
    }
    if (isI128Negative(fromI128Small(8))) {
        return falseVal;
    }

    if (i128Compare(fromI128Small(8), fromI128Small(8)) != 0) {
        return falseVal;
    }
    if (!i128IsEqual(fromI128Small(8), fromI128Small(8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Small(7), fromI128Small(8)) != -1) {
        return falseVal;
    }
    if (i128IsEqual(fromI128Small(7), fromI128Small(8))) {
        return falseVal;
    }
    if (i128IsGreaterThan(fromI128Small(7), fromI128Small(8))) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Small(7), fromI128Small(8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Small(9), fromI128Small(8)) != 1) {
        return falseVal;
    }
    if (i128Compare(fromI128Small(-8), fromI128Small(-8)) != 0) {
        return falseVal;
    }
    if (!i128IsEqual(fromI128Small(-8), fromI128Small(-8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Small(-7), fromI128Small(-8)) != 1) {
        return falseVal;
    }
    if (!i128IsGreaterThan(fromI128Small(-7), fromI128Small(-8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Small(-9), fromI128Small(-8)) != -1) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Small(-9), fromI128Small(-8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Small(-9), fromI128Small(8)) != -1) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Small(-9), fromI128Small(8))) {
        return falseVal;
    }

    if (i128Compare(fromI128Pieces(1,5), fromI128Pieces(1,5)) != 0) {
        return falseVal;
    }
    if (!i128IsEqual(fromI128Pieces(1,5), fromI128Pieces(1,5))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(1,4), fromI128Pieces(1,5)) != -1) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Pieces(1,4), fromI128Pieces(1,5))) {
        return falseVal;
    }
    if (i128IsGreaterThan(fromI128Pieces(1,4), fromI128Pieces(1,5))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(1,6), fromI128Pieces(1,5)) != 1) {
        return falseVal;
    }
    if (!i128IsGreaterThan(fromI128Pieces(1,6), fromI128Pieces(1,5))) {
        return falseVal;
    }
    if (i128IsLowerThan(fromI128Pieces(1,6), fromI128Pieces(1,5))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(-1,5), fromI128Pieces(-1,5)) != 0) {
        return falseVal;
    }
    if (!i128IsEqual(fromI128Pieces(-1,5), fromI128Pieces(-1,5))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(-1,5), fromI128Pieces(-1,4)) != 1) {
        return falseVal;
    }
    if (i128IsLowerThan(fromI128Pieces(-1,5), fromI128Pieces(-1,4))) {
        return falseVal;
    }
    if (!i128IsGreaterThan(fromI128Pieces(-1,5), fromI128Pieces(-1,4))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(-1,5), fromI128Pieces(-1,6)) != -1) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Pieces(-1,5), fromI128Pieces(-1,6))) {
        return falseVal;
    }
    if (i128IsGreaterThan(fromI128Pieces(-1,5), fromI128Pieces(-1,6))) {
        return falseVal;
    }

    if (i128Compare(fromI128Pieces(1,5), fromI128Small(8)) != 1) {
        return falseVal;
    }
    if (i128IsEqual(fromI128Pieces(1,5), fromI128Small(8))) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Pieces(-1,5), fromI128Small(8))) {
        return falseVal;
    }
    if (i128IsGreaterThan(fromI128Pieces(-1,5), fromI128Small(8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(1,5), fromI128Small(-8)) != 1) {
        return falseVal;
    }
    if (i128IsEqual(fromI128Pieces(1,5), fromI128Small(-8))) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Pieces(-1,5), fromI128Small(-8))) {
        return falseVal;
    }
    if (i128IsGreaterThan(fromI128Pieces(-1,5), fromI128Small(-8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(-1,5), fromI128Small(8)) != -1) {
        return falseVal;
    }
    if (i128IsEqual(fromI128Pieces(-1,5), fromI128Small(8))) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Pieces(-1,5), fromI128Small(8))) {
        return falseVal;
    }
    if (i128IsGreaterThan(fromI128Pieces(-1,5), fromI128Small(8))) {
        return falseVal;
    }
    if (i128Compare(fromI128Pieces(-1,5), fromI128Small(-8)) != -1) {
        return falseVal;
    }
    if (i128IsEqual(fromI128Pieces(-1,5), fromI128Small(-8))) {
        return falseVal;
    }
    if (!i128IsLowerThan(fromI128Pieces(-1,5), fromI128Small(-8))) {
        return falseVal;
    }
    if (i128IsGreaterThan(fromI128Pieces(-1,5), fromI128Small(-8))) {
        return falseVal;
    }

    return fromTrue();
}