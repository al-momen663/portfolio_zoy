// Projects Gallery Functionality with Enhanced Error Handling
let currentImageIndex = 0;
let currentGallery = [];
let isModalOpen = false;

// Cache DOM elements with null checks
let imageModal, modalImage, closeModalBtn, prevBtn, nextBtn;

// Initialize projects gallery
function initializeProjectsGallery() {
    console.log('Initializing projects gallery...');
    
    // Cache DOM elements safely
    imageModal = document.getElementById('imageModal');
    modalImage = document.getElementById('modalImage');
    closeModalBtn = document.querySelector('.close-modal');
    prevBtn = document.querySelector('.prev-btn');
    nextBtn = document.querySelector('.next-btn');
    
    // Initialize event listeners
    initializeEventListeners();
    initGalleryAnimations();
    addModalStyles();
    
    console.log('Projects gallery initialized');
}

// Initialize Event Listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Close modal events
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeImageModal);
    } else {
        console.warn('Close modal button not found');
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateImage(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateImage(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Close modal when clicking outside image
    if (imageModal) {
        imageModal.addEventListener('click', (event) => {
            if (event.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Initialize touch support for mobile
    initializeTouchSupport();
    
    // Add click listeners to gallery items - FIXED APPROACH
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openImageModal(this.src, e);
        });
    });
    
    // Alternative approach for gallery items that might have wrapper divs
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, e);
            }
        });
    });
    
    console.log('Event listeners initialized');
}

// Enhanced openImageModal with better error handling
function openImageModal(imageSrc, event) {
    console.log('Opening image modal for:', imageSrc);
    
    if (!imageModal || !modalImage) {
        console.error('Modal elements not found');
        showNotification('Gallery not available', 'error');
        return;
    }
    
    try {
        // Get all images in the current section - with fallback if event is undefined
        let section;
        if (event && event.target) {
            section = event.target.closest('.project-category');
        } else {
            // Fallback: find the section containing this image
            const imgElement = document.querySelector(`img[src="${imageSrc}"]`);
            if (imgElement) {
                section = imgElement.closest('.project-category');
            }
        }
        
        if (!section) {
            console.warn('No project section found, trying alternative method');
            // Try to find any project category
            section = document.querySelector('.project-category');
        }
        
        if (!section) {
            console.error('Could not find any project section');
            showNotification('Gallery section not found', 'error');
            return;
        }
        
        const galleryItems = section.querySelectorAll('.gallery-item img');
        console.log('Found gallery items:', galleryItems.length);
        
        if (galleryItems.length === 0) {
            showNotification('No images available in this section', 'info');
            return;
        }
        
        // Create array of image sources with fallback handling
        currentGallery = Array.from(galleryItems).map(img => {
            return img.complete && img.naturalHeight !== 0 ? img.src : createPlaceholderImage(img.alt);
        });
        
        currentImageIndex = Math.max(0, currentGallery.indexOf(imageSrc));
        if (currentImageIndex === -1) {
            currentImageIndex = 0; // Fallback to first image
        }
        
        // Preload adjacent images for smoother navigation
        preloadAdjacentImages(currentImageIndex);
        
        // Set modal image with loading state
        modalImage.src = '';
        modalImage.classList.add('loading');
        
        const img = new Image();
        img.onload = () => {
            modalImage.src = imageSrc;
            modalImage.classList.remove('loading');
            modalImage.classList.add('loaded');
            console.log('Modal image loaded successfully');
        };
        
        img.onerror = () => {
            console.error('Failed to load modal image:', imageSrc);
            modalImage.src = createPlaceholderImage('Image not available');
            modalImage.classList.remove('loading');
            modalImage.classList.add('error');
        };
        
        img.src = imageSrc;
        
        // Show modal
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        isModalOpen = true;
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Add focus for accessibility
        if (closeModalBtn) closeModalBtn.focus();
        
    } catch (error) {
        console.error('Error opening image modal:', error);
        showModalError('Failed to open image gallery');
    }
}

// Alternative function for HTML onclick attributes
function openImageModalSimple(imageSrc) {
    console.log('Opening image modal (simple) for:', imageSrc);
    openImageModal(imageSrc, null);
}

function closeImageModal() {
    if (!imageModal) return;
    
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    isModalOpen = false;
    currentGallery = [];
    currentImageIndex = 0;
    
    // Reset modal image classes
    if (modalImage) {
        modalImage.classList.remove('loading', 'loaded', 'error');
    }
}

function navigateImage(direction) {
    if (currentGallery.length === 0) return;
    
    const newIndex = currentImageIndex + direction;
    
    // Loop around if at ends
    if (newIndex < 0) {
        currentImageIndex = currentGallery.length - 1;
    } else if (newIndex >= currentGallery.length) {
        currentImageIndex = 0;
    } else {
        currentImageIndex = newIndex;
    }
    
    if (modalImage) {
        // Show loading state
        modalImage.classList.add('loading');
        modalImage.classList.remove('loaded', 'error');
        
        const img = new Image();
        img.onload = () => {
            modalImage.src = currentGallery[currentImageIndex];
            modalImage.classList.remove('loading');
            modalImage.classList.add('loaded');
            
            // Preload next/previous images
            preloadAdjacentImages(currentImageIndex);
        };
        
        img.onerror = () => {
            modalImage.src = createPlaceholderImage('Image not available');
            modalImage.classList.remove('loading');
            modalImage.classList.add('error');
        };
        
        img.src = currentGallery[currentImageIndex];
    }
    
    updateNavigationButtons();
}

function preloadAdjacentImages(currentIndex) {
    if (currentGallery.length <= 1) return;
    
    // Preload next and previous images for smoother navigation
    const indicesToPreload = [
        (currentIndex - 1 + currentGallery.length) % currentGallery.length,
        (currentIndex + 1) % currentGallery.length
    ];
    
    indicesToPreload.forEach(index => {
        if (index >= 0 && index < currentGallery.length) {
            const img = new Image();
            img.src = currentGallery[index];
        }
    });
}

function updateNavigationButtons() {
    if (!prevBtn || !nextBtn) return;
    
    // Show/hide buttons based on gallery length
    if (currentGallery.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
    
    // Add accessibility labels
    prevBtn.setAttribute('aria-label', 'Previous image');
    nextBtn.setAttribute('aria-label', 'Next image');
}

function createPlaceholderImage(altText) {
    // Create SVG placeholder with consistent styling
    const colors = ['4a6cf7', '6a75f8', '1d2144', 'f54a6c', '4af54a'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#${randomColor};stop-opacity:0.7" />
                    <stop offset="100%" style="stop-color:#${randomColor};stop-opacity:0.9" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
            <rect x="10" y="10" width="380" height="280" fill="none" stroke="white" stroke-width="2" stroke-dasharray="5,5"/>
            <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="bold">
                ${altText || 'Image'}
            </text>
            <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.8">
                Click to view full size
            </text>
        </svg>
    `)}`;
}

function showModalError(message) {
    // Simple error display in modal
    if (modalImage) {
        modalImage.src = createPlaceholderImage(message);
        modalImage.classList.remove('loading');
        modalImage.classList.add('error');
    }
}

function handleKeyboardNavigation(event) {
    if (!isModalOpen) return;
    
    switch(event.key) {
        case 'Escape':
            closeImageModal();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            navigateImage(-1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            navigateImage(1);
            break;
        case 'Home':
            event.preventDefault();
            currentImageIndex = 0;
            navigateImage(0);
            break;
        case 'End':
            event.preventDefault();
            currentImageIndex = currentGallery.length - 1;
            navigateImage(0);
            break;
    }
}

function initializeTouchSupport() {
    if (!imageModal) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    imageModal.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    
    imageModal.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                navigateImage(1);
            } else {
                // Swipe right - previous image
                navigateImage(-1);
            }
        }
    }
}

// Initialize gallery animations with performance improvements
function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Use Intersection Observer for lazy loading animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const index = Array.from(galleryItems).indexOf(item);
                
                // Stagger animation with performance consideration
                item.style.animationDelay = `${Math.min(index * 0.1, 2)}s`;
                item.classList.add('fade-in');
                
                // Stop observing once animated
                observer.unobserve(item);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    galleryItems.forEach(item => {
        observer.observe(item);
        
        // Enhanced hover effects with performance optimization
        let hoverTimeout;
        
        item.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 50);
        });
        
        // Add loading state to images
        const img = item.querySelector('img');
        if (img) {
            if (!img.complete) {
                img.classList.add('loading');
            }
            
            img.addEventListener('load', () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.classList.remove('loading');
                img.classList.add('error');
                img.src = createPlaceholderImage(img.alt || 'Project Image');
            });
        }
    });
}

// Add CSS for modal styles
function addModalStyles() {
    const styles = `
        .image-modal .modal-content img.loading {
            opacity: 0.5;
            filter: blur(2px);
        }
        
        .image-modal .modal-content img.loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .image-modal .modal-content img.error {
            opacity: 0.7;
            filter: grayscale(1);
        }
        
        .gallery-item img.loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .gallery-item img.error {
            filter: grayscale(1) brightness(0.9);
        }
        
        /* Smooth transitions for modal */
        .image-modal {
            transition: opacity 0.3s ease;
        }
        
        .nav-btn {
            transition: all 0.3s ease;
        }
        
        .nav-btn:active {
            transform: scale(0.95);
        }
    `;
    
    // Only add styles if they don't exist
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Notification function for projects gallery
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

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (isModalOpen) {
        closeImageModal();
    }
});

// Update the initialization at the bottom of projects.js:
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing projects gallery');
    initializeProjectsGallery();
    
    // Add performance monitoring
    if (typeof PerformanceObserver !== 'undefined') {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    console.log('Page loaded in:', entry.loadEventEnd - entry.fetchStart, 'ms');
                }
            });
        });
        observer.observe({ entryTypes: ['navigation'] });
    }
});

// Export functions for global access
window.ImageGallery = {
    openImageModal,
    openImageModalSimple,
    closeImageModal,
    navigateImage,
    initGalleryAnimations
};