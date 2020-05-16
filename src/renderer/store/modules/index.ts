import { ModuleTree } from "vuex";

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

export default modules;
