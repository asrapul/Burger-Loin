/* filepath: d:\Coding\Bismillah\webUMKM\pesan.js */

// ===== GLOBAL VARIABLES =====
let cart = [];
let selectedOrderType = null;
let cartTotal = 0;

// Menu data
const menuData = {
    'chicken-burger': {
        id: 'chicken-burger',
        name: 'Chicken Burger',
        price: 15000,
        image: '../assets/Image/chicken_burger.png',
        description: 'Burger ayam crispy dengan saus spesial'
    },
    'beef-burger': {
        id: 'beef-burger',
        name: 'Beef Burger',
        price: 20000,
        image: '../assets/Image/beef_burger.png',
        description: 'Burger daging sapi juicy dengan bumbu rahasia'
    },
    'double-beef-burger': {
        id: 'double-beef-burger',
        name: 'Double Beef Burger',
        price: 30000,
        image: '../assets/Image/double_beef_burger.png',
        description: 'Double patty daging sapi dengan keju melted'
    },
    // ===== MENU BARU DENGAN KEJU =====
    'chicken-burger-cheese': {
        id: 'chicken-burger-cheese',
        name: 'Chicken Burger + Keju',
        price: 20000,
        image: '../assets/Image/chicken_burger.png',
        description: 'Burger ayam crispy dengan extra keju melted',
        hasBuiltInCheese: true
    },
    'beef-burger-cheese': {
        id: 'beef-burger-cheese',
        name: 'Beef Burger + Keju',
        price: 25000,
        image: '../assets/Image/beef_burger.png',
        description: 'Burger daging sapi juicy dengan keju cheddar melted',
        hasBuiltInCheese: true
    },
    'double-beef-burger-extra-cheese': {
        id: 'double-beef-burger-extra-cheese',
        name: 'Double Beef + Extra Keju',
        price: 35000,
        image: '../assets/Image/double_beef_burger.png',
        description: 'Double patty daging sapi dengan double keju melted',
        hasBuiltInCheese: true,
        isPremium: true
    }
};

// Extra items
const extraData = {
    'cheese': {
        id: 'cheese',
        name: 'Extra Keju',
        price: 5000
    }
};

// Tambahkan data area dengan ongkir
const deliveryAreas = {
    'biringkanaya': { name: 'Biringkanaya (Sudiang)', fee: 0 }, // Gratis untuk Sudiang
    'tamalanrea': { name: 'Tamalanrea', fee: 8000 },
    'manggala': { name: 'Manggala', fee: 10000 },
    'panakkukang': { name: 'Panakkukang', fee: 12000 },
    'rappocini': { name: 'Rappocini', fee: 15000 },
    'makassar': { name: 'Makassar', fee: 10000 }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize displays
    updateAllDisplays();
});

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== ORDER TYPE SELECTION =====
function selectOrderType(type) {
    selectedOrderType = type;
    
    // Update UI
    const orderDetails = document.getElementById('order-details');
    const orderTypeIcon = document.getElementById('orderTypeIcon');
    const orderTypeTitle = document.getElementById('orderTypeTitle');
    const orderTypeDescription = document.getElementById('orderTypeDescription');
    const orderBenefits = document.getElementById('orderBenefits');
    
    // Show order details section
    orderDetails.style.display = 'block';
    orderDetails.scrollIntoView({ behavior: 'smooth' });
    
    // Update content based on type
    if (type === 'pickup') {
        orderTypeIcon.innerHTML = '<i class="fas fa-store"></i>';
        orderTypeTitle.textContent = 'Ambil di Tempat';
        orderTypeDescription.textContent = 'Datang langsung ke gerobak kami di area Sudiang dan nikmati burger segar yang baru saja dimasak';
        
        orderBenefits.innerHTML = `
            <div class="benefit-item">
                <i class="fas fa-money-bill-wave"></i>
                <span>Tanpa ongkir</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-clock"></i>
                <span>Lebih cepat</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-fire"></i>
                <span>Burger hangat</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-eye"></i>
                <span>Lihat proses masak</span>
            </div>
        `;
    } else {
        orderTypeIcon.innerHTML = '<i class="fas fa-motorcycle"></i>';
        orderTypeTitle.textContent = 'Diantarkan';
        orderTypeDescription.textContent = 'Kami antar burger langsung ke lokasi Anda di area Sudiang dan sekitarnya dengan packaging yang aman dan higienis';
        
        orderBenefits.innerHTML = `
            <div class="benefit-item">
                <i class="fas fa-home"></i>
                <span>Nyaman di rumah</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-motorcycle"></i>
                <span>Antar langsung</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-box"></i>
                <span>Packaging aman</span>
            </div>
            <div class="benefit-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>Area Sudiang</span>
            </div>
        `;
    }
    
    showNotification(`${type === 'pickup' ? 'Ambil di Tempat' : 'Diantarkan'} dipilih!`, 'success');
}

// ===== SHOW MENU =====
function showMenu() {
    const menuSection = document.getElementById('menu-section');
    menuSection.style.display = 'block';
    menuSection.scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Silakan pilih menu favorit Anda!', 'info');
}

// ===== QUANTITY MANAGEMENT =====
function updateQuantity(itemId, change) {
    const currentQty = parseInt(document.getElementById(`qty-${itemId}`).textContent) || 0;
    const newQty = Math.max(0, currentQty + change);
    
    // Update display
    document.getElementById(`qty-${itemId}`).textContent = newQty;
    
    // Update cart
    updateCart(itemId, newQty);
    
    // Update menu item appearance
    updateMenuItemAppearance(itemId, newQty);
    
    // Update all displays
    updateAllDisplays();
}

// ===== EXTRA TOGGLE =====
function toggleExtra(itemId, extraId) {
    const toggle = event.target;
    const isActive = toggle.classList.contains('active');
    
    // Cek jika menu memiliki built-in cheese, jangan izinkan toggle extra
    const menuItem = menuData[itemId];
    if (menuItem && menuItem.hasBuiltInCheese) {
        showNotification('Menu ini sudah termasuk keju!', 'info');
        return;
    }
    
    if (isActive) {
        toggle.classList.remove('active');
        removeExtraFromCart(itemId, extraId);
    } else {
        // Only allow if item is in cart
        const quantity = parseInt(document.getElementById(`qty-${itemId}`).textContent) || 0;
        if (quantity > 0) {
            toggle.classList.add('active');
            addExtraToCart(itemId, extraId);
        } else {
            showNotification('Tambahkan menu terlebih dahulu!', 'warning');
        }
    }
    
    updateAllDisplays();
}

// ===== CART MANAGEMENT =====
function updateCart(itemId, quantity) {
    // Remove existing item
    cart = cart.filter(item => !item.id.startsWith(itemId));
    
    if (quantity > 0) {
        const menuItem = menuData[itemId];
        
        // Add base item
        cart.push({
            id: itemId,
            name: menuItem.name,
            price: menuItem.price,
            quantity: quantity,
            total: menuItem.price * quantity,
            image: menuItem.image,
            type: 'main'
        });
        
        // Hanya re-add extras jika bukan menu dengan built-in cheese
        if (!menuItem.hasBuiltInCheese) {
            const extraToggle = document.querySelector(`[onclick="toggleExtra('${itemId}', 'cheese')"]`);
            if (extraToggle && extraToggle.classList.contains('active')) {
                addExtraToCart(itemId, 'cheese');
            }
        }
    } else {
        // Remove extras too when main item quantity is 0 (hanya untuk menu yang punya extra)
        if (!menuData[itemId] || !menuData[itemId].hasBuiltInCheese) {
            const extraToggle = document.querySelector(`[onclick="toggleExtra('${itemId}', 'cheese')"]`);
            if (extraToggle) {
                extraToggle.classList.remove('active');
            }
        }
    }
}

function addExtraToCart(itemId, extraId) {
    const quantity = parseInt(document.getElementById(`qty-${itemId}`).textContent) || 0;
    if (quantity > 0) {
        const extraItem = extraData[extraId];
        
        cart.push({
            id: `${itemId}-${extraId}`,
            name: `${menuData[itemId].name} + ${extraItem.name}`,
            price: extraItem.price,
            quantity: quantity,
            total: extraItem.price * quantity,
            type: 'extra',
            parentId: itemId
        });
    }
}

function removeExtraFromCart(itemId, extraId) {
    cart = cart.filter(item => item.id !== `${itemId}-${extraId}`);
}

// ===== DISPLAY UPDATES =====
function updateAllDisplays() {
    updateCartDisplay();
    updateCartTotal();
    updateFloatingCart();
    updateNavbarBadge();
    updateMobileCartBadge(); // Add this line
    updateOrderFormVisibility();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartHeader = document.querySelector('.cart-summary h3');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang masih kosong</p>
                <span>Pilih menu di atas untuk mulai memesan</span>
            </div>
        `;
        if (cartHeader) cartHeader.removeAttribute('data-count');
        return;
    }
    
    // Update header with item count
    const totalItems = cart.filter(item => item.type === 'main').reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItems = cart.filter(item => item.type === 'main').length;
    
    if (cartHeader) {
        cartHeader.setAttribute('data-count', `${totalItems} item (${uniqueItems} jenis)`);
    }
    
    // Group items by main item
    const groupedItems = {};
    cart.forEach(item => {
        if (item.type === 'main') {
            groupedItems[item.id] = {
                main: item,
                extras: cart.filter(extra => extra.parentId === item.id)
            };
        }
    });
    
    cartItemsContainer.innerHTML = Object.values(groupedItems).map(group => {
        const extrasHtml = group.extras.length > 0 ? 
            `<div class="cart-item-extras">${group.extras.map(extra => `+ ${extra.name.split(' + ')[1]}`).join(', ')}</div>` : '';
        
        const totalPrice = group.main.total + group.extras.reduce((sum, extra) => sum + extra.total, 0);
        
        // Check if item has built-in cheese
        const menuInfo = menuData[group.main.id];
        const hasBuiltInCheese = menuInfo && menuInfo.hasBuiltInCheese;
        const isPremium = menuInfo && menuInfo.isPremium;
        
        // Pastikan image path ada
        const imagePath = group.main.image || './Image/chicken_burger.png';
        
        return `
            <div class="cart-item ${hasBuiltInCheese ? 'has-cheese' : ''} ${isPremium ? 'premium' : ''}" data-item-id="${group.main.id}">
                <div class="cart-item-image">
                    <img src="${imagePath}" alt="${group.main.name}" onerror="this.src='./Image/chicken_burger.png'">
                    ${hasBuiltInCheese ? '<div class="cheese-indicator"><i class="fas fa-cheese"></i></div>' : ''}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">
                        ${group.main.name}
                        ${isPremium ? '<span class="premium-tag"><i class="fas fa-crown"></i></span>' : ''}
                    </div>
                    ${extrasHtml}
                    <div class="cart-item-qty">${group.main.quantity}x @ Rp ${(totalPrice / group.main.quantity).toLocaleString('id-ID')}</div>
                    ${hasBuiltInCheese ? '<div class="cheese-note"><i class="fas fa-check"></i> Sudah termasuk keju</div>' : ''}
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${group.main.id}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${group.main.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${group.main.id}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-price">
                    <div class="price-amount">Rp ${totalPrice.toLocaleString('id-ID')}</div>
                    <button class="btn-remove" onclick="removeCartItem('${group.main.id}')" title="Hapus item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateCartTotal() {
    const cartTotalSection = document.getElementById('cart-total');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const deliveryRow = document.getElementById('delivery-row');
    const deliveryAmount = document.getElementById('delivery-amount');
    const deliveryNote = document.getElementById('delivery-note');
    const finalTotal = document.getElementById('final-total');
    
    if (cart.length === 0) {
        cartTotalSection.style.display = 'none';
        return;
    }
    
    cartTotalSection.style.display = 'block';
    
    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    subtotalAmount.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    
    // Calculate delivery fee based on selected area
    let deliveryFee = 0;
    let deliveryText = 'Gratis';
    let deliveryColor = 'var(--success-color)';
    
    if (selectedOrderType === 'delivery') {
        deliveryRow.style.display = 'flex';
        
        // Get selected district
        const selectedDistrict = document.getElementById('delivery-district')?.value;
        
        if (selectedDistrict && deliveryAreas[selectedDistrict]) {
            const areaInfo = deliveryAreas[selectedDistrict];
            deliveryFee = areaInfo.fee;
            
            if (deliveryFee === 0) {
                deliveryText = 'Gratis (Area Sudiang)';
                deliveryColor = 'var(--success-color)';
                deliveryNote.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>🎉 Gratis ongkir untuk area Sudiang dan sekitarnya!</span>
                `;
                deliveryNote.style.display = 'flex';
                deliveryNote.style.background = 'rgba(40, 167, 69, 0.1)';
                deliveryNote.style.color = 'var(--success-color)';
            } else {
                deliveryText = `Rp ${deliveryFee.toLocaleString('id-ID')}`;
                deliveryColor = 'var(--warning-color)';
                deliveryNote.innerHTML = `
                    <i class="fas fa-motorcycle"></i>
                    <span>Ongkir ke ${areaInfo.name}: Rp ${deliveryFee.toLocaleString('id-ID')}</span>
                `;
                deliveryNote.style.display = 'flex';
                deliveryNote.style.background = 'rgba(255, 193, 7, 0.1)';
                deliveryNote.style.color = 'var(--warning-color)';
            }
        } else {
            deliveryText = 'Pilih area dulu';
            deliveryColor = 'var(--text-muted)';
            deliveryNote.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>Pilih kecamatan untuk melihat ongkos kirim</span>
            `;
            deliveryNote.style.display = 'flex';
            deliveryNote.style.background = 'rgba(23, 162, 184, 0.1)';
            deliveryNote.style.color = 'var(--info-color)';
        }
        
        deliveryAmount.textContent = deliveryText;
        deliveryAmount.style.color = deliveryColor;
        deliveryAmount.style.fontWeight = deliveryFee === 0 ? '700' : '500';
    } else {
        deliveryRow.style.display = 'none';
        deliveryNote.style.display = 'none';
    }
    
    // Calculate final total
    cartTotal = subtotal + deliveryFee;
    finalTotal.textContent = `Rp ${cartTotal.toLocaleString('id-ID')}`;
}

function updateFloatingCart() {
    const floatingCart = document.getElementById('floating-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsCount = document.getElementById('cart-items-count');
    const cartTotalMini = document.getElementById('cart-total-mini');
    
    const totalItems = cart.filter(item => item.type === 'main').reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    
    if (totalItems > 0) {
        floatingCart.style.display = 'flex';
        cartCount.textContent = totalItems;
        cartItemsCount.textContent = `${totalItems} item${totalItems > 1 ? '' : ''}`;
        cartTotalMini.textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;
    } else {
        floatingCart.style.display = 'none';
    }
}

function updateNavbarBadge() {
    const navCartBadge = document.getElementById('navCartBadge');
    if (!navCartBadge) return;
    
    const totalItems = cart.filter(item => item.type === 'main').reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        navCartBadge.style.display = 'flex';
        navCartBadge.textContent = totalItems;
    } else {
        navCartBadge.style.display = 'none';
    }
}

function updateMenuItemAppearance(itemId, quantity) {
    const menuItem = document.querySelector(`[data-id="${itemId}"]`);
    if (quantity > 0) {
        menuItem.classList.add('in-cart');
    } else {
        menuItem.classList.remove('in-cart');
    }
}

function updateOrderFormVisibility() {
    const cartSection = document.getElementById('cart-section');
    const orderForm = document.getElementById('order-form');
    const pickupForm = document.getElementById('pickup-form');
    const deliveryForm = document.getElementById('delivery-form');
    
    if (cart.length > 0) {
        cartSection.style.display = 'block';
        
        if (selectedOrderType) {
            orderForm.style.display = 'block';
            
            if (selectedOrderType === 'pickup') {
                pickupForm.style.display = 'block';
                deliveryForm.style.display = 'none';
            } else if (selectedOrderType === 'delivery') {
                pickupForm.style.display = 'none';
                deliveryForm.style.display = 'block';
            }
        } else {
            orderForm.style.display = 'none';
        }
    } else {
        cartSection.style.display = 'none';
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Form submissions
    const pickupForm = document.getElementById('pickup-form');
    const deliveryForm = document.getElementById('delivery-form');
    
    if (pickupForm) {
        pickupForm.addEventListener('submit', handleOrderSubmit);
    }
    
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // Cart button click
    const navCartBtn = document.getElementById('navCartBtn');
    if (navCartBtn) {
        navCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToCart();
        });
    }
    
    // District change listener
    const deliveryDistrict = document.getElementById('delivery-district');
    if (deliveryDistrict) {
        deliveryDistrict.addEventListener('change', function() {
            showDeliveryInfo(this.value);
            updateCartTotal();
        });
    }
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const orderDetails = document.getElementById('order-details');
            if (orderDetails) {
                orderDetails.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Navbar brand click
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            // If we're on the same page, smooth scroll to top
            if (window.location.pathname.includes('pesan.html')) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Setup mobile navigation
    setupMobileNavigation();
}

// ===== MOBILE BOTTOM NAVIGATION FUNCTIONALITY =====
function setupMobileNavigation() {
    const mobileCartBtn = document.getElementById('mobileCartBtn');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    // Mobile cart button functionality
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToCart();
            setActiveNavItem(this);
        });
    }
    
    // Set active state for current page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'pesan.html' || currentPage === '') {
        const cartNav = document.querySelector('.cart-nav');
        if (cartNav) {
            cartNav.classList.add('active');
        }
    }
    
    // Add click handlers for all bottom nav items
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't prevent default for external links
            if (!this.href.includes('#') && !this.href.includes('index.html')) {
                return;
            }
            
            e.preventDefault();
            setActiveNavItem(this);
            
            // Handle navigation
            const href = this.getAttribute('href');
            if (href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (href.includes('index.html')) {
                window.location.href = href;
            }
        });
    });
}

function setActiveNavItem(activeItem) {
    // Remove active class from all items
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    activeItem.classList.add('active');
}

// Update mobile cart badge
function updateMobileCartBadge() {
    const mobileCartBadge = document.getElementById('mobileCartBadge');
    const cartNav = document.querySelector('.cart-nav');
    
    if (!mobileCartBadge || !cartNav) return;
    
    const totalItems = cart.filter(item => item.type === 'main').reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        mobileCartBadge.style.display = 'flex';
        mobileCartBadge.textContent = totalItems;
        cartNav.classList.add('has-items');
        
        // Show mobile order status
        const mobileOrderStatus = document.getElementById('mobileOrderStatus');
        if (mobileOrderStatus) {
            mobileOrderStatus.style.display = 'flex';
        }
    } else {
        mobileCartBadge.style.display = 'none';
        cartNav.classList.remove('has-items');
        
        // Hide mobile order status
        const mobileOrderStatus = document.getElementById('mobileOrderStatus');
        if (mobileOrderStatus) {
            mobileOrderStatus.style.display = 'none';
        }
    }
}

// Update the main updateAllDisplays function
function updateAllDisplays() {
    updateCartDisplay();
    updateCartTotal();
    updateFloatingCart();
    updateNavbarBadge();
    updateMobileCartBadge(); // Add this line
    updateOrderFormVisibility();
}

// Add mobile navigation setup to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    setupMobileNavigation(); // Add this line
    updateMobileCartBadge(); // Add this line
    
    // Initialize loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize displays
    updateAllDisplays();
});

// Mobile header scroll effect
window.addEventListener('scroll', function() {
    const mobileHeader = document.getElementById('mobileHeader');
    const navbar = document.getElementById('navbar');
    
    if (mobileHeader) {
        if (window.scrollY > 50) {
            mobileHeader.style.background = 'rgba(255, 255, 255, 0.98)';
            mobileHeader.style.backdropFilter = 'blur(20px)';
            mobileHeader.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            mobileHeader.style.background = 'rgba(255, 255, 255, 0.95)';
            mobileHeader.style.backdropFilter = 'blur(15px)';
            mobileHeader.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Navbar scroll effect for desktop
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Add vibration feedback for mobile interactions (if supported)
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50); // Short vibration
    }
}

// Add haptic feedback to bottom nav items
document.addEventListener('DOMContentLoaded', function() {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            addHapticFeedback();
        });
    });
});

// ===== ORDER SUBMISSION =====
function handleOrderSubmit(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showNotification('Keranjang masih kosong!', 'warning');
        return;
    }
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Calculate delivery fee
    let deliveryFee = 0;
    if (selectedOrderType === 'delivery') {
        const selectedDistrict = formData.get('district');
        if (selectedDistrict && deliveryAreas[selectedDistrict]) {
            deliveryFee = deliveryAreas[selectedDistrict].fee;
        }
    }
    
    // Prepare order data
    const orderData = {
        orderType: selectedOrderType,
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address') || '',
            district: formData.get('district') || '',
            notes: formData.get('notes') || ''
        },
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + item.total, 0),
        deliveryFee: deliveryFee,
        total: cart.reduce((sum, item) => sum + item.total, 0) + deliveryFee,
        orderId: generateOrderId(),
        timestamp: new Date().toISOString()
    };
    
    // Show loading
    const submitBtn = form.querySelector('.btn-order');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    submitBtn.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        // Send to WhatsApp
        sendToWhatsApp(orderData);
        
        // Show success modal
        showSuccessModal(orderData);
        
        // Reset form
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        
        // Clear cart after success
        setTimeout(() => {
            clearCart();
        }, 2000);
    }, 1500);
}

// ===== WHATSAPP INTEGRATION =====
function sendToWhatsApp(orderData) {
    let message = `*PESANAN BURGER LOIN*\n\n`;
    message += `*No. Pesanan:* ${orderData.orderId}\n`;
    message += `*Jenis Pesanan:* ${orderData.orderType === 'pickup' ? 'Ambil di Tempat' : 'Diantarkan'}\n\n`;
    
    message += `*Data Pelanggan:*\n`;
    message += `Nama: ${orderData.customer.name}\n`;
    message += `WhatsApp: ${orderData.customer.phone}\n`;
    
    if (orderData.orderType === 'delivery') {
        message += `Alamat: ${orderData.customer.address}\n`;
        message += `Kecamatan: ${orderData.customer.district}\n`;
        
        // Add delivery area info
        const selectedDistrict = orderData.customer.district.toLowerCase();
        const areaKey = Object.keys(deliveryAreas).find(key => 
            deliveryAreas[key].name.toLowerCase().includes(selectedDistrict) ||
            key === selectedDistrict
        );
        
        if (areaKey && deliveryAreas[areaKey].fee === 0) {
            message += `🎉 *GRATIS ONGKIR* (Area Sudiang)\n`;
        } else {
            message += `📍 *Area Layanan: Makassar dan sekitarnya*\n`;
        }
    } else {
        message += `📍 *Lokasi Pickup: Sudiang dan sekitarnya*\n`;
    }
    
    message += `\n*Detail Pesanan:*\n`;
    
    // Group items by main item for display
    const groupedItems = {};
    orderData.items.forEach(item => {
        if (item.type === 'main') {
            groupedItems[item.id] = {
                main: item,
                extras: orderData.items.filter(extra => extra.parentId === item.id)
            };
        }
    });
    
    Object.values(groupedItems).forEach(group => {
        const extrasText = group.extras.length > 0 ? 
            ` (${group.extras.map(extra => `+ ${extra.name.split(' + ')[1]}`).join(', ')})` : '';
        const totalPrice = group.main.total + group.extras.reduce((sum, extra) => sum + extra.total, 0);
        
        // Check if menu has built-in cheese
        const menuInfo = menuData[group.main.id];
        const hasBuiltInCheese = menuInfo && menuInfo.hasBuiltInCheese;
        const cheeseInfo = hasBuiltInCheese ? ' 🧀' : '';
        
        message += `• ${group.main.name}${cheeseInfo}${extrasText}\n`;
        message += `  ${group.main.quantity}x @ Rp ${(totalPrice / group.main.quantity).toLocaleString('id-ID')} = Rp ${totalPrice.toLocaleString('id-ID')}\n`;
        
        if (hasBuiltInCheese) {
            message += `  ✅ Sudah termasuk keju\n`;
        }
        message += `\n`;
    });
    
    message += `*Subtotal:* Rp ${orderData.subtotal.toLocaleString('id-ID')}\n`;
    
    // Enhanced delivery fee display
    if (orderData.deliveryFee > 0) {
        message += `*Ongkir:* Rp ${orderData.deliveryFee.toLocaleString('id-ID')}\n`;
    } else if (orderData.orderType === 'delivery') {
        message += `*Ongkir:* GRATIS (Area Sudiang) 🎉\n`;
    } else {
        message += `*Ongkir:* Tidak ada (Pickup)\n`;
    }
    
    message += `*Total:* Rp ${orderData.total.toLocaleString('id-ID')}\n\n`;
    
    if (orderData.customer.notes) {
        message += `*Catatan:* ${orderData.customer.notes}\n\n`;
    }
    
    message += `Mohon konfirmasi pesanan ini. Terima kasih! 🍔`;
    
    const whatsappNumber = '6281340698852';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
}

// ===== UTILITY FUNCTIONS =====
function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BL${timestamp}${random}`;
}

function scrollToCart() {
    const cartSection = document.getElementById('cart-section');
    if (cartSection && cartSection.style.display !== 'none') {
        cartSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        showNotification('Tambahkan item ke keranjang terlebih dahulu!', 'info');
    }
}

function openMaps() {
    // Link Google Maps untuk area Sudiang, Makassar
    const mapsURL = 'https://goo.gl/maps/Sudiang-Makassar'; // Ganti dengan link Google Maps yang sebenarnya untuk Sudiang
    window.open(mapsURL, '_blank');
}

function clearCart() {
    cart = [];
    selectedOrderType = null;
    
    // Reset all quantity displays
    document.querySelectorAll('.quantity').forEach(qty => {
        qty.textContent = '0';
    });
    
    // Reset extra toggles
    document.querySelectorAll('.extra-toggle').forEach(toggle => {
        toggle.classList.remove('active');
    });
    
    // Reset menu item appearances
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('in-cart');
    });
    
    updateAllDisplays();
    
    // Hide sections
    document.getElementById('cart-section').style.display = 'none';
    document.getElementById('order-details').style.display = 'none';
    document.getElementById('menu-section').style.display = 'none';
    
    showNotification('Keranjang telah dikosongkan', 'info');
}

// ===== MODAL FUNCTIONS =====
function showSuccessModal(orderData) {
    const modal = document.getElementById('success-modal');
    const modalOrderId = document.getElementById('modal-order-id');
    const modalOrderTotal = document.getElementById('modal-order-total');
    
    modalOrderId.textContent = orderData.orderId;
    modalOrderTotal.textContent = `Rp ${orderData.total.toLocaleString('id-ID')}`;
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function newOrder() {
    closeModal();
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== REMOVE CART ITEM =====
function removeCartItem(itemId) {
    // Reset quantity to 0
    updateQuantity(itemId, -parseInt(document.getElementById(`qty-${itemId}`).textContent));
    
    // Reset extra toggles for this item
    const extraToggle = document.querySelector(`[onclick="toggleExtra('${itemId}', 'cheese')"]`);
    if (extraToggle) {
        extraToggle.classList.remove('active');
    }
    
    updateAllDisplays();
    showNotification('Item dihapus dari keranjang', 'info');
}

// ===== ENHANCED LOADING SCREEN =====
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('fade-out');
    }
}

// Make functions global
window.removeCartItem = removeCartItem;
window.showLoadingScreen = showLoadingScreen;

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(350px);
        transition: transform 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Set background color based on type
    const colors = {
        'success': '#28a745',
        'info': '#17a2b8',
        'warning': '#ffc107',
        'error': '#dc3545'
    };
    
    notification.style.background = colors[type] || colors.success;
    if (type === 'warning') {
        notification.style.color = '#000';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto hide
    setTimeout(() => {
        notification.style.transform = 'translateX(350px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== GLOBAL FUNCTIONS =====
window.selectOrderType = selectOrderType;
window.showMenu = showMenu;
window.updateQuantity = updateQuantity;
window.toggleExtra = toggleExtra;
window.scrollToCart = scrollToCart;
window.openMaps = openMaps;
window.closeModal = closeModal;
window.newOrder = newOrder;

// ===== BACK TO TOP FUNCTIONALITY =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== ENHANCED BACK TO TOP FUNCTIONALITY =====

// Enhanced Back to Top with Scroll Progress
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 360;
    
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.style.setProperty('--scroll-progress', `${scrollProgress}deg`);
    }
}

// Show/hide back to top button with enhanced effects
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('backToTop');
    const scrollPosition = window.scrollY;
    
    if (backToTopBtn) {
        if (scrollPosition > 300) {
            backToTopBtn.classList.add('show');
            
            // Add pulse effect when first shown
            if (!backToTopBtn.hasAttribute('data-shown')) {
                backToTopBtn.classList.add('pulse');
                backToTopBtn.setAttribute('data-shown', 'true');
                setTimeout(() => {
                    backToTopBtn.classList.remove('pulse');
                }, 1500);
            }
        } else {
            backToTopBtn.classList.remove('show');
            backToTopBtn.removeAttribute('data-shown');
        }
    }
    
    // Update scroll progress for enhanced version
    updateScrollProgress();
});

// Enhanced scroll to top function
function scrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Add loading state
    if (backToTopBtn) {
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    
    // Smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Reset button after scroll completes
    setTimeout(() => {
        if (backToTopBtn) {
            backToTopBtn.style.pointerEvents = 'auto';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            
            // Add success feedback
            backToTopBtn.classList.add('pulse');
            setTimeout(() => {
                backToTopBtn.classList.remove('pulse');
            }, 1000);
        }
    }, 800);
}

// Add tooltip functionality
function createTooltip() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn && !backToTopBtn.querySelector('.back-to-top-tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.className = 'back-to-top-tooltip';
        tooltip.textContent = 'Kembali ke atas';
        backToTopBtn.appendChild(tooltip);
    }
}

// Initialize enhanced back to top
document.addEventListener('DOMContentLoaded', function() {
    createTooltip();
    updateScrollProgress();
});

// Make function global
window.scrollToTop = scrollToTop;

console.log('🍔 Burger Loin ordering system loaded successfully!');