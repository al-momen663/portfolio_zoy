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
        if (targetElement) {
            console.log('Section exists on page, scrolling to it');
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

// Contact Form Handler
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Create email content
            const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            
            // Open default email client
            window.location.href = `mailto:zoysaharia1971@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Optional: Show success message
            showNotification('Your email client will open with the message. Please click send to deliver your message.', 'success');
            
            // Optional: Reset form after submission
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        });
    }
}

// Certificate Modal Functions
function openCertificateModal(imageSrc, title, description, date, issuer) {
    const modal = document.getElementById('certificateModal');
    const modalImage = document.getElementById('modalCertificateImage');
    const modalTitle = document.getElementById('modalCertificateTitle');
    const modalDescription = document.getElementById('modalCertificateDescription');
    const modalDate = document.getElementById('modalCertificateDate');
    const modalIssuer = document.getElementById('modalCertificateIssuer');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalDate.textContent = date;
        modalIssuer.textContent = issuer;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize certificate buttons
function initializeCertificateButtons() {
    const certificateButtons = document.querySelectorAll('.view-certificate-btn');
    
    certificateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const date = this.getAttribute('data-date');
            const issuer = this.getAttribute('data-issuer');
            
            openCertificateModal(imageSrc, title, description, date, issuer);
        });
    });

    // Close modal when clicking outside or on close button
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCertificateModal();
            }
        });
        
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCertificateModal);
        }
        
        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCertificateModal();
            }
        });
    }
}

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
    });
}

// Enhanced Social Media Interactions
function initSocialMediaFeatures() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach((icon, index) => {
        // Staggered animation
        icon.style.animationDelay = `${index * 0.1}s`;
        icon.classList.add('fade-in');
        
        // Add hover effects
        icon.addEventListener('mouseenter', function() {
            console.log('Hovered:', this.getAttribute('aria-label'));
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing main application');
    
    // Initialize enhanced navigation FIRST
    initializeNavigationSystem();
    initializeEnhancedSmoothScroll();
    initMobileNavigation();
    initEnhancedNavigation();
    
    // Initialize forms and modals
    initializeContactForm();
    initializeCertificateButtons();
    
    // Then initialize other components
    initScrollProgress();
    initAnimations();
    initImageLoading();
    initSocialMediaFeatures();
    
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
    
    // Add CSS for loading images and animations
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
        
        .fade-in {
            animation: fadeIn 0.6s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(loadingStyles);
    
    console.log('Main application initialized successfully');
});

// Export functions for global access
window.Portfolio = {
    showNotification,
    initializeNavigationSystem,
    loadSectionContent,
    openCertificateModal,
    closeCertificateModal
};