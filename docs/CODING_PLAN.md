# コーディング計画（Cursor への依頼手順）

- Figma: https://www.figma.com/design/4I7RIMwVeqdzIQPXj9Ub8r/
- 進捗とノードID: docs/PROGRESS.md
- ルール: `.cursor/rules/`（自動で読み込まれる）、docs/DESIGN_RULES.md

## 進め方の原則

- **1回の依頼 = 1ステップ**。Cursor のチャットはステップごとに新しく開く（文脈が混ざらないように）。
- 依頼文は下のテンプレートをコピーし、`<...>` を埋めて貼る。Figma のリンクはセクションのフレームを選んで「リンクをコピー」したもの。
- 1ステップ終わるごとに、自分の目でブラウザ確認 → `pnpm check` → コミット。
- 見た目がずれたら、スクリーンショットを貼って「Figma とここが違う」と具体的に伝える。

## 依頼テンプレート

```
<Figmaのセクションのリンク>
上のフレームを、docs/CODING_PLAN.md の STEP <番号>（<セクション名>）として実装してください。

- .cursor/rules と docs/DESIGN_RULES.md に従い、数値はトークンに丸める
- PCは Figma の <ページ>/pc、SPは <ページ>/sp の同名フレームを参照（SPがなければ DESIGN_RULES のSP値で組む）
- 画像は public/images/<ページ名>/ に WebP で書き出す
- 終わったら pnpm check を通し、PC 1440 / 768 / SP 375 での見た目を確認
- docs/PROGRESS.md を更新（チェック・ノードID・次にやること）
- 実装中に判断が必要な点は、勝手に決めずに質問する
```

---

## STEP 0　環境とFigma接続の確認

```
docs/CODING_PLAN.md の STEP 0 を実行してください。
1. pnpm install と pnpm dev が動くか確認
2. Figma MCP で次のフレームを読み、直下の子フレーム（セクション）の名前とノードIDを一覧にする
   - <top/pc のリンク>
   - <top/sp のリンク>（あれば）
3. 一覧を docs/PROGRESS.md の「Figma ノード一覧」に書き込む
4. docs/FIGMA_GUIDE.md の命名から外れているフレームがあれば指摘する（Figma 側は直さない）
まだ実装はしないでください。
```

## STEP 1　デザイントークンの照合

```
docs/CODING_PLAN.md の STEP 1 を実行してください。
Figma の top/pc と top/sp から、使われている色・フォント・文字サイズ・余白を抽出し、
src/scss/foundation/_tokens.scss と docs/DESIGN_RULES.md と比べた差分を表にしてください。
- 誤差（4px以下・ほぼ同じ色）はトークン側に合わせる前提で「丸める」と書く
- 明らかに違う値だけ「トークン変更の提案」として理由つきで挙げる
ファイルはまだ変更しないでください。私が提案を承認したら反映してください。
```

## STEP 2〜9　トップページのセクション実装

テンプレートを使い、次の順で1つずつ依頼する。

| STEP | セクション              | 作るファイル                                                            | 補足                                                                                                                                                    |
| ---- | ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2    | ヘッダー                | `src/partials/header.html`, `layout/_header.scss`, `js/modules/menu.js` | SPはメニューボタン＋全画面メニュー（`aria-expanded`、Escで閉じる、開いている間は背面スクロール停止）。共通部品の `components/_button.scss` もここで作る |
| 3    | FV（hero）              | `pages/top/_hero.scss`                                                  | Self（写真の後ろ）/ MADE.（写真の前）の重なり、鏡の円、回転バッジ。写真は `fetchpriority="high"`                                                        |
| 4    | マーキー                | `components/_marquee.scss`                                              | CSSアニメーションのみ。読み上げ対象外（`aria-hidden`）。同じ内容を2回並べて無限ループ                                                                   |
| 5    | ABOUT                   | `pages/top/_about.scss`, `components/_section-head.scss`                | 文中の小さな写真はトリミング位置を `object-position` で指定。セクション見出し（英字ラベル＋見出し）を共通部品化                                         |
| 6    | LEARN（カラーチャート） | `pages/top/_learn.scss`                                                 | 6項目は同じHTML構造の繰り返し。毛束の色は modifier か `--swatch` カスタムプロパティで切り替え                                                           |
| 7    | LIFE（スタイルブック）  | `pages/top/_life.scss`                                                  | PCは4列グリッド（左の大きな写真が2×2）、SPは2列。キャプションは写真の上の紙ラベル                                                                       |
| 8    | OPEN CAMPUS             | `pages/top/_oc.scss`                                                    | 日程カード3つは `[日付]` などのプレースホルダーのまま。CTAボタン2つ                                                                                     |
| 9    | フッター                | `src/partials/footer.html`, `layout/_footer.scss`                       | 全ページ共通                                                                                                                                            |

## STEP 10　トップページの仕上げ

```
docs/CODING_PLAN.md の STEP 10 を実行してください。トップページ全体を通しで確認し、問題を修正してください。
- 幅 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920 で横スクロールや重なり崩れがないか
- 見出し階層（h1 は1つ）、alt、ボタン・リンクの種類、キーボード操作（Tab で全部たどれ、フォーカスが見える）
- 画像の width/height、lazy、FV以外の重い画像がないか
- Lighthouse（モバイル）の Performance / Accessibility / Best Practices / SEO を計測し、90未満の項目は改善案を出す
修正した内容を一覧で報告し、docs/PROGRESS.md を更新してください。
```

## STEP 11 以降　下層ページ

ページごとに次を依頼する（`<slug>` は Figma のフレーム名の前半。例: `about`）。

```
docs/CODING_PLAN.md の「下層ページ」の手順で <slug> ページを作ります。
1. <slug>/index.html を index.html の構成（head・ヘッダー・フッターの include）に合わせて作成
2. Figma <slug>/pc（と <slug>/sp）のセクションを STEP 0 と同じ要領で一覧化し、PROGRESS.md に追記
3. セクションはまだ実装せず、一覧と「既存の component で作れるもの / 新しく必要な component」を提案してください
```

その後、セクションごとにテンプレートで実装を依頼する。2ページ以上で使う見た目は `components/` に切り出す。

## 公開（あとで決める）

ビルド結果は `pnpm build` で `dist/` に出る静的ファイル。サーバーや公開方法（Netlify / Vercel / 既存サーバーへのアップロード等）は決まったら追記する。
