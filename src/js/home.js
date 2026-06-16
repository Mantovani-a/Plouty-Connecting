document.addEventListener('DOMContentLoaded', function() {
    var interestButtons = document.querySelectorAll('.btn-interesse');
    
    for (var i = 0; i < interestButtons.length; i++) {
        var btn = interestButtons[i];
        btn.addEventListener('click', function(e) {
            var currentBtn = e.currentTarget;
            var orgName = currentBtn.getAttribute('data-org');
            if (!orgName) {
                orgName = 'o comprador';
            }
            showToast('Interesse registrado! A Plouty conectou você com ' + orgName + '.');
        });
    }

    var btnPublicar = document.getElementById('btn-publicar-demanda');
    var textareaDemanda = document.getElementById('textarea-demanda');

    if (btnPublicar && textareaDemanda) {
        btnPublicar.addEventListener('click', function() {
            var text = textareaDemanda.value.trim();
            if (!text) {
                showToast('Por favor, digite o que você precisa antes de publicar.');
                textareaDemanda.focus();
                return;
            }

            showToast('Sua demanda foi publicada com sucesso e está visível para os produtores!');
            textareaDemanda.value = '';
        });
    }
});
