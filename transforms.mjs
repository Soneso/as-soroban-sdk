import * as assemblyscript from "assemblyscript";
import { Transform } from "assemblyscript/transform";
import xdr from './xdr.js';
import * as fs from 'fs'

const META_NAME = "contractenvmetav0";
const SPEC_NAME = "contractspecv0";

class SdkTransform extends Transform {
  
  /*afterParse(parser) {
    this.log("[mytransform.js] afterParse called, baseDir = " + this.baseDir);
    var sources = this.program.sources;
    sources.forEach((source) =>
      this.log("  " + source.internalPath + " [" + assemblyscript.SourceKind[source.sourceKind] + "]")
    );
  }
  afterInitialize(program) {
    this.log("[mytransform.js] afterInitialize called");
    var elements = program.elementsByName;
    elements.forEach((element) => {
      
      if (element.internalName.startsWith("assembly/index")) {
        this.log("  " + element.internalName + " [" + assemblyscript.ElementKind[element.kind] + "]")
        if (assemblyscript.ElementKind[element.kind] === "FUNCTION_PROTOTYPE") {
          this.log(element.declaration);
        }
      }
    });
  }*/

  afterCompile(asModule) { 
    //this.log(asModule);
    
    const contractDataFile = fs.readFileSync("./contract.json");
    const contractData = JSON.parse(contractDataFile);

    console.log('generate metadata for contract: ');
    // Contracts must contain a WASM custom section with name contractenvmetav0 and containing a serialized SCEnvMetaEntry. 
    // The interface version stored within should match the version of the host functions supported.
    var meta = xdr.ScEnvMetaEntry.scEnvMetaKindInterfaceVersion(new xdr.Uint64(contractData.host_functions_version));

    asModule.addCustomSection(META_NAME, meta.toXDR());
    console.log('host function version: ', contractData.host_functions_version);

    //Contracts should contain a WASM custom section with name contractspecv0 and containing a serialized stream of SCSpecEntry. 
    //There should be a SCSpecEntry for every function, struct, and union exported by the contract.
    console.log('generate metadata for functions: ');

    var valid = true;
    var functions = [];
    contractData.functions.forEach((item) => {
      let functionName = item.name;
      console.log('function name: ' + functionName);
      console.log('function arguments: ');
      var args = [];
      item.arguments.forEach((argument) => {
        console.log('argument name: ' + argument.name);
        console.log('argument type: ' + argument.type);
        let typ = SdkTransform.getType(argument.type);
        if (typ) {
          args.push(new xdr.ScSpecFunctionInputV0({name: argument.name, type: typ}));
        } else {
          console.error("Unsupported argument type: " + argument.type);
          valid = false;
        }
      });
      let functionReturn = item.returns;
      console.log('return: ' + functionReturn);
      let returnTypes = [];
      if (functionReturn && functionReturn !== "void" && valid) {
        let returnTyp = SdkTransform.getType(functionReturn);
        if (returnTyp) {
          returnTypes.push(returnTyp);
        } else {
          console.error("Unsupported return type: " + functionReturn);
          valid = false;
        }
      }
      if (valid) {
        let ffunc = new xdr.ScSpecFunctionV0({name: functionName, inputs: args, outputs: returnTypes});
        let funcEntry = xdr.ScSpecEntry.scSpecEntryFunctionV0(ffunc);
        functions.push(funcEntry.toXDR());
      }
    });

    if (valid) {
      let res = Buffer.concat(functions);
      asModule.addCustomSection(SPEC_NAME, res);
      console.log('done generating metadata');
    } else {
      console.error("COULD NOT GENERATE METADATA");
    }
  }

  static getType(argumentTypeStr) {
    var typ = xdr.ScSpecTypeDef.scSpecTypeVal();
    switch(argumentTypeStr) {
      case "val":
        typ = xdr.ScSpecTypeDef.scSpecTypeVal();
        break;
      case "u32":
        typ = xdr.ScSpecTypeDef.scSpecTypeU32();
        break;
      case "i32":
        typ = xdr.ScSpecTypeDef.scSpecTypeI32();
        break;
      case "u64":
        typ = xdr.ScSpecTypeDef.scSpecTypeU64();
        break;
      case "i64":
        typ = xdr.ScSpecTypeDef.scSpecTypeI64();
        break;
      case "bool":
        typ = xdr.ScSpecTypeDef.scSpecTypeBool();
        break;
      case "symbol":
        typ = xdr.ScSpecTypeDef.scSpecTypeSymbol();
        break;
      case "bitset":
        typ = xdr.ScSpecTypeDef.scSpecTypeBitset();
        break;
      case "status":
        typ = xdr.ScSpecTypeDef.scSpecTypeStatus();
        break;
      case "bytes":
        typ = xdr.ScSpecTypeDef.scSpecTypeBytes();
        break;
      case "bigint":
        typ = xdr.ScSpecTypeDef.scSpecTypeBigInt();
        break;
      case "bigint":
        typ = xdr.ScSpecTypeDef.scSpecTypeInvoker();
        break;
      default:
        return false; // unsupported
    }
    return typ;
  }
}
export default SdkTransform