const phrase = (ru, tr) => ({ru, tr});

export const SUMI_PREPARATION_STAMP = 'sumi-order-v1';
export const SUMI_STAMP = 'sumi-delivery-v2';
export const SUMI_ORDER_TITLE = phrase('Клубничное молоко с Суми', 'Sumi ile çilekli süt');

const text = {
  sumi: phrase('Суми', 'Sumi'),
  customer: phrase('Гость', 'Müşteri'),
  ordering: phrase('Привет, София! Мне, пожалуйста, стакан клубничного молока.', 'Merhaba Sofia! Bir bardak çilekli süt alabilir miyim?'),
  accept: phrase('Принять заказ', 'Siparişi al'),
  acceptError: phrase('Подожди, пока гость подойдёт к кассе.', 'Müşterinin kasaya yaklaşmasını bekle.'),
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
  tray: phrase('Я украсила стакан. Возьми поднос и отнеси его к столику с клубникой.', 'Bardağı süsledim. Tepsiyi alıp çilek işaretli masaya götür.'),
  pickup: phrase('Взять поднос', 'Tepsiyi al'),
  pickupError: phrase('Поднос пока у кассы. Попробуй взять его ещё раз.', 'Tepsi hâlâ tezgahta. Yeniden almayı dene.'),
  delivered: phrase('Заказ доставлен', 'Sipariş teslim edildi'),
  thanks: phrase('Спасибо, София! Клубничное молоко получилось чудесным.', 'Teşekkür ederim Sofia! Çilekli süt harika olmuş.'),
  watch: phrase('Понаблюдать за гостем', 'Müşteriyi izle'),
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

export function createSumiOrder({
  locale, element, button, onAction, onAccept, onPickup, onReplay, onExit, onSave, onChange, completed, initialPhase,
}) {
  let phase = initialPhase === 'ordering' ? 'ordering' : 'welcome';
  let greeted = false;
  let stirs = 0;
  let feedback = '';
  let saved = completed;
  let wasCompleted = completed;
  let resumePhase = null;

  const words = key => text[key][locale()];
  const change = (selector) => onChange(selector);

  function makeGlass() {
    const figure = element('div', 'sumi-glass');
    figure.id = 'sumi-drink';
    figure.dataset.fill = phase;
    figure.dataset.stirs = String(stirs);
    if (phase === 'tray' || phase === 'delivered') {
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
    const speaker = element('b', 'sumi-name', words(phase === 'ordering' ? 'customer' : 'sumi'));
    const line = element('p', 'sumi-line', words(phase));
    if (phase === 'ordering') line.id = 'sumi-customer-order';
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

    if (phase === 'delivered') {
      const result = element('div', 'sumi-result');
      result.id = 'sumi-result';
      result.dataset.saved = String(saved);
      const layout = element('div', 'sumi-progress-hero');
      const copy = element('div', 'sumi-result-copy');
      const speaker = element('b', 'sumi-name', words('customer'));
      const thanks = element('p', 'sumi-line', words('thanks'));
      thanks.id = 'sumi-customer-thanks';
      copy.append(element('h3', 'sumi-result-title', words('delivered')), speaker, thanks);
      layout.append(makeGlass(), copy);
      const status = element('p', 'city-message sumi-status', words(feedback));
      status.id = 'sumi-feedback';
      status.setAttribute('role', 'status');
      const actions = element('div', 'sumi-delivery-actions');
      if (!saved) actions.append(button('sumi-retry-save', 'city-primary', words('retrySave')));
      actions.append(button('sumi-watch-customer', saved ? 'city-primary' : 'city-secondary', words('watch')));
      result.append(layout, status, actions);
      panel.append(result);
      return panel;
    }

    const line = dialogue();
    if (phase === 'ordering') {
      panel.append(line, button('sumi-accept', 'city-primary', words('accept')));
    } else if (phase === 'welcome') {
      const tools = element('div', 'sumi-welcome-actions');
      const greet = button('sumi-greet', 'city-secondary', words('greet'));
      greet.disabled = greeted;
      tools.append(greet, button('sumi-start', 'city-primary', words(saved ? 'another' : 'start')));
      panel.append(line, tools);
    } else {
      const layout = element('div', 'sumi-progress-hero');
      layout.append(makeGlass(), line);
      panel.append(layout);
      if (phase === 'tray') {
        panel.append(button('sumi-pickup', 'city-primary', words('pickup')));
      } else if (phase === 'stir') {
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
    change('#sumi-watch-customer');
  }

  function handleClick(chosen) {
    const ingredient = chosen.dataset.sumiIngredient;
    if (chosen.id === 'sumi-accept' && phase === 'ordering') {
      if (onAccept?.() === true) {
        phase = resumePhase ?? 'welcome';
        resumePhase = null;
        feedback = '';
        if (preparing()) onAction?.('prepare');
        change(phase === 'welcome' ? '#sumi-greet' : phase === 'tray' ? '#sumi-pickup' : '[data-sumi-ingredient]');
      } else {
        feedback = 'acceptError';
        change('#sumi-accept');
      }
    } else if (chosen.id === 'sumi-greet' && phase === 'welcome' && !greeted) {
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
        phase = 'tray';
        change('#sumi-pickup');
      } else {
        change('[data-sumi-ingredient]');
      }
    } else if (phase === 'tray' && chosen.id === 'sumi-pickup') {
      if (onPickup?.() === true) {
        phase = 'carrying';
        onExit();
      } else {
        feedback = 'pickupError';
        change('#sumi-pickup');
      }
    } else if (phase === 'delivered' && chosen.id === 'sumi-retry-save' && !saved) {
      save();
    } else if (phase === 'delivered' && chosen.id === 'sumi-watch-customer') {
      onExit();
    }
  }

  function deliver() {
    if (phase === 'delivered') {
      change(saved ? '#sumi-watch-customer' : '#sumi-retry-save');
      return;
    }
    phase = 'delivered';
    stirs = 3;
    onAction?.('serve');
    save();
  }

  function callNext() {
    if (phase !== 'delivered' || !saved || onReplay?.() !== true) return false;
    phase = 'ordering';
    stirs = 0;
    greeted = false;
    feedback = '';
    resumePhase = null;
    onExit();
    return true;
  }

  const preparing = () => ['fruit', 'milk', 'stir', 'tray'].includes(phase);
  function sync(visit) {
    if (visit === 'ordering' && phase !== 'ordering') {
      if (phase === 'welcome' || preparing()) resumePhase = phase;
      else if (phase === 'carrying') resumePhase = 'tray';
      else {
        resumePhase = null;
        stirs = 0;
        greeted = false;
      }
      phase = 'ordering';
      feedback = '';
    } else if (visit === 'preparing') {
      if (phase === 'ordering' || phase === 'delivered') {
        if (phase === 'delivered') {
          stirs = 0;
          greeted = false;
          resumePhase = null;
        }
        phase = resumePhase ?? 'welcome';
        resumePhase = null;
        feedback = '';
      } else if (phase === 'carrying') {
        phase = 'tray';
        feedback = '';
      }
    }
  }

  return {
    render, handleClick, deliver, sync, callNext,
    finished: () => phase === 'delivered',
    needsSave: () => phase === 'delivered' && !saved,
    resume: () => onAction?.(preparing() ? 'prepare' : 'idle'),
  };
}
