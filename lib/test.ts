import { RawVal } from "./value";

/******************
 * HOST FUNCTIONS *
 ******************/

/// A dummy function taking 0 arguments and performs no-op.
/// This function is for test purpose only, for measuring the 
/// roundtrip cost of invoking a host function, i.e. host->Vm->host. 
// @ts-ignore
@external("t", "_")
export declare function dummy0(): RawVal;