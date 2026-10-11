/* Pathways to Financial Freedom: a guided, step-by-step explainer of the
   captive and brokerage agent paths, ending in a side-by-side calculator.

   Figures are example assumptions for illustration (captive figures follow
   American Income Life, a Globe Life company). They are not guarantees and
   vary by contract. */

(() => {
  const dialog = document.getElementById('pathways');
  if (!dialog) return;

  /* ---------- Compensation model ---------- */

  // World's Greatest Bonus (WGB): marginal tiers on month-to-date ALP,
  // like tax brackets. Non-chargebackable.
  const WGB_TIERS = [
    { lo: 0, hi: 2500, p: 0 },
    { lo: 2500, hi: 4250, p: 0.10 },
    { lo: 4250, hi: 10250, p: 0.19 },
    { lo: 10250, hi: 20250, p: 0.21 },
    { lo: 20250, hi: 30250, p: 0.23 },
    { lo: 30250, hi: Infinity, p: 0.29 },
  ];

  const DEFAULTS = {
    alp: 10000,      // monthly annualized life premium written
    chargeback: 25,  // % of commission lost to early lapses
    capCom: 60,      // captive commission level
    capAdv: 65,      // captive % advanced up front
    brkCom: 70,      // brokerage contract level
    brkAdv: 75,      // brokerage % advanced up front
  };

  const wgb = (alp) => WGB_TIERS.reduce((sum, t) => (
    alp > t.lo ? sum + (Math.min(alp, t.hi) - t.lo) * t.p : sum
  ), 0);

  function compare(o) {
    const keep = 1 - o.chargeback / 100;
    const capCom = o.alp * (o.capCom / 100);
    const brkCom = o.alp * (o.brkCom / 100);
    const cap = {
      advance: capCom * (o.capAdv / 100) * keep,
      bonus: wgb(o.alp),
      later: capCom * (1 - o.capAdv / 100) * keep,
    };
    cap.now = cap.advance + cap.bonus;
    cap.total = cap.now + cap.later;
    const brk = {
      advance: brkCom * (o.brkAdv / 100) * keep,
      bonus: 0,
      later: brkCom * (1 - o.brkAdv / 100) * keep,
    };
    brk.now = brk.advance;
    brk.total = brk.now + brk.later;
    return { cap, brk };
  }

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

  /* ---------- Content ---------- */

  const example = compare(DEFAULTS);
  const ex = {
    alp: usd(DEFAULTS.alp),
    capNow: usd(example.cap.now), capAdv: usd(example.cap.advance), capBonus: usd(example.cap.bonus),
    capLater: usd(example.cap.later), capTotal: usd(example.cap.total), capYear: usd(example.cap.total * 12),
    brkNow: usd(example.brk.now), brkLater: usd(example.brk.later),
    brkTotal: usd(example.brk.total), brkYear: usd(example.brk.total * 12),
  };

  const tierRows = WGB_TIERS.map((t, i) => `
    <tr><td>Tier ${i + 1}</td><td>${t.hi === Infinity ? usd(t.lo) + '+' : usd(t.lo) + ' – ' + usd(t.hi)}</td><td>${Math.round(t.p * 100)}%</td></tr>`).join('');

  const PATHS = {
    captive: {
      name: 'Captive Agent',
      tagline: 'One carrier, its leads, its system, and a weekly bonus on top.',
      steps: [
        {
          title: 'What a captive agent is',
          kicker: 'The basics',
          body: `
            <p class="pw-lede">A captive agent contracts with a single insurance company and sells only that company's products.</p>
            <p>A well-known example is <strong>American Income Life (AIL)</strong>, part of Globe Life. As an AIL agent you represent AIL's policies, follow its sales system, and work leads the company provides.</p>
            <div class="pw-points">
              <div><span>Carrier</span><b>One company</b></div>
              <div><span>Leads</span><b>Provided</b></div>
              <div><span>Status</span><b>Commission-based contractor</b></div>
            </div>
            <p>The trade is structure for flexibility: training, leads and a clear promotion ladder, in exchange for selling one company's products on its terms.</p>`,
        },
        {
          title: 'How the commission works',
          kicker: 'Getting paid',
          body: `
            <p class="pw-lede">You earn a percentage of each policy's <strong>annualized premium (ALP)</strong>, the yearly amount the client pays.</p>
            <p>In this example, a new captive agent earns <strong>60% commission</strong>. Most of it is <strong>advanced</strong>, meaning paid up front on a weekly check, and the rest is paid later as the policy stays active.</p>
            <div class="pw-split">
              <div class="pw-split-row"><span>Policy written</span><b>$1,000 ALP</b></div>
              <div class="pw-split-row"><span>Commission at 60%</span><b>$600</b></div>
              <div class="pw-split-row is-strong"><span>Advanced now (65%)</span><b>$390</b></div>
              <div class="pw-split-row"><span>Paid later (35%)</span><b>$210</b></div>
            </div>
            <p class="pw-note">If a policy cancels early, the unearned advance is charged back. That's why keeping clients on the books matters.</p>`,
        },
        {
          title: "The World's Greatest Bonus",
          kicker: 'The captive edge',
          body: `
            <p class="pw-lede">On top of commission, AIL pays a weekly production bonus called the <strong>World's Greatest Bonus (WGB)</strong>.</p>
            <p>It works like tax brackets: each tier's percentage applies only to the ALP inside that band, based on your month-to-date production. The more you write in a month, the higher the rate on every extra dollar.</p>
            <table class="pw-table"><thead><tr><th></th><th>Monthly ALP</th><th>Bonus</th></tr></thead><tbody>${tierRows}</tbody></table>
            <p class="pw-note">The WGB is <strong>non-chargebackable</strong>: once paid, it's yours even if a policy later lapses.</p>`,
        },
        {
          title: 'Promotions and overrides',
          kicker: 'Moving up',
          body: `
            <p class="pw-lede">Captive companies have a clear ladder. As you produce and build a team, your level and bonuses rise.</p>
            <div class="pw-ladder">
              <div><span>Agent</span><b>60%</b></div>
              <div><span>Supervising Agent (SA)</span><b>65%</b></div>
              <div><span>General Agent (GA)</span><b>67.5%</b></div>
              <div><span>Master General Agent (MGA)</span><b>75%</b></div>
            </div>
            <p>Leaders also earn training and leadership bonuses on their agents' WGB. For example, about 125% for an SA and 135% for a GA on direct agents, plus overrides on the difference between their level and their team's.</p>`,
        },
        {
          title: 'An example month',
          kicker: 'Putting it together',
          body: `
            <p class="pw-lede">Here's a captive agent writing <strong>${ex.alp} of ALP</strong> in a month, assuming 25% of commission is lost to early cancellations.</p>
            <div class="pw-split">
              <div class="pw-split-row"><span>Advance</span><b>${ex.capAdv}</b></div>
              <div class="pw-split-row"><span>Weekly bonus (WGB)</span><b>${ex.capBonus}</b></div>
              <div class="pw-split-row is-strong"><span>Paid this month</span><b>${ex.capNow}</b></div>
              <div class="pw-split-row"><span>Paid later</span><b>${ex.capLater}</b></div>
              <div class="pw-split-row is-total"><span>Total earned</span><b>${ex.capTotal}</b></div>
            </div>
            <p>Kept up for a year, that's roughly <strong>${ex.capYear}</strong>, before renewals and any leadership income.</p>`,
        },
        {
          title: 'The trade-offs',
          kicker: 'Is it for you?',
          body: `
            <div class="pw-proscons">
              <div><h4>Pros</h4><ul>
                <li>Leads provided, so you can start dialing right away</li>
                <li>Weekly bonus that can't be charged back</li>
                <li>Structured training and a clear promotion path</li>
                <li>Recognized company name on every call</li>
              </ul></div>
              <div><h4>Cons</h4><ul>
                <li>Lower base commission than many brokerage contracts</li>
                <li>One carrier, so fewer options for each client</li>
                <li>A larger share is held back and paid later</li>
                <li>You typically don't own your book if you leave</li>
              </ul></div>
            </div>`,
        },
      ],
    },
    brokerage: {
      name: 'Brokerage Agent',
      tagline: 'Many carriers, a higher contract level, and a book you build.',
      steps: [
        {
          title: 'What a brokerage agent is',
          kicker: 'The basics',
          body: `
            <p class="pw-lede">A brokerage (independent) agent contracts with several insurance companies through an agency, often called an IMO.</p>
            <p>Instead of selling one company's products, you shop the market and place each client with the carrier that fits their health, age and budget best.</p>
            <div class="pw-points">
              <div><span>Carriers</span><b>Many</b></div>
              <div><span>Leads</span><b>Depends on the agency</b></div>
              <div><span>Status</span><b>Independent contractor</b></div>
            </div>
            <p>The trade is flexibility for structure: more products and a higher payout, with more responsibility for your own pipeline.</p>`,
        },
        {
          title: 'How the commission works',
          kicker: 'Getting paid',
          body: `
            <p class="pw-lede">You earn a <strong>contract level</strong>, a percentage of each policy's <strong>annualized premium (ALP)</strong>.</p>
            <p>A common starting level is <strong>70% commission</strong>. Carriers usually <strong>advance</strong> about 75% of it, roughly the first 9 months, paid as soon as the policy is issued. The rest is paid as the policy stays active.</p>
            <div class="pw-split">
              <div class="pw-split-row"><span>Policy written</span><b>$1,000 ALP</b></div>
              <div class="pw-split-row"><span>Commission at 70%</span><b>$700</b></div>
              <div class="pw-split-row is-strong"><span>Advanced now (75%)</span><b>$525</b></div>
              <div class="pw-split-row"><span>Paid later (25%)</span><b>$175</b></div>
            </div>`,
        },
        {
          title: 'Chargebacks and persistency',
          kicker: 'Keeping what you earn',
          body: `
            <p class="pw-lede">An advance is money paid before it's fully earned. If a policy cancels early, the carrier takes back the unearned part. That's a <strong>chargeback</strong>.</p>
            <p>Chargebacks usually apply during the first 9 to 12 months and are prorated: a policy that lapses in month 2 costs more than one that lapses in month 8.</p>
            <div class="pw-points">
              <div><span>Persistency</span><b>% of policies that stay active</b></div>
              <div><span>Why it matters</span><b>Higher persistency, fewer chargebacks</b></div>
            </div>
            <p class="pw-note">Unlike the captive weekly bonus, there's no non-chargebackable bonus layer here, so client follow-up and retention protect your income.</p>`,
        },
        {
          title: 'Growing your income',
          kicker: 'Moving up',
          body: `
            <p class="pw-lede">In a brokerage, your contract level rises with your production and your team.</p>
            <div class="pw-ladder">
              <div><span>Starting level</span><b>70%</b></div>
              <div><span>Proven producer</span><b>80–100%</b></div>
              <div><span>Agency builder</span><b>100%+</b></div>
            </div>
            <p>Leaders earn overrides on the spread between their level and their agents' levels. You also earn <strong>renewals</strong> on policies that stay in force, and in many contracts the book of business is yours.</p>`,
        },
        {
          title: 'An example month',
          kicker: 'Putting it together',
          body: `
            <p class="pw-lede">Here's a brokerage agent at 70% writing <strong>${ex.alp} of ALP</strong> in a month, assuming 25% of commission is lost to early cancellations.</p>
            <div class="pw-split">
              <div class="pw-split-row is-strong"><span>Paid this month</span><b>${ex.brkNow}</b></div>
              <div class="pw-split-row"><span>Paid later</span><b>${ex.brkLater}</b></div>
              <div class="pw-split-row is-total"><span>Total earned</span><b>${ex.brkTotal}</b></div>
            </div>
            <p>Kept up for a year, that's roughly <strong>${ex.brkYear}</strong>, before renewals, overrides and contract-level increases.</p>`,
        },
        {
          title: 'The trade-offs',
          kicker: 'Is it for you?',
          body: `
            <div class="pw-proscons">
              <div><h4>Pros</h4><ul>
                <li>Higher starting commission and more advanced up front</li>
                <li>Many carriers, so you can fit every client</li>
                <li>Contract level grows with your production</li>
                <li>Renewals, and often ownership of your book</li>
              </ul></div>
              <div><h4>Cons</h4><ul>
                <li>No non-chargebackable weekly bonus</li>
                <li>Many agencies expect you to buy your own leads</li>
                <li>Less built-in structure, so more self-direction</li>
                <li>Income swings more with your persistency</li>
              </ul></div>
            </div>`,
        },
      ],
    },
  };

  /* ---------- Elements ---------- */

  const trailEl = dialog.querySelector('[data-pw-trail]');
  const stageEl = dialog.querySelector('[data-pw-stage]');
  const pathLabel = dialog.querySelector('[data-pw-path]');
  let state = { path: null, step: 0, reached: 0, view: 'choose', calcDone: false };
  let lastCalc = { ...DEFAULTS };
  let lastFocus = null;

  /* ---------- Open / close ---------- */

  function open() {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.documentElement.classList.add('pw-open');
    requestAnimationFrame(() => dialog.classList.add('is-open'));
    render();
    dialog.querySelector('.pw-close').focus();
    if (location.hash !== '#pathways') history.replaceState(null, '', '#pathways');
  }

  function close() {
    dialog.classList.remove('is-open');
    document.documentElement.classList.remove('pw-open');
    if (location.hash === '#pathways') history.replaceState(null, '', location.pathname + location.search);
    setTimeout(() => { dialog.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-pathways-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  dialog.querySelector('.pw-close').addEventListener('click', close);
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = dialog.querySelectorAll('button:not([disabled]), a[href], input, [tabindex="0"]');
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  if (location.hash === '#pathways') open();

  /* ---------- Rendering ---------- */

  function render() {
    renderTrail();
    stageEl.classList.remove('is-in');
    if (state.view === 'choose') stageEl.innerHTML = chooseView();
    else if (state.view === 'calc') stageEl.innerHTML = calcView();
    else if (state.view === 'next') stageEl.innerHTML = nextView();
    else stageEl.innerHTML = stepView();
    void stageEl.offsetWidth;
    stageEl.classList.add('is-in');
    stageEl.scrollTop = 0;
    bindStage();
    pathLabel.textContent = state.path ? PATHS[state.path].name : 'Choose a path';
  }

  function renderTrail() {
    const items = [{ label: 'Choose your path', view: 'choose', done: !!state.path }];
    if (state.path) {
      PATHS[state.path].steps.forEach((s, i) => items.push({
        label: s.title, view: 'step', index: i, done: i < state.reached, locked: i > state.reached,
      }));
      items.push({ label: 'Compare both paths', view: 'calc', done: state.calcDone, locked: state.reached < PATHS[state.path].steps.length, calc: true });
      items.push({ label: 'Your next step', view: 'next', locked: !state.calcDone, calc: true });
    }
    trailEl.innerHTML = items.map((it) => {
      const current = it.view === state.view && (it.view !== 'step' || it.index === state.step);
      const cls = ['pw-node', current && 'is-current', it.done && 'is-done', it.locked && 'is-locked', it.calc && 'is-calc'].filter(Boolean).join(' ');
      return `<li><button type="button" class="${cls}" data-view="${it.view}" ${it.index != null ? `data-index="${it.index}"` : ''} ${it.locked ? 'disabled aria-disabled="true"' : ''} ${current ? 'aria-current="step"' : ''}>
        <span class="pw-dot" aria-hidden="true"></span><span class="pw-node-label">${it.label}</span></button></li>`;
    }).join('');
    trailEl.querySelectorAll('button:not([disabled])').forEach((b) => b.addEventListener('click', () => {
      state.view = b.dataset.view;
      if (b.dataset.index != null) state.step = Number(b.dataset.index);
      render();
    }));
    const cur = trailEl.querySelector('.is-current');
    if (cur) cur.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function chooseView() {
    return `
      <p class="pw-kicker">Pathways to financial freedom</p>
      <h2 class="pw-title">Two ways to build a career <span class="serif">in life insurance.</span></h2>
      <p class="pw-lede">Pick a path to walk through how it works, how you get paid, and what a month can look like. You can switch paths any time.</p>
      <div class="pw-choices">
        ${['brokerage', 'captive'].map((k) => `
          <button type="button" class="pw-choice" data-choose="${k}">
            <span class="pw-choice-num">${k === 'brokerage' ? '01' : '02'}</span>
            <span class="pw-choice-name">${PATHS[k].name}</span>
            <span class="pw-choice-tag">${PATHS[k].tagline}</span>
            <span class="pw-choice-pay"><span>Example month at ${ex.alp} ALP</span><b>${k === 'brokerage' ? ex.brkTotal : ex.capTotal}</b></span>
            <span class="pw-choice-go">Start this path <span aria-hidden="true">→</span></span>
          </button>`).join('')}
      </div>`;
  }

  function stepView() {
    const path = PATHS[state.path];
    const s = path.steps[state.step];
    const last = state.step === path.steps.length - 1;
    return `
      <p class="pw-kicker">${path.name} <span class="pw-sep">/</span> Step ${state.step + 1} of ${path.steps.length} <span class="pw-sep">/</span> ${s.kicker}</p>
      <h2 class="pw-title">${s.title}</h2>
      <div class="pw-body">${s.body}</div>
      <div class="pw-actions">
        ${state.step > 0 ? '<button type="button" class="pw-back" data-back>← Back</button>' : '<span></span>'}
        <button type="button" class="btn btn-primary" data-next>${last ? 'Compare both paths' : 'Continue'} <span aria-hidden="true">→</span></button>
      </div>`;
  }

  function calcView() {
    const other = state.path === 'captive' ? 'brokerage' : 'captive';
    return `
      <p class="pw-kicker">Captive vs. brokerage calculator</p>
      <h2 class="pw-title">See the difference <span class="serif">in your numbers.</span></h2>
      <p class="pw-lede">Set your monthly production and see what each path pays now, later, and in total.</p>

      <div class="calc">
        <div class="calc-inputs">
          <label class="calc-field">
            <span class="calc-label">Monthly ALP written <b data-out="alp"></b></span>
            <input type="range" min="2000" max="60000" step="500" value="${DEFAULTS.alp}" data-in="alp" />
          </label>
          <div class="calc-presets">${[5000, 10000, 20000, 30000, 50000].map((v) => `<button type="button" data-preset="${v}">${usd(v)}</button>`).join('')}</div>
          <label class="calc-field">
            <span class="calc-label">Lost to early cancellations <b data-out="chargeback"></b></span>
            <input type="range" min="0" max="50" step="1" value="${DEFAULTS.chargeback}" data-in="chargeback" />
          </label>
          <details class="calc-more">
            <summary>Adjust the assumptions</summary>
            <div class="calc-grid">
              ${[['capCom', 'Captive commission', 40, 90], ['capAdv', 'Captive advanced up front', 0, 100], ['brkCom', 'Brokerage contract level', 50, 130], ['brkAdv', 'Brokerage advanced up front', 0, 100]]
                .map(([k, l, mn, mx]) => `<label class="calc-field"><span class="calc-label">${l} <b data-out="${k}"></b></span><input type="range" min="${mn}" max="${mx}" step="${k.endsWith('Com') ? 2.5 : 5}" value="${DEFAULTS[k]}" data-in="${k}" /></label>`).join('')}
            </div>
            <button type="button" class="pw-back" data-reset>Reset to standard assumptions</button>
          </details>
        </div>

        <div class="calc-results">
          ${['cap', 'brk'].map((k) => `
            <div class="calc-card" data-card="${k}">
              <p class="calc-card-name">${k === 'cap' ? 'Captive agent' : 'Brokerage agent'}</p>
              <p class="calc-total" data-res="${k}.total"></p>
              <p class="calc-year"><span data-res="${k}.year"></span> a year at this pace</p>
              <div class="calc-bar" aria-hidden="true"><span class="b-now" data-bar="${k}.now"></span><span class="b-later" data-bar="${k}.later"></span></div>
              <dl class="calc-lines">
                <div><dt>Advance</dt><dd data-res="${k}.advance"></dd></div>
                ${k === 'cap' ? '<div><dt>Weekly bonus (WGB)</dt><dd data-res="cap.bonus"></dd></div>' : ''}
                <div class="is-strong"><dt>Paid this month</dt><dd data-res="${k}.now"></dd></div>
                <div><dt>Paid later</dt><dd data-res="${k}.later"></dd></div>
                <div><dt>Effective rate on ALP</dt><dd data-res="${k}.rate"></dd></div>
              </dl>
            </div>`).join('')}
          <p class="calc-diff" data-diff></p>
        </div>
      </div>

      <h3 class="pw-subtitle">Key differences</h3>
      <div class="pw-compare">
        <div class="pw-compare-head"><span></span><span>Captive</span><span>Brokerage</span></div>
        ${[
          ['Carriers', 'One company', 'Many companies'],
          ['Commission', '60% to start', '70% to start'],
          ['Paid up front', '65% advanced weekly', '~75% advanced at issue'],
          ['Bonus', 'Weekly WGB, non-chargebackable', 'Usually none'],
          ['Leads', 'Provided by the company', 'Depends on the agency'],
          ['Your book', 'Usually stays with the company', 'Often yours, with renewals'],
          ['Growth', 'SA → GA → MGA ladder', 'Contract level rises with production'],
        ].map(([a, b, c]) => `<div class="pw-compare-row"><span>${a}</span><span>${b}</span><span>${c}</span></div>`).join('')}
      </div>

      <p class="pw-disclaimer">Illustration only. Captive figures follow American Income Life (a Globe Life company) and brokerage figures assume a 70% contract. Actual commission levels, advances, bonuses and chargebacks vary by contract and agent. Renewals and override income are not included.</p>

      <div class="pw-actions pw-actions-end">
        <button type="button" class="pw-back" data-switch="${other}">Walk through the ${PATHS[other].name.toLowerCase()} path</button>
        <button type="button" class="btn btn-primary" data-go-next>Your next step <span aria-hidden="true">→</span></button>
      </div>`;
  }

  function nextView() {
    const pathName = PATHS[state.path].name;
    const alp = usd(lastCalc.alp);
    const msg = `Hey! I went through the Pathways guide (${pathName}) and ran the numbers at ${alp} a month in ALP. I want to talk about getting started.`;
    return `
      <p class="pw-kicker">Your next step</p>
      <h2 class="pw-title">Whichever path you pick, <span class="serif">start with the systems.</span></h2>
      <p class="pw-lede">You explored the <strong>${pathName.toLowerCase()}</strong> path and ran the numbers at <strong>${alp}</strong> a month. Most new agents never get there because they're buying leads and dialing by hand. Our agents start with:</p>
      <div class="pw-offer">
        <div><span>01</span><b>Free AI dialer</b><em>for your first month</em></div>
        <div><span>02</span><b>Unlimited free leads</b><em>no lead bills, no warm market</em></div>
        <div><span>03</span><b>Retention software</b><em>keeps policies on the books</em></div>
        <div><span>04</span><b>Mentorship</b><em>real producers, real coaching</em></div>
      </div>
      <h3 class="pw-subtitle">What happens when you message</h3>
      <ol class="pw-next-steps">
        <li><b>You DM @casimirdz</b><span>Paste the message below, or say hi in your own words.</span></li>
        <li><b>A quick call</b><span>We go over the role, the pay, and whether it fits your goals.</span></li>
        <li><b>Licensed and plugged in</b><span>We guide your licensing, then set you up with the dialer and leads.</span></li>
      </ol>
      <div class="pw-message">
        <p class="pw-message-label">Your starter message</p>
        <p class="pw-message-text">${msg}</p>
      </div>
      <div class="pw-actions pw-actions-end">
        <button type="button" class="pw-back" data-close>Back to the site</button>
        <a class="btn btn-primary btn-lg" href="https://ig.me/m/casimirdz" target="_blank" rel="noopener" data-ig data-ig-msg="${msg.replace(/"/g, '&quot;')}">
          <svg class="ig" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" class="fill"/></svg>
          Copy message and DM @casimirdz
        </a>
      </div>`;
  }

  /* ---------- Stage interactions ---------- */

  function bindStage() {
    stageEl.querySelectorAll('[data-choose]').forEach((b) => b.addEventListener('click', () => {
      state = { path: b.dataset.choose, step: 0, reached: 0, view: 'step', calcDone: false };
      render();
    }));
    const next = stageEl.querySelector('[data-next]');
    if (next) next.addEventListener('click', () => {
      const total = PATHS[state.path].steps.length;
      if (state.step < total - 1) {
        state.step += 1;
        state.reached = Math.max(state.reached, state.step);
      } else {
        state.reached = total;
        state.view = 'calc';
      }
      render();
    });
    const back = stageEl.querySelector('[data-back]');
    if (back) back.addEventListener('click', () => { state.step -= 1; render(); });
    const sw = stageEl.querySelector('[data-switch]');
    if (sw) sw.addEventListener('click', () => {
      state = { path: sw.dataset.switch, step: 0, reached: 0, view: 'step', calcDone: false };
      render();
    });
    const goNext = stageEl.querySelector('[data-go-next]');
    if (goNext) goNext.addEventListener('click', () => { state.calcDone = true; state.view = 'next'; render(); });
    const closeBtn = stageEl.querySelector('[data-close]');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (state.view === 'calc') bindCalc();
    if (window.bindInstagramLinks) window.bindInstagramLinks(stageEl);
  }

  function bindCalc() {
    const inputs = stageEl.querySelectorAll('[data-in]');
    const vals = { ...lastCalc };
    inputs.forEach((i) => { i.value = vals[i.dataset.in]; });
    const update = () => {
      inputs.forEach((i) => { vals[i.dataset.in] = Number(i.value); });
      lastCalc = { ...vals };
      const r = compare(vals);
      const fmtOut = { alp: usd(vals.alp), chargeback: vals.chargeback + '%' };
      stageEl.querySelectorAll('[data-out]').forEach((o) => {
        const k = o.dataset.out;
        o.textContent = fmtOut[k] || vals[k] + '%';
      });
      const max = Math.max(r.cap.total, r.brk.total, 1);
      [['cap', r.cap], ['brk', r.brk]].forEach(([k, v]) => {
        const set = (f, txt) => { const el = stageEl.querySelector(`[data-res="${k}.${f}"]`); if (el) el.textContent = txt; };
        set('total', usd(v.total)); set('year', usd(v.total * 12)); set('advance', usd(v.advance));
        set('bonus', usd(v.bonus)); set('now', usd(v.now)); set('later', usd(v.later));
        set('rate', vals.alp ? (v.total / vals.alp * 100).toFixed(1) + '%' : '—');
        stageEl.querySelector(`[data-bar="${k}.now"]`).style.width = (v.now / max * 100) + '%';
        stageEl.querySelector(`[data-bar="${k}.later"]`).style.width = (v.later / max * 100) + '%';
      });
      const d = r.cap.total - r.brk.total;
      const lead = d >= 0 ? 'captive' : 'brokerage';
      stageEl.querySelectorAll('[data-card]').forEach((c) => c.classList.toggle('is-lead', Math.abs(d) >= 1 && c.dataset.card === (lead === 'captive' ? 'cap' : 'brk')));
      stageEl.querySelector('[data-diff]').innerHTML = Math.abs(d) < 1
        ? 'Both paths pay about the same at these numbers.'
        : `At these numbers the <b>${lead}</b> path earns <b>${usd(Math.abs(d))}</b> more a month, about <b>${usd(Math.abs(d) * 12)}</b> a year.`;
    };
    inputs.forEach((i) => i.addEventListener('input', update));
    stageEl.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => {
      stageEl.querySelector('[data-in="alp"]').value = b.dataset.preset; update();
    }));
    const reset = stageEl.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', () => {
      inputs.forEach((i) => { i.value = DEFAULTS[i.dataset.in]; }); update();
    });
    update();
  }
})();
