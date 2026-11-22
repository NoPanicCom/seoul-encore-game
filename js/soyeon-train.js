import { studioTravelSelection } from './studio.js';
import { dressedFigure, resolveLook } from './travel-look.js';
const key = 'encore1.soyeon-train.v1';
const costume = 'soyeon/jisoo-velvet';
const cloth = 'art/soyeon/velvet-train.webp';
const maximumLift = 100;
const labels = {
    tr: {
        dress: 'Bordo kadife elbiseyi giydir',
        leaveFitting: 'Hazırlığa devam et',
        outfit: 'Jisoo’nun bordo kadife elbisesi',
        dressed: 'Jisoo bordo kadife elbiseyi giydi.',
        fitting: 'Jisoo ile YG prova odasında',
        backstage: 'Jisoo ile kuliste',
        adjust: 'Kuyruğun ucunu tutup yukarı sürükle.',
        held: 'Kuyruk kalktı. Eteğin içinden sabitle.',
        pinned: 'Kuyruk sabitlendi. Jisoo merdivene hazır.',
        lift: 'Kuyruğu yukarı kaldır',
        amount: 'Kuyruğu kısaltma',
        pin: 'Kuyruğu sabitle',
        stairs: 'Merdivenden sahneye çık',
        climbing: 'Jisoo sahne merdiveninde',
    },
    ru: {
        dress: 'Надеть бордовое бархатное платье',
        leaveFitting: 'Продолжить подготовку',
        outfit: 'Джису в бордовом бархатном платье',
        dressed: 'Джису надела бордовое бархатное платье.',
        fitting: 'На примерке с Джису в YG',
        backstage: 'За кулисами с Джису',
        adjust: 'Возьми шлейф за край и потяни вверх.',
        held: 'Шлейф поднят. Закрепи его изнутри юбки.',
        pinned: 'Шлейф закреплён. Джису готова подняться по лестнице.',
        lift: 'Поднять шлейф',
        amount: 'Укорачивание шлейфа',
        pin: 'Закрепить шлейф',
        stairs: 'Подняться по лестнице на сцену',
        climbing: 'Джису поднимается на сцену',
    },
};
function readTrain() {
    try {
        const [phase, value, extra] = (localStorage.getItem(key) ?? '').split('|');
        if (extra !== undefined || !value || !/^(?:100|[1-9]?\d)$/.test(value))
            return null;
        const lift = Number(value);
        if (phase === 'dressed')
            return { phase, lift };
        if ((phase === 'pinned' || phase === 'stage') && lift === maximumLift)
            return { phase, lift };
    }
    catch {
        // The current tour remains playable when local storage is unavailable.
    }
    return null;
}
let current = readTrain();
function setTrain(next) {
    current = next;
    try {
        if (next)
            localStorage.setItem(key, `${next.phase}|${next.lift}`);
        else
            localStorage.removeItem(key);
    }
    catch {
        // The in-memory state stays active for this tour.
    }
}
export function resetTrain() { setTrain(null); }
export function trainPhase() { return current?.phase; }
export function dressVelvet() {
    if (current)
        return false;
    setTrain({ phase: 'dressed', lift: 0 });
    return true;
}
export function pinTrain() {
    if (current?.phase !== 'dressed' || current.lift !== maximumLift)
        return false;
    setTrain({ phase: 'pinned', lift: maximumLift });
    return true;
}
export function startStairs() {
    if (current?.phase !== 'pinned')
        return false;
    setTrain({ phase: 'stage', lift: maximumLift });
    return true;
}
function figure(lift, alt = '', interactive = false) {
    return `<span class="worn-look soyeon-figure" data-costume="${costume}" style="--soyeon-lift:${lift / maximumLift}">
    <img data-train-cloth src="${cloth}" alt="" draggable="false">
    <img class="soyeon-model" src="art/${costume}.webp" alt="${alt}" draggable="false">
    ${interactive ? '<span class="soyeon-handle" data-train-handle aria-hidden="true">↑</span>' : ''}
  </span>`;
}
export function velvetStageFigure(lang) {
    return trainPhase() === 'stage' ? figure(maximumLift, labels[lang].outfit) : '';
}
export function velvetFitting(lang) {
    const copy = labels[lang];
    const selected = studioTravelSelection('jisoo');
    const dressed = current !== null;
    const preview = current ? figure(current.lift, copy.outfit) :
        dressedFigure(selected ? resolveLook('jisoo', selected) : { asset: 'travel/jisoo-soundcheck', pieces: [] });
    return `<section class="soyeon-fitting" data-train-scene="fitting" data-dressed="${dressed}">
    <div class="soyeon-fitting-preview">${preview}</div>
    <div class="soyeon-fitting-copy"><h2>${copy.fitting}</h2>
      ${dressed ? `<p role="status">${copy.dressed}</p><button type="button" class="primary" data-act="soyeon-exit">${copy.leaveFitting} →</button>` :
        `<button type="button" class="primary" data-act="soyeon-dress">${copy.dress}</button>`}
    </div>
  </section>`;
}
export function velvetBackstage(lang) {
    if (!current)
        return '';
    const copy = labels[lang];
    const pinned = current.phase !== 'dressed';
    const ready = current.lift === maximumLift;
    return `<section class="soyeon-room" data-train-scene="backstage" data-train-lang="${lang}" data-train-ready="${ready}" data-train-pinned="${pinned}">
    <h2>${copy.backstage}</h2>
    <div class="soyeon-floor" data-train-machine>${figure(current.lift, copy.outfit, !pinned)}</div>
    <div class="soyeon-controls">
      <p data-train-status role="status">${pinned ? copy.pinned : ready ? copy.held : copy.adjust}</p>
      <progress data-train-progress max="${maximumLift}" value="${current.lift}" aria-label="${copy.amount}"></progress>
      ${pinned ? '' : `<div class="soyeon-actions"><button type="button" class="secondary" data-train-lift ${ready ? 'disabled' : ''}>${copy.lift}</button>
      <button type="button" class="primary" data-act="soyeon-pin" ${ready ? '' : 'disabled'}>${copy.pin}</button></div>`}
      <button type="button" class="primary" data-act="soyeon-stairs" ${pinned ? '' : 'disabled'}>${copy.stairs} ↑</button>
    </div>
  </section>`;
}
export function mountVelvetBackstage(root) {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const section = root.querySelector('[data-train-scene="backstage"]');
    const stage = section?.querySelector('[data-train-machine]');
    const dress = stage?.querySelector('.soyeon-figure');
    const alternate = section?.querySelector('[data-train-lift]');
    const pin = section?.querySelector('[data-act="soyeon-pin"]');
    const status = section?.querySelector('[data-train-status]');
    const meter = section?.querySelector('[data-train-progress]');
    if (!section || !stage || !dress || !alternate || !pin || !status || !meter || current?.phase !== 'dressed') {
        return () => controller.abort();
    }
    const copy = labels[section.dataset.trainLang === 'tr' ? 'tr' : 'ru'];
    let drag = null;
    const show = (lift) => {
        const ready = lift === maximumLift;
        dress.style.setProperty('--soyeon-lift', `${lift / maximumLift}`);
        meter.value = lift;
        section.dataset.trainReady = String(ready);
        alternate.disabled = ready;
        pin.disabled = !ready;
        const nextStatus = ready ? copy.held : copy.adjust;
        if (status.textContent !== nextStatus)
            status.textContent = nextStatus;
    };
    function commit(lift) {
        setTrain({ phase: 'dressed', lift });
        show(lift);
    }
    function dragLift(y) {
        if (!drag)
            return 0;
        const lift = drag.lift + Math.round((drag.y - y) * maximumLift / drag.distance);
        return Math.min(maximumLift, Math.max(0, lift));
    }
    alternate.addEventListener('click', () => {
        if (drag || current?.phase !== 'dressed')
            return;
        commit(maximumLift);
        pin.focus({ preventScroll: true });
    }, options);
    stage.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0 || drag || current?.phase !== 'dressed' || current.lift === maximumLift)
            return;
        if (!(event.target instanceof Element) || !event.target.closest('[data-train-handle],[data-train-cloth]'))
            return;
        event.preventDefault();
        const distance = Math.max(1, Math.min(90, stage.clientHeight * .24));
        drag = { id: event.pointerId, y: event.clientY, lift: current.lift, distance };
        stage.dataset.trainDragging = 'true';
        stage.setPointerCapture(event.pointerId);
    }, options);
    stage.addEventListener('pointermove', event => {
        if (drag?.id === event.pointerId)
            show(dragLift(event.clientY));
    }, options);
    stage.addEventListener('pointerup', event => {
        if (drag?.id !== event.pointerId)
            return;
        const lift = dragLift(event.clientY);
        drag = null;
        delete stage.dataset.trainDragging;
        commit(lift);
    }, options);
    stage.addEventListener('lostpointercapture', () => {
        if (!drag)
            return;
        drag = null;
        delete stage.dataset.trainDragging;
        show(current?.lift ?? 0);
    }, options);
    return () => controller.abort();
}
export function velvetStairs(lang) {
    const copy = labels[lang];
    return `<section class="soyeon-room" data-train-scene="stairs">
    <h2>${copy.climbing}</h2>
    <div class="soyeon-stairs"><div class="soyeon-stage-door" aria-hidden="true"></div>
      <div class="soyeon-treads" aria-hidden="true">${[4, 3, 2, 1, 0].map(index => `<span style="--soyeon-step:${index}"></span>`).join('')}</div>
      <div data-train-climber>${figure(maximumLift, copy.outfit)}</div>
    </div>
  </section>`;
}
export function mountVelvetStairs(root, onArrive) {
    const climber = root.querySelector('[data-train-climber]');
    if (!climber)
        return () => undefined;
    const controller = new AbortController();
    const arrive = () => {
        if (controller.signal.aborted)
            return;
        controller.abort();
        window.clearTimeout(timer);
        onArrive();
    };
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(arrive, noMotion ? 450 : 2900);
    climber.addEventListener('animationend', event => {
        if (event.target === climber)
            arrive();
    }, { signal: controller.signal });
    return () => {
        window.clearTimeout(timer);
        controller.abort();
    };
}
