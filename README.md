# [Stellar Soroban SDK for AssemblyScript](https://github.com/Soneso/as-soroban-sdk)

![v1.0.1](https://img.shields.io/badge/v1.0.1-green.svg)

This AssemblyScript SDK is for writing contracts for [Soroban](https://soroban.stellar.org). Soroban is a smart contracts platform from Stellar that is designed with purpose and built to perform.

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

Next you need to add a `contract.json` file to the project. It must contain the environment metadata and spec for your contract.

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

### 4. Build your contract

```shell
$ npm run asbuild:release
```

You can find the generated ```.wasm``` (WebAssembly) file in the ```build``` folder. You can also find the ```.wat``` file there (Text format of the ```.wasm```).

### 5. Run your contract

To run the contract, you must first install the official `soroban cli` as described in this [setup guid](https://developers.stellar.org/docs/smart-contracts/getting-started/setup). The `soroban cli` needs cargo to be installed. You will not need rust or cargo for implementing smart contracts with this SDK.

*Hint for testing with protocol version 21:*
Currently the `soroban-cli` version that supports protocol v.21 is not yet officially launched. Therefore, if you would like to test your contracts with the protocol 21 update (testnet, futurenet), you need to install a soroban cli preview version:

```sh
cargo install soroban-cli --version 21.0.0-preview.1
```

Next, after you installed the `soroban cli`, deploy your contract to testnet:

```sh
soroban contract deploy \
  --wasm build/release.wasm \
  --source SAIPPNG3AGHSK2CLHIYQMVBPHISOOPT64MMW2PQGER47SDCN6C6XFWQM \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

This returns the ID of the contract, starting with a C. Similar to this:

```sh
CC4DZNN2TPLUOAIRBI3CY7TGRFFCCW6GNVVRRQ3QIIBY6TM6M2RVMBMC
```

Next let's invoke:

```sh
soroban -q contract invoke  \
  --source SAIPPNG3AGHSK2CLHIYQMVBPHISOOPT64MMW2PQGER47SDCN6C6XFWQM \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  --id <your contract id here> \
  -- hello --to friend
```


The above `hello contract` example implementation can be found as a complete example project [here](https://github.com/Soneso/as-soroban-examples/tree/main/hello_word).


## Features and limitations

In the [Build your own SDK](https://developers.stellar.org/docs/tools/sdks/build-your-own) chapter of the official [Soroban documentation](https://developers.stellar.org/docs/smart-contracts/getting-started/setup), one can find the requirements for a Soroban SDK.

This Assembly Script Soroban SDK **can** help you with:
- Value Conversions
- Host functions
- SDK Types
- User Defined Errors
- Meta Generation
- Contract Spec Generation
- Testing
 

### Value Conversions

When calling a contract function the host will only pass so called host values. In the SDK code a host value is simply called `Val`. A host value is a 64-bit integer carrying a bit-packed disjoint union of several cases, each identified by a different tag value (e.g. `i32`, `u32`, `symbol`, `timestamp`, `bool` etc. or ```object handles``` such as references to vectors, maps, bytes, strings that live in the host).

You can read more about host values and their types in [CAP-0046](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046-01.md#host-value-type).

The SDK can encode and decode host values. For example converting primitives like i32:

```typescript
import * as val from "as-soroban-sdk/lib/value";

// primitives
let xi32 = val.toI32(hostValue);
let xHostValue = val.fromI32(xi32); 

// static values
let isTrue = val.fromBool(hostValue);
let hostValBool = val.toBool(isTrue);

// objects
let isVecObj = val.isVec(hostValue); 
// this hostValue is a object handle referencing a vector object that lives on the host

if (isVecObj) {
    let myVec = new Vec(hostVal); // init a (SDK Type) Vec from the handle.
    myVec.pushFront(val.fromSmallSymbolStr("Hello"));
    let hostValVecObj = myVec.getHostObject();
}

// symbols
let myHostValSymbol = val.fromSmallSymbolStr("Hello");

// etc.
```

### Host functions

The host functions defined in [env.json](https://github.com/stellar/rs-soroban-env/blob/main/soroban-env-common/env.json) are functions callable from within the WASM Guest environment (where the contract code runs). The SDK makes them available to contracts to call in two versions. First `directly` as defined by [env.ts](https://github.com/Soneso/as-soroban-sdk/blob/main/lib/env.ts) and second in a `wrapped` version so that contracts have a nicer interface and less abstraction.

For example:

1. Directly:
```typescript
// see lib/env.ts
export declare function call(contract: AddressObject, func: Symbol, args: VecObject): Val;
```

2. Wrapped:
```typescript
// see lib/contract.ts
function callContractById(id: string, func: string, args: Vec): Val 
```

Depending on the use case, you can decide which version makes more sense in your contract implementation.

### SDK Types

Following types are supported by this SDK: `Map`, `Vec`, `Bytes`, `Str`, `Sym`.

For example work with a vector:

``` typescript
let vec = new Vec();

vec.pushFront(fromSmallSymbolStr("Hello"));
vec.pushBack(fromSmallSymbolStr("friend"));

return vec.getHostObject();
// returns the host value referencing the vector object stored in the host
```

or a map:
``` typescript
let myMap = new Map();

myMap.put(fromU32(1), fromSmallSymbolStr("Hello"));
myMap.put(fromU32(2), fromSmallSymbolStr("friend"));
myMap.put(vec.getHostObject(), fromTrue());

return myMap.getHostObject();
```

### Errors

Errors are host values that are composed of an error type (such as "contract error" or "storage error") and error code (u32). This SDK helps you to create and parse such errors. For example:

```typescript
// traps with user defined error of type 
// "contract error" and error code 12 (u32)
context.failWithErrorCode(12);
```

or 
```typescript
if(isError(hostVal) && getErrorType(hostVal) == errorTypeContract) {
    return fromU32(getErrorCode(hostVal))
}
```

See also: [as-soroban-examples](https://github.com/Soneso/as-soroban-examples)


### Contract spec generation

Contracts should contain a WASM custom section with name `contractspecv0` and containing a serialized stream of `SCSpecEntry`. There should be a `SCSpecEntry` for every function, struct, and union exported by the contract.

The AS Soroban SDK simplifies the generation of the custom section by providing the possibility to enter the functions spec in the `contract.json` file. See also [Understanding contract metadata](https://github.com/Soneso/as-soroban-sdk#understanding-contract-metadata).

### Contract meta generation
Contracts may optionally contain a Wasm custom section with name `contractmetav0` and containing a serialized `SCMetaEntry`. Contracts may store any metadata in the entries that can be used by applications and tooling off-network.

The AssemblyScript Soroban SDK simplifies the generation of the custom section by providing the possibility to add meta entries in the `contract.json` file. See also [Understanding contract metadata](https://github.com/Soneso/as-soroban-sdk#understanding-contract-metadata).


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

### Log a string message and values

```typescript
import * as context from 'as-soroban-sdk/lib/context';

let values = new Vec();
values.pushBack(val.fromI32(30));
values.pushBack(val.fromSmallSymbolStr("celsius"));
context.log("Today temperature:", values);

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

To be able to run a contract, the compiled `.wasm` file needs to contain the web assembly module environment metadata and contract spec.

They need to be attached to the `.wasm` module. Therefore we need the `contract.json` file.

The SDK parses the `contract.json` file when compiling the contract and converts it to the needed data structures to be added to the `.wasm` module. This is done by using an AssemblyScript transform (see: [transforms.mjs](https://github.com/Soneso/as-soroban-sdk/blob/main/transforms.mjs)). 

Required field is the `functions` array in a `contract.json` file located in the root directory of your assembly script project. 

Additionally one can also provide optional contract metadata with the `meta` array.

Example:

```json
{
    "functions": [
        {
            "name" : "hello",
            "arguments": [{"name": "to", "type": "symbol"}],
            "returns" : "vec[symbol]"
        }
    ],
    "meta": [
        {
            "key" : "name",
            "value" : "hello word"
        },
        {
            "key" : "version",
            "value" : "1.0.0"
        },
        {
            "key" : "description",
            "value" : "my first contract"
        }
    ]
}
```

You must define the contract spec for each function exported by your contract. In the upper example there is only one function named `hello`. In addition, you must define the name, the arguments and the return value of the function, so that the host environment can execute it.

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

Supported argument types are currently: `val` (any type of host value), `u32`, `i32`, `u64`, `i64`, `u128`, `i128`, `u256`, `i256`,`bool`, `symbol`, `string`, `status`, `bytes`, `void`, `timepoint`, `duration`, `address`, `option[valueType]`, `result[okType, errorType]`, `vec[elementType]`, `map[keyType, valueType]`, `set[elementType]` ,`bytesN[size]`, `udt(name)`, `tuple(value types separated by ;)`. If your function has no arguments, you can pass an empty array.

Supported return value types are the same as the supported argument types. If your function has no return value you must return void as a static raw value. You can obtain it by using ```val.fromVoid()```. For this case you should set ```"returns" : "void"``` or remove `"returns"` in the contract.json.

See also [Contract Spec Generation](https://soroban.stellar.org/docs/reference/sdks/build-your-own-sdk#contract-spec-generation) and [Contract Meta Generation](https://soroban.stellar.org/docs/reference/sdks/build-your-own-sdk#contract-meta-generation)

In addition to `functions`, for more advanced use cases, one can optionally define udt (user defined types): `structs`, `errors`, `enums` and `unions`. For example:

```json
{
  "structs":[
      {
          "name" : "Signature",
          "fields": [
              {"name": "public_key", "type": "bytesN[32]"},
              {"name": "signature", "type": "bytesN[64]"}
          ]
      }
  ],
  "errors":[
      {
          "name" : "AccError",
          "cases": [
              {"name": "NotEnoughSigners", "value": 1},
              {"name": "NegativeAmount", "value": 2},
              {"name": "BadSignatureOrder", "value": 3},
              {"name": "UnknownSigner", "value": 4}
          ]
      }
  ]
}
```

The generation is implemented in [transform.mjs](https://github.com/Soneso/as-soroban-sdk/blob/main/transforms.mjs).

## Examples

Instead of a tutorial, we have created a series of contract examples with many explanations. It is recommended that you work through the examples in the order shown here. 

You can find contract examples in our [as-soroban-examples](https://github.com/Soneso/as-soroban-examples) repository. 

| Example | Description |
| :--- | :--- |
| [add example](https://github.com/Soneso/as-soroban-examples/tree/main/add)| Demonstrates how to write a simple contract, with a single function that takes two i32 inputs and returns their sum as an output. |
| [hello word example](https://github.com/Soneso/as-soroban-examples/tree/main/hello_word)| demonstrates how to write a simple contract, with a single function that takes an input and returns a vector containing multiple host values. |
| [increment example](https://github.com/Soneso/as-soroban-examples/tree/main/increment)| Demonstrates how to write a simple contract that stores data, with a single function that increments an internal counter and returns the value. It also shows how to manage contract data lifetimes and how to optimize contracts.|
| [events example](https://github.com/Soneso/as-soroban-examples/tree/main/contract_events)| Demonstrates how to publish events from a contract.|
| [errors example](https://github.com/Soneso/as-soroban-examples/tree/main/errors)| Demonstrates how to define and generate errors in a contract that invokers of the contract can understand and handle.|
| [logging example](https://github.com/Soneso/as-soroban-examples/tree/main/logging)| Demonstrates how to log for the purpose of debugging.|
| [auth example](https://github.com/Soneso/as-soroban-examples/tree/main/auth)| Demonstrates how to implement authentication and authorization using the [Soroban Host-managed auth framework](https://soroban.stellar.org/docs/learn/authorization).|
| [cross contract call example](https://github.com/Soneso/as-soroban-examples/tree/main/cross_contract)| Demonstrates how to call a contract's function from another contract.|
| [deployer example](https://github.com/Soneso/as-soroban-examples/tree/main/deployer)| Demonstrates how to deploy contracts using a contract.|
| [upgrading contracts example](https://github.com/Soneso/as-soroban-examples/tree/main/upgradeable_contract)| Demonstrates how to upgrade a wasm contract.|
| [testing example](https://github.com/Soneso/as-soroban-examples/tree/main/testing)| Shows a simple way to test your contract.|
| [token example](https://github.com/Soneso/as-soroban-examples/tree/main/token)| Demonstrates how to write a token contract that implements the Stellar [token interface](https://soroban.stellar.org/docs/reference/interfaces/token-interface).|
| [atomic swap example](https://github.com/Soneso/as-soroban-examples/tree/main/atomic-swap)| Swaps two tokens between two authorized parties atomically while following the limits they set. This example demonstrates advanced usage of Soroban auth framework and assumes the reader is familiar with the auth example and with Soroban token usage.|
| [atomic swap batched example](https://github.com/Soneso/as-soroban-examples/tree/main/multi_swap)| Swaps a pair of tokens between the two groups of users that authorized the swap operation from the [atomic swap example](https://github.com/Soneso/as-soroban-examples/tree/main/atomic-swap).|
| [timelock example](https://github.com/Soneso/as-soroban-examples/tree/main/timelock)| Demonstrates how to write a timelock and implements a greatly simplified claimable balance similar to the claimable balance feature available on Stellar.|
| [single offer sale example](https://github.com/Soneso/as-soroban-examples/tree/main/single_offer)| The single offer sale example demonstrates how to write a contract that allows a seller to set up an offer to sell token A for token B to multiple buyers.|
| [liquidity pool example](https://github.com/Soneso/as-soroban-examples/tree/main/liquidity_pool)| Demonstrates how to write a constant product liquidity pool contract.|
| [custom account example](https://github.com/Soneso/as-soroban-examples/tree/main/custom_account)| This example is an advanced auth example which demonstrates how to implement a simple account contract that supports multisig and customizable authorization policies.|

More examples can be found in the [test cases](https://github.com/Soneso/as-soroban-sdk/tree/main/test)

## Deploying smart contracts to a Stellar Network (not locally)

To deploy your smart contract to a Stellar Network such as `futurenet`, `testnet` or `main`, you can make use of the soroban cli as described [here](https://soroban.stellar.org/docs/getting-started/deploy-to-testnet).

You can also use one of our Stellar SDKs to programatically deploy and invoke contracts on the Stellar Network:

- [Stellar iOS SDK](https://github.com/Soneso/stellar-ios-mac-sdk/blob/master/soroban.md)
- [Stellar Flutter SDK](https://github.com/Soneso/stellar_flutter_sdk/blob/master/soroban.md)
- [Stellar PHP SDK](https://github.com/Soneso/stellar-php-sdk/blob/main/soroban.md)

## Using as-bignum for working with big numbers

If you need arithmetic and binary operations for working with big numbers such as {i,u}128 or {i,u}256 then there are some possibilities. On the one hand there are host functions available for working with {i,u}256 (see [env.ts](https://github.com/Soneso/as-soroban-sdk/blob/main/lib/env.ts)). Furthermore we have implemented a couple of functions for working with {i,u}128 into this SDK. But the functions from the SDK are limited, work only for positive {i,u}128 and will probably be removed soon. 

A better option for working with {i,u}128 is to use the library [as-bignum](https://github.com/MaxGraey/as-bignum/tree/master). However, it does not work with soroban right away, because some functions throw errors, which leads to an import statement in the compiled wasm code, which in turn is not accepted by the Soroban VM:

```
// wat representation
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
```
Such special imports need support from the environment, which is currently not available. See [AS special imports](https://www.assemblyscript.org/concepts.html#special-imports).

But this can also be circumvented by implementing a special `abort` function in the contract.

To do so, you must first declare it in your `asconfig.json` file. E.g.
```json
{
  "extends": "as-soroban-sdk/sdkasconfig",
  "targets": {
    "release": {
      "outFile": "build/release.wasm",
      "textFile": "build/release.wat",
      "use": "abort=assembly/index/myAbort"
    },
    "debug": {
      "outFile": "build/debug.wasm",
      "textFile": "build/debug.wat",
      "use": "abort=assembly/index/myAbort"
    }
  }
}
```

Then implement the function in your contract:

```ts
function myAbort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void {//...}
```
By doing so, the import statement will not be added to the wasm code during compilation. And when invoking the contract, no `VmError(Instantiation)` will be thrown while using the `as-bignum` functions.

Another option is of course to implement your own arithmetic functions, for example by porting them from as-bignum and removing the throwing of errors.