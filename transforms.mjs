import { Transform } from "assemblyscript/transform";
import * as fs from 'fs'
import * as XDR from 'js-xdr';

const META_ENV_NAME = "contractenvmetav0";
const META_NAME = "contractmetav0";
const SPEC_NAME = "contractspecv0";
const CONTRACT_JSON = "./contract.json";
const SDK_VERSION_META_KEY = "assdkver" 
const SDK_VERSION = "1.0.0";
const HOST_FUNCTIONS_VERSION = 0;


export class SdkTransform extends Transform {

  getContractJson() {
    return CONTRACT_JSON;
  }

  afterCompile(asModule) { 
    //this.log(asModule);
    
    let xdr = SdkTransform.getXdrSpec();

    if (!fs.existsSync(this.getContractJson())) {
      console.log(this.getContractJson() + " not found");
      return;
    }

    const contractDataFile = fs.readFileSync(this.getContractJson());
    const contractData = JSON.parse(contractDataFile);

    // Contracts must contain a WASM custom section with name contractenvmetav0 and containing a serialized SCEnvMetaEntry. 
    // The interface version stored within should match the version of the host functions supported.

    let envMeta = xdr.ScEnvMetaEntry.scEnvMetaKindInterfaceVersion(new xdr.Uint64(HOST_FUNCTIONS_VERSION));
    asModule.addCustomSection(META_ENV_NAME, envMeta.toXDR());
    // console.log('host function version: ', HOST_FUNCTIONS_VERSION);

    //Contracts should contain a WASM custom section with name contractspecv0 and containing a serialized stream of SCSpecEntry. 
    //There should be a SCSpecEntry for every function, struct, and union exported by the contract.

    let udtStructEnties = SdkTransform.getUdtStructEntires(contractData, xdr);
    let udtEnumEntries = SdkTransform.getUdtEnumEntries(contractData, xdr);
    let udtUnionEntries = SdkTransform.getUdtUnionEntries(contractData, xdr);
    let udtErrorEntries = SdkTransform.getUdtErrorEntries(contractData, xdr);
    let functions = SdkTransform.getFunctions(contractData, xdr);


    if (udtStructEnties && udtEnumEntries && udtUnionEntries && udtErrorEntries && functions) {
      const specEntries = [...udtStructEnties, ...udtEnumEntries, ...udtUnionEntries, ...udtErrorEntries, ...functions,];
      let res = Buffer.concat(specEntries);
      asModule.addCustomSection(SPEC_NAME, res);
    } else {
      console.error("ERROR::COULD NOT GENERATE ENV METADATA");
    }

    // Contracts may optionally contain a Wasm custom section with name contractmetav0 and containing a serialized SCMetaEntry. 
    // Contracts may store any metadata in the entries that can be used by applications and tooling off-network.

    let metaEntries = SdkTransform.getContractMeta(contractData, xdr);
    let res = Buffer.concat(metaEntries);
    asModule.addCustomSection(META_NAME, res);

  }

  static getContractMeta(contractData, xdr) {
    let metaEntries = [];
    
    // add sdk version
    let metaV0 = new xdr.ScMetaV0({key:SDK_VERSION_META_KEY, val:SDK_VERSION});
    let metaEntry = xdr.ScMetaEntry.scMetaV0(metaV0);
    metaEntries.push(metaEntry.toXDR());

    // add data provided by user
    if (contractData.meta === undefined) {
      // no meta from user found
      return metaEntries;
    }

    contractData.meta.forEach((item) => {

      let key = item.key === undefined ? '' : item.key;
      let value = item.value === undefined ? '' : item.value;
      
      if (key !== '' && value !== '') {
        let metaV0 = new xdr.ScMetaV0({key:key, val:value});
        let metaEntry = xdr.ScMetaEntry.scMetaV0(metaV0);
        metaEntries.push(metaEntry.toXDR());
      }
    });

    return metaEntries;
  }

  static getFunctions(contractData, xdr) {
    let functionEntries = [];
    contractData.functions.forEach((item) => {
      let functionName = item.name;
      let doc = item.doc === undefined ? '' : item.doc;
      let args = [];
      item.arguments.forEach((argument) => {
        let argDoc = argument.doc === undefined ? '' : argument.doc;
        let typ = SdkTransform.getSpecType(argument.type, xdr);
        if (typ) {
          args.push(new xdr.ScSpecFunctionInputV0({doc:argDoc, name: argument.name, type: typ}));
        } else {
          console.error("Unsupported function argument type: " + argument.type);
          return false;
        }
      });

      let functionReturn = item.returns;
      let returnTypes = [];
      if (functionReturn !== undefined && functionReturn !== "void") {
        let returnTyp = SdkTransform.getSpecType(functionReturn, xdr);
        if (returnTyp) {
          returnTypes.push(returnTyp);
        } else {
          console.error("Unsupported function return type: " + functionReturn);
          return false;
        }
      }

      let funcV0 = new xdr.ScSpecFunctionV0({doc:doc, name: functionName, inputs: args, outputs: returnTypes});
      let funcEntry = xdr.ScSpecEntry.scSpecEntryFunctionV0(funcV0);
      functionEntries.push(funcEntry.toXDR());
    });
    return functionEntries;
  }

  static getUdtStructEntires(contractData, xdr) {
    let structEntries = [];
    if (contractData.structs === undefined) {
      return structEntries;
    }
    contractData.structs.forEach((item) => {
      let doc = item.doc === undefined ? '' : item.doc;
      let structName = item.name;
      let lib = item.lib === undefined ? '' : item.lib;
      let fields = [];
      item.fields.forEach((field) => {
        let fieldDoc = field.doc === undefined ? '' : field.doc;
        let typ = SdkTransform.getSpecType(field.type, xdr);
        if (typ) {
          fields.push(new xdr.ScSpecUdtStructFieldV0({doc:fieldDoc, name: field.name, type: typ}));
        } else {
          console.error("Unsupported struct argument type: " + argument.type);
          return false;
        }
      });

      let structV0 = new xdr.ScSpecUdtStructV0({doc:doc, lib:lib, name: structName, fields: fields});
      let structEntry = xdr.ScSpecEntry.scSpecEntryUdtStructV0(structV0);
      structEntries.push(structEntry.toXDR());
    });
    return structEntries;
  }

  static getUdtEnumEntries(contractData, xdr) {
    let enumEntries = [];
    if (contractData.enums === undefined) {
      return enumEntries;
    }

    contractData.enums.forEach((item) => {
      let doc = item.doc === undefined ? '' : item.doc;
      let enumName = item.name;
      let lib = item.lib === undefined ? '' : item.lib;
      let cases = [];
      item.cases.forEach((enumCase) => {
        let caseDoc = enumCase.doc === undefined ? '' : enumCase.doc;
        cases.push(new xdr.ScSpecUdtEnumCaseV0({doc:caseDoc, name: enumCase.name, value: enumCase.value}));
      });

      let enumV0 = new xdr.ScSpecUdtEnumV0({doc:doc, lib:lib, name: enumName, cases: cases});
      let enumEntry = xdr.ScSpecEntry.scSpecEntryUdtEnumV0(enumV0);
      enumEntries.push(enumEntry.toXDR());
    });
    return enumEntries;
  }

  static getUdtErrorEntries(contractData, xdr) {
    let errorEntries = [];
    if (contractData.errors === undefined) {
      return errorEntries;
    }

    contractData.errors.forEach((item) => {
      let doc = item.doc === undefined ? '' : item.doc;
      let errorName = item.name;
      let lib = item.lib === undefined ? '' : item.lib;
      let cases = [];
      item.cases.forEach((errCase) => {
        let caseDoc = errCase.doc === undefined ? '' : errCase.doc;
        cases.push(new xdr.ScSpecUdtErrorEnumCaseV0({doc:caseDoc, name: errCase.name, value: errCase.value}));
      });

      let errorV0 = new xdr.ScSpecUdtErrorEnumV0({doc:doc, lib:lib, name: errorName, cases: cases});
      let errorEntry = xdr.ScSpecEntry.scSpecEntryUdtErrorEnumV0(errorV0);
      errorEntries.push(errorEntry.toXDR());
    });
    return errorEntries;
  }

  static getUdtUnionEntries(contractData, xdr) {
    let unionEntries = [];
    if (contractData.unions === undefined) {
      return unionEntries;
    }

    contractData.unions.forEach((item) => {
      let doc = item.doc === undefined ? '' : item.doc;
      let unionName = item.name;
      let lib = item.lib === undefined ? '' : item.lib;
      let cases = [];
      item.cases.forEach((unionCase) => {
        let caseDoc = unionCase.doc === undefined ? '' : unionCase.doc;
        let kind = unionCase.kind;
        if (kind === 'void') {
          let voidCase = new xdr.ScSpecUdtUnionCaseVoidV0({doc:caseDoc, name: unionCase.name})
          cases.push(xdr.ScSpecUdtUnionCaseV0.scSpecUdtUnionCaseVoidV0(voidCase));
        } else if (kind === 'tuple') {
          let xdrValueTypes = []

          if (unionCase.types !== undefined) {
            unionCase.types.forEach((uType) => {
              xdrValueTypes.push(SdkTransform.getSpecType(uType.trim(), xdr));
            });
          }
          let tupleCase = new xdr.ScSpecUdtUnionCaseTupleV0({doc:caseDoc, name: unionCase.name, type:xdrValueTypes})
          cases.push(xdr.ScSpecUdtUnionCaseV0.scSpecUdtUnionCaseTupleV0(tupleCase));
        } else {
          console.error("Unsupported union kind: " + kind);
          return false;
        }
      });

      let unionV0 = new xdr.ScSpecUdtUnionV0({doc:doc, lib:lib, name: unionName, cases: cases});
      let unionEntry = xdr.ScSpecEntry.scSpecEntryUdtUnionV0(unionV0);
      unionEntries.push(unionEntry.toXDR());
    });
    return unionEntries;
  }

  static getSpecType(argumentTypeStr, xdr) {
    let typ = xdr.ScSpecTypeDef.scSpecTypeVal();
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
        let resultType = new xdr.ScSpecTypeResult({okType:okType, errorType:errorType});
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

    // Udt e.g. udt(name)
    if (argumentTypeStr.startsWith("udt(")) {
      let sB = argumentTypeStr.indexOf("(");
      let eB = argumentTypeStr.lastIndexOf(")");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let nameStr = argumentTypeStr.substring(sB + 1, eB);
      let udtType = new xdr.ScSpecTypeUdt({name:nameStr});
      typ.set('scSpecTypeUdt', udtType);
      return typ;
    }

    // tuple e.g. tuple(u32;i128;vec[val];string), tuple(i128) or tuple()
    if (argumentTypeStr.startsWith("tuple(")) {
      let sB = argumentTypeStr.indexOf("(");
      let eB = argumentTypeStr.lastIndexOf(")");
      if (sB == -1 || eB == -1) {
        return false;
      }
      let entryStr = argumentTypeStr.substring(sB + 1, eB).trim();
      let xdrValueTypes = SdkTransform.getTupleXdrValueTypes(entryStr, xdr);
      if (!xdrValueTypes) {
        return false;
      }
      let tupleType = new xdr.ScSpecTypeTuple({valueTypes:xdrValueTypes});
      typ.set('scSpecTypeTuple', tupleType);
      return typ;
    }

    return false;
  }
  
  static getTupleXdrValueTypes(entryStr, xdr) {
    let xdrValueTypes = [];
    if (entryStr !== undefined) {
      if (entryStr.indexOf(";") != -1) {
        let valueTypes = entryStr.split(";");
        if (valueTypes.length > 12) {
          return false;
        }
        valueTypes.forEach((valueType) => {
          xdrValueTypes.push(SdkTransform.getSpecType(valueType.trim(), xdr));
        });
      } else if (entryStr.trim() !== '') {
        xdrValueTypes.push(SdkTransform.getSpecType(entryStr.trim(), xdr));
      }
    }
    return xdrValueTypes;
  }

  static getXdrSpec() {
    return XDR.config((xdr) => {
      xdr.typedef("Uint64", xdr.uhyper());
      xdr.typedef("Uint32", xdr.uint());
      xdr.typedef("ScSymbol", xdr.string(32));

      xdr.struct("ScMetaV0", [
        ["key", xdr.string()],
        ["val", xdr.string()],
      ]);

      xdr.enum("ScMetaKind", {
        scMetaV0: 0,
      });

      xdr.union("ScMetaEntry", {
        switchOn: xdr.lookup("ScMetaKind"),
        switchName: "kind",
        switches: [
          ["scMetaV0", "v0"],
        ],
        arms: {
          v0: xdr.lookup("ScMetaV0"),
        },
      });

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

      xdr.struct("ScSpecUdtStructFieldV0", [
        ["doc", xdr.string(1024)],
        ["name", xdr.string(30)],
        ["type", xdr.lookup("ScSpecTypeDef")],
      ]);

      xdr.struct("ScSpecUdtStructV0", [
        ["doc", xdr.string(1024)],
        ["lib", xdr.string(80)],
        ["name", xdr.string(60)],
        ["fields", xdr.varArray(xdr.lookup("ScSpecUdtStructFieldV0"), 40)],
      ]);

      xdr.struct("ScSpecUdtUnionCaseVoidV0", [
        ["doc", xdr.string(1024)],
        ["name", xdr.string(60)],
      ]);

      xdr.struct("ScSpecUdtUnionCaseTupleV0", [
        ["doc", xdr.string(1024)],
        ["name", xdr.string(60)],
        ["type", xdr.varArray(xdr.lookup("ScSpecTypeDef"), 12)],
      ]);

      xdr.enum("ScSpecUdtUnionCaseV0Kind", {
        scSpecUdtUnionCaseVoidV0: 0,
        scSpecUdtUnionCaseTupleV0: 1,
      })

      xdr.union("ScSpecUdtUnionCaseV0", {
        switchOn: xdr.lookup("ScSpecUdtUnionCaseV0Kind"),
        switchName: "kind",
        switches: [
          ["scSpecUdtUnionCaseVoidV0", "voidCase"],
          ["scSpecUdtUnionCaseTupleV0", "tupleCase"],
        ],
        arms: {
          voidCase: xdr.lookup("ScSpecUdtUnionCaseVoidV0"),
          tupleCase: xdr.lookup("ScSpecUdtUnionCaseTupleV0"),
        },
      });

      xdr.struct("ScSpecUdtUnionV0", [
        ["doc", xdr.string(1024)],
        ["lib", xdr.string(80)],
        ["name", xdr.string(60)],
        ["cases", xdr.varArray(xdr.lookup("ScSpecUdtUnionCaseV0"), 50)],
      ]);

      xdr.struct("ScSpecUdtEnumCaseV0", [
        ["doc", xdr.string(1024)],
        ["name", xdr.string(60)],
        ["value", xdr.lookup("Uint32")],
      ]);

      xdr.struct("ScSpecUdtEnumV0", [
        ["doc", xdr.string(1024)],
        ["lib", xdr.string(80)],
        ["name", xdr.string(60)],
        ["cases", xdr.varArray(xdr.lookup("ScSpecUdtEnumCaseV0"), 50)],
      ]);

      xdr.struct("ScSpecUdtErrorEnumCaseV0", [
        ["doc", xdr.string(1024)],
        ["name", xdr.string(60)],
        ["value", xdr.lookup("Uint32")],
      ]);

      xdr.struct("ScSpecUdtErrorEnumV0", [
        ["doc", xdr.string(1024)],
        ["lib", xdr.string(80)],
        ["name", xdr.string(60)],
        ["cases", xdr.varArray(xdr.lookup("ScSpecUdtErrorEnumCaseV0"), 50)],
      ]);

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
          ["scSpecEntryUdtStructV0", "udtStructV0"],
          ["scSpecEntryUdtUnionV0", "udtUnionV0"],
          ["scSpecEntryUdtEnumV0", "udtEnumV0"],
          ["scSpecEntryUdtErrorEnumV0", "udtErrorEnumV0"],
        ],
        arms: {
          functionV0: xdr.lookup("ScSpecFunctionV0"),
          udtStructV0: xdr.lookup("ScSpecUdtStructV0"),
          udtUnionV0: xdr.lookup("ScSpecUdtUnionV0"),
          udtEnumV0: xdr.lookup("ScSpecUdtEnumV0"),
          udtErrorEnumV0: xdr.lookup("ScSpecUdtErrorEnumV0"),
        },
      });

      xdr.enum("ScSpecEntryKind", {
        scSpecEntryFunctionV0: 0,
        scSpecEntryUdtStructV0: 1,
        scSpecEntryUdtUnionV0: 2,
        scSpecEntryUdtEnumV0: 3,
        scSpecEntryUdtErrorEnumV0: 4,
      });

    });
  }

}
export default SdkTransform