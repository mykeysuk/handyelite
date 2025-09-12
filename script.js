// DOM Content Loaded - MAIN INITIALIZATION (guarded to avoid double init)
function initializeAllOnce() {
    if (window.__appInitialized) {
        return;
    }
    window.__appInitialized = true;
    console.log('🚀 Initializing app (once)');
    initializeWebsite();
    initializeEmailJS();
    // Set booking notification EmailJS template id
    if (typeof setBookingEmailTemplateId === 'function') {
        setBookingEmailTemplateId('template_d4oxu7k');
    }
    initializeFirebase();
}

document.addEventListener('DOMContentLoaded', initializeAllOnce);

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

// ==================== EMAILJS: BOOKING NOTIFICATION ====================
// Separate template ID for booking emails (set this from your config)
let EMAILJS_BOOKING_TEMPLATE_ID = 'template_booking_placeholder';

function setBookingEmailTemplateId(templateId) {
    if (templateId && typeof templateId === 'string') {
        EMAILJS_BOOKING_TEMPLATE_ID = templateId;
    }
}

function buildBookingEmailParams(bookingData, bookingId) {
    const userFullName = `${bookingData.firstName || ''} ${bookingData.lastName || ''}`.trim();
    const composedMessage = `New booking request\n\n` +
        `Booking ID: ${bookingId || bookingData.bookingId || ''}\n` +
        `Service: ${bookingData.service || ''}\n` +
        `Preferred Date: ${bookingData.preferredDate || ''}\n` +
        `Preferred Time: ${bookingData.preferredTime || ''}\n` +
        `Payment Method: ${bookingData.paymentMethod || 'cash'}\n` +
        `Status: ${bookingData.status || 'Pending'}\n` +
        `\nCustomer\n` +
        `Name: ${userFullName || (currentUser && currentUser.displayName) || ''}\n` +
        `Email: ${bookingData.email || (currentUser && currentUser.email) || ''}\n` +
        `Phone: ${bookingData.phone || ''}\n` +
        `\nDescription\n${bookingData.serviceDescription || ''}`;
    return {
        // Generic fields
        to_name: 'Handy Elite Team',
        reply_to: bookingData.email || (currentUser && currentUser.email) || '',
        message: composedMessage,
        message_html: composedMessage.replace(/\n/g, '<br>'),
        submitted_at: new Date().toISOString(),
        from_name: userFullName || (currentUser && currentUser.displayName) || '',
        from_email: bookingData.email || (currentUser && currentUser.email) || '',
        from_phone: bookingData.phone || '',
        
        // Canonical booking fields
        booking_id: bookingId || bookingData.bookingId || '',
        service_name: bookingData.service || '',
        preferred_date: bookingData.preferredDate || '',
        preferred_time: bookingData.preferredTime || '',
        status: bookingData.status || 'Pending',
        payment_method: bookingData.paymentMethod || 'cash',
        service_description: bookingData.serviceDescription || '',
        
        // Canonical user fields
        user_name: userFullName || (currentUser && currentUser.displayName) || '',
        user_email: bookingData.email || (currentUser && currentUser.email) || '',
        user_phone: bookingData.phone || '',
        created_at: new Date().toISOString(),
        
        // Common alias keys to improve template compatibility
        bookingId: bookingId || bookingData.bookingId || '',
        service: bookingData.service || '',
        service_type: bookingData.service || '',
        customer_name: userFullName || (currentUser && currentUser.displayName) || '',
        first_name: bookingData.firstName || '',
        last_name: bookingData.lastName || '',
        email: bookingData.email || (currentUser && currentUser.email) || '',
        phone: bookingData.phone || '',
        // Capitalized variants some templates use
        Email: bookingData.email || (currentUser && currentUser.email) || '',
        Phone: bookingData.phone || '',
        Service: bookingData.service || ''
    };
}

async function sendBookingNotificationEmail(bookingData, bookingId) {
    try {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not available; skipping booking notification email');
            return;
        }
        const params = buildBookingEmailParams(bookingData, bookingId);
        console.log('Sending booking email with params:', params);
        await emailjs.send('service_34ym3vr', EMAILJS_BOOKING_TEMPLATE_ID, params);
        console.log('Booking notification email sent');
    } catch (err) {
        console.error('Failed to send booking notification email:', err);
        // Non-blocking: do not interrupt booking flow
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
    setupReviewsMarquee();
    
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
// Reviews marquee setup: wrap items, clone for seamless loop, handle new reviews
function setupReviewsMarquee() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;

    // Duplicate items once to simulate infinite scroll
    const items = Array.from(track.children);
    const clone = items.map(node => node.cloneNode(true));
    clone.forEach(node => track.appendChild(node));

    // Adjust speed based on total width
    requestAnimationFrame(() => {
        const totalWidth = Array.from(track.children).reduce((w, el) => w + el.getBoundingClientRect().width + 32, 0); // 32 ~ gap
        const viewport = track.parentElement.getBoundingClientRect().width;
        const distance = totalWidth / 2; // we animate -50%
        const pxPerSec = 50; // slower speed
        const duration = Math.max(30, Math.round(distance / pxPerSec));
        track.style.setProperty('--reviews-speed', duration + 's');
    });

    // Hook into addReviewToPage to append new items to the marquee
    const originalAdd = addReviewToPage;
    window.addReviewToPage = function(name, service, rating, review) {
        originalAdd(name, service, rating, review);
        const reviewsGrid = document.getElementById('reviewsTrack');
        if (!reviewsGrid) return;
        const last = reviewsGrid.firstChild; // originalAdd prepends
        if (last) {
            // Also append a clone at the end to keep the loop smooth
            reviewsGrid.appendChild(last.cloneNode(true));
        }
    };
}
// (reverted) booking status section helpers removed

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
        // Add submission timestamp for the email template
        templateParams.submitted_at = new Date().toISOString();
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
        
        // Auto-fill form if user is logged in
        if (currentUser) {
            setTimeout(() => {
                autoFillBookingForm();
            }, 100);
        }
        
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
    // Use the enhanced booking form setup instead
    setupEnhancedBookingForm();
    console.log('✅ Enhanced booking form event listener attached');
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
        z-index: 10001; /* above modal backdrop/content */
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

// (reverted) clipboard helper removed

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

// ==================== FIREBASE AUTHENTICATION & FIRESTORE ====================

// Wait for Firebase to be available
let firebaseAuth, firebaseDb;
let currentUser = null;
let phoneAuthConfirmation = null;
let currentPhoneNumber = null;
let unsubscribeBookings = null;
// Realtime Database (for user booking history)
let firebaseRtdb = null;
async function ensureRealtimeDb() {
    if (firebaseRtdb) return firebaseRtdb;
    const { getDatabase } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
    firebaseRtdb = getDatabase(window.firebaseApp);
    return firebaseRtdb;
}


// Initialize Firebase when available
function initializeFirebase() {
    if (window.firebaseAuth && window.firebaseDb) {
        firebaseAuth = window.firebaseAuth;
        firebaseDb = window.firebaseDb;
        console.log('Firebase initialized successfully');
        
        // Set up authentication state listener
        setupAuthStateListener();
        
        // Initialize authentication forms
        setupAuthenticationForms();
    } else {
        console.log('Firebase not yet available, retrying...');
        setTimeout(initializeFirebase, 1000);
    }
}

 

// Set up authentication state listener
function setupAuthStateListener() {
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
        onAuthStateChanged(firebaseAuth, (user) => {
            currentUser = user;
            updateAuthUI(user);
            
            if (user) {
                console.log('User signed in:', user.email);
                // Load user data from Firestore
                loadUserData(user.uid);
                // Subscribe to bookings in realtime
                startBookingsSubscription(user.uid);
                // Populate table once on login
                fetchAndPopulateBookingsTable();
            } else {
                console.log('User signed out');
                // Unsubscribe from bookings feed
                if (typeof unsubscribeBookings === 'function') {
                    unsubscribeBookings();
                    unsubscribeBookings = null;
                }
                // Unsubscribe RTDB booking history
                if (typeof unsubscribeRtdbHistory === 'function') {
                    unsubscribeRtdbHistory();
                    unsubscribeRtdbHistory = null;
                }
            }
        });
    });
}

// Update UI based on authentication state
function updateAuthUI(user) {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (user) {
        // User is signed in
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        userName.textContent = user.displayName || user.email.split('@')[0];
    } else {
        // User is signed out
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// ==================== AUTHENTICATION FUNCTIONS ====================

// Sign up function
async function signUp(email, password, userData) {
    try {
        const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        
        // Update user profile with display name
        await updateProfile(user, {
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        // Store additional user data in Firestore
        await storeUserData(user.uid, userData);
        
        showNotification('Account created successfully!', 'success');
        closeSignupModal();
        
        return user;
    } catch (error) {
        console.error('Sign up error:', error);
        handleAuthError(error);
        throw error;
    }
}

// Sign in function
async function signIn(email, password) {
    try {
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        
        showNotification('Welcome back!', 'success');
        closeLoginModal();
        
        return user;
    } catch (error) {
        console.error('Sign in error:', error);
        handleAuthError(error);
        throw error;
    }
}

// Sign out function
async function signOut() {
    try {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        await signOut(firebaseAuth);
        showNotification('You have been signed out', 'info');
        
        // Close any open modals
        closeUserDashboard();
    } catch (error) {
        console.error('Sign out error:', error);
        showNotification('Error signing out', 'error');
    }
}

// ==================== PHONE AUTHENTICATION FUNCTIONS ====================

// Send OTP to phone number
async function sendOTP(phoneNumber) {
    try {
        const { signInWithPhoneNumber, RecaptchaVerifier } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Create reCAPTCHA verifier
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log('reCAPTCHA solved');
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expired');
                }
            });
        }
        
        // Send OTP
        phoneAuthConfirmation = await signInWithPhoneNumber(firebaseAuth, phoneNumber, window.recaptchaVerifier);
        console.log('OTP sent successfully');
        
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        handlePhoneAuthError(error);
        return false;
    }
}

// Verify OTP code
async function verifyOTP(otpCode) {
    try {
        const result = await phoneAuthConfirmation.confirm(otpCode);
        const user = result.user;
        
        console.log('Phone authentication successful:', user);
        
        // Check if user exists in Firestore
        const userData = await loadUserData(user.uid);
        
        if (userData) {
            // Existing user - update phone number if needed
            await updateUserData(user.uid, { phone: currentPhoneNumber });
            showNotification('Welcome back!', 'success');
        } else {
            // New user - show registration form
            showNewUserStep();
            return false; // Don't close modal yet
        }
        
        closePhoneLoginModal();
        return true;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        handlePhoneAuthError(error);
        return false;
    }
}

// Handle phone authentication errors
function handlePhoneAuthError(error) {
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/invalid-phone-number':
            errorMessage = 'Please enter a valid phone number.';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many requests. Please try again later.';
            break;
        case 'auth/invalid-verification-code':
            errorMessage = 'Invalid verification code. Please try again.';
            break;
        case 'auth/code-expired':
            errorMessage = 'Verification code has expired. Please request a new one.';
            break;
        case 'auth/missing-phone-number':
            errorMessage = 'Please enter your phone number.';
            break;
        default:
            errorMessage = error.message || errorMessage;
    }
    
    showNotification(errorMessage, 'error');
}

// Show new user registration step
function showNewUserStep() {
    document.getElementById('phoneInputStep').style.display = 'none';
    document.getElementById('otpVerificationStep').style.display = 'none';
    document.getElementById('newUserStep').style.display = 'block';
}

// Back to phone input step
function backToPhoneInput() {
    document.getElementById('phoneInputStep').style.display = 'block';
    document.getElementById('otpVerificationStep').style.display = 'none';
    document.getElementById('newUserStep').style.display = 'none';
    
    // Reset forms
    document.getElementById('phoneForm').reset();
    document.getElementById('otpForm').reset();
    document.getElementById('newUserForm').reset();
}

// Resend OTP
async function resendOTP() {
    if (currentPhoneNumber) {
        const submitBtn = document.querySelector('#phoneForm button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
        
        try {
            await sendOTP(currentPhoneNumber);
            showNotification('New OTP sent!', 'success');
        } catch (error) {
            console.error('Error resending OTP:', error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP';
        }
    }
}

// ==================== FIRESTORE FUNCTIONS ====================

// Store user data in Firestore
async function storeUserData(userId, userData) {
    try {
        const { doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const userRef = doc(firebaseDb, 'users', userId);
        await setDoc(userRef, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            totalBookings: 0,
            averageRating: 4.5
        });
        
        console.log('User data stored successfully');
    } catch (error) {
        console.error('Error storing user data:', error);
        throw error;
    }
}

// Load user data from Firestore
async function loadUserData(userId) {
    try {
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const userRef = doc(firebaseDb, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log('User data loaded:', userData);
            
            // Update UI with user data
            updateUserDashboard(userData);
            
            return userData;
        } else {
            console.log('No user data found');
            return null;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}

// Update user data in Firestore
async function updateUserData(userId, updateData) {
    try {
        const { doc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const userRef = doc(firebaseDb, 'users', userId);
        await updateDoc(userRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
        
        showNotification('Profile updated successfully!', 'success');
        console.log('User data updated successfully');
    } catch (error) {
        console.error('Error updating user data:', error);
        showNotification('Error updating profile', 'error');
    }
}

// Store booking data
async function storeBookingData(bookingData) {
    try {
        const { collection, addDoc, updateDoc, doc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const bookingsRef = collection(firebaseDb, 'bookings');
        const docRef = await addDoc(bookingsRef, {
            ...bookingData,
            userId: currentUser.uid,
            status: 'Pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        // Persist the generated bookingId inside the document
        await updateDoc(doc(firebaseDb, 'bookings', docRef.id), {
            bookingId: docRef.id,
            updatedAt: serverTimestamp()
        });
        
        console.log('Booking stored with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error storing booking:', error);
        throw error;
    }
}

// Load user bookings
async function loadUserBookings(userId) {
    try {
        const { collection, query, where, orderBy, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const bookingsRef = collection(firebaseDb, 'bookings');
        const q = query(
            bookingsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const bookings = [];
        
        querySnapshot.forEach((doc) => {
            bookings.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return bookings;
    } catch (error) {
        console.error('Error loading bookings:', error);
        return [];
    }
}

// Realtime subscription to a user's bookings
function startBookingsSubscription(userId) {
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ collection, query, where, orderBy, onSnapshot }) => {
        const bookingsRef = collection(firebaseDb, 'bookings');
        const q = query(
            bookingsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        if (typeof unsubscribeBookings === 'function') {
            unsubscribeBookings();
        }
        unsubscribeBookings = onSnapshot(q, (snapshot) => {
            const bookings = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            displayUserBookings(bookings);
            updateLatestBookingStatusInProfile(bookings);
        }, (error) => {
            console.error('Bookings subscription error:', error);
        });
    });
}

// ==================== AUTHENTICATION FORM HANDLERS ====================

// Set up authentication forms
function setupAuthenticationForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Phone form
    const phoneForm = document.getElementById('phoneForm');
    if (phoneForm) {
        phoneForm.addEventListener('submit', handlePhoneSubmit);
    }
    
    // OTP form
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleOTPSubmit);
    }
    
    // New user form
    const newUserForm = document.getElementById('newUserForm');
    if (newUserForm) {
        newUserForm.addEventListener('submit', handleNewUserSubmit);
    }
    
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Signing in...';
    
    try {
        await signIn(email, password);
    } catch (error) {
        // Error handling is done in signIn function
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Login';
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Creating account...';
    
    try {
        await signUp(userData.email, password, userData);
        e.target.reset(); // Clear form
    } catch (error) {
        // Error handling is done in signUp function
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Create Account';
    }
}

// Handle phone form submission
async function handlePhoneSubmit(e) {
    e.preventDefault();
    
    const countryCode = document.getElementById('countryCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const fullPhoneNumber = countryCode + phoneNumber;
    
    currentPhoneNumber = fullPhoneNumber;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';
    
    try {
        const success = await sendOTP(fullPhoneNumber);
        
        if (success) {
            // Show OTP verification step
            document.getElementById('phoneInputStep').style.display = 'none';
            document.getElementById('otpVerificationStep').style.display = 'block';
            document.getElementById('displayPhoneNumber').textContent = fullPhoneNumber;
            
            showNotification('OTP sent to your phone!', 'success');
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP';
    }
}

// Handle OTP form submission
async function handleOTPSubmit(e) {
    e.preventDefault();
    
    const otpCode = document.getElementById('otpCode').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Verifying...';
    
    try {
        const success = await verifyOTP(otpCode);
        
        if (success) {
            showNotification('Login successful!', 'success');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Verify & Login';
    }
}

// Handle new user form submission
async function handleNewUserSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email') || '',
        phone: currentPhoneNumber
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Creating...';
    
    try {
        // Store user data in Firestore
        await storeUserData(currentUser.uid, userData);
        
        // Update display name in Firebase Auth
        const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await updateProfile(currentUser, {
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        showNotification('Account created successfully!', 'success');
        closePhoneLoginModal();
        e.target.reset();
        
    } catch (error) {
        console.error('Error creating user account:', error);
        showNotification('Error creating account. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Complete Registration';
    }
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please log in to update your profile', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const updateData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Updating...';
    
    try {
        await updateUserData(currentUser.uid, updateData);
        
        // Update display name in Firebase Auth
        const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await updateProfile(currentUser, {
            displayName: `${updateData.firstName} ${updateData.lastName}`
        });
        
        // Reload user data
        await loadUserData(currentUser.uid);
        
    } catch (error) {
        console.error('Error updating profile:', error);
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Update Profile';
    }
}

// Handle password reset via email
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const resetEmailEl = document.getElementById('resetEmail');
    const email = (resetEmailEl && resetEmailEl.value) || (currentUser && currentUser.email) || '';
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';
    
    try {
        const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await sendPasswordResetEmail(firebaseAuth, email);
        showNotification('Password reset email sent. Check your inbox.', 'success');
        e.target.reset();
    } catch (error) {
        console.error('Error sending reset email:', error);
        handleAuthError(error);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Send Reset Link';
    }
}

// ==================== ERROR HANDLING ====================

// Handle authentication errors
function handleAuthError(error) {
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            break;
        case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters long.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
        case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
        case 'auth/requires-recent-login':
            errorMessage = 'Please log in again to perform this action.';
            break;
        default:
            errorMessage = error.message || errorMessage;
    }
    
    showNotification(errorMessage, 'error');
}

// ==================== MODAL FUNCTIONS ====================

// Authentication modal functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Phone authentication modal functions
function openPhoneLoginModal() {
    document.getElementById('phoneLoginModal').style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Reset to first step
    backToPhoneInput();
}

function closePhoneLoginModal() {
    document.getElementById('phoneLoginModal').style.display = 'none';
    document.body.classList.remove('modal-open');
    
    // Reset all forms
    backToPhoneInput();
}

function switchToEmailLogin() {
    closePhoneLoginModal();
    openLoginModal();
}

// User dashboard functions
function showUserDashboard() {
    if (!currentUser) {
        showNotification('Please log in to access your dashboard', 'error');
        return;
    }
    
    document.getElementById('userDashboardModal').style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Load user data and bookings
    loadUserData(currentUser.uid);
    loadUserBookings(currentUser.uid).then(bookings => {
        displayUserBookings(bookings);
    });
}

function closeUserDashboard() {
    document.getElementById('userDashboardModal').style.display = 'none';
    document.body.classList.remove('modal-open');
    // Unsubscribe RTDB booking history when dashboard closes
    if (typeof unsubscribeRtdbHistory === 'function') {
        unsubscribeRtdbHistory();
        unsubscribeRtdbHistory = null;
    }
}

function toggleUserMenu() {
    // This is handled by CSS hover
}

// Dashboard tab functions
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'bookings' && currentUser) {
        fetchAndPopulateBookingsTable();
        startRealtimeBookingHistory();
    } else if (tabName === 'settings' && currentUser) {
        loadUserData(currentUser.uid).then(userData => {
            populateSettingsForm(userData);
        });
        if (typeof unsubscribeRtdbHistory === 'function') {
            unsubscribeRtdbHistory();
            unsubscribeRtdbHistory = null;
        }
    } else {
        if (typeof unsubscribeRtdbHistory === 'function') {
            unsubscribeRtdbHistory();
            unsubscribeRtdbHistory = null;
        }
    }
}

// Update user dashboard with data
function updateUserDashboard(userData) {
    document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profilePhone').textContent = userData.phone || 'Not provided';
    document.getElementById('profileJoinDate').textContent = `Member since ${new Date(userData.createdAt?.toDate()).toLocaleDateString()}`;
    document.getElementById('totalBookings').textContent = userData.totalBookings || 0;
    // Force display of 4.5 as requested
    document.getElementById('userRating').textContent = '4.5';
}

// Populate settings form with current user data
function populateSettingsForm(userData) {
    document.getElementById('updateFirstName').value = userData.firstName || '';
    document.getElementById('updateLastName').value = userData.lastName || '';
    document.getElementById('updatePhone').value = userData.phone || '';
}

// Display user bookings
function displayUserBookings(bookings) {
    const table = document.getElementById('bookingsTable');
    const tbody = document.getElementById('bookingsTableBody');
    const container = document.getElementById('bookingsList');
    if (!table || !tbody || !container) return;

    if (!Array.isArray(bookings) || bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">कोई बुकिंग नहीं मिली। <a href="#services" onclick="closeUserDashboard()">अभी एक सर्विस बुक करें!</a></td></tr>`;
        return;
    }

    tbody.innerHTML = bookings.map(b => {
        const createdOn = b.createdAt?.toDate ? new Date(b.createdAt.toDate()).toLocaleDateString('hi-IN') : '';
        const bookingDate = b.preferredDate ? new Date(b.preferredDate).toLocaleDateString('hi-IN') : '';
        const statusText = b.status || 'Pending';
        const statusClass = normalizeStatusClass(statusText);
        const bookingId = (b.bookingId || b.id || '');
        const isCompleted = String(statusText).toLowerCase() === 'completed';
        const toggleLabel = isCompleted ? 'Pending करें' : 'Completed करें';
        
        return `
            <tr>
                <td>${b.service || ''}</td>
                <td>${bookingDate}</td>
                <td>${b.preferredTime || ''}</td>
                <td><span class="booking-status ${statusClass}">${statusText}</span></td>
                <td>${bookingId}</td>
                <td>
                    <button class="btn btn-secondary" onclick="viewBookingDetails('${bookingId}')">Details</button>
                    <button class="btn btn-primary" style="margin-left:8px;" onclick="toggleBookingStatus('${bookingId}', '${statusText}')">${toggleLabel}</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Explicit function to fetch and populate bookings table
async function fetchAndPopulateBookingsTable() {
    if (!currentUser) return;
    try {
        const bookings = await loadUserBookings(currentUser.uid);
        displayUserBookings(bookings);
    } catch (e) {
        console.error('Failed to fetch bookings:', e);
    }
}

// Normalize status value to a CSS-friendly class
function normalizeStatusClass(status) {
    if (!status) return 'pending';
    const s = String(status).toLowerCase();
    if (s.includes('progress')) return 'in-progress';
    return s; // pending, approved, rejected, completed
}

// Update profile card with latest booking status
function updateLatestBookingStatusInProfile(bookings) {
    if (!Array.isArray(bookings) || bookings.length === 0) return;
    const latest = bookings[0];
    const statusText = latest.status || 'Pending';
    const profileJoinEl = document.getElementById('profileJoinDate');
    if (profileJoinEl) {
        // Append status inline for quick visibility
        const baseText = profileJoinEl.dataset.baseText || profileJoinEl.textContent;
        profileJoinEl.dataset.baseText = baseText;
        profileJoinEl.textContent = baseText.replace(/(Current status:.*)$/,'').trim();
        profileJoinEl.textContent += `  |  Current status: ${statusText}`;
    }
}

// Optional: View booking details (placeholder)
function viewBookingDetails(bookingId) {
    showNotification(`Booking details for ${bookingId}`, 'info');
}

// Toggle booking status between Pending <=> Completed (Firestore)
async function toggleBookingStatus(bookingId, currentStatus) {
    if (!bookingId) return;
    try {
        const next = String(currentStatus || 'Pending').toLowerCase() === 'completed' ? 'Pending' : 'Completed';
        const { doc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const bookingRef = doc(firebaseDb, 'bookings', bookingId);
        await updateDoc(bookingRef, { status: next, updatedAt: serverTimestamp() });
        showNotification(`Booking marked as ${next}`, 'success');
    } catch (err) {
        console.error('Error toggling booking status:', err);
        showNotification('Failed to update booking status', 'error');
    }
}

// ==================== RTDB BOOKING HISTORY ====================
let unsubscribeRtdbHistory = null;
async function startRealtimeBookingHistory() {
    const historyEl = document.getElementById('booking-history');
    if (!historyEl || !currentUser) return;
    const rtdb = await ensureRealtimeDb();
    const { ref, onValue, off } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
    const userBookingsRef = ref(rtdb, `users/${currentUser.uid}/bookings`);
    if (typeof unsubscribeRtdbHistory === 'function') unsubscribeRtdbHistory();
    const handler = onValue(userBookingsRef, (snapshot) => {
        const bookings = snapshot.val() || {};
        historyEl.innerHTML = '';
        Object.keys(bookings).forEach(bookingId => {
            const b = bookings[bookingId] || {};
            const item = document.createElement('div');
            item.className = 'booking-item';
            item.innerHTML = `
                <h4>${b.service || ''}</h4>
                <p><strong>Date:</strong> ${b.bookingDate || ''}</p>
                <p><strong>Time:</strong> ${b.bookingTime || ''}</p>
                <p><strong>Status:</strong> <span class="booking-status ${b.status ? 'completed' : 'pending'}">${b.status ? 'Completed' : 'Pending'}</span></p>
                <button class="btn btn-primary" onclick="toggleStatus('${bookingId}')">Change Status</button>
            `;
            historyEl.appendChild(item);
        });
        if (!Object.keys(bookings).length) {
            historyEl.innerHTML = '<p>कोई बुकिंग इतिहास नहीं मिला।</p>';
        }
    }, (err) => {
        console.error('RTDB history error:', err);
    });
    unsubscribeRtdbHistory = () => off(userBookingsRef, 'value', handler);
}

async function toggleStatus(bookingId) {
    if (!currentUser || !bookingId) return;
    try {
        const rtdb = await ensureRealtimeDb();
        const { ref, get, update } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
        const userRef = ref(rtdb, `users/${currentUser.uid}/bookings/${bookingId}`);
        const snap = await get(userRef);
        if (!snap.exists()) return;
        const cur = !!snap.val().status;
        await update(userRef, { status: !cur });
        showNotification('Booking status updated!', 'success');
    } catch (e) {
        console.error('RTDB toggle error:', e);
        showNotification('Failed to update status', 'error');
    }
}

 

// Logout function
async function logout() {
    await signOut();
}

// ==================== ENHANCED BOOKING INTEGRATION ====================

// Enhanced booking form submission with Firebase integration
function setupEnhancedBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!currentUser) {
                showNotification('Please log in to book a service', 'error');
                closeBookingModal();
                setTimeout(() => openLoginModal(), 500);
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Processing...';
            
            try {
                const formData = new FormData(this);
                const bookingData = {
                    service: formData.get('service') || document.getElementById('modalService').value,
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    preferredDate: formData.get('preferredDate'),
                    preferredTime: formData.get('preferredTime'),
                    serviceDescription: formData.get('serviceDescription'),
                    paymentMethod: formData.get('paymentMethod')
                };
                
                // Store booking in Firestore
                const bookingId = await storeBookingData(bookingData);
                
                // Also write a simplified record to Realtime Database under users/{uid}/bookings
                try {
                    const rtdb = await ensureRealtimeDb();
                    const { ref, push } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
                    const userBookingsRef = ref(rtdb, `users/${currentUser.uid}/bookings`);
                    await push(userBookingsRef, {
                        service: bookingData.service,
                        bookingDate: bookingData.preferredDate,
                        bookingTime: bookingData.preferredTime,
                        status: false
                    });
                } catch (e) {
                    console.warn('RTDB write skipped/failed:', e);
                }
                
                // Update user's total bookings count
                const { increment } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                
                const userRef = doc(firebaseDb, 'users', currentUser.uid);
                await updateDoc(userRef, {
                    totalBookings: increment(1)
                });
                
                // Non-blocking: send booking notification email
                const emailBookingData = { ...bookingData, status: 'Pending' };
                sendBookingNotificationEmail(emailBookingData, bookingId);

                this.reset();
                closeBookingModal();
                showNotification('Booking confirmed! We\'ll contact you soon to confirm details.', 'success');
                // Refresh table immediately after booking
                fetchAndPopulateBookingsTable();
                
            } catch (error) {
                console.error('Error processing booking:', error);
                showNotification('Error processing booking. Please try again.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Confirm Booking';
            }
        });
    }
}

// Auto-fill booking form with user data
async function autoFillBookingForm() {
    if (!currentUser) return;
    
    try {
        const userData = await loadUserData(currentUser.uid);
        if (!userData) return;
        
        // Auto-fill form fields
        const firstNameField = document.querySelector('#bookingForm input[name="firstName"]');
        const lastNameField = document.querySelector('#bookingForm input[name="lastName"]');
        const emailField = document.querySelector('#bookingForm input[name="email"]');
        const phoneField = document.querySelector('#bookingForm input[name="phone"]');
        
        if (firstNameField && userData.firstName) {
            firstNameField.value = userData.firstName;
            firstNameField.classList.add('auto-filled-field');
        }
        
        if (lastNameField && userData.lastName) {
            lastNameField.value = userData.lastName;
            lastNameField.classList.add('auto-filled-field');
        }
        
        if (emailField && userData.email) {
            emailField.value = userData.email;
            emailField.classList.add('auto-filled-field');
        }
        
        if (phoneField && userData.phone) {
            phoneField.value = userData.phone;
            phoneField.classList.add('auto-filled-field');
        }
        
        // Show notification about auto-fill
        if (userData.firstName || userData.lastName || userData.email || userData.phone) {
            showNotification('Form auto-filled with your saved information', 'info');
        }
        
    } catch (error) {
        console.error('Error auto-filling form:', error);
    }
}

// ==================== INITIALIZATION ====================

// Initialize Firebase when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAllOnce);

// Make authentication functions available globally
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openSignupModal = openSignupModal;
window.closeSignupModal = closeSignupModal;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.openPhoneLoginModal = openPhoneLoginModal;
window.closePhoneLoginModal = closePhoneLoginModal;
window.switchToEmailLogin = switchToEmailLogin;
window.backToPhoneInput = backToPhoneInput;
window.resendOTP = resendOTP;
window.showUserDashboard = showUserDashboard;
window.closeUserDashboard = closeUserDashboard;
window.toggleUserMenu = toggleUserMenu;
window.showTab = showTab;
window.logout = logout;
window.toggleStatus = toggleStatus;
