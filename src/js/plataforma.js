document.addEventListener('DOMContentLoaded', () => {
    const btnComoFunciona = document.getElementById('btn-como-funciona');
    const btnEntendaProblema = document.getElementById('btn-entenda-problema');
    
    const cardProdutor = document.getElementById('card-produtor');
    const cardInstituicao = document.getElementById('card-instituicao');
    const cardFomeZero = document.getElementById('card-fomezero');
    
    const secaoProblema = document.getElementById('secao-problema');
    const cardsProblema = secaoProblema ? secaoProblema.querySelectorAll('.card') : [];
    
    function highlightCards(cards, scrollToElement) {
        // Scroll to the specified element smoothly
        scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class
        cards.forEach(card => {
            card.classList.add('card-destacado');
        });
        
        // Remove highlight class after 1.8 seconds
        setTimeout(() => {
            cards.forEach(card => {
                card.classList.remove('card-destacado');
            });
        }, 1800);
    }
    
    if (btnComoFunciona && cardProdutor && cardInstituicao && cardFomeZero) {
        btnComoFunciona.addEventListener('click', () => {
            highlightCards([cardProdutor, cardInstituicao, cardFomeZero], cardProdutor);
        });
    }
    
    if (btnEntendaProblema && secaoProblema && cardsProblema.length > 0) {
        btnEntendaProblema.addEventListener('click', () => {
            highlightCards(Array.from(cardsProblema), secaoProblema);
        });
    }
});
