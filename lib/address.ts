import { AddressObject, RawVal, StatusVal, VecObject, BytesObject } from "./value";
import { Vec } from "./vec";


/**
 * Checks if the address has authorized the invocation of the 
 * current contract function with the provided arguments.
 * Traps if the invocation hasn't been authorized.
 * @param address to be checked as AddressObject
 * @returns void if authorized
 */
export function requireAuth(address: AddressObject): StatusVal {
    return require_auth(address);
}


/**
 * Checks if the address has authorized the invocation of the 
 * current contract function with the provided arguments.
 * Traps if the invocation hasn't been authorized.
 * @param address to be checked as AddressObject
 * @param args vector containing the args
 * @returns void if authorized
 */
export function requireAuthForArgs(address: AddressObject, args:Vec): StatusVal {
    return require_auth_for_args(address, args.getHostObject());
}

/******************
 * HOST FUNCTIONS *
 ******************/

/// Checks if the address has authorized the invocation of the 
/// current contract function with the provided arguments. 
/// Traps if the invocation hasn't been authorized.
// @ts-ignore
@external("a", "_")
declare function require_auth_for_args(address: AddressObject, args:VecObject): RawVal;


/// Checks if the address has authorized the invocation of the 
/// current contract function with all the arguments of the invocation.
/// Traps if the invocation hasn't been authorized.
// @ts-ignore
@external("a", "0")
declare function require_auth(address: AddressObject): RawVal;

/// Converts a provided 32-byte Stellar account public key to the corresponding address. 
/// This is only useful in the context of cross-chain interoperability. 
/// Prefer directly using the Address objects whenever possible.
// @ts-ignore
@external("a", "1")
export declare function account_public_key_to_address(pk_bytes: BytesObject): AddressObject;

/// Converts a provided 32-byte contract identifier to a corresponding Address object.
// @ts-ignore
@external("a", "2")
export declare function contract_id_to_address(contract_id_bytes: BytesObject): AddressObject;

/// Returns the 32-byte public key of the Stellar account corresponding to the provided Address object. 
/// If the Address doesn't belong to an account, returns RawVal corresponding to the unit type (`()`).
// @ts-ignore
@external("a", "3")
export declare function address_to_account_public_key(address: AddressObject): RawVal;

/// Returns the 32-byte contract identifier corresponding to the provided Address object. 
// If the Address doesn't belong to a contract, returns RawVal corresponding to the unit type (`()`).
// @ts-ignore
@external("a", "4")
export declare function address_to_contract_id(address: AddressObject): RawVal;