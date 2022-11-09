import * as val from "../../lib/value";
import * as context from "../../lib/context";
import { Map } from "../../lib/map";
import { Vec } from "../../lib/vec";
import { Bytes } from "../../lib/bytes";

export function maps(): val.RawVal {

  let map = new Map();

  let key1 = val.fromSymbolStr("key1");
  let value1 = val.fromSymbolStr("value1");
  map.put(key1, value1);

  let key2 = val.fromU32(12);
  let value2 = val.fromU32(122);
  map.put(key2, value2); // in front!

  if (map.len() != 2) {
    return val.fromFalse();
  }

  let value1test = map.get(key1);
  let value2test = map.get(key2);
  if (context.compare(value1, value1test) != 0 || context.compare(value2, value2test) != 0) {
    return val.fromFalse();
  }

  map.del(key2);
  if (map.len() != 1 || !map.has(key1)) {
    return val.fromFalse();
  }

  map.put(key2, value2); //in front!

  let minKey = map.getMinKey();
  let maxKey = map.getMaxKey();
  if (key1 != maxKey || key2 != minKey) {
    return val.fromFalse();
  }

  let k2Test = map.getPrevKey(key1);
  let k1Test = map.getNextKey(key2);
  
  if (k2Test != key2 || k1Test != key1) {
    return val.fromFalse();
  }

  let keys = map.keys();
  let front = keys.front();
  let back = keys.back();
  
  if (key1 != back || key2 != front) {
    return val.fromFalse();
  }
  
  let values = map.values();
  let vFront = values.front();
  let vBack = values.back();
  
  if (value1 != vBack || value2 != vFront) {
    return val.fromFalse();
  }
  
  let map2 = new Map();
  map2.put(key1, value1);
  map2.put(key2, value2);

  let map3 = new Map(map.getHostObject());

  let comp = context.compare(map2.getHostObject(), map3.getHostObject());
  if (comp != 0) {
    return val.fromFalse();
  }

  return val.fromTrue();
}

export function vecs(): val.RawVal {

    let vec = new Vec();
    let val1 = val.fromU32(12);
    let val2 = new Map();
    val2.put(val.fromI32(-11), val.fromSymbolStr("hello"));
    vec.pushFront(val1);
    vec.pushBack(val2.getHostObject());

    vec.insert(0, vec.getHostObject());

    if(vec.len() != 3) {
        return val.fromFalse();
    }

    vec.popFront();
    vec.popBack();
    if(vec.len() != 1) {
        return val.fromFalse();
    }

    vec.pushBack(val2.getHostObject());

    let val1Test = vec.front();
    if (val1Test != val1) {
        return val.fromFalse();
    }

    let val2Test = vec.back();
    if (context.compare(val2Test, val2.getHostObject()) != 0) {
        return val.fromFalse();
    }

    vec.put(0, val2.getHostObject());
    vec.put(1, val1);
    
    let v2Test = vec.get(0);
    let v1Test = vec.get(1);
    if (context.compare(v2Test, val2.getHostObject()) != 0 || v1Test != val1) {
        return val.fromFalse();
    }

    vec.del(0);
    v1Test = vec.get(0);
    if (vec.len() != 1 || v1Test != val1) {
        return val.fromFalse();
    }

    vec.del(0);

    let t0 = val.fromU32(0);
    let t1 = val.fromU32(1);
    let t2 = val.fromU32(2);
    let t3 = val.fromU32(3);
    let t4 = val.fromU32(4);
    let t5 = val.fromU32(5);

    vec.pushBack(t0);
    vec.pushBack(t1);
    vec.pushBack(t2);
    vec.pushBack(t3);
    vec.pushBack(t4);
    vec.pushBack(t5);
    vec.pushBack(t2);

    let slice = vec.slice(1,4);
    if (slice.len() != 3 || slice.get(0) != vec.get(1) || slice.get(2) != vec.get(3)) {
        return val.fromFalse();
    }

    let firstIndexTest = vec.getFirstIndexOf(t2);
    let lastIndexTest = vec.getLastIndexOf(t2);

    let voidVal = val.fromVoid();

    if (firstIndexTest == voidVal || lastIndexTest == voidVal 
        || val.toU32(firstIndexTest) != 2 || val.toU32(lastIndexTest) != 6) {
        return val.fromFalse();
    }

    vec.append(slice);
    if (vec.len() != 10 || vec.get(9) != vec.get(3)) {
        return val.fromFalse();
    }

    let b = vec.binarySearch(t3) as u32;
    if (b != 3) {
        return val.fromFalse();
    }

    let vec2 = Vec.newWithCapacity(3);
    vec2.append(slice);
    if (vec2.len() != 3) {
        return val.fromFalse();
    }

    if(context.compare(vec2.getHostObject(), slice.getHostObject()) != 0) {
        return val.fromFalse();
    }
    return val.fromTrue();
}

export function bytes(): val.RawVal {


    let val1 = val.fromU32(12);
    let sb = Bytes.serialize(val1);
    let val2 = sb.deserialize();

    if(val1 != val2) {
        return val.fromFalse();
    }


    let c = Bytes.fromString("hello");
    c.copyToLinearMemory(val.fromU32(0), val.fromU32(0), val.fromU32(5));
    let d = Bytes.newFromLinearMemory(val.fromU32(0), val.fromU32(5));
    if(context.compare(c.getHostObject(), d.getHostObject()) != 0) {
        return val.fromFalse();
    }
    let e = new Bytes();
    e.copyFromLinearMemory(val.fromU32(0), val.fromU32(0), val.fromU32(5));
    if(context.compare(e.getHostObject(), d.getHostObject()) != 0) {
        return val.fromFalse();
    }

    let b = new Bytes();
    let t0 = val.fromU32(0);
    let t1 = val.fromU32(1);
    let t2 = val.fromU32(2);
    let t3 = val.fromU32(3);
    let t4 = val.fromU32(4);
    let t5 = val.fromU32(5);
    b.push(t0);
    b.push(t1);
    b.push(t2);
    b.push(t3);
    b.push(t4);
    b.push(t5);
    b.push(t2);

    if(b.len() != 7) {
        return val.fromFalse();
    }
    b.del(6);
    b.pop();
    if(b.len() != 5 || b.front() != t0 || b.back() != t4) {
        return val.fromFalse();
    }

    b.insert(2, t5);
    if(b.len() != 6 || b.get(2) != t5) {
        return val.fromFalse();
    }
    b.del(2);

    let b2 = new Bytes();
    b2.push(t5);
    b2.push(t2);

    let b3 = b.append(b2);
    if(b3.len() != 7 || b3.back() != t2) {
        return val.fromFalse();
    }

    let b4 = b3.slice(0, 3);
    let b5 = b.slice(0, 3);
    if (context.compare(b4.getHostObject(), b5.getHostObject()) != 0) {
        return val.fromFalse();
    }

    b4.put(1,t3);
    if (b4.get(1) != t3) {
        return val.fromFalse();
    }

    return val.fromTrue();
}