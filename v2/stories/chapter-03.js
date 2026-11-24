import {t, story, find, order, dial, cue, end} from './format.js';

export default [
  // Boram Coffee
  story('city-041', t('Борам', 'Boram'), t('Круг на рисунке', 'Çizimdeki Halka'),
    t('По утрам Юри рисует у окна. Вчера холодный стакан оставил мокрый круг прямо на её рисунке, и я собираю для неё подставку.',
      'Yuri sabahları pencere kenarında resim yapıyor. Dün soğuk bardak çiziminin tam ortasında ıslak bir halka bıraktı. Ona bardak altlığı hazırlıyorum.'), [
    find(t('У подставки уже есть непромокаемое дно. Что сверху впитает капли?',
      'Altlığın tabanı su geçirmiyor. Üstteki damlaları hangi malzeme emer?'), [
      t('Кусок фольги', 'Alüminyum folyo'), t('Толстый войлок', 'Kalın keçe'), t('Прозрачный пластик', 'Şeffaf plastik'),
    ], 1, t('Войлок впитал воду, а под ним стол сухой. Юри раскрывает альбом.', 'Keçe suyu emdi, masa kuru kaldı. Yuri resim defterini açıyor.')),
    dial(t('Стакан Юри шириной 7 см, а слева и справа нужен запас по 1 см. Какой ширины вырезать подставку?',
      'Yuri’nin bardağı 7 cm genişliğinde. İki yanında da 1 cm pay bırak. Altlığı kaç cm genişliğinde keselim?'), 9,
    t('Стакан встал на подставку целиком. Юри дорисовала мост, и бумага осталась сухой.', 'Bardak altlığa tam oturdu. Yuri köprüyü tamamladı, kâğıt kuru kaldı.')),
  ], t('Придумала, что сделать с этой подставкой?', 'Bu altlığı nasıl kullanalım?'), [
    end(t('Подарить Юри', 'Yuri’ye hediye et'), t('Юри взяла подставку на выезд с альбомом. Теперь она может рисовать и за столиком у реки.', 'Yuri altlığı resim gezisine götürdü. Artık nehir kenarındaki masada da rahatça çizebiliyor.')),
    end(t('Оставить у окна', 'Pencere kenarında bırak'), t('Мы оставили подставку и бумагу у окна. Днём сосед с работы сел туда и нарисовал улицу.', 'Pencere kenarına altlığı ve kâğıt bıraktık. Öğleden sonra mahalleden biri oraya oturup sokağı çizdi.')),
  ]),

  // Munjang Books
  story('city-042', t('Мунджан', 'Munjang'), t('Маршрут складной карты', 'Katlanan Haritanın Rotası'),
    t('Хэсу принесла книгу о старом Сеуле, чтобы найти дом своей бабушки. Из книги выпала складная карта, а у нас их в ящике три.',
      'Haesu, büyükannesinin evini bulmak için eski Seul’ü anlatan bir kitap getirdi. Kitabın katlanır haritası düşmüş, çekmecemizde de üç harita var.'), [
    find(t('В книге написано, что у нужной карты синий мост рядом с мельницей. Какую возьмём?',
      'Kitapta haritada değirmenin yanında mavi bir köprü olduğu yazıyor. Hangisini alalım?'), [
      t('Синий мост у рынка', 'Pazarın yanında mavi köprü'), t('Красный мост у мельницы', 'Değirmenin yanında kırmızı köprü'), t('Синий мост у мельницы', 'Değirmenin yanında mavi köprü'),
    ], 2, t('Хэсу нашла дом на нужной карте. Осталось вернуть карту в книгу.', 'Haesu doğru haritada evi buldu. Şimdi haritayı kitaba geri koyabiliriz.')),
    order(t('Карта должна легко выниматься. Сначала сложи её по сгибам, затем приклей к обложке пустой кармашек и только потом вложи карту.',
      'Harita kolayca çıkabilsin. Önce kat izlerinden katla, sonra kapağa boş bir cep yapıştır ve en son haritayı içine koy.'), [
      t('Сложить карту', 'Haritayı katla'), t('Приклеить кармашек', 'Cebi yapıştır'), t('Вложить карту', 'Haritayı cebe koy'),
    ], t('Карта свободно входит в кармашек. Хэсу может брать книгу с собой.', 'Harita cebe rahatça giriyor. Haesu kitabı yanında götürebilir.')),
  ], t('Как Хэсу покажет бабушке, что нашла её дом?', 'Haesu büyükannesine evi bulduğunu nasıl göstersin?'), [
    end(t('Пройти маршрут вместе', 'Rotayı birlikte yürü'), t('Хэсу и бабушка прошли от мельницы до дома. У моста бабушка показала, где она училась ездить на велосипеде.', 'Haesu ve büyükannesi değirmenden eve kadar yürüdü. Büyükannesi köprünün yanında bisiklete binmeyi öğrendiği yeri gösterdi.')),
    end(t('Нарисовать открытку', 'Kartpostal çiz'), t('Хэсу нарисовала на открытке дом и мост. Бабушка дописала, кто жил в этом доме, и вернула открытку Хэсу.', 'Haesu kartpostala evi ve köprüyü çizdi. Büyükannesi o evde kimlerin yaşadığını yazıp kartı Haesu’ya geri verdi.')),
  ]),

  // Palpal Dance
  story('city-043', t('Суа', 'Sua'), t('Две дорожки в танце', 'Dansta İki Ayrı Yol'),
    t('Мы с Джину каждый раз сталкиваемся в одном месте танца. Я отметила дорожки на полу, чтобы мы могли разойтись в прыжке.',
      'Jinu’yla dansın hep aynı yerinde çarpışıyoruz. Sıçrayınca yollarımız ayrılabilsin diye yere iki çizgi çektim.'), [
    find(t('Мы стоим рядом. Джину прыгает вперёд по правой дорожке. Куда мне прыгнуть, чтобы мы приземлились рядом?',
      'Yan yana duruyoruz. Jinu sağ çizgide ileri sıçrıyor. Yan yana yere inmek için ben nereye sıçramalıyım?'), [
      t('Вперёд по левой', 'Sol çizgide ileri'), t('Вперёд по правой', 'Sağ çizgide ileri'), t('Назад по левой', 'Sol çizgide geri'),
    ], 0, t('Дорожки разные, и мы приземлились на одной линии. Осталось попасть в один счёт.', 'Ayrı çizgilerde aynı hizada yere indik. Şimdi sıçramayı aynı ana denk getirelim.')),
    cue(t('Джину начнёт прыжок по сигналу «Сейчас!». Нажми в тот же миг.', 'Jinu «Şimdi!» işaretiyle sıçrayacak. Tam o anda düğmeye bas.'),
      t('Прыгнуть вместе', 'Birlikte sıçra'), t('Мы оттолкнулись и приземлились одновременно. Теперь этот кусок танца можно показать.', 'Aynı anda sıçrayıp yere indik. Artık dansın bu kısmını gösterebiliriz.')),
  ], t('Как покажем этот прыжок?', 'Bu sıçrayışı nasıl gösterelim?'), [
    end(t('Станцевать для младших', 'Küçüklere canlı göster'), t('Дети повторили прыжок по двум линиям. Теперь у них получается первый танцевальный дуэт.', 'Çocuklar iki çizgide sıçramayı denedi. Artık ilk düetlerini yapabiliyorlar.')),
    end(t('Снять у зеркала', 'Aynanın önünde çek'), t('Мы сняли в зеркале, как ноги смещаются по дорожкам. Джину сохранил видео для следующей репетиции.', 'Ayakların çizgilerde nasıl ilerlediğini aynadan çektik. Jinu videoyu bir sonraki prova için sakladı.')),
  ]),

  // Eunha Kitchen
  story('city-044', t('Ынха', 'Eunha'), t('Меню, которое говорит картинками', 'Resimlerle Konuşan Menü'),
    t('Томас недавно поселился в Сеуле. Он хочет сам выбрать обед, но пока не умеет читать наше меню на корейском. Давай сделаем понятные карточки к блюдам.',
      'Thomas kısa süre önce Seul’e taşındı. Öğle yemeğini kendi seçmek istiyor ama Korece menümüzü henüz okuyamıyor. Yemeklere anlaşılır kartlar hazırlayalım.'), [
    find(t('Какая карточка показывает, что в блюде есть рис, грибы и морковь?',
      'Hangi kart yemekte pirinç, mantar ve havuç olduğunu gösteriyor?'), [
      t('Фото: сковорода и тарелка', 'Fotoğraf: tava ve tabak'), t('Рисунки: повар, ложка и печь', 'Çizimler: aşçı, kaşık ve fırın'), t('Рисунки: рис, грибы и морковь', 'Çizimler: pirinç, mantar ve havuç'),
    ], 2, t('Томас показал на карточку и назвал грибы по-корейски. Теперь ему нужно знать, на сколько человек эта порция.', 'Thomas kartı işaret edip mantarı Korece söyledi. Şimdi bir porsiyonun kaç kişilik olduğunu öğrenmek istiyor.')),
    dial(t('Одна большая порция этого риса рассчитана на двоих. Томас хочет две такие порции. Сколько человек сможем накормить? Поставь столько фигурок на карточку заказа.',
      'Bu pilavın büyük porsiyonu iki kişilik. Thomas iki büyük porsiyon istiyor. Kaç kişiye yeter? Sipariş kartına o kadar insan simgesi ekle.'), 4,
    t('Томас увидел четыре фигурки и сам заказал обед на свою семью.', 'Thomas dört kişi işaretini gördü ve ailesi için yemeği kendi sipariş etti.')),
  ], t('Где такие карточки пригодятся больше всего?', 'Bu kartlar en çok nerede işe yarar?'), [
    end(t('Дать меню на каждом столе', 'Her masaya bir menü koy'), t('За соседним столом девочка выбрала обед по картинкам. Брат помог ей прочесть название, и повар услышал их заказ.', 'Yan masada bir kız resimlerden yemeğini seçti. Ağabeyi yemeğin adını okumasına yardım etti, aşçı da siparişlerini duydu.')),
    end(t('Собрать меню у входа', 'Girişte bir menü hazırla'), t('Мы сделали доску с кармашками для карточек. Когда грибы закончились, я сняла карточку, и гости увидели, что ещё можно заказать.', 'Kartlar için cepli bir pano yaptık. Mantar bitince kartı kaldırdım, gelenler başka ne sipariş edebileceklerini gördü.')),
  ]),

  // Geuneul Records
  story('city-045', t('Ёнми', 'Yeongmi'), t('Не тот голос на пластинке', 'Plaktaki Tuhaf Ses'),
    t('Соль принесла пластинку, на которой поёт её тётя. Голос звучит неестественно медленно, и Соль думает, что пластинка испорчена.',
      'Sol, teyzesinin şarkı söylediği plağı getirdi. Ses tuhaf derecede yavaş çıkıyor. Sol plağın bozulduğunu düşünüyor.'), [
    find(t('На этикетке пластинки указано 45 оборотов в минуту. Сейчас стоит 33. Что проверим первым?',
      'Plağın etiketinde dakikada 45 devir yazıyor. Pikap şu anda 33’te. Önce neyi deneyelim?'), [
      t('Прибавить громкость', 'Sesi aç'), t('Поставить 33 оборота', '33 devre ayarla'), t('Поставить 45 оборотов', '45 devre ayarla'),
    ], 2, t('На 45 оборотах Соль узнала голос тёти. Прослушаем конец и бережно снимем иглу.', 'Sol, 45 devirde teyzesinin sesini tanıdı. Şarkının sonunu dinleyip iğneyi dikkatlice kaldıralım.')),
    cue(t('В конце дорожки появится «Сейчас!». Подними иглу рычажком по этому сигналу.',
      'Parça bitince «Şimdi!» işareti görünecek. O anda kolu kullanarak iğneyi kaldır.'), t('Поднять иглу', 'İğneyi kaldır'),
    t('Рычажок плавно поднял иглу. Соль положила пластинку в конверт.', 'Kol iğneyi yavaşça kaldırdı. Sol plağı kılıfına koydu.')),
  ], t('Соль хочет ещё послушать тётю. Что ей устроить?', 'Sol teyzesinin sesini yeniden duymak istiyor. Ona ne ayarlayalım?'), [
    end(t('Позвать тётю в магазин', 'Teyzesini dükkâna çağır'), t('Тётя пришла на прослушивание и рассказала, что в припеве ей подпевает её сестра. Соль узнала голос мамы.', 'Teyzesi dinlemeye geldi ve nakaratta kız kardeşinin ona eşlik ettiğini anlattı. Sol annesinin sesini de tanıdı.')),
    end(t('Проверить домашний проигрыватель', 'Evdeki pikabı kontrol et'), t('Соль нашла дома кнопку 45 и поставила пластинку на семейном ужине. Теперь она умеет менять скорость сама.', 'Sol evde 45 düğmesini bulup aile yemeğinde plağı çaldı. Artık hızı kendisi değiştirebiliyor.')),
  ]),

  // Muwon Sound
  story('city-046', t('Мувон', 'Muwon'), t('Слышно, где причал', 'İskele Nerede Duyuluyor?'),
    t('Ханыль записал море для звуковой карты школьной выставки. Я перепутал дорожки: в наушниках лодка слышна со стороны пляжа, хотя на карте причал справа.',
      'Haneul okul sergisinin sesli haritası için denizi kaydetti. Ses kanallarını karıştırdım. Haritada iskele sağda olsa da kulaklıkta tekne plaj tarafından duyuluyor.'), [
    find(t('Пляж слева, причал справа. Как развести по наушникам прибой с пляжа и мотор у причала?',
      'Plaj solda, iskele sağda. Plajın dalgalarını ve iskeledeki teknenin motorunu kulaklıkta hangi tarafa verelim?'), [
      t('Прибой слева, мотор справа', 'Dalga solda, motor sağda'), t('Прибой справа, мотор слева', 'Dalga sağda, motor solda'), t('Оба звука слева', 'İki ses de solda'),
    ], 0, t('В левом ухе прибой, в правом загудел мотор. Теперь Ханыль может рассказать, куда идти от причала.', 'Soldan dalga, sağdan motor sesi geldi. Haneul artık iskeleden nereye gidileceğini anlatabilir.')),
    dial(t('В пробной записи море на уровне 7 заглушает подсказку Ханыля. На его листке указано: снизь звук моря на 3 деления. Какое число выставить?',
      'Deneme kaydında 7. seviyedeki deniz sesi Haneul’un tarifini bastırıyor. Notunda deniz sesini 3 kademe kısman yazıyor. Kaça ayarlayalım?'), 4,
    t('Слышно и море, и путь к причалу. Ханыль дал карту и наушники первому посетителю.', 'Hem deniz hem iskele tarifi duyuluyor. Haneul haritayla kulaklığı ilk ziyaretçiye verdi.')),
  ], t('С чего посетителю начать прогулку по звуковой карте?', 'Ziyaretçi sesli haritadaki gezisine nereden başlasın?'), [
    end(t('Сначала послушать', 'Önce sesleri dinle'), t('Ханыль убрал карту, пока посетитель слушал. Услышав мотор справа, тот сам догадался, где причал, и нашёл его на карте.', 'Haneul ziyaretçi dinlerken haritayı kaldırdı. Ziyaretçi sağdan gelen motor sesinden iskeleyi tahmin edip haritada buldu.')),
    end(t('Отметить путь на карте', 'Rotayı haritada işaretle'), t('Посетитель проложил карандашом маршрут. Затем по рассказу Ханыля он нашёл короткий путь от пляжа к лодке и исправил линию.', 'Ziyaretçi kalemle bir rota çizdi. Haneul’un tarifini dinleyince plajdan tekneye daha kısa yolu bulup rotasını düzeltti.')),
  ]),

  // Mandeul Bakehouse
  story('city-047', t('Мандыль', 'Mandeul'), t('Последний противень уточек', 'Son Tepsideki Ördekler'),
    t('Класс Джиа заказал булочки в форме уточек. Для последнего противня тесто уже поделено, но на карточке заказа расплылось число.',
      'Jia’nın sınıfı ördek şeklinde çörek sipariş etti. Son tepsinin hamuru hazır ama sipariş kartındaki rakam okunmuyor.'), [
    dial(t('Класс заказал 10 булочек, а 4 уже в коробке. Сколько уточек нужно слепить для последнего противня?',
      'Sınıf 10 çörek istedi, kutuda 4 tane var. Son tepsi için kaç ördek yapalım?'), 6,
    t('Шесть порций лежат на столе. Джиа показывает на рисунке, как должен выглядеть утиный клюв.', 'Altı parça hamur masada. Jia çizimde ördek gagasının nasıl görünmesi gerektiğini gösteriyor.')),
    order(t('Сначала скатай туловище, затем прищипни клюв на готовой заготовке. На сформированной уточке отметь глаз.',
      'Önce gövdeyi yuvarla, sonra hazır gövdenin ucunu sıkıştırıp gagayı yap. Ördeğin şekli tamamlanınca gözünü ekle.'), [
      t('Скатать туловище', 'Gövdeyi yuvarla'), t('Сделать клюв', 'Gagayı yap'), t('Отметить глаз', 'Gözü ekle'),
    ], t('На противне шесть уточек. После выпечки их хватит всему классу.', 'Tepside altı ördek var. Pişince bütün sınıfa yetecek.')),
  ], t('Как Джиа подаст уточек классу?', 'Jia ördekleri sınıfa nasıl sunsun?'), [
    end(t('Собрать утиный пруд', 'Ördek göleti kur'), t('Джиа разложила уточек на подносе вокруг синей салфетки. Класс успел сфотографировать весь пруд до обеда.', 'Jia ördekleri mavi bir peçetenin çevresine dizdi. Sınıf öğle yemeğinden önce göletin fotoğrafını çekti.')),
    end(t('Разложить по пакетам', 'Ayrı ayrı paketle'), t('Джиа подписала пакеты и отложила два для ребят, которые сегодня не пришли. Они взяли свои булочки на следующий день.', 'Jia paketlere isim yazıp o gün gelmeyen iki arkadaşına da ayırdı. Onlar çöreklerini ertesi gün aldı.')),
  ]),

  // Hayan Bam Karaoke
  story('city-048', t('Хари', 'Hari'), t('Тихая песня в подарок', 'Hediye Bir Şarkı'),
    t('Юджин поёт поздравление бабушке, которая сегодня далеко. В первой записи караоке вставило громкие аплодисменты, и ласковые слова в конце потерялись.',
      'Yujin bugün uzakta olan büyükannesi için kutlama şarkısı söylüyor. İlk kayda karaoke yüksek bir alkış sesi ekledi. Yujin’in sondaki güzel sözleri duyulmadı.'), [
    find(t('Нужны голос и мелодия, чтобы послать запись бабушке. Какую кнопку нажать?',
      'Büyükannesine göndereceğimiz kayıtta Yujin’in sesiyle melodi duyulmalı. Hangi düğmeye basalım?'), [
      t('Пение со звуком зала', 'Salon efektli şarkı'), t('Только музыка', 'Yalnız müzik'), t('Голос и музыка без эффектов', 'Efektsiz ses ve müzik'),
    ], 2, t('Юджин слышит свои слова на пробе. Она хочет оставить маленькую паузу между песней и поздравлением.', 'Yujin denemede kendi sözlerini duyuyor. Şarkıyla kutlama sözlerinin arasında kısa bir boşluk bırakmak istiyor.')),
    dial(t('Для открытки осталось 9 секунд. Музыка затихает 3 секунды, а поздравление занимает 4. Сколько секунд тишины оставить между ними?',
      'Sesli kart için 9 saniye kaldı. Müziğin sönmesi 3, kutlama sözleri 4 saniye sürüyor. Araya kaç saniye sessizlik koyalım?'), 2,
    t('После паузы слышно каждое слово. Юджин улыбнулась: бабушка услышит, что она спела именно для неё.', 'Aradaki sessizlikten sonra her söz duyuluyor. Yujin gülümsedi. Büyükannesi şarkıyı özellikle onun için söylediğini duyacak.')),
  ], t('Как Юджин подарит бабушке запись?', 'Yujin kaydını büyükannesine nasıl hediye etsin?'), [
    end(t('Послать к завтраку', 'Kahvaltıya gönder'), t('Бабушка включила песню за чаем. В ответ она прислала Юджин запись, где сама напевает последний куплет.', 'Büyükannesi çay içerken şarkıyı açtı. Cevap olarak Yujin’e son kıtayı kendi söylediği bir kayıt gönderdi.')),
    end(t('Включить во время звонка', 'Görüşmede çal'), t('Юджин включила запись во время семейного звонка и увидела улыбку бабушки. Потом бабушка попросила её научить младшего брата припеву.', 'Yujin aile görüşmesi sırasında kaydı açıp büyükannesinin gülümsemesini gördü. Büyükannesi sonra küçük erkek kardeşine de nakaratı öğretmesini istedi.')),
  ]),

  // Sinho Electronics
  story('city-049', t('Синхо', 'Sinho'), t('Рисунок застрял в планшете', 'Çizim Tablette Kaldı'),
    t('Боми хочет распечатать рисунок для сценической афиши. Планшет заряжается от компьютера, но рисунок по этому кабелю не передаётся.',
      'Bomi sahne afişi için çizimini bastırmak istiyor. Tablet bilgisayardan şarj oluyor ama çizim kablodan aktarılmıyor.'), [
    find(t('У трёх кабелей одинаковые разъёмы. Какой подойдёт, чтобы передать рисунок?',
      'Üç kablonun ucu da aynı. Çizimi aktarmak için hangisi uygun?'), [
      t('«Только зарядка»', '«Yalnız şarj»'), t('«Подсветка разъёмов»', '«Işıklı uçlar»'), t('«Зарядка и передача данных»', '«Şarj ve veri aktarımı»'),
    ], 2, t('Компьютер увидел планшет, и папки открылись. Теперь можно сделать пробный отпечаток.', 'Bilgisayar tableti gördü ve klasörler açıldı. Artık deneme baskısı alabiliriz.')),
    order(t('Открой папку с рисунками на планшете. Скопируй рисунок и отправь на пробную печать копию с компьютера.',
      'Tablette çizim klasörünü aç. Çizimi bilgisayara kopyala ve deneme baskısı için bilgisayardaki kopyayı yazıcıya gönder.'), [
      t('Открыть папку рисунков', 'Çizim klasörünü aç'), t('Скопировать рисунок', 'Çizimi kopyala'), t('Напечатать копию', 'Kopyayı yazdır'),
    ], t('Рисунок остался на планшете, а у Боми в руках первый пробный отпечаток афиши.', 'Çizim tablette duruyor, Bomi de afişin ilk deneme baskısını elinde tutuyor.')),
  ], t('Что сделать с пробным отпечатком?', 'Deneme baskısını nasıl değerlendirelim?'), [
    end(t('Показать группе', 'Gruba göster'), t('На репетиции ребята увидели афишу и попросили дописать время сбора. Боми поправила файл до большого тиража.', 'Gruptakiler provada afişi görüp toplanma saatini de yazmasını istedi. Bomi toplu baskıdan önce dosyayı düzeltti.')),
    end(t('Проверить на витрине', 'Vitrinde dene'), t('Мы поставили отпечаток у окна. С улицы дата плохо читалась, и Боми сделала цифры крупнее.', 'Baskıyı vitrine koyduk. Tarih sokaktan zor okunuyordu. Bomi rakamları büyüttü.')),
  ]),

  // Sanho Market
  story('city-050', t('Санхо', 'Sanho'), t('Сухой вход в дождь', 'Yağmurda Kuru Bir Giriş'),
    t('После ливня вода с зонтов натекла прямо к кассе. Ара чуть не поскользнулась, и мы решили устроить место для мокрых зонтов у входа.',
      'Sağanakta şemsiyelerden akan su kasaya kadar ulaştı. Ara neredeyse kayıyordu. Girişte ıslak şemsiyelere bir yer ayırmaya karar verdik.'), [
    find(t('Что поставим у двери, чтобы капли с зонтов остались внутри ёмкости?', 'Şemsiyelerin suyu yere akmasın diye kapının yanına ne koyalım?'), [
      t('Подставку с цельным поддоном', 'Deliksiz tepsisi olan şemsiyelik'), t('Решётку без поддона', 'Altı tepsisiz ızgara'), t('Плетёную корзину с дырочками', 'Delikli hasır sepet'),
    ], 0, t('Вода с первого зонта собралась в поддоне. Осталось сделать вход удобным для всех.', 'İlk şemsiyeden damlayan su tepside toplandı. Şimdi girişi herkes için rahat hâle getirelim.')),
    order(t('Пока вход мокрый, сначала поставь табличку о скользком полу. Когда вытрешь лужу, положи коврик на сухое место.',
      'Giriş ıslakken önce kaygan zemin uyarısını koy. Su birikintisini sildikten sonra kuru yere paspası ser.'), [
      t('Поставить предупреждение', 'Uyarı levhasını koy'), t('Вытереть лужу', 'Su birikintisini sil'), t('Положить коврик', 'Paspası ser'),
    ], t('Ара вернулась и прошла до кассы по сухому полу.', 'Ara geri döndü ve kuru zeminden kasaya kadar yürüdü.')),
  ], t('Подставка уже работает. Что ещё пригодится соседям в дождь?', 'Şemsiyelik işe yaradı. Yağmurda mahalledekilere başka ne yardımcı olur?'), [
    end(t('Зонты на время', 'Ödünç şemsiye ver'), t('Мы поставили рядом два зонта для займа. Ара взяла один, дошла домой и вернула его на следующий день.', 'Yanına ödünç alınabilecek iki şemsiye koyduk. Ara birini alıp eve gitti ve ertesi gün geri getirdi.')),
    end(t('Место для сушки', 'Kurutma alanı aç'), t('Мы отвели угол под навесом для раскрытых зонтов. Соседи забрали их сухими после покупок.', 'Saçağın altında açık şemsiyeler için bir köşe ayırdık. Mahalledekiler alışverişten sonra şemsiyelerini kuru aldı.')),
  ]),

  // Chingu Arcade
  story('city-051', t('Джихо', 'Jiho'), t('Рекорд вдвоём', 'İki Kişilik Rekor'),
    t('У старого автомата две кнопки, но сегодня он считает только очки первого игрока. Поможешь проверить, сможет ли Минджэ сыграть с сестрой в одной команде?',
      'Eski oyun makinesinin iki düğmesi var ama bugün sadece birinci oyuncunun puanını sayıyor. Minjae’nin kız kardeşiyle aynı takımda oynayabilmesi için makineyi deneyelim mi?'), [
    order(t('Сначала включи тренировку. Значок второго игрока станет доступен, и тогда его можно добавить. Запусти раунд, когда появятся оба имени.',
      'Önce antrenman modunu aç. İkinci oyuncu işareti açılınca onu ekle. İki isim de görünür görünmez turu başlat.'), [
      t('Включить тренировку', 'Antrenman modunu aç'), t('Добавить второго игрока', 'İkinci oyuncuyu ekle'), t('Запустить раунд', 'Turu başlat'),
    ], t('На экране два имени. Теперь проверим, начисляет ли автомат очко второй кнопке.', 'Ekranda iki isim var. Şimdi ikinci düğmeye basınca puan yazıyor mu bakalım.')),
    cue(t('В тренировке мяч долетит до сетки по сигналу «Сейчас!». Нажми за второго игрока, чтобы поймать мяч.',
      'Antrenmanda top fileye ulaşınca «Şimdi!» işareti çıkacak. Topu yakalamak için o anda ikinci oyuncu adına düğmeye bas.'),
    t('Поймать мяч', 'Topu yakala'), t('У второго игрока появилась звезда. Минджэ зовёт сестру к автомату.', 'İkinci oyuncuya bir yıldız yazıldı. Minjae kız kardeşini makineye çağırıyor.')),
  ], t('Какой режим включим для Минджэ и его сестры?', 'Minjae ile kız kardeşi için hangi modu açalım?'), [
    end(t('Общая копилка очков', 'Ortak puan topla'), t('Брат с сестрой сложили свои очки и открыли уровень с двумя мячами. Они договорились следить каждый за своим.', 'Kardeşler puanlarını toplayıp iki toplu bölümü açtı. Her biri kendi topunu takip etmeye karar verdi.')),
    end(t('Дружеское соревнование', 'Dostça yarış'), t('Каждый играл за себя. Сестра выиграла с перевесом в одно очко, а Минджэ предложил на следующий раунд поменяться кнопками.', 'Herkes kendi puanı için oynadı. Kız kardeşi bir puan farkla kazandı. Minjae bir sonraki turda düğmelerini değiştirmeyi önerdi.')),
  ]),

  // Chorok Gifts
  story('city-052', t('Чорок', 'Chorok'), t('Звон из коробки', 'Kutudaki Çan'),
    t('Наыль выбрала керамический колокольчик для мамы, которая устраивает сад на балконе. Колокольчик перекатывается в коробке, и так его лучше не нести.',
      'Naeul, balkonda bahçe yapan annesine seramik bir çan seçti. Çan kutunun içinde yuvarlanıyor ve bu şekilde taşımak zor.'), [
    dial(t('В коробке 9 см свободной ширины, а колокольчик занимает 5 см. Сколько сантиметров вместе должны занять две боковые прокладки?',
      'Kutunun içi 9 cm genişliğinde, çan 5 cm yer kaplıyor. İki yandaki desteklerin toplamı kaç cm olmalı?'), 4,
    t('Две прокладки заполнили зазор. Теперь колокольчик не катается по коробке.', 'İki destek boşluğu doldurdu. Çan artık kutunun içinde yuvarlanmıyor.')),
    order(t('Привяжем открытку без клея. Продень ленту в отверстие открытки, оберни лентой закрытую коробку и завяжи бант.',
      'Kartı yapıştırmadan bağlayalım. Kurdeleyi kartın deliğinden geçir, kapalı kutunun etrafına dola ve fiyonk at.'), [
      t('Продеть ленту в открытку', 'Kurdeleyi karttan geçir'), t('Обвести лентой коробку', 'Kurdeleyi kutuya dola'), t('Завязать бант', 'Fiyonk at'),
    ], t('Открытку можно прочесть, не открывая коробку. Наыль готова её подписать.', 'Kutuyu açmadan kart okunabiliyor. Naeul kartı yazmaya hazır.')),
  ], t('Как Наыль предложит маме открыть подарок?', 'Naeul annesine hediyeyi nasıl açmasını söylesin?'), [
    end(t('Загадка на открытке', 'Karta bilmece yaz'), t('Наыль написала: «Я пою, когда дует ветер». Мама угадала и сразу нашла место у двери балкона.', 'Naeul «Rüzgâr esince şarkı söylerim» yazdı. Annesi bildi ve balkon kapısının yanında hemen bir yer buldu.')),
    end(t('Открыть вместе на балконе', 'Balkonda birlikte aç'), t('Наыль сама придержала коробку, пока мама вешала колокольчик среди горшков. Через минуту обе услышали первый звон.', 'Annesi çanı saksıların arasına asarken Naeul kutuyu tuttu. Bir dakika sonra ikisi de ilk tınıyı duydu.')),
  ]),

  // Geul Atelier
  story('city-053', t('Чжисон', 'Jiseon'), t('Карман для сценической куртки', 'Sahne Ceketine Bir Cep'),
    t('Наби потеряла запасную заколку между двумя номерами. На её сценической куртке нет кармана, а заколка всегда должна быть под рукой.',
      'Nabi iki gösteri arasında yedek tokasını kaybetti. Sahne ceketinde cep yok ama toka her an elinin altında olmalı.'), [
    find(t('Наби много прыгает на сцене. В каком кармане заколка не выпадет даже при прыжке?',
      'Nabi sahnede çok sıçrıyor. Hangi cepte toka sıçrarken bile düşmez?'), [
      t('Мелкий открытый карман', 'Sığ ve açık cep'), t('Карман на молнии', 'Fermuarlı cep'), t('Декоративный карман без мешочка', 'İçi olmayan süs cebi'),
    ], 1, t('Наби встряхнула пробный карман, и заколка осталась внутри. Найдём удобное место на куртке.', 'Nabi deneme cebini salladı. Toka içinde kaldı. Şimdi cekette elinin uzanacağı bir yer bulalım.')),
    order(t('Сначала мелом отметь место кармана. Приметай его по отметкам, чтобы проверить, достаёт ли Наби до молнии. После примерки пришей.',
      'Önce cebin yerini tebeşirle çiz. Nabi fermuara yetişebiliyor mu görmek için çizginin üzerinden teyelle. Provadan sonra cebi dik.'), [
      t('Разметить мелом', 'Tebeşirle işaretle'), t('Приметать карман', 'Cebi teyelle'), t('Пришить после примерки', 'Provadan sonra dik'),
    ], t('Наби достала заколку одной рукой. Свою куртку она сможет надеть уже сегодня.', 'Nabi tokayı tek eliyle çıkardı. Ceketini bu akşam giyebilecek.')),
  ], t('Каким будет карман на сцене?', 'Cep sahnede nasıl görünsün?'), [
    end(t('Прикрыть молнию клапаном', 'Fermuarı kapakla gizle'), t('Я добавила клапан из ткани куртки. Со сцены карман почти не виден, а Наби находит молнию на ощупь.', 'Ceketin kumaşından bir kapak ekledim. Cep sahneden neredeyse görünmüyor, Nabi fermuarı dokunarak buluyor.')),
    end(t('Подчеркнуть вышивкой', 'Nakışla belirginleştir'), t('Я вышила яркий полумесяц вокруг молнии. Теперь карман виден и в полумраке за кулисами.', 'Fermuarın çevresine parlak bir hilal işledim. Artık loş kuliste bile cep belli oluyor.')),
  ]),

  // Jinsim Photo
  story('city-054', t('Джинсим', 'Jinsim'), t('Как выросло бумажное сердце', 'Kâğıt Kalp Nasıl Büyüdü?'),
    t('Друзья Мины уезжают завтра в Пусан. Она хочет снять три кадра на память, чтобы в каждом бумажное сердце становилось всё больше.',
      'Mina’nın arkadaşları yarın Busan’a gidiyor. Hatıra için üç kare çekmek istiyor. Kâğıttan kalp her karede biraz daha büyüsün.'), [
    order(t('Разложи сердца для съёмки. Мина начнёт с самого маленького, а в каждом следующем кадре поднимет сердце побольше.',
      'Kalpleri çekim için sıraya diz. Mina en küçükle başlayacak ve her yeni karede daha büyük bir kalp kaldıracak.'), [
      t('Маленькое сердце', 'Küçük kalp'), t('Среднее сердце', 'Orta boy kalp'), t('Большое сердце', 'Büyük kalp'),
    ], t('Мина взяла сердца по порядку. Первые два кадра готовы, а перед третьим друзья хотят спрятаться за большим сердцем.', 'Mina kalpleri sırayla aldı. İlk iki kare hazır. Üçüncüde arkadaşları büyük kalbin arkasına saklanmak istiyor.')),
    cue(t('Когда все спрячутся за сердцем, появится «Сейчас!». Сделай последний снимок, пока никто не выглянул.',
      'Herkes kalbin arkasına gizlenince «Şimdi!» işareti çıkacak. Kimse başını uzatmadan son kareyi çek.'),
    t('Сделать снимок', 'Fotoğrafı çek'), t('В последнем кадре сердце заняло весь экран. На ленте получилась маленькая история из трёх кадров.', 'Son karede kalp bütün ekranı kapladı. Fotoğraf şeridinde üç karelik küçük bir hikâye oluştu.')),
  ], t('Что сделаем с тремя снимками?', 'Üç fotoğrafı nasıl değerlendirelim?'), [
    end(t('Напечатать каждому по ленте', 'Herkese bir şerit bas'), t('Каждый забрал полную историю. Один друг прикрепил ленту к чемодану и показал её Мине на вокзале.', 'Herkes üç kareyi de aldı. Arkadaşlarından biri şeridi bavuluna iliştirip istasyonda Mina’ya gösterdi.')),
    end(t('Сделать общую открытку', 'Ortak kartpostal yap'), t('Мина наклеила кадры на открытку. Друзья подписали её и оставили Мине, чтобы после отъезда у неё было их послание.', 'Mina kareleri bir kartpostala yapıştırdı. Arkadaşları kartı imzalayıp gittikten sonra okuması için Mina’ya bıraktı.')),
  ]),

  // Hanat Salon
  story('city-055', t('Сонхи', 'Seonhui'), t('Косы под наушниками', 'Kulaklığın Altındaki Örgüler'),
    t('Йона записывает вокал после стрижки. На прошлой записи объёмные заколки под ободком наушников давили ей на голову.',
      'Yeona saçını kestirdikten sonra vokal kaydına gidecek. Son kayıtta iri tokaları kulaklığın bandının altında başına baskı yaptı.'), [
    find(t('Йона хочет убрать волосы от лица, а наушники будут плотно сидеть на голове. Что подойдёт для записи?',
      'Yeona saçını yüzünden toplamak istiyor. Kulaklık başına sıkıca oturacak. Kayıt için hangi model uygun?'), [
      t('Высокий пучок под ободком', 'Bandın altında yüksek topuz'), t('Крупные заколки под ободком', 'Bandın altında iri tokalar'), t('Две низкие косы', 'Aşağıdan iki örgü'),
    ], 2, t('Низкие косы оставили место для ободка. Йона надела наушники и повернула голову без помех.', 'Alçak örgüler banda yer bıraktı. Yeona kulaklığını takıp başını rahatça çevirdi.')),
    dial(t('Для каждой косы мне нужны 2 резинки. Сколько резинок взять для обеих?',
      'Her örgüye 2 lastik toka gerekiyor. İki örgü için toplam kaç toka alalım?'), 4,
    t('Четыре резинки держат косы. Йона может снять наушники, и волосы не распустятся.', 'Dört lastik toka örgüleri tutuyor. Yeona kulaklığını çıkarınca saçları çözülmeyecek.')),
  ], t('Йона сразу после записи идёт на встречу с друзьями. Как ей уложить волосы для встречи?', 'Yeona kayıttan çıkar çıkmaz arkadaşlarıyla buluşacak. Buluşma için saçını nasıl yapsın?'), [
    end(t('Привязать цветные ленты', 'Renkli kurdele bağla'), t('Йона привязала ленты к концам кос, когда сняла наушники. Подруга сразу узнала её по лентам в толпе.', 'Yeona kulaklığını çıkarınca örgülerinin ucuna kurdele bağladı. Arkadaşı kalabalıkta onu kurdelelerinden tanıdı.')),
    end(t('Распустить косы', 'Örgüleri aç'), t('К вечеру волосы легли мягкими волнами. Йона показала подругам, какую укладку получила без горячих щипцов.', 'Akşama doğru saçları hafifçe dalgalandı. Yeona maşa kullanmadan elde ettiği modeli arkadaşlarına gösterdi.')),
  ]),

  // Som Beauty
  story('city-056', t('Сомин', 'Somin'), t('Помада на бумаге', 'Kâğıttaki Ruj'),
    t('Соми принесла розовый платок для выступления. Она выбирает оттенок помады к нему, но свет в витрине делает все пробники оранжевыми.',
      'Somi gösteri için pembe bir eşarp getirdi. Eşarbına uygun ruj arıyor ama vitrin ışığında bütün renk örnekleri turuncu görünüyor.'), [
    dial(t('На нашей лампе 2 означает тёплый свет, 8 холодный. Для нейтрального света поставь настройку ровно посередине. Какое число выберешь?',
      'Lambamızda 2 sıcak ışık, 8 soğuk ışık demek. Nötr ışık için ayarı tam ortaya getir. Hangi sayıyı seçersin?'), 5,
    t('На пятой отметке белая бумага выглядит белой. Теперь сравним образцы с платком.', 'Beşinci ayarda beyaz kâğıt beyaz görünüyor. Şimdi örnekleri eşarpla karşılaştıralım.')),
    find(t('На ярлыке платка цвет назван «пыльная роза». Какой подписанный образец на бумаге совпадает с ним?',
      'Eşarbın etiketinde «gül kurusu» yazıyor. Kâğıttaki hangi etiketli örnek aynı renkte?'), [
      t('Коралловый', 'Mercan'), t('Пыльная роза', 'Gül kurusu'), t('Сливовый', 'Mürdüm'),
    ], 1, t('Под нейтральной лампой Соми увидела, что образец и платок одного оттенка. Осталось решить, что ей взять на репетицию.', 'Somi nötr ışıkta örnekle eşarbın aynı tonda olduğunu gördü. Şimdi provaya ne götüreceğine karar verecek.')),
  ], t('Что взять Соми на репетицию?', 'Somi provaya ne götürsün?'), [
    end(t('Карту с двумя оттенками', 'İki tonlu renk kartı al'), t('Соми взяла карту с розовым и сливовым. Под сценическим светом сливовый был заметнее, и она показала его гримёру.', 'Somi pembe ve mürdüm tonlarının olduğu kartı aldı. Sahne ışığında mürdüm daha belirgindi, o da makyözüne onu gösterdi.')),
    end(t('Только платок', 'Eşarbı götür'), t('Соми посмотрела из зала, как виден платок на сцене. Цвет уже был заметен из последнего ряда, и она решила сохранить привычный образ.', 'Somi salondan eşarbın sahnede nasıl göründüğüne baktı. Rengi son sıradan bile seçiliyordu. Her zamanki görünümünü korumaya karar verdi.')),
  ]),

  // Mirae Cinema
  story('city-057', t('Мирэ', 'Mirae'), t('Первая катушка на большом экране', 'Büyük Perdede İlk Makara'),
    t('Чан принёс две катушки с семейными съёмками для показа на старом проекторе. Надписи стёрлись, а бабушка Чана помнит, что их фильм открывался кадром с трамваем.',
      'Chan eski projektörde göstermek için ailesine ait iki film makarası getirdi. Yazıları silinmiş. Büyükannesi filmin ilk karesinde bir tramvay olduğunu hatırlıyor.'), [
    find(t('У нужной катушки в первом кадре трамвай. Я разглядел три ленты. Какую отдашь киномеханику для показа?',
      'Aradığımız makaranın ilk karesinde tramvay var. Üç filme baktım. Gösterim için hangisini projeksiyon görevlisine verelim?'), [
      t('Кадр с трамваем', 'Tramvay karesi'), t('Кадр с причалом', 'İskele karesi'), t('Кадр с номерами', 'Rakamlı kare'),
    ], 0, t('Бабушка узнала трамвай, который ходил мимо её школы. Киномеханик уже готовит проектор.', 'Büyükannesi eskiden okulunun önünden geçen tramvayı tanıdı. Projeksiyon görevlisi cihazı hazırlıyor.')),
    order(t('Сначала дождись, пока киномеханик проверит ленту на пробном экране. Потом погаси свет в зале и дай ему знак начать показ.',
      'Önce görevlinin filmi deneme perdesinde kontrol etmesini bekle. Sonra salonun ışığını söndür ve gösterimi başlatması için işaret ver.'), [
      t('Дождаться пробного кадра', 'Deneme karesini bekle'), t('Погасить свет в зале', 'Salonun ışığını söndür'), t('Дать знак киномеханику', 'Görevliye işaret ver'),
    ], t('Трамвай поехал по большому экрану. Бабушка Чана показала на девочку у остановки и прошептала: «Это я».', 'Tramvay büyük perdede ilerledi. Chan’ın büyükannesi duraktaki kızı gösterip «Bu benim» diye fısıldadı.')),
  ], t('Что предложим семье после показа?', 'Gösterimden sonra aileye ne önerelim?'), [
    end(t('Записать рассказ бабушки', 'Büyükannesinin anısını kaydet'), t('Семья включила диктофон. Бабушка вспомнила, как в тот день не села в трамвай, потому что ждала сестру.', 'Aile ses kaydını açtı. Büyükanne o gün kız kardeşini beklediği için tramvaya binmediğini hatırladı.')),
    end(t('Сделать цифровую копию', 'Dijital kopya hazırla'), t('Чан попросил киномеханика оцифровать плёнку. Семья отправила копию двоюродному брату, и он узнал свою улицу.', 'Chan görevliden filmi dijitale aktarmasını istedi. Aile kopyayı kuzenine gönderdi. O da kendi sokağını tanıdı.')),
  ]),

  // Suyu Hotel
  story('city-058', t('Сую', 'Suyu'), t('Завтрак до выезда', 'Yola Çıkmadan Kahvaltı'),
    t('Автобус команды Хэджин отправляется рано: ребята едут на конкурс. Когда откроется столовая, они уже будут в пути, так что я соберу им завтрак с собой.',
      'Haejin’in ekibi yarışmaya gidecek. Otobüsleri erken kalkıyor ve yemekhane açıldığında yolda olacaklar. Onlara kahvaltıyı paketleyeceğim.'), [
    dial(t('В команде 9 человек. Трое уже принесли свою еду. Сколько завтраков ещё подготовить?',
      'Ekipte 9 kişi var. Üçü yiyeceğini getirdi. Kaç kahvaltı hazırlayalım?'), 6,
    t('На стойке шесть пакетов. Для каждого нужно подписать, кому он предназначен.', 'Resepsiyonda altı paket var. Her birine kime ait olduğunu yazmalıyız.')),
    order(t('Работай с одним пакетом за раз. Проверь имя в списке, прикрепи наклейку с этим именем и поставь подписанный пакет на полку выдачи.',
      'Her seferinde bir paket hazırla. Listeden adı kontrol et, o adın yazdığı etiketi yapıştır ve paketi teslim rafına koy.'), [
      t('Проверить имя в списке', 'Listeden adı kontrol et'), t('Прикрепить наклейку', 'Etiketi yapıştır'), t('Поставить на полку выдачи', 'Teslim rafına koy'),
    ], t('Хэджин сверила имена на пакетах с билетами команды. Завтрак готов ко времени выезда.', 'Haejin paketlerdeki isimleri ekibin biletleriyle karşılaştırdı. Kahvaltı kalkış saatine hazır.')),
  ], t('Как раздать пакеты команде?', 'Paketleri ekibe nasıl ulaştıralım?'), [
    end(t('Пусть заберут у стойки', 'Resepsiyondan alsınlar'), t('Ребята брали пакеты, когда сдавали ключи от номеров. Каждый успел проверить своё имя до посадки.', 'Ekip üyeleri oda anahtarını teslim ederken paketlerini aldı. Otobüse binmeden herkes kendi adını kontrol etti.')),
    end(t('Передать капитану у автобуса', 'Otobüsün yanında kaptana ver'), t('Я передал пакеты Хэджин у автобуса. Она раздала завтрак по местам, пока ребята убирали сумки.', 'Paketleri otobüsün yanında Haejin’e verdim. Ekip çantalarını yerleştirirken o da kahvaltıları koltuklara dağıttı.')),
  ]),

  // Yeonhwa Flowers
  story('city-059', t('Ёнхва', 'Yeonhwa'), t('Букет против ветра', 'Rüzgâra Karşı Buket'),
    t('Сегодня Нари поёт под открытым небом, и её брат Кёнсу хочет вручить ей букет. По дороге через мост сильный ветер треплет лепестки.',
      'Nari bugün açık havada şarkı söyleyecek. Kardeşi Gyeongsu ona buket vermek istiyor. Köprüden geçerken kuvvetli rüzgâr taç yapraklarını savuruyor.'), [
    find(t('Бумага должна закрыть лепестки, при этом не прижимать их. Что лучше взять для букета?',
      'Kâğıt çiçeklerin taç yapraklarını ezmeden örtmeli. Bukete hangisi uygun?'), [
      t('Короткую бумажную полоску', 'Kısa kâğıt şerit'), t('Высокий широкий конус из бумаги', 'Uzun ve geniş kâğıt külah'), t('Тугую резинку на лепестки', 'Taç yapraklarına sıkı lastik'),
    ], 1, t('Конус прикрыл все лепестки, и у цветов осталось место. Закрепим его, чтобы он не слетел на мосту.', 'Külah bütün taç yapraklarını örttü, çiçekler sıkışmadı. Köprüde uçmasın diye külahı sabitleyelim.')),
    order(t('Собери стебли в пучок. Затем надень конус и привяжи его лентой у стеблей.',
      'Sapları bir demette topla. Sonra külahı geçir ve sapların oradan kurdeleyle bağla.'), [
      t('Собрать стебли', 'Sapları birleştir'), t('Надеть конус', 'Külahı geçir'), t('Завязать у стеблей', 'Sapların oradan bağla'),
    ], t('Кёнсу перешёл мост с букетом. У сцены он снял конус, и все лепестки остались целы.', 'Gyeongsu buketle köprüden geçti. Sahneye varıp külahı çıkarınca bütün taç yaprakları yerindeydi.')),
  ], t('Когда Кёнсу подарит цветы Нари?', 'Gyeongsu çiçekleri Nari’ye ne zaman versin?'), [
    end(t('Перед выходом на сцену', 'Sahneye çıkmadan önce'), t('Нари поставила букет рядом с зеркалом. Перед выходом она вдохнула запах цветов и помахала брату.', 'Nari buketi aynanın yanına koydu. Sahneye çıkmadan çiçekleri koklayıp kardeşine el salladı.')),
    end(t('После последней песни', 'Son şarkıdan sonra'), t('Во время поклона Кёнсу передал букет Нари. Она достала один цветок и подарила его девочке, которая подпевала в первом ряду.', 'Nari eğilerek seyirciyi selamlarken Gyeongsu buketi uzattı. Nari bir çiçek çıkarıp ön sırada şarkıya eşlik eden kıza verdi.')),
  ]),

  // Cheong Gallery
  story('city-060', t('Чхон', 'Cheong'), t('Луна на стене', 'Duvardaki Ay'),
    t('Наш художник Уджин сделал город из бумажных домиков, а луну придумал показать тенью. Пока тень прячется за крышей, и зрители видят только дома.',
      'Sanatçımız Ujin kâğıt evlerden bir şehir kurdu. Ayı bir gölgeyle göstermek istedi. Ayın gölgesi şimdilik çatının arkasında kalıyor ve seyirciler sadece evleri görüyor.'), [
    dial(t('На шкале макета крыша доходит до отметки 4. Центр луны должен быть на 3 деления выше. Какую отметку выставить?',
      'Maketin cetvelinde çatı 4 çizgisine kadar çıkıyor. Ayın merkezi 3 çizgi daha yukarıda olmalı. Ayarı kaça getirelim?'), 7,
    t('Круглая тень поднялась над крышами. Уджин пустил пробное облако и ждёт, когда оно пройдёт.', 'Yuvarlak gölge çatıların üstüne çıktı. Ujin deneme bulutunu hareket ettirdi, geçmesini bekliyor.')),
    cue(t('Облако уйдёт, и появится «Сейчас!». Сними стену, когда тень луны видна целиком.',
      'Bulut geçince «Şimdi!» işareti çıkacak. Ayın gölgesi bütünüyle görünürken duvarı çek.'), t('Снять луну', 'Ayı fotoğrafla'),
    t('На снимке над бумажным Сеулом полная луна. Уджин увидел, что задумка читается из зала.', 'Fotoğrafta kâğıttan Seul’ün üstünde dolunay var. Ujin eserin salondan anlaşılabildiğini gördü.')),
  ], t('Что оставим посетителям у макета?', 'Ziyaretçiler için maketin yanına ne koyalım?'), [
    end(t('Поставить ручку облака', 'Bulutu oynatan kolu tak'), t('Уджин добавил ручку. Дети сдвигали облако и сами открывали полную луну над крышами.', 'Ujin bir kol ekledi. Çocuklar bulutu kaydırıp çatıların üzerindeki dolunayı kendileri ortaya çıkardı.')),
    end(t('Показать фото процесса', 'Yapım fotoğraflarını göster'), t('Мы повесили рядом три снимка: бумажный круг, лампа и луна на стене. Посетители смогли понять, как получилась тень.', 'Yan yana üç fotoğraf astık: kâğıt daire, lamba ve duvardaki ay. Ziyaretçiler gölgenin nasıl oluştuğunu gördü.')),
  ]),
];
