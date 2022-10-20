import { ObjectVal, RawVal, toBool, fromSymbolStr} from "./value";

//TODO: improve (see: directly exposed host functions below)


/**
 * Checks if the ledger storse contract data for the given string key.
 * @param key a string max 10 characters [_0-9A-Za-z]
 * @returns true if the ledger has data for the given key
 */
export function has_data_for(key: string): bool {
    let keySymbolVal = fromSymbolStr(key);
    return toBool(has_contract_data(keySymbolVal));
}

/**
 * Checks if the ledger storse contract data for the given key.
 * @param key any host value. e.g. SymbolVal
 * @returns true if the ledger has data for the given key
 */
export function has_data(key: RawVal): bool {
    return toBool(has_contract_data(key));
}

/**
 * Stores contract data in the ledger for a given string key.
 * @param key a string max 10 characters [_0-9A-Za-z]
 * @param value value to store. Any host value. E.g. SymbolVal, VectorObject, etc.
 */
 export function put_data_for(key: string, value:RawVal) : void {
    let keySymbolVal = fromSymbolStr(key);
    put_contract_data(keySymbolVal, value);
}

/**
 * Stores contract data in the ledger for a given string key.
 * @param key a string max 10 characters [_0-9A-Za-z]
 * @param value value to store. Any host value. E.g. SymbolVal, VectorObject, etc.
 */
 export function put_data(key: RawVal, value:RawVal) : void {
    put_contract_data(key, value);
}

/**
 * Returns contract data from the ledger for a given string key.
 * @param key a string max 10 characters [_0-9A-Za-z]
 * @return the found value if any.
 */
 export function get_data_for(key: string): RawVal {
    let keySymbolVal = fromSymbolStr(key);
    return get_contract_data(keySymbolVal);
}

/**
 * Stores contract data in the ledger for a given string key.
 * @param key a string max 10 characters [_0-9A-Za-z]
 * @return the found value if any.
 */
 export function get_data(key: RawVal) : RawVal  {
    return get_contract_data(key);
}

/**
 * Deletes contract data from the ledger for a given string key.
 * @param key a string max 10 characters [_0-9A-Za-z]
 */
 export function del_data_for(key: string): void {
    let keySymbolVal = fromSymbolStr(key);
    del_contract_data(keySymbolVal);
}

/**
 * Deletes contract data from the ledger for a given string key.
 * @param key a string max 10 characters [_0-9A-Za-z]
 */
 export function del_data_(key: RawVal): void {
    del_contract_data(key);
}

/******************
 * HOST FUNCTIONS *
 ******************/

// @ts-ignore
@external("l", "_")
declare function put_contract_data(k:RawVal, v:RawVal): RawVal;

// @ts-ignore
@external("l", "0")
declare function has_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "1")
declare function get_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "2")
declare function del_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "3")
export declare function create_contract_from_ed25519(v:ObjectVal, salt:ObjectVal, key:ObjectVal, sig:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "4")
export declare function create_contract_from_contract(v:ObjectVal, salt:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "5")
export declare function create_token_from_ed25519(salt:ObjectVal, key:ObjectVal, sig:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "6")
export declare function create_token_from_contract(salt:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "7")
export declare function create_token_wrapper(asset:ObjectVal): ObjectVal;

// @ts-ignore
@external("l", "8")
export declare function create_contract_from_source_account(v:ObjectVal, salt:ObjectVal): ObjectVal;