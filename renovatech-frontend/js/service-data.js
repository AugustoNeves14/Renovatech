/**
 * @file service-data.js
 * @description Banco de dados estático para todos os serviços da Renovatech.
 * Para adicionar ou editar um serviço, basta modificar um objeto neste array.
 */

const servicesData = [
    {
        id: 'identidade-visual',
        title: 'Identidade Visual Completa',
        price: 'A partir de Kz 250.000',
        shortDescription: 'Criamos a alma da sua marca com um design forte e coeso que transmite confiança.',
        longDescription: 'Uma identidade visual forte é a base de qualquer negócio de sucesso. O nosso processo começa com uma imersão profunda na sua marca para entender os seus valores, público e objetivos. A partir daí, criamos um logótipo memorável, definimos uma paleta de cores impactante e selecionamos uma tipografia que comunica com clareza. O resultado final é um Manual de Normas Gráficas completo que garante consistência em todos os seus materiais, desde o cartão de visita até às campanhas digitais.',
        mainImage: 'images/servicos/identidade-visual.jpg',
        gallery: [ 'images/servicos/iv-galeria-1.jpg', 'images/servicos/iv-galeria-2.jpg', 'images/servicos/iv-galeria-3.jpg' ],
        relatedNews: [
            { title: 'A Psicologia das Cores no Branding', url: '#' },
            { title: '5 Erros a Evitar ao Criar o seu Logótipo', url: '#' }
        ]
    },
    {
        id: 'redes-sociais',
        title: 'Gestão de Redes Sociais',
        price: 'A partir de Kz 200.000/mês',
        shortDescription: 'Potenciamos a sua presença online com conteúdo estratégico que gera engajamento e resultados.',
        longDescription: 'Estar presente nas redes sociais é fundamental, mas o verdadeiro desafio é criar uma conexão genuína com o seu público. A nossa equipa desenvolve uma estratégia de conteúdo personalizada para a sua marca, produzindo posts visualmente apelativos e textos que capturam a atenção. Gerimos o calendário de publicações, interagimos com a sua comunidade e analisamos os dados para otimizar continuamente a performance e garantir que os seus objetivos de marketing são alcançados.',
        mainImage: 'images/servicos/redes-sociais.jpg',
        gallery: [ 'images/servicos/rs-galeria-1.jpg', 'images/servicos/rs-galeria-2.jpg', 'images/servicos/rs-galeria-3.jpg' ],
        relatedNews: [
            { title: 'Como o Algoritmo do Instagram Funciona em 2025', url: '#' },
            { title: 'Vídeos Curtos: A Melhor Forma de Engajar', url: '#' }
        ]
    },
    {
        id: 'material-grafico',
        title: 'Material Gráfico e Publicidade',
        price: 'Sob Consulta',
        shortDescription: 'Design impactante para todos os seus materiais de comunicação, do digital ao impresso.',
        longDescription: 'Garantimos que a sua marca se destaque em todos os pontos de contato. Desenhamos uma vasta gama de materiais, incluindo flyers, cartões de visita, banners para redes sociais, desdobráveis, catálogos e até outdoors. Cada peça é cuidadosamente criada para ser visualmente apelativa e consistente com a sua identidade de marca, transmitindo profissionalismo e captando a atenção do seu público-alvo.',
        mainImage: 'images/servicos/material-grafico.jpg',
        gallery: [ 'images/servicos/mg-galeria-1.jpg', 'images/servicos/mg-galeria-2.jpg', 'images/servicos/mg-galeria-3.jpg' ],
        relatedNews: [
            { title: 'Impressão vs. Digital: Qual o melhor para a sua campanha?', url: '#' },
            { title: 'Dicas para um Cartão de Visita Inesquecível', url: '#' }
        ]
    },
    {
        id: 'sites-institucionais',
        title: 'Criação de Sites Institucionais',
        price: 'A partir de Kz 350.000',
        shortDescription: 'Desenvolvemos websites rápidos, seguros e otimizados para converter visitantes em clientes.',
        longDescription: 'O seu site é a sua montra digital 24/7. Criamos websites institucionais com um design moderno e responsivo, garantindo uma experiência perfeita em qualquer dispositivo. A nossa prioridade é a performance e a segurança. Todos os sites são construídos com as melhores práticas de SEO técnico, um painel de gestão de conteúdo intuitivo (CMS) e otimizados para carregar em tempo recorde, fatores cruciais para um bom posicionamento no Google e para a satisfação do utilizador.',
        mainImage: 'images/servicos/websites.jpg',
        gallery: [ 'images/servicos/site-galeria-1.jpg', 'images/servicos/site-galeria-2.jpg', 'images/servicos/site-galeria-3.jpg' ],
        relatedNews: [
            { title: 'Porque é que o seu negócio precisa de um blog?', url: '#' },
            { title: 'Core Web Vitals: O Fator de Ranking do Google', url: '#' }
        ]
    },
    {
        id: 'apps-mobile',
        title: 'Aplicações Mobile (iOS & Android)',
        price: 'Sob Consulta',
        shortDescription: 'Leve o seu negócio para o bolso dos seus clientes com aplicações robustas e intuitivas.',
        longDescription: 'Transformamos as suas ideias em aplicações mobile de alto impacto para iOS e Android. Seja uma app para a sua loja, um serviço on-demand ou uma ferramenta interna para a sua equipa, nós cobrimos todo o ciclo de vida do projeto: estratégia, design UI/UX, desenvolvimento (nativo ou híbrido), testes rigorosos e publicação nas lojas App Store e Google Play.',
        mainImage: 'images/servicos/apps-mobile.jpg',
        gallery: [ 'images/servicos/app-galeria-1.jpg', 'images/servicos/app-galeria-2.jpg', 'images/servicos/app-galeria-3.jpg' ],
        relatedNews: [
            { title: 'Nativo vs. Híbrido: Qual a melhor abordagem para a sua app?', url: '#' },
            { title: 'O Futuro das Apps é a Personalização', url: '#' }
        ]
    },
    {
        id: 'sistemas-web',
        title: 'Sistemas Web Complexos',
        price: 'Sob Consulta',
        shortDescription: 'Automatize processos e otimize a gestão com um sistema web feito à sua medida.',
        longDescription: 'Para além de um site público, muitas empresas precisam de ferramentas internas para funcionar de forma eficiente. Desenvolvemos sistemas web à medida, como plataformas de gestão de clientes (CRM), sistemas de agendamento, portais de e-learning ou qualquer outra solução que o seu negócio necessite para automatizar tarefas, centralizar dados e aumentar a produtividade da sua equipa.',
        mainImage: 'images/servicos/sistemas-web.jpg',
        gallery: [ 'images/servicos/sw-galeria-1.jpg', 'images/servicos/sw-galeria-2.jpg', 'images/servicos/sw-galeria-3.jpg' ],
        relatedNews: [
            { title: 'Como um CRM pode transformar as suas vendas', url: '#' },
            { title: 'A importância da Segurança em Aplicações Web', url: '#' }
        ]
    },
    {
        id: 'hospedagem-web',
        title: 'Hospedagem Web Gerida',
        price: 'A partir de Kz 15.000/mês',
        shortDescription: 'Garanta que o seu site está sempre online, rápido e seguro com o nosso suporte especializado.',
        longDescription: 'Não se preocupe com os detalhes técnicos. A nossa hospedagem gerida é a solução perfeita para quem quer paz de espírito. Nós cuidamos de tudo: configuração do servidor, atualizações de segurança, backups diários automáticos e otimização de performance. Se surgir algum problema, o nosso suporte técnico especializado está pronto para ajudar, garantindo o máximo de tempo online para o seu site.',
        mainImage: 'images/servicos/hospedagem-web.jpg',
        gallery: [ 'images/servicos/hw-galeria-1.jpg', 'images/servicos/hw-galeria-2.jpg', 'images/servicos/hw-galeria-3.jpg' ],
        relatedNews: [
            { title: 'A importância de ter um Certificado SSL no seu site', url: '#' },
            { title: 'Porque é que a velocidade do site afeta as suas vendas', url: '#' }
        ]
    },
    {
        id: 'hospedagem-vps',
        title: 'Hospedagem VPS',
        price: 'A partir de Kz 45.000/mês',
        shortDescription: 'O poder e a flexibilidade de um servidor dedicado para projetos de alto tráfego.',
        longDescription: 'Quando o seu projeto cresce, ele precisa de mais recursos. Um Servidor Virtual Privado (VPS) oferece um ambiente isolado com recursos de CPU, RAM e armazenamento dedicados. É a solução ideal para lojas e-commerce com muitos produtos, sistemas web com muitos utilizadores ou qualquer aplicação que exija alta performance e escalabilidade, dando-lhe o poder de crescer sem limitações.',
        mainImage: 'images/servicos/hospedagem-vps.jpg',
        gallery: [ 'images/servicos/vps-galeria-1.jpg', 'images/servicos/vps-galeria-2.jpg', 'images/servicos/vps-galeria-3.jpg' ],
        relatedNews: [
            { title: 'Quando é a hora de mudar de uma hospedagem partilhada para um VPS?', url: '#' },
            { title: 'Como otimizar a performance do seu servidor VPS', url: '#' }
        ]
    }
];