import { globSync, readFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));
const partialsDir = resolve(root, "src/partials");

// GitHub Pages（https://yasai-co-ltd.github.io/hairstylist-school/）で公開するため、
// サイトの基準パスをリポジトリ名にする。独自ドメインへ移す場合は BASE_PATH=/ でビルドする。
const base = process.env.BASE_PATH ?? "/hairstylist-school/";
// OGPのURLは絶対URLが必要。独自ドメインへ移す場合は SITE_ORIGIN=https://example.jp も指定する。
const siteOrigin = process.env.SITE_ORIGIN ?? "https://yasai-co-ltd.github.io";
const SITE_NAME = "東京通信美容学校";
const OGP_IMAGE = { path: "images/common/ogp.jpg", width: 1200, height: 630 };

// ページのHTMLファイルから、サイト内のパス（"/" や "/about/"）を求める
const toPagePath = (filename) =>
  `/${relative(root, filename)
    .replaceAll("\\", "/")
    .replace(/index\.html$/, "")}`;

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
        const pagePath = toPagePath(context.filename);
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

// 各ページの <title> と description から OGP・Xカードのタグを作り、</head> の直前に入れる。
// タイトルと説明文の管理を1か所にするため、OGP用の文言は個別に書かない。
function ogpTags() {
  const attr = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return {
    name: "ogp-tags",
    transformIndexHtml: {
      order: "pre",
      handler: (html, context) => {
        const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
        const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
        if (!title || !description) {
          throw new Error(`[ogp-tags] title または description がありません: ${context.filename}`);
        }
        const pagePath = toPagePath(context.filename);
        const siteBase = `${siteOrigin}${base}`;
        const tags = [
          ["og:site_name", SITE_NAME],
          ["og:type", pagePath === "/" ? "website" : "article"],
          ["og:title", title],
          ["og:description", description],
          ["og:url", `${siteBase}${pagePath.slice(1)}`],
          ["og:image", `${siteBase}${OGP_IMAGE.path}`],
          ["og:image:width", OGP_IMAGE.width],
          ["og:image:height", OGP_IMAGE.height],
          ["og:image:alt", `${SITE_NAME}｜働きながら、免許も。`],
          ["og:locale", "ja_JP"],
        ]
          .map(
            ([property, content]) =>
              `<meta property="${property}" content="${attr(String(content))}" />`,
          )
          .concat('<meta name="twitter:card" content="summary_large_image" />');
        return html.replace("</head>", `    ${tags.join("\n    ")}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  base,
  plugins: [htmlIncludes(), ogpTags()],
  build: {
    rollupOptions: { input: pages },
  },
  server: { open: true },
});
