document.addEventListener('DOMContentLoaded', function() {
    var tipoSelect = document.getElementById('filtro-tipo');
    var localizacaoSelect = document.getElementById('filtro-localizacao');
    var reputacaoMinInput = document.getElementById('filtro-reputacao-min');
    var reputacaoMinValor = document.getElementById('reputacao-min-valor');
    var reputacaoMaxInput = document.getElementById('filtro-reputacao-max');
    var reputacaoMaxValor = document.getElementById('reputacao-max-valor');
    var searchInput = document.querySelector('.navbar-search-input');
    var searchForm = document.querySelector('.navbar-search-container form');
    var likeBtns = document.querySelectorAll('.btn-like');
    
    var debounceTimeout = null;

    function filtrarProdutores() {
        var tipo = tipoSelect ? tipoSelect.value : 'Todos';
        var localizacao = localizacaoSelect ? localizacaoSelect.value : 'Todas as regiões';
        var reputacaoMin = reputacaoMinInput ? parseFloat(reputacaoMinInput.value) : 0.0;
        var reputacaoMax = reputacaoMaxInput ? parseFloat(reputacaoMaxInput.value) : 5.0;
        var busca = searchInput ? searchInput.value.toLowerCase().trim() : '';

        var cards = document.querySelectorAll('.card-produtor');
        var matchesCount = 0;
        var cardsToShow = [];

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var cardTipo = card.getAttribute('data-tipo') || '';
            var cardRegiao = card.getAttribute('data-regiao') || '';
            var cardReputacao = parseFloat(card.getAttribute('data-reputacao')) || 0;
            
            var cardText = card.textContent.toLowerCase();
            var matchBusca = !busca || cardText.indexOf(busca) > -1;
            var matchTipo = tipo === 'Todos' || cardTipo.indexOf(tipo) > -1;
            var matchLocalizacao = localizacao === 'Todas as regiões' || cardRegiao === localizacao;
            var matchReputacao = cardReputacao >= reputacaoMin && cardReputacao <= reputacaoMax;

            if (matchBusca && matchTipo && matchLocalizacao && matchReputacao) {
                card.style.display = 'block';
                cardsToShow.push(card);
                matchesCount++;
            } else {
                card.style.opacity = '0';
                card.style.display = 'none';
            }
        }

        if (cardsToShow.length > 0) {
            setTimeout(function() {
                for (var j = 0; j < cardsToShow.length; j++) {
                    cardsToShow[j].style.opacity = '1';
                }
            }, 10);
        }

        gerenciarFeedbackVazio(matchesCount);
    }

    function gerenciarFeedbackVazio(matchesCount) {
        var feedbackMsg = document.getElementById('sem-resultados');
        var feedSection = document.querySelector('section.col-md-6');

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
                feedbackMsg.innerHTML = '<i class="bi bi-info-circle fs-4 d-block mb-2 text-brand-success"></i><strong>Nenhum produtor encontrado</strong><br>Tente ajustar os filtros ou redefinir a busca.';
                feedSection.appendChild(feedbackMsg);
            }
        } else {
            if (feedbackMsg && feedbackMsg.parentNode) {
                feedbackMsg.parentNode.removeChild(feedbackMsg);
            }
        }
    }

    function debouncedFiltrar() {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(function() {
            filtrarProdutores();
        }, 150);
    }

    function atualizarReputacaoMin(e) {
        var minVal = parseFloat(e.target.value);
        var maxVal = reputacaoMaxInput ? parseFloat(reputacaoMaxInput.value) : 5.0;
        if (minVal > maxVal && reputacaoMaxInput && reputacaoMaxValor) {
            reputacaoMaxInput.value = minVal;
            reputacaoMaxValor.textContent = minVal.toFixed(1);
        }
        reputacaoMinValor.textContent = minVal.toFixed(1);
        filtrarProdutores();
    }

    function atualizarReputacaoMax(e) {
        var minVal = reputacaoMinInput ? parseFloat(reputacaoMinInput.value) : 0.0;
        var maxVal = parseFloat(e.target.value);
        if (maxVal < minVal && reputacaoMinInput && reputacaoMinValor) {
            reputacaoMinInput.value = maxVal;
            reputacaoMinValor.textContent = maxVal.toFixed(1);
        }
        reputacaoMaxValor.textContent = maxVal.toFixed(1);
        filtrarProdutores();
    }

    function handleLikeClick(e) {
        var currentBtn = e.currentTarget;
        currentBtn.classList.toggle('btn-outline-primary');
        currentBtn.classList.toggle('btn-primary');
        
        var isLiked = currentBtn.classList.contains('btn-primary');
        var likes = parseInt(currentBtn.getAttribute('data-likes')) || 0;
        
        if (isLiked) {
            likes += 1;
            currentBtn.innerHTML = '<i class="bi bi-heart-fill me-1 text-white animate__animated animate__heartBeat"></i> Curtido';
        } else {
            likes -= 1;
            currentBtn.innerHTML = 'Curtir';
        }
        currentBtn.setAttribute('data-likes', likes);

        var comments = currentBtn.getAttribute('data-comments') || '0';
        var contatos = currentBtn.getAttribute('data-contatos') || '0';
        
        var statsElem = currentBtn.closest('.card-body').querySelector('.stats-produtor');
        if (statsElem) {
            statsElem.textContent = likes + ' curtidas • ' + comments + ' comentários • ' + contatos + ' contatos';
        }
    }

    function inicializarEstado() {
        if (reputacaoMinInput && reputacaoMinValor) {
            reputacaoMinInput.value = "0.0";
            reputacaoMinValor.textContent = "0.0";
        }
        if (reputacaoMaxInput && reputacaoMaxValor) {
            reputacaoMaxInput.value = "5.0";
            reputacaoMaxValor.textContent = "5.0";
        }

        var urlParams = new URLSearchParams(window.location.search);
        var initialSearch = urlParams.get('search');
        if (initialSearch && searchInput) {
            searchInput.value = initialSearch;
            setTimeout(function() {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }

        filtrarProdutores();
    }

    function registrarEventos() {
        if (reputacaoMinInput) {
            reputacaoMinInput.addEventListener('input', atualizarReputacaoMin);
        }
        if (reputacaoMaxInput) {
            reputacaoMaxInput.addEventListener('input', atualizarReputacaoMax);
        }
        if (tipoSelect) {
            tipoSelect.addEventListener('change', filtrarProdutores);
        }
        if (localizacaoSelect) {
            localizacaoSelect.addEventListener('change', filtrarProdutores);
        }
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (debounceTimeout) {
                    clearTimeout(debounceTimeout);
                }
                filtrarProdutores();
            });
        }
        if (searchInput) {
            searchInput.addEventListener('input', debouncedFiltrar);
        }
        for (var i = 0; i < likeBtns.length; i++) {
            likeBtns[i].addEventListener('click', handleLikeClick);
        }
    }

    inicializarEstado();
    registrarEventos();
});
