// Validação e micro-interações do formulário de contato da Plouty
class ContactFormValidator {
    constructor() {
        this.form = document.getElementById('form-contato');
        this.nomeInput = document.getElementById('nome');
        this.emailInput = document.getElementById('email');
        this.mensagemTextarea = document.getElementById('mensagem');
        this.charCounter = document.getElementById('char-counter');
        this.successBanner = document.getElementById('success-banner');

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.updateCharCounter();

        // Valida ao sair do campo (blur)
        this.nomeInput.addEventListener('blur', () => this.validateNome(false));
        this.emailInput.addEventListener('blur', () => this.validateEmail(false));
        this.mensagemTextarea.addEventListener('blur', () => this.validateMensagem(false));

        // Durante a digitação, limpa o erro se o campo já estava marcado como inválido
        this.nomeInput.addEventListener('input', () => this.handleInput(this.nomeInput, () => this.validateNome(true)));
        this.emailInput.addEventListener('input', () => this.handleInput(this.emailInput, () => this.validateEmail(true)));
        this.mensagemTextarea.addEventListener('input', () => {
            this.updateCharCounter();
            this.handleInput(this.mensagemTextarea, () => this.validateMensagem(true));
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    updateCharCounter() {
        if (!this.mensagemTextarea || !this.charCounter) return;
        const currentLength = this.mensagemTextarea.value.length;
        this.charCounter.textContent = `${currentLength} / 500 caracteres`;

        if (currentLength >= 500) {
            this.charCounter.classList.add('limit-reached');
            this.charCounter.setAttribute('aria-live', 'assertive');
        } else {
            this.charCounter.classList.remove('limit-reached');
            this.charCounter.setAttribute('aria-live', 'polite');
        }
    }

    showError(inputEl, message) {
        inputEl.classList.add('input-error');
        inputEl.setAttribute('aria-invalid', 'true');

        const errorEl = document.getElementById(`error-${inputEl.id}`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    clearFieldError(inputEl) {
        inputEl.classList.remove('input-error');
        inputEl.setAttribute('aria-invalid', 'false');

        const errorEl = document.getElementById(`error-${inputEl.id}`);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    }

    // Só re-valida durante a digitação se o campo já tem erro visível
    handleInput(inputEl, validationFn) {
        if (inputEl.classList.contains('input-error')) {
            validationFn();
        }
    }

    validateNome(isTyping = false) {
        const value = this.nomeInput.value.trim();

        if (!value) {
            if (!isTyping) this.showError(this.nomeInput, 'O campo Nome Completo não pode ser vazio.');
            return false;
        }

        const words = value.split(/\s+/);
        if (words.length < 2) {
            if (!isTyping) this.showError(this.nomeInput, 'O nome deve conter pelo menos nome e sobrenome (duas palavras).');
            return false;
        }

        if (words.some(word => word.length < 2)) {
            if (!isTyping) this.showError(this.nomeInput, 'Cada palavra do nome deve conter no mínimo 2 letras.');
            return false;
        }

        this.clearFieldError(this.nomeInput);
        return true;
    }

    validateEmail(isTyping = false) {
        const value = this.emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!value) {
            if (!isTyping) this.showError(this.emailInput, 'O campo E-mail não pode ser vazio.');
            return false;
        }

        if (!emailPattern.test(value)) {
            if (!isTyping) this.showError(this.emailInput, 'Insira um formato de e-mail válido (ex: exemplo@email.com).');
            return false;
        }

        this.clearFieldError(this.emailInput);
        return true;
    }

    validateMensagem(isTyping = false) {
        const value = this.mensagemTextarea.value.trim();

        if (!value) {
            if (!isTyping) this.showError(this.mensagemTextarea, 'O campo Mensagem não pode ser vazio.');
            return false;
        }

        if (value.length > 500) {
            if (!isTyping) this.showError(this.mensagemTextarea, 'A mensagem ultrapassou o limite de 500 caracteres.');
            return false;
        }

        this.clearFieldError(this.mensagemTextarea);
        return true;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.successBanner) {
            this.successBanner.style.display = 'none';
        }

        const isFormValid =
            this.validateNome(false) &
            this.validateEmail(false) &
            this.validateMensagem(false);

        if (!isFormValid) {
            const firstInvalid = this.form.querySelector('.input-error');
            if (firstInvalid) firstInvalid.focus();
        } else {
            this.showSuccess();
        }
    }

    showSuccess() {
        if (this.successBanner) {
            this.successBanner.style.display = 'block';
            this.successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        this.form.reset();
        this.updateCharCounter();

        // Reseta os estados de acessibilidade após o envio bem-sucedido
        [this.nomeInput, this.emailInput, this.mensagemTextarea].forEach(el => {
            el.setAttribute('aria-invalid', 'false');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContactFormValidator();
});
