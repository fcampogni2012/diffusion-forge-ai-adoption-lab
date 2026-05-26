import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Eye,
  Lightbulb,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from 'lucide-react';
import './styles.css';

const lessons = [
  {
    id: 'idea',
    icon: Sparkles,
    color: 'blue',
    chapter: 'Core idea',
    title: 'Diffusion means ideas move through people.',
    oneLine: 'An innovation spreads only when people talk about it, test it, trust it, and make it normal.',
    story: 'Boiling water was medically useful in Rogers\' field story, but it failed when people read it as strange or unnecessary. The problem was not the science. The problem was social meaning.',
    diagram: ['New idea', 'Trusted talk', 'Feels normal', 'Adopted'],
    remember: 'A good idea still needs a social path.',
    aiMove: 'Stop selling "AI transformation." Translate AI into one familiar work win: fewer duplicate entries, faster review, cleaner handoffs, or fewer missed follow-ups.',
    check: 'If a useful tool is ignored, what social meaning is getting in the way?'
  },
  {
    id: 'attributes',
    icon: Eye,
    color: 'gold',
    chapter: 'Why people say yes',
    title: 'People adopt what feels better, easier, safer, and visible.',
    oneLine: 'Rogers names five adoption accelerators: advantage, fit, simplicity, trial, and visible proof.',
    story: 'Power is not enough. A tool wins when people can see why it is better, where it fits, how to try it, and what proof their peers already have.',
    diagram: ['Better', 'Fits', 'Simple', 'Tryable', 'Visible'],
    remember: 'Perception is the adoption surface.',
    aiMove: 'For every AI workflow, show the before and after. Let teams try it on a low-risk task. Make peer wins visible within the same week.',
    check: 'Which adoption accelerator is weakest in your enterprise right now?'
  },
  {
    id: 'journey',
    icon: Route,
    color: 'green',
    chapter: 'Adoption journey',
    title: 'Adoption is a sequence, not a yes/no switch.',
    oneLine: 'People move from awareness to trust, trial, real use, and finally habit.',
    story: 'A beginner needs clarity. A skeptic needs proof. A pilot user needs support. A regular user needs confirmation that the new way is worth keeping.',
    diagram: ['Know', 'Trust', 'Try', 'Use', 'Keep'],
    remember: 'Different stage, different help.',
    aiMove: 'Replace generic AI training with stage-based support: demos for awareness, peer examples for trust, guided pilots for trial, office hours for use, metrics for habit.',
    check: 'Where is your team: know, trust, try, use, or keep?'
  },
  {
    id: 'networks',
    icon: Network,
    color: 'blue',
    chapter: 'Peer networks',
    title: 'The messenger matters more than the announcement.',
    oneLine: 'Diffusion travels through trusted peers, not org charts.',
    story: 'The earliest experimenter may be too different for the mainstream to copy. The best messenger is usually a respected near-peer who understands the daily work.',
    diagram: ['Pilot user', 'Trusted peer', 'Team norm', 'Critical mass'],
    remember: 'Map advice ties, not titles.',
    aiMove: 'Build champion cells by function: operators teach operators, managers teach managers, analysts teach analysts. Keep examples local and concrete.',
    check: 'Who do people already ask before changing how they work?'
  },
  {
    id: 'organization',
    icon: Building2,
    color: 'green',
    chapter: 'Inside companies',
    title: 'Companies do not install innovation. They negotiate it into routines.',
    oneLine: 'The hard part is not launch. The hard part is making the new behavior fit real work.',
    story: 'Enterprise adoption needs champions, workflow redesign, local adaptation, manager rituals, policy, and repeated proof. Otherwise useful tools die quietly.',
    diagram: ['Champion', 'Workflow fit', 'Guardrails', 'Routine'],
    remember: 'Implementation is the real adoption work.',
    aiMove: 'Treat AI rollout as an operating model: champions, workflow maps, safe review rules, weekly proof loops, and manager-owned routines.',
    check: 'Which routine must change before AI becomes normal work?'
  },
  {
    id: 'judgment',
    icon: ShieldCheck,
    color: 'gold',
    chapter: 'Consequences',
    title: 'Speed still needs judgment.',
    oneLine: 'Innovations create intended and unintended consequences, so fast adoption must include trust and repair.',
    story: 'A new tool can help one group while widening gaps for another. Diffusion is not automatically good. Responsible speed watches who benefits, who pays, and what breaks.',
    diagram: ['Benefit', 'Risk', 'Review', 'Repair'],
    remember: 'Responsible speed beats blind speed.',
    aiMove: 'Move fast with human review, audit trails, role-specific rules, clear boundaries, and honest measurement of wins and harms.',
    check: 'What risk would make people resist unless trust is designed in?'
  }
];

const thesisCards = [
  {
    icon: Target,
    title: 'Thesis',
    text: 'Enterprise AI adoption accelerates when leaders stop treating AI as software rollout and start treating it as diffusion: one trusted peer network, one visible work win, one safe trial, and one reinforced routine at a time.'
  },
  {
    icon: Users,
    title: 'Operating move',
    text: 'Create champion cells in each function. Give them small AI use cases, permissioned guardrails, and a weekly demo ritual where peers show real before-and-after work.'
  },
  {
    icon: Check,
    title: 'Scoreboard',
    text: 'Measure adoption by behavior, not attendance: repeated use, time saved, quality improved, handoffs reduced, risks caught, and teams teaching other teams.'
  }
];

function Diagram({ steps, color }) {
  return (
    <div className={`diagram diagram-${color}`} aria-label="Visual lesson map">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="diagram-node">
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
          {index < steps.length - 1 && <ArrowRight className="diagram-arrow" size={18} aria-hidden="true" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function ThesisPanel() {
  return (
    <aside className="thesis-panel" aria-label="Enterprise AI adoption thesis">
      <div className="thesis-header">
        <Building2 size={20} aria-hidden="true" />
        <div>
          <span>Enterprise use</span>
          <h2>How to adopt AI faster</h2>
        </div>
      </div>
      <div className="thesis-stack">
        {thesisCards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="thesis-card" key={card.title}>
              <Icon size={18} aria-hidden="true" />
              <div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}

function App() {
  const [index, setIndex] = useState(0);
  const [showThesis, setShowThesis] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 900px)').matches;
  });
  const lesson = lessons[index];
  const Icon = lesson.icon;
  const progress = useMemo(() => Math.round(((index + 1) / lessons.length) * 100), [index]);
  const atStart = index === 0;
  const atEnd = index === lessons.length - 1;

  const goTo = (nextIndex) => {
    setIndex(Math.max(0, Math.min(lessons.length - 1, nextIndex)));
  };

  return (
    <main className="learn-shell">
      <header className="topbar" aria-label="Course header">
        <a className="brand" href="#lesson">
          <BookOpen size={20} aria-hidden="true" />
          <span>Diffusion in 10 minutes</span>
        </a>
        <div className="progress" aria-label={`${progress}% complete`}>
          <span>{progress}%</span>
          <i><b style={{ width: `${progress}%` }} /></i>
        </div>
      </header>

      <section className="hero-strip" aria-label="Learning promise">
        <div>
          <p className="eyebrow">Light course for humans</p>
          <h1>Learn one idea. See one picture. Use it at work.</h1>
        </div>
        <button className="mini-toggle" type="button" onClick={() => setShowThesis((value) => !value)} aria-expanded={showThesis}>
          {showThesis ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          AI thesis
        </button>
      </section>

      <nav className="lesson-nav" aria-label="Lesson selector">
        {lessons.map((item, lessonIndex) => {
          const DotIcon = lessonIndex < index ? Check : Circle;
          return (
            <button
              key={item.id}
              type="button"
              className={lessonIndex === index ? 'active' : ''}
              aria-current={lessonIndex === index ? 'step' : undefined}
              onClick={() => goTo(lessonIndex)}
            >
              <DotIcon size={14} aria-hidden="true" />
              <span>{lessonIndex + 1}</span>
            </button>
          );
        })}
      </nav>

      <div className={`learning-grid ${showThesis ? '' : 'thesis-hidden'}`}>
        <section className={`lesson-card lesson-${lesson.color}`} id="lesson" aria-labelledby="lesson-title">
          <div className="lesson-meta">
            <span>{lesson.chapter}</span>
            <Icon size={22} aria-hidden="true" />
          </div>

          <div className="lesson-copy">
            <h2 id="lesson-title">{lesson.title}</h2>
            <p className="one-line">{lesson.oneLine}</p>
          </div>

          <Diagram steps={lesson.diagram} color={lesson.color} />

          <div className="lesson-columns">
            <article>
              <h3>Story</h3>
              <p>{lesson.story}</p>
            </article>
            <article className="remember">
              <Lightbulb size={18} aria-hidden="true" />
              <h3>Remember</h3>
              <p>{lesson.remember}</p>
            </article>
          </div>

          <div className="work-move">
            <span>Use this for AI adoption</span>
            <p>{lesson.aiMove}</p>
          </div>

          <footer className="card-footer">
            <button className="nav-button" type="button" onClick={() => goTo(index - 1)} disabled={atStart}>
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </button>
            <p className="check-question"><strong>Check:</strong> {lesson.check}</p>
            <button className="nav-button primary" type="button" onClick={() => goTo(index + 1)} disabled={atEnd}>
              Next
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </footer>
        </section>

        {showThesis && <ThesisPanel />}
      </div>

      <footer className="source-note">
        Built from Rogers' diffusion model, simplified with segmenting, signaling, coherence, and progressive disclosure.
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
