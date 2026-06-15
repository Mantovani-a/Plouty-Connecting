const form = document.getElementById('form-contato');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const mensagemTextarea = document.getElementById('mensagem');
const charCounter = document.getElementById('char-counter');
const successBanner = document.getElementById('success-banner');

function updateCharCounter() {
    if (!mensagemTextarea || !charCounter) return;
    const currentLength = mensagemTextarea.value.length;
    charCounter.textContent = `${currentLength} / 500 caracteres`;

    if (currentLength >= 500) {
        charCounter.classList.add('limit-reached');
        charCounter.setAttribute('aria-live', 'assertive');
    } else {
        charCounter.classList.remove('limit-reached');
        charCounter.setAttribute('aria-live', 'polite');
    }
}

function showError(inputEl, message) {
    inputEl.classList.add('input-error');
    inputEl.setAttribute('aria-invalid', 'true');

    const errorEl = document.getElementById(`error-${inputEl.id}`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function clearFieldError(inputEl) {
    inputEl.classList.remove('input-error');
    inputEl.setAttribute('aria-invalid', 'false');

    const errorEl = document.getElementById(`error-${inputEl.id}`);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
}

function handleInput(inputEl, validationFn) {
    if (inputEl.classList.contains('input-error')) {
        validationFn();
    }
}

function validateNome(isTyping = false) {
    const value = nomeInput.value.trim();

    if (!value) {
        if (!isTyping) showError(nomeInput, 'O campo Nome Completo não pode ser vazio.');
        return false;
    }

    const words = value.split(/\s+/);
    if (words.length < 2) {
        if (!isTyping) showError(nomeInput, 'O nome deve conter pelo menos nome e sobrenome (duas palavras).');
        return false;
    }

    if (words.some(word => word.length < 2)) {
        if (!isTyping) showError(nomeInput, 'Cada palavra do nome deve conter no mínimo 2 letras.');
        return false;
    }

    clearFieldError(nomeInput);
    return true;
}

function validateEmail(isTyping = false) {
    const value = emailInput.value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!value) {
        if (!isTyping) showError(emailInput, 'O campo E-mail não pode ser vazio.');
        return false;
    }

    if (!emailPattern.test(value)) {
        if (!isTyping) showError(emailInput, 'Insira um formato de e-mail válido (ex: exemplo@email.com).');
        return false;
    }

    clearFieldError(emailInput);
    return true;
}

function validateMensagem(isTyping = false) {
    const value = mensagemTextarea.value.trim();

    if (!value) {
        if (!isTyping) showError(mensagemTextarea, 'O campo Mensagem não pode ser vazio.');
        return false;
    }

    if (value.length > 500) {
        if (!isTyping) showError(mensagemTextarea, 'A mensagem ultrapassou o limite de 500 caracteres.');
        return false;
    }

    clearFieldError(mensagemTextarea);
    return true;
}

function showSuccess() {
    if (successBanner) {
        successBanner.style.display = 'block';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.reset();
    updateCharCounter();

    [nomeInput, emailInput, mensagemTextarea].forEach(el => {
        el.setAttribute('aria-invalid', 'false');
    });
}

if (form) {
    updateCharCounter();

    nomeInput.addEventListener('blur', () => validateNome(false));
    emailInput.addEventListener('blur', () => validateEmail(false));
    mensagemTextarea.addEventListener('blur', () => validateMensagem(false));

    nomeInput.addEventListener('input', () => handleInput(nomeInput, () => validateNome(true)));
    emailInput.addEventListener('input', () => handleInput(emailInput, () => validateEmail(true)));
    mensagemTextarea.addEventListener('input', () => {
        updateCharCounter();
        handleInput(mensagemTextarea, () => validateMensagem(true));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (successBanner) {
            successBanner.style.display = 'none';
        }

        const isNomeValid = validateNome(false);
        const isEmailValid = validateEmail(false);
        const isMensagemValid = validateMensagem(false);

        if (isNomeValid && isEmailValid && isMensagemValid) {
            showSuccess();
        } else {
            const firstInvalid = form.querySelector('.input-error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
}
