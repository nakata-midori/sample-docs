# KintaiFlow

このWebサイトは [Docusaurus](https://docusaurus.io/) を使って構築されています。

## Installation

```bash
npm install
```

## Local Development

```bash
npm run start
```

このコマンドは、ローカル開発サーバーを起動し、ブラウザウィンドウを開きます。ほとんどの変更は、サーバーを再起動することなくライブで反映されます。

## Build

```bash
npm run build
```

このコマンドは、静的コンテンツを `build` ディレクトリに生成し、任意の静的コンテンツホスティングサービスを使用して提供できます。

## Deployment

SSHを使用する場合：

```bash
USE_SSH=true npm run deploy
```

SSHを使用しない場合：

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

GitHub Pagesをホスティングに使用している場合、このコマンドはウェブサイトをビルドし、`gh-pages` ブランチにプッシュする便利な方法です。
