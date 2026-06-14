import type { Locale } from './index'

export interface UIStrings {
  // 题签
  subtitle: string
  sourcesLink: string
  // 引导
  introTitle: string
  introBody: string
  introList: string[]
  introBtn: string
  // 滑杆
  presetNow: string
  presetOverlay: string
  presetTang: string
  endNow: string
  endTang: string
  dockCaption: string
  sliderAria: string
  // 寻迹面板
  panelTitle: string
  panelSubtitle: string
  panelCollapse: string
  panelFooter: string
  tagNow: string
  tagTang: string
  // 弹窗
  popLocatedEyebrow: string // “此地，唐时在”
  popLore: string // “典”
  popSiteEyebrow: string // “唐迹 · 今已不存”
  popNowPrefix: string // “今 · ”
  popTangPrefix: string // “唐 · ”
  zoneTag: Record<string, string> // ward/palace/market/water/garden/street/city/outskirts
  wardGeneric: string // 无典故坊的兜底解说
  // 语言切换
  langLabel: string
  // 舆图考
  kao: {
    back: string
    title: string
    lede: string
    h1: string
    sources: string[]
    h2: string
    anchorsIntro: string
    anchors: string[]
    verify: string
    h3: string
    notes: string[]
    colophon: string
  }
}

export const UI: Record<Locale, UIStrings> = {
  // ─────────────────────────────────────── English ───
  en: {
    subtitle: 'Thirteen centuries, two cities, on one map',
    sourcesLink: 'Sources & Notes',
    introTitle: "Welcome to Chang'an",
    introBody:
      "This map lays Tang-dynasty Chang'an over today's Xi'an at real coordinates — its 110 wards, two great markets and three palace complexes, all drawn from the Chang'an Zhi and Tang Liu Dian.",
    introList: [
      'Drag the coin slider below to travel between now and the Tang',
      "Tap anywhere to see which Tang ward you're standing in",
      'The "Then & Now" panel lists sixteen places you can still visit today',
    ],
    introBtn: 'Enter',
    presetNow: "Today's Xi'an",
    presetOverlay: 'Overlay',
    presetTang: "Tang Chang'an",
    endNow: "Now · Xi'an",
    endTang: "Tang · Chang'an",
    dockCaption: 'Drag the coin across 1,300 years',
    sliderAria: "Time slider: blend between modern Xi'an and Tang Chang'an",
    panelTitle: 'Then & Now',
    panelSubtitle: "Sixteen places of Chang'an you can still reach",
    panelCollapse: 'Collapse',
    panelFooter: 'Tap anywhere on the map to learn its Tang-era ward name',
    tagNow: 'Now',
    tagTang: 'Tang',
    popLocatedEyebrow: 'In the Tang, this spot was in',
    popLore: 'Lore',
    popSiteEyebrow: 'Tang landmark · no longer standing',
    popNowPrefix: 'Now · ',
    popTangPrefix: 'Tang · ',
    zoneTag: {
      ward: 'Ward',
      palace: 'Palace',
      market: 'Market',
      water: 'Water',
      garden: 'Garden',
      street: 'Street',
      city: 'City',
      outskirts: 'Outskirts',
    },
    wardGeneric: "A residential ward of Tang Chang'an, part of its great chessboard of walled neighborhoods.",
    langLabel: 'Language',
    kao: {
      back: '‹ Back to map',
      title: 'Sources & Notes',
      lede: "This is an illustrative reconstruction: the chessboard layout of Tang Chang'an is registered, at true scale and orientation, onto the longitude and latitude of modern Xi'an, so travelers can find their bearings. Ward boundaries and streets are approximate and should not be taken as archaeological evidence.",
      h1: 'Textual sources',
      sources: [
        'Tang Liu Dian (唐六典): "South of the imperial city, ten wards east–west and nine north–south; twelve wards on each side; the two markets occupy four wards — one hundred and ten wards in all."',
        'Chang\'an Zhi (長安志, by Song Minqiu, Song dynasty), vols. 7–10: the names and order of the wards along the five avenues east and west of Zhuque Avenue.',
        "The outer city measured about 9,721 m east–west and 8,652 m north–south; palace, imperial-city and ward dimensions follow the prevailing archaeological measurements.",
      ],
      h2: 'Registration anchors',
      anchorsIntro:
        'The following Tang remains still stand on their original sites; the whole city is positioned from them (WGS84):',
      anchors: [
        'Mingde Gate ruins — the main south gate, fixing the Zhuque Avenue axis and the south wall;',
        'Hanguang Gate ruins (on the Xi\'an city wall) — the Tang imperial city\'s south wall, which the Ming wall sits directly atop;',
        'Danfeng Gate ruins — the main gate of Daming Palace, fixing the north wall line.',
      ],
      verify:
        'After registration, many landmarks fall into place of their own accord: the Giant Wild Goose Pagoda lands in Jinchang ward (Da Ci\'en Temple), the Small Wild Goose Pagoda in the northwest of Anren ward (matching the recorded position of the Jianfu pagoda court), Da Xingshan Temple at the center of Jingshan ward, Qinglong Temple in Xinchang ward, and the Tang West Market Museum directly on the old West Market — thirteen centuries of the city\'s grain, verified here.',
      h3: 'A few things to know',
      notes: [
        'Ward names follow the order in the Chang\'an Zhi; a few wards (e.g. the two northernmost on the first avenue west of Zhuque) are recorded differently across sources — one reading is chosen.',
        'The shapes of the Qujiang Pool, Dragon Pool and Taiye Pool are stylized; the bounds of the Furong Garden take the rough "two wards in the southeast corner."',
        'Daming Palace was in fact an irregular shape; it is shown here as a trapezoid, with only Hanyuan Hall marked.',
        'The basemap is OpenStreetMap / CARTO, sharing WGS84 with the reconstruction — no coordinate offset.',
      ],
      colophon: "Chang'an map · reconstructed after Song Minqiu's Chang'an Zhi and prevailing archaeology",
    },
  },

  // ─────────────────────────────────── 简体中文 ───
  'zh-CN': {
    subtitle: '一千三百年，两座城，叠于一图',
    sourcesLink: '舆图考',
    introTitle: '欢迎来到长安',
    introBody:
      '这张图把唐代长安城按真实坐标叠在今日西安的街道上——一百一十坊、东西两市、三大内，皆考之于《长安志》《唐六典》。',
    introList: [
      '拖动下方铜钱滑杆，在今与唐之间穿越',
      '点击地图任意处，看你脚下是唐代哪一坊',
      '右侧「古今寻迹」，是十六处今天仍能抵达的长安',
    ],
    introBtn: '入 城',
    presetNow: '现代西安',
    presetOverlay: '双城对照',
    presetTang: '大唐长安',
    endNow: '今 · 西安',
    endTang: '唐 · 長安',
    dockCaption: '拖动铜钱，穿越一千三百年',
    sliderAria: '时空滑杆：在现代西安与唐代长安之间切换',
    panelTitle: '古今寻迹',
    panelSubtitle: '十六处可亲身抵达的长安',
    panelCollapse: '收起',
    panelFooter: '点击地图任意一处，可知它在唐代的坊名',
    tagNow: '今',
    tagTang: '唐',
    popLocatedEyebrow: '此地，唐时在',
    popLore: '典',
    popSiteEyebrow: '唐迹 · 今已不存',
    popNowPrefix: '今 · ',
    popTangPrefix: '唐 · ',
    zoneTag: {
      ward: '坊', palace: '宫', market: '市', water: '水',
      garden: '苑', street: '街', city: '城', outskirts: '郊',
    },
    wardGeneric: '唐长安的棋盘坊里之一。"百千家似围棋局，十二街如种菜畦。"',
    langLabel: '语言',
    kao: {
      back: '‹ 返回舆图',
      title: '舆图考',
      lede:
        '本图为示意性复原：将唐长安城的棋盘格局按真实尺度与方位，配准到现代西安的经纬度之上，供行旅之人按图索骥。坊界街衢取其大略，未可作考古之据。',
      h1: '所据文献',
      sources: [
        '《唐六典》：「皇城之南，东西十坊，南北九坊；皇城之东西各十二坊，两市居四坊之地，凡一百一十坊。」',
        '《长安志》（宋 · 宋敏求）卷七至卷十：朱雀街东西各五街诸坊之名与次第。',
        '外郭城东西约 9721 米、南北约 8652 米，宫城、皇城及坊市尺度取诸考古实测通说。',
      ],
      h2: '配准锚点',
      anchorsIntro: '以下唐代遗址今日尚存，原址未移，本图据此定位整座唐城（WGS84 坐标）：',
      anchors: [
        '明德门遗址——郭城正南门，定朱雀大街轴线与南墙；',
        '含光门遗址（西安城墙含光门段）——唐皇城南墙，明城墙正压其上；',
        '丹凤门遗址——大明宫正门，定北墙一线。',
      ],
      verify:
        '配准之后，诸多名胜不期而合：大雁塔恰落晋昌坊（大慈恩寺），小雁塔恰在安仁坊西北隅（与《长安志》所记塔院方位相符），大兴善寺恰据靖善坊之中，青龙寺恰在新昌坊，大唐西市博物馆恰压西市原址——千年城脉，于此可验。',
      h3: '几处须知',
      notes: [
        '坊名从《长安志》之次第；个别坊（如朱雀街西第一街最北二坊）诸书互异，从其一说。',
        '曲江池、龙池、太液池水形为意写；芙蓉园界域取「东南隅两坊之地」之约略。',
        '大明宫平面实为不规则形，图中以梯形示意；诸殿仅标含元殿。',
        '底图为 OpenStreetMap / CARTO，与唐城同用 WGS84，无偏移之虞。',
      ],
      colophon: '长安舆图 · 据宋敏求《长安志》及今考古通说复原',
    },
  },

  // ─────────────────────────────────── 繁體中文 ───
  'zh-TW': {
    subtitle: '一千三百年，兩座城，疊於一圖',
    sourcesLink: '輿圖考',
    introTitle: '歡迎來到長安',
    introBody:
      '這張圖把唐代長安城按真實座標疊在今日西安的街道上——一百一十坊、東西兩市、三大內，皆考之於《長安志》《唐六典》。',
    introList: [
      '拖動下方銅錢滑桿，在今與唐之間穿越',
      '點擊地圖任意處，看你腳下是唐代哪一坊',
      '右側「古今尋蹟」，是十六處今天仍能抵達的長安',
    ],
    introBtn: '入 城',
    presetNow: '現代西安',
    presetOverlay: '雙城對照',
    presetTang: '大唐長安',
    endNow: '今 · 西安',
    endTang: '唐 · 長安',
    dockCaption: '拖動銅錢，穿越一千三百年',
    sliderAria: '時空滑桿：在現代西安與唐代長安之間切換',
    panelTitle: '古今尋蹟',
    panelSubtitle: '十六處可親身抵達的長安',
    panelCollapse: '收起',
    panelFooter: '點擊地圖任意一處，可知它在唐代的坊名',
    tagNow: '今',
    tagTang: '唐',
    popLocatedEyebrow: '此地，唐時在',
    popLore: '典',
    popSiteEyebrow: '唐蹟 · 今已不存',
    popNowPrefix: '今 · ',
    popTangPrefix: '唐 · ',
    zoneTag: {
      ward: '坊', palace: '宮', market: '市', water: '水',
      garden: '苑', street: '街', city: '城', outskirts: '郊',
    },
    wardGeneric: '唐長安的棋盤坊里之一。「百千家似圍棋局，十二街如種菜畦。」',
    langLabel: '語言',
    kao: {
      back: '‹ 返回輿圖',
      title: '輿圖考',
      lede:
        '本圖為示意性復原：將唐長安城的棋盤格局按真實尺度與方位，配準到現代西安的經緯度之上，供行旅之人按圖索驥。坊界街衢取其大略，未可作考古之據。',
      h1: '所據文獻',
      sources: [
        '《唐六典》：「皇城之南，東西十坊，南北九坊；皇城之東西各十二坊，兩市居四坊之地，凡一百一十坊。」',
        '《長安志》（宋 · 宋敏求）卷七至卷十：朱雀街東西各五街諸坊之名與次第。',
        '外郭城東西約 9721 公尺、南北約 8652 公尺，宮城、皇城及坊市尺度取諸考古實測通說。',
      ],
      h2: '配準錨點',
      anchorsIntro: '以下唐代遺址今日尚存，原址未移，本圖據此定位整座唐城（WGS84 座標）：',
      anchors: [
        '明德門遺址——郭城正南門，定朱雀大街軸線與南牆；',
        '含光門遺址（西安城牆含光門段）——唐皇城南牆，明城牆正壓其上；',
        '丹鳳門遺址——大明宮正門，定北牆一線。',
      ],
      verify:
        '配準之後，諸多名勝不期而合：大雁塔恰落晉昌坊（大慈恩寺），小雁塔恰在安仁坊西北隅（與《長安志》所記塔院方位相符），大興善寺恰據靖善坊之中，青龍寺恰在新昌坊，大唐西市博物館恰壓西市原址——千年城脈，於此可驗。',
      h3: '幾處須知',
      notes: [
        '坊名從《長安志》之次第；個別坊（如朱雀街西第一街最北二坊）諸書互異，從其一說。',
        '曲江池、龍池、太液池水形為意寫；芙蓉園界域取「東南隅兩坊之地」之約略。',
        '大明宮平面實為不規則形，圖中以梯形示意；諸殿僅標含元殿。',
        '底圖為 OpenStreetMap / CARTO，與唐城同用 WGS84，無偏移之虞。',
      ],
      colophon: '長安輿圖 · 據宋敏求《長安志》及今考古通說復原',
    },
  },

  // ─────────────────────────────────────── 日本語 ───
  ja: {
    subtitle: '千三百年、二つの都市を一枚の地図に',
    sourcesLink: '典拠と注',
    introTitle: '長安へようこそ',
    introBody:
      'この地図は、唐代の長安城を実座標で今日の西安の街路に重ねたものです。百十の坊、東西の二市、三つの宮城——いずれも『長安志』『唐六典』に拠ります。',
    introList: [
      '下の銅銭スライダーを動かし、今と唐の間を行き来する',
      '地図のどこかをタップし、足元が唐代のどの坊かを見る',
      '「今と昔」パネルは、今日も訪れられる長安を十六か所',
    ],
    introBtn: '入 城',
    presetNow: '現代の西安',
    presetOverlay: '重ね合わせ',
    presetTang: '唐の長安',
    endNow: '今 · 西安',
    endTang: '唐 · 長安',
    dockCaption: '銅銭を動かし、千三百年を越える',
    sliderAria: '時空スライダー：現代の西安と唐代の長安を切り替える',
    panelTitle: '今と昔',
    panelSubtitle: '今も訪れられる長安、十六か所',
    panelCollapse: '閉じる',
    panelFooter: '地図のどこかをタップすると、その唐代の坊名が分かります',
    tagNow: '今',
    tagTang: '唐',
    popLocatedEyebrow: 'ここは唐代には',
    popLore: '逸話',
    popSiteEyebrow: '唐の旧跡 · 現存せず',
    popNowPrefix: '今 · ',
    popTangPrefix: '唐 · ',
    zoneTag: {
      ward: '坊', palace: '宮', market: '市', water: '水',
      garden: '苑', street: '街', city: '城', outskirts: '郊外',
    },
    wardGeneric: '唐長安の碁盤の目をなす坊の一つ。整然と区画された街区の中。',
    langLabel: '言語',
    kao: {
      back: '‹ 地図へ戻る',
      title: '典拠と注',
      lede:
        '本図は概略的な復元です。唐長安城の碁盤状の都市計画を、真の縮尺と方位で現代西安の経緯度に位置合わせし、旅人が地図を頼りに歩けるようにしたもの。坊界や街路は大略であり、考古学的な典拠とはできません。',
      h1: '依拠した文献',
      sources: [
        '『唐六典』：「皇城の南、東西十坊、南北九坊。皇城の東西おのおの十二坊。両市は四坊の地を占め、凡そ一百一十坊。」',
        '『長安志』（宋・宋敏求）巻七〜十：朱雀街の東西おのおの五街、諸坊の名と順序。',
        '外郭城は東西約 9721 m、南北約 8652 m。宮城・皇城・坊市の規模は考古実測の通説に拠る。',
      ],
      h2: '位置合わせの基準点',
      anchorsIntro: '以下の唐代遺構は今も原位置に残り、本図は全城をこれらから定位します（WGS84）：',
      anchors: [
        '明徳門址——郭城の正南門。朱雀大街の軸線と南壁を定める;',
        '含光門址（西安城壁の含光門区間）——唐皇城の南壁。明代城壁がその上に重なる;',
        '丹鳳門址——大明宮の正門。北壁の線を定める。',
      ],
      verify:
        '位置合わせの後、多くの名所がおのずと一致します。大雁塔は晋昌坊（大慈恩寺）に、小雁塔は安仁坊の北西隅（『長安志』の記す塔院の位置と符合）に、大興善寺は靖善坊の中央に、青龍寺は新昌坊に、大唐西市博物館は旧西市の上に——千年の都市の脈が、ここに検証されます。',
      h3: 'いくつかの留意点',
      notes: [
        '坊名は『長安志』の順序に従う。一部の坊（朱雀街西第一街の最北二坊など）は文献ごとに異なり、一説を採る。',
        '曲江池・龍池・太液池の水形は様式化。芙蓉園の境域は「東南隅の二坊の地」のおおよそを採る。',
        '大明宮の平面は実際は不規則形。本図では台形で示し、諸殿は含元殿のみ記す。',
        'ベースマップは OpenStreetMap / CARTO。復元と同じ WGS84 で、ずれの心配はない。',
      ],
      colophon: '長安輿図 · 宋敏求『長安志』および今日の考古通説に拠る復元',
    },
  },

  // ─────────────────────────────────────── 한국어 ───
  ko: {
    subtitle: '천삼백 년, 두 도시를 한 장의 지도에',
    sourcesLink: '전거와 주석',
    introTitle: '장안에 오신 것을 환영합니다',
    introBody:
      '이 지도는 당대 장안성을 실제 좌표로 오늘날 시안의 거리 위에 겹친 것입니다. 110개 방, 동서 두 시장, 세 궁성 —— 모두 『장안지』『당육전』에 근거합니다.',
    introList: [
      '아래 동전 슬라이더를 끌어 현재와 당을 오가세요',
      '지도 아무 곳이나 누르면 그곳이 당대 어느 방인지 보입니다',
      '「고금 탐방」 패널은 오늘날에도 갈 수 있는 장안 열여섯 곳',
    ],
    introBtn: '입 성',
    presetNow: '현대 시안',
    presetOverlay: '겹쳐 보기',
    presetTang: '당 장안',
    endNow: '현재 · 시안',
    endTang: '당 · 장안',
    dockCaption: '동전을 끌어 천삼백 년을 건너세요',
    sliderAria: '시공 슬라이더: 현대 시안과 당대 장안 사이를 전환',
    panelTitle: '고금 탐방',
    panelSubtitle: '직접 가볼 수 있는 장안 열여섯 곳',
    panelCollapse: '접기',
    panelFooter: '지도 아무 곳이나 누르면 그 당대 방 이름을 알 수 있습니다',
    tagNow: '현재',
    tagTang: '당',
    popLocatedEyebrow: '이곳은 당대에',
    popLore: '일화',
    popSiteEyebrow: '당 유적 · 현존하지 않음',
    popNowPrefix: '현재 · ',
    popTangPrefix: '당 · ',
    zoneTag: {
      ward: '방', palace: '궁', market: '시', water: '수',
      garden: '원', street: '가', city: '성', outskirts: '교외',
    },
    wardGeneric: '당 장안의 바둑판 같은 방(坊) 가운데 하나. 반듯하게 구획된 시가 안.',
    langLabel: '언어',
    kao: {
      back: '‹ 지도로 돌아가기',
      title: '전거와 주석',
      lede:
        '본 지도는 개략적 복원입니다. 당 장안성의 바둑판 도시 구획을 실제 축척과 방위로 현대 시안의 경위도에 정합하여, 여행자가 지도를 따라 길을 찾을 수 있게 한 것입니다. 방의 경계와 거리는 대략이며 고고학적 전거로 삼을 수 없습니다.',
      h1: '근거 문헌',
      sources: [
        '『당육전』: "황성의 남쪽, 동서 십 방, 남북 구 방. 황성의 동서로 각 십이 방. 두 시장은 네 방의 땅을 차지하니 무릇 일백십 방이라."',
        '『장안지』(송·송민구) 권7~10: 주작대가 동서 각 다섯 거리의 여러 방 이름과 순서.',
        '외곽성은 동서 약 9721 m, 남북 약 8652 m. 궁성·황성·방시의 규모는 고고 실측 통설에 따름.',
      ],
      h2: '정합 기준점',
      anchorsIntro: '다음 당대 유적은 지금도 원위치에 남아 있으며, 본 지도는 전체 도성을 이로부터 정위합니다(WGS84):',
      anchors: [
        '명덕문 터 —— 곽성의 정남문. 주작대가 축선과 남벽을 정함;',
        '함광문 터(시안 성벽 함광문 구간) —— 당 황성 남벽. 명대 성벽이 그 위에 겹침;',
        '단봉문 터 —— 대명궁 정문. 북벽 선을 정함.',
      ],
      verify:
        '정합 후 많은 명소가 절로 들어맞습니다. 대안탑은 진창방(대자은사)에, 소안탑은 안인방 북서쪽 모퉁이(『장안지』가 기록한 탑원 위치와 부합)에, 대흥선사는 정선방 한가운데에, 청룡사는 신창방에, 대당서시 박물관은 옛 서시 위에 —— 천년 도시의 맥이 여기서 검증됩니다.',
      h3: '몇 가지 유의점',
      notes: [
        '방 이름은 『장안지』의 순서를 따름. 일부 방(주작가 서쪽 첫 거리의 최북단 두 방 등)은 문헌마다 달라 한 설을 채택.',
        '곡강지·용지·태액지의 수형은 양식화. 부용원의 경역은 "동남 모퉁이 두 방의 땅"의 대략을 채택.',
        '대명궁 평면은 실제로는 불규칙형. 본 지도에서는 사다리꼴로 표시하고 전각은 함원전만 기재.',
        '베이스맵은 OpenStreetMap / CARTO로, 복원과 같은 WGS84를 사용해 어긋남이 없음.',
      ],
      colophon: '장안 여지도 · 송민구 『장안지』와 오늘날 고고 통설에 따른 복원',
    },
  },
}
