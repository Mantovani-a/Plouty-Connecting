import React from 'react';
import ProfileSummary from '../profile/ProfileSummary';

export default function SidebarProfile() {
  return (
    <aside className="col-md-3 d-none d-md-block">
      <div className="card">
        <div className="card-body p-3">
          <ProfileSummary />
        </div>
      </div>
    </aside>
  );
}
