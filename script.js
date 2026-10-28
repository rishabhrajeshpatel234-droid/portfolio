/**
 * RISHABH PATEL - PERSONAL PORTFOLIO
 * Complete Vanilla JavaScript Controller (17 Modular Features)
 *
 * SECTION DIRECTORY:
 * 1. Web Audio API Chime Synthesizer
 * 2. Talking Doraemon (Web Speech API + Mute Toggle)
 * 3. Eyes & Blinking (Pupil tracking + Random blinks)
 * 4. Dorayaki Cursor Trail (Desktop only, max 15 particles)
 * 5. Flying Doraemon Scroll Engine (Propeller spins only on scroll, forward/backward tilt)
 * 6. Sleep Mode (Idle 10s -> Slump + Floating Zzz, wake with startled bounce)
 * 7. Dorayaki Catching Mini-Game (Falling items, score tracking, Hire Me badge)
 * 8. Mouse Panic Easter Egg (40-60s interval, shivering, click to relieve)
 * 9. Translation Konnyaku Language Toggle (EN / HI / JA + Munch animation)
 * 10. Small Light Dark Mode (Spotlight cursor mask + Starry sky)
 * 11. 4-D Pocket Projects Section (Click pocket to pop cards one-by-one)
 * 12. Time Machine Journey Timeline
 * 13. Dokodemo Mail Contact Form (Paper plane flies into Anywhere Door)
 * 14. Konami Code Secret Listener
 * 15. Gadget Reveal Loading Screen
 * 16. Dorayaki Scroll Progress Bar (Eaten with bite marks on scroll)
 * 17. Anywhere Door, Gulliver Tunnel & Big Light Transitions
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. WEB AUDIO API CHIME SYNTHESIZER (No external audio files)
  // =========================================================================
  let audioCtx = null;
  let isMuted = false;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  document.addEventListener('pointerdown', () => initAudioContext(), { once: true });
  document.addEventListener('keydown', () => initAudioContext(), { once: true });

  function playTone(freq, type = 'sine', startTime = 0, duration = 0.45, maxGain = 0.2) {
    if (isMuted) return;
    const ctx = initAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime + startTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(maxGain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // Chime 1: Pleasant 3-note bell chime (C6, E6, G6)
  function playDoraemonChime() {
    playTone(1046.50, 'sine', 0, 0.45, 0.22);
    playTone(1318.51, 'sine', 0.08, 0.45, 0.20);
    playTone(1567.98, 'sine', 0.16, 0.50, 0.18);
  }

  // Chime 2: Shimmering Big Light Chime (D5, A5, D6, F#6)
  function playBigLightChime() {
    [587.33, 880.00, 1174.66, 1479.98].forEach((freq, idx) => {
      playTone(freq, 'triangle', idx * 0.06, 0.6, 0.15);
    });
  }

  // Chime 3: Relief Chime (When mouse is banished)
  function playReliefChime() {
    playTone(523.25, 'sine', 0, 0.35, 0.18);
    playTone(659.25, 'sine', 0.1, 0.4, 0.18);
    playTone(783.99, 'sine', 0.2, 0.5, 0.22);
  }

  // Chime 4: Victory / Hire-Me Fanfare
  function playVictoryFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => playTone(freq, 'triangle', i * 0.1, 0.4, 0.2));
    playTone(1318.51, 'sine', 0.45, 0.8, 0.25);
  }

  // Chime 5: Munch / Bite sound for Konnyaku
  function playMunchSound() {
    playTone(320, 'square', 0, 0.08, 0.1);
    playTone(220, 'triangle', 0.08, 0.12, 0.12);
  }

  // =========================================================================
  // 2. TALKING DORAEMON (Web Speech API + Mute Toggle)
  // =========================================================================
  const audioMuteToggle = document.getElementById('audio-mute-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (audioMuteToggle) {
    audioMuteToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    });
  }

  function speakDoraemonGreeting(text) {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.35; // Cheerful cartoonish pitch
      utterance.rate = 1.05;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  // =========================================================================
  // 3. EYES AND BLINKING (Pupils Follow Cursor + Random Blinks)
  // =========================================================================
  const pupilLeftGroup = document.getElementById('pupil-left-group');
  const pupilRightGroup = document.getElementById('pupil-right-group');
  const doraemonEyesGroup = document.getElementById('doraemon-eyes-group');
  const doraemonClickable = document.getElementById('doraemon-clickable');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  function updatePupils() {
    if (!pupilLeftGroup || !pupilRightGroup || !doraemonClickable) return;
    if (prefersReducedMotion) return;

    const rect = doraemonClickable.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width * 0.5;
    const eyeCenterY = rect.top + rect.height * 0.28;

    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
    const dist = Math.min(Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) * 0.04, 3.8);

    const pupilDx = Math.cos(angle) * dist;
    const pupilDy = Math.sin(angle) * dist;

    pupilLeftGroup.style.transform = `translate(${pupilDx.toFixed(1)}px, ${pupilDy.toFixed(1)}px)`;
    pupilRightGroup.style.transform = `translate(${pupilDx.toFixed(1)}px, ${pupilDy.toFixed(1)}px)`;
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updatePupils();
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      updatePupils();
    }
  }, { passive: true });

  // Random eye blinking every 3 to 6 seconds
  function scheduleNextBlink() {
    if (prefersReducedMotion) return;
    const delay = Math.random() * 3000 + 3000; // 3 - 6 seconds
    setTimeout(() => {
      if (doraemonEyesGroup) {
        doraemonEyesGroup.classList.add('is-blinking');
        setTimeout(() => {
          doraemonEyesGroup.classList.remove('is-blinking');
          scheduleNextBlink();
        }, 160);
      } else {
        scheduleNextBlink();
      }
    }, delay);
  }
  scheduleNextBlink();

  // =========================================================================
  // 4. DORAYAKI CURSOR TRAIL (Desktop Only, Cap ~15, 600ms Lifetime)
  // =========================================================================
  const trailContainer = document.getElementById('dorayaki-trail-container');
  let activeParticleCount = 0;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let lastTrailTime = 0;

  if (!isTouchDevice && !prefersReducedMotion && trailContainer) {
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastTrailTime < 45) return; // Throttle spawn rate
      if (activeParticleCount >= 15) return;

      lastTrailTime = now;
      activeParticleCount++;

      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      particle.textContent = Math.random() > 0.4 ? '🥞' : '🔔';

      trailContainer.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        activeParticleCount = Math.max(0, activeParticleCount - 1);
      }, 600);
    }, { passive: true });
  }

  // =========================================================================
  // 5. FLYING DORAEMON SCROLL ENGINE (NO IDLE BOB, BRAKING PROPELLER)
  // =========================================================================
  const flyingDoraemon = document.getElementById('flying-doraemon');
  const takeCopterRotor = document.getElementById('take-copter-rotor');
  const doraemonSparkles = document.getElementById('doraemon-sparkles');
  const typingText = document.getElementById('typing-text');

  let lastScrollY = window.scrollY;
  let targetTilt = 0;
  let currentTilt = 0;
  let propellerAngle = 0;
  let propellerSpeed = 0;
  let isScrolling = false;
  let scrollStopTimer = null;
  let currentOffsetX = 0;
  let currentOffsetY = 0;

  function calculateFlightCoordinates(scrollTop) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    const windowWidth = window.innerWidth;

    if (windowWidth <= 640) {
      currentOffsetX = 0;
      currentOffsetY = 0;
    } else {
      const amplitudeX = Math.min(windowWidth * 0.22, 260);
      currentOffsetX = Math.sin(progress * Math.PI * 2) * -amplitudeX;
      const maxOffsetY = Math.min(window.innerHeight * 0.45, 340);
      currentOffsetY = progress * maxOffsetY;
    }
    return progress;
  }

  window.addEventListener('scroll', () => {
    wakeDoraemon(); // Any scroll wakes sleep mode
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const deltaY = scrollTop - lastScrollY;

    if (deltaY > 1) {
      targetTilt = 12; // Forward tilt
    } else if (deltaY < -1) {
      targetTilt = -12; // Backward tilt
    }

    propellerSpeed = 38; // Fast spin on scroll
    isScrolling = true;

    if (scrollStopTimer) clearTimeout(scrollStopTimer);
    scrollStopTimer = setTimeout(() => {
      isScrolling = false;
    }, 120);

    const progress = calculateFlightCoordinates(scrollTop);
    updateSpeechOnScroll(progress);
    updateDorayakiProgressBar(progress);

    lastScrollY = scrollTop;
  }, { passive: true });

  // 60FPS Physics Animation Loop
  function flightPhysicsLoop() {
    if (!prefersReducedMotion) {
      // Propeller braking
      if (propellerSpeed > 0.05) {
        propellerAngle = (propellerAngle + propellerSpeed) % 360;
        if (!isScrolling) {
          propellerSpeed *= 0.91; // Fast braking
        }
        if (takeCopterRotor) {
          takeCopterRotor.style.transform = `rotate(${propellerAngle}deg)`;
        }
      } else if (propellerSpeed !== 0) {
        propellerSpeed = 0;
      }

      // Smooth tilting physics
      if (!isScrolling) {
        targetTilt *= 0.88;
        if (Math.abs(targetTilt) < 0.05) targetTilt = 0;
      }
      currentTilt += (targetTilt - currentTilt) * 0.12;

      if (flyingDoraemon && !flyingDoraemon.classList.contains('is-sleeping')) {
        flyingDoraemon.style.transform = `translate3d(${currentOffsetX.toFixed(2)}px, ${currentOffsetY.toFixed(2)}px, 0) rotate(${currentTilt.toFixed(2)}deg)`;
      }
    }
    window.requestAnimationFrame(flightPhysicsLoop);
  }
  window.requestAnimationFrame(flightPhysicsLoop);

  // Doraemon Click Action: Talks, chimes, bounces, and sparkles
  if (doraemonClickable) {
    doraemonClickable.addEventListener('click', (e) => {
      e.stopPropagation();
      wakeDoraemon();

      playDoraemonChime();

      // Voice greeting aloud
      const spokenGreeting = "Hi, I'm Rishabh's Doraemon. Welcome to his portfolio!";
      speakDoraemonGreeting(spokenGreeting);
      triggerSpeechDialogue(spokenGreeting);

      // Bounce
      doraemonClickable.classList.remove('is-bouncing');
      void doraemonClickable.offsetWidth;
      doraemonClickable.classList.add('is-bouncing');
      setTimeout(() => doraemonClickable.classList.remove('is-bouncing'), 450);

      // Sparkles
      if (doraemonSparkles) {
        doraemonSparkles.classList.remove('is-sparkling');
        void doraemonSparkles.offsetWidth;
        doraemonSparkles.classList.add('is-sparkling');
        setTimeout(() => doraemonSparkles.classList.remove('is-sparkling'), 650);
      }
    });
  }

  // =========================================================================
  // 6. SLEEP MODE (Idle 10 Seconds -> Slump + Floating Zzz)
  // =========================================================================
  let idleTimer = null;
  let isDoraemonSleeping = false;

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      putDoraemonToSleep();
    }, 10000); // 10 seconds idle
  }

  function putDoraemonToSleep() {
    if (prefersReducedMotion) return;
    if (isDoraemonSleeping || !flyingDoraemon) return;
    isDoraemonSleeping = true;
    flyingDoraemon.classList.add('is-sleeping');
    triggerSpeechDialogue("Zzz... Doraemon is taking a quick catnap! 😴");
  }

  function wakeDoraemon() {
    resetIdleTimer();
    if (!isDoraemonSleeping || !flyingDoraemon) return;
    isDoraemonSleeping = false;
    flyingDoraemon.classList.remove('is-sleeping');

    // Startled bounce
    flyingDoraemon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    flyingDoraemon.style.transform = `translate3d(${currentOffsetX.toFixed(2)}px, ${currentOffsetY.toFixed(2)}px, 0) scale(1.15)`;
    setTimeout(() => {
      flyingDoraemon.style.transition = '';
      triggerSpeechDialogue("Waaah! I'm awake! Ready to explore code with Rishabh!");
      playTone(880, 'sine', 0, 0.2, 0.15);
    }, 300);
  }

  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, wakeDoraemon, { passive: true });
  });
  resetIdleTimer();

  // =========================================================================
  // 7. DORAYAKI CATCHING MINI-GAME
  // =========================================================================
  const openGameBtn = document.getElementById('open-game-btn');
  const miniGameModal = document.getElementById('mini-game-modal');
  const gameCloseBtn = document.getElementById('game-close-btn');
  const gameStartBtn = document.getElementById('game-start-btn');
  const gameRestartBtn = document.getElementById('game-restart-btn');
  const gameArena = document.getElementById('game-arena');
  const playerCatcher = document.getElementById('player-catcher');
  const scoreDisplay = document.getElementById('game-score-display');
  const victoryBanner = document.getElementById('game-victory-banner');

  let gameScore = 0;
  let gameRunning = false;
  let playerX = 200;
  let gameItems = [];
  let gameLoopId = null;
  let itemSpawnTimer = null;

  function openGame() {
    if (!miniGameModal) return;
    miniGameModal.classList.add('is-active');
    miniGameModal.setAttribute('aria-hidden', 'false');
    resetGame();
  }

  function closeGame() {
    if (!miniGameModal) return;
    stopGame();
    miniGameModal.classList.remove('is-active');
    miniGameModal.setAttribute('aria-hidden', 'true');
  }

  function resetGame() {
    stopGame();
    gameScore = 0;
    if (scoreDisplay) scoreDisplay.textContent = '0';
    if (victoryBanner) victoryBanner.classList.remove('is-won');
    clearGameArena();
    playerX = gameArena ? gameArena.clientWidth / 2 : 200;
    updateCatcherPosition();
  }

  function clearGameArena() {
    if (!gameArena) return;
    const items = gameArena.querySelectorAll('.falling-dorayaki');
    items.forEach((it) => it.remove());
    gameItems = [];
  }

  function startGame() {
    resetGame();
    gameRunning = true;
    if (gameStartBtn) gameStartBtn.style.display = 'none';

    // Item spawner loop
    itemSpawnTimer = setInterval(() => {
      if (!gameRunning || !gameArena) return;
      spawnFallingDorayaki();
    }, 850);

    // Frame update loop
    function updateGameFrame() {
      if (!gameRunning) return;
      const arenaH = gameArena.clientHeight;

      for (let i = gameItems.length - 1; i >= 0; i--) {
        const item = gameItems[i];
        item.y += item.speed;
        item.el.style.top = `${item.y}px`;

        // Check catch collision
        const catcherY = arenaH - 70;
        if (item.y >= catcherY - 20 && item.y <= catcherY + 20) {
          if (Math.abs(item.x - playerX) < 40) {
            // Caught!
            playTone(987.77, 'sine', 0, 0.15, 0.15); // catch beep
            item.el.remove();
            gameItems.splice(i, 1);
            gameScore++;
            if (scoreDisplay) scoreDisplay.textContent = gameScore;

            if (gameScore >= 10) {
              winGame();
            }
            continue;
          }
        }

        // Missed item reaches ground
        if (item.y > arenaH + 40) {
          item.el.remove();
          gameItems.splice(i, 1);
        }
      }

      gameLoopId = requestAnimationFrame(updateGameFrame);
    }
    gameLoopId = requestAnimationFrame(updateGameFrame);
  }

  function spawnFallingDorayaki() {
    if (!gameArena) return;
    const arenaW = gameArena.clientWidth;
    const x = Math.random() * (arenaW - 60) + 30;
    const el = document.createElement('div');
    el.className = 'falling-dorayaki';
    el.textContent = '🥞';
    el.style.left = `${x}px`;
    el.style.top = `-40px`;
    gameArena.appendChild(el);

    gameItems.push({
      el: el,
      x: x,
      y: -40,
      speed: Math.random() * 2 + 3.2
    });
  }

  function winGame() {
    stopGame();
    playVictoryFanfare();
    if (victoryBanner) victoryBanner.classList.add('is-won');
  }

  function stopGame() {
    gameRunning = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (itemSpawnTimer) clearInterval(itemSpawnTimer);
    if (gameStartBtn) gameStartBtn.style.display = 'inline-block';
  }

  function updateCatcherPosition() {
    if (!playerCatcher || !gameArena) return;
    const maxW = gameArena.clientWidth;
    playerX = Math.max(30, Math.min(playerX, maxW - 30));
    playerCatcher.style.left = `${playerX}px`;
  }

  // Controls: Keyboard
  window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      playerX -= 25;
      updateCatcherPosition();
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      playerX += 25;
      updateCatcherPosition();
    }
  });

  // Controls: Mouse and Touch Drag in Arena
  if (gameArena) {
    gameArena.addEventListener('mousemove', (e) => {
      if (!gameRunning) return;
      const rect = gameArena.getBoundingClientRect();
      playerX = e.clientX - rect.left;
      updateCatcherPosition();
    });

    gameArena.addEventListener('touchmove', (e) => {
      if (!gameRunning || !e.touches[0]) return;
      const rect = gameArena.getBoundingClientRect();
      playerX = e.touches[0].clientX - rect.left;
      updateCatcherPosition();
    }, { passive: true });
  }

  if (openGameBtn) openGameBtn.addEventListener('click', openGame);
  if (gameCloseBtn) gameCloseBtn.addEventListener('click', closeGame);
  if (gameStartBtn) gameStartBtn.addEventListener('click', startGame);
  if (gameRestartBtn) gameRestartBtn.addEventListener('click', startGame);

  // =========================================================================
  // 8. MOUSE PANIC EASTER EGG (Random 40-60s interval)
  // =========================================================================
  const panicMouse = document.getElementById('panic-mouse');

  function triggerMousePanic() {
    if (prefersReducedMotion || !panicMouse || !flyingDoraemon) return;

    panicMouse.classList.remove('is-running');
    void panicMouse.offsetWidth;
    panicMouse.classList.add('is-running');

    // Doraemon detects mouse and panics
    flyingDoraemon.classList.add('is-panicking');
    triggerSpeechDialogue("EEEEK!! A MOUSE! SOMEBODY CLICK IT QUICK!! 🐭💥");
    playTone(180, 'sawtooth', 0, 0.4, 0.2);

    // Timeout if user doesn't click mouse
    setTimeout(() => {
      if (panicMouse.classList.contains('is-running')) {
        panicMouse.classList.remove('is-running');
        flyingDoraemon.classList.remove('is-panicking');
      }
    }, 5000);
  }

  if (panicMouse) {
    panicMouse.addEventListener('click', (e) => {
      e.stopPropagation();
      panicMouse.classList.remove('is-running');
      if (flyingDoraemon) flyingDoraemon.classList.remove('is-panicking');

      playReliefChime();
      triggerSpeechDialogue("Phew! Thank goodness you banished that mouse! 💙✨");
    });
  }

  // Schedule mouse runs every 40-60 seconds
  setInterval(() => {
    triggerMousePanic();
  }, Math.random() * 20000 + 40000);

  // =========================================================================
  // 9. TRANSLATION KONNYAKU LANGUAGE TOGGLE (EN / HI / JA)
  // =========================================================================
  const translations = {
    en: {
      nav_home: "Home", nav_about: "About", nav_projects: "Projects",
      nav_skills: "Skills", nav_journey: "Journey", nav_contact: "Contact",
      nav_door: "Door", play_game: "Play",
      hero_badge: "Kon'nichiwa! Welcome to my pocket of the web",
      hero_greeting: "Hi, I'm",
      hero_nst: "🎓 Student at NST (Newton School of Technology)",
      hero_desc: "I am a curious Python beginner exploring the intricate world of Computer Systems and the frontiers of Artificial Intelligence. Step inside to discover my projects, skills, and coding adventures!",
      cta_open_door: "Open Anywhere Door to About Me",
      cta_view_projects: "View 4D Projects",
      hero_hint: "Doraemon's Secret Hint: Click the Anywhere Door or 4D Pocket to travel, or click me anytime to chat and play my bell chime!",
      about_tag: "📖 CHAPTER 01", about_title_pre: "About",
      about_lead: "From basic print statements to dissecting systems and crafting intelligent algorithms.",
      bio_heading: "Who am I?",
      bio_p1: "Hey there! I'm Rishabh Patel, currently studying at Newton School of Technology (NST).",
      bio_p2: "I'm a Python beginner, learning the core foundations of software development, diving deep into computer systems architecture, and fascinated by AI.",
      gadget_skills_title: "🎒 My Doraemon Developer Gadgets",
      tt_python: "Take-copter: Soars freely through logic, automation scripts, and algorithmic puzzles!",
      tt_git: "Time Machine: Jump backward or forward to any code commit without losing a second!",
      tt_github: "Anywhere Door: Instantly transports code across repositories and collaborators worldwide!",
      tt_systems: "Pass Loop: Passes straight through software layers into hardware memory & OS execution!",
      tt_ai: "What-If Phone Booth: Asks 'What if machines could think?' and builds neural models!",
      gulliver_return_btn: "Ride the Gulliver Tunnel Back to Home",
      stat_campus_title: "Campus", stat_focus_title: "Primary Language",
      stat_exploring_title: "Exploring", stat_philosophy_title: "Philosophy",
      stat_philosophy_desc: "\"Small daily steps compound into miraculous gadgets!\"",
      projects_tag: "✨ SECRET GADGETS", projects_title_pre: "4-D Pocket",
      projects_lead: "Tap the 4-D pocket below to pull out my latest code gadgets and projects!",
      pocket_tap_prompt: "TAP POCKET ✨",
      proj1_title: "Systems Engine Simulator",
      proj1_desc: "A Python-based simulation modeling low-level CPU instruction cycles, register allocation, cache hits/misses, and process scheduling under the hood.",
      proj2_title: "Neural Toy AI from Scratch",
      proj2_desc: "Pure Python neural network implementation from scratch (no heavyweight ML libraries), demystifying matrix math, forward propagation, loss gradients, and weights optimization.",
      proj3_title: "Doraemon Gadget CLI Tools",
      proj3_desc: "A fun developer terminal companion that automates Git branch management, parses logbooks, and delivers daily Python coding puzzles right to your shell.",
      skills_tag: "🎒 4-D POCKET", skills_title_pre: "Skills &", skills_title_highlight: "Gadget Stash",
      skills_lead: "The foundational tools currently in my developer inventory.",
      level_intermediate: "Beginner / Intermediate", level_foundational: "Foundational",
      level_active: "Active User", level_active_study: "Active Study",
      skill_python_desc: "Data structures, functions, OOP principles, file handling, automation scripts, and problem solving.",
      skill_git_desc: "Tracking source code changes, branch strategies, commits, stashing, and clean conflict resolution.",
      skill_github_desc: "Remote repositories, pull requests, issue tracking, markdown documentation, and collaborative workflows.",
      skill_sys_ai_name: "Systems & AI Concepts",
      skill_sys_ai_desc: "Understanding computer memory, CPU execution, linear algebra for ML, and neural network foundations.",
      journey_tag: "🚀 TIME MACHINE LOG", journey_title_pre: "My Learning", journey_title_highlight: "Milestones",
      journey_lead: "Warp through the Time Machine drawer to trace my past, present, and future trajectory.",
      ms1_title: "Joined NST (Newton School of Technology)",
      ms1_desc: "Embarqued on an industry-focused computer science journey with peer programming, labs, and modern curriculum.",
      ms2_title: "Started Python",
      ms2_desc: "Wrote my first scripts, conquered loops, functions, OOP, and solved algorithmic challenges.",
      ms3_title: "Learning Git and GitHub",
      ms3_desc: "Mastered command-line version control, collaborative PRs, and maintaining open-source repositories.",
      ms4_title: "Now: Exploring Systems and AI",
      ms4_desc: "Dissecting operating systems, hardware memory architecture, and building foundational machine learning models.",
      ms5_title: "Future: Building Real Systems and AI Projects",
      ms5_desc: "Engineering high-performance distributed systems, practical AI agents, and solving real-world engineering problems.",
      contact_tag: "📬 DORAEMON MAILBOX", contact_title_pre: "Let's", contact_title_highlight: "Connect!",
      contact_lead: "Always eager to collaborate with fellow learners, engineers, and mentors.",
      form_heading: "Send a Dokodemo Letter",
      form_desc: "Type a message and watch your paper plane fly through the Anywhere Door!",
      form_name_label: "Your Name", form_email_label: "Email Address", form_msg_label: "Message",
      form_send_btn: "Dispatch via Anywhere Door",
      toast_msg_sent: "Message sent! Rishabh will get back to you soon.",
      tunnel_callout_title: "Ready to return?",
      tunnel_callout_desc: "Activate the Gulliver Tunnel warp drive back to Home!",
      tunnel_callout_btn: "Activate Gulliver Tunnel → Home",
      game_title: "Dorayaki Catcher!", game_score: "Score:",
      game_controls_hint: "Controls: Use Arrow Keys, Mouse Move, or Drag on Mobile"
    },
    hi: {
      nav_home: "होम", nav_about: "परिचय", nav_projects: "प्रोजेक्ट्स",
      nav_skills: "कौशल", nav_journey: "सफ़र", nav_contact: "संपर्क",
      nav_door: "दरवाज़ा", play_game: "गेम",
      hero_badge: "नमस्ते! मेरे वेब पॉकेट में आपका स्वागत है",
      hero_greeting: "नमस्ते, मैं हूँ",
      hero_nst: "🎓 छात्र: न्यूटन स्कूल ऑफ टेक्नोलॉजी (NST)",
      hero_desc: "मैं एक जिज्ञासु पायथन बिगिनर हूँ, जो कंप्यूटर सिस्टम्स और आर्टिफिशियल इंटेलिजेंस की दुनिया को एक्सप्लोर कर रहा हूँ।",
      cta_open_door: "एनीव्हेयर डोर खोलें",
      cta_view_projects: "4D प्रोजेक्ट्स देखें",
      hero_hint: "डोरेमोन का सीक्रेट संकेत: कहीं भी जाने के लिए एनीव्हेयर डोर पर क्लिक करें या मुझसे बात करें!",
      about_tag: "📖 अध्याय ०१", about_title_pre: "ऋषभ के",
      about_lead: "बुनियादी प्रिंट स्टेटमेंट से लेकर सिस्टम और बुद्धिमान एल्गोरिदम तक का सफ़र।",
      bio_heading: "मैं कौन हूँ?",
      bio_p1: "नमस्ते! मैं ऋषभ पटेल हूँ, वर्तमान में न्यूटन स्कूल ऑफ टेक्नोलॉजी (NST) में पढ़ रहा हूँ।",
      bio_p2: "मैं पायथन में शुरुआत कर रहा हूँ और कंप्यूटर सिस्टम आर्किटेक्चर तथा एआई के रहस्यों को सीख रहा हूँ।",
      gadget_skills_title: "🎒 मेरे डोरेमोन डेवलपर गैजेट्स",
      tt_python: "टेक-कॉप्टर: पायथन लॉजिक और ऑटोमेशन में आसानी से उड़ान भरें!",
      tt_git: "टाइम मशीन: किसी भी कोड कमिट पर पीछे या आगे जाएँ!",
      tt_github: "एनीव्हेयर डोर: कोड को दुनिया भर के डेवलपर्स तक तुरंत पहुँचाएँ!",
      tt_systems: "पास लूप: सॉफ्टवेयर की परतों से सीधे हार्डवेयर मेमोरी में प्रवेश करें!",
      tt_ai: "व्हाट-इफ फोन बूथ: क्या मशीनें सोच सकती हैं? न्यूरल नेटवर्क की खोज करें!",
      gulliver_return_btn: "गुलिवर टनल से वापस होम जाएँ",
      stat_campus_title: "कॉलेज", stat_focus_title: "मुख्य भाषा",
      stat_exploring_title: "अध्ययन क्षेत्र", stat_philosophy_title: "सोच",
      stat_philosophy_desc: "\"रोज़ाना के छोटे कदम चमत्कारी गैजेट्स बन जाते हैं!\"",
      projects_tag: "✨ सीक्रेट गैजेट्स", projects_title_pre: "4-डी पॉकेट",
      projects_lead: "मेरे नवीनतम कोड प्रोजेक्ट्स निकालने के लिए नीचे 4-D पॉकेट पर टैप करें!",
      pocket_tap_prompt: "पॉकेट पर टैप करें ✨",
      proj1_title: "सिस्टम्स इंजन सिम्युलेटर",
      proj1_desc: "सीपीयू इंस्ट्रक्शन साइकल, रजिस्टर और प्रोसेस शेड्यूलिंग को समझने के लिए पायथन सिमुलेशन।",
      proj2_title: "शून्य से न्यूरल टॉय एआई",
      proj2_desc: "बिना किसी भारी लाइब्रेरी के शुद्ध पायथन में न्यूरल नेटवर्क और फॉरवर्ड प्रोपेगेशन।",
      proj3_title: "डोरेमोन गैजेट सीएलआई टूल्स",
      proj3_desc: "टर्मिनल में गिट वर्कफ़्लो और दैनिक कोडिंग पहेलियाँ सुलझाने वाला साथी।",
      skills_tag: "🎒 4-डी पॉकेट", skills_title_pre: "कौशल और", skills_title_highlight: "गैजेट्स",
      skills_lead: "मेरे तकनीकी टूलबॉक्स के मुख्य उपकरण।",
      level_intermediate: "मध्यम स्तर", level_foundational: "बुनियादी",
      level_active: "सक्रिय यूजर", level_active_study: "अध्ययनरत",
      skill_python_desc: "डेटा स्ट्रक्चर्स, फंक्शन्स, ओओपी, फ़ाइल हैंडलिंग और लॉजिक बिल्डिंग।",
      skill_git_desc: "कोड परिवर्तन ट्रैक करना, ब्रांचिंग और साफ़ कमिट्स।",
      skill_github_desc: "रिमोट रिपॉजिटरी, पीआर और ओपन सोर्स सहयोग।",
      skill_sys_ai_name: "सिस्टम्स और एआई सिद्धांत",
      skill_sys_ai_desc: "कंप्यूटर मेमोरी, सीपीयू और मशीन लर्निंग का गणित।",
      journey_tag: "🚀 टाइम मशीन लॉग", journey_title_pre: "सीखने का", journey_title_highlight: "सफ़र",
      journey_lead: "मेरे सीखने के चरणों को देखने के लिए टाइम मशीन के साथ आगे बढ़ें।",
      ms1_title: "NST में प्रवेश लिया",
      ms1_desc: "हैंड्स-ऑन कोडिंग और आधुनिक तकनीक के साथ बीटेक की शुरुआत की।",
      ms2_title: "पायथन सीखना शुरू किया",
      ms2_desc: "लूप्स, फ़ंक्शन्स और एल्गोरिदम पर महारत हासिल की।",
      ms3_title: "गिट और गिटहब सीखा",
      ms3_desc: "कमांड लाइन पर वर्ज़न कंट्रोल और ओपन सोर्स प्रोजेक्ट्स बनाए।",
      ms4_title: "वर्तमान: सिस्टम्स और एआई का अन्वेषण",
      ms4_desc: "ऑपरेटिंग सिस्टम और डीप लर्निंग के बुनियादी गणित को सीख रहा हूँ।",
      ms5_title: "भविष्य: वास्तविक सिस्टम्स और एआई प्रोजेक्ट्स का निर्माण",
      ms5_desc: "उच्च प्रदर्शन वाले सॉफ़्टवेयर और एआई एजेंट बनाना।",
      contact_tag: "📬 डोरेमोन मेलबॉक्स", contact_title_pre: "आइए", contact_title_highlight: "जुड़ें!",
      contact_lead: "तकनीकी चर्चा और नए प्रोजेक्ट्स के लिए हमेशा तैयार।",
      form_heading: "डोकेडेमो पत्र भेजें",
      form_desc: "संदेश लिखें और एनीव्हेयर डोर से अपना पेपर प्लेन उड़ते देखें!",
      form_name_label: "आपका नाम", form_email_label: "ईमेल पता", form_msg_label: "संदेश",
      form_send_btn: "एनीव्हेयर डोर से भेजें",
      toast_msg_sent: "संदेश भेज दिया गया! ऋषभ जल्द ही उत्तर देंगे।",
      tunnel_callout_title: "वापस लौटना चाहते हैं?",
      tunnel_callout_desc: "गुलिवर टनल सक्रिय करें और तुरंत होम पर पहुँचें!",
      tunnel_callout_btn: "गुलिवर टनल सक्रिय करें → होम",
      game_title: "डोरायाकी पकड़ें!", game_score: "स्कोर:",
      game_controls_hint: "कंट्रोल्स: एरो कीज़, माउस या टच ड्रैग का उपयोग करें"
    },
    ja: {
      nav_home: "ホーム", nav_about: "紹介", nav_projects: "秘密道具",
      nav_skills: "スキル", nav_journey: "航海記", nav_contact: "連絡先",
      nav_door: "ドア", play_game: "ゲーム",
      hero_badge: "こんにちは！四次元ポケットへようこそ",
      hero_greeting: "こんにちは、僕は",
      hero_nst: "🎓 ニュートン工科大学 (NST) 学生",
      hero_desc: "Pythonを学び始めた初心者で、低レイヤのコンピュータシステムとAIの世界を探求しています！",
      cta_open_door: "どこでもドアを開ける",
      cta_view_projects: "4次元プロジェクトを見る",
      hero_hint: "ドラえもんのヒント: どこでもドアをクリックすると瞬時に移動できます！僕をクリックするとお話します！",
      about_tag: "📖 第01章", about_title_pre: "リシャブの",
      about_lead: "最初の一行のコードから、システム解析と知能アルゴリズムへの道。",
      bio_heading: "自己紹介",
      bio_p1: "ニュートン工科大学（NST）でコンピュータサイエンスを学んでいるリシャブ・パテルです。",
      bio_p2: "Pythonプログラミングを始め、システムの仕組みやAIの奥深さに魅了されています。",
      gadget_skills_title: "🎒 ドラえもんのひみつ道具スキル",
      tt_python: "タケコプター: 自由自在にコードと自動化の大空を飛翔！",
      tt_git: "タイムマシン: どのコミットへも一瞬でタイムスリップ！",
      tt_github: "どこでもドア: 世界中のリポジトリと一瞬で繋がる！",
      tt_systems: "通りぬけフープ: 抽象レイヤを通り抜けてハードウェアへ！",
      tt_ai: "もしもボックス: もしも機械が知能を持ったら？ニューラルネットの探求！",
      gulliver_return_btn: "ガリバートンネルでホームへ戻る",
      stat_campus_title: "大学", stat_focus_title: "主要言語",
      stat_exploring_title: "探求領域", stat_philosophy_title: "理念",
      stat_philosophy_desc: "「毎日の小さな一歩が、未来のひみつ道具になる！」",
      projects_tag: "✨ ひみつ道具", projects_title_pre: "四次元ポケット",
      projects_lead: "下のポケットをタップして、最新のコード道具を取り出そう！",
      pocket_tap_prompt: "ポケットをタップ ✨",
      proj1_title: "システムエンジン・シミュレータ",
      proj1_desc: "CPU命令サイクルとメモリ空間の動作をPythonで完全シミュレーション。",
      proj2_title: "ゼロからのニューラルToy AI",
      proj2_desc: "重厚なライブラリに頼らず、Pythonだけで行列演算と逆伝播を実装。",
      proj3_title: "ドラえもん道具CLIツール",
      proj3_desc: "Git操作を自動化し毎日のPythonパズルを届ける開発者ターミナルのお供。",
      skills_tag: "🎒 4次元ポケット", skills_title_pre: "スキルと", skills_title_highlight: "ひみつ道具",
      skills_lead: "開発者としての現在の装備アイテム一覧。",
      level_intermediate: "初中級", level_foundational: "基礎",
      level_active: "常用ユーザー", level_active_study: "学習中",
      skill_python_desc: "データ構造、オブジェクト指向、自動化スクリプト、論理構築。",
      skill_git_desc: "履歴管理、ブランチ戦略、コミットとマージの解決。",
      skill_github_desc: "リモート管理、Pull Request、オープンソース活動。",
      skill_sys_ai_name: "システム＆AI概念",
      skill_sys_ai_desc: "OSカーネルの仕組み、メモリ配置、機械学習の線形代数。",
      journey_tag: "🚀 タイムマシンログ", journey_title_pre: "学びの", journey_title_highlight: "軌跡",
      journey_lead: "机の引き出しからタイムマシンに乗って成長の記録を辿ろう。",
      ms1_title: "NST（ニュートン工科大学）入学",
      ms1_desc: "実践的なコンピュータ工学と協調プログラミングの旅を開始。",
      ms2_title: "Pythonプログラミング開始",
      ms2_desc: "ループ、関数、オブジェクト指向をマスターし問題解決力を養成。",
      ms3_title: "GitとGitHubの習得",
      ms3_desc: "CLIを用いたバージョン管理と共同開発フローを体得。",
      ms4_title: "現在: システムとAIの深層へ",
      ms4_desc: "ハードウェアとOSの連動、ニューラルネットの数学的基礎を探求。",
      ms5_title: "未来: 大規模システムと実用AIの構築",
      ms5_desc: "真に役立つ高信頼性分散システムとインテリジェントエージェントの創造。",
      contact_tag: "📬 ドラえもんポスト", contact_title_pre: "連絡を", contact_title_highlight: "取ろう！",
      contact_lead: "新しいアイデアや共同開発について気軽にメッセージをどうぞ。",
      form_heading: "どこでも手紙を送信",
      form_desc: "メッセージを書くと、紙飛行機がどこでもドアをくぐって飛び立ちます！",
      form_name_label: "お名前", form_email_label: "メールアドレス", form_msg_label: "内容",
      form_send_btn: "どこでもドアへ投函",
      toast_msg_sent: "送信完了！リシャブから近いうちにお返事します。",
      tunnel_callout_title: "元の場所へ戻る？",
      tunnel_callout_desc: "ガリバートンネルに入ってホームへ瞬時に縮小ワープ！",
      tunnel_callout_btn: "ガリバートンネル起動 → ホーム",
      game_title: "どら焼きキャッチ！", game_score: "得点:",
      game_controls_hint: "操作: 左右キー、マウス移動、またはタッチスワイプ"
    }
  };

  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const konnyakuIcon = document.getElementById('konnyaku-icon');
  const currentLangCode = document.getElementById('current-lang-code');
  const supportedLangs = ['en', 'hi', 'ja'];
  let currentLang = localStorage.getItem('doraemon_portfolio_lang') || 'en';

  function applyLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('doraemon_portfolio_lang', lang);
    if (currentLangCode) currentLangCode.textContent = lang.toUpperCase();

    // Update all data-i18n elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      playMunchSound();

      // Konnyaku munch bite animation
      if (konnyakuIcon) {
        konnyakuIcon.classList.remove('is-munched');
        void konnyakuIcon.offsetWidth;
        konnyakuIcon.classList.add('is-munched');
      }

      // Rotate language
      const nextIdx = (supportedLangs.indexOf(currentLang) + 1) % supportedLangs.length;
      const nextLang = supportedLangs[nextIdx];
      applyLanguage(nextLang);

      triggerSpeechDialogue(`Translation Konnyaku activated! (${nextLang.toUpperCase()}) 🧊🥞`);
    });
  }
  applyLanguage(currentLang);

  // =========================================================================
  // 10. SMALL LIGHT DARK MODE (Twinkling Stars + Spotlight Mask)
  // =========================================================================
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const starsContainer = document.getElementById('night-stars-container');
  let isDarkMode = localStorage.getItem('doraemon_theme_night') === 'true';

  function createNightStars() {
    if (!starsContainer) return;
    starsContainer.innerHTML = '';
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 1.2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 80}%`;
      star.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
      starsContainer.appendChild(star);
    }
  }
  createNightStars();

  function applyTheme(night) {
    isDarkMode = night;
    localStorage.setItem('doraemon_theme_night', night);
    if (night) {
      document.body.classList.add('theme-night');
      document.body.classList.remove('theme-day');
    } else {
      document.body.classList.remove('theme-night');
      document.body.classList.add('theme-day');
    }
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      playTone(740, 'triangle', 0, 0.25, 0.15);
      applyTheme(!isDarkMode);
    });
  }
  applyTheme(isDarkMode);

  // Cursor Spotlight Mask for Dark Mode
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  }, { passive: true });

  // =========================================================================
  // 11. 4-D POCKET PROJECTS SECTION (Pop-Out Cards on Click)
  // =========================================================================
  const pocketChest = document.getElementById('pocket-chest');
  const projectCards = document.querySelectorAll('.project-gadget-card');
  let cardsPopped = false;

  function popOutProjectCards() {
    playDoraemonChime();
    cardsPopped = true;

    projectCards.forEach((card, idx) => {
      setTimeout(() => {
        card.classList.add('is-visible');
        playTone(600 + idx * 180, 'sine', 0, 0.25, 0.18);
      }, idx * 180);
    });

    triggerSpeechDialogue("Ta-da! Secret Gadget Projects pulled straight from the 4-D Pocket! ✨🎒");
  }

  if (pocketChest) {
    pocketChest.addEventListener('click', () => {
      popOutProjectCards();
    });
    pocketChest.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        popOutProjectCards();
      }
    });
  }

  // =========================================================================
  // 12. TIME MACHINE JOURNEY TIMELINE (Scroll-Triggered Reveals)
  // =========================================================================
  const timelineSteps = document.querySelectorAll('.tm-step');

  function checkTimelineVisibility() {
    if (prefersReducedMotion) return;
    const triggerBottom = window.innerHeight * 0.85;

    timelineSteps.forEach((step) => {
      const top = step.getBoundingClientRect().top;
      if (top < triggerBottom) {
        step.style.opacity = '1';
        step.style.transform = 'translateX(0)';
      }
    });
  }
  window.addEventListener('scroll', checkTimelineVisibility, { passive: true });
  checkTimelineVisibility();

  // =========================================================================
  // 13. DOKODEMO MAIL CONTACT FORM (Paper Plane Flies Through Door)
  // =========================================================================
  const contactForm = document.getElementById('dokodemo-contact-form');
  const mailPortalScene = document.getElementById('mail-portal-scene');
  const mailSentToast = document.getElementById('mail-sent-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playTone(880, 'sine', 0, 0.3, 0.2);

      // Trigger paper plane animation
      if (mailPortalScene) {
        mailPortalScene.style.display = 'block';
        mailPortalScene.classList.remove('is-flying');
        void mailPortalScene.offsetWidth;
        mailPortalScene.classList.add('is-flying');
      }

      // Show toast after plane enters door
      setTimeout(() => {
        if (mailSentToast) mailSentToast.classList.add('is-shown');
        playDoraemonChime();
        contactForm.reset();

        setTimeout(() => {
          if (mailPortalScene) mailPortalScene.style.display = 'none';
        }, 1200);

        setTimeout(() => {
          if (mailSentToast) mailSentToast.classList.remove('is-shown');
        }, 5000);
      }, 1000);
    });
  }

  // =========================================================================
  // 14. KONAMI CODE SECRET LISTENER (Up Up Down Down Left Right Left Right B A)
  // =========================================================================
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  const konamiModal = document.getElementById('konami-modal');
  const konamiCloseBtn = document.getElementById('konami-close-btn');

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konamiSequence[konamiIndex].toLowerCase()) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        unlockKonamiSecret();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function unlockKonamiSecret() {
    playVictoryFanfare();
    if (konamiModal) {
      konamiModal.classList.add('is-active');
      konamiModal.setAttribute('aria-hidden', 'false');
    }
    triggerSpeechDialogue("SUGOI! You entered the Konami Code and unlocked the Secret Rocket! 🚀✨");
  }

  if (konamiCloseBtn && konamiModal) {
    konamiCloseBtn.addEventListener('click', () => {
      konamiModal.classList.remove('is-active');
      konamiModal.setAttribute('aria-hidden', 'true');
    });
  }

  // =========================================================================
  // 15. GADGET REVEAL LOADING SCREEN (~2s Intro with Sign Pull-Out)
  // =========================================================================
  const loadingScreen = document.getElementById('loading-screen');
  const skipLoaderBtn = document.getElementById('skip-loader-btn');

  function dismissLoader() {
    if (!loadingScreen) return;
    loadingScreen.classList.add('is-hidden');
    playDoraemonChime();
    setTimeout(() => {
      loadingScreen.remove();
    }, 600);
  }

  if (skipLoaderBtn) {
    skipLoaderBtn.addEventListener('click', dismissLoader);
  }

  // Automatically dismiss after ~2.2 seconds
  setTimeout(() => {
    dismissLoader();
  }, 2200);

  // =========================================================================
  // 16. DORAYAKI SCROLL PROGRESS BAR (Bite Marks on Scroll)
  // =========================================================================
  const progressFill = document.getElementById('progress-fill');
  const progressBadge = document.getElementById('progress-dorayaki-badge');
  const dorayakiBites = document.getElementById('dorayaki-bite-marks');

  function updateDorayakiProgressBar(progress) {
    const pct = (progress * 100).toFixed(1);
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressBadge) progressBadge.style.left = `${pct}%`;

    // Bite marks progression
    if (dorayakiBites) {
      dorayakiBites.classList.toggle('bite-active-1', progress > 0.25);
      dorayakiBites.classList.toggle('bite-active-2', progress > 0.55);
      dorayakiBites.classList.toggle('bite-active-3', progress > 0.85);
    }
  }

  // =========================================================================
  // 17. ANYWHERE DOOR, GULLIVER TUNNEL & BIG LIGHT TRANSITIONS
  // =========================================================================
  const doorOverlay = document.getElementById('anywhere-door-overlay');
  const doorQuickBtn = document.getElementById('door-quick-btn');
  const openDoorCta = document.getElementById('open-door-cta');
  const interactiveDoorPreview = document.getElementById('interactive-preview-door');
  const navAboutBtn = document.getElementById('nav-about-btn');

  const tunnelOverlay = document.getElementById('gulliver-tunnel-overlay');
  const navHomeBtn = document.getElementById('nav-home-btn');
  const tunnelBackBtn = document.getElementById('tunnel-back-btn');
  const footerTunnelBtn = document.getElementById('footer-tunnel-btn');
  const navBrandLink = document.getElementById('nav-brand-link');

  const bigLightOverlay = document.getElementById('big-light-overlay');
  const bigLightEmitter = document.getElementById('big-light-emitter');
  const bigLightTriggers = document.querySelectorAll('.big-light-trigger');

  let isTransitionActive = false;

  // Anywhere Door (Home -> About)
  function triggerAnywhereDoor() {
    if (isTransitionActive) return;
    isTransitionActive = true;
    initAudioContext();

    if (prefersReducedMotion) {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      isTransitionActive = false;
      return;
    }

    doorOverlay.classList.remove('is-zooming', 'is-opening');
    doorOverlay.classList.add('is-active');

    setTimeout(() => doorOverlay.classList.add('is-opening'), 280);
    setTimeout(() => doorOverlay.classList.add('is-zooming'), 950);

    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
    }, 1300);

    setTimeout(() => {
      doorOverlay.classList.remove('is-active');
      setTimeout(() => {
        doorOverlay.classList.remove('is-zooming', 'is-opening');
        isTransitionActive = false;
        triggerSpeechDialogue("Welcome to my About section! Powered by Anywhere Door 🚪✨");
      }, 400);
    }, 1550);
  }

  if (openDoorCta) openDoorCta.addEventListener('click', triggerAnywhereDoor);
  if (doorQuickBtn) doorQuickBtn.addEventListener('click', triggerAnywhereDoor);
  if (interactiveDoorPreview) interactiveDoorPreview.addEventListener('click', triggerAnywhereDoor);
  if (navAboutBtn) navAboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    triggerAnywhereDoor();
  });

  // Gulliver Tunnel (About -> Home)
  function triggerGulliverTunnel() {
    if (isTransitionActive) return;
    isTransitionActive = true;
    initAudioContext();

    if (prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      isTransitionActive = false;
      return;
    }

    tunnelOverlay.classList.remove('is-collapsing');
    tunnelOverlay.classList.add('is-active');

    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 850);
    setTimeout(() => tunnelOverlay.classList.add('is-collapsing'), 1100);

    setTimeout(() => {
      tunnelOverlay.classList.remove('is-active', 'is-collapsing');
      isTransitionActive = false;
      triggerSpeechDialogue("Zooooom! Back to Home with Gulliver Tunnel 🌀");
    }, 1500);
  }

  if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.scrollY > 150) triggerGulliverTunnel();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  if (tunnelBackBtn) tunnelBackBtn.addEventListener('click', triggerGulliverTunnel);
  if (footerTunnelBtn) footerTunnelBtn.addEventListener('click', triggerGulliverTunnel);
  if (navBrandLink) navBrandLink.addEventListener('click', (e) => {
    if (window.scrollY > 200) {
      e.preventDefault();
      triggerGulliverTunnel();
    }
  });

  // Big Light Transition (Other Sections)
  function triggerBigLight(targetId, clickEvent) {
    if (isTransitionActive) return;
    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    isTransitionActive = true;
    initAudioContext();

    if (prefersReducedMotion) {
      targetElem.scrollIntoView({ behavior: 'smooth' });
      isTransitionActive = false;
      return;
    }

    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;
    if (clickEvent && clickEvent.clientX && clickEvent.clientY) {
      originX = clickEvent.clientX;
      originY = clickEvent.clientY;
    }

    if (bigLightEmitter) {
      bigLightEmitter.style.left = `${originX}px`;
      bigLightEmitter.style.top = `${originY}px`;
    }

    bigLightOverlay.classList.remove('is-fading', 'is-bright');
    bigLightOverlay.classList.add('is-active');

    requestAnimationFrame(() => bigLightOverlay.classList.add('is-expanding'));

    setTimeout(() => {
      bigLightOverlay.classList.add('is-bright');
      playBigLightChime();
      targetElem.scrollIntoView({ behavior: 'instant' });
    }, 320);

    setTimeout(() => {
      bigLightOverlay.classList.remove('is-bright', 'is-expanding');
      bigLightOverlay.classList.add('is-fading');
    }, 520);

    setTimeout(() => {
      bigLightOverlay.classList.remove('is-active', 'is-fading');
      isTransitionActive = false;
      if (targetId === 'projects') {
        popOutProjectCards();
      }
    }, 900);
  }

  bigLightTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target') || trigger.getAttribute('href')?.replace('#', '');
      if (targetId) triggerBigLight(targetId, e);
    });
  });

  // Typewriter Speech Bubble Helper
  let typingTimer = null;
  function triggerSpeechDialogue(text) {
    if (!typingText) return;
    if (prefersReducedMotion) {
      typingText.textContent = text;
      return;
    }
    if (typingTimer) clearInterval(typingTimer);
    typingText.textContent = '';
    let idx = 0;
    typingTimer = setInterval(() => {
      if (idx < text.length) {
        typingText.textContent += text.charAt(idx);
        idx++;
      } else {
        clearInterval(typingTimer);
      }
    }, 22);
  }

  const dialogueQueue = [
    { threshold: 0.00, text: "I am a Python beginner, learning Systems and AI!" },
    { threshold: 0.18, text: "Studying at Newton School of Technology (NST) 🎓" },
    { threshold: 0.35, text: "Click the 4D Pocket to pull out secret coding projects! 🎒" },
    { threshold: 0.55, text: "Python + Git + GitHub are my trusty starter gadgets! 🐍" },
    { threshold: 0.75, text: "Warping down the Time Machine drawer corridor 🚀" },
    { threshold: 0.90, text: "Let's connect! Send a message through the Dokodemo Mailbox 📬" }
  ];
  let currentDialogueIndex = -1;

  function updateSpeechOnScroll(progress) {
    let matchedIndex = 0;
    for (let i = dialogueQueue.length - 1; i >= 0; i--) {
      if (progress >= dialogueQueue[i].threshold - 0.04) {
        matchedIndex = i;
        break;
      }
    }
    if (matchedIndex !== currentDialogueIndex) {
      currentDialogueIndex = matchedIndex;
      triggerSpeechDialogue(dialogueQueue[matchedIndex].text);
    }
  }

  // Initial setup
  window.addEventListener('DOMContentLoaded', () => {
    calculateFlightCoordinates(window.scrollY);
    updateDorayakiProgressBar(0);
  });

})();
