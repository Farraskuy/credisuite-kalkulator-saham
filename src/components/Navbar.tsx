'use client';

import Link from 'next/link';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          <div className="brand-icon">
            <TrendingUp size={22} />
          </div>
          <span>Kalkulator Saham</span>
        </Link>

        <nav className="nav-links">
          <a href="#ara-arb" className="nav-link">
            ARA / ARB
          </a>
          <a href="#avg-up-down" className="nav-link">
            Average Up/Down
          </a>
          <a href="#prediction" className="nav-link">
            Target Jual/Beli
          </a>
        </nav>

        <div className="nav-controls">
          <ThemeToggle />
          <Link href="/login" className="admin-link-btn">
            <ShieldCheck size={16} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
