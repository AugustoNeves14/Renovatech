document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÃO E ESTADO INICIAL ---
    const API_URL = 'http://localhost:5000/api/manage'; // Altere se o seu backend rodar em outra porta
    const token = localStorage.getItem('token');

    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const modal = document.getElementById('form-modal');
    const form = document.getElementById('manage-form');
    const formTitle = document.getElementById('form-title');
    const formFields = document.getElementById('form-fields');
    const editItemIdInput = document.getElementById('edit-item-id');
    const tableTitle = document.getElementById('table-title');
    const tableBody = document.querySelector('#data-table tbody');
    const tableHead = document.querySelector('#data-table thead');
    const addNewBtn = document.getElementById('add-new-btn');

    let currentSection = 'overview'; // Seção atualmente visível

    // --- DEFINIÇÕES DAS ESTRUTURAS DE DADOS ---
    const sectionConfig = {
        users: { title: 'Usuários', fields: ['id', 'username', 'email', 'role'], form: ['username', 'email', 'role'] },
        services: { title: 'Serviços', fields: ['id', 'title_pt', 'price_kwanza'], form: ['title_pt', 'title_en', 'description_pt', 'description_en', 'price_kwanza'] },
        news: { title: 'Notícias', fields: ['id', 'title_pt', 'created_at'], form: ['title_pt', 'content_pt', 'image_url'] },
        slides: { title: 'Slides', fields: ['id', 'title_pt', 'is_active'], form: ['title_pt', 'subtitle_pt', 'image_url', 'link_url', 'is_active'] },
        gallery: { title: 'Galeria', fields: ['id', 'caption_pt'], form: ['caption_pt', 'image_url'] },
    };

    // --- FUNÇÕES DE AUTENTICAÇÃO E INICIALIZAÇÃO ---
    function checkAuth() {
        if (!token) {
            alert('Acesso negado. Por favor, faça login como administrador.');
            window.location.href = '/login.html'; // Redireciona para a página de login
        }
    }

    function init() {
        checkAuth();
        setupEventListeners();
        loadOverview();
    }

    // --- FUNÇÃO HELPER PARA REQUISIÇÕES À API ---
    async function fetchApi(endpoint, options = {}) {
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Erro na chamada da API:', error);
            alert(`Erro na operação: ${error.message}`);
            return null;
        }
    }

    // --- LÓGICA DE NAVEGAÇÃO E EXIBIÇÃO DE SEÇÕES ---
    function switchSection(targetId) {
        currentSection = targetId;
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const activeSection = document.getElementById(targetId === 'overview' ? 'overview' : 'table-section');
        const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        
        activeSection.classList.add('active');
        if (activeLink) activeLink.classList.add('active');

        if (targetId === 'overview') {
            loadOverview();
        } else {
            loadTableData(targetId);
        }
    }
    
    // --- LÓGICA PARA CARREGAR DADOS ---
    async function loadOverview() {
        const response = await fetchApi('/stats');
        if (response && response.success) {
            const { stats } = response;
            for (const key in stats) {
                const element = document.getElementById(`stats-${key}`);
                if (element) element.textContent = stats[key];
            }
        }
    }

    async function loadTableData(sectionId) {
        const config = sectionConfig[sectionId];
        if (!config) return;

        tableTitle.textContent = `Gerenciar ${config.title}`;
        const response = await fetchApi(`/${sectionId}`);
        if (response && response.success) {
            renderTable(response.data, config.fields);
        }
    }

    // --- LÓGICA DE RENDERIZAÇÃO DA TABELA ---
    function renderTable(data, fields) {
        // Limpa a tabela
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        // Cria o cabeçalho
        const headerRow = document.createElement('tr');
        fields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field.replace('_', ' ').toUpperCase();
            headerRow.appendChild(th);
        });
        const thActions = document.createElement('th');
        thActions.textContent = 'AÇÕES';
        headerRow.appendChild(thActions);
        tableHead.appendChild(headerRow);

        // Popula o corpo da tabela
        data.forEach(item => {
            const row = document.createElement('tr');
            fields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = item[field];
                row.appendChild(td);
            });

            // Adiciona botões de ação
            const tdActions = document.createElement('td');
            const editButton = createActionButton('Editar', 'btn-edit', () => openFormModal('edit', item));
            const deleteButton = createActionButton('Apagar', 'btn-delete', () => deleteItem(item.id));
            tdActions.appendChild(editButton);
            tdActions.appendChild(deleteButton);
            row.appendChild(tdActions);

            tableBody.appendChild(row);
        });
    }

    function createActionButton(text, className, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `btn ${className}`;
        button.addEventListener('click', onClick);
        return button;
    }

    // --- LÓGICA DO MODAL E FORMULÁRIOS ---
    function openFormModal(mode, item = {}) {
        form.reset();
        const config = sectionConfig[currentSection];
        editItemIdInput.value = mode === 'edit' ? item.id : '';
        formTitle.textContent = `${mode === 'edit' ? 'Editar' : 'Adicionar'} ${config.title}`;
        
        renderFormFields(config.form, item);
        
        modal.style.display = 'block';
    }

    function closeFormModal() {
        modal.style.display = 'none';
    }

    function renderFormFields(fields, item) {
        formFields.innerHTML = ''; // Limpa campos antigos
        fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', `field-${field}`);
            label.textContent = field.replace('_', ' ').charAt(0).toUpperCase() + field.slice(1);
            
            let input;
            if (field.includes('description') || field.includes('content')) {
                input = document.createElement('textarea');
            } else {
                input = document.createElement('input');
                input.type = field.includes('email') ? 'email' : (field.includes('price') ? 'number' : 'text');
            }
            
            input.id = `field-${field}`;
            input.name = field;
            input.value = item[field] || '';

            group.appendChild(label);
            group.appendChild(input);
            formFields.appendChild(group);
        });
    }

    // --- LÓGICA DE CRUD (CREATE, UPDATE, DELETE) ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        const id = editItemIdInput.value;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const endpoint = id ? `/${currentSection}/${id}` : `/${currentSection}`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetchApi(endpoint, {
            method: method,
            body: JSON.stringify(data)
        });

        if (response && response.success) {
            alert(response.message);
            closeFormModal();
            loadTableData(currentSection);
        }
    }

    async function deleteItem(id) {
        if (!confirm('Tem certeza de que deseja apagar este registro? Esta ação é irreversível.')) {
            return;
        }

        const response = await fetchApi(`/${currentSection}/${id}`, { method: 'DELETE' });
        
        if (response && response.success) {
            alert(response.message);
            loadTableData(currentSection);
        }
    }

    // --- CONFIGURAÇÃO DOS EVENT LISTENERS ---
    function setupEventListeners() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('data-target');
                if (target) switchSection(target);
            });
        });

        addNewBtn.addEventListener('click', () => openFormModal('add'));
        document.querySelector('.close-btn').addEventListener('click', closeFormModal);
        document.getElementById('cancel-btn').addEventListener('click', closeFormModal);
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });

        form.addEventListener('submit', handleFormSubmit);

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeFormModal();
            }
        });
    }
    
    // --- INICIA A APLICAÇÃO ---
    init();
});