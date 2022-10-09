import * as val from "./sdk/host_value";
import {Vec} from "./sdk/vec";

export function add(a: val.RawVal, b: val.RawVal): val.RawVal {

  let vec = new Vec();
  vec.push_front(a);
  vec.put(0,b);
  return (vec.get(0));
}

/*

  //let ab = "1jajjsskja";
  //let abs = String.UTF8.encode(ab);
  //let hope = toUTF8Array(ab);
  //var charcode = ab.charCodeAt(0);

function toUTF8Array(str:string) : u8[] {
  var utf8 : u8[] = [];
  return utf8;
}*/

