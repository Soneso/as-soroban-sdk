// Offers arithmetic helper functions for u128 numbers.
// Inspired by: https://github.com/MaxGraey/as-bignum and ported to run on soroban

import * as context from "./context";


/**
 * Used for returning hi part of u128 operations that return u128.
 */
export var __hi: u64 = 0;

/**
 * Checks if first u128 is lower then - operator('<') - second u128.
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns True if the first u128 is lower then - operator('<') - the second. Otherwise false.
 */
export function lt(alo: u64, ahi: u64, blo: u64, bhi: u64): bool {  
  return ahi == bhi ? alo < blo : ahi < bhi;
}

/**
 * Checks if first u128 is greater then - operator('>') - second u128.
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns True if the first u128 is greater then - operator('>') - the second. Otherwise false.
 */
export function gt(alo: u64, ahi: u64, blo: u64, bhi: u64): bool {  
  return ahi == bhi ? alo > blo : ahi > bhi;
}

/**
 * Checks if first u128 is lower or equal - operator('<=') - second u128.
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns True if the first u128 is lower or equal - operator('<=') - the second. Otherwise false.
 */
export function le(alo: u64, ahi: u64, blo: u64, bhi: u64): bool {  
  return !gt(alo, ahi, blo, bhi);
}

/**
 * Checks if first u128 is greater or equal - operator('>=') - second u128.
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns True if the first u128 is greater or equak - operator('>=') - the second. Otherwise false.
 */
export function ge(alo: u64, ahi: u64, blo: u64, bhi: u64): bool {  
  return !lt(alo, ahi, blo, bhi);
}

/**
 * Checks if first u128 equals - operator('==') - the second u128.
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns True if the first u128 equals - operator('==') - the second. Otherwise false.
 */
export function eq(alo: u64, ahi: u64, blo:u64, bhi:u64): bool {
  return ahi == bhi && alo == blo;
}

/**
 * Get ordering
 * if a > b then result is  1
 * if a < b then result is -1
 * if a = b then result is  0
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 */
export function ord(alo: u64, ahi: u64, blo:u64, bhi:u64): i32 {
    let dlo = alo - blo;
    let dhi = ahi - bhi;
    let cmp = <i32>select<i64>(dhi, dlo, dhi != 0);
    // normalize to [-1, 0, 1]
    return i32(cmp > 0) - i32(cmp < 0);
}

/**
 * Checks if the given u128 is zero. 
 * @param vlo Low part of the u128 to check.
 * @param vhi High part of the u128 to check.
 * @returns True if the 
 */
export function isZero(vlo: u64, vhi:u64): bool {
  return !(vlo | vhi);
}

/**
 * Adds two u128 numbers (a + b).
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function add(alo: u64, ahi: u64, blo:u64, bhi:u64): u64 {
    let lo = alo + blo;
    __hi = ahi + bhi + u64(lo < alo);
    return lo;
}

/**
 * Substacts an u128 from another u128 (a - b).
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function sub(alo: u64, ahi: u64, blo:u64, bhi:u64): u64 {
    let lo = alo - blo;
    __hi = ahi - bhi - u64(lo > alo);
    return lo;
}


/**
 * Increments an u128. 
 * @param vlo Low part of the u128 to increment.
 * @param vhi High part of the u128 to increment.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function inc(vlo: u64, vhi: u64): u64 {
  let lo = vlo + 1;
  __hi = vhi;
  __hi += u64(lo < vlo);
  return lo;
}

/**
* Decrements an u128. 
* @param vlo Low part of the u128 to decrement.
* @param vhi High part of the u128 to decrement.
* @returns Low part of the u128 result. The high part is stored in __hi.
*/
export function dec(vlo: u64, vhi: u64): u64 {
  let lo = vlo - 1;
  __hi = vhi;
  __hi -= u64(lo > vlo);
  return lo;
}

/**
 * Multiplies two u128 numbers  (a * b).
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function mul(alo: u64, ahi: u64, blo:u64, bhi:u64): u64 {
    let u = alo, v = blo;
    let w: u64, k: u64;

    let u1 = u & 0xFFFFFFFF; u >>= 32;
    let v1 = v & 0xFFFFFFFF; v >>= 32;
    let t = u1 * v1;
    let w1 = t & 0xFFFFFFFF;

    t = u * v1 + (t >> 32);
    k = t & 0xFFFFFFFF;
    w = t >> 32;
    t = u1 * v + k;

    let lo  = (t << 32) | w1;
    let hi  = u  * v + w;
        hi += ahi * blo;
        hi += alo * bhi;
        hi += t >> 32;

    __hi = hi;
    return lo;
}

/**
 * Devides two u128 numbers (a / b).
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function div(alo: u64, ahi: u64, blo: u64, bhi: u64): u64 {
  let lo = __udivmod128(alo, ahi, blo, bhi);
  __hi = __divmod_quot_hi;
  return lo;
}

/**
 * Binary not of an u128 (~val).
 * @param vlo Low part of the u128 to binary not.
 * @param vhi High part of the u128 to binary not.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function not(vlo: u64, vhi: u64): u64 {
  __hi = ~vhi;
  return ~vlo;
}

/**
 * Binary or two u128 numbers - (a | b).
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function or(alo: u64, ahi: u64, blo: u64, bhi: u64): u64 {  
  __hi = ahi | bhi;
  return alo | blo;
}


/**
 * Binary xor two u128 numbers - (a ^ b).
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function xor(alo: u64, ahi: u64, blo: u64, bhi: u64): u64 {  
  __hi = ahi ^ bhi;
  return alo ^ blo;
}

/**
 * Binary and two u128 numbers - (a & b).
 * @param alo Low part of the first u128.
 * @param ahi High part of the first u128.
 * @param blo Low part of the second u128.
 * @param bhi High part of the second u128.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function and(alo: u64, ahi: u64, blo: u64, bhi: u64): u64 {  
  __hi = ahi & bhi;
  return alo & blo;
}

/**
 * Binary shift left - (a << b).
 * @param alo Low part of the u128 to be shifted.
 * @param ahi High part of the u128 to be shifted.
 * @param blo Low part of the u128 to shift with.
 * @param bhi High part of the u128 to shift with.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function shl(vlo: u64, vhi: u64, shift: i32): u64 {  
  shift &= 127;

  // need for preventing redundant i32 -> u64 extends
  let shift64 = shift as u64;

  let mod1 = ((((shift64 + 127) | shift64) & 64) >> 6) - 1;
  let mod2 = (shift64 >> 6) - 1;

  shift64 &= 63;

  let lo = vlo << shift64;
  let hi = lo & ~mod2;

  hi |= ((vhi << shift64) | ((vlo >> (64 - shift64)) & mod1)) & mod2;

  __hi = hi;
  return lo & mod2;
}

/**
 * Binary shift right - (a >> b).
 * @param alo Low part of the u128 to be shifted.
 * @param ahi High part of the u128 to be shifted.
 * @param blo Low part of the u128 to shift with.
 * @param bhi High part of the u128 to shift with.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function shr(vlo: u64, vhi: u64, shift: i32): u64 {  
  shift &= 127;

  // need for preventing redundant i32 -> u64 extends
  let shift64 = shift as u64;

  let mod1 = ((((shift64 + 127) | shift64) & 64) >> 6) - 1;
  let mod2 = (shift64 >> 6) - 1;

  shift64 &= 63;

  let hi = vhi >> shift64;
  let lo = hi & ~mod2;

  lo |= ((vlo >> shift64) | ((vhi << (64 - shift64)) & mod1)) & mod2;

  __hi = hi & mod2;
  return lo;
}

/**
 * Compute bit count of leading zeros.
 * @param lo Low part of the u128.
 * @param hi High part of the u128.
 * @returns The result as i32.
 */
export function clz128(lo: u64, hi: u64): i32 {
  let mask: u64 = <i64>(hi ^ (hi - 1)) >> 63;
  return <i32>clz((hi & ~mask) | (lo & mask)) + (<i32>mask & 64);
}

/**
 * Compute bit count of trailing zeros.
 * @param lo Low part of the u128.
 * @param hi High part of the u128.
 * @returns The result as i32.
 */
export function ctz128(lo: u64, hi: u64): i32 {
  let mask: u64 = <i64>(lo ^ (lo - 1)) >> 63;
  return <i32>ctz((hi & mask) | (lo & ~mask)) + (<i32>mask & 64);
}

/**
 * Calculate multiply and division as `number * numerator / denominator` without overflow in multiplication part.
 * @param number_lo Low part of u128 number.
 * @param number_hi High part of u128 number.
 * @param numerator_lo Low part of u128 numerator.
 * @param numerator_hi High part of u128 numerator.
 * @param denominator_lo Low part of u128 denominator.
 * @param denominator_hi High part of u128 denominator.
 * @returns Low part of the u128 result. The high part is stored in __hi.
 */
export function muldiv(number_lo: u64, number_hi: u64, numerator_lo: u64, numerator_hi: u64, denominator_lo: u64, denominator_hi: u64): u64 {
  let alo = number_lo;
  let ahi = number_hi;
  let blo = numerator_lo;
  let bhi = numerator_hi;
  let clo = denominator_lo;
  let chi = denominator_hi;

  //let qn = new u128(ql, __divmod_quot_hi);             // b / c
  let qnlo = __udivmod128(blo, bhi, clo, chi);
  let qnhi = __divmod_quot_hi;

  //let rn = new u128(__divmod_rem_lo, __divmod_rem_hi); // b % c
  let rnlo = __divmod_rem_lo;
  let rnhi = __divmod_rem_hi;

  let qlo:u64 = 0;
  let qhi:u64 = 0;
  let rlo:u64 = 0;
  let rhi:u64 = 0;
  let nlo = alo;
  let nhi = ahi;

  while (!isZero(nlo, nhi)) {
    if (nlo & 1) {
      //q += qn;
      qlo = add(qlo, qhi, qnlo, qnhi);
      qhi = __hi;
      
      //r += rn;
      rlo = add(rlo, rhi, rnlo, rnhi);
      rhi = __hi;
      // if (r >= c)
      if (ge(rlo, rhi, clo, chi)) {
        //++q;
        qlo = inc(qlo, qhi);
        qhi = __hi;

        //r -= c;
        rlo = sub(rlo, rhi, clo, chi);
        rhi = __hi;
      }
    }

    // n >>= 1;
    nlo = shr(nlo, nhi, 1);
    nhi = __hi;

    // qn <<= 1;
    qnlo = shl(qnlo, qnhi, 1);
    qnhi = __hi;

    // rn <<= 1;
    rnlo = shl(rnlo, rnhi, 1);
    rnhi = __hi;

    // if (rn >= c) {
    if (ge(rnlo, rnhi, clo, chi)) {
      // ++qn;
      qnlo = inc(qnlo, qnhi);
      qnhi = __hi;

      //rn -= c;
      rnlo = sub(rnlo, rnhi, clo, chi);
      rnhi = __hi;
    }
  }
  __hi = qhi;
  return qlo;
}

/**
 * Used for returning high part of quotient from __divmod128.
 */
export var __divmod_quot_hi: u64 = 0;

/**
 *  Used for returning low part of reminder from __divmod128.
 */
export var __divmod_rem_lo:  u64 = 0;

/**
 *  Used for returning high part of reminder from __divmod128.
 */
export var __divmod_rem_hi:  u64 = 0;

export function __udivmod128(alo: u64, ahi: u64, blo: u64, bhi: u64): u64 {
    let bzn = clz128(blo, bhi); // N
  
    // b == 0
    if (bzn == 128) {
      context.fail(); // division by zero
    }
  
    // var azn = __clz128(alo, ahi); // M
    let btz = ctz128(blo, bhi); // N
  
    // a == 0
    if (!(alo | ahi)) {
      __divmod_quot_hi = 0;
      __divmod_rem_lo  = 0;
      __divmod_rem_hi  = 0;
      return 0;
    }
  
    // a / 1
    if (bzn == 127) {
      __divmod_quot_hi = ahi;
      __divmod_rem_lo  = 0;
      __divmod_rem_hi  = 0;
      return alo;
    }
  
    // a == b
    if (alo == blo && ahi == bhi) {
      __divmod_quot_hi = 0;
      __divmod_rem_lo  = 0;
      __divmod_rem_hi  = 0;
      return 1;
    }
  
    if (!(ahi | bhi)) {
      __divmod_quot_hi = 0;
      __divmod_rem_hi  = 0;
      // if `blo` is power of two
      if (!(blo & (blo - 1))) {
        __divmod_rem_lo = alo & (blo - 1);
        return alo >> btz;
      } else {
        let dlo = alo / blo;
        __divmod_rem_lo = alo - dlo * blo;
        return dlo;
      }
    }

    return __udivmod128core(alo, ahi, blo, bhi);
  }

  function __udivmod128core(alo: u64, ahi: u64, blo: u64, bhi: u64): u64 {

    // get leading zeros for left alignment
    let alz = clz128(alo, ahi);
    let blz = clz128(blo, bhi);
    let off = blz - alz;
    
    let nblo  = shl(blo, bhi, off);
    let nbhi = __hi;

    //var q = u128.Zero;
    let qlo:u64 = 0;
    let qhi:u64 = 0;

    //var n = a.clone();
    let nlo = alo;
    let nhi = ahi;

    // create a mask with the length of b
    // var mask = u128.One;
    let masklo:u64 = 1;
    let maskhi:u64 = 0
    
    //mask <<= 128 - blz;
    masklo = shl(masklo, maskhi, 128 - blz);
    maskhi = __hi;

    //--mask;
    masklo = dec(masklo, maskhi);
    maskhi = __hi;

    //mask <<= off;
    masklo = shl(masklo, maskhi, off);
    maskhi = __hi;

    var i = 0;
    //while (n >= b) {
    while (ge(nlo, nhi, blo, bhi)) {
      ++i;
      //q <<= 1;
      qlo = shl(qlo, qhi, 1);
      qhi = __hi;
      
      //if ((n & mask) >= nb) {
      let nmlo = and(nlo, nhi, masklo, maskhi);
      let nmhi = __hi;
      if (ge(nmlo, nmhi, nblo, nbhi)) {
        // ++q;
        qlo = inc(qlo, qhi);
        qhi = __hi;
        
        //n -= nb;
        nlo = sub(nlo, nhi, nblo, nbhi);
        nhi = __hi;
      }
  
      // mask |= mask >> 1;
      let smlo = shr(masklo, maskhi, 1);
      let smhi = __hi;
      masklo = or(masklo, maskhi, smlo, smhi);
      maskhi = __hi;

      // nb >>= 1;
      nblo = shr(nblo, nbhi, 1);
      nbhi = __hi;
    }

    // q <<= (blz - alz - i + 1);
    qlo = shl(qlo, qhi, (blz - alz - i + 1));
    qhi = __hi;
  
    __divmod_quot_hi = qhi;
    __divmod_rem_lo  = nlo;
    __divmod_rem_hi  = nhi;
    return qlo;
  }

  /**
   * Compute floor(sqrt(v)).
   * @param vlo low part of value to compute.
   * @param vhi high part of value to compute.
   * @returns lo part of the result. high part is stored in __hi.
   */
  export function sqrt(vlo:u64, vhi:u64): u64 {

    if (lt(vlo, vhi, 2, 0)) {
      __hi = vhi;
      return vlo;
    }
    
    let valuelo = vlo;
    let valuehi = vhi;

    let remlo = vlo;
    let remhi = vhi;

    let reslo:u64 = 0;
    let reshi:u64 = 0;

    let poslo = shl(1, 0, (127 - (clz128(vlo, vhi) | 1)));
    let poshi = __hi;
    
    while (!isZero(poslo, poshi)) {
      valuelo = add(reslo, reshi, poslo, poshi);
      valuehi = __hi;

      if (ge(remlo, remhi, valuelo, valuehi)) {
        remlo = sub(remlo, remhi, valuelo, valuehi);
        remhi = __hi;

        reslo = add(poslo, poshi, valuelo, valuehi);
        reshi = __hi;
      }

      reslo = shr(reslo, reshi, 1);
      reshi = __hi;
      poslo = shr(poslo, poshi, 2);
      poshi = __hi;
    }
    __hi = reshi;
    return reslo;
  }

  /**
   * Calculate inplace squared 128-bit unsigned integer (value ** 2)
   * @param vlo low part of value.
   * @param vhi hi part of value.
   * @returns low part of the result. Hi part is stored in __hi.
   */
  function sqr(vlo:u64, vhi:u64): u64 { 
    let u = vlo, v = vhi;

    let u1 = u & 0xFFFFFFFF;
    let t  = u1 * u1;
    let w  = t & 0xFFFFFFFF;
    let k  = t >> 32;

    u >>= 32;
    let m = u * u1;
    t = m + k;
    let w1 = t >> 32;

    t = m + (t & 0xFFFFFFFF);

    let lo = (t << 32) + w;
    let hi  = u * u;
        hi += w1 + (t >> 32);
        hi += u * v << 1;

    __hi = hi;
    return lo;
  }

  /**
   * Calculate power of base with exponent.
   * @param baselo low part of base.
   * @param basehi high part of base.
   * @param exponent exponent.
   * @returns the low part of the result. High part is stored in __hi.
   */
  export function pow(baselo: u64, basehi:u64, exponent: i32): u64 {
    // any negative exponent produce zero

    let resultlo:u64 = 1;
    let resulthi:u64 = 0;

    if (eq(baselo, basehi, resultlo, resulthi)) {
      __hi = resulthi;
      return resultlo;
    }

    let tmplo = baselo;
    let tmphi = basehi;

  
    if (exponent <= 1) {
      if (exponent < 0) {
        __hi = 0;
        return 0;
      }
      if (exponent == 0) {
        __hi = resulthi;
        return resultlo;
      } else {
        __hi = tmphi;
        return tmplo;
      }
    }

    if (ASC_SHRINK_LEVEL < 1) {
      let lo = baselo;
      let hi = basehi;
      // if base > u64::max and exp > 1 always return "0"
      if (!lo) {
        __hi = 0;
        return 0;
      }
      if (!hi) {
        let lo1 = lo - 1;
        // "1 ^ exponent" always return "1"
        if (!lo1){
          __hi = resulthi;
          return resultlo;
        } 

        // if base is power of two do "1 << log2(base) * exp"
        if (!(lo & lo1)) {
          let shift = <i32>(64 - clz(lo1)) * exponent;
          if (shift < 128) {
             return shl(resultlo, resulthi, shift);
          } else {
            __hi = 0;
            return 0;
          }
        }
      }

      if (exponent <= 4) {
        tmplo = sqr(tmplo, tmphi);
        tmphi = __hi;
        let baseSqlo = tmplo;
        let baseSqhi = tmphi;

        switch (exponent) {
          case 2: {
            __hi = baseSqhi;
            return baseSqlo; // base ^ 2
          }
          case 3: {
            return mul(baseSqlo, baseSqhi, baselo, basehi); // base ^ 2 * base
          }
          case 4: {
            return sqr(baseSqlo, baseSqhi);  // base ^ 2 * base ^ 2
          } 
          default: break;
        }
      }

      let log = 32 - clz(exponent);
      if (log <= 7) {
        if (exponent & 1) {
          resultlo = mul(resultlo, resulthi, tmplo, tmphi);
          resulthi = __hi;
        }
        __hi = resulthi;
        return resultlo;
      }
    }

    while (exponent > 0) {
      if (exponent & 1) {
        resultlo = mul(resultlo, resulthi, tmplo, tmphi);
        resulthi = __hi;
      }
      exponent >>= 1;
      tmplo = sqr(tmplo, tmphi);
      tmphi = __hi;
    }
    __hi = resulthi;
    return resultlo;
  }