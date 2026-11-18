import React, { useState } from 'react';

function initialValues(profile) {
  return {
    name: profile.name,
    role: profile.role,
    location: profile.location,
    description: profile.description || '',
    about: profile.about || '',
    productsText: profile.products.join(', '),
    contactEmail: profile.contactEmail || '',
    contactPhone: profile.contactPhone || '',
    capacity: profile.capacity || ''
  };
}

function validate(values, isSupplier) {
  const errors = {};
  const trimmed = (field) => values[field].trim();
  if (trimmed('name').length < 3) errors.name = 'Informe pelo menos 3 caracteres.';
  if (trimmed('role').length < 3) errors.role = 'Descreva sua atuação em pelo menos 3 caracteres.';
  if (trimmed('location').length < 3) errors.location = 'Informe cidade e estado ou sua região.';
  if (trimmed('description').length < 20) errors.description = 'Escreva um resumo com pelo menos 20 caracteres.';
  if (trimmed('about').length < 20) errors.about = 'A apresentação precisa ter pelo menos 20 caracteres.';

  const products = values.productsText.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
  if (!products.length) errors.productsText = 'Informe ao menos um produto.';
  else if (products.length > 12) errors.productsText = 'Liste no máximo 12 produtos.';
  else if (products.some((item) => item.length < 2 || item.length > 50)) errors.productsText = 'Cada produto deve ter de 2 a 50 caracteres.';
  else if (new Set(products.map((item) => item.toLocaleLowerCase('pt-BR'))).size !== products.length) errors.productsText = 'Remova produtos repetidos.';

  if (trimmed('contactEmail') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed('contactEmail'))) {
    errors.contactEmail = 'Digite um e-mail válido.';
  }
  if (trimmed('contactPhone') && !/^\+?[\d\s()-]{8,20}$/.test(trimmed('contactPhone'))) {
    errors.contactPhone = 'Digite um telefone válido com DDD.';
  }
  if (isSupplier && trimmed('capacity').length < 3) errors.capacity = 'Informe a capacidade ou disponibilidade de fornecimento.';
  return { errors, products };
}

export default function ProfileEditor({ profile, onSave, onCancel }) {
  const [values, setValues] = useState(() => initialValues(profile));
  const [errors, setErrors] = useState({});
  const isSupplier = profile.kind !== 'buyer';

  const change = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };
  const field = (name, label, options = {}) => (
    <div className={options.wide ? 'profile-edit-field profile-edit-wide' : 'profile-edit-field'}>
      <label htmlFor={`profile-edit-${name}`}>{label}{options.required && <span aria-hidden="true"> *</span>}</label>
      {options.multiline ? (
        <textarea id={`profile-edit-${name}`} rows={options.rows || 3} maxLength={options.maxLength}
          value={values[name]} onChange={change(name)} aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `profile-edit-${name}-error` : undefined} />
      ) : (
        <input id={`profile-edit-${name}`} type={options.type || 'text'} maxLength={options.maxLength}
          value={values[name]} onChange={change(name)} aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `profile-edit-${name}-error` : undefined} />
      )}
      {options.help && <small>{options.help}</small>}
      {errors[name] && <span id={`profile-edit-${name}-error`} className="profile-edit-error" role="alert">{errors[name]}</span>}
    </div>
  );

  const submit = (event) => {
    event.preventDefault();
    const checked = validate(values, isSupplier);
    if (Object.keys(checked.errors).length) {
      setErrors(checked.errors);
      return;
    }
    onSave({
      name: values.name.trim(),
      role: values.role.trim(),
      location: values.location.trim(),
      description: values.description.trim(),
      about: values.about.trim(),
      products: checked.products,
      contactEmail: values.contactEmail.trim(),
      contactPhone: values.contactPhone.trim(),
      ...(isSupplier ? { capacity: values.capacity.trim() } : {})
    });
  };

  return (
    <section id="profile-editor" className="profile-editor card" aria-labelledby="profile-editor-title">
      <div className="profile-editor-heading">
        <div><span className="eyebrow">Meu perfil</span><h2 id="profile-editor-title">Editar informações profissionais</h2></div>
        <p>As alterações ficam neste navegador e aparecem nas áreas da demonstração.</p>
      </div>
      <form onSubmit={submit} noValidate>
        <div className="profile-edit-grid">
          {field('name', 'Nome profissional ou da instituição', { required: true, maxLength: 80 })}
          {field('role', 'Atuação profissional', { required: true, maxLength: 100 })}
          {field('location', 'Localização', { required: true, maxLength: 100 })}
          {isSupplier && field('capacity', 'Capacidade de fornecimento', { required: true, maxLength: 120, help: 'Ex.: até 300 kg por semana, sujeito à confirmação.' })}
          {field('description', 'Descrição curta', { required: true, wide: true, multiline: true, rows: 2, maxLength: 240 })}
          {field('about', 'Apresentação', { required: true, wide: true, multiline: true, rows: 4, maxLength: 1000 })}
          {field('productsText', isSupplier ? 'Produtos comercializados' : 'Produtos procurados', { required: true, wide: true, multiline: true, rows: 2, maxLength: 650, help: 'Separe os produtos por vírgula ou por linha.' })}
          {field('contactEmail', 'E-mail de contato', { type: 'email', maxLength: 120 })}
          {field('contactPhone', 'Telefone de contato', { type: 'tel', maxLength: 20 })}
        </div>
        <div className="profile-editor-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary"><i className="bi bi-check2" aria-hidden="true" /> Salvar alterações</button>
        </div>
      </form>
    </section>
  );
}
