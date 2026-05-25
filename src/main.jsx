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
  CircleAlert,
  Clock3,
  Eye,
  Flame,
  GitBranch,
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

const conceptNodes = [
  {
    id: 'innovation',
    label: 'Innovation',
    chapter: 'Ch. 1',
    icon: Sparkles,
    position: [-2.15, 1.2, 0],
    color: '#5bd8ff',
    summary: 'An idea, practice, or object perceived as new by the adopting unit.',
    lesson: 'Newness lives in the user. AI may feel obvious to leadership and still feel foreign to frontline teams.',
    aiMove: 'Translate AI into the exact work each team already cares about.'
  },
  {
    id: 'attributes',
    label: 'Five Attributes',
    chapter: 'Ch. 6',
    icon: Eye,
    position: [0, 1.7, -0.5],
    color: '#f7c948',
    summary: 'Relative advantage, compatibility, complexity, trialability, and observability shape adoption speed.',
    lesson: 'People adopt what feels better, fits their world, is simple enough, can be tried, and produces visible proof.',
    aiMove: 'Make AI visibly useful, low-risk, workflow-native, and easy to explain.'
  },
  {
    id: 'decision',
    label: 'Decision Journey',
    chapter: 'Ch. 5',
    icon: GitBranch,
    position: [2.05, 1.05, 0],
    color: '#7df2a0',
    summary: 'Adoption moves through knowledge, persuasion, decision, implementation, and confirmation.',
    lesson: 'Resistance often means the person is stuck in a specific stage, not that they hate the innovation.',
    aiMove: 'Match the intervention to the stage: clarity, trust, safe trial, support, reinforcement.'
  },
  {
    id: 'networks',
    label: 'Peer Networks',
    chapter: 'Ch. 8',
    icon: Network,
    position: [-1.42, -0.34, 1.28],
    color: '#b69cff',
    summary: 'Diffusion travels through trusted interpersonal networks and opinion leaders.',
    lesson: 'The most innovative person is not always the best messenger. Credible near-peers move the majority.',
    aiMove: 'Find advice-seeking hubs and make respected operators the proof carriers.'
  },
  {
    id: 'agents',
    label: 'Change Agents',
    chapter: 'Ch. 9',
    icon: Users,
    position: [1.42, -0.42, 1.18],
    color: '#ff8f70',
    summary: 'Change agents bridge the innovation source and the client system.',
    lesson: 'Good change agents diagnose needs, translate meaning, support trials, and reduce dependence over time.',
    aiMove: 'Give AI adoption owners a field job: remove friction, broker trust, and build local capability.'
  },
  {
    id: 'organizations',
    label: 'Organizations',
    chapter: 'Ch. 10',
    icon: Building2,
    position: [0, -1.18, -0.62],
    color: '#f4f7fb',
    summary: 'Organizations adopt through authority, politics, champions, routines, and implementation work.',
    lesson: 'Adoption is the opening bell. Implementation is the fight.',
    aiMove: 'Build champion networks, local re-invention, SOP updates, and routinization rituals.'
  }
];

const chapters = [
  ['1', 'Elements', 'Innovation, channels, time, social system. Useful is not enough.'],
  ['2', 'Research Traditions', 'Diffusion is a cross-domain toolkit that itself diffused.'],
  ['3', 'Critique', 'Avoid pro-innovation bias and individual-blame bias.'],
  ['4', 'Generation', 'Innovations are shaped through problem recognition and development.'],
  ['5', 'Decision Process', 'Knowledge, persuasion, decision, implementation, confirmation.'],
  ['6', 'Attributes', 'Advantage, fit, simplicity, trial, visibility.'],
  ['7', 'Adopter Categories', 'Innovators to laggards; timing is not morality.'],
  ['8', 'Networks', 'Opinion leaders and critical mass accelerate spread.'],
  ['9', 'Change Agents', 'Trusted bridges beat distant announcements.'],
  ['10', 'Organizations', 'Adoption must be implemented, clarified, and routinized.'],
  ['11', 'Consequences', 'Ask who benefits, who pays, and what changes after.']
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
        <sphereGeometry args={[selected ? 0.24 : 0.18, 32, 32]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={selected ? 0.7 : 0.25} />
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
  const rings = useMemo(() => [1.1, 1.75, 2.4, 3.05], []);
  return (
    <Canvas camera={{ position: [0, 0.55, 6.9], fov: 40 }}>
      <color attach="background" args={['#080b10']} />
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 4, 5]} intensity={14} color="#bdefff" />
      <pointLight position={[-3, -2, 2]} intensity={7} color="#f7c948" />
      <Suspense fallback={null}>
        <group rotation={[0.15, -0.18, 0]} scale={0.92}>
          {rings.map((r, index) => (
            <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.006 + index * 0.002, 96, 8]} />
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
      <OrbitControls enablePan={false} minDistance={4.2} maxDistance={8} autoRotate autoRotateSpeed={0.32} />
    </Canvas>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="metric">
      <Icon size={16} aria-hidden="true" />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Lever({ id, label, value, onChange }) {
  return (
    <label className="lever" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(id, Number(event.target.value))}
      />
      <strong>{value}</strong>
    </label>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState('attributes');
  const [levers, setLevers] = useState(leverDefaults);
  const selectedNode = conceptNodes.find((node) => node.id === selectedId);
  const SelectedIcon = selectedNode.icon;
  const score = adoptionScore(levers);

  const updateLever = (id, value) => setLevers((current) => ({ ...current, [id]: value }));

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="eyebrow"><Zap size={14} aria-hidden="true" /> Diffusion Forge</p>
          <h1 id="app-title">Learn the book. Forge rapid AI adoption.</h1>
          <p>
            A visual lab for Rogers' diffusion model, built around one conviction:
            the first company to make AI normal work gains a compounding advantage before the rest of the market crosses over.
          </p>
        </div>
        <div className="hero-actions" aria-label="Primary learning actions">
          <a className="button primary" href="#field"><Play size={16} aria-hidden="true" /> Start lab</a>
          <a className="button secondary" href="#company"><Building2 size={16} aria-hidden="true" /> Company playbook</a>
        </div>
      </section>

      <section id="field" className="studio-grid">
        <aside className="chapter-rail" aria-label="Book chapter map">
          <div className="section-heading">
            <BookOpen size={18} aria-hidden="true" />
            <div>
              <span>Book map</span>
              <strong>11 chapters</strong>
            </div>
          </div>
          <div className="chapter-list">
            {chapters.map(([number, title, summary]) => (
              <article key={number} className="chapter-card">
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{summary}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>

        <section className="viewport-panel" aria-label="Interactive diffusion field">
          <div className="panel-topline">
            <div>
              <span>Social system model</span>
              <strong>{adoptionLabel(score)}</strong>
            </div>
            <button className="icon-button" onClick={() => setLevers(leverDefaults)} aria-label="Reset adoption levers">
              <RotateCcw size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="canvas-wrap">
            <DiffusionField selectedId={selectedId} onSelect={setSelectedId} score={score} />
          </div>
          <div className="metrics-row">
            <Metric icon={Target} label="Adoption force" value={`${score}%`} />
            <Metric icon={Network} label="Network state" value={adoptionLabel(score)} />
            <Metric icon={Clock3} label="Goal" value="routinize" />
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Selected concept details">
          <div className="section-heading">
            <SelectedIcon size={18} aria-hidden="true" />
            <div>
              <span>{selectedNode.chapter}</span>
              <strong>{selectedNode.label}</strong>
            </div>
          </div>
          <p className="summary">{selectedNode.summary}</p>
          <div className="insight-block">
            <span>Book lesson</span>
            <p>{selectedNode.lesson}</p>
          </div>
          <div className="insight-block accent">
            <span>AI adoption move</span>
            <p>{selectedNode.aiMove}</p>
          </div>
          <div className="concept-buttons">
            {conceptNodes.map((node) => (
              <button
                key={node.id}
                className={node.id === selectedId ? 'is-active' : ''}
                onClick={() => setSelectedId(node.id)}
              >
                {node.label}
              </button>
            ))}
          </div>
          <div className="empty-state" aria-live="polite">
            <strong>No concept selected?</strong>
            <p>Choose a node in the field or a concept button to inspect the adoption move.</p>
          </div>
        </aside>
      </section>

      <section className="simulator-panel" aria-labelledby="sim-title">
        <div className="section-heading">
          <BrainCircuit size={18} aria-hidden="true" />
          <div>
            <span>Adoption simulator</span>
            <strong id="sim-title">Move the levers Rogers gives us</strong>
          </div>
        </div>
        <div className="simulator-grid">
          <div className="levers">
            <Lever id="advantage" label="Relative advantage" value={levers.advantage} onChange={updateLever} />
            <Lever id="compatibility" label="Workflow compatibility" value={levers.compatibility} onChange={updateLever} />
            <Lever id="trial" label="Low-risk trialability" value={levers.trial} onChange={updateLever} />
            <Lever id="visibility" label="Observable wins" value={levers.visibility} onChange={updateLever} />
            <Lever id="champions" label="Trusted champions" value={levers.champions} onChange={updateLever} />
          </div>
          <div className="score-card">
            <span>Predicted diffusion state</span>
            <strong>{score}%</strong>
            <p>{adoptionLabel(score)}</p>
            <div className="score-bar" aria-hidden="true">
              <i style={{ width: `${score}%` }} />
            </div>
            <p>
              Push the system past pilot energy by increasing visible proof and trusted peer carriers.
              That is the bridge from executive excitement to company-wide AI behavior.
            </p>
          </div>
        </div>
      </section>

      <section id="company" className="company-grid" aria-labelledby="company-title">
        <div className="company-thesis">
          <p className="eyebrow"><Flame size={14} aria-hidden="true" /> First company past advantage</p>
          <h2 id="company-title">The AI adoption race is a diffusion race.</h2>
          <p>
            The companies that normalize AI first will not merely save time. They will learn faster, compound capability,
            redesign workflows, and pull away while slower firms are still debating permission.
          </p>
          <p>
            The message from the book is not blind speed. It is engineered speed: meaning, trust, safe trials, peer proof,
            champion networks, local re-invention, and routinization.
          </p>
        </div>
        <div className="playbook">
          {[
            ['1', 'Build dense champion cells', 'Recruit credible insiders in each workflow, not just executives.'],
            ['2', 'Make wins visible weekly', 'Publish concrete before-and-after proof from real teams.'],
            ['3', 'Lower trial risk', 'Start with reversible, human-reviewed workflows.'],
            ['4', 'Let teams re-invent', 'Standardize guardrails while local teams adapt templates and routines.'],
            ['5', 'Routinize fast', 'Move adoption into SOPs, onboarding, dashboards, and manager rituals.']
          ].map(([number, title, body]) => (
            <article key={number} className="play-card">
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-grid" aria-label="Learning tools">
        <article className="tool-card">
          <CheckCircle2 size={18} aria-hidden="true" />
          <strong>Recall hook</strong>
          <p>Diffusion is how social systems metabolize novelty.</p>
        </article>
        <article className="tool-card">
          <CircleAlert size={18} aria-hidden="true" />
          <strong>Failure warning</strong>
          <p>Access is not adoption. Training is not routinization.</p>
        </article>
        <article className="tool-card">
          <ShieldCheck size={18} aria-hidden="true" />
          <strong>Responsible speed</strong>
          <p>Move fast by designing trust, review, and safe boundaries into the workflow.</p>
        </article>
        <article className="tool-card">
          <ArrowRight size={18} aria-hidden="true" />
          <strong>Next action</strong>
          <p>Pick one workflow, one champion cell, one visible proof loop, and one 30-day routinization target.</p>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
