// Enhanced Navigation Content Loading System
let currentSection = '';
let isNavigationInitialized = false;

// Initialize navigation system
function initializeNavigationSystem() {
    if (isNavigationInitialized) return;
    
    console.log('Initializing navigation system...');
    
    // Handle section navigation clicks
    document.addEventListener('click', function(e) {
        const navLink = e.target.closest('.nav-link, .section-nav-link, .project-nav-link');
        if (navLink && navLink.hash) {
            e.preventDefault();
            const targetSection = navLink.hash.substring(1);
            loadSectionContent(targetSection, navLink.href);
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.section) {
            loadSectionContent(e.state.section, null, false);
        }
    });
    
    // Load initial section based on URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        setTimeout(() => {
            loadSectionContent(initialHash);
        }, 100);
    }
    
    isNavigationInitialized = true;
    console.log('Navigation system initialized');
}

// Load section content with error handling
function loadSectionContent(sectionId, url = null, updateHistory = true) {
    console.log('Loading section:', sectionId);
    
    // Show loading state
    showSectionLoadingState(sectionId);
    
    try {
        // Scroll to section if it exists on current page
        const targetElement = document.getElementById(sectionId);
        if (targetElement && isElementInViewport(targetElement)) {
            console.log('Section exists on page, scrolling to it');
            scrollToSection(sectionId);
            hideSectionLoadingState();
            return;
        }
        
        if (targetElement) {
            console.log('Section exists but not in view, scrolling');
            scrollToSection(sectionId);
            hideSectionLoadingState();
            return;
        }
        
        // If section doesn't exist, try to load content
        console.log('Section not found, attempting dynamic load');
        loadDynamicContent(sectionId, url, updateHistory);
        
    } catch (error) {
        console.error('Error loading section:', error);
        hideSectionLoadingState();
        showNotification('Failed to load section content', 'error');
    }
}

// Check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Scroll to section smoothly
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Update active state
        updateActiveNavigationState(sectionId);
    }
}

// Show loading state for sections
function showSectionLoadingState(sectionId) {
    // Remove any existing loading states
    hideSectionLoadingState();
    
    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'section-loading-indicator';
    loadingIndicator.className = 'section-loading';
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading ${sectionId} content...</p>
    `;
    
    loadingIndicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        text-align: center;
    `;
    
    document.body.appendChild(loadingIndicator);
}

// Hide loading state
function hideSectionLoadingState() {
    const loadingIndicator = document.getElementById('section-loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Load dynamic content
function loadDynamicContent(sectionId, url, updateHistory) {
    // For now, we'll scroll to the section if it exists
    // In a real implementation, you would fetch content from the server
    const section = document.getElementById(sectionId);
    if (section) {
        scrollToSection(sectionId);
        hideSectionLoadingState();
        
        if (updateHistory) {
            window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
        }
    } else {
        // Section not found
        console.warn(`Section ${sectionId} not found on current page`);
        hideSectionLoadingState();
        showNotification(`Section "${sectionId}" is not available on this page`, 'error');
    }
}

// Update active navigation state
function updateActiveNavigationState(activeSection) {
    // Remove active class from all navigation links
    document.querySelectorAll('.nav-link, .section-nav-link, .project-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section link
    const activeLink = document.querySelector(`[href="#${activeSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentSection = activeSection;
}

// Enhanced smooth scrolling that works with dynamic content
function initializeEnhancedSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL hash without page jump
                window.history.pushState(null, '', targetId);
                updateActiveNavigationState(targetId.substring(1));
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.achievement-card, .client-item, .education-item, .project-item, .timeline-item, .certificate-item'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Enhanced Image loading handling
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading class
        img.classList.add('loading-img');
        
        // Remove loading class when image is loaded
        if (img.complete) {
            handleImageLoad(img);
        } else {
            img.addEventListener('load', () => handleImageLoad(img));
        }
        
        // Enhanced error handling with placeholder
        img.addEventListener('error', () => {
            img.classList.remove('loading-img');
            img.classList.add('error');
            
            // Use a colored placeholder instead of trying to load missing images
            const colors = ['4a6cf7', '6a75f8', '1d2144', 'f54a6c', '4af54a'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            img.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#${randomColor}"/>
                    <text x="50%" y="50%" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dy=".3em">
                        Image not available
                    </text>
                </svg>
            `)}`;
        });
    });
}

function handleImageLoad(img) {
    img.classList.remove('loading-img');
    img.classList.add('loaded');
}

// Active section highlighting
function updateActiveSection() {
    const sections = document.querySelectorAll('.about-subsection, .project-category');
    const navLinks = document.querySelectorAll('.section-nav-link, .project-nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Mobile Navigation Toggle
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing main application');
    
    // Initialize enhanced navigation FIRST
    initializeNavigationSystem();
    initializeEnhancedSmoothScroll();
    initMobileNavigation();
    
    // Then initialize other components
    initScrollProgress();
    initAnimations();
    initImageLoading();
    
    // Add scroll event listener for active section
    window.addEventListener('scroll', updateActiveSection);
    
    // Add hover effects to interactive elements
    document.querySelectorAll('.btn, .social-icon, .achievement-card, .project-item').forEach(el => {
        el.classList.add('hover-lift');
    });
    
    // Initialize floating elements
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add CSS for loading images
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading-img {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .loading-img.loaded {
            opacity: 1;
        }
        .loading-img.error {
            opacity: 1;
            filter: grayscale(100%);
        }
        .loading-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .section-loading p {
            margin: 0;
            color: var(--text-color);
            font-size: 14px;
        }
    `;
    document.head.appendChild(loadingStyles);
    
    console.log('Main application initialized successfully');
});
// Enhanced Navigation Interactions
function initEnhancedNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
        
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// Particle Background System
function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.appendChild(container);
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        const opacity = Math.random() * 0.3 + 0.1;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}vw;
            top: ${top}vh;
            animation-duration: ${animationDuration}s;
            animation-delay: ${animationDelay}s;
            opacity: ${opacity};
        `;
        
        container.appendChild(particle);
    }
}

// Enhanced Scroll Animations
function initEnhancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add staggered animations for cards
                if (entry.target.classList.contains('achievement-card') || 
                    entry.target.classList.contains('project-item') ||
                    entry.target.classList.contains('certificate-item')) {
                    entry.target.classList.add('hover-lift');
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const elementsToAnimate = document.querySelectorAll(
        '.achievement-card, .project-item, .certificate-item, .client-item, .education-item, .timeline-item'
    );
    
    elementsToAnimate.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Enhanced Cursor Effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--primary-color), transparent);
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
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .social-icon, .gallery-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, var(--secondary-color), transparent)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'radial-gradient(circle, var(--primary-color), transparent)';
        });
    });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initEnhancedNavigation();
    createParticles();
    initEnhancedScrollAnimations();
    initCursorEffects();
    
    // Add loading animation
    document.body.classList.add('loaded');
});
// Enhanced Social Media Interactions
function initSocialMediaFeatures() {
    // Add loading animation to social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach((icon, index) => {
        // Staggered animation
        icon.style.animationDelay = `${index * 0.1}s`;
        icon.classList.add('fade-in');
        
        // Add click animation
        icon.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add hover sound effect (optional)
        icon.addEventListener('mouseenter', function() {
            // You can add a subtle sound effect here
            console.log('Hovered:', this.getAttribute('aria-label'));
        });
    });
    
    // Social media counter animation
    animateSocialCounters();
}

// Animate social media counters (if you have follower counts)
function animateSocialCounters() {
    const counters = document.querySelectorAll('.social-counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        animateCounter(counter, target, 2000);
    });
}

// Counter animation function
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Add ripple animation to CSS
const rippleStyles = `
@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.social-icon {
    position: relative;
    overflow: hidden;
}
`;

// Inject ripple styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSocialMediaFeatures();
});

// Social Media Share functionality
function shareOnSocialMedia(platform, url, text) {
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Export functions for global access
window.Portfolio = {
    showNotification,
    initializeNavigationSystem,
    loadSectionContent
};