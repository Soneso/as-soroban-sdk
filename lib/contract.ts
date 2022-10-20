import { Bytes } from "./bytes";
import { VectorObject, RawVal, SymbolVal, fromSymbolStr, BytesObject} from "./value";

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param id id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function call_by_id(id: string, func: string, args: VectorObject): RawVal {
    let b = Bytes.fromContractId(id);
    return call_ctr(b.getHostObject(), fromSymbolStr(func), args);
}

/**
 * Calls another contracts function by using the contract id as BytesObject, function as SymbolVal and arguments contained in vector `args`.
 * @param contract BytesObject representing the contract if to call
 * @param func SymbolVal representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Traps otherwise.
 */
export function call(contract: BytesObject, func: SymbolVal, args: VectorObject): RawVal {
    return call_ctr(contract,func,args);
}

/**
 * Calls another contracts function by using the contract id, function name and arguments contained in vector `args`.
 * @param id id of the contract to call. Must be a hex string.
 * @param func name of the function to call.
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `SCStatus` containing the error status code.
 */
export function try_call_by_id(id: string, func: string, args: VectorObject): RawVal {
    let b = Bytes.fromContractId(id);
    return try_call_ctr(b.getHostObject(), fromSymbolStr(func), args);
}

/**
 * Calls another contracts function by using the contract id as BytesObject, function as SymbolVal and arguments contained in vector `args`.
 * @param contract BytesObject representing the contract if to call
 * @param func SymbolVal representing the name of the function call
 * @param args arguments of the function to call. vector af raw values.
 * @returns If the call is successful, forwards the result of the called function. Otherwise, an `SCStatus` containing the error status code.
 */
export function try_call(contract: BytesObject, func: SymbolVal, args: VectorObject): RawVal {
    return try_call_ctr(contract,func,args);
}

/******************
 * HOST FUNCTIONS *
 ******************/

/// Calls a function in another contract with arguments contained in vector `args`.
/// If the call is successful, forwards the result of the called function. Traps otherwise.
// @ts-ignore
@external("d", "_")
declare function call_ctr(contract: BytesObject, func: SymbolVal, args: VectorObject): RawVal;

/// Calls a function in another contract with arguments contained in vector `args`. Returns:
/// - if successful, result of the called function.
/// - otherwise, an `SCStatus` containing the error status code.
// @ts-ignore
@external("d", "0")
declare function try_call_ctr(contract: BytesObject, func: SymbolVal, args: VectorObject): RawVal;