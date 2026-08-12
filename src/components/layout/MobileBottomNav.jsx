import React from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_NAV_ITEMS } from '../../data/navigationData';

export default function MobileBottomNav() {
  return (
    <div className="mobile-bottom-nav">
      {MAIN_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <i className={`bi ${item.icon}`}></i>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
