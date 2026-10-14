import { Link } from '@tanstack/react-router';
import { Activity, ArrowUpRight, FlaskConical } from 'lucide-react';
import type { ReactNode } from 'react';

export function CrowdSenseShell({ children }: { children: ReactNode }) {
  return <div className="app-shell">
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="CrowdSense home"><span className="brand-mark"><Activity size={24} /></span><span>Crowd<span className="text-primary">Sense</span><span className="brand-dot">.</span></span></Link>
        <nav aria-label="Main navigation"><Link to="/" activeProps={{ className: 'nav-link active' }} inactiveProps={{ className: 'nav-link' }} activeOptions={{ exact: true }}>Overview</Link><Link to="/about" activeProps={{ className: 'nav-link active' }} inactiveProps={{ className: 'nav-link' }}>About & method <ArrowUpRight size={13} /></Link></nav>
        <span className="project-tag"><FlaskConical size={14} /> A data science project</span>
      </div>
    </header>
    {children}
    <footer className="site-footer"><span><Activity size={15} /> CrowdSense <span className="footer-divider">/</span> A clearer picture of public spaces.</span><span>Built for curiosity. Designed for better planning.</span></footer>
  </div>;
}