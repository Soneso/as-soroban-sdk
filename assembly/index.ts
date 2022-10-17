import * as val from "./sdk/host_value";
import { Vec } from "./sdk/vec";

export function hello(to: val.SymbolVal): val.VectorObject {

  let vec = new Vec();
  vec.push_front(val.fromString("hello"));
  vec.push_back(to);
  
  return vec.getHostObject();
  
}

export function add(a: val.RawVal, b: val.RawVal): val.RawVal {

 let ai32 = val.toI32(a);
 let bi32 = val.toI32(b);

 return (val.fromI32(ai32 + bi32));
}
