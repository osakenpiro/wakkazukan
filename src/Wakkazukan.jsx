import { useState, useCallback, useMemo, useEffect, useRef } from "react";

/* ═══ Pokemon 151 — type colors / habitat / size ═══ */
var TC={"ノーマル":"#a8a878","ほのお":"#f08030","みず":"#6890f0","でんき":"#f8d030","くさ":"#78c850","こおり":"#98d8d8","かくとう":"#c03028","どく":"#a040a0","じめん":"#e0c068","ひこう":"#a890f0","エスパー":"#f85888","むし":"#a8b820","いわ":"#b8a038","ゴースト":"#705898","ドラゴン":"#7038f8"};
var TE={"ノーマル":"🐾","ほのお":"🔥","みず":"💧","でんき":"⚡","くさ":"🌿","こおり":"❄️","かくとう":"👊","どく":"☠️","じめん":"⛰️","ひこう":"🦅","エスパー":"🔮","むし":"🐛","いわ":"🪨","ゴースト":"👻","ドラゴン":"🐉"};
var TYPE_DESC={"ノーマル":"特別な属性を持たない、汎用的な仲間たち","ほのお":"炎を操る情熱の戦士たち","みず":"水中を自在に泳ぐ柔軟な存在","でんき":"電気をまとった俊敏な仲間","くさ":"光合成と植物の力を持つ仲間","こおり":"極寒の冷気を操る仲間","かくとう":"鍛えた肉体で戦う武術家","どく":"毒を持って身を守る用心深い仲間","じめん":"大地と一体化した力強い存在","ひこう":"空を支配する翼の持ち主","エスパー":"念力で物を動かす精神の使い手","むし":"小さくも進化が早い節足動物","いわ":"硬い岩石の体を持つ古代の仲間","ゴースト":"姿の見えない霊的な存在","ドラゴン":"伝説の力を秘めた古代竜"};

var HC={"そうげん":"#9bc53d","もり":"#2d6a4f","みずべ":"#48cae4","うみ":"#0077b6","どうくつ":"#52796f","やま":"#774936","まち":"#a8a8a8","レア":"#ffd700"};
var HE={"そうげん":"🌾","もり":"🌲","みずべ":"💦","うみ":"🌊","どうくつ":"🕳️","やま":"⛰️","まち":"🏙️","レア":"✨"};
var HAB_DESC={"そうげん":"草の生い茂る平原。日当たりがよく、多くの仲間が暮らす","もり":"木々に覆われた森。木陰で身を守る仲間が住む","みずべ":"川辺や池のほとり。水と陸の両方を行き来する仲間","うみ":"広い海。深海から浅瀬まで様々な仲間が泳ぐ","どうくつ":"日の差さない洞窟。岩と影を住処とする仲間","やま":"高くそびえる山岳地帯。寒さと崖に強い仲間","まち":"人の暮らす街。人と共に生きることを選んだ仲間","レア":"めったに出会えない伝説の存在。希少な力を秘める"};

var SC={"xs":"#f4a261","s":"#e76f51","m":"#2a9d8f","l":"#264653","xl":"#8338ec"};
var SE={"xs":"🤏","s":"🐭","m":"🐱","l":"🐺","xl":"🐘"};
var SZ_NAME={"xs":"ちっちゃい","s":"ちいさめ","m":"ふつう","l":"おおきめ","xl":"とんでもない"};
var SZ_DESC={"xs":"手のひらサイズ。小さくてもあなどれない","s":"小型犬くらいの仲間たち","m":"人と並ぶくらいの中型","l":"人より大きく頼もしい仲間","xl":"見上げるほど巨大な仲間たち"};

/* id, name, type, habitat, size, [emoji?] */
var DEFAULT_POKE_LIST = [
["p001","フシギダネ","くさ","そうげん","s","🌱"],["p002","フシギソウ","くさ","そうげん","m","🌿"],["p003","フシギバナ","くさ","そうげん","l","🌳"],
["p004","ヒトカゲ","ほのお","やま","s","🦎"],["p005","リザード","ほのお","やま","m","🔥"],["p006","リザードン","ほのお","やま","xl","🐲"],
["p007","ゼニガメ","みず","みずべ","s","🐢"],["p008","カメール","みず","みずべ","m","🐢"],["p009","カメックス","みず","みずべ","l","🐢"],
["p010","キャタピー","むし","もり","xs","🐛"],["p011","トランセル","むし","もり","s","🪲"],["p012","バタフリー","むし","もり","m","🦋"],
["p013","ビードル","むし","もり","xs","🐛"],["p014","コクーン","むし","もり","s","🪲"],["p015","スピアー","むし","もり","m","🐝"],
["p016","ポッポ","ノーマル","そうげん","s","🐦"],["p017","ピジョン","ノーマル","そうげん","m","🦅"],["p018","ピジョット","ノーマル","そうげん","l","🦅"],
["p019","コラッタ","ノーマル","まち","xs","🐀"],["p020","ラッタ","ノーマル","まち","s","🐀"],
["p021","オニスズメ","ノーマル","そうげん","xs","🐦"],["p022","オニドリル","ノーマル","そうげん","l","🦅"],
["p023","アーボ","どく","そうげん","m","🐍"],["p024","アーボック","どく","そうげん","l","🐍"],
["p025","ピカチュウ","でんき","もり","xs","⚡"],["p026","ライチュウ","でんき","もり","s","⚡"],
["p027","サンド","じめん","どうくつ","s","🦔"],["p028","サンドパン","じめん","どうくつ","m","🦔"],
["p029","ニドラン♀","どく","そうげん","xs","🐰"],["p030","ニドリーナ","どく","そうげん","s","🐰"],["p031","ニドクイン","どく","そうげん","l","👑"],
["p032","ニドラン♂","どく","そうげん","xs","🐰"],["p033","ニドリーノ","どく","そうげん","m","🐰"],["p034","ニドキング","どく","そうげん","l","👑"],
["p035","ピッピ","ノーマル","やま","s","🌟"],["p036","ピクシー","ノーマル","やま","m","🧚"],
["p037","ロコン","ほのお","そうげん","s","🦊"],["p038","キュウコン","ほのお","そうげん","m","🦊"],
["p039","プリン","ノーマル","そうげん","s","🎈"],["p040","プクリン","ノーマル","そうげん","m","🎈"],
["p041","ズバット","どく","どうくつ","s","🦇"],["p042","ゴルバット","どく","どうくつ","l","🦇"],
["p043","ナゾノクサ","くさ","そうげん","xs","🌱"],["p044","クサイハナ","くさ","そうげん","s","🌷"],["p045","ラフレシア","くさ","そうげん","m","🌺"],
["p046","パラス","むし","もり","xs","🍄"],["p047","パラセクト","むし","もり","m","🍄"],
["p048","コンパン","むし","もり","s","🐛"],["p049","モルフォン","むし","もり","m","🦋"],
["p050","ディグダ","じめん","どうくつ","xs","🌰"],["p051","ダグトリオ","じめん","どうくつ","m","🌰"],
["p052","ニャース","ノーマル","まち","s","🐱"],["p053","ペルシアン","ノーマル","まち","m","🐈"],
["p054","コダック","みず","みずべ","s","🦆"],["p055","ゴルダック","みず","みずべ","m","🦆"],
["p056","マンキー","かくとう","やま","s","🐵"],["p057","オコリザル","かくとう","やま","m","🦍"],
["p058","ガーディ","ほのお","まち","s","🐶"],["p059","ウインディ","ほのお","まち","l","🐕"],
["p060","ニョロモ","みず","みずべ","xs","🐸"],["p061","ニョロゾ","みず","みずべ","s","🐸"],["p062","ニョロボン","みず","みずべ","m","🐸"],
["p063","ケーシィ","エスパー","そうげん","s","🔮"],["p064","ユンゲラー","エスパー","そうげん","m","🥄"],["p065","フーディン","エスパー","そうげん","m","🧙"],
["p066","ワンリキー","かくとう","やま","s","💪"],["p067","ゴーリキー","かくとう","やま","m","💪"],["p068","カイリキー","かくとう","やま","l","💪"],
["p069","マダツボミ","くさ","もり","s","🌱"],["p070","ウツドン","くさ","もり","m","🪻"],["p071","ウツボット","くさ","もり","l","🪴"],
["p072","メノクラゲ","みず","うみ","m","🪼"],["p073","ドククラゲ","みず","うみ","l","🪼"],
["p074","イシツブテ","いわ","やま","xs","🪨"],["p075","ゴローン","いわ","やま","s","🪨"],["p076","ゴローニャ","いわ","やま","m","🗿"],
["p077","ポニータ","ほのお","そうげん","m","🐎"],["p078","ギャロップ","ほのお","そうげん","l","🐴"],
["p079","ヤドン","みず","みずべ","m","🦛"],["p080","ヤドラン","みず","みずべ","l","🦛"],
["p081","コイル","でんき","まち","s","🧲"],["p082","レアコイル","でんき","まち","m","🧲"],
["p083","カモネギ","ノーマル","そうげん","m","🦆"],
["p084","ドードー","ノーマル","そうげん","m","🦤"],["p085","ドードリオ","ノーマル","そうげん","l","🐦"],
["p086","パウワウ","みず","うみ","m","🦭"],["p087","ジュゴン","みず","うみ","l","🦭"],
["p088","ベトベター","どく","まち","m","🟣"],["p089","ベトベトン","どく","まち","l","🟪"],
["p090","シェルダー","みず","うみ","xs","🐚"],["p091","パルシェン","みず","うみ","s","🐚"],
["p092","ゴース","ゴースト","レア","m","👻"],["p093","ゴースト","ゴースト","レア","l","👻"],["p094","ゲンガー","ゴースト","レア","m","😈"],
["p095","イワーク","いわ","どうくつ","xl","🐍"],
["p096","スリープ","エスパー","そうげん","m","💤"],["p097","スリーパー","エスパー","そうげん","l","💤"],
["p098","クラブ","みず","みずべ","s","🦀"],["p099","キングラー","みず","みずべ","m","🦞"],
["p100","ビリリダマ","でんき","まち","s","⚪"],["p101","マルマイン","でんき","まち","m","⚫"],
["p102","タマタマ","くさ","もり","s","🥚"],["p103","ナッシー","くさ","もり","l","🌴"],
["p104","カラカラ","じめん","どうくつ","s","💀"],["p105","ガラガラ","じめん","どうくつ","m","🦴"],
["p106","サワムラー","かくとう","やま","l","🦵"],["p107","エビワラー","かくとう","やま","l","🥊"],
["p108","ベロリンガ","ノーマル","そうげん","m","👅"],
["p109","ドガース","どく","まち","s","💨"],["p110","マタドガス","どく","まち","m","☁️"],
["p111","サイホーン","じめん","やま","l","🦏"],["p112","サイドン","じめん","やま","l","🦏"],
["p113","ラッキー","ノーマル","レア","m","🥚"],
["p114","モンジャラ","くさ","もり","m","🪢"],
["p115","ガルーラ","ノーマル","そうげん","l","🦘"],
["p116","タッツー","みず","うみ","xs","🐉"],["p117","シードラ","みず","うみ","s","🐉"],
["p118","トサキント","みず","みずべ","s","🐠"],["p119","アズマオウ","みず","みずべ","m","🐠"],
["p120","ヒトデマン","みず","うみ","s","⭐"],["p121","スターミー","みず","うみ","m","🌟"],
["p122","バリヤード","エスパー","まち","m","🤡"],
["p123","ストライク","むし","もり","l","🦗"],
["p124","ルージュラ","こおり","レア","l","💋"],
["p125","エレブー","でんき","まち","m","⚡"],
["p126","ブーバー","ほのお","やま","m","🔥"],
["p127","カイロス","むし","もり","l","🪲"],
["p128","ケンタロス","ノーマル","そうげん","l","🐂"],
["p129","コイキング","みず","うみ","s","🐟"],["p130","ギャラドス","みず","うみ","xl","🐲"],
["p131","ラプラス","みず","うみ","xl","🦕"],
["p132","メタモン","ノーマル","レア","xs","🟪"],
["p133","イーブイ","ノーマル","まち","s","🦊"],["p134","シャワーズ","みず","まち","m","💧"],["p135","サンダース","でんき","まち","m","⚡"],["p136","ブースター","ほのお","まち","m","🔥"],
["p137","ポリゴン","ノーマル","レア","s","🔺"],
["p138","オムナイト","いわ","うみ","s","🐚"],["p139","オムスター","いわ","うみ","m","🐚"],
["p140","カブト","いわ","うみ","s","🦂"],["p141","カブトプス","いわ","うみ","m","🦂"],
["p142","プテラ","いわ","レア","xl","🦅"],
["p143","カビゴン","ノーマル","やま","xl","🐻"],
["p144","フリーザー","こおり","レア","xl","🦅"],["p145","サンダー","でんき","レア","xl","🦅"],["p146","ファイヤー","ほのお","レア","xl","🦅"],
["p147","ミニリュウ","ドラゴン","うみ","m","🐍"],["p148","ハクリュー","ドラゴン","うみ","l","🐉"],["p149","カイリュー","ドラゴン","うみ","xl","🐲"],
["p150","ミュウツー","エスパー","レア","xl","🧬"],["p151","ミュウ","エスパー","レア","xs","✨"],
];

/* ═══ Evolution families (gen1 Kanto) ═══ */
var EVO_FAMILIES = {
  fushigi:   {name:"フシギ家",     emoji:"🌱", members:["p001","p002","p003"]},
  hitokage:  {name:"ヒトカゲ家",   emoji:"🦎", members:["p004","p005","p006"]},
  zenigame:  {name:"ゼニガメ家",   emoji:"🐢", members:["p007","p008","p009"]},
  caterpie:  {name:"キャタピー家", emoji:"🐛", members:["p010","p011","p012"]},
  beedle:    {name:"ビードル家",   emoji:"🐝", members:["p013","p014","p015"]},
  poppo:     {name:"ポッポ家",     emoji:"🐦", members:["p016","p017","p018"]},
  koratta:   {name:"コラッタ家",   emoji:"🐀", members:["p019","p020"]},
  onisuzume: {name:"オニスズメ家", emoji:"🦅", members:["p021","p022"]},
  arbo:      {name:"アーボ家",     emoji:"🐍", members:["p023","p024"]},
  pikachu:   {name:"ピカチュウ家", emoji:"⚡", members:["p025","p026"]},
  sand:      {name:"サンド家",     emoji:"🦔", members:["p027","p028"]},
  nidof:     {name:"ニドラン♀家", emoji:"👑", members:["p029","p030","p031"]},
  nidom:     {name:"ニドラン♂家", emoji:"👑", members:["p032","p033","p034"]},
  pippi:     {name:"ピッピ家",     emoji:"🧚", members:["p035","p036"]},
  rokon:     {name:"ロコン家",     emoji:"🦊", members:["p037","p038"]},
  purin:     {name:"プリン家",     emoji:"🎈", members:["p039","p040"]},
  zubat:     {name:"ズバット家",   emoji:"🦇", members:["p041","p042"]},
  nazonokusa:{name:"ナゾノクサ家", emoji:"🌺", members:["p043","p044","p045"]},
  paras:     {name:"パラス家",     emoji:"🍄", members:["p046","p047"]},
  compan:    {name:"コンパン家",   emoji:"🦋", members:["p048","p049"]},
  digda:     {name:"ディグダ家",   emoji:"🌰", members:["p050","p051"]},
  nyarth:    {name:"ニャース家",   emoji:"🐱", members:["p052","p053"]},
  koduck:    {name:"コダック家",   emoji:"🦆", members:["p054","p055"]},
  mankey:    {name:"マンキー家",   emoji:"🐵", members:["p056","p057"]},
  gardie:    {name:"ガーディ家",   emoji:"🐕", members:["p058","p059"]},
  nyoromo:   {name:"ニョロモ家",   emoji:"🐸", members:["p060","p061","p062"]},
  casey:     {name:"ケーシィ家",   emoji:"🔮", members:["p063","p064","p065"]},
  wanriky:   {name:"ワンリキー家", emoji:"💪", members:["p066","p067","p068"]},
  madatsu:   {name:"マダツボミ家", emoji:"🪴", members:["p069","p070","p071"]},
  menokura:  {name:"メノクラゲ家", emoji:"🪼", members:["p072","p073"]},
  isitsu:    {name:"イシツブテ家", emoji:"🪨", members:["p074","p075","p076"]},
  ponita:    {name:"ポニータ家",   emoji:"🐎", members:["p077","p078"]},
  yadon:     {name:"ヤドン家",     emoji:"🦛", members:["p079","p080"]},
  coil:      {name:"コイル家",     emoji:"🧲", members:["p081","p082"]},
  dodo:      {name:"ドードー家",   emoji:"🦤", members:["p084","p085"]},
  pauwau:    {name:"パウワウ家",   emoji:"🦭", members:["p086","p087"]},
  betober:   {name:"ベトベター家", emoji:"🟣", members:["p088","p089"]},
  shellder:  {name:"シェルダー家", emoji:"🐚", members:["p090","p091"]},
  gusu:      {name:"ゴース家",     emoji:"👻", members:["p092","p093","p094"]},
  sleep:     {name:"スリープ家",   emoji:"💤", members:["p096","p097"]},
  crab:      {name:"クラブ家",     emoji:"🦀", members:["p098","p099"]},
  biririi:   {name:"ビリリダマ家", emoji:"⚪", members:["p100","p101"]},
  tamatama:  {name:"タマタマ家",   emoji:"🥚", members:["p102","p103"]},
  karakara:  {name:"カラカラ家",   emoji:"💀", members:["p104","p105"]},
  dogas:     {name:"ドガース家",   emoji:"💨", members:["p109","p110"]},
  saihorn:   {name:"サイホーン家", emoji:"🦏", members:["p111","p112"]},
  tattsu:    {name:"タッツー家",   emoji:"🐉", members:["p116","p117"]},
  tosakinto: {name:"トサキント家", emoji:"🐠", members:["p118","p119"]},
  hitodeman: {name:"ヒトデマン家", emoji:"⭐", members:["p120","p121"]},
  koiking:   {name:"コイキング家", emoji:"🐟", members:["p129","p130"]},
  eevee:     {name:"イーブイ家",   emoji:"🦊", members:["p133","p134","p135","p136"], branches:{"p133":["p134","p135","p136"]}},
  omnite:    {name:"オムナイト家", emoji:"🐚", members:["p138","p139"]},
  kabuto:    {name:"カブト家",     emoji:"🦂", members:["p140","p141"]},
  miniryu:   {name:"ミニリュウ家", emoji:"🐉", members:["p147","p148","p149"]},
};

// Build reverse index: pokemon id → {familyKey, order}
var EVO_INDEX = {};
Object.keys(EVO_FAMILIES).forEach(function(fk){
  EVO_FAMILIES[fk].members.forEach(function(id, i){
    EVO_INDEX[id] = {familyKey:fk, name:EVO_FAMILIES[fk].name, emoji:EVO_FAMILIES[fk].emoji, order:i+1, total:EVO_FAMILIES[fk].members.length};
  });
});

var TYPE_ORDER=["ノーマル","ほのお","みず","でんき","くさ","こおり","かくとう","どく","じめん","ひこう","エスパー","むし","いわ","ゴースト","ドラゴン"];
var HAB_ORDER=["そうげん","もり","みずべ","うみ","どうくつ","やま","まち","レア"];
var SZ_ORDER=["xs","s","m","l","xl"];

/* ═══ Trainer (gym leaders / E4) mapping — 原作準拠 (赤緑/FRLG + 一部HGSS) ═══ */
var TRAINERS = {
  // タケシ: 赤緑 イシツブテ・イワーク / FRLG/HGSS追加 サイホーン・イワーク・ゴローニャ・カブトプス
  "タケシ":   {ids:["p074","p075","p095","p111","p141"],color:"#8d6e63",emoji:"🪨",desc:"ニビシティのジムリーダー。岩タイプの使い手"},
  // カスミ: 赤緑 スターミー・ヒトデマン / HGSS追加 ゴルダック・ニョロボン・ヤドン
  "カスミ":   {ids:["p120","p121","p055","p062","p079"],color:"#1e88e5",emoji:"💧",desc:"ハナダシティのジムリーダー。水タイプの使い手"},
  // マチス: 赤緑 ピカチュウ・ライチュウ / FRLG追加 マルマイン・ビリリダマ
  "マチス":   {ids:["p026","p100","p101"],color:"#fdd835",emoji:"⚡",desc:"クチバシティのジムリーダー。電気タイプの使い手"},
  // エリカ: 赤緑 モンジャラ・ウツボット・ラフレシア / FRLG追加 クサイハナ・タマタマ
  "エリカ":   {ids:["p114","p071","p045","p044","p102"],color:"#43a047",emoji:"🌸",desc:"タマムシシティのジムリーダー。草タイプの使い手"},
  // キョウ: 赤緑 ベトベトン・モルフォン・ゴルバット / FRLG追加 マタドガス・アーボック
  "キョウ":   {ids:["p089","p049","p042","p110","p024"],color:"#8e24aa",emoji:"☠️",desc:"セキチクシティのジムリーダー。毒タイプの使い手"},
  // ナツメ: 赤緑 ケーシィ・ユンゲラー・フーディン / FRLG追加 スリーパー・バリヤード
  "ナツメ":   {ids:["p064","p065","p097","p122"],color:"#d81b60",emoji:"🔮",desc:"ヤマブキシティのジムリーダー。エスパータイプの使い手"},
  // カツラ: 赤緑 ポニータ・ウインディ・ギャロップ・ナッシー / FRLG追加 キュウコン・マグマラシ系なしなのでブーバー
  "カツラ":   {ids:["p077","p059","p078","p103","p038","p126"],color:"#ff5722",emoji:"🔥",desc:"グレンじまのジムリーダー。炎タイプの使い手"},
  // サカキ: 赤緑/FRLG ダグトリオ・ニドクイン・ニドキング・ガラガラ・サイホーン・ペルシアン
  "サカキ":   {ids:["p051","p031","p034","p105","p112","p053"],color:"#6d4c41",emoji:"⛰️",desc:"トキワシティのジムリーダー。地面タイプの使い手。ロケット団ボス"},
  // 四天王 カンナ: 赤緑 ジュゴン・ルージュラ・パルシェン・ラプラス
  "カンナ":   {ids:["p087","p124","p091","p131"],color:"#00acc1",emoji:"❄️",desc:"四天王の一人。氷タイプの使い手"},
  // 四天王 シバ: 赤緑 オコリザル・サワムラー・エビワラー・カイリキー
  "シバ":    {ids:["p057","p106","p107","p068"],color:"#bf360c",emoji:"👊",desc:"四天王の一人。格闘タイプの使い手"},
  // 四天王 キクコ: 赤緑 ゲンガー・ゴースト・アーボック・パルシェン / FRLG追加 ゴルバット
  "キクコ":   {ids:["p094","p093","p092"],color:"#4527a0",emoji:"👻",desc:"四天王の一人。ゴーストタイプの使い手"},
  // 四天王 ワタル: 赤緑 ギャラドス・プテラ・ハクリュー・カイリュー / HGSS追加 ミニリュウ
  "ワタル":   {ids:["p130","p142","p148","p149","p147"],color:"#3949ab",emoji:"🐉",desc:"四天王の一人でチャンピオン。ドラゴンタイプの使い手"},
  // ライバル(グリーン): 赤緑 最終戦 ピジョット・リザードン(or カメックス/フシギバナ)・フーディン・ナッシー・ギャロップ・ケンタロス
  "ライバル": {ids:["p018","p006","p009","p003","p065","p085","p128"],color:"#546e7a",emoji:"🎒",desc:"オーキド博士の孫。最終進化を揃えた宿敵"},
};
var TRAINER_ORDER = ["タケシ","カスミ","マチス","エリカ","キョウ","ナツメ","カツラ","サカキ","カンナ","シバ","キクコ","ワタル","ライバル"];

/* ═══ Build all derived data from a pokeList ═══ */
function buildAllData(pokeList){
  /* Build records and indexes */
  var P = {};
  pokeList.forEach(function(p,idx){
    var id=p[0],name=p[1],type=p[2],hab=p[3],sz=p[4],em=p[5]||TE[type];
    var dexNum = idx+1;
    var dexPadded = "#"+("000"+dexNum).slice(-3);
    var extraGems = p[6] || []; // imported extra gems
    var gems = [{name:name, emoji:em}];
    gems.push({name:dexPadded, emoji:"📖", type:"number", key:"dex", value:dexNum});
    var evo = EVO_INDEX[id];
    if (evo) {
      gems.push({name:evo.name+" "+evo.order+"/"+evo.total, emoji:"🔗", type:"dict", key:"evo_family", value:evo.familyKey, order:evo.order});
    }
    // append imported extras that aren't already present (by key)
    extraGems.forEach(function(g){
      if(!gems.some(function(existing){return existing.key===g.key;})){
        gems.push(g);
      }
    });
    P[id] = {id:id, name:name, emoji:em, color:TC[type]||"#888", desc:name+" — "+type+"タイプ・"+hab+"に住む"+(SZ_NAME[sz]||sz)+"の仲間", gems:gems, _t:type, _h:hab, _s:sz};
  });

  /* Group helper */
  function groupBy(key, order, labelMap, descMap, colorMap, emojiMap, rootId, rootName, rootEmoji, rootColor, rootDesc){
    var groups = {};
    pokeList.forEach(function(p){
      var k = p[key==="_t"?2:key==="_h"?3:4];
      if(!groups[k]) groups[k]=[];
      groups[k].push(P[p[0]]);
    });
    var children = order.filter(function(k){return groups[k]&&groups[k].length;}).map(function(k){
      return {id:rootId+"_"+k,name:labelMap?labelMap[k]:k,emoji:emojiMap[k],color:colorMap[k],desc:descMap[k],gems:[{name:labelMap?labelMap[k]:k,emoji:emojiMap[k]}],children:groups[k]};
    });
    // include any unknown categories too (from imports)
    var known = {};order.forEach(function(k){known[k]=true;});
    Object.keys(groups).forEach(function(k){
      if(!known[k]){
        children.push({id:rootId+"_"+k,name:k,emoji:"❓",color:"#888",desc:k+"（カスタム）",gems:[{name:k,emoji:"❓"}],children:groups[k]});
      }
    });
    return {id:rootId,name:rootName,emoji:rootEmoji,color:rootColor,desc:rootDesc,gems:[{name:rootName,emoji:rootEmoji}],children:children};
  }

  var TREE_TYPE = groupBy("_t", TYPE_ORDER, null, TYPE_DESC, TC, TE, "type", "タイプ図鑑", "🔬", "#118ab2", "ポケモンを15のタイプで分類した、もっとも基本的な見方");
  var TREE_HAB  = groupBy("_h", HAB_ORDER,  null, HAB_DESC,  HC, HE, "hab",  "すみか図鑑", "🗺️", "#06d6a0", "どこに住んでいるかで分類した地理的な見方");
  var TREE_SIZE = groupBy("_s", SZ_ORDER,   SZ_NAME, SZ_DESC, SC, SE, "size", "おおきさ図鑑", "📏", "#f77f00", "体の大きさで並べた、見た目重視の見方");

  function buildTrainerTree(){
    var used = {};
    var children = TRAINER_ORDER.map(function(tname){
      var t = TRAINERS[tname];
      var kids = t.ids.filter(function(id){return !!P[id];}).map(function(id){used[id]=true;return P[id];});
      return {id:"tr_"+tname,name:tname,emoji:t.emoji,color:t.color,desc:t.desc,gems:[{name:tname,emoji:t.emoji}],children:kids};
    });
    var wild = pokeList.filter(function(p){return !used[p[0]];}).map(function(p){return P[p[0]];});
    if(wild.length) children.push({id:"tr_wild",name:"やせい",emoji:"🌳",color:"#689f38",desc:"トレーナーに仕えないポケモンたち",gems:[{name:"やせい",emoji:"🌳"}],children:wild});
    return {id:"trroot",name:"トレーナー図鑑",emoji:"🎓",color:"#7b1fa2",desc:"カントー地方のジムリーダー・四天王・ライバルが実際に使うポケモンたち",gems:[{name:"トレーナー図鑑",emoji:"🎓"}],children:children};
  }
  var TREE_TRAINER = buildTrainerTree();

  var PREPARATES = [
    {id:"type",    name:"タイプ",     emoji:"🔬",color:"#118ab2",tree:TREE_TYPE},
    {id:"hab",     name:"すみか",     emoji:"🗺️",color:"#06d6a0",tree:TREE_HAB},
    {id:"size",    name:"おおきさ",   emoji:"📏",color:"#f77f00",tree:TREE_SIZE},
    {id:"trainer", name:"トレーナー", emoji:"🎓",color:"#7b1fa2",tree:TREE_TRAINER},
  ];

  return {P:P, PREPARATES:PREPARATES};
}

/* ═══════════════════════════════════════════════════════
   IKIMONO DATASET — 絵本17巻85キャラ（現在 vol1-4の20キャラ）
   ═══════════════════════════════════════════════════════ */

/* id, name, emoji, color, maki(巻), season, position(Ch役割), latin, subtitle, desc */
var DEFAULT_IKIMONO_LIST = [
  // ═ 第1巻 きん ═
  ["k01","サッちゃん","🍞","#e9b44c","きん","しぜん","きずな","Saccharomyces","いちばん ふるい しんゆう","パンとビールをつくる酵母。人類1万年の発酵のパートナー"],
  ["k02","ラクトさん","🫒","#9cc47c","きん","しぜん","まもり","Lactobacillus","おなかの まもりがみ","乳酸菌。ヨーグルトやぬか漬けをつくり、腸を守る"],
  ["k03","ペス太","💀","#6d4c41","きん","しぜん","ふたごころ","Yersinia pestis","世界を かえた さいやくの きん","ペスト菌。中世ヨーロッパの人口を1/3にした"],
  ["k04","テンネン","👾","#7b4a8a","きん","しぜん","ちから","Variola","人類が たおした さいしょの ラスボス","天然痘ウイルス。人類が根絶した唯一の感染症"],
  ["k05","ファージ先輩","🔬","#3a7ca5","きん","しぜん","せんぱい","Bacteriophage","細菌を たおす ウイルス","バクテリオファージ。地球上で最も多い生命体"],
  // ═ 第2巻 むし ═
  ["m01","キヌちゃん","🐛","#d4a574","むし","しぜん","きずな","Bombyx mori","もう ひとりでは いきられない","カイコ。人間に完全依存した家畜化昆虫。絹の原料"],
  ["m02","ハニーさん","🐝","#f0b000","むし","しぜん","まもり","Apis mellifera","しょくたくの まもりがみ","ミツバチ。受粉者として食卓の1/3を支える"],
  ["m03","ノミ吉","🦗","#8d4a2b","むし","しぜん","ふたごころ","Pulex irritans","しの はいたつにん","ノミ。ペスト菌の運び屋として歴史を動かした"],
  ["m04","ハマダラ","🦟","#5d4037","むし","しぜん","ちから","Anopheles","ちきゅうで いちばん 人を ころす いきもの","ハマダラカ。マラリア媒介で年間60万人以上の命を奪う"],
  ["m05","ゴキ先輩","🪳","#3e2723","むし","しぜん","せんぱい","Periplaneta americana","3億年の サバイバー","ゴキブリ。恐竜より古く、恐竜の絶滅を生き延びた"],
  // ═ 第3巻 けもの ═
  ["b01","ワンタ","🐕","#8d6e63","けもの","しぜん","きずな","Canis familiaris","いちばん さいしょの ともだち","イヌ。1万5千年前に最初に家畜化された動物"],
  ["b02","モーさん","🐄","#a1887f","けもの","しぜん","まもり","Bos taurus","ぶんめいの おかあさん","ウシ。乳・肉・労働力、農業文明の基盤"],
  ["b03","チュー太","🐀","#616161","けもの","しぜん","ふたごころ","Rattus norvegicus","にんげんの かげ","ドブネズミ。人の影のように都市についてきた"],
  ["b04","ハヤテ","🐎","#4e342e","けもの","しぜん","ちから","Equus caballus","世界を ひろげた エンジン","ウマ。人類のスピードを飛躍的に拡張した"],
  ["b05","ミケ先輩","🐈","#bf9b7a","けもの","しぜん","せんぱい","Felis catus","かってに きた、かってに いる","ネコ。自ら人に近づいた半家畜。今もマイペース"],
  // ═ 第4巻 くさき ═
  ["p01","ムギちゃん","🌾","#c9a24b","くさき","しぜん","きずな","Triticum aestivum","ぶんめいの たね","ムギ。定住と都市を生んだ最初の主要穀物"],
  ["p02","イネさん","🌿","#7cb342","くさき","しぜん","まもり","Oryza sativa","アジアの いのちづな","イネ。アジアの人口の半分を養う命綱"],
  ["p03","ドクニン","🥔","#8e6b3a","くさき","しぜん","ふたごころ","Solanum tuberosum","きぼうと ぜつぼうの いも","ジャガイモ。人類を救い、アイルランド飢饉も起こした"],
  ["p04","ワタ姫","☁️","#eceff1","くさき","しぜん","ちから","Gossypium","しろい はなの くらい かげ","ワタ。産業革命と奴隷制の両方の主役"],
  ["p05","トウガラ先輩","🌶️","#c62828","くさき","しぜん","せんぱい","Capsicum","いたいのに たべる、にんげんの ふしぎ","トウガラシ。「痛み=快楽」を生む唯一無二の植物"],
];

var MAKI_ORDER = ["きん","むし","けもの","くさき","はつめい","かみさま","げんし","ぞうき","そざい","ほし","だいち","しくみ","かず","きもち","ものがたり","げいじゅつ","いじん"];
var MAKI_EMOJI = {"きん":"🦠","むし":"🐛","けもの":"🐾","くさき":"🌿","はつめい":"💡","かみさま":"⛩️","げんし":"⚛️","ぞうき":"🫁","そざい":"🪨","ほし":"⭐","だいち":"🗺️","しくみ":"⚙️","かず":"🔢","きもち":"💭","ものがたり":"📖","げいじゅつ":"🎨","いじん":"👤"};
var MAKI_COLOR = {"きん":"#e9b44c","むし":"#8d6e63","けもの":"#a1887f","くさき":"#7cb342","はつめい":"#ff6f00","かみさま":"#7b4a8a","げんし":"#455a64","ぞうき":"#ec407a","そざい":"#78909c","ほし":"#3949ab","だいち":"#5d4037","しくみ":"#00897b","かず":"#546e7a","きもち":"#d81b60","ものがたり":"#6a1b9a","げいじゅつ":"#c0392b","いじん":"#b8860b"};
var MAKI_DESC = {"きん":"目に見えない1万年の友人と敵","むし":"地球最古の共存者たち","けもの":"人類と暮らす獣たち","くさき":"動かない戦略家たち","はつめい":"（COMING SOON）","かみさま":"（COMING SOON）","げんし":"（COMING SOON）","ぞうき":"（COMING SOON）","そざい":"（COMING SOON）","ほし":"（COMING SOON）","だいち":"（COMING SOON）","しくみ":"（COMING SOON）","かず":"（COMING SOON）","きもち":"（COMING SOON）","ものがたり":"（COMING SOON）","げいじゅつ":"（COMING SOON）","いじん":"（COMING SOON）"};

var SEASON_ORDER = ["しぜん","はつめいとからだ","うちゅうとだいち","しくみとちしき","にんげんのちから"];
var SEASON_EMOJI = {"しぜん":"🌱","はつめいとからだ":"💡","うちゅうとだいち":"🌌","しくみとちしき":"⚙️","にんげんのちから":"✊"};
var SEASON_COLOR = {"しぜん":"#7cb342","はつめいとからだ":"#ff6f00","うちゅうとだいち":"#3949ab","しくみとちしき":"#00897b","にんげんのちから":"#c0392b"};
var SEASON_DESC = {"しぜん":"生き物たちの巻（第1〜4巻）","はつめいとからだ":"人間の道具と体（第5・8巻）","うちゅうとだいち":"宇宙と物質と大地（第6・7・9・10・11巻）","しくみとちしき":"構造と数の世界（第12・13巻）","にんげんのちから":"心と文化と人物（第14〜17巻）"};

var POSITION_ORDER = ["きずな","まもり","ふたごころ","ちから","せんぱい"];
var POSITION_EMOJI = {"きずな":"🤝","まもり":"🛡️","ふたごころ":"🎭","ちから":"⚡","せんぱい":"🎓"};
var POSITION_COLOR = {"きずな":"#2196f3","まもり":"#4caf50","ふたごころ":"#9c27b0","ちから":"#f44336","せんぱい":"#ff9800"};
var POSITION_DESC = {"きずな":"人類とのはじまりの出会い（Ch1）","まもり":"命を支える守護者（Ch2）","ふたごころ":"光と影を併せ持つ両義的な存在（Ch3）","ちから":"歴史を動かすほどの威力（Ch4）","せんぱい":"謎と歴史の深みを持つ先輩格（Ch5）"};

function buildIkimonoData(records){
  var P = {};
  records.forEach(function(r, idx){
    var id=r[0],name=r[1],emoji=r[2],color=r[3],maki=r[4],season=r[5],pos=r[6],latin=r[7],subtitle=r[8],desc=r[9];
    var gems = [{name:name, emoji:emoji}];
    // Subtitle gem (the "— xxx" role tagline)
    if (subtitle) gems.push({name:subtitle, emoji:"💬", type:"dict", key:"subtitle", value:subtitle});
    // Latin name gem
    if (latin) gems.push({name:latin, emoji:"🔬", type:"dict", key:"latin", value:latin});
    // Maki gem
    gems.push({name:maki, emoji:MAKI_EMOJI[maki]||"📖", type:"dict", key:"maki", value:maki});
    // Position gem
    gems.push({name:pos, emoji:POSITION_EMOJI[pos]||"🏷️", type:"dict", key:"pos", value:pos});
    P[id] = {id:id, name:name, emoji:emoji, color:color, desc:desc, gems:gems, _maki:maki, _season:season, _pos:pos, _latin:latin, _subtitle:subtitle};
  });

  function groupByAxisIk(key, order, emojiMap, colorMap, descMap, rootId, rootName, rootEmoji, rootColor, rootDesc){
    var groups = {};
    records.forEach(function(r){
      var k = key==="_maki"?r[4] : key==="_season"?r[5] : r[6];
      if(!groups[k]) groups[k]=[];
      groups[k].push(P[r[0]]);
    });
    var children = order.filter(function(k){return groups[k]&&groups[k].length;}).map(function(k){
      return {id:rootId+"_"+k,name:k,emoji:emojiMap[k]||"📖",color:colorMap[k]||"#888",desc:descMap[k]||k,gems:[{name:k,emoji:emojiMap[k]||"📖"}],children:groups[k]};
    });
    // Placeholder "coming soon" chapters for maki axis only
    if (rootId === "maki") {
      order.forEach(function(k){
        if (!groups[k]) {
          children.push({id:rootId+"_"+k,name:k,emoji:emojiMap[k]||"📖",color:(colorMap[k]||"#888")+"66",desc:descMap[k],gems:[{name:k,emoji:emojiMap[k]||"📖"},{name:"COMING SOON",emoji:"⏳",type:"dict",key:"status",value:"coming_soon"}],children:[]});
        }
      });
    }
    return {id:rootId,name:rootName,emoji:rootEmoji,color:rootColor,desc:rootDesc,gems:[{name:rootName,emoji:rootEmoji}],children:children};
  }

  var TREE_MAKI     = groupByAxisIk("_maki",     MAKI_ORDER,     MAKI_EMOJI,     MAKI_COLOR,     MAKI_DESC,     "maki",     "巻ずかん",         "📖", "#c23b22", "絵本17巻の主カテゴリ。現在4巻分(20キャラ)が公開、13巻は準備中");
  var TREE_SEASON   = groupByAxisIk("_season",   SEASON_ORDER,   SEASON_EMOJI,   SEASON_COLOR,   SEASON_DESC,   "season",   "シーズンずかん",   "🌀", "#7b4a8a", "絵本17巻を5つのシーズンにまとめたメタ分類");
  var TREE_POSITION = groupByAxisIk("_pos",      POSITION_ORDER, POSITION_EMOJI, POSITION_COLOR, POSITION_DESC, "pos",      "ポジションずかん", "🎭", "#00897b", "各巻のCh1〜Ch5に対応する物語上の役割");

  var PREPARATES = [
    {id:"maki",     name:"巻",         emoji:"📖", color:"#c23b22", tree:TREE_MAKI},
    {id:"season",   name:"シーズン",   emoji:"🌀", color:"#7b4a8a", tree:TREE_SEASON},
    {id:"pos",      name:"ポジション", emoji:"🎭", color:"#00897b", tree:TREE_POSITION},
  ];

  return {P:P, PREPARATES:PREPARATES};
}

/* ═══ Dataset registry ═══ */
var DATASETS = {
  pokemon: {
    id:       "pokemon",
    name:     "ポケモンずかん",
    emoji:    "🎮",
    color:    "#e63946",
    desc:     "カントー地方151匹・タイプ/すみか/サイズ/トレーナーで分類",
    defaultData: null, // set below
    build:    null, // set below
    initialFocus: "type_くさ",
  },
  ikimono: {
    id:       "ikimono",
    name:     "いきものずかん",
    emoji:    "🦠",
    color:    "#7cb342",
    desc:     "絵本17巻85キャラ(現在20キャラ)・巻/シーズン/ポジションで分類",
    defaultData: DEFAULT_IKIMONO_LIST,
    build:    buildIkimonoData,
    initialFocus: "maki_きん",
  },
};
// Assign after DEFAULT_POKE_LIST is in scope
DATASETS.pokemon.defaultData = DEFAULT_POKE_LIST;
DATASETS.pokemon.build = buildAllData;
var DATASET_ORDER = ["pokemon","ikimono"];

/* ═══ CSV utilities ═══ */
function csvEscape(s){
  if(s==null) return "";
  s = String(s);
  if(/[,"\n\r]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
  return s;
}
function csvParse(text){
  // Strip BOM
  if(text.charCodeAt(0)===0xFEFF) text = text.slice(1);
  var rows=[], row=[], cur="", inQ=false, i=0, L=text.length;
  while(i<L){
    var c=text[i];
    if(inQ){
      if(c==='"'){
        if(text[i+1]==='"'){cur+='"';i+=2;continue;}
        inQ=false;i++;continue;
      }
      cur+=c;i++;continue;
    }
    if(c==='"'){inQ=true;i++;continue;}
    if(c===','){row.push(cur);cur="";i++;continue;}
    if(c==='\r'){i++;continue;}
    if(c==='\n'){row.push(cur);rows.push(row);row=[];cur="";i++;continue;}
    cur+=c;i++;
  }
  if(cur.length||row.length){row.push(cur);rows.push(row);}
  return rows.filter(function(r){return r.length>1||(r.length===1&&r[0]!=="");});
}
// Serialize extra gems (anything beyond the primary name+dex+evo_family core) to "key:value" pairs
function serializeGemsExtended(gems){
  if(!gems) return "";
  var parts = [];
  gems.forEach(function(g){
    if(!g.key) return; // skip primary name gem
    if(g.key==="dex"||g.key==="evo_family") return; // auto-derived, skip
    if(g.type==="number") parts.push(g.key+":"+g.value);
    else if(g.type==="dict") parts.push(g.key+":"+g.value+(g.order?"@"+g.order:""));
    else parts.push(g.key+":"+(g.value!=null?g.value:g.name));
  });
  return parts.join(";");
}
function parseGemsExtended(s){
  if(!s) return [];
  return s.split(";").filter(function(x){return x.trim();}).map(function(part){
    var m = part.match(/^([^:]+):(.+)$/);
    if(!m) return null;
    var key=m[1].trim(), val=m[2].trim();
    var om = val.match(/^(.+)@(\d+)$/);
    if(om){
      return {name:key+":"+om[1], emoji:"🏷️", type:"dict", key:key, value:om[1], order:parseInt(om[2],10)};
    }
    if(/^-?\d+(\.\d+)?$/.test(val)){
      return {name:key+":"+val, emoji:"🔢", type:"number", key:key, value:parseFloat(val)};
    }
    return {name:key+":"+val, emoji:"🏷️", type:"dict", key:key, value:val};
  }).filter(Boolean);
}
// Export a prep's leaves to CSV. prepId determines which field → category column.
function exportPrepCSV(prepId, pokeList, P, PREPARATES){
  var header = ["id","category","name","emoji","desc","gems_extended"];
  var lines = [header.join(",")];
  // For trainer: gather via TRAINERS reverse map
  if(prepId==="trainer"){
    var rev = {};
    Object.keys(TRAINERS).forEach(function(tn){TRAINERS[tn].ids.forEach(function(id){if(!rev[id])rev[id]=tn;});});
    pokeList.forEach(function(p){
      var id=p[0], rec=P[id]; if(!rec) return;
      var cat = rev[id] || "やせい";
      lines.push([csvEscape(id),csvEscape(cat),csvEscape(rec.name),csvEscape(rec.emoji),csvEscape(rec.desc),csvEscape(serializeGemsExtended(rec.gems))].join(","));
    });
  } else {
    var catIdx = prepId==="type"?2 : prepId==="hab"?3 : prepId==="size"?4 : 2;
    pokeList.forEach(function(p){
      var id=p[0], rec=P[id]; if(!rec) return;
      var cat = p[catIdx];
      var name = p[1];
      var emoji = p[5]||rec.emoji;
      lines.push([csvEscape(id),csvEscape(cat),csvEscape(name),csvEscape(emoji),csvEscape(rec.desc),csvEscape(serializeGemsExtended(rec.gems))].join(","));
    });
  }
  return "\uFEFF"+lines.join("\r\n")+"\r\n"; // BOM + CRLF
}
// Import a CSV for a given prep. Returns a new pokeList (for non-trainer preps) or throws for trainer.
function importPrepCSV(text, prepId, currentPokeList){
  var rows = csvParse(text);
  if(rows.length<2) throw new Error("CSVが空です");
  var header = rows[0].map(function(h){return h.trim();});
  var idCol = header.indexOf("id");
  var catCol = header.indexOf("category");
  var nameCol = header.indexOf("name");
  var emojiCol = header.indexOf("emoji");
  var gemsCol = header.indexOf("gems_extended");
  if(idCol<0) throw new Error("id列が必要です");
  if(prepId==="trainer") throw new Error("トレーナー図鑑のインポートはv1では未対応。TRAINERS定義を直接編集してください");
  var catIdx = prepId==="type"?2 : prepId==="hab"?3 : prepId==="size"?4 : -1;
  if(catIdx<0) throw new Error("未知のプレパラート: "+prepId);
  // Build map id → row
  var updates = {};
  var extraGemsMap = {};
  for(var r=1;r<rows.length;r++){
    var row = rows[r];
    if(!row[idCol]) continue;
    var id = row[idCol].trim();
    updates[id] = {
      category: catCol>=0?row[catCol]:null,
      name:     nameCol>=0?row[nameCol]:null,
      emoji:    emojiCol>=0?row[emojiCol]:null,
    };
    if(gemsCol>=0 && row[gemsCol]){
      extraGemsMap[id] = parseGemsExtended(row[gemsCol]);
    }
  }
  // Produce new pokeList: clone and patch
  var newList = currentPokeList.map(function(p){
    var id = p[0];
    var copy = p.slice();
    var u = updates[id];
    if(u){
      if(u.name) copy[1] = u.name;
      if(u.category) copy[catIdx] = u.category;
      if(u.emoji) copy[5] = u.emoji;
    }
    if(extraGemsMap[id]) copy[6] = extraGemsMap[id];
    else if(copy[6]===undefined) copy[6] = undefined;
    return copy;
  });
  return newList;
}


/* ═══ Utils ═══ */
function findNode(t,id){if(t.id===id)return t;if(t.children)for(var i=0;i<t.children.length;i++){var f=findNode(t.children[i],id);if(f)return f;}return null;}
function getAncestors(t,id,trail){if(!trail)trail=[];if(t.id===id)return trail.concat([t]);if(t.children)for(var i=0;i<t.children.length;i++){var r=getAncestors(t.children[i],id,trail.concat([t]));if(r)return r;}return null;}
function getParent(t,id){if(t.children)for(var i=0;i<t.children.length;i++){if(t.children[i].id===id)return t;var r=getParent(t.children[i],id);if(r)return r;}return null;}
function countDesc(n){if(!n.children)return 1;var s=0;for(var i=0;i<n.children.length;i++)s+=countDesc(n.children[i]);return s;}
function collectLeafIds(n){if(!n.children||!n.children.length)return[n.id];var ids=[];for(var i=0;i<n.children.length;i++)ids=ids.concat(collectLeafIds(n.children[i]));return ids;}
function findRecordParent(tree,rid){if(tree.children)for(var i=0;i<tree.children.length;i++){var c=tree.children[i];if(c.id===rid)return tree;var r=findRecordParent(c,rid);if(r)return r;}return null;}
function resolveInTree(tree,id){var n=findNode(tree,id);if(n)return n;var rp=findRecordParent(tree,id);return rp||tree;}

/* ═══ Packing ═══ */
function packInCircle(n,pR,resTop){if(n===0)return{r:0,positions:[]};var usR=pR-4,gap=3,lo=2,hi=usR*0.45,bR=lo,bP=[];for(var it=0;it<30;it++){var mid=(lo+hi)/2,oR=usR-mid-2,offY=resTop*0.3,ok=true,pos=[];for(var i=0;i<n;i++){var a=(2*Math.PI*i)/n-Math.PI/2,x=oR*Math.cos(a),y=offY+oR*Math.sin(a)*0.85;if(Math.sqrt(x*x+y*y)+mid>usR){ok=false;break;}for(var j=0;j<pos.length;j++){if(Math.sqrt(Math.pow(pos[j].x-x,2)+Math.pow(pos[j].y-y,2))<mid*2+gap){ok=false;break;}}if(!ok)break;pos.push({x:x,y:y});}if(ok){bR=mid;bP=pos;lo=mid;}else hi=mid;}return{r:bR,positions:bP};}
function weightedPack(children,aW,aH,padT){if(!children.length)return[];var uH=aH-padT,gap=14,ws=[],tW=0;for(var i=0;i<children.length;i++){var w=countDesc(children[i]);ws.push(w);tW+=w;}
  // Fill fraction: fewer children → larger fill (breathing room shrinks)
  var n=children.length;
  var fillFrac = n<=2?0.82 : n<=4?0.72 : n<=6?0.62 : n<=10?0.55 : 0.50;
  var maxCapFrac = n<=2?0.55 : n<=4?0.48 : 0.42;
  var tA=aW*uH*fillFrac;
  var cap=ws.map(function(w){return Math.max(22,Math.min(Math.min(aW,uH)*maxCapFrac,Math.sqrt(tA*(w/tW)/Math.PI)));});
  var tR=0;for(var i2=0;i2<cap.length;i2++)tR+=cap[i2];var cx=aW/2,cy=padT+uH/2,oR=Math.min(aW,uH)*(n<=2?0.12:n<=4?0.24:0.30);var pos=[],curA=-Math.PI/2;for(var i3=0;i3<children.length;i3++){var s=(2*Math.PI*cap[i3])/tR,a2=curA+s/2;pos.push({x:cx+oR*Math.cos(a2),y:cy+oR*Math.sin(a2),r:cap[i3]});curA+=s;}for(var it2=0;it2<80;it2++){for(var ii=0;ii<pos.length;ii++){for(var jj=ii+1;jj<pos.length;jj++){var dx=pos[jj].x-pos[ii].x,dy=pos[jj].y-pos[ii].y,d=Math.sqrt(dx*dx+dy*dy)||1,md=pos[ii].r+pos[jj].r+gap;if(d<md){var p=(md-d)/2*0.3,nx=dx/d,ny=dy/d;pos[ii].x-=nx*p;pos[ii].y-=ny*p;pos[jj].x+=nx*p;pos[jj].y+=ny*p;}}pos[ii].x+=(cx-pos[ii].x)*0.02;pos[ii].y+=(cy-pos[ii].y)*0.02;var rr=pos[ii].r;pos[ii].x=Math.max(rr+4,Math.min(aW-rr-4,pos[ii].x));pos[ii].y=Math.max(padT+rr+4,Math.min(padT+uH-rr-4,pos[ii].y));}}return pos;}

/* ═══ GemTabs ═══ */
function StackedGems(props){
  var x=props.x,y=props.y,gems=props.gems,color=props.color,active=props.active,fs=props.fs||10,align=props.align;
  var maxSec = props.maxSecondary != null ? props.maxSecondary : 99;
  if(!gems||!gems.length)return null;

  // Proper width estimator
  function estW(s, size) {
    var w = 0;
    for (var i=0; i<s.length; i++) {
      var cc = s.charCodeAt(i);
      if (cc >= 0x3000) w += size*1.0;
      else if (cc >= 0x2000) w += size*1.1;
      else w += size*0.55;
    }
    return w;
  }

  // Render each gem based on its type
  // - text (default): emoji + name pill
  // - number: compact pill with value (e.g. "#001")
  // - dict: compact pill with name (e.g. "フシギ家 1/3")
  var priFs = fs;
  var secFs = Math.max(8, Math.round(fs*0.75));
  var gap = 4;
  var secPad = 5;
  var priPad = 7;

  // Compute primary gem width
  var pri = gems[0];
  var priLabel = pri.emoji+" "+pri.name;
  var priW = estW(priLabel, priFs) + priPad*2;
  var priH = priFs + 6;

  // Secondary gems: limited by maxSec prop
  var secondaries = gems.slice(1, 1+maxSec);
  var secChips = secondaries.map(function(g){
    var lbl = (g.emoji || "") + (g.emoji ? " " : "") + g.name;
    var w = estW(lbl, secFs) + secPad*2;
    return {gem:g, label:lbl, w:w, h:secFs+4};
  });

  // Total row width (primary + secondary chips)
  var totalW = priW;
  secChips.forEach(function(c){ totalW += gap + c.w; });

  var baseX = align==="left" ? x : x - totalW/2;

  return <g>
    {/* Primary pill */}
    <rect x={baseX} y={y} width={priW} height={priH} rx={3} ry={3} fill={active?color:"#0b0b1c"} stroke={color} strokeWidth={active?1.5:0.8}/>
    <text x={baseX+priW/2} y={y+priH/2+1} textAnchor="middle" dominantBaseline="central" fill={active?"#080810":color} fontSize={priFs} fontWeight={active?700:600} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{priLabel}</text>

    {/* Secondary typed sub-tag chips */}
    {secChips.map(function(c,i){
      var cx = baseX + priW + gap;
      for (var k=0; k<i; k++) cx += secChips[k].w + gap;
      var cy = y + (priH - c.h)/2;
      // Different styling per gem type
      var gType = c.gem.type || "text";
      var chipFill, chipStroke, textColor;
      if (gType === "number") {
        chipFill = color+"22"; chipStroke = color+"66"; textColor = color;
      } else if (gType === "dict") {
        chipFill = "#ffffff12"; chipStroke = color+"55"; textColor = color+"dd";
      } else {
        chipFill = "transparent"; chipStroke = color+"44"; textColor = color+"aa";
      }
      return <g key={"sec"+i}>
        <rect x={cx} y={cy} width={c.w} height={c.h} rx={c.h/2} ry={c.h/2} fill={chipFill} stroke={chipStroke} strokeWidth={0.8}/>
        <text x={cx+c.w/2} y={cy+c.h/2+1} textAnchor="middle" dominantBaseline="central" fill={textColor} fontSize={secFs} fontWeight={500} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{c.label}</text>
      </g>;
    })}
  </g>;
}

/* ═══ BDot ═══ */
function BDot(props){var gx=props.cx,gy=props.cy,r=props.r,color=props.color,emoji=props.emoji,gems=props.gems,fontSize=props.fontSize,onClick=props.onClick,highlight=props.highlight;var hov=useState(false),h=hov[0],setH=hov[1];var label=gems&&gems[0]?gems[0].name:"";var tipW=Math.max(label.length*7+18,44);return <g onMouseEnter={function(){setH(true);}} onMouseLeave={function(){setH(false);}} style={{cursor:onClick?"pointer":"default"}} onClick={onClick?function(e){e.stopPropagation();onClick();}:undefined}><circle cx={gx} cy={gy} r={r} fill={color+(highlight?"55":"20")} stroke={highlight?"#ffd700":color+(h?"aa":"44")} strokeWidth={highlight?2.5:(h?1.5:0.8)} style={{mixBlendMode:"screen"}}/>{highlight&&<circle cx={gx} cy={gy} r={r+3} fill="none" stroke="#ffd70044" strokeWidth={1.5} style={{mixBlendMode:"screen"}}/>}<text x={gx} y={gy+1} textAnchor="middle" dominantBaseline="central" fontSize={fontSize} style={{pointerEvents:"none"}}>{emoji}</text>{h&&label?<g><rect x={gx-tipW/2} y={gy-r-20} width={tipW} height={18} rx={3} ry={3} fill="#1a1a2eee" stroke={color+"66"} strokeWidth={0.8}/><text x={gx} y={gy-r-11} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={8} fontWeight={600} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{emoji} {label}</text></g>:null}</g>;}

/* ═══ BouncyGC ═══ */
function BouncyGC(props){var gcs=props.items,pcx=props.cx,pcy=props.cy,pR=props.parentR,pCol=props.color,sharedIds=props.sharedIds;var n=gcs.length,resTop=pR*0.25;var pk=useMemo(function(){return packInCircle(n,pR,resTop);},[n,pR]);var gcR=pk.r,bound=pR-gcR-3;var stRef=useRef(null),tickState=useState(0),setTick=tickState[1];if(!stRef.current||stRef.current.length!==n)stRef.current=pk.positions.map(function(p){var a=Math.random()*Math.PI*2;return{x:p.x,y:p.y,vx:Math.cos(a)*0.15,vy:Math.sin(a)*0.15};});var frRef=useRef(null);useEffect(function(){if(n===0||gcR<3)return;var run=true,fc=0;function step(){if(!run)return;var st=stRef.current;for(var i=0;i<st.length;i++){var o=st[i],x=o.x+o.vx,y=o.y+o.vy,vx=o.vx,vy=o.vy;var na=Math.random()*Math.PI*2;vx+=Math.cos(na)*0.008;vy+=Math.sin(na)*0.008;vx*=0.998;vy*=0.998;var spd=Math.sqrt(vx*vx+vy*vy);if(spd>0.4){vx=vx/spd*0.4;vy=vy/spd*0.4;}if(spd<0.06){var ba=Math.random()*Math.PI*2;vx=Math.cos(ba)*0.08;vy=Math.sin(ba)*0.08;}var dist=Math.sqrt(x*x+y*y);if(dist>bound){var nx=x/dist,ny=y/dist;x=nx*bound*0.97;y=ny*bound*0.97;var dot=vx*nx+vy*ny;vx-=2*dot*nx;vy-=2*dot*ny;vx*=0.8;vy*=0.8;}st[i]={x:x,y:y,vx:vx,vy:vy};}for(var i2=0;i2<st.length;i2++)for(var j=i2+1;j<st.length;j++){var dx=st[j].x-st[i2].x,dy=st[j].y-st[i2].y,d=Math.sqrt(dx*dx+dy*dy)||0.1,minD=gcR*2+2;if(d<minD){var ol=(minD-d)/2,nnx=dx/d,nny=dy/d;st[i2].x-=nnx*ol;st[i2].y-=nny*ol;st[j].x+=nnx*ol;st[j].y+=nny*ol;var rv=(st[i2].vx-st[j].vx)*nnx+(st[i2].vy-st[j].vy)*nny;if(rv>0){st[i2].vx-=rv*nnx*0.8;st[i2].vy-=rv*nny*0.8;st[j].vx+=rv*nnx*0.8;st[j].vy+=rv*nny*0.8;}}}fc++;if(fc%2===0)setTick(function(t){return t+1;});frRef.current=requestAnimationFrame(step);}frRef.current=requestAnimationFrame(step);return function(){run=false;cancelAnimationFrame(frRef.current);};},[n,gcR,pR,bound]);var gcFs=Math.max(9,Math.min(16,gcR*0.7)),st=stRef.current||[];return <g>{gcs.map(function(gc,i){var p=st[i];if(!p)return null;var c=gc.color||pCol,isS=sharedIds&&sharedIds.indexOf(gc.id)>=0;return <circle key={gc.id+"-a"} cx={pcx+p.x} cy={pcy+p.y} r={gcR} fill={c+(isS?"44":"20")} stroke={isS?"#ffd70066":"none"} strokeWidth={isS?1.5:0} style={{mixBlendMode:"screen"}}/>;})}{gcs.map(function(gc,i){var p=st[i];if(!p)return null;var isS=sharedIds&&sharedIds.indexOf(gc.id)>=0;return <BDot key={gc.id} cx={pcx+p.x} cy={pcy+p.y} r={gcR} color={gc.color||pCol} emoji={gc.emoji} gems={gc.gems} fontSize={gcFs} highlight={isS}/>;})}</g>;}

/* ═══ BouncyRect ═══ */
function BouncyRect(props){var items=props.items,aW=props.areaW,aH=props.areaH,oX=props.offsetX,oY=props.offsetY,iR=props.itemR,go=props.go,sharedIds=props.sharedIds;var n=items.length,stRef=useRef(null),tickState=useState(0),setTick=tickState[1];if(!stRef.current||stRef.current.length!==n)stRef.current=items.map(function(){var a=Math.random()*Math.PI*2;return{x:aW*0.2+Math.random()*aW*0.6,y:aH*0.2+Math.random()*aH*0.6,vx:Math.cos(a)*0.15,vy:Math.sin(a)*0.15};});var frRef=useRef(null);useEffect(function(){if(n===0)return;var run=true,fc=0;function step(){if(!run)return;var st=stRef.current;for(var i=0;i<st.length;i++){var o=st[i],x=o.x+o.vx,y=o.y+o.vy,vx=o.vx,vy=o.vy;var na=Math.random()*Math.PI*2;vx+=Math.cos(na)*0.01;vy+=Math.sin(na)*0.01;vx*=0.997;vy*=0.997;var spd=Math.sqrt(vx*vx+vy*vy);if(spd>0.45){vx=vx/spd*0.45;vy=vy/spd*0.45;}if(spd<0.07){var ba=Math.random()*Math.PI*2;vx=Math.cos(ba)*0.1;vy=Math.sin(ba)*0.1;}if(x<iR){x=iR;vx=Math.abs(vx)*0.8;}if(x>aW-iR){x=aW-iR;vx=-Math.abs(vx)*0.8;}if(y<iR){y=iR;vy=Math.abs(vy)*0.8;}if(y>aH-iR){y=aH-iR;vy=-Math.abs(vy)*0.8;}st[i]={x:x,y:y,vx:vx,vy:vy};}for(var i2=0;i2<st.length;i2++)for(var j=i2+1;j<st.length;j++){var dx=st[j].x-st[i2].x,dy=st[j].y-st[i2].y,d=Math.sqrt(dx*dx+dy*dy)||0.1,minD=iR*2+3;if(d<minD){var ol=(minD-d)/2,nx=dx/d,ny=dy/d;st[i2].x-=nx*ol;st[i2].y-=ny*ol;st[j].x+=nx*ol;st[j].y+=ny*ol;var rv=(st[i2].vx-st[j].vx)*nx+(st[i2].vy-st[j].vy)*ny;if(rv>0){st[i2].vx-=rv*nx*0.7;st[i2].vy-=rv*ny*0.7;st[j].vx+=rv*nx*0.7;st[j].vy+=rv*ny*0.7;}}}fc++;if(fc%2===0)setTick(function(t){return t+1;});frRef.current=requestAnimationFrame(step);}frRef.current=requestAnimationFrame(step);return function(){run=false;cancelAnimationFrame(frRef.current);};},[n,iR,aW,aH]);var st=stRef.current||[],fs=Math.max(10,Math.min(20,iR*0.6));return <g>{items.map(function(item,i){var p=st[i];if(!p)return null;var isS=sharedIds&&sharedIds.indexOf(item.id)>=0;return <BDot key={item.id} cx={oX+p.x} cy={oY+p.y} r={iR} color={item.color||"#888"} emoji={item.emoji} gems={item.gems} fontSize={fs} onClick={function(){go(item.id,"in");}} highlight={isS}/>;})}</g>;}

/* ═══ ChildRing ═══ */
function ChildRing(props){var child=props.child,ccx=props.ccx,ccy=props.ccy,cr=props.cr,go=props.go,sharedIds=props.sharedIds;var hovState=useState(false),hov=hovState[0],setHov=hovState[1];var c=child.color||"#888",hasGC=child.children&&child.children.length>0;var cFs=Math.max(8,Math.min(12,cr*0.11));return <g onMouseEnter={function(){setHov(true);}} onMouseLeave={function(){setHov(false);}}><circle cx={ccx} cy={ccy} r={cr} fill={c+"12"} stroke={c+(hov?"88":"55")} strokeWidth={hov?2:1.5} style={{cursor:"pointer",transition:"stroke-width .2s"}} onClick={function(e){e.stopPropagation();go(child.id,"in");}}/><StackedGems x={ccx} y={ccy-cr+4} gems={child.gems} color={c} active={false} fs={cFs} align="center" maxSecondary={0}/>{hasGC&&<BouncyGC items={child.children} cx={ccx} cy={ccy} parentR={cr} color={c} sharedIds={sharedIds}/>}{hasGC&&<text x={ccx} y={ccy+cr-7} textAnchor="middle" fontSize={7} fill={c+"55"} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{child.children.length}体</text>}</g>;}

/* ═══ RingDots ═══ */
function RingDots(props){var total=props.total,current=props.current,x=props.x,y=props.y,color=props.color,colors=props.colors;if(total<=1)return null;var dotR=2.5,gap=8,items=[];for(var i=0;i<total;i++)items.push(i);var tw=total*dotR*2+(total-1)*gap,sx=x-tw/2;return <g>{items.map(function(i2){var dx=sx+i2*(dotR*2+gap)+dotR,isCur=i2===current;var c=colors&&colors[i2]?colors[i2]:color;return <circle key={i2} cx={dx} cy={y} r={isCur?3.5:dotR} fill={isCur?c:c+"55"} stroke={isCur?c:"none"} strokeWidth={isCur?1:0}/>;})}</g>;}

/* ═══ Inline breadcrumbs inside focus rect ═══ */
function InlineBreadcrumbs(props) {
  var ancestors = props.ancestors, onFocus = props.onFocus, x = props.x, y = props.y, maxW = props.maxW;
  var fs = props.fs || 11;
  var sepW = 14;
  var padX = 6;
  // Proper width estimate by char type
  function estW(label) {
    var w = 0;
    for (var i=0; i<label.length; i++) {
      var cc = label.charCodeAt(i);
      if (cc >= 0x3000) w += fs*1.0;       // CJK full-width
      else if (cc >= 0x2000) w += fs*1.15;  // emoji approx
      else w += fs*0.55;                    // ASCII
    }
    return w;
  }
  // Build items with widths
  function buildParts(items, hasEllipsis) {
    var parts = [];
    var cx = 0;
    if (hasEllipsis) { parts.push({type:"ellipsis",x:cx,w:14}); cx += 14 + sepW; }
    items.forEach(function (a, i) {
      var label = a.emoji + " " + a.name;
      var w = estW(label) + padX*2;
      if (i > 0 || hasEllipsis) { cx += (i===0 && hasEllipsis) ? 0 : sepW; }
      parts.push({ node: a, x: cx, w: w, isLast: i === items.length - 1 });
      cx += w;
    });
    return {parts:parts, totalW:cx};
  }
  var built = buildParts(ancestors, false);
  // If too wide, keep last 3 with ellipsis
  if (built.totalW > maxW && ancestors.length > 3) {
    built = buildParts(ancestors.slice(-3), true);
    // Still too wide? keep last 2
    if (built.totalW > maxW && ancestors.length >= 2) {
      built = buildParts(ancestors.slice(-2), true);
    }
  }
  var parts = built.parts;
  return <g>
    {parts.map(function (p, i) {
      var px = x + p.x;
      if (p.type === "ellipsis") {
        return <text key={"e"+i} x={px} y={y} fontSize={fs} fill="#ffffff66" dominantBaseline="central" style={{pointerEvents:"none"}}>…</text>;
      }
      var c = p.node.color || "#888";
      var label = p.node.emoji + " " + p.node.name;
      var prevIsEllipsis = i > 0 && parts[i-1].type === "ellipsis";
      var showSep = i > 0;
      return <g key={p.node.id}>
        {showSep && <text x={px - sepW/2} y={y} fontSize={fs+1} fill="#ffffff55" dominantBaseline="central" textAnchor="middle" fontWeight="bold" style={{pointerEvents:"none"}}>›</text>}
        <g style={{cursor:"pointer"}} onClick={function(e){e.stopPropagation();onFocus(p.node.id,"out");}}>
          <rect x={px} y={y-fs} width={p.w} height={fs*2} rx={fs} ry={fs} fill={p.isLast?c+"33":"transparent"} stroke={p.isLast?c+"88":"transparent"} strokeWidth={1.2}/>
          <text x={px+p.w/2} y={y+1} fontSize={fs} fill={p.isLast?c:c+"cc"} fontWeight={p.isLast?700:500} dominantBaseline="central" textAnchor="middle" fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{label}</text>
        </g>
      </g>;
    })}
  </g>;
}

/* ═══ Panel ═══ */
function Panel(props){
  var focusId=props.focusId,go=props.go,tree=props.tree,panelW=props.panelW,panelH=props.panelH,pinnedNode=props.pinnedNode,onPin=props.onPin,sharedIds=props.sharedIds,onUnpin=props.onUnpin,switchPrep=props.switchPrep,navDir=props.navDir,animKey=props.animKey;
  var isCompare=!!pinnedNode;
  var fn=resolveInTree(tree,focusId);var par=getParent(tree,fn.id);var ch=fn?(fn.children||[]):[];var isLeaf=ch.length===0;var lenses=par?(par.children||[]):[];
  var anc=getAncestors(tree,fn.id)||[tree];
  var depth = anc.length - 1;
  var depthT = 1 - Math.pow(0.72, depth);
  // Sea palette: bright shallow (#1e3a5f) → deep abyss (#02040a)
  function lerpChannel(a,b,t){return Math.round(a+(b-a)*t);}
  function depthBG(t){
    var r=lerpChannel(30,2,t), g=lerpChannel(58,4,t), b=lerpChannel(95,10,t);
    return "rgb("+r+","+g+","+b+")";
  }
  function depthPrepFill(t){
    var r=lerpChannel(42,4,t), g=lerpChannel(72,8,t), b=lerpChannel(110,16,t);
    return "rgb("+r+","+g+","+b+")";
  }
  var bgColor = depthBG(depthT);
  var prepFillColor = depthPrepFill(depthT);
  var W=panelW,H=panelH,PEEK=44;

  var lensIdx=0;for(var li=0;li<lenses.length;li++){if(lenses[li].id===fn.id){lensIdx=li;break;}}
  var lensCount=lenses.length;
  var nextLens=lensCount>1?lenses[(lensIdx+1)%lensCount]:null;
  var prevLens=lensCount>1?lenses[(lensIdx-1+lensCount)%lensCount]:null;

  var allPreps=props.allPreps||[];var prepIdx=props.prepIdx||0;var prepCount=allPreps.length;
  var currentPrep=allPreps[prepIdx]||{color:"#8338ec",emoji:"🔬",name:""};

  var hasRight=!!nextLens,hasLeft=!!prevLens;

  // Focus area
  var FX=hasLeft?PEEK+4:16;
  var FY=16;
  var FW=W-FX-(hasRight?PEEK+4:16);
  var FH=H-FY-16;
  if(FW<80)FW=80;if(FH<80)FH=80;

  // Reserve bottom area inside preparate rect for breadcrumb + definition text
  var compact = !!props.compact;
  var DEF_H = compact ? 56 : 96;
  var BC_H = compact ? 22 : 26;
  var CHILD_AREA_H = FH - DEF_H - 8;

  // Main focus CIRCLE — inscribed in upper (child) portion of preparate rect
  var CX=FX+FW/2;
  var CY=FY+12+CHILD_AREA_H/2;
  var R_focus = Math.min(FW/2 - 12, CHILD_AREA_H/2 - 10);
  // Inscribed square side (90% for safety margin) for children bounce area
  var S_inner = R_focus * Math.SQRT2 * 0.9;
  var childAreaX = CX - S_inner/2;
  var childAreaY = CY - S_inner/2;
  var focusColor=fn?(fn.color||"#06d6a0"):"#06d6a0";
  var gemBarH=compact?20:28;
  var innerPad=6;

  var staticCh=ch.filter(function(c2){return c2.children&&c2.children.length>0;});
  var bouncyCh=ch.filter(function(c2){return!c2.children||c2.children.length===0;});
  // Depth-scaled size multiplier: deeper = bigger (microscope zoom-in feel)
  var depthMult = 1 + Math.min(depth, 4) * 0.12;  // d0=1, d1=1.12, d2=1.24, d3=1.36, d4+=1.48
  // Pack inside inscribed square, then clip each to circle
  var packed=useMemo(function(){
    var p=weightedPack(staticCh,S_inner-innerPad*2,S_inner-innerPad*2,gemBarH);
    // Apply depth multiplier to each child radius (bounded by circle)
    for(var k=0;k<p.length;k++){
      p[k].r = Math.min(p[k].r * depthMult, R_focus * 0.5);
    }
    // Clip each to circle — clamp position so edge doesn't exceed focus circle
    for(var i=0;i<p.length;i++){
      var gx=childAreaX+innerPad+p[i].x;
      var gy=childAreaY+innerPad+p[i].y;
      var gdx=gx-CX, gdy=gy-CY;
      var gd=Math.sqrt(gdx*gdx+gdy*gdy);
      var gMax=R_focus-p[i].r-6;
      if(gd>gMax){
        var nx=gdx/gd, ny=gdy/gd;
        p[i].x=(CX+nx*gMax)-childAreaX-innerPad;
        p[i].y=(CY+ny*gMax)-childAreaY-innerPad;
      }
    }
    return p;
  },[staticCh.length,fn.id,R_focus,S_inner,depthMult]);
  var bouncyR=bouncyCh.length>0?Math.min(32,Math.max(11,(S_inner-innerPad*2)/(bouncyCh.length*2.5))*depthMult):0;

  var localGo=useCallback(function(id,dir){go(id,dir);},[go]);
  var uid=props.accentColor?"p":"f";  // unique id for filter/clipPath when 2 panels
  var lensCircR=FH*0.45;
  var prepRectW=FW*0.7;

  var animClass="";
  if(navDir==="right")animClass="anim-lens-right";
  else if(navDir==="left")animClass="anim-lens-left";
  else if(navDir==="down")animClass="anim-prep-down";
  else if(navDir==="up")animClass="anim-prep-up";
  else if(navDir==="in")animClass="anim-zoom-in";
  else if(navDir==="out")animClass="anim-zoom-out";

  var descText = fn.desc || "";

  return <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{overflow:"hidden"}}>
    <defs>
      <filter id={"gl"+uid}><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <clipPath id={uid+"cR"}><rect x={W-PEEK} y={0} width={PEEK} height={H}/></clipPath>
      <clipPath id={uid+"cL"}><rect x={0} y={0} width={PEEK} height={H}/></clipPath>
    </defs>

    {par?<rect x={0} y={0} width={W} height={H} fill={bgColor} style={{cursor:"pointer"}} onClick={function(){localGo(par.id,"out");}}/>:<rect x={0} y={0} width={W} height={H} fill={bgColor}/>}

    {/* Animated focus content wrapper */}
    <g key={animKey||0} className={animClass}>

      {/* ═══ Preparate rect (outer frame) ═══ */}
      <rect x={FX} y={FY} width={FW} height={FH} rx={16} ry={16} fill="transparent" onClick={function(e){e.stopPropagation();}} style={{cursor:"default"}}/>
      <rect x={FX} y={FY} width={FW} height={FH} rx={16} ry={16} fill={prepFillColor} style={{pointerEvents:"none"}}/>
      <rect x={FX} y={FY} width={FW} height={FH} rx={16} ry={16} fill={currentPrep.color+"08"} stroke={props.accentColor||currentPrep.color} strokeWidth={props.accentColor?3:2} style={{pointerEvents:"none"}}/>

      {/* ═══ Main focus CIRCLE (inner) ═══ */}
      <circle cx={CX} cy={CY} r={R_focus} fill={focusColor+"15"} stroke={focusColor} strokeWidth={2.5} filter={"url(#gl"+uid+")"} style={{pointerEvents:"none"}}/>

      {/* ═══ Preparate label — LEFT gap (between rect left edge and circle) ═══ */}
      {(function(){
        var gapCx = (FX + (CX - R_focus)) / 2;
        var emojiFs = compact ? 24 : 32;
        var nameFs = compact ? 10 : 13;
        return <g style={{pointerEvents:"none"}}>
          <text x={gapCx} y={CY-12} textAnchor="middle" dominantBaseline="central" fontSize={emojiFs} opacity={0.9}>{currentPrep.emoji}</text>
          <text x={gapCx} y={CY+emojiFs*0.6+4} textAnchor="middle" dominantBaseline="central" fontSize={nameFs} fill={currentPrep.color} fontWeight="bold" fontFamily="'Noto Sans JP',sans-serif">{currentPrep.name}</text>
        </g>;
      })()}

      {/* ═══ Depth gauge — RIGHT gap (between circle and rect right edge) ═══ */}
      {(function(){
        var gapCx = ((CX + R_focus) + (FX + FW)) / 2;
        var dotR = 3;
        var gap = 5;
        var maxShow = 6;
        var totalH = maxShow*dotR*2 + (maxShow-1)*gap;
        var startY = CY - totalH/2;
        return <g style={{pointerEvents:"none"}}>
          <text x={gapCx} y={startY-10} textAnchor="middle" dominantBaseline="central" fontSize={compact?12:14}>🌊</text>
          {[0,1,2,3,4,5].map(function(i){
            var active = i<=depth;
            var cy2 = startY + i*(dotR*2+gap) + dotR;
            return <circle key={i} cx={gapCx} cy={cy2} r={active?dotR+0.5:dotR-0.5} fill={active?("hsl("+(210-i*6)+", 65%, "+(60-i*6)+"%)"):"#ffffff18"} stroke={active?"none":"#ffffff22"} strokeWidth={active?0:1}/>;
          })}
          <text x={gapCx} y={startY+totalH+12} textAnchor="middle" dominantBaseline="central" fontSize={compact?9:10} fill="#ffffff88" fontWeight="bold">{depth}層</text>
        </g>;
      })()}

      {/* ═══ Evolution chain nav — show when fn has evo_family gem ═══ */}
      {(function(){
        if (!fn || !fn.gems) return null;
        var evoGem = null;
        for (var gi=0; gi<fn.gems.length; gi++) {
          if (fn.gems[gi].key === "evo_family") { evoGem = fn.gems[gi]; break; }
        }
        if (!evoGem) return null;
        var family = EVO_FAMILIES[evoGem.value];
        if (!family || family.members.length<2) return null;
        var dotR = compact ? 14 : 18;
        var rowY = CY + R_focus - (compact?20:28);

        // ══ Branched layout (Eevee etc.) ══
        if (family.branches) {
          // find root = id not appearing as a child
          var allChildren = {};
          Object.keys(family.branches).forEach(function(pk){
            family.branches[pk].forEach(function(c){allChildren[c]=true;});
          });
          var rootId = family.members.filter(function(m){return !allChildren[m];})[0] || family.members[0];
          var rootRec = P[rootId]; if(!rootRec) return null;
          var kidsIds = family.branches[rootId] || [];
          var kids = kidsIds.map(function(k){return P[k];}).filter(Boolean);
          var N = kids.length;
          // Horizontal: root on left, kids on right
          var gapX = compact ? 22 : 32;
          var rootX = CX - (dotR + gapX/2 + dotR);
          var kidsX = CX + (gapX/2 + dotR);
          // Vertical stack for kids (tight)
          var vStep = compact ? dotR*1.55 : dotR*1.7;
          var kidsYStart = rowY - vStep*(N-1)/2;
          var rootColor = rootRec.color || focusColor;
          return <g>
            {/* Family label */}
            <text x={CX} y={rowY - dotR - 8} textAnchor="middle" dominantBaseline="central" fontSize={compact?9:10} fill={focusColor+"aa"} fontWeight="bold" fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>🔗 {family.name} <tspan fill={focusColor+"77"} fontSize={compact?8:9}>(分岐)</tspan></text>
            {/* Root (Eevee) */}
            {(function(){
              var isCurRoot = rootRec.id === fn.id;
              return <g onClick={isCurRoot?undefined:function(e){e.stopPropagation();localGo(rootRec.id,"in");}} style={{cursor:isCurRoot?"default":"pointer"}}>
                <circle cx={rootX} cy={rowY} r={isCurRoot?dotR:dotR-2} fill={isCurRoot?rootColor+"44":rootColor+"15"} stroke={rootColor} strokeWidth={isCurRoot?2.5:1.2}/>
                <text x={rootX} y={rowY+1} textAnchor="middle" dominantBaseline="central" fontSize={isCurRoot?(compact?15:19):(compact?12:15)} style={{pointerEvents:"none"}}>{rootRec.emoji}</text>
                {isCurRoot && <circle cx={rootX} cy={rowY} r={dotR+3} fill="none" stroke={rootColor+"88"} strokeWidth={1} style={{pointerEvents:"none"}}/>}
                <text x={rootX} y={rowY+dotR+(compact?8:11)} textAnchor="middle" dominantBaseline="central" fontSize={compact?8:9} fill={isCurRoot?rootColor:rootColor+"99"} fontWeight={isCurRoot?"bold":"normal"} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{rootRec.name}</text>
              </g>;
            })()}
            {/* Branching arrows + kid nodes */}
            {kids.map(function(kid,ki){
              var kY = kidsYStart + ki*vStep;
              var isCurKid = kid.id === fn.id;
              var kcolor = kid.color || focusColor;
              // Curved line from root to kid (quadratic bezier)
              var midX = (rootX + kidsX) / 2;
              var d = "M "+(rootX+dotR)+" "+rowY+" Q "+midX+" "+rowY+" "+(kidsX-dotR-2)+" "+kY;
              return <g key={kid.id}>
                <path d={d} stroke={isCurKid?focusColor+"cc":focusColor+"55"} strokeWidth={1.5} fill="none" style={{pointerEvents:"none"}}/>
                <polygon points={(kidsX-dotR-2)+","+kY+" "+(kidsX-dotR-6)+","+(kY-3)+" "+(kidsX-dotR-6)+","+(kY+3)} fill={isCurKid?focusColor+"cc":focusColor+"55"}/>
                <g onClick={isCurKid?undefined:function(e){e.stopPropagation();localGo(kid.id,"in");}} style={{cursor:isCurKid?"default":"pointer"}}>
                  <circle cx={kidsX} cy={kY} r={isCurKid?dotR-1:dotR-3} fill={isCurKid?kcolor+"44":kcolor+"15"} stroke={kcolor} strokeWidth={isCurKid?2.5:1.2}/>
                  <text x={kidsX} y={kY+1} textAnchor="middle" dominantBaseline="central" fontSize={isCurKid?(compact?13:16):(compact?11:13)} style={{pointerEvents:"none"}}>{kid.emoji}</text>
                  {isCurKid && <circle cx={kidsX} cy={kY} r={dotR+2} fill="none" stroke={kcolor+"88"} strokeWidth={1} style={{pointerEvents:"none"}}/>}
                </g>
                <text x={kidsX+dotR+4} y={kY+1} textAnchor="start" dominantBaseline="central" fontSize={compact?8:9} fill={isCurKid?kcolor:kcolor+"99"} fontWeight={isCurKid?"bold":"normal"} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{kid.name}</text>
              </g>;
            })}
          </g>;
        }

        // ══ Linear layout (default — for all 48 other Kanto families) ══
        var members = family.members.map(function(mid){ return P[mid]; }).filter(function(m){return !!m;});
        var curIdx = -1;
        for (var mi=0; mi<members.length; mi++) {
          if (members[mi].id === fn.id) { curIdx = mi; break; }
        }
        var n = members.length;
        var gap = compact ? 10 : 14;
        var sepW = compact ? 10 : 14;  // arrow width
        var totalW = n*dotR*2 + (n-1)*(gap+sepW);
        var startX = CX - totalW/2 + dotR;
        return <g>
          {/* Chain link label */}
          <text x={CX} y={rowY - dotR - 8} textAnchor="middle" dominantBaseline="central" fontSize={compact?9:10} fill={focusColor+"aa"} fontWeight="bold" fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>🔗 {family.name}</text>
          {members.map(function(m,i){
            var cx2 = startX + i*(dotR*2+gap+sepW);
            var isCur = i===curIdx;
            var isPast = i<curIdx;
            var mcolor = m.color || focusColor;
            return <g key={m.id}>
              {/* Arrow separator before this dot (except first) */}
              {i>0 && <g style={{pointerEvents:"none"}}>
                <line x1={cx2-dotR-gap-sepW+2} y1={rowY} x2={cx2-dotR-gap-2} y2={rowY} stroke={isCur||isPast?focusColor+"cc":focusColor+"44"} strokeWidth={1.5}/>
                <polygon points={(cx2-dotR-gap-2)+","+rowY+" "+(cx2-dotR-gap-6)+","+(rowY-3)+" "+(cx2-dotR-gap-6)+","+(rowY+3)} fill={isCur||isPast?focusColor+"cc":focusColor+"44"}/>
              </g>}
              {/* Member circle */}
              <g onClick={isCur?undefined:function(e){e.stopPropagation();localGo(m.id,"in");}} style={{cursor:isCur?"default":"pointer"}}>
                <circle cx={cx2} cy={rowY} r={isCur?dotR:dotR-2} fill={isCur?mcolor+"44":mcolor+"15"} stroke={mcolor} strokeWidth={isCur?2.5:1.2}/>
                <text x={cx2} y={rowY+1} textAnchor="middle" dominantBaseline="central" fontSize={isCur?(compact?15:19):(compact?12:15)} style={{pointerEvents:"none"}}>{m.emoji}</text>
                {isCur && <circle cx={cx2} cy={rowY} r={dotR+3} fill="none" stroke={mcolor+"88"} strokeWidth={1} style={{pointerEvents:"none"}}/>}
              </g>
              {/* Name label below */}
              <text x={cx2} y={rowY+dotR+(compact?8:11)} textAnchor="middle" dominantBaseline="central" fontSize={compact?8:9} fill={isCur?mcolor:mcolor+"99"} fontWeight={isCur?"bold":"normal"} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{m.name}</text>
            </g>;
          })}
        </g>;
      })()}

      {/* Lens title gem — centered inside circle top */}
      <StackedGems x={CX} y={CY-R_focus+6} gems={fn?fn.gems:[]} color={focusColor} active={true} fs={compact?11:14} align="center" maxSecondary={2}/>

      {/* Lens ring position dots — inside circle, below title */}
      {lensCount>1&&<RingDots total={lensCount} current={lensIdx} x={CX} y={CY-R_focus+(compact?22:36)} color={focusColor} colors={lenses.map(function(s){return s.color||focusColor;})}/>}

      {/* Pin button: top-right corner gap */}
      {!onPin ? null : isCompare ? (function(){
        var label = pinnedNode.emoji+" "+pinnedNode.name;
        var chipW = Math.max(130, label.length*9 + 56);
        var chipX = FX+FW-chipW-6;
        return <g onClick={onUnpin} style={{cursor:"pointer"}}>
          <rect x={chipX} y={FY+6} width={chipW} height={26} rx={13} ry={13} fill="#ffd70022" stroke="#ffd700" strokeWidth={1.8}/>
          <text x={chipX+10} y={FY+19} textAnchor="start" dominantBaseline="central" fontSize={11} style={{pointerEvents:"none"}}>📌</text>
          <text x={chipX+26} y={FY+19} textAnchor="start" dominantBaseline="central" fontSize={10} fill="#ffd700" fontWeight="bold" fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>比較中: {label}</text>
          <circle cx={chipX+chipW-18} cy={FY+19} r={8} fill="#ffd70044" stroke="#ffd700" strokeWidth={1}/>
          <text x={chipX+chipW-18} y={FY+19} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="#ffd700" fontWeight="bold" style={{pointerEvents:"none"}}>✕</text>
        </g>;
      })() : (
        <g onClick={function(e){e.stopPropagation();onPin(fn.id);}} style={{cursor:"pointer"}}>
          <rect x={FX+FW-146} y={FY+6} width={140} height={24} rx={12} ry={12} fill="#ffd70018" stroke="#ffd70088" strokeWidth={1.2}/>
          <text x={FX+FW-134} y={FY+19} textAnchor="start" dominantBaseline="central" fontSize={12} style={{pointerEvents:"none"}}>📌</text>
          <text x={FX+FW-116} y={FY+19} textAnchor="start" dominantBaseline="central" fontSize={10} fill="#ffd700cc" fontWeight="bold" fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>これをピン留め</text>
        </g>
      )}

      {/* Children — positioned relative to inscribed square of focus circle */}
      {staticCh.map(function(child,i){var p=packed[i];if(!p)return null;return <ChildRing key={child.id} child={child} ccx={childAreaX+innerPad+p.x} ccy={childAreaY+innerPad+p.y} cr={p.r} go={localGo} sharedIds={sharedIds}/>;})}
      {bouncyCh.length>0&&<BouncyRect items={bouncyCh} areaW={S_inner-innerPad*2} areaH={S_inner-innerPad*2-gemBarH} offsetX={childAreaX+innerPad} offsetY={childAreaY+innerPad+gemBarH} itemR={bouncyR} go={localGo} sharedIds={sharedIds}/>}
      {isLeaf&&fn&&<g><text x={CX} y={CY-10} textAnchor="middle" fontSize={36}>{fn.emoji}</text><text x={CX} y={CY+22} textAnchor="middle" fontSize={13} fill="#ccc" fontFamily="'Noto Sans JP',sans-serif">{fn.name}</text></g>}

      {/* ═══ Bottom info zone: breadcrumbs + definition text ═══ */}

      {/* Separator line */}
      <line x1={FX+12} y1={FY+FH-DEF_H} x2={FX+FW-12} y2={FY+FH-DEF_H} stroke={focusColor+"33"} strokeWidth={1}/>

      {/* Breadcrumbs */}
      <InlineBreadcrumbs ancestors={anc} onFocus={localGo} x={FX+12} y={FY+FH-DEF_H+BC_H/2+2} maxW={FW-24} fs={compact?10:12}/>

      {/* Definition text — native HTML wrapping via foreignObject */}
      {descText ? (
        <foreignObject x={FX+12} y={FY+FH-DEF_H+BC_H+4} width={FW-24} height={DEF_H-BC_H-8}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{
            fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif",
            fontSize: compact ? 10 : 11,
            lineHeight: 1.5,
            color:"#e8e8f0cc",
            overflow:"hidden",
            display:"-webkit-box",
            WebkitLineClamp: compact ? 1 : 3,
            WebkitBoxOrient:"vertical",
            wordBreak:"break-word"
          }}>{descText}</div>
        </foreignObject>
      ) : (
        <text x={FX+12} y={FY+FH-DEF_H+BC_H+18} fontSize={10} fill="#ffffff33" fontStyle="italic" fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>（定義なし）</text>
      )}

    </g>

    {/* Edge peeks — OUTSIDE animation wrapper */}

    {hasRight&&function(){var sc=nextLens.color||"#888";return <g className="peekslot" clipPath={"url(#"+uid+"cR)"} style={{cursor:"pointer"}} onClick={function(e){e.stopPropagation();localGo(nextLens.id,"right");}}><circle cx={W-PEEK+lensCircR} cy={CY} r={lensCircR} fill={sc+"0a"} stroke={sc+"55"} strokeWidth={1.5}/><text x={W-PEEK/2} y={CY-10} textAnchor="middle" dominantBaseline="central" fontSize={18} fill={sc+"cc"} style={{pointerEvents:"none"}}>{nextLens.emoji}</text><text x={W-PEEK/2} y={CY+12} textAnchor="middle" dominantBaseline="central" fontSize={8} fill={sc+"88"} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{nextLens.name}</text></g>;}()}

    {hasLeft&&function(){var sc=prevLens.color||"#888";return <g className="peekslot" clipPath={"url(#"+uid+"cL)"} style={{cursor:"pointer"}} onClick={function(e){e.stopPropagation();localGo(prevLens.id,"left");}}><circle cx={PEEK-lensCircR} cy={CY} r={lensCircR} fill={sc+"0a"} stroke={sc+"55"} strokeWidth={1.5}/><text x={PEEK/2} y={CY-10} textAnchor="middle" dominantBaseline="central" fontSize={18} fill={sc+"cc"} style={{pointerEvents:"none"}}>{prevLens.emoji}</text><text x={PEEK/2} y={CY+12} textAnchor="middle" dominantBaseline="central" fontSize={8} fill={sc+"88"} fontFamily="'Noto Sans JP',sans-serif" style={{pointerEvents:"none"}}>{prevLens.name}</text></g>;}()}
  </svg>;
}

/* ═══ Main ═══ */
export default function WakkazukanV46(){
  // ═ Dataset layer ═
  var datasetIdState = useState("pokemon"); var datasetId = datasetIdState[0]; var setDatasetId = datasetIdState[1];
  // Per-dataset data (preserves edits when switching)
  var allDataState = useState(function(){
    var o = {};
    DATASET_ORDER.forEach(function(did){ o[did] = DATASETS[did].defaultData; });
    return o;
  });
  var allData = allDataState[0]; var setAllData = allDataState[1];
  var currentDatasetConfig = DATASETS[datasetId];
  var currentList = allData[datasetId];
  var data = useMemo(function(){return currentDatasetConfig.build(currentList);},[datasetId, currentList]);
  var PREPARATES = data.PREPARATES;
  var P = data.P;
  // Helper to update just the current dataset's list
  var setPokeList = useCallback(function(newList){
    setAllData(function(prev){
      var next = Object.assign({},prev);
      next[datasetId] = newList;
      return next;
    });
  },[datasetId]);

  // Import/export UI state
  var ioMsgState=useState(null),ioMsg=ioMsgState[0],setIoMsg=ioMsgState[1];
  var fileInputRef=useRef(null);

  var prepState=useState(0),prepIdx=prepState[0],setPrepIdx=prepState[1];var currentPrep=PREPARATES[prepIdx];var TREE=currentPrep.tree;
  var focusState=useState(currentDatasetConfig.initialFocus),focusId=focusState[0],setFocusId=focusState[1];
  var pinnedState=useState(null),pinnedId=pinnedState[0],setPinnedId=pinnedState[1];var isCompare=pinnedId!==null;
  var navDirState=useState(""),navDir=navDirState[0],setNavDir=navDirState[1];
  var animKeyState=useState(0),animKey=animKeyState[0],setAnimKey=animKeyState[1];
  var pinNavDirState=useState(""),pinNavDir=pinNavDirState[0],setPinNavDir=pinNavDirState[1];
  var pinAnimKeyState=useState(0),pinAnimKey=pinAnimKeyState[0],setPinAnimKey=pinAnimKeyState[1];
  // Popup states
  var depthPopupState=useState(false),depthPopup=depthPopupState[0],setDepthPopup=depthPopupState[1];
  var prepGridState=useState(false),prepGrid=prepGridState[0],setPrepGrid=prepGridState[1];
  // VR共通検索
  var searchState=useState(""),searchQuery=searchState[0],setSearchQuery=searchState[1];
  var searchOpen=useState(false),isSearchOpen=searchOpen[0],setSearchOpen=searchOpen[1];
  var searchResults=useMemo(function(){
    if(!searchQuery.trim()||!P)return[];
    var q=searchQuery.trim().toLowerCase();
    var hits=[];
    var ids=Object.keys(P);
    for(var i=0;i<ids.length;i++){
      var item=P[ids[i]];
      var haystack=[item.name||"",item.id||"",item.emoji||"",item.desc||""].join(" ").toLowerCase();
      if(item.gems){for(var g=0;g<item.gems.length;g++){haystack+=" "+(item.gems[g].value||"").toLowerCase();}}
      if(haystack.indexOf(q)>=0) hits.push(item);
    }
    return hits.slice(0,12);
  },[searchQuery,P]);
  var handleSearchJump=useCallback(function(itemId){
    // Find which preparate contains this item, then navigate
    for(var pi=0;pi<PREPARATES.length;pi++){
      var node=findNode(PREPARATES[pi].tree,itemId);
      if(node){
        // Found! Switch to this preparate if needed
        if(pi!==prepIdx) switchPrep(pi,"down");
        // Navigate to the item's parent (so the item is visible as a child)
        var parentNode=getParent(PREPARATES[pi].tree,itemId);
        if(parentNode) go(parentNode.id,"in");
        else go(itemId,"in");
        setSearchQuery("");setSearchOpen(false);
        return;
      }
    }
    // If not in any tree as a node, try finding as a leaf
    go(itemId,"in");
    setSearchQuery("");setSearchOpen(false);
  },[PREPARATES,prepIdx,switchPrep,go]);

  // ═ When dataset changes: reset prepIdx & focus ═
  var switchDataset = useCallback(function(newDid){
    if(newDid===datasetId) return;
    var newConfig = DATASETS[newDid];
    setDatasetId(newDid);
    setPrepIdx(0);
    setFocusId(newConfig.initialFocus);
    setPinnedId(null);
    setNavDir("down"); setAnimKey(function(k){return k+1;});
  },[datasetId]);

  // ═══ CSV handlers ═══
  var handleExport = useCallback(function(){
    try{
      // exportPrepCSV only supports pokemon for now (type/hab/size). ikimono has different axis naming.
      if(datasetId!=="pokemon"){
        setIoMsg({kind:"err",text:"CSV書き出しは現在ポケモンずかんのみ対応（いきものは次のバージョンで対応予定）"});
        setTimeout(function(){setIoMsg(null);},3000);
        return;
      }
      var csv = exportPrepCSV(currentPrep.id, currentList, P, PREPARATES);
      var blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "wakkazukan_"+datasetId+"_"+currentPrep.id+"_"+new Date().toISOString().slice(0,10)+".csv";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIoMsg({kind:"ok",text:"書き出し完了: "+currentPrep.name+" ("+currentList.length+"件)"});
      setTimeout(function(){setIoMsg(null);},2500);
    }catch(e){setIoMsg({kind:"err",text:"書き出し失敗: "+e.message});}
  },[datasetId,currentPrep,currentList,P,PREPARATES]);

  var handleImportClick = useCallback(function(){
    if(datasetId!=="pokemon"){
      setIoMsg({kind:"err",text:"CSV取り込みは現在ポケモンずかんのみ対応"});
      setTimeout(function(){setIoMsg(null);},3000);
      return;
    }
    if(fileInputRef.current) fileInputRef.current.click();
  },[datasetId]);

  var handleFileChange = useCallback(function(e){
    var file = e.target.files && e.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){
      try{
        var text = ev.target.result;
        var newList = importPrepCSV(text, currentPrep.id, currentList);
        setPokeList(newList);
        setIoMsg({kind:"ok",text:"取り込み完了: "+currentPrep.name+" ("+newList.length+"件)"});
        setTimeout(function(){setIoMsg(null);},2500);
      }catch(err){
        setIoMsg({kind:"err",text:"取り込み失敗: "+err.message});
      }
      if(fileInputRef.current) fileInputRef.current.value="";
    };
    reader.readAsText(file, "utf-8");
  },[currentPrep,currentList,setPokeList]);

  var handleReset = useCallback(function(){
    var defaultList = currentDatasetConfig.defaultData;
    if(currentList===defaultList) return;
    setPokeList(defaultList);
    setIoMsg({kind:"ok",text:"初期データに戻しました"});
    setTimeout(function(){setIoMsg(null);},2000);
  },[currentList,currentDatasetConfig,setPokeList]);

  var fn=resolveInTree(TREE,focusId);var resolvedFocusId=fn.id;
  var pinNode=pinnedId?resolveInTree(TREE,pinnedId):null;
  var resolvedPinId=pinNode?pinNode.id:null;
  var sharedIds=useMemo(function(){if(!pinnedId)return[];var pn=resolveInTree(TREE,pinnedId);var fn2=resolveInTree(TREE,resolvedFocusId);return collectLeafIds(pn).filter(function(id){return collectLeafIds(fn2).indexOf(id)>=0;});},[pinnedId,resolvedFocusId,prepIdx]);

  var go=useCallback(function(id,dir){
    setNavDir(dir||"in");
    setAnimKey(function(k){return k+1;});
    setFocusId(id);
  },[]);

  // Navigate within the pinned panel
  var goPin=useCallback(function(id,dir){
    setPinNavDir(dir||"in");
    setPinAnimKey(function(k){return k+1;});
    setPinnedId(id);
  },[]);

  var switchPrep=useCallback(function(newIdx,dir){
    setNavDir(dir||"down");setAnimKey(function(k){return k+1;});
    setPinNavDir(dir||"down");setPinAnimKey(function(k){return k+1;});
    var newTree=PREPARATES[newIdx].tree;
    if(!findNode(newTree,focusId)){var rp=findRecordParent(newTree,focusId);setFocusId(rp?rp.id:newTree.id);}
    if(pinnedId&&!findNode(newTree,pinnedId)){var rp2=findRecordParent(newTree,pinnedId);if(rp2)setPinnedId(rp2.id);else setPinnedId(null);}
    setPrepIdx(newIdx);
  },[focusId,pinnedId]);

  function handlePin(sibId){setPinnedId(sibId);setPinNavDir("");setPinAnimKey(0);}
  function handleUnpin(){setPinnedId(null);}

  var FULL_W=780,PANEL_H_FULL=640,PANEL_H_COMPACT=320;
  var panelH=isCompare?PANEL_H_COMPACT:PANEL_H_FULL;

  // Compute main depth for container bg (mirror of Panel's depth logic)
  var mainAnc = getAncestors(TREE, resolvedFocusId) || [TREE];
  var mainDepth = mainAnc.length - 1;
  var mainDepthT = 1 - Math.pow(0.72, mainDepth);
  var containerBg = "rgb(" +
    Math.round(30+(2-30)*mainDepthT) + "," +
    Math.round(58+(4-58)*mainDepthT) + "," +
    Math.round(95+(10-95)*mainDepthT) + ")";

  return <div style={{width:"100%",minHeight:"100vh",background:containerBg,fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif",color:"#e0e0e0",display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 0",gap:isCompare?6:0,transition:"background .5s ease",position:"relative"}}>
    {/* ═══ Beta banner + Search — top-right fixed ═══ */}
    <div style={{position:"absolute",top:8,right:10,display:"flex",alignItems:"center",gap:6,zIndex:50,fontSize:10,fontFamily:"'Noto Sans JP',sans-serif"}}>
      {/* VR共通検索 */}
      <div style={{position:"relative"}}>
        <input value={searchQuery} onChange={function(e){setSearchQuery(e.target.value);setSearchOpen(true);}}
          onFocus={function(){setSearchOpen(true);}}
          placeholder="🔍 検索…"
          style={{width:isSearchOpen&&searchQuery?160:100,padding:"4px 24px 4px 8px",fontSize:11,
            background:"#0a162888",border:"1px solid "+(searchQuery?"#e9b44c":"#ffffff22"),borderRadius:8,
            color:"#e0e0e0",outline:"none",transition:"all 0.2s",backdropFilter:"blur(6px)",
            fontFamily:"'Noto Sans JP',sans-serif"}}/>
        {searchQuery&&<button onClick={function(){setSearchQuery("");setSearchOpen(false);}} style={{
          position:"absolute",right:4,top:"50%",transform:"translateY(-50%)",
          background:"none",border:"none",color:"#ffffff55",fontSize:10,cursor:"pointer",padding:2}}>✕</button>}
        {isSearchOpen&&searchQuery.trim()&&<div style={{
          position:"absolute",top:"100%",right:0,marginTop:4,
          background:"rgba(10,22,40,0.97)",border:"1px solid #e9b44c44",borderRadius:10,
          width:240,maxHeight:300,overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
          backdropFilter:"blur(8px)",zIndex:60}}>
          <div style={{padding:"6px 10px",fontSize:10,color:"#ffffff55",borderBottom:"1px solid #ffffff11"}}>
            {searchResults.length>0?searchResults.length+"件ヒット":"見つかりません"}
          </div>
          {searchResults.map(function(item){
            return <div key={item.id} onClick={function(){handleSearchJump(item.id);}}
              style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,
                borderBottom:"1px solid #ffffff08",transition:"background 0.15s"}}
              onMouseEnter={function(e){e.currentTarget.style.background="#ffffff11";}}
              onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:16}}>{item.emoji||"·"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"#e0e0e0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                {item.desc&&<div style={{fontSize:9,color:"#ffffff55",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.desc}</div>}
              </div>
            </div>;
          })}
        </div>}
      </div>
      <span style={{background:"#e9b44c22",border:"1px solid #e9b44c88",color:"#e9b44c",padding:"3px 8px",borderRadius:10,fontWeight:"bold",letterSpacing:"0.05em"}}>β BETA</span>
      <a href="./manual.html" style={{color:"#ffffff88",textDecoration:"none",border:"1px solid #ffffff22",padding:"3px 8px",borderRadius:10,transition:"all .2s"}} onMouseEnter={function(e){e.currentTarget.style.color="#e9b44c";e.currentTarget.style.borderColor="#e9b44c";}} onMouseLeave={function(e){e.currentTarget.style.color="#ffffff88";e.currentTarget.style.borderColor="#ffffff22";}}>📘 マニュアル</a>
      <a href="./manual.html#feedback" style={{color:"#ffffff88",textDecoration:"none",border:"1px solid #ffffff22",padding:"3px 8px",borderRadius:10,transition:"all .2s"}} onMouseEnter={function(e){e.currentTarget.style.color="#e9b44c";e.currentTarget.style.borderColor="#e9b44c";}} onMouseLeave={function(e){e.currentTarget.style.color="#ffffff88";e.currentTarget.style.borderColor="#ffffff22";}}>💬 ご意見</a>
      <a href="https://osakenpiro.github.io/banet-map/" target="_blank" rel="noreferrer" style={{color:"#ffffff88",textDecoration:"none",border:"1px solid #ffffff22",padding:"3px 8px",borderRadius:10,transition:"all .2s"}} onMouseEnter={function(e){e.currentTarget.style.color="#06d6a0";e.currentTarget.style.borderColor="#06d6a0";}} onMouseLeave={function(e){e.currentTarget.style.color="#ffffff88";e.currentTarget.style.borderColor="#ffffff22";}}>🌀 バネットマップ</a>
    </div>
    {/* ═══ VR共通検索 ═══ */}
    <div style={{position:"absolute",top:8,left:10,zIndex:50}}>
      <div style={{position:"relative"}}>
        <input value={searchQuery} onChange={function(e){setSearchQuery(e.target.value);setSearchOpen(true);}}
          onFocus={function(){if(searchQuery.trim())setSearchOpen(true);}}
          placeholder="🔍 検索…"
          style={{width:isSearchOpen&&searchQuery?200:120,padding:"5px 26px 5px 8px",fontSize:12,
            background:"#0a162899",border:"1px solid "+(searchQuery?"#e9b44c":"#ffffff22"),borderRadius:10,
            color:"#e0e0e0",outline:"none",transition:"all 0.25s",backdropFilter:"blur(6px)",
            fontFamily:"'Noto Sans JP',sans-serif"}}/>
        {searchQuery&&<button onClick={function(){setSearchQuery("");setSearchOpen(false);}} style={{
          position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",
          background:"none",border:"none",color:"#ffffff55",fontSize:11,cursor:"pointer",padding:2}}>✕</button>}
        {isSearchOpen&&searchResults.length>0&&<div style={{
          position:"absolute",top:"100%",left:0,marginTop:4,width:240,maxHeight:300,overflowY:"auto",
          background:"rgba(10,22,40,0.97)",border:"1px solid #e9b44c55",borderRadius:10,
          boxShadow:"0 6px 24px rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",zIndex:60}}>
          <div style={{padding:"6px 10px",fontSize:10,color:"#e9b44c",fontWeight:"bold",borderBottom:"1px solid #ffffff11"}}>
            {searchResults.length}件{searchResults.length>=12?" (上位12件)":""}
          </div>
          {searchResults.map(function(item){
            return <div key={item.id} onClick={function(){handleSearchJump(item.id);}}
              style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,
                fontSize:13,borderBottom:"1px solid #ffffff08",transition:"background 0.15s"}}
              onMouseEnter={function(e){e.currentTarget.style.background="#ffffff11";}}
              onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:16}}>{item.emoji||"·"}</span>
              <span style={{flex:1,color:"#e0e0e0"}}>{item.name}</span>
              {item.gems&&item.gems[0]&&<span style={{fontSize:10,color:"#ffffff55"}}>{item.gems[0].value}</span>}
            </div>;
          })}
        </div>}
        {isSearchOpen&&searchQuery.trim()&&searchResults.length===0&&<div style={{
          position:"absolute",top:"100%",left:0,marginTop:4,width:200,padding:"10px 12px",
          background:"rgba(10,22,40,0.97)",border:"1px solid #ffffff22",borderRadius:10,
          fontSize:12,color:"#ffffff55",textAlign:"center"}}>該当なし</div>}
      </div>
    </div>
    {/* ═══ Dataset switcher — topmost tab row ═══ */}
    <div style={{display:"flex",alignItems:"center",gap:8,paddingBottom:6,paddingTop:2}}>
      <span style={{fontSize:9,color:"#ffffff55",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.15em",textTransform:"uppercase",marginRight:4}}>dataset</span>
      {DATASET_ORDER.map(function(did){
        var ds = DATASETS[did];
        var isCur = did===datasetId;
        return <button key={did} onClick={function(){switchDataset(did);}} style={{
          background: isCur ? (ds.color+"33") : "#ffffff05",
          border: "1.5px solid " + (isCur ? ds.color : "#ffffff18"),
          color: isCur ? ds.color : "#ffffff77",
          borderRadius: 20,
          padding: "5px 14px 5px 10px",
          fontSize: 11,
          fontWeight: isCur?"bold":"normal",
          cursor: isCur?"default":"pointer",
          display:"flex",alignItems:"center",gap:5,
          boxShadow: isCur?("0 0 12px "+ds.color+"55"):"none",
          transition:"all .25s",
          fontFamily:"'Noto Sans JP',sans-serif"
        }}>
          <span style={{fontSize:14}}>{ds.emoji}</span>
          <span>{ds.name}</span>
        </button>;
      })}
    </div>
    {/* ═══ Preparate carousel — ring-shaped rotation ═══ */}
    {(function(){
      var pCount = PREPARATES.length;
      // Visible slots: prev-1, prev, CURRENT, next, next+1 (up to 5)
      var visibleOffsets = pCount<=3 ? [-1,0,1] : [-2,-1,0,1,2];
      var slots = visibleOffsets.map(function(off){
        var idx = ((prepIdx+off)%pCount+pCount)%pCount;
        return {pp:PREPARATES[idx], idx:idx, off:off};
      });
      var goPrev = function(){switchPrep((prepIdx-1+pCount)%pCount,"up");};
      var goNext = function(){switchPrep((prepIdx+1)%pCount,"down");};
      return <div style={{display:"flex",alignItems:"center",gap:4,paddingBottom:6}}>
        <button onClick={goPrev} style={{background:"transparent",border:"none",color:"#ffffff88",fontSize:18,cursor:"pointer",padding:"0 4px",fontWeight:"bold"}}>‹</button>
        {slots.map(function(s){
          var isCur = s.off===0;
          var absOff = Math.abs(s.off);
          // Distance from center controls size + opacity
          var scale = isCur ? 1 : (absOff===1 ? 0.82 : 0.65);
          var opacity = isCur ? 1 : (absOff===1 ? 0.65 : 0.35);
          var padV = isCur ? 6 : 4;
          var padH = isCur ? 14 : 9;
          var fontSz = isCur ? 13 : 10;
          var emojiSz = isCur ? 16 : 12;
          return <div key={s.pp.id+"_"+s.off} onClick={function(){if(!isCur)switchPrep(s.idx, s.off>0?"down":"up");}} style={{
            display:"flex",alignItems:"center",gap:5,
            padding:padV+"px "+padH+"px",
            borderRadius:14,
            background:isCur?(s.pp.color+"33"):"#ffffff08",
            border:"1.5px solid "+(isCur?s.pp.color:"#ffffff22"),
            color:isCur?s.pp.color:"#ffffff88",
            fontSize:fontSz,
            fontWeight:isCur?"bold":"normal",
            cursor:isCur?"default":"pointer",
            opacity:opacity,
            transform:"scale("+scale+")",
            transformOrigin:"center",
            transition:"all .3s cubic-bezier(.34,.62,.42,1.05)",
            boxShadow:isCur?("0 0 14px "+s.pp.color+"66"):"none",
            whiteSpace:"nowrap"
          }}>
            <span style={{fontSize:emojiSz}}>{s.pp.emoji}</span>
            <span>{s.pp.name}</span>
          </div>;
        })}
        <button onClick={goNext} style={{background:"transparent",border:"none",color:"#ffffff88",fontSize:18,cursor:"pointer",padding:"0 4px",fontWeight:"bold"}}>›</button>
        <button onClick={function(){setPrepGrid(true);}} title="全てのプレパラート" style={{background:"#ffffff08",border:"1.5px solid #ffffff22",color:"#ffffffaa",borderRadius:8,width:28,height:28,cursor:"pointer",marginLeft:4,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>⊞</button>
        <button onClick={handleExport} title={"CSVに書き出す（"+currentPrep.name+"）"} style={{background:"#ffffff08",border:"1.5px solid #ffffff22",color:"#ffffffaa",borderRadius:8,width:28,height:28,cursor:"pointer",marginLeft:4,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>📥</button>
        <button onClick={handleImportClick} title={"CSVから取り込む（"+currentPrep.name+"）"} style={{background:"#ffffff08",border:"1.5px solid #ffffff22",color:"#ffffffaa",borderRadius:8,width:28,height:28,cursor:"pointer",marginLeft:4,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>📤</button>
        {currentList!==currentDatasetConfig.defaultData && <button onClick={handleReset} title="初期データに戻す" style={{background:"#ff660018",border:"1.5px solid #ff660066",color:"#ff9966",borderRadius:8,width:28,height:28,cursor:"pointer",marginLeft:4,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>↺</button>}
        <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} style={{display:"none"}}/>
      </div>;
    })()}

    {/* Hierarchy popup trigger button (small) */}
    <button onClick={function(){setDepthPopup(true);}} style={{background:"#ffffff08",border:"1px solid #ffffff22",color:"#ffffff99",borderRadius:8,padding:"4px 10px",fontSize:10,cursor:"pointer",marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
      <span>🌊</span><span>階層をみる</span>
    </button>

    {/* CSV import/export toast */}
    {ioMsg && <div style={{
      position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:200,
      background: ioMsg.kind==="err" ? "#4a1a1a" : "#1a3a1a",
      border:"1px solid "+(ioMsg.kind==="err"?"#ff6666":"#66ff99"),
      color: ioMsg.kind==="err" ? "#ff9999" : "#aaffcc",
      padding:"10px 18px",borderRadius:8,fontSize:12,fontWeight:"bold",
      boxShadow:"0 4px 20px #000a",
      fontFamily:"'Noto Sans JP',sans-serif"
    }}>{ioMsg.kind==="err"?"⚠️ ":"✅ "}{ioMsg.text}</div>}

    {/* ═══ Depth popup: vertical ancestor list ═══ */}
    {depthPopup && <div onClick={function(){setDepthPopup(false);}} style={{position:"fixed",inset:0,background:"#000a",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:"#0d1b2d",border:"1px solid #ffffff22",borderRadius:12,padding:16,minWidth:260,maxWidth:400,boxShadow:"0 8px 40px #000a"}}>
        <div style={{fontSize:12,fontWeight:"bold",color:"#ffffffaa",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <span>🌊</span><span>階層を選ぶ</span>
        </div>
        {mainAnc.map(function(a,i){
          var isCur = i===mainDepth;
          var indent = i*14;
          return <div key={a.id} onClick={function(){
            if(!isCur){
              var delta = i - mainDepth;
              go(a.id, delta<0 ? "out" : "in");
            }
            setDepthPopup(false);
          }} style={{
            display:"flex",alignItems:"center",gap:8,
            padding:"8px 10px",marginLeft:indent,
            borderRadius:8,
            background: isCur ? (a.color||"#4a90e2")+"33" : "transparent",
            border:"1px solid "+(isCur ? (a.color||"#4a90e2") : "#ffffff11"),
            cursor:isCur?"default":"pointer",
            fontSize:13,
            color: isCur ? (a.color||"#ffffff") : "#ffffffcc",
            fontWeight:isCur?"bold":"normal",
            transition:"background .2s"
          }}>
            <span style={{fontSize:16}}>{a.emoji}</span>
            <span>{a.name}</span>
            <span style={{marginLeft:"auto",fontSize:9,color:"#ffffff55"}}>{i}層</span>
          </div>;
        })}
      </div>
    </div>}

    {/* ═══ Preparate grid popup ═══ */}
    {prepGrid && <div onClick={function(){setPrepGrid(false);}} style={{position:"fixed",inset:0,background:"#000a",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:"#0d1b2d",border:"1px solid #ffffff22",borderRadius:12,padding:20,maxWidth:540,boxShadow:"0 8px 40px #000a"}}>
        <div style={{fontSize:13,fontWeight:"bold",color:"#ffffffaa",marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
          <span>🔬</span><span>プレパラート一覧</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:12}}>
          {PREPARATES.map(function(pp,i){
            var isCur = i===prepIdx;
            return <div key={pp.id} onClick={function(){
              if(!isCur) switchPrep(i, i>prepIdx ? "down" : "up");
              setPrepGrid(false);
            }} style={{
              padding:"14px 12px",
              borderRadius:10,
              background: isCur ? (pp.color+"33") : (pp.color+"11"),
              border:"2px solid "+(isCur ? pp.color : pp.color+"44"),
              cursor:isCur?"default":"pointer",
              textAlign:"center",
              boxShadow:isCur?("0 0 14px "+pp.color+"66"):"none",
              transition:"all .2s",
              minWidth:140
            }}>
              <div style={{fontSize:30,marginBottom:4}}>{pp.emoji}</div>
              <div style={{fontSize:12,fontWeight:"bold",color:pp.color}}>{pp.name}</div>
              {pp.tree && pp.tree.desc && <div style={{fontSize:9,color:"#ffffff77",marginTop:6,lineHeight:1.4}}>{pp.tree.desc}</div>}
            </div>;
          })}
        </div>
      </div>
    </div>}

    {isCompare && <div style={{width:"100%",maxWidth:FULL_W,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 14px"}}>
      <button onClick={handleUnpin} style={{background:"#ffd70022",border:"1px solid #ffd70066",color:"#ffd700",borderRadius:6,padding:"3px 12px",fontSize:11,cursor:"pointer",fontWeight:"bold"}}>✕ ピン解除</button>
    </div>}
    {isCompare && <div style={{display:"flex",width:"100%",maxWidth:FULL_W,position:"relative"}}>
      <Panel focusId={resolvedPinId} go={goPin} tree={TREE} panelW={FULL_W} panelH={panelH} compact={true} pinnedNode={null} sharedIds={sharedIds} allPreps={PREPARATES} prepIdx={prepIdx} switchPrep={switchPrep} navDir={pinNavDir} animKey={pinAnimKey} accentColor="#ffd700"/>
    </div>}

    <div style={{display:"flex",width:"100%",maxWidth:FULL_W,position:"relative"}}>
      <Panel focusId={resolvedFocusId} go={go} tree={TREE} panelW={FULL_W} panelH={panelH} compact={isCompare} onPin={isCompare?null:handlePin} pinnedNode={isCompare?pinNode:null} sharedIds={isCompare?sharedIds:null} onUnpin={handleUnpin} allPreps={PREPARATES} prepIdx={prepIdx} switchPrep={switchPrep} navDir={navDir} animKey={animKey}/>
    </div>

    <style>{
      "@keyframes lens-right{0%{transform:translateX(180px) rotate(8deg);opacity:0}40%{opacity:1}60%{transform:translateX(-14px) rotate(-1.5deg)}78%{transform:translateX(6px) rotate(.5deg)}90%{transform:translateX(-2px) rotate(-.2deg)}100%{transform:translateX(0) rotate(0)}}" +
      "@keyframes lens-left{0%{transform:translateX(-180px) rotate(-8deg);opacity:0}40%{opacity:1}60%{transform:translateX(14px) rotate(1.5deg)}78%{transform:translateX(-6px) rotate(-.5deg)}90%{transform:translateX(2px) rotate(.2deg)}100%{transform:translateX(0) rotate(0)}}" +
      "@keyframes prep-down{0%{transform:translateY(160px) rotate(-6deg);opacity:0}35%{opacity:1}65%{transform:translateY(-10px) rotate(1.5deg)}85%{transform:translateY(4px) rotate(-.5deg)}100%{transform:translateY(0) rotate(0)}}" +
      "@keyframes prep-up{0%{transform:translateY(-160px) rotate(6deg);opacity:0}35%{opacity:1}65%{transform:translateY(10px) rotate(-1.5deg)}85%{transform:translateY(-4px) rotate(.5deg)}100%{transform:translateY(0) rotate(0)}}" +
      "@keyframes zoom-in{0%{transform:scale(.5);opacity:0}65%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}" +
      "@keyframes zoom-out{0%{transform:scale(1.5);opacity:0}65%{transform:scale(.96);opacity:1}100%{transform:scale(1)}}" +
      ".anim-lens-right,.anim-lens-left,.anim-prep-down,.anim-prep-up,.anim-zoom-in,.anim-zoom-out{transform-box:fill-box;transform-origin:center center}" +
      ".anim-lens-right{animation:lens-right .45s cubic-bezier(.18,.72,.38,1.18) both}" +
      ".anim-lens-left{animation:lens-left .45s cubic-bezier(.18,.72,.38,1.18) both}" +
      ".anim-prep-down{animation:prep-down .55s cubic-bezier(.34,.62,.42,1.05) both}" +
      ".anim-prep-up{animation:prep-up .55s cubic-bezier(.34,.62,.42,1.05) both}" +
      ".anim-zoom-in{animation:zoom-in .35s cubic-bezier(.25,.46,.45,.94) both}" +
      ".anim-zoom-out{animation:zoom-out .35s cubic-bezier(.25,.46,.45,.94) both}" +
      ".peekslot:hover circle,.peekslot:hover rect{fill-opacity:.15;stroke-width:2.5px}" +
      "button:hover{filter:brightness(1.3)}"
    }</style>
  </div>;
}
