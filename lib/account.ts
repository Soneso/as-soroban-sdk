import { RawVal, toBool, toU32, PublicKeyObject } from "./value";

/**
 * Returns true if the account exists. Otherwise false.
 * @param pk the public key of the account to check (Type: PublicKeyObject).
 * @returns true if the account exists, otherwise false.
 */
export function exists(pk: PublicKeyObject): bool {
    return toBool(account_exists(pk));
}

/**
 * Returns the low threshold for the account with ed25519 public key. Traps if no such account exists.
 * @param acc the account id
 * @returns the low threshold of the account
 */
export function getLowTreshold(acc: PublicKeyObject): u32 {
    return toU32(account_get_low_threshold(acc));
}

/**
 * Returns the medium threshold for the account with ed25519 public key. Traps if no such account exists.
 * @param acc the account id
 * @returns the medium threshold of the account
 */
 export function getMediumThreshold(acc: PublicKeyObject): u32 {
    return toU32(account_get_medium_threshold(acc));
}

/**
 * Returns the high threshold for the account with ed25519 public key. Traps if no such account exists.
 * @param acc the account id
 * @returns the high threshold of the account
 */
 export function getHighTreshold(acc: PublicKeyObject): u32 {
    return toU32(account_get_high_threshold(acc));
}

/**
 * Get the signer weight for the signer with ed25519 public key
 * on the account with ed25519 public key. Returns the master weight if the signer is the
 * master, and returns 0 if no such signer exists. Traps if no such account exists.
 * @param acc the account id
 * @param signer the signer account id
 * @returns the high threshold of the account
 */
 export function getSignerWeight(acc: PublicKeyObject, signer: PublicKeyObject): u32 {
    return toU32(account_get_signer_weight(acc, signer));
}


/******************
 * HOST FUNCTIONS *
 ******************/

/// Given an ed25519 public key `a` (`a` is `Bytes`) of an account,
/// check if it exists. Returns (SCStatic) TRUE/FALSE.
// @ts-ignore
@external("a", "3")
declare function account_exists(a: PublicKeyObject): RawVal;

/// Get the low threshold for the account with ed25519 public
/// key `a` (`a` is `Bytes`). Traps if no such account exists.
// @ts-ignore
@external("a", "_")
declare function account_get_low_threshold(a: PublicKeyObject): RawVal;

/// Get the medium threshold for the account with ed25519 public
/// key `a` (`a` is `Bytes`). Traps if no such account exists.
// @ts-ignore
@external("a", "0")
declare function account_get_medium_threshold(a: PublicKeyObject): RawVal;

/// Get the high threshold for the account with ed25519 public
/// key `a` (`a` is `Bytes`). Traps if no such account exists.
// @ts-ignore
@external("a", "1")
declare function account_get_high_threshold(a: PublicKeyObject): RawVal;

/// Get the signer weight for the signer with ed25519 public key
/// `s` (`s` is `Bytes`) on the account with ed25519 public key `a` (`a`
/// is `Bytes`). Returns the master weight if the signer is the
/// master, and returns 0 if no such signer exists. Traps if no
/// such account exists.
// @ts-ignore
@external("a", "2")
declare function account_get_signer_weight(a: PublicKeyObject, s: PublicKeyObject): RawVal;