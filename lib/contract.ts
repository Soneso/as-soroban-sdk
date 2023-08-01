import { contractIdToAddress } from "./address";
import { Bytes } from "./bytes";
import { call, try_call } from "./env";
import { VecObject, RawVal, SmallSymbolVal, fromSmallSymbolStr, AddressObject} from "./value";

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param id id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function callContractById(id: string, func: string, args: VecObject): RawVal {
    let contractIdBytes = Bytes.fromContractId(id);
    let contractAddress = contractIdToAddress(contractIdBytes);
    return call(contractAddress, fromSmallSymbolStr(func), args);
}

/**
 * Calls another contracts function by using the contract AddressObject, function as SmallSymbolVal and arguments contained in vector `args`.
 * @param contract AddressObject representing the contract to call
 * @param func SmallSymbolVal representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function callContract(contract: AddressObject, func: SmallSymbolVal, args: VecObject): RawVal {
    return call(contract, func, args);
}

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param id id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `SCError` containing the error code.
 */
export function tryCallContractById(id: string, func: string, args: VecObject): RawVal {
    let contractIdBytes = Bytes.fromContractId(id);
    let contractAddress = contractIdToAddress(contractIdBytes);
    return try_call(contractAddress, fromSmallSymbolStr(func), args);
}

/**
 * Calls another contracts function by using the contract AddressObject, function as SmallSymbolVal and arguments contained in vector `args`.
 * @param contract AddressObject representing the contract to call
 * @param func SmallSymbolVal representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `SCError` containing the error code.
 */
export function tryCallContract(contract: AddressObject, func: SmallSymbolVal, args: VecObject): RawVal {
    return try_call(contract, func, args);
}