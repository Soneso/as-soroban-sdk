import {BoolVal, errorCodeArithDomain, errorTypeObject, fromFalse, fromTrue, 
    fromI128Pieces, getErrorCode, getErrorType, isError, isI128Small, 
    fromI128Small,
    toI128Small,
    isI128Object,
    toI128Low64,
    toI128High64,
    fromU32} from "../../lib/value";
import { i128Add, i128Div, i128Mul, i128Pow, i128RemEuclid, i128Shl, i128Shr, i128Sub } from "../../lib/arithm128";
import * as context from "../../lib/context";
import { Vec } from "../../lib/vec";
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

    // @ts-ignore
    const i64Max = i64.MAX_VALUE;

    // @ts-ignore
    const u64Max = u64.MAX_VALUE;

    // small + obj
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

    // obj + obj
    lhs = fromI128Pieces(1, u64Max);
    rhs =  fromI128Pieces(10, 1);
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

    // overflow
    lhs = fromI128Pieces(i64Max, u64Max);
    res = i128Add(lhs, rhs);
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

    // @ts-ignore
    const i64Max = i64.MAX_VALUE;
    
    // obj - small
    lhs = fromI128Pieces(i64Max, 10)
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
    
    // small * obj
    lhs = fromI128Pieces(10, 10)
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

    
    // obj + obj
    lhs = fromI128Pieces(0, 75057594000000000);
    rhs =  fromI128Pieces(0, 75057594000000000);
    res = i128Mul(lhs, rhs);
    if (isI128Object(res)) {
        let lo = toI128Low64(res);
        let hi = toI128High64(res);
        if (lo != 219342094686224384 || hi != 305400367379626) {
            return falseVal;
        }
        
        let b_lo = u128.mul(75057594000000000, 0, 75057594000000000, 0);
        let b_hi = u128.__hi;

        /*let vals = new Vec();
        vals.pushBack(fromU64(lo));
        vals.pushBack(fromU64(hi));
        vals.pushBack(fromU64(b_lo));
        vals.pushBack(fromU64(b_hi));
        context.log("cmp ", vals);*/

        if (!u128.eq(b_lo, b_hi, lo, hi)) {
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
    
    // obj / small
    lhs = fromI128Pieces(10, 10)
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

    // obj % small
    lhs = fromI128Pieces(0, 7505759400002)
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

        /*let vals = new Vec();
        vals.pushBack(fromU64(lo));
        vals.pushBack(fromU64(hi));
        vals.pushBack(fromU64(b_lo));
        vals.pushBack(fromU64(b_hi));
        context.log("cmp ", vals);*/

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
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
        
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