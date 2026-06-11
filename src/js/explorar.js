document.addEventListener('DOMContentLoaded', () => {
    // Injeta os estilos do Toast dinamicamente
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .custom-toast {
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--cor-petroleo);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: var(--sombra-leve);
            z-index: 1100;
            display: flex;
            align-items: center;
            gap: 8px;
            transform: translateY(-20px);
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0;
            max-width: 360px;
            font-size: 0.9em;
            font-weight: 500;
        }
        .custom-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        .btn-like i {
            transition: transform 0.2s ease;
        }
        .btn-like:active i {
            transform: scale(1.4);
        }
        .card-produtor {
            transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, display 0.3s ease;
        }
    `;
    document.head.appendChild(toastStyles);

    // Mapeia elementos do DOM
    const tipoSelect = document.getElementById('filtro-tipo');
    const localizacaoSelect = document.getElementById('filtro-localizacao');
    const reputacaoMinInput = document.getElementById('filtro-reputacao-min');
    const reputacaoMinValor = document.getElementById('reputacao-min-valor');
    const reputacaoMaxInput = document.getElementById('filtro-reputacao-max');
    const reputacaoMaxValor = document.getElementById('reputacao-max-valor');
    const searchInput = document.querySelector('.navbar-search-input');
    const searchForm = document.querySelector('.navbar-search-container form');

    // Inicializa valores padrões para evitar o cache de formulários dos navegadores
    if (reputacaoMinInput && reputacaoMinValor) {
        reputacaoMinInput.value = "0.0";
        reputacaoMinValor.textContent = "0.0";
    }
    if (reputacaoMaxInput && reputacaoMaxValor) {
        reputacaoMaxInput.value = "5.0";
        reputacaoMaxValor.textContent = "5.0";
    }

    // Sincroniza e impede o cruzamento lógico dos sliders de reputação
    if (reputacaoMinInput && reputacaoMinValor) {
        reputacaoMinInput.addEventListener('input', (e) => {
            let minVal = parseFloat(e.target.value);
            let maxVal = reputacaoMaxInput ? parseFloat(reputacaoMaxInput.value) : 5.0;
            if (minVal > maxVal && reputacaoMaxInput && reputacaoMaxValor) {
                reputacaoMaxInput.value = minVal;
                reputacaoMaxValor.textContent = minVal.toFixed(1);
            }
            reputacaoMinValor.textContent = minVal.toFixed(1);
            filtrarProdutores();
        });
    }
    if (reputacaoMaxInput && reputacaoMaxValor) {
        reputacaoMaxInput.addEventListener('input', (e) => {
            let minVal = reputacaoMinInput ? parseFloat(reputacaoMinInput.value) : 0.0;
            let maxVal = parseFloat(e.target.value);
            if (maxVal < minVal && reputacaoMinInput && reputacaoMinValor) {
                reputacaoMinInput.value = maxVal;
                reputacaoMinValor.textContent = maxVal.toFixed(1);
            }
            reputacaoMaxValor.textContent = maxVal.toFixed(1);
            filtrarProdutores();
        });
    }

    // Registra listeners de alteração nos filtros
    if (tipoSelect) tipoSelect.addEventListener('change', filtrarProdutores);
    if (localizacaoSelect) localizacaoSelect.addEventListener('change', filtrarProdutores);

    // Filtra localmente a barra de busca e previne recarregamento de página
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filtrarProdutores();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', filtrarProdutores);
    }

    // Carrega busca prévia enviada via parâmetro de URL (?search=...)
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search');
    if (initialSearch && searchInput) {
        searchInput.value = initialSearch;
        setTimeout(() => {
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    // Executa filtragem inicial
    filtrarProdutores();

    // Filtra e exibe os cards conforme filtros selecionados
    function filtrarProdutores() {
        const tipo = tipoSelect ? tipoSelect.value : 'Todos';
        const localizacao = localizacaoSelect ? localizacaoSelect.value : 'Todas as regiões';
        const reputacaoMin = reputacaoMinInput ? parseFloat(reputacaoMinInput.value) : 0.0;
        const reputacaoMax = reputacaoMaxInput ? parseFloat(reputacaoMaxInput.value) : 5.0;
        const busca = searchInput ? searchInput.value.toLowerCase().trim() : '';

        const cards = document.querySelectorAll('.card-produtor');
        let matchesCount = 0;

        cards.forEach(card => {
            const cardTipo = card.dataset.tipo || '';
            const cardRegiao = card.dataset.regiao || '';
            const cardReputacao = parseFloat(card.dataset.reputacao) || 0;
            
            const cardText = card.textContent.toLowerCase();
            const matchBusca = !busca || cardText.includes(busca);

            let matchTipo = true;
            if (tipo !== 'Todos') {
                if (tipo === 'Verduras e Frutas') {
                    matchTipo = cardTipo.includes('verduras-frutas') || cardTipo.includes('hortifruti');
                } else if (tipo === 'Grãos e Cereais') {
                    matchTipo = cardTipo.includes('graos-cereais');
                } else if (tipo === 'Produtos Orgânicos') {
                    matchTipo = cardTipo.includes('produtos-organicos');
                }
            }

            let matchLocalizacao = true;
            if (localizacao !== 'Todas as regiões') {
                matchLocalizacao = (cardRegiao === localizacao);
            }

            const matchReputacao = (cardReputacao >= reputacaoMin && cardReputacao <= reputacaoMax);

            if (matchBusca && matchTipo && matchLocalizacao && matchReputacao) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 10);
                matchesCount++;
            } else {
                card.style.opacity = '0';
                card.style.display = 'none';
            }
        });

        // Mostra feedback se nenhum resultado corresponder
        let feedbackMsg = document.getElementById('sem-resultados');
        const feedSection = document.querySelector('section.col-md-6');

        if (matchesCount === 0) {
            if (!feedbackMsg && feedSection) {
                feedbackMsg = document.createElement('div');
                feedbackMsg.id = 'sem-resultados';
                feedbackMsg.className = 'alert alert-info text-center mt-3';
                feedbackMsg.style.animation = 'fadeInUp 0.4s ease-out';
                feedbackMsg.innerHTML = `
                    <i class="bi bi-info-circle fs-4 d-block mb-2 text-primary"></i>
                    <strong>Nenhum produtor encontrado</strong><br>
                    Tente ajustar os filtros ou redefinir a busca.
                `;
                feedSection.appendChild(feedbackMsg);
            }
        } else {
            if (feedbackMsg) {
                feedbackMsg.remove();
            }
        }
    }

    // Gerenciador de cliques em "Curtir" (Like)
    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('btn-outline-primary');
            btn.classList.toggle('btn-primary');
            
            const isLiked = btn.classList.contains('btn-primary');
            let likes = parseInt(btn.dataset.likes);
            
            if (isLiked) {
                likes += 1;
                btn.innerHTML = '<i class="bi bi-heart-fill me-1 text-danger animate__animated animate__heartBeat"></i> Curtido';
            } else {
                likes -= 1;
                btn.innerHTML = 'Curtir';
            }
            btn.dataset.likes = likes;

            const comments = btn.dataset.comments;
            const contatos = btn.dataset.contatos;
            
            const statsElem = btn.closest('.card-body').querySelector('.stats-produtor');
            if (statsElem) {
                statsElem.textContent = `${likes} curtidas • ${comments} comentários • ${contatos} contatos`;
            }
        });
    });

    // Simulação visual de Comentários
    document.querySelectorAll('.btn-comentar').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('A seção de comentários estará disponível em breve!');
        });
    });

    // Simulação visual de envio de interesse (Contato)
    document.querySelectorAll('.btn-contato').forEach(btn => {
        btn.addEventListener('click', () => {
            const nomeProdutor = btn.dataset.nome;
            showToast(`Notificação enviada para ${nomeProdutor}. Retorno via e-mail!`);
        });
    });

    // Cria e exibe notificação Toast temporária
    function showToast(message) {
        const oldToast = document.querySelector('.custom-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `<i class="bi bi-info-circle-fill text-warning me-1"></i> <span>${message}</span>`;
        document.body.appendChild(toast);

        toast.offsetHeight; // Força reflow
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }
});
