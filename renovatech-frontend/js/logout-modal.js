/**
 * @file logout-modal.js
 * @description Módulo para controlar o modal de confirmação de logout.
 */

const logoutModal = (() => {
    // --- Seleção de Elementos ---
    const overlay = document.getElementById('logout-modal-overlay');
    const confirmBtn = document.getElementById('logout-confirm-btn');
    const cancelBtn = document.getElementById('logout-cancel-btn');
    const timeEl = document.getElementById('logout-modal-time');
    const dateEl = document.getElementById('logout-modal-date');
    const dashboardLink = document.getElementById('dashboard-link');
    
    let clockInterval = null;

    // --- Funções Privadas ---
    const updateClock = () => {
        const now = new Date();
        const time = now.toLocaleTimeString('pt-PT');
        const date = now.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        if (timeEl) timeEl.textContent = time;
        if (dateEl) dateEl.textContent = date;
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html'; // Redireciona para a página inicial
    };

    // --- Funções Públicas ---
    const show = () => {
        if (!overlay) return;
        
        // Verifica se o utilizador é admin para mostrar ou esconder o link do dashboard
        const user = JSON.parse(localStorage.getItem('user'));
        if (dashboardLink) {
            dashboardLink.style.display = (user && user.role === 'admin') ? 'flex' : 'none';
        }

        // Inicia o relógio
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
        
        // Mostra o modal
        document.body.style.overflow = 'hidden';
        overlay.style.visibility = 'visible';
        overlay.classList.add('visible');
    };

    const hide = () => {
        if (!overlay) return;
        
        // Para o relógio
        clearInterval(clockInterval);
        
        // Esconde o modal
        document.body.style.overflow = '';
        overlay.classList.remove('visible');
        // Espera a transição de opacidade terminar para esconder completamente
        setTimeout(() => {
            overlay.style.visibility = 'hidden';
        }, 400);
    };

    // --- Adição de Eventos ---
    if (confirmBtn) confirmBtn.addEventListener('click', handleLogout);
    if (cancelBtn) cancelBtn.addEventListener('click', hide);
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) hide(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('visible')) hide(); });

    // Expõe apenas as funções que precisam ser chamadas de fora
    return {
        show,
        hide
    };
})();