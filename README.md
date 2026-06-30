# SIMけんのAI収入ライン増設計画

非エンジニア会社員のSIMけんが、ChatGPT・Codex・n8nなどを使って第二の収入ラインを作る過程を公開する静的サイトです。

## ファイル構成

- `index.html`: トップページ
- `first.html`, `projects.html`, `articles.html`, `tools.html`, `about.html`, `contact.html`: 固定ページ
- `privacy-policy.html`, `advertising-policy.html`, `disclaimer.html`, `correction-policy.html`: 運営ページ
- `articles/`: 初期8記事
- `assets/css/style.css`: 共通デザイン
- `assets/js/site-config.js`: サイトURL、問い合わせフォーム、X URL、進捗ステータスなど
- `assets/js/main.js`: ハンバーガーメニュー、記事絞り込み、設定反映
- `assets/images/`: ロゴ、OGP、仮画像
- `assets/images/evidence/`: 実際の制作画面・公開画面の最適化画像

<!-- SNS自動投稿ワークフロー完成後に実画面へ差し替える: assets/images/evidence/n8n-sns-automation.webp -->

## ローカルで確認する方法

ビルドは不要です。`index.html` をブラウザで開くか、任意の静的サーバーでルートを配信してください。

```sh
python3 -m http.server 8080
```

起動後、ブラウザで表示を確認します。

## 変更する場所

- 文章: 各HTMLファイルを直接編集します。
- 収益、目標、進捗: `assets/js/site-config.js` とトップページの表示文言を更新します。
- XのURL: `assets/js/site-config.js` の `X_URL` を変更します。
- 問い合わせフォーム: `assets/js/site-config.js` の `CONTACT_FORM_URL` に正式なGoogleフォームURLを設定しています。
- 店舗名やURL: `assets/js/site-config.js` の `restaurant` を変更し、必要に応じて記事本文へ反映します。

## Cloudflare Pagesへの公開

1. GitHubへこのフォルダをリポジトリとしてpushします。
2. Cloudflare PagesでGitHubリポジトリを接続します。
3. フレームワークプリセットは不要です。
4. ビルドコマンドは空欄、公開ディレクトリはルートを指定します。
5. 初回デプロイ後、表示とリンクを確認します。

## 公開URL

正式URLは `https://simken-ai-income-line.pages.dev/` です。`SITE_URL`、各HTMLのcanonical、OGP URL、`sitemap.xml`、`robots.txt` はこのURLに統一します。

## 記事を追加する方法

1. `articles/` に新しいHTMLを追加します。
2. `articles.html` にカードを追加します。
3. 関連記事リンクを必要な記事へ追加します。
4. `sitemap.xml` にURLを追加します。

## 公開前チェックリスト

- 全ページが開ける
- リンク切れがない
- スマホ幅で横スクロールがない
- ハンバーガーメニューが動く
- 記事一覧の絞り込みが動く
- JavaScript無効でも記事本文が読める
- sitemap.xmlに公開ページが含まれている
- 架空の実績や収益を書いていない
- 広告リンクを入れた記事にはPR表記を追加する
