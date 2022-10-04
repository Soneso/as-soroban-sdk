import { ObjectVal, RawVal} from "./val";

//TODO

/******************
 * HOST FUNCTIONS *
 ******************/

// @ts-ignore
@external("l", "_")
export declare function put_contract_data(k:RawVal, v:RawVal): RawVal;

// @ts-ignore
@external("l", "0")
export declare function has_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "1")
export declare function get_contract_data(k:RawVal): RawVal;

// @ts-ignore
@external("l", "2")
export declare function del_contract_data(k:RawVal): RawVal;

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