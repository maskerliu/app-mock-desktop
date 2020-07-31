import { ModuleTree } from "vuex";

import ProxyRecords from "../../../common/store/ProxyRecords"
import MockRules from "../../../common/store/MockRules"

/**
 * The file enables `@/store/index.ts` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
const files = require["context"](".", false, /\.ts$/);
const modules: ModuleTree<any> = {};

files.keys().forEach((key: string) => {
  if (key === "./index.ts") return;
  modules[key.replace(/(\.\/|\.ts)/g, "")] = files(key).default;
});

modules["ProxyRecords"] = ProxyRecords;
modules["MockRules"] = MockRules;

export default modules;
