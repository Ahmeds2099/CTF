/* ═══════════════════════════════════════════════════════
   ACF — THE AETHER CORP BREACH — ENHANCED FRONTEND
   Animated background, bidirectional scroll reveals,
   cursor glow, card tilt, micro-interactions
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ──────────────────────────────────
       1. ANIMATED PARTICLE CANVAS BACKGROUND
       (Neural network / constellation effect)
       ────────────────────────────────── */
    function initParticleCanvas() {
        const canvas = document.getElementById('bgCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, particles = [], mouse = { x: -1000, y: -1000 };
        const PARTICLE_COUNT = 80;
        const CONNECT_DIST = 150;
        const MOUSE_DIST = 200;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Track mouse for interactive connections
        document.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r = Math.random() * 1.5 + 0.5;
                this.alpha = Math.random() * 0.4 + 0.1;
                // Purple or cyan tint
                this.hue = Math.random() > 0.6 ? 271 : 187;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;

                // Mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_DIST) {
                    const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02;
                    this.vx += dx * force;
                    this.vy += dy * force;
                }
                // Dampen velocity
                this.vx *= 0.999;
                this.vy *= 0.999;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
                // Mouse connections
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < MOUSE_DIST) {
                    const alpha = (1 - mdist / MOUSE_DIST) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ──────────────────────────────────
       2. CURSOR GLOW FOLLOWER
       ────────────────────────────────── */
    function initCursorGlow() {
        const glow = document.getElementById('cursorGlow');
        if (!glow) return;

        document.addEventListener('mousemove', e => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
            if (!glow.classList.contains('active')) glow.classList.add('active');
        }, { passive: true });

        document.addEventListener('mouseleave', () => glow.classList.remove('active'));
    }

    /* ──────────────────────────────────
       3. BOOT SEQUENCE
       ────────────────────────────────── */
    const bootLines = [
        '[SYS]  Initializing secure connection...',
        '[NET]  Establishing encrypted tunnel... OK',
        '[AUTH] Verifying clearance level... GRANTED',
        '[DB]   Loading Case #2026-AETHER-BREACH...',
        '[SCAN] 15 evidence fragments detected',
        '[SIG]  Threat signature "PHANTOM" identified',
        '[SYS]  Mounting investigation portal...',
        '[OK]   All systems operational. Welcome, Investigator.'
    ];

    function runBoot() {
        const term = document.getElementById('bootTerminal');
        const bar = document.getElementById('bootBar');
        const status = document.getElementById('bootStatus');
        const boot = document.getElementById('bootScreen');
        let i = 0;

        function next() {
            if (i >= bootLines.length) {
                status.textContent = 'ACCESS GRANTED';
                bar.style.width = '100%';
                setTimeout(() => {
                    boot.classList.add('done');
                    document.querySelector('.vignette').classList.add('on');
                    document.querySelector('.scroll-nav').classList.add('on');
                    document.getElementById('navbar').classList.add('show');
                    spawnPlusDecorations();
                    initReveals();
                    startCountdown();
                    initParticleCanvas();
                    initCursorGlow();
                    initCardTilt();
                    initMagneticButtons();
                    initTextScramble();
                }, 500);
                return;
            }
            const el = document.createElement('div');
            el.className = 'bl';
            el.textContent = bootLines[i];
            el.style.animationDelay = (i * 0.05) + 's';
            term.appendChild(el);
            term.scrollTop = term.scrollHeight;
            bar.style.width = ((i + 1) / bootLines.length * 100) + '%';
            status.textContent = bootLines[i].split(']')[1]?.trim() || '';
            i++;
            setTimeout(next, 180 + Math.random() * 250);
        }
        setTimeout(next, 400);
    }

    /* ──────────────────────────────────
       4. FLOATING + DECORATIONS
       ────────────────────────────────── */
    function spawnPlusDecorations() {
        const container = document.getElementById('floatingDeco');
        const symbols = ['+', '·', '○', '◇', '△'];
        const count = 30;
        for (let i = 0; i < count; i++) {
            const plus = document.createElement('div');
            plus.className = 'float-plus';
            plus.textContent = symbols[i % symbols.length];
            plus.style.left = Math.random() * 100 + 'vw';
            plus.style.top = Math.random() * 100 + 'vh';
            plus.style.animationDuration = (15 + Math.random() * 25) + 's';
            plus.style.animationDelay = -(Math.random() * 20) + 's';
            plus.style.fontSize = (0.5 + Math.random() * 1.2) + 'rem';
            const hue = Math.random() > 0.5 ? 'rgba(168,85,247,.12)' : 'rgba(34,211,238,.08)';
            plus.style.color = hue;
            container.appendChild(plus);
        }
    }

    /* ──────────────────────────────────
       5. BIDIRECTIONAL SCROLL REVEALS
       (fade in when scrolling down, 
        fade out when scrolling back up)
       ────────────────────────────────── */
    function initReveals() {
        const allReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-pop, .reveal-down');

        // Auto-assign directional classes to existing .reveal elements based on position
        document.querySelectorAll('.reveal').forEach((el, idx) => {
            // Check if element is on the left or right half
            const rect = el.getBoundingClientRect();
            const parentGrid = el.closest('.about-grid, .skills-grid, .guidelines-grid, .team-grid, .prizes-row, .wyg-grid');

            if (parentGrid) {
                const children = Array.from(parentGrid.children);
                const childIdx = children.indexOf(el);
                // Stagger delay based on position in grid
                el.setAttribute('data-delay', String((childIdx % 6) + 1));
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('vis');
                } else {
                    // Pop out when scrolling away (bidirectional)
                    entry.target.classList.remove('vis');
                }
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });

        allReveal.forEach(el => observer.observe(el));
    }

    /* ──────────────────────────────────
       6. SCROLL PROGRESS NAV
       ────────────────────────────────── */
    function initScrollNav() {
        const fill = document.getElementById('snFill');
        const dot = document.getElementById('snDot');
        const track = document.querySelector('.sn-track');
        const trackH = track ? track.offsetHeight : 100;
        const nav = document.getElementById('navbar');

        function update() {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = Math.min(window.scrollY / max, 1);
            if (fill) fill.style.height = (ratio * 100) + '%';
            if (dot) dot.style.top = (ratio * trackH) + 'px';

            // Navbar shadow on scroll
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 100);
        }

        window.addEventListener('scroll', update, { passive: true });
        update();

        document.querySelectorAll('.sn-idx').forEach(idx => {
            idx.addEventListener('click', () => {
                const target = document.getElementById(idx.dataset.target);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ──────────────────────────────────
       7. NAVBAR
       ────────────────────────────────── */
    function initNavbar() {
        const links = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.sec, .hero');

        // Active tracking
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href')?.slice(1) === id));
                }
            });
        }, { threshold: 0.2 });
        sections.forEach(s => { if (s.id) obs.observe(s); });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const t = document.querySelector(a.getAttribute('href'));
                if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('mobileMenu').classList.remove('open');
                document.getElementById('hamburger').classList.remove('open');
            });
        });
    }

    /* ──────────────────────────────────
       8. HAMBURGER
       ────────────────────────────────── */
    function initHamburger() {
        const btn = document.getElementById('hamburger');
        const menu = document.getElementById('mobileMenu');
        btn.addEventListener('click', () => {
            btn.classList.toggle('open');
            menu.classList.toggle('open');
        });
    }

    /* ──────────────────────────────────
       9. COUNTDOWN
       ────────────────────────────────── */
    function startCountdown() {
        const target = new Date('2026-04-28T13:30:00+05:30').getTime();
        const el = document.getElementById('countdown');

        function tick() {
            const diff = target - Date.now();
            if (diff <= 0) { el.textContent = 'LIVE NOW'; el.style.color = '#4ade80'; return; }
            const d = Math.floor(diff / 864e5);
            const h = Math.floor((diff % 864e5) / 36e5);
            const m = Math.floor((diff % 36e5) / 6e4);
            el.textContent = d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`;
        }
        tick();
        setInterval(tick, 30000);
    }

    /* ──────────────────────────────────
       10. FAQ ACCORDION
       ────────────────────────────────── */
    function initFAQ() {
        document.querySelectorAll('.faq-q').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.parentElement;
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(fi => fi.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    /* ──────────────────────────────────
       11. CTFd LOCK
       ────────────────────────────────── */
    function initCTFd() {
        const btn = document.getElementById('ctfdBtn');
        const target = new Date('2026-04-28T13:30:00+05:30').getTime();

        btn.addEventListener('click', e => {
            if (Date.now() < target) {
                e.preventDefault();
                btn.style.animation = 'shake .4s ease';
                setTimeout(() => btn.style.animation = '', 400);
            }
        });

        const style = document.createElement('style');
        style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}`;
        document.head.appendChild(style);

        function checkUnlock() {
            if (Date.now() >= target) {
                btn.className = 'btn-primary';
                btn.querySelector('i').className = 'fas fa-unlock';
                const tag = btn.querySelector('.locked-tag');
                if (tag) tag.remove();
                btn.style.cursor = 'pointer';
                btn.style.opacity = '1';
            }
        }
        checkUnlock();
        setInterval(checkUnlock, 60000);
    }

    /* ──────────────────────────────────
       12. CARD TILT EFFECT (3D perspective)
       ────────────────────────────────── */
    function initCardTilt() {
        const tiltCards = document.querySelectorAll(
            '.skill-card, .gl-card, .prize-card, .detail-card, .team-card, .tool-row'
        );

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = ((y - cy) / cy) * -4;
                const rotateY = ((x - cx) / cx) * 4;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform .5s ease';
                setTimeout(() => card.style.transition = '', 500);
            });
        });
    }

    /* ──────────────────────────────────
       13. MAGNETIC BUTTON EFFECT
       ────────────────────────────────── */
    function initMagneticButtons() {
        const magnets = document.querySelectorAll('.btn-primary, .nav-cta, .tool-link');

        magnets.forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const moveX = x * 0.2;
                const moveY = y * 0.2;
                btn.style.transform += ` translate(${moveX}px, ${moveY}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ──────────────────────────────────
       14. TEXT SCRAMBLE on section headings
       (Cyber scramble when section enters viewport)
       ────────────────────────────────── */
    function initTextScramble() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?';

        document.querySelectorAll('.sec-title').forEach(title => {
            const original = title.textContent;
            let hasScrambled = false;

            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasScrambled) {
                        hasScrambled = true;
                        scramble(title, original);
                    }
                    if (!entry.isIntersecting) {
                        hasScrambled = false;
                    }
                });
            }, { threshold: 0.3 });

            obs.observe(title);
        });

        function scramble(el, target) {
            let iteration = 0;
            const interval = setInterval(() => {
                el.textContent = target.split('').map((char, i) => {
                    if (i < iteration) return target[i];
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                iteration += 1 / 2;
                if (iteration >= target.length) {
                    el.textContent = target;
                    clearInterval(interval);
                }
            }, 30);
        }
    }

    /* ──────────────────────────────────
       15. PARALLAX + MOUSE TRACKING
       ────────────────────────────────── */
    function initParallax() {
        const plusEls = document.querySelectorAll('.float-plus');
        document.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            plusEls.forEach((el, i) => {
                const factor = 5 + (i % 8) * 3;
                el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        }, { passive: true });
    }

    /* ──────────────────────────────────
       16. SECTION BORDER GLOW ON SCROLL
       (subtle glow on section separators)
       ────────────────────────────────── */
    function initSectionGlow() {
        document.querySelectorAll('.sec-dark::before, .sec-line').forEach(el => {
            // Section lines already animate on hover via CSS
        });

        // Animate section number counters
        document.querySelectorAll('.sec-num').forEach(num => {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        num.style.transition = 'transform .5s var(--spring), color .3s ease';
                        num.style.transform = 'scale(1.1)';
                        setTimeout(() => num.style.transform = '', 500);
                    }
                });
            }, { threshold: 0.5 });
            obs.observe(num);
        });
    }

    /* ──────────────────────────────────
       ✦ INITIALIZATION
       ────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        runBoot();
        initNavbar();
        initHamburger();
        initScrollNav();
        initFAQ();
        initCTFd();
        initSectionGlow();
        setTimeout(initParallax, 2000);
    });

})();