import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Lightbulb, Target } from 'lucide-react';
import './styles.css';

const lessons = [
  {
    short: 'Idea',
    title: 'Diffusion means ideas move through people.',
    sentence: 'A new idea spreads when people hear about it from someone they trust, try it safely, and see it become normal.',
    picture: ['Idea', 'Trusted person', 'Small trial', 'Normal work'],
    story: 'Rogers shows that a good idea can fail when it feels socially wrong. Boiling water was useful, but people did not adopt it just because it was technically correct.',
    remember: 'A good idea still needs a social path.',
    ai: 'Do not sell “AI transformation.” Pick one painful workflow and show how AI makes that familiar work easier.',
    question: 'Who do people already trust when they decide whether to change?'
  },
  {
    short: 'Why yes',
    title: 'People adopt what feels better, easy, safe, and visible.',
    sentence: 'Adoption speeds up when the new thing is clearly better, fits current work, is simple, can be tried safely, and has visible proof.',
    picture: ['Better', 'Fits', 'Easy', 'Visible proof'],
    story: 'People do not adopt the strongest idea. They adopt the idea that feels useful, understandable, low risk, and already proven by people like them.',
    remember: 'Perception is the adoption surface.',
    ai: 'Make every AI pilot show a before-and-after result in plain language: time saved, errors reduced, handoffs improved, or follow-ups caught.',
    question: 'Which one is weakest right now: better, fit, easy, trial, or proof?'
  },
  {
    short: 'Journey',
    title: 'Adoption is a journey, not a switch.',
    sentence: 'People move from knowing, to trusting, to trying, to using, to keeping the new behavior.',
    picture: ['Know', 'Trust', 'Try', 'Use'],
    story: 'A beginner needs clarity. A skeptic needs proof. A pilot user needs help. A regular user needs confirmation that the new way is worth keeping.',
    remember: 'Different stage, different help.',
    ai: 'Stop giving one generic AI training. Give demos to beginners, peer proof to skeptics, guided trials to testers, and routines to regular users.',
    question: 'Is your team trying to know, trust, try, use, or keep AI?'
  },
  {
    short: 'Peers',
    title: 'The messenger matters more than the announcement.',
    sentence: 'Diffusion moves through trusted peers faster than through executive broadcasts.',
    picture: ['Early user', 'Trusted peer', 'Team copy', 'New norm'],
    story: 'The first experimenter may be too different for everyone else to copy. The best messenger is usually a respected near-peer doing the same kind of work.',
    remember: 'Map advice ties, not job titles.',
    ai: 'Build champion cells by role: operators teach operators, managers teach managers, analysts teach analysts.',
    question: 'Who already teaches the team how work really gets done?'
  },
  {
    short: 'Company',
    title: 'Companies adopt innovation by changing routines.',
    sentence: 'Launch is not adoption. The new behavior has to fit real work until it becomes normal.',
    picture: ['Champion', 'Workflow', 'Guardrails', 'Routine'],
    story: 'Enterprise adoption needs champions, workflow redesign, local adaptation, manager rituals, policies, and repeated proof.',
    remember: 'Implementation is the real adoption work.',
    ai: 'Turn winning AI pilots into SOPs, dashboards, onboarding, manager check-ins, and weekly proof loops.',
    question: 'What routine must change before AI becomes normal work?'
  },
  {
    short: 'Judgment',
    title: 'Fast adoption still needs judgment.',
    sentence: 'Innovations create intended and unintended consequences, so speed needs trust, review, and repair.',
    picture: ['Benefit', 'Risk', 'Review', 'Repair'],
    story: 'A new tool can help one group while creating trouble for another. Diffusion is not automatically good just because it is fast.',
    remember: 'Responsible speed beats blind speed.',
    ai: 'Move fast with human review, audit trails, role-specific rules, and honest measurement of wins and harms.',
    question: 'What risk would make people resist unless trust is designed in?'
  }
];

const thesis =
  'Enterprise AI adoption accelerates when leaders treat AI as diffusion, not software rollout: one trusted peer network, one visible work win, one safe trial, and one reinforced routine at a time.';

function Picture({ steps }) {
  return (
    <ol className="picture" aria-label="Simple lesson picture">
      {steps.map((step, index) => (
        <li key={step}>
          <span>{index + 1}</span>
          <strong>{step}</strong>
        </li>
      ))}
    </ol>
  );
}

function App() {
  const [index, setIndex] = useState(0);
  const lesson = lessons[index];
  const progress = useMemo(() => `${index + 1} of ${lessons.length}`, [index]);
  const atStart = index === 0;
  const atEnd = index === lessons.length - 1;

  const goTo = (next) => {
    setIndex(Math.max(0, Math.min(lessons.length - 1, next)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="reader-shell">
      <header className="reader-top">
        <a className="brand" href="#lesson">
          <BookOpen size={22} aria-hidden="true" />
          <span>Diffusion in plain English</span>
        </a>
        <span className="progress">{progress}</span>
      </header>

      <nav className="lesson-pills" aria-label="Choose a lesson">
        {lessons.map((item, lessonIndex) => (
          <button
            key={item.short}
            type="button"
            className={lessonIndex === index ? 'active' : ''}
            onClick={() => goTo(lessonIndex)}
            aria-current={lessonIndex === index ? 'step' : undefined}
          >
            {item.short}
          </button>
        ))}
      </nav>

      <article className="lesson-reader" id="lesson">
        <p className="eyebrow">Lesson {index + 1}</p>
        <h1>{lesson.title}</h1>

        <section className="big-answer" aria-label="Plain English meaning">
          <h2>In one sentence</h2>
          <p>{lesson.sentence}</p>
        </section>

        <section className="section-block" aria-label="Simple picture">
          <h2>Picture it</h2>
          <Picture steps={lesson.picture} />
        </section>

        <section className="section-block two-column">
          <div>
            <h2>Story</h2>
            <p>{lesson.story}</p>
          </div>
          <div className="remember">
            <Lightbulb size={22} aria-hidden="true" />
            <h2>Remember</h2>
            <p>{lesson.remember}</p>
          </div>
        </section>

        <section className="ai-move">
          <Target size={22} aria-hidden="true" />
          <div>
            <h2>Use this for AI adoption</h2>
            <p>{lesson.ai}</p>
          </div>
        </section>

        <section className="question">
          <CheckCircle2 size={22} aria-hidden="true" />
          <p>{lesson.question}</p>
        </section>
      </article>

      <section className="thesis">
        <h2>The thesis</h2>
        <p>{thesis}</p>
      </section>

      <footer className="reader-actions">
        <button type="button" onClick={() => goTo(index - 1)} disabled={atStart}>
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </button>
        <button type="button" className="primary" onClick={() => goTo(index + 1)} disabled={atEnd}>
          Next lesson
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
