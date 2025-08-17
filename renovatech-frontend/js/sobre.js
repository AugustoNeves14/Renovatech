/**
 * @file sobre.js
 * @description Script para a página "Sobre Nós" da Renovatech.
 * - Gerencia o tema (Dark/Light).
 * - Controla animações de entrada de elementos ao rolar a página.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: GERENCIAMENTO DE TEMA ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if(themeToggleButton) {
             themeToggleButton.setAttribute('aria-label', theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro');
        }
    };

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);


    // --- MÓDULO 2: ANIMAÇÕES DE SCROLL ---
    const initializeScrollReveal = () => {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || '0s';
                    entry.target.style.transitionDelay = delay;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.on-scroll-reveal').forEach(el => {
            revealObserver.observe(el);
        });
    };
    
    // --- INICIALIZAÇÃO ---
    initializeScrollReveal();
});

document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('heroVideo');
    const heroSlider = document.getElementById('heroSlider');

    // Verifica se os elementos existem na página
    if (heroVideo && heroSlider) {
        
        // 1. Lógica de transição do Vídeo para o Slider
        heroVideo.addEventListener('ended', () => {
            // Esconde o vídeo com uma transição suave
            heroVideo.style.opacity = '0';
            
            setTimeout(() => {
                heroVideo.classList.add('hidden');
                
                // Mostra o slider e inicia o carrossel
                heroSlider.classList.remove('hidden');
                heroSlider.style.opacity = '1';
                startSlider();
            }, 800); // Tempo igual à transição do CSS
        });
        
        // 2. Lógica do Carrossel de Imagens
        const slides = heroSlider.querySelectorAll('.slide');
        let currentSlide = 0;
        const slideInterval = 5000; // Tempo de cada slide (5 segundos)
        let slideTimer;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function startSlider() {
            if (slides.length > 0) {
                showSlide(currentSlide); // Mostra o primeiro slide
                // Inicia o timer para trocar os slides
                slideTimer = setInterval(nextSlide, slideInterval);
            }
        }
    }
});