import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MessageSquareText,
  Camera,
  Cctv,
  UserCheck,
  Fingerprint,
  Clock,
  CheckSquare,
  Square
} from 'lucide-react';
import { Layout } from '../components/Layout.jsx';
import { Button, ErrorMessage, SecureNote } from '../components/UI.jsx';
import { cases, errorText } from '../services/api.js';

export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

const levels = {
  easy: ['Easy', '3 suspects · 5 clues · 2 hints'],
  medium: ['Medium', '4 suspects · 7 clues · 3 hints'],
  hard: ['Hard', '5 suspects · 9 clues · 3 hints']
};

const EVIDENCE_CATEGORIES = [
  {
    id: 'conversations',
    name: 'Conversations',
    description: 'Dialogue records and suspicious conversations.',
    icon: MessageSquareText
  },
  {
    id: 'photographs',
    name: 'Photographs',
    description: 'Images, photographs and visual evidence.',
    icon: Camera
  },
  {
    id: 'cctv_simulations',
    name: 'CCTV Simulations',
    description: 'Simulated surveillance footage and recordings.',
    icon: Cctv
  },
  {
    id: 'witness_accounts',
    name: 'Witness Accounts',
    description: 'Statements and testimonies from witnesses.',
    icon: UserCheck
  },
  {
    id: 'physical_evidence',
    name: 'Physical Evidence',
    description: 'Fingerprints, objects, documents and forensic evidence.',
    icon: Fingerprint
  },
  {
    id: 'timeline_records',
    name: 'Timeline Records',
    description: 'Events, timestamps and activity records.',
    icon: Clock
  }
];

export default function Create() {
  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedCategories, setSelectedCategories] = useState(
    EVIDENCE_CATEGORIES.map(c => c.id)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const go = useNavigate();

  const wordCount = countWords(premise);

  function toggleCategory(categoryId) {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  async function submit(event) {
    event.preventDefault();
    if (wordCount > 2000) {
      return setError('Case description cannot exceed 2,000 words.');
    }
    if (!difficulty) {
      return setError('Select a difficulty to open a case.');
    }
    if (selectedCategories.length === 0) {
      return setError('Select at least one evidence category to open a case.');
    }
    setLoading(true);
    setError('');
    try {
      const file = await cases.create({
        premise: premise.trim(),
        difficulty,
        language,
        evidenceCategories: selectedCategories
      });
      go(`/investigation/${file.caseId}`);
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="page-head">
        <p className="eyebrow">CASE INTAKE</p>
        <h2>Create a mystery</h2>
        <p>Choose a language, give the archivist a seed, or leave it blank for an unexpected case.</p>
      </section>

      <form className="case-form" onSubmit={submit}>
        {/* 1. Language Selection */}
        <label>
          Case language
          <select value={language} onChange={event => setLanguage(event.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </label>

        {/* 2. Case Description */}
        <label className="premise-label">
          Case description <span className={wordCount > 2000 ? 'counter-exceeded' : ''}>Optional · {wordCount} / 2000 words</span>
          <textarea
            value={premise}
            onChange={event => {
              setPremise(event.target.value);
              if (error && countWords(event.target.value) <= 2000) {
                setError('');
              }
            }}
            placeholder={language === 'hi' ? 'एक दुर्लभ वायलिन संगीत कार्यक्रम से पहले गायब हो जाता है…' : 'A priceless violin vanishes moments before a concert…'}
          />
        </label>

        {/* 3. Difficulty Selection */}
        <fieldset>
          <legend>Investigation difficulty</legend>
          <div className="level-grid">
            {Object.entries(levels).map(([id, [name, info]]) => (
              <button
                type="button"
                onClick={() => setDifficulty(id)}
                className={`level ${difficulty === id ? 'selected' : ''}`}
                key={id}
              >
                <b>{name}</b>
                <span>{info}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* 4. Evidence Categories Selection */}
        <fieldset className="evidence-section">
          <div className="evidence-header">
            <legend>EVIDENCE CATEGORIES</legend>
            <span className="evidence-count">
              {selectedCategories.length} SELECTED
            </span>
          </div>
          <div className="categories-grid">
            {EVIDENCE_CATEGORIES.map(cat => {
              const isSelected = selectedCategories.includes(cat.id);
              const Icon = cat.icon;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`category-item ${isSelected ? 'selected' : ''}`}
                  aria-pressed={isSelected}
                >
                  <div className="category-top">
                    <span className="category-icon">
                      <Icon size={18} />
                    </span>
                    <span className={`category-check ${isSelected ? 'checked' : ''}`}>
                      {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    </span>
                  </div>
                  <b>{cat.name}</b>
                  <span>{cat.description}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <ErrorMessage>{error}</ErrorMessage>
        <Button className="primary" loading={loading} loadingLabel="Generating your case…" type="submit">
          <Sparkles size={18} /> Generate mystery
        </Button>
        <SecureNote />
      </form>
    </Layout>
  );
}
