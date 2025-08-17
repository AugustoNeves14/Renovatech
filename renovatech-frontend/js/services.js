/**
 * @file servicos.js
 * @description Script dedicado para a página de serviços da Renovatech.
 * - Renderiza dinamicamente os cards de serviço.
 * - Controla o modal imersivo para exibição de detalhes.
 * - Estrutura pronta para consumir dados de uma API real.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS DO DOM ---
    const servicesContainer = document.getElementById('services-container');
    const modalOverlay = document.getElementById('service-modal-overlay');
    const modalContent = document.getElementById('service-modal-content');
    const body = document.body;

    // --- DADOS MOCK (Simulação de uma resposta de API) ---
    const servicesData = [
        {
            id: 1,
            icon: 'bi-code-slash',
            title: 'Desenvolvimento Web Personalizado',
            shortDescription: 'Criamos websites e aplicações web de alta performance, totalmente responsivos e otimizados para SEO, focados em gerar resultados e conversões.',
            longDescription: 'Nossa abordagem ao desenvolvimento web vai além da estética. Mergulhamos na sua estratégia de negócio para construir plataformas digitais robustas, escaláveis e seguras. Utilizamos um stack tecnológico moderno para garantir que seu produto final não seja apenas bonito, mas também incrivelmente rápido e confiável.',
            price: 'A partir de Kz 120.000',
            features: [
                'Design UI/UX Centrado no Utilizador',
                'Arquitetura de Backend Robusta (Node.js, Python)',
                'Frameworks Modernos de Frontend (React, Vue)',
                'Otimização de Performance (Core Web Vitals)',
                'Implementação de SEO Técnico Avançado',
                'Integração com APIs e Serviços de Terceiros'
            ]
        },
        {
            id: 2,
            icon: 'bi-cart-check-fill',
            title: 'Soluções de E-commerce',
            shortDescription: 'Construímos lojas online poderosas e intuitivas, com integrações de pagamento seguras e um painel de gestão completo para você vender mais.',
            longDescription: 'Transformamos sua visão de varejo em uma plataforma de e-commerce de sucesso. Desde o design da vitrine virtual até a logística do checkout, cuidamos de cada detalhe para proporcionar uma experiência de compra impecável para seus clientes e uma gestão simplificada para você.',
            price: 'A partir de Kz 150.000',
            features: [
                'Plataformas (Shopify, WooCommerce, etc)',
                'Integração de Pagamentos Locais e Internacionais',
                'Sistemas de Gestão de Inventário',
                'Otimização da Taxa de Conversão (CRO)',
                'Marketing de Produto',
                'Recuperação de Carrinho Abandonado'
            ]
        },
        {
            id: 3,
            icon: 'bi-palette-fill',
            title: 'Design de UI/UX e Branding',
            shortDescription: 'Criamos identidades de marca memoráveis e interfaces digitais que não são apenas bonitas, mas incrivelmente fáceis e prazerosas de usar.',
            longDescription: 'O design é a alma da experiência digital. Nossa equipa de designers de UI/UX trabalha para entender profundamente seus utilizadores, criando jornadas intuitivas e interfaces visualmente deslumbrantes que fortalecem sua marca e aumentam o engajamento.',
            price: 'A partir de Kz 70.000',
            features: [
                'Pesquisa de Utilizador e Criação de Personas',
                'Wireframing e Prototipagem Interativa',
                'Criação de Design System',
                'Desenvolvimento de Identidade Visual (Branding)',
                'Testes de Usabilidade e Acessibilidade',
                'Microinterações e Animações de UI'
            ]
        },
        {
            id: 4,
            icon: 'bi-cloud-arrow-up-fill',
            title: 'Consultoria e Estratégia Digital',
            shortDescription: 'Analisamos seu negócio e o mercado para traçar um plano de ação digital completo, garantindo que cada investimento traga o máximo retorno.',
            longDescription: 'No cenário digital atual, uma estratégia clara é a diferença entre o sucesso e o fracasso. Nossos consultores atuam como seus parceiros estratégicos, ajudando a navegar pela complexidade tecnológica, identificar oportunidades e tomar decisões informadas para o crescimento sustentável.',
            price: 'Sob Consulta',
            features: [
                'Auditoria de Presença Digital',
                'Planeamento de Roadmap Tecnológico',
                'Estratégia de Marketing de Conteúdo e SEO',
                'Análise de Concorrência (Benchmarking)',
                'Consultoria em Cibersegurança',
                'Otimização de Processos e Automação'
            ]
        },
         {
            id: 5,
            icon: 'bi-phone-fill',
            title: 'Aplicações Móveis',
            shortDescription: 'Desenvolvemos aplicativos móveis nativos e híbridos para iOS e Android que encantam os utilizadores e alcançam seus objetivos de negócio.',
            longDescription: 'Leve seu negócio para o bolso dos seus clientes com aplicações móveis de alto impacto. Da concepção à publicação nas app stores, nossa equipe garante um produto final polido, performático e com uma experiência de usuário excepcional.',
            price: 'A partir de Kz 200.000',
            features: [
                'Desenvolvimento Nativo (Swift/Kotlin) ou Híbrido (React Native)',
                'Integração com Notificações Push',
                'Geolocalização e Mapas',
                'Compras In-App e Assinaturas',
                'Otimização para App Store (ASO)',
                'Manutenção e Atualizações Contínuas'
            ]
        },
        {
            id: 6,
            icon: 'bi-graph-up-arrow',
            title: 'Marketing Digital e SEO',
            shortDescription: 'Aumentamos sua visibilidade online, atraindo tráfego qualificado e convertendo visitantes em clientes fiéis através de estratégias de marketing integradas.',
            longDescription: 'Ter uma presença digital fantástica não é suficiente se ninguém a encontrar. Nossos especialistas em SEO e marketing digital criam e executam campanhas baseadas em dados para garantir que sua marca se destaque da concorrência e alcance o público certo, na hora certa.',
            price: 'A partir de Kz 50.000/mês',
            features: [
                'Otimização On-Page e Off-Page de SEO',
                'Gestão de Campanhas (Google Ads, Social Ads)',
                'Marketing de Conteúdo e Inbound Marketing',
                'Gestão de Redes Sociais',
                'Email Marketing e Automação',
                'Análise de Dados e Relatórios de Performance'
            ]
        }
    ];

    const renderServices = () => {
        if (!servicesContainer) return;

        servicesContainer.innerHTML = servicesData.map(service => `
            <div class="service-card on-scroll-reveal">
                <div class="card-icon"><i class="bi ${service.icon}"></i></div>
                <h3 class="card-title">${service.title}</h3>
                <p class="card-description">${service.shortDescription}</p>
                <div class="card-buttons">
                    <button class="btn btn-secondary btn-details-mini" data-service-id="${service.id}">Detalhes</button>
                    <a href="contato.html" class="btn btn-primary btn-subscribe-mini">Assinar</a>
                </div>
            </div>
        `).join('');

        attachDetailButtonListeners();
    };

    const attachDetailButtonListeners = () => {
        document.querySelectorAll('.btn-details-mini').forEach(button => {
            button.addEventListener('click', () => {
                const serviceId = button.dataset.serviceId;
                const service = servicesData.find(s => s.id == serviceId);
                if (service) openModal(service);
            });
        });
    };

    const openModal = (service) => {
        modalContent.innerHTML = `
            <button id="modal-close-btn-inner" class="modal-close" aria-label="Fechar Modal">&times;</button>
            <div class="modal-header">
                <h2>${service.title}</h2>
                <p class="price">${service.price}</p>
            </div>
            <div class="modal-body">
                <p>${service.longDescription}</p>
                <h4>Principais Entregáveis</h4>
                <ul class="modal-features-list">
                    ${service.features.map(feature => `<li><i class="bi bi-check-circle-fill"></i><span>${feature}</span></li>`).join('')}
                </ul>
            </div>
            <div class="modal-footer">
                 <a href="contato.html" class="btn btn-primary">Quero Contratar Este Serviço</a>
            </div>
        `;
        
        body.classList.add('modal-open');
        modalOverlay.classList.add('active');
        document.getElementById('modal-close-btn-inner').addEventListener('click', closeModal);
    };

    const closeModal = () => {
        body.classList.remove('modal-open');
        modalOverlay.classList.remove('active');
    };

    // --- INICIALIZAÇÃO E EVENTOS GLOBAIS DO MODAL ---
    if(modalOverlay){
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
        });
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    renderServices();
});

const video = document.getElementById("heroVideo");
const slides = document.getElementById("heroSlides");

video.addEventListener("ended", () => {
    video.classList.add("hidden");
    slides.classList.remove("hidden");

    // Volta para o vídeo depois de 9 segundos (tempo do slideshow)
    setTimeout(() => {
        slides.classList.add("hidden");
        video.classList.remove("hidden");
        video.currentTime = 0;
        video.play();
    }, 9000); // tempo total do @keyframes
});

document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os elementos necessários do DOM
    const detailButtons = document.querySelectorAll('.btn-details');
    const modalOverlay = document.getElementById('service-modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('modal-close-btn');

    // Função para abrir o modal
    const openModal = (title, price, description) => {
        // Constrói o HTML interno do modal com os dados do serviço
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <p class="modal-price">${price}</p>
            <p>${description}</p>
            <a href="contato.html" class="btn btn-primary modal-cta">Quero um Orçamento</a>
        `;
        // Torna o modal visível com uma transição suave
        modalOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Impede o scroll da página de fundo
    };

    // Função para fechar o modal
    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        document.body.style.overflow = ''; // Restaura o scroll da página
    };

    // Adiciona um evento de clique a cada botão "Ver Detalhes"
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega os dados dos atributos data-* do botão clicado
            const title = button.dataset.title;
            const price = button.dataset.price;
            const description = button.dataset.description;
            
            // Chama a função para abrir o modal com os dados corretos
            openModal(title, price, description);
        });
    });

    // Adiciona evento de clique ao botão de fechar do modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Adiciona evento de clique na área de sobreposição (fora do conteúdo) para fechar
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            // Fecha o modal apenas se o clique for no overlay e não no conteúdo
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Adiciona evento para fechar o modal com a tecla 'Escape'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            closeModal();
        }
    });

});

document.addEventListener('DOMContentLoaded', () => {

    const detailButtons = document.querySelectorAll('.btn-details');
    const modalOverlay = document.getElementById('service-modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('modal-close-btn');

    /**
     * Abre o modal com os detalhes do serviço e um link para o WhatsApp.
     * @param {string} title - O título do serviço.
     * @param {string} price - O preço do serviço.
     * @param {string} description - A descrição detalhada do serviço.
     */
    const openModal = (title, price, description) => {
        // ---- NOVA LÓGICA DO WHATSAPP ----
        // Número de telefone no formato internacional, sem '+' ou '00'
        const whatsappNumber = "244935995336";
        // Mensagem pré-formatada
        const whatsappMessage = `Olá! Gostaria de solicitar um orçamento para o serviço de "${title}".`;
        // Gera o link, codificando a mensagem para ser segura na URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Constrói o HTML interno do modal com os dados do serviço e o novo botão
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <p class="modal-price">${price}</p>
            <p>${description}</p>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary modal-cta">
                Solicitar Orçamento via WhatsApp
            </a>
        `;
        
        // Torna o modal visível
        modalOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Impede o scroll da página de fundo
    };

    /**
     * Fecha o modal.
     */
    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        document.body.style.overflow = ''; // Restaura o scroll da página
    };

    // Adiciona um evento de clique a cada botão "Ver Detalhes"
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const { title, price, description } = button.dataset;
            openModal(title, price, description);
        });
    });

    // Lógica para fechar o modal (sem alterações, já está robusta)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            closeModal();
        }
    });
});