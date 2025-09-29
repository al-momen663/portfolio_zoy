// Mobile Navigation Toggle
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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // In a real application, you would send this data to a server
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            this.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
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

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Add specific animations based on element type
            if (entry.target.classList.contains('achievement-card')) {
                entry.target.classList.add('zoom-in');
            }
            
            if (entry.target.classList.contains('project-item')) {
                entry.target.classList.add('slide-in-left');
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
function initAnimations() {
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
        
        // Store original source
        const originalSrc = img.src;
        
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
            
            // Create a placeholder based on the image context
            const altText = img.alt || 'Project Image';
            const section = img.closest('.project-category');
            const sectionName = section ? section.querySelector('h2').textContent.split('(')[0].trim() : 'Project';
            
            // Use a colored placeholder instead of trying to load missing images
            const colors = ['4a6cf7', '6a75f8', '1d2144', 'f54a6c', '4af54a'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            img.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#${randomColor}"/>
                    <text x="50%" y="50%" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dy=".3em">
                        ${sectionName} - ${altText}
                    </text>
                </svg>
            `)}`;
            
            console.warn(`Failed to load image: ${originalSrc}, using placeholder`);
        });
    });
}

function handleImageLoad(img) {
    img.classList.remove('loading-img');
    img.classList.add('loaded');
}

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
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

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initScrollProgress();
    initAnimations();
    initImageLoading();
    
    // Observe counter elements
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
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
    
    // Trigger page animations
    triggerPageAnimations();
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
`;
document.head.appendChild(loadingStyles);

// Page transition effects
function initPageTransitions() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        // Skip external links and links with no transition
        if (link.target === '_blank' || link.href.includes('mailto:') || link.href.includes('tel:')) {
            return;
        }
        
        // Check if it's an internal link
        const isInternalLink = link.hostname === window.location.hostname;
        
        if (isInternalLink) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Add page transition
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
});

// Trigger page-specific animations
function triggerPageAnimations() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initHomeAnimations();
            break;
        case 'about.html':
            initAboutAnimations();
            break;
        case 'projects.html':
            initProjectsAnimations();
            break;
        case 'contact.html':
            initContactAnimations();
            break;
    }
}

// Home page animations
function initHomeAnimations() {
    // Animate the main title
    const titleLine = document.querySelector('.title-line');
    const titleName = document.querySelector('.title-name');
    
    if (titleLine && titleName) {
        // Reset animations
        titleLine.style.animation = 'none';
        titleName.style.animation = 'none';
        
        // Trigger reflow
        void titleLine.offsetWidth;
        void titleName.offsetWidth;
        
        // Restart animations
        titleLine.style.animation = 'slideUp 0.8s ease 0.5s forwards';
        titleName.style.animation = 'slideUp 0.8s ease 0.8s forwards';
    }
    
    // Animate text paragraphs with stagger
    const fadeTexts = document.querySelectorAll('.fade-in-text');
    fadeTexts.forEach((text, index) => {
        text.style.animation = `fadeInUp 1s ease ${1 + (index * 0.2)}s forwards`;
    });
    
    // Animate social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1 + 2}s`;
        icon.classList.add('fade-in');
    });
    
    // Animate profile image
    const profileImage = document.querySelector('.image-container');
    if (profileImage) {
        profileImage.style.animationDelay = '1s';
        profileImage.classList.add('fade-in');
    }
}

// About page animations
function initAboutAnimations() {
    // Animate achievement cards with stagger
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Animate certificate items
    const certificateItems = document.querySelectorAll('.certificate-item');
    certificateItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Animate client items
    const clientItems = document.querySelectorAll('.client-item');
    clientItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
    });
}

// Projects page animations
function initProjectsAnimations() {
    // Animate project categories
    const projectCategories = document.querySelectorAll('.project-category');
    projectCategories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.3}s`;
        category.classList.add('fade-in');
    });
    
    // Animate project items with stagger within each category
    document.querySelectorAll('.projects-grid').forEach((grid, gridIndex) => {
        const items = grid.querySelectorAll('.project-item');
        items.forEach((item, itemIndex) => {
            item.style.animationDelay = `${(gridIndex * 0.5) + (itemIndex * 0.1)}s`;
        });
    });
}

// Contact page animations
function initContactAnimations() {
    // Animate contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('fade-in');
    });
    
    // Animate form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.15}s`;
        group.classList.add('fade-in');
    });
    
    // Animate social icons
    const socialIcons = document.querySelectorAll('.social-links .social-icon');
    socialIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1 + 1}s`;
        icon.classList.add('fade-in');
    });
}

// Add animation to bold text elements
document.addEventListener('DOMContentLoaded', () => {
    const boldTextElements = document.querySelectorAll('.bold-text');
    boldTextElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
        element.classList.add('fade-in');
    });
});
// Certificate Modal Functions
function openCertificateModal() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('certificateModal');
    if (event.target === modal) {
        closeCertificateModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCertificateModal();
    }
});

// Initialize certificate animations
function initCertificateAnimations() {
    const certificateItems = document.querySelectorAll('.certificate-item');
    
    certificateItems.forEach((item, index) => {
        // Add staggered animation delay
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('fade-in');
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCertificateAnimations();
});
// Export functions for global access
window.Portfolio = {
    showNotification,
    animateCounter,
    initHomeAnimations,
    initAboutAnimations,
    initProjectsAnimations,
    initContactAnimations
};