# 環境構築と2台のMacでの作業ルール

自宅Mac・会社Macのどちらでも同じ状態で作業できるように、**コードと設定はすべて GitHub に置き、Mac 間の受け渡しは push / pull だけ**で行う。

## 必要なもの（両方のMac）

| もの                            | 用途           | 確認コマンド     |
| ------------------------------- | -------------- | ---------------- |
| Git                             | バージョン管理 | `git --version`  |
| GitHub CLI（gh）                | clone・認証    | `gh auth status` |
| Node.js 24                      | ビルド         | `node -v`        |
| pnpm 12                         | パッケージ管理 | `pnpm -v`        |
| Cursor                          | コーディング   | —                |
| Figma（デスクトップアプリ推奨） | デザイン確認   | —                |

Node のバージョンは `.nvmrc` と `mise.toml` で 24 に固定している。

## 会社Macの初回セットアップ

> 会社のMacで個人の GitHub アカウントを使ってよいか、先に社内ルールを確認すること。

1. **ツールを入れる**（未導入のものだけ）
   ```bash
   brew install git gh mise
   ```
2. **Node 24 と pnpm を入れる**
   ```bash
   mise use -g node@24
   npm install -g pnpm@12
   ```
   nvm を使っている場合は `nvm install 24 && nvm use 24` でもよい。
3. **GitHub にログイン**
   ```bash
   gh auth login
   ```
   GitHub.com → HTTPS → ブラウザでログイン、を選ぶ。
4. **リポジトリを取得**
   ```bash
   mkdir -p ~/dev && cd ~/dev
   gh repo clone ysasaki-hub/beauty-school-site
   cd beauty-school-site
   pnpm install
   pnpm dev
   ```
   ブラウザでトップページが開けばOK。
5. **Cursor で開く**: Cursor の File › Open Folder で `~/dev/beauty-school-site` を開く。
6. **Figma MCP を有効にする**: Cursor の設定 › MCP（Tools & Integrations）に `figma` が出ているので有効にし、表示される案内に沿って Figma アカウントでログインする（Macごとに1回）。
   - 設定はリポジトリの `.cursor/mcp.json` に入っているので、追加作業は認証だけ。
   - うまく接続できない場合は「Figma デスクトップアプリの Dev Mode MCP サーバー」に切り替える（下の「困ったとき」）。
7. **フォント（任意）**: Figma で正しく表示するため、Google Fonts から Noto Sans JP / Noto Sans をインストールしておく（Georgia は macOS に入っている）。サイト自体は Google Fonts を読み込むので不要。

## 毎日の作業ルーティン

### 始めるとき

```bash
cd ~/dev/beauty-school-site
git pull
pnpm install   # package.json が変わっていたときのため。毎回実行してよい
pnpm dev
```

→ `docs/PROGRESS.md` の「次にやること」を読んでから Cursor に依頼する。

### 終えるとき（Macを移る前は必ず）

1. `pnpm check` が通ることを確認
2. `docs/PROGRESS.md` の「次にやること」「最終作業」を更新
3. コミットして push
   ```bash
   git add -A
   git commit -m "トップのFVを実装"
   git push
   ```

- **push し忘れると、もう一台では続きができない**。終業前に必ず push する。
- 途中で止める場合も、「作業中」と書いてコミット・push してよい。
- 両方のMacで同時に編集しない。もし `git pull` で競合が出たら、無理に解決せず Cursor か Claude に相談する。

## 困ったとき

- **Figma MCP がつながらない（リモート版）**: Figma デスクトップアプリ › 環境設定 で Dev Mode MCP サーバーを有効にし、`.cursor/mcp.json` の `figma` を次に差し替える（このMacだけで試すならコミットしない）。
  ```json
  { "mcpServers": { "figma": { "url": "http://127.0.0.1:3845/mcp" } } }
  ```
  デスクトップ版は Figma アプリを開いていて、該当ファイルを表示している間だけ使える。
- **pnpm install で「Ignored build scripts」と出る**: `@parcel/watcher` は不要なので無視してよい（`pnpm-workspace.yaml` で除外済み）。
- **Node のバージョンが違う**: `node -v` が 24 系でなければ、`mise install` か `nvm use` を実行する。
