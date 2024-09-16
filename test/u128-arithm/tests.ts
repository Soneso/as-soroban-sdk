import {BoolVal, errorCodeArithDomain, errorTypeObject, fromFalse, fromTrue, 
    fromU128Pieces, getErrorCode, getErrorType, isError, isU128Small, toU128Low64,
    fromU128Small, toU128High64, toU128Small, isU128Object, fromU32} from "../../lib/value";
import { u128Add, u128Compare, u128Div, u128IsEqual, u128IsGreaterThan, u128IsLowerThan, u128Mul, u128Pow, u128RemEuclid, u128Shl, u128Shr, u128Sub } from "../../lib/arithm128";
import * as context from "../../lib/context";
import { Vec } from "../../lib/vec";
import * as u128 from "../../lib/u128_math";

export function testU128Add():BoolVal {
    let falseVal = fromFalse();

    // small + small
    let lhs =  fromU128Small(2);
    let rhs =  fromU128Small(2);
    let res = u128Add(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 4) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    
    // small + obj
    lhs = fromU128Pieces(u64Max, 10)
    res = u128Add(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 12 || hi != u64Max) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj + obj
    lhs = fromU128Pieces(1, u64Max);
    rhs =  fromU128Pieces(10, 1);
    res = u128Add(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 0 || hi != 12) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // overflow
    lhs = fromU128Pieces(u64Max, u64Max);
    res = u128Add(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testU128Sub():BoolVal {
    let falseVal = fromFalse();

    // small - small
    let lhs =  fromU128Small(4);
    let rhs =  fromU128Small(2);
    let res = u128Sub(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 2) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    
    // obj - small
    lhs = fromU128Pieces(u64Max, 10)
    res = u128Sub(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 8 || hi != u64Max) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // obj - obj
    lhs = fromU128Pieces(10, u64Max);
    rhs =  fromU128Pieces(9, 10);
    res = u128Sub(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != u64Max - 10 || hi != 1) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    // overflow 1
    lhs = fromU128Small(2);
    rhs = fromU128Small(4);
    res = u128Sub(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    // overflow 2
    rhs = fromU128Pieces(200, u64Max);
    res = u128Sub(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    // overflow 3
    lhs = fromU128Pieces(100, u64Max);
    rhs = fromU128Pieces(200, u64Max);
    res = u128Sub(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testU128Mul():BoolVal {
    let falseVal = fromFalse();

    // small * small
    let lhs =  fromU128Small(2);
    let rhs =  fromU128Small(2);
    let res = u128Mul(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 4) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    
    // small * obj
    lhs = fromU128Pieces(10, 10)
    res = u128Mul(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 20 || hi != 20) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    
    // obj + obj
    lhs = fromU128Pieces(0, 75057594000000000);
    rhs =  fromU128Pieces(0, 75057594000000000);
    res = u128Mul(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
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

    // overflow
    lhs = fromU128Pieces(u64Max, u64Max);
    rhs = fromU128Pieces(u64Max, u64Max);
    res = u128Mul(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testU128Div():BoolVal {
    let falseVal = fromFalse();

    // small / small
    let lhs =  fromU128Small(4);
    let rhs =  fromU128Small(2);
    let res = u128Div(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 2) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
    
    // small / obj
    lhs = fromU128Pieces(10, 10)
    res = u128Div(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 5 || hi != 5) {
            return falseVal; 
        }
    } else {
        return falseVal;
    }

    
    // obj + obj
    lhs = fromU128Pieces(u64Max, u64Max);
    rhs = fromU128Pieces(0, 75057594000000000);
    res = u128Div(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 14164472563176641127 || hi != 245) {
            return falseVal;
        }
        
        let b_lo = u128.div(u64Max, u64Max, 75057594000000000, 0);
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

    // overflow
    lhs = fromU128Pieces(u64Max, u64Max);
    rhs = fromU128Small(0);
    res = u128Div(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testU128RemEuclid():BoolVal {
    let falseVal = fromFalse();

    // small % small
    let lhs =  fromU128Small(4);
    let rhs =  fromU128Small(3);
    let res = u128RemEuclid(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 1) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;

    // obj % small
    lhs = fromU128Pieces(0, 7505759400002)
    res = u128RemEuclid(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 2) {
        return falseVal;
    }
    
    
    // obj % obj
    lhs = fromU128Pieces(0, 75057594000000015);
    rhs = fromU128Pieces(0, 75057594000000000);
    res = u128RemEuclid(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 15) {
        return falseVal;
    }

    // overflow
    lhs = fromU128Pieces(u64Max, u64Max);
    rhs = fromU128Small(0);
    res = u128RemEuclid(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testU128Pow():BoolVal {
    let falseVal = fromFalse();

    // small ^ u32
    let lhs =  fromU128Small(2);
    let rhs =  fromU32(2);
    let res = u128Pow(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 4) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
        
    // obj ^ u32
    lhs = fromU128Pieces(0, 75057594000000000);
    res = u128Pow(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
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

    // overflow
    lhs = fromU128Pieces(u64Max, u64Max);
    res = u128Pow(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testU128Shl():BoolVal {
    let falseVal = fromFalse();

    // small << u32
    let lhs =  fromU128Small(2);
    let rhs =  fromU32(2);
    let res = u128Shl(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 8) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
        
    // obj << small
    lhs = fromU128Pieces(0, 75057594000000000);
    rhs =  fromU32(10);
    res = u128Shl(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 3071999961161793536 || hi != 4) {
            return falseVal;
        }
        
        let b_lo = u128.shl(75057594000000000, 0, 10);
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

    // overflow
    lhs = fromU128Pieces(u64Max, u64Max);
    res = u128Shl(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }

    return fromTrue();
}

export function testU128Shr():BoolVal {
    let falseVal = fromFalse();

    // small << u32
    let lhs =  fromU128Small(8);
    let rhs =  fromU32(2);
    let res = u128Shr(lhs, rhs);
    if (!isU128Small(res) || toU128Small(res) != 2) {
        return falseVal;
    }
    // @ts-ignore
    const u64Max = u64.MAX_VALUE;
        
    // obj << small
    lhs = fromU128Pieces(4, 3071999961161793536);
    rhs =  fromU32(10);
    res = u128Shr(lhs, rhs);
    if (isU128Object(res)) {
        let lo = toU128Low64(res);
        let hi = toU128High64(res);
        if (lo != 75057594000000000 || hi != 0) {
            return falseVal;
        }
        
        let b_lo = u128.shr(3071999961161793536, 4, 10);
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

    // this will trap:
    /*lhs = fromU128Small(0);
    rhs =  fromU32(4294967290);
    res = u128Shr(lhs, rhs);
    if(!isError(res) || 
        getErrorType(res) != errorTypeObject ||
        getErrorCode(res) != errorCodeArithDomain) {
            return falseVal;
    }*/

    return fromTrue();
}

export function testU128Util():BoolVal {
    let falseVal = fromFalse();

    if (u128Compare(fromU128Small(8), fromU128Small(8)) != 0) {
        return falseVal;
    }
    if (!u128IsEqual(fromU128Small(8), fromU128Small(8))) {
        return falseVal;
    }
    if (u128Compare(fromU128Small(7), fromU128Small(8)) != -1) {
        return falseVal;
    }
    if (u128IsEqual(fromU128Small(7), fromU128Small(8))) {
        return falseVal;
    }
    if (u128IsGreaterThan(fromU128Small(7), fromU128Small(8))) {
        return falseVal;
    }
    if (!u128IsLowerThan(fromU128Small(7), fromU128Small(8))) {
        return falseVal;
    }
    if (u128Compare(fromU128Small(9), fromU128Small(8)) != 1) {
        return falseVal;
    }
    
    if (u128Compare(fromU128Pieces(1,5), fromU128Pieces(1,5)) != 0) {
        return falseVal;
    }
    if (!u128IsEqual(fromU128Pieces(1,5), fromU128Pieces(1,5))) {
        return falseVal;
    }
    if (u128Compare(fromU128Pieces(1,4), fromU128Pieces(1,5)) != -1) {
        return falseVal;
    }
    if (!u128IsLowerThan(fromU128Pieces(1,4), fromU128Pieces(1,5))) {
        return falseVal;
    }
    if (u128IsGreaterThan(fromU128Pieces(1,4), fromU128Pieces(1,5))) {
        return falseVal;
    }
    if (u128Compare(fromU128Pieces(1,6), fromU128Pieces(1,5)) != 1) {
        return falseVal;
    }
    if (!u128IsGreaterThan(fromU128Pieces(1,6), fromU128Pieces(1,5))) {
        return falseVal;
    }
    if (u128IsLowerThan(fromU128Pieces(1,6), fromU128Pieces(1,5))) {
        return falseVal;
    }
    
    if (u128Compare(fromU128Pieces(1,5), fromU128Small(8)) != 1) {
        return falseVal;
    }
    if (u128IsEqual(fromU128Pieces(1,5), fromU128Small(8))) {
        return falseVal;
    }

    if (u128Compare(fromU128Pieces(1,5), fromU128Small(-8)) != 1) {
        return falseVal;
    }
    if (u128IsEqual(fromU128Pieces(1,5), fromU128Small(-8))) {
        return falseVal;
    }

    return fromTrue();
}