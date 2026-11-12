# AGENTS.md

このリポジトリで作業するAIエージェント（Cursor / Claude Code など）向けの入口。

- コーディングルール: `.cursor/rules/*.mdc`（Cursor 以外のエージェントも同じ内容に従う）
- 数値ルール: `docs/DESIGN_RULES.md`
- 実装の順番と範囲: `docs/CODING_PLAN.md`
- 進捗と次の作業: `docs/PROGRESS.md`（作業後に必ず更新）

作業の区切りごとに `pnpm check` を通すこと。コミットメッセージは日本語。
