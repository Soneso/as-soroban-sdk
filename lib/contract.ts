import { call, try_call } from "./env";
import { Val, fromSmallSymbolStr, AddressObject} from "./value";
import { Vec } from "./vec";


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
 * Calls another contracts function by using the contract AddressObject, function as SmallSymbolVal and arguments contained in vector `args`.
 * @param contract AddressObject representing the contract to call
 * @param func string representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `ErrorVal` containing the error type and code.
 */
export function tryCallContract(contract: AddressObject, func: string, args: Vec): Val {
    return try_call(contract, fromSmallSymbolStr(func), args.getHostObject());
}