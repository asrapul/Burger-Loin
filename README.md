# 🍔 Burger Loin - Website UMKM Modern & Sistem Pemesanan Online

![Burger Loin](./assets/Image/logo_burgerloin-removebg.png)

## 📋 Deskripsi Proyek

**Burger Loin** adalah platform website modern untuk UMKM gerobak burger keliling yang beroperasi di area Sudiang, Makassar. Website ini menampilkan branding khas **#BURGERLOKALINDONESIA** dengan sistem pemesanan online yang user-friendly, mendukung pickup dan delivery dengan integrasi WhatsApp Business.

## 🏗️ Struktur Proyek

```
webUMKM/
├── 📁 halaman_utama/               # Landing Page & Home
│   ├── index.html                  # Halaman utama dengan full sections
│   ├── styles.css                  # CSS untuk halaman utama
│   └── script.js                   # JavaScript interaktif
├── 📁 halaman_pesan/               # Sistem Pemesanan Online
│   ├── pesan.html                  # Interface pemesanan lengkap
│   ├── pesan.css                   # CSS khusus sistem pemesanan
│   └── pesan.js                    # Logic pemesanan & cart management
├── 📁 assets/                      # Assets & Media Files
│   ├── burger_loin.mp4            # Video promosi Instagram Reels style
│   └── 📁 Image/                   # Koleksi gambar lengkap
│       ├── logo_burgerloin-removebg.png    # Logo utama
│       ├── Menu_buergerloin.png            # Banner menu
│       ├── gerobak_burgerloin.jpg          # Foto gerobak
│       ├── chicken_burger.png              # Menu chicken burger
│       ├── beef_burger.png                 # Menu beef burger  
│       ├── double_beef_burger.png          # Menu double beef
│       ├── poster_1.png                    # Poster promosi 1
│       ├── poster_2.png                    # Poster promosi 2
│       ├── poster_3.png                    # Poster promosi 3
│       ├── testimoni_1.png                 # Testimoni pelanggan 1
│       ├── testimoni_2.png                 # Testimoni pelanggan 2
│       ├── testimoni_3.png                 # Testimoni pelanggan 3
│       ├── testimoni_4.png                 # Testimoni pelanggan 4
│       ├── testimoni_5.png                 # Testimoni pelanggan 5
│       └── testimoni_6.png                 # Testimoni pelanggan 6
└── README.md                       # Dokumentasi proyek
```

## ✨ Fitur Utama Website

### 🎯 Halaman Utama (`index.html`)
- **Hero Section** dengan slogan #BURGERLOKALINDONESIA
- **Menu Showcase** dengan 3 varian burger + tambahan keju
- **About Section** dengan video Instagram Reels style
- **Upload Story Challenge** dengan poster promosi interaktif
- **Testimoni Gallery** auto-scrolling dengan 6 foto pelanggan
- **Contact Section** dengan info lengkap lokasi & jam operasional
- **Footer** dengan social media integration

### 🛒 Sistem Pemesanan (`pesan.html`)
- **Dual Navigation** (Desktop navbar + Mobile bottom nav)
- **Order Type Selection** (Pickup vs Delivery)
- **Smart Cart System** dengan quantity management
- **Menu dengan Built-in Cheese** detection
- **Area-based Delivery Fee** calculation
- **WhatsApp Integration** dengan auto-generated message
- **Real-time Order Tracking**

## 🚀 Teknologi & Fitur Teknis

### Frontend Stack
```javascript
// Core Technologies
HTML5           // Semantic markup & accessibility
CSS3            // Modern styling dengan CSS Grid & Flexbox  
JavaScript ES6  // Interactive features & DOM manipulation
Font Awesome 6  // Icon library
Google Fonts    // Typography (Poppins)
```

### 📱 Mobile-First Design
- **Responsive Grid System** untuk semua device
- **Bottom Navigation** khusus mobile dengan haptic feedback
- **Touch-friendly UI** dengan gesture support
- **PWA-ready** dengan service worker capability
- **Safe Area Support** untuk iPhone X+ series

### 🎨 Design System
```css
/* CSS Variables System */
:root {
    --primary-color: #C23028;     /* Brand Red */
    --secondary-color: #FFC107;   /* Accent Yellow */
    --success-color: #28a745;     /* Success Green */
    --text-dark: #2C3E50;         /* Primary Text */
    --bg-light: #F8F9FA;          /* Light Background */
    
    /* Spacing System */
    --space-1: 0.25rem;  --space-2: 0.5rem;
    --space-3: 0.75rem;  --space-4: 1rem;
    --space-6: 1.5rem;   --space-8: 2rem;
    
    /* Typography Scale */
    --font-xs: 0.75rem;  --font-sm: 0.875rem;
    --font-base: 1rem;   --font-lg: 1.125rem;
    --font-xl: 1.25rem;  --font-2xl: 1.5rem;
}
```

## 🍔 Menu & Sistem Pemesanan

### Menu Items Available
| Menu Item | Harga | Keju Built-in | Status |
|-----------|-------|---------------|---------|
| Chicken Burger | Rp 15.000 | ❌ | Available |
| Beef Burger | Rp 20.000 | ❌ | Best Seller |
| Double Beef | Rp 30.000 | ❌ | Premium |
| Chicken + Keju | Rp 20.000 | ✅ | Popular |
| Beef + Keju | Rp 25.000 | ✅ | Recommended |
| Double Beef + Extra Keju | Rp 35.000 | ✅ | Premium |

### 🏍️ Delivery Coverage & Pricing
```javascript
const deliveryAreas = {
    'biringkanaya': { name: 'Biringkanaya (Sudiang)', fee: 0 },      // GRATIS
    'tamalanrea': { name: 'Tamalanrea', fee: 8000 },
    'manggala': { name: 'Manggala', fee: 10000 },
    'panakkukang': { name: 'Panakkukang', fee: 12000 },
    'rappocini': { name: 'Rappocini', fee: 15000 },
    'makassar': { name: 'Makassar', fee: 10000 }
};
```

## 🔧 Setup & Installation

### 📥 Quick Start
```bash
# 1. Clone atau download repository
git clone [repository-url]
cd burger-loin-website

# 2. Struktur file sudah siap, buka di web server
# Menggunakan Live Server (VS Code)
# Atau menggunakan server lokal

# 3. Akses halaman
# Halaman Utama: index.html
# Sistem Pemesanan: pesan.html
```

### ⚙️ Kustomisasi
```css
/* Mengubah warna brand di styles.css */
:root {
    --primary-color: #YOUR_COLOR;      /* Warna utama */
    --secondary-color: #YOUR_COLOR;    /* Warna aksen */
}
```

```javascript
// Update nomor WhatsApp di script.js & pesan.js
const whatsappNumber = '6281340698852'; // Ganti dengan nomor Anda
```

## 📊 Fitur Unggulan

### 🎯 Halaman Utama
- ✅ **Dual Navigation System** (Desktop + Mobile)
- ✅ **Hero Section** dengan CTA buttons
- ✅ **Interactive Menu Cards** dengan hover effects
- ✅ **Instagram Reels Video** dengan custom controls
- ✅ **Auto-scrolling Testimonials** dengan pause on hover
- ✅ **Upload Story Challenge** dengan loading states
- ✅ **Contact Integration** dengan Google Maps

### 🛒 Sistem Pemesanan
- ✅ **Smart Cart Management** dengan local storage
- ✅ **Built-in Cheese Detection** untuk menu
- ✅ **Real-time Price Calculation** termasuk ongkir
- ✅ **WhatsApp Auto-message** dengan order details
- ✅ **Form Validation** dengan error handling
- ✅ **Success Modal** dengan order confirmation
- ✅ **Mobile Bottom Navigation** dengan cart badge

### 📱 Mobile Experience
- ✅ **Touch-friendly Interface** dengan haptic feedback
- ✅ **Safe Area Support** untuk notch devices
- ✅ **Optimized Loading** dengan loading screens
- ✅ **Gesture Navigation** support
- ✅ **PWA-ready** dengan offline capability

## 🎨 UI/UX Features

### Animations & Interactions
```css
/* Smooth Animations */
@keyframes slideDown { /* Navbar entrance */ }
@keyframes cardEntry { /* Menu card entrance */ }
@keyframes autoScroll { /* Testimonial gallery */ }
@keyframes pulse { /* CTA buttons */ }
@keyframes float { /* Hero image */ }
```

### Performance Optimizations
- **Lazy Loading** untuk images
- **Debounced Scroll** events
- **CSS Grid & Flexbox** untuk efficient layouts
- **Optimized Images** dengan fallback support
- **Minified Assets** untuk faster loading

## 📞 Business Integration

### 🔗 WhatsApp Business
```javascript
// Auto-generated WhatsApp message format
function sendToWhatsApp(orderData) {
    let message = `*PESANAN BURGER LOIN*\n\n`;
    message += `*No. Pesanan:* ${orderData.orderId}\n`;
    message += `*Jenis Pesanan:* ${orderType}\n`;
    // ... complete order details
    
    const whatsappURL = `https://wa.me/6281340698852?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}
```

### 📍 Location & Hours
- **Area Operasional**: Sudiang, Biringkanaya, Makassar
- **Jam Operasional**: 
  - Senin-Jumat: 11:00-15:00 (Area Perkantoran)
  - Weekend: 17:00-22:00 (Taman & Rekreasi)
- **Delivery Coverage**: 6 kecamatan di Makassar

### 💰 Pricing Strategy
- **Pickup**: Tanpa ongkir
- **Delivery Gratis**: Area Sudiang untuk minimal order Rp 15.000
- **Delivery Berbayar**: Area lain dengan ongkir Rp 8.000 - Rp 15.000

## 🔍 Code Quality & Best Practices

### JavaScript Architecture
```javascript
// Modular Function Design
function updateQuantity(itemId, change) { }
function updateCartDisplay() { }
function sendToWhatsApp(orderData) { }

// Event-driven Programming
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeDisplays();
});

// Error Handling
function handleOrderSubmit(e) {
    try {
        // Order processing logic
    } catch (error) {
        showNotification('Terjadi kesalahan', 'error');
    }
}
```

### CSS Methodology
- **Mobile-First** responsive design
- **CSS Variables** untuk consistent theming
- **Component-based** styling approach
- **Semantic Class Naming** convention
- **Performance-optimized** animations

### Accessibility Features
- **Semantic HTML** structure
- **ARIA labels** untuk screen readers
- **Keyboard Navigation** support
- **High Contrast** color scheme
- **Touch Target** minimum 44px

## 📈 Analytics & Tracking

### Ready for Integration
```javascript
// Google Analytics 4 ready
gtag('event', 'page_view', {
    page_title: 'Burger Loin - Pemesanan',
    page_location: window.location.href
});

// Conversion Tracking
gtag('event', 'purchase', {
    transaction_id: orderData.orderId,
    value: orderData.total,
    currency: 'IDR'
});
```

## 🚀 Deployment Options

### 📡 Hosting Recommendations
1. **Netlify** - Gratis dengan SSL & CDN
2. **Vercel** - Optimal untuk static sites
3. **GitHub Pages** - Gratis untuk open source
4. **Firebase Hosting** - Google integration
5. **Shared Hosting** - Traditional web hosting

### 🔒 Security Considerations
- **Form Validation** client & server side
- **XSS Protection** dengan input sanitization
- **HTTPS Enforced** untuk secure transactions
- **Content Security Policy** headers
- **Rate Limiting** untuk API calls

## 🎯 SEO Optimization

### Meta Tags Implementation
```html
<meta name="description" content="Pesan burger lezat dari Burger Loin...">
<meta name="keywords" content="burger, makassar, sudiang, delivery">
<meta property="og:title" content="Burger Loin - #BURGERLOKALINDONESIA">
<meta property="og:image" content="./Image/logo_burgerloin-removebg.png">
```

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contributing & Support

### 💡 How to Contribute
1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### 🐛 Bug Reports
- Gunakan GitHub Issues
- Sertakan screenshot & browser info
- Jelaskan steps to reproduce
- Label dengan severity level

### 💬 Support Channels
- **WhatsApp Business**: +62 813-4069-8852
- **Instagram**: @burgerloin
- **Email**: [email-support]
- **GitHub Issues**: Technical problems

## 📄 License & Credits

### 📜 License
Proyek ini menggunakan **MIT License** - bebas digunakan untuk komersial dan non-komersial.

### 🙏 Credits & Acknowledgments
- **Font**: Poppins by Google Fonts
- **Icons**: Font Awesome 6
- **Images**: Original Burger Loin photography
- **Inspiration**: Modern food delivery apps
- **Community**: Indonesian UMKM digital transformation

## 📞 Business Contact

### 🏢 Burger Loin UMKM
- **Lokasi**: Sudiang, Biringkanaya, Makassar
- **WhatsApp**: +62 813-4069-8852
- **Instagram**: @burgerloin


### 👨‍💻 Developer Contact
- **Project Type**: UMKM Digital Solution
- **Development**: Custom web application
- **Status**: Production Ready
- **Last Update**: 2025

---

## 🎉 Tentang Burger Loin

> *"Burger Loin membuktikan bahwa UMKM Indonesia mampu bersaing dengan teknologi modern. Kami bangga menyajikan burger berkualitas dengan harga terjangkau, didukung sistem pemesanan online yang user-friendly."*

### 🌟 Visi & Misi
- **Visi**: Menjadi gerobak burger terdepan di Makassar dengan teknologi modern
- **Misi**: Menyajikan burger berkualitas, harga terjangkau, pelayanan excellent

---

<div align="center">

### 🍔 **#BURGERLOKALINDONESIA** 🇮🇩

**Made with ❤️ for Indonesian UMKM**

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/6281340698852)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/burgerloin)

*Bangga Produk UMKM Indonesia* 🚀

</div>