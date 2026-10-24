import { fileURLToPath as n } from "node:url";
function s(e, r) {
  if (!r.projectRoot || !r.injectTo)
    throw new Error("Code Inspector Metro requires projectRoot and injectTo.");
  const o = e.transformer?.babelTransformerPath;
  if (!o)
    throw new Error("Code Inspector Metro requires an existing Babel transformer.");
  process.env.CODE_INSPECTOR_METRO_CONFIG = JSON.stringify({
    projectRoot: r.projectRoot,
    injectTo: r.injectTo,
    showSwitch: r.showSwitch ?? !1,
    editor: r.editor,
    originalTransformerPath: o
  });
  const t = import.meta.url;
  return {
    ...e,
    transformer: {
      ...e.transformer,
      babelTransformerPath: n(new URL("./transformer.cjs", t))
    }
  };
}
export {
  s as withCodeInspectorMetro
};
