import { Bytes } from "./bytes";
import { VecObject, RawVal, SmallSymbolVal, fromSmallSymbolStr, BytesObject, Symbol} from "./value";

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param id id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function callContractById(id: string, func: string, args: VecObject): RawVal {
    let b = Bytes.fromContractId(id);
    return call_ctr(b.getHostObject(), fromSmallSymbolStr(func), args);
}

/**
 * Calls another contracts function by using the contract id as BytesObject, function as SmallSymbolVal and arguments contained in vector `args`.
 * @param contract BytesObject representing the contract if to call
 * @param func SmallSymbolVal representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function callContract(contract: BytesObject, func: SmallSymbolVal, args: VecObject): RawVal {
    return call_ctr(contract, func, args);
}

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param id id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `SCStatus` containing the error status code.
 */
export function tryCallContractById(id: string, func: string, args: VecObject): RawVal {
    let b = Bytes.fromContractId(id);
    return try_call_ctr(b.getHostObject(), fromSmallSymbolStr(func), args);
}

/**
 * Calls another contracts function by using the contract id as BytesObject, function as SmallSymbolVal and arguments contained in vector `args`.
 * @param contract BytesObject representing the contract if to call
 * @param func SmallSymbolVal representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `SCStatus` containing the error status code.
 */
export function tryCallContract(contract: BytesObject, func: SmallSymbolVal, args: VecObject): RawVal {
    return try_call_ctr(contract, func, args);
}

/******************
 * HOST FUNCTIONS *
 ******************/

/// Calls a function in another contract with arguments contained in vector `args`.
/// If the call is successful, forwards the result of the called function. Traps otherwise.
// @ts-ignore
@external("d", "_")
declare function call_ctr(contract: BytesObject, func: Symbol, args: VecObject): RawVal;

/// Calls a function in another contract with arguments contained in vector `args`. Returns:
/// - if successful, result of the called function.
/// - otherwise, an `SCStatus` containing the error status code.
// @ts-ignore
@external("d", "0")
declare function try_call_ctr(contract: BytesObject, func: Symbol, args: VecObject): RawVal;