/**
 * Rahul & Avishi's Wedding Invitation Website - Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Force scroll restoration to top on page refresh/reload
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });
    
    // Automatic fallback for local testing if logo file is not copied to images/ logo yet
    const isLocal = window.location.protocol === 'file:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
        const cacheLogoPath = 'file:///C:/Users/anmol/.gemini/antigravity/brain/c78c7729-ecdd-493e-a8a0-71f7665c4eed/media__1783946193874.jpg';
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function handleImgError() {
                if (this.src.includes('logo.jpg')) {
                    this.src = cacheLogoPath;
                    this.removeEventListener('error', handleImgError);
                }
            });
            if (img.complete && img.naturalWidth === 0 && img.src.includes('logo.jpg')) {
                img.src = cacheLogoPath;
            }
        });
    }
    
    // ==========================================
    // 0. Interactive Envelope Invitation Cover
    // ==========================================
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    
    // Lock body scroll while overlay is active
    if (envelopeOverlay) {
        document.body.style.overflow = 'hidden';
    }
    
    if (envelopeWrapper && envelopeOverlay) {
        envelopeWrapper.addEventListener('click', () => {
            if (envelopeWrapper.classList.contains('open')) return;
            
            // 1. Open the 3D flap and slide card out of envelope
            envelopeWrapper.classList.add('open');
            
            // 2. Play ambient music automatically on user gesture
            if (typeof toggleMusic === 'function' && !isPlaying) {
                toggleMusic();
            }
            
            // 3. Zoom/Expand the card to fill the viewport (at 1.1s, immediately after card slides up)
            setTimeout(() => {
                envelopeOverlay.classList.add('expand-active');
            }, 1100);
            
            // 4. Instantly remove overlay to reveal the main site (at 1.5s, when card reaches 100% size)
            setTimeout(() => {
                envelopeOverlay.style.display = 'none';
                document.body.style.overflow = ''; // Unlock scrolling
            }, 1500);
        });
    }
    
    // ==========================================
    // 0.5. Interactive Scratch Card Controller
    // ==========================================
    function initScratchCard() {
        const canvas = document.getElementById('scratchCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let hasRevealed = false;
        
        // Match canvas coordinate system to its CSS size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        // Deep Forest Green background matching primary color theme
        ctx.fillStyle = '#1a3a2b';
        
        // Round rect drawing helper
        function drawRoundedRect(c, x, y, w, h, r) {
            c.beginPath();
            c.moveTo(x + r, y);
            c.lineTo(x + w - r, y);
            c.quadraticCurveTo(x + w, y, x + w, y + r);
            c.lineTo(x + w, y + h - r);
            c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            c.lineTo(x + r, y + h);
            c.quadraticCurveTo(x, y + h, x, y + h - r);
            c.lineTo(x, y + r);
            c.quadraticCurveTo(x, y, x + r, y);
            c.closePath();
            c.fill();
        }
        
        function drawRoundedRectStroke(c, x, y, w, h, r) {
            c.beginPath();
            c.moveTo(x + r, y);
            c.lineTo(x + w - r, y);
            c.quadraticCurveTo(x + w, y, x + w, y + r);
            c.lineTo(x + w, y + h - r);
            c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            c.lineTo(x + r, y + h);
            c.quadraticCurveTo(x, y + h, x, y + h - r);
            c.lineTo(x, y + r);
            c.quadraticCurveTo(x, y, x + r, y);
            c.closePath();
            c.stroke();
        }
        
        // Draw primary forest green background card
        drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 12);

        // Draw Royal Rajasthani Jali (Lattice grid) gold overlay pattern
        const step = 16;
        ctx.strokeStyle = 'rgba(197, 168, 128, 0.22)';
        ctx.lineWidth = 0.8;
        
        // Diagonal lines (bottom-left to top-right)
        for (let i = -canvas.height; i < canvas.width; i += step) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + canvas.height, canvas.height);
            ctx.stroke();
        }
        // Diagonal lines (top-left to bottom-right)
        for (let i = 0; i < canvas.width + canvas.height; i += step) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i - canvas.height, canvas.height);
            ctx.stroke();
        }

        // Draw double gold filigree borders
        ctx.strokeStyle = '#c5a880';
        ctx.lineWidth = 1;
        drawRoundedRectStroke(ctx, 6, 6, canvas.width - 12, canvas.height - 12, 8);

        ctx.strokeStyle = 'rgba(197, 168, 128, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 3]); // Dotted border
        drawRoundedRectStroke(ctx, 10, 10, canvas.width - 20, canvas.height - 20, 6);
        ctx.setLineDash([]); // Reset dashed lines

        // Burst gold and rose gold celebratory confetti on date reveal
        function fireConfetti() {
            const confettiCanvas = document.createElement('canvas');
            confettiCanvas.style.position = 'fixed';
            confettiCanvas.style.top = '0';
            confettiCanvas.style.left = '0';
            confettiCanvas.style.width = '100vw';
            confettiCanvas.style.height = '100vh';
            confettiCanvas.style.pointerEvents = 'none';
            confettiCanvas.style.zIndex = '1009'; // Placed on top of everything!
            document.body.appendChild(confettiCanvas);
            
            const cCtx = confettiCanvas.getContext('2d');
            const w = confettiCanvas.width = window.innerWidth;
            const h = confettiCanvas.height = window.innerHeight;
            
            // Celebratory colors matching theme: bright gold, rose gold, pale pink, forest green, white
            const colors = ['#FFD700', '#D4AF37', '#B76E79', '#FADADD', '#1A3A2B', '#E6C280', '#FFFFFF'];
            const particles = [];
            
            // Spawn 90 particles shooting from the center of the scratch card
            const startX = w / 2;
            const scratchContainer = document.getElementById('scratchCardContainer');
            let startY = h * 0.45;
            if (scratchContainer) {
                const sRect = scratchContainer.getBoundingClientRect();
                startY = sRect.top + sRect.height / 2;
            }
            
            for (let i = 0; i < 90; i++) {
                particles.push({
                    x: startX,
                    y: startY,
                    vx: -1.5 + Math.random() * 3, // Extremely gentle horizontal drift
                    vy: -3 - Math.random() * 4,    // Soft upward launch
                    g: 0.05 + Math.random() * 0.03, // Feather-light gravity
                    w: 12 + Math.random() * 10,
                    h: 16 + Math.random() * 14,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    rotationSpeed: -1 + Math.random() * 2, // Very slow spin
                    opacity: 1
                });
            }
            
            function loop() {
                cCtx.clearRect(0, 0, w, h);
                
                let active = false;
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    if (p.opacity <= 0) continue;
                    
                    active = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += p.g;
                    p.rotation += p.rotationSpeed;
                    p.opacity -= 0.004; // Fades extremely slowly (lasts ~10 seconds)
                    
                    if (p.opacity > 0) {
                        cCtx.save();
                        cCtx.translate(p.x, p.y);
                        cCtx.rotate(p.rotation * Math.PI / 180);
                        cCtx.fillStyle = p.color;
                        cCtx.globalAlpha = p.opacity;
                        cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                        cCtx.restore();
                    }
                }
                
                if (active) {
                    requestAnimationFrame(loop);
                } else {
                    confettiCanvas.remove();
                }
            }
            
            loop();
        }
        
        // Draw centered solid gold banner panel to hold scratch text
        ctx.fillStyle = '#c5a880';
        drawRoundedRect(ctx, canvas.width / 2 - 95, canvas.height / 2 - 15, 190, 30, 5);

        // Inner solid gold border for banner
        ctx.strokeStyle = '#fffdf9';
        ctx.lineWidth = 0.6;
        drawRoundedRectStroke(ctx, canvas.width / 2 - 92, canvas.height / 2 - 12, 184, 24, 4);

        // Add traditional forest green text inside the banner
        ctx.fillStyle = '#1a3a2b';
        ctx.font = '600 10.5px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦ SCRATCH TO REVEAL ✦', canvas.width / 2, canvas.height / 2);
        
        // Core scratch action erases canvas pixels
        function scratch(e) {
            if (hasRevealed) return;
            const rect = canvas.getBoundingClientRect();
            // Supports mouse and touch pointers
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (!clientX || !clientY) return;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Calculate erased percentage to auto-reveal
        function checkScratchPercentage() {
            if (hasRevealed) return;
            try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imgData.data;
                let cleared = 0;
                for (let i = 3; i < pixels.length; i += 4) {
                    if (pixels[i] === 0) cleared++;
                }
                const percentage = cleared / (pixels.length / 4);
                
                // If 40%+ has been scratched, fade overlay out and reveal countdown timer
                if (percentage >= 0.40) {
                    hasRevealed = true;
                    canvas.classList.add('scratch-canvas-fade');
                    document.getElementById('heroRevealWrapper').classList.add('revealed');
                    
                    // Celebrate with a burst of theme-colored confetti particles!
                    fireConfetti();
                    
                    setTimeout(() => {
                        canvas.style.display = 'none';
                    }, 500);
                }
            } catch (err) {
                // Fail-safe trigger on local file origin sandbox restrictions
                hasRevealed = true;
                canvas.classList.add('scratch-canvas-fade');
                document.getElementById('heroRevealWrapper').classList.add('revealed');
                
                // Celebrate in fail-safe mode too!
                fireConfetti();
            }
        }
        
        // Listeners for mouse
        canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('mousemove', (e) => { if (isDrawing) scratch(e); });
        window.addEventListener('mouseup', () => { if (isDrawing) { isDrawing = false; checkScratchPercentage(); } });
        
        // Listeners for touchscreen devices
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('touchmove', (e) => {
            if (isDrawing) {
                e.preventDefault(); // Prevents mobile viewport scrolling while scratching!
                scratch(e);
            }
        });
        window.addEventListener('touchend', () => { if (isDrawing) { isDrawing = false; checkScratchPercentage(); } });
    }
    
    // Initialize Scratch Card
    initScratchCard();

    // 1. Countdown Timer (Target: Nov 24, 2026)
    // ==========================================
    const weddingDate = new Date('Nov 24, 2026 18:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;
        
        // Elements
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (difference < 0) {
            // Marriage day has arrived or passed
            if (daysEl) daysEl.innerText = '00';
            if (hoursEl) hoursEl.innerText = '00';
            if (minutesEl) minutesEl.innerText = '00';
            if (secondsEl) secondsEl.innerText = '00';
            return;
        }
        
        // Calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Padding
        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }
    
    // Initial run and repeat every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================
    // 2. Scroll Animation (IntersectionObserver)
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before entering viewport
    });
    
    fadeElements.forEach(el => fadeObserver.observe(el));



    // ==========================================
    // 6. Ambient Romantic Melody Synthesizer
    // ==========================================
    const musicToggle = document.getElementById('musicToggle');
    let audioCtx = null;
    let isPlaying = false;
    let synthTimer = null;
    
    // Jashn-E-Bahaaraa melody sequence
    // Each note: [frequency, duration_in_steps, wait_duration_in_steps]
    // 1 step = 260ms (tempo ~115 BPM)
    const melody = [
        // Kehne ko jashn-e-bahara hai
        [261.63, 1, 1],  // C4 (Keh-)
        [349.23, 1, 1],  // F4 (ne)
        [392.00, 1, 1],  // G4 (ko)
        [415.30, 2, 2],  // Ab4 (jashn-)
        [392.00, 1, 1],  // G4 (e-)
        [349.23, 1, 1],  // F4 (ba-)
        [329.63, 2, 2],  // E4 (haa-)
        [349.23, 2, 2],  // F4 (ra)
        [392.00, 3, 4],  // G4 (hai...)
        
        [0, 1, 1],       // Rest
        
        [261.63, 1, 1],  // C4 (Keh-)
        [349.23, 1, 1],  // F4 (ne)
        [392.00, 1, 1],  // G4 (ko)
        [415.30, 2, 2],  // Ab4 (jashn-)
        [392.00, 1, 1],  // G4 (e-)
        [349.23, 1, 1],  // F4 (ba-)
        [329.63, 2, 2],  // E4 (haa-)
        [349.23, 4, 6],  // F4 (ra hai)
        
        [0, 1, 2],       // Rest
        
        // Ishq yeh dekhke hairaan hai
        [261.63, 1, 1],  // C4 (Ishq)
        [415.30, 1, 1],  // Ab4 (yeh)
        [466.16, 1, 1],  // Bb4 (dekh-)
        [523.25, 2, 2],  // C5 (ke)
        [466.16, 1, 1],  // Bb4 (hai-)
        [415.30, 1, 1],  // Ab4 (raan)
        [392.00, 2, 2],  // G4 (hai...)
        [415.30, 4, 5],  // Ab4
        
        [0, 1, 1],       // Rest
        
        // Ke kehne ko jashn-e-bahara hai
        [261.63, 1, 1],  // C4 (Ke-)
        [349.23, 1, 1],  // F4 (ne)
        [392.00, 1, 1],  // G4 (ko)
        [415.30, 2, 2],  // Ab4 (jashn-)
        [392.00, 1, 1],  // G4 (e-)
        [349.23, 1, 1],  // F4 (ba-)
        [329.63, 2, 2],  // E4 (haa-)
        [349.23, 6, 8]   // F4 (ra hai...)
    ];
    
    let melodyIndex = 0;
    let useMp3 = false;
    
    // Create HTML5 Audio element for MP3 playback
    const bgMusic = new Audio();
    bgMusic.src = 'Music.mp3'; // Case-sensitive matching of the actual file (Music.mp3)
    bgMusic.loop = true;
    bgMusic.volume = 0.35; // Gentle background volume
    
    // Check if MP3 is available and loads successfully
    bgMusic.addEventListener('canplaythrough', () => {
        useMp3 = true;
    });
    bgMusic.addEventListener('error', () => {
        // If case-sensitive Music.mp3 fails, try lowercase music.mp3 as a backup
        if (bgMusic.src.includes('Music.mp3')) {
            bgMusic.src = 'music.mp3';
        } else {
            useMp3 = false; // Fallback to synthesizer
        }
    });
    
    function playNote(freq, time, duration) {
        if (!audioCtx) return;
        
        // Fundamental Warm Triangle Wave (Acoustic base)
        const osc1 = audioCtx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, time);
        
        // Second Harmonic Sine Wave (adds plucky sitar/plucked acoustic character)
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, time);
        
        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();
        const mainGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(filter);
        gain2.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(audioCtx.destination);
        
        // Gains mix: 75% warm triangle + 25% sine pluck
        gain1.gain.setValueAtTime(0.04, time);
        gain2.gain.setValueAtTime(0.012, time);
        
        // Soft lowpass filter to remove harsh overtones
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, time);
        
        // Pluck volume envelope
        mainGain.gain.setValueAtTime(0, time);
        mainGain.gain.linearRampToValueAtTime(1.0, time + 0.04);
        mainGain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.02);
        
        osc1.start(time);
        osc1.stop(time + duration);
        osc2.start(time);
        osc2.stop(time + duration);
    }
    
    function playNextMelodyStep() {
        if (!isPlaying || useMp3 || !audioCtx) return;
        
        const stepTime = 260; // ms per step (tempo ~115 BPM)
        const note = melody[melodyIndex];
        const freq = note[0];
        const durationSteps = note[1];
        const waitSteps = note[2];
        
        if (freq > 0) {
            const now = audioCtx.currentTime;
            playNote(freq, now, (durationSteps * stepTime) / 1000);
        }
        
        melodyIndex = (melodyIndex + 1) % melody.length;
        
        synthTimer = setTimeout(playNextMelodyStep, waitSteps * stepTime);
    }
    
    function startSynthesizer() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        melodyIndex = 0;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        playNextMelodyStep();
    }
    
    function toggleMusic() {
        if (isPlaying) {
            isPlaying = false;
            if (useMp3) {
                bgMusic.pause();
            } else {
                clearTimeout(synthTimer);
            }
            musicToggle.classList.remove('playing');
            musicToggle.style.backgroundColor = 'var(--primary-color)';
            musicToggle.title = 'Play romantic melody';
        } else {
            isPlaying = true;
            
            // Try playing the MP3 file first
            if (useMp3) {
                bgMusic.play().catch(err => {
                    console.log("MP3 autoplay blocked or file missing. Falling back to Synthesizer.", err);
                    useMp3 = false;
                    startSynthesizer();
                });
            } else {
                startSynthesizer();
            }
            
            musicToggle.classList.add('playing');
            musicToggle.style.backgroundColor = 'var(--accent-gold-bright)';
            musicToggle.title = 'Mute music';
        }
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }


    // ==========================================
    // 8. Canvas Falling Petals (Marigold & Rose)
    // ==========================================
    const canvas = document.getElementById('petalCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        class Petal {
            constructor() {
                this.reset();
                // Randomize initial vertical position so they fall at different times at startup
                this.y = Math.random() * height;
            }
            
            reset() {
                this.x = Math.random() * width;
                this.y = -30;
                this.size = 18 + Math.random() * 12; // font size for emoji
                this.opacity = 0.6 + Math.random() * 0.4;
                this.speedY = 0.5 + Math.random() * 0.7; // fall speed
                this.speedX = -0.15 + Math.random() * 0.3; // drift speed
                this.swaySpeed = 0.008 + Math.random() * 0.012;
                this.swayOffset = Math.random() * Math.PI * 2;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = -0.01 + Math.random() * 0.02;
                
                // Emoji choices matching user's uploaded reference: pink cherry blossom, green leaf branch, purple flower
                const emojis = ['🌸', '🌿', '🪻', '🍃'];
                this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
            }
            
            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.swayOffset) * 0.3;
                this.swayOffset += this.swaySpeed;
                this.rotation += this.rotationSpeed;
                
                // Reset when off viewport bounds
                if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                ctx.font = `${this.size}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.globalAlpha = this.opacity;
                
                ctx.fillText(this.emoji, 0, 0);
                
                ctx.restore();
            }
        }
        
        // Spawn 8 falling petals (highly sparse for a clean, minimal visual experience)
        const petals = Array.from({ length: 8 }, () => new Petal());
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            petals.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // ==========================================
    // 9. Auto-Scanning Gallery & Lightbox Modal
    // ==========================================
    const galleryGrid = document.getElementById('galleryGrid');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let galleryItems = [];
    let activeLightboxIndex = -1;
    
    // Proactively scan folder gallery/ for files 1.jpg, 2.jpg... 1.mp4, 2.mp4...
    async function scanGalleryFolder() {
        const maxItems = 30; // Max items to scan
        // Support both lowercase and uppercase extensions for case-sensitive live Linux servers
        const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];
        const videoExtensions = ['mp4', 'webm', 'mov', 'MP4', 'WEBM', 'MOV'];
        
        // Helper to test if image loads
        const checkImage = (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        };
        
        // Helper to test if video loads
        const checkVideo = (url) => {
            return new Promise((resolve) => {
                const video = document.createElement('video');
                video.src = url;
                video.onloadedmetadata = () => resolve(true);
                video.onerror = () => resolve(false);
                // Set a short timeout as fallback
                setTimeout(() => resolve(false), 250);
            });
        };
        
        const promises = [];
        
        // Push all check requests into a single promise list for parallel check execution
        for (let i = 1; i <= maxItems; i++) {
            // Check images
            imageExtensions.forEach(ext => {
                const url = `gallery/${i}.${ext}`;
                promises.push(
                    checkImage(url).then(exists => exists ? { i, type: 'image', url, title: `Memory ${i}` } : null)
                );
            });
            // Check videos
            videoExtensions.forEach(ext => {
                const url = `gallery/${i}.${ext}`;
                promises.push(
                    checkVideo(url).then(exists => exists ? { i, type: 'video', url, title: `Video ${i}` } : null)
                );
            });
        }
        
        // Wait for all HTTP checks to finish in parallel
        const results = await Promise.all(promises);
        
        // Filter out null checks
        const items = results.filter(r => r !== null);
        
        // Sort items by index so they display in order (1, 2, 3...)
        // Since different extensions might exist, we group by index and keep the first match per index
        const uniqueItems = [];
        const seenIndices = new Set();
        
        // Sort by index
        items.sort((a, b) => a.i - b.i);
        
        items.forEach(item => {
            if (!seenIndices.has(item.i)) {
                seenIndices.add(item.i);
                uniqueItems.push(item);
            }
        });
        
        // Fallback to placeholders if no files found
        if (uniqueItems.length === 0) {
            galleryItems = [
                { 
                    type: 'image', 
                    url: 'gallery/1.jpg',
                    title: 'The Henna'
                },
                { 
                    type: 'image', 
                    url: 'gallery/2.jpg',
                    title: 'The Mandap'
                },
                { 
                    type: 'image', 
                    url: 'gallery/3.jpg',
                    title: 'The Celebration'
                }
            ];
        } else {
            galleryItems = uniqueItems;
        }
        
        renderGallery();
    }
    
    function renderGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        
        galleryItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-item fade-up visible';
            card.setAttribute('data-index', index);
            
            // Build media element
            let mediaEl;
            if (item.type === 'video') {
                mediaEl = document.createElement('video');
                mediaEl.src = item.url;
                mediaEl.muted = true;
                mediaEl.loop = true;
                mediaEl.playsInline = true;
                
                // Add hover play/pause triggers
                card.addEventListener('mouseenter', () => mediaEl.play().catch(() => {}));
                card.addEventListener('mouseleave', () => {
                    mediaEl.pause();
                    mediaEl.currentTime = 0;
                });
                
                // Video badge indicator
                const badge = document.createElement('div');
                badge.className = 'video-badge';
                badge.innerHTML = `
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="vertical-align: middle;">
                        <path d="M8 5v14l11-7z"/>
                    </svg> Video`;
                card.appendChild(badge);
            } else {
                mediaEl = document.createElement('img');
                mediaEl.src = item.url;
                mediaEl.alt = item.title || 'Wedding Memory';
                mediaEl.loading = 'lazy';
            }
            
            // View fullscreen trigger
            card.addEventListener('click', () => openLightbox(index));
            
            card.appendChild(mediaEl);
            galleryGrid.appendChild(card);
        });
    }
    
    // Lightbox Controls
    function openLightbox(index) {
        if (!lightboxModal || !lightboxContent) return;
        activeLightboxIndex = index;
        loadLightboxMedia();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    
    function closeLightbox() {
        if (!lightboxModal || !lightboxContent) return;
        lightboxModal.classList.remove('active');
        lightboxContent.innerHTML = '';
        activeLightboxIndex = -1;
        document.body.style.overflow = ''; // Unlock background scroll
    }
    
    function loadLightboxMedia() {
        if (!lightboxContent) return;
        lightboxContent.innerHTML = '';
        
        const item = galleryItems[activeLightboxIndex];
        if (!item) return;
        
        let el;
        if (item.type === 'video') {
            el = document.createElement('video');
            el.src = item.url;
            el.controls = true;
            el.autoplay = true;
            el.loop = true;
            el.playsInline = true;
        } else {
            el = document.createElement('img');
            el.src = item.url;
            el.alt = item.title || 'Wedding Memory Fullscreen';
        }
        lightboxContent.appendChild(el);
    }
    
    function prevLightbox() {
        if (galleryItems.length === 0) return;
        activeLightboxIndex = (activeLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
        loadLightboxMedia();
    }
    
    function nextLightbox() {
        if (galleryItems.length === 0) return;
        activeLightboxIndex = (activeLightboxIndex + 1) % galleryItems.length;
        loadLightboxMedia();
    }
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
    
    // Close modal on background overlay click
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }
    
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (activeLightboxIndex === -1) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
    });

    // Start auto-scanning
    scanGalleryFolder();
});
