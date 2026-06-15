/**
 * 唐长安城复原数据（示意性复原，配准至 WGS84 现代坐标）
 *
 * 坊名排布依据：《长安志》（宋·宋敏求）卷七至卷十、《唐六典》
 * （"皇城之南，东西十坊，南北九坊；皇城之东西各十二坊，两市居四坊之地，凡一百一十坊"）
 *
 * 配准锚点（OSM/WGS84 实测）：
 *  - 明德门遗址公园（郭城正南门，朱雀大街南端）≈ 108.9373, 34.2065
 *  - 含光门遗址博物馆（唐皇城南墙含光门原址）   ≈ 108.9291, 34.2526
 *  - 丹凤门（大明宫正门，郭城北墙线）           ≈ 108.9595, 34.2828
 *  推得：皇城南墙 34.25267（与含光门实测差 < 20m）
 *  验证：大雁塔落晋昌坊、小雁塔落安仁坊西缘、大兴善寺落靖善坊正中、
 *        青龙寺落新昌坊、大唐西市落西市原址 —— 均吻合。
 */

import { tr, type L10n, type Locale } from '../i18n'

// ─── 配准常数 ───────────────────────────────────────────────
export const AXIS_LNG = 108.9369 // 朱雀大街轴线
export const NORTH_LAT = 34.28275 // 郭城北墙
const M_PER_LAT = 110922
const M_PER_LNG = 92012

const CITY_H = 8651.7 // 郭城南北
const HALF_W = 4859.5 // 郭城半宽（东西 9719m）
const IC_BOTTOM = 3336 // 皇城南墙距北墙（宫城 1492 + 皇城 1844）
const PALACE_H = 1492 // 宫城南北
const STRIP_ROW = 834 // 皇城两侧坊行高（R1–R4）
const S_ROW = (CITY_H - IC_BOTTOM) / 9 // 皇城以南坊行高 ≈ 590.6

const HALF_ST = 77.5 // 朱雀大街半宽
const INNER_W = 588 // 皇城正南小坊宽（C5/C6 等）；两侧大坊宽 1115
const G_INNER = 47 // 一般南北街宽；皇城东西墙延长线大街宽 120

export const SOUTH_LAT = NORTH_LAT - CITY_H / M_PER_LAT
export const WEST_LNG = AXIS_LNG - HALF_W / M_PER_LNG
export const EAST_LNG = AXIS_LNG + HALF_W / M_PER_LNG
export const IC_HALF_W = 1410 // 宫城/皇城半宽

// 北墙以南 m → 纬度；轴线以东 m → 经度
const lat = (m: number) => NORTH_LAT - m / M_PER_LAT
const lng = (m: number) => AXIS_LNG + m / M_PER_LNG

// 列的东西边界（距轴线米数，东侧为正；西侧取镜像）
// C6..C10 即朱雀街东第一至第五街所夹各列
const COLS_E: [number, number][] = [
  [HALF_ST, HALF_ST + INNER_W], // C6  77.5–665.5
  [HALF_ST + INNER_W + G_INNER, HALF_ST + 2 * INNER_W + G_INNER], // C7 712.5–1300.5
  [1420.5, 2535.5], // C8
  [2582.5, 3697.5], // C9
  [3744.5, 4859.5], // C10
]

// 行的上下边界（距北墙米数）：R1–R4 在皇城两侧，R5–R13 在皇城以南
const rowBand = (r: number): [number, number] => {
  if (r <= 4) return [(r - 1) * STRIP_ROW, r * STRIP_ROW]
  return [IC_BOTTOM + (r - 5) * S_ROW, IC_BOTTOM + (r - 4) * S_ROW]
}
// 行内坊体上下留出街衢
const rowBox = (r: number): [number, number] => {
  const [t, b] = rowBand(r)
  if (r <= 4) return [t + 25, b - 25]
  const gt = r === 5 ? 60 : r === 9 ? 40 : 23 // R5 顶为春明—金光大街，R9 顶为延兴—延平大街
  const gb = r === 8 ? 40 : r === 13 ? 30 : 23
  return [t + gt, b - gb]
}

// ─── 坊名矩阵（《长安志》卷七~卷十） ──────────────────────────
// 西侧三列（自外而内 W5/W4/W3 即街西第五/四/三街）
const W5 = { strip: ['修真', '普宁', '义宁', '居德'], south: ['群贤', '怀德', '崇化', '丰邑', '待贤', '永和', '常安', '和平', '永阳'] }
const W4 = { strip: ['安定', '休祥', '金城', '醴泉'], south: ['西市', '西市', '怀远', '长寿', '嘉会', '永平', '通轨', '归义', '昭行'] }
const W3 = { strip: ['修德', '辅兴', '颁政', '布政'], south: ['延寿', '光德', '延康', '崇贤', '延福', '永安', '敦义', '大通', '大安'] }
const W2 = ['太平', '通义', '兴化', '崇德', '怀贞', '宣义', '丰安', '昌明', '安乐'] // 街西第二街
const W1 = ['善和', '殖业', '丰乐', '安业', '崇业', '永达', '道德', '光行', '延祚'] // 街西第一街
const E1 = ['兴道', '开化', '安仁', '光福', '靖善', '兰陵', '开明', '保宁', '安义'] // 街东第一街
const E2 = ['务本', '崇义', '长兴', '永乐', '靖安', '安善', '大业', '昌乐', '安德'] // 街东第二街
const E3 = { strip: ['翊善|光宅', '永昌|来庭', '永兴', '崇仁'], south: ['平康', '宣阳', '亲仁', '永宁', '永崇', '昭国', '晋昌', '通善', '通济'] }
const E4 = { strip: ['长乐', '大宁', '安兴', '胜业'], south: ['东市', '东市', '安邑', '宣平', '升平', '修行', '修政', '青龙', '曲池'] }
const E5 = { strip: ['十六宅', '兴宁', '永嘉', '兴庆'], south: ['道政', '常乐', '靖恭', '新昌', '立政', '敦化', '', '', ''] } // R11–13 为曲江芙蓉园

// ─── 坊中典故（多语） ──────────────────────────────────────
export const FANG_STORIES: Record<string, L10n> = {
  平康: {
    'zh-CN': '长安风月之地"北里"所在，亦多进士寓居。新科进士曲江宴罢，多于此"探花"。',
    'zh-TW': '長安風月之地「北里」所在，亦多進士寓居。新科進士曲江宴罷，多於此「探花」。',
    en: "Home to the Beili, Chang'an's pleasure quarter; also where many examination candidates lodged. Newly passed graduates often came here to celebrate.",
    ja: '長安の歓楽街「北里」があった坊。科挙の受験生も多く住み、合格した進士はしばしばここで祝った。',
    ko: "장안의 환락가 '북리(北里)'가 있던 방. 과거 응시생도 많이 머물렀고, 급제한 진사들이 이곳에서 자주 어울렸다.",
  },
  崇仁: {
    'zh-CN': '近皇城景风门与东市，"一街辐辏，遂倾两市"——昼夜喧呼、灯火不绝，为长安不夜之坊。',
    'zh-TW': '近皇城景風門與東市，「一街輻輳，遂傾兩市」——晝夜喧呼、燈火不絕，為長安不夜之坊。',
    en: "Beside the imperial city and the East Market — so bustling it 'outshone both markets,' loud day and night, the lamps never dark: Chang'an's sleepless ward.",
    ja: '皇城と東市に近く、「一街に人が集まり両市をしのぐ」と言われた。昼夜のにぎわいと絶えぬ灯火、長安の不夜の坊。',
    ko: '황성과 동시(東市)에 가까워 "한 거리에 사람이 몰려 두 시장을 압도한다"던 곳. 밤낮의 번화와 꺼지지 않는 등불, 장안의 불야성 방.',
  },
  亲仁: {
    'zh-CN': '汾阳王郭子仪宅占坊四分之一，"堂前种花、堂后教歌"，安史之乱后长安最煊赫的宅第。',
    'zh-TW': '汾陽王郭子儀宅佔坊四分之一，「堂前種花、堂後教歌」，安史之亂後長安最煊赫的宅第。',
    en: "The mansion of General Guo Ziyi filled a quarter of the ward — 'flowers before the hall, singers behind it' — the grandest residence in Chang'an after the An Lushan rebellion.",
    ja: '汾陽王・郭子儀の邸宅が坊の四分の一を占めた。「堂前に花を植え、堂後に歌を教う」と称され、安史の乱後の長安で最も華やかな邸宅。',
    ko: '분양왕 곽자의의 저택이 방의 사분의 일을 차지했다. "당 앞에 꽃을 심고 당 뒤에서 노래를 가르친다"던, 안사의 난 이후 장안에서 가장 화려한 저택.',
  },
  宣阳: {
    'zh-CN': '万年县廨所在；杨贵妃姊虢国夫人宅亦在此坊，韦应物少年时曾居坊中。',
    'zh-TW': '萬年縣廨所在；楊貴妃姊虢國夫人宅亦在此坊，韋應物少年時曾居坊中。',
    en: "Seat of Wannian county office; the mansion of Lady Guoguo (Yang Guifei's sister) stood here, and the poet Wei Yingwu lived in this ward as a youth.",
    ja: '万年県の役所が置かれた坊。楊貴妃の姉・虢国夫人の邸宅もここにあり、詩人・韋応物も少年期をこの坊で過ごした。',
    ko: '만년현 관아가 있던 방. 양귀비의 언니 괵국부인의 저택도 여기 있었고, 시인 위응물도 소년기를 이 방에서 보냈다.',
  },
  务本: {
    'zh-CN': '国子监与孔庙所在，四方学子、新罗日本遣唐留学生群聚于此。',
    'zh-TW': '國子監與孔廟所在，四方學子、新羅日本遣唐留學生群聚於此。',
    en: 'Home to the Imperial Academy and the Confucian Temple, where students from across the realm — and envoys from Silla and Japan — gathered.',
    ja: '国子監と孔子廟があった坊。各地の学生、新羅・日本の遣唐留学生が集った。',
    ko: '국자감과 공자묘가 있던 방. 각지의 학생과 신라·일본의 견당 유학생이 모였다.',
  },
  开化: {
    'zh-CN': '荐福寺本坊。武则天为高宗荐福而立寺，义净于此译经。',
    'zh-TW': '薦福寺本坊。武則天為高宗薦福而立寺，義淨於此譯經。',
    en: 'The ward of Jianfu Temple, founded by Empress Wu Zetian to bless Emperor Gaozong; the monk Yijing translated scriptures here.',
    ja: '薦福寺の坊。武則天が高宗の冥福のために建てた寺で、義浄がここで経典を翻訳した。',
    ko: '천복사(薦福寺)의 방. 측천무후가 고종을 위해 세운 절로, 의정(義淨)이 이곳에서 경전을 번역했다.',
  },
  安仁: {
    'zh-CN': '荐福寺塔院所在——今小雁塔仍立于坊西北原址，千年未移。',
    'zh-TW': '薦福寺塔院所在——今小雁塔仍立於坊西北原址，千年未移。',
    en: 'Site of the Jianfu pagoda court — the Small Wild Goose Pagoda still stands on its original spot in the ward\'s northwest, unmoved for a thousand years.',
    ja: '薦福寺の塔院があった所——小雁塔は今も坊の北西の原位置に立ち、千年動いていない。',
    ko: '천복사 탑원이 있던 곳 —— 소안탑은 지금도 방 북서쪽 원위치에 서 있으며, 천 년 동안 움직이지 않았다.',
  },
  靖善: {
    'zh-CN': '大兴善寺尽一坊之地，隋唐皇家寺院、佛教密宗祖庭，寺址至今未变。',
    'zh-TW': '大興善寺盡一坊之地，隋唐皇家寺院、佛教密宗祖庭，寺址至今未變。',
    en: 'Da Xingshan Temple filled the entire ward — a Sui–Tang imperial temple and cradle of Esoteric Buddhism; its site is unchanged to this day.',
    ja: '大興善寺が坊一つを占めた。隋唐の皇室寺院にして密教の祖庭。寺地は今に至るまで変わらない。',
    ko: '대흥선사가 방 하나를 가득 채웠다. 수·당 황실 사원이자 밀교의 조정(祖庭). 절터는 지금까지 변하지 않았다.',
  },
  晋昌: {
    'zh-CN': '大慈恩寺本坊。玄奘自天竺归来于此译经，并建塔藏经——即今大雁塔。',
    'zh-TW': '大慈恩寺本坊。玄奘自天竺歸來於此譯經，並建塔藏經——即今大雁塔。',
    en: 'The ward of Da Ci\'en Temple. Returning from India, Xuanzang translated scriptures here and built a pagoda to house them — today\'s Giant Wild Goose Pagoda.',
    ja: '大慈恩寺の坊。玄奘が天竺から帰り、ここで経典を翻訳し、それを納める塔を建てた——今日の大雁塔。',
    ko: '대자은사의 방. 현장이 천축에서 돌아와 이곳에서 경전을 번역하고, 그것을 모실 탑을 세웠다 —— 오늘날의 대안탑.',
  },
  新昌: {
    'zh-CN': '青龙寺所在。日本空海于此从惠果受密法，归国开真言宗；坊东南即乐游原。',
    'zh-TW': '青龍寺所在。日本空海於此從惠果受密法，歸國開真言宗；坊東南即樂遊原。',
    en: 'Site of Qinglong Temple, where Kūkai of Japan received the Esoteric teachings from Huiguo and founded the Shingon school on his return. Leyou Plateau lay to the southeast.',
    ja: '青龍寺の坊。日本の空海がここで恵果から密法を受け、帰国して真言宗を開いた。坊の東南は楽遊原。',
    ko: '청룡사의 방. 일본의 구카이(空海)가 이곳에서 혜과에게 밀법을 받아 귀국 후 진언종을 열었다. 방 동남쪽은 낙유원.',
  },
  靖安: {
    'zh-CN': '元稹宅在此坊。"靖安宅里当窗柳，望驿台前扑地花"即咏其宅。',
    'zh-TW': '元稹宅在此坊。「靖安宅裡當窗柳，望驛臺前撲地花」即詠其宅。',
    en: "The poet Yuan Zhen's residence was here, celebrated in his line 'willows at the window of the Jing'an house, flowers strewn before the post-tower.'",
    ja: '詩人・元稹の邸宅があった坊。「靖安の宅、窓に当たる柳」と詠まれた。',
    ko: '시인 원진의 저택이 있던 방. "정안의 집 창가의 버들"이라 읊어졌다.',
  },
  昭国: {
    'zh-CN': '岑参、元稹皆曾居此；近曲江杏园，春日游人如织。',
    'zh-TW': '岑參、元稹皆曾居此；近曲江杏園，春日遊人如織。',
    en: 'The poets Cen Shen and Yuan Zhen both lived here; near the Qujiang Apricot Garden, it teemed with spring outing crowds.',
    ja: '岑参・元稹がともに住んだ坊。曲江の杏園に近く、春は遊人で賑わった。',
    ko: '시인 잠삼과 원진이 모두 살던 방. 곡강의 행원에 가까워 봄이면 나들이 인파로 붐볐다.',
  },
  永崇: {
    'zh-CN': '玄宗时与永宁坊俱为贵第所聚；华严宗澄观曾驻锡坊中佛寺。',
    'zh-TW': '玄宗時與永寧坊俱為貴第所聚；華嚴宗澄觀曾駐錫坊中佛寺。',
    en: "Under Emperor Xuanzong this and Yongning ward were clusters of noble mansions; the Huayan patriarch Chengguan resided at a temple here.",
    ja: '玄宗の時、永寧坊とともに貴族の邸宅が集まった。華厳宗の澄観が坊内の寺に滞在した。',
    ko: '현종 때 영녕방과 함께 귀족 저택이 모인 곳. 화엄종의 징관이 방 안의 절에 머물렀다.',
  },
  永兴: {
    'zh-CN': '魏征宅在此坊。太宗尝欲为其营小殿，征固辞，乃以其材为之造正堂。',
    'zh-TW': '魏徵宅在此坊。太宗嘗欲為其營小殿，徵固辭，乃以其材為之造正堂。',
    en: "The home of the upright minister Wei Zheng. Emperor Taizong offered to build him a small hall; Wei declined, so the timber was used to raise his main hall instead.",
    ja: '名臣・魏徴の邸宅があった坊。太宗が小殿を建てようとしたが魏徴は固辞し、その材で正堂を造った。',
    ko: '명신 위징의 저택이 있던 방. 태종이 작은 전각을 지어주려 했으나 위징이 사양하여, 그 재목으로 정당을 지었다.',
  },
  长乐: {
    'zh-CN': '大安国寺所在，本睿宗藩邸；坊北即大明宫，百官晨朝多宿于此。',
    'zh-TW': '大安國寺所在，本睿宗藩邸；坊北即大明宮，百官晨朝多宿於此。',
    en: "Home to Da'anguo Temple, once Emperor Ruizong's princely residence; just south of Daming Palace, officials often lodged here before dawn audiences.",
    ja: '大安国寺の坊。もと睿宗の藩邸。坊の北は大明宮で、百官は早朝の朝見前にしばしばここに泊まった。',
    ko: '대안국사의 방. 본래 예종의 잠저(潛邸). 방 북쪽이 대명궁이라 백관이 새벽 조회 전에 자주 이곳에 묵었다.',
  },
  胜业: {
    'zh-CN': '近兴庆宫，王公主第甲于诸坊；歧王宅"寻常见"之地即在此左近。',
    'zh-TW': '近興慶宮，王公主第甲於諸坊；歧王宅「尋常見」之地即在此左近。',
    en: "Near Xingqing Palace, its princely and noble mansions led all wards; Prince Qi's residence — 'often seen' in Du Fu's verse — stood nearby.",
    ja: '興慶宮に近く、王公の邸宅が諸坊で随一。杜甫が「いつも見かけた」と詠んだ岐王の邸もこの近く。',
    ko: '흥경궁에 가까워 왕공의 저택이 여러 방 중 으뜸. 두보가 "늘 보았다"고 읊은 기왕의 저택도 이 근처.',
  },
  道政: {
    'zh-CN': '紧邻兴庆宫南，宫人车马出入之地；坊中有龙兴观。',
    'zh-TW': '緊鄰興慶宮南，宮人車馬出入之地；坊中有龍興觀。',
    en: 'Directly south of Xingqing Palace, where palace carriages came and went; the Longxing Daoist abbey stood in the ward.',
    ja: '興慶宮の南に接し、宮人の車馬が出入りした地。坊内に龍興観があった。',
    ko: '흥경궁 남쪽에 접해 궁인의 거마가 드나들던 곳. 방 안에 용흥관이 있었다.',
  },
  常乐: {
    'zh-CN': '白居易初入长安，"常乐里闲居"即赁居此坊东亭，写下《养竹记》。',
    'zh-TW': '白居易初入長安，「常樂里閒居」即賃居此坊東亭，寫下《養竹記》。',
    en: "When Bai Juyi first came to Chang'an, he rented the east pavilion of this ward — his 'idle dwelling in Changle' — and wrote his essay 'On Raising Bamboo.'",
    ja: '白居易が初めて長安に入った時、この坊の東亭を借りて住み（「常楽里の閑居」）、『養竹記』を著した。',
    ko: '백거이가 처음 장안에 왔을 때 이 방의 동쪽 정자를 빌려 살며("상락리 한거") 『양죽기』를 지었다.',
  },
  安邑: {
    'zh-CN': '东市之南，刘禹锡曾居坊中；多波斯邸与酒家。',
    'zh-TW': '東市之南，劉禹錫曾居坊中；多波斯邸與酒家。',
    en: 'South of the East Market, where the poet Liu Yuxi once lived; full of Persian shops and taverns.',
    ja: '東市の南。詩人・劉禹錫が住んだ坊で、ペルシア商館や酒家が多かった。',
    ko: '동시 남쪽. 시인 유우석이 살던 방으로, 페르시아 상점과 주점이 많았다.',
  },
  兴化: {
    'zh-CN': '1970年坊址（今何家村）出土千余件金银器窖藏，即"何家村遗宝"，今藏陕西历史博物馆。',
    'zh-TW': '1970年坊址（今何家村）出土千餘件金銀器窖藏，即「何家村遺寶」，今藏陝西歷史博物館。',
    en: "In 1970 a hoard of over a thousand gold and silver wares — the 'Hejiacun treasure' — was unearthed on this ward's site (today's Hejiacun); now in the Shaanxi History Museum.",
    ja: '1970年、坊址（今の何家村）から千点余りの金銀器の埋蔵品「何家村遺宝」が出土。今は陝西歴史博物館に収蔵。',
    ko: '1970년 이 방 터(오늘날 허자춘)에서 천여 점의 금은기 매장품 "허자춘 유보"가 출토되었다. 지금은 산시성 역사박물관 소장.',
  },
  崇业: {
    'zh-CN': '玄都观所在。刘禹锡两游玄都观，"玄都观里桃千树，尽是刘郎去后栽"。',
    'zh-TW': '玄都觀所在。劉禹錫兩遊玄都觀，「玄都觀裡桃千樹，盡是劉郎去後栽」。',
    en: "Site of the Xuandu Abbey. Liu Yuxi visited twice, writing: 'A thousand peach trees in Xuandu Abbey — all planted since this Liu went away.'",
    ja: '玄都観の坊。劉禹錫は二度訪れ、「玄都観裡桃千樹、尽く是れ劉郎去りて後に栽う」と詠んだ。',
    ko: '현도관의 방. 유우석이 두 번 찾아 "현도관 안 복숭아 천 그루, 모두 유랑이 떠난 뒤 심은 것"이라 읊었다.',
  },
  太平: {
    'zh-CN': '温国寺、实际寺所在；近皇城含光门，朝官多居之。',
    'zh-TW': '溫國寺、實際寺所在；近皇城含光門，朝官多居之。',
    en: 'Home to the Wenguo and Shiji temples; near the imperial city\'s Hanguang Gate, many court officials lived here.',
    ja: '温国寺・実際寺の坊。皇城の含光門に近く、朝廷の官人が多く住んだ。',
    ko: '온국사·실제사의 방. 황성 함광문에 가까워 조정 관리가 많이 살았다.',
  },
  光德: {
    'zh-CN': '京兆府廨所在——长安城的"市政府"；坊中亦有胜光寺。',
    'zh-TW': '京兆府廨所在——長安城的「市政府」；坊中亦有勝光寺。',
    en: "Seat of the Jingzhao prefecture office — in effect Chang'an's 'city hall'; the Shengguang Temple also stood here.",
    ja: '京兆府の役所——長安の「市役所」にあたる。坊内には勝光寺もあった。',
    ko: '경조부 관아 —— 장안의 "시청"에 해당. 방 안에 승광사도 있었다.',
  },
  延康: {
    'zh-CN': '西明寺所在，玄奘曾居之，寺园林冠绝诸寺；阎立本宅亦在此坊。',
    'zh-TW': '西明寺所在，玄奘曾居之，寺園林冠絕諸寺；閻立本宅亦在此坊。',
    en: "Site of Ximing Temple, where Xuanzang once lived — its gardens were the finest of any temple; the painter Yan Liben's home was also here.",
    ja: '西明寺の坊。玄奘も住み、寺の庭園は諸寺で随一。画家・閻立本の邸宅もこの坊にあった。',
    ko: '서명사의 방. 현장도 머물렀고 절의 정원은 여러 절 중 으뜸. 화가 염립본의 저택도 이 방에 있었다.',
  },
  延寿: {
    'zh-CN': '"卖金银珠玉者"聚居，近西市，为长安珠宝业之坊。',
    'zh-TW': '「賣金銀珠玉者」聚居，近西市，為長安珠寶業之坊。',
    en: "Where dealers in gold, silver and jade clustered — near the West Market, this was Chang'an's jewelry ward.",
    ja: '「金銀珠玉を売る者」が集まった坊。西市に近く、長安の宝飾業の坊だった。',
    ko: '"금은보옥을 파는 자"가 모여 살던 방. 서시에 가까운 장안의 보석업 방이었다.',
  },
  醴泉: {
    'zh-CN': '坊中有袄祠、胡寺，西域商旅聚居，近西市，胡风最盛。',
    'zh-TW': '坊中有祆祠、胡寺，西域商旅聚居，近西市，胡風最盛。',
    en: 'Home to Zoroastrian shrines and foreign temples; Central Asian merchants gathered here near the West Market — the most cosmopolitan of wards.',
    ja: '坊内に祆祠（ゾロアスター教の祠）や胡寺があり、西域の商人が集まった。西市に近く、最も異国情緒の濃い坊。',
    ko: '방 안에 조로아스터교 사당과 외래 사원이 있었고, 서역 상인이 모였다. 서시에 가까운, 가장 이국적인 방.',
  },
  义宁: {
    'zh-CN': '大秦寺（景教寺院）所在，《大秦景教流行中国碑》即出于此。',
    'zh-TW': '大秦寺（景教寺院）所在，《大秦景教流行中國碑》即出於此。',
    en: 'Site of the Daqin Temple (a Nestorian Christian church); the famous Nestorian Stele was found here.',
    ja: '大秦寺（ネストリウス派キリスト教の寺院）の坊。有名な「大秦景教流行中国碑」はここから出土した。',
    ko: '대진사(네스토리우스파 기독교 사원)의 방. 유명한 "대진경교유행중국비"가 여기서 출토되었다.',
  },
  怀远: {
    'zh-CN': '大云经寺所在；近西市，亦多西域客商。',
    'zh-TW': '大雲經寺所在；近西市，亦多西域客商。',
    en: 'Site of the Dayunjing Temple; near the West Market, home to many Central Asian traders.',
    ja: '大雲経寺の坊。西市に近く、西域の商人も多かった。',
    ko: '대운경사의 방. 서시에 가까워 서역 상인도 많았다.',
  },
  丰邑: {
    'zh-CN': '坊多凶肆——专营丧葬仪仗之所，《李娃传》中两肆赛歌即在此类凶肆。',
    'zh-TW': '坊多凶肆——專營喪葬儀仗之所，《李娃傳》中兩肆賽歌即在此類凶肆。',
    en: "Known for its funeral shops — dealers in mourning rites; the famous singing contest in the Tang tale 'Li Wa' took place at such a shop.",
    ja: '葬具を商う「凶肆」が多い坊。唐の伝奇『李娃伝』の歌競べはこうした凶肆で行われた。',
    ko: '장례 용품을 파는 "흉사(凶肆)"가 많던 방. 당 전기소설 『이와전』의 노래 겨루기가 이런 흉사에서 벌어졌다.',
  },
  永阳: {
    'zh-CN': '大庄严寺与大总持寺并峙坊中，双木塔高耸，为城西南标志。',
    'zh-TW': '大莊嚴寺與大總持寺並峙坊中，雙木塔高聳，為城西南標誌。',
    en: 'The Da Zhuangyan and Da Zongchi temples faced each other here, their twin wooden pagodas soaring — a landmark of the city\'s southwest.',
    ja: '大荘厳寺と大総持寺が坊内に並び立ち、双つの木塔が高くそびえ、城の西南の目印となった。',
    ko: '대장엄사와 대총지사가 방 안에 마주 섰고, 두 목탑이 높이 솟아 도성 서남쪽의 표지가 되었다.',
  },
  群贤: {
    'zh-CN': '近金光门，西出大道，商旅出入长安之孔道。',
    'zh-TW': '近金光門，西出大道，商旅出入長安之孔道。',
    en: "Near the Jinguang Gate and the great westward road — a thoroughfare for merchants entering and leaving Chang'an.",
    ja: '金光門に近く、西へ向かう大道に面した、商旅が長安を出入りする要路。',
    ko: '금광문에 가깝고 서쪽으로 향하는 대로에 면한, 상인이 장안을 드나드는 길목.',
  },
  通济: {
    'zh-CN': '近启夏门与城南郊，坊南即唐人春游踏青之地。',
    'zh-TW': '近啟夏門與城南郊，坊南即唐人春遊踏青之地。',
    en: "Near the Qixia Gate and the southern outskirts; just south of the ward lay the Tang people's favorite spring-outing grounds.",
    ja: '啓夏門と城の南郊に近い。坊の南は唐の人々が春に野遊びをした地。',
    ko: '계하문과 도성 남쪽 교외에 가깝다. 방 남쪽은 당나라 사람들이 봄나들이하던 곳.',
  },
  翊善: {
    'zh-CN': '紧邻大明宫，宦官诸司多居之；武后析坊置光宅，丹凤门大街贯其间。',
    'zh-TW': '緊鄰大明宮，宦官諸司多居之；武后析坊置光宅，丹鳳門大街貫其間。',
    en: 'Adjoining Daming Palace, home to many eunuch offices; Empress Wu split off Guangzhai ward here, the Danfeng Gate avenue running between them.',
    ja: '大明宮に隣接し、宦官の諸官署が多く置かれた坊。武后が坊を分けて光宅坊を置き、丹鳳門大街がその間を貫いた。',
    ko: '대명궁에 인접해 환관의 여러 관서가 많던 방. 측천무후가 방을 나눠 광택방을 두었고, 단봉문 대가가 그 사이를 가로질렀다.',
  },
  光宅: {
    'zh-CN': '武则天置光宅寺，内供养佛舍利；坊当丹凤门大街之东。',
    'zh-TW': '武則天置光宅寺，內供養佛舍利；坊當丹鳳門大街之東。',
    en: "Empress Wu Zetian founded Guangzhai Temple here to enshrine Buddha relics; the ward lay east of the Danfeng Gate avenue.",
    ja: '武則天が光宅寺を建て、仏舎利を奉安した坊。丹鳳門大街の東に当たる。',
    ko: '측천무후가 광택사를 세워 불사리를 봉안한 방. 단봉문 대가의 동쪽에 해당한다.',
  },
}

// ─── GeoJSON 构造 ───────────────────────────────────────────
import type { Feature, FeatureCollection, Polygon } from 'geojson'
type F = Feature
const poly = (rings: number[][][], props: Record<string, unknown>): F => ({
  type: 'Feature', properties: props, geometry: { type: 'Polygon', coordinates: rings },
})
const rect = (x1: number, x2: number, m1: number, m2: number, props: Record<string, unknown>): F =>
  poly([[[lng(x1), lat(m1)], [lng(x2), lat(m1)], [lng(x2), lat(m2)], [lng(x1), lat(m2)], [lng(x1), lat(m1)]]], props)
const fc = (features: F[]): FeatureCollection => ({ type: 'FeatureCollection', features })

export interface TangLabel {
  lng: number; lat: number; text: string
  kind: 'ward' | 'palace' | 'market' | 'water' | 'gate' | 'street' | 'garden' | 'site' | 'poem' | 'canal' | 'modernref'
  minZoom: number
  hasStory?: boolean
}
const labels: TangLabel[] = []
const wardFeats: F[] = []

const DANFENG_X = 2079 // 丹凤门大街距轴线（108.9595）
let wardId = 0
function addWard(name: string, x1: number, x2: number, r: number) {
  if (!name) return
  const [t, b] = rowBox(r)
  if (name.includes('|')) {
    // 翊善/永昌被丹凤门大街一分为二（龙朔析置光宅、来庭）
    const [wn, en] = name.split('|')
    addWard(wn, x1, DANFENG_X - 25, r)
    addWard(en, DANFENG_X + 25, x2, r)
    return
  }
  wardFeats.push(rect(x1, x2, t, b, { id: wardId++, name, story: FANG_STORIES[name] ?? null, kind: 'ward' }))
  labels.push({
    lng: lng((x1 + x2) / 2), lat: lat((t + b) / 2), text: name + '坊',
    kind: 'ward', minZoom: 12.4, hasStory: !!FANG_STORIES[name],
  })
}

// 皇城两侧 R1–R4 + 以南 R5–R13
function addColumn(col: { strip?: string[]; south: string[] }, e1: number, e2: number, west: boolean) {
  const [x1, x2] = west ? [-e2, -e1] : [e1, e2]
  col.strip?.forEach((n, i) => addWard(n, x1, x2, i + 1))
  col.south.forEach((n, i) => {
    if (n === '西市' || n === '东市') return // 市单独绘制
    addWard(n, x1, x2, i + 5)
  })
}

addColumn(W5, COLS_E[4][0], COLS_E[4][1], true)
addColumn(W4, COLS_E[3][0], COLS_E[3][1], true)
addColumn(W3, COLS_E[2][0], COLS_E[2][1], true)
addColumn({ south: W2 }, COLS_E[1][0], COLS_E[1][1], true)
addColumn({ south: W1 }, COLS_E[0][0], COLS_E[0][1], true)
addColumn({ south: E1 }, COLS_E[0][0], COLS_E[0][1], false)
addColumn({ south: E2 }, COLS_E[1][0], COLS_E[1][1], false)
addColumn(E3, COLS_E[2][0], COLS_E[2][1], false)
addColumn(E4, COLS_E[3][0], COLS_E[3][1], false)
addColumn(E5, COLS_E[4][0], COLS_E[4][1], false)

export const wardsGeo = fc(wardFeats)

// ─── 宫城 / 皇城 / 大明宫 / 兴庆宫 ──────────────────────────
const palaceFeats: F[] = []

// 宫城（太极宫居中，西掖庭宫，东东宫）
palaceFeats.push(rect(-IC_HALF_W, IC_HALF_W, 28, PALACE_H - 60, { name: '宫城', kind: 'palace' }))
labels.push({ lng: lng(0), lat: lat(PALACE_H / 2 - 30), text: '太极宫', kind: 'palace', minZoom: 11 })
labels.push({ lng: lng(-1080), lat: lat(PALACE_H / 2), text: '掖庭宫', kind: 'palace', minZoom: 13 })
labels.push({ lng: lng(1080), lat: lat(PALACE_H / 2), text: '东宫', kind: 'palace', minZoom: 13 })

// 皇城（百官衙署）
palaceFeats.push(rect(-IC_HALF_W, IC_HALF_W, PALACE_H + 80, IC_BOTTOM - 30, { name: '皇城', kind: 'imperial' }))
labels.push({ lng: lng(0), lat: lat((PALACE_H + IC_BOTTOM) / 2 + 90), text: '皇 城', kind: 'palace', minZoom: 11 })

// 大明宫（龙首原上，郭城东北、北墙之外）— 简化梯形
const DMG: number[][] = [
  [lng(DANFENG_X - 835), lat(0)],
  [lng(DANFENG_X + 835), lat(0)],
  [lng(DANFENG_X + 620), lat(-2150)],
  [lng(DANFENG_X - 620), lat(-2150)],
  [lng(DANFENG_X - 835), lat(0)],
]
palaceFeats.push(poly([DMG], { name: '大明宫', kind: 'palace' }))
labels.push({ lng: lng(DANFENG_X), lat: lat(-1150), text: '大明宫', kind: 'palace', minZoom: 11 })
labels.push({ lng: lng(DANFENG_X), lat: lat(-630), text: '含元殿', kind: 'palace', minZoom: 13 })

// 兴庆宫（开元二年以兴庆坊为宫，又并永嘉坊南半）
const XQ_T = 2085, XQ_B = IC_BOTTOM - 25
palaceFeats.push(rect(COLS_E[4][0], COLS_E[4][1], XQ_T, XQ_B, { name: '兴庆宫', kind: 'palace' }))
labels.push({ lng: lng((COLS_E[4][0] + COLS_E[4][1]) / 2), lat: lat((XQ_T + XQ_B) / 2 - 120), text: '兴庆宫', kind: 'palace', minZoom: 11 })

export const palacesGeo = fc(palaceFeats)

// ─── 东市 / 西市 ────────────────────────────────────────────
const MKT_T = IC_BOTTOM + 60, MKT_B = IC_BOTTOM + 2 * S_ROW - 23
const marketFeats: F[] = [
  rect(COLS_E[3][0], COLS_E[3][1], MKT_T, MKT_B, { name: '东市', kind: 'market' }),
  rect(-COLS_E[3][1], -COLS_E[3][0], MKT_T, MKT_B, { name: '西市', kind: 'market' }),
]
labels.push({ lng: lng((COLS_E[3][0] + COLS_E[3][1]) / 2), lat: lat((MKT_T + MKT_B) / 2), text: '東市', kind: 'market', minZoom: 11 })
labels.push({ lng: lng(-(COLS_E[3][0] + COLS_E[3][1]) / 2), lat: lat((MKT_T + MKT_B) / 2), text: '西市', kind: 'market', minZoom: 11 })
export const marketsGeo = fc(marketFeats)

// 市内"井"字街
const mktStreets: F[] = []
for (const sgn of [1, -1]) {
  const [c1, c2] = [sgn * COLS_E[3][0], sgn * COLS_E[3][1]]
  const w = (c2 - c1) / 3
  for (let i = 1; i <= 2; i++) {
    mktStreets.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[lng(c1 + i * w), lat(MKT_T + 40)], [lng(c1 + i * w), lat(MKT_B - 40)]] } })
    mktStreets.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[lng(c1 + (c2 > c1 ? 40 : -40)), lat(MKT_T + (i * (MKT_B - MKT_T)) / 3)], [lng(c2 - (c2 > c1 ? 40 : -40)), lat(MKT_T + (i * (MKT_B - MKT_T)) / 3)]] } })
  }
}
export const marketStreetsGeo = fc(mktStreets)

// ─── 水系与园林：曲江池 / 芙蓉园 / 龙池 / 太液池 ─────────────
const blob = (cx: number, cy: number, pts: [number, number][], props: Record<string, unknown>): F =>
  poly([[...pts, pts[0]].map(([dx, dy]) => [lng(cx + dx), lat(cy + dy)])], props)

// 芙蓉园（东南隅，曲江占两坊之地）
const FRY_X1 = COLS_E[4][0] - 40, FRY_X2 = 4859.5, FRY_T = IC_BOTTOM + 6 * S_ROW + 30, FRY_B = CITY_H - 18
const gardenFeats: F[] = [rect(FRY_X1, FRY_X2, FRY_T, FRY_B, { name: '芙蓉园', kind: 'garden' })]
labels.push({ lng: lng((FRY_X1 + FRY_X2) / 2 - 150), lat: lat(FRY_B - 320), text: '芙蓉园', kind: 'garden', minZoom: 12 })
export const gardensGeo = fc(gardenFeats)

// 曲江池（形如葫芦的曲水）
const QJ_CX = 4250, QJ_CY = IC_BOTTOM + 7.4 * S_ROW
const quPts: [number, number][] = [
  [-560, -120], [-300, -360], [80, -420], [380, -260], [520, 60], [430, 480],
  [560, 800], [430, 1120], [60, 1230], [-340, 1090], [-430, 760], [-260, 470], [-460, 210],
]
const waterFeats: F[] = [blob(QJ_CX, QJ_CY, quPts, { name: '曲江池', kind: 'water' })]
labels.push({ lng: lng(QJ_CX), lat: lat(QJ_CY + 420), text: '曲江池', kind: 'water', minZoom: 11.5 })

// 兴庆宫·龙池
waterFeats.push(blob((COLS_E[4][0] + COLS_E[4][1]) / 2, XQ_B - 360, [[-330, -150], [-100, -230], [200, -180], [330, 0], [180, 170], [-180, 190], [-340, 60]], { name: '龙池', kind: 'water' }))
// 大明宫·太液池
waterFeats.push(blob(DANFENG_X, -1620, [[-360, -140], [-120, -230], [220, -190], [380, -20], [260, 150], [-100, 200], [-330, 90]], { name: '太液池', kind: 'water' }))
labels.push({ lng: lng(DANFENG_X), lat: lat(-1620), text: '太液池', kind: 'water', minZoom: 13 })
export const waterGeo = fc(waterFeats)

// ─── 城垣与城门 ─────────────────────────────────────────────
const wallRing: number[][] = [
  [lng(-HALF_W), lat(0)], [lng(HALF_W), lat(0)], [lng(HALF_W), lat(CITY_H)],
  [lng(-HALF_W), lat(CITY_H)], [lng(-HALF_W), lat(0)],
]
export const wallsGeo = fc([
  { type: 'Feature', properties: { name: '外郭城' }, geometry: { type: 'LineString', coordinates: wallRing } },
  { type: 'Feature', properties: { name: '大明宫' }, geometry: { type: 'LineString', coordinates: DMG } },
])

interface Gate { name: string; x: number; m: number; minZoom?: number }
const R89 = IC_BOTTOM + 4 * S_ROW // 延兴—延平大街
const GATES: Gate[] = [
  { name: '明德门', x: 0, m: CITY_H },
  { name: '安化门', x: -1360, m: CITY_H },
  { name: '启夏门', x: 1360, m: CITY_H },
  { name: '金光门', x: -HALF_W, m: IC_BOTTOM + 30 },
  { name: '春明门', x: HALF_W, m: IC_BOTTOM + 30 },
  { name: '开远门', x: -HALF_W, m: 2 * STRIP_ROW },
  { name: '通化门', x: HALF_W, m: 2 * STRIP_ROW },
  { name: '延平门', x: -HALF_W, m: R89 },
  { name: '延兴门', x: HALF_W, m: R89 },
  { name: '玄武门', x: 0, m: 0, minZoom: 12.5 },
  { name: '丹凤门', x: DANFENG_X, m: 0 },
  { name: '朱雀门', x: 0, m: IC_BOTTOM },
  { name: '含光门', x: -705, m: IC_BOTTOM, minZoom: 13 },
  { name: '安上门', x: 705, m: IC_BOTTOM, minZoom: 13 },
  { name: '承天门', x: 0, m: PALACE_H, minZoom: 13.5 },
]
export const gatesGeo = fc(GATES.map(g => ({
  type: 'Feature' as const,
  properties: { name: g.name },
  geometry: { type: 'Point' as const, coordinates: [lng(g.x), lat(g.m)] },
})))
GATES.forEach(g => labels.push({ lng: lng(g.x), lat: lat(g.m), text: g.name, kind: 'gate', minZoom: g.minZoom ?? 12.8 }))

// 朱雀大街标注（竖排沿轴线）
labels.push({ lng: lng(0), lat: lat(IC_BOTTOM + 2.6 * S_ROW), text: '朱雀大街', kind: 'street', minZoom: 12 })
labels.push({ lng: lng(0), lat: lat(IC_BOTTOM + 6.6 * S_ROW), text: '朱雀大街', kind: 'street', minZoom: 13.4 })

// ─── 唐迹点位（仅唐代存在、今已无存或仅余遗址的名所） ────────
// name 保留汉字用于图面标注；title / note 为弹窗用多语解说
export interface TangSite { name: string; x: number; m: number; title: L10n; note: L10n }
export const TANG_SITES: TangSite[] = [
  {
    name: '麟德殿', x: 1700, m: -1750,
    title: { 'zh-CN': '麟德殿', 'zh-TW': '麟德殿', en: 'Linde Hall', ja: '麟徳殿', ko: '인덕전' },
    note: {
      'zh-CN': '大明宫宴见之所，三殿毗连，曾大宴三千人，亦于此接见日本遣唐使。',
      'zh-TW': '大明宮宴見之所，三殿毗連，曾大宴三千人，亦於此接見日本遣唐使。',
      en: 'The banqueting and audience hall of Daming Palace — three halls joined, it once feasted three thousand guests and received Japanese envoys.',
      ja: '大明宮の宴と謁見の殿。三殿が連なり、かつて三千人を饗応し、日本の遣唐使もここで接見した。',
      ko: '대명궁의 연회·접견 전각. 세 전각이 이어져 한때 삼천 명을 연회하고, 일본 견당사도 여기서 접견했다.',
    },
  },
  {
    name: '沉香亭', x: 4480, m: 2540,
    title: { 'zh-CN': '沉香亭', 'zh-TW': '沉香亭', en: 'Aloeswood Pavilion', ja: '沈香亭', ko: '침향정' },
    note: {
      'zh-CN': '兴庆宫龙池东北。牡丹盛开时，玄宗召李白醉写《清平调》——"云想衣裳花想容"。',
      'zh-TW': '興慶宮龍池東北。牡丹盛開時，玄宗召李白醉寫《清平調》——「雲想衣裳花想容」。',
      en: "Northeast of the Dragon Pool in Xingqing Palace. As the peonies bloomed, Emperor Xuanzong summoned a tipsy Li Bai to write the 'Qingping' verses for Yang Guifei.",
      ja: '興慶宮の龍池の東北。牡丹の盛りに、玄宗は酔った李白を召して『清平調』を書かせた。',
      ko: '흥경궁 용지의 동북. 모란이 한창일 때 현종이 취한 이백을 불러 양귀비를 위한 『청평조』를 짓게 했다.',
    },
  },
  {
    name: '花萼相辉楼', x: 3950, m: 3140,
    title: { 'zh-CN': '花萼相辉楼', 'zh-TW': '花萼相輝樓', en: 'Hua\'e Xianghui Tower', ja: '花萼相輝楼', ko: '화악상휘루' },
    note: {
      'zh-CN': '兴庆宫西南隅，玄宗与诸王同宴之楼，取"棠棣花萼相辉"之意，号天下名楼。',
      'zh-TW': '興慶宮西南隅，玄宗與諸王同宴之樓，取「棠棣花萼相輝」之意，號天下名樓。',
      en: "In the southwest of Xingqing Palace, where Emperor Xuanzong feasted with his brothers — named for 'blossoms and calyxes shining together,' a symbol of fraternal harmony.",
      ja: '興慶宮の西南隅、玄宗が諸王と宴した楼。「花と萼が互いに照り映える」（兄弟の和合）の意で、天下の名楼と称された。',
      ko: '흥경궁 서남쪽, 현종이 형제들과 연회하던 누각. "꽃과 꽃받침이 서로 빛난다"(형제의 화합)는 뜻으로 천하의 명루로 불렸다.',
    },
  },
  {
    name: '国子监', x: 1120, m: 3760,
    title: { 'zh-CN': '国子监', 'zh-TW': '國子監', en: 'Imperial Academy', ja: '国子監', ko: '국자감' },
    note: {
      'zh-CN': '务本坊。大唐最高学府，盛时学子八千，新罗、日本留学生群集于此。',
      'zh-TW': '務本坊。大唐最高學府，盛時學子八千，新羅、日本留學生群集於此。',
      en: "In Wuben ward — the Tang's highest seat of learning, with eight thousand students at its height, drawing students from Silla and Japan.",
      ja: '務本坊。大唐の最高学府で、最盛期には学生八千、新羅・日本の留学生も集った。',
      ko: '무본방. 대당 최고 학부로, 전성기에 학생 팔천, 신라·일본 유학생도 모였다.',
    },
  },
  {
    name: '京兆府', x: -1830, m: 4350,
    title: { 'zh-CN': '京兆府', 'zh-TW': '京兆府', en: 'Jingzhao Prefecture', ja: '京兆府', ko: '경조부' },
    note: {
      'zh-CN': '光德坊。治理百万人口长安城的官署，万年、长安两县所辖即以朱雀大街为界。',
      'zh-TW': '光德坊。治理百萬人口長安城的官署，萬年、長安兩縣所轄即以朱雀大街為界。',
      en: "In Guangde ward — the office governing a city of a million; its two counties, Wannian and Chang'an, were divided by Zhuque Avenue.",
      ja: '光徳坊。百万の人口を擁する長安を治めた役所。万年・長安の二県は朱雀大街を境とした。',
      ko: '광덕방. 백만 인구의 장안을 다스리던 관청. 만년·장안 두 현이 주작대가를 경계로 나뉘었다.',
    },
  },
  {
    name: '西明寺', x: -2380, m: 4900,
    title: { 'zh-CN': '西明寺', 'zh-TW': '西明寺', en: 'Ximing Temple', ja: '西明寺', ko: '서명사' },
    note: {
      'zh-CN': '延康坊西南隅。玄奘曾居之，园林之盛冠绝诸寺，日本求法僧多寓于此。',
      'zh-TW': '延康坊西南隅。玄奘曾居之，園林之盛冠絕諸寺，日本求法僧多寓於此。',
      en: 'In the southwest of Yankang ward. Xuanzang once lived here; its gardens surpassed all other temples, and Japanese pilgrim-monks often lodged here.',
      ja: '延康坊の西南隅。玄奘も住み、庭園の壮麗は諸寺で随一。日本の求法僧も多く滞在した。',
      ko: '연강방 서남쪽. 현장도 머물렀고 정원의 화려함이 여러 절 중 으뜸. 일본 구법승도 자주 묵었다.',
    },
  },
  {
    name: '玄都观', x: -230, m: 6130,
    title: { 'zh-CN': '玄都观', 'zh-TW': '玄都觀', en: 'Xuandu Abbey', ja: '玄都観', ko: '현도관' },
    note: {
      'zh-CN': '崇业坊。刘禹锡两游题诗："玄都观里桃千树，尽是刘郎去后栽。"',
      'zh-TW': '崇業坊。劉禹錫兩遊題詩：「玄都觀裡桃千樹，盡是劉郎去後栽。」',
      en: "In Chongye ward. The poet Liu Yuxi visited twice and wrote: 'A thousand peach trees in Xuandu Abbey — all planted since this Liu went away.'",
      ja: '崇業坊。劉禹錫が二度訪れ「玄都観裡桃千樹、尽く是れ劉郎去りて後に栽う」と詠んだ。',
      ko: '숭업방. 유우석이 두 번 찾아 "현도관 안 복숭아 천 그루, 모두 유랑이 떠난 뒤 심은 것"이라 읊었다.',
    },
  },
  {
    name: '大庄严寺木塔', x: -4150, m: 8330,
    title: { 'zh-CN': '大庄严寺木塔', 'zh-TW': '大莊嚴寺木塔', en: 'Da Zhuangyan Wooden Pagoda', ja: '大荘厳寺木塔', ko: '대장엄사 목탑' },
    note: {
      'zh-CN': '永阳坊。隋建木浮图高耸入云，与大总持寺双塔并峙，为城西南之望。',
      'zh-TW': '永陽坊。隋建木浮圖高聳入雲，與大總持寺雙塔並峙，為城西南之望。',
      en: 'In Yongyang ward. The Sui-built wooden pagoda soared into the clouds, paired with Da Zongchi Temple\'s tower — a landmark of the southwest.',
      ja: '永陽坊。隋が建てた木塔が雲を衝いてそびえ、大総持寺の塔と並び立ち、城の西南の目印となった。',
      ko: '영양방. 수가 세운 목탑이 구름을 찌를 듯 솟아 대총지사 탑과 나란히 서서 도성 서남쪽의 표지가 되었다.',
    },
  },
  {
    name: '乐游原', x: 3500, m: 6180,
    title: { 'zh-CN': '乐游原', 'zh-TW': '樂遊原', en: 'Leyou Plateau', ja: '楽遊原', ko: '낙유원' },
    note: {
      'zh-CN': '城内地势最高处，三月三、九月九士女登赏。"夕阳无限好，只是近黄昏"即咏于此。',
      'zh-TW': '城內地勢最高處，三月三、九月九士女登賞。「夕陽無限好，只是近黃昏」即詠於此。',
      en: "The highest ground in the city, climbed for festivals in spring and autumn. Li Shangyin's line 'the sunset is boundlessly fine, only that dusk draws near' was written here.",
      ja: '城内で最も高い地。上巳・重陽に人々が登って眺めた。李商隠の「夕陽無限に好し、只だ是れ黄昏に近し」はここで詠まれた。',
      ko: '도성에서 가장 높은 곳. 삼짇날·중양절에 사람들이 올라 경치를 즐겼다. 이상은의 "석양은 한없이 좋으나 다만 황혼에 가깝다"가 여기서 지어졌다.',
    },
  },
  {
    name: '杏园', x: 2100, m: 7860,
    title: { 'zh-CN': '杏园', 'zh-TW': '杏園', en: 'Apricot Garden', ja: '杏園', ko: '행원' },
    note: {
      'zh-CN': '通善坊，近曲江。新科进士于此初宴，遣"探花使"折园中名花。',
      'zh-TW': '通善坊，近曲江。新科進士於此初宴，遣「探花使」折園中名花。',
      en: "In Tongshan ward, near Qujiang. Newly passed graduates held their first feast here, sending a 'flower-plucking envoy' to gather the garden's finest blooms.",
      ja: '通善坊、曲江に近い。新及第の進士が初宴を開き、「探花使」を遣わして園の名花を手折らせた。',
      ko: '통선방, 곡강에 가깝다. 새로 급제한 진사들이 첫 연회를 열고 "탐화사"를 보내 정원의 명화를 꺾게 했다.',
    },
  },
]
export const sitesGeo = fc(TANG_SITES.map(s => ({
  type: 'Feature' as const,
  properties: { name: s.name, title: s.title, note: s.note },
  geometry: { type: 'Point' as const, coordinates: [lng(s.x), lat(s.m)] },
})))
TANG_SITES.forEach(s => labels.push({ lng: lng(s.x), lat: lat(s.m), text: s.name, kind: 'site', minZoom: 12.6 }))

// ─── 渠水（永安、清明、龙首三渠及黄渠，走向为示意） ──────────
const line = (pts: [number, number][], props: Record<string, unknown>): F => ({
  type: 'Feature', properties: props,
  geometry: { type: 'LineString', coordinates: pts.map(([x, m]) => [lng(x), lat(m)]) },
})
export const canalsGeo = fc([
  line([[-2700, 8652], [-2660, 7000], [-2610, 5200], [-2580, 4517], [-2580, 3336], [-2610, 1668], [-2640, 0]], { name: '永安渠' }),
  line([[-1450, 8652], [-1340, 6600], [-1160, 4600], [-1140, 3336], [-920, 2860], [-700, 1500]], { name: '清明渠' }),
  line([[4859, 1350], [3700, 1240], [2900, 1100], [2480, 880]], { name: '龙首渠' }),
  line([[2900, 1100], [2660, 320], [2480, -380], [2230, -1180]], { name: '龙首渠支' }),
  line([[4859, 7360], [4700, 7430], [4520, 7560]], { name: '黄渠' }),
])
labels.push({ lng: lng(-2640), lat: lat(2400), text: '永安渠', kind: 'canal', minZoom: 13.1 })
labels.push({ lng: lng(-1260), lat: lat(5600), text: '清明渠', kind: 'canal', minZoom: 13.1 })
labels.push({ lng: lng(3650), lat: lat(1180), text: '龙首渠', kind: 'canal', minZoom: 13.1 })

// ─── 明城墙轮廓（今存城墙，作古今参照；实测经纬度） ──────────
export const mingWallGeo = fc([{
  type: 'Feature',
  properties: { name: '明城墙' },
  geometry: {
    type: 'LineString',
    coordinates: [
      [108.9286, 34.2496], [108.9595, 34.2496], [108.9595, 34.2790], [108.9286, 34.2790], [108.9286, 34.2496],
    ],
  },
}])
labels.push({ lng: 108.9610, lat: 34.2660, text: '明城墙（今）', kind: 'modernref', minZoom: 12.0 })

// ─── 诗句层 ─────────────────────────────────────────────────
const POEMS: { text: string; x: number; m: number }[] = [
  { text: '天街小雨润如酥', x: -430, m: 6900 },
  { text: '九天阊阖开宫殿', x: 1300, m: -950 },
  { text: '穿花蛱蝶深深见', x: 4130, m: 7470 },
  { text: '笑入胡姬酒肆中', x: -3140, m: 4470 },
  { text: '春风得意马蹄疾', x: 700, m: 8150 },
]
POEMS.forEach(p => labels.push({ lng: lng(p.x), lat: lat(p.m), text: p.text, kind: 'poem', minZoom: 12.3 }))

export const tangLabels = labels

// 绢底（覆盖唐城及四郊）
export const silkGeo = fc([poly(
  [[[108.79, 34.115], [109.13, 34.115], [109.13, 34.375], [108.79, 34.375], [108.79, 34.115]]],
  { kind: 'silk' },
)])

// ─── 古今地名定位 ───────────────────────────────────────────
export interface TangLocation {
  zone: 'ward' | 'palace' | 'market' | 'water' | 'garden' | 'street' | 'imperial' | 'outside'
  title: string // 地名（专名，保留汉字 + 译名由各语提供）
  detail?: string
  story?: string
}

const D = {
  daminggong: { 'zh-CN': '大明宫', 'zh-TW': '大明宮', en: 'Daming Palace', ja: '大明宮', ko: '대명궁' },
  dmgNear: {
    'zh-CN': '丹凤门内，含元殿前龙尾道一带。', 'zh-TW': '丹鳳門內，含元殿前龍尾道一帶。',
    en: 'Inside the Danfeng Gate, by the Dragon-Tail Ramp before Hanyuan Hall.',
    ja: '丹鳳門の内、含元殿前の龍尾道のあたり。', ko: '단봉문 안, 함원전 앞 용미도 일대.',
  },
  dmgMid: {
    'zh-CN': '宣政殿、紫宸殿一带——大唐的朝堂之上。', 'zh-TW': '宣政殿、紫宸殿一帶——大唐的朝堂之上。',
    en: 'Around the Xuanzheng and Zichen halls — atop the very court of the Tang.',
    ja: '宣政殿・紫宸殿のあたり——大唐の朝堂の上。', ko: '선정전·자신전 일대 —— 대당 조정 바로 위.',
  },
  dmgFar: {
    'zh-CN': '太液池畔，蓬莱仙境般的宫苑深处。', 'zh-TW': '太液池畔，蓬萊仙境般的宮苑深處。',
    en: 'By the Taiye Pool, deep in palace gardens like the isles of immortals.',
    ja: '太液池のほとり、蓬莱の仙境のような宮苑の奥。', ko: '태액지 가, 봉래 선경 같은 궁원 깊은 곳.',
  },
  jinyuan: { 'zh-CN': '城北禁苑', 'zh-TW': '城北禁苑', en: 'The Northern Forbidden Park', ja: '城北の禁苑', ko: '성북 금원' },
  jinyuanD: {
    'zh-CN': '唐时为皇家禁苑，北望渭水。', 'zh-TW': '唐時為皇家禁苑，北望渭水。',
    en: 'In the Tang, the imperial hunting park, looking north to the Wei River.',
    ja: '唐代は皇家の禁苑。北に渭水を望む。', ko: '당대에는 황실 금원. 북으로 위수를 바라본다.',
  },
  outS: { 'zh-CN': '唐长安城南郭之外', 'zh-TW': '唐長安城南郭之外', en: "Beyond the south wall of Tang Chang'an", ja: '唐長安城の南郭の外', ko: '당 장안성 남곽 밖' },
  outE: { 'zh-CN': '唐长安城东郭之外', 'zh-TW': '唐長安城東郭之外', en: "Beyond the east wall of Tang Chang'an", ja: '唐長安城の東郭の外', ko: '당 장안성 동곽 밖' },
  outW: { 'zh-CN': '唐长安城西郭之外', 'zh-TW': '唐長安城西郭之外', en: "Beyond the west wall of Tang Chang'an", ja: '唐長安城の西郭の外', ko: '당 장안성 서곽 밖' },
  outSD: {
    'zh-CN': '出明德门南行，便是终南山方向。', 'zh-TW': '出明德門南行，便是終南山方向。',
    en: 'South out the Mingde Gate lies the way to the Zhongnan Mountains.',
    ja: '明徳門を出て南へ行けば、終南山の方向。', ko: '명덕문을 나서 남으로 가면 종남산 방향.',
  },
  outED: {
    'zh-CN': '出春明门东行，灞桥折柳送别之地。', 'zh-TW': '出春明門東行，灞橋折柳送別之地。',
    en: 'East out the Chunming Gate stands Ba Bridge, where willow sprigs marked farewells.',
    ja: '春明門を出て東へ、灞橋——柳を手折って別れを惜しんだ地。', ko: '춘명문을 나서 동으로, 파교 —— 버들가지를 꺾어 이별하던 곳.',
  },
  outWD: {
    'zh-CN': '出金光门西行，丝绸之路的起点大道。', 'zh-TW': '出金光門西行，絲綢之路的起點大道。',
    en: 'West out the Jinguang Gate runs the great road that began the Silk Road.',
    ja: '金光門を出て西へ、シルクロードの起点となった大道。', ko: '금광문을 나서 서로, 실크로드가 시작된 대로.',
  },
  xingqing: { 'zh-CN': '兴庆宫', 'zh-TW': '興慶宮', en: 'Xingqing Palace', ja: '興慶宮', ko: '흥경궁' },
  xingqingD: {
    'zh-CN': '玄宗"南内"。沉香亭北倚阑干，李白于此写下《清平调》。', 'zh-TW': '玄宗「南內」。沉香亭北倚闌干，李白於此寫下《清平調》。',
    en: "Emperor Xuanzong's 'Southern Inner Palace.' By the Aloeswood Pavilion, Li Bai wrote his 'Qingping' verses here.",
    ja: '玄宗の「南内」。沈香亭に倚りて、李白はここで『清平調』を書いた。', ko: '현종의 "남내". 침향정 가에서 이백이 이곳에서 『청평조』를 지었다.',
  },
  gongYe: { 'zh-CN': '宫城 · 掖庭宫', 'zh-TW': '宮城 · 掖庭宮', en: 'Palace City · Yeting Palace', ja: '宮城 · 掖庭宮', ko: '궁성 · 액정궁' },
  gongDong: { 'zh-CN': '宫城 · 东宫', 'zh-TW': '宮城 · 東宮', en: 'Palace City · Eastern Palace', ja: '宮城 · 東宮', ko: '궁성 · 동궁' },
  gongTaiji: { 'zh-CN': '宫城 · 太极宫', 'zh-TW': '宮城 · 太極宮', en: 'Palace City · Taiji Palace', ja: '宮城 · 太極宮', ko: '궁성 · 태극궁' },
  gongD: {
    'zh-CN': '隋大兴宫、唐太极宫——西内正衙，玄武门之变即发生于宫城北门。', 'zh-TW': '隋大興宮、唐太極宮——西內正衙，玄武門之變即發生於宮城北門。',
    en: "The Sui Daxing and Tang Taiji palace — the western seat of power; the Xuanwu Gate Incident took place at this palace's north gate.",
    ja: '隋の大興宮、唐の太極宮——西内の正衙。玄武門の変はこの宮城北門で起きた。', ko: '수의 대흥궁, 당의 태극궁 —— 서내 정아. 현무문의 변이 이 궁성 북문에서 일어났다.',
  },
  huang: { 'zh-CN': '皇城', 'zh-TW': '皇城', en: 'The Imperial City', ja: '皇城', ko: '황성' },
  huangD: {
    'zh-CN': '尚书省、御史台等百官衙署所在，唐之"中央机关区"。今明城墙内西南片，街巷格局犹承唐制。',
    'zh-TW': '尚書省、御史臺等百官衙署所在，唐之「中央機關區」。今明城牆內西南片，街巷格局猶承唐制。',
    en: "Home to the Department of State Affairs, the Censorate and other bureaus — the Tang's 'central government district.' The street grid of today's southwest old city still follows the Tang plan.",
    ja: '尚書省・御史台など百官の役所が置かれた、唐の「中央官庁街」。今の明代城壁内の西南一帯は、なお唐の街区を受け継ぐ。',
    ko: '상서성·어사대 등 백관의 관아가 있던 당의 "중앙 관청가". 오늘날 명대 성벽 안 서남 일대의 거리 구획은 여전히 당의 제도를 잇는다.',
  },
  dongshi: { 'zh-CN': '东市', 'zh-TW': '東市', en: 'The East Market', ja: '東市', ko: '동시' },
  dongshiD: {
    'zh-CN': '邻贵族坊里，四方珍奇所聚；"买东西"之"东"即源于东西两市。', 'zh-TW': '鄰貴族坊里，四方珍奇所聚；「買東西」之「東」即源於東西兩市。',
    en: "Beside the noble wards, where rare goods from every direction gathered. The Chinese word for 'things' (dongxi, 'east-west') is said to come from these two markets.",
    ja: '貴族の坊に隣り、四方の珍品が集まった。中国語で「もの」を意味する「東西」は、この東西二市に由来するという。',
    ko: '귀족 방에 인접해 사방의 진귀한 물건이 모였다. 중국어로 "물건"을 뜻하는 "둥시(東西)"가 이 동서 두 시장에서 유래했다고 한다.',
  },
  xishiZ: { 'zh-CN': '西市', 'zh-TW': '西市', en: 'The West Market', ja: '西市', ko: '서시' },
  xishiD: {
    'zh-CN': '占地千亩、商铺数万，胡商云集的"金市"，丝绸之路最大的国际市场。', 'zh-TW': '佔地千畝、商鋪數萬，胡商雲集的「金市」，絲綢之路最大的國際市場。',
    en: "Hundreds of acres and tens of thousands of shops, the 'Golden Market' thronged with foreign merchants — the largest international market on the Silk Road.",
    ja: '千畝の地に数万の店、胡商の集う「金市」。シルクロード最大の国際市場。',
    ko: '천 무(畝)의 땅에 수만의 점포, 외래 상인이 운집한 "금시(金市)". 실크로드 최대의 국제 시장.',
  },
  qujiang: { 'zh-CN': '曲江 · 芙蓉园', 'zh-TW': '曲江 · 芙蓉園', en: 'Qujiang · Furong Garden', ja: '曲江 · 芙蓉園', ko: '곡강 · 부용원' },
  qujiangD: {
    'zh-CN': '皇家园林与曲江流饮之地。新科进士杏园探花、曲江大宴，"春风得意马蹄疾"。', 'zh-TW': '皇家園林與曲江流飲之地。新科進士杏園探花、曲江大宴，「春風得意馬蹄疾」。',
    en: "The imperial garden and the winding-stream banquets of Qujiang. New graduates plucked flowers in the Apricot Garden — 'spring breeze, proud heart, galloping hooves.'",
    ja: '皇家庭園と曲江の流觴の地。新及第者は杏園で花を手折り、「春風得意、馬蹄疾し」と詠まれた。',
    ko: '황실 정원이자 곡강의 유상곡수 연회의 땅. 새 급제자가 행원에서 꽃을 꺾던 곳 —— "봄바람에 득의하여 말발굽이 빠르다."',
  },
  zhuque: { 'zh-CN': '朱雀大街', 'zh-TW': '朱雀大街', en: 'Zhuque (Vermilion Bird) Avenue', ja: '朱雀大街', ko: '주작대가' },
  zhuqueD: {
    'zh-CN': '宽逾一百五十米的天街，北起朱雀门，南抵明德门。"天街小雨润如酥，草色遥看近却无。"',
    'zh-TW': '寬逾一百五十米的天街，北起朱雀門，南抵明德門。「天街小雨潤如酥，草色遙看近卻無。」',
    en: "The 'Heaven's Avenue,' over 150 m wide, from the Zhuque Gate in the north to the Mingde Gate in the south. 'Fine rain on the heavenly street, soft as cream; grass green from afar, but up close, scarcely there.'",
    ja: '幅百五十メートルを超える「天街」。北は朱雀門、南は明徳門に至る。「天街の小雨、潤いて酥の如し」。',
    ko: '너비 150m가 넘는 "천가(天街)". 북으로 주작문, 남으로 명덕문에 이른다. "천가의 가랑비는 우유처럼 부드럽고…"',
  },
  jie: { 'zh-CN': '坊间街衢', 'zh-TW': '坊間街衢', en: "A street among the wards", ja: '坊の間の街路', ko: '방 사이 거리' },
  jieD: {
    'zh-CN': '唐长安的棋盘街道之上。"百千家似围棋局，十二街如种菜畦。"', 'zh-TW': '唐長安的棋盤街道之上。「百千家似圍棋局，十二街如種菜畦。」',
    en: "On the chessboard streets of Tang Chang'an. 'A thousand homes like a go board; the twelve avenues like furrows in a vegetable plot.'",
    ja: '唐長安の碁盤の街路の上。「百千の家は囲碁の局の似く、十二街は菜畦を種うるが如し」。',
    ko: "당 장안의 바둑판 거리 위. '천만 집은 바둑판 같고, 열두 거리는 채마밭 이랑 같다.'",
  },
}

export function locateInTang(lngIn: number, latIn: number, locale: Locale = 'en'): TangLocation {
  const x = (lngIn - AXIS_LNG) * M_PER_LNG // 轴线以东 m
  const m = (NORTH_LAT - latIn) * M_PER_LAT // 北墙以南 m
  const T = (f: L10n) => tr(f, locale)

  // 大明宫（梯形近似为矩形判断）
  if (m < 0) {
    if (m > -2150 && Math.abs(x - DANFENG_X) < 835 - (Math.abs(m) / 2150) * 215) {
      const detail = m > -700 ? T(D.dmgNear) : m > -1400 ? T(D.dmgMid) : T(D.dmgFar)
      return { zone: 'palace', title: T(D.daminggong), detail }
    }
    return { zone: 'outside', title: T(D.jinyuan), detail: T(D.jinyuanD) }
  }
  if (m > CITY_H || Math.abs(x) > HALF_W) {
    const title = m > CITY_H ? T(D.outS) : x > 0 ? T(D.outE) : T(D.outW)
    const detail = m > CITY_H ? T(D.outSD) : x > 0 ? T(D.outED) : T(D.outWD)
    return { zone: 'outside', title, detail }
  }
  // 兴庆宫
  if (x >= COLS_E[4][0] && x <= COLS_E[4][1] && m >= XQ_T && m <= XQ_B)
    return { zone: 'palace', title: T(D.xingqing), detail: T(D.xingqingD) }
  // 宫城 / 皇城
  if (Math.abs(x) <= IC_HALF_W && m <= IC_BOTTOM) {
    if (m <= PALACE_H)
      return { zone: 'palace', title: x < -940 ? T(D.gongYe) : x > 940 ? T(D.gongDong) : T(D.gongTaiji), detail: T(D.gongD) }
    return { zone: 'imperial', title: T(D.huang), detail: T(D.huangD) }
  }
  // 两市
  if (m >= MKT_T - 30 && m <= MKT_B + 30) {
    if (x >= COLS_E[3][0] && x <= COLS_E[3][1]) return { zone: 'market', title: T(D.dongshi), detail: T(D.dongshiD) }
    if (x <= -COLS_E[3][0] && x >= -COLS_E[3][1]) return { zone: 'market', title: T(D.xishiZ), detail: T(D.xishiD) }
  }
  // 曲江 / 芙蓉园
  if (x >= FRY_X1 && m >= FRY_T) return { zone: 'garden', title: T(D.qujiang), detail: T(D.qujiangD) }
  // 坊
  for (const f of wardFeats) {
    const [[x1y1, , x2y2]] = (f.geometry as Polygon).coordinates as [number[][]]
    const [lng1, lat1] = x1y1
    const [lng2, lat2] = x2y2
    if (lngIn >= lng1 && lngIn <= lng2 && latIn <= lat1 && latIn >= lat2) {
      const name = (f.properties as { name: string }).name
      const story = FANG_STORIES[name]
      return { zone: 'ward', title: `${name}坊`, story: story ? tr(story, locale) : undefined }
    }
  }
  // 街上
  if (Math.abs(x) <= HALF_ST + 10 && m > IC_BOTTOM) return { zone: 'street', title: T(D.zhuque), detail: T(D.zhuqueD) }
  return { zone: 'street', title: T(D.jie), detail: T(D.jieD) }
}

// ─── 古今对照景点 ───────────────────────────────────────────
// nameZh 用于图面红针标注；其余字段为多语弹窗/卡片
export interface Poi {
  id: string
  nameZh: string
  lng: number
  lat: number
  name: L10n
  modern: L10n
  tangName: L10n
  tang: L10n
}

export const POIS: Poi[] = [
  {
    id: 'dayanta', nameZh: '大雁塔', lng: 108.95943, lat: 34.2198,
    name: { 'zh-CN': '大雁塔', 'zh-TW': '大雁塔', en: 'Giant Wild Goose Pagoda', ja: '大雁塔', ko: '대안탑' },
    modern: { 'zh-CN': '西安地标，大慈恩寺内唐塔', 'zh-TW': '西安地標，大慈恩寺內唐塔', en: "Xi'an's landmark Tang pagoda, within Da Ci'en Temple", ja: '西安のランドマーク、大慈恩寺の唐代の塔', ko: '시안의 랜드마크, 대자은사 안 당대 탑' },
    tangName: { 'zh-CN': '晋昌坊 · 大慈恩寺', 'zh-TW': '晉昌坊 · 大慈恩寺', en: "Jinchang Ward · Da Ci'en Temple", ja: '晋昌坊 · 大慈恩寺', ko: '진창방 · 대자은사' },
    tang: {
      'zh-CN': '玄奘法师自天竺取经归来，于此译经建塔。塔在唐时即是士子题名胜地——"雁塔题名"。',
      'zh-TW': '玄奘法師自天竺取經歸來，於此譯經建塔。塔在唐時即是士子題名勝地——「雁塔題名」。',
      en: "Returning from India, Xuanzang translated scriptures and built this pagoda here. In Tang times, passing graduates inscribed their names on it — the famous 'Wild Goose Pagoda inscriptions.'",
      ja: '玄奘が天竺から経を持ち帰り、ここで翻訳し塔を建てた。唐代には及第者が名を刻む「雁塔題名」の名所だった。',
      ko: '현장이 천축에서 경전을 가지고 돌아와 이곳에서 번역하고 탑을 세웠다. 당대에는 급제자가 이름을 새기던 "안탑제명"의 명소였다.',
    },
  },
  {
    id: 'xiaoyanta', nameZh: '小雁塔', lng: 108.93735, lat: 34.2408,
    name: { 'zh-CN': '小雁塔', 'zh-TW': '小雁塔', en: 'Small Wild Goose Pagoda', ja: '小雁塔', ko: '소안탑' },
    modern: { 'zh-CN': '西安博物院 · 荐福寺塔', 'zh-TW': '西安博物院 · 薦福寺塔', en: "Xi'an Museum · Jianfu Temple pagoda", ja: '西安博物院 · 薦福寺の塔', ko: '시안박물원 · 천복사 탑' },
    tangName: { 'zh-CN': '安仁坊 · 荐福寺塔院', 'zh-TW': '安仁坊 · 薦福寺塔院', en: 'Anren Ward · Jianfu pagoda court', ja: '安仁坊 · 薦福寺塔院', ko: '안인방 · 천복사 탑원' },
    tang: {
      'zh-CN': '义净法师译经之所。塔立于安仁坊西北隅，位置千年未移——它脚下的经纬度，唐宋至今从未改变。',
      'zh-TW': '義淨法師譯經之所。塔立於安仁坊西北隅，位置千年未移——它腳下的經緯度，唐宋至今從未改變。',
      en: 'Where the monk Yijing translated scriptures. The pagoda stands in the northwest of Anren ward, unmoved for a thousand years — the very coordinates beneath it unchanged since the Tang.',
      ja: '義浄が経典を翻訳した所。塔は安仁坊の北西隅に立ち、千年動かない——その足元の経緯度は唐宋から今も変わらない。',
      ko: '의정이 경전을 번역한 곳. 탑은 안인방 북서쪽 모퉁이에 서서 천 년 동안 움직이지 않았다 —— 그 아래 경위도는 당송 이래 지금도 그대로다.',
    },
  },
  {
    id: 'daminggong', nameZh: '大明宫遗址公园', lng: 108.95851, lat: 34.29389,
    name: { 'zh-CN': '大明宫遗址公园', 'zh-TW': '大明宮遺址公園', en: 'Daming Palace Heritage Park', ja: '大明宮遺跡公園', ko: '대명궁 유적공원' },
    modern: { 'zh-CN': '含元殿、丹凤门遗址', 'zh-TW': '含元殿、丹鳳門遺址', en: 'Ruins of Hanyuan Hall and Danfeng Gate', ja: '含元殿・丹鳳門の遺跡', ko: '함원전·단봉문 유적' },
    tangName: { 'zh-CN': '大明宫', 'zh-TW': '大明宮', en: 'Daming Palace', ja: '大明宮', ko: '대명궁' },
    tang: {
      'zh-CN': '"九天阊阖开宫殿，万国衣冠拜冕旒。"唐朝两百余年的政令中枢，面积约四个紫禁城。',
      'zh-TW': '「九天閶闔開宮殿，萬國衣冠拜冕旒。」唐朝兩百餘年的政令中樞，面積約四個紫禁城。',
      en: "'The gates of heaven open onto the palace; the robes of all nations bow to the crown.' The seat of Tang government for over two centuries — about four times the size of the Forbidden City.",
      ja: '「九天の閶闔、宮殿を開き、万国の衣冠、冕旒を拝す」。唐朝二百余年の政務の中枢、面積は紫禁城の約四倍。',
      ko: '"구천의 문이 궁전을 열고, 만국의 의관이 면류관에 절한다." 당조 이백여 년 정무의 중추, 면적은 자금성의 약 네 배.',
    },
  },
  {
    id: 'xingqing', nameZh: '兴庆宫公园', lng: 108.97903, lat: 34.25581,
    name: { 'zh-CN': '兴庆宫公园', 'zh-TW': '興慶宮公園', en: 'Xingqing Palace Park', ja: '興慶宮公園', ko: '흥경궁 공원' },
    modern: { 'zh-CN': '市民公园，存龙池一泓', 'zh-TW': '市民公園，存龍池一泓', en: 'A public park preserving the Dragon Pool', ja: '市民公園、龍池の一泓を残す', ko: '용지가 남은 시민공원' },
    tangName: { 'zh-CN': '兴庆宫 · 南内', 'zh-TW': '興慶宮 · 南內', en: 'Xingqing Palace · the Southern Inner Palace', ja: '興慶宮 · 南内', ko: '흥경궁 · 남내' },
    tang: {
      'zh-CN': '玄宗与杨贵妃常居之宫。沉香亭畔牡丹盛开时，李白奉诏写下"云想衣裳花想容"。',
      'zh-TW': '玄宗與楊貴妃常居之宮。沉香亭畔牡丹盛開時，李白奉詔寫下「雲想衣裳花想容」。',
      en: "The palace where Emperor Xuanzong and Yang Guifei often dwelt. As peonies bloomed by the Aloeswood Pavilion, Li Bai wrote 'her robes are clouds, her face a flower.'",
      ja: '玄宗と楊貴妃がよく住んだ宮。沈香亭のほとり、牡丹の盛りに李白は「雲は衣裳を想い、花は容を想う」と詠んだ。',
      ko: '현종과 양귀비가 자주 거하던 궁. 침향정 가 모란이 한창일 때 이백이 "구름은 옷을, 꽃은 얼굴을 떠올린다"고 읊었다.',
    },
  },
  {
    id: 'zhonglou', nameZh: '钟楼', lng: 108.94234, lat: 34.26101,
    name: { 'zh-CN': '钟楼', 'zh-TW': '鐘樓', en: 'Bell Tower', ja: '鐘楼', ko: '종루' },
    modern: { 'zh-CN': '明代钟楼，西安城十字中心', 'zh-TW': '明代鐘樓，西安城十字中心', en: "Ming-era Bell Tower, center of Xi'an's crossroads", ja: '明代の鐘楼、西安城の十字の中心', ko: '명대 종루, 시안 도심 교차로의 중심' },
    tangName: { 'zh-CN': '唐皇城之内', 'zh-TW': '唐皇城之內', en: 'Within the Tang imperial city', ja: '唐の皇城の内', ko: '당 황성 안' },
    tang: {
      'zh-CN': '此处唐时在皇城东部官署区上空。如今的钟楼十字，叠在唐代百官上朝的衙署之间。',
      'zh-TW': '此處唐時在皇城東部官署區上空。如今的鐘樓十字，疊在唐代百官上朝的衙署之間。',
      en: "In Tang times this stood over the eastern offices of the imperial city. Today's Bell Tower crossroads sits atop the bureaus where officials once gathered for court.",
      ja: '唐代にはここは皇城東部の官署区にあたる。今日の鐘楼の十字路は、百官が朝廷に出仕した役所の上に重なっている。',
      ko: '당대에는 이곳이 황성 동부의 관청 구역이었다. 오늘날 종루 교차로는 백관이 조정에 출사하던 관아 위에 겹쳐 있다.',
    },
  },
  {
    id: 'hanguangmen', nameZh: '含光门遗址博物馆', lng: 108.92908, lat: 34.25261,
    name: { 'zh-CN': '含光门遗址博物馆', 'zh-TW': '含光門遺址博物館', en: 'Hanguang Gate Ruins Museum', ja: '含光門遺跡博物館', ko: '함광문 유적박물관' },
    modern: { 'zh-CN': '明城墙内的唐代城门遗址', 'zh-TW': '明城牆內的唐代城門遺址', en: 'A Tang gate ruin within the Ming city wall', ja: '明代城壁内の唐代城門の遺跡', ko: '명대 성벽 안의 당대 성문 유적' },
    tangName: { 'zh-CN': '皇城 · 含光门', 'zh-TW': '皇城 · 含光門', en: 'Imperial City · Hanguang Gate', ja: '皇城 · 含光門', ko: '황성 · 함광문' },
    tang: {
      'zh-CN': '唐皇城南墙西门原址。明城墙正压唐皇城墙而建——在这里可以同时摸到唐与明。',
      'zh-TW': '唐皇城南牆西門原址。明城牆正壓唐皇城牆而建——在這裡可以同時摸到唐與明。',
      en: 'The original west gate of the Tang imperial city\'s south wall. The Ming wall was built directly atop the Tang wall — here you can touch both the Tang and the Ming at once.',
      ja: '唐皇城南壁の西門の原址。明代城壁は唐皇城の壁の上にそのまま築かれた——ここでは唐と明に同時に触れられる。',
      ko: '당 황성 남벽 서문의 원래 자리. 명대 성벽은 당 황성 벽 위에 그대로 쌓였다 —— 이곳에서 당과 명을 동시에 만질 수 있다.',
    },
  },
  {
    id: 'beilin', nameZh: '碑林博物馆', lng: 108.94813, lat: 34.25505,
    name: { 'zh-CN': '碑林博物馆', 'zh-TW': '碑林博物館', en: 'Beilin (Stele Forest) Museum', ja: '碑林博物館', ko: '비림박물관' },
    modern: { 'zh-CN': '文庙 · 石刻艺术宝库', 'zh-TW': '文廟 · 石刻藝術寶庫', en: 'Confucian temple · a treasury of stone-carved art', ja: '文廟 · 石刻芸術の宝庫', ko: '문묘 · 석각 예술의 보고' },
    tangName: { 'zh-CN': '唐皇城东南隅', 'zh-TW': '唐皇城東南隅', en: 'Southeast corner of the Tang imperial city', ja: '唐皇城の東南隅', ko: '당 황성 동남쪽' },
    tang: {
      'zh-CN': '藏《开成石经》——唐代国子监的"标准教科书"刻石，自唐务本坊国子监迁置于此。',
      'zh-TW': '藏《開成石經》——唐代國子監的「標準教科書」刻石，自唐務本坊國子監遷置於此。',
      en: "Home to the Kaicheng Stone Classics — the Tang Imperial Academy's 'standard textbooks' carved in stone, moved here from the academy in Wuben ward.",
      ja: '『開成石経』を蔵す——唐の国子監の「標準教科書」を刻んだ石碑。務本坊の国子監からここに移された。',
      ko: '『개성석경』을 소장 —— 당 국자감의 "표준 교과서"를 새긴 석비. 무본방의 국자감에서 이곳으로 옮겨졌다.',
    },
  },
  {
    id: 'shanlibo', nameZh: '陕西历史博物馆', lng: 108.95034, lat: 34.22591,
    name: { 'zh-CN': '陕西历史博物馆', 'zh-TW': '陝西歷史博物館', en: 'Shaanxi History Museum', ja: '陝西歴史博物館', ko: '산시성 역사박물관' },
    modern: { 'zh-CN': '唐代文物最盛的博物馆', 'zh-TW': '唐代文物最盛的博物館', en: 'The richest museum of Tang artifacts', ja: '唐代の文物が最も充実した博物館', ko: '당대 문물이 가장 풍부한 박물관' },
    tangName: { 'zh-CN': '安善坊一带', 'zh-TW': '安善坊一帶', en: 'Around Anshan Ward', ja: '安善坊あたり', ko: '안선방 일대' },
    tang: {
      'zh-CN': '馆藏何家村窖藏金银器，正出土于城中兴化坊旧址；唐墓壁画馆藏懿德太子墓《阙楼仪仗图》。',
      'zh-TW': '館藏何家村窖藏金銀器，正出土於城中興化坊舊址；唐墓壁畫館藏懿德太子墓《闕樓儀仗圖》。',
      en: "Holds the Hejiacun gold and silver hoard, unearthed at the old Xinghua ward; its mural gallery keeps the 'Tower and Honor Guard' from Prince Yide's tomb.",
      ja: '何家村の金銀器埋蔵品を所蔵——城内の興化坊旧址から出土。唐墓壁画館には懿徳太子墓の『闕楼儀仗図』を蔵す。',
      ko: '허자춘 금은기 매장품을 소장 —— 도성 안 흥화방 옛터에서 출토. 당묘 벽화관에는 의덕태자묘의 「궐루의장도」가 있다.',
    },
  },
  {
    id: 'xingshansi', nameZh: '大兴善寺', lng: 108.93881, lat: 34.22866,
    name: { 'zh-CN': '大兴善寺', 'zh-TW': '大興善寺', en: 'Da Xingshan Temple', ja: '大興善寺', ko: '대흥선사' },
    modern: { 'zh-CN': '至今香火不断的古刹', 'zh-TW': '至今香火不斷的古剎', en: 'An ancient temple, its incense still burning today', ja: '今も香煙絶えぬ古刹', ko: '지금도 향화가 끊이지 않는 고찰' },
    tangName: { 'zh-CN': '靖善坊 · 大兴善寺', 'zh-TW': '靖善坊 · 大興善寺', en: 'Jingshan Ward · Da Xingshan Temple', ja: '靖善坊 · 大興善寺', ko: '정선방 · 대흥선사' },
    tang: {
      'zh-CN': '隋唐皇家寺院、密宗祖庭，"开元三大士"于此译密典。寺址自隋至今未曾移动。',
      'zh-TW': '隋唐皇家寺院、密宗祖庭，「開元三大士」於此譯密典。寺址自隋至今未曾移動。',
      en: "A Sui–Tang imperial temple and cradle of Esoteric Buddhism, where the 'Three Great Masters of Kaiyuan' translated the tantras. Its site has not moved since the Sui.",
      ja: '隋唐の皇室寺院、密教の祖庭。「開元三大士」がここで密典を訳した。寺地は隋から今に至るまで動いていない。',
      ko: '수·당 황실 사원이자 밀교의 조정. "개원 삼대사"가 이곳에서 밀교 경전을 번역했다. 절터는 수나라 이래 움직이지 않았다.',
    },
  },
  {
    id: 'qinglongsi', nameZh: '青龙寺遗址', lng: 108.98459, lat: 34.23398,
    name: { 'zh-CN': '青龙寺遗址', 'zh-TW': '青龍寺遺址', en: 'Qinglong Temple Site', ja: '青龍寺遺跡', ko: '청룡사 유적' },
    modern: { 'zh-CN': '樱花名所 · 空海纪念碑', 'zh-TW': '櫻花名所 · 空海紀念碑', en: 'Cherry-blossom spot · Kūkai memorial', ja: '桜の名所 · 空海記念碑', ko: '벚꽃 명소 · 구카이 기념비' },
    tangName: { 'zh-CN': '新昌坊 · 青龙寺', 'zh-TW': '新昌坊 · 青龍寺', en: 'Xinchang Ward · Qinglong Temple', ja: '新昌坊 · 青龍寺', ko: '신창방 · 청룡사' },
    tang: {
      'zh-CN': '日本空海于此受密法，归国创真言宗——青龙寺由此成为日本游客的朝圣地。',
      'zh-TW': '日本空海於此受密法，歸國創真言宗——青龍寺由此成為日本遊客的朝聖地。',
      en: 'Here Kūkai of Japan received the Esoteric teachings and, on his return, founded the Shingon school — making Qinglong Temple a pilgrimage site for Japanese visitors.',
      ja: '日本の空海がここで密法を受け、帰国して真言宗を開いた——青龍寺はそれゆえ日本人参拝者の聖地となった。',
      ko: '일본의 구카이가 이곳에서 밀법을 받아 귀국 후 진언종을 열었다 —— 그래서 청룡사는 일본 방문객의 순례지가 되었다.',
    },
  },
  {
    id: 'xishi', nameZh: '大唐西市博物馆', lng: 108.90541, lat: 34.2532,
    name: { 'zh-CN': '大唐西市博物馆', 'zh-TW': '大唐西市博物館', en: 'Tang West Market Museum', ja: '大唐西市博物館', ko: '대당서시 박물관' },
    modern: { 'zh-CN': '建于西市原址的遗址博物馆', 'zh-TW': '建於西市原址的遺址博物館', en: 'A site museum built on the original West Market', ja: '西市の原址に建つ遺跡博物館', ko: '서시 원지에 세운 유적박물관' },
    tangName: { 'zh-CN': '西市', 'zh-TW': '西市', en: 'The West Market', ja: '西市', ko: '서시' },
    tang: {
      'zh-CN': '丝绸之路东端起点的国际市场，波斯邸、胡姬酒肆林立。馆内可看到唐代市井道路与车辙原迹。',
      'zh-TW': '絲綢之路東端起點的國際市場，波斯邸、胡姬酒肆林立。館內可看到唐代市井道路與車轍原跡。',
      en: 'The international market at the eastern end of the Silk Road, lined with Persian shops and foreign taverns. Inside, you can see the original Tang street and cart ruts.',
      ja: 'シルクロード東端の起点となった国際市場。ペルシア商館や胡姫の酒家が立ち並んだ。館内では唐代の市の道路と轍の跡が見られる。',
      ko: '실크로드 동쪽 끝 기점의 국제 시장. 페르시아 상점과 외래 주점이 늘어섰다. 관내에서 당대 시장 도로와 수레바퀴 자국 원형을 볼 수 있다.',
    },
  },
  {
    id: 'qujiang', nameZh: '曲江池遗址公园', lng: 108.975, lat: 34.20583,
    name: { 'zh-CN': '曲江池遗址公园', 'zh-TW': '曲江池遺址公園', en: 'Qujiang Pool Heritage Park', ja: '曲江池遺跡公園', ko: '곡강지 유적공원' },
    modern: { 'zh-CN': '重修的曲江水景公园', 'zh-TW': '重修的曲江水景公園', en: 'A restored waterside park at Qujiang', ja: '再建された曲江の水景公園', ko: '복원된 곡강 수경 공원' },
    tangName: { 'zh-CN': '曲江池', 'zh-TW': '曲江池', en: 'Qujiang Pool', ja: '曲江池', ko: '곡강지' },
    tang: {
      'zh-CN': '唐人最爱的春游之地。上巳曲江宴、新科进士杏园探花，皆在此水畔。',
      'zh-TW': '唐人最愛的春遊之地。上巳曲江宴、新科進士杏園探花，皆在此水畔。',
      en: "The Tang people's favorite spring-outing spot. The Shangsi festival banquet and the new graduates' flower-plucking all happened by this water.",
      ja: '唐の人々が最も愛した春の行楽地。上巳の曲江の宴も、新及第者の杏園探花も、みなこの水辺で行われた。',
      ko: '당나라 사람들이 가장 사랑한 봄나들이 명소. 상사절 곡강 연회도, 새 급제자의 행원 탐화도 모두 이 물가에서 열렸다.',
    },
  },
  {
    id: 'furong', nameZh: '大唐芙蓉园', lng: 108.96934, lat: 34.21494,
    name: { 'zh-CN': '大唐芙蓉园', 'zh-TW': '大唐芙蓉園', en: 'Tang Paradise (Furong Garden)', ja: '大唐芙蓉園', ko: '대당부용원' },
    modern: { 'zh-CN': '仿唐皇家园林', 'zh-TW': '仿唐皇家園林', en: 'A re-created Tang imperial garden', ja: '唐風の皇家庭園を再現', ko: '당풍 황실 정원 재현' },
    tangName: { 'zh-CN': '芙蓉园 · 紫云楼', 'zh-TW': '芙蓉園 · 紫雲樓', en: 'Furong Garden · Ziyun Tower', ja: '芙蓉園 · 紫雲楼', ko: '부용원 · 자운루' },
    tang: {
      'zh-CN': '唐时为皇家禁苑芙蓉园，玄宗于紫云楼赐宴百官，与民同乐于曲江。',
      'zh-TW': '唐時為皇家禁苑芙蓉園，玄宗於紫雲樓賜宴百官，與民同樂於曲江。',
      en: 'In Tang times the imperial Furong Garden, where Emperor Xuanzong feasted his officials at Ziyun Tower and shared the joys of Qujiang with the people.',
      ja: '唐代は皇家禁苑の芙蓉園。玄宗は紫雲楼で百官に宴を賜い、曲江で民と楽しみを共にした。',
      ko: '당대에는 황실 금원 부용원. 현종이 자운루에서 백관에게 연회를 베풀고 곡강에서 백성과 즐거움을 함께했다.',
    },
  },
  {
    id: 'mingdemen', nameZh: '明德门遗址公园', lng: 108.93729, lat: 34.20649,
    name: { 'zh-CN': '明德门遗址公园', 'zh-TW': '明德門遺址公園', en: 'Mingde Gate Ruins Park', ja: '明徳門遺跡公園', ko: '명덕문 유적공원' },
    modern: { 'zh-CN': '郭城正南门遗址', 'zh-TW': '郭城正南門遺址', en: 'Ruins of the main south gate of the outer city', ja: '郭城の正南門の遺跡', ko: '곽성 정남문 유적' },
    tangName: { 'zh-CN': '明德门', 'zh-TW': '明德門', en: 'Mingde Gate', ja: '明徳門', ko: '명덕문' },
    tang: {
      'zh-CN': '隋唐长安城正南门，五个门道，天子郊祀由此出城。朱雀大街由此北望，直抵皇城。',
      'zh-TW': '隋唐長安城正南門，五個門道，天子郊祀由此出城。朱雀大街由此北望，直抵皇城。',
      en: "The main south gate of Sui–Tang Chang'an, with five passages, through which the emperor left the city for the suburban sacrifices. Look north from here and Zhuque Avenue runs straight to the imperial city.",
      ja: '隋唐長安城の正南門。五つの門道があり、天子は郊祀のためここから出城した。ここから北を望めば、朱雀大街がまっすぐ皇城に至る。',
      ko: '수·당 장안성의 정남문. 다섯 문길이 있어 천자가 교사(郊祀)를 위해 이곳으로 출성했다. 여기서 북을 바라보면 주작대가가 곧장 황성에 이른다.',
    },
  },
  {
    id: 'yongningmen', nameZh: '永宁门', lng: 108.94232, lat: 34.24991,
    name: { 'zh-CN': '永宁门', 'zh-TW': '永寧門', en: 'Yongning Gate', ja: '永寧門', ko: '영녕문' },
    modern: { 'zh-CN': '明城墙正南门 · 入城式', 'zh-TW': '明城牆正南門 · 入城式', en: 'Main south gate of the Ming wall · welcome ceremony', ja: '明代城壁の正南門 · 入城式', ko: '명대 성벽 정남문 · 입성식' },
    tangName: { 'zh-CN': '皇城南 · 兴道坊一带', 'zh-TW': '皇城南 · 興道坊一帶', en: 'South of the imperial city · around Xingdao Ward', ja: '皇城の南 · 興道坊あたり', ko: '황성 남쪽 · 흥도방 일대' },
    tang: {
      'zh-CN': '明城南门压在唐皇城南墙外的兴道坊上。今日入城式所在，唐时是朱雀门外的第一排坊里。',
      'zh-TW': '明城南門壓在唐皇城南牆外的興道坊上。今日入城式所在，唐時是朱雀門外的第一排坊里。',
      en: "The Ming south gate sits on Xingdao ward, just outside the Tang imperial city's south wall. Where the welcome ceremony is held today was the first row of wards beyond the Zhuque Gate.",
      ja: '明代の南門は、唐皇城南壁の外の興道坊の上に建つ。今日の入城式の地は、唐代には朱雀門外の最初の坊列だった。',
      ko: '명대 남문은 당 황성 남벽 바깥 흥도방 위에 있다. 오늘날 입성식이 열리는 곳은 당대에는 주작문 밖 첫 번째 방 줄이었다.',
    },
  },
  {
    id: 'gulou', nameZh: '回民街 · 北院门', lng: 108.93896, lat: 34.26345,
    name: { 'zh-CN': '回民街 · 北院门', 'zh-TW': '回民街 · 北院門', en: 'Muslim Quarter (Beiyuanmen)', ja: '回民街 · 北院門', ko: '회민가 · 베이위안먼' },
    modern: { 'zh-CN': '鼓楼以北 · 回坊风情街', 'zh-TW': '鼓樓以北 · 回坊風情街', en: 'The food street north of the Drum Tower', ja: '鼓楼の北 · 回坊の風情ある通り', ko: '고루 북쪽 · 회방 정취 거리' },
    tangName: { 'zh-CN': '皇城 · 尚书省一带', 'zh-TW': '皇城 · 尚書省一帶', en: 'Imperial City · around the Department of State Affairs', ja: '皇城 · 尚書省あたり', ko: '황성 · 상서성 일대' },
    tang: {
      'zh-CN': '今日的烟火回坊，唐时是皇城衙署森严之地；胡商的后裔与胡食的香气，倒与西市一脉相承。',
      'zh-TW': '今日的煙火回坊，唐時是皇城衙署森嚴之地；胡商的後裔與胡食的香氣，倒與西市一脈相承。',
      en: "Today's bustling Muslim quarter was, in the Tang, the solemn offices of the imperial city; yet the descendants of foreign merchants and the aromas of their food carry on the spirit of the old West Market.",
      ja: '今日の賑わう回坊は、唐代には厳めしい皇城の役所だった。だが胡商の末裔と胡食の香りは、むしろ西市の系譜を受け継いでいる。',
      ko: '오늘날 북적이는 회민가는 당대에는 삼엄한 황성의 관아였다. 그러나 외래 상인의 후예와 그 음식의 향기는 오히려 옛 서시의 맥을 잇는다.',
    },
  },
]

// 城市中心（用于初始视角）
export const CENTER: [number, number] = [AXIS_LNG, (NORTH_LAT + SOUTH_LAT) / 2]
