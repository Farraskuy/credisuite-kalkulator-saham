'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-card/85 backdrop-blur-md border-b border-border-custom transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg text-main">
            <div className="w-9 h-9 rounded-xl bg-acc-blue text-white flex items-center justify-center shadow-md shadow-acc-blue/20">
              <TrendingUp size={22} />
            </div>
            <span>Kalkulator Saham</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <a href="#ara-arb" className="text-sub hover:bg-sub-blue hover:text-acc-blue px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200">
              ARA / ARB
            </a>
            <a href="#avg-up-down" className="text-sub hover:bg-sub-blue hover:text-acc-blue px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200">
              Average Up/Down
            </a>
            <a href="#prediction" className="text-sub hover:bg-sub-blue hover:text-acc-blue px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200">
              Target Jual/Beli
            </a>
          </nav>

          {/* Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="bg-acc-blue hover:bg-acc-blue/90 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all duration-200 shadow-sm shadow-acc-blue/10">
              <ShieldCheck size={16} />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Controls & Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-main hover:bg-sub-slate transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-border-custom bg-card px-4 py-4 space-y-3 transition-all duration-300">
          <nav className="flex flex-col space-y-1">
            <a
              href="#ara-arb"
              onClick={() => setIsOpen(false)}
              className="text-sub hover:bg-sub-blue hover:text-acc-blue px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              ARA / ARB
            </a>
            <a
              href="#avg-up-down"
              onClick={() => setIsOpen(false)}
              className="text-sub hover:bg-sub-blue hover:text-acc-blue px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Average Up/Down
            </a>
            <a
              href="#prediction"
              onClick={() => setIsOpen(false)}
              className="text-sub hover:bg-sub-blue hover:text-acc-blue px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Target Jual/Beli
            </a>
          </nav>
          <div className="pt-2 border-t border-border-custom">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full bg-acc-blue hover:bg-acc-blue/90 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldCheck size={16} />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
