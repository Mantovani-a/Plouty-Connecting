import React, { useEffect, useState } from 'react';

export default function Avatar({ src, initials, alt = '', className = '' }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const hasPhoto = Boolean(src) && !loadFailed;

  useEffect(() => setLoadFailed(false), [src]);

  const fallbackAccessibility = alt
    ? { role: 'img', 'aria-label': alt }
    : { 'aria-hidden': 'true' };

  return (
    <span
      className={`avatar-frame ${hasPhoto ? 'has-photo' : 'has-initials'} ${className}`.trim()}
      {...(!hasPhoto ? fallbackAccessibility : {})}
    >
      {hasPhoto
        ? <img src={src} alt={alt} onError={() => setLoadFailed(true)} />
        : <span aria-hidden="true">{initials}</span>}
    </span>
  );
}
