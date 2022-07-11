# @suin/slack-times-feed

分報チャネルを見て回る手間を減らすためのSlackボットアプリケーションです。

各自の分報に発言があったとき、その発言を特定のフィードとなるチャネルにシェアします。

## インストール方法

### Slackアプリを作る

- [Your Apps](https://api.slack.com/apps/)の「Create New App」ボタンをクリック
- 「Create an app」ダイアログが開くので、「From scratch」を選ぶ。
- 「Name app & choose workspace」ダイアログが開くので、次のフィールドを埋める。
  - 「App Name」: 任意の名前。例: 分報フィード
  - 「Pick a workspace to develop your app in:」: あなたのワークスペース
- 「Create App」ボタンを押す。すると、アプリが作られ「Basic Information」ページが表示される。

### アプリの権限設定

- 「OAuth & Permissions」を開き、「Scopes」で「Bot Token Scopes」に下記の権限を付与する
  - channels:history
  - chat:write

### ボットの設定

- 「App Home」を開き、「Your App’s Presence in Slack」の次のフィールドを設定する
  - 「Add App Display Name」
    - 「Display Name (Bot Name)」: 任意の名前。例: 分報フィード
    - 「Default username」: 任意の名前。例: timesfeed

### アプリをワークスペースにインストールする

- 「Install App」を開き、「Install to Workspace」ボタンをクリックする。
- 「分報フィード が XXX ワークスペースにアクセスする権限をリクエストしています」と出るので、「許可する」ボタンを押す。
- すると、「Install App Settings」ページが表示され、そこに「Bot User OAuth Token」が表示されるので、その値をメモしておく。

### 分報フィードチャネルを作る

- Slackのアプリを開き、分報の発言を投稿するためのチャネルを作る
  - チャネル名は任意。例: times_feed
- そのチャネルに上で作ったボットユーザーを招待する
  - 上で設定したボット名(例: `@分報フィード`)でメンションすると招待できる。
- チャネルのIDを控える
  - チャネルのヘッダの「#times_feed ⌄」をクリックして「チャンネル情報」を表示する。
  - そこに「チャンネルID」が表示されているのでコピーして控えておく。
    - `C03XXXXXXX`のようなID

### このプログラムをVercelにデプロイする

このプログラムをVercelにデプロイしてください。

- Vercelの環境設定で下記の値をセットする
  - FEED_CHANNEL: 上で控えた「チャンネルID」。`C03XXXXXXX`のようなID
  - TOKEN: 上で控えた「Bot User OAuth Token」。`xoxb-12345678-...`のようなトークン

### ボットがメッセージを受信できるようにする

- 「Event Subscriptions」を開き、「Enable Events」を「On」にする。
- 「Request URL」にVercelのURLを入れる
  - `https://$project_name.vercel.app/api/postFeed`のようなURL

