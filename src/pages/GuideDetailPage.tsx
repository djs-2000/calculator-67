import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { fetchProtectedCatalog, clearStoredAccessSession } from '../lib/api';
import { supabase } from '../lib/supabase';
import { type GuideCategory, type GuideItem } from '../guides/types';
import { mergeDefaultEmbeddedModules } from '../guides/defaultEmbeddedModules';
import { GuidesAccessGate } from '../guides/GuidesAccessGate';
import { GridPathCanvas } from '../guides/interactive/GridPathCanvas';
import { MatrixMergeBoard } from '../guides/interactive/MatrixMergeBoard';
import { ReflectionCanvas } from '../guides/interactive/ReflectionCanvas';
import { DeductionGrid } from '../guides/interactive/DeductionGrid';

interface GuideDetailPageProps {
  slug: string;
  backendConfigured: boolean;
  onNavigate: (to: string) => void;
  onAuthChange?: (authorized: boolean) => void;
}

interface AcademicSupplement {
  courseAlignment: string;
  objectives: string[];
  formulas: Array<{ label: string; expression: string; note: string }>;
  methodology: string;
  questions: string[];
}

function getAcademicSupplement(slug: string): AcademicSupplement {
  if (slug === 'polytrack-kinematics') {
    return {
      courseAlignment:
        'AP Physics 1 (Circular Motion & Energy) · Multivariable Calculus (Parametric Splines)',
      objectives: [
        'Analyze how centripetal acceleration (a_c = v² / r) constrains maximum tangential speed along variable-radius curves.',
        'Observe banked-surface normal-force components and static friction thresholds during rapid directional transitions.',
        'Evaluate optimal geometric trajectory paths (minimum curvature pathing) to minimize elapsed phase time.',
      ],
      formulas: [
        {
          label: 'Centripetal Force Requirement',
          expression: 'F_c = (m · v²) / r',
          note: 'Smaller curve radii require proportionally lower entry velocity to maintain lateral traction.',
        },
        {
          label: 'Ideal Banked Curve Angle',
          expression: 'tan(θ) = v² / (r · g)',
          note: 'Eliminates lateral friction dependency at the critical equilibrium speed v = √(r · g · tan θ).',
        },
        {
          label: 'Parametric Curvature',
          expression: 'κ(t) = |r′(t) × r″(t)| / |r′(t)|³',
          note: 'Measures instantaneous turning intensity along piecewise cubic track segments.',
        },
      ],
      methodology:
        'During this laboratory simulation, inspect each elevated loop, crest, and hairpin segment as a piecewise-smooth parametric curve r(t). Notice how late-apex braking reduces kinetic energy prior to high-curvature transitions, allowing sustained acceleration out of the tangent point while conserving angular stability.',
      questions: [
        'Explain why widening the effective radius of turn entry reduces peak lateral acceleration even when forward velocity increases.',
        'Identify where gravitational potential energy (mgh) converts into translational kinetic energy (½mv²) across vertical track drops.',
        'Compare two distinct path trajectories through a 180-degree curve and record which yields a superior elapsed benchmark.',
      ],
    };
  }

  if (slug === 'retrobowl-kinematics') {
    return {
      courseAlignment:
        'Algebra II (Quadratic Modeling) · AP Physics 1 (2D Kinematics) · AP Statistics (Expected Value)',
      objectives: [
        'Model two-dimensional parabolic trajectories under uniform vertical gravitational acceleration and variable horizontal release velocities.',
        'Calculate real-time linear intercept points between a moving receiver vector and a projectile flight path.',
        'Apply expected-value decision theory and clock-interval budgeting across finite four-trial conversion sequences.',
      ],
      formulas: [
        {
          label: 'Vertical Displacement',
          expression: 'y(t) = y₀ + (v₀ · sin θ)t − ½ · g · t²',
          note: 'Determines flight duration and apex height for a parabolic release angle θ.',
        },
        {
          label: 'Horizontal Range',
          expression: 'R = (v₀² · sin 2θ) / g',
          note: 'Relates launch magnitude and angle to downfield spatial reach.',
        },
        {
          label: 'Expected Value Optimization',
          expression: 'E[X] = Σ pᵢ · xᵢ',
          note: 'Balances high-probability short-interval gains against low-probability long-range variance.',
        },
      ],
      methodology:
        'Treat each offensive sequence as a stochastic optimization problem constrained by discrete spatial thresholds (10-unit intervals) and bounded time intervals. Before releasing each pass vector, estimate the receiver’s future displacement x_r(t) = x₀ + v_r·t so projectile arrival coincides with the predicted coordinate.',
      questions: [
        'How does increasing launch elevation change total hang time t_flight and increase vulnerability to lateral defender convergence?',
        'Given two high-percentage 6-unit routes versus one low-probability 25-unit route, compute the break-even probability required for equal expected value.',
        'Describe how discrete interval budgeting influences risk tolerance when remaining clock time drops below 30 seconds.',
      ],
    };
  }

  if (slug === 'drivemad-kinematics') {
    return {
      courseAlignment:
        'AP Physics 1 (Rotational Torque, Center of Mass & Impulse) · Applied Mechanical Engineering',
      objectives: [
        'Analyze rigid-body pitch equilibrium (Στ = I · α) as drive-wheel torque counters gravitational tipping moments across inclined surfaces and vertical steps.',
        'Observe suspension impulse absorption (J = ∫ F dt = Δp) and elastic rebound dynamics upon impact with uneven terrain.',
        'Balance front-axle and rear-axle normal force distribution (N_f + N_r = m · g · cos θ) to maintain static friction traction without exceeding rotational stability thresholds.',
      ],
      formulas: [
        {
          label: 'Rotational Torque & Angular Acceleration',
          expression: 'τ = r × F = I · α',
          note: 'Excessive axle torque on steep climbs rotates the chassis backward around the rear contact point.',
        },
        {
          label: 'Static Traction Limit',
          expression: 'f_s,max = μ_s · N',
          note: 'Maximum horizontal drive force depends on normal reaction force and wheel-surface friction coefficient.',
        },
        {
          label: 'Linear Impulse-Momentum Theorem',
          expression: 'J = ∫ F_net dt = m · Δv',
          note: 'Suspension compression lengthens impact duration Δt to reduce peak structural impulse forces.',
        },
        {
          label: 'Pitch Stability Equilibrium',
          expression: 'Στ_com = (N_f · d_f) − (N_r · d_r) + τ_axle = 0',
          note: 'Modulating forward and reverse acceleration in mid-air shifts angular momentum to align landing angles.',
        },
      ],
      methodology:
        'Approach each obstacle course as a sequential statics and rotational-dynamics experiment. Because rigid bodies conserve angular momentum during airborne intervals, brief counter-torque adjustments before touchdown align both axles with the landing gradient, minimizing rebound impulse and preserving traction across bridges, hinges, and inclined ramps.',
      questions: [
        'Why does rapid throttle application on an upward ramp pitch the front axle upward, and how does counter-braking restore equilibrium?',
        'Use the impulse-momentum relationship (J = F_avg · Δt) to explain how landing flat across both axles lowers structural rebound compared to a single-axle impact.',
        'Identify where normal force N drops toward zero on convex crests and describe how reducing tangential velocity preserves wheel contact.',
      ],
    };
  }

  return {
    courseAlignment:
      'Algebra I–II · Discrete Mathematics · Computational Logic & Reasoning',
    objectives: [
      'Formulate invariant state rules before executing sequential transformations.',
      'Evaluate trade-offs between immediate local gains and long-term structural stability.',
      'Compare observed accuracy metrics against recorded baseline benchmarks.',
    ],
    formulas: [
      {
        label: 'State Transition Function',
        expression: 'S_{n+1} = f(S_n, u_n)',
        note: 'Each step deterministically or stochastically updates system configuration based on input u_n.',
      },
      {
        label: 'Relative Benchmark Ratio',
        expression: 'η = Accuracy / Benchmark',
        note: 'Normalizes session efficiency across successive phases.',
      },
    ],
    methodology:
      'Analyze each phase carefully by identifying boundary conditions before initiating input sequences. Record deviations from expected equilibrium states and verify how incremental adjustments propagate across the diagram.',
    questions: [
      'Which structural invariant is easiest to violate during high-speed sequences, and what early heuristic prevents failure?',
      'Summarize how dividing the problem into discrete phases improved your overall accuracy rate.',
    ],
  };
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({
  slug,
  backendConfigured,
  onNavigate,
  onAuthChange,
}) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [moduleItem, setModuleItem] = useState<GuideItem | null>(null);
  const [categoryName, setCategoryName] = useState('General');
  const [diagramRevealed, setDiagramRevealed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active || cssFullscreen);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cssFullscreen) {
        setCssFullscreen(false);
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [cssFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      setCssFullscreen(false);
      setIsFullscreen(false);
      return;
    }
    if (cssFullscreen) {
      setCssFullscreen(false);
      setIsFullscreen(false);
      return;
    }

    const target = viewportRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> | void })
      | null;
    if (target?.requestFullscreen) {
      try {
        await target.requestFullscreen();
        setIsFullscreen(true);
        return;
      } catch {
        // Fallback for browsers such as iPad Safari that restrict element fullscreen
      }
    } else if (target?.webkitRequestFullscreen) {
      try {
        await target.webkitRequestFullscreen();
        setIsFullscreen(true);
        return;
      } catch {
        // Fallback below
      }
    }

    setCssFullscreen(true);
    setIsFullscreen(true);
  }, [cssFullscreen]);

  const loadModule = useCallback(async () => {
    setChecking(true);
    try {
      const data = await fetchProtectedCatalog();
      if (!Array.isArray(data.guides) || !Array.isArray(data.categories)) {
        throw new Error('Authorization required.');
      }
      const mergedGuides = mergeDefaultEmbeddedModules(data.guides, data.categories);
      const found = mergedGuides.find((g) => g.slug === slug) ?? null;
      const cat = data.categories.find(
        (c: GuideCategory) => c.id === found?.category_id
      );
      setModuleItem(found);
      setCategoryName(cat?.name ?? 'General');
      setAuthorized(true);
      setDiagramRevealed(false);
      onAuthChange?.(true);
    } catch {
      clearStoredAccessSession();
      setModuleItem(null);
      setAuthorized(false);
      onAuthChange?.(false);
    } finally {
      setChecking(false);
    }
  }, [slug, onAuthChange]);

  const handleSignOut = useCallback(async () => {
    clearStoredAccessSession();
    if (supabase) {
      await supabase.auth.signOut().catch(() => undefined);
    }
    setModuleItem(null);
    setAuthorized(false);
    onAuthChange?.(false);
    onNavigate('/guides');
  }, [onAuthChange, onNavigate]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  if (checking) {
    return (
      <div
        className="min-h-[50vh] flex items-center justify-center text-sm gap-2 bg-white"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading reading assignment...</span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 bg-white">
        <GuidesAccessGate
          backendConfigured={backendConfigured}
          onAuthorized={loadModule}
        />
      </div>
    );
  }

  if (!moduleItem) {
    return (
      <div
        className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 bg-white"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
      >
        <h1 className="text-xl font-normal">Module Not Found</h1>
        <p className="mt-2 text-sm leading-relaxed">
          This module entry may have been removed or archived from the curriculum index.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/guides')}
          className="mt-4 text-sm underline underline-offset-4 bg-transparent p-0 cursor-pointer"
          style={{ color: '#333333' }}
        >
          ← Return to Module Index
        </button>
      </div>
    );
  }

  const supplement = getAcademicSupplement(moduleItem.slug);

  const renderInteractiveModule = () => {
    switch (moduleItem.slug) {
      case 'grid-path':
        return <GridPathCanvas />;
      case 'powers-merge':
        return <MatrixMergeBoard />;
      case 'elastic-reflection':
        return <ReflectionCanvas />;
      case 'adjacency-deduction':
        return <DeductionGrid />;
      default:
        return (
          <p className="text-sm py-8 text-center italic">
            Interactive diagram is not registered for this module identifier.
          </p>
        );
    }
  };

  return (
    <article
      className="max-w-[800px] mx-auto px-6 py-10 bg-white space-y-8"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: '#333333',
        backgroundColor: '#ffffff',
      }}
    >
      <nav className="flex items-center justify-between gap-4 text-sm">
        <button
          type="button"
          onClick={() => onNavigate('/guides')}
          className="underline underline-offset-4 bg-transparent p-0 cursor-pointer"
          style={{ color: '#333333' }}
        >
          ← Return to Module Index
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-xs underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#555555] hover:text-[#333333]"
        >
          Sign Out
        </button>
      </nav>

      <header className="space-y-2 pb-4 border-b border-[#e0e0e0]">
        <div className="text-xs uppercase tracking-widest text-[#666666]">
          Reading Assignment · {categoryName} ·{' '}
          {moduleItem.mode === 'external'
            ? 'External Reference Module'
            : moduleItem.mode === 'embed'
              ? 'Embedded Simulation Module'
              : 'Interactive Diagram Module'}
        </div>
        <h1 className="text-3xl font-normal leading-tight text-[#333333]">
          The Role of Logic in Computational Thinking
        </h1>
        <p className="text-sm italic text-[#555555]">
          Applied Case Study: {moduleItem.title} — {moduleItem.description}
        </p>
        <p className="text-xs text-[#666666] pt-1">
          Curricular Alignment: {supplement.courseAlignment}
        </p>
      </header>

      <section className="space-y-5 text-[16px] leading-[1.8] text-[#333333]">
        <p>
          Computational thinking is the systematic formulation of problems and their
          solutions so that information-processing agents—whether human analysts or
          automated instruments—can execute them reliably. At the foundation of this
          discipline lies formal logic, which establishes explicit rules for representing
          relationships, verifying internal consistency, and deriving valid conclusions
          from stated premises. Whether a student is balancing an algebraic equation,
          constructing a geometric proof, or tracing an iterative procedure, logical
          structure determines whether a chain of reasoning holds under scrutiny. Without
          a disciplined framework for evaluating truth values, conditional branches, and
          invariant properties, complex systems quickly become unpredictable and
          difficult to verify.
        </p>

        <p>
          A central contribution of logic to computational thinking is the joint practice
          of abstraction and decomposition. Rather than confronting an intricate problem
          all at once, an analyst isolates individual state transitions, identifies
          boundary conditions, and expresses constraints in unambiguous notation.
          Deductive inference allows learners to rule out impossible configurations before
          testing candidate states, conserving both instructional time and cognitive
          effort. Similarly, inductive reasoning supports the recognition of recurring
          patterns across successive phases of an investigation. By separating essential
          structural rules from incidental surface details, logical modeling transforms
          open-ended scenarios into manageable sequences of verifiable steps.
        </p>

        <p>
          Equally important is the role of spatial and relational reasoning within
          algorithmic problem solving. Many quantitative models map abstract dependencies
          onto discrete coordinate grids, adjacency tables, or state matrices. Evaluating
          how a single local adjustment propagates through neighboring elements trains
          learners to anticipate cascading effects and preserve system invariants. In
          physics and applied mathematics, trajectory prediction, conservation principles,
          and discrete optimization rely on this exact interplay between symbolic rules
          and geometric intuition. Careful observation of intermediate metrics enables
          practitioners to refine their strategies systematically rather than relying on
          uninformed trial and error.
        </p>

        <p>
          The accompanying diagram and simulation module below illustrate how formal
          constraints govern dynamic state transitions within a bounded environment. As
          you examine the figure, pay close attention to how each local choice alters
          subsequent possibilities, how benchmark records reflect cumulative efficiency,
          and how adherence to invariant rules prevents invalid configurations. Complete
          this reading passage first, then select the subtle simulation link below to
          observe these principles in an interactive setting. Record your observations
          across each phase and compare your accuracy rate against the established
          benchmark.
        </p>
      </section>

      <section className="pt-4 border-t border-[#e0e0e0] space-y-5 text-[15px] leading-[1.75] text-[#333333]">
        <div className="space-y-2">
          <h2 className="text-lg font-normal text-[#333333]">
            Applied Quantitative Objectives &amp; Governing Equations
          </h2>
          <p className="text-sm text-[#4a4a4a] leading-relaxed">
            {supplement.methodology}
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-[#333333]">
            {supplement.objectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-widest text-[#666666]">
            Reference Formulas for Observation
          </h3>
          <div className="space-y-2.5 pl-4">
            {supplement.formulas.map((f, idx) => (
              <div key={idx} className="text-sm">
                <div className="font-bold text-[#333333]">
                  {f.label}: <span className="font-normal italic">{f.expression}</span>
                </div>
                <div className="text-xs text-[#555555]">{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-normal text-[#333333]">
            Figure 1.1: {moduleItem.title}
          </h2>
          <p className="text-sm italic text-[#555555]">
            Interactive computational diagram illustrating state transitions, accuracy rate
            tracking, and phase progression.
          </p>
        </div>

        {!diagramRevealed ? (
          <div className="py-12 px-6 bg-white text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#666666]">
              Read First
            </p>
            <h3 className="text-base font-normal text-[#333333]">
              Prerequisite Reading Verification
            </h3>
            <p className="text-sm text-[#4a4a4a] max-w-md mx-auto leading-relaxed">
              Ensure you have reviewed the reading passage and governing equations above
              before activating the interactive diagram.
            </p>
            <div className="pt-2 flex items-center justify-center gap-6">
              {moduleItem.mode === 'external' && moduleItem.external_url ? (
                <a
                  href={moduleItem.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline underline-offset-4 text-[#333333]"
                >
                  Launch Simulation ↗
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setDiagramRevealed(true)}
                  className="text-sm underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
                >
                  {moduleItem.mode === 'embed' ? 'Launch Simulation →' : 'Begin Exercise →'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white py-4">
            {moduleItem.mode === 'builtin' && renderInteractiveModule()}

            {moduleItem.mode === 'embed' && moduleItem.embed_url && (
              <div
                ref={viewportRef}
                className={
                  cssFullscreen
                    ? 'fixed inset-0 z-50 bg-white flex flex-col p-3 sm:p-4'
                    : isFullscreen
                      ? 'bg-white flex flex-col w-full h-full p-2'
                      : 'space-y-3 bg-white'
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#555555] pb-2">
                  <span>
                    Phase: Active Observation · Target Metric: Accuracy Rate vs. Benchmark
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="inline-flex items-center gap-1.5 underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#333333]"
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Exit Fullscreen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Fullscreen</span>
                        </>
                      )}
                    </button>
                    {!isFullscreen && (
                      <button
                        type="button"
                        onClick={() => setDiagramRevealed(false)}
                        className="underline underline-offset-4 bg-transparent p-0 cursor-pointer text-[#555555]"
                      >
                        Collapse Diagram
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={
                    isFullscreen || cssFullscreen
                      ? 'flex-1 w-full min-h-0 overflow-hidden bg-white'
                      : 'aspect-[16/10] w-full min-h-[480px] overflow-hidden bg-white'
                  }
                >
                  <iframe
                    src={moduleItem.embed_url}
                    title={moduleItem.title}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; pointer-lock"
                    allowFullScreen
                  />
                </div>
                {!isFullscreen && !cssFullscreen && (
                  <p className="text-xs italic text-[#555555]">
                    Figure 1.1b: Click inside the simulation viewport to focus keyboard or
                    pointer vectors.
                  </p>
                )}
              </div>
            )}

            {moduleItem.mode === 'external' && moduleItem.external_url && (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-[#4a4a4a] max-w-md mx-auto leading-relaxed">
                  This module opens an external reference simulation in a separate window.
                </p>
                <a
                  href={moduleItem.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline underline-offset-4 text-[#333333]"
                >
                  Launch Simulation ↗
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="pt-6 border-t border-[#e0e0e0] space-y-3 text-sm text-[#333333]">
        <h2 className="text-base font-normal text-[#333333]">
          Post-Simulation Analysis Prompts
        </h2>
        <ol className="list-decimal pl-6 space-y-2 leading-relaxed text-[#4a4a4a]">
          {supplement.questions.map((q, idx) => (
            <li key={idx}>{q}</li>
          ))}
        </ol>
      </section>
    </article>
  );
};
