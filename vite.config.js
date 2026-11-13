import { globSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));
const partialsDir = resolve(root, "src/partials");

// ルート直下と各ディレクトリの index.html をすべてページとしてビルドする
// about/index.html（STEP 13）・course/index.html（STEP 14）・admission/index.html（STEP 15）も自動検出する。
// 例: index.html / about/index.html / admission/index.html
const pages = Object.fromEntries(
  globSync("**/index.html", {
    cwd: root,
    exclude: (name) => ["node_modules", "dist", "docs", "public", "src"].includes(name),
  }).map((file) => [file.replace(/\/?index\.html$/, "") || "top", resolve(root, file)]),
);

// <!-- @include header.html --> を src/partials/header.html の中身に置き換える
// 共通パーツ（ヘッダー・フッターなど）を複数ページで使い回すための最小プラグイン
function htmlIncludes() {
  const pattern = /<!--\s*@include\s+([\w./-]+)\s*-->/g;
  const include = (html, depth = 0) =>
    depth > 5
      ? html
      : html.replace(pattern, (_, file) =>
          include(readFileSync(resolve(partialsDir, file), "utf-8"), depth + 1),
        );
  return {
    name: "html-includes",
    transformIndexHtml: { order: "pre", handler: (html) => include(html) },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) server.ws.send({ type: "full-reload" });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [htmlIncludes()],
  build: {
    rollupOptions: { input: pages },
  },
  server: { open: true },
});
