import React, { Suspense, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  GitBranch,
  Lightbulb,
  Network,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap
} from 'lucide-react';
import './styles.css';

const lessons = [
  {
    id: 'definition',
    chapter: 'Chapter 1',
    title: 'Diffusion means ideas move through people',
    plain: 'Diffusion is how a new idea, practice, or tool spreads through communication channels over time inside a social system.',
    story: 'Boiling water was medically smart in the Peruvian village, but it failed because the meaning was wrong. Healthy people did not see boiled water as normal. The lesson is simple: a technically correct idea can still be socially wrong.',
    diagram: ['New idea', 'Trusted channel', 'Social meaning', 'Adoption or rejection'],
    remember: 'Innovation is not a feature. Innovation is a social process.',
    ai: 'Do not announce “AI transformation.” Translate AI into the language of each team: less duplicate entry, faster review, cleaner handoffs, fewer late follow-ups.',
    check: 'If people ignore a useful AI tool, what might be missing besides training?'
  },
  {
    id: 'attributes',
    chapter: 'Chapter 6',
    title: 'People adopt what feels useful, safe, visible, and easy to try',
    plain: 'Rogers says adoption speed depends on five perceived attributes: relative advantage, compatibility, complexity, trialability, and observability.',
    story: 'A tool can be powerful and still fail if it feels hard, risky, invisible, or mismatched with daily work. People adopt what they can understand, test, and see working.',
    diagram: ['Better than old way', 'Fits current work', 'Simple enough', 'Safe to try', 'Wins are visible'],
    remember: 'The user’s perception is the adoption surface.',
    ai: 'Make every AI workflow obviously better, embedded in current work, low-risk, and visible through real before-and-after examples.',
    check: 'Which one attribute is weakest in your company right now?'
  },
  {
    id: 'process',
    chapter: 'Chapter 5',
    title: 'Adoption is a journey, not a yes/no moment',
    plain: 'People move through knowledge, persuasion, decision, implementation, and confirmation. Each stage needs different help.',
    story: 'Someone who has never seen the tool needs clarity. Someone who is trying it needs support. Someone who already used it needs proof they made the right choice.',
    diagram: ['Know it exists', 'Trust it', 'Choose a trial', 'Use it in work', 'Keep using it'],
    remember: 'Different stage, different intervention.',
    ai: 'Stop giving one generic AI training to everyone. Map teams by stage, then give them the next support they actually need.',
    check: 'Is your team in knowledge, persuasion, decision, implementation, or confirmation?'
  },
  {
    id: 'networks',
    chapter: 'Chapters 7-8',
    title: 'The right messenger matters more than the loudest message',
    plain: 'Diffusion runs through peer networks. Opinion leaders make a new behavior feel normal and safe.',
    story: 'The most experimental person may be too strange for the mainstream to copy. The best messenger is usually a respected near-peer who understands the group.',
    diagram: ['Early user', 'Trusted peer', 'Small group', 'Critical mass'],
    remember: 'Map advice-seeking ties, not job titles.',
    ai: 'Build champion cells: respected operators, managers, analysts, sellers, clinicians, and engineers teaching near-peers through real examples.',
    check: 'Who do people already ask for help before changing how they work?'
  },
  {
    id: 'organizations',
    chapter: 'Chapter 10',
    title: 'Organizations do not install innovations. They negotiate them into place',
    plain: 'In organizations, adoption is only the midpoint. The hard work is implementation, adaptation, clarification, and routinization.',
    story: 'A champion keeps the idea alive through politics, friction, uncertainty, procurement, training, and workflow fit. Without champions, useful ideas die quietly.',
    diagram: ['Agenda setting', 'Champion network', 'Fit test', 'Local adaptation', 'Routine work'],
    remember: 'Adoption is the opening bell. Implementation is the fight.',
    ai: 'Treat AI rollout as an operating model: champions, workflow redesign, safe review rules, manager rituals, SOPs, and weekly proof loops.',
    check: 'Where would AI have to change your routines, not just your software?'
  },
  {
    id: 'consequences',
    chapter: 'Chapter 11',
    title: 'Fast adoption still needs judgment',
    plain: 'Innovations create consequences: intended and unintended, helpful and harmful, direct and indirect.',
    story: 'Diffusion is not automatically good. A tool can increase advantage for some people while widening gaps for others.',
    diagram: ['Who benefits?', 'Who pays?', 'What changes?', 'What breaks?', 'What must we repair?'],
    remember: 'Responsible speed beats blind speed.',
    ai: 'Move fast with guardrails: human review, clear boundaries, audit trails, role-specific training, and honest measurement of harms and wins.',
    check: 'What risk would make people slow down unless we design trust into the workflow?'
  }
];

const conceptNodes = [
  { id: 'definition', label: 'Idea moves', position: [-1.8, 1, 0], color: '#5bd8ff', icon: Sparkles },
  { id: 'attributes', label: 'Attributes', position: [0, 1.45, -0.4], color: '#f7c948', icon: Eye },
  { id: 'process', label: 'Journey', position: [1.8, 0.9, 0], color: '#7df2a0', icon: GitBranch },
  { id: 'networks', label: 'Peers', position: [-1.35, -0.45, 1.1], color: '#b69cff', icon: Network },
  { id: 'organizations', label: 'Company', position: [1.35, -0.55, 1.05], color: '#ff8f70', icon: Building2 },
  { id: 'consequences', label: 'Judgment', position: [0, -1.25, -0.6], color: '#f4f7fb', icon: ShieldCheck }
];

const leverDefaults = {
  advantage: 72,
  compatibility: 58,
  trial: 46,
  visibility: 40,
  champions: 34
};

function adoptionScore(levers) {
  const weighted =
    levers.advantage * 0.22 +
    levers.compatibility * 0.22 +
    (100 - Math.max(0, 70 - levers.trial)) * 0.16 +
    levers.visibility * 0.18 +
    levers.champions * 0.22;
  return Math.max(8, Math.min(96, Math.round(weighted)));
}

function adoptionLabel(score) {
  if (score >= 78) return 'critical mass forming';
  if (score >= 58) return 'early majority ready';
  if (score >= 38) return 'pilot energy only';
  return 'announcement theater';
}

function NodeMesh({ node, selected, onSelect }) {
  const Icon = node.icon;
  return (
    <group position={node.position} onClick={() => onSelect(node.id)}>
      <mesh>
        <sphereGeometry args={[selected ? 0.24 : 0.17, 32, 32]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={selected ? 0.72 : 0.28} />
      </mesh>
      <Html center distanceFactor={7}>
        <button className={`node-label ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(node.id)}>
          <Icon size={14} aria-hidden="true" />
          <span>{node.label}</span>
        </button>
      </Html>
    </group>
  );
}

function DiffusionField({ selectedId, onSelect, score }) {
  const rings = useMemo(() => [1.05, 1.65, 2.25, 2.85], []);
  return (
    <Canvas camera={{ position: [0, 0.55, 6.9], fov: 40 }}>
      <color attach="background" args={['#080b10']} />
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 4, 5]} intensity={14} color="#bdefff" />
      <pointLight position={[-3, -2, 2]} intensity={7} color="#f7c948" />
      <Suspense fallback={null}>
        <group rotation={[0.12, -0.16, 0]} scale={0.92}>
          {rings.map((r, index) => (
            <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.007 + index * 0.002, 96, 8]} />
              <meshStandardMaterial color={index < score / 25 ? '#5bd8ff' : '#263241'} emissive="#21384a" />
            </mesh>
          ))}
          {conceptNodes.map((node) => (
            <NodeMesh key={node.id} node={node} selected={selectedId === node.id} onSelect={onSelect} />
          ))}
          <mesh>
            <icosahedronGeometry args={[0.46, 2]} />
            <meshStandardMaterial color="#f7c948" emissive="#f7c948" emissiveIntensity={0.34} roughness={0.35} />
          </mesh>
          <Html center distanceFactor={6.8} position={[0, -0.03, 0.52]}>
            <div className="core-chip">AI age</div>
          </Html>
        </group>
      </Suspense>
      <OrbitControls enablePan={false} minDistance={4.2} maxDistance={8} autoRotate autoRotateSpeed={0.28} />
    </Canvas>
  );
}

function Lever({ id, label, value, onChange }) {
  return (
    <label className="lever" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="range" min="0" max="100" value={value} onChange={(event) => onChange(id, Number(event.target.value))} />
      <strong>{value}</strong>
    </label>
  );
}

function LearningDiagram({ steps }) {
  return (
    <div className="learning-diagram" aria-label="Lesson diagram">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="diagram-step">
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
          {index < steps.length - 1 && <ArrowRight className="diagram-arrow" size={18} aria-hidden="true" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function App() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('definition');
  const [levers, setLevers] = useState(leverDefaults);
  const lesson = lessons[lessonIndex];
  const score = adoptionScore(levers);
  const progress = Math.round(((lessonIndex + 1) / lessons.length) * 100);

  const chooseLesson = (index) => {
    setLessonIndex(index);
    setSelectedId(lessons[index].id);
  };

  const chooseNode = (id) => {
    const nextIndex = lessons.findIndex((item) => item.id === id);
    setSelectedId(id);
    if (nextIndex >= 0) setLessonIndex(nextIndex);
  };

  const updateLever = (id, value) => setLevers((current) => ({ ...current, [id]: value }));

  return (
    <main className="app-shell course-shell">
      <section className="course-hero" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="eyebrow"><Zap size={14} aria-hidden="true" /> Diffusion Forge</p>
          <h1 id="app-title">Learn the book one idea at a time.</h1>
          <p>
            A guided visual course for Rogers' <em>Diffusion of Innovations</em>. Each lesson gives you a plain-English idea,
            a real story, a diagram, a memory hook, and the exact move for rapid responsible AI adoption.
          </p>
        </div>
        <div className="hero-actions" aria-label="Primary learning actions">
          <a className="button primary" href="#lesson"><Play size={16} aria-hidden="true" /> Start lesson 1</a>
          <a className="button secondary" href="#company"><Building2 size={16} aria-hidden="true" /> AI adoption plan</a>
        </div>
      </section>

      <section className="learning-path" aria-label="Learning path">
        <div className="path-topline">
          <div>
            <span>Guided course</span>
            <strong>{progress}% through the core model</strong>
          </div>
          <div className="progress-bar" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="lesson-tabs" role="tablist" aria-label="Book lesson sequence">
          {lessons.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={index === lessonIndex}
              className={index === lessonIndex ? 'is-active' : ''}
              onClick={() => chooseLesson(index)}
            >
              <span>{index + 1}</span>
              {item.title}
            </button>
          ))}
        </div>
      </section>

      <section id="lesson" className="lesson-stage">
        <article className="lesson-card">
          <div className="lesson-kicker">
            <span>{lesson.chapter}</span>
            <strong>Lesson {lessonIndex + 1} of {lessons.length}</strong>
          </div>
          <h2>{lesson.title}</h2>
          <div className="plain-box">
            <Lightbulb size={18} aria-hidden="true" />
            <p>{lesson.plain}</p>
          </div>
          <div className="lesson-grid">
            <section>
              <h3>Real story</h3>
              <p>{lesson.story}</p>
            </section>
            <section>
              <h3>Memory hook</h3>
              <p>{lesson.remember}</p>
            </section>
          </div>
          <h3>Picture the idea</h3>
          <LearningDiagram steps={lesson.diagram} />
          <div className="ai-translation">
            <Flame size={18} aria-hidden="true" />
            <div>
              <span>Apply it to company-wide AI adoption</span>
              <p>{lesson.ai}</p>
            </div>
          </div>
          <div className="check-row">
            <div>
              <span>Check your understanding</span>
              <strong>{lesson.check}</strong>
            </div>
          </div>
          <div className="lesson-actions">
            <button className="button secondary" disabled={lessonIndex === 0} onClick={() => chooseLesson(lessonIndex - 1)}>
              <ChevronLeft size={16} aria-hidden="true" /> Previous
            </button>
            <button className="button primary" disabled={lessonIndex === lessons.length - 1} onClick={() => chooseLesson(lessonIndex + 1)}>
              Next lesson <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </article>

        <aside className="system-side" aria-label="Visual system map">
          <div className="panel-topline">
            <div>
              <span>3D memory map</span>
              <strong>{lesson.title}</strong>
            </div>
          </div>
          <div className="mini-canvas-wrap">
            <DiffusionField selectedId={selectedId} onSelect={chooseNode} score={score} />
          </div>
          <div className="side-note">
            <BookOpen size={16} aria-hidden="true" />
            <p>Click a node to jump lessons. The center is the AI age; the rings are the social system that must absorb the new behavior.</p>
          </div>
        </aside>
      </section>

      <section className="simulator-panel" aria-labelledby="sim-title">
        <div className="section-heading">
          <BrainCircuit size={18} aria-hidden="true" />
          <div>
            <span>Practice lab</span>
            <strong id="sim-title">Make adoption easier, then watch the system move</strong>
          </div>
        </div>
        <div className="simulator-grid">
          <div className="levers">
            <Lever id="advantage" label="People see a real advantage" value={levers.advantage} onChange={updateLever} />
            <Lever id="compatibility" label="It fits daily workflow" value={levers.compatibility} onChange={updateLever} />
            <Lever id="trial" label="They can try it safely" value={levers.trial} onChange={updateLever} />
            <Lever id="visibility" label="Wins are visible" value={levers.visibility} onChange={updateLever} />
            <Lever id="champions" label="Trusted peers teach it" value={levers.champions} onChange={updateLever} />
          </div>
          <div className="score-card">
            <span>Predicted diffusion state</span>
            <strong>{score}%</strong>
            <p>{adoptionLabel(score)}</p>
            <div className="score-bar" aria-hidden="true"><i style={{ width: `${score}%` }} /></div>
            <p>Rogers' lesson: adoption accelerates when uncertainty falls and trusted proof travels through the social system.</p>
            <button className="button secondary reset-button" onClick={() => setLevers(leverDefaults)}>
              <RotateCcw size={16} aria-hidden="true" /> Reset levers
            </button>
          </div>
        </div>
      </section>

      <section id="company" className="company-playbook-simple" aria-labelledby="company-title">
        <div className="company-thesis">
          <p className="eyebrow"><Flame size={14} aria-hidden="true" /> First company past advantage</p>
          <h2 id="company-title">The AI adoption race is a diffusion race.</h2>
          <p>
            The first company to make AI normal work will compound learning faster than competitors.
            The goal is not blind hype. The goal is engineered speed: trust, trials, peer proof, local adaptation, and routine use.
          </p>
        </div>
        <div className="adoption-roadmap">
          {[
            ['1', 'Pick one painful workflow', 'Start where AI removes obvious friction.'],
            ['2', 'Recruit trusted peers', 'Use respected operators as teachers, not just executives.'],
            ['3', 'Run safe trials', 'Make the first use reversible and human-reviewed.'],
            ['4', 'Show visible proof', 'Publish real before-and-after wins every week.'],
            ['5', 'Make it routine', 'Update SOPs, dashboards, onboarding, and manager rituals.']
          ].map(([number, title, body]) => (
            <article key={number} className="roadmap-card">
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-grid" aria-label="Quick recall cards">
        <article className="tool-card">
          <CheckCircle2 size={18} aria-hidden="true" />
          <strong>Book in one line</strong>
          <p>Diffusion is how social systems metabolize novelty.</p>
        </article>
        <article className="tool-card">
          <Target size={18} aria-hidden="true" />
          <strong>Adoption target</strong>
          <p>The win is not access. The win is repeated use in real work.</p>
        </article>
        <article className="tool-card">
          <Users size={18} aria-hidden="true" />
          <strong>Human lever</strong>
          <p>Trusted peers change behavior faster than distant announcements.</p>
        </article>
        <article className="tool-card">
          <ArrowRight size={18} aria-hidden="true" />
          <strong>Next move</strong>
          <p>Choose one team, one workflow, one champion cell, and one visible proof loop.</p>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
