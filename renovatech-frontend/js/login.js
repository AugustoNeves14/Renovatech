document.addEventListener('DOMContentLoaded', () => {
    // URL da sua API de backend
    const API_BASE_URL = 'http://localhost:5000/api/auth';

    // --- 1. GERENCIADOR DE TEMA (MODO CLARO/ESCURO) ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    
    // Define o tema escuro como padrão se nada estiver salvo
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // --- 2. LÓGICA DE ALTERNÂNCIA DE FORMULÁRIOS ---
    const forms = {
        login: document.getElementById('login-form'),
        register: document.getElementById('register-form'),
        forgot: document.getElementById('forgot-password-form'),
    };
    const formLinks = document.querySelectorAll('[data-form-switcher]');

    const switchForm = (targetId) => {
        Object.values(forms).forEach(form => form.classList.remove('active'));
        const targetForm = document.getElementById(targetId);
        if (targetForm) {
            targetForm.classList.add('active');
        }
    };

    formLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm(link.getAttribute('data-form-switcher'));
        });
    });

    // --- 3. LÓGICA DE FEEDBACK (ALERTAS) ---
    const showAlert = (message, type, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Remove alerta existente para não acumular
        const existingAlert = container.querySelector('.auth-alert');
        if (existingAlert) existingAlert.remove();

        const alertEl = document.createElement('div');
        alertEl.className = `auth-alert ${type}`;
        alertEl.textContent = message;
        
        container.prepend(alertEl);
    };

    // --- 4. LÓGICA DE SUBMISSÃO DOS FORMULÁRIOS ---

    // LOGIN
    if (forms.login) {
        forms.login.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const button = e.target.querySelector('button');
            button.disabled = true;

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            
            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                if (!data.success) {
                    showAlert(data.message || 'Erro desconhecido.', 'error', 'login-alert-container');
                } else {
                    showAlert(data.message, 'success', 'login-alert-container');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => window.location.href = data.user.role === 'admin' ? 'dashboard.html' : 'index.html', 1500);
                }
            } catch (error) {
                showAlert('Falha de conexão com o servidor.', 'error', 'login-alert-container');
            } finally {
                button.disabled = false;
            }
        });
    }

    // CADASTRO
    if (forms.register) {
        forms.register.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const button = e.target.querySelector('button');
            button.disabled = true;

            const username = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            if (password !== confirmPassword) {
                showAlert('As senhas não coincidem.', 'error', 'register-alert-container');
                button.disabled = false;
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });
                const data = await response.json();
                if (!data.success) {
                    showAlert(data.message || 'Erro ao criar conta.', 'error', 'register-alert-container');
                } else {
                    showAlert(data.message + ' Agora pode fazer login.', 'success', 'register-alert-container');
                    setTimeout(() => switchForm('login-form'), 2000);
                }
            } catch (error) {
                showAlert('Falha de conexão com o servidor.', 'error', 'register-alert-container');
            } finally {
                button.disabled = false;
            }
        });
    }

    // RECUPERAÇÃO DE SENHA (Simulação)
    if (forms.forgot) {
        forms.forgot.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const button = e.target.querySelector('button');
            button.disabled = true;
            button.textContent = 'Enviando...';

            setTimeout(() => {
                showAlert('Se o seu email estiver registado, receberá um link de recuperação.', 'info', 'forgot-alert-container');
                button.disabled = false;
                button.textContent = 'Enviar Link de Recuperação';
            }, 1500);
        });
    }

    // --- 5. ANIMAÇÃO DE FUNDO (PARTÍCULAS) ---
    const canvas = document.getElementById('particle-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 100;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 0.5 - 0.25);
                this.speedY = (Math.random() * 0.5 - 0.25);
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = 'rgba(3, 82, 187, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                particle.update();
                particle.draw();
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }
});