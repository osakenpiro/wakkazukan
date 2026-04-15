# わっかずかん — ring-shaped dictionary

> メビウスの帯に綴じた百科辞典。迷えるけど、迷子にならない分類UI。

**Status**: 🧪 Open Beta · v46  
**Live**: [osakenpiro.github.io/wakkazukan/](https://osakenpiro.github.io/wakkazukan/)  
**Manual**: [osakenpiro.github.io/wakkazukan/manual.html](https://osakenpiro.github.io/wakkazukan/manual.html)

## これはなに

従来の辞典は A→Z の線分。表紙と裏表紙を綴じて輪にして、さらにひねると親と子の区別も消える。その構造をそのままUIにした、分類・ナビゲーション装置。

### 三つの新規性

FCA（形式概念分析）などの既存分類手法の上に、以下の3点を加える:

1. **分裂ルール** — 要素が追加されたとき集合が動的に割れる
2. **レンズリング** — 一度に見せるのは祖父母→自分→孫の3世代だけ（認知の基底状態 = 3）
3. **メビウス接続** — 辞典の環化＋表裏消失で、目的検索と漂流の境界が消える

## 二つのデータセット（β）

### 🎮 ポケモンずかん
カントー151匹 × 4プレパラート（タイプ / すみか / おおきさ / トレーナー）。イーブイ家の進化分岐（1→3）、ジムリーダー軸で原作再現。

### 🦠 いきものずかん
絵本『じこしょうかいシリーズ』の20キャラ × 3プレパラート（巻 / シーズン / ポジション）。Ch1〜Ch5が「きずな/まもり/ふたごころ/ちから/せんぱい」で横断マッチする4×5マトリクス。将来的に全17巻85キャラに拡張予定。

## 開発

```bash
npm install
npm run dev      # 開発サーバー
npm run build    # 本番ビルド → dist/
npm run preview  # 本番ビルドをローカル確認
```

### デプロイ

GitHub Pages で配信。`dist/` の中身を `docs/` にコピーして main に push。
Settings > Pages > Source: `main` / `docs` で有効化。

### 技術スタック

- React 18
- Vite 8（rolldown-vite）
- Single-file component（Wakkazukan.jsx）
- SVGベースの描画、ライブラリ依存なし

## フィードバック

β版です。気づいたこと何でも教えてください:

- 🐙 [GitHub Issues](https://github.com/osakenpiro/wakkazukan/issues/new/choose) — バグ・機能要望
- 📝 Google Form — 匿名OK（準備中）
- 💬 [X @osakenpiro](https://x.com/osakenpiro) — 即興の感想、`#わっかずかん` タグ

## ライセンス

**コード**: MIT  
**ドキュメント/デザイン**: CC-BY 4.0  
**ポケモンデータ**: 任天堂・ゲームフリーク・クリーチャーズの商標・著作物。本プロジェクトは非営利の研究・教育目的のファンプロジェクト。  
**いきものずかんデータ**: © Kenshiro Osada (osakenpiro), CC-BY 4.0

## 作者

**長田謙志郎 (Kenshiro Osada / osakenpiro)**  
[ORCID: 0009-0004-9167-3186](https://orcid.org/0009-0004-9167-3186)  
🪐 [osakenpiro.github.io](https://osakenpiro.github.io)
