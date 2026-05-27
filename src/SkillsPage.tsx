import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SkillsPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/frontend-design.md')
      .then((res) => res.text())
      .then(setContent);
  }, []);

  return (
    <div className="skills-page">
      <header className="skills-header">
        <Link to="/" className="skills-back">&larr; Back to Board</Link>
        <h1>Frontend Design Skill</h1>
        <p className="skills-source">
          Installed from <code>anthropics/skills</code>
        </p>
      </header>
      <div className="skills-content">
        {content.split('\n').map((line, i) => {
          if (line.startsWith('---')) return null;
          if (line.startsWith('name:')) return null;
          if (line.startsWith('description:')) return null;
          if (line.startsWith('license:')) return null;
          if (line.startsWith('## ')) {
            return <h2 key={i}>{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('- **')) {
            const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
            if (match) {
              return (
                <p key={i} className="skill-item">
                  <strong>{match[1]}:</strong> {match[2]}
                </p>
              );
            }
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="skill-bullet">{line.replace('- ', '')}</li>;
          }
          if (line.trim() === '') return <br key={i} />;
          return <p key={i}>{line}</p>;
        })}
      </div>
    </div>
  );
}
