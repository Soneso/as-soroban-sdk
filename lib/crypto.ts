import { BytesObject, VoidVal } from "./value";
import { ObjectVal } from "./value";
import { Bytes } from "./bytes";


export function computeHashSha256(x: Bytes): Bytes {
    let res = compute_hash_sha256(x.getHostObject());
    return new Bytes(res);
}

/**
 * Verifies a Ed25519 signature. Traps if not valid.
 * @param publicKey The public key of the signer.
 * @param payload The payload
 * @param signature The signature. 
 */
export function verifySigEd25519(publicKey:Bytes, payload:Bytes, signature:Bytes) : VoidVal {
    return verify_sig_ed25519(publicKey.getHostObject(), payload.getHostObject(), signature.getHostObject())
}

/*****************************************
* hash - Functions concerned with hashes *
* - depricated, will be removed in soroban preview version 10 *
******************************************/

// @ts-ignore
@external("h", "_")
export declare function hash_from_bytes(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("h", "0")
export declare function hash_to_bytes(x:ObjectVal): ObjectVal;

/**************************************
* key - Functions concerned with keys *
* - depricated, will be removed in soroban preview version 10 *
***************************************/

// @ts-ignore
@external("k", "_")
export declare function public_key_from_bytes(x:ObjectVal): ObjectVal;

// @ts-ignore
@external("k", "0")
export declare function public_key_to_bytes(x:ObjectVal): ObjectVal;

/*******************************************
* crypto - Functions concerned with crypto *
********************************************/

// @ts-ignore
@external("c", "_")
export declare function compute_hash_sha256(x:BytesObject): BytesObject;

// @ts-ignore
@external("c", "0")
export declare function verify_sig_ed25519(k:BytesObject, x:BytesObject, s:BytesObject): VoidVal;
