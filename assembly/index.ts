import * as val from "./sdk/host_value";
import {BigInt} from "./sdk/bigint";

export function add(a: val.RawVal, b: val.RawVal): val.RawVal {

  let ax = val.toI32(a);
  let bx = val.toI32(b);
  let xa:i64 = ax + bx;
  let bi1 = BigInt.from_i64(xa);
  let bi2 = BigInt.from_i64(xa);
  bi1.add_assign(bi2);
  return (val.fromI32(bi1.to_i64() as i32));
}

