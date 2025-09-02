// DOM Content Loaded - MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Main Initialization');
    
    // Initialize all functionality
    initializeWebsite();
    initializeEmailJS();
    
    // Test if functions are available immediately
    console.log('🔍 Testing function availability on DOM load...');
    if (typeof openBookingModal === 'function') {
        console.log('✅ openBookingModal is available as local function');
    } else {
        console.error('❌ openBookingModal is NOT available as local function');
    }
    
    if (typeof window.openBookingModal === 'function') {
        console.log('✅ openBookingModal is available on window object');
    } else {
        console.error('❌ openBookingModal is NOT available on window object');
    }
    
    // Test booking modal functionality
    console.log('Testing booking modal elements...');
    const modal = document.getElementById('bookingModal');
    const modalService = document.getElementById('modalService');
    const modalPrice = document.getElementById('modalPrice');
    
    if (modal && modalService && modalPrice) {
        console.log('✅ All booking modal elements found');
    } else {
        console.error('❌ Missing booking modal elements:', { modal, modalService, modalPrice });
    }
});

// Initialize EmailJS
function initializeEmailJS() {
    // Check if EmailJS is available
    if (typeof emailjs !== 'undefined') {
        // Initialize EmailJS with your public key
        emailjs.init('zZZs_wqILWeUkUZmN');
        console.log('EmailJS initialized successfully');
    } else {
        console.warn('EmailJS not loaded. Contact form will use fallback method.');
    }
}

// Initialize all website functionality
function initializeWebsite() {
    setupMobileNavigation();
    setupSmoothScrolling();
    setupReviewRating();
    setupFormHandling();
    setupWhatsAppChat();
    setupScrollAnimations();
    setupHeaderScroll();
    setupBookingForm(); // Add booking form setup
    
    // Test if functions are available globally
    console.log('Testing global function availability...');
    if (typeof window.openBookingModal === 'function') {
        console.log('✅ openBookingModal is available globally');
    } else {
        console.error('❌ openBookingModal is NOT available globally');
    }
    
    if (typeof window.closeBookingModal === 'function') {
        console.log('✅ closeBookingModal is available globally');
    } else {
        console.error('❌ closeBookingModal is NOT available globally');
    }
}

// Mobile Navigation Setup
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
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
    }
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to Section Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Review Rating Setup
function setupReviewRating() {
    const starsInput = document.querySelectorAll('.stars-input i');
    
    starsInput.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            setRating(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = this.getAttribute('data-rating');
            highlightStars(rating);
        });
        
        star.addEventListener('mouseleave', function() {
            resetStars();
        });
    });
}

// Set Rating Function
function setRating(rating) {
    const starsInput = document.querySelectorAll('.stars-input i');
    let currentRating = 0;
    
    starsInput.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
            star.classList.add('active');
            currentRating = rating;
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
            star.classList.remove('active');
        }
    });
    
    // Store the rating for form submission
    window.selectedRating = currentRating;
}

// Highlight Stars Function
function highlightStars(rating) {
    const starsInput = document.querySelectorAll('.stars-input i');
    
    starsInput.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Reset Stars Function
function resetStars() {
    const starsInput = document.querySelectorAll('.stars-input i');
    
    starsInput.forEach(star => {
        if (!star.classList.contains('active')) {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Form Handling Setup
function setupFormHandling() {
    // Review Form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmission);
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
}

// Handle Review Submission
function handleReviewSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const service = formData.get('service') || e.target.querySelector('select').value;
    const rating = window.selectedRating || 0;
    const review = formData.get('review') || e.target.querySelector('textarea').value;
    
    if (!rating) {
        showNotification('Please select a rating', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Submitting...';
    
    setTimeout(() => {
        // Add review to the page
        addReviewToPage(name, service, rating, review);
        
        // Reset form
        e.target.reset();
        resetStars();
        window.selectedRating = 0;
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Submit Review';
        
        showNotification('Review submitted successfully!', 'success');
    }, 1500);
}

// Handle Contact Submission
function handleContactSubmission(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    // EmailJS template parameters
    const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        from_phone: formData.phone,
        service_type: formData.service,
        message: formData.message,
        to_name: 'Handy Elite Team'
    };
    
    // Check if EmailJS is available
    if (typeof emailjs !== 'undefined') {
        // Send email using EmailJS
        emailjs.send('service_34ym3vr', 'template_fa48zah', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Reset form
                e.target.reset();
                
                // Reset button
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Send Message';
                
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            }, function(error) {
                console.log('FAILED...', error);
                
                // Reset button
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Send Message';
                
                showNotification('Failed to send message. Please try again or contact us directly.', 'error');
            });
    } else {
        // Fallback method - simulate sending (for demo purposes)
        console.log('EmailJS not available, using fallback method');
        
        setTimeout(() => {
            // Reset form
            e.target.reset();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Send Message';
            
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Log the inquiry details for manual follow-up
            console.log('Contact Form Inquiry:', {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                service: formData.service,
                message: formData.message,
                timestamp: new Date().toISOString()
            });
        }, 2000);
    }
}

// Handle Newsletter Submission
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
        e.target.reset();
        showNotification('Thank you for subscribing to our newsletter!', 'success');
    }
}

// Add Review to Page
function addReviewToPage(name, service, rating, review) {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;
    
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.style.animation = 'fadeInUp 0.6s ease forwards';
    
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80" alt="${name}">
                <div>
                    <h4>${name}</h4>
                    <div class="stars" style="color: #fbbf24;">${stars}</div>
                </div>
            </div>
        </div>
        <p>"${review}"</p>
    `;
    
    reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);
}

// WhatsApp Chat Setup
function setupWhatsAppChat() {
    // WhatsApp widget is ready
    console.log('WhatsApp chat widget initialized');
}

// Open WhatsApp Chat Function
function openWhatsAppChat() {
    // Replace with your actual WhatsApp number (include country code)
    const whatsappNumber = '+917983325204'; // Example: +1234567890
    
    // Pre-filled message for customers
    const message = encodeURIComponent('Hi! I\'m interested in your services. Can you help me?');
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Show notification
    showNotification('Opening WhatsApp chat...', 'info');
}

// Enhanced Booking Modal Functions
function openBookingModal(service, price) {
    console.log('🎯 openBookingModal called with:', service, 'at price:', price);
    
    const modal = document.getElementById('bookingModal');
    const modalService = document.getElementById('modalService');
    const modalPrice = document.getElementById('modalPrice');
    
    console.log('🔍 Modal elements found:', { modal, modalService, modalPrice });
    
    if (modal && modalService) {
        modalService.value = service;
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        console.log('✅ Modal opened successfully');
    } else {
        console.error('❌ Modal elements not found:', { modal, modalService, modalPrice });
    }
}

function closeBookingModal() {
    console.log('Closing booking modal');
    
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        console.log('Modal closed successfully');
    } else {
        console.error('Modal not found');
    }
}

// Enhanced functions are now above

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('bookingModal');
        if (modal && modal.style.display === 'block') {
            closeBookingModal();
        }
    }
});

// Booking Form Submission - Setup when DOM is ready
function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Processing...';
            
            setTimeout(() => {
                this.reset();
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Confirm Booking';
                closeBookingModal();
                showNotification('Booking confirmed! We\'ll contact you soon to confirm details.', 'success');
            }, 2000);
        });
        console.log('✅ Booking form event listener attached');
    } else {
        console.error('❌ Booking form not found');
    }
}

// Scroll Animations Setup
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .review-card, .contact-item, .feature');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Header Scroll Effect
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Keep header dark in all scroll states
        header.style.background = 'rgba(15, 23, 42, 0.98)';
        header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.3)';
        
        lastScrollTop = scrollTop;
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification animation styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Service Filtering (for future enhancement)
function filterServices(category) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-service') === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Location-based Service Check (for future enhancement)
function checkServiceAvailability(location) {
    // This would typically connect to a backend API
    const availableServices = ['carpentry', 'plumbing', 'electrical', 'cleaning'];
    return availableServices;
}

// Subscription System (for future enhancement)
function setupSubscription(service, frequency) {
    const subscriptionData = {
        service: service,
        frequency: frequency,
        startDate: new Date(),
        status: 'active'
    };
    
    // This would typically send data to a backend
    console.log('Subscription setup:', subscriptionData);
    showNotification('Subscription setup successfully!', 'success');
}

// Enhanced Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    return isValid;
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll events efficiently
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Accessibility Enhancements
function setupAccessibility() {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #6366f1;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
    `;
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', setupAccessibility);

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global use
window.scrollToSection = scrollToSection;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.openWhatsAppChat = openWhatsAppChat;
window.filterServices = filterServices;
window.setupSubscription = setupSubscription;

// Make sure functions are available globally
if (typeof window !== 'undefined') {
    window.openBookingModal = openBookingModal;
    window.closeBookingModal = closeBookingModal;
    window.scrollToSection = scrollToSection;
    window.openWhatsAppChat = openWhatsAppChat;
}
