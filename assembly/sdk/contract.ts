import { VectorObject, RawVal, SymbolVal, ObjectVal} from "./val";

//TODO

/******************
 * HOST FUNCTIONS *
 ******************/

/// Calls a function in another contract with arguments contained in vector `args`.
/// If the call is successful, forwards the result of the called function. Traps otherwise.
// @ts-ignore
@external("c", "_")
export declare function call(contract: ObjectVal, func: SymbolVal, args: VectorObject): RawVal;

/// Calls a function in another contract with arguments contained in vector `args`. Returns:
/// - if successful, result of the called function.
/// - otherwise, an `SCStatus` containing the error status code.
// @ts-ignore
@external("c", "0")
export declare function try_call(contract: ObjectVal, func: SymbolVal, args: VectorObject): RawVal;