import { Bytes } from "./bytes";
import { prng_bytes_new, prng_reseed, prng_u64_in_inclusive_range, prng_vec_shuffle } from "./env";
import { fromU32 } from "./value";
import { Vec } from "./vec";

/**
 * Reseed the frame-local PRNG with the given bytes, which should be 32 bytes long.
 * @param seed bytes
 */
export function prngReseed(seed:Bytes): void {
    prng_reseed(seed.getHostObject());
}

/**
 * Construct a new BytesObject of the given length filled with bytes drawn from the frame-local PRNG
 * @param length leght to fill.
 * @returns the created bytes.
 */
export function prngBytesNew(length:u32): Bytes {
    let res = prng_bytes_new(fromU32(length));
    return new Bytes(res);
}

/**
 * Return a u64 uniformly sampled from the inclusive range [lo,hi] by the frame-local PRNG.
 * @param lo lo of range [lo,hi] 
 * @param hi hi of range [lo,hi]
 * @returns u64
 */
export function prngU64InInclusiveRange(lo:u64, hi:u64): u64 {
    return prng_u64_in_inclusive_range(lo, hi);
}

/**
 * Return a (Fisher-Yates) shuffled clone of a given vector, using the frame-local PRNG.
 * @param vec the input vector
 * @returns the shuffled clone of the input vector.
 */
export function prngVecShuffle(vec: Vec): Vec {
    let res = prng_vec_shuffle(vec.getHostObject());
    return new Vec(res);
}
