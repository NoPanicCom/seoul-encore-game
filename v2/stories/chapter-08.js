import { t, story, find, order, dial, cue, end } from './format.js';

export default [
  story(
    'city-141',
    t('Ёнсу', 'Yeonsu'),
    t('Меню, которое звучит', 'Sesli menü'),
    t(
      'В Yeoul Coffee ребята с соседних курсов попросили игру со звуками кафе. Мы записали, как повар готовит три напитка. На первой записи отчётливо слышно, как кубики льда звенят о стекло.',
      'Yeoul Coffee’de komşu kurstaki çocuklar kafe sesleriyle bir oyun istedi. Üç içecek hazırlanırken çıkan sesleri kaydettik. İlk kayıtta buz küplerinin cama çarpıp şıngırdadığı duyuluyor.',
    ),
    [
      find(
        t('Стакан со льдом узнали по звону. Какой напиток приготовили в нём по нашему меню?', 'Buzlu bardağı şıngırtıdan tanıdık. Menümüze göre o bardakta hangi içeceği hazırladık?'),
        [t('Горячее какао в кружке', 'Kupada sıcak kakao'), t('Мандариновый сок со льдом', 'Buzlu mandalina suyu'), t('Тёплый чай в чашке', 'Fincanda ılık çay')],
        1,
        t('Это сок! Ребята просят дать им услышать ещё один звук, пока стакан закрыт ширмой.', 'Meyve suyu! Çocuklar bardak perdenin arkasındayken bir ses daha duymak istiyor.'),
      ),
      cue(
        t('Я поднимаю пустой стакан за ширмой. Когда загорится зона сигнала, урони в стакан кубик льда.', 'Boş bardağı perdenin arkasında kaldırıyorum. İşaret alanı aydınlanınca bardağa bir buz küpü bırak.'),
        t('Бросить кубик', 'Buzu bırak'),
        t('Кубик звенит. Ребята угадывают напиток до того, как я отодвигаю ширму.', 'Buz küpü şıngırdıyor. Çocuklar perdeyi çekmemi beklemeden içeceği tahmin ediyor.'),
      ),
    ],
    t('Как продолжим игру в кафе?', 'Kafede oyunu nasıl sürdürelim?'),
    [
      end(t('Угадывать у стойки', 'Tezgâhta tahmin edelim'), t('У стойки ведущий включает записи из меню. Победитель узнаёт какао по стуку ложки о кружку и заказывает его к полднику.', 'Tezgâhtaki sunucu menü kayıtlarını açıyor. Kazanan, kaşığın kupaya vuruşundan kakaoyu tanıyor ve ikindi molasında ondan istiyor.')),
      end(t('Записать новые звуки', 'Yeni sesler kaydedelim'), t('Ребята сами записывают, как в чай наливают воду и как открывается банка какао. На следующей встрече уже бариста угадывают их записи.', 'Çocuklar çaya su dökülürken ve kakao kutusu açılırken çıkan sesleri kaydediyor. Bir sonraki buluşmada bu kez baristalar tahmin ediyor.')),
    ],
  ),

  story(
    'city-142',
    t('Мисо', 'Miso'),
    t('Тайна у двух обложек', 'İki kapaklı gizem'),
    t(
      'В Sidae Books я получила детектив с двумя обложками. С одной стороны мальчик ищет ключ, с другой девочка ищет замок. Каждый находит половину разгадки, а соединить их можно на средней странице.',
      'Sidae Books’a iki kapaklı bir polisiye geldi. Bir kapaktan başlayınca bir oğlan anahtar arıyor, öbüründen başlayınca bir kız kilidi arıyor. Her biri çözümün yarısını buluyor, parçalar ortadaki sayfada birleşiyor.',
    ),
    [
      dial(
        t('От синей обложки след ведёт через 4 страницы, а потом ещё через 2. Какой номер у страницы, где герои встречаются?', 'Mavi kapaktan başlayan iz önce 4, sonra 2 sayfa daha ilerliyor. Kahramanların buluştuğu sayfanın numarası kaç?'),
        6,
        t('На шестой странице оба героя смотрят на дверь. У ключа квадратный конец, а под нужным замком нарисована волна.', 'Altıncı sayfada iki kahraman bir kapıya bakıyor. Anahtarın ucu kare, aradığımız kilidin altında da bir dalga çizili.'),
      ),
      find(
        t('Там три замка. Какой из них откроет квадратный ключ, если под нужным замком есть волна?', 'Orada üç kilit var. Doğru kilidin altında bir dalga varsa kare anahtar hangisini açar?'),
        [t('Квадратный паз, волна', 'Kare yuva, dalga'), t('Круглый паз, волна', 'Yuvarlak yuva, dalga'), t('Квадратный паз, облако', 'Kare yuva, bulut')],
        0,
        t('Дверь в книжке открывается. Внутри ждёт письмо, которое герои могут прочитать только вместе.', 'Kitaptaki kapı açılıyor. İçeride, kahramanların ancak birlikte okuyabileceği bir mektup var.'),
      ),
    ],
    t('Как предложим прочитать детектив первым гостям?', 'İlk gelenlere polisiyeyi nasıl okumalarını önerelim?'),
    [
      end(t('Два читателя', 'İki kişi okusun'), t('Двое друзей берут книжку с разных сторон. На встрече каждый читает вслух свою половину письма.', 'İki arkadaş kitabın ayrı kapaklarından başlıyor. Ortada buluşunca her biri mektubun kendi yarısını sesli okuyor.')),
      end(t('Один сыщик, два прохода', 'Bir dedektif iki kez okusun'), t('Один читатель сначала рисует ключ в блокноте, потом переворачивает книгу и ищет замок. Разгадку он записывает сам.', 'Bir okur önce defterine anahtarı çiziyor, sonra kitabı çevirip kilidi arıyor. Çözümü defterine kendi yazıyor.')),
    ],
  ),

  story(
    'city-143',
    t('Чихо', 'Jiho'),
    t('Танец на шести клетках', 'Altı karede dans'),
    t(
      'В Sori Dance готовим номер для сцены между двумя рядами стульев. На репетиции широкий шаг задевает воображаемый стул. Испытаем рисунок танца на коврике такой же ширины, как сцена.',
      'Sori Dance’te iki sıra sandalyenin arasındaki sahneye bir dans hazırlıyoruz. Provada geniş bir adım atınca hayalî bir sandalyeye çarpıyoruz. Dansı sahneyle aynı genişlikte bir minderin üstünde deneyelim.',
    ),
    [
      dial(
        t('На коврике 8 клеток в ширину. По одной клетке с каждого края оставим свободной. На скольких клетках можно танцевать?', 'Minderin eni 8 kare. Her iki kenarda birer kareyi boş bırakacağız. Kaç karede dans edebiliriz?'),
        6,
        t('Отмечаю границу из шести клеток. В стороне от стульев теперь видна наша площадка.', 'Altı karelik alanın sınırını işaretliyorum. Sandalyelerden uzakta kalan dans alanımız artık belli.'),
      ),
      order(
        t('Попробуем связку на месте. Сперва носок касается пола, потом пятка опускается рядом, а после этого делаем поворот.', 'Hareketleri yerimizde deneyelim. Önce ayağının ucunu yere değdir, sonra aynı ayağın topuğunu indir. Ardından dön.'),
        [t('Коснуться носком', 'Ayak ucunu yere değdir'), t('Опустить пятку', 'Topuğunu indir'), t('Повернуться на месте', 'Olduğun yerde dön')],
        t('Ноги не вышли за край коврика. Теперь слышно, что носок и пятка отбивают два разных звука.', 'Ayaklar minderin dışına çıkmadı. Ayak ucuyla topuğun iki ayrı ses çıkardığı duyuluyor.'),
      ),
    ],
    t('Как используем эти шаги на сцене?', 'Bu adımları sahnede nasıl kullanalım?'),
    [
      end(t('Танцевать в один ряд', 'Tek sırada dans edelim'), t('Весь ряд отбивает шаг одновременно. Зрители у прохода слышат общий ритм, не отодвигая стулья.', 'Bütün sıra aynı anda adım vuruyor. Geçidin yanındaki seyirciler sandalyelerini çekmeden ortak ritmi duyuyor.')),
      end(t('Отвечать шагом на шаг', 'Adımla karşılık verelim'), t('Танцоры стоят в две линии. Шаг одной линии звучит как вопрос, а вторая отвечает тем же рисунком.', 'Dansçılar iki sıra oluyor. Bir sıranın adımı soru gibi duyuluyor, ikinci sıra aynı hareketlerle karşılık veriyor.')),
    ],
  ),

  story(
    'city-144',
    t('Тэхи', 'Taehee'),
    t('Блюдо идёт по кругу', 'Tabak masada turluyor'),
    t(
      'В Doduk Kitchen за круглым столом собралась большая семья. Всем хочется попробовать огурцы с кунжутом, но блюдо постоянно застревает на дальнем краю. Испытаем вращающийся поднос, чтобы каждый мог сам положить себе салат.',
      'Doduk Kitchen’da büyük bir aile yuvarlak masanın etrafına toplandı. Herkes susamlı salatalıktan tatmak istiyor ama tabak hep masanın öbür ucunda kalıyor. Herkes salatasını kendi alabilsin diye döner tepsiyi deneyelim.',
    ),
    [
      find(
        t('Поднос должен вращаться свободно между тарелками. Какой возьмём, если место на столе круглое и небольшое?', 'Tepsi tabakların arasında rahatça dönebilmeli. Masadaki boşluk küçük ve yuvarlaksa hangisini alalım?'),
        [t('Длинный поднос, задевает тарелки', 'Tabaklara çarpan uzun tepsi'), t('Большой поднос, закрывает тарелки', 'Tabakların üstüne taşan büyük tepsi'), t('Маленький круглый поднос', 'Küçük yuvarlak tepsi')],
        2,
        t('Поднос крутится, не задевая ни одной тарелки. Ставлю на него огурцы.', 'Tepsi hiçbir tabağa değmeden dönüyor. Salatalığı üstüne koyuyorum.'),
      ),
      cue(
        t('Бабушка кладёт себе салат. Когда загорится зона сигнала, она уже уберёт ложку. Тогда поверни поднос к следующему гостю.', 'Büyükanne tabağına salata alıyor. İşaret alanı aydınlanınca kaşığını çekmiş olacak. O zaman tepsiyi sıradaki konuğa doğru çevir.'),
        t('Повернуть поднос', 'Tepsiyi çevir'),
        t('Блюдо доехало до внучки. Теперь очередь видна сама собой, потому что поднос идёт по кругу.', 'Tabak toruna ulaştı. Tepsi masada döndüğü için sıranın kimde olduğu kendiliğinden belli oluyor.'),
      ),
    ],
    t('Что поставим на поднос дальше?', 'Bundan sonra tepsiye ne koyalım?'),
    [
      end(t('Новое блюдо от кухни', 'Mutfaktan yeni bir tabak'), t('На поднос едет порция редьки по моему рецепту. Каждый пробует по кусочку, а семья просит записать рецепт.', 'Tepsiye kendi tarifimle yaptığım turpu koyuyorum. Herkes bir parça tadıyor, aile tarifini yazmamı istiyor.')),
      end(t('По закуске от гостя', 'Herkes bir meze seçsin'), t('Гости выбирают по маленькой закуске из меню. За столом каждый предлагает соседу попробовать свою находку.', 'Konuklar menüden birer küçük meze seçiyor. Masada herkes yanındakine kendi seçtiği mezeyi tattırıyor.')),
    ],
  ),

  story(
    'city-145',
    t('Сынхо', 'Seungho'),
    t('Луна на пластинке', 'Plaktaki ay'),
    t(
      'В Sangsu Records заглянула Ильсук в поисках песни из школьного спектакля. Название она забыла, зато на этикетке помнит луну и две звезды. Здесь три пластинки без конвертов.',
      'Sangsu Records’a Ilsuk uğradı. Okul oyununda çalan şarkıyı arıyor. Adını unutmuş ama plak etiketinde bir ayla iki yıldız olduğunu hatırlıyor. Burada kapağı olmayan üç plak var.',
    ),
    [
      find(
        t('Какую пластинку поставим по подсказке Ильсук?', 'Ilsuk’un ipucuna göre hangi plağı çalalım?'),
        [t('Луна и одна звезда', 'Ay ve bir yıldız'), t('Солнце и две звезды', 'Güneş ve iki yıldız'), t('Луна и две звезды', 'Ay ve iki yıldız')],
        2,
        t('Ильсук узнаёт этикетку. Говорит, что в самом начале должно прозвучать два удара колокольчика.', 'Ilsuk etiketi tanıyor. En başta iki çan sesi duyulması gerektiğini söylüyor.'),
      ),
      cue(
        t('Опусти иглу проигрывателя, когда загорится зона сигнала.', 'İşaret alanı aydınlanınca pikabın iğnesini indir.'),
        t('Опустить иглу', 'İğneyi indir'),
        t('Слышно два удара колокольчика. Ильсук тихо подпевает мелодии из школьного спектакля.', 'İki çan sesi duyuluyor. Ilsuk okul oyunundaki ezgiye hafifçe eşlik ediyor.'),
      ),
    ],
    t('Как поделимся находкой с бывшими одноклассниками Ильсук?', 'Bu plağı Ilsuk’un eski sınıf arkadaşlarıyla nasıl paylaşalım?'),
    [
      end(t('Позвать послушать', 'Dinlemeye çağıralım'), t('В субботу они приходят в магазин и слушают пластинку вместе. Каждый вспоминает, в каком костюме вышел на сцену.', 'Cumartesi dükkâna gelip plağı birlikte dinliyorlar. Herkes sahneye hangi kostümle çıktığını hatırlıyor.')),
      end(t('Подписать конверт', 'Plak kapağına yazalım'), t('Ильсук рисует на новом конверте школьную сцену и пишет название песни. Конверт она берёт на встречу класса.', 'Ilsuk yeni kapağa okul sahnesini çizip şarkının adını yazıyor. Kapağı sınıf buluşmasına götürüyor.')),
    ],
  ),

  story(
    'city-146',
    t('Хеджин', 'Hyejin'),
    t('Камешки вместо дождя', 'Yağmur yerine çakıl'),
    t(
      'В Haerang Sound я записываю звуки для кукольной сказки. Нужен дождь, а на улице сухо. Под рукой жестяная коробка, горсть камешков и запись шагов.',
      'Haerang Sound’da kukla gösterisi için ses kaydediyorum. Yağmur sesi lazım ama dışarıda yağmur yok. Elimde teneke kutu, bir avuç çakıl ve ayak sesi kaydı var.',
    ),
    [
      order(
        t('Собери звуки по сюжету. Сначала герой идёт по улице, потом падают первые капли, а под конец дождь разгоняется.', 'Sesleri hikâyeye göre sırala. Önce kahraman sokakta yürüyor. Sonra ilk damlalar düşüyor, en sonda yağmur hızlanıyor.'),
        [t('Шаги по улице', 'Sokaktaki ayak sesleri'), t('Редкие камешки по крышке', 'Kapağa tek tük çakıl düşüyor'), t('Частая дробь камешков', 'Çakıllar hızla düşüyor')],
        t('Камешки звучат как дождь по крыше. Осталось проверить, хватит ли этой записи на всю сцену.', 'Çakıllar çatıya yağan yağmur gibi ses çıkarıyor. Şimdi kaydın bütün sahneye yetip yetmediğine bakalım.'),
      ),
      dial(
        t('Сцена длится 9 секунд. Из них 3 секунды уже заняли шаги. Сколько секунд дождя оставить?', 'Sahne 9 saniye sürüyor. Ayak sesleri 3 saniye tutuyor. Yağmur için kaç saniye bırakalım?'),
        6,
        t('Последняя капля звучит ровно в тот миг, когда кукла прячется под навесом.', 'Son damlanın sesi tam kukla saçak altına sığındığı anda geliyor.'),
      ),
    ],
    t('Что сделать с дождём на первом показе?', 'İlk gösteride yağmur sesini nasıl kullanalım?'),
    [
      end(t('Включить запись', 'Kaydı açalım'), t('Я включаю запись за ширмой. Публика слышит дождь и смотрит на окно. После поклона я показываю детям сухие камешки из коробки.', 'Kaydı perdenin arkasında çalıyorum. Seyirciler yağmuru duyup pencereye bakıyor. Oyuncular selam verdikten sonra çocuklara kutudaki kuru çakılları gösteriyorum.')),
      end(t('Доверить капли залу', 'Damlalar seyirciden gelsin'), t('Зрители по моему знаку стучат пальцами по коленям. Во втором ряду начинается ливень, а кукла раскрывает зонт.', 'İşaretimle seyirciler dizlerine parmaklarıyla vuruyor. İkinci sırada sağanak başlıyor, kukla şemsiyesini açıyor.')),
    ],
  ),

  story(
    'city-147',
    t('Нари', 'Nari'),
    t('Полосы на срезе', 'Dilimdeki çizgiler'),
    t(
      'В Nari Bakehouse попросили испечь хлеб к открытию нового перехода у школы. Хочу, чтобы на каждом ломтике были полосы, как у дорожной зебры. Рядом уже лежат светлое и тёмное тесто.',
      'Nari Bakehouse’tan okulun önündeki yeni yaya geçidinin açılışı için ekmek istediler. Her dilimin içinde geçitteki gibi çizgiler olsun istiyorum. Açık ve koyu renkli hamur hazır.',
    ),
    [
      find(
        t('У нас три слоя. Тёмная полоса должна идти ровно между двумя светлыми. Как сложим тесто?', 'Üç katımız var. Koyu çizgi iki açık çizginin tam ortasında olmalı. Hamurları nasıl dizelim?'),
        [t('Светлый, светлый, тёмный', 'Açık, açık, koyu'), t('Светлый, тёмный, светлый', 'Açık, koyu, açık'), t('Тёмный, светлый, тёмный', 'Koyu, açık, koyu')],
        1,
        t('Тёмный слой в середине виден уже на краю сырого теста. На срезе он будет виден целиком.', 'Koyu kat daha hamurun kenarında belli oluyor. Ekmeği kesince çizginin tamamı görünecek.'),
      ),
      order(
        t('Собери путь от теста до среза. Сначала я уложу его в форму, потом испеку, а когда хлеб остынет, разрежу.', 'Hamurdan dilime kadar işleri sırala. Önce hamuru kalıba koyacağım, sonra pişireceğim. Ekmek soğuyunca keseceğim.'),
        [t('Уложить в форму', 'Kalıba koy'), t('Испечь хлеб', 'Ekmeği pişir'), t('Разрезать остывший хлеб', 'Soğuyan ekmeği dilimle')],
        t('На первом ломтике видны все три полосы. Дети у витрины сразу узнают зебру.', 'İlk dilimde üç çizgi de görünüyor. Vitrindeki çocuklar yaya geçidini hemen tanıyor.'),
      ),
    ],
    t('Как показать хлеб на открытии перехода?', 'Geçidin açılışında ekmeği nasıl sunalım?'),
    [
      end(t('Сложить зебру на подносе', 'Tepside geçit yapalım'), t('Кладу ломтики рядом, и полосы продолжаются от одного к другому. Школьники находят конец съедобной зебры и берут оттуда по кусочку.', 'Dilimleri yan yana koyuyorum, çizgiler birbirini tamamlıyor. Öğrenciler yenebilir geçidin sonunu bulup oradan birer parça alıyor.')),
      end(t('Разрезать хлеб при гостях', 'Ekmeği konukların önünde keselim'), t('У школы мы разрезаем второй хлеб. Дети сначала видят обычную корку, потом тёмная полоса появляется на срезе, и они зовут родителей посмотреть.', 'Okulun önünde ikinci ekmeği kesiyoruz. Çocuklar önce sıradan bir kabuk görüyor. Koyu çizgi ortaya çıkınca anne babalarını bakmaya çağırıyorlar.')),
    ],
  ),

  story(
    'city-148',
    t('Бора', 'Bora'),
    t('Две строчки для дедушки', 'Dedeye iki satır şarkı'),
    t(
      'В Baramgil Karaoke близнецы готовят дедушке сюрприз. Они оба знают припев, но вступают одновременно и теряют слова. Попросили меня включить подсказки для дуэта.',
      'Baramgil Karaoke’de ikizler dedelerine sürpriz hazırlıyor. İkisi de nakaratı biliyor ama aynı anda başlayınca sözleri şaşırıyorlar. Düet ipuçlarını açmamı istediler.',
    ),
    [
      find(
        t('У каждого близнеца должен быть свой цвет строк. Какой режим покажет, чья сейчас очередь?', 'Her ikizin sözleri ayrı renkte olmalı. Kimin sırası olduğunu hangi mod gösterir?'),
        [t('Один цвет для всех слов', 'Bütün sözler tek renk'), t('Только мелодия', 'Yalnızca ezgi'), t('Два цвета, по одному на голос', 'İki renk, her sese bir renk')],
        2,
        t('У каждого свой цвет. Теперь видно, кто поёт первую половину припева и кто отвечает.', 'Artık her birinin ayrı rengi var. Nakaratın ilk yarısını kimin söyleyeceği, kimin cevap vereceği belli.'),
      ),
      cue(
        t('Близнецы готовы. Когда загорится зона сигнала, нажми кнопку, чтобы дать первому певцу знак вступить.', 'İkizler hazır. İşaret alanı aydınlanınca düğmeye dokunup ilk şarkıcının başlamasını sağla.'),
        t('Дать вступление', 'Başlama işareti ver'),
        t('Первая строчка прозвучала вовремя. Вторая подхватывает мелодию без паузы, и близнецы улыбаются.', 'İlk satır tam zamanında geldi. İkinci satır ara vermeden ezgiyi sürdürüyor, ikizler de gülümsüyor.'),
      ),
    ],
    t('Как лучше преподнести дедушке их дуэт?', 'İkizlerin düetini dedelerine nasıl sunalım?'),
    [
      end(t('Включить запись дома', 'Kaydı evde açalım'), t('Близнецы дают дедушке послушать запись за завтраком. Он просит копию и потом слушает её на утренних прогулках.', 'İkizler kahvaltıda dedelerine kaydı dinletiyor. Dede bir kopyasını istiyor. Sonra sabah yürüyüşlerinde kaydı dinliyor.')),
      end(t('Позвать в караоке', 'Karaokeye çağıralım'), t('Дедушка сперва слушает у двери, а в последнем припеве берёт свободный микрофон. Близнецы показывают ему, на какой цвет смотреть.', 'Dede önce kapıda dinliyor, son nakaratta boş mikrofonu alıyor. İkizler ona hangi renge bakacağını gösteriyor.')),
    ],
  ),

  story(
    'city-149',
    t('Тэгон', 'Taegon'),
    t('Карта в одно нажатие', 'Tek dokunuşla harita'),
    t(
      'В Hakbit Electronics мне оставили планшет с картой школьной ярмарки. Стрелки на экране такие маленькие, что посетители постоянно промахиваются. Попробуем переключать страницы большой кнопкой.',
      'Hakbit Electronics’e okul şenliğinin haritasını gösteren bir tablet bıraktılar. Ekrandaki oklar o kadar küçük ki ziyaretçiler bir türlü denk getiremiyor. Sayfaları büyük bir düğmeyle değiştirmeyi deneyelim.',
    ),
    [
      find(
        t('У кнопки плоский разъём с закруглёнными краями. Какой переходник подходит по форме?', 'Düğmenin bağlantı ucu yassı ve kenarları yuvarlak. Hangi adaptörün girişi buna uyar?'),
        [t('Круглое отверстие', 'Yuvarlak giriş'), t('Плоское с закруглёнными краями', 'Yuvarlak kenarlı yassı giriş'), t('Квадратное отверстие', 'Kare giriş')],
        1,
        t('Разъём подошёл. Первый пробный нажим переносит нас со схемы входа на план ярмарки.', 'Bağlantı ucu oturdu. Düğmeye ilk basış bizi giriş krokisinden şenlik haritasına götürüyor.'),
      ),
      dial(
        t('Ярмарка просит возвращать карту ко входу после 8 секунд без нажатий. Выставь время ожидания в секундах.', 'Şenliği düzenleyenler, düğmeye 8 saniye basılmazsa haritanın girişe dönmesini istiyor. Bekleme süresini saniye olarak ayarla.'),
        8,
        t('Карта вернулась ко входу через 8 секунд. Следующий гость начнёт с первой страницы.', 'Harita 8 saniye sonra girişe döndü. Sıradaki ziyaretçi ilk sayfadan başlayacak.'),
      ),
    ],
    t('Где большая кнопка пригодится на ярмарке?', 'Büyük düğme şenlikte en çok nerede işe yarar?'),
    [
      end(t('Карту у входа', 'Harita girişte dursun'), t('Ставлю планшет у входа. Гости сами перелистывают карту и сразу видят дорогу к нужному столу.', 'Tableti girişe koyuyorum. Ziyaretçiler haritayı kendi başlarına değiştirip aradıkları masaya giden yolu görüyor.')),
      end(t('Карту в мастерскую', 'Harita atölyeye gitsin'), t('Отношу планшет к школьным изобретателям. Они пробуют кнопку и делают ещё одну для викторины.', 'Tableti okulun mucitlerine götürüyorum. Düğmeyi deneyip bilgi yarışması için bir tane daha yapıyorlar.')),
    ],
  ),

  story(
    'city-150',
    t('Сони', 'Seoni'),
    t('Сумка едет сама', 'Çanta kendi yolunu buluyor'),
    t(
      'В Yeopjip Market я собираю покупки соседке, которая сегодня сидит с младшим внуком. В прошлый раз бутылки раздавили хлеб в сумке. На этот раз сумка поедет на тележке, а хлеб должен доехать целым.',
      'Yeopjip Market’te bugün küçük torununa bakan komşumuzun alışverişini hazırlıyorum. Geçen sefer şişeler çantadaki ekmeği ezmişti. Bu kez çanta el arabasıyla gidecek, ekmek de sapasağlam ulaşmalı.',
    ),
    [
      order(
        t('Укладывай снизу вверх. Бутылки самые тяжёлые. Коробка макарон ляжет над ними, а мягкий хлеб пойдёт наверх.', 'Alttan üste doğru yerleştir. En ağır olan şişeler. Üstlerine makarna kutusu, en üste de yumuşak ekmek gelecek.'),
        [t('Бутылки', 'Şişeler'), t('Макароны', 'Makarna kutusu'), t('Хлеб', 'Ekmek')],
        t('Хлеб лежит на коробке и не касается бутылок. Теперь подкатим сумку к двери.', 'Ekmek kutunun üstünde, şişelere değmiyor. Şimdi çantayı arabanın üstünde kapıya götürelim.'),
      ),
      cue(
        t('У двери нас ждёт помощник с тележкой. Когда загорится зона сигнала, подай знак, что сумку можно забирать.', 'Kapıda el arabasını süren yardımcımız bekliyor. İşaret alanı aydınlanınca çantayı alabileceğini haber ver.'),
        t('Подать знак', 'Haber ver'),
        t('Помощник везёт покупки прямо к соседке. У двери внук заглядывает в сумку и находит целый хлеб.', 'Yardımcımız alışverişi doğruca komşumuza götürüyor. Torunu kapıda çantaya bakınca ekmeği sapasağlam buluyor.'),
      ),
    ],
    t('Как устроим следующую доставку?', 'Bir sonraki teslimatı nasıl düzenleyelim?'),
    [
      end(t('Тележка по расписанию', 'El arabasına saat koyalım'), t('Каждый четверг тележка развозит покупки по двум дворам. Соседка оставляет у нас список перед прогулкой с внуком.', 'Her perşembe el arabası iki avluya alışveriş götürüyor. Komşumuz torunuyla yürüyüşe çıkmadan önce bize listesini bırakıyor.')),
      end(t('Одолжить тележку', 'El arabasını ödünç verelim'), t('Тележку можно взять у кассы. Соседка с внуком везут свои покупки и по пути передают пакет другому соседу.', 'El arabası kasadan ödünç alınabiliyor. Komşumuz torunuyla kendi alışverişini taşırken yolda başka bir komşuya da paket bırakıyor.')),
    ],
  ),

  story(
    'city-151',
    t('Донён', 'Dongyeon'),
    t('Гонка со своей тенью', 'Kendi gölgenle yarış'),
    t(
      'В Yoyo Arcade Минджи хочет тренироваться на гоночном автомате. Ей интересно, где она сбрасывает скорость, но на табло только чужие рекорды. В автомате есть режим, где рядом едет твой прошлый заезд.',
      'Yoyo Arcade’de Minji yarış makinesinde pratik yapmak istiyor. Nerede yavaşladığını merak ediyor ama puan tablosunda hep başkalarının rekorları var. Makinenin bir modunda önceki turdaki araban yanında ilerliyor.',
    ),
    [
      find(
        t('Хочу показать Минджи только её прошлую машину. Какой режим запустим?', 'Minji’ye yalnızca önceki turdaki kendi arabasını göstermek istiyorum. Hangi modu açalım?'),
        [t('Рекорд дня', 'Günün rekoru'), t('Мой прошлый заезд', 'Önceki turum'), t('Случайный соперник', 'Rastgele rakip')],
        1,
        t('На трассе появилась прозрачная копия её машины. Теперь можно увидеть, на каком повороте она отстаёт.', 'Pistte arabasının saydam bir kopyası belirdi. Artık hangi virajda geride kaldığını görebilir.'),
      ),
      dial(
        t('На разминке копия должна проехать мимо старта через 4 секунды после отсчёта. Задай задержку в секундах.', 'Isınma turunda sayım bittiğinde kopya araba 4 saniye bekleyip başlangıç çizgisinden geçmeli. Gecikmeyi saniye olarak ayarla.'),
        4,
        t('Минджи успевает тронуться первой. На мосту копия её догоняет, и Минджи замечает, где поздно начала поворот.', 'Minji önce yola çıkıyor. Köprüde kopya araba onu yakalayınca dönüşe nerede geç başladığını fark ediyor.'),
      ),
    ],
    t('Что предложим Минджи после разминки?', 'Isınma turundan sonra Minji’ye ne önerelim?'),
    [
      end(t('Улучшить свой круг', 'Kendi turunu geliştir'), t('Минджи запускает новый круг одновременно с копией и обгоняет её на мосту. Теперь сама объясняет, когда начинать поворот.', 'Minji kopya arabayla aynı anda yeni tura çıkıp köprüde onu geçiyor. Artık dönüşe ne zaman başlanacağını kendisi anlatıyor.')),
      end(t('Показать мост новичку', 'Köprüyü yeni oyuncuya göster'), t('Минджи садится рядом с новичком и показывает, где начать поворачивать. Тот проезжает мост, и они дают друг другу пять.', 'Minji yeni oyuncunun yanına oturup dönüşe nerede başlayacağını gösteriyor. Oyuncu köprüyü geçince çak bir beşlik yapıyorlar.')),
    ],
  ),

  story(
    'city-152',
    t('Данби', 'Danbi'),
    t('Упаковка с продолжением', 'Sonrası olan hediye paketi'),
    t(
      'В Byeolbam Gifts гость выбирает подарок другу, который переезжает. Просит завернуть блокнот в бумагу со звёздами. Одну звезду он хочет оставить на сгибе, чтобы половинка была с каждой стороны.',
      'Byeolbam Gifts’te bir ziyaretçi taşınan arkadaşına hediye seçiyor. Defteri yıldızlı kâğıda sarmamızı istedi. Bir yıldız tam kat yerine gelsin istiyor, böylece iki yüzünde de birer yarısı görünecek.',
    ),
    [
      order(
        t('Сначала положи блокнот на бумагу. Потом заверни края и только после этого затяни ленту.', 'Önce defteri kâğıdın üstüne koy. Sonra kenarları katla. Kurdeleyi en son bağla.'),
        [t('Положить блокнот', 'Defteri yerleştir'), t('Завернуть края', 'Kenarları katla'), t('Завязать ленту', 'Kurdeleyi bağla')],
        t('Бумага держится на ленте. На сгибе осталось место для нашей звезды.', 'Kurdele kâğıdı tutuyor. Kat yerinde yıldızımız için boşluk kaldı.'),
      ),
      cue(
        t('Я совмещаю штамп со сгибом. Поставь звезду, когда загорится зона сигнала.', 'Damgayı kat yerine hizalıyorum. İşaret alanı aydınlanınca yıldızı bas.'),
        t('Поставить штамп', 'Damgayı bas'),
        t('Звезда легла точно на сгиб. Повернёшь блокнот — и видно вторую половинку.', 'Yıldız tam kat yerine geldi. Defteri çevirince öbür yarısı görünüyor.'),
      ),
    ],
    t('Куда добавим пожелание друга?', 'Arkadaşının dileğini nereye yazalım?'),
    [
      end(t('Рядом со звездой', 'Yıldızın yanına'), t('На бумаге появляется фраза «Пиши, когда захочешь». Открывая подарок, друг отрезает звезду и оставляет её как закладку.', 'Kâğıda “Ne zaman istersen yaz” cümlesi geliyor. Arkadaşı hediyeyi açarken yıldızı kesip kitap ayracı olarak saklıyor.')),
      end(t('Внутрь блокнота', 'Defterin içine'), t('Я прячу записку с адресом под обложку. Друг находит её и пишет первый ответ в том самом блокноте.', 'Adresin yazılı olduğu notu kapağın içine saklıyorum. Arkadaşı notu bulup ilk cevabını o deftere yazıyor.')),
    ],
  ),

  story(
    'city-153',
    t('Юбин', 'Yubin'),
    t('Рукав для взмаха', 'Kolunu kaldırabileceğin ceket'),
    t(
      'В Narea Atelier я примеряю танцору куртку для сцены. Стоит поднять руку, и рукав тянет за плечо. Добавим под мышку кусочек ткани, который будет растягиваться при взмахе.',
      'Narea Atelier’de bir dansçıya sahne ceketini giydirip provasını yapıyorum. Kolunu kaldırınca ceket omzunu çekiyor. Koltuk altına kol kalktığında esneyecek bir kumaş parçası ekleyelim.',
    ),
    [
      find(
        t('Кусочек должен тянуться и возвращаться на место. Какой материал мне подать?', 'Parça gerilip eski hâline dönebilmeli. Bana hangi kumaşı uzatırsın?'),
        [t('Мягкий эластичный трикотаж', 'Yumuşak, esnek örme kumaş'), t('Плотный жёсткий холст', 'Kalın, sert bez'), t('Нерастяжимая лента', 'Esnemeyen şerit')],
        0,
        t('Трикотаж тянется вместе с рукой. Я заложила его под рукав и отметила края.', 'Örme kumaş kolla birlikte esniyor. Parçayı kolun altına yerleştirip kenarlarını işaretledim.'),
      ),
      order(
        t('Как проверим вставку? Сначала я прихвачу её стежками. Потом танцор поднимет руку, а если ему удобно, я закреплю шов.', 'Parçayı nasıl kontrol edelim? Önce birkaç dikişle tutturacağım. Sonra dansçı kolunu kaldıracak. Rahatsa dikişi sağlamlaştıracağım.'),
        [t('Прихватить вставку', 'Parçayı geçici olarak tuttur'), t('Проверить взмах', 'Kol hareketini dene'), t('Закрепить шов', 'Dikişi sağlamlaştır')],
        t('Теперь рука легко поднимается над головой. Вставки почти не видно, пока танцор не сделает взмах.', 'Kol artık rahatça başın üstüne kalkıyor. Dansçı kolunu kaldırana kadar kumaş parçası neredeyse görünmüyor.'),
      ),
    ],
    t('Что сделаем со вставками на остальных куртках?', 'Diğer ceketlere bu parçayı nasıl ekleyelim?'),
    [
      end(t('Выбрать яркий цвет', 'Canlı renk seçelim'), t('При каждом взмахе у всей группы под рукавами мелькает бирюза. Хореограф оставляет для этого движения целую паузу.', 'Grup kollarını her kaldırdığında ceketlerin altından turkuaz parlıyor. Koreograf bu hareket için müzikte bir durak ayırıyor.')),
      end(t('Подобрать цвет куртки', 'Ceketle aynı renk olsun'), t('Вставки сливаются с куртками. На сцене видны высокие взмахи, а у группы остаётся прежний рисунок костюмов.', 'Parçalar ceketlerle aynı renk olduğu için uzaktan göze batmıyor. Sahnede kollar yükseğe kalkıyor, kostümlerin görünümü de korunuyor.')),
    ],
  ),

  story(
    'city-154',
    t('Хаюн', 'Hayun'),
    t('Все в одном кадре', 'Herkes aynı karede'),
    t(
      'В Hanpyeon Photo три подруги хотят снимок после школьного матча. На пробе кадр обрезал колёса кресла и часть мяча. Подруги просят оставить в кадре всё, с чем пришли.',
      'Hanpyeon Photo’da üç arkadaş okul maçından sonra fotoğraf çektirmek istiyor. Deneme karesinde tekerlekli sandalyenin tekerlekleriyle topun bir kısmı kesilmiş. Yanlarında ne varsa kareye sığmasını istiyorlar.',
    ),
    [
      dial(
        t('Ширина кадра сейчас 4 деления. На пробном экране видно, что нужно ещё 3. Выставь новую ширину.', 'Karenin genişliği şu anda 4 kademe. Deneme ekranında 3 kademe daha gerektiği görünüyor. Yeni genişliği ayarla.'),
        7,
        t('В кадре теперь все три подруги, колёса и мяч целиком. Они выравниваются по полосе на полу.', 'Artık üç arkadaş, tekerlekler ve topun tamamı kadrajda. Yerdeki çizgiye göre yan yana duruyorlar.'),
      ),
      cue(
        t('Подруги поднимут мяч над головами. Сделай снимок, когда загорится зона сигнала.', 'Arkadaşlar topu başlarının üstüne kaldıracak. İşaret alanı aydınlanınca fotoğrafı çek.'),
        t('Снять кадр', 'Fotoğrafı çek'),
        t('На снимке мяч прямо над ними, а на полу видны следы от игры. Ни одна деталь не обрезана.', 'Fotoğrafta top tam üstlerinde, yerde de maçın izleri görünüyor. Her şey kareye sığdı.'),
      ),
    ],
    t('Как напечатаем этот кадр?', 'Bu kareyi nasıl basalım?'),
    [
      end(t('Один снимок команде', 'Takıma tek büyük fotoğraf'), t('Большой снимок висит в зале рядом с расписанием. Под ним команда пишет счёт матча.', 'Büyük fotoğraf salonda programın yanına asılıyor. Takım altına maçın skorunu yazıyor.')),
      end(t('По снимку каждой', 'Her birine bir fotoğraf'), t('Печатаю три копии. Подруги подписывают их друг другу, и каждая уносит домой свою.', 'Üç kopya basıyorum. Arkadaşlar birbirlerinin fotoğraflarına not bırakıyor. Her biri kendi kopyasını eve götürüyor.')),
    ],
  ),

  story(
    'city-155',
    t('Ёнхи', 'Yeonhee'),
    t('Две роли одной косы', 'Bir örgü, iki rol'),
    t(
      'В Gaji Salon Айлин готовится сыграть путешественницу и королеву в одном спектакле. Между сценами у неё всего минута. Сделаем такую косу, которую можно превратить в причёску королевы прямо за кулисами.',
      'Gaji Salon’da Aylin aynı oyunda hem gezgini hem kraliçeyi oynamaya hazırlanıyor. İki sahne arasında yalnızca bir dakikası var. Kulis arkasında kraliçe saçına dönüşebilecek bir örgü yapalım.',
    ),
    [
      find(
        t('Для путешествия нужна коса за спиной, для короны — коса, свёрнутая в низкий пучок. С какой причёски начнём?', 'Gezginin sırtında sarkan bir örgü, tacın altında da enseye toplanmış bir örgü gerekiyor. Hangi saçla başlayalım?'),
        [t('Распущенные волосы', 'Açık saç'), t('Одна длинная коса', 'Tek uzun örgü'), t('Высокий пучок без косы', 'Örgüsüz yüksek topuz')],
        1,
        t('Коса готова. Айлин мотает головой, и волосы больше не лезут в глаза во время бега по сцене.', 'Örgü hazır. Aylin başını sallıyor. Sahnede koşarken saçları artık gözüne gelmeyecek.'),
      ),
      order(
        t('На быстрой смене сперва свернём косу в пучок. Закрепим её шпильками, а корону наденем в самом конце.', 'Hızlı değişimde önce örgüyü topuz yapacağız. Tokalarla tutturup tacı en sonda takacağız.'),
        [t('Свернуть косу', 'Örgüyü topuz yap'), t('Закрепить шпильками', 'Tokalarla tuttur'), t('Надеть корону', 'Tacı tak')],
        t('Корона свободно садится над пучком. Мы успели до второй реплики за кулисами.', 'Taç topuzun üstüne rahatça oturdu. Kuliste ikinci replik duyulmadan yetiştik.'),
      ),
    ],
    t('Как Айлин будет менять причёску на спектакле?', 'Aylin oyun günü saçını nasıl değiştirsin?'),
    [
      end(t('Научить Айлин', 'Aylin’e öğretelim'), t('Айлин тренируется перед зеркалом без моей помощи. На спектакле она сама выходит королевой как раз к своей реплике.', 'Aylin ayna karşısında yardımım olmadan çalışıyor. Oyunda kraliçe olarak tam repliği sırasında sahneye çıkıyor.')),
      end(t('Устроить место в кулисах', 'Kuliste yer hazırlayalım'), t('На полке за сценой лежат шпильки и корона в нужном порядке. Костюмер ждёт Айлин с готовыми шпильками и помогает закрепить пучок.', 'Sahne arkasındaki rafta tokalarla taç sırayla duruyor. Kostüm görevlisi tokalar elinde Aylin’i bekliyor ve topuzu tutturmasına yardım ediyor.')),
    ],
  ),

  story(
    'city-156',
    t('Соа', 'Soa'),
    t('Узоры на крышках', 'Kapaklardaki desenler'),
    t(
      'В Seol Beauty покупательница попросила метки для похожих коробочек. В сумке она различает вещи на ощупь, а крышки здесь совсем одинаковые. Проверим, какие узоры можно узнать пальцами.',
      'Seol Beauty’de bir müşteri birbirine benzeyen kutulara işaret koymamızı istedi. Çantasındaki eşyaları dokunarak ayırt ediyor ama buradaki kapaklar hep aynı. Hangi desenlerin dokunarak tanınabildiğine bakalım.',
    ),
    [
      find(
        t('Метка должна ощущаться пальцами. Какие наклейки подойдут?', 'İşaret parmakla hissedilmeli. Hangi etiketler işimize yarar?'),
        [t('Рисунки под гладкой плёнкой', 'Düz filmin altındaki desenler'), t('Выпуклые круги и полоски', 'Kabartmalı daireler ve çizgiler'), t('Названия на плоской бумаге', 'Düz kâğıda basılı isimler')],
        1,
        t('Круг и полоску легко различить пальцами. Покупательница тянется в сумку и находит нужную коробочку на ощупь.', 'Daireyle çizgiyi parmakla ayırt etmek kolay. Müşteri bakmadan elini çantasına atıp aradığı kutuyu buluyor.'),
      ),
      dial(
        t('У нас 3 пары коробочек для примерки меток. На каждую коробочку нужна одна наклейка. Сколько приготовим?', 'İşaretleri denemek için 3 çift kutumuz var. Her kutuya bir etiket gerekiyor. Kaç tane hazırlayalım?'),
        6,
        t('Каждая коробочка получила метку. В каждой паре одну отмечает круг, другую — полоска.', 'Her kutunun artık bir işareti var. Her çiftin biri daireli, öbürü çizgili.'),
      ),
    ],
    t('Куда пристроим набор меток после пробы?', 'Denemeden sonra işaretleri nasıl kullanalım?'),
    [
      end(t('Положить у кассы', 'Kasaya koyalım'), t('У кассы появляется лист выпуклых наклеек. Теперь покупатели сами выбирают метки для своих коробочек.', 'Kasaya kabartmalı bir etiket kâğıdı koyuyorum. Artık müşteriler kendi kutuları için işaret seçebiliyor.')),
      end(t('Сделать витрину на ощупь', 'Dokunma köşesi yapalım'), t('На низкой полке ставлю три пары коробочек. Посетители с закрытыми глазами ищут полоски, проводя пальцами по крышкам.', 'Alçak rafa üç çift kutu koyuyorum. Ziyaretçiler gözlerini kapatıp kapaklara dokunarak çizgileri arıyor.')),
    ],
  ),

  story(
    'city-157',
    t('Кёнсу', 'Gyeongsu'),
    t('Первые следы на экране', 'Perdedeki ilk izler'),
    t(
      'Сегодня в Wolbit Cinema показываем короткий фильм о первом снеге в нашем квартале. Дети сами сняли его на одну камеру, а три части сохранились под похожими именами. Поможешь собрать фильм к сеансу?',
      'Bugün Wolbit Cinema’da mahallemize düşen ilk karı anlatan kısa bir film gösteriyoruz. Çocuklar filmi tek kamerayla çekmiş ama üç bölümü birbirine benzeyen adlarla kaydetmiş. Gösterimden önce filmi birleştirmeme yardım eder misin?',
    ),
    [
      order(
        t('Смотри по сюжету. Сначала двор ещё пуст, потом идёт снег. В конце сосед выходит и оставляет первые следы.', 'Olaylara göre sırala. Önce avlu boş. Sonra kar yağıyor. En sonda komşu dışarı çıkıp ilk ayak izlerini bırakıyor.'),
        [t('Пустой двор', 'Boş avlu'), t('Падает снег', 'Kar yağıyor'), t('Появляются следы', 'Ayak izleri beliriyor')],
        t('Теперь следы появляются только на снегу. Фильм можно показывать.', 'Artık ayak izleri kar yağdıktan sonra beliriyor. Film gösterime hazır.'),
      ),
      cue(
        t('Занавес поднимается. Запусти фильм, когда загорится зона сигнала.', 'Perde kalkıyor. İşaret alanı aydınlanınca filmi başlat.'),
        t('Начать показ', 'Gösterimi başlat'),
        t('Кадр пустого двора появляется на открытом экране. На первой снежинке зал замирает.', 'Boş avlu tamamen açılan perdede beliriyor. İlk kar tanesi düşünce salonda çıt çıkmıyor.'),
      ),
    ],
    t('Что устроим после сеанса для ребят, которые сняли фильм?', 'Filmden sonra filmi çeken çocuklar için ne düzenleyelim?'),
    [
      end(t('Беседа с ребятами', 'Çocuklarla söyleşi'), t('Ребята показывают камеру. Кто-то в зале спрашивает, как они ждали первых следов, и юный оператор признаётся, что сам попросил соседа выйти.', 'Çocuklar kamerayı gösteriyor. Seyircilerden biri ilk izleri nasıl beklediklerini soruyor. Küçük kameraman komşudan dışarı çıkmasını kendisinin istediğini söylüyor.')),
      end(t('Карта снежных мест', 'Karlı yerler haritası'), t('У выхода ребята раскладывают карту. Зрители отмечают дворы, где хотят снять следующий снег, и один двор выбрали сразу три человека.', 'Çocuklar çıkışa bir harita seriyor. Seyirciler bir sonraki karı çekmek istedikleri avluları işaretliyor. Bir avluyu tam üç kişi seçiyor.')),
    ],
  ),

  story(
    'city-158',
    t('Ёнджэ', 'Yeongjae'),
    t('Тихий этаж', 'Sessiz kat'),
    t(
      'В Dawool Hotel скоро приедет танцевальная группа. После ночной дороги ребятам надо выспаться, но утром у нас будут катать тележки у лифта. Подберём им тихую комнату и настроим звонок.',
      'Dans grubu birazdan Dawool Hotel’e varacak. Gece yolculuğundan sonra uyumaları gerek ama sabah asansörün önünden el arabaları geçecek. Onlara sessiz bir oda bulup uyandırma araması ayarlayalım.',
    ),
    [
      find(
        t('Нужна комната вдали от лифта и уличного шума. Какую оставим для группы?', 'Asansörden ve sokak gürültüsünden uzak bir oda gerekiyor. Gruba hangisini ayıralım?'),
        [t('У лифта, окна во двор', 'Asansörün yanında, avluya bakıyor'), t('В конце коридора, окна на проспект', 'Koridorun sonunda, caddeye bakıyor'), t('В конце коридора, окна во двор', 'Koridorun sonunda, avluya bakıyor')],
        2,
        t('У комнаты во двор тихо. Двери лифта открываются на другом конце коридора.', 'Avluya bakan odanın çevresi sessiz. Asansör kapıları koridorun öbür ucunda açılıyor.'),
      ),
      dial(
        t('Группа попросила разбудить её через 7 часов после приезда. Через сколько часов назначим звонок?', 'Grup varışından 7 saat sonra uyandırılmayı istedi. Uyandırma aramasını kaç saat sonrasına kuralım?'),
        7,
        t('Звонок назначен на нужное время. У ребят остаётся полчаса до первой репетиции.', 'Arama doğru saate kuruldu. Grubun ilk provaya kadar yarım saati kalıyor.'),
      ),
    ],
    t('Что предложим группе на эти полчаса?', 'Gruba bu yarım saat için ne önerelim?'),
    [
      end(t('Завтрак с собой', 'Yanlarına kahvaltı verelim'), t('На стойке ждут пакеты с завтраком. Ребята выезжают пораньше и едят по пути в зал.', 'Resepsiyonda kahvaltı paketleri hazır. Ekip erkenden yola çıkıp salona giderken kahvaltı ediyor.')),
      end(t('Размяться в отеле', 'Otelde ısınsınlar'), t('Открываю пустой зал рядом со стойкой. Ребята размялись здесь и начали репетицию сразу с первого движения.', 'Resepsiyonun yanındaki boş salonu açıyorum. Ekip burada ısınıp provaya doğrudan ilk hareketle başlıyor.')),
    ],
  ),

  story(
    'city-159',
    t('Арам', 'Aram'),
    t('Подоконник для весны', 'Pencere önünde bahar'),
    t(
      'Учительница заглянула в Aram Flowers за цветами для трёх классов. Детям хочется самим ухаживать за ростками и дождаться цветов. Подготовим маленькие горшки, по два на каждый подоконник.',
      'Bir öğretmen üç sınıfa çiçek almak için Aram Flowers’a uğradı. Çocuklar filizlere kendileri bakıp açmalarını beklemek istiyor. Her pencere önüne iki küçük saksı hazırlayalım.',
    ),
    [
      dial(
        t('Есть три подоконника, на каждый ставим два горшка. Сколько горшков нужно взять с полки?', 'Üç pencere önü var. Her birine iki saksı koyacağız. Raftan kaç saksı alalım?'),
        6,
        t('На столе три пары горшков. На поддонах написали номера классов, чтобы пары доехали вместе.', 'Masada üç çift saksı var. Çiftler birlikte ulaşsın diye altlıklarına sınıf numaralarını yazdık.'),
      ),
      order(
        t('Подготовь каждый горшок. Сначала насыпь землю, затем посади луковицу, а потом полей, чтобы земля вокруг неё стала влажной.', 'Saksıları hazırla. Önce toprağı koy, ardından çiçek soğanını dik. Sonra soğanın etrafındaki toprağı nemlendirmek için sula.'),
        [t('Насыпать землю', 'Toprağı koy'), t('Посадить луковицу', 'Çiçek soğanını dik'), t('Полить землю', 'Toprağı sula')],
        t('Горшки готовы к поездке. Из одного уже выглядывает тонкий зелёный росток.', 'Saksılar yola çıkmaya hazır. Birinin içinden şimdiden incecik yeşil bir filiz görünüyor.'),
      ),
    ],
    t('Что предложим детям делать, пока они ждут цветов?', 'Çiçekler açana kadar çocuklara ne yapmalarını önerelim?'),
    [
      end(t('Рисовать ростки', 'Filizleri çizelim'), t('Дети каждую неделю рисуют свой росток. Когда появляется первый бутон, на стене уже целый ряд рисунков от зелёной точки до бутона.', 'Çocuklar her hafta kendi filizlerini çiziyor. İlk tomurcuk belirdiğinde duvarda yeşil bir noktadan tomurcuğa uzanan bir dizi resim var.')),
      end(t('Сделать график ухода', 'Bakım sırası oluşturalım'), t('Класс составляет дежурство. Дежурный проверяет землю перед поливом и передаёт следующему записку о том, как вырос росток.', 'Sınıf bir nöbet çizelgesi hazırlıyor. Nöbetçi sulamadan önce toprağa bakıyor ve filizin nasıl büyüdüğünü sıradaki arkadaşına not bırakıyor.')),
    ],
  ),

  story(
    'city-160',
    t('Соджун', 'Seojun'),
    t('Тень старого трамвая', 'Eski tramvayın gölgesi'),
    t(
      'В Munrae Gallery я собираю трамвай из обрезков металла. Рядом с лампой детали отбрасывают одну общую тень. Но на стене пока виден только вагон без остановки.',
      'Munrae Gallery’de metal parçalarından bir tramvay yapıyorum. Lambanın yanına koyunca parçalar duvara tek bir gölge düşürüyor. Ama şimdilik duvarda durağı olmayan bir vagon var.',
    ),
    [
      find(
        t('Над остановкой должна быть острая треугольная крыша. Какую деталь подставим к лампе?', 'Durağın sivri, üçgen bir çatısı olmalı. Lambanın önüne hangi parçayı koyalım?'),
        [t('Металлический круг', 'Metal daire'), t('Металлический треугольник', 'Metal üçgen'), t('Металлический полукруг', 'Metal yarım daire')],
        1,
        t('У трамвая появилась остановка. Осталось совместить её тень с нарисованным на стене тротуаром.', 'Tramvayın artık bir durağı var. Durağın gölgesini duvara çizdiğimiz kaldırımla hizalamak kaldı.'),
      ),
      cue(
        t('Я двигаю лампу вдоль стены. Зафиксируй её, когда загорится зона сигнала: в этот миг тень встанет точно на тротуар.', 'Lambayı duvar boyunca kaydırıyorum. İşaret alanı aydınlandığında lambayı sabitle. Tam o anda gölge kaldırıma oturacak.'),
        t('Закрепить лампу', 'Lambayı sabitle'),
        t('Тень остановки стоит на тротуаре. Посетители замечают, что трамвай будто подъехал к ней.', 'Durağın gölgesi kaldırımın üstünde. Ziyaretçiler tramvayın durağa yanaşmış gibi durduğunu fark ediyor.'),
      ),
    ],
    t('Что добавим к трамваю на выставке?', 'Sergide tramvayın yanına ne ekleyelim?'),
    [
      end(t('Рассказы о поездках', 'Yolculuk hikâyeleri'), t('Возле тени кладу карточки. На первой гость пишет, что в детстве считал остановки трамвая по запахам из пекарен.', 'Gölgenin yanına kartlar koyuyorum. İlk karta bir ziyaretçi, çocukken tramvay duraklarını fırın kokularından tanıdığını yazıyor.')),
      end(t('Город из новых теней', 'Yeni gölgelerden bir şehir'), t('Ставлю рядом вторую лампу. Посетители собирают тени домов из кусочков металла, и у трамвая появляется целый маршрут.', 'Yanına ikinci bir lamba koyuyorum. Ziyaretçiler metal parçalarıyla ev gölgeleri oluşturuyor. Tramvayın artık baştan sona bir güzergâhı var.')),
    ],
  ),
];
