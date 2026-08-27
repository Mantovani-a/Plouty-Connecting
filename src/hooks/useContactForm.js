import { useState } from 'react';

const INITIAL_STATE = {
  nome: '',
  email: '',
  assunto: 'suporte',
  mensagem: ''
};

export const validateNome = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Informe seu nome completo.';
  const words = trimmed.split(/\s+/);
  if (words.length < 2) {
    return 'Informe nome e sobrenome.';
  }
  for (let word of words) {
    if (word.length < 2) {
      return 'Revise o nome informado.';
    }
  }
  return '';
};

export const validateEmail = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Informe seu e-mail.';
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return 'Digite um e-mail válido.';
  }
  return '';
};

export const validateMensagem = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Escreva uma mensagem.';
  if (trimmed.length > 500) return 'A mensagem ultrapassou o limite de 500 caracteres.';
  return '';
};

export function useContactForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [validatedFields, setValidatedFields] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (field, value) => {
    if (field === 'nome') return validateNome(value);
    if (field === 'email') return validateEmail(value);
    if (field === 'mensagem') return validateMensagem(value);
    return '';
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSuccess(false);

    if (field === 'assunto') {
      setValidatedFields((prev) => ({ ...prev, assunto: true }));
    }

    if (validatedFields[field] || errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    const value = formData[field] ?? '';
    setValidatedFields((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(false);

    const nomeErr = validateNome(formData.nome);
    const emailErr = validateEmail(formData.email);
    const msgErr = validateMensagem(formData.mensagem);

    if (nomeErr || emailErr || msgErr) {
      setValidatedFields({ nome: true, email: true, mensagem: true });
      setErrors({
        nome: nomeErr,
        email: emailErr,
        mensagem: msgErr
      });
      return;
    }

    setErrors({});
    setValidatedFields({});
    setIsSuccess(true);
    setFormData(INITIAL_STATE);
  };

  return {
    formData,
    errors,
    validatedFields,
    isSuccess,
    handleChange,
    handleBlur,
    handleSubmit
  };
}
