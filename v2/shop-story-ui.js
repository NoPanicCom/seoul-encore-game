const copy = {
  close: {ru: 'Закрыть', tr: 'Kapat'},
  begin: {ru: 'Я помогу', tr: 'Yardım edeyim'},
  returnToScene: {ru: 'Вернуться в магазин', tr: 'Dükkâna dön'},
  retry: {ru: 'Начать историю заново', tr: 'Hikâyeye yeniden başla'},
  storage: {ru: 'Прогресс сохранён на время игры. После обновления он может потеряться.', tr: 'İlerleme bu oturumda duruyor. Sayfa yenilenirse kaybolabilir.'},
  unavailable: {ru: 'Сейчас не получается продолжить. Закрой историю и подойди к стойке снова.', tr: 'Şu anda devam edilemiyor. Hikâyeyi kapatıp tezgâha yeniden yaklaş.'},
  findWrong: {ru: 'Посмотри на подсказку и попробуй другой вариант.', tr: 'İpucuna bakıp başka bir seçenek dene.'},
  orderWrong: {ru: 'Последовательность ещё не сложилась. Собери её заново по подсказке.', tr: 'Sıra henüz tutmadı. İpucuna göre yeniden sırala.'},
  orderSequence: {ru: 'Твоя последовательность', tr: 'Seçtiğin sıra'},
  resetOrder: {ru: 'Очистить порядок', tr: 'Sırayı temizle'},
  range: {ru: 'Значение настройки', tr: 'Ayar değeri'},
  increase: {ru: 'Увеличить значение', tr: 'Değeri artır'},
  decrease: {ru: 'Уменьшить значение', tr: 'Değeri azalt'},
  check: {ru: 'Проверить', tr: 'Kontrol et'},
  dialLow: {ru: 'Нужно немного выше. Подсказка подскажет нужное значение.', tr: 'Biraz artır. İpucu doğru değeri bulmana yardım eder.'},
  dialHigh: {ru: 'Нужно немного ниже. Подсказка подскажет нужное значение.', tr: 'Biraz azalt. İpucu doğru değeri bulmana yardım eder.'},
  cueWait: {ru: 'Жди светлую зону', tr: 'Aydınlık alanı bekle'},
  cueNow: {ru: 'Сейчас!', tr: 'Şimdi!'},
  cueWrong: {ru: 'Попробуй ещё раз, когда загорится светлая зона.', tr: 'Aydınlık alan parladığında yeniden dene.'},
  success: {ru: 'Получилось!', tr: 'Başardın!'},
  ending: {ru: 'Финал истории', tr: 'Hikâyenin sonu'},
  endingsSeen: {ru: 'Открытые финалы', tr: 'Açılan sonlar'},
  stages: {ru: ['Знакомство', 'Работа', 'Показ', 'Решение'], tr: ['Tanışma', 'Hazırlık', 'Sunum', 'Karar']},
};

const stages = ['intro', 'work', 'display', 'decision', 'done'];
const shuffledOrders = [[1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0], [0, 2, 1]];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(text, {id, primary = false, icon} = {}) {
  const node = element('button', primary ? 'shop-story-button shop-story-primary' : 'shop-story-button');
  node.type = 'button';
  if (id) node.id = id;
  if (icon) {
    const symbol = element('span', 'shop-story-button-icon', icon);
    symbol.setAttribute('aria-hidden', 'true');
    node.append(symbol);
  }
  node.append(element('span', '', text));
  return node;
}

function storyNumber(id) {
  return Number(id.slice('city-'.length));
}

export function createShopStoryUI({lang, onOpen, onClose, onAdvance, onRestart}) {
  const dialog = element('dialog', 'shop-story-dialog');
  dialog.id = 'shop-story-panel';
  dialog.setAttribute('aria-labelledby', 'shop-story-title');

  const heading = element('header', 'shop-story-heading');
  const headingText = element('div', 'shop-story-heading-text');
  const progress = element('ol', 'shop-story-progress');
  const title = element('h2', 'shop-story-title');
  title.id = 'shop-story-title';
  const closeButton = button('', {id: 'shop-story-close', icon: '×'});
  closeButton.classList.add('shop-story-close');
  closeButton.autofocus = true;
  headingText.append(progress, title);
  heading.append(headingText, closeButton);
  const body = element('div', 'shop-story-body');
  const status = element('p', 'shop-story-status');
  status.id = 'shop-story-feedback';
  status.setAttribute('role', 'status');
  dialog.append(heading, body, status);
  document.getElementById('game').append(dialog);

  let story;
  let entry;
  let view;
  let taskState;
  let feedback = '';
  let storageNotice = false;
  let endingShown = null;
  let successLine = null;
  let frame = 0;

  const locale = () => lang() === 'tr' ? 'tr' : 'ru';
  const say = value => value[locale()];
  const words = key => say(copy[key]);
  const task = () => story.tasks[entry.stage === 'display' ? 1 : 0];

  function setFeedback(key) {
    feedback = key;
    status.textContent = key ? words(key) : storageNotice ? words('storage') : '';
    status.dataset.warning = String(Boolean(key || storageNotice));
  }

  function cancelCue() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function finishClose() {
    if (!story) return;
    cancelCue();
    const previousStory = story;
    const previousEntry = entry;
    story = entry = taskState = undefined;
    view = undefined;
    onClose?.(previousStory, previousEntry);
  }

  function close() {
    if (!dialog.open) return;
    dialog.close();
    finishClose();
  }

  closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    if (!dialog.open) finishClose();
  });

  function hostLine(message) {
    const speech = element('div', 'shop-story-speech');
    const face = element('span', 'shop-story-host-icon', say(story.host).trim().slice(0, 1));
    face.setAttribute('aria-hidden', 'true');
    const quote = element('div', 'shop-story-quote');
    quote.append(element('strong', 'shop-story-host', say(story.host)), element('p', '', say(message)));
    speech.append(face, quote);
    return speech;
  }

  function paintHeading() {
    dialog.lang = locale();
    dialog.dataset.stage = entry.stage;
    dialog.dataset.view = view;
    dialog.dataset.buildingId = story.id;
    closeButton.setAttribute('aria-label', words('close'));
    title.textContent = say(story.title);
    const active = stages.indexOf(entry.stage);
    const values = words('stages').map((label, index) => {
      const step = element('li', '');
      step.textContent = label;
      if (index === active) step.setAttribute('aria-current', 'step');
      if (index < active) step.dataset.passed = 'true';
      return step;
    });
    progress.replaceChildren(...values);
  }

  function makeTaskState() {
    if (entry.stage !== 'work' && entry.stage !== 'display') return undefined;
    const current = task();
    const seed = storyNumber(story.id);
    const initial = 2 + seed % 7;
    return {
      selected: [],
      value: initial === current.target ? initial + 1 : initial,
      cueStart: null,
      cueOpen: false,
    };
  }

  function transition(next) {
    entry = next;
    view = next.stage === 'work' || next.stage === 'display' ? 'task' : next.stage === 'done' ? 'ending' : next.stage;
    taskState = makeTaskState();
    feedback = '';
    endingShown = next.ending;
  }

  function reportProgress(result) {
    if (!result?.entry) {
      setFeedback('unavailable');
      return false;
    }
    storageNotice = result.saved === false;
    transition(result.entry);
    return true;
  }

  function advance(ending) {
    try {
      return reportProgress(onAdvance(story, entry.stage, ending));
    } catch (error) {
      console.warn('Seoul Encore shop story could not advance.', error);
      setFeedback('unavailable');
      return false;
    }
  }

  function start() {
    if (!advance()) return;
    if (storageNotice) renderSuccess(null);
    else close();
  }

  function win() {
    const success = task().success;
    if (advance()) renderSuccess(success);
  }

  function renderSuccess(success, focus = true) {
    cancelCue();
    successLine = success;
    view = 'success';
    paintHeading();
    const box = element('section', 'shop-story-success');
    box.id = 'shop-story-success';
    if (success) {
      const mark = element('span', 'shop-story-success-mark', '✓');
      mark.setAttribute('aria-hidden', 'true');
      const message = element('h3', '', words('success'));
      box.append(mark, message, hostLine(success));
    }
    box.append(button(words('returnToScene'), {id: 'shop-story-return', primary: true, icon: '↩'}));
    body.replaceChildren(box);
    setFeedback('');
    if (focus) body.querySelector('#shop-story-return').focus({preventScroll: true});
  }

  function renderIntro() {
    body.replaceChildren(
      hostLine(story.opening),
      button(words('begin'), {id: 'shop-story-start', primary: true, icon: '→'}),
    );
  }

  function renderFind(container, current) {
    const choices = element('div', 'shop-story-choices');
    for (const [index, option] of current.items.entries()) {
      const control = button(say(option));
      control.dataset.storyOption = String(index);
      choices.append(control);
    }
    container.append(choices);
  }

  function renderOrder(container, current) {
    const selected = element('ol', 'shop-story-chosen');
    selected.setAttribute('aria-label', words('orderSequence'));
    for (const index of [0, 1, 2]) {
      const item = taskState.selected[index];
      const slot = element('li', '', item === undefined ? '·' : say(current.items[item]));
      slot.dataset.filled = String(item !== undefined);
      selected.append(slot);
    }
    const choices = element('div', 'shop-story-choices');
    const sequence = shuffledOrders[storyNumber(story.id) % shuffledOrders.length];
    for (const index of sequence) {
      const control = button(say(current.items[index]));
      control.dataset.storyOption = String(index);
      control.disabled = taskState.selected.includes(index);
      choices.append(control);
    }
    const clear = button(words('resetOrder'), {id: 'shop-story-reset', icon: '↻'});
    clear.hidden = taskState.selected.length === 0;
    container.append(selected, choices, clear);
  }

  function renderDial(container) {
    const dial = element('div', 'shop-story-dial');
    const rangeLabel = element('label', 'shop-story-dial-label', words('range'));
    rangeLabel.htmlFor = 'shop-story-range';
    const range = element('input', 'shop-story-range');
    range.id = 'shop-story-range';
    range.type = 'range';
    range.min = '0';
    range.max = '10';
    range.step = '1';
    range.value = String(taskState.value);
    const display = element('output', 'shop-story-dial-output', range.value);
    display.htmlFor = range.id;
    const low = button('−', {id: 'shop-story-dial-down'});
    const high = button('+', {id: 'shop-story-dial-up'});
    low.setAttribute('aria-label', words('decrease'));
    high.setAttribute('aria-label', words('increase'));
    const track = element('div', 'shop-story-dial-controls');
    track.append(low, range, high);
    range.addEventListener('input', () => {
      updateDial(Number(range.value));
    });
    dial.append(rangeLabel, display, track);
    container.append(dial, button(words('check'), {id: 'shop-story-check', primary: true}));
  }

  function updateDial(value) {
    taskState.value = Math.max(0, Math.min(10, value));
    body.querySelector('#shop-story-range').value = String(taskState.value);
    body.querySelector('output').textContent = String(taskState.value);
    setFeedback('');
  }

  function renderCue(container, current) {
    const cue = element('div', 'shop-story-cue');
    cue.id = 'shop-story-cue';
    cue.dataset.window = 'closed';
    const track = element('div', 'shop-story-cue-track');
    track.setAttribute('aria-hidden', 'true');
    const zone = element('div', 'shop-story-cue-zone');
    const marker = element('div', 'shop-story-cue-marker');
    const indicator = element('p', 'shop-story-cue-indicator', words('cueWait'));
    const center = 36 + storyNumber(story.id) % 31;
    const radius = 13;
    const period = 2250;
    zone.style.left = (center - radius) + '%';
    zone.style.width = (2 * radius) + '%';
    track.append(zone, marker);
    cue.append(track, indicator);
    container.append(cue, button(say(current.action), {id: 'shop-story-cue-action', primary: true}));

    const state = taskState;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    function animate(now) {
      state.cueStart ??= now;
      const position = (now - state.cueStart) % period / period * 100;
      if (!reducedMotion.matches) marker.style.left = position + '%';
      const open = Math.abs(position - center) <= radius;
      const cueWindow = open ? 'open' : 'closed';
      if (cue.dataset.window !== cueWindow) {
        cue.dataset.window = cueWindow;
        indicator.textContent = words(open ? 'cueNow' : 'cueWait');
      }
      state.cueOpen = open;
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
  }

  function renderTask() {
    const current = task();
    const container = element('section', 'shop-story-task');
    container.id = 'shop-story-task';
    container.dataset.kind = current.kind;
    container.append(hostLine(current.prompt));
    if (current.kind === 'find') renderFind(container, current);
    else if (current.kind === 'order') renderOrder(container, current);
    else if (current.kind === 'dial') renderDial(container);
    else if (current.kind === 'cue') renderCue(container, current);
    else throw new RangeError('Unknown shop story task');
    body.replaceChildren(container);
  }

  function renderDecision() {
    const choices = element('div', 'shop-story-choices shop-story-ending-choices');
    for (const [index, ending] of story.endings.entries()) {
      const option = button(say(ending.choice), {icon: '→'});
      option.dataset.storyChoice = String(index);
      choices.append(option);
    }
    body.replaceChildren(hostLine(story.question), choices);
  }

  function renderEnding() {
    const ending = story.endings[endingShown];
    const section = element('section', 'shop-story-ending');
    section.id = 'shop-story-ending';
    section.dataset.ending = String(endingShown);
    section.append(element('p', 'shop-story-ending-label', words('ending')),
      element('h3', 'shop-story-ending-title', say(ending.choice)), hostLine(ending.result));

    const seen = [0, 1].filter(index => entry.seen & (1 << index));
    section.append(element('p', 'shop-story-seen', `${words('endingsSeen')} · ${seen.length}/2`));
    if (seen.length > 1) {
      const choices = element('div', 'shop-story-ending-choices');
      for (const index of seen) {
        const option = button(say(story.endings[index].choice));
        option.dataset.storyEndingView = String(index);
        option.setAttribute('aria-pressed', String(endingShown === index));
        choices.append(option);
      }
      section.append(choices);
    }
    const actions = element('div', 'shop-story-footer');
    actions.append(
      button(words('returnToScene'), {id: 'shop-story-return', primary: true, icon: '↩'}),
      button(words('retry'), {id: 'shop-story-restart', icon: '↻'}),
    );
    section.append(actions);
    body.replaceChildren(section);
  }

  function render() {
    cancelCue();
    paintHeading();
    if (view === 'intro') renderIntro();
    else if (view === 'task') renderTask();
    else if (view === 'decision') renderDecision();
    else if (view === 'ending') renderEnding();
    else return;
    setFeedback(feedback);
  }

  function chooseOption(value) {
    const current = task();
    if (current.kind === 'find') {
      if (current.answer === value) win();
      else setFeedback('findWrong');
      return;
    }
    if (current.kind !== 'order' || taskState.selected.includes(value) || taskState.selected.length >= 3) return;
    taskState.selected.push(value);
    if (taskState.selected.length === 3) {
      if (taskState.selected.every((item, index) => item === index)) win();
      else {
        feedback = 'orderWrong';
        render();
        body.querySelector('#shop-story-reset').focus({preventScroll: true});
      }
    } else {
      feedback = '';
      render();
      body.querySelector('button[data-story-option]:not(:disabled)')?.focus({preventScroll: true});
    }
  }

  body.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const control = event.target.closest('button');
    if (!control || !dialog.open || control.disabled) return;
    if (control.id === 'shop-story-return') close();
    else if (view === 'intro' && control.id === 'shop-story-start') start();
    else if (view === 'task') {
      if (control.dataset.storyOption !== undefined) chooseOption(Number(control.dataset.storyOption));
      else if (control.id === 'shop-story-reset') {
        taskState.selected = [];
        feedback = '';
        render();
        body.querySelector('button[data-story-option]')?.focus({preventScroll: true});
      } else if (control.id === 'shop-story-dial-down') updateDial(taskState.value - 1);
      else if (control.id === 'shop-story-dial-up') updateDial(taskState.value + 1);
      else if (control.id === 'shop-story-check') {
        if (taskState.value === task().target) win();
        else setFeedback(taskState.value < task().target ? 'dialLow' : 'dialHigh');
      } else if (control.id === 'shop-story-cue-action') {
        if (taskState.cueOpen) win();
        else setFeedback('cueWrong');
      }
    } else if (view === 'decision' && control.dataset.storyChoice !== undefined) {
      if (advance(Number(control.dataset.storyChoice))) {
        render();
        body.querySelector('#shop-story-return').focus({preventScroll: true});
      }
    } else if (view === 'ending') {
      if (control.id === 'shop-story-restart') {
        try {
          if (reportProgress(onRestart(story))) {
            render();
            body.querySelector('#shop-story-start').focus({preventScroll: true});
          }
        } catch (error) {
          console.warn('Seoul Encore shop story could not restart.', error);
          setFeedback('unavailable');
        }
      } else if (control.dataset.storyEndingView !== undefined) {
        endingShown = Number(control.dataset.storyEndingView);
        render();
        body.querySelector('[data-story-ending-view][aria-pressed="true"]')?.focus({preventScroll: true});
      }
    }
  });

  function open(nextStory, nextEntry) {
    story = nextStory;
    storageNotice = false;
    transition(nextEntry);
    render();
    if (dialog.open) return;
    onOpen?.(story, entry);
    dialog.showModal();
    closeButton.focus({preventScroll: true});
  }

  return {
    open,
    close,
    isOpen: () => dialog.open,
    refresh() {
      if (!dialog.open) return;
      if (view === 'success') renderSuccess(successLine, document.activeElement?.id === 'shop-story-return');
      else render();
      setFeedback(feedback);
    },
  };
}
