# Rishabh Patel - Personal Portfolio 💙🚪

A rich Doraemon-themed personal portfolio website built with pure HTML, CSS, and vanilla JavaScript (no external libraries or frameworks).

**Live Site:** [https://rishabhrajeshpatel234-droid.github.io/portfolio/](https://rishabhrajeshpatel234-droid.github.io/portfolio/)  
*(Or open `index.html` locally in any browser)*

---

## 🌟 15 Special Doraemon Features & Animations

1. **Dorayaki Scroll Progress Bar**: A top bar shows scroll progress with an inline SVG dorayaki that gets eaten (bite marks appear) as you scroll down.
2. **Gadget Reveal Loading Screen**: A 2-second initial intro where Doraemon's 4D pocket pulls out a glowing sign for Rishabh Patel, with a chime and sparkle burst (includes a Skip button).
3. **Dorayaki Cursor Trail**: Desktop cursor trail with small dorayaki and golden bells that fade out over 600ms (capped at 15 particles).
4. **Interactive Eyes & Blinking**: Doraemon's pupils track your mouse cursor or touch point within realistic eye boundaries, and he blinks at random intervals every 3–6s.
5. **Scroll-Only Flying Physics & Braking Propeller**: Doraemon never hovers or bobs on his own when idle. He tilts forward when scrolling down, backward when scrolling up, and his Take-copter spins fast on scroll and brakes to a complete stop when scrolling halts.
6. **Sleep Mode**: If idle for 10 seconds, Doraemon slumps down and animated floating "Zzz" bubbles appear. Any scroll, mouse move, or click wakes him with a startled bounce.
7. **4-D Pocket Projects Section**: Click the large 3D belly pocket to hear a chime and watch 3 coding project cards pop out one by one with a bounce!
8. **Doraemon Gadget Skills**: Skills in About are styled as iconic gadgets with inline SVG icons (Python = Take-copter, Git = Time Machine, GitHub = Anywhere Door, Systems = Pass Loop, AI = What-If Phone Booth) with hover/tap tooltips.
9. **Dorayaki Catching Mini-Game**: Click the "Play" button in the navigation to open the mini-game. Catch falling dorayaki with Doraemon using arrow keys, mouse, or touch drag. Reaching 10 points unlocks a hidden "Hire Me!" confetti badge!
10. **Mouse Panic Easter Egg**: Every 40–60 seconds, a tiny cartoon mouse scampers across the bottom of the screen. Doraemon turns pale and shivers in panic. Click the mouse to banish it and restore Doraemon with a relief chime!
11. **Translation Konnyaku Language Toggle**: Switch between **English (EN)**, **Hindi (HI)**, and **Japanese (JA)** in the navigation. Clicking plays a konnyaku jelly bite animation and swaps all page text instantly (persisted in `localStorage`).
12. **Small Light Dark Mode**: Toggle night mode with the Small Light 🔦 button. The sky turns into a deep starry night with twinkling stars and a glowing moon, while the cursor becomes a soft spotlight revealing content around it.
13. **Time Machine Journey Timeline**: A perspective corridor styled after the Time Machine drawer tunnel that reveals learning milestones at Newton School of Technology (NST).
14. **Talking Doraemon (Web Speech API)**: Click Doraemon to hear him speak aloud: *"Hi, I'm Rishabh's Doraemon. Welcome to his portfolio!"* with a crystal Web Audio API chime and mute toggle.
15. **Dokodemo Mail Contact Form**: Submit a message to watch an origami paper plane fly through a miniature pink Anywhere Door, followed by a confirmation toast.
16. **Konami Code Secret Gadget**: Type `Up Up Down Down Left Right Left Right B A` on your keyboard to launch rocket fireworks and reveal a secret message!
17. **Transitions Suite**:
    - **Anywhere Door**: 3D rotateY swing and dimensional zoom from Home ➔ About.
    - **Gulliver Tunnel**: Concentric swirling vortex from About ➔ Home.
    - **Big Light**: Glowing radial beam expanding from the clicked button with a soft chime for Skills, Projects, Journey, and Contact.

---

## 🚀 How to Run Locally

No build tools or package managers required. Simply:
1. Clone the repository:
   ```bash
   git clone https://github.com/rishabhrajeshpatel234-droid/portfolio.git
   cd portfolio
   ```
2. Double-click `index.html` or open it with your favorite browser:
   ```bash
   open index.html
   ```

---

## 🎨 Tech Stack
- **Structure**: HTML5 Semantic Elements with clean `data-i18n` localization attributes.
- **Styling**: Vanilla CSS (60fps hardware-accelerated animations using `transform` and `opacity`, `@media (prefers-reduced-motion)`).
- **Interactivity**: Pure Vanilla JavaScript organized into 17 clearly documented sections.
- **Sound**: Web Audio API Synthesizer (zero external MP3/WAV files) + Web Speech API.
- **Graphics**: 100% Inline SVG & CSS shapes (zero external asset dependencies).

---

*Crafted with 💙 & Dorayaki for Rishabh Patel (NST)*
