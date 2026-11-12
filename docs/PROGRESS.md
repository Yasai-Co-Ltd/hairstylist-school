# 進捗

> 作業を終えるたびに更新してから push する。別の Mac で再開するときは、まずここを読む。

## 次にやること

- [ ] STEP 4: 3項目の帯（Cursor）

## 最終作業

- 日付: 2026-11-12（STEP 3 追加・未コミット）
- 内容: Figma 1181:143 の「免許も。」を透過WebPで追加。PCは既存コピーの間（left 662 / top 310）、SPは3枚を文言順に縦積み。h1も同じコピーへ更新。

- 日付: 2026-11-12（STEP 3 調整・未コミット）
- 場所: 自宅Mac
- 内容: ヒーロー再調整。PC: 右下写真 left 1110.71/1440・幅360・回転中心 center・キャッチ z-index:2 で写真が下に潜る。SP: 人物88%・ボタン gutter。スクショ headless Chrome 1440/375（前担当の確認記録）。Codexで人物クロップ・overflow方向・SPキャッチと縦積みを修正
- 日付: 2026-11-12（STEP 3）
- 場所: 自宅Mac
- 内容: STEP 3 完了 — ヒーロー実装。Figma から hero-bg / model / catch×2 / salon-photo を 2x WebP 書き出し。§8 どおり h1 テキスト＋キャッチ画像 alt=""
- 日付: 2026-11-12（STEP 2）
- 場所: 自宅Mac
- 内容: STEP 2 完了 — ヘッダー（sticky・半透明 base）、PC ナビ＋CTA（ボタン S）、SP 全画面メニュー（Esc・scroll lock）。`c-button` プライマリ/セカンダリ L/M/S を新設
- 日付: 2026-11-12（STEP 1）
- 場所: 自宅Mac
- 内容: STEP 1 完了 — Figma `top/pc` と `_tokens.scss` / DESIGN_RULES を照合。差分は丸め前提が主。承認どおり DESIGN_RULES にヘッダーロゴ・PCヘッダー高さ・卒業バー・学費カード TUITION を追記（トークン値は未変更）
- 日付: 2026-11-12（STEP 0 途中）
- 場所: 自宅Mac
- 内容: STEP 0 完了 — `pnpm install` / `pnpm dev` OK。Figma MCP を `ysasaki@yaoya.io`（プロジェクト `beauty-school-site` / `.cursor/mcp.json`）で接続。`top/pc` と Design 直下5ページの名前・ノードIDは PROGRESS の一覧とすべて一致。`docs/FIGMA_GUIDE.md` から外れている点: Design 内の `Frame 54`（1170:87）、`footer` がフレームではなく `rounded-rectangle`（1059:2833）、`top/pc` のレイヤー順が画面上方と不一致（既知）
- 日付: 2026-11-12
- 場所: 自宅Mac
- 内容: 不採用案を前提にしていたトークン・フォント・DESIGN_RULES・CODING_PLAN・Cursor ルールを、確定デザインの値で書き直した。不採用案のプロトタイプ（docs/reference/prototype/）を削除

## トップページ

- [x] STEP 0 環境とFigma接続の確認
- [x] STEP 1 デザイントークンの照合（Figma top/pc とトークン照合。DESIGN_RULES にロゴ・ヘッダー高さ・卒業バー・TUITION を追記）
- [x] STEP 2 ヘッダー（header partial・l-header・c-button L/M/S・menu.js。SP は lg 未満でハンバーガー＋全画面ドロワー）
- [x] STEP 3 ヒーロー（p-top-hero・透過 WebP 4枚＋背景/サロン写真・PC は Figma 座標・ヘッダー背面に bg。SP は縦積み）※レビュー承認済み
  - SP（1024px未満）: 人物を画面幅88%・高さautoで上段へ置き、下端にキャッチ3枚（90%以内・高さauto）を重ねる。「免許も。」はPCの比率に合わせて約73%幅で中段へ配置。
  - ボタンは左右 `var(--gutter)` を残して全幅で縦積み。右下の装飾写真は非表示。375pxで横スクロールなし・メニューボタン表示を確認。
  - 人物はFigma 1045:2362のCROPに合わせ、元画像1774×887pxの左833×887pxを透過WebP化。1440pxの配置を維持。
- [ ] STEP 4 3項目の帯
- [ ] STEP 5 コンセプト
- [ ] STEP 6 5つの特長
- [ ] STEP 7 ロードマップ
- [ ] STEP 8 提携サロン
- [ ] STEP 9 学費・説明会
- [ ] STEP 10 お知らせ
- [ ] STEP 11 フッター
- [ ] STEP 12 仕上げ・確認

## 下層ページ

（STEP 13 以降で追記）

## Figma ノード一覧

Figma: https://www.figma.com/design/4I7RIMwVeqdzIQPXj9Ub8r/ （ページ「美容専門学校LP」の Design セクション 1061:2843）。名前は対応表で直した後の名前。

### ページ

| ページ         | 内容                 | ノードID  |
| -------------- | -------------------- | --------- |
| `top/pc`       | トップページ         | 1045:2317 |
| `about/pc`     | 学校紹介             | 1087:736  |
| `course/pc`    | 通信課程・サロン研修 | 1100:1379 |
| `admission/pc` | 入学案内・学費       | 1136:872  |
| `contact/pc`   | お問い合わせ         | 1127:510  |

### top/pc のセクション（上から順）

| セクション      | 内容                                    | PC ノードID |
| --------------- | --------------------------------------- | ----------- |
| `header`        | ヘッダー                                | 1045:2318   |
| `hero`          | ヒーロー                                | 1170:86     |
| `points`        | 3項目の帯（通信・3年・現場）            | 1170:88     |
| `concept`       | コンセプト                              | 1170:98     |
| `feature`       | 5つの特長                               | 1172:140    |
| `roadmap`       | スタイリストデビューまでの3年間         | 1172:141    |
| `partner-salon` | 提携サロン                              | 1170:122    |
| `tuition-event` | 学費の目安・学校説明会                  | 1170:139    |
| `news`          | お知らせ                                | 1170:138    |
| `footer`        | フッター（1枚の画像。コードで組み直す） | 1059:2833   |

## フレーム名の対応表

2026-11-12 に Figma 上で変更済み。Cursor の STEP 0 で一覧と照合する。

| 今の名前                         | ノードID  | 新しい名前      | メモ                                     |
| -------------------------------- | --------- | --------------- | ---------------------------------------- |
| TOP/PC                           | 1045:2317 | `top/pc`        |                                          |
| About_PC                         | 1087:736  | `about/pc`      |                                          |
| Course_PC                        | 1100:1379 | `course/pc`     |                                          |
| Course_PC（2つ目）               | 1136:872  | `admission/pc`  | 中身は入学案内・学費。名前が重複している |
| Contact_PC                       | 1127:510  | `contact/pc`    |                                          |
| Header                           | 1045:2318 | `header`        |                                          |
| hero                             | 1170:86   | `hero`          | そのままでよい                           |
| Frame 55                         | 1170:88   | `points`        |                                          |
| CONCEPT                          | 1170:98   | `concept`       |                                          |
| FEATURE                          | 1172:140  | `feature`       |                                          |
| ROADMAP                          | 1172:141  | `roadmap`       |                                          |
| PARTNER SALON                    | 1170:122  | `partner-salon` |                                          |
| PARTNER SALON （末尾にスペース） | 1170:139  | `tuition-event` | 中身は学費・説明会のカード               |
| News Section                     | 1170:138  | `news`          |                                          |
| Footer（画像）                   | 1059:2833 | `footer`        |                                          |

あわせて直すとよいこと:

- `top/pc` の中のレイヤーの並び順は、画面の上から順になっていない（重なり順が変わると hero の傾いた写真と points の帯の前後が入れ替わるため、未変更）。Cursor にはノード一覧の順番で依頼すればよい。
- 下層4ページは、レイヤーがページ直下に直接並んでいて、セクションごとのフレームにまとまっていない。実装（STEP 13 以降）の前に、セクション単位のフレームにまとめて名前を付ける。
- Design セクションの外にある「講師紹介」（1101:244）は、`about/pc` の講師一覧と同じ内容の部品なら、Design の外に置いたままでよい（Cursor はページのフレームしか読まない）。

## 未決事項

- 学校名・ロゴ
- フッターの文言（後日受け取り。STEP 11 の依頼時に渡す）
- 説明会の日程、学費の金額
- 特長の説明文（今は「説明文が入ります。」のダミー）
- 提携サロンのロゴ
- 公開先（サーバー・ドメイン）
- 本番写真（現在は仮素材）
