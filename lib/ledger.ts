import { RawVal, toBool, fromSmallSymbolStr, BytesObject, VoidVal, BoolVal } from "./value";

/**
 * Checks if the ledger stores contract data for the given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @returns true if the ledger has data for the given key
 */
export function hasDataFor(smallSymbolKey: string): bool {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    return toBool(has_contract_data(keySymbolVal));
}

/**
 * Checks if the ledger stores contract data for the given host value key.
 * @param key any host value. e.g. U64Object
 * @returns true if the ledger has data for the given key
 */
export function hasData(key: RawVal): bool {
    return toBool(has_contract_data(key));
}

/**
 * Stores contract data in the ledger for a given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @param value value to store. Any host value. E.g. U32Val, VecObject, etc.
 */
 export function putDataFor(smallSymbolKey: string, value: RawVal) : void {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    put_contract_data(keySymbolVal, value);
}

/**
 * Stores contract data in the ledger for a given host value key.
 * @param key any host value.
 * @param value value to store. Any host value. E.g. U32Val, VecObject, etc.
 */
 export function putData(key: RawVal, value: RawVal) : void {
    put_contract_data(key, value);
}

/**
 * Returns contract data from the ledger for a given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 * @return the found value if any.
 */
 export function getDataFor(smallSymbolKey: string): RawVal {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    return get_contract_data(keySymbolVal);
}

/**
 * Returns contract data from the ledger for a given host value key.
 * @param key any host value.
 * @return the found value if any.
 */
 export function getData(key: RawVal) : RawVal  {
    return get_contract_data(key);
}

/**
 * Deletes contract data from the ledger for a given small symbol string key.
 * @param symbolKey a string max 9 characters [_0-9A-Za-z]
 */
 export function delDataFor(smallSymbolKey: string): void {
    let keySymbolVal = fromSmallSymbolStr(smallSymbolKey);
    del_contract_data(keySymbolVal);
}

/**
 * Deletes contract data from the ledger for a given host value key.
 * @param key any host value.
 */
 export function delData(key: RawVal): void {
    del_contract_data(key);
}

// DEPLOY 

/**
 * Deploys an installed contract.
 * @param wasmHash BytesObject containing the wasm hash of the installed contract to be deployed.
 * @param salt BytesObject containing the salt needed for the new contractID
 * @returns the new contractID as BytesObject.
 */
export function deployContract(wasmHash: BytesObject, salt:BytesObject) : BytesObject {
    return create_contract_from_contract(wasmHash, salt);
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

/******************
 * HOST FUNCTIONS *
 ******************/

// @ts-ignore
@external("l", "_")
declare function put_contract_data(k:RawVal, v:RawVal): VoidVal;

// @ts-ignore
@external("l", "0")
declare function has_contract_data(k:RawVal): BoolVal;

// @ts-ignore
@external("l", "1")
declare function get_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "2")
declare function del_contract_data(k:RawVal): VoidVal;

/// Deploys a contract from the current contract. `wasm_hash` must be a hash of the contract code that has already 
/// been installed on this network. `salt` is used to create a unique contract id.
// @ts-ignore
@external("l", "3")
declare function create_contract_from_contract(wasm_hash:BytesObject, salt:BytesObject): BytesObject;

/// Replaces the executable of the current contract with the provided Wasm code identified by a hash. 
/// Wasm entry corresponding to the hash has to already be present in the ledger. 
/// The update happens only after the current contract invocation has successfully finished, 
/// so this can be safely called in the middle of a function.
// @ts-ignore
@external("l", "4")
declare function update_current_contract_wasm(hash:BytesObject): VoidVal;