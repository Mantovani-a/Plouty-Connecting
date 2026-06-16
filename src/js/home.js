document.addEventListener('DOMContentLoaded', () => {
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

    const interestButtons = document.querySelectorAll('.btn-interesse');
    interestButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orgName = btn.dataset.org || 'o comprador';
            showToast(`Interesse registrado! A Plouty conectou você com ${orgName}.`);
        });
    });

    const btnPublicar = document.getElementById('btn-publicar-demanda');
    const textareaDemanda = document.getElementById('textarea-demanda');

    if (btnPublicar && textareaDemanda) {
        btnPublicar.addEventListener('click', () => {
            const text = textareaDemanda.value.trim();
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
