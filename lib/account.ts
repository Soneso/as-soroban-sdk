import { RawVal, toBool, toU32, AccountIdObject } from "./value";

/**
 * Returns true if the account exists. Otherwise false.
 * @param acc the account id of the account to check (Type: AccountIdObject).
 * @returns true if the account exists, otherwise false.
 */
export function exists(acc: AccountIdObject): bool {
    return toBool(account_exists(acc));
}

/**
 * Returns the low threshold for the account. Traps if no such account exists.
 * @param acc the account id
 * @returns the low threshold of the account
 */
export function getLowTreshold(acc: AccountIdObject): u32 {
    return toU32(account_get_low_threshold(acc));
}

/**
 * Returns the medium threshold for the account. Traps if no such account exists.
 * @param acc the account id
 * @returns the medium threshold of the account
 */
 export function getMediumThreshold(acc: AccountIdObject): u32 {
    return toU32(account_get_medium_threshold(acc));
}

/**
 * Returns the high threshold for the account. Traps if no such account exists.
 * @param acc the account id
 * @returns the high threshold of the account
 */
 export function getHighTreshold(acc: AccountIdObject): u32 {
    return toU32(account_get_high_threshold(acc));
}

/**
 * Get the signer weight for the signer on the account.
 * Returns the master weight if the signer is the master, and returns 0 if no such signer exists. 
 * Traps if no such account exists.
 * @param acc the account id
 * @param signer the signer account id
 * @returns the high threshold of the account
 */
 export function getSignerWeight(acc: AccountIdObject, signer: AccountIdObject): u32 {
    return toU32(account_get_signer_weight(acc, signer));
}


/******************
 * HOST FUNCTIONS *
 ******************/

/// Given an ID `a` (`a` is `AccountId`) of an account,
/// check if it exists. Returns (SCStatic) TRUE/FALSE.
// @ts-ignore
@external("a", "3")
declare function account_exists(a: AccountIdObject): RawVal;

/// Get the low threshold for the account with ID `a` (`a` is `AccountId`).
/// Traps if no such account exists.
// @ts-ignore
@external("a", "_")
declare function account_get_low_threshold(a: AccountIdObject): RawVal;

/// Get the medium threshold for the account with ID `a` (`a` is `AccountId`). 
/// Traps if no such account exists.
// @ts-ignore
@external("a", "0")
declare function account_get_medium_threshold(a: AccountIdObject): RawVal;

/// Get the high threshold for the account with ID `a` (`a` is `AccountId`). 
/// Traps if no such account exists.
// @ts-ignore
@external("a", "1")
declare function account_get_high_threshold(a: AccountIdObject): RawVal;

/// Get the signer weight for the signer with ed25519 public key `s` (`s` is `Bytes`) 
/// on the account with ID `a` (`a` is `AccountId`). Returns the master weight 
/// if the signer is the master, and returns 0 if no such signer exists. 
/// Traps if no such account exists.
// @ts-ignore
@external("a", "2")
declare function account_get_signer_weight(a: AccountIdObject, s: AccountIdObject): RawVal;