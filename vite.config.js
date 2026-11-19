import { globSync, readFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));
const partialsDir = resolve(root, "src/partials");

// GitHub Pages（https://yasai-co-ltd.github.io/hairstylist-school/）で公開するため、
// サイトの基準パスをリポジトリ名にする。独自ドメインへ移す場合は BASE_PATH=/ でビルドする。
const base = process.env.BASE_PATH ?? "/hairstylist-school/";

// ルート直下と各ディレクトリの index.html をすべてページとしてビルドする
// about/index.html（STEP 13）・course/index.html（STEP 14）・admission/index.html（STEP 15）・contact/index.html（STEP 16）も自動検出する。
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
    transformIndexHtml: {
      order: "pre",
      handler: (html, context) => {
        const pagePath = `/${relative(root, context.filename)
          .replaceAll("\\", "/")
          .replace(/index\.html$/, "")}`;
        // 共通ヘッダーのナビだけを対象にし、JSなしでも現在ページを示す。
        const withCurrent = include(html).replace(/<header\b[^>]*>[\s\S]*?<\/header>/, (header) =>
          header.replace(/<a\b[^>]*>/g, (tag) => {
            const isNav =
              /class="[^"]*\b(l-header__logo|l-header__nav-link|l-header-menu__nav-link)\b/.test(
                tag,
              );
            const href = tag.match(/href="([^"]*)"/)?.[1];
            return isNav && href === pagePath ? tag.replace(/>$/, ' aria-current="page">') : tag;
          }),
        );
        // ページ間リンク（href="/contact/" など）に公開先のパスを付ける。
        // 画像・JSの src は Vite が base に合わせて書き換えるため対象外。
        return withCurrent.replace(/\bhref="\/(?!\/)/g, `href="${base}`);
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) server.ws.send({ type: "full-reload" });
    },
  };
}

export default defineConfig({
  base,
  plugins: [htmlIncludes()],
  build: {
    rollupOptions: { input: pages },
  },
  server: { open: true },
});
