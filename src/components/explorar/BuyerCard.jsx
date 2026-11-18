import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import ConnectionAction from '../network/ConnectionAction';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function BuyerCard({ buyer, onOpenMessages }) {
  const { profile } = useWorkspace();
  return <article className="buyer-card card">
    <Link to={`/perfil/${buyer.id}`} className="profile-avatar-link" aria-label={`Ver perfil de ${buyer.name}`}>
      <Avatar initials={buyer.initials} alt="" />
    </Link>
    <div><span className="eyebrow">Comprador institucional</span><h2><Link to={`/perfil/${buyer.id}`} className="profile-inline-link">{buyer.name}</Link></h2>
      <p>{buyer.role} · {buyer.location}</p><p>{buyer.description}</p>
      <small>Produtos de interesse: {buyer.products.join(', ')}</small>
      <div className="buyer-card-actions">{profile?.id === buyer.id ? <Link to={`/perfil/${buyer.id}`} className="btn btn-primary">Meu perfil</Link> : <>
        <ConnectionAction targetId={buyer.id} showSecondary={false} />
        <button type="button" className="btn btn-secondary" onClick={() => onOpenMessages?.(buyer.id)}>Enviar mensagem</button></>}</div>
    </div>
  </article>;
}
