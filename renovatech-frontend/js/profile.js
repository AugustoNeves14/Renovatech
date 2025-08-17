/**
 * @file profile.js
 * @description Script dedicado para a página de perfil do utilizador da Renovatech.
 * - Protege a página, exigindo autenticação.
 * - Busca dados do perfil do utilizador a partir da API.
 * - Gere a edição de dados, pré-visualização de imagem e atualização de senha.
 * - Utiliza placeholders SVG locais para robustez e funcionamento offline.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- CARREGAMENTO DE COMPONENTES REUTILIZÁVEIS ---
    // (Presumindo que já existe uma função para isso em main.js, como loadComponent)
    const loadComponents = async () => {
        // Esta função deve carregar a navbar, footer, etc.
        // Exemplo:
        // await loadComponent('#navbar-placeholder', 'components/navbar.html');
        // await loadComponent('#footer-placeholder', 'components/footer.html');
    };
    
    // URL REAL DA API
    const API_BASE_URL = 'http://localhost:5000/api';

    // --- SELETORES DE ELEMENTOS DO DOM ---
    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const profilePicPreview = document.getElementById('profile-picture-preview');
    const profilePicInput = document.getElementById('profile-picture-input');
    const profileForm = document.getElementById('profile-form');
    const alertContainer = document.getElementById('profile-alert-container');
    
    // --- 1. GUARDA DE SEGURANÇA E HELPER DE API ---
    const token = localStorage.getItem('token');
    const userFromStorage = JSON.parse(localStorage.getItem('user'));

    if (!token || !userFromStorage) {
        window.location.href = 'login.html';
        return;
    }

    const apiFetch = async (endpoint, options = {}) => {
        try {
            const fetchOptions = { ...options };
            fetchOptions.headers = { 'Content-Type': 'application/json', ...fetchOptions.headers, 'Authorization': `Bearer ${token}` };
            
            if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
                fetchOptions.body = JSON.stringify(fetchOptions.body);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                window.location.href = 'login.html';
                return;
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Erro ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error(`ERRO DE API para ${endpoint}:`, error);
            throw error;
        }
    };

    // --- 2. FUNÇÃO UTILITÁRIA PARA GERAR PLACEHOLDERS SVG ---
    const createSvgPlaceholder = (text = 'RT', width = 150, height = 150) => {
        const bgColor = '#0352bb';
        const textColor = '#ffffff';
        const initials = text.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
        
        const svg = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${bgColor}" />
                <text x="50%" y="50%" font-family="Poppins, sans-serif" font-size="${height / 2.5}" fill="${textColor}" text-anchor="middle" dy=".3em">${initials}</text>
            </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    // --- 3. CARREGAMENTO INICIAL DOS DADOS DO PERFIL ---
    const loadProfileData = async () => {
        if (profilePicPreview) {
            profilePicPreview.src = createSvgPlaceholder(userFromStorage.username);
        }
        
        try {
            const data = await apiFetch('/profile');
            const user = data.profile;

            if (usernameEl) usernameEl.textContent = user.username;
            if (emailEl) emailEl.textContent = user.email;
            
            if (profileForm) {
                profileForm.querySelector('#form-username').value = user.username;
                profileForm.querySelector('#form-email').value = user.email;
                profileForm.querySelector('#form-phone').value = user.phone || '';
            }
        } catch (error) {
            showAlert(`Não foi possível carregar os dados do perfil: ${error.message}`, 'danger');
        }
    };

    // --- 4. PRÉ-VISUALIZAÇÃO DA FOTO DE PERFIL ---
    if (profilePicInput && profilePicPreview) {
        profilePicInput.addEventListener('change', () => {
            const file = profilePicInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 5. SUBMISSÃO DO FORMULÁRIO ---
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const button = profileForm.querySelector('button[type="submit"]');
            const originalButtonHTML = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> A Salvar...';

            const newPassword = document.getElementById('form-new-password').value;
            const confirmPassword = document.getElementById('form-confirm-password').value;

            if (newPassword && newPassword !== confirmPassword) {
                showAlert('As novas senhas não coincidem.', 'danger');
                button.disabled = false;
                button.innerHTML = originalButtonHTML;
                return;
            }

            const formData = new FormData(profileForm);
            const body = Object.fromEntries(formData.entries());
            
            if (!newPassword) {
                delete body.newPassword;
                delete body.confirmPassword;
            }

            try {
                const data = await apiFetch('/profile', { method: 'PUT', body });
                localStorage.setItem('user', JSON.stringify(data.user));
                showAlert('Perfil atualizado com sucesso!', 'success');
                loadProfileData();

            } catch (error) {
                showAlert(`Erro ao atualizar: ${error.message}`, 'danger');
            } finally {
                button.disabled = false;
                button.innerHTML = originalButtonHTML;
                document.getElementById('form-new-password').value = '';
                document.getElementById('form-confirm-password').value = '';
            }
        });
    }
    
    // --- 6. FUNÇÃO UTILITÁRIA PARA ALERTAS ---
    const showAlert = (message, type) => {
        if (!alertContainer) return;
        const alertType = type === 'success' ? 'success' : 'danger';
        alertContainer.innerHTML = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    };

    // --- INICIALIZAÇÃO DA PÁGINA ---
    const init = async () => {
        await loadComponents();
        await loadProfileData();
    };

    init();
});

document.addEventListener('DOMContentLoaded', () => {
    // ... TODO: Cole todo o seu código JS existente aqui ...
    // (O código que começa com const API_BASE_URL = ... e termina com loadShowcaseData();)


    /* --- NOVA SEÇÃO: LÓGICA PARA ALTERNAR O TEMA --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const docElement = document.documentElement;

    // Função para aplicar o tema com base no localStorage ou preferência do sistema
    const applyTheme = (theme) => {
        if (theme === 'light') {
            docElement.setAttribute('data-theme', 'light');
        } else {
            docElement.setAttribute('data-theme', 'dark');
        }
    };

    // Verifica o tema salvo ou a preferência do sistema ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Event listener para o botão de alternância
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = docElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        docElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

}); // Fim do addEventListener principal