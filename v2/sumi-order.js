const phrase = (ru, tr) => ({ru, tr});

export const SUMI_STAMP = 'sumi-order-v1';
export const SUMI_ORDER_TITLE = phrase('Клубничное молоко с Суми', 'Sumi ile çilekli süt');

const text = {
  sumi: phrase('Суми', 'Sumi'),
  welcome: phrase(
    'Привет, София! Приготовим клубничное молоко вместе? Я сделаю пюре, а ты поможешь с ягодами и молоком.',
    'Merhaba Sofia! Birlikte çilekli süt yapalım mı? Ben püreyi hazırlayayım, sen meyve ve sütle yardım et.',
  ),
  start: phrase('Готовить вместе', 'Birlikte hazırla'),
  another: phrase('Ещё один стакан', 'Bir bardak daha'),
  greet: phrase('Привет от Пикселя', 'Pixel selam versin'),
  greeted: phrase('Пиксель поднял лапку, а Суми помахала в ответ.', 'Pixel patisini kaldırdı, Sumi de el salladı.'),
  fruit: phrase('Выбери клубнику. Я вымою ягоды, разомну их и положу пюре в стакан.', 'Çileği seç. Ben çilekleri yıkayıp ezeceğim ve püreyi bardağa koyacağım.'),
  fruitWrong: phrase('Нам нужна клубника. Найди красные ягоды в форме сердечка.', 'Çilek gerekiyor. Kalp biçimindeki kırmızı meyveyi seç.'),
  milk: phrase('Пюре на дне. Возьми холодное молоко и налей его поверх клубники.', 'Püre bardağın dibinde. Soğuk sütü seçip çileğin üzerine dök.'),
  milkWrong: phrase('Для этого напитка нужно холодное молоко.', 'Bu içecek için soğuk süt gerekiyor.'),
  stir: phrase('Я придержу стакан. Перемешай напиток три раза.', 'Bardağı ben tutayım. İçeceği üç kez karıştır.'),
  stirAction: phrase('Перемешать', 'Karıştır'),
  served: phrase('Наше клубничное молоко готово!', 'Çilekli sütümüz hazır!'),
  serveNote: phrase('Суми украсила стакан свежей клубникой.', 'Sumi bardağı taze çilekle süsledi.'),
  drinkAlt: phrase('Стакан розового клубничного молока с ягодой на краю', 'Kenarında çilek olan bir bardak pembe çilekli süt'),
  saved: phrase('Заказ добавлен в паспорт.', 'Sipariş pasaporta eklendi.'),
  savedAgain: phrase('Отметка о заказе уже есть в паспорте.', 'Bu siparişin damgası zaten pasaportunda.'),
  saveError: phrase('Не удалось сохранить заказ. Можно повторить без нового приготовления.', 'Sipariş kaydedilemedi. Yeniden hazırlamadan kaydetmeyi deneyebilirsin.'),
  retrySave: phrase('Повторить сохранение', 'Yeniden kaydet'),
  strawberry: phrase('Клубника', 'Çilek'),
  blueberry: phrase('Черника', 'Yaban mersini'),
  banana: phrase('Банан', 'Muz'),
  milkIngredient: phrase('Холодное молоко', 'Soğuk süt'),
  tea: phrase('Чай', 'Çay'),
  water: phrase('Вода', 'Su'),
};
const fruit = [['blueberry', '🫐'], ['strawberry', '🍓'], ['banana', '🍌']];
const drinks = [['tea', '☕'], ['water', '💧'], ['milk', '🥛']];

export function createSumiOrder({locale, element, button, onAction, onSave, onChange, completed}) {
  let phase = 'welcome';
  let greeted = false;
  let stirs = 0;
  let feedback = '';
  let saved = completed;
  let wasCompleted = completed;

  const words = key => text[key][locale()];
  const change = (selector) => onChange(selector);

  function makeGlass() {
    const figure = element('div', 'sumi-glass');
    figure.id = 'sumi-drink';
    figure.dataset.fill = phase;
    figure.dataset.stirs = String(stirs);
    if (phase === 'served') {
      figure.setAttribute('role', 'img');
      figure.setAttribute('aria-label', words('drinkAlt'));
    } else {
      figure.setAttribute('aria-hidden', 'true');
    }
    const cup = element('div', 'sumi-cup');
    cup.append(element('i', 'sumi-puree'), element('i', 'sumi-milk'), element('i', 'sumi-reflection'));
    figure.append(element('i', 'sumi-straw'), cup, element('i', 'sumi-berry'), element('i', 'sumi-saucer'));
    return figure;
  }

  function dialogue() {
    const speech = element('div', 'sumi-speech');
    const speaker = element('b', 'sumi-name', words('sumi'));
    const line = element('p', 'sumi-line', words(phase));
    speech.append(speaker, line);
    return speech;
  }

  function ingredientButton([ingredient, icon]) {
    const option = button('', 'city-choice sumi-choice');
    const label = ingredient === 'milk' ? 'milkIngredient' : ingredient;
    option.dataset.sumiIngredient = ingredient;
    const picture = element('span', '', icon);
    picture.setAttribute('aria-hidden', 'true');
    option.append(picture, element('span', '', words(label)));
    return option;
  }

  function render() {
    const panel = element('section', 'sumi-order');
    panel.id = 'sumi-order';
    panel.dataset.phase = phase;
    panel.dataset.greeted = String(greeted);

    if (phase === 'served') {
      const result = element('div', 'sumi-result');
      result.id = 'sumi-result';
      result.dataset.saved = String(saved);
      const layout = element('div', 'sumi-progress-hero');
      const copy = element('div', 'sumi-result-copy');
      copy.append(element('h3', 'sumi-result-title', words('served')), element('p', 'city-message', words('serveNote')));
      layout.append(makeGlass(), copy);
      const status = element('p', 'city-message sumi-status', words(feedback));
      status.id = 'sumi-feedback';
      status.setAttribute('role', 'status');
      result.append(layout, status);
      if (saved) result.append(button('sumi-replay', 'city-secondary', words('another')));
      else result.append(button('sumi-retry-save', 'city-primary', words('retrySave')));
      panel.append(result);
      return panel;
    }

    const line = dialogue();
    if (phase === 'welcome') {
      const tools = element('div', 'sumi-welcome-actions');
      const greet = button('sumi-greet', 'city-secondary', words('greet'));
      greet.disabled = greeted;
      tools.append(greet, button('sumi-start', 'city-primary', words(saved ? 'another' : 'start')));
      panel.append(line, tools);
    } else {
      const layout = element('div', 'sumi-progress-hero');
      layout.append(makeGlass(), line);
      panel.append(layout);
      if (phase === 'stir') {
        const stir = button('', 'city-primary', `${words('stirAction')} · ${stirs}/3`);
        stir.dataset.sumiIngredient = 'stir';
        panel.append(stir);
      } else {
        const choices = element('div', 'sumi-choices');
        choices.append(...(phase === 'fruit' ? fruit : drinks).map(ingredientButton));
        panel.append(choices);
      }
    }
    const status = element('p', 'city-message sumi-status', feedback ? words(feedback) : '');
    status.id = 'sumi-feedback';
    status.setAttribute('role', 'status');
    panel.append(status);
    return panel;
  }

  function save() {
    if (!saved) {
      try {
        onSave();
        saved = true;
      } catch (error) {
        feedback = 'saveError';
        console.warn('Seoul Encore Sumi order could not be saved.', error);
        change('#sumi-retry-save');
        return;
      }
    }
    feedback = wasCompleted ? 'savedAgain' : 'saved';
    wasCompleted = true;
    change('#sumi-replay');
  }

  function handleClick(chosen) {
    const ingredient = chosen.dataset.sumiIngredient;
    if (chosen.id === 'sumi-greet' && phase === 'welcome' && !greeted) {
      greeted = true;
      feedback = 'greeted';
      onAction?.('greet');
      change('#sumi-start');
    } else if (chosen.id === 'sumi-start' && phase === 'welcome') {
      phase = 'fruit';
      feedback = '';
      onAction?.('prepare');
      change('[data-sumi-ingredient]');
    } else if (phase === 'fruit' && ingredient) {
      if (ingredient === 'strawberry') {
        phase = 'milk';
        feedback = '';
        change('[data-sumi-ingredient]');
      } else {
        feedback = 'fruitWrong';
        change(`[data-sumi-ingredient="${ingredient}"]`);
      }
    } else if (phase === 'milk' && ingredient) {
      if (ingredient === 'milk') {
        phase = 'stir';
        feedback = '';
        change('[data-sumi-ingredient]');
      } else {
        feedback = 'milkWrong';
        change(`[data-sumi-ingredient="${ingredient}"]`);
      }
    } else if (phase === 'stir' && ingredient === 'stir') {
      stirs++;
      if (stirs === 3) {
        phase = 'served';
        onAction?.('serve');
        save();
      } else {
        change('[data-sumi-ingredient]');
      }
    } else if (phase === 'served' && chosen.id === 'sumi-retry-save' && !saved) {
      save();
    } else if (phase === 'served' && chosen.id === 'sumi-replay' && saved) {
      phase = 'welcome';
      stirs = 0;
      greeted = false;
      feedback = '';
      onAction?.('idle');
      change('#sumi-start');
    }
  }

  return {render, handleClick, finished: () => phase === 'served'};
}
