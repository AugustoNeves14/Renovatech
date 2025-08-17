/**
 * @file service-detail.js
 * @description Script que torna a página service-detail.html dinâmica.
 * Lê o ID do serviço da URL, busca os dados em service-data.js e preenche a página.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const dynamicContentContainer = document.getElementById('service-dynamic-content');

    // Função para renderizar o conteúdo do serviço
    const renderServicePage = (service) => {
        // Atualiza o título da aba do navegador
        document.title = `${service.title} - Renovatech`;

        // Gera o HTML do conteúdo dinâmico
        const contentHTML = `
            <section class="service-detail-hero section-padding">
                <div class="container">
                    <h1>${service.title}</h1>
                    <p class="service-price">${service.price}</p>
                    <img src="${service.mainImage}" alt="Imagem principal de ${service.title}" class="service-main-image">
                </div>
            </section>

            <section class="service-content-section section-padding">
                <div class="container service-grid">
                    <div class="service-description-wrapper">
                        <h2>Descrição Completa</h2>
                        <p>${service.longDescription}</p>
                    </div>
                    <aside class="service-sidebar">
                        <h3>Notícias Relacionadas</h3>
                        <ul class="related-news-list">
                            ${service.relatedNews.map(news => `<li><a href="${news.url}">${news.title}</a></li>`).join('')}
                        </ul>
                        <a id="whatsapp-cta" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full">
                            Solicitar Orçamento
                        </a>
                    </aside>
                </div>
            </section>

            <section class="service-gallery-section section-padding">
                <div class="container">
                    <h2 class="section-title">Galeria de Projetos</h2>
                    <div class="gallery-grid">
                        ${service.gallery.map(img => `<img src="${img}" alt="Projeto de ${service.title}">`).join('')}
                    </div>
                </div>
            </section>
        `;

        // Insere o HTML gerado na página
        dynamicContentContainer.innerHTML = contentHTML;

        // Configura o link do WhatsApp após o botão ser inserido na página
        const whatsappCta = document.getElementById('whatsapp-cta');
        const whatsappNumber = "244935995336";
        const whatsappMessage = `Olá! Tenho interesse no serviço de "${service.title}" e gostaria de um orçamento.`;
        whatsappCta.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    };

    // Função para renderizar a página de erro
    const renderErrorPage = () => {
        document.title = 'Erro - Serviço Não Encontrado';
        dynamicContentContainer.innerHTML = `
            <div class="container section-padding text-center">
                <h1>Serviço Não Encontrado</h1>
                <p>O serviço que você está a procurar não existe ou a URL está incorreta.</p>
                <a href="services.html" class="btn btn-primary">Ver Todos os Serviços</a>
            </div>
        `;
    };

    // --- Lógica Principal ---
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');

    if (serviceId) {
        // A variável 'servicesData' vem do arquivo 'service-data.js'
        const service = servicesData.find(s => s.id === serviceId);

        if (service) {
            renderServicePage(service); // Encontrou o serviço, renderiza a página
        } else {
            renderErrorPage(); // ID inválido, renderiza erro
        }
    } else {
        renderErrorPage(); // Nenhuma ID na URL, renderiza erro
    }
});