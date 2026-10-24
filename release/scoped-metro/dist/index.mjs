import { fileURLToPath as u } from "node:url";
import { join as p } from "node:path";
import { startServer as w } from "@code-inspector/core";
function f(e) {
  const r = new URL(e || "/", "http://localhost");
  return r.pathname.endsWith(".bundle") && r.searchParams.get("platform") === "web" && r.searchParams.get("dev") === "true";
}
function T(e, r) {
  if (!r.projectRoot || !r.injectTo)
    throw new Error("Code Inspector Metro requires projectRoot and injectTo.");
  const h = e.transformer?.babelTransformerPath;
  if (!h)
    throw new Error("Code Inspector Metro requires an existing Babel transformer.");
  process.env.CODE_INSPECTOR_METRO_CONFIG = JSON.stringify({
    projectRoot: r.projectRoot,
    injectTo: r.injectTo,
    showSwitch: r.showSwitch ?? !1,
    editor: r.editor,
    originalTransformerPath: h
  });
  const l = e.server?.enhanceMiddleware;
  let t;
  const m = () => {
    if (!t) {
      const o = {
        output: p(r.projectRoot, "node_modules/.cache/code-inspector-metro"),
        root: r.projectRoot,
        envDir: r.projectRoot,
        entry: "",
        port: 0
      }, a = {
        bundler: "metro",
        showSwitch: r.showSwitch ?? !1,
        editor: r.editor,
        pathType: "relative"
      };
      t = w(a, o).catch((n) => {
        throw t = void 0, n;
      });
    }
    return t;
  }, d = import.meta.url;
  return {
    ...e,
    server: {
      ...e.server,
      enhanceMiddleware(o, a) {
        const n = l?.call(e.server, o, a) || o;
        return (c, i, s) => {
          if (!f(c.url)) {
            n(c, i, s);
            return;
          }
          m().then(
            () => n(c, i, s),
            s
          );
        };
      }
    },
    transformer: {
      ...e.transformer,
      babelTransformerPath: u(new URL("./transformer.cjs", d))
    }
  };
}
export {
  T as withCodeInspectorMetro
};
