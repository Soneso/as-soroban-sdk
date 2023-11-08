import { contractIdToAddress } from "./address";
import { Bytes } from "./bytes";
import { call, try_call } from "./env";
import { Val, fromSmallSymbolStr, AddressObject} from "./value";
import { Vec } from "./vec";

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param hexId id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector of raw values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function callContractById(hexId: string, func: string, args: Vec): Val {
    let contractIdBytes = Bytes.fromContractId(hexId);
    let contractAddress = contractIdToAddress(contractIdBytes);
    return call(contractAddress, fromSmallSymbolStr(func), args.getHostObject());
}

/**
 * Calls another contracts function by using the contract AddressObject, function as SmallSymbolVal and arguments contained in vector `args`.
 * @param contract AddressObject representing the contract to call
 * @param func name of the function to call as a string.
 * @param args arguments of the function to call. vector of host values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function callContract(contract: AddressObject, func: string, args: Vec): Val {
    return call(contract, fromSmallSymbolStr(func), args.getHostObject());
}

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param id id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `ErrorVal` containing the error type and code.
 */
export function tryCallContractById(hexId: string, func: string, args: Vec): Val {
    let contractIdBytes = Bytes.fromContractId(hexId);
    let contractAddress = contractIdToAddress(contractIdBytes);
    return try_call(contractAddress, fromSmallSymbolStr(func), args.getHostObject());
}

/**
 * Calls another contracts function by using the contract AddressObject, function as SmallSymbolVal and arguments contained in vector `args`.
 * @param contract AddressObject representing the contract to call
 * @param func string representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `ErrorVal` containing the error type and code.
 */
export function tryCallContract(contract: AddressObject, func: string, args: Vec): Val {
    return try_call(contract, fromSmallSymbolStr(func), args.getHostObject());
}