import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Layout } from '../components/Layout.jsx';
import { Button, ErrorMessage, SecureNote } from '../components/UI.jsx';
import { cases, errorText } from '../services/api.js';

const levels = { easy: ['Easy', '3 suspects · 5 clues · 2 hints'], medium: ['Medium', '4 suspects · 7 clues · 3 hints'], hard: ['Hard', '5 suspects · 9 clues · 3 hints'] };

export default function Create() {
  const [premise, setPremise] = useState(''); const [difficulty, setDifficulty] = useState(''); const [language, setLanguage] = useState('en'); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const go = useNavigate();
  async function submit(event) { event.preventDefault(); if (!difficulty) return setError('Select a difficulty to open a case.'); setLoading(true); setError(''); try { const file = await cases.create({ premise, difficulty, language }); go(`/investigation/${file.caseId}`); } catch (requestError) { setError(errorText(requestError)); } finally { setLoading(false); } }
  return <Layout><section className="page-head"><p className="eyebrow">CASE INTAKE</p><h2>Create a mystery</h2><p>Choose a language, give the archivist a seed, or leave it blank for an unexpected case.</p></section><form className="case-form" onSubmit={submit}>
    <label>Case language<select value={language} onChange={event => setLanguage(event.target.value)}><option value="en">English</option><option value="hi">हिंदी</option></select></label>
    <label className="premise-label">Case premise <span>Optional · {premise.length}/500</span><textarea value={premise} onChange={event => setPremise(event.target.value)} maxLength="500" placeholder={language === 'hi' ? 'एक दुर्लभ वायलिन संगीत कार्यक्रम से पहले गायब हो जाता है…' : 'A priceless violin vanishes moments before a concert…'} /></label>
    <fieldset><legend>Investigation difficulty</legend><div className="level-grid">{Object.entries(levels).map(([id, [name, info]]) => <button type="button" onClick={() => setDifficulty(id)} className={`level ${difficulty === id ? 'selected' : ''}`} key={id}><b>{name}</b><span>{info}</span></button>)}</div></fieldset>
    <ErrorMessage>{error}</ErrorMessage><Button className="primary" loading={loading} loadingLabel="Generating your case…" type="submit"><Sparkles size={18}/> Generate mystery</Button><SecureNote />
  </form></Layout>;
}
