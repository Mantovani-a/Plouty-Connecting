import { useState } from 'react';

const INITIAL_STATE = {
  nome: '',
  email: '',
  assunto: 'suporte',
  mensagem: ''
};

export const validateNome = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return 'O campo Nome Completo não pode ser vazio.';
  const words = trimmed.split(/\s+/);
  if (words.length < 2) {
    return 'O nome deve conter pelo menos nome e sobrenome (duas palavras).';
  }
  for (let word of words) {
    if (word.length < 2) {
      return 'Cada palavra do nome deve conter no mínimo 2 letras.';
    }
  }
  return '';
};

export const validateEmail = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return 'O campo E-mail não pode ser vazio.';
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return 'Insira um formato de e-mail válido (ex: exemplo@email.com).';
  }
  return '';
};

export const validateMensagem = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return 'O campo Mensagem não pode ser vazio.';
  if (trimmed.length > 500) return 'A mensagem ultrapassou o limite de 500 caracteres.';
  return '';
};

export function useContactForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      let err = '';
      if (field === 'nome') err = validateNome(value);
      if (field === 'email') err = validateEmail(value);
      if (field === 'mensagem') err = validateMensagem(value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field) => {
    let err = '';
    if (field === 'nome') err = validateNome(formData.nome);
    if (field === 'email') err = validateEmail(formData.email);
    if (field === 'mensagem') err = validateMensagem(formData.mensagem);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(false);

    const nomeErr = validateNome(formData.nome);
    const emailErr = validateEmail(formData.email);
    const msgErr = validateMensagem(formData.mensagem);

    if (nomeErr || emailErr || msgErr) {
      setErrors({
        nome: nomeErr,
        email: emailErr,
        mensagem: msgErr
      });
      return;
    }

    setErrors({});
    setIsSuccess(true);
    setFormData(INITIAL_STATE);
  };

  return {
    formData,
    errors,
    isSuccess,
    handleChange,
    handleBlur,
    handleSubmit
  };
}
