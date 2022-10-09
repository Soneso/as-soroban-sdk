import * as assemblyscript from "assemblyscript";
import { Transform } from "assemblyscript/transform";
import xdr from './xdr.js';

const META_NAME = "contractenvmetav0";
const HOST_FUNCTIONS_VERSION_SUPPORTED = "23"
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
    
    // Contracts must contain a WASM custom section with name contractenvmetav0 and containing a serialized SCEnvMetaEntry. 
    // The interface version stored within should match the version of the host functions supported.
    var meta = xdr.ScEnvMetaEntry.scEnvMetaKindInterfaceVersion(xdr.Uint64.fromString(HOST_FUNCTIONS_VERSION_SUPPORTED));

    asModule.addCustomSection(META_NAME, meta.toXDR());

    //Contracts should contain a WASM custom section with name contractspecv0 and containing a serialized stream of SCSpecEntry. 
    //There should be a SCSpecEntry for every function, struct, and union exported by the contract.
    const ti32 = xdr.ScSpecTypeDef.scSpecTypeI32();
    var funcAddInputA = new xdr.ScSpecFunctionInputV0({name: "a", type: ti32});
    var funcAddInputB = new xdr.ScSpecFunctionInputV0({name: "b", type: ti32});
    var funcAdd = new xdr.ScSpecFunctionV0({name: 'add', inputs: [funcAddInputA, funcAddInputB],outputs: [ti32]});
    var funcAddEntry = xdr.ScSpecEntry.scSpecEntryFunctionV0(funcAdd);

    /*
    const tval = xdr.ScSpecTypeDef.scSpecTypeBytes();
    var funcGetObj = new xdr.ScSpecFunctionV0({name: 'obj', inputs: [],outputs: [tval]});
    var funcGetObjEntry = xdr.ScSpecEntry.scSpecEntryFunctionV0(funcGetObj);
    var res = Buffer.concat([funcAddEntry.toXDR(), funcGetObjEntry.toXDR()]);*/
    asModule.addCustomSection(SPEC_NAME, funcAddEntry.toXDR());
  }
}
export default SdkTransform