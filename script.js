/**
 * RISHABH PATEL - PERSONAL PORTFOLIO
 * Vanilla JavaScript Animation Controller
 * 
 * Features:
 * 1. 3D Anywhere Door Transition (Home -> About)
 * 2. Swirling Gulliver Tunnel Transition (About -> Home)
 * 3. Flying Doraemon Scroll-driven Flight Path & Take-copter Physics
 * 4. Context-aware Typing Speech Bubble
 */

(function () {
  'use strict';

  // =========================================================================
  // DOM ELEMENT SELECTORS
  // =========================================================================
  const flyingDoraemon = document.getElementById('flying-doraemon');
  const speechBubble = document.getElementById('doraemon-speech');
  const typingText = document.getElementById('typing-text');
  
  // Door Transition Elements
  const doorOverlay = document.getElementById('anywhere-door-overlay');
  const doorQuickBtn = document.getElementById('door-quick-btn');
  const openDoorCta = document.getElementById('open-door-cta');
  const interactiveDoorPreview = document.getElementById('interactive-preview-door');
  const navAboutBtn = document.getElementById('nav-about-btn');

  // Tunnel Transition Elements
  const tunnelOverlay = document.getElementById('gulliver-tunnel-overlay');
  const navHomeBtn = document.getElementById('nav-home-btn');
  const tunnelBackBtn = document.getElementById('tunnel-back-btn');
  const footerTunnelBtn = document.getElementById('footer-tunnel-btn');
  const navBrandLink = document.getElementById('nav-brand-link');

  // Motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. ANYWHERE DOOR (DOKODEMO DOOR) 3D TRANSITION
  // =========================================================================
  let isDoorTransitioning = false;

  function triggerAnywhereDoorTransition() {
    if (isDoorTransitioning) return;
    isDoorTransitioning = true;

    // If user prefers reduced motion, jump immediately
    if (prefersReducedMotion) {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
      isDoorTransitioning = false;
      return;
    }

    // Phase 1: Show Door Overlay
    doorOverlay.classList.remove('is-zooming', 'is-opening');
    doorOverlay.classList.add('is-active');
    doorOverlay.setAttribute('aria-hidden', 'false');

    // Phase 2: Swing Door Open with 3D rotation
    setTimeout(() => {
      doorOverlay.classList.add('is-opening');
    }, 280);

    // Phase 3: Bright light fills screen and camera zooms into doorway
    setTimeout(() => {
      doorOverlay.classList.add('is-zooming');
    }, 950);

    // Phase 4: Scroll to About Section at the peak of white light
    setTimeout(() => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'instant' });
      }
    }, 1300);

    // Phase 5: Fade overlay out and reveal About page
    setTimeout(() => {
      doorOverlay.classList.remove('is-active');
      doorOverlay.setAttribute('aria-hidden', 'true');
      
      // Clean up classes after fade finishes
      setTimeout(() => {
        doorOverlay.classList.remove('is-zooming', 'is-opening');
        isDoorTransitioning = false;
        
        // Trigger celebratory speech bubble
        triggerSpeechDialogue("Welcome to my About section! Powered by Anywhere Door 🚪✨");
      }, 400);
    }, 1550);
  }

  // Bind Anywhere Door triggers
  if (openDoorCta) openDoorCta.addEventListener('click', triggerAnywhereDoorTransition);
  if (doorQuickBtn) doorQuickBtn.addEventListener('click', triggerAnywhereDoorTransition);
  if (interactiveDoorPreview) interactiveDoorPreview.addEventListener('click', triggerAnywhereDoorTransition);
  if (navAboutBtn) navAboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    triggerAnywhereDoorTransition();
  });

  // =========================================================================
  // 2. GULLIVER TUNNEL SWIRL TRANSITION
  // =========================================================================
  let isTunnelTransitioning = false;

  function triggerGulliverTunnelTransition() {
    if (isTunnelTransitioning) return;
    isTunnelTransitioning = true;

    if (prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      isTunnelTransitioning = false;
      return;
    }

    // Phase 1: Show Vortex Overlay & start expansion
    tunnelOverlay.classList.remove('is-collapsing');
    tunnelOverlay.classList.add('is-active');
    tunnelOverlay.setAttribute('aria-hidden', 'false');

    // Phase 2: At peak spiral, scroll to top (Home)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 850);

    // Phase 3: Collapse tunnel and reveal Home
    setTimeout(() => {
      tunnelOverlay.classList.add('is-collapsing');
    }, 1100);

    // Phase 4: Cleanup
    setTimeout(() => {
      tunnelOverlay.classList.remove('is-active', 'is-collapsing');
      tunnelOverlay.setAttribute('aria-hidden', 'true');
      isTunnelTransitioning = false;

      triggerSpeechDialogue("Zooooom! Back to Home with Gulliver Tunnel 🌀");
    }, 1500);
  }

  // Bind Gulliver Tunnel triggers
  if (navHomeBtn) navHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Only play transition if scrolled down
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
  // 3. FLYING DORAEMON ON SCROLL (60FPS FLIGHT PATH CONTROLLER)
  // =========================================================================
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateDoraemonFlight() {
    ticking = false;

    if (!flyingDoraemon) return;
    if (prefersReducedMotion) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

    // Calculate dynamic flight path across screen width
    // Moves gracefully in an S-curve across sections
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 640;

    if (isMobile) {
      // Mobile: Keep near bottom-right with subtle bob
      const tilt = (scrollTop - lastScrollY) * 0.4;
      const clampedTilt = Math.max(Math.min(tilt, 15), -15);
      flyingDoraemon.style.transform = `translate3d(0, 0, 0) rotate(${clampedTilt}deg)`;
    } else {
      // Desktop / Tablet:
      // Glide from top-right to bottom-center-right along an S-curve
      const amplitudeX = Math.min(windowWidth * 0.22, 260);
      const offsetX = Math.sin(progress * Math.PI * 2) * -amplitudeX;
      
      // Vertical translation as page scrolls
      const maxOffsetY = Math.min(window.innerHeight * 0.45, 340);
      const offsetY = progress * maxOffsetY;

      // Natural flight banking tilt based on scroll velocity and trajectory
      const velocity = (scrollTop - lastScrollY) * 0.35;
      const trajectoryTilt = Math.cos(progress * Math.PI * 2) * -10;
      const totalTilt = Math.max(Math.min(velocity + trajectoryTilt, 20), -20);

      // Hardware-accelerated 3D transform
      flyingDoraemon.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${totalTilt}deg)`;
    }

    lastScrollY = scrollTop;

    // Check which section we are in to update dialogue dynamically
    updateSpeechOnScroll(progress);
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateDoraemonFlight);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // =========================================================================
  // 4. SPEECH BUBBLE & TYPEWRITER EFFECT
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

  function typeWriter(text, element, speed = 25) {
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

  // Interactive Easter Egg: Click Doraemon to hear fun facts!
  const funQuotes = [
    "Did you know? Newton School of Technology fosters hands-on builders!",
    "Python tip: 'import antigravity' really exists in standard Python!",
    "Systems engineering teaches you what happens at the transistor level.",
    "AI is powerful, but you need solid math & programming fundamentals first!",
    "Dorayaki is delicious, but writing clean code feels even better! 🥞"
  ];

  let quoteIndex = 0;
  if (flyingDoraemon) {
    flyingDoraemon.addEventListener('click', () => {
      quoteIndex = (quoteIndex + 1) % funQuotes.length;
      triggerSpeechDialogue(funQuotes[quoteIndex]);
      
      // Fun spin on click
      const currentTransform = flyingDoraemon.style.transform || '';
      flyingDoraemon.style.transition = 'transform 0.4s ease';
      flyingDoraemon.style.transform = `${currentTransform} scale(1.1) rotate(10deg)`;
      setTimeout(() => {
        flyingDoraemon.style.transition = 'transform 0.12s linear';
        updateDoraemonFlight();
      }, 400);
    });
  }

  // =========================================================================
  // 5. INITIALIZATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    // Start initial typing animation
    triggerSpeechDialogue("I am a Python beginner, learning Systems and AI!");
    updateDoraemonFlight();
  });

})();
