/**
 * @file contato.js
 * @description Script para a página "Contato" da Renovatech.
 * - Gerencia o tema (Dark/Light).
 * - Controla animações de entrada.
 * - Adiciona interatividade ao acordeão de FAQ.
 * - Valida o formulário de contato.
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
    

    // --- MÓDULO 3: LÓGICA DO ACORDEÃO (FAQ) ---
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = document.getElementById(toggle.getAttribute('aria-controls'));
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            toggle.setAttribute('aria-expanded', !isExpanded);
            content.setAttribute('aria-hidden', isExpanded);
            
            content.style.maxHeight = isExpanded ? '0' : `${content.scrollHeight}px`;
        });
    });


    // --- MÓDULO 4: VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const subject = contactForm.querySelector('#subject').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Limpa status anterior
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            if (!name || !email || !subject || !message) {
                formStatus.textContent = 'Por favor, preencha todos os campos.';
                formStatus.classList.add('error');
                return;
            }

            if (!emailRegex.test(email)) {
                formStatus.textContent = 'Por favor, insira um email válido.';
                formStatus.classList.add('error');
                return;
            }

            // Simulação de envio bem-sucedido
            formStatus.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
            formStatus.classList.add('success');
            contactForm.reset();

            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        });
    }

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