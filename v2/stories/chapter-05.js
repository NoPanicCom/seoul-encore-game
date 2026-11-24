import {t, story, find, order, dial, cue, end} from './format.js';

export default [
  story('city-081', t('Юджин', 'Yujin'), t('Номер видно с любого столика', 'Numara Her Masadan Görünüyor'),
    t('В Jari Coffee я выкрикиваю номера готовых заказов. У кофемолки так шумно, что посетительница за дальним столиком уже дважды пропустила свой номер. Давай попробуем показывать номера на табло.',
      'Jari Coffee’de hazır siparişlerin numarasını seslenerek duyuruyorum. Kahve değirmeni o kadar gürültülü ki en uzaktaki masada oturan müşteri numarasını iki kez kaçırdı. Numaraları panoda göstermeyi deneyelim.'), [
      order(t('Подготовь номер до вызова. Сначала прочитай чек заказа, затем набери его номер на табло. После этого проверь, виден ли номер с дальнего столика.',
              'Siparişi duyurmadan önce numarayı hazırla. Önce fişi oku, sonra numarayı panoya gir. Ardından en uzaktaki masadan okunuyor mu, bak.'),
        [t('Прочитать чек', 'Fişi oku'), t('Набрать номер', 'Numarayı gir'), t('Проверить издалека', 'Uzaktan kontrol et')],
        t('Номер виден даже у дальней стены. Юджин оставляет пробу на экране, пока ставит чашку на поднос.', 'Numara en uzaktaki duvardan bile okunuyor. Yujin fincanı tepsiye koyarken panoda deneme görüntüsü duruyor.')),
      cue(t('Покажи номер на табло, когда бегунок дойдёт до метки готового подноса.', 'Gösterge hazır tepsi işaretine geldiğinde sipariş numarasını panoda göster.'),
        t('Показать номер', 'Numarayı göster'), t('Номер загорается, и посетительница сама приходит к стойке за чашкой.', 'Numara yanınca müşteri fincanını almak için kendi kendine tezgâha geliyor.')),
    ], t('Как напомнить посетителям смотреть на табло?', 'Müşterilere panoya bakmalarını nasıl hatırlatalım?'), [
      end(t('Напечатать на чеке', 'Fişe yaz'), t('Юджин добавляет на чек короткую подсказку. Новые гости узнают о табло сразу у кассы.', 'Yujin fişe kısa bir hatırlatma ekliyor. Yeni müşteriler panoyu daha kasadayken öğreniyor.')),
      end(t('Поставить карточки на столы', 'Masalara kart koy'), t('За каждым столиком теперь есть карточка со стрелкой к табло. Подсказку замечают даже друзья, которые пришли просто поговорить.', 'Her masada panoyu gösteren oklu bir kart var. Sadece sohbet etmek için uğrayan arkadaşlar bile işareti fark ediyor.')),
    ]),

  story('city-082', t('Хэсоль', 'Haesol'), t('След бумажной лодки', 'Kâğıt Kayığın İzi'),
    t('В Pyeonji Books сосед оставил записку для внучки между страницами сказки. Название он забыл, зато помнит красную лодку на обложке. Поможешь отыскать записку?',
      'Pyeonji Books’ta bir komşu, torununa yazdığı notu bir masal kitabının arasına bırakmış. Kitabın adını unutmuş ama kapağındaki kırmızı kayığı hatırlıyor. Notu bulalım mı?'), [
      find(t('На полке три книги про реку. Какая обложка подходит под описание?', 'Rafta nehirle ilgili üç kitap var. Hangi kapak tarife uyuyor?'),
        [t('Жёлтая лодка', 'Sarı kayık'), t('Красный мост', 'Kırmızı köprü'), t('Красная лодка', 'Kırmızı kayık')], 2,
        t('В сказке про лодку нашлась записка «Открой в день рождения». Сложим её обратно.', 'Kayığın masalından “Doğum gününde aç” yazılı bir not çıktı. Katlayıp yerine koyalım.')),
      order(t('Упакуй книгу вместе с запиской. Сначала спрячь записку в книгу, а имя надпиши снаружи, когда пакет уже закрыт.',
              'Kitabı notla birlikte paketle. Önce notu kitabın arasına koy. Paketi kapattıktan sonra dışına isim yaz.'),
        [t('Вложить записку', 'Notu yerleştir'), t('Закрыть пакет', 'Paketi kapat'), t('Написать имя', 'İsmi yaz')],
        t('Пакет подписан, а записка останется сюрпризом. Вот и подарок готов.', 'Paketin üstünde isim yazıyor, not ise sürpriz olarak kalıyor. Hediye hazır.')),
    ], t('Как внучка получит подарок?', 'Torunu hediyeyi nasıl alsın?'), [
      end(t('Вручить за столиком', 'Masada ver'), t('Хэсоль зовёт девочку к дедушке. Они сразу читают первую страницу вместе.', 'Haesol kızı dedesinin masasına çağırıyor. İlk sayfayı hemen birlikte okuyorlar.')),
      end(t('Устроить поиск', 'Hazine avı düzenle'), t('Дедушка рисует карту магазина, и внучка находит пакет за коробкой бумажных лодок.', 'Dedesi dükkânın krokisini çiziyor. Torunu paketi kâğıt kayık kutusunun arkasında buluyor.')),
    ]),

  story('city-083', t('Тхэо', 'Taeo'), t('Соло на мягких лапах', 'Yumuşak Patilerle Solo'),
    t('В Deung Dance я придумываю танец о коте, который заметил солнечное пятно. Пиксель только что подкрался к нему и прыгнул. Из его движений можно сделать танец.',
      'Deung Dance’ta güneş lekesini fark eden bir kedi hakkında dans hazırlıyorum. Piksel az önce lekeye sessizce yaklaşıp üstüne sıçradı. Hareketlerinden bir dans çıkarabiliriz.'), [
      order(t('Повтори движение Пикселя. Он сначала заметил пятно, потом подкрался к нему и только тогда прыгнул.',
              'Piksel’in hareketini canlandır. Önce lekeyi fark etti, sonra sessizce yaklaştı ve en son sıçradı.'),
        [t('Посмотреть на пятно', 'Lekeye bak'), t('Подкрасться', 'Sessizce yaklaş'), t('Прыгнуть', 'Sıçra')],
        t('Танцоры по очереди пробуют связку. Даже зритель без объяснений узнаёт в движениях кота.', 'Dansçılar hareketleri sırayla deniyor. İzleyenler hiç açıklama duymadan bir kediyi canlandırdıklarını anlıyor.')),
      cue(t('Дай знак к прыжку, когда указатель попадёт на метку после тихих шагов.', 'Sessiz adımlardan sonra gösterge işarete geldiğinde sıçrama işareti ver.'),
        t('Прыгнуть', 'Sıçra'), t('Танцоры приземляются мягко, и из-за кулис слышно короткое «мяу».', 'Dansçılar yere yumuşakça iniyor. Perde arkasından kısa bir “miyav” duyuluyor.')),
    ], t('Куда солнечное пятно уйдёт в финале танца?', 'Dansın sonunda güneş lekesi nereye gitsin?'), [
      end(t('Вдоль стены', 'Duvar boyunca'), t('Кот тянется за пятном лапой. Танцоры поднимают руки одну за другой, пока свет ползёт вверх.', 'Kedi patisini lekeye uzatıyor. Işık tırmandıkça dansçılar kollarını sırayla kaldırıyor.')),
      end(t('На середину пола', 'Zeminin ortasına'), t('Кот сворачивается клубком прямо в тёплом круге. Танцоры заканчивают номер лёжа, как спящие котята.', 'Kedi sıcak çemberin içinde kıvrılıyor. Dansçılar gösteriyi uyuyan yavru kediler gibi yere uzanarak bitiriyor.')),
    ]),

  story('city-084', t('Соми', 'Somi'), t('Первый заказ Эны', 'Ena’nın İlk Siparişi'),
    t('В Ujeong Kitchen Эна впервые сама заказала ужин для своей семьи. Она попросила неострый бульон для младшего брата и острый соус для взрослых. Я хочу показать ей, что услышала обе просьбы.',
      'Ujeong Kitchen’da Ena ilk kez ailesi için kendi başına yemek siparişi verdi. Küçük kardeşine acısız çorba, yetişkinlere acı sos istedi. İki isteğini de duyduğumu ona göstermek istiyorum.'), [
      find(t('Какую миску поставить перед младшим братом?', 'Küçük kardeşinin önüne hangi kâseyi koyalım?'),
        [t('Неострый бульон', 'Acısız çorba'), t('Бульон с чили', 'Acı biberli çorba'), t('Миску острого соуса', 'Bir kâse acı sos')], 0,
        t('Миска мальчика готова. Острый соус ждёт в отдельной соуснице.', 'Çocuğun kâsesi hazır. Acı sos ayrı bir soslukta bekliyor.')),
      order(t('Соми просит налить бульон поверх лапши. Убери миску с раздачи только после того, как нальёшь бульон.',
              'Somi çorbayı eriştenin üzerine dökmeni istiyor. Kâseyi servise ancak çorbayı döktükten sonra götür.'),
        [t('Положить лапшу', 'Erişteyi koy'), t('Налить бульон', 'Çorbayı dök'), t('Отнести к столу', 'Masaya götür')],
        t('Лапша уже в бульоне, а Эна показывает, куда поставить миску.', 'Erişte çorbanın içinde. Ena kâseyi nereye koyacağını gösteriyor.')),
    ], t('Как подадим острый соус взрослым?', 'Acı sosu yetişkinlere nasıl sunalım?'), [
      end(t('Поставить в середину', 'Ortaya koy'), t('Взрослые сами берут по ложке соуса. Эна первой пробует свой бульон и улыбается.', 'Yetişkinler istedikleri kadar sos alıyor. Ena çorbasını ilk yudumlayan kişi oluyor ve gülümsüyor.')),
      end(t('Подать каждому', 'Ayrı ayrı sun'), t('Соми ставит маленькие соусницы рядом со взрослыми. Освободившееся место в центре занимает большая тарелка на всех.', 'Somi yetişkinlerin yanına küçük sosluklar koyuyor. Masanın ortasında paylaşımlık büyük bir tabağa yer açılıyor.')),
    ]),

  story('city-085', t('Чхан', 'Chan'), t('Голос на второй стороне', 'İkinci Yüzdeki Ses'),
    t('В Jongno Records принесли пластинку хора моей мамы. На её конверте выцвели буквы, а я хочу услышать, как мама объявляет песню на стороне B.',
      'Jongno Records’a annemin korosunun plağını getirdiler. Kılıfındaki harfler silinmiş. B yüzünde annemin şarkıyı anons edişini duymak istiyorum.'), [
      find(t('Чхан нашёл в каталоге код «N17-B» для второй стороны. Найди ту же надпись на этикетке.',
             'Chan katalogda ikinci yüzün kodunu buldu. Etikette “N17-B” yazan yüzü seç.'),
        [t('N17-A · первая', 'N17-A · birinci'), t('N17-B · вторая', 'N17-B · ikinci'), t('N71-B · вторая', 'N71-B · ikinci')], 1,
        t('На нужной стороне сохранилась пометка «Хор». Чхан кладёт пластинку на проигрыватель.', 'Doğru yüzde “Koro” yazısı hâlâ duruyor. Chan plağı pikaba yerleştiriyor.')),
      cue(t('Опусти иглу на край пластинки, когда указатель скорости попадёт на метку.', 'Hız göstergesi işarete geldiğinde iğneyi plağın dış kenarına indir.'),
        t('Опустить иглу', 'İğneyi indir'), t('Слышно короткое шуршание, потом голос мамы Чхана называет песню.', 'Kısa bir hışırtının ardından Chan’ın annesinin sesi şarkının adını söylüyor.')),
    ], t('Кого первым позовём послушать?', 'Dinlemeye önce kimi çağıralım?'), [
      end(t('Маму Чхана', 'Chan’ın annesini'), t('Она приходит с дневником хора и показывает, где записала слова этой песни.', 'Koro defteriyle geliyor ve bu şarkının sözlerini yazdığı sayfayı gösteriyor.')),
      end(t('Участников хора', 'Korodakileri'), t('Хористы собираются в магазине, узнают вступление и вместе допевают припев.', 'Korodakiler dükkânda buluşuyor. Girişi tanıyıp nakaratı hep birlikte tamamlıyorlar.')),
    ]),

  story('city-086', t('Джинхо', 'Jinho'), t('Дождь для песни', 'Şarkıya Yağmur'),
    t('В Jumunjin Sound мы записываем песню о первом дне в Сеуле. Певица помнит, как капли стучали по козырьку автобусной остановки. У меня получился похожий звук на металлическом подносе.',
      'Jumunjin Sound’da Seul’deki ilk günü anlatan bir şarkı kaydediyoruz. Şarkıcı yağmurun otobüs durağının tentesinde çıkardığı sesi hatırlıyor. Metal tepsiyle o sese benzer bir ses buldum.'), [
      order(t('Сделаем одну запись дождя. Начни запись до первой капли, а останови после последней.',
              'Yağmuru tek seferde kaydedelim. İlk damladan önce kaydı başlat, son damladan sonra durdur.'),
        [t('Начать запись', 'Kaydı başlat'), t('Накапать на поднос', 'Tepsiye damlat'), t('Остановить запись', 'Kaydı durdur')],
        t('Слышно, как капли падают по одной. Теперь проверим, слышны ли поверх них слова.', 'Damlaların teker teker düştüğü duyuluyor. Şimdi şarkının sözleri damlaların arasından duyuluyor mu, bakalım.')),
      dial(t('Дождь играет на уровне 7. Для голоса он слишком громкий. Опусти звук дождя на 4 деления.',
             'Yağmurun seviyesi 7. Bu kadar yüksek olunca şarkının sözleri duyulmuyor. Yağmurun sesini 4 kademe kıs.'), 3,
        t('На уровне 3 слышно и дождь, и каждое слово. Певица кивает и просит оставить запись.', 'Seviye 3’te hem yağmur hem her kelime duyuluyor. Şarkıcı başını sallayıp bu kaydı saklamanı istiyor.')),
    ], t('Где в песне зазвучит дождь?', 'Yağmuru şarkının neresine koyalım?'), [
      end(t('Перед первым куплетом', 'İlk kıtadan önce'), t('Слушатели слышат остановку под дождём ещё до первой строчки.', 'Dinleyenler ilk dizeden önce kendilerini yağmurdaki durakta hissediyorlar.')),
      end(t('После последней строчки', 'Son dizeden sonra'), t('Голос стихает, а капли ещё немного звучат, будто автобус только что уехал.', 'Ses susuyor, damlalar bir süre daha duyuluyor. Sanki otobüs az önce kalkmış gibi.')),
    ]),

  story('city-087', t('Унби', 'Eunbi'), t('Хлеб для слепка', 'Baskı İçin Ekmek'),
    t('В Jindallae Bakehouse пришли ребята из кружка печати. Они хотят сделать бумажный оттиск с рельефной корочки. Я испекла пробную буханку с тремя надрезами-листочками.',
      'Baskı kulübündeki çocuklar Jindallae Bakehouse’a geldi. Ekmeğin kabarık kabuğundan kâğıda desen çıkarmak istiyorlar. Yaprak şeklinde üç kesiği olan bir deneme ekmeği yaptım.'), [
      find(t('На решётке остывают три буханки. Выбери ту, которую испекла Унби.',
             'Tel rafta üç ekmek soğuyor. Eunbi’nin bu iş için pişirdiği ekmeği seç.'),
        [t('Листочки из двух надрезов', 'İki yaprak kesiği'), t('Три надреза-звезды', 'Üç yıldız kesiği'), t('Три надреза-листочка', 'Üç yaprak kesiği')], 2,
        t('Нашлась буханка с листьями. Корочка остыла и уже не обожжёт пальцы.', 'Yapraklı ekmeği buldun. Soğuyan kabuk artık el yakmıyor.')),
      order(t('Перенеси узор на бумагу. Положи лист поверх корочки и заштрихуй его боком карандаша. Потом подними лист.',
              'Deseni kâğıda geçir. Kâğıdı kabuğun üstüne koy ve kalemin yanıyla boya. Ardından kâğıdı kaldır.'),
        [t('Накрыть корочку листом', 'Kabuğu kâğıtla ört'), t('Заштриховать лист', 'Kâğıdı kalemle boya'), t('Снять лист', 'Kâğıdı kaldır')],
        t('На бумаге проступили три листочка. Даже мелкие трещинки похожи на прожилки.', 'Kâğıtta üç yaprak belirdi. Küçük çatlaklar bile yaprak damarı gibi görünüyor.')),
    ], t('Куда ребята заберут свой первый оттиск?', 'Çocuklar ilk baskıyı nereye götürsün?'), [
      end(t('В альбом кружка', 'Kulübün albümüne'), t('Ребята вклеивают рисунок и рядом зарисовывают, как Унби надрезала тесто.', 'Çocuklar resmi albüme yapıştırıp yanına Eunbi’nin hamuru nasıl çizdiğini resmediyor.')),
      end(t('На витрину пекарни', 'Fırının vitrinine'), t('Унби выставляет рисунок рядом с буханками. Покупатели начинают искать на хлебе свои узоры.', 'Eunbi resmi ekmeklerin yanına koyuyor. Müşteriler kendi ekmeklerindeki desenleri aramaya başlıyor.')),
    ]),

  story('city-088', t('Мири', 'Miri'), t('Вступление для двоих', 'İki Kişilik Giriş'),
    t('В On Air Karaoke близнецы хотят спеть дуэтом, но оба вступают на полстроки раньше. Я могу добавить к их песне два тихих такта, чтобы они успели вдохнуть вместе.',
      'On Air Karaoke’de ikizler düet yapmak istiyor ama ikisi de sözlere yarım dize erken giriyor. Birlikte nefes alabilsinler diye şarkının başına iki hafif ölçü ekleyebilirim.'), [
      dial(t('В каждом вступительном такте 4 удара. Настрой, сколько ударов прозвучит за 2 такта.',
             'Girişte her ölçüde 4 vuruş var. 2 ölçü boyunca toplam kaç vuruş duyulacağını ayarla.'), 8,
        t('Восемь ударов помогают сосчитать вступление. Теперь оба знают, когда ждать первую строчку.', 'Sekiz vuruş girişi saymayı kolaylaştırıyor. Artık ikisi de ilk dizenin ne zaman başlayacağını biliyor.')),
      cue(t('Покажи близнецам, когда петь. Нажми в тот миг, когда бегунок дойдёт до метки первой строчки.',
            'İkizlere ne zaman söyleyeceklerini göster. İbre ilk dizenin işaretine geldiği anda dokun.'),
        t('Вступаем!', 'Başlıyoruz!'), t('Они одновременно поют первое слово, смеются и уже не теряют ритм.', 'İlk kelimeyi aynı anda söylüyorlar. Birlikte gülüp ritmi kaçırmadan devam ediyorlar.')),
    ], t('Как близнецы споют второй куплет?', 'İkizler ikinci kıtayı nasıl söylesin?'), [
      end(t('По строчке', 'Sırayla birer dize'), t('Каждый успевает услышать голос другого. В припеве они снова поют вместе.', 'İkisi de diğerinin sesini duyabiliyor. Nakaratta yeniden birlikte söylüyorlar.')),
      end(t('Главный голос и эхо', 'Ana ses ve yankı'), t('Первый поёт строчку, второй тихо повторяет последнее слово. На следующей строчке они меняются.', 'İlki dizeyi söylüyor, ikincisi son kelimeyi hafifçe tekrarlıyor. Sonraki dizede rolleri değişiyor.')),
    ]),

  story('city-089', t('Хёнсик', 'Hyeonsik'), t('Где тестовый звонок?', 'Deneme Zili Nerede?'),
    t('В Nulpum Electronics мы собираем беспроводной комплект для дворового кукольного театра. Режиссёр будет нажимать кнопку за ширмой, а ребята у занавеса должны услышать звонок.',
      'Nulpum Electronics’te mahalledeki kukla tiyatrosu için kablosuz zil hazırlıyoruz. Yönetmen perdenin arkasından düğmeye basacak, sahne perdesinin yanındaki çocuklar zili duyacak.'), [
      find(t('В этом наборе кнопка и коробочка с колокольчиком должны иметь один номер. На кнопке номер 4. Выбери коробочку.',
             'Bu sette düğmenin ve zil kutusunun numarası aynı olmalı. Düğmede 4 yazıyor. Uygun kutuyu seç.'),
        [t('Коробочка 3', '3 numaralı kutu'), t('Коробочка 5', '5 numaralı kutu'), t('Коробочка 4', '4 numaralı kutu')], 2,
        t('Номер совпал. Хёнсик ставит коробочку достаточно далеко, чтобы проверить, работает ли пара.', 'Numaralar eşleşti. Hyeonsik, ikilinin uzaktan çalıştığını görmek için kutuyu uzağa koyuyor.')),
      order(t('Проверь звонок по записке режиссёра. Сначала включи коробочку. Потом отойди за ширму и только там нажми кнопку.',
              'Zili yönetmenin notuna göre dene. Önce kutuyu aç. Sonra paravanın arkasına geç ve düğmeye orada bas.'),
        [t('Включить коробочку', 'Kutuyu aç'), t('Зайти за ширму', 'Paravanın arkasına geç'), t('Нажать кнопку', 'Düğmeye bas')],
        t('Из-за ширмы звонок сработал. Хёнсик слышит его там же, где встанут дети.', 'Paravanın arkasından basınca zil çaldı. Hyeonsik zili çocukların duracağı yerden duyuyor.')),
    ], t('Что добавим к звонку перед спектаклем?', 'Gösteriden önce zile ne ekleyelim?'), [
      end(t('Световой сигнал', 'Işıklı işaret'), t('Когда в зале шумно, ребята у занавеса замечают свет на коробочке.', 'Salon gürültülüyken perdenin yanındaki çocuklar kutunun ışığını görüyor.')),
      end(t('Тихий сигнал в наушник', 'Kulaklığa hafif bir ses'), t('Дежурный слышит звонок в наушнике и поднимает занавес в тишине.', 'Perde görevlisi zili kulaklığından duyuyor ve perdeyi sessizce açıyor.')),
    ]),

  story('city-090', t('Тасом', 'Dasom'), t('Корзина с рисунками', 'Resimli Sepet'),
    t('В Ire Market ребята собирают яблоки для прогулки класса. Младшие пока читают медленно, поэтому я нарисовала на корзинах знаки для каждой группы.',
      'Ire Market’te çocuklar sınıf gezisi için elma topluyor. Küçükler hâlâ yavaş okuyor. Bu yüzden her grubun sepetine bir işaret çizdim.'), [
      find(t('У команды «Клён» знак с листом, у команды «Озеро» — с волной. Найди корзину команды «Озеро».',
             'Akçaağaç takımının işareti yaprak. Göl takımınınki dalga. Göl takımının sepetini bul.'),
        [t('На боку лист', 'Yanında yaprak var'), t('На боку волна', 'Yanında dalga var'), t('На боку звезда', 'Yanında yıldız var')], 1,
        t('Команда находит свою корзину по волне и уже ставит её на стойку.', 'Takım kendi sepetini dalga işaretinden tanıyor ve tezgâha koyuyor.')),
      dial(t('В команде 5 детей и 2 взрослых. Сколько яблок положим, если каждому дать по одному?',
             'Takımda 5 çocuk ve 2 yetişkin var. Herkese bir elma vermek için sepete kaç elma koyalım?'), 7,
        t('Семь яблок на семерых. Самый младший пересчитывает их и кладёт сверху табличку с волной.', 'Yedi kişiye yedi elma. En küçükleri elmaları sayıp dalga kartını üste koyuyor.')),
    ], t('Как команда понесёт яблоки до парка?', 'Takım elmaları parka nasıl taşısın?'), [
      end(t('Передавать корзину', 'Sepeti sırayla taşı'), t('У светофоров ребята меняются. К парку каждый успел подержать свою корзину.', 'Çocuklar trafik ışıklarında sepeti el değiştiriyor. Parka varana kadar herkes sepeti bir kez taşıyor.')),
      end(t('Разложить по сумкам', 'Çantalara dağıt'), t('Каждый кладёт яблоко в свой рюкзак. Корзина остаётся в Ire Market для следующей команды.', 'Herkes elmasını kendi sırt çantasına koyuyor. Sepet bir sonraki takım için Ire Market’te kalıyor.')),
    ]),

  story('city-091', t('Сунхи', 'Sunhui'), t('Ливень на игровом поле', 'Oyun Alanında Sağanak'),
    t('В Saeum Arcade я придумала уровень про город, где после ливня переполнился пруд. Игрок должен отвести воду в пустой резервуар. Давай проверим, понятно ли, какую заслонку открывать.',
      'Saeum Arcade’de sağanak sonrası göleti taşan bir şehir için yeni bir bölüm tasarladım. Oyuncu suyu boş depoya yönlendirmeli. Hangi kapağın açılacağının anlaşılır olup olmadığına bakalım.'), [
      find(t('На карте у каждой заслонки нарисовано, куда потечёт вода. Выбери путь, где есть место для лишней воды.',
             'Haritada her kapağın suyu nereye götürdüğü çizilmiş. Fazla suyun sığacağı yolu seç.'),
        [t('В уже полный пруд', 'Zaten dolu gölete'), t('В пустой резервуар', 'Boş depoya'), t('На площадь', 'Meydana')], 1,
        t('Сунхи подсвечивает путь к резервуару. Сверху приближается следующая волна.', 'Sunhui depoya giden yolu aydınlatıyor. Yukarıdan yeni bir dalga yaklaşıyor.')),
      cue(t('Открой заслонку, когда волна дойдёт до метки на шкале.', 'Dalga göstergedeki işarete geldiğinde kapağı aç.'),
        t('Открыть заслонку', 'Kapağı aç'), t('Вода бежит по каналу в резервуар. На карте сразу становятся видны сухие дорожки вокруг пруда.', 'Su kanaldan depoya akıyor. Haritada göletin çevresindeki kuru yollar yeniden ortaya çıkıyor.')),
    ], t('На что город потратит собранную воду в следующем уровне?', 'Şehir sonraki bölümde biriken suyu ne için kullansın?'), [
      end(t('Полить городской сад', 'Şehir bostanını sula'), t('Открываются канавки между грядками. Когда вода доходит до последней грядки, на ней всходят первые ростки.', 'Tarhların arasındaki kanallar açılıyor. Su son tarha vardığında ilk filizler çıkıyor.')),
      end(t('Запустить водяное колесо', 'Su çarkını çalıştır'), t('Поток раскручивает колесо. Оно поднимает на мост флажок, и игроку открывается новый участок карты.', 'Akıntı çarkı döndürüyor. Çark köprünün bayrağını kaldırıyor ve haritanın yeni bir bölümü açılıyor.')),
    ]),

  story('city-092', t('Сэхён', 'Sehyeon'), t('Чашка с горой', 'Dağ Desenli Fincan'),
    t('В Hanga Gifts соседка оставила чашку для сестры, которая переехала из Сеула. На керамике она сама нарисовала гору, видную из их старого окна. Упакуем так, чтобы рисунок доехал целым.',
      'Hanga Gifts’te bir komşu, Seul’den taşınan kardeşine bir fincan bıraktı. Eski pencerelerinden görünen dağı seramiğe kendi çizmiş. Desen zarar görmeden ulaşsın diye fincanı iyi saralım.'), [
      order(t('Сначала заверни чашку в мягкую бумагу. Затем поставь свёрток в коробку и закрой крышку.',
              'Önce fincanı yumuşak kâğıda sar. Sonra kutuya yerleştirip kapağı kapat.'),
        [t('Завернуть чашку', 'Fincanı sar'), t('Положить в коробку', 'Kutuya koy'), t('Закрыть крышку', 'Kapağı kapat')],
        t('Чашка сидит плотно, стенок не касается. Сэхён приносит ленту для коробки.', 'Fincan kutuda oynamıyor ve kenarlara değmiyor. Sehyeon kutu için kurdele getiriyor.')),
      dial(t('На оборот вокруг коробки нужно 6 делений ленты, на узел ещё 3. Отмерь весь отрезок.',
             'Kutunun çevresine 6 birim, düğüme de 3 birim kurdele gerekiyor. İhtiyacın olan uzunluğu ayarla.'), 9,
        t('Девяти делений хватает на коробку и узел. Сэхён разглаживает бант.', 'Dokuz birim kutuya ve düğüme yetiyor. Sehyeon kurdeleyi düzeltiyor.')),
    ], t('Что положим под ленту?', 'Kurdelenin altına ne sıkıştıralım?'), [
      end(t('Фото старого окна', 'Eski pencerenin fotoğrafı'), t('Сестра ставит фото рядом с чашкой и узнаёт знакомый склон на рисунке.', 'Kardeşi fotoğrafı fincanın yanına koyuyor ve desendeki tanıdık yamacı görüyor.')),
      end(t('Две чистые открытки', 'İki boş kartpostal'), t('На первой сестра рисует вид из нового окна и шлёт в Сеул. Вторую оставляет для ответа.', 'Kardeşi ilk karta yeni penceresinden görünen manzarayı çizip Seul’e yolluyor. İkincisini cevap için ayırıyor.')),
    ]),

  story('city-093', t('Нагён', 'Nagyeong'), t('Манжета для соло', 'Solo İçin Kol Ağzı'),
    t('В Morae Atelier у куртки танцовщицы Рин оторвалась манжета. Рин скоро на сцену, и рукав должен свободно двигаться с рукой. У меня есть лоскуты на замену.',
      'Morae Atelier’de dansçı Rin’in ceketinin kol ağzı koptu. Rin az sonra sahneye çıkacak. Kol ağzını kolunu rahatça hareket ettirebileceği bir kumaşla onaralım.'), [
      find(t('Какой лоскут потянется вместе с рукавом?', 'Hangi parça kol hareket ettikçe esner?'),
        [t('Жёсткий фетр', 'Sert keçe'), t('Плотная парусина', 'Kalın branda'), t('Эластичный трикотаж', 'Esnek triko')], 2,
        t('Трикотаж растягивается и возвращается в форму. Рин сможет поднять руки над головой.', 'Triko esnedikten sonra eski şeklini alıyor. Rin ellerini başının üstüne kaldırabilecek.')),
      order(t('Проверь манжету до шитья. Сначала сметай её крупными стежками, затем попроси Рин подвигать рукой. После примерки пришей начисто.',
              'Dikmeden önce kol ağzını dene. Önce iri dikişlerle teyelle, sonra Rin’den kolunu oynatmasını iste. Provadan sonra kalıcı dikişi at.'),
        [t('Сметать манжету', 'Kol ağzını teyelle'), t('Проверить в движении', 'Hareket ederken dene'), t('Пришить начисто', 'Kalıcı dikişi at')],
        t('Шов выдержал взмах. Рин останавливается перед зеркалом и разглядывает новый край рукава.', 'Dikiş kol hareketine dayandı. Rin aynada kolun yeni ucuna bakıyor.')),
    ], t('Как оформим край рукава?', 'Kol ucunu nasıl bitirelim?'), [
      end(t('Прикрыть шов тесьмой', 'Dikişi şeritle ört'), t('Тесьма в тон скрывает шов, и на сцене внимание остаётся на движении Рин.', 'Ceketle aynı renkteki şerit dikişi örtüyor. Sahnede seyircinin gözü Rin’in hareketlerinde kalıyor.')),
      end(t('Вышить маленькое солнце', 'Küçük bir güneş işle'), t('Когда Рин поднимает руку в финале, над манжетой видно вышитое солнце.', 'Rin finalde kolunu kaldırınca kol ağzındaki işleme güneş görünüyor.')),
    ]),

  story('city-094', t('Ури', 'Uri'), t('Место у края кадра', 'Karenin Kenarındaki Yer'),
    t('В Dalkom Photo пришли братья Лу и Мин. Их сестра работает до вечера, а братья уже уезжают из города. Они хотят оставить ей место на общей фотографии.',
      'Lu ile Min kardeşler Dalkom Photo’ya geldi. Kız kardeşleri akşama kadar çalışıyor ama ikisi şehirden daha erken ayrılacak. Ortak fotoğrafta ona da yer bırakmak istiyorlar.'), [
      find(t('Как поставить братьев, чтобы сбоку поместился целый третий портрет?',
             'Yanda üçüncü bir portreye yer kalması için kardeşleri nasıl yerleştirelim?'),
        [t('Посадить обоих слева', 'İkisini de sola oturt'), t('Посадить у разных краёв', 'İki uca birer kişi oturt'), t('Посадить в центре', 'İkisini ortaya oturt')], 0,
        t('Оба лица слева. Справа остаётся пустое место шириной с отдельный портрет.', 'İki yüz de solda. Sağ tarafta tek kişilik bir portreye yetecek boşluk kaldı.')),
      cue(t('Сними кадр, когда обратный отсчёт дойдёт до метки. Лу и Мин успеют повернуться к камере.',
            'Geri sayım işarete ulaştığında fotoğrafı çek. Lu ile Min o zamana kadar kameraya dönebilecek.'),
        t('Снять', 'Fotoğraf çek'), t('Оба смотрят в объектив. Ури печатает снимок, и братья рисуют стрелку к пустому месту.', 'İkisi de objektife bakıyor. Uri fotoğrafı basıyor, kardeşler de boşluğa doğru bir ok çiziyor.')),
    ], t('Как сестра заполнит место?', 'Kız kardeşleri boş yeri nasıl doldursun?'), [
      end(t('Добавить своё фото', 'Kendi fotoğrafını eklesin'), t('Вечером сестра снимается у того же фона и вклеивает портрет рядом с братьями.', 'Akşam aynı fonun önünde fotoğraf çektirip portresini kardeşlerinin yanına yapıştırıyor.')),
      end(t('Нарисовать себя', 'Kendi resmini çizsin'), t('Сестра рисует себя в рабочем фартуке. Братья получают снимок, на котором сразу узнают её улыбку.', 'Kendini iş önlüğüyle çiziyor. Kardeşleri gelen fotoğrafta onun gülüşünü hemen tanıyor.')),
    ]),

  story('city-095', t('Хаын', 'Haeun'), t('Письмо в причёске', 'Saçtaki Mektup'),
    t('В Aria Salon кукольница Руми принесла главную героиню спектакля. По сюжету та прячет у себя в волосах письмо, а парик после гастролей весь спутался. Расчешем его на подставке.',
      'Kuklacı Rumi oyunun başkahramanını Aria Salon’a getirdi. Hikâyede kukla saçına bir mektup saklıyor ama turneden sonra peruğu birbirine dolaşmış. Peruğu standında tarayalım.'), [
      find(t('Хаын советует гребень с редкими зубьями, чтобы аккуратно разбирать пряди. Что возьмёшь?',
             'Haeun tutamları nazikçe açmak için geniş dişli tarak öneriyor. Hangisini alırsın?'),
        [t('Тонкий гребень с частыми зубьями', 'İnce ve sık dişli tarak'), t('Гребень с редкими зубьями', 'Geniş dişli tarak'), t('Зажим для волос', 'Saç klipsi')], 1,
        t('Гребень легко проходит по небольшому пучку. Теперь можно разобрать остальные пряди.', 'Tarak küçük bir tutamdan kolayca geçiyor. Kalan tutamları da açabilirsin.')),
      order(t('Закрепи парик на подставке. Распутай кончики, а к корням переходи после того, как кончики свободно расчёсываются.',
              'Peruğu standa sabitle. Önce uçlardaki düğümleri aç. Uçlar kolayca taranınca diplere geç.'),
        [t('Закрепить парик', 'Peruğu sabitle'), t('Распутать кончики', 'Uçları aç'), t('Расчесать у корней', 'Dipleri tara')],
        t('Парик расчёсан. Руми крутит куклой перед зеркалом и примеряет бумажное письмо.', 'Peruk tarandı. Rumi kuklayı aynanın karşısında döndürüp kâğıt mektubu nereye saklayacağını deniyor.')),
    ], t('В какой причёске спрячем письмо?', 'Mektubu hangi saç modeline saklayalım?'), [
      end(t('В круглом пучке', 'Yuvarlak topuzda'), t('Кукла распускает пучок в нужной сцене. Письмо падает прямо в её ладонь.', 'Kukla doğru sahnede topuzunu açıyor. Mektup doğruca avucuna düşüyor.')),
      end(t('Под лентой косы', 'Örgünün kurdelesinde'), t('Из-под ленты торчит уголок письма. Дети замечают тайник первыми и подсказывают актёру, куда смотреть.', 'Mektubun köşesi kurdelenin altından görünüyor. Saklandığı yeri önce çocuklar fark edip oyuncuya gösteriyor.')),
    ]),

  story('city-096', t('Минджу', 'Minju'), t('Румяна меняют цвет', 'Allığın Değişen Rengi'),
    t('В Maeum Beauty мы пробуем румяна на бумажном портрете для школьной сцены. Под жёлтой витринной лампой все образцы кажутся оранжевыми. Давай посмотрим, как они выглядят под белым светом.',
      'Maeum Beauty’de okul gösterisi için bir kâğıt portrede allık deniyoruz. Vitrinin sarı lambasında bütün örnekler turuncuya dönüyor. Beyaz ışıkta nasıl göründüklerine bakalım.'), [
      find(t('Какой образец нужно положить рядом с румянами, чтобы проверить, что свет выглядит белым?',
             'Işığın beyaz göründüğünü kontrol etmek için allığın yanına hangi örneği koyalım?'),
        [t('Белый картон', 'Beyaz karton'), t('Оранжевую салфетку', 'Turuncu peçete'), t('Розовую ткань', 'Pembe kumaş')], 0,
        t('На белом картоне сразу заметен жёлтый оттенок лампы, а Минджу включает вторую лампу.', 'Beyaz kartonda lambanın sarı tonu hemen belli oluyor. Minju ikinci lambayı açıyor.')),
      dial(t('Белый свет у второй лампы на делении 5. Сейчас регулятор на 9. Верни его на метку белого света.',
             'İkinci lambada beyaz ışık 5. kademede. Ayar şu anda 9’da. Beyaz ışık işaretine getir.'), 5,
        t('Картон снова белый. Теперь видно, что один из образцов персиковый, а другой розовый.', 'Karton yine beyaz görünüyor. Örneklerin birinin şeftali, diğerinin pembe tonu olduğu ortaya çıktı.')),
    ], t('Как покажем разницу ребятам из театра?', 'Tiyatrodaki çocuklara aradaki farkı nasıl gösterelim?'), [
      end(t('Два света на одном портрете', 'Bir portrede iki ışık'), t('Минджу включает лампы по очереди над одним рисунком. Дети сами замечают, как меняется оттенок.', 'Minju aynı resmin üzerinde lambaları sırayla açıyor. Çocuklar tonun nasıl değiştiğini kendileri fark ediyor.')),
      end(t('Карта оттенков для сцены', 'Sahne için renk kartı'), t('Минджу подписывает оба образца при белом свете. Ребята забирают карту и сверяют цвета на репетиции.', 'Minju iki örneği de beyaz ışıkta etiketliyor. Çocuklar kartı alıp provada renkleri karşılaştırıyor.')),
    ]),

  story('city-097', t('Кихён', 'Gihyeon'), t('Слова между кадрами', 'Karelerin Arasındaki Sözler'),
    t('В Shingu Cinema покажут немой фильм, который сняла местная школьница. В её копии пропала карточка с репликой, и без неё непонятно, почему герой ждёт дома. Режиссёр оставила текст в тетради.',
      'Shingu Cinema’da mahalleden bir öğrencinin çektiği sessiz film gösterilecek. Yazı kartlarından biri kayıp olduğu için kahramanın niye evde beklediği anlaşılmıyor. Yönetmen repliği defterine yazmış.'), [
      order(t('Подготовь новую карточку к показу. Перепиши реплику из тетради, вставь карточку в фильм и после этого проверь, успеваешь ли её прочесть.',
              'Gösteri için yeni bir yazı kartı hazırla. Repliği defterden kopyala, kartı filme ekle, sonra okumaya zaman yetip yetmediğini kontrol et.'),
        [t('Переписать реплику', 'Repliği kopyala'), t('Вставить карточку', 'Kartı filme ekle'), t('Прочесть на пробе', 'Denemede oku')],
        t('«Подожди, пока сойдёт туман». Карточка читается легко, и ожидание героя теперь понятно.', '“Sis dağılana kadar bekle.” Kart rahatça okunuyor. Kahramanın neden beklediği artık belli.')),
      cue(t('На показе запусти фрагмент с карточкой, когда указатель дойдёт до отметки на дорожке.', 'Gösterimde ibre film şeridindeki işarete geldiğinde yazı kartının olduğu bölümü başlat.'),
        t('Показать реплику', 'Repliği göster'), t('Зрители успевают прочитать просьбу, прежде чем герой садится ждать у окна.', 'Kahraman pencere önüne oturup beklemeye başlamadan seyirciler repliği okuyor.')),
    ], t('Чем сопроводим последние кадры?', 'Filmin son karelerine ne eşlik etsin?'), [
      end(t('Игрой на пианино', 'Piyano'), t('Кихён играет тихие ноты, пока герой смотрит в окно. Когда туман тает, мелодия поднимается выше.', 'Kahraman pencereden bakarken Gihyeon hafifçe piyano çalıyor. Sis dağılınca melodi yükseliyor.')),
      end(t('Звуками с улицы', 'Sokaktan sesler'), t('Сначала слышны только далёкие шаги, а с исчезновением тумана звенит велосипедный звонок.', 'Önce yalnızca uzaktaki ayak sesleri duyuluyor. Sis dağılınca bir bisikletin zili çalıyor.')),
    ]),

  story('city-098', t('Сонхо', 'Seongho'), t('Рейс на рассвете', 'Gün Doğmadan Servis'),
    t('Из Baram Hotel рано утром уезжает школьный оркестр. За ребятами приедет микроавтобус, а на улице льёт дождь. Помоги выбрать выход, чтобы инструменты остались сухими.',
      'Okul orkestrası sabah erkenden Baram Hotel’den ayrılacak. Çocukları minibüs alacak ama dışarıda yağmur bardaktan boşanırcasına yağıyor. Çalgıları ıslatmadan çıkabilecekleri kapıyı bulalım.'), [
      find(t('У какого выхода ребята смогут перенести футляры под крышей до самого автобуса?',
             'Hangi çıkışta çalgı kutularını minibüse kadar yağmur altında kalmadan taşıyabilirler?'),
        [t('Дверь с козырьком только над порогом', 'Yalnızca eşiği koruyan sundurmalı kapı'), t('Подъезд с крышей до бордюра', 'Çatısı kaldırıma kadar uzanan giriş'), t('Выход через открытый двор', 'Açık avludan geçen çıkış')], 1,
        t('Водитель подаёт автобус к крытому подъезду. Футляры в ожидании стоят на сухом полу.', 'Şoför minibüsü çatılı girişe yanaştırıyor. Çalgı kutuları kuru zeminde bekliyor.')),
      dial(t('В список первого рейса вошли 6 музыкантов и 2 сопровождающих. Внеси число мест для людей. Футляры поедут в багажнике.',
             'İlk servisin listesinde 6 müzisyen ve onlara eşlik eden 2 yetişkin var. Yolcular için kaç koltuk gerektiğini gir. Çalgı kutuları bagajda gidecek.'), 8,
        t('Сонхо отмечает восемь мест. Ребята спокойно грузят инструменты в багажник.', 'Seongho sekiz koltuğu işaretliyor. Çocuklar çalgılarını telaş etmeden bagaja yerleştiriyor.')),
    ], t('Чем займётся оркестр до отправления?', 'Orkestra hareket saatine kadar ne yapsın?'), [
      end(t('Позавтракать в холле', 'Lobide kahvaltı etsin'), t('Сонхо накрывает стол в холле. Ребята завтракают вместе перед дорогой.', 'Seongho lobide masayı hazırlıyor. Çocuklar yola çıkmadan önce birlikte kahvaltı ediyor.')),
      end(t('Записать прощание', 'Veda kaydı yapsın'), t('Оркестр записывает короткое голосовое спасибо и оставляет его команде отеля.', 'Orkestra kısa bir sesli teşekkür kaydedip otel ekibine bırakıyor.')),
    ]),

  story('city-099', t('Бом', 'Bom'), t('Розы ниже шахматного короля', 'Şahı Gizlemeyen Güller'),
    t('В Jangmi Flowers попросили розы для шахматного вечера. В прошлый раз высокий букет закрыл судьям край доски. Сделаем низкую композицию, чтобы все видели фигуры.',
      'Satranç akşamı için Jangmi Flowers’tan gül istediler. Geçen sefer uzun bir buket yüzünden hakemler tahtanın kenarını görememiş. Figürler görünsün diye alçak bir düzenleme yapalım.'), [
      dial(t('Король возвышается над столом на 8 делений. Верхушки роз должны быть на 2 деления ниже. Отметь их высоту от стола.',
             'Şahın masadan yüksekliği 8 birim. Güllerin uçları şahın tepesinden 2 birim aşağıda olmalı. Masadan yüksekliklerini işaretle.'), 6,
        t('Бом подбирает длину стеблей так, чтобы верхушки были на отметке 6. Король будет выше роз.', 'Bom sapların boyunu, güllerin uçları 6. işarete gelecek şekilde ayarlıyor. Şah güllerden yüksek olacak.')),
      order(t('Собери композицию. Сначала налей воду в низкую вазу, затем поставь розы. В конце проверь вид с судейского места.',
              'Düzenlemeyi hazırla. Önce alçak vazoya su koy, sonra gülleri yerleştir. En son hakemin oturduğu yerden tahtaya bak.'),
        [t('Налить воду', 'Su koy'), t('Поставить розы', 'Gülleri yerleştir'), t('Проверить вид', 'Görüşü kontrol et')],
        t('Даже с места судьи видно обе ладьи. Бом убирает с края доски один опавший лепесток.', 'Hakemin yerinden bile iki kale görünüyor. Bom tahtanın kenarına düşen bir gül yaprağını alıyor.')),
    ], t('Куда перенесём розы после партии?', 'Oyun bitince gülleri nereye taşıyalım?'), [
      end(t('К доске новичков', 'Yeni başlayanların masasına'), t('Первую партию за этой доской играют двое ребят, которые только сегодня выучили ход коня.', 'Bugün atın nasıl oynadığını öğrenen iki çocuk, güllerin yanındaki tahtada ilk oyunlarını oynuyor.')),
      end(t('К столу с чаем', 'Çay masasına'), t('За чаем игроки показывают друг другу свои любимые ходы на салфетках. Розы стоят между чашками.', 'Oyuncular çay içerken sevdikleri hamleleri peçetelere çizip gösteriyor. Güller fincanların arasında duruyor.')),
    ]),

  story('city-100', t('Мина', 'Mina'), t('Два слоя Сеула', 'Seul’ün İki Katmanı'),
    t('В Yurim Gallery я показываю один переулок в двух слоях. Утро я нарисовала на бумаге, а вечерние огни на прозрачном листе. Углы разъехались, и фонари теперь висят над крышами.',
      'Yurim Gallery’de bir ara sokağı iki katmanla gösteriyorum. Kâğıtta sabah, şeffaf yaprakta akşam ışıkları var. Köşeler kayınca sokak lambaları çatıların üstünde kalmış.'), [
      order(t('Восстанови картину. Сначала расправь рисунок утра. Затем наложи прозрачный вечер так, чтобы крестики совпали. В конце закрепи края.',
              'Resmi düzelt. Önce sabah çizimini düzleştir. Sonra şeffaf akşam katmanını çarpılar üst üste gelecek şekilde yerleştir. En son kenarları sabitle.'),
        [t('Расправить рисунок', 'Çizimi düzleştir'), t('Совместить крестики', 'Çarpıları hizala'), t('Закрепить края', 'Kenarları sabitle')],
        t('Крестики совпали. Фонари вернулись на тротуар, а свет из витрин лёг на мостовую.', 'Çarpılar üst üste geldi. Lambalar kaldırıma geri döndü, vitrinlerin ışığı yola düştü.')),
      cue(t('Для проверки включи подсветку, когда шкала попадёт на вечернюю метку.', 'Kontrol için gösterge akşam işaretine geldiğinde aydınlatmayı aç.'),
        t('Зажечь огни', 'Işıkları yak'), t('В переулке загораются витрины. В одном окне теперь легко заметить силуэт кота.', 'Ara sokağın vitrinleri aydınlanıyor. Bir penceredeki kedi silueti şimdi kolayca görülüyor.')),
    ], t('Чем дополним картину для посетителей?', 'Ziyaretçiler için resme ne ekleyelim?'), [
      end(t('Стол для рисунков', 'Çizim masası'), t('Посетители рисуют свой вечерний слой на кальке. К концу дня на столе лежит целая стопка разных переулков.', 'Ziyaretçiler aydıngere kendi akşam katmanlarını çiziyor. Günün sonunda masada farklı ara sokak çizimlerinden bir yığın oluşuyor.')),
      end(t('Карту переулка', 'Ara sokağın krokisi'), t('Мина кладёт рядом карту с отмеченными окнами. После выставки посетители идут искать переулок и сами проверяют, где был кот.', 'Mina pencereleri işaretlediği bir krokiyi resmin yanına koyuyor. Sergiden sonra ziyaretçiler sokağı bulup kedinin nerede durduğuna bakıyorlar.')),
    ]),
];
