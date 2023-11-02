import { Bytes } from "./bytes";
import { account_public_key_to_address, address_to_account_public_key, address_to_contract_id, authorize_as_curr_contract, contract_id_to_address, require_auth, require_auth_for_args } from "./env";
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

/**
 * Returns the 32-byte public key of the Stellar account corresponding to the provided Address object. 
 * @param address AddressObject that belongs to an account
 * @returns Bytes containing the 32-byte public key of the Stellar account.
 */
export function addressToAccountPublicKey(address: AddressObject): Bytes {
    return new Bytes(address_to_account_public_key(address));
}

/**
 * Returns the 32-byte contract identifier corresponding to the provided Address object. 
 * @param address AddressObject that belongs to a contract.
 * @returns Bytes containing the 32-byte contract identifier of the Soroban contract.
 */
export function addressToContractId(address: AddressObject): Bytes {
    return new Bytes(address_to_contract_id(address));
}

/**
 * Authorizes sub-contract calls for the next contract call on behalf of the current contract. 
 * Every entry in the argument vector corresponds to `InvokerContractAuthEntry` contract type that
 * authorizes a tree of `require_auth` calls on behalf of the current contract. The entries must not
 * contain any authorizations for the direct contract call, i.e. if current contract needs to 
 * call contract function F1 that calls function F2 both of which require auth, only F2 should be present in `authEntries`.
 * @param authEntires 
 */
export function authorizeAsCurrContract(authEntires: Vec): void {
    authorize_as_curr_contract(authEntires.getHostObject());
}