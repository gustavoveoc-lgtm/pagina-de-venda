/* 
   FUSE Landing Page - Dynamic Features and CRO Optimization
   Includes: App Simulator tabs, FAQ accordion, Checkout Drawer order bump logic & Form validation.
*/

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initAppShowcase();
    initFAQAccordion();
    initCheckoutDrawer();
    initScrollAnimations();
    renderEvolutionChart();
});

/* 1. HEADER SCROLL EFFECT */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* 2. APP SHOWCASE SIMULATOR TABS */
function initAppShowcase() {
    const tabs = document.querySelectorAll('.showcase-tab');
    const screens = document.querySelectorAll('.app-screen-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetScreenId = tab.getAttribute('data-screen');
            
            // Update tabs active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update virtual screen active state inside smartphone mockup
            screens.forEach(screen => {
                screen.classList.remove('active');
                if (screen.id === `screen-${targetScreenId}`) {
                    screen.classList.add('active');
                }
            });
        });
    });
}

/* 3. FAQ ACCORDION TRANSITIONS */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = null;
            });
            
            // If the clicked item was not active, open it
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

/* 4. CHECKOUT DRAWER & ORDER BUMP LOGIC (CRO ENGINE) */
function initCheckoutDrawer() {
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('checkout-drawer');
    const closeBtn = document.getElementById('drawer-close');
    const openBtns = document.querySelectorAll('.open-checkout-btn');
    
    const checkoutForm = document.getElementById('checkout-form-element');
    const checkoutSuccess = document.getElementById('checkout-success');
    const checkoutInitialView = document.getElementById('checkout-initial-view');
    
    // Order Bump pricing elements
    const bumpCheckbox = document.getElementById('challenge-upsell');
    const totalLabel = document.getElementById('total-price-val');
    const bumpRow = document.getElementById('summary-row-challenge');
    
    const BASE_PRICE = 45.90;
    const CHALLENGE_PRICE = 19.99;

    function openDrawer() {
        backdrop.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock body scroll
    }

    function closeDrawer() {
        backdrop.classList.remove('active');
        drawer.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
        
        // Reset form state after a short delay
        setTimeout(() => {
            checkoutInitialView.style.display = 'block';
            checkoutSuccess.classList.remove('active');
            checkoutForm.reset();
            if (bumpCheckbox) {
                bumpCheckbox.checked = false;
                updatePricing();
            }
        }, 500);
    }

    function updatePricing() {
        if (!bumpCheckbox) return;
        
        if (bumpCheckbox.checked) {
            bumpRow.style.display = 'flex';
            const total = BASE_PRICE + CHALLENGE_PRICE;
            totalLabel.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        } else {
            bumpRow.style.display = 'none';
            totalLabel.textContent = `R$ ${BASE_PRICE.toFixed(2).replace('.', ',')}`;
        }
    }

    // Attach open handlers
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openDrawer();
        });
    });

    // Attach close handlers
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    
    // Order bump event listener
    if (bumpCheckbox) {
        bumpCheckbox.addEventListener('change', updatePricing);
    }
    
    // Form submission simulator
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Loading Animation
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="spinner" style="animation: spin 1s linear infinite; margin-right: 8px;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
                </svg>
                Processando...
            `;
            
            // Simulate Payment Gateway call (2 seconds delay)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Get customer name for personalization
                const customerNameInput = document.getElementById('chk-name');
                const customerName = customerNameInput ? customerNameInput.value.split(' ')[0] : 'Aluna';
                
                // Set success message
                const successTitle = document.getElementById('success-customer-name');
                if (successTitle) {
                    successTitle.textContent = `Bem-vinda ao FUSE, ${customerName}!`;
                }
                
                // Toggle success view
                checkoutInitialView.style.display = 'none';
                checkoutSuccess.classList.add('active');
            }, 2000);
        });
    }
}

// Add rotate spinner keyframes style dynamically if not defined
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

/* 5. SMOOTH SCROLL & REVEAL ANIMATIONS */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.benefit-card, .step-card, .pain-card, .solution-box, .evolution-stat-card, .testimonial-card');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        // Initial setup
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        revealObserver.observe(el);
    });
}

/* 6. RENDER PREMIUM INTERACTIVE SVG EVOLUTION CHART */
function renderEvolutionChart() {
    const chartWrapper = document.getElementById('evolution-chart-svg');
    if (!chartWrapper) return;
    
    // Width and height of our viewport
    const width = chartWrapper.clientWidth || 340;
    const height = 180;
    
    // Data points representing monthly consistency percentage
    const dataPoints = [35, 45, 62, 58, 75, 88, 94];
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    
    // Scale calculations
    const paddingX = 40;
    const paddingY = 30;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;
    
    const minVal = 0;
    const maxVal = 100;
    
    // Map data to coordinates
    const coordinates = dataPoints.map((val, idx) => {
        const x = paddingX + (idx / (dataPoints.length - 1)) * chartWidth;
        const y = paddingY + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
        return { x, y, val, label: labels[idx] };
    });
    
    // Build path strings
    let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
    for (let i = 1; i < coordinates.length; i++) {
        // Use smooth bezier curves
        const prev = coordinates[i - 1];
        const curr = coordinates[i];
        const cpX1 = prev.x + (curr.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (curr.x - prev.x) / 2;
        const cpY2 = curr.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
    
    // Build gradient fill path
    const fillPathD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${paddingY + chartHeight} L ${coordinates[0].x} ${paddingY + chartHeight} Z`;
    
    // Create elements
    let svgContent = `
        <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Line glow filter -->
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                
                <!-- Main gradient -->
                <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#E8A598" />
                    <stop offset="50%" stop-color="#D0B3E1" />
                    <stop offset="100%" stop-color="#E5C38C" />
                </linearGradient>
                
                <!-- Fill area gradient -->
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E8A598" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#E8A598" stop-opacity="0.0" />
                </linearGradient>
            </defs>
            
            <!-- Horizontal gridlines -->
            <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="rgba(247, 239, 242, 0.05)" stroke-width="1" />
            <line x1="${paddingX}" y1="${paddingY + chartHeight / 2}" x2="${width - paddingX}" y2="${paddingY + chartHeight / 2}" stroke="rgba(247, 239, 242, 0.05)" stroke-dasharray="4" stroke-width="1" />
            <line x1="${paddingX}" y1="${paddingY + chartHeight}" x2="${width - paddingX}" y2="${paddingY + chartHeight}" stroke="rgba(247, 239, 242, 0.1)" stroke-width="1" />
            
            <!-- Y-axis labels -->
            <text x="${paddingX - 10}" y="${paddingY + 4}" fill="#8E7A84" font-size="10" text-anchor="end" font-family="'Inter', sans-serif">100%</text>
            <text x="${paddingX - 10}" y="${paddingY + chartHeight / 2 + 4}" fill="#8E7A84" font-size="10" text-anchor="end" font-family="'Inter', sans-serif">50%</text>
            <text x="${paddingX - 10}" y="${paddingY + chartHeight + 4}" fill="#8E7A84" font-size="10" text-anchor="end" font-family="'Inter', sans-serif">0%</text>
            
            <!-- Area under the curve -->
            <path d="${fillPathD}" fill="url(#areaGradient)" />
            
            <!-- Glowing Curve Line -->
            <path d="${pathD}" fill="none" stroke="url(#chartGradient)" stroke-width="3" filter="url(#glow)" stroke-linecap="round" />
    `;
    
    // Draw dots and text tags
    coordinates.forEach((pt, idx) => {
        const isLast = idx === coordinates.length - 1;
        const activeColor = isLast ? '#E5C38C' : '#E8A598';
        
        svgContent += `
            <!-- Grid tick labels -->
            <text x="${pt.x}" y="${height - 10}" fill="#8E7A84" font-size="10" text-anchor="middle" font-family="'Inter', sans-serif">${pt.label}</text>
            
            <!-- Interactive tooltip circles -->
            <circle cx="${pt.x}" cy="${pt.y}" r="${isLast ? 6 : 4}" fill="${activeColor}" stroke="#1E1218" stroke-width="${isLast ? 3 : 2}" />
        `;
        
        if (isLast) {
            // Draw floating pill value above last dot
            svgContent += `
                <rect x="${pt.x - 20}" y="${pt.y - 30}" width="40" height="20" rx="4" fill="#E5C38C" />
                <text x="${pt.x}" y="${pt.y - 17}" fill="#0B0508" font-size="10" font-weight="700" text-anchor="middle" font-family="'Inter', sans-serif">${pt.val}%</text>
            `;
        }
    });
    
    svgContent += `</svg>`;
    chartWrapper.innerHTML = svgContent;
}

// Redraw chart on window resize
window.addEventListener('resize', renderEvolutionChart);
