import { existsSync as f } from "node:fs";
import { fileURLToPath as p } from "node:url";
import { delimiter as v, join as l } from "node:path";
import { startServer as w } from "@jeremytenjo/code-inspector-core";
function R(r) {
  const e = new URL(r || "/", "http://localhost");
  return e.pathname.endsWith(".bundle") && e.searchParams.get("platform") === "web" && e.searchParams.get("dev") === "true";
}
function T(r) {
  if (!r || process.env.CODE_EDITOR || r.includes("/") || r.includes("\\"))
    return;
  const e = process.env.PATH?.split(v).map((t) => l(t, r)).find(f);
  e && (process.env.CODE_EDITOR = e);
}
function b(r, e) {
  if (!e.projectRoot || !e.injectTo)
    throw new Error("Code Inspector Metro requires projectRoot and injectTo.");
  T(e.editor);
  const t = r.transformer?.babelTransformerPath;
  if (!t)
    throw new Error("Code Inspector Metro requires an existing Babel transformer.");
  process.env.CODE_INSPECTOR_METRO_CONFIG = JSON.stringify({
    projectRoot: e.projectRoot,
    injectTo: e.injectTo,
    showSwitch: e.showSwitch ?? !1,
    hotKeys: e.hotKeys,
    editor: e.editor,
    originalTransformerPath: t
  });
  const m = r.server?.enhanceMiddleware;
  let o;
  const d = () => {
    if (!o) {
      const n = {
        output: l(e.projectRoot, "node_modules/.cache/code-inspector-metro"),
        root: e.projectRoot,
        envDir: e.projectRoot,
        entry: "",
        port: 0
      }, c = {
        bundler: "metro",
        showSwitch: e.showSwitch ?? !1,
        hotKeys: e.hotKeys,
        editor: e.editor,
        pathType: "relative"
      };
      o = w(c, n).catch((s) => {
        throw o = void 0, s;
      });
    }
    return o;
  }, u = import.meta.url;
  return {
    ...r,
    server: {
      ...r.server,
      enhanceMiddleware(n, c) {
        const s = m?.call(r.server, n, c) || n;
        return (a, h, i) => {
          if (!R(a.url)) {
            s(a, h, i);
            return;
          }
          d().then(
            () => s(a, h, i),
            i
          );
        };
      }
    },
    transformer: {
      ...r.transformer,
      babelTransformerPath: p(new URL("./transformer.cjs", u))
    }
  };
}
export {
  b as withCodeInspectorMetro
};
