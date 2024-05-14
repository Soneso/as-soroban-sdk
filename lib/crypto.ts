import { VoidVal, fromU32 } from "./value";
import { Bytes } from "./bytes";
import { compute_hash_keccak256, compute_hash_sha256, recover_key_ecdsa_secp256k1, verify_sig_ecdsa_secp256r1, verify_sig_ed25519 } from "./env";


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

/**
 * Returns the keccak256 hash of given input bytes
 * @param x input bytes
 * @returns keccak256 of the input bytes.
 */
export function computeHashKeccak256(x:Bytes) : Bytes {
    let res = compute_hash_keccak256(x.getHostObject());
    return new Bytes(res);
}

/**
 * Recovers the SEC-1-encoded ECDSA secp256k1 public key that produced a given 64-byte signature over a given 32-byte message digest, for a given recovery_id byte.
 * @param msgDigest 32-byte message digest
 * @param signature 64-byte signature
 * @param recoveryId recovery id byte
 * @returns recovered SEC-1-encoded ECDSA secp256k1 public key
 */
export function recoverKeyEcdsaSecp256k1(msgDigest:Bytes, signature: Bytes, recoveryId: u32) : Bytes {
    let res = recover_key_ecdsa_secp256k1(msgDigest.getHostObject(), signature.getHostObject(), fromU32(recoveryId));
    return new Bytes(res);
}

/**
 * Verifies the `signature` using an ECDSA secp256r1 `public_key` on a 32-byte `msg_digest`. 
 * Warning: The `msg_digest` must be produced by a secure cryptographic hash function on the message,
 * otherwise the attacker can potentially forge signatures. The `public_key` is expected to be 65 bytes
 * in length, representing a SEC-1 encoded point in uncompressed format. The `signature` is 
 * the ECDSA signature `(r, s)` serialized as fixed-size big endian scalar values, 
 * both `r`, `s` must be non-zero and `s` must be in the lower range.
 * @param publicKey The public key of the signer.
 * @param msgDigest The message digest
 * @param signature The signature. 
 */
export function verifySigEcdsaSecp256r1(publicKey:Bytes, msgDigest:Bytes, signature:Bytes) : VoidVal {
    return verify_sig_ecdsa_secp256r1(publicKey.getHostObject(), msgDigest.getHostObject(), signature.getHostObject())
}