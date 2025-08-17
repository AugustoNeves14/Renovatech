/**
 * @file main.js
 * @description Script principal e universal para todas as funcionalidades do site Renovatech.
 * - Carrega componentes reutilizáveis (navbar, footer, modal de logout).
 * - Gerencia o estado de autenticação do utilizador (login/logout).
 * - Controla o tema (Dark/Light).
 * - Gerencia a navegação mobile (drawer) de forma segura e acessível.
 * - Aplica animações e interatividades apenas nos elementos que existem na página atual.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Módulo: CARREGADOR DE COMPONENTES
     * Função assíncrona para injetar HTML de ficheiros externos em placeholders.
     */
    const loadComponent = async (elementId, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fetch para ${url} falhou: ${response.statusText}`);
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = await response.text();
            }
        } catch (error) {
            console.error(`Erro ao carregar componente para #${elementId}:`, error);
        }
    };

    /**
     * Módulo: INICIALIZADOR PRINCIPAL
     * Orquestra o carregamento de componentes e a inicialização de todas as funcionalidades.
     */
    const initializeApp = async () => {
        await Promise.all([
            loadComponent('navbar-placeholder', 'components/navbar.html'),
            loadComponent('footer-placeholder', 'components/footer.html'),
            loadComponent('logout-modal-placeholder', 'components/logout-modal.html')
        ]);

        initializeThemeToggle();
        initializeMobileNav();
        initializeAuthState();
        initializeLogoutModal();
        initializePageSpecificScripts();
    };

    // --- MÓDULO 3: FUNCIONALIDADES GLOBAIS ---

    const initializeThemeToggle = () => {
        const themeToggleButton = document.getElementById('theme-toggle') || document.getElementById('theme-toggle-fab');
        if (!themeToggleButton) return;

        const htmlEl = document.documentElement;
        const applyTheme = (theme) => {
            htmlEl.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggleButton.setAttribute('aria-label', theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro');
        };

        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        themeToggleButton.addEventListener('click', () => {
            const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    };

    const initializeMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navDrawer = document.getElementById('nav-drawer');
        const navOverlay = document.getElementById('nav-overlay');
        if (!navToggle || !navDrawer || !navOverlay) return;

        const focusableElementsInDrawer = navDrawer.querySelectorAll('a[href]:not([disabled]), button:not([disabled])');
        const firstFocusableElement = focusableElementsInDrawer[0];
        const lastFocusableElement = focusableElementsInDrawer[focusableElementsInDrawer.length - 1];

        const openDrawer = () => {
            navToggle.setAttribute('aria-expanded', 'true');
            navDrawer.setAttribute('aria-hidden', 'false');
            navOverlay.classList.add('visible');
            document.body.classList.add('drawer-open');
            if (firstFocusableElement) firstFocusableElement.focus();
        };

        const closeDrawer = () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navDrawer.setAttribute('aria-hidden', 'true');
            navOverlay.classList.remove('visible');
            document.body.classList.remove('drawer-open');
            navToggle.focus();
        };

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            isExpanded ? closeDrawer() : openDrawer();
        });

        navOverlay.addEventListener('click', closeDrawer);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
                closeDrawer();
            }
        });

        focusableElementsInDrawer.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        navDrawer.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || navDrawer.getAttribute('aria-hidden') === 'true') return;
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });
    };

    const initializeAuthState = () => {
        const token = localStorage.getItem('token');
        const loginButton = document.getElementById('login-button');
        const logoutButton = document.getElementById('logout-button');
        const mobileLoginLink = document.getElementById('mobile-login-link');
        const mobileLogoutLink = document.getElementById('mobile-logout-link');
        const profileFab = document.getElementById('profile-fab');

        const handleLogoutClick = (e) => {
            e.preventDefault();
            showLogoutModal();
        };

        if (token) {
            if (loginButton) loginButton.style.display = 'none';
            if (logoutButton) {
                logoutButton.style.display = 'inline-block';
                logoutButton.addEventListener('click', handleLogoutClick);
            }
            if (mobileLoginLink) mobileLoginLink.style.display = 'none';
            if (mobileLogoutLink) {
                mobileLogoutLink.style.display = 'block';
                mobileLogoutLink.addEventListener('click', handleLogoutClick);
            }
            if (profileFab) profileFab.style.display = 'flex';
        } else {
            if (loginButton) loginButton.style.display = 'inline-block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (mobileLoginLink) mobileLoginLink.style.display = 'block';
            if (mobileLogoutLink) mobileLogoutLink.style.display = 'none';
            if (profileFab) profileFab.style.display = 'none';
        }
    };

    // --- MÓDULO 4: LÓGICA DO MODAL DE LOGOUT ---
    let clockInterval = null;

    const showLogoutModal = () => {
        const overlay = document.getElementById('logout-modal-overlay');
        if (!overlay) return;
        const timeEl = document.getElementById('logout-modal-time');
        const dateEl = document.getElementById('logout-modal-date');
        const dashboardLink = document.getElementById('dashboard-link');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (dashboardLink) {
            dashboardLink.style.display = (user && user.role === 'admin') ? 'flex' : 'none';
        }
        const updateClock = () => {
            const now = new Date();
            if (timeEl) timeEl.textContent = now.toLocaleTimeString('pt-PT');
            if (dateEl) dateEl.textContent = now.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        };
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
        document.body.style.overflow = 'hidden';
        overlay.style.visibility = 'visible';
        overlay.classList.add('visible');
    };

    const hideLogoutModal = () => {
        const overlay = document.getElementById('logout-modal-overlay');
        if (!overlay) return;
        clearInterval(clockInterval);
        document.body.style.overflow = '';
        overlay.classList.remove('visible');
        setTimeout(() => { overlay.style.visibility = 'hidden'; }, 400);
    };

    const initializeLogoutModal = () => {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-confirm-btn') {
                localStorage.clear();
                window.location.href = 'index.html';
            }
            if (e.target.id === 'logout-cancel-btn' || e.target.id === 'logout-modal-overlay') {
                hideLogoutModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('logout-modal-overlay')?.classList.contains('visible')) {
                hideLogoutModal();
            }
        });
    };

    // --- MÓDULO 5: SCRIPTS ESPECÍFICOS DE PÁGINAS ---
    const initializePageSpecificScripts = () => {

        // ANIMAÇÕES ON-SCROLL REVEAL (Universal)
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.on-scroll-reveal').forEach(el => revealObserver.observe(el));

        // ACORDEÃO (FAQ)
        const accordionToggles = document.querySelectorAll('.accordion-toggle');
        if (accordionToggles.length > 0) {
            accordionToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const content = document.getElementById(toggle.getAttribute('aria-controls'));
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    toggle.setAttribute('aria-expanded', !isExpanded);
                    if (content) {
                        content.setAttribute('aria-hidden', isExpanded);
                        content.style.maxHeight = isExpanded ? '0' : `${content.scrollHeight}px`;
                    }
                });
            });
        }

        // CARROSSEL DE IMAGENS
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const nextButton = carousel.querySelector('.carousel-button.next');
            const prevButton = carousel.querySelector('.carousel-button.prev');
            const nav = carousel.querySelector('.carousel-nav');
            
            if (slides.length > 0 && nextButton && prevButton && nav) {
                const slideWidth = slides[0].getBoundingClientRect().width;
                slides.forEach((slide, index) => { slide.style.left = slideWidth * index + 'px'; });
                
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('carousel-dot');
                    if (index === 0) dot.classList.add('active');
                    nav.appendChild(dot);
                });
                const dots = Array.from(nav.children);

                const moveToSlide = (currentSlide, targetSlide) => {
                    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
                    currentSlide.classList.remove('active');
                    targetSlide.classList.add('active');
                };
                
                const updateDots = (currentDot, targetDot) => {
                    currentDot.classList.remove('active');
                    targetDot.classList.add('active');
                };

                nextButton.addEventListener('click', () => {
                    const currentSlide = track.querySelector('.active') || slides[0];
                    const nextSlide = currentSlide.nextElementSibling || slides[0];
                    const currentDot = nav.querySelector('.active');
                    const nextDot = currentDot.nextElementSibling || dots[0];
                    moveToSlide(currentSlide, nextSlide);
                    updateDots(currentDot, nextDot);
                });

                prevButton.addEventListener('click', () => {
                    const currentSlide = track.querySelector('.active') || slides[0];
                    const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
                    const currentDot = nav.querySelector('.active');
                    const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];
                    moveToSlide(currentSlide, prevSlide);
                    updateDots(currentDot, prevDot);
                });
                
                nav.addEventListener('click', e => {
                    const targetDot = e.target.closest('button.carousel-dot');
                    if (!targetDot) return;
                    const currentSlide = track.querySelector('.active') || slides[0];
                    const currentDot = nav.querySelector('.active');
                    const targetIndex = dots.findIndex(dot => dot === targetDot);
                    const targetSlide = slides[targetIndex];
                    moveToSlide(currentSlide, targetSlide);
                    updateDots(currentDot, targetDot);
                });
                
                setInterval(() => { nextButton.click(); }, 5000);
                slides[0].classList.add('active');
            }
        }
    };

    // --- INICIA A APLICAÇÃO ---
    initializeApp();
});