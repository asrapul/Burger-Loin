// ===== GLOBAL VARIABLES =====
let lastScrollY = window.scrollY;
let ticking = false;
let currentActiveSection = '';
let videoHasBeenInteracted = false; // Track user interaction for autoplay policy

// ===== UTILITY FUNCTIONS =====
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

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    
    // Set icon based on type
    let icon = '';
    switch(type) {
        case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
        case 'error': icon = '<i class="fas fa-exclamation-circle"></i>'; break;
        case 'info': icon = '<i class="fas fa-info-circle"></i>'; break;
        case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i>'; break;
        default: icon = '<i class="fas fa-bell"></i>';
    }
    
    notification.innerHTML = `${icon} <span>${message}</span>`;
    
    // Set colors based on type
    let backgroundColor;
    switch(type) {
        case 'success': backgroundColor = '#28a745'; break;
        case 'error': backgroundColor = '#dc3545'; break;
        case 'info': backgroundColor = '#17a2b8'; break;
        case 'warning': backgroundColor = '#ffc107'; break;
        default: backgroundColor = '#6c757d';
    }
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(350px);
        transition: transform 0.3s ease;
        max-width: 320px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        font-family: 'Poppins', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        line-height: 1.4;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto dismiss
    const dismissTime = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        notification.style.transform = 'translateX(350px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, dismissTime);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(350px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Fallback function for copying text
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Hashtag berhasil disalin: ' + text, 'success');
    } catch (err) {
        showNotification('Gagal menyalin hashtag', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ===== ENHANCED VIDEO AUTO PLAY/PAUSE FUNCTIONALITY =====
function enableVideoSound(video) {
    const muteIcon = document.getElementById('muteIcon');
    
    // Enable sound
    video.muted = false;
    video.volume = 0.7; // Set to 70% volume for better UX
    
    // Update mute icon
    if (muteIcon) {
        muteIcon.className = 'fas fa-volume-up';
    }
    
    console.log('Video sound enabled - volume set to 70%');
}

function handleVideoAutoPlayPause(activeSection) {
    const video = document.querySelector('.about-story-video');
    const playPauseIcon = document.getElementById('playPauseIcon');
    
    if (!video) return;
    
    // Auto pause video when leaving about section
    if (activeSection !== 'about' && !video.paused) {
        video.pause();
        if (playPauseIcon) {
            playPauseIcon.className = 'fas fa-play';
        }
        console.log('Video auto-paused - left about section');
    }
    
    // Auto play video when entering about section
    if (activeSection === 'about' && video.paused) {
        // Enable sound before playing (if user has interacted)
        if (videoHasBeenInteracted) {
            enableVideoSound(video);
        }
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (playPauseIcon) {
                    playPauseIcon.className = 'fas fa-pause';
                }
                
                // Try to enable sound after successful play
                if (!videoHasBeenInteracted) {
                    // First time playing - enable sound
                    enableVideoSound(video);
                    videoHasBeenInteracted = true;
                    showNotification('Video diputar dengan suara', 'success');
                } else {
                    console.log('Video auto-played - entered about section');
                }
            }).catch(error => {
                console.log('Auto-play prevented by browser:', error);
                // If autoplay fails, try without sound first
                video.muted = true;
                video.play().then(() => {
                    if (playPauseIcon) {
                        playPauseIcon.className = 'fas fa-pause';
                    }
                    showNotification('Video diputar (tap untuk suara)', 'info');
                }).catch(e => {
                    console.log('Muted autoplay also failed:', e);
                });
            });
        }
    }
}

// ===== ENHANCED NAVBAR FUNCTIONALITY =====
function updateNavbarActiveState() {
    const sections = ['home', 'menu', 'about', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-item');
    const scrollPos = window.scrollY + 150; // Increased offset for better detection
    let newActiveSection = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop;
            const offsetBottom = offsetTop + section.offsetHeight;
            
            if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
                newActiveSection = sectionId;
                
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"], .bottom-nav-item[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
    });
    
    // Handle video auto play/pause when section changes
    if (newActiveSection !== currentActiveSection) {
        currentActiveSection = newActiveSection;
        handleVideoAutoPlayPause(currentActiveSection);
    }
}

function updateMobileNav() {
    if (window.innerWidth <= 768) {
        const mobileHeader = document.getElementById('mobileHeader');
        const bottomNav = document.getElementById('bottomNav');
        
        // Force show mobile header
        if (mobileHeader) {
            mobileHeader.style.display = 'block';
            mobileHeader.style.position = 'fixed';
            mobileHeader.style.top = '0';
            mobileHeader.style.zIndex = '9998';
            mobileHeader.style.visibility = 'visible';
            mobileHeader.style.opacity = '1';
        }
        
        // Force show bottom navigation
        if (bottomNav) {
            bottomNav.style.display = 'block';
            bottomNav.style.position = 'fixed';
            bottomNav.style.bottom = '0';
            bottomNav.style.zIndex = '9999';
            bottomNav.style.visibility = 'visible';
            bottomNav.style.opacity = '1';
        }
        
        // Hide desktop navbar
        const desktopNav = document.querySelector('.navbar.desktop-nav');
        if (desktopNav) {
            desktopNav.style.display = 'none';
        }
        
        // Set body padding
        document.body.style.paddingTop = '60px';
        document.body.style.paddingBottom = '80px';
        
    } else {
        // Desktop mode
        const mobileHeader = document.getElementById('mobileHeader');
        const bottomNav = document.getElementById('bottomNav');
        const desktopNav = document.querySelector('.navbar.desktop-nav');
        
        if (mobileHeader) {
            mobileHeader.style.display = 'none';
        }
        
        if (bottomNav) {
            bottomNav.style.display = 'none';
        }
        
        if (desktopNav) {
            desktopNav.style.display = 'block';
        }
        
        // Reset body padding
        document.body.style.paddingTop = '0';
        document.body.style.paddingBottom = '0';
    }
}

// ===== MOBILE NAVIGATION =====
function setupMobileNavigation() {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Mark as user interaction for video autoplay
                videoHasBeenInteracted = true;
                
                // Remove active class from all items
                bottomNavItems.forEach(navItem => {
                    navItem.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Smooth scroll to section
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Manually trigger section change for immediate video response
                const sectionId = href.replace('#', '');
                if (sectionId !== currentActiveSection) {
                    currentActiveSection = sectionId;
                    handleVideoAutoPlayPause(currentActiveSection);
                }
            }
            
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Initialize with correct display
    updateMobileNav();
}

// ===== ENHANCED VIDEO FUNCTIONALITY =====
function toggleVideo() {
    const video = document.querySelector('.about-story-video');
    const playPauseIcon = document.getElementById('playPauseIcon');
    
    if (video && playPauseIcon) {
        // Mark as user interaction
        videoHasBeenInteracted = true;
        
        // Ensure video is visible first
        if (window.innerWidth <= 768) {
            video.style.display = 'block';
            video.style.visibility = 'visible';
            video.style.opacity = '1';
        }
        
        if (video.paused) {
            // Enable sound when user manually plays
            enableVideoSound(video);
            
            video.play().then(() => {
                playPauseIcon.className = 'fas fa-pause';
                showNotification('Video diputar dengan suara', 'success');
            }).catch(e => {
                console.log('Play failed:', e);
                showNotification('Video tidak dapat diputar', 'error');
            });
        } else {
            video.pause();
            playPauseIcon.className = 'fas fa-play';
            showNotification('Video dijeda', 'info');
        }
        
        // Haptic feedback for mobile
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(50);
        }
    }
}

function toggleMute() {
    const video = document.querySelector('.about-story-video');
    const muteIcon = document.getElementById('muteIcon');
    
    if (video && muteIcon) {
        // Mark as user interaction
        videoHasBeenInteracted = true;
        
        if (video.muted) {
            video.muted = false;
            video.volume = 0.7; // Set to 70% volume
            muteIcon.className = 'fas fa-volume-up';
            showNotification('Suara dinyalakan (70%)', 'success');
        } else {
            video.muted = true;
            muteIcon.className = 'fas fa-volume-mute';
            showNotification('Suara dimatikan', 'info');
        }
        
        // Haptic feedback for mobile
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(50);
        }
    }
}

function updateProgressBar() {
    const video = document.querySelector('.about-story-video');
    const progressBar = document.getElementById('progressBar');
    
    if (video && progressBar) {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = progress + '%';
    }
}

function initializeVideoFeatures() {
    const video = document.querySelector('.about-story-video');
    if (video) {
        // Set initial video properties for better autoplay
        video.muted = false; // Start unmuted
        video.volume = 0.7; // Set to 70% volume
        video.preload = 'auto'; // Preload video data
        
        // Force video visibility on mobile
        if (window.innerWidth <= 768) {
            video.style.display = 'block';
            video.style.visibility = 'visible';
            video.style.opacity = '1';
        }
        
        // Add event listeners
        video.addEventListener('timeupdate', updateProgressBar);
        
        video.addEventListener('ended', function() {
            const playPauseIcon = document.getElementById('playPauseIcon');
            if (playPauseIcon) {
                playPauseIcon.className = 'fas fa-play';
            }
        });
        
        video.addEventListener('click', function() {
            toggleVideo();
        });
        
        // Track user interaction for better autoplay support
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, function() {
                videoHasBeenInteracted = true;
            }, { once: true });
        });
        
        // Handle volume changes
        video.addEventListener('volumechange', function() {
            const muteIcon = document.getElementById('muteIcon');
            if (muteIcon) {
                if (video.muted || video.volume === 0) {
                    muteIcon.className = 'fas fa-volume-mute';
                } else if (video.volume > 0.5) {
                    muteIcon.className = 'fas fa-volume-up';
                } else {
                    muteIcon.className = 'fas fa-volume-down';
                }
            }
        });
        
        // Add visibility change listener for auto-pause when tab is hidden
        document.addEventListener('visibilitychange', function() {
            if (document.hidden && !video.paused) {
                video.pause();
                const playPauseIcon = document.getElementById('playPauseIcon');
                if (playPauseIcon) {
                    playPauseIcon.className = 'fas fa-play';
                }
                console.log('Video paused - tab hidden');
            }
        });
        
        // Initialize video state based on current section
        setTimeout(() => {
            updateNavbarActiveState(); // This will set the initial active section and handle video
        }, 500);
    }
}

// ===== INTERSECTION OBSERVER FOR ABOUT SECTION =====
function initializeIntersectionObserver() {
    const aboutSection = document.getElementById('about');
    const video = document.querySelector('.about-story-video');
    
    if (aboutSection && video) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === aboutSection) {
                    if (entry.isIntersecting) {
                        // About section is visible
                        if (entry.intersectionRatio > 0.3) { // At least 30% visible
                            currentActiveSection = 'about';
                            handleVideoAutoPlayPause('about');
                        }
                    } else {
                        // About section is not visible
                        if (currentActiveSection === 'about') {
                            currentActiveSection = '';
                            handleVideoAutoPlayPause('');
                        }
                    }
                }
            });
        }, {
            threshold: [0.1, 0.3, 0.5, 0.7], // Multiple thresholds for better detection
            rootMargin: '-50px 0px -50px 0px' // Slight margin for better UX
        });
        
        observer.observe(aboutSection);
    }
}

// ===== DESKTOP NAVIGATION CLICK HANDLING =====
function setupDesktopNavigation() {
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Mark as user interaction for video autoplay
                videoHasBeenInteracted = true;
                
                // Remove active class from all links
                desktopNavLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to section
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Manually trigger section change for immediate video response
                const sectionId = href.replace('#', '');
                if (sectionId !== currentActiveSection) {
                    currentActiveSection = sectionId;
                    handleVideoAutoPlayPause(currentActiveSection);
                }
            }
        });
    });
}

// ===== IMAGE HANDLING =====
function initializeImageHandling() {
    // Menu image error handling
    const menuImages = document.querySelectorAll('.menu-image');
    menuImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            const placeholder = document.createElement('div');
            placeholder.className = 'menu-image-placeholder';
            placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 3rem;
                border-radius: 15px;
            `;
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-hamburger';
            placeholder.appendChild(icon);
            
            this.parentNode.replaceChild(placeholder, this);
        });
    });

    // Testimonial image error handling
    const testimonialImages = document.querySelectorAll('.testimonial-img');
    testimonialImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            this.style.background = `linear-gradient(135deg, var(--primary-color), var(--primary-light))`;
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = 'white';
            this.style.fontSize = '3rem';
            this.innerHTML = '<i class="fas fa-hamburger"></i>';
            this.removeAttribute('src');
        });
    });

    // Gerobak image error handling
    const gerobakImages = document.querySelectorAll('.gerobak-img, .mini-gerobak-img, .preview-img');
    gerobakImages.forEach(img => {
        img.addEventListener('error', function() {
            const placeholder = document.createElement('div');
            placeholder.className = 'gerobak-placeholder';
            placeholder.innerHTML = '<i class="fas fa-truck"></i>';
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--bg-light), #e9ecef);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-light);
                font-size: 3rem;
            `;
            this.parentNode.replaceChild(placeholder, this);
        });
    });
}

// ===== HAMBURGER MENU =====
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            // Mark as user interaction
            videoHasBeenInteracted = true;
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Enhanced hamburger animation
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
                
                // Add body scroll lock
                document.body.style.overflow = 'hidden';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
                
                // Remove body scroll lock
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1023) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    // Reset hamburger animation
                    const bars = hamburger.querySelectorAll('.bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                    
                    // Remove body scroll lock
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
}

// ===== BUTTON INTERACTIONS =====
function initializeButtonInteractions() {
    // Contact buttons
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Mark as user interaction
            videoHasBeenInteracted = true;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
            
            if (this.classList.contains('whatsapp')) {
                showNotification('Membuka WhatsApp...', 'info');
            } else if (this.classList.contains('call')) {
                showNotification('Memanggil nomor telepon...', 'info');
            } else if (this.classList.contains('instagram')) {
                showNotification('Membuka Instagram...', 'info');
            }
        });
    });

    // Order button
    const orderBtn = document.querySelector('.nav-order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function(e) {
            // Mark as user interaction
            videoHasBeenInteracted = true;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
            
            showNotification('Membuka halaman pemesanan...', 'success');
        });
    }

    // Upload buttons
    const uploadButtons = document.querySelectorAll('.upload-btn');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Mark as user interaction
            videoHasBeenInteracted = true;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px)';
            }, 150);
            
            if (this.classList.contains('instagram')) {
                showNotification('Membuka Instagram...', 'info');
            } else if (this.classList.contains('whatsapp')) {
                showNotification('Membuka WhatsApp untuk info challenge...', 'info');
            }
        });
    });
}

// ===== HASHTAG INTERACTIONS =====
function initializeHashtagInteractions() {
    const hashtags = document.querySelectorAll('.hashtag, .hashtag-about, .hashtag-footer, .hashtag-upload');
    hashtags.forEach(hashtag => {
        hashtag.addEventListener('click', function() {
            // Mark as user interaction
            videoHasBeenInteracted = true;
            
            const hashtagText = '#BURGERLOKALINDONESIA';
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(hashtagText).then(() => {
                    showNotification('Hashtag berhasil disalin: ' + hashtagText, 'success');
                }).catch(() => {
                    fallbackCopyTextToClipboard(hashtagText);
                });
            } else {
                fallbackCopyTextToClipboard(hashtagText);
            }
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ===== GEROBAK GALLERY =====
function initializeGerobakGallery() {
    const gerobakMiniCards = document.querySelectorAll('.gerobak-mini-card');
    const mainGerobakImg = document.querySelector('.gerobak-img');
    
    gerobakMiniCards.forEach(card => {
        card.addEventListener('click', function() {
            // Mark as user interaction
            videoHasBeenInteracted = true;
            
            const miniImg = this.querySelector('.mini-gerobak-img');
            if (miniImg && mainGerobakImg) {
                // Swap images with animation
                mainGerobakImg.style.opacity = '0';
                setTimeout(() => {
                    mainGerobakImg.src = miniImg.src;
                    mainGerobakImg.style.opacity = '1';
                }, 300);
            }
        });
    });
}

// ===== SCROLL HANDLING =====
function initializeScrollHandling() {
    const debouncedScrollHandler = debounce(function() {
        // Only handle navbar effects on desktop
        if (window.innerWidth > 768) {
            const navbar = document.getElementById('navbar');
            
            if (navbar && window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else if (navbar) {
                navbar.classList.remove('scrolled');
            }
        } else {
            // Force mobile navigation to stay visible during scroll
            const mobileHeader = document.getElementById('mobileHeader');
            const bottomNav = document.querySelector('.bottom-nav');
            
            if (mobileHeader) {
                mobileHeader.style.cssText = `
                    display: block !important;
                    position: fixed !important;
                    top: 0 !important;
                    transform: translateY(0) !important;
                    z-index: 9998 !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
            }
            
            if (bottomNav) {
                bottomNav.style.cssText = `
                    display: block !important;
                    position: fixed !important;
                    bottom: 0 !important;
                    transform: translateY(0) !important;
                    z-index: 9999 !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
            }
        }

        // Update active states and handle video
        updateNavbarActiveState();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
}

// ===== RESIZE HANDLING =====
function initializeResizeHandling() {
    window.addEventListener('resize', debounce(function() {
        updateMobileNav();
        
        // Ensure video stays visible on mobile
        if (window.innerWidth <= 768) {
            const video = document.querySelector('.about-story-video');
            if (video) {
                video.style.display = 'block';
                video.style.visibility = 'visible';
                video.style.opacity = '1';
            }
        }
    }, 250));
}

// ===== POSTER IMAGE HANDLING =====
function hideLoader(loaderId) {
    const loader = document.getElementById(loaderId);
    const img = loader ? loader.parentElement.querySelector('.poster-img') : null;
    
    if (loader) {
        loader.style.display = 'none';
    }
    
    if (img) {
        img.style.opacity = '1';
    }
}

function showPlaceholder(img, loaderId) {
    const loader = document.getElementById(loaderId);
    const container = img.parentElement;
    
    if (loader) {
        loader.style.display = 'none';
    }
    
    img.style.display = 'none';
    
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
        <i class="fas fa-image"></i>
        <p>Poster Promo</p>
        <small>Gambar tidak tersedia</small>
    `;
    
    placeholder.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--bg-light), #f8f9fa);
        color: var(--text-light);
        text-align: center;
        gap: 1rem;
    `;
    
    container.appendChild(placeholder);
}

// Enhanced poster initialization
function initializePosterImages() {
    const posterImages = document.querySelectorAll('.poster-img');
    
    posterImages.forEach((img, index) => {
        const loaderId = `loader-${index + 1}`;
        
        // Check if image is already loaded
        if (img.complete && img.naturalHeight > 0) {
            hideLoader(loaderId);
        } else {
            // Set up load event
            img.addEventListener('load', function() {
                hideLoader(loaderId);
            });
            
            // Set up error event
            img.addEventListener('error', function() {
                showPlaceholder(this, loaderId);
            });
        }
        
        // Add intersection observer for lazy loading effect
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.closest('.poster-card').classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(img);
    });
}

// ===== BURGER LOIN LOADING SCREEN - FULLY RESTORED ===== 
function initializeBurgerLoinLoadingScreen() {
    const loadingScreen = document.getElementById('blLoadingScreen');
    const slowConnectionWarning = document.getElementById('blSlowConnection');
    const body = document.body;
    
    console.log('🍔 Loading screen initialization started');
    
    if (!loadingScreen) {
        console.error('❌ Loading screen element not found');
        return;
    }
    
    // Add body lock class
    body.classList.add('bl-loading-active');
    
    // Loading timing configuration
    const minLoadingTime = 1500; // Minimum 1.5 seconds
    const maxLoadingTime = 5000; // Maximum 5 seconds
    const slowConnectionTime = 3000; // Show slow connection warning after 3 seconds
    
    const startTime = Date.now();
    let slowConnectionTimer;
    let maxLoadingTimer;
    
    console.log('⏱️ Loading timers set up');
    
    // Show slow connection warning
    slowConnectionTimer = setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('bl-fade-out')) {
            if (slowConnectionWarning) {
                slowConnectionWarning.classList.add('bl-show');
                console.log('🐌 Slow connection warning shown');
            }
        }
    }, slowConnectionTime);
    
    // Function to hide loading screen
    function hideBurgerLoinLoadingScreen() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        console.log(`⏰ Hiding loading screen. Elapsed: ${elapsedTime}ms, Remaining: ${remainingTime}ms`);
        
        // Clear timers
        clearTimeout(slowConnectionTimer);
        clearTimeout(maxLoadingTimer);
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('bl-fade-out');
                console.log('🌅 Loading screen fade-out started');
                
                // Remove loading screen after transition
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    body.classList.remove('bl-loading-active');
                    console.log('✅ Loading screen completely hidden');
                    
                    // Trigger post-loading animations
                    triggerBurgerLoinPostLoadingAnimations();
                }, 800);
            }
        }, remainingTime);
    }
    
    // Wait for all critical resources to load
    function handleLoadComplete() {
        console.log('📦 All resources loaded, hiding loading screen');
        hideBurgerLoinLoadingScreen();
    }
    
    if (document.readyState === 'complete') {
        console.log('📋 Document already complete');
        handleLoadComplete();
    } else {
        console.log('⏳ Waiting for window load event');
        window.addEventListener('load', handleLoadComplete);
    }
    
    // Fallback: Hide loading after maximum time
    maxLoadingTimer = setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('bl-fade-out')) {
            console.log('⚠️ Loading screen timeout fallback triggered');
            hideBurgerLoinLoadingScreen();
        }
    }, maxLoadingTime);
    
    console.log('🚀 Loading screen initialization completed');
}

// ===== POST-LOADING ANIMATIONS - ENHANCED =====
function triggerBurgerLoinPostLoadingAnimations() {
    console.log('🎬 Starting post-loading animations');
    
    // Animate hero elements with stagger effect
    const heroElements = [
        '.hero-title',
        '.hero-description', 
        '.hero-slogan',
        '.hero-buttons',
        '.hero-stats'
    ];
    
    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150 + 200);
        }
    });
    
    // Animate hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px) scale(0.9)';
        heroImage.style.transition = 'all 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0) scale(1)';
        }, 600);
    }
    
    // Animate navigation bars
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        setTimeout(() => {
            navbar.style.transform = 'translateY(0)';
        }, 400);
    }
    
    // Animate mobile elements
    const mobileHeader = document.getElementById('mobileHeader');
    const bottomNav = document.getElementById('bottomNav');
    
    if (mobileHeader) {
        mobileHeader.style.transform = 'translateY(-100%)';
        mobileHeader.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        setTimeout(() => {
            mobileHeader.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (bottomNav) {
        bottomNav.style.transform = 'translateY(100%)';
        bottomNav.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        setTimeout(() => {
            bottomNav.style.transform = 'translateY(0)';
        }, 500);
    }
    
    console.log('🎉 Post-loading animations completed');
}

// ===== PRELOAD CRITICAL RESOURCES =====
function preloadBurgerLoinCriticalResources() {
    console.log('📡 Starting critical resources preload');
    
    // Critical images for faster loading
    const criticalImages = [
        '../assets/Image/logo_burgerloin-removebg.png',
        '../assets/Image/Menu_buergerloin.png',
        '../assets/Image/chicken_burger.png',
        '../assets/Image/beef_burger.png',
        '../assets/Image/double_beef_burger.png'
    ];
    
    // Preload images
    criticalImages.forEach((src, index) => {
        const img = new Image();
        img.onload = () => console.log(`✅ Preloaded: ${src}`);
        img.onerror = () => console.warn(`❌ Failed to preload: ${src}`);
        img.src = src;
    });
    
    // Preload video if exists
    const aboutVideo = document.querySelector('.about-story-video');
    if (aboutVideo) {
        aboutVideo.preload = 'metadata';
        console.log('🎬 Video preload set to metadata');
    }
    
    console.log('🎯 Critical resources preloading started');
}

// Perbarui bagian DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 DOM Content Loaded - Initializing Burger Loin application');
    
    // Initialize Burger Loin loading screen first - PRIORITY 1
    initializeBurgerLoinLoadingScreen();
    
    // Start preloading critical resources - PRIORITY 2
    preloadBurgerLoinCriticalResources();
    
    // Initialize core features - PRIORITY 3
    try {
        setupMobileNavigation();
        setupDesktopNavigation();
        initializeVideoFeatures();
        initializeIntersectionObserver();
        initializeResizeHandling();
        
        console.log('✅ Core features initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing core features:', error);
    }
    
    // Force correct display after DOM ready
    setTimeout(() => {
        updateMobileNav();
        console.log('📱 Mobile navigation updated');
    }, 100);
    
    // Initialize additional features - PRIORITY 4
    try {
        initializeImageHandling();
        initializeHamburgerMenu();
        initializeButtonInteractions();
        initializeHashtagInteractions();
        initializeScrollHandling();
        initializePosterImages();
        
        console.log('🎊 Additional features initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing additional features:', error);
    }
});

// Handle page visibility change for loading screen
document.addEventListener('visibilitychange', function() {
    const loadingScreen = document.getElementById('blLoadingScreen');
    
    // If page becomes visible and loading screen is still showing
    if (!document.hidden && loadingScreen && !loadingScreen.classList.contains('bl-fade-out')) {
        // Reset slow connection timer
        const slowConnection = document.getElementById('blSlowConnection');
        if (slowConnection) {
            slowConnection.classList.remove('bl-show');
            console.log('🔄 Slow connection warning hidden on visibility change');
        }
    }
});

// Emergency fallback to remove loading screen if stuck
setTimeout(() => {
    const loadingScreen = document.getElementById('blLoadingScreen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.warn('🚨 Emergency fallback: Forcing loading screen removal');
        loadingScreen.style.display = 'none';
        document.body.classList.remove('bl-loading-active');
    }
}, 10000); // 10 seconds emergency fallback

// Page visibility change handling
document.addEventListener('visibilitychange', function() {
    const video = document.querySelector('.about-story-video');
    const playPauseIcon = document.getElementById('playPauseIcon');
    
    if (document.hidden && video && !video.paused) {
        video.pause();
        if (playPauseIcon) {
            playPauseIcon.className = 'fas fa-play';
        }
        console.log('Video paused - page hidden');
    }
});