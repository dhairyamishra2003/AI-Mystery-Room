import { Link } from 'react-router-dom'; import { Search, ShieldCheck } from 'lucide-react';
export function Navbar() { return <nav><Link className="brand" to="/"><Search size={22}/> NOCTURNE <span>FILES</span></Link><span className="nav-note"><ShieldCheck size={15}/> Secure case archive</span></nav>; }
export function Footer() { return <footer>NOCTURNE FILES <span>·</span> Every mystery leaves a trace.</footer>; }
export function Layout({ children }) { return <><Navbar/><main>{children}</main><Footer/></>; }
