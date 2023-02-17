import { AddressObject, StatusVal, VectorObject } from "./value";
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
 * @param args vector containing the args as symbols
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
declare function require_auth_for_args(address: AddressObject, args:VectorObject): StatusVal;


/// Checks if the address has authorized the invocation of the 
/// current contract function with all the arguments of the invocation.
/// Traps if the invocation hasn't been authorized.
// @ts-ignore
@external("a", "0")
declare function require_auth(address: AddressObject): StatusVal;