# beauty-school-site

美容学校（若い女性向け）のWebサイト。デザインコンセプトは「SELF MADE」。

Vite + 静的HTML + SCSS（FLOCSS + BEM）+ 素のJavaScript。

## はじめに読むもの

| ファイル                                     | 内容                                         |
| -------------------------------------------- | -------------------------------------------- |
| [docs/PROGRESS.md](docs/PROGRESS.md)         | 進捗と「次にやること」。作業再開時はまずここ |
| [docs/SETUP.md](docs/SETUP.md)               | 環境構築、自宅Mac ⇄ 会社Mac の受け渡し手順   |
| [docs/CODING_PLAN.md](docs/CODING_PLAN.md)   | 実装の順番と Cursor への依頼文テンプレート   |
| [docs/DESIGN_RULES.md](docs/DESIGN_RULES.md) | 色・文字・余白などの数値ルール               |
| [docs/FIGMA_GUIDE.md](docs/FIGMA_GUIDE.md)   | Figma のフレームの整理方法                   |
| `.cursor/rules/`                             | Cursor が自動で読むコーディングルール        |

## コマンド

```bash
pnpm install   # 依存関係のインストール
pnpm dev       # 開発サーバー
pnpm check     # lint + フォーマット確認 + ビルド（作業の区切りごとに）
pnpm build     # dist/ に書き出し
```

## ディレクトリ

```
index.html            トップページ（下層は <slug>/index.html）
src/partials/         共通パーツ（<!-- @include header.html --> で読み込み）
src/scss/             foundation / layout / components / pages / utility
src/js/               main.js と modules/
public/images/        画像（ページ別フォルダ）
docs/                 設計資料・進捗
docs/reference/       初期のHTMLプロトタイプ（参考用）
```
