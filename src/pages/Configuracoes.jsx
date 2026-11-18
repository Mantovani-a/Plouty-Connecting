import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { NOTIFICATION_TYPES } from '../context/PreferencesContext';
import { usePreferences } from '../context/PreferencesContext';
import { useWorkspace } from '../context/WorkspaceContext';

const notificationLabels = {
  connections: ['Conexões', 'Solicitações e conexões aceitas'],
  likes: ['Curtidas', 'Curtidas nas suas publicações'],
  comments: ['Comentários', 'Comentários nas suas publicações'],
  proposals: ['Propostas', 'Novas propostas e decisões comerciais'],
  messages: ['Mensagens', 'Mensagens diretas recebidas']
};

export default function Configuracoes() {
  const { profile, endDemoSession } = useWorkspace();
  const { theme, setTheme } = useTheme();
  const { preferences, setMobilePreview, setNotificationPreference, restoreDemoData } = usePreferences();
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const restore = () => {
    if (restoreDemoData()) {
      setConfirmRestore(false);
      setFeedback('Dados demonstrativos restaurados. Suas preferências foram mantidas.');
    } else setFeedback('Não foi possível restaurar os dados neste navegador.');
  };

  return <main id="conteudo-principal" className="workspace-main settings-page"><div className="shell-container settings-shell">
    <header className="page-heading"><span className="eyebrow">Sua experiência na Plouty</span><h1>Configurações</h1>
      <p>Personalize a demonstração para este perfil. As preferências ficam salvas neste navegador.</p></header>
    <section className="settings-card card" aria-labelledby="account-settings-title">
      <h2 id="account-settings-title"><i className="bi bi-person-gear" aria-hidden="true" /> Conta</h2>
      <div className="settings-account"><div><strong>{profile.name}</strong><span>{profile.role} · {profile.location}</span></div>
        <Link className="btn btn-secondary btn-sm" to={`/perfil/${profile.id}`}>Ver e editar perfil</Link></div>
      <p className="settings-note">A conta é demonstrativa. Não há senha ou autenticação real nesta etapa.</p>
      <button type="button" className="settings-link" onClick={() => { endDemoSession(); navigate('/entrar'); }}>Trocar perfil demonstrativo</button>
    </section>

    <section className="settings-card card" aria-labelledby="appearance-settings-title">
      <h2 id="appearance-settings-title"><i className="bi bi-palette" aria-hidden="true" /> Aparência</h2>
      <div className="settings-row"><div><strong>Tema</strong><span>Escolha a aparência deste perfil.</span></div>
        <div className="settings-options" role="group" aria-label="Tema">
          <button type="button" aria-pressed={theme === 'light'} className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}><i className="bi bi-sun" aria-hidden="true" /> Claro</button>
          <button type="button" aria-pressed={theme === 'dark'} className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}><i className="bi bi-moon-stars" aria-hidden="true" /> Escuro</button>
        </div></div>
      <div className="settings-row"><div><strong>Visualização mobile no computador</strong>
        <span>Abra a interface completa em uma moldura de celular, sem perder o estado da página desktop.</span></div>
        <label className="settings-switch"><input type="checkbox" checked={preferences.mobilePreview}
          onChange={(event) => setMobilePreview(event.target.checked)} /><span>Ativar modo mobile</span></label></div>
    </section>

    <section className="settings-card card" aria-labelledby="notification-settings-title">
      <h2 id="notification-settings-title"><i className="bi bi-bell" aria-hidden="true" /> Notificações</h2>
      {NOTIFICATION_TYPES.map((type) => <div key={type} className="settings-row"><div>
        <strong>{notificationLabels[type][0]}</strong><span>{notificationLabels[type][1]}</span></div>
        <label className="settings-switch"><input type="checkbox" checked={preferences.notifications[type]}
          aria-label={`Receber notificações de ${notificationLabels[type][0].toLowerCase()}`}
          onChange={(event) => setNotificationPreference(type, event.target.checked)} /><span>Receber</span></label>
      </div>)}
      <Link to="/notificacoes" className="settings-link">Abrir central de notificações</Link>
    </section>

    <section className="settings-card card settings-danger" aria-labelledby="data-settings-title">
      <h2 id="data-settings-title"><i className="bi bi-arrow-counterclockwise" aria-hidden="true" /> Dados demonstrativos</h2>
      <p>Restaure publicações, conexões, demandas, propostas, mensagens, notificações e edições de perfis para o estado inicial. Suas preferências de aparência e notificações serão mantidas.</p>
      {!confirmRestore ? <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConfirmRestore(true)}>Restaurar dados demonstrativos</button>
        : <div className="settings-confirm" role="group" aria-label="Confirmar restauração de dados"><strong>Restaurar os dados deste navegador?</strong>
          <span>As alterações demonstrativas locais serão apagadas.</span><div>
            <button type="button" className="btn btn-primary btn-sm" onClick={restore}>Confirmar restauração</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConfirmRestore(false)}>Cancelar</button>
          </div></div>}
      {feedback && <p className="settings-feedback" role="status">{feedback}</p>}
    </section>
  </div></main>;
}
