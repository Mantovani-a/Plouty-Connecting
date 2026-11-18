import React, { useRef } from 'react';

export default function MobilePreviewFrame({ active, initialPath, onExit, iframeRef }) {
  const source = useRef(initialPath);
  return <div className="mobile-preview-stage" hidden={!active}>
    <div className="mobile-preview-toolbar"><div><strong>Visualização mobile</strong><span>Interface de celular · 390 px</span></div>
      <button type="button" className="btn btn-secondary btn-sm" onClick={onExit}>Voltar ao computador</button></div>
    <div className="mobile-preview-device"><iframe ref={iframeRef} title="Plouty em visualização mobile" src={source.current} allowFullScreen /></div>
  </div>;
}
