import * as val from "../lib/value";
import { Vec } from "../lib/vec";

export function hello(to: val.SymbolVal): val.VectorObject {

  let vec = new Vec();
  vec.push_front(val.fromString("Hello"));
  vec.push_back(to);
  
  return vec.getHostObject();
  
}

export function add(a: val.RawVal, b: val.RawVal): val.RawVal {

  let ai32 = val.toI32(a);
  let bi32 = val.toI32(b);

  return (val.fromI32(ai32 + bi32));
}