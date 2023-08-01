import { create_asset_contract, create_contract, del_contract_data, get_contract_data, has_contract_data, 
    put_contract_data, update_current_contract_wasm, upload_wasm } from "./env";
import { RawVal, toBool, fromSmallSymbolStr, BytesObject, StorageType, AddressObject} from "./value";

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
export function hasData(key: RawVal, storageType:StorageType): bool {
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
 export function putDataFor(smallSymbolKey: string, value: RawVal, storageType: StorageType, flags: RawVal) : void {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    put_contract_data(keySymbolVal, value, storageType, flags);
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
 export function putData(key: RawVal, value: RawVal, storageType: StorageType, flags: RawVal) : void {
    put_contract_data(key, value, storageType, flags);
}

/**
 * Returns contract data from the ledger for a given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @param storageType StorageType
 * @return the found value if any.
 */
 export function getDataFor(smallSymbolKey: string, storageType: StorageType): RawVal {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    return get_contract_data(keySymbolVal, storageType);
}

/**
 * Returns contract data from the ledger for a given host value key.
 * @param key any host value.
 * @param storageType StorageType
 * @return the found value if any.
 */
 export function getData(key: RawVal, storageType: StorageType) : RawVal  {
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
 export function delData(key: RawVal, storageType: StorageType): void {
    del_contract_data(key, storageType);
}

// DEPLOY 

/**
 * Creates the contract instance on behalf of `deployer`. `deployer` must authorize this call via Soroban auth framework, 
 * i.e. this calls `deployer.require_auth` with respective arguments. `wasm_hash` must be a hash of the contract code 
 * that has already been uploaded on this network. `salt` is used to create a unique contract id. Returns the address of the created contract.
 * @param deployer AddressObject deployer.
 * @param wasmHash BytesObject containing the wasm hash of the installed contract to be deployed.
 * @param salt BytesObject containing the salt needed for the new contractID
 * @returns the address of the created contract.
 */
export function deployContract(deployer: AddressObject, wasmHash: BytesObject, salt:BytesObject) : AddressObject {
    return create_contract(deployer, wasmHash, salt);
}

/**
 * Creates the instance of Stellar Asset contract corresponding to the provided asset.
 * @param serializedAsset `stellar::Asset` XDR serialized to bytes format
 * @returns the address of the created contract.
 */
export function createAssetContract(serializedAsset: BytesObject) : AddressObject {
    return create_asset_contract(serializedAsset);
}

/**
 * Uploads provided `wasm` bytecode to the network and returns its identifier (SHA-256 hash). 
 * No-op in case if the same Wasm object already exists.
 * @param wasm bytecode
 * @returns wasm hash (wasm id - SHA-256 hash)
 */
export function uploadWasm(wasm: BytesObject) : BytesObject {
    return upload_wasm(wasm);
}


/**
 * Replaces the executable of the current contract with the provided Wasm code identified by a hash. 
 * Wasm entry corresponding to the hash has to already be present in the ledger. 
 * The update happens only after the current contract invocation has successfully finished, 
 * so this can be safely called in the middle of a function.
 * @param wasmHash BytesObject containing the new wasm hash.
 * @returns void.
 */
export function updateCurrentContractWasm(wasmHash: BytesObject) : void {
    update_current_contract_wasm(wasmHash);
}