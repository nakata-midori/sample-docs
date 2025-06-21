# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

KintaiFlow（勤怠管理システム）のDocusaurusベースのドキュメントサイトです。時間管理、申請、ダッシュボード、レポート、モバイル対応、AI機能、管理者機能などの日本語ドキュメントを提供しています。

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# ホットリロード付き開発サーバー起動
npm run start

# 本番用ビルド
npm run build

# 型チェック
npm run typecheck

# ビルドしたサイトをローカルで配信
npm run serve

# キャッシュクリア
npm run clear

# GitHub Pagesにデプロイ
npm run deploy
# SSH使用: USE_SSH=true npm run deploy
# ユーザー指定: GIT_USER=<username> npm run deploy
```

## アーキテクチャ

- **フレームワーク**: Docusaurus v3.8.1 + TypeScript
- **コンテンツ**: `/docs`内のMarkdownドキュメント、`/blog`内のMDXブログ投稿
- **テーマ**: クラシックプリセット + カスタムCSS
- **コンポーネント**: `/src/components`内のReactコンポーネント（ホームページ機能用）
- **設定**: `docusaurus.config.ts`がメイン設定、`sidebars.ts`がサイドバー構造

## コンテンツ構造

- **ドキュメント**: `/docs`内に日本語でユーザー・管理者機能を記載
- **ブログ**: `/blog`内にサンプル投稿と著者設定
- **サイドバー**: `sidebars.ts`で主要機能と管理者機能をカテゴリ分け
- **静的アセット**: `/static/img`に画像とfavicon

## 主要設定

- **サイトタイトル**: KintaiFlow、タグライン「勤怠管理をもっとスマートに」
- **ローカライゼーション**: 現在英語デフォルト（日本語に更新すべき）
- **ナビゲーション**: ドキュメント、リリースノート、サポートリンクを含む
- **テーマ**: コードブロックはGitHub lightテーマ + Dracula darkテーマ
- **将来互換性**: Docusaurus v4対応設定済み

## TypeScript設定

- `@docusaurus/tsconfig`をベース設定として使用
- ビルド出力は型チェック対象外（`build`, `.docusaurus`ディレクトリ）
- カスタムベースURLは現在のディレクトリに設定

## Git運用ルール

### ブランチ戦略
- **main**: プロダクション対応ブランチ
- **develop**: 開発統合ブランチ 
- **feature/xxx**: 機能開発ブランチ← 基本作業ブランチ
- **fix/xxx**: バグ修正ブランチ

### コミットメッセージ
```
種別: 簡潔な変更概要（50文字以内）

詳細説明（必要に応じて）
- 変更理由
- 影響範囲
- 関連issue

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**種別**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `refactor`: リファクタリング
- `test`: テスト追加・修正