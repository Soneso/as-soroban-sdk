import * as val from "./sdk/host_value";

export function add(a: val.RawVal, b: val.RawVal): val.RawVal {
  if (val.isI32(a) && val.isI32(b)) {
    return val.fromI32(val.toI32(a) + val.toI32(b));
  }
  return 0;
}
