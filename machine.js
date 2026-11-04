(() => {
  const $ = id => document.getElementById(id);
  const icons = ['✈', '☀', '☾', '✿', '♫', '⚡', '★', '❄', '☂', '⚓'];
  let cards = [], open = [], matched = 0, moves = 0, started = 0, clock = null, flipTimer = null, locked = false;
  const readBest = key => { try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; } };
  const saveBest = (key, value) => { try { localStorage.setItem(key, String(value)); } catch { /* Play remains available without storage. */ } };
  const bestKey = () => `learning-memory-${$('memory-level').value}`;
  function updateTime() {
    const seconds = started ? Math.floor((performance.now() - started) / 1000) : 0;
    $('elapsed').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }
  function resetMemory() {
    clearInterval(clock); clearTimeout(flipTimer); clock = null;
    open = []; matched = 0; moves = 0; started = 0; locked = false;
    const pairs = Number($('memory-level').value);
    const deck = [...icons.slice(0, pairs), ...icons.slice(0, pairs)];
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    $('memory-board').replaceChildren();
    cards = deck.map((icon, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'memory-card';
      button.setAttribute('aria-label', `Card ${index + 1}, face down`);
      const face = document.createElement('span'); face.className = 'card-face'; face.textContent = icon; face.setAttribute('aria-hidden', 'true');
      const back = document.createElement('span'); back.className = 'card-back'; back.textContent = '+'; back.setAttribute('aria-hidden', 'true');
      button.append(face, back); button.addEventListener('click', () => flip(index));
      $('memory-board').append(button); return { icon, button, matched: false };
    });
    $('moves').textContent = '0'; $('matches').textContent = `0 / ${pairs}`; updateTime();
    $('memory-best').textContent = readBest(bestKey()) || '—';
    $('memory-status').textContent = 'Choose a card to begin. The timer starts with your first flip.';
  }
  function flip(index) {
    const card = cards[index];
    if (locked || card.matched || open.includes(index)) return;
    if (!started) { started = performance.now(); clock = setInterval(updateTime, 250); }
    card.button.classList.add('flipped'); card.button.setAttribute('aria-label', `Card ${index + 1}: ${card.icon}`); card.button.setAttribute('aria-pressed', 'true');
    open.push(index);
    if (open.length !== 2) return;
    moves++; $('moves').textContent = moves;
    const [a,b] = open;
    if (cards[a].icon === cards[b].icon) {
      matched++; $('matches').textContent = `${matched} / ${cards.length / 2}`;
      open.forEach(i => { cards[i].matched = true; cards[i].button.classList.add('matched'); cards[i].button.setAttribute('aria-label', `Card ${i + 1}: ${cards[i].icon}, matched`); cards[i].button.setAttribute('aria-disabled', 'true'); });
      open = [];
      $('memory-status').textContent = 'A perfect pair. Keep going!';
      if (matched === cards.length / 2) {
        clearInterval(clock); updateTime();
        const best = readBest(bestKey()); if (!best || moves < best) saveBest(bestKey(), moves);
        $('memory-best').textContent = readBest(bestKey()) || moves;
        $('memory-status').textContent = `You did it! All pairs found in ${moves} moves and ${$('elapsed').textContent}. Play again to beat your best.`;
      }
    } else {
      locked = true; $('memory-status').textContent = 'Not a match. Remember these for your next turn.';
      flipTimer = setTimeout(() => {
        open.forEach(i => { cards[i].button.classList.remove('flipped'); cards[i].button.setAttribute('aria-label', `Card ${i + 1}, face down`); cards[i].button.setAttribute('aria-pressed', 'false'); });
        open = []; locked = false;
      }, 850);
    }
  }
  $('memory-reset').addEventListener('click', resetMemory); $('memory-level').addEventListener('change', resetMemory); resetMemory();

  let reactionState = 'idle', waitTimer = null, readyAt = 0, rounds = [];
  function setPad(state, title, detail, symbol) {
    reactionState = state; $('reaction-pad').dataset.state = state;
    $('reaction-title-text').textContent = title; $('reaction-detail').textContent = detail; $('reaction-symbol').textContent = symbol;
  }
  function cancelWait() { clearTimeout(waitTimer); waitTimer = null; }
  $('reaction-pad').addEventListener('click', () => {
    if (reactionState === 'waiting') {
      cancelWait(); setPad('early', 'A little too soon.', 'Tap to try again. Wait for green!', '↻'); return;
    }
    if (reactionState === 'ready') {
      const time = Math.round(performance.now() - readyAt); rounds.push(time);
      const result = document.createElement('li'); result.textContent = `Round ${rounds.length} · ${time} ms`; $('reaction-results').append(result);
      const average = Math.round(rounds.reduce((a,b) => a+b,0) / rounds.length);
      $('reaction-summary').textContent = `${rounds.length} / 5 rounds · Best ${Math.min(...rounds)} ms · Average ${average} ms`;
      if (rounds.length === 5) setPad('complete', `${average} ms average`, 'Five rounds complete. Tap to start a fresh session.', '✓');
      else setPad('result', `${time} ms`, 'Nice timing. Tap for the next round.', '↗');
      return;
    }
    if (reactionState === 'complete') resetReaction();
    setPad('waiting', 'Wait for green…', 'Hold on. Your moment is coming.', '···');
    waitTimer = setTimeout(() => { readyAt = performance.now(); setPad('ready', 'Go. Go. Go!', 'Tap now!', '↓'); }, 1600 + Math.random() * 2600);
  });
  // Native button activation supports keyboard and touch without double-counting pointer events.
  $('reaction-pad').addEventListener('keydown', e => { if (e.repeat && (e.key === ' ' || e.key === 'Enter')) e.preventDefault(); });
  function resetReaction() {
    cancelWait(); rounds = []; $('reaction-results').replaceChildren();
    $('reaction-summary').textContent = 'No rounds yet. Your next personal best starts here.';
    setPad('idle', 'Tap to get ready', 'Or focus here and press Space / Enter', '◎');
  }
  $('reaction-reset').addEventListener('click', resetReaction);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && ['waiting','ready'].includes(reactionState)) {
      cancelWait(); setPad('idle', 'Round paused.', 'Tap to start again when you are ready.', '◎');
    }
  });

  let attempts = 0, machineTimer = null, audioContext = null;
  function playSwitchChime() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      audioContext ||= new AudioContextClass();
      const ring = () => {
        const start = audioContext.currentTime;
        // A soft bell: a clear fundamental and a quiet upper harmonic.
        [1046.5, 2093].forEach((frequency, index) => {
          const tone = audioContext.createOscillator();
          const volume = audioContext.createGain();
          tone.type = 'sine'; tone.frequency.value = frequency;
          volume.gain.setValueAtTime(0, start);
          volume.gain.linearRampToValueAtTime(index ? 0.025 : 0.12, start + 0.008);
          volume.gain.exponentialRampToValueAtTime(0.001, start + 0.7);
          tone.connect(volume); volume.connect(audioContext.destination);
          tone.start(start); tone.stop(start + 0.75);
          tone.onended = () => { tone.disconnect(); volume.disconnect(); };
        });
      };
      if (audioContext.state === 'suspended') audioContext.resume().then(ring).catch(() => {});
      else ring();
    } catch { /* Keep the switch interactive when audio is unavailable. */ }
  }
  $('switchBtn').addEventListener('click', () => {
    if ($('switchBtn').getAttribute('aria-checked') === 'true') return;
    playSwitchChime();
    attempts++; $('switchBtn').setAttribute('aria-checked', 'true'); $('switch-label').textContent = 'ON';
    document.querySelector('.machine-stage').classList.add('awake');
    $('machineMessage').textContent = ['Wait… who turned on the lights?', 'We have talked about this.', 'Fine. Just for a second.', 'You are impressively persistent.'][(attempts - 1) % 4];
    machineTimer = setTimeout(() => {
      $('switchBtn').setAttribute('aria-checked', 'false'); $('switch-label').textContent = 'OFF'; document.querySelector('.machine-stage').classList.remove('awake');
      $('machineMessage').textContent = `Back to doing nothing. Switches politely declined: ${attempts}.`;
    }, 800 + Math.random() * 900);
  });
  window.addEventListener('pagehide', () => { clearInterval(clock); clearTimeout(flipTimer); cancelWait(); clearTimeout(machineTimer); });
})();
