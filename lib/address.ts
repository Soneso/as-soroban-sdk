import { address_to_strkey, authorize_as_curr_contract, require_auth, require_auth_for_args } from "./env";
import { AddressObject, StringObject, VoidVal } from "./value";
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
 * Converts a provided address to Stellar strkey format 
 * ('G...' for account or 'C...' for contract). Prefer directly using the Address
 * objects whenever possible. This is only useful in the context of custom 
 * messaging protocols (e.g. cross-chain).
 * @param address 
 * @returns 
 */
export function addressToStrkey(address: AddressObject): StringObject {
    return address_to_strkey(address);
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