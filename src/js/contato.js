document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('form-contato');
    var nomeInput = document.getElementById('nome');
    var emailInput = document.getElementById('email');
    var mensagemTextarea = document.getElementById('mensagem');
    var charCounter = document.getElementById('char-counter');
    var successBanner = document.getElementById('success-banner');

    function updateCharCounter() {
        if (!mensagemTextarea || !charCounter) return;
        var currentLength = mensagemTextarea.value.length;
        charCounter.textContent = currentLength + ' / 500 caracteres';

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

        var errorEl = document.getElementById('error-' + inputEl.id);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function clearFieldError(inputEl) {
        inputEl.classList.remove('input-error');
        inputEl.setAttribute('aria-invalid', 'false');

        var errorEl = document.getElementById('error-' + inputEl.id);
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

    function validateNome(isTyping) {
        if (isTyping === undefined) {
            isTyping = false;
        }
        var value = nomeInput.value.trim();

        if (!value) {
            if (!isTyping) showError(nomeInput, 'O campo Nome Completo não pode ser vazio.');
            return false;
        }

        var splitWords = value.split(' ');
        var words = [];
        for (var i = 0; i < splitWords.length; i++) {
            if (splitWords[i].trim() !== '') {
                words.push(splitWords[i].trim());
            }
        }

        if (words.length < 2) {
            if (!isTyping) showError(nomeInput, 'O nome deve conter pelo menos nome e sobrenome (duas palavras).');
            return false;
        }

        var hasShortWord = false;
        for (var j = 0; j < words.length; j++) {
            if (words[j].length < 2) {
                hasShortWord = true;
                break;
            }
        }

        if (hasShortWord) {
            if (!isTyping) showError(nomeInput, 'Cada palavra do nome deve conter no mínimo 2 letras.');
            return false;
        }

        clearFieldError(nomeInput);
        return true;
    }

    function validateEmail(isTyping) {
        if (isTyping === undefined) {
            isTyping = false;
        }
        var value = emailInput.value.trim();
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

    function validateMensagem(isTyping) {
        if (isTyping === undefined) {
            isTyping = false;
        }
        var value = mensagemTextarea.value.trim();

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

        var inputs = [nomeInput, emailInput, mensagemTextarea];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i]) {
                inputs[i].setAttribute('aria-invalid', 'false');
            }
        }
    }

    if (form) {
        updateCharCounter();

        nomeInput.addEventListener('blur', function() { validateNome(false); });
        emailInput.addEventListener('blur', function() { validateEmail(false); });
        mensagemTextarea.addEventListener('blur', function() { validateMensagem(false); });

        nomeInput.addEventListener('input', function() {
            handleInput(nomeInput, function() { validateNome(true); });
        });
        emailInput.addEventListener('input', function() {
            handleInput(emailInput, function() { validateEmail(true); });
        });
        mensagemTextarea.addEventListener('input', function() {
            updateCharCounter();
            handleInput(mensagemTextarea, function() { validateMensagem(true); });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (successBanner) {
                successBanner.style.display = 'none';
            }

            var isNomeValid = validateNome(false);
            var isEmailValid = validateEmail(false);
            var isMensagemValid = validateMensagem(false);

            if (isNomeValid && isEmailValid && isMensagemValid) {
                showSuccess();
            } else {
                var firstInvalid = form.querySelector('.input-error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    }
});
