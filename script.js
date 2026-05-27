/* ========================================
   リップルアイランド おすすめキャラ診断
   script.js

   ★ このファイルの上部を編集することで、
      質問・選択肢・ポイント・結果文・テーマを
      まとめて変更できます。
   ======================================== */

/* ----------------------------------------
   ⓪ デバッグモード
      true にすると結果画面に上位5キャラの点数を表示
      公開前に false に戻してください
   ---------------------------------------- */
const DEBUG_MODE = true;

/* ----------------------------------------
   ① Xシェア文テンプレート
      {name} がキャラ名に置き換わります
   ---------------------------------------- */
const SHARE_TEXT_TEMPLATE =
  `リップルアイランドおすすめキャラ診断をやってみた！\n結果は【{name}】でした！\n\n#リップルアイランド`;

/* ----------------------------------------
   ② 診断ページURL（シェア時に付与）
      GitHub Pages公開後に書き換えてください
   ---------------------------------------- */
const SHARE_URL = location.href.split('?')[0];

/* ----------------------------------------
   ③ キャラクター定義
      priority: 小さい数ほど同点時に優先
   ---------------------------------------- */
const CHARACTERS = [
  {
    id: 'kyle',
    name: 'カイル',
    imagePath: 'assets/characters/kyle.png',
    theme: 'theme-kyle',
    priority: 1,
    typeName: 'テキパキ万能アタッカー',
    tendency: 'あなたは、状況を見ながら自分から動いて流れを作れるタイプ。\n誰かの指示を待つよりも、「今これが必要そう」と感じたら自然に体が動きます。\n\n忙しい場面でもパニックになりにくく、足りない作業や詰まりそうな場所を見つけて埋めに行くのが得意です。\nテンポよく動けると調子が上がる、現場対応力の高い人です。',
    affinity: 'カイルの高速ダッシュは、どの役割でも使いやすい万能スキル。\nホール、キッチン、ファーム、トレジャーのどこでも移動の早さがそのまま強みになります。\n\n物を持ったままでも使えるため、「必要な場所にすぐ向かう」あなたの動き方と相性抜群。\n迷った時に選んでも腐りにくい、安定感のあるキャラです。',
    recommendations: ['じっとしているより動きたい', 'どの役割でもある程度こなしたい', '迷ったらまず行動する', 'かっこいいキャラを使いたい'],
  },
  {
    id: 'cal',
    name: 'キャル',
    imagePath: 'assets/characters/cal.png',
    theme: 'theme-cal',
    priority: 2,
    typeName: 'みんなを支える献身サポーター',
    tendency: 'あなたは、自分だけが目立つよりも、チーム全体がうまく回ることに喜びを感じるタイプ。\n誰かが困っていたり、場が崩れそうになった時に「何とか支えたい」と思える人です。\n\n直接ガンガン動くよりも、周りの状況を見てピンチを和らげる動きが得意。\n不慣れな人や焦っている人がいる時ほど、あなたの落ち着きがチームを助けます。',
    affinity: 'キャルは歌でお客さんの待ち時間減少を止められる、チーム全体を守るスキルを持っています。\n自分は一時的に動けなくなりますが、その分、仲間が立て直す時間を作れます。\n\n特に人数が多い時や、他のプレイヤーを支えたい時に活躍しやすいキャラ。\n「自分が支えることでみんなが動きやすくなる」ことにやりがいを感じる人に向いています。',
    recommendations: ['仲間を支えるのが好き', '不慣れな人をフォローしたい', 'ピンチの時に落ち着いて動きたい', 'かわいいキャラを使いたい'],
  },
  {
    id: 'preri',
    name: 'プレリ',
    imagePath: 'assets/characters/preri.png',
    theme: 'theme-preri',
    priority: 3,
    typeName: 'ひらめき重視のテクニカル',
    tendency: 'あなたは、普通のやり方だけでなく「こう使ったら便利かも」と考えるのが好きなタイプ。\n少しクセのあるものでも、自分なりの使い道を見つけることに楽しさを感じます。\n\n最初から簡単に扱えるものより、慣れるほど味が出るキャラや動きに惹かれやすい人です。\n工夫がハマった時の気持ちよさを大事にする、ひらめき型のプレイヤーです。',
    affinity: 'プレリのトンネルは、うまく使えば移動ルートを大きく変えられるユニークなスキル。\n置き場所や向きに工夫が必要ですが、ハマる場面ではかなり効率的に動けます。\n\nシンプルな強さよりも、「自分だけの使い方」を見つけたい人と相性が良いキャラです。\nテクニックや発想で差をつけたいあなたに向いています。',
    recommendations: ['テクニックが必要なキャラが好き', '変わった動きで効率化したい', 'クセのある能力を使いこなしたい', 'かわいい見た目も大事'],
  },
  {
    id: 'rasuku',
    name: 'ラスク',
    imagePath: 'assets/characters/rasuku.png',
    theme: 'theme-rasuku',
    priority: 4,
    typeName: 'クリアを支える皿洗い職人',
    tendency: 'あなたは、派手な活躍だけでなく「今、本当に必要な作業」をきっちり片付けられるタイプ。\n目立つ仕事にこだわらず、チームが詰まらないように裏側から支えられます。\n\n特に、皿不足やホールの混乱など、放置すると一気に崩れるポイントに気づきやすい人です。\n安定してクリアを目指す時に頼られる、堅実なプレイヤーです。',
    affinity: 'ラスクは皿やコップを高速で洗える、実用性の高いスキルを持っています。\n汚れた食器が溜まると提供が止まるため、皿洗いの速さはそのままチームの安定感につながります。\n\n初心者帯でも上級者帯でも、食器管理はとても大事な仕事。\n「地味だけど勝ちに直結する作業」を大切にできるあなたと相性の良いキャラです。',
    recommendations: ['地味でも重要な役割が好き', '状況判断しながら動ける', 'クリア重視でキャラを選びたい', '皿洗いの重要性がわかる'],
  },
  {
    id: 'ane',
    name: 'あね',
    imagePath: 'assets/characters/ane.png',
    theme: 'theme-ane',
    priority: 5,
    typeName: 'タイミングを読む後方支援',
    tendency: 'あなたは、自分が前に出るだけでなく、仲間の力を引き出すことが得意なタイプ。\n周りの動きをよく見て、「今なら支援が効きそう」というタイミングを考えられます。\n\nただ応援するだけではなく、相手が作業に入る前や忙しくなる直前を読める観察力があります。\n息の合ったチームほど、あなたのサポート力が活きやすいです。',
    affinity: 'あねは応援中、周囲の仲間の作業を加速・強化できるサポートキャラです。\n自分は動けなくなりますが、複数人の作業効率を上げられるため、人数が多いほど力を発揮しやすくなります。\n\n仲間の動きを見てタイミングよく使える人ほど、あねの強みを活かせます。\nチーム全体のリズムを整えたいあなたに向いています。',
    recommendations: ['周りの動きをよく見ている', '仲間の作業を助けたい', 'タイミングを読むのが得意', 'チームプレイが好き'],
  },
  {
    id: 'imouto',
    name: 'いもうと',
    imagePath: 'assets/characters/imouto.png',
    theme: 'theme-imouto',
    priority: 6,
    typeName: '気配り上手な環境整備',
    tendency: 'あなたは、目の前の作業だけでなく、みんなが動きやすい環境まで気にできるタイプ。\n直接料理を作るだけではなく、「床が汚れて動きにくい」「このままだと効率が落ちそう」といった変化に気づけます。\n\n忙しい時ほど後回しにされがちな作業を、ちゃんと大事にできる人です。\n小さな気配りでチーム全体の動きを良くする、縁の下の支え役です。',
    affinity: 'いもうとは床掃除を高速で行えるキャラです。\n掃除は誰でもできますが、忙しい場面ではつい後回しになりがちで、放置すると全体の移動効率が落ちます。\n\nだからこそ、掃除の大事さに気づける人が使うとチーム全体がかなり動きやすくなります。\n細かいところまで気を配れるあなたにぴったりです。',
    recommendations: ['マメな性格', 'みんなが動きやすい環境を作りたい', 'ゲーム全体の流れを見られる', '「掃除の大事さ」がわかる'],
  },
  {
    id: 'soncho',
    name: 'そんちょう',
    imagePath: 'assets/characters/soncho.png',
    theme: 'theme-soncho',
    priority: 7,
    typeName: '存在感で場を和ませるロマン',
    tendency: 'あなたは、性能だけでなくキャラの雰囲気や存在感も大事にするタイプ。\n効率を突き詰めるだけではなく、「このキャラで遊びたい」という気持ちを大切にできます。\n\n周りと少し違う選択をしても、それを楽しめる余裕がある人です。\nキャラの見た目や名前の響きも含めて、ゲームを味わえるタイプです。',
    affinity: 'そんちょうは、貫禄のある見た目と独特の存在感が魅力のキャラです。\nスキルの効果は分かりにくい部分がありますが、その分「好きだから使う」という楽しみ方がしやすいキャラでもあります。\n\n性能だけでなく、キャラ愛や雰囲気を大事にしたいあなたと相性が良いです。\n場にちょっとした味を出してくれる、ロマンのある選択です。',
    recommendations: ['性能だけでなく見た目も大事にしたい', '渋いキャラが好き', 'キャラの雰囲気を楽しみたい', '堂々とした存在感が好き'],
  },
  {
    id: 'kureru',
    name: 'クレル',
    imagePath: 'assets/characters/kureru.png',
    theme: 'theme-kureru',
    priority: 8,
    typeName: '快適さ重視ののんびり効率化',
    tendency: 'あなたは、派手に目立つよりも、ちょっとした作業をスムーズにすることに心地よさを感じるタイプ。\n大きな逆転よりも、「この手間が減ると楽だな」という細かい効率化が好きです。\n\n無理に前へ出るより、自分のペースで確実に役立つ動きをするのが得意。\n穏やかにチームを支える、安定感のあるプレイヤーです。',
    affinity: 'クレルは木の実を一気に落とせる、リンゴ回収を快適にしてくれるキャラです。\n必須級の派手なスキルではありませんが、使うと作業がスムーズになり、細かいストレスを減らせます。\n\n「少しでも楽に、少しでも効率よく」を大事にするあなたに向いています。\nかわいらしい見た目も含めて、気軽に選びやすいキャラです。',
    recommendations: ['かわいいキャラが好き', '小さな効率化が好き', '無難に役立つ能力を選びたい', 'トレジャー作業を快適にしたい'],
  },
  {
    id: 'monoshiri_jii',
    name: 'ものしりじいさん',
    imagePath: 'assets/characters/monoshiri_jii.png',
    theme: 'theme-monoshiri_jii',
    priority: 9,
    typeName: '渋く支える畑の管理人',
    tendency: 'あなたは、目立つ作業だけでなく、放っておくと後で困る問題を先に片付けられるタイプ。\nすぐに成果が見えにくい仕事でも、全体の流れを良くするためなら丁寧に取り組めます。\n\n少しお茶目な雰囲気や渋いキャラ性も楽しめる人です。\nただの効率重視ではなく、キャラの味も含めて遊べる余裕があります。',
    affinity: 'ものしりじいさんは雑草を高速で抜ける、ファーム管理に向いたキャラです。\n雑草が増えると作物の成長に影響するため、早めに整えることで全体の攻略を支えられます。\n\n派手なスキルではありませんが、畑の状態を整えることはとても重要です。\n地味な管理作業の価値をわかっているあなたと相性が良いキャラです。',
    recommendations: ['ファームの重要性がわかる', '地味な管理作業が苦にならない', 'お茶目・陽気なキャラが好き', '渋い見た目に惹かれる'],
  },
  {
    id: 'otokonoko',
    name: 'おとこのこ',
    imagePath: 'assets/characters/otokonoko.png',
    theme: 'theme-otokonoko',
    priority: 10,
    typeName: '混雑をすり抜ける機動力',
    tendency: 'あなたは、人が多い場所や狭い場所でも、自分のルートを見つけて動けるタイプ。\n混雑していてもただ止まるのではなく、「どう抜ければ早いか」を考えながら動けます。\n\nテンポよく仕事を進めたい気持ちが強く、渋滞やぶつかり合いをうまく避けたい人です。\n少しテクニカルでも、慣れて使いこなすことに楽しさを感じます。',
    affinity: 'おとこのこは、移動中に他プレイヤーや一部の虫との接触を避けられるスキルを持っています。\n狭いキッチンや人が行き交う導線で、うまく使うとかなり快適に動けます。\n\n発動には少し慣れが必要ですが、使いこなせると混雑に強いキャラになります。\nテキパキ動きたいあなたと相性の良い、機動力重視のキャラです。',
    recommendations: ['テキパキ動きたい', '人混みや渋滞がストレス', '少しテクニカルな能力が好き', '小さくてかわいい見た目が好き'],
  },
  {
    id: 'shokuryo2',
    name: 'しょくりょう2',
    imagePath: 'assets/characters/shokuryo2.png',
    theme: 'theme-shokuryo2',
    priority: 11,
    typeName: '畑を支える縁の下の力持ち',
    tendency: 'あなたは、チームの土台を作る役割に向いているタイプ。\n目立つ作業だけではなく、食材供給のように全体を支える仕事の大切さを理解できます。\n\nファームは地味に見えて、止まると全体が止まる重要な役割。\nそこを任されても丁寧にこなせる、安定感のあるプレイヤーです。',
    affinity: 'しょくりょう2は畑を高速で耕せる、ファーム寄りのキャラです。\n特に序盤の畑拡張や立ち上げをスムーズにできるため、食材供給の基盤作りに向いています。\n\n活躍する場面はファーム中心ですが、その分、役割がハマった時の安心感があります。\nチームの土台を支えることにやりがいを感じるあなたに合っています。',
    recommendations: ['ファーム作業が好き', '地味でも重要な仕事をしたい', 'チームの土台を支えたい', '見た目より役割で選びたい'],
  },
  {
    id: 'bit',
    name: 'ビット',
    imagePath: 'assets/characters/bit.png',
    theme: 'theme-bit',
    priority: 12,
    typeName: '障害物を飛び越えるアクティブ',
    tendency: 'あなたは、止まって考えるよりも、自分から動いて道を切り開くタイプ。\n障害物や混雑があっても、「別のルートで行けるかも」と前向きに動けます。\n\n狭い場所や忙しい場面でも、テンポよく作業を進めたい気持ちが強い人です。\n少しクセのある移動でも、慣れて使いこなすことに楽しさを感じます。',
    affinity: 'ビットはジャンプで障害物や段差を越えられるキャラです。\nキッチン周りの障害物や床の汚れを越えながら動けるため、混雑した場面で強みを出しやすいです。\n\n台の上を使った動きなど、工夫次第で独特の立ち回りもできます。\nアクティブに動き回りたいあなたと相性の良いキャラです。',
    recommendations: ['アクティブに動きたい', '狭い場所でも仕事を進めたい', '障害物を避ける動きが好き', 'ちょっとクセのある移動スキルが好き'],
  },
  {
    id: 'shokuryo1',
    name: 'しょくりょう1',
    imagePath: 'assets/characters/shokuryo1.png',
    theme: 'theme-shokuryo1',
    priority: 13,
    typeName: '見た目とノリで楽しむエンジョイ',
    tendency: 'あなたは、効率だけでなく、キャラの見た目や遊び心も大切にするタイプ。\n最適解だけを追うよりも、「このキャラで遊んだら楽しそう」という気持ちを大事にできます。\n\n難しい動きやクセのある能力も、楽しみながら試せる人です。\nゲームをただクリアするだけでなく、場の雰囲気やロマンも含めて味わえるタイプです。',
    affinity: 'しょくりょう1は完成した料理を客席へ投げ渡せる、かなり個性的なスキルを持っています。\n条件や狙いは少し難しいですが、うまく決まった時の気持ちよさがあります。\n\n安定重視というより、遊び心やキャラの雰囲気を楽しみたい人に向いています。\n自分の好きなキャラで楽しく遊びたいあなたと相性が良いです。',
    recommendations: ['エンジョイ寄りで遊びたい', '見た目でキャラを選びたい', '難しい能力もネタとして楽しめる', 'クリア余裕なら遊び心を入れたい'],
  },
  {
    id: 'okojo',
    name: 'オコジョ',
    imagePath: 'assets/characters/okojo.png',
    theme: 'theme-okojo',
    priority: 14,
    typeName: '存在感のある遠投サポート',
    tendency: 'あなたは、自分の存在感を出しながらも、チームの役に立つ動きができるタイプ。\n前に出るだけではなく、遠くへ食材を届けるようなサポートにも面白さを感じます。\n\n多少ダイナミックな動きでも、うまくハマれば大きく流れを変えられると考えられる人です。\n大きな見た目や派手な動きも含めて楽しめる、のびのびしたプレイヤーです。',
    affinity: 'オコジョは長距離に物を投げられるキャラです。\n畑の収穫物をキッチンへ送ったり、魚や卵を寄せたりと、使い方次第でチームの移動時間を減らせます。\n\n投げる先を考える必要はありますが、うまく使えるとかなり便利です。\nダイナミックに動きつつ、裏方サポートもしたいあなたに向いています。',
    recommendations: ['目立つキャラが好き', '大きいキャラでも気にしない', '投げる作業が好き', '裏方サポートでも活躍したい'],
  },
  {
    id: 'nezumi',
    name: 'ネズミ',
    imagePath: 'assets/characters/nezumi.png',
    theme: 'theme-nezumi',
    priority: 15,
    typeName: 'おちゃめな後半職人',
    tendency: 'あなたは、少しクセのあるキャラや雰囲気を楽しめるタイプ。\n見た目の個性やユーモアも含めて、キャラ選びを楽しめます。\n\n一見ふざけているように見えても、必要な場面ではきちんと役割を果たせる人です。\n後半でじわじわ活躍するような、知る人ぞ知る強みを好む傾向があります。',
    affinity: 'ネズミは魚を素早く釣り上げられる、釣り担当に向いたキャラです。\n魚の需要が出てくる後半ほど便利さが増し、釣りにかかる時間を大きく短縮できます。\n\n見た目の個性を楽しみつつ、必要な場面でしっかり役立てるキャラです。\nおちゃめさと実用性の両方を楽しみたいあなたに向いています。',
    recommendations: ['おちゃめなキャラが好き', '見た目のクセを楽しみたい', '後半で活躍する能力が好き', '釣り作業を快適にしたい'],
  },
  {
    id: 'byokuka',
    name: 'びしょくか',
    imagePath: 'assets/characters/bisyokuka.png',
    theme: 'theme-byokuka',
    priority: 16,
    typeName: 'わかる人にはわかる玄人',
    tendency: 'あなたは、目立つ作業だけでなく、攻略の流れを支える重要ポイントに気づけるタイプ。\n初心者には見えにくい問題でも、「ここが遅れると後で崩れる」と先回りして考えられます。\n\n派手な活躍よりも、チームが詰まる原因を減らすことにやりがいを感じる人です。\nゲーム理解が深くなるほど、自分の役割の大事さを実感できるタイプです。',
    affinity: 'びしょくかは虫の居場所を探知できる、後半で強みが出やすいキャラです。\nチーズやミルクなどの素材が必要になる場面では、虫探しの時間短縮がそのまま攻略の安定につながります。\n\n一見わかりにくい能力ですが、素材調達の遅れを防げるのは大きな強みです。\n先を読んでチームを支えたいあなたに向いています。',
    recommendations: ['玄人向けキャラが好き', '後半の難所を支えたい', '素材調達の遅れを防ぎたい', '渋いキャラを使いたい'],
  },
];

/* ----------------------------------------
   ④ 質問と選択肢・ポイント加算表
      scores: { キャラid: 加算ポイント }
   ---------------------------------------- */
const QUESTIONS = [
  {
    text: 'Q1. 忙しくなってきた時、あなたが一番気になるのは？',
    choices: [
      {
        label: 'A. 「どこが一番手薄か」を見て動く',
        scores: { kyle: 1, bit: 1, okojo: 1, cal: 1 },
      },
      {
        label: 'B. 目の前の作業をテンポ良く片付ける',
        scores: { rasuku: 2, otokonoko: 1, kureru: 1 },
      },
      {
        label: 'C. 周りが動きやすい空気を作る',
        scores: { cal: 1, ane: 2, imouto: 2 },
      },
      {
        label: 'D. もっと効率いい動きがないか探したくなる',
        scores: { preri: 1, byokuka: 2, okojo: 1, bit: 1 },
      },
    ],
  },
  {
    text: 'Q2. ゲーム中、一番テンションが上がる瞬間は？',
    choices: [
      {
        label: 'A. 走り回ってうまく回せた時',
        scores: { bit: 2, kyle: 1, otokonoko: 2 },
      },
      {
        label: 'B. ピンチを立て直せた時',
        scores: { cal: 1, rasuku: 2, ane: 1 },
      },
      {
        label: 'C. 裏方作業がちゃんと機能した時',
        scores: { shokuryo2: 2, monoshiri_jii: 2, imouto: 1 },
      },
      {
        label: 'D. 変わった動きや作戦がハマった時',
        scores: { preri: 1, okojo: 2, shokuryo1: 2, nezumi: 1 },
      },
    ],
  },
  {
    text: 'Q3. キャラを選ぶ時、つい重視してしまうのは？',
    choices: [
      {
        label: 'A. 安定して使いやすいこと',
        scores: { kyle: 1, rasuku: 2, kureru: 2 },
      },
      {
        label: 'B. 仲間を助けやすいこと',
        scores: { cal: 1, ane: 2, imouto: 2 },
      },
      {
        label: 'C. 使いこなす楽しさがあること',
        scores: { preri: 1, bit: 2, otokonoko: 2 },
      },
      {
        label: 'D. 「このキャラ好きだな」と思えること',
        scores: { soncho: 3, shokuryo1: 2, nezumi: 2 },
      },
    ],
  },
  {
    text: 'Q4. チームで遊ぶ時、自然とやりがちなことは？',
    choices: [
      {
        label: 'A. 足りない場所を埋めに行く',
        scores: { kyle: 1, bit: 1, okojo: 2 },
      },
      {
        label: 'B. 誰かのサポートやフォローをする',
        scores: { cal: 1, ane: 2, imouto: 2 },
      },
      {
        label: 'C. 地味だけど必要な作業を片付ける',
        scores: { rasuku: 1, monoshiri_jii: 2, shokuryo2: 2 },
      },
      {
        label: 'D. 自分なりの効率ルートを探す',
        scores: { preri: 1, otokonoko: 2, byokuka: 2 },
      },
    ],
  },
  {
    text: 'Q5. 作業場が混雑している時、あなたは？',
    choices: [
      {
        label: 'A. とにかく自分で突破して動き続ける',
        scores: { otokonoko: 2, bit: 2, kyle: 1 },
      },
      {
        label: 'B. 周りとぶつからないように合わせる',
        scores: { kureru: 3, cal: 1, nezumi: 2 },
      },
      {
        label: 'C. 混雑の原因そのものを減らしたくなる',
        scores: { imouto: 3, rasuku: 1, ane: 1, monoshiri_jii: 1 },
      },
      {
        label: 'D. 普通と違うルートを試したくなる',
        scores: { preri: 1, okojo: 2, shokuryo1: 2 },
      },
    ],
  },
  {
    text: 'Q6. 地味な作業について、あなたの感覚に近いのは？',
    choices: [
      {
        label: 'A. 必要なら普通にやる',
        scores: { rasuku: 2, kyle: 1, kureru: 1 },
      },
      {
        label: 'B. 誰かがやってくれると助かる',
        scores: { nezumi: 1, soncho: 2, shokuryo1: 1 },
      },
      {
        label: 'C. 安定のためにはかなり重要だと思う',
        scores: { monoshiri_jii: 2, byokuka: 2, shokuryo2: 2 },
      },
      {
        label: 'D. 効率化できるとちょっと楽しい',
        scores: { preri: 1, bit: 2, okojo: 2 },
      },
    ],
  },
  {
    text: 'Q7. ミスやトラブルが起きた時、あなたは？',
    choices: [
      {
        label: 'A. すぐ動いてリカバリーする',
        scores: { kyle: 1, bit: 1, rasuku: 2 },
      },
      {
        label: 'B. 周りを落ち着かせようとする',
        scores: { cal: 1, ane: 2, kureru: 1 },
      },
      {
        label: 'C. 「なんで起きたか」を気にする',
        scores: { byokuka: 2, monoshiri_jii: 2, shokuryo2: 1 },
      },
      {
        label: 'D. 笑って切り替えるタイプ',
        scores: { nezumi: 3, soncho: 2, shokuryo1: 2 },
      },
    ],
  },
  {
    text: 'Q8. あなたが好きなのはどんな役割？',
    choices: [
      {
        label: 'A. 走り回る便利屋タイプ',
        scores: { kyle: 1, bit: 2, otokonoko: 2 },
      },
      {
        label: 'B. 周りを支えるサポートタイプ',
        scores: { cal: 1, ane: 2, imouto: 2 },
      },
      {
        label: 'C. 流れを整える管理タイプ',
        scores: { rasuku: 1, shokuryo2: 2, monoshiri_jii: 2 },
      },
      {
        label: 'D. クセがあるテクニカルタイプ',
        scores: { preri: 1, okojo: 2, byokuka: 2 },
      },
    ],
  },
  {
    text: 'Q9. 初めてのステージでは、まずどうする？',
    choices: [
      {
        label: 'A. とりあえず動きながら覚える',
        scores: { kyle: 1, bit: 2, nezumi: 1 },
      },
      {
        label: 'B. 周りに合わせながら様子を見る',
        scores: { cal: 1, ane: 1, kureru: 2 },
      },
      {
        label: 'C. 仕組みや流れを先に理解したい',
        scores: { byokuka: 2, monoshiri_jii: 2, shokuryo2: 2 },
      },
      {
        label: 'D. 面白そうな動きを試したくなる',
        scores: { preri: 1, okojo: 2, shokuryo1: 2, nezumi: 2 },
      },
    ],
  },
  {
    text: 'Q10. 最後に、キャラ選びで一番近い感覚は？',
    choices: [
      {
        label: 'A. 「使いやすい」が一番大事',
        scores: { kyle: 1, rasuku: 2, kureru: 2 },
      },
      {
        label: 'B. チームに貢献できると嬉しい',
        scores: { cal: 1, ane: 2, imouto: 2 },
      },
      {
        label: 'C. わかる人には強いキャラが好き',
        scores: { byokuka: 3, preri: 1, otokonoko: 2 },
      },
      {
        label: 'D. 性能より雰囲気やロマンを重視したい',
        scores: { soncho: 3, shokuryo1: 2, nezumi: 2 },
      },
    ],
  },
];

/* ========================================
   以下はロジック部分。通常は編集不要です。
   ======================================== */

const TOTAL_Q = QUESTIONS.length;

let currentQ = 0;          // 現在の質問インデックス
let answers  = new Array(TOTAL_Q).fill(null); // 各問の選択インデックス

/* ---- DOM参照 ---- */
const screens = {
  title:   document.getElementById('screen-title'),
  quiz:    document.getElementById('screen-quiz'),
  loading: document.getElementById('screen-loading'),
  result:  document.getElementById('screen-result'),
};

const elQCurrent     = document.getElementById('q-current');
const elProgressBar  = document.getElementById('progress-bar');
const elQuestionText = document.getElementById('question-text');
const elChoicesList  = document.getElementById('choices-list');
const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');

/* ---- 画面切り替え ---- */
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- タイトル → クイズ ---- */
document.getElementById('btn-start').addEventListener('click', () => {
  currentQ = 0;
  answers  = new Array(TOTAL_Q).fill(null);
  showScreen('quiz');
  renderQuestion();
});

/* ---- ナビゲーション ---- */
btnPrev.addEventListener('click', () => {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
});

btnNext.addEventListener('click', () => {
  if (answers[currentQ] === null) return; // 未選択ガード
  if (currentQ < TOTAL_Q - 1) {
    currentQ++;
    renderQuestion();
  } else {
    startLoading();
  }
});

/* ---- やり直し ---- */
document.getElementById('btn-restart-quiz').addEventListener('click', resetToTitle);
document.getElementById('btn-retry').addEventListener('click', resetToTitle);

function resetToTitle() {
  currentQ = 0;
  answers  = new Array(TOTAL_Q).fill(null);
  // 結果テーマのクリア
  document.getElementById('result-container').parentElement.className = '';
  showScreen('title');
}

/* ---- 質問レンダリング ---- */
function renderQuestion() {
  const q = QUESTIONS[currentQ];

  // プログレス
  elQCurrent.textContent   = currentQ + 1;
  const pct = ((currentQ + 1) / TOTAL_Q) * 100;
  elProgressBar.style.width = pct + '%';

  // 質問文
  elQuestionText.textContent = q.text;

  // 選択肢
  elChoicesList.innerHTML = '';
  q.choices.forEach((choice, idx) => {
    const label = document.createElement('label');
    label.className = 'choice-item';

    const radio = document.createElement('input');
    radio.type    = 'radio';
    radio.name    = 'choice';
    radio.value   = idx;
    radio.checked = (answers[currentQ] === idx);
    radio.addEventListener('change', () => {
      answers[currentQ] = idx;
      updateNextButton();
    });

    const labelInner = document.createElement('span');
    labelInner.className = 'choice-label';

    const dot = document.createElement('span');
    dot.className = 'choice-radio-dot';

    const text = document.createElement('span');
    text.className = 'choice-text';
    text.textContent = choice.label;

    labelInner.appendChild(dot);
    labelInner.appendChild(text);
    label.appendChild(radio);
    label.appendChild(labelInner);
    elChoicesList.appendChild(label);
  });

  // ボタン状態
  btnPrev.disabled = (currentQ === 0);
  updateNextButton();

  // 最終問は「次の質問へ」→「結果を見る」
  btnNext.textContent = (currentQ === TOTAL_Q - 1) ? '結果を見る →' : '次の質問へ →';
}

function updateNextButton() {
  btnNext.disabled = (answers[currentQ] === null);
}

/* ---- ローディング演出 ---- */
function startLoading() {
  showScreen('loading');
  const delay = 800 + Math.random() * 700; // 0.8〜1.5秒
  setTimeout(showResult, delay);
}

/* ---- 集計 & 結果表示 ---- */
function calcScores() {
  const totals = {};
  CHARACTERS.forEach(c => { totals[c.id] = 0; });

  answers.forEach((choiceIdx, qIdx) => {
    if (choiceIdx === null) return;
    const scoreMap = QUESTIONS[qIdx].choices[choiceIdx].scores;
    Object.entries(scoreMap).forEach(([id, pts]) => {
      if (totals[id] !== undefined) totals[id] += pts;
    });
  });

  return totals;
}

function getWinner(totals) {
  // priorityの小さい順(= CHARACTERS配列の並び順)で比較
  let winner = CHARACTERS[0];
  CHARACTERS.forEach(c => {
    if (totals[c.id] > totals[winner.id]) {
      winner = c;
    } else if (
      totals[c.id] === totals[winner.id] &&
      c.priority < winner.priority
    ) {
      winner = c;
    }
  });
  return winner;
}

function showResult() {
  const totals  = calcScores();
  const winner  = getWinner(totals);

  // テーマクラスをbodyに付与
  const resultSection = document.getElementById('screen-result');
  // 旧テーマ除去
  CHARACTERS.forEach(c => resultSection.classList.remove(c.theme));
  resultSection.classList.add(winner.theme);

  // キャラ名・タイプ名
  document.getElementById('result-character-name').textContent = winner.name;
  document.getElementById('result-type-name').textContent = '「' + winner.typeName + '」タイプ';

  // 傾向・相性（改行対応）
  document.getElementById('result-tendency').innerHTML =
    winner.tendency.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  document.getElementById('result-affinity').innerHTML =
    winner.affinity.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

  // こんな人におすすめ（箇条書き）
  const recEl = document.getElementById('result-recommendations');
  recEl.innerHTML = '';
  winner.recommendations.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    recEl.appendChild(li);
  });

  // 画像
  const img         = document.getElementById('result-character-img');
  const placeholder = document.getElementById('result-character-placeholder');
  img.classList.remove('loaded');
  placeholder.classList.remove('hidden');
  img.alt = winner.name;
  img.src = winner.imagePath;
  img.onload  = () => { img.classList.add('loaded'); placeholder.classList.add('hidden'); };
  img.onerror = () => { img.classList.remove('loaded'); placeholder.classList.remove('hidden'); };

  // シェアボタン
  document.getElementById('btn-share').onclick = () => shareToX(winner.name);

  // デバッグ：上位5キャラの点数表示
  const debugEl = document.getElementById('debug-scores');
  if (DEBUG_MODE) {
    const ranked = CHARACTERS
      .map(c => ({ name: c.name, score: totals[c.id], priority: c.priority }))
      .sort((a, b) => b.score - a.score || a.priority - b.priority)
      .slice(0, 5);
    debugEl.innerHTML = ranked
      .map((c, i) => `<li><span class="debug-rank">${i + 1}位</span><span class="debug-name">${c.name}</span><span class="debug-score">${c.score}点</span></li>`)
      .join('');
    debugEl.parentElement.style.display = 'block';
  } else {
    debugEl.parentElement.style.display = 'none';
  }

  showScreen('result');
}

/* ---- Xシェア ---- */
function shareToX(charName) {
  const text = SHARE_TEXT_TEMPLATE.replace('{name}', charName);
  const url  = encodeURIComponent(SHARE_URL);
  const t    = encodeURIComponent(text);
  window.open(`https://x.com/intent/tweet?text=${t}&url=${url}`, '_blank', 'noopener');
}
