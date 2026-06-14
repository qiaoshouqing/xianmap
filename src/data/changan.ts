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

// ─── 坊中典故 ───────────────────────────────────────────────
export const FANG_STORIES: Record<string, string> = {
  平康: '长安风月之地"北里"所在，亦多进士寓居。新科进士曲江宴罢，多于此"探花"。',
  崇仁: '近皇城景风门与东市，"一街辐辏，遂倾两市"——昼夜喧呼、灯火不绝，为长安不夜之坊。',
  亲仁: '汾阳王郭子仪宅占坊四分之一，"堂前种花、堂后教歌"，安史之乱后长安最煊赫的宅第。',
  宣阳: '万年县廨所在；杨贵妃姊虢国夫人宅亦在此坊，韦应物少年时曾居坊中。',
  务本: '国子监与孔庙所在，四方学子、新罗日本遣唐留学生群聚于此。',
  开化: '荐福寺本坊。武则天为高宗荐福而立寺，义净于此译经。',
  安仁: '荐福寺塔院所在——今小雁塔仍立于坊西北原址，千年未移。',
  靖善: '大兴善寺尽一坊之地，隋唐皇家寺院、佛教密宗祖庭，寺址至今未变。',
  晋昌: '大慈恩寺本坊。玄奘自天竺归来于此译经，并建塔藏经——即今大雁塔。',
  新昌: '青龙寺所在。日本空海于此从惠果受密法，归国开真言宗；坊东南即乐游原。',
  靖安: '元稹宅在此坊。"靖安宅里当窗柳，望驿台前扑地花"即咏其宅。',
  昭国: '岑参、元稹皆曾居此；近曲江杏园，春日游人如织。',
  永崇: '玄宗时与永宁坊俱为贵第所聚；华严宗澄观曾驻锡坊中佛寺。',
  永兴: '魏征宅在此坊。太宗尝欲为其营小殿，征固辞，乃以其材为之造正堂。',
  长乐: '大安国寺所在，本睿宗藩邸；坊北即大明宫，百官晨朝多宿于此。',
  胜业: '近兴庆宫，王公主第甲于诸坊；歧王宅"寻常见"之地即在此左近。',
  道政: '紧邻兴庆宫南，宫人车马出入之地；坊中有龙兴观。',
  常乐: '白居易初入长安，"常乐里闲居"即赁居此坊东亭，写下《养竹记》。',
  安邑: '东市之南，刘禹锡曾居坊中；多波斯邸与酒家。',
  兴化: '1970年坊址（今何家村）出土千余件金银器窖藏，即"何家村遗宝"，今藏陕西历史博物馆。',
  崇业: '玄都观所在。刘禹锡两游玄都观，"玄都观里桃千树，尽是刘郎去后栽"。',
  太平: '温国寺、实际寺所在；近皇城含光门，朝官多居之。',
  光德: '京兆府廨所在——长安城的"市政府"；坊中亦有胜光寺。',
  延康: '西明寺所在，玄奘曾居之，寺园林冠绝诸寺；阎立本宅亦在此坊。',
  延寿: '"卖金银珠玉者"聚居，近西市，为长安珠宝业之坊。',
  醴泉: '坊中有袄祠、胡寺，西域商旅聚居，近西市，胡风最盛。',
  义宁: '大秦寺（景教寺院）所在，《大秦景教流行中国碑》即出于此。',
  怀远: '大云经寺所在；近西市，亦多西域客商。',
  丰邑: '坊多凶肆——专营丧葬仪仗之所，《李娃传》中两肆赛歌即在此类凶肆。',
  永阳: '大庄严寺与大总持寺并峙坊中，双木塔高耸，为城西南标志。',
  群贤: '近金光门，西出大道，商旅出入长安之孔道。',
  通济: '近启夏门与城南郊，坊南即唐人春游踏青之地。',
  翊善: '紧邻大明宫，宦官诸司多居之；武后析坊置光宅，丹凤门大街贯其间。',
  光宅: '武则天置光宅寺，内供养佛舍利；坊当丹凤门大街之东。',
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
export interface TangSite { name: string; x: number; m: number; note: string }
export const TANG_SITES: TangSite[] = [
  { name: '麟德殿', x: 1700, m: -1750, note: '大明宫宴见之所，三殿毗连，曾大宴三千人，亦于此接见日本遣唐使。' },
  { name: '沉香亭', x: 4480, m: 2540, note: '兴庆宫龙池东北。牡丹盛开时，玄宗召李白醉写《清平调》——"云想衣裳花想容"。' },
  { name: '花萼相辉楼', x: 3950, m: 3140, note: '兴庆宫西南隅，玄宗与诸王同宴之楼，取"棠棣花萼相辉"之意，号天下名楼。' },
  { name: '国子监', x: 1120, m: 3760, note: '务本坊。大唐最高学府，盛时学子八千，新罗、日本留学生群集于此。' },
  { name: '京兆府', x: -1830, m: 4350, note: '光德坊。治理百万人口长安城的官署，万年、长安两县所辖即以朱雀大街为界。' },
  { name: '西明寺', x: -2380, m: 4900, note: '延康坊西南隅。玄奘曾居之，园林之盛冠绝诸寺，日本求法僧多寓于此。' },
  { name: '玄都观', x: -230, m: 6130, note: '崇业坊。刘禹锡两游题诗："玄都观里桃千树，尽是刘郎去后栽。"' },
  { name: '大庄严寺木塔', x: -4150, m: 8330, note: '永阳坊。隋建木浮图高耸入云，与大总持寺双塔并峙，为城西南之望。' },
  { name: '乐游原', x: 3500, m: 6180, note: '城内地势最高处，三月三、九月九士女登赏。"夕阳无限好，只是近黄昏"即咏于此。' },
  { name: '杏园', x: 2100, m: 7860, note: '通善坊，近曲江。新科进士于此初宴，遣"探花使"折园中名花。' },
]
export const sitesGeo = fc(TANG_SITES.map(s => ({
  type: 'Feature' as const,
  properties: { name: s.name, note: s.note },
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
  title: string
  detail?: string
  story?: string
}

export function locateInTang(lngIn: number, latIn: number): TangLocation {
  const x = (lngIn - AXIS_LNG) * M_PER_LNG // 轴线以东 m
  const m = (NORTH_LAT - latIn) * M_PER_LAT // 北墙以南 m

  // 大明宫（梯形近似为矩形判断）
  if (m < 0) {
    if (m > -2150 && Math.abs(x - DANFENG_X) < 835 - (Math.abs(m) / 2150) * 215) {
      const detail = m > -700 ? '丹凤门内，含元殿前龙尾道一带。' : m > -1400 ? '宣政殿、紫宸殿一带——大唐的朝堂之上。' : '太液池畔，蓬莱仙境般的宫苑深处。'
      return { zone: 'palace', title: '大明宫', detail, story: FANG_STORIES['翊善'] && undefined }
    }
    return { zone: 'outside', title: '城北禁苑', detail: '唐时为皇家禁苑，北望渭水。' }
  }
  if (m > CITY_H || Math.abs(x) > HALF_W) {
    const dir = m > CITY_H ? '南郭之外' : x > 0 ? '东郭之外' : '西郭之外'
    const hint = m > CITY_H ? '出明德门南行，便是终南山方向。' : x > 0 ? '出春明门东行，灞桥折柳送别之地。' : '出金光门西行，丝绸之路的起点大道。'
    return { zone: 'outside', title: `唐长安城${dir}`, detail: hint }
  }
  // 兴庆宫
  if (x >= COLS_E[4][0] && x <= COLS_E[4][1] && m >= XQ_T && m <= XQ_B)
    return { zone: 'palace', title: '兴庆宫', detail: '玄宗"南内"。沉香亭北倚阑干，李白于此写下《清平调》。' }
  // 宫城 / 皇城
  if (Math.abs(x) <= IC_HALF_W && m <= IC_BOTTOM) {
    if (m <= PALACE_H) return { zone: 'palace', title: x < -940 ? '宫城 · 掖庭宫' : x > 940 ? '宫城 · 东宫' : '宫城 · 太极宫', detail: '隋大兴宫、唐太极宫——西内正衙，玄武门之变即发生于宫城北门。' }
    return { zone: 'imperial', title: '皇城', detail: '尚书省、御史台等百官衙署所在，唐之"中央机关区"。今明城墙内西南片，街巷格局犹承唐制。' }
  }
  // 两市
  if (m >= MKT_T - 30 && m <= MKT_B + 30) {
    if (x >= COLS_E[3][0] && x <= COLS_E[3][1]) return { zone: 'market', title: '东市', detail: '邻贵族坊里，四方珍奇所聚；"买东西"之"东"即源于东西两市。' }
    if (x <= -COLS_E[3][0] && x >= -COLS_E[3][1]) return { zone: 'market', title: '西市', detail: '占地千亩、商铺数万，胡商云集的"金市"，丝绸之路最大的国际市场。' }
  }
  // 曲江 / 芙蓉园
  if (x >= FRY_X1 && m >= FRY_T) return { zone: 'garden', title: '曲江 · 芙蓉园', detail: '皇家园林与曲江流饮之地。新科进士杏园探花、曲江大宴，"春风得意马蹄疾"。' }
  // 坊
  for (const f of wardFeats) {
    const [[x1y1, , x2y2]] = (f.geometry as Polygon).coordinates as [number[][]]
    const [lng1, lat1] = x1y1
    const [lng2, lat2] = x2y2
    if (lngIn >= lng1 && lngIn <= lng2 && latIn <= lat1 && latIn >= lat2) {
      const name = (f.properties as { name: string }).name
      return { zone: 'ward', title: `${name}坊`, story: FANG_STORIES[name], detail: undefined }
    }
  }
  // 街上
  if (Math.abs(x) <= HALF_ST + 10 && m > IC_BOTTOM) return { zone: 'street', title: '朱雀大街', detail: '宽逾一百五十米的天街，北起朱雀门，南抵明德门。"天街小雨润如酥，草色遥看近却无。"' }
  return { zone: 'street', title: '坊间街衢', detail: '唐长安的棋盘街道之上。"百千家似围棋局，十二街如种菜畦。"' }
}

// ─── 古今对照景点 ───────────────────────────────────────────
export interface Poi {
  id: string
  name: string
  lng: number
  lat: number
  modern: string
  tangName: string
  tang: string
}

export const POIS: Poi[] = [
  { id: 'dayanta', name: '大雁塔', lng: 108.95943, lat: 34.2198, modern: '西安地标，大慈恩寺内唐塔', tangName: '晋昌坊 · 大慈恩寺', tang: '玄奘法师自天竺取经归来，于此译经建塔。塔在唐时即是士子题名胜地——"雁塔题名"。' },
  { id: 'xiaoyanta', name: '小雁塔', lng: 108.93735, lat: 34.2408, modern: '西安博物院 · 荐福寺塔', tangName: '安仁坊 · 荐福寺塔院', tang: '义净法师译经之所。塔立于安仁坊西北隅，位置千年未移——它脚下的经纬度，唐宋至今从未改变。' },
  { id: 'daminggong', name: '大明宫遗址公园', lng: 108.95851, lat: 34.29389, modern: '含元殿、丹凤门遗址', tangName: '大明宫', tang: '"九天阊阖开宫殿，万国衣冠拜冕旒。"唐朝两百余年的政令中枢，面积约四个紫禁城。' },
  { id: 'xingqing', name: '兴庆宫公园', lng: 108.97903, lat: 34.25581, modern: '市民公园，存龙池一泓', tangName: '兴庆宫 · 南内', tang: '玄宗与杨贵妃常居之宫。沉香亭畔牡丹盛开时，李白奉诏写下"云想衣裳花想容"。' },
  { id: 'zhonglou', name: '钟楼', lng: 108.94234, lat: 34.26101, modern: '明代钟楼，西安城十字中心', tangName: '唐皇城之内', tang: '此处唐时在皇城东部官署区上空。如今的钟楼十字，叠在唐代百官上朝的衙署之间。' },
  { id: 'hanguangmen', name: '含光门遗址博物馆', lng: 108.92908, lat: 34.25261, modern: '明城墙内的唐代城门遗址', tangName: '皇城 · 含光门', tang: '唐皇城南墙西门原址。明城墙正压唐皇城墙而建——在这里可以同时摸到唐与明。' },
  { id: 'beilin', name: '碑林博物馆', lng: 108.94813, lat: 34.25505, modern: '文庙 · 石刻艺术宝库', tangName: '唐皇城东南隅', tang: '藏《开成石经》——唐代国子监的"标准教科书"刻石，自唐务本坊国子监迁置于此。' },
  { id: 'shanlibo', name: '陕西历史博物馆', lng: 108.95034, lat: 34.22591, modern: '唐代文物最盛的博物馆', tangName: '安善坊一带', tang: '馆藏何家村窖藏金银器，正出土于城中兴化坊旧址；唐墓壁画馆藏懿德太子墓《阙楼仪仗图》。' },
  { id: 'xingshansi', name: '大兴善寺', lng: 108.93881, lat: 34.22866, modern: '至今香火不断的古刹', tangName: '靖善坊 · 大兴善寺', tang: '隋唐皇家寺院、密宗祖庭，"开元三大士"于此译密典。寺址自隋至今未曾移动。' },
  { id: 'qinglongsi', name: '青龙寺遗址', lng: 108.98459, lat: 34.23398, modern: '樱花名所 · 空海纪念碑', tangName: '新昌坊 · 青龙寺', tang: '日本空海于此受密法，归国创真言宗——青龙寺由此成为日本游客的朝圣地。' },
  { id: 'xishi', name: '大唐西市博物馆', lng: 108.90541, lat: 34.2532, modern: '建于西市原址的遗址博物馆', tangName: '西市', tang: '丝绸之路东端起点的国际市场，波斯邸、胡姬酒肆林立。馆内可看到唐代市井道路与车辙原迹。' },
  { id: 'qujiang', name: '曲江池遗址公园', lng: 108.975, lat: 34.20583, modern: '重修的曲江水景公园', tangName: '曲江池', tang: '唐人最爱的春游之地。上巳曲江宴、新科进士杏园探花，皆在此水畔。' },
  { id: 'furong', name: '大唐芙蓉园', lng: 108.96934, lat: 34.21494, modern: '仿唐皇家园林', tangName: '芙蓉园 · 紫云楼', tang: '唐时为皇家禁苑芙蓉园，玄宗于紫云楼赐宴百官，与民同乐于曲江。' },
  { id: 'mingdemen', name: '明德门遗址公园', lng: 108.93729, lat: 34.20649, modern: '郭城正南门遗址', tangName: '明德门', tang: '隋唐长安城正南门，五个门道，天子郊祀由此出城。朱雀大街由此北望，直抵皇城。' },
  { id: 'yongningmen', name: '永宁门', lng: 108.94232, lat: 34.24991, modern: '明城墙正南门 · 入城式', tangName: '皇城南 · 兴道坊一带', tang: '明城南门压在唐皇城南墙外的兴道坊上。今日入城式所在，唐时是朱雀门外的第一排坊里。' },
  { id: 'gulou', name: '鼓楼 · 回民街', lng: 108.93884, lat: 34.26177, modern: '北院门风情街', tangName: '皇城 · 尚书省一带', tang: '今日的烟火回坊，唐时是皇城衙署森严之地；胡商的后裔与胡食的香气，倒与西市一脉相承。' },
]

// 城市中心（用于初始视角）
export const CENTER: [number, number] = [AXIS_LNG, (NORTH_LAT + SOUTH_LAT) / 2]
