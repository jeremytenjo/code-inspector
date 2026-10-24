import { existsSync as p } from "node:fs";
import { fileURLToPath as w } from "node:url";
import { delimiter as v, join as h } from "node:path";
import { startServer as T } from "@jeremytenjo/code-inspector-core";
function R(r) {
  const e = new URL(r || "/", "http://localhost");
  return e.pathname.endsWith(".bundle") && e.searchParams.get("platform") === "web" && e.searchParams.get("dev") === "true";
}
const j = {
  control: "ctrlKey",
  ctrl: "ctrlKey",
  option: "altKey",
  alt: "altKey",
  command: "metaKey",
  cmd: "metaKey",
  meta: "metaKey",
  shift: "shiftKey"
};
function E(r) {
  return r && r.map((e) => j[String(e).trim().toLowerCase()] || e);
}
function S(r) {
  if (!r || process.env.CODE_EDITOR || r.includes("/") || r.includes("\\"))
    return;
  const e = process.env.PATH?.split(v).map((t) => h(t, r)).find(p);
  e && (process.env.CODE_EDITOR = e);
}
function b(r, e) {
  if (!e.projectRoot || !e.injectTo)
    throw new Error("Code Inspector Metro requires projectRoot and injectTo.");
  const t = E(e.hotKeys);
  S(e.editor);
  const l = r.transformer?.babelTransformerPath;
  if (!l)
    throw new Error("Code Inspector Metro requires an existing Babel transformer.");
  process.env.CODE_INSPECTOR_METRO_CONFIG = JSON.stringify({
    projectRoot: e.projectRoot,
    injectTo: e.injectTo,
    showSwitch: e.showSwitch ?? !1,
    hotKeys: t,
    editor: e.editor,
    originalTransformerPath: l
  });
  const d = r.server?.enhanceMiddleware;
  let o;
  const u = () => {
    if (!o) {
      const n = {
        output: h(e.projectRoot, "node_modules/.cache/code-inspector-metro"),
        root: e.projectRoot,
        envDir: e.projectRoot,
        entry: "",
        port: 0
      }, a = {
        bundler: "metro",
        showSwitch: e.showSwitch ?? !1,
        hotKeys: t,
        editor: e.editor,
        pathType: "relative"
      };
      o = T(a, n).catch((c) => {
        throw o = void 0, c;
      });
    }
    return o;
  }, f = import.meta.url;
  return {
    ...r,
    server: {
      ...r.server,
      enhanceMiddleware(n, a) {
        const c = d?.call(r.server, n, a) || n;
        return (s, m, i) => {
          if (!R(s.url)) {
            c(s, m, i);
            return;
          }
          u().then(
            () => c(s, m, i),
            i
          );
        };
      }
    },
    transformer: {
      ...r.transformer,
      babelTransformerPath: w(new URL("./transformer.cjs", f))
    }
  };
}
export {
  b as withCodeInspectorMetro
};
