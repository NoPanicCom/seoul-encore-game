const phrase = (ru, tr) => ({ru, tr});

export const SUMI_PREPARATION_STAMP = 'sumi-order-v1';
export const SUMI_STAMP = 'sumi-delivery-v2';
export const SUMI_ORDER_TITLES = Object.freeze({
  strawberry: phrase('Клубничное молоко с Суми', 'Sumi ile çilekli süt'),
  chocolate: phrase('Готовим шоколад со льдом', 'Sumi ile buzlu çikolata'),
});

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
  savedAgain: phrase('Штамп кафе уже в паспорте.', 'Kafe damgası zaten pasaportunda.'),
  saveError: phrase('Не удалось сохранить заказ. Можно повторить без нового приготовления.', 'Sipariş kaydedilemedi. Yeniden hazırlamadan kaydetmeyi deneyebilirsin.'),
  retrySave: phrase('Повторить сохранение', 'Yeniden kaydet'),
  strawberry: phrase('Клубника', 'Çilek'),
  blueberry: phrase('Черника', 'Yaban mersini'),
  banana: phrase('Банан', 'Muz'),
  milkIngredient: phrase('Холодное молоко', 'Soğuk süt'),
  cocoaIngredient: phrase('Какао', 'Kakao'),
  iceIngredient: phrase('Кубики льда', 'Buz küpleri'),
  coffee: phrase('Кофе', 'Kahve'),
  sugar: phrase('Сахар', 'Şeker'),
  tea: phrase('Чай', 'Çay'),
  water: phrase('Вода', 'Su'),
};
const chocolate = {
  ordering: phrase('Привет, София! Мне, пожалуйста, стакан холодного шоколада со льдом.', 'Merhaba Sofia! Buzlu çikolata alabilir miyim?'),
  welcome: phrase(
    'Я охлажу стакан. А ты помоги выбрать какао, молоко и лёд для шоколада.',
    'Bardağı ben soğutayım. Buzlu çikolata için kakao, süt ve buzu sen seç.',
  ),
  cocoa: phrase('Выбери какао. Я размешаю его с каплей молока.', 'Kakaoyu seç. Ben onu biraz sütle karıştıracağım.'),
  cocoaWrong: phrase('Для шоколадного вкуса нам нужен какао-порошок.', 'Çikolata tadı için kakao tozu gerekiyor.'),
  milk: phrase('Какао на дне стакана. Добавь холодное молоко.', 'Kakao bardağın dibinde. Soğuk sütü ekle.'),
  ice: phrase('Я придержу стакан. Добавь кубики льда, чтобы охладить напиток.', 'Bardağı ben tutayım. İçeceği soğutmak için buz küplerini ekle.'),
  iceWrong: phrase('Чтобы охладить шоколад, нужны кубики льда.', 'Çikolatayı soğutmak için buz küpleri gerekiyor.'),
  tray: phrase('Я поставила стакан на поднос. Отнеси его к столику с клубникой.', 'Bardağı tepsiye koydum. Tepsiyi çilek işaretli masaya götür.'),
  thanks: phrase('Спасибо, София! Холодный шоколад со льдом получился чудесным.', 'Teşekkür ederim Sofia! Buzlu çikolata harika olmuş.'),
  drinkAlt: phrase('Стакан шоколада с кубиками льда', 'Buz küpleriyle bir bardak soğuk çikolata'),
};
const fruit = [['blueberry', '🫐'], ['strawberry', '🍓'], ['banana', '🍌']];
const drinks = [['tea', '☕'], ['water', '💧'], ['milk', '🥛']];
const cocoa = [['coffee', '☕'], ['cocoa', '🍫'], ['strawberry', '🍓']];
const ice = [['sugar', '◻'], ['ice', '🧊'], ['water', '💧']];
const ingredientLabels = {milk: 'milkIngredient', cocoa: 'cocoaIngredient', ice: 'iceIngredient'};
const milkStep = {phase: 'milk', choices: drinks, correct: 'milk', wrong: 'milkWrong'};
const recipeSteps = {
  strawberry: [{phase: 'fruit', choices: fruit, correct: 'strawberry', wrong: 'fruitWrong'}, milkStep],
  chocolate: [
    {phase: 'cocoa', choices: cocoa, correct: 'cocoa', wrong: 'cocoaWrong'}, milkStep,
    {phase: 'ice', choices: ice, correct: 'ice', wrong: 'iceWrong'},
  ],
};

export function createSumiOrder({
  locale, element, button, onAction, onAccept, onPickup, onReplay, onExit, onSave, onChange, completed, initialPhase,
  recipe = 'strawberry',
}) {
  if (!Object.hasOwn(recipeSteps, recipe)) throw new RangeError('Invalid Sumi recipe');
  const steps = recipeSteps[recipe];
  const preparationPhases = new Set([...steps.map(step => step.phase), 'stir', 'tray']);
  const recipeText = recipe === 'chocolate' ? chocolate : {};
  let phase = initialPhase === 'ordering' ? 'ordering' : 'welcome';
  let greeted = false;
  let stirs = 0;
  let feedback = '';
  let saved = completed;
  let wasCompleted = completed;
  let resumePhase = null;

  const words = key => (recipeText[key] ?? text[key])[locale()];
  const change = (selector) => onChange(selector);

  function makeGlass() {
    const figure = element('div', 'sumi-glass');
    figure.id = 'sumi-drink';
    figure.dataset.fill = phase;
    figure.dataset.recipe = recipe;
    figure.dataset.stirs = String(stirs);
    if (phase === 'tray' || phase === 'delivered') {
      figure.setAttribute('role', 'img');
      figure.setAttribute('aria-label', words('drinkAlt'));
    } else {
      figure.setAttribute('aria-hidden', 'true');
    }
    const cup = element('div', 'sumi-cup');
    cup.append(element('i', 'sumi-puree'), element('i', 'sumi-milk'), element('i', 'sumi-reflection'));
    figure.append(cup, element('i', 'sumi-saucer'));
    if (recipe === 'chocolate') {
      cup.append(element('i', 'sumi-ice sumi-ice-left'), element('i', 'sumi-ice sumi-ice-right'));
    } else {
      figure.append(element('i', 'sumi-straw'), element('i', 'sumi-berry'));
    }
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
    const label = ingredientLabels[ingredient] ?? ingredient;
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
    panel.dataset.recipe = recipe;
    panel.dataset.greeted = String(greeted);

    if (phase === 'delivered') {
      const result = element('div', 'sumi-result');
      result.id = 'sumi-result';
      result.dataset.saved = String(saved);
      result.dataset.recipe = recipe;
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
        const currentStep = steps.find(step => step.phase === phase);
        choices.append(...currentStep.choices.map(ingredientButton));
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
    const stepIndex = steps.findIndex(step => step.phase === phase);
    const step = steps[stepIndex];
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
      phase = steps[0].phase;
      feedback = '';
      onAction?.('prepare');
      change('[data-sumi-ingredient]');
    } else if (step && ingredient) {
      if (ingredient === step.correct) {
        phase = steps[stepIndex + 1]?.phase ?? 'stir';
        feedback = '';
        change('[data-sumi-ingredient]');
      } else {
        feedback = step.wrong;
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

  const preparing = () => preparationPhases.has(phase);
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
    recipe, render, handleClick, deliver, sync, callNext,
    finished: () => phase === 'delivered',
    needsSave: () => phase === 'delivered' && !saved,
    resume: () => onAction?.(preparing() ? 'prepare' : 'idle'),
  };
}
