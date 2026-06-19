document.addEventListener('DOMContentLoaded', function() {
    var btnComoFunciona = document.getElementById('btn-como-funciona');
    var btnEntendaProblema = document.getElementById('btn-entenda-problema');
    
    var cardProdutor = document.getElementById('card-produtor');
    var cardInstituicao = document.getElementById('card-instituicao');
    var cardFomeZero = document.getElementById('card-fomezero');
    
    var secaoProblema = document.getElementById('secao-problema');
    var cardsProblema = [];
    if (secaoProblema) {
        cardsProblema = secaoProblema.querySelectorAll('.card');
    }
    
    function highlightCards(cards, scrollToElement) {
        if (scrollToElement) {
            scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        if (!cards) return;

        for (var i = 0; i < cards.length; i++) {
            if (cards[i]) {
                cards[i].classList.add('card-destacado');
            }
        }
        
        setTimeout(function() {
            for (var j = 0; j < cards.length; j++) {
                if (cards[j]) {
                    cards[j].classList.remove('card-destacado');
                }
            }
        }, 1800);
    }
    
    if (btnComoFunciona && cardProdutor && cardInstituicao && cardFomeZero) {
        btnComoFunciona.addEventListener('click', function() {
            var cardsList = [cardProdutor, cardInstituicao, cardFomeZero];
            highlightCards(cardsList, cardProdutor);
        });
    }
    
    if (btnEntendaProblema && secaoProblema && cardsProblema.length > 0) {
        btnEntendaProblema.addEventListener('click', function() {
            highlightCards(cardsProblema, secaoProblema);
        });
    }
});
