import * as val from "../lib/value";
import * as ledger from "../lib/ledger";
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

export function increment(): val.RawVal {

  let key = "COUNTER";
  var counter = 0;
  if (ledger.has_data_for(key)) {
    let dataObj = ledger.get_data_for(key);
    counter = val.toU32(dataObj);
  }
  counter += 1;
  let counterObj = val.fromU32(counter);
  ledger.put_data_for(key, counterObj);
  return counterObj;
}