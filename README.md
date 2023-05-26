# [Stellar Soroban SDK for AssemblyScript](https://github.com/Soneso/as-soroban-sdk)

![v0.2.1](https://img.shields.io/badge/v0.2.1-yellow.svg)

This AssemblyScript SDK is for writing contracts for [Soroban](https://soroban.stellar.org). Soroban is a smart contracts platform from Stellar that is designed with purpose and built to perform.

**This repository contains code that is in early development, incomplete, not fully tested. The API is experimental, and is receiving breaking changes frequently.**

**This version supports soroban preview 9  & interface version 37**

## Quick Start

### 1. Setup a new project

Set up a new AssemblyScript project as described in the [AssemblyScript Book](https://www.assemblyscript.org/getting-started.html#setting-up-a-new-project)

```shell
$ mkdir hello
$ cd hello
$ npm init
$ npm install --save-dev assemblyscript
$ npx asinit .

```

### 2. Install the SDK

```shell
$ npm install as-soroban-sdk

```

### 3. Write your contract
You can now write your contract in the ```./assembly/index.ts``` file. For example:

```typescript
import {SmallSymbolVal, VecObject, fromSmallSymbolStr} from 'as-soroban-sdk/lib/value';
import {Vec} from 'as-soroban-sdk/lib/vec';

export function hello(to: SmallSymbolVal): VecObject {

  let vec = new Vec();
  vec.pushFront(fromSmallSymbolStr("Hello"));
  vec.pushBack(to);
  
  return vec.getHostObject();
}
```

Next you need to add a ```contract.json``` file to the project. It must contain the metadata for your contract.

```json
{
    "name": "hello word",
    "version": "0.1.8",
    "description": "my first contract",
    "host_functions_version": 37,
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "vec[symbol]"
        }
    ]
}
```

Finally, edit the ```asconfig.json``` file of your project. Replace its content with the following:

```json
{
  "extends": "as-soroban-sdk/sdkasconfig",
  "targets": {
    "release": {
      "outFile": "build/release.wasm",
      "textFile": "build/release.wat"
    },
    "debug": {
      "outFile": "build/debug.wasm",
      "textFile": "build/debug.wat"
    }
  }
}
```

### 4. Compile your contract

```shell
$ asc assembly/index.ts --target release
```

You can find the generated ```.wasm``` (WebAssembly) file in the ```build``` folder. You can also find the ```.wat``` file there (Text format of the ```.wasm```).

### 5. Run your contract (sandbox)

To run the contract, you must first install the official soroban cli as described here: [stellar soroban cli](https://github.com/stellar/soroban-cli).

```shell
$ cargo install --locked --version 0.8.0 soroban-cli
```

Run your contract:

```shell
$ soroban contract invoke --wasm build/release.wasm --id 1 -- hello --to friend
```

You can also use one of our Stellar SDKs to deploy and invoke contracts:

- [Stellar iOS SDK](https://github.com/Soneso/stellar-ios-mac-sdk/blob/master/soroban.md)
- [Stellar Flutter SDK](https://github.com/Soneso/stellar_flutter_sdk/blob/master/soroban.md)
- [Stellar PHP SDK](https://github.com/Soneso/stellar-php-sdk/blob/main/soroban.md)


## Features and limitations

In the [Build your own SDK](https://soroban.stellar.org/docs/SDKs/byo) chapter of the official [Soroban documentation](https://soroban.stellar.org), one can find the requirements for a Soroban SDK.

This assembly script Soroban SDK **can** help you with:
- Value Conversions
- Host functions
- SDK Types
- User Defined Errors
- Meta Generation
- Contract Spec Generation
- Testing
 

### Value Conversions

When calling a contract function the host will only pass ```u64``` raw values. The raw values can encode different types of values (e.g. `i32`, `u32`, `symbol`, `timestamp`, `bool` etc.) or ```object handles``` such as references to vectors, maps, bytes, strings that live in the host.

The SDK can encode and decode these values. For example converting primitives like i32:

```typescript
import * as val from "as-soroban-sdk/lib/value";

// primitives
let xi32 = val.toI32(rawValue);
let xRaw = val.fromI32(xi32); 

// static values
let isTrue = val.fromBool(rawVal);
let rawBool = val.toBool(isTrue);

// objects
let isVecObj = val.isVec(rawVal); 
// this rawVal (u64) is a object handle referencing an vector object that lives on the host

if (isVecObj) {
    let myVec = new Vec(rawVal); // init a (SDK Type) Vec from the handle.
    myVec.pushFront(val.fromSmallSymbolStr("Hello"));
    let rawVecObj = myVec.getHostObject();
}

// symbols
let myRawSymbol = val.fromSmallSymbolStr("Hello");

// etc.
```

### Host functions

The host functions defined in [env.json](https://github.com/stellar/rs-soroban-env/blob/main/soroban-env-common/env.json) are functions callable from within the WASM Guest environment. The SDK makes them available to contracts to call in a wrapped form so that contracts have a nicer interface and less abstraction.

For example:

```typescript
function callContractById(id: string, func: string, args: VecObject): RawVal 
```
or 

```typescript
function putDataFor(symbolKey: string, value: RawVal) : void
```

### SDK Types

Following types are supported by this SDK: `Map`, `Vec`, `Bytes`, `Str`, `Sym`.

For example work with a vector:

``` typescript
let vec = new Vec();

vec.pushFront(fromSmallSymbolStr("Hello"));
vec.pushBack(fromSmallSymbolStr("friend"));

return vec.getHostObject();
```

or a map:
``` typescript
let myMap = new Map();

myMap.put(fromU32(1), fromSmallSymbolStr("Hello"));
myMap.put(fromU32(2), fromSmallSymbolStr("friend"));
myMap.put(vec.getHostObject(), fromTrue());

return myMap.getHostObject();
```

### User Defined Errors

Errors are u32 values that are translated into a Status. This SDK helps you to create and parse such errors. For example:

```typescript
context.failWithErrorCode(AGE_ERR_CODES.TOO_YOUNG);
```

or 
```typescript
if(isStatus(rawVal) && getStatusType(rawVal) == statusStorageErr) {
    return fromU32(getStatusCode(rawVal))
}
```

See also: [as-soroban-examples](https://github.com/Soneso/as-soroban-examples)

### Meta generation

Contracts must contain a WASM custom section with name ```contractenvmetav0``` and containing a serialized ```SCEnvMetaEntry```. The interface version stored within should match the version of the host functions supported.

The AssemblyScript Soroban SDK simplifies this by providing the possibility to enter the interface version number in the ```contract.json``` file. See also [Understanding contract metadata](https://github.com/Soneso/as-soroban-sdk#understanding-contract-metadata).


### Contract spec generation

Contracts should contain a WASM custom section with name ```contractspecv0``` and containing a serialized stream of ```SCSpecEntry```. There should be a ```SCSpecEntry``` for every function, struct, and union exported by the contract.

The AS Soroban SDK simplifies this by providing the possibility to enter the functions spec in the ```contract.json``` file. See also [Understanding contract metadata](https://github.com/Soneso/as-soroban-sdk#understanding-contract-metadata).


### User Defined Types

Currently the SDK supports only simple enums from scratch.

For example:

```typescript
enum ALLOWED_AGE_RANGE {
  MIN = 18,
  MAX = 99
}
enum AGE_ERR_CODES {
  TOO_YOUNG = 1,
  TOO_OLD = 2
}

export function checkAge(age: I32Val): Symbol {

  let age2check = toI32(age);

  if (age2check < ALLOWED_AGE_RANGE.MIN) {
    failWithErrorCode(AGE_ERR_CODES.TOO_YOUNG);
  }

  if (age2check > ALLOWED_AGE_RANGE.MAX) {
    failWithErrorCode(AGE_ERR_CODES.TOO_OLD);
  }

  return fromSmallSymbolStr("OK");
}
```

However, one can create own user defined types with ease by translating them into Maps or Vectors using the SDK.

## Testing

Testing can be done to some extent by using **events** and the **soroban-cli**.

See the [testing example](https://github.com/Soneso/as-soroban-examples/tree/main/testing) that demonstrates a simple way to test a contract.

## Logging

You can log for purpose of debugging. Logs are only visible when executing contracts using ```soroban-cli```. Do not use logs elsewhere.

### Log an utf8 string

```typescript
import * as context from 'as-soroban-sdk/lib/context';

context.logStr("Today is a sunny day!");
```

### Log a formatted utf8 string message

```typescript
import * as context from 'as-soroban-sdk/lib/context';

let args = new Vec();
args.pushBack(val.fromI32(30));
args.pushBack(val.fromSmallSymbolStr("celsius"));
context.logFtm("We have {} degrees {}!", args);

```

See also: [as-soroban-examples](https://github.com/Soneso/as-soroban-examples)

## Publishing events

This AssemblyScript Soroban SDK makes it easy to publish events from a contract. This can also be very useful for testing.

```typescript
context.publishSimpleEvent("STATUS", val.fromU32(1));
```
or
```typescript
let topicsVec = new Vec();

topicsVec.pushBack(val.fromSmallSymbolStr("TOPIC1"));
topicsVec.pushBack(val.fromSmallSymbolStr("TOPIC2"));
topicsVec.pushBack(val.fromSmallSymbolStr("TOPIC3"));

let dataVec = new Vec();
dataVec.pushBack(val.fromU32(223));
dataVec.pushBack(val.fromU32(222));
dataVec.pushBack(val.fromU32(221));

context.publishEvent(topicsVec, dataVec.getHostObject());
```

See also: [as-soroban-examples](https://github.com/Soneso/as-soroban-examples)


## Understanding contract metadata

To be able to run a contract, the compiled ```.wasm``` file needs to contain the web assembly module metadata and contract spec.

They need to be attached to the ```.wasm``` module. Therefore we need the ```contract.json``` file.

The SDK parses the ```contract.json``` file when compiling the contract and converts it to the needed data structures to be added to the ```.wasm``` module. This is done by using an AssemblyScript transform (see: [transforms.mjs](https://github.com/Soneso/as-soroban-sdk/blob/main/transforms.mjs)). 

Required fields are ```host_functions_version``` and the ```functions``` array in a ```contract.json``` file located in the root directory of your assembly script project.

Example:

```json
{
    "name": "hello word",
    "version": "0.1.8",
    "description": "my first contract",
    "host_functions_version": 37,
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "vec[symbol]"
        }
    ]
}
```

To find out the needed ```host_functions_version``` you can execute the ```soroban version``` command of the soroban-cli. The interface version stored within should match the version of the host functions supported.

``` shell
$ soroban version
```
output at the time of writing:

``` shell
soroban-env interface version 37
```

Additionally you must define the metadata for each function exported by your contract. In the upper example there is only one function named ```hello```.
You must define the name, the arguments and the return value of the function, so that the host environment can execute it.

```json
{
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "vec[symbol]"
        }
    ]
}
```

Supported argument types are currently: `val` (any type of host value), `u32`, `i32`, `u64`, `i64`, `u128`, `i128`, `u256`, `i256`,`bool`, `symbol`, `string`, `status`, `bytes`, `val`, `void`, `timepoint`, `duration`, `address`, `option[valueType]`, `result[okType, errorType]`, `vec[elementType]`, `map[keyType, valueType]`, `set[elementType]` ,`bytesN[size]`. If your function has no arguments, you can pass an empty array.

Supported return value types are the same as the supported argument types. If your function has no return value you must return void as a static raw value. You can obtain it by using ```val.fromVoid()```. For this case you should set ```"returns" : "void"``` or remove `"returns"` in the contract.json.

See also [Meta Generation](https://soroban.stellar.org/docs/SDKs/byo#meta-generation) and [Contract Spec Generation](https://soroban.stellar.org/docs/SDKs/byo#contract-spec-generation)


## Examples
You can find examples in our [as-soroban-examples](https://github.com/Soneso/as-soroban-examples) repository:

| Example | Description |
| :--- | :--- |
| [add example](https://github.com/Soneso/as-soroban-examples/tree/main/add)| Demonstrates how to write a simple contract, with a single function that takes two i32 inputs and returns their sum as an output. |
| [hello word example](https://github.com/Soneso/as-soroban-examples/tree/main/hello_word)| Demonstrates how to write a simple contract, with a single function that takes one input and returns it as an output. |
| [increment example](https://github.com/Soneso/as-soroban-examples/tree/main/increment)| Demonstrates how to write a simple contract that stores data, with a single function that increments an internal counter and returns the value.| 
| [logging example](https://github.com/Soneso/as-soroban-examples/tree/main/logging)| Demonstrates how to log for the purpose of debugging.|
| [cross contract call example](https://github.com/Soneso/as-soroban-examples/tree/main/cross_contract)| Demonstrates how to call a contract from another contract.|
| [auth example](https://github.com/Soneso/as-soroban-examples/tree/main/auth)| Demonstrates how to implement authentication and authorization using the [Soroban Host-managed auth framework](https://soroban.stellar.org/docs/learn/authorization).|
| [deployer example](https://github.com/Soneso/as-soroban-examples/tree/main/deployer)| Demonstrates how to deploy contracts using a contract.|
| [errors example](https://github.com/Soneso/as-soroban-examples/tree/main/errors)| Demonstrates how to define and generate errors in a contract that invokers of the contract can understand and handle.|
| [events example](https://github.com/Soneso/as-soroban-examples/tree/main/contract_events)| Demonstrates how to publish events from a contract.|
| [testing example](https://github.com/Soneso/as-soroban-examples/tree/main/testing)| Shows a simple way to test your contract.|
| [token example](https://github.com/Soneso/as-soroban-examples/tree/main/token)| Demonstrates how to write a token contract that implements the Stellar [token interface](https://soroban.stellar.org/docs/reference/interfaces/token-interface).|
| [atomic swap example](https://github.com/Soneso/as-soroban-examples/tree/main/atomic-swap)| Swaps two tokens between two authorized parties atomically while following the limits they set. This example demonstrates advanced usage of Soroban auth framework and assumes the reader is familiar with the auth example and with Soroban token usage.|
| [timelock example](https://github.com/Soneso/as-soroban-examples/tree/main/timelock)| Demonstrates how to write a timelock and implements a greatly simplified claimable balance similar to the claimable balance feature available on Stellar.|
| [multi swap example](https://github.com/Soneso/as-soroban-examples/tree/main/multi_swap)| This example demonstrates how authorized calls can be batched together. It swaps a pair of tokens between the two groups of users that authorized the swap operation from the atomic swap example.|
| [single offer sale example](https://github.com/Soneso/as-soroban-examples/tree/main/single_offer)| The single offer sale example demonstrates how to write a contract that allows a seller to set up an offer to sell token A for token B to multiple buyers.|
| [liquidity pool example](https://github.com/Soneso/as-soroban-examples/tree/main/liquidity_pool)| Demonstrates how to write a constant product liquidity pool contract.|

More examples can be found in the [test cases](https://github.com/Soneso/as-soroban-sdk/tree/main/test)
