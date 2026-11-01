import { LoaderCircle, LockKeyhole, SearchCheck } from 'lucide-react';
export function Button({ children, loading, loadingLabel = 'Working…', ...props }) { return <button {...props} disabled={loading || props.disabled} className={`button ${props.className || ''}`}>{loading && <LoaderCircle className="spin" size={18}/>}<span>{loading ? loadingLabel : children}</span></button>; }
export function ErrorMessage({ children }) { return children ? <div className="error">{children}</div> : null; }
export function Loading({ label = 'Opening the case file…' }) { return <div className="loading"><SearchCheck className="spin" size={30}/><p>{label}</p></div>; }
export function Stat({ label, value }) { return <div className="stat"><small>{label}</small><strong>{value}</strong></div>; }
export function SecureNote() { return <p className="secure"><LockKeyhole size={15}/> Your case is protected for this browser session.</p>; }
