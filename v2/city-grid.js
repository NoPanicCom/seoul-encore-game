const TYPE_NAMES = [
  ['cafe', 'Kafe', 'Кафе', 'Coffee',
    ['Dalbit', 'Dawon', 'Boram', 'Pulip', 'Jari', 'Gureum', 'Jadum', 'Yeoul', 'Sum', 'Orae']],
  ['restaurant', 'Restoran', 'Ресторан', 'Kitchen',
    ['Soban', 'Dodam', 'Eunha', 'Arang', 'Ujeong', 'Nokdu', 'Dure', 'Doduk', 'Garam', 'Haewon']],
  ['bakery', 'Fırın', 'Пекарня', 'Bakehouse',
    ['Miso', 'Bami', 'Mandeul', 'Bori', 'Jindallae', 'Yuram', 'Onyu', 'Nari', 'Harang', 'Yeondu']],
  ['convenience', 'Market', 'Магазин у дома', 'Market',
    ['Daldal', 'Neul', 'Sanho', 'Namu', 'Ire', 'Odal', 'Hayan', 'Yeopjip', 'Danbi', 'Haru']],
  ['fashion', 'Butik', 'Бутик одежды', 'Atelier',
    ['Sora', 'Heureum', 'Geul', 'Bich', 'Morae', 'Hanul', 'Gaeul', 'Narea', 'Hwarang', 'Haneul']],
  ['cosmetics', 'Kozmetik mağazası', 'Магазин косметики', 'Beauty',
    ['Yebom', 'Isul', 'Som', 'Nabi', 'Maeum', 'Geum', 'Hyangi', 'Seol', 'Jayeon', 'Maeil']],
  ['florist', 'Çiçekçi', 'Цветочный магазин', 'Flowers',
    ['Bomnal', 'Mokryeon', 'Yeonhwa', 'Bongseon', 'Jangmi', 'Yuchae', 'Boreum', 'Aram', 'Minari', 'Pureun']],
  ['bookstore', 'Kitapçı', 'Книжный магазин', 'Books',
    ['Chaekgil', 'Gyeol', 'Munjang', 'Saebyeok', 'Pyeonji', 'Bandal', 'Gilbom', 'Sidae', 'Yeobaek', 'Sumeun']],
  ['records', 'Plak dükkânı', 'Магазин винила', 'Records',
    ['Ohu', 'Geori', 'Geuneul', 'Ibyeol', 'Jongno', 'Yeok', 'Nopun', 'Sangsu', 'Wolyo', 'Mido']],
  ['karaoke', 'Karaoke', 'Караоке', 'Karaoke',
    ['Norae', 'Neon Dal', 'Hayan Bam', 'Dasi', 'On Air', 'Banjjak', 'Soneul', 'Baramgil', 'Bangul', 'Noeul']],
  ['arcade', 'Oyun salonu', 'Зал игровых автоматов', 'Arcade',
    ['Toktok', 'Binggo', 'Chingu', 'Jelly', 'Saeum', 'Saegeum', 'Sodam', 'Yoyo', 'Kokkiri', 'Harubam']],
  ['photobooth', 'Fotoğraf kabini', 'Фотобудка', 'Photo',
    ['Naeil', 'Seomyun', 'Jinsim', 'Sajin', 'Dalkom', 'Negeot', 'Gieok', 'Hanpyeon', 'Oraen', 'Cham']],
  ['cinema', 'Sinema', 'Кинотеатр', 'Cinema',
    ['Daehan', 'Owol', 'Mirae', 'Haedal', 'Shingu', 'Gipal', 'Dohwa', 'Wolbit', 'Hallim', 'Gunja']],
  ['gallery', 'Sanat galerisi', 'Художественная галерея', 'Gallery',
    ['Seom', 'Yeohaeng', 'Cheong', 'Jiyu', 'Yurim', 'Jinju', 'Geulim', 'Munrae', 'Hyeon', 'Woljeong']],
  ['dance-studio', 'Dans stüdyosu', 'Танцевальная студия', 'Dance',
    ['Umu', 'Dulset', 'Palpal', 'Chumgil', 'Deung', 'Riwon', 'Sae', 'Sori', 'Gaeulbi', 'Dallyeo']],
  ['music-studio', 'Müzik stüdyosu', 'Музыкальная студия', 'Sound',
    ['Mulgyeol', 'Hwamyeong', 'Muwon', 'Janbyeol', 'Jumunjin', 'Eoullim', 'Daseot', 'Haerang', 'Saeoreum', 'Amado']],
  ['electronics', 'Elektronik mağazası', 'Магазин электроники', 'Electronics',
    ['Bunhoe', 'Cheongun', 'Sinho', 'Danggil', 'Nulpum', 'Usan', 'Gonggan', 'Hakbit', 'Danil', 'Haneum']],
  ['gift-shop', 'Hediyelik eşya dükkânı', 'Магазин подарков', 'Gifts',
    ['Seonmul', 'Dambit', 'Chorok', 'Sol', 'Hanga', 'Wonsu', 'Dasi Bom', 'Byeolbam', 'Doun', 'Miryang']],
  ['salon', 'Kuaför', 'Парикмахерская', 'Salon',
    ['Jade', 'Bihan', 'Hanat', 'Doyeon', 'Aria', 'Hoin', 'Insa', 'Gaji', 'Yeonmi', 'Hyangsu']],
  ['hotel', 'Otel', 'Отель', 'Hotel',
    ['Dallim', 'Bada', 'Suyu', 'Hwayang', 'Baram', 'Gajwa', 'Munhwa', 'Dawool', 'Yeonseo', 'Noksapyeong']],
];

export const SUMI_CAFE_ID = 'city-181';
export const CITY_TYPES = Object.freeze(TYPE_NAMES.map(([id, tr, ru]) => Object.freeze({id, tr, ru})));
export const CITY_BOUNDS = Object.freeze({minX: -80, maxX: 80, minZ: -65, maxZ: 65});
export const CITY_ENTRY = Object.freeze({x: -16, z: 62, yaw: 0});
export const CITY_EXIT = Object.freeze({x: -16, z: 64, yaw: Math.PI});

function roads(main, centers) {
  return Object.freeze(centers.map((center, index) => Object.freeze({
    center,
    width: index === 0 || index === centers.length - 1 ? 4 : 8,
    main: center === main,
  })));
}

export const CITY_ROADS = Object.freeze({
  vertical: roads(CITY_ENTRY.x, [-78, -48, -16, 16, 48, 78]),
  horizontal: roads(13, [-63, -39, -13, 13, 39, 63]),
});

const BLOCK_COUNT = 5;
const X_SPAN = 32;
const Z_SPAN = 26;
const BLOCK_HALF_WIDTH = 12;
const BLOCK_HALF_DEPTH = 9;
const BUILDING_WIDTH = 5;
const BUILDING_DEPTH = 7;
const PLAYER_RADIUS = .30;
const LOT_ROWS = [-4.6, 4.6];
const LOT_COLUMNS = [-9, -3, 3, 9];
const LOTS_PER_BLOCK = LOT_ROWS.length * LOT_COLUMNS.length;

function createBlock(row, column) {
  const id = `r${row}c${column}`;
  const x = (column - 2) * X_SPAN;
  const z = (row - 2) * Z_SPAN;
  const blockIndex = row * BLOCK_COUNT + column;
  const buildings = LOT_ROWS.flatMap((offsetZ, side) => LOT_COLUMNS.map((offsetX, index) => {
    const lot = side * LOT_COLUMNS.length + index;
    const ordinal = blockIndex * LOTS_PER_BLOCK + lot;
    // Yirmilik her seride 7 adımlı sıra tüm türleri birer kez ziyaret eder.
    const typeIndex = ordinal * 7 % CITY_TYPES.length;
    const variant = Math.floor(ordinal / CITY_TYPES.length);
    const [type, , , sign, names] = TYPE_NAMES[typeIndex];
    const buildingX = x + offsetX;
    const buildingZ = z + offsetZ;
    const nz = side === 0 ? -1 : 1;
    const doorZ = buildingZ + nz * BUILDING_DEPTH / 2;
    const door = Object.freeze({
      x: buildingX, z: doorZ, nx: 0, nz, yaw: nz < 0 ? Math.PI : 0,
      width: 1.32, approachX: buildingX, approachZ: doorZ + nz * .90,
    });
    const buildingId = `city-${String(ordinal + 1).padStart(3, '0')}`;
    return Object.freeze({
      id: buildingId,
      name: buildingId === SUMI_CAFE_ID ? 'Sumi Café' : `${names[variant]} ${sign}`,
      type, typeIndex, variant, block: id, row, column, lot,
      x: buildingX, z: buildingZ, width: BUILDING_WIDTH, depth: BUILDING_DEPTH,
      height: (44 + (typeIndex * 7 + variant * 13) % 34) / 10,
      door,
    });
  }));
  return Object.freeze({id, row, column, x, z, buildings: Object.freeze(buildings)});
}

export const CITY_BLOCKS = Object.freeze(Array.from({length: BLOCK_COUNT * BLOCK_COUNT}, (_, index) =>
  createBlock(Math.floor(index / BLOCK_COUNT), index % BLOCK_COUNT)));
export const CITY_BUILDINGS = Object.freeze(CITY_BLOCKS.flatMap(block => block.buildings));

const buildingsById = new Map(CITY_BUILDINGS.map(building => [building.id, building]));

export function getBuilding(id) {
  return buildingsById.get(id) ?? null;
}

function nearBlock(block, x, z, margin) {
  return Math.abs(x - block.x) <= BLOCK_HALF_WIDTH + margin &&
    Math.abs(z - block.z) <= BLOCK_HALF_DEPTH + margin;
}

export function walkable(x, z, radius = PLAYER_RADIUS) {
  if (!Number.isFinite(x) || !Number.isFinite(z) || !Number.isFinite(radius) || radius < 0) return false;
  const {minX, maxX, minZ, maxZ} = CITY_BOUNDS;
  if (z < minZ + radius) {
    // The north avenue continues onto a timber walkway and its river terrace.
    const onWalkway = x >= -18 + radius && x <= -14 - radius && z >= -78 + radius;
    const onTerrace = x >= -24 + radius && x <= -8 - radius && z >= -80 + radius && z <= -75 - radius;
    return onWalkway || onTerrace;
  }
  if (x < minX + radius || x > maxX - radius || z > maxZ - radius) return false;

  const radiusSquared = radius * radius;
  for (const block of CITY_BLOCKS) {
    if (!nearBlock(block, x, z, radius)) continue;
    for (const building of block.buildings) {
      const dx = Math.max(0, Math.abs(x - building.x) - building.width / 2);
      const dz = Math.max(0, Math.abs(z - building.z) - building.depth / 2);
      if (dx * dx + dz * dz <= radiusSquared) return false;
    }
  }
  return true;
}

export function nearestDoor(x, z, maxDistance = 1.65) {
  if (!Number.isFinite(x) || !Number.isFinite(z) || !Number.isFinite(maxDistance) || maxDistance < 0) return null;
  let nearest = null;
  let closestSquared = maxDistance * maxDistance;
  for (const block of CITY_BLOCKS) {
    if (!nearBlock(block, x, z, maxDistance)) continue;
    for (const building of block.buildings) {
      const {door} = building;
      const dx = x - door.x;
      const dz = z - door.z;
      if (dx * door.nx + dz * door.nz < 0) continue;
      const squared = dx * dx + dz * dz;
      if (squared > closestSquared || (nearest && squared === closestSquared)) continue;
      nearest = building;
      closestSquared = squared;
    }
  }
  return nearest;
}
