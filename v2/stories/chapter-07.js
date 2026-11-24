import {t, story, find, order, dial, cue, end} from './format.js';

export default [
  story('city-121', t('Хару', 'Haru'), t('Чашка у дождливого окна', 'Yağmurlu Camın Yanındaki Fincan'),
    t('В Jadum Coffee есть старый стаканчик с рисунком моей сестры. Она уехала учиться, а рисунок уже стирается. Поможешь перенести его на новые манжеты для стаканчиков?',
      'Jadum Coffee’de kardeşimin çizim yaptığı eski bir bardağımız var. O okumaya gitti, çizim de silinmeye başladı. Deseni yeni bardak kılıflarına aktarmama yardım eder misin?'),
    [
      find(t('На фотографии под ручкой зонта видны три капли. Найди этот фрагмент рисунка.', 'Fotoğrafta şemsiye sapının altında üç damla var. Çizimin o parçasını bul.'),
        [t('Зонт и две капли', 'Şemsiye ve iki damla'), t('Зонт и три капли', 'Şemsiye ve üç damla'), t('Облако и три капли', 'Bulut ve üç damla')], 1,
        t('Нашли! Это тот самый уголок, который на стаканчике уже стёрся.', 'Bulduk! Bardakta silinen köşe tam da burası.')),
      cue(t('Дождись, пока метка дойдёт до выделенного участка, и прижми штамп к пробной манжете.',
        'İşaretli aralığı bekle ve damgayı deneme kılıfına bastır.'), t('Поставить штамп', 'Damgayı bas'),
      t('Все три капли отпечатались. С таким штампом можно делать новые манжеты хоть каждый день.', 'Üç damla da çıktı. Bu damgayla her gün yeni kılıflar hazırlayabiliriz.'))
    ],
    t('Что сделаем с первой партией манжет?', 'İlk kılıfları nasıl değerlendirelim?'),
    [
      end(t('На стаканчики с собой', 'Paket bardaklara tak'), t('Рисунок разошёлся по району. Сестре прислали фото её зонтика на другом берегу Хангана.', 'Çizim mahalleye yayıldı. Kardeşime Han Nehri’nin karşı kıyısından şemsiyesinin fotoğrafını gönderdiler.')),
      end(t('Открыть стол для рисования', 'Çizim masası kur'), t('На каждой манжете рядом с зонтиком появился новый рисунок. Первым кто-то добавил кота в резиновых сапогах.', 'Her kılıfta şemsiyenin yanına yeni bir çizim eklendi. İlki çizmeli bir kediydi.'))
    ]),

  story('city-122', t('Ынсоль', 'Eunsol'), t('Кто спрятался в трёх строчках', 'Üç Dizede Kim Saklı?'),
    t('В Gilbom Books поэтесса Ён впервые будет подписывать свою книгу. Для посетителей она приготовила загадку про кота и спрятала его имя в начале строк. Решим загадку, прежде чем разложить закладки.',
      'Gilbom Books’ta şair Yeon ilk kez kitabını imzalayacak. Gelenlere bir kedi bilmecesi hazırladı ve adını dizelerin başına gizledi. Ayraçları dizmeden önce bilmeceyi çözelim.'),
    [
      find(t('Прочитай первые буквы трёх строк. «Месяц выглянул в окно. / У камина спит кот. / Рыжая лапа дрожит во сне». Как зовут кота?',
        'Üç dizenin ilk harfini oku. “Mehtap vurdu pencereye. / Uyudu kedi ocağın yanında. / Rüyasında kızıl patisi kıpırdar.” Kedinin adı ne?'),
      [t('Рум', 'Rum'), t('Мур', 'Mur'), t('Мру', 'Mru')], 1,
      t('Мур! На обороте закладки Ён подписала крохотный рисунок лапы именем кота. Там можно проверить ответ.', 'Mur! Yeon ayracın arkasına minicik bir pati çizip altına kedinin adını yazdı. Okurlar yanıtı oradan kontrol edebilir.')),
      dial(t('К столу подойдут 10 читателей. На столе уже лежат 4 закладки с загадкой. Сколько ещё принести, чтобы хватило всем?',
        'Masaya 10 okur gelecek. Masada bilmeceli 4 ayraç var. Herkese yetmesi için kaç ayraç daha getirelim?'), 6,
      t('Все десять закладок на столе. У каждого читателя будет своя загадка.', 'On ayraç da masada. Her okurun çözebileceği bir bilmecesi olacak.'))
    ],
    t('Как познакомим читателей с загадкой Ён?', 'Okurları Yeon’un bilmecesiyle nasıl tanıştıralım?'),
    [
      end(t('Спрятать закладки в книги', 'Ayraçları kitaplara sakla'), t('Читатели находили загадку уже после автографа. Одна девочка ответила Ён своим стихом с именем домашней черепахи.', 'Okurlar bilmeceyi imzadan sonra buldu. Bir kız Yeon’a evdeki kaplumbağasının adını gizlediği bir şiirle cevap verdi.')),
      end(t('Устроить чтение по строчке', 'Dizeleri sırayla oku'), t('Трое читателей прочли по строке вслух. Остальные собрали имя и позвали Мура хором, а Ён показала его фотографию.', 'Üç okur sırayla birer dize okudu. Diğerleri adı çözüp hep birlikte Mur diye seslenince Yeon kedisinin fotoğrafını gösterdi.'))
    ]),

  story('city-123', t('Хеджин', 'Hyejin'), t('Шаг без музыки', 'Müziksiz Adım'),
    t('На занятии Sae Dance музыка внезапно пропала. Последний ряд сбился, потому что слышал только музыку и не видел моих ног. Давай придумаем такой знак, который заметит весь зал.',
      'Sae Dance dersinde müzik birden kesildi. En arkadakiler ayaklarımı göremeyip yalnızca müziği duydukları için adımı kaçırdı. Bütün salonun görebileceği bir işaret bulalım.'),
    [
      find(t('Какой знак выше плеч смогут увидеть даже с последнего ряда?', 'Omuz hizasının üstünde hangi işareti en arka sıradan bile görebilirler?'),
        [t('Поднять обе руки', 'İki kolunu kaldır'), t('Топнуть ногой', 'Ayağını yere vur'), t('Щёлкнуть пальцами за спиной', 'Ellerin arkandayken parmak şıklat')], 0,
        t('Руки видны над головами. Джи в последнем ряду показал, что готов.', 'Kollar başların üstünden görünüyor. Arka sıradaki Ji hazır olduğunu işaret etti.')),
      cue(t('Подними руки, когда метка войдёт в выделенный участок. По этому знаку все сделают первый шаг.',
        'İşaret belirgin aralığa girdiğinde kollarını kaldır. Herkes ilk adımı bu işaretle atacak.'), t('Поднять руки', 'Kolları kaldır'),
      t('Зал шагнул разом. Даже без музыки подошвы ударились о пол одновременно.', 'Salon aynı anda adım attı. Müzik yokken bile herkesin ayağı aynı anda yere değdi.'))
    ],
    t('Как начнём выступление на открытом уроке?', 'Açık dersteki gösteri nasıl başlasın?'),
    [
      end(t('В тишине', 'Sessizlik içinde'), t('Первый шаг прозвучал на весь зал. Зрители захлопали в такт, и так появился ритм для второго шага.', 'İlk adım salonda yankılandı. Seyirciler alkışla eşlik edince ikinci adımın ritmi de ortaya çıktı.')),
      end(t('С ведущим из заднего ряда', 'Arka sıradan biriyle'), t('Джи встал впереди и подал знак. Тем, кто пришёл на пробный урок, он тут же показал, как вести группу.', 'Ji öne geçti ve işaret verdi. Deneme dersine gelenlere grubu nasıl yöneteceklerini hemen gösterdi.'))
    ]),

  story('city-124', t('Юнсок', 'Yunseok'), t('Последний поднос для обеда', 'Öğle Yemeğinin Son Tepsisi'),
    t('В Dure Kitchen обедают ребята после репетиции. Я поставил общий поднос с восемью мисками, а ребят двенадцать. Хочу, чтобы тот, кто задержался в зале, тоже застал горячий обед.',
      'Dure Kitchen’da prova çıkışı çocuklar öğle yemeği yiyecek. Ortak tepsiye sekiz kâse koydum ama on iki kişiler. Salonda işi uzayan da sıcak yemeğe yetişsin istiyorum.'),
    [
      dial(t('Для каждого нужна одна миска. На первом подносе их 8, а ребят 12. Сколько мисок поставить на второй поднос?',
        'Herkese bir kâse lazım. İlk tepside 8 kâse var ve çocuklar 12 kişi. İkinci tepsiye kaç kâse koymalı?'), 4,
      t('Четыре миски на втором подносе. Теперь последней группе хватит порций.', 'İkinci tepside dört kâse var. Son gruba da yemek yetecek.')),
      find(t('Поворот к столу узкий. Нужна тележка с бортами и шириной меньше 50 см. Что подойдёт?',
        'Masaya giden köşe dar. Kenarlıklı, genişliği 50 cm’den az bir servis arabası lazım. Hangisi olur?'),
      [t('С бортами, 60 см', 'Kenarlıklı, 60 cm'), t('С бортами, 45 см', 'Kenarlıklı, 45 cm'), t('Без бортов, 45 см', 'Kenarlıksız, 45 cm')], 1,
      t('Тележка прошла поворот, и все четыре миски доехали до стола целыми.', 'Araba köşeden geçti. Dört kâse de masaya dökülmeden ulaştı.'))
    ],
    t('Где ждём ребят с последнего прогона?', 'Son provadakileri nerede bekleyelim?'),
    [
      end(t('Держать места за общим столом', 'Ortak masada yer tut'), t('Ребята уселись рядом с остальными. За обедом они узнали, что их номер получился без остановок.', 'Çocuklar grubun yanına oturdu. Gösterilerini provada hiç duraksamadan tamamladıklarını yemek sırasında öğrendiler.')),
      end(t('Накрыть в тихом углу', 'Sakin köşede yer hazırla'), t('В углу за ширмой никто не торопил ребят. Они спокойно поели и разобрали последние заметки к номеру.', 'Paravanın arkasında kimse çocukları acele ettirmedi. Sakince yemeklerini yiyip gösterinin son notlarına baktılar.'))
    ]),

  story('city-125', t('Пинна', 'Binna'), t('Пластинка с жёлтым окном', 'Sarı Pencereli Plak'),
    t('В Nopun Records принесли пластинки в перепутанных конвертах. Госпожа Чхве ищет инструментальную версию мелодии, которую когда-то играла с сестрой. На этикетке этой версии было жёлтое окно.',
      'Nopun Records’a zarfları karışmış plaklar getirdiler. Bayan Choi bir zamanlar kız kardeşiyle çaldığı melodinin sözsüz kaydını arıyor. O kaydın etiketinde sarı bir pencere varmış.'),
    [
      find(t('Достань пластинку с жёлтым окном на этикетке.', 'Etiketinde sarı pencere olan plağı çıkar.'),
      [t('Жёлтая дверь', 'Sarı kapı'), t('Зелёное окно', 'Yeşil pencere'), t('Жёлтое окно', 'Sarı pencere')], 2,
      t('На этикетке есть пометка «без вокала». Теперь проверим начало мелодии.', 'Etikette “sözsüz” yazıyor. Şimdi melodinin girişini kontrol edelim.')),
      cue(t('Поставь иглу в начале пластинки. Нажми, когда метка попадёт в выделенный участок.',
        'İğneyi plağın başına indir. İşaret belirgin aralığa girince dokun.'), t('Опустить иглу', 'İğneyi indir'),
      t('Прозвучали три ноты фортепиано. Госпожа Чхве узнала их и без подсказки напела продолжение.', 'Piyanodan üç nota duyuldu. Bayan Choi melodiyi tanıdı ve devamını kendiliğinden mırıldandı.'))
    ],
    t('Как продолжим это прослушивание?', 'Bu dinletiye nasıl devam edelim?'),
    [
      end(t('Принести вторые наушники', 'İkinci kulaklığı getir'), t('Госпожа Чхве позвала сестру. Они прослушали запись вдвоём, а потом спорили, кто в детстве всегда спешил на припеве.', 'Bayan Choi kız kardeşini çağırdı. Kaydı birlikte dinlediler, sonra çocukken nakaratta hangisinin hep acele ettiğini tartıştılar.')),
      end(t('Устроить вечер пластинок', 'Plak gecesi düzenle'), t('Госпожа Чхве поставила запись для гостей и рассказала, как они с сестрой разучили эту мелодию по слуху.', 'Bayan Choi kaydı konuklara dinletti ve kardeşiyle melodiyi kulaktan nasıl öğrendiklerini anlattı.'))
    ]),

  story('city-126', t('Уджин', 'Ujin'), t('Звонок с Луны', 'Ay’dan Gelen Telefon'),
    t('В Daseot Sound мы записываем звук для фильма, где девочка звонит дедушке с лунной станции. Дома у дедушки старый телефон с диском. Сам звонок мы записали, теперь сделаем для сцены эхо.',
      'Daseot Sound’da Ay üssünden dedesini arayan bir kızın filmi için ses hazırlıyoruz. Dedesinin evinde çevirmeli bir telefon var. Telefonun zilini kaydettik, şimdi de sahne için yankısını yapacağız.'),
    [
      find(t('Между сценами должна узнаваться пара коротких звонков и пауза. Из какой записи взять звук?',
        'İki sahnede de peş peşe iki kısa zil ve ardından bir duraklama duyulmalı. Sesi hangi kayıttan alalım?'),
      [t('Один длинный звонок', 'Tek uzun zil'), t('Три коротких без паузы', 'Aralıksız üç kısa zil'), t('Два коротких и пауза', 'İki kısa zil ve duraklama')], 2,
      t('В обеих сценах слышен один рисунок звонка. Теперь настроим его эхо у девочки на Луне.', 'İki sahnede de zil aynı biçimde duyuluyor. Şimdi Ay’daki kızın duyacağı yankıyı ayarlayalım.')),
      dial(t('После звонка в фильме пауза на 6 секунд. Эхо должно прозвучать посередине паузы. Через сколько секунд его включить?',
        'Filmde zilden sonra 6 saniye sessizlik var. Yankı bu aralığın ortasında duyulmalı. Kaç saniye sonra başlatalım?'), 3,
      t('Через три секунды звонок повторился тише. Девочка на экране остановилась и прислушалась.', 'Üç saniye sonra zil daha hafif duyuldu. Ekrandaki kız durup kulak verdi.'))
    ],
    t('Кто первым услышит лунный звонок?', 'Ay’dan gelen zili ilk kim duysun?'),
    [
      end(t('Позвать дедушку в студию', 'Dedeyi stüdyoya çağır'), t('Он узнал свой телефон раньше, чем на экране показали комнату. Уджин дал ему наушники, и они досмотрели сцену вместе.', 'Oda ekranda görünmeden kendi telefonunun zilini tanıdı. Ujin ona kulaklık verdi ve sahnenin kalanını birlikte izlediler.')),
      end(t('Начать им показ фильма', 'Film gösterimini zille aç'), t('Свет ещё не погас, когда по залу прошли два звонка. Разговоры стихли, и из первого ряда кто-то шепнул «Алло?».', 'Salonun ışığı henüz sönmeden iki zil duyuldu. Konuşmalar kesildi ve ilk sıradan biri “Alo?” diye fısıldadı.'))
    ]),

  story('city-127', t('Табин', 'Dabin'), t('Буханки с именами', 'Üzerinde İsim Yazılı Ekmekler'),
    t('В Onyu Bakehouse соседские дети пекут хлеб вместе с родителями. После печи буханки выглядят одинаково, и в прошлый раз двое унесли чужие. Давай отметим имена прямо на бумажных пакетах.',
      'Onyu Bakehouse’ta mahalledeki çocuklar aileleriyle ekmek yapıyor. Fırından çıkan ekmekler birbirine benziyor. Geçen sefer iki çocuk yanlış ekmeği götürdü. İsimleri kâğıt torbalara yazalım.'),
    [
      order(t('Перепиши имя с бирки у формы. Надпись должна высохнуть на пустом пакете, прежде чем положишь туда остывший хлеб.',
        'Kalıbın yanındaki etiketten ismi torbaya yaz. Soğuyan ekmeği koymadan önce boş torbadaki yazı kurusun.'),
      [t('Подписать пакет', 'Torbanın üstüne ismi yaz'), t('Дать надписи высохнуть', 'Yazının kurumasını bekle'), t('Упаковать хлеб', 'Ekmeği torbaya koy')],
      t('Буквы не смазались. Хлеб можно узнать, даже не заглядывая в пакет.', 'Yazı dağılmadı. Torbanın içine bakmadan ekmeğin kime ait olduğu anlaşılıyor.')),
      dial(t('На выдаче уже стоят 3 подписанных пакета. Нужно выставить всего 8. Сколько ещё принести?',
        'Teslim masasında isim yazılı 3 torba var. Toplam 8 torba gerekiyor. Kaç tane daha getirmelisin?'), 5,
      t('На полке все восемь пакетов. Никому не придётся открывать чужой, чтобы найти свой.', 'Sekiz torba da rafta. Kimse kendininkini bulmak için başkasının torbasını açmayacak.'))
    ],
    t('Как закончим первый день общей выпечки?', 'İlk ortak ekmek gününü nasıl bitirelim?'),
    [
      end(t('Устроить обмен кусочками', 'Dilimleri paylaş'), t('С разрешения ребят из каждой буханки нарезали по кусочку. Теперь все знают, чей хлеб пахнет кунжутом.', 'Çocukların izniyle her ekmekten bir parça kestik. Şimdi herkes susam kokan ekmeği kimin yaptığını biliyor.')),
      end(t('Записать семейные заметки', 'Ailelerin notlarını topla'), t('Каждая семья написала на обороте пакета одну заметку о своём хлебе. Табин собрала копии в папку для следующего занятия.', 'Her aile torbanın arkasına ekmeğiyle ilgili bir not yazdı. Dabin bir sonraki etkinlik için notların kopyalarını topladı.'))
    ]),

  story('city-128', t('Соми', 'Somi'), t('Кричалка для «Выдр»', 'Su Samurları’nın Tezahüratı'),
    t('В Soneul Karaoke собрались «Выдры», футбольная команда нашего района. Завтра у них первый матч, и они хотят записать свою кричалку. В пробной записи все вдыхают в разное время и начинают первую строчку вразнобой.',
      'Mahallemizin futbol takımı Su Samurları, Soneul Karaoke’de toplandı. Yarın ilk maçları var ve kendi tezahüratlarını kaydetmek istiyorlar. Deneme kaydında herkes ayrı anda nefes alıp ilk dizeye farklı zamanda giriyor.'),
    [
      order(t('Сделаем короткую паузу перед общим вступлением. Сначала дай услышать два удара, затем пусть все вдохнут, а после вдоха споют первую строчку.',
        'Birlikte girmeden önce kısa bir ara verelim. Önce iki vuruş duyulsun, sonra herkes nefes alsın. Nefesten sonra ilk dizeyi söylesinler.'),
      [t('Два удара', 'İki vuruş'), t('Вдох всей команды', 'Bütün takım nefes alır'), t('Первая строчка', 'İlk dize')],
      t('Теперь в начале слышно два удара и остаётся место для вдоха. Попробуем запись с микрофоном.', 'Artık başta iki vuruş duyuluyor ve nefes almak için boşluk var. Şimdi mikrofonla kaydı deneyelim.')),
      cue(t('Когда метка попадёт в выделенный участок, дай команде знак петь «Выдры, вперёд!».',
        'İşaret belirgin aralığa girdiğinde takıma “Haydi Su Samurları!” demesi için işaret ver.'), t('Дать знак команде', 'Takıma işaret ver'),
      t('На записи первое слово звучит разом. Капитан переслушал начало и впервые разобрал каждый слог.', 'Kayıtta takım ilk söze aynı anda giriyor. Kaptan kaydın başını tekrar dinledi ve ilk kez her heceyi anladı.'))
    ],
    t('Как «Выдры» возьмут кричалку на матч?', 'Su Samurları tezahüratı maça nasıl taşısın?'),
    [
      end(t('Включить запись перед игрой', 'Maçtan önce kaydı aç'), t('Капитан включил запись, пока команда шнуровала бутсы. К последней строчке подпевали даже те, кто обычно молчит.', 'Takım kramponlarını bağlarken kaptan kaydı açtı. Genelde sessiz kalanlar bile son dizeye katıldı.')),
      end(t('Разучить её с болельщиками', 'Taraftara öğret'), t('Перед первым свистком ребята показали трибуне два хлопка. На первом угловом кричалку подхватили родители обеих команд.', 'İlk düdükten önce çocuklar tribüne iki alkışla tempo tutmayı gösterdi. İlk köşe vuruşunda iki takımın aileleri de tezahürata katıldı.'))
    ]),

  story('city-129', t('Тэмин', 'Taemin'), t('Экран, который видно днём', 'Gündüz Okunan Ekran'),
    t('В Gonggan Electronics мы сделали маленькое табло для автобусной остановки. Дата на нём видна, а строка времени в солнечном свете пропадает. Проверим макет перед выставкой.',
      'Gonggan Electronics’te otobüs durağı için küçük bir ekran yaptık. Tarih okunuyor ama saat satırı güneşte görünmüyor. Sergiden önce maketi kontrol edelim.'),
    [
      find(t('На строке времени нужен шрифт, который на пробе читается с 4 метров. Какой образец взять?',
        'Saat satırı için denemede 4 metreden okunabilen yazı tipi gerekiyor. Hangi örneği kullanalım?'),
      [t('Узкий · виден с 2 м', 'Dar · 2 m’den okunuyor'), t('Широкий · виден с 4 м', 'Geniş · 4 m’den okunuyor'), t('Тонкий · виден с 1 м', 'İnce · 1 m’den okunuyor')], 1,
      t('Строка стала заметнее. Теперь настроим яркость для улицы.', 'Saat satırı daha belirgin. Şimdi dışarı için parlaklığı ayarlayalım.')),
      dial(t('В комнате хватало яркости 4. Для солнца по замеру нужно на 3 деления выше. Выставь яркость.',
        'İçeride 4 parlaklık yetiyordu. Ölçüme göre güneş altında 3 kademe daha yüksek olmalı. Parlaklığı ayarla.'), 7,
      t('На семёрке время видно и у витрины на солнце. Тэмин записал оба значения рядом с макетом.', 'Yedinci kademede saat güneş alan vitrinin yanında da okunuyor. Taemin iki değeri de maketin yanına yazdı.'))
    ],
    t('Как покажем табло посетителям выставки?', 'Ekranı sergiyi gezenlere nasıl gösterelim?'),
    [
      end(t('Сделать солнечную пробу', 'Güneş denemesi yap'), t('Лампу направили на экран. Посетители сравнили оба режима и сами прочитали время с дальнего конца зала.', 'Ekrana lamba tuttuk. Ziyaretçiler iki ayarı karşılaştırıp saati salonun öbür ucundan okudu.')),
      end(t('Собрать макет остановки', 'Durak maketi kur'), t('Рядом с табло поставили скамейку и отметили линию подхода. Дети заметили подсказку ещё до того, как сели.', 'Ekranın yanına bank koyup bekleme çizgisini işaretledik. Çocuklar daha oturmadan saati gördü.'))
    ]),

  story('city-130', t('Наён', 'Nayeon'), t('Забытый зонт с биркой', 'Etiketli Unutulmuş Şemsiye'),
    t('В Hayan Market накопились зонты, которые забыли у двери. Сегодня сосед пришёл за своим, но у стойки нашлись три одинаковых. К счастью, он помнит, какой узел завязала дочка.',
      'Hayan Market’in kapısında unutulan şemsiyeler birikti. Bugün bir komşu kendisininkini almaya geldi ama tezgahta üçü de birbirine benziyor. Neyse ki kızının sapına bağladığı düğümü hatırlıyor.'),
    [
      find(t('Сосед помнит красную ленту с двумя узлами. Найди её на ручке.',
        'Komşu sapta iki düğümü olan kırmızı kurdele hatırlıyor. O şemsiyeyi bul.'),
      [t('Красная лента с одним узлом', 'Tek düğümlü kırmızı kurdele'), t('Синяя лента с двумя узлами', 'İki düğümlü mavi kurdele'), t('Красная лента с двумя узлами', 'İki düğümlü kırmızı kurdele')], 2,
      t('Сосед узнал узел. Под лентой нашлась и маленькая звёздочка, которую нарисовала его дочка.', 'Komşu düğümü tanıdı. Kurdele altında kızının çizdiği küçük yıldız da duruyormuş.')),
      order(t('Покажи порядок возврата. Сначала сверь примету, потом отдай находку. Отметку о возврате ставь, когда зонт уже у хозяина.',
        'Teslim sırasını göster. Önce ayırt edici işareti doğrula, sonra şemsiyeyi ver. Teslim notunu sahibi şemsiyeyi alınca yaz.'),
      [t('Сверить примету', 'İşareti doğrula'), t('Вернуть зонт', 'Şemsiyeyi teslim et'), t('Отметить возврат', 'Teslimi kaydet')],
      t('Зонт ушёл домой, а в журнале остались только те, за которыми ещё никто не пришёл.', 'Şemsiye eve döndü. Defterde artık yalnızca alınmayı bekleyenler görünüyor.'))
    ],
    t('Что сделать для тех, кто ещё ищет свой зонт?', 'Şemsiyesini hâlâ arayanlar için ne yapalım?'),
    [
      end(t('Повесить знак у входа', 'Girişe duyuru as'), t('После дождя люди заметили табличку и заглянули к кассе. В тот же день забрали ещё два зонта.', 'Yağmurdan sonra insanlar levhayı görüp kasaya uğradı. Aynı gün iki şemsiye daha sahiplerine döndü.')),
      end(t('Поставить стойку у кассы', 'Kasanın yanına stant kur'), t('У кассы появилась стойка для забытых зонтов. Один хозяин заметил из прохода свою ручку в полоску и сразу подошёл.', 'Kasanın yanına unutulan şemsiyeler için bir stant geldi. Bir müşteri reyonların arasından çizgili sapını fark edip hemen yanımıza geldi.'))
    ]),

  story('city-131', t('Тону', 'Dongwoo'), t('Комета через узкие ворота', 'Dar Kapıdan Geçen Kuyruklu Yıldız'),
    t('В Sodam Arcade есть автомат, на котором два игрока ведут комету через ворота. Новички всё время проигрывают на первом повороте. Я хочу оставить и быстрый режим, и такой, в котором можно потренироваться.',
      'Sodam Arcade’de iki oyuncunun kuyruklu yıldızı kapılardan geçirdiği bir makine var. Yeni başlayanlar ilk dönüşte hep kaybediyor. Hem hızlı bir ayar hem de alıştırma yapabilecekleri bir ayar olsun istiyorum.'),
    [
      dial(t('Скорость на первом повороте сейчас 9. Для тренировки Тону попросил снизить её на 6 делений. Выставь скорость.',
        'İlk dönüşte hız şu an 9. Dongwoo alıştırma için hızı 6 kademe düşürmeni istedi. Hızı ayarla.'), 3,
      t('На тройке оба игрока успевают заметить поворот. Осталось попробовать пройти ворота.', 'Üçüncü kademede iki oyuncu da dönüşü zamanında fark ediyor. Şimdi kapıdan geçmeyi deneyelim.')),
      cue(t('Проведи комету через ворота в тот миг, когда метка окажется в выделенном участке.',
        'İşaret belirgin aralığa girdiği anda kuyruklu yıldızı kapıdan geçir.'), t('Сделать поворот', 'Dönüşü yap'),
      t('Комета прошла и рассыпала за собой звёзды. Автомат записал первый результат в режиме тренировки.', 'Kuyruklu yıldız geçti ve arkasında yıldızlar saçıldı. Makine alıştırma ayarındaki ilk skoru kaydetti.'))
    ],
    t('Как представим новый режим игрокам?', 'Yeni ayarı oyunculara nasıl tanıtalım?'),
    [
      end(t('Посадить новичка с мастером', 'Yeni oyuncuyu ustayla eşleştir'), t('Опытная Нао подсказала новичку, куда смотреть перед поворотом. Следующую комету он провёл и в быстром режиме.', 'Deneyimli Nao yeni oyuncuya dönüşten önce nereye bakacağını gösterdi. Çocuk bir sonraki kuyruklu yıldızı hızlı ayarda da geçirdi.')),
      end(t('Начать общий счёт', 'Ortak skor başlat'), t('Каждая пара добавила свои ворота к общему счёту. Когда набралось сорок, зал зааплодировал самой младшей паре.', 'Her ikilinin geçtiği kapılar ortak skora eklendi. Kırka ulaşınca salon en küçük ikiliyi alkışladı.'))
    ]),

  story('city-132', t('Мирэ', 'Mirae'), t('Коробка для маленького маяка', 'Küçük Deniz Fenerine Kutu'),
    t('В Dasi Bom Gifts Хани выбрала крошечный керамический маяк для брата, который переезжает. Посылка поедет далеко, и маяк не должен болтаться внутри. У меня осталась мягкая бумага для прокладки.',
      'Dasi Bom Gifts’te Hani, taşınan ağabeyine seramikten minicik bir deniz feneri seçti. Paket uzun yola çıkacak ve fener kutuda sallanmamalı. Dolgu için yumuşak kâğıdım var.'),
    [
      dial(t('Маяк стоит на прокладке и занимает 6 см высоты коробки. Внутри коробки 9 см. Сколько сантиметров осталось заполнить сверху?',
        'Fener, altındaki dolguyla birlikte kutuda 6 cm yer kaplıyor. Kutunun içi 9 cm yüksekliğinde. Üstte kaç santimetrelik boşluğu doldurmalıyız?'), 3,
      t('Три сантиметра мягкой бумаги заполняют пустоту. Маяк больше не качается.', 'Üç santimetrelik yumuşak kâğıt boşluğu kapattı. Fener artık sallanmıyor.')),
      order(t('На пробной посылке проверим, что маяк не стучит о стенки. Закрой крышку без ленты, тихонько покачай коробку, затем запечатай её.',
        'Deneme paketinde fenerin kutuya vurmadığını kontrol edelim. Kapağı bantsız kapat, kutuyu hafifçe salla, sonra bantla.'),
      [t('Закрыть крышку', 'Kapağı kapat'), t('Покачать коробку', 'Kutuyu hafifçe salla'), t('Запечатать коробку', 'Kutuyu bantla')],
      t('Внутри тихо, а крышка держится. Можно выбрать, как подписать подарок.', 'İçeriden ses gelmiyor, kapak da sağlam. Şimdi hediyeye ne yazacağımıza karar verebiliriz.'))
    ],
    t('Как Хани оставит брату своё послание?', 'Hani ağabeyine nasıl bir mesaj bıraksın?'),
    [
      end(t('Письмо про берег', 'Sahili anlatan bir mektup'), t('Хани вложила в конверт рассказ об их первой поездке к морю. Брат вечером прислал фото маяка на подоконнике новой комнаты.', 'Hani zarfa denize ilk gidişlerini anlatan bir mektup koydu. Ağabeyi akşam fenerin yeni odasının pencere önündeki fotoğrafını gönderdi.')),
      end(t('Нарисовать карту на бумаге', 'Ambalaja harita çiz'), t('На обёртке появилась карта с домиками знакомых. Брат развернул лист и повесил его над столом, чтобы отмечать, кому уже позвонил.', 'Ambalajda tanıdıkların evlerini gösteren bir harita belirdi. Ağabeyi açıp masasına astı. Aradığı kişileri haritada işaretliyor.'))
    ]),

  story('city-133', t('Сэрин', 'Serin'), t('Плащ у края сцены', 'Sahne Kenarındaki Pelerin'),
    t('В Gaeul Atelier актёр Сону примеряет плащ для школьного спектакля. Когда он ставит костыль на ступеньку, длинный край плаща закрывает рукоять. Сону хочет сохранить плащ своего персонажа, но укоротить край со стороны костыля.',
      'Gaeul Atelier’de Seonu okul oyunu için bir pelerin deniyor. Koltuk değneğini basamağa koyunca pelerinin uzun ucu tutamağı örtüyor. Seonu karakterinin pelerinini giymek istiyor ama değnek tarafındaki kenarı kısaltmak gerek.'),
    [
      dial(t('Сейчас край плаща на 8 см ниже рукояти. Он должен быть на 2 см выше неё. На сколько сантиметров его поднять?',
        'Pelerinin kenarı şu an tutamağın 8 cm altında. Tutamağın 2 cm üstüne gelmeli. Kenarı kaç santimetre yükseltelim?'), 10,
      t('На ткани есть новая отметка. Если поднять край на десять сантиметров, рукоять будет открыта.', 'Kumaşa yeni işareti koyduk. Kenarı on santimetre kaldırınca tutamak açıkta kalacak.')),
      order(t('Сделай пробу без ножниц. Подогни ткань по отметке, закрепи сгиб зажимами и только потом отдай плащ Сону для примерки.',
        'Önce kumaşı kesmeden dene. Kumaşı işaretten katla, katı klipslerle tuttur, sonra Seonu’ya prova için ver.'),
      [t('Подогнуть ткань', 'Kumaşı katla'), t('Закрепить сгиб', 'Katı tuttur'), t('Примерить плащ', 'Pelerini dene')],
      t('Сону прошёл свой выход по ступенькам. Он видел рукоять на каждом шаге и попросил подшить край по этой отметке.', 'Seonu basamaklı sahne girişini denedi. Her adımda tutamağı gördü ve kenarın bu çizgi boyunca dikilmesini istedi.'))
    ],
    t('Какая деталь из ткани плаща появится на сцене?', 'Pelerinin kumaşından hangi ayrıntı sahnede görünsün?'),
    [
      end(t('Вышить луну на плаще', 'Pelerine ay işle'), t('Сону добавил на короткий край вышитую луну. Когда он поднялся на последнюю ступеньку, герб увидел весь зал, как и было задумано в сцене.', 'Seonu kısa kenara işleme bir ay ekledi. Son basamağa çıkınca oyunda planlandığı gibi armayı bütün salon gördü.')),
      end(t('Сделать вымпел из обрезка', 'Artan kumaştan flama yap'), t('Сону подарил обрезок сценической художнице. В последней сцене она повесила на башню вымпел из той же ткани, и Сону узнал его со ступенек.', 'Seonu artan kumaşı dekor tasarımcısına verdi. Son sahnede tasarımcı aynı kumaştan flamayı kuleye astı, Seonu da basamaklardan onu tanıdı.'))
    ]),

  story('city-134', t('Чжухи', 'Juhee'), t('Портрет без спешки', 'Aceleye Gelmeyen Portre'),
    t('В кабину Gieok Photo пришли трое друзей. На первой полоске Юри почти не видно, потому что она села позже остальных. Проверим режим, в котором ей хватит времени устроиться и посмотреть в объектив.',
      'Gieok Photo kabinine üç arkadaş geldi. İlk fotoğraf şeridinde Yuri pek görünmüyor çünkü diğerlerinden sonra oturdu. Rahatça oturup objektife bakmaya vakti olacağı bir ayarı deneyelim.'),
    [
      dial(t('Отсчёт на 4 секунды оказался слишком коротким. Юри попросила ещё 4 секунды. На сколько секунд поставим таймер?',
        '4 saniyelik geri sayım kısa geldi. Yuri 4 saniye daha istedi. Zamanlayıcıyı kaç saniyeye kuralım?'), 8,
      t('Восемь секунд хватило. Юри села рядом с друзьями и успела поправить шарф.', 'Sekiz saniye yetti. Yuri arkadaşlarının yanına oturup atkısını düzeltmeye de vakit buldu.')),
      cue(t('Когда метка окажется в выделенном участке, подай знак друзьям посмотреть в объектив.',
        'İşaret belirgin aralığa girince arkadaşlara objektife bakmaları için işaret ver.'), t('Дать знак', 'İşaret ver'),
      t('На новой полоске видно все три лица. Даже шарф Юри получился целиком.', 'Yeni şeritte üç yüz de görünüyor. Yuri’nin atkısının tamamı bile kadraja girdi.'))
    ],
    t('Как сохранить этот кадр для троих друзей?', 'Üç arkadaş bu kareyi nasıl saklasın?'),
    [
      end(t('Напечатать каждому по полоске', 'Herkese bir şerit bas'), t('Одну полоску вложили в дневник, вторую приклеили к зеркалу, а Юри прикрепила свою к чехлу телефона.', 'Biri şeridini günlüğüne koydu, biri aynasına yapıştırdı. Yuri de kendisininkini telefon kılıfına taktı.')),
      end(t('Добавить снимок в альбом', 'Fotoğrafı albüme koy'), t('Друзья оставили под кадром место для следующей встречи. Юри подписала его «В этот раз никто не опоздал».', 'Arkadaşlar karenin altında bir sonraki buluşma için yer bıraktı. Yuri fotoğrafa “Bu sefer kimse geç kalmadı” yazdı.'))
    ]),

  story('city-135', t('Посон', 'Boseong'), t('Усы смотрителя станции', 'İstasyon Görevlisinin Bıyığı'),
    t('В Insa Salon кукловод Юн принёс деревянного станционного смотрителя без усов. Он просит сделать новые так, чтобы в зале было видно, как кукла говорит. Для пробы у меня есть пряжа и бумажная выкройка.',
      'Kuklacı Yun, Insa Salon’a bıyıkları kaybolmuş tahta bir istasyon görevlisi getirdi. Kukla konuşurken seyirciler ağzını görebilsin diye yeni bir bıyık istiyor. Denemek için ipliğim ve bir kâğıt kalıbım var.'),
    [
      find(t('Выкройка должна оставлять рот открытым. На какой пробной форме видно всю линию рта?',
        'Kalıp ağzı kapatmamalı. Hangi deneme şeklinde ağzın tamamı görünüyor?'),
      [t('Два коротких кончика вверх', 'Yukarı bakan iki kısa uç'), t('Пряди закрывают уголки рта', 'Ağız kenarlarını örten uçlar'), t('Полоска поверх губ', 'Dudakların üstünü kapatan şerit')], 0,
      t('Выбрали форму с поднятыми кончиками. Юн открыл кукле рот, и бумага осталась над губами.', 'Uçları yukarı bakan şekli seçtik. Yun kuklanın ağzını açtı ve kâğıt dudakların üstünde kaldı.')),
      order(t('Сделай пряжные усы по проверенной выкройке. Сначала обведи контур на основе с пряжей, подстриги по линии и только потом отдай усы Юну для примерки.',
        'Denediğimiz kalıpla iplikten bıyık yap. Önce kalıbın çizgisini iplikli tabanın üstüne geçir, çizgiden kes, sonra denemesi için Yun’a ver.'),
      [t('Обвести выкройку', 'Kalıbın çizgisini geçir'), t('Подстричь по линии', 'Çizgiden kes'), t('Отдать усы на примерку', 'Bıyığı prova için ver')],
      t('Усы сидят высоко. Юн заставил смотрителя крикнуть «По местам!». Даже с последнего ряда было видно, как открывается рот куклы.', 'Bıyık yukarıda duruyor. Yun kuklaya “Herkes yerine!” diye bağırttı. Kuklanın ağzının açıldığı en arka sıradan bile göründü.'))
    ],
    t('Какого смотрителя сыграет Юн с новыми усами?', 'Yun yeni bıyıkla nasıl bir istasyon görevlisi oynasın?'),
    [
      end(t('Строгого на вид', 'Sert görünümlü'), t('Смотритель долго ищет пропавший билет с самым серьёзным лицом. Он первым прыснул со смеху, когда билет нашёлся у него за ухом.', 'Görevli ciddi bir yüzle kayıp bileti uzun süre aradı. Bilet kendi kulağının arkasından çıkınca ilk gülen de o oldu.')),
      end(t('Гостеприимного', 'Misafirperver'), t('Смотритель пропускает поезд вперёд и зовёт опоздавших на чай. Актёр в соседней будке тут же выставляет три крошечные чашки.', 'Görevli treni uğurlayıp geç kalanları çaya çağırdı. Yan kulübedeki oyuncu hemen üç minicik fincan çıkardı.'))
    ]),

  story('city-136', t('Ерин', 'Yerin'), t('Три цвета при разном свете', 'Farklı Işıkta Üç Renk'),
    t('В Hyangi Beauty художница по гриму выбирает оттенок для нарисованных веснушек. Под лампой у кассы два карандаша кажутся одинаковыми. Сделаем бумажную карточку и посмотрим, как меняются оттенки у окна.',
      'Hyangi Beauty’de makyaj sanatçısı çizilecek çiller için renk seçiyor. Kasanın ışığında iki makyaj kalemi aynı renkte görünüyor. Kâğıda örnekler çizip cam kenarında renklerin nasıl göründüğüne bakalım.'),
    [
      order(t('Подготовь карточку так, чтобы не перепутать оттенки. Сначала подпиши места номерами карандашей, потом нанеси мазки и только тогда неси карточку к окну.',
        'Renkler karışmasın diye kartı hazırla. Önce her yerin altına kalem numarasını yaz, sonra renkleri kâğıda sür ve kartı cam kenarına götür.'),
      [t('Подписать номера', 'Numaraları yaz'), t('Нанести мазки', 'Renkleri sür'), t('Поднести к окну', 'Cam kenarına götür')],
      t('У окна стало видно, что два похожих оттенка всё-таки разные. Благодаря номерам мы знаем, где какой.', 'Cam kenarında birbirine benzeyen iki rengin farklı olduğu ortaya çıktı. Numaralar sayesinde hangisinin hangisi olduğunu biliyoruz.')),
      find(t('Для рисунка нужны светло-коричневые веснушки. Какой номер на карточке подписан этим цветом?',
        'Çiller açık kahverengi olmalı. Kartta bu rengin numarası hangisi?'),
      [t('№ 2 · тёмно-коричневый', 'No 2 · koyu kahverengi'), t('№ 4 · светло-коричневый', 'No 4 · açık kahverengi'), t('№ 7 · серый', 'No 7 · gri')], 1,
      t('Карандаш номер четыре нашёлся. На пробном эскизе художница различила каждую точку и записала номер.', 'Dört numaralı kalemi bulduk. Makyaj sanatçısı deneme çiziminde her noktayı ayırt edip numarayı yazdı.'))
    ],
    t('Кому пригодится карточка с пробами?', 'Renk örneği kartı kimin işine yarasın?'),
    [
      end(t('Отдать с эскизом в гримёрку', 'Çizimle birlikte kulise gönder'), t('Художница приложила карточку к эскизу. На следующей репетиции другой мастер смог повторить рисунок веснушек.', 'Makyaj sanatçısı kartı çizime iliştirdi. Bir sonraki provada başka bir makyajcı aynı çilleri çizebildi.')),
      end(t('Показать покупателям у окна', 'Cam kenarında müşterilere göster'), t('Ерин повесила карточку у окна. Посетители начали приносить туда свои бумажные пробы, чтобы сравнивать цвета.', 'Yerin kartı cam kenarına astı. Müşteriler kendi kâğıt örneklerini de renkleri karşılaştırmak için oraya taşımaya başladı.'))
    ]),

  story('city-137', t('Кёнджу', 'Gyeongju'), t('Кадр на целый экран', 'Perdeyi Dolduran Kare'),
    t('В Dohwa Cinema школьники сняли короткий фильм про тени на стене. На пробе проектор обрезал края, и половина теневого кота пропала. Поправим рамку до прихода зрителей.',
      'Dohwa Cinema’da öğrencilerin duvardaki gölgelerle çektiği kısa film gösterilecek. Denemede projektör görüntünün kenarlarını kesti ve gölge kedinin yarısı kayboldu. Seyirciler gelmeden görüntüyü ayarlayalım.'),
    [
      dial(t('Ширина кадра выставлена на 9. В тесте рамку попросили сузить на 2 деления. Какое значение поставить?',
        'Görüntü genişliği 9’a ayarlı. Denemede çerçevenin 2 kademe daraltılması gerektiği görüldü. Hangi değeri seçelim?'), 7,
      t('На семёрке в кадр вернулись хвост и усы. Теперь можно проверить начало показа.', 'Yedinci kademede kuyrukla bıyıklar kadraja geri döndü. Şimdi gösterimin başlangıcını deneyebiliriz.')),
      cue(t('Запусти первый кадр, когда метка войдёт в выделенный участок. Тогда свет в зале уже погаснет.',
        'İşaret belirgin aralığa girdiğinde ilk kareyi oynat. O anda salonun ışığı sönmüş olacak.'), t('Начать показ', 'Gösterimi başlat'),
      t('Свет погас, и на экране открылся целый кадр. Хвост кота качнулся, и из первого ряда раздался смех.', 'Işık söndü ve görüntü perdeye eksiksiz geldi. Kedinin kuyruğu sallanınca ilk sıradan gülüşmeler duyuldu.'))
    ],
    t('Что покажем, когда закончатся титры?', 'Jenerik bitince ne gösterelim?'),
    [
      end(t('Показать руки за стеной', 'Gölgeyi yapan elleri göster'), t('Ребята поставили лампу за ширмой и показали зрителям, как двумя руками сделали усы. В первом ряду сразу попробовали повторить.', 'Çocuklar paravanın arkasına lamba koyup iki elle bıyığı nasıl yaptıklarını gösterdi. Ön sıradakiler hemen denedi.')),
      end(t('Показать вырезанный эпизод', 'Çıkarılan sahneyi göster'), t('Кёнджу включила кадры, где кот гонится за собственной тенью. После них школьники рассказали, почему изменили конец фильма.', 'Gyeongju kedinin kendi gölgesini kovaladığı sahneyi açtı. Öğrenciler sonra filmin sonunu neden değiştirdiklerini anlattı.'))
    ]),

  story('city-138', t('Мунхо', 'Munho'), t('Указатель для ранних гостей', 'Erken Gelen Konukların Levhası'),
    t('В Munhwa Hotel завтра остановится школьный хор. Завтрак у них раньше обычного, а два коридора в холле похожи. Сделаем указатель, который приведёт детей прямо к столам.',
      'Yarın Munhwa Hotel’de bir okul korosu kalacak. Her zamankinden erken kahvaltı edecekler ve lobideki iki koridor birbirine benziyor. Çocukları masalara götürecek bir yön levhası yapalım.'),
    [
      find(t('Со стороны стойки регистрации столовая слева, рядом с картиной лодки. Какой указатель выбрать?',
        'Resepsiyondan bakınca yemekhane solda, tekne tablosunun yanında. Hangi levha doğru?'),
      [t('Налево · картина дерева', 'Sola · ağaç tablosu'), t('Направо · картина лодки', 'Sağa · tekne tablosu'), t('Налево · картина лодки', 'Sola · tekne tablosu')], 2,
      t('Стрелка ведёт к картине лодки. Теперь проверим путь с этой подсказкой.', 'Ok, tekne tablosuna götürüyor. Şimdi bu levhayla yolu deneyelim.')),
      order(t('Пройди путь глазами гостя. Со стойки иди к картине, потом войди в дверь столовой возле неё.',
        'Bir konuk gibi yolu izle. Resepsiyondan tabloya doğru yürü, sonra yanındaki yemekhane kapısından gir.'),
      [t('Стойка регистрации', 'Resepsiyon'), t('Картина лодки', 'Tekne tablosu'), t('Дверь столовой', 'Yemekhane kapısı')],
      t('Указатель привёл к столам без подсказок от персонала. Даже из конца группы видно картину.', 'Levha, personele sormadan masalara ulaştırdı. Tekne tablosu grubun en arkasından bile görünüyor.'))
    ],
    t('Как ещё поможем хору собраться утром?', 'Koronun sabah toplanmasına başka nasıl yardım edelim?'),
    [
      end(t('Вложить маршрут в конверты', 'Rota kartını zarflara koy'), t('Гости получили маленькую схему вместе с ключами. Утром двое пришли по ней сами, пока остальные ещё собирались.', 'Konuklar anahtarlarıyla birlikte küçük bir kroki aldı. Sabah iki çocuk diğerleri hâlâ hazırlanırken krokiye bakıp kendi başına geldi.')),
      end(t('Встретить группу в холле', 'Grubu lobide karşıla'), t('Мунхо дождался всего хора у картины лодки. Руководитель пересчитал ребят, и все вместе вошли завтракать.', 'Munho bütün koroyu tekne tablosunun yanında bekledi. Koro şefi çocukları saydı ve herkes kahvaltıya birlikte girdi.'))
    ]),

  story('city-139', t('Наын', 'Naeun'), t('Островки цветов у моста', 'Köprü Yanındaki Çiçek Adaları'),
    t('В Boreum Flowers готовят маленькие букеты для бумажного макета моста. Низкие цветы должны обрамлять мост, а не закрывать его. Подберём высоту и выставим букеты на пробном столе.',
      'Boreum Flowers’ta kâğıttan köprü maketi için küçük buketler hazırlanıyor. Kısa çiçekler köprünün çevresini süslemeli, önünü kapatmamalı. Boylarını seçip deneme masasına yerleştirelim.'),
    [
      dial(t('Мост в макете высотой 9 см. Верхушки цветов должны быть ровно на 4 см ниже. Какой высоты собрать букет?',
        'Makette köprü 9 cm yüksekliğinde. Çiçeklerin tepesi köprüden tam 4 cm aşağıda kalmalı. Buketin boyu kaç cm olsun?'), 5,
      t('Пять сантиметров подошли. Над цветами видны все дуги моста.', 'Beş santimetre tam oldu. Köprünün bütün kemerleri çiçeklerin üstünden görünüyor.')),
      order(t('На пробном столе начни с пустой вазы. Налей в неё воду, вставь короткие стебли, потом поставь готовую вазу рядом с макетом.',
        'Deneme masasında boş vazoyla başla. Su koy, kısa sapları yerleştir, sonra hazır vazoyu maketin yanına götür.'),
      [t('Налить воду', 'Su koy'), t('Вставить стебли', 'Sapları yerleştir'), t('Поставить вазу у моста', 'Vazoyu köprünün yanına koy')],
      t('Букет держится, а мост виден целиком. Можно выбрать, сколькими вазами его окружить.', 'Buket dik duruyor, köprü de bütünüyle görünüyor. Şimdi çevresinde kaç vazo olacağına karar verebiliriz.'))
    ],
    t('Как расставим букеты на столе?', 'Buketleri masaya nasıl dizelim?'),
    [
      end(t('По вазе с каждого берега', 'Her kıyıya bir vazo'), t('С обоих берегов получились цветочные островки. Посетители обошли стол, чтобы посмотреть на мост с двух сторон.', 'İki kıyıda da birer çiçek adası oldu. Ziyaretçiler köprüyü iki taraftan görmek için masanın etrafını dolaştı.')),
      end(t('Оставить один берег свободным', 'Bir kıyıyı boş bırak'), t('На свободном берегу дети выстроили бумажные домики. За букетом на другом берегу они дорисовали тропинку.', 'Çocuklar boş kıyıya kâğıttan evler dizdi. Öbür kıyıdaki buketin arkasına da bir patika çizdiler.'))
    ]),

  story('city-140', t('Чанмин', 'Changmin'), t('Кит на белой стене', 'Beyaz Duvardaki Balina'),
    t('В Geulim Gallery школьники сделали бумажного кита для выставки теней. Когда лампа стоит сбоку, на стене виден только хвост. Найдём угол, под которым целый кит появится над зрителями.',
      'Geulim Gallery’de öğrenciler gölge sergisi için kâğıttan balina yaptı. Lamba yandayken duvarda yalnızca kuyruğu görünüyor. Balinanın seyircilerin üstünde bütün olarak görüneceği açıyı bulalım.'),
    [
      find(t('На пробных стендах отмечено, что видно из зала. Где видны и голова, и хвост?',
        'Deneme panolarında salondan görünen kısımlar yazıyor. Hangisinde baş da kuyruk da görünüyor?'),
      [t('Лампа сбоку · хвост', 'Lamba yanda · kuyruk'), t('Лампа прямо · голова и хвост', 'Lamba karşıda · baş ve kuyruk'), t('Лампа снизу · голова', 'Lamba aşağıda · baş')], 1,
      t('Лампа стоит прямо. На стене появился весь силуэт, вплоть до маленького плавника.', 'Lamba tam karşıda. Küçük yüzgecine kadar bütün balinanın gölgesi duvara düştü.')),
      cue(t('Когда метка войдёт в выделенный участок, открой заслонку лампы и покажи кита зрителям.',
        'İşaret belirgin aralığa girince lambanın kapağını açıp balinayı seyircilere göster.'), t('Показать кита', 'Balinayı göster'),
      t('Кит выплыл на стену. Ребёнок у входа указал на плавник, который раньше терялся в тени.', 'Balina duvarda yüzüyormuş gibi göründü. Girişteki bir çocuk daha önce kaybolan yüzgeci gösterdi.'))
    ],
    t('Куда поплывёт кит после первого показа?', 'İlk gösterimden sonra balina nereye yüzsün?'),
    [
      end(t('В море детских рисунков', 'Çocukların çizdiği denize'), t('Дети прикрепили вокруг тени свои волны и рыб. Один мальчик нарисовал лодку, чтобы плыть рядом с китом.', 'Çocuklar gölgenin etrafına kendi dalga ve balık çizimlerini astı. Bir çocuk balinayla yan yana yüzsün diye tekne çizdi.')),
      end(t('На урок театра теней', 'Gölge tiyatrosu dersine'), t('Чанмин передал школьникам кита с лампой. На уроке они передвигали лампу и выяснили, как сделать тень длиннее самого кита.', 'Changmin balinayla lambayı öğrencilere verdi. Derste lambayı oynatıp gölgeyi balinanın kendisinden nasıl daha uzun yapacaklarını keşfettiler.'))
    ])
];
