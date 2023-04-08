import { Transform } from "assemblyscript/transform";
import * as fs from 'fs'
import * as XDR from 'js-xdr';

const META_NAME = "contractenvmetav0";
const SPEC_NAME = "contractspecv0";
const CONTRACT_JSON = "./contract.json";

export class SdkTransform extends Transform {

  getContractJson() {
    return CONTRACT_JSON;
  }

  afterCompile(asModule) { 
    //this.log(asModule);
    let xdr = XDR.config((xdr) => {
      xdr.typedef("Uint64", xdr.uhyper());
      xdr.typedef("Uint32", xdr.uint());
      xdr.typedef("ScSymbol", xdr.string(32));

      xdr.enum("ScEnvMetaKind", {
        scEnvMetaKindInterfaceVersion: 0,
      });

      xdr.union("ScEnvMetaEntry", {
        switchOn: xdr.lookup("ScEnvMetaKind"),
        switchName: "kind",
        switches: [
          ["scEnvMetaKindInterfaceVersion", "interfaceVersion"],
        ],
        arms: {
          interfaceVersion: xdr.lookup("Uint64"),
        },
      });

      xdr.enum("ScSpecType", {
        scSpecTypeVal: 0,
        scSpecTypeBool: 1,
        scSpecTypeVoid: 2,
        scSpecTypeStatus: 3,
        scSpecTypeU32: 4,
        scSpecTypeI32: 5,
        scSpecTypeU64: 6,
        scSpecTypeI64: 7,
        scSpecTypeTimepoint: 8,
        scSpecTypeDuration: 9,
        scSpecTypeU128: 10,
        scSpecTypeI128: 11,
        scSpecTypeU256: 12,
        scSpecTypeI256: 13,
        scSpecTypeBytes: 14,
        scSpecTypeString: 16,
        scSpecTypeSymbol: 17,
        scSpecTypeAddress: 19,
        scSpecTypeOption: 1000,
        scSpecTypeResult: 1001,
        scSpecTypeVec: 1002,
        scSpecTypeSet: 1003,
        scSpecTypeMap: 1004,
        scSpecTypeTuple: 1005,
        scSpecTypeBytesN: 1006,
        scSpecTypeUdt: 2000,
      });

      xdr.struct("ScSpecTypeOption", [
        ["valueType", xdr.lookup("ScSpecTypeDef")],
      ]);

      xdr.struct("ScSpecTypeResult", [
        ["okType", xdr.lookup("ScSpecTypeDef")],
        ["errorType", xdr.lookup("ScSpecTypeDef")],
      ]);

      xdr.struct("ScSpecTypeVec", [
        ["elementType", xdr.lookup("ScSpecTypeDef")],
      ]);

      xdr.struct("ScSpecTypeMap", [
        ["keyType", xdr.lookup("ScSpecTypeDef")],
        ["valueType", xdr.lookup("ScSpecTypeDef")],
      ]);

      xdr.struct("ScSpecTypeSet", [
        ["elementType", xdr.lookup("ScSpecTypeDef")],
      ]);

      xdr.struct("ScSpecTypeTuple", [
        ["valueTypes", xdr.varArray(xdr.lookup("ScSpecTypeDef"), 12)],
      ]);

      xdr.struct("ScSpecTypeBytesN", [
        ["n", xdr.lookup("Uint32")],
      ]);

      xdr.struct("ScSpecTypeUdt", [
        ["name", xdr.string(60)],
      ]);

      xdr.union("ScSpecTypeDef", {
        switchOn: xdr.lookup("ScSpecType"),
        switchName: "type",
        switches: [
          ["scSpecTypeVal", xdr.void()],
          ["scSpecTypeBool", xdr.void()],
          ["scSpecTypeVoid", xdr.void()],
          ["scSpecTypeStatus", xdr.void()],
          ["scSpecTypeU32", xdr.void()],
          ["scSpecTypeI32", xdr.void()],
          ["scSpecTypeU64", xdr.void()],
          ["scSpecTypeI64", xdr.void()],
          ["scSpecTypeTimepoint", xdr.void()],
          ["scSpecTypeDuration", xdr.void()],
          ["scSpecTypeU128", xdr.void()],
          ["scSpecTypeI128", xdr.void()],
          ["scSpecTypeU256", xdr.void()],
          ["scSpecTypeI256", xdr.void()],
          ["scSpecTypeBytes", xdr.void()],
          ["scSpecTypeString", xdr.void()],
          ["scSpecTypeSymbol", xdr.void()],
          ["scSpecTypeAddress", xdr.void()],
          ["scSpecTypeOption", "option"],
          ["scSpecTypeResult", "result"],
          ["scSpecTypeVec", "vec"],
          ["scSpecTypeMap", "map"],
          ["scSpecTypeSet", "Set"],
          ["scSpecTypeTuple", "tuple"],
          ["scSpecTypeBytesN", "bytesN"],
          ["scSpecTypeUdt", "udt"],
        ],
        arms: {
          option: xdr.lookup("ScSpecTypeOption"),
          result: xdr.lookup("ScSpecTypeResult"),
          vec: xdr.lookup("ScSpecTypeVec"),
          map: xdr.lookup("ScSpecTypeMap"),
          Set: xdr.lookup("ScSpecTypeSet"),
          tuple: xdr.lookup("ScSpecTypeTuple"),
          bytesN: xdr.lookup("ScSpecTypeBytesN"),
          udt: xdr.lookup("ScSpecTypeUdt"),
        },
      });

      xdr.struct("ScSpecFunctionInputV0", [
        ["doc", xdr.string(1024)],
        ["name", xdr.string(30)],
        ["type", xdr.lookup("ScSpecTypeDef")],
      ]);

      xdr.struct("ScSpecFunctionV0", [
        ["doc", xdr.string(1024)],
        ["name", xdr.lookup("ScSymbol")],
        ["inputs", xdr.varArray(xdr.lookup("ScSpecFunctionInputV0"), 10)],
        ["outputs", xdr.varArray(xdr.lookup("ScSpecTypeDef"), 1)],
      ]);

      xdr.union("ScSpecEntry", {
        switchOn: xdr.lookup("ScSpecEntryKind"),
        switchName: "kind",
        switches: [
          ["scSpecEntryFunctionV0", "functionV0"],
        ],
        arms: {
          functionV0: xdr.lookup("ScSpecFunctionV0"),
        },
      });

      xdr.enum("ScSpecEntryKind", {
        scSpecEntryFunctionV0: 0,
      });

    });

    if (!fs.existsSync(this.getContractJson())) {
      console.log(this.getContractJson() + " not found");
      return;
    }

    const contractDataFile = fs.readFileSync(this.getContractJson());
    const contractData = JSON.parse(contractDataFile);

    // Contracts must contain a WASM custom section with name contractenvmetav0 and containing a serialized SCEnvMetaEntry. 
    // The interface version stored within should match the version of the host functions supported.

    var meta = xdr.ScEnvMetaEntry.scEnvMetaKindInterfaceVersion(new xdr.Uint64(contractData.host_functions_version));
    asModule.addCustomSection(META_NAME, meta.toXDR());
    console.log('host function version: ', contractData.host_functions_version);

    //Contracts should contain a WASM custom section with name contractspecv0 and containing a serialized stream of SCSpecEntry. 
    //There should be a SCSpecEntry for every function, struct, and union exported by the contract.

    var valid = true;
    var functions = [];
    contractData.functions.forEach((item) => {
      let functionName = item.name;
      var args = [];
      item.arguments.forEach((argument) => {
        let typ = SdkTransform.getSpecType(argument.type, xdr);
        if (typ) {
          args.push(new xdr.ScSpecFunctionInputV0({doc:'', name: argument.name, type: typ}));
        } else {
          console.error("Unsupported argument type: " + argument.type);
          valid = false;
        }
      });

      if (valid) {
        let functionReturn = item.returns;
        let returnTypes = [];
        if (functionReturn === undefined || functionReturn === "void") {
          valid = true
        } else {
          let returnTyp = SdkTransform.getSpecType(functionReturn, xdr);
          if (returnTyp) {
            returnTypes.push(returnTyp);
          } else {
            console.error("Unsupported return type: " + functionReturn);
            valid = false;
          }
        }
        if (valid) {
          let funcV0 = new xdr.ScSpecFunctionV0({doc:'', name: functionName, inputs: args, outputs: returnTypes});
          let funcEntry = xdr.ScSpecEntry.scSpecEntryFunctionV0(funcV0);
          functions.push(funcEntry.toXDR());
        }
      }
    });

    if (valid) {
      let res = Buffer.concat(functions);
      asModule.addCustomSection(SPEC_NAME, res);
    } else {
      console.error("ERROR::COULD NOT GENERATE METADATA");
    }
  }

  static getSpecType(argumentTypeStr, xdr) {
    var typ = xdr.ScSpecTypeDef.scSpecTypeVal();
    switch(argumentTypeStr) {
      case "val":
        return typ;
      case "bool":
        return xdr.ScSpecTypeDef.scSpecTypeBool();
      case "void":
        return xdr.ScSpecTypeDef.scSpecTypeVoid();
      case "status":
        return xdr.ScSpecTypeDef.scSpecTypeStatus();
      case "u32":
        return xdr.ScSpecTypeDef.scSpecTypeU32();
      case "i32":
        return xdr.ScSpecTypeDef.scSpecTypeI32();
      case "u64":
        return xdr.ScSpecTypeDef.scSpecTypeU64();
      case "i64":
        return xdr.ScSpecTypeDef.scSpecTypeI64();
      case "timepoint":
        return xdr.ScSpecTypeDef.scSpecTypeTimepoint();
      case "duration":
        return xdr.ScSpecTypeDef.scSpecTypeDuration();
      case "u128":
        return xdr.ScSpecTypeDef.scSpecTypeU128();
      case "i128":
        return xdr.ScSpecTypeDef.scSpecTypeI128();
      case "u256":
        return xdr.ScSpecTypeDef.scSpecTypeU256();
      case "i256":
        return xdr.ScSpecTypeDef.scSpecTypeI256();
      case "bytes":
        return xdr.ScSpecTypeDef.scSpecTypeBytes();
      case "string":
        return xdr.ScSpecTypeDef.scSpecTypeString();
      case "symbol":
        return xdr.ScSpecTypeDef.scSpecTypeSymbol();
      case "address":
        return xdr.ScSpecTypeDef.scSpecTypeAddress();
    }


    // OPTION e.g. option[symbol]
    if (argumentTypeStr.startsWith("option[")) {
      let sB = argumentTypeStr.indexOf("[");
      let eB = argumentTypeStr.lastIndexOf("]");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let valueTypeStr = argumentTypeStr.substring(sB + 1, eB);
      let valueType = SdkTransform.getSpecType(valueTypeStr, xdr);
      if (!valueType) {
        return false;
      }
      let vecType = new xdr.ScSpecTypeOption({valueType:valueType});
      typ.set('scSpecTypeOption', vecType);
      return typ;
    }

    // RESULT e.g. result[u32, symbol]
    if (argumentTypeStr.startsWith("result[")) {
      let sB = argumentTypeStr.indexOf("[");
      let eB = argumentTypeStr.lastIndexOf("]");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let entryStr = argumentTypeStr.substring(sB + 1, eB).trim();
      if (entryStr.indexOf(",") != -1) {
        let entries = entryStr.split(",");
        if (entries.length != 2) {
          return false;
        }
        let okType = SdkTransform.getSpecType(entries[0].trim(), xdr);
        let errorType = SdkTransform.getSpecType(entries[1].trim(), xdr);
        let resultType = new xdr.scSpecTypeResult({okType:okType, errorType:errorType});
        typ.set('scSpecTypeResult', resultType);
        return typ;
      } else {
        return false;
      }
    }

    // VEC e.g. vec[symbol]
    if (argumentTypeStr.startsWith("vec[")) {
      let sB = argumentTypeStr.indexOf("[");
      let eB = argumentTypeStr.lastIndexOf("]");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let elemTypeStr = argumentTypeStr.substring(sB + 1, eB);
      let elementType = SdkTransform.getSpecType(elemTypeStr, xdr);
      if (!elementType) {
        return false;
      }
      let vecType = new xdr.ScSpecTypeVec({elementType:elementType});
      typ.set('scSpecTypeVec', vecType);
      return typ;
    }

    // MAP e.g. map[symbol, vec[symbol]]
    if (argumentTypeStr.startsWith("map[")) {
      let sB = argumentTypeStr.indexOf("[");
      let eB = argumentTypeStr.lastIndexOf("]");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let entryStr = argumentTypeStr.substring(sB + 1, eB).trim();
      if (entryStr.indexOf(",") != -1) {
        let entries = entryStr.split(",");
        if (entries.length != 2) {
          return false;
        }
        let keyType = SdkTransform.getSpecType(entries[0].trim(), xdr);
        let valType = SdkTransform.getSpecType(entries[1].trim(), xdr);
        let mapType = new xdr.ScSpecTypeMap({keyType:keyType, valueType:valType});
        typ.set('scSpecTypeMap', mapType);
        return typ;
      } else {
        return false;
      }
    }

    // SET e.g. set[symbol]
    if (argumentTypeStr.startsWith("set[")) {
      let sB = argumentTypeStr.indexOf("[");
      let eB = argumentTypeStr.lastIndexOf("]");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let elemTypeStr = argumentTypeStr.substring(sB + 1, eB);
      let elementType = SdkTransform.getSpecType(elemTypeStr, xdr);
      if (!elementType) {
        return false;
      }
      let setType = new xdr.ScSpecTypeSet({elementType:elementType});
      typ.set('scSpecTypeSet', setType);
      return typ;
    }

    // BytesN e.g. bytesN[32]
    if (argumentTypeStr.startsWith("bytesN[")) {
      let sB = argumentTypeStr.indexOf("[");
      let eB = argumentTypeStr.lastIndexOf("]");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let sizeStr = argumentTypeStr.substring(sB + 1, eB);
      let size = parseInt(sizeStr.trim());
      let setType = new xdr.ScSpecTypeBytesN({n:size});
      typ.set('scSpecTypeBytesN', setType);
      return typ;
    }

    return false;
  }

}
export default SdkTransform