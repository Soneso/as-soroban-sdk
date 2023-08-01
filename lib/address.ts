import { Bytes } from "./bytes";
import { account_public_key_to_address, contract_id_to_address, require_auth, require_auth_for_args } from "./env";
import { AddressObject, VoidVal } from "./value";
import { Vec } from "./vec";


/**
 * Checks if the address has authorized the invocation of the 
 * current contract function with the provided arguments.
 * Traps if the invocation hasn't been authorized.
 * @param address to be checked as AddressObject
 * @returns void if authorized
 */
export function requireAuth(address: AddressObject): VoidVal {
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
export function requireAuthForArgs(address: AddressObject, args:Vec): VoidVal {
    return require_auth_for_args(address, args.getHostObject());
}

/**
 * Converts a provided 32-byte Stellar account public key to the corresponding address. 
 * @param pk_bytes the public key
 * @returns the address object handle.
 */
export function accountPublicKeyToAddress(pk_bytes: Bytes): AddressObject {
    return account_public_key_to_address(pk_bytes.getHostObject());
}

/**
 * Converts a provided 32-byte contract identifier to a corresponding Address object.
 * @param contract_id_bytes the contract id.
 * @returns the address object handle.
 */
export function contractIdToAddress(contract_id_bytes: Bytes): AddressObject {
    return contract_id_to_address(contract_id_bytes.getHostObject());
}