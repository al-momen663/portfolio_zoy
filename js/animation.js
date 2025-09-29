// Enhanced floating animation with random delays
document.addEventListener('DOMContentLoaded', () => {
    const floatingElements = document.querySelectorAll('.floating');
    
    floatingElements.forEach((element) => {
        // Random delay between 0 and 2 seconds for more natural effect
        const randomDelay = Math.random() * 2;
        element.style.animationDelay = `${randomDelay}s`;
    });
});

// Typing effect for text
function initTypingEffect(element, texts, speed = 100, pause = 2000) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isPaused) {
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
                type();
            }, pause);
            return;
        }
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, speed / 2);
            }
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isPaused = true;
                setTimeout(type, pause);
            } else {
                setTimeout(type, speed);
            }
        }
    }
    
    type();
}

// Initialize typing effect on elements with data-typing attribute
document.addEventListener('DOMContentLoaded', () => {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const texts = JSON.parse(element.getAttribute('data-typing'));
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        const pause = parseInt(element.getAttribute('data-pause')) || 2000;
        
        initTypingEffect(element, texts, speed, pause);
    });
});

// Parallax scrolling effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Initialize parallax on elements with parallax class
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
});

// Hover sound effects (optional)
function initHoverSounds() {
    const hoverElements = document.querySelectorAll('.btn, .social-icon, .nav-link');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // You can add sound effects here
            // For example: playHoverSound();
        });
    });
}

// Particle background effect (optional)
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particlesContainer);
    
    // Create particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random animation duration between 10s and 20s
        const duration = Math.random() * 10 + 10;
        
        // Random delay
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(74, 108, 247, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${left}vw;
            top: ${top}vh;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Scroll-triggered animations
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
});

// Dynamic background color change based on scroll
function initDynamicBackground() {
    const sections = document.querySelectorAll('section');
    const colors = [
        'linear-gradient(135deg, #f5f8ff 0%, #e6ecff 100%)',
        'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        'linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%)',
        'linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)'
    ];
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight / 2 && 
                scrollPosition < sectionTop + sectionHeight - window.innerHeight / 2) {
                document.body.style.background = colors[index % colors.length];
                document.body.style.transition = 'background 0.5s ease';
            }
        });
    });
}

// Cursor follower effect
function initCursorFollower() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Add hover effect
    const hoverElements = document.querySelectorAll('a, button, .hover-effect');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = '#ff6b6b';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'var(--primary-color)';
        });
    });
}

// Page load progress bar
function initPageLoadProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'page-load-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 10000;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('load', () => {
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressBar.style.opacity = '0';
            setTimeout(() => {
                progressBar.remove();
            }, 300);
        }, 500);
    });
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 90) {
            clearInterval(interval);
        }
        progressBar.style.width = progress + '%';
    }, 100);
}

// Initialize page load progress
document.addEventListener('DOMContentLoaded', () => {
    initPageLoadProgress();
});

// Text scramble effect
function initTextScramble(element) {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const originalText = element.textContent;
    let queue = [];
    
    for (let i = 0; i < originalText.length; i++) {
        queue.push({
            from: chars[Math.floor(Math.random() * chars.length)],
            to: originalText[i],
            start: Math.floor(Math.random() * 40),
            end: Math.floor(Math.random() * 40) + 40
        });
    }
    
    let frame = 0;
    let output = '';
    
    function update() {
        output = '';
        let complete = 0;
        
        for (let i = 0; i < queue.length; i++) {
            let { from, to, start, end, char } = queue[i];
            
            if (frame >= end) {
                complete++;
                output += to;
            } else if (frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = chars[Math.floor(Math.random() * chars.length)];
                    queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        
        element.textContent = output;
        
        if (complete === queue.length) {
            cancelAnimationFrame(update);
        } else {
            frame++;
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Initialize text scramble on elements with data-scramble attribute
document.addEventListener('DOMContentLoaded', () => {
    const scrambleElements = document.querySelectorAll('[data-scramble]');
    scrambleElements.forEach(element => {
        initTextScramble(element);
    });
});
// Certificate hover animation
function initCertificateAnimations() {
    const certificateItems = document.querySelectorAll('.certificate-item');
    
    certificateItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize certificate animations
document.addEventListener('DOMContentLoaded', () => {
    initCertificateAnimations();
});

// Export functions for global access
window.Animations = {
    createParticles,
    initTypingEffect,
    initParallax,
    initCursorFollower,
    initTextScramble,
    initDynamicBackground
};

// Uncomment the lines below to enable specific effects:

// createParticles(); // Enable particle background
// initCursorFollower(); // Enable cursor follower
// initDynamicBackground(); // Enable dynamic background