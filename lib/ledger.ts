import { Bytes } from "./bytes";
import { create_asset_contract, create_contract, del_contract_data, extend_contract_code_ttl, extend_contract_data_ttl, extend_contract_instance_and_code_ttl, 
    extend_contract_instance_ttl, 
    extend_current_contract_instance_and_code_ttl, get_asset_contract_id, get_contract_data, get_contract_id, has_contract_data, 
    put_contract_data, update_current_contract_wasm, upload_wasm } from "./env";
import { Val, toBool, fromSmallSymbolStr, StorageType, AddressObject, fromU32} from "./value";

/**
 * Checks if the ledger stores contract data for the given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @param storageType StorageType
 * @returns true if the ledger has data for the given key
 */
export function hasDataFor(smallSymbolKey: string, storageType:StorageType): bool {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    return toBool(has_contract_data(keySymbolVal, storageType));
}

/**
 * Checks if the ledger stores contract data for the given host value key.
 * @param key any host value. e.g. U64Object
 * @param storageType StorageType
 * @returns true if the ledger has data for the given key
 */
export function hasData(key: Val, storageType:StorageType): bool {
    return toBool(has_contract_data(key, storageType));
}

/**
 * Stores contract data in the ledger for a given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @param value value to store. Any host value. E.g. U32Val, VecObject, etc.
 * @param storageType StorageType
 * @param flags If `flags` is `VoidVal`, then there will be no changes to flags for an existing entry, 
 * and none will be set if this is a new entry. Otherwise, `flags` is a `U32Val`. If the value is 0, then all flags are cleared. 
 * If it's not 0, then flags will be set to the passed in value.
 */
 export function putDataFor(smallSymbolKey: string, value: Val, storageType: StorageType) : void {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    put_contract_data(keySymbolVal, value, storageType);
}

/**
 * Stores contract data in the ledger for a given host value key.
 * @param key any host value.
 * @param value value to store. Any host value. E.g. U32Val, VecObject, etc.
 * @param storageType StorageType
 * @param flags If `flags` is `VoidVal`, then there will be no changes to flags for an existing entry, 
 * and none will be set if this is a new entry. Otherwise, `flags` is a `U32Val`. If the value is 0, then all flags are cleared. 
 * If it's not 0, then flags will be set to the passed in value.
 */
 export function putData(key: Val, value: Val, storageType: StorageType) : void {
    put_contract_data(key, value, storageType);
}

/**
 * Returns contract data from the ledger for a given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @param storageType StorageType
 * @return the found value if any.
 */
 export function getDataFor(smallSymbolKey: string, storageType: StorageType): Val {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    return get_contract_data(keySymbolVal, storageType);
}

/**
 * Returns contract data from the ledger for a given host value key.
 * @param key any host value.
 * @param storageType StorageType
 * @return the found value if any.
 */
 export function getData(key: Val, storageType: StorageType) : Val  {
    return get_contract_data(key, storageType);
}

/**
 * Deletes contract data from the ledger for a given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @param storageType StorageType
 */
 export function delDataFor(smallSymbolKey: string, storageType: StorageType): void {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    del_contract_data(keySymbolVal, storageType);
}

/**
 * Deletes contract data from the ledger for a given host value key.
 * @param key any host value.
 * @param storageType StorageType
 */
 export function delData(key: Val, storageType: StorageType): void {
    del_contract_data(key, storageType);
}

// DEPLOY 

/**
 * Creates the contract instance on behalf of `deployer`. `deployer` must authorize this call via Soroban auth framework, 
 * i.e. this calls `deployer.require_auth` with respective arguments. `wasm_hash` must be a hash of the contract code 
 * that has already been uploaded on this network. `salt` is used to create a unique contract id. Returns the address of the created contract.
 * @param deployer AddressObject deployer.
 * @param wasmHash bytes containing the wasm hash of the installed contract to be deployed.
 * @param salt bytes containing the salt needed for the new contractID
 * @returns the address of the created contract.
 */
export function deployContract(deployer: AddressObject, wasmHash: Bytes, salt:Bytes) : AddressObject {
    return create_contract(deployer, wasmHash.getHostObject(), salt.getHostObject());
}

/**
 * Creates the instance of Stellar Asset contract corresponding to the provided asset.
 * @param serializedAsset `stellar::Asset` XDR serialized to bytes format
 * @returns the address of the created contract.
 */
export function createAssetContract(serializedAsset: Bytes) : AddressObject {
    return create_asset_contract(serializedAsset.getHostObject());
}

/**
 * Uploads provided `wasm` bytecode to the network and returns its identifier (SHA-256 hash). 
 * No-op in case if the same Wasm object already exists.
 * @param wasm bytecode
 * @returns wasm hash (wasm id - SHA-256 hash)
 */
export function uploadWasm(wasm: Bytes) : Bytes {
    let res = upload_wasm(wasm.getHostObject())
    return new Bytes(res);
}


/**
 * Replaces the executable of the current contract with the provided Wasm code identified by a hash. 
 * Wasm entry corresponding to the hash has to already be present in the ledger. 
 * The update happens only after the current contract invocation has successfully finished, 
 * so this can be safely called in the middle of a function.
 * @param wasmHash Bytes containing the new wasm hash.
 * @returns void.
 */
export function updateCurrentContractWasm(wasmHash: Bytes) : void {
    update_current_contract_wasm(wasmHash.getHostObject());
}

/**
 * If the entry's TTL is below `threshold` ledgers, 
 * extend `live_until_ledger_seq` such that TTL == `extend_to`, 
 * where TTL is defined as live_until_ledger_seq - current ledger
 * @param k key - any host value.
 * @param t storage type
 * @param threshold treshold
 * @param extend_to extend to ttl
 */
export function extendContractDataTtl(k: Val, t:StorageType, threshold:u32, extend_to:u32) : void {
    extend_contract_data_ttl(k,t,fromU32(threshold), fromU32(extend_to));
}

/**
 * If the TTL for the current contract instance and code (if applicable) is below `threshold` ledgers, 
 * extend `live_until_ledger_seq` such that TTL == `extend_to`, 
 * where TTL is defined as live_until_ledger_seq - current ledger
 * @param threshold treshold
 * @param extend_to extend to ttl
 */
export function extendCurrentContractInstanceAndCodeTtl(threshold:u32, extend_to:u32) : void {
    extend_current_contract_instance_and_code_ttl(fromU32(threshold), fromU32(extend_to));
}

/**
 * If the TTL for the provided contract instance and code (if applicable) is below `threshold` ledgers, 
 * extend `live_until_ledger_seq` such that TTL == `extend_to`, 
 * where TTL is defined as live_until_ledger_seq - current ledger
 * @param contract AddressObject of the contract
 * @param threshold treshold
 * @param extend_to extend to ttl
 */
export function extendContractInstanceAndCodeTtl(contract:AddressObject, threshold:u32, extend_to:u32) : void {
    extend_contract_instance_and_code_ttl(contract, fromU32(threshold), fromU32(extend_to));
}

/**
 * Get the id of a contract without creating it. `deployer` is address of the contract deployer. 
 * `salt` is used to create a unique contract id. Returns the address of the would-be contract.
 * @param deployer address of the contract deployer
 * @param salt salt bytes
 * @returns the address of the would-be contract
 */
export function getContractId(deployer:AddressObject, salt:Bytes) : AddressObject {
    return get_contract_id(deployer, salt.getHostObject());
}

/**
 * Get the id of the Stellar Asset contract corresponding to the provided asset without creating the instance. 
 * `serializedAsset` is `stellar::Asset` XDR serialized to bytes format. Returns the address of the would-be asset contract.
 * @param serializedAsset `stellar::Asset` XDR serialized to bytes format
 * @returns the address of the would-be contract
 */
export function getAssetContractId(serializedAsset:Bytes) : AddressObject {
    return get_asset_contract_id(serializedAsset.getHostObject());
}

/**
 * If the TTL for the provided contract instance is below `threshold` ledgers, extend `live_until_ledger_seq` 
 * such that TTL == `extend_to`, where TTL is defined as live_until_ledger_seq - current ledger. 
 * If attempting to extend past the maximum allowed value (defined as the current ledger + `max_entry_ttl` - 1), 
 * the new `live_until_ledger_seq` will be clamped to the max.
 * @param contract AddressObject of the contract
 * @param threshold treshold
 * @param extend_to extend to ttl
 */
export function extendContractInstanceTtl(contract:AddressObject, threshold:u32, extend_to:u32) : void {
    extend_contract_instance_ttl(contract, fromU32(threshold), fromU32(extend_to));
}

/**
 * If the TTL for the provided contract's code (if applicable) is below `threshold` ledgers, extend `live_until_ledger_seq` 
 * such that TTL == `extend_to`, where TTL is defined as live_until_ledger_seq - current ledger. 
 * If attempting to extend past the maximum allowed value (defined as the current ledger + `max_entry_ttl` - 1), 
 * the new `live_until_ledger_seq` will be clamped to the max.
 * @param contract AddressObject of the contract
 * @param threshold treshold
 * @param extend_to extend to ttl
 */
export function extendContractCodeTtl(contract:AddressObject, threshold:u32, extend_to:u32) : void {
    extend_contract_code_ttl(contract, fromU32(threshold), fromU32(extend_to));
}
