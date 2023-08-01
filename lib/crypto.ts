import { VoidVal } from "./value";
import { Bytes } from "./bytes";
import { compute_hash_sha256, verify_sig_ed25519 } from "./env";


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
