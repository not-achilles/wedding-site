/**
 * Sarah & David's Wedding Invitation Website - Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
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
    
    // Plucky romantic arpeggio notes in D-major (represented as frequencies)
    // Progression: D major - A major - B minor - F# minor - G major - D major - G major - A major (Canon)
    const chords = [
        [146.83, 220.00, 293.66, 369.99], // D3, A3, D4, F#4
        [110.00, 220.00, 277.18, 329.63], // A2, A3, C#4, E4
        [123.47, 185.00, 246.94, 293.66], // B2, F#3, B3, D4
        [92.50,  185.00, 220.00, 277.18], // F#2, F#3, A3, C#4
        [98.00,  196.00, 246.94, 293.66], // G2, G3, B3, D4
        [146.83, 220.00, 293.66, 369.99], // D3, A3, D4, F#4
        [98.00,  196.00, 246.94, 293.66], // G2, G3, B3, D4
        [110.00, 220.00, 277.18, 329.63]  // A2, A3, C#4, E4
    ];
    
    let currentChordIndex = 0;
    let noteIndex = 0;
    
    function playNote(freq, time, duration) {
        if (!audioCtx) return;
        
        // Create nodes
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Settings: Soft triangle wave for acoustic, flute-like tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        // Filter out harsh highs for romantic ambient warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, time);
        
        // Volume Pluck Envelope
        gainNode.gain.setValueAtTime(0, time);
        // Soft attack
        gainNode.gain.linearRampToValueAtTime(0.04, time + 0.05);
        // Gentle decay/release
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05);
        
        osc.start(time);
        osc.stop(time + duration);
    }
    
    function playNextMelodyStep() {
        if (!isPlaying || !audioCtx) return;
        
        const tempo = 180; // duration between steps in ms (smooth arpeggio rate)
        const secPerStep = tempo / 1000;
        
        const chord = chords[currentChordIndex];
        const freq = chord[noteIndex];
        
        const now = audioCtx.currentTime;
        // Play pluck note
        playNote(freq, now, 1.2); 
        
        // Advance arpeggio indexes
        noteIndex++;
        if (noteIndex >= chord.length) {
            noteIndex = 0;
            currentChordIndex = (currentChordIndex + 1) % chords.length;
        }
        
        // Schedule next step
        synthTimer = setTimeout(playNextMelodyStep, tempo);
    }
    
    function toggleMusic() {
        if (!audioCtx) {
            // Audio context can only start on user gesture
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (isPlaying) {
            // Stop playing
            isPlaying = false;
            clearTimeout(synthTimer);
            musicToggle.classList.remove('playing');
            musicToggle.style.backgroundColor = 'var(--primary-color)';
            musicToggle.title = 'Play romantic melody';
        } else {
            // Start playing
            isPlaying = true;
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            musicToggle.classList.add('playing');
            musicToggle.style.backgroundColor = 'var(--accent-gold-bright)';
            musicToggle.title = 'Mute music';
            playNextMelodyStep();
        }
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }

    // ==========================================
    // 7. Interactive India Map Scroll Zoom
    // ==========================================
    const mapSection = document.getElementById('venue-map-section');
    const mapImageWrapper = document.getElementById('mapImageWrapper');
    const mapPopupCard = document.getElementById('mapPopupCard');
    const mapGuidance = document.getElementById('mapGuidance');
    
    function handleMapScroll() {
        if (!mapSection || !mapImageWrapper) return;
        
        const rect = mapSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if section is inside viewport scrollable range
        if (rect.top <= 0 && rect.bottom >= viewportHeight) {
            // Scrolled distance within the sticky region
            const totalScrollable = rect.height - viewportHeight;
            const scrolled = -rect.top;
            
            // Calculate progress (0 to 1)
            let progress = scrolled / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));
            
            // Map progress to scale (starts at 1, goes up to 12)
            const scaleVal = 1 + progress * 11;
            mapImageWrapper.style.transform = `scale(${scaleVal})`;
            
            // Fade out guidance arrow as we zoom in
            if (mapGuidance) {
                mapGuidance.style.opacity = Math.max(0, 1 - progress * 2.5);
            }
            
            // Trigger Popup Card when fully zoomed (90%+ progress)
            if (progress >= 0.90) {
                mapPopupCard.classList.add('visible');
            } else {
                mapPopupCard.classList.remove('visible');
            }
        } else if (rect.top > 0) {
            // Above sticky range
            mapImageWrapper.style.transform = 'scale(1)';
            if (mapGuidance) mapGuidance.style.opacity = 1;
            if (mapPopupCard) mapPopupCard.classList.remove('visible');
        } else if (rect.bottom < viewportHeight) {
            // Below sticky range
            mapImageWrapper.style.transform = 'scale(12)';
            if (mapGuidance) mapGuidance.style.opacity = 0;
            if (mapPopupCard) mapPopupCard.classList.add('visible');
        }
    }
    
    // Bind to scroll events with requestAnimationFrame for smooth execution
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleMapScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Run initially
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
                this.y = -20;
                this.w = 8 + Math.random() * 12; // width
                this.h = 6 + Math.random() * 10; // height
                this.opacity = 0.5 + Math.random() * 0.45;
                this.speedY = 0.9 + Math.random() * 1.5; // fall speed
                this.speedX = -0.4 + Math.random() * 0.8; // drift speed
                this.swaySpeed = 0.01 + Math.random() * 0.015;
                this.swayOffset = Math.random() * Math.PI * 2;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = -0.01 + Math.random() * 0.02;
                
                // Color choices: Rose pink/red or Marigold orange/gold
                const colorRoll = Math.random();
                if (colorRoll < 0.55) {
                    // Rose red & pink shades
                    const roses = ['#D32F2F', '#E91E63', '#FF4081', '#C2185B'];
                    this.color = roses[Math.floor(Math.random() * roses.length)];
                } else {
                    // Golden marigold yellow & orange shades
                    const marigolds = ['#FFC107', '#FF9800', '#FFB300', '#D4AF37'];
                    this.color = marigolds[Math.floor(Math.random() * marigolds.length)];
                }
            }
            
            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.swayOffset) * 0.4;
                this.swayOffset += this.swaySpeed;
                this.rotation += this.rotationSpeed;
                
                // Simulate 3D flapping/fluttering
                this.currentW = this.w * Math.cos(this.rotation * 0.5);
                
                // Reset when off viewport bounds
                if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                ctx.beginPath();
                // Draw realistic organic petal shape
                ctx.moveTo(0, -this.h / 2);
                ctx.quadraticCurveTo(this.currentW, -this.h / 2, this.currentW / 2, this.h / 2);
                ctx.quadraticCurveTo(-this.currentW, this.h / 2, 0, -this.h / 2);
                ctx.closePath();
                
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                
                // Add highlight outline
                ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
                
                ctx.restore();
            }
        }
        
        // Spawn 45 falling petals
        const petals = Array.from({ length: 45 }, () => new Petal());
        
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
        const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        const videoExtensions = ['mp4', 'webm', 'mov'];
        const items = [];
        
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
        
        // Scan index 1 to maxItems
        for (let i = 1; i <= maxItems; i++) {
            let found = false;
            
            // Check images
            for (const ext of imageExtensions) {
                const url = `gallery/${i}.${ext}`;
                const exists = await checkImage(url);
                if (exists) {
                    items.push({ type: 'image', url, title: `Memory ${i}` });
                    found = true;
                    break;
                }
            }
            
            // Check videos
            for (const ext of videoExtensions) {
                const url = `gallery/${i}.${ext}`;
                const exists = await checkVideo(url);
                if (exists) {
                    items.push({ type: 'video', url, title: `Video ${i}` });
                    found = true;
                    break;
                }
            }
        }
        
        // Fallback to placeholders if no files found
        if (items.length === 0) {
            galleryItems = [
                { 
                    type: 'image', 
                    url: 'file:///C:/Users/anmol/.gemini/antigravity/brain/c78c7729-ecdd-493e-a8a0-71f7665c4eed/gallery_mehendi_1783883393319.jpg',
                    title: 'The Henna'
                },
                { 
                    type: 'image', 
                    url: 'file:///C:/Users/anmol/.gemini/antigravity/brain/c78c7729-ecdd-493e-a8a0-71f7665c4eed/gallery_mandap_1783883404820.jpg',
                    title: 'The Mandap'
                },
                { 
                    type: 'image', 
                    url: 'file:///C:/Users/anmol/.gemini/antigravity/brain/c78c7729-ecdd-493e-a8a0-71f7665c4eed/gallery_sangeet_1783883416855.jpg',
                    title: 'The Celebration'
                }
            ];
        } else {
            galleryItems = items;
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
