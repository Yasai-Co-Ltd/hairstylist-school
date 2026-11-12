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
- PCは Figma の <ページ>/pc を参照。SPデザインはないので、DESIGN_RULES.md の「9. SP・タブレットの組み方」に沿って組み直す（PCの縮小にしない）
- SPでどう組んだかを報告に1〜3行で添える
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
2. Figma MCP で <top/pc のリンク> を読み、直下の子フレーム（セクション）の名前とノードIDが
   docs/PROGRESS.md の「Figma ノード一覧」と合っているか確認する
3. 違っていれば（フレーム名を直した後など）一覧を更新し、docs/FIGMA_GUIDE.md の命名から外れているフレームがあれば指摘する（Figma 側は直さない）
まだ実装はしないでください。
```

## STEP 1　デザイントークンの照合

```
docs/CODING_PLAN.md の STEP 1 を実行してください。
Figma の top/pc から、使われている色・フォント・文字サイズ・余白を抽出し、
src/scss/foundation/_tokens.scss と docs/DESIGN_RULES.md と比べた差分を表にしてください。
- 誤差（4px以下・ほぼ同じ色）はトークン側に合わせる前提で「丸める」と書く
- 明らかに違う値だけ「トークン変更の提案」として理由つきで挙げる
ファイルはまだ変更しないでください。私が提案を承認したら反映してください。
```

## STEP 2〜11　トップページのセクション実装

テンプレートを使い、次の順で1つずつ依頼する。セクション名は Figma `top/pc` 直下のフレーム名（docs/PROGRESS.md のノード一覧）。

| STEP | セクション                      | 作るファイル                                                                                       | 補足                                                                                                                                                                                                                         |
| ---- | ------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2    | ヘッダー（`header`）            | `src/partials/header.html`, `layout/_header.scss`, `js/modules/menu.js`, `components/_button.scss` | 全ページ共通。SPはメニューボタン＋全画面メニュー（`aria-expanded`、Escで閉じる、開いている間は背面スクロール停止）。ボタン部品（プライマリ／セカンダリ、L/M/S）をここで作る                                                  |
| 3    | ヒーロー（`hero`）              | `pages/top/_hero.scss`                                                                             | キャッチは画像素材だが `<h1>` に同じ文言をテキストで入れる（DESIGN_RULES §8）。背景写真と人物写真は `fetchpriority="high"`。傾いた写真・テープは装飾                                                                         |
| 4    | 3項目の帯（`points`）           | `pages/top/_points.scss`                                                                           | 3項目は同じHTML構造の繰り返し（`<ul>`）。イラストは装飾で `alt=""`                                                                                                                                                           |
| 5    | コンセプト（`concept`）         | `pages/top/_concept.scss`, `components/_section-head.scss`, `components/_photo.scss`               | セクション見出し（英字ラベル＋横線＋見出し＋強調語）を共通部品化。白フチ・傾き・テープの写真も `c-photo` として部品化。比較バーは表ではなくリストで組む                                                                      |
| 6    | 5つの特長（`feature`）          | `pages/top/_feature.scss`, `components/_feature-card.scss`                                         | 01〜05 は同じ「写真・番号・見出し・本文」の部品をレイアウト違い（横並び／3列／大きなカード）で使う。説明文はダミーのまま                                                                                                     |
| 7    | ロードマップ（`roadmap`）       | `pages/top/_roadmap.scss`, `components/_cut-card.scss`                                             | 切り落としカードを `c-cut-card` として部品化（学費・説明会でも使う）。タイムラインは `<ol>`。SPは縦のタイムラインに組み替える                                                                                                |
| 8    | 提携サロン（`partner-salon`）   | `pages/top/_partner-salon.scss`                                                                    | ロゴ枠は仮表示（「サロンロゴ」）のまま。実ロゴが来たら `<img>` に差し替えられる構造にする                                                                                                                                    |
| 9    | 学費・説明会（`tuition-event`） | `pages/top/_tuition-event.scss`                                                                    | `c-cut-card` を使う。金額・日付・時間は `[金額]` `[日付]` `[時間]` のプレースホルダーのまま。オンライン／来校のタグは `c-tag` として部品化してよい                                                                           |
| 10   | お知らせ（`news`）              | `pages/top/_news.scss`                                                                             | 3行の一覧（`<ul>`、各行は `<a>`）。日付は `<time>`                                                                                                                                                                           |
| 11   | フッター（`footer`）            | `src/partials/footer.html`, `layout/_footer.scss`                                                  | 全ページ共通。**Figma では1枚の画像になっているが、画像は使わずに HTML/CSS で組み直す**（CTA帯・ナビ・学校名・住所などはすべてテキスト、リンクは `<a>`）。文言はユーザーから後日受け取る。画像から読み取れない文字は質問する |

## STEP 12　トップページの仕上げ

```
docs/CODING_PLAN.md の STEP 12 を実行してください。トップページ全体を通しで確認し、問題を修正してください。
- 幅 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920 で横スクロールや重なり崩れがないか
- 見出し階層（h1 は1つ）、alt、ボタン・リンクの種類、キーボード操作（Tab で全部たどれ、フォーカスが見える）
- 画像の width/height、lazy、FV以外の重い画像がないか
- Lighthouse（モバイル）の Performance / Accessibility / Best Practices / SEO を計測し、90未満の項目は改善案を出す
修正した内容を一覧で報告し、docs/PROGRESS.md を更新してください。
```

## STEP 13 以降　下層ページ

対象は Figma の Design セクションにある `about/pc`（学校紹介）、`course/pc`（通信課程・サロン研修）、`admission/pc`（入学案内・学費）、`contact/pc`（お問い合わせ）。
ページごとに次を依頼する（`<slug>` は Figma のフレーム名の前半。例: `about`）。

```
docs/CODING_PLAN.md の「下層ページ」の手順で <slug> ページを作ります。
1. <slug>/index.html を index.html の構成（head・ヘッダー・フッターの include）に合わせて作成
2. Figma <slug>/pc のセクションを STEP 0 と同じ要領で一覧化し、PROGRESS.md に追記
3. セクションはまだ実装せず、一覧と「既存の component で作れるもの / 新しく必要な component」を提案してください
```

その後、セクションごとにテンプレートで実装を依頼する。2ページ以上で使う見た目は `components/` に切り出す。
下層ページの Figma は、まだセクションごとのフレームにまとまっていない（レイヤーが直接並んでいる）。実装の前に、ユーザーがセクション単位のフレームにまとめる。

## 公開（あとで決める）

ビルド結果は `pnpm build` で `dist/` に出る静的ファイル。サーバーや公開方法（Netlify / Vercel / 既存サーバーへのアップロード等）は決まったら追記する。
