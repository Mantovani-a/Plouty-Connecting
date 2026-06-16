document.addEventListener('DOMContentLoaded', () => {

    const tipoSelect = document.getElementById('filtro-tipo');
    const localizacaoSelect = document.getElementById('filtro-localizacao');
    const reputacaoMinInput = document.getElementById('filtro-reputacao-min');
    const reputacaoMinValor = document.getElementById('reputacao-min-valor');
    const reputacaoMaxInput = document.getElementById('filtro-reputacao-max');
    const reputacaoMaxValor = document.getElementById('reputacao-max-valor');
    const searchInput = document.querySelector('.navbar-search-input');
    const searchForm = document.querySelector('.navbar-search-container form');

    if (reputacaoMinInput && reputacaoMinValor) {
        reputacaoMinInput.value = "0.0";
        reputacaoMinValor.textContent = "0.0";
    }
    if (reputacaoMaxInput && reputacaoMaxValor) {
        reputacaoMaxInput.value = "5.0";
        reputacaoMaxValor.textContent = "5.0";
    }

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

    if (tipoSelect) tipoSelect.addEventListener('change', filtrarProdutores);
    if (localizacaoSelect) localizacaoSelect.addEventListener('change', filtrarProdutores);

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filtrarProdutores();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', filtrarProdutores);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search');
    if (initialSearch && searchInput) {
        searchInput.value = initialSearch;
        setTimeout(() => {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    filtrarProdutores();

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

        let feedbackMsg = document.getElementById('sem-resultados');
        const feedSection = document.querySelector('section.col-md-6');

        if (matchesCount === 0) {
            if (!feedbackMsg && feedSection) {
                feedbackMsg = document.createElement('div');
                feedbackMsg.id = 'sem-resultados';
                feedbackMsg.className = 'alert border-0 text-center mt-3';
                feedbackMsg.style.backgroundColor = 'rgba(74, 124, 89, 0.1)';
                feedbackMsg.style.color = 'var(--cor-verde-claro)';
                feedbackMsg.style.borderLeft = '4px solid var(--cor-verde-claro)';
                feedbackMsg.style.borderRadius = '4px';
                feedbackMsg.style.animation = 'fadeInUp 0.4s ease-out';
                feedbackMsg.innerHTML = `
                    <i class="bi bi-info-circle fs-4 d-block mb-2 text-brand-success"></i>
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

    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('btn-outline-primary');
            btn.classList.toggle('btn-primary');
            
            const isLiked = btn.classList.contains('btn-primary');
            let likes = parseInt(btn.dataset.likes);
            
            if (isLiked) {
                likes += 1;
                btn.innerHTML = '<i class="bi bi-heart-fill me-1 text-white animate__animated animate__heartBeat"></i> Curtido';
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

    document.querySelectorAll('.btn-comentar').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('A seção de comentários estará disponível em breve!');
        });
    });

    document.querySelectorAll('.btn-contato').forEach(btn => {
        btn.addEventListener('click', () => {
            const nomeProdutor = btn.dataset.nome;
            showToast(`Notificação enviada para ${nomeProdutor}. Retorno via e-mail!`);
        });
    });

    function showToast(message) {
        const oldToast = document.querySelector('.custom-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `<i class="bi bi-info-circle-fill text-brand-success me-1"></i> <span>${message}</span>`;
        document.body.appendChild(toast);

        toast.offsetHeight;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }
});
