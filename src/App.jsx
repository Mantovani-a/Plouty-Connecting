import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ProfileDrawer from './components/layout/ProfileDrawer';

import Home from './pages/Home';
import Explorar from './pages/Explorar';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Entrar from './pages/Entrar';

function AppContent() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <Navbar onOpenProfile={() => setProfileOpen(true)} />
      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
