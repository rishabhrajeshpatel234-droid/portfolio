/**
 * RISHABH PATEL - PERSONAL PORTFOLIO
 * Vanilla JavaScript Animation Controller
 * 
 * Features:
 * 1. Web Audio API Chime Synthesizer (Zero audio file dependencies)
 * 2. Doraemon Click Interaction (Harmonic chime + bounce + sparkle burst)
 * 3. Flying Doraemon Scroll Engine (Propeller spins only on scroll, forward/backward tilt, no idle bob)
 * 4. Anywhere Door 3D Transition (Home -> About)
 * 5. Gulliver Tunnel Swirl Transition (About -> Home)
 * 6. Big Light Transition for Other Sections (Skills, Journey, Contact)
 * 7. Context-Aware Typing Speech Bubble
 */

(function () {
  'use strict';

  // =========================================================================
  // DOM ELEMENT SELECTORS
  // =========================================================================
  const flyingDoraemon = document.getElementById('flying-doraemon');
  const doraemonClickable = document.getElementById('doraemon-clickable');
  const doraemonSparkles = document.getElementById('doraemon-sparkles');
  const takeCopterRotor = document.getElementById('take-copter-rotor');
  const speechBubble = document.getElementById('doraemon-speech');
  const typingText = document.getElementById('typing-text');
  
  // Door Transition Elements (Home -> About)
  const doorOverlay = document.getElementById('anywhere-door-overlay');
  const doorQuickBtn = document.getElementById('door-quick-btn');
  const openDoorCta = document.getElementById('open-door-cta');
  const interactiveDoorPreview = document.getElementById('interactive-preview-door');
  const navAboutBtn = document.getElementById('nav-about-btn');

  // Tunnel Transition Elements (About -> Home)
  const tunnelOverlay = document.getElementById('gulliver-tunnel-overlay');
  const navHomeBtn = document.getElementById('nav-home-btn');
  const tunnelBackBtn = document.getElementById('tunnel-back-btn');
  const footerTunnelBtn = document.getElementById('footer-tunnel-btn');
  const navBrandLink = document.getElementById('nav-brand-link');

  // Big Light Transition Elements (Other sections)
  const bigLightOverlay = document.getElementById('big-light-overlay');
  const bigLightEmitter = document.getElementById('big-light-emitter');
  const bigLightTriggers = document.querySelectorAll('.big-light-trigger');

  // Motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. WEB AUDIO API CHIME SYNTHESIZER (No external audio files)
  // =========================================================================
  let audioCtx = null;

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

  // Play a pleasant 3-note crystalline bell chime on clicking Doraemon
  function playDoraemonChime() {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic notes: C6 (1046.5Hz), E6 (1318.5Hz), G6 (1568Hz)
    const notes = [1046.50, 1318.51, 1567.98];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Fast attack & musical decay
      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  }

  // Play a soft, shimmering light chime at the peak of the Big Light transition
  function playBigLightChime() {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Shimmering celestial arpeggio: D5 (587.33Hz), A5 (880Hz), D6 (1174.66Hz), F#6 (1479.98Hz)
    const freqs = [587.33, 880.00, 1174.66, 1479.98];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.16, now + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.65);
    });
  }

  // Global first-interaction listener to unlock audio context cleanly
  document.addEventListener('pointerdown', () => {
    initAudioContext();
  }, { once: true });

  // =========================================================================
  // 2. DORAEMON CLICK INTERACTION (Chime, Bounce & Sparkles)
  // =========================================================================
  const funQuotes = [
    "Did you know? Newton School of Technology fosters hands-on builders!",
    "Python tip: 'import antigravity' really exists in standard Python!",
    "Systems engineering teaches you what happens at the transistor level.",
    "AI is powerful, but solid math & programming foundations come first!",
    "Dorayaki is delicious, but writing clean Python code feels even better! 🥞"
  ];

  let quoteIndex = 0;

  if (doraemonClickable) {
    doraemonClickable.addEventListener('click', (e) => {
      e.stopPropagation();

      // 1. Play crystal Web Audio API chime
      playDoraemonChime();

      // 2. Trigger bounce animation
      doraemonClickable.classList.remove('is-bouncing');
      void doraemonClickable.offsetWidth; // Force reflow
      doraemonClickable.classList.add('is-bouncing');
      setTimeout(() => {
        doraemonClickable.classList.remove('is-bouncing');
      }, 450);

      // 3. Trigger sparkle burst
      if (doraemonSparkles) {
        doraemonSparkles.classList.remove('is-sparkling');
        void doraemonSparkles.offsetWidth;
        doraemonSparkles.classList.add('is-sparkling');
        setTimeout(() => {
          doraemonSparkles.classList.remove('is-sparkling');
        }, 650);
      }

      // 4. Cycle dialogue
      quoteIndex = (quoteIndex + 1) % funQuotes.length;
      triggerSpeechDialogue(funQuotes[quoteIndex]);
    });
  }

  // =========================================================================
  // 3. FLYING DORAEMON SCROLL ENGINE (NO IDLE BOB, SPINS ONLY ON SCROLL)
  // =========================================================================
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
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
    const isMobile = windowWidth <= 640;

    if (isMobile) {
      currentOffsetX = 0;
      currentOffsetY = 0;
    } else {
      // S-curve glide across screen
      const amplitudeX = Math.min(windowWidth * 0.22, 260);
      currentOffsetX = Math.sin(progress * Math.PI * 2) * -amplitudeX;

      // Vertical translation downwards
      const maxOffsetY = Math.min(window.innerHeight * 0.45, 340);
      currentOffsetY = progress * maxOffsetY;
    }

    return progress;
  }

  function onScrollHandler() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const deltaY = scrollTop - lastScrollY;
    scrollVelocity = deltaY;

    // Tilt forward when scrolling down (+12 deg), backward when scrolling up (-12 deg)
    if (deltaY > 1) {
      targetTilt = 12;
    } else if (deltaY < -1) {
      targetTilt = -12;
    }

    // Propeller spins fast ONLY while scrolling
    propellerSpeed = 38;

    isScrolling = true;
    if (scrollStopTimer) clearTimeout(scrollStopTimer);
    scrollStopTimer = setTimeout(() => {
      isScrolling = false;
    }, 120);

    const progress = calculateFlightCoordinates(scrollTop);
    updateSpeechOnScroll(progress);

    lastScrollY = scrollTop;
  }

  window.addEventListener('scroll', onScrollHandler, { passive: true });
  window.addEventListener('resize', () => {
    calculateFlightCoordinates(window.scrollY);
  }, { passive: true });

  // 60FPS Physics Animation Loop using requestAnimationFrame
  function flightPhysicsLoop() {
    if (!prefersReducedMotion) {
      // 1. Propeller Physics: spins fast during scroll, smoothly slows to a dead stop
      if (propellerSpeed > 0.05) {
        propellerAngle = (propellerAngle + propellerSpeed) % 360;
        // Friction decay when not actively scrolling
        if (!isScrolling) {
          propellerSpeed *= 0.91; // Fast braking
        }
        if (takeCopterRotor) {
          takeCopterRotor.style.transform = `rotate(${propellerAngle}deg)`;
        }
      } else if (propellerSpeed !== 0) {
        propellerSpeed = 0;
      }

      // 2. Smooth Tilting Physics: smoothly eases to targetTilt, decays to 0 when stationary
      if (!isScrolling) {
        targetTilt *= 0.88; // Return upright when user stops scrolling
        if (Math.abs(targetTilt) < 0.05) targetTilt = 0;
      }

      currentTilt += (targetTilt - currentTilt) * 0.12;

      // 3. Apply Hardware-Accelerated 3D Transform to Doraemon
      if (flyingDoraemon) {
        flyingDoraemon.style.transform = `translate3d(${currentOffsetX.toFixed(2)}px, ${currentOffsetY.toFixed(2)}px, 0) rotate(${currentTilt.toFixed(2)}deg)`;
      }
    }

    window.requestAnimationFrame(flightPhysicsLoop);
  }

  // Start the 60fps flight physics loop
  window.requestAnimationFrame(flightPhysicsLoop);

  // =========================================================================
  // 4. ANYWHERE DOOR (DOKODEMO DOOR) 3D TRANSITION (Home -> About)
  // =========================================================================
  let isDoorTransitioning = false;

  function triggerAnywhereDoorTransition() {
    if (isDoorTransitioning) return;
    isDoorTransitioning = true;
    initAudioContext();

    if (prefersReducedMotion) {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
      isDoorTransitioning = false;
      return;
    }

    doorOverlay.classList.remove('is-zooming', 'is-opening');
    doorOverlay.classList.add('is-active');
    doorOverlay.setAttribute('aria-hidden', 'false');

    // Swing door open
    setTimeout(() => {
      doorOverlay.classList.add('is-opening');
    }, 280);

    // Zoom into doorway
    setTimeout(() => {
      doorOverlay.classList.add('is-zooming');
    }, 950);

    // Switch/scroll to About at peak light
    setTimeout(() => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'instant' });
      }
    }, 1300);

    // Fade out overlay
    setTimeout(() => {
      doorOverlay.classList.remove('is-active');
      doorOverlay.setAttribute('aria-hidden', 'true');
      
      setTimeout(() => {
        doorOverlay.classList.remove('is-zooming', 'is-opening');
        isDoorTransitioning = false;
        triggerSpeechDialogue("Welcome to my About section! Powered by Anywhere Door 🚪✨");
      }, 400);
    }, 1550);
  }

  if (openDoorCta) openDoorCta.addEventListener('click', triggerAnywhereDoorTransition);
  if (doorQuickBtn) doorQuickBtn.addEventListener('click', triggerAnywhereDoorTransition);
  if (interactiveDoorPreview) interactiveDoorPreview.addEventListener('click', triggerAnywhereDoorTransition);
  if (navAboutBtn) navAboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    triggerAnywhereDoorTransition();
  });

  // =========================================================================
  // 5. GULLIVER TUNNEL SWIRL TRANSITION (About -> Home)
  // =========================================================================
  let isTunnelTransitioning = false;

  function triggerGulliverTunnelTransition() {
    if (isTunnelTransitioning) return;
    isTunnelTransitioning = true;
    initAudioContext();

    if (prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      isTunnelTransitioning = false;
      return;
    }

    tunnelOverlay.classList.remove('is-collapsing');
    tunnelOverlay.classList.add('is-active');
    tunnelOverlay.setAttribute('aria-hidden', 'false');

    // Scroll to Home at peak vortex
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 850);

    // Collapse tunnel
    setTimeout(() => {
      tunnelOverlay.classList.add('is-collapsing');
    }, 1100);

    // Cleanup
    setTimeout(() => {
      tunnelOverlay.classList.remove('is-active', 'is-collapsing');
      tunnelOverlay.setAttribute('aria-hidden', 'true');
      isTunnelTransitioning = false;
      triggerSpeechDialogue("Zooooom! Back to Home with Gulliver Tunnel 🌀");
    }, 1500);
  }

  if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.scrollY > 150) {
      triggerGulliverTunnelTransition();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  if (tunnelBackBtn) tunnelBackBtn.addEventListener('click', triggerGulliverTunnelTransition);
  if (footerTunnelBtn) footerTunnelBtn.addEventListener('click', triggerGulliverTunnelTransition);
  if (navBrandLink) navBrandLink.addEventListener('click', (e) => {
    if (window.scrollY > 200) {
      e.preventDefault();
      triggerGulliverTunnelTransition();
    }
  });

  // =========================================================================
  // 6. BIG LIGHT TRANSITION FOR OTHER SECTIONS (Skills, Journey, Contact)
  // =========================================================================
  let isBigLightTransitioning = false;

  function triggerBigLightTransition(targetId, clickEvent) {
    if (isBigLightTransitioning) return;
    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    isBigLightTransitioning = true;
    initAudioContext();

    if (prefersReducedMotion) {
      targetElem.scrollIntoView({ behavior: 'smooth' });
      isBigLightTransitioning = false;
      return;
    }

    // Determine origin coordinate (at the clicked button)
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;

    if (clickEvent && clickEvent.clientX && clickEvent.clientY) {
      originX = clickEvent.clientX;
      originY = clickEvent.clientY;
    } else if (clickEvent && clickEvent.currentTarget) {
      const rect = clickEvent.currentTarget.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    // Position the radial light emitter exactly at click coordinates
    if (bigLightEmitter) {
      bigLightEmitter.style.left = `${originX}px`;
      bigLightEmitter.style.top = `${originY}px`;
    }

    // Phase 1: Show overlay & enlarge radial light until it covers viewport
    bigLightOverlay.classList.remove('is-fading', 'is-bright');
    bigLightOverlay.classList.add('is-active');
    bigLightOverlay.setAttribute('aria-hidden', 'false');

    // Trigger transform: scale() expansion
    window.requestAnimationFrame(() => {
      bigLightOverlay.classList.add('is-expanding');
    });

    // Phase 2: Bright white flash covers entire screen, play soft chime, hide section jump
    setTimeout(() => {
      bigLightOverlay.classList.add('is-bright');
      playBigLightChime();

      // Scroll immediately while hidden under the pure white light
      targetElem.scrollIntoView({ behavior: 'instant' });
    }, 320);

    // Phase 3: Fade out the light to reveal destination section
    setTimeout(() => {
      bigLightOverlay.classList.remove('is-bright', 'is-expanding');
      bigLightOverlay.classList.add('is-fading');
    }, 520);

    // Phase 4: Final cleanup
    setTimeout(() => {
      bigLightOverlay.classList.remove('is-active', 'is-fading');
      bigLightOverlay.setAttribute('aria-hidden', 'true');
      isBigLightTransitioning = false;

      // Section celebratory dialogues
      if (targetId === 'skills') {
        triggerSpeechDialogue("Welcome to my Skills & Gadgets Stash! 🐍🎒");
      } else if (targetId === 'journey') {
        triggerSpeechDialogue("Here's my Learning Journey at NST! 🚀");
      } else if (targetId === 'contact') {
        triggerSpeechDialogue("Let's connect! Always happy to collaborate 📬");
      }
    }, 900);
  }

  // Attach Big Light Transition to all relevant section navigation triggers
  bigLightTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target') || trigger.getAttribute('href')?.replace('#', '');
      if (targetId) {
        triggerBigLightTransition(targetId, e);
      }
    });
  });

  // =========================================================================
  // 7. SPEECH BUBBLE & TYPEWRITER EFFECT
  // =========================================================================
  const dialogueQueue = [
    { threshold: 0.00, text: "I am a Python beginner, learning Systems and AI!" },
    { threshold: 0.22, text: "Studying at Newton School of Technology (NST) 🎓" },
    { threshold: 0.48, text: "Python + Git + GitHub are my trusty starter gadgets! 🐍" },
    { threshold: 0.72, text: "Deep diving into computer systems & neural architectures 🧠" },
    { threshold: 0.90, text: "Let's connect! Check out my GitHub profile below 🐙" }
  ];

  let currentDialogueIndex = -1;
  let typingTimer = null;

  function typeWriter(text, element, speed = 22) {
    if (!element) return;
    if (typingTimer) clearInterval(typingTimer);

    element.textContent = '';
    let index = 0;

    typingTimer = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(typingTimer);
        typingTimer = null;
      }
    }, speed);
  }

  function triggerSpeechDialogue(customText) {
    if (prefersReducedMotion) {
      if (typingText) typingText.textContent = customText;
      return;
    }
    typeWriter(customText, typingText, 22);
  }

  function updateSpeechOnScroll(progress) {
    let matchedIndex = 0;
    for (let i = dialogueQueue.length - 1; i >= 0; i--) {
      if (progress >= dialogueQueue[i].threshold - 0.05) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex !== currentDialogueIndex) {
      currentDialogueIndex = matchedIndex;
      triggerSpeechDialogue(dialogueQueue[matchedIndex].text);
    }
  }

  // =========================================================================
  // 8. INITIALIZATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    triggerSpeechDialogue("I am a Python beginner, learning Systems and AI!");
    calculateFlightCoordinates(window.scrollY);
  });

})();
