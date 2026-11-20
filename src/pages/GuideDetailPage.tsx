import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchProtectedCatalog, clearStoredAccessSession } from '../lib/api';
import { type GuideCategory, type GuideItem } from '../guides/types';
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

  const loadModule = useCallback(async () => {
    setChecking(true);
    try {
      const data = await fetchProtectedCatalog();
      if (!Array.isArray(data.guides) || !Array.isArray(data.categories)) {
        throw new Error('Authorization required.');
      }
      const found = data.guides.find((g) => g.slug === slug) ?? null;
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
      <nav className="text-sm">
        <button
          type="button"
          onClick={() => onNavigate('/guides')}
          className="underline underline-offset-4 bg-transparent p-0 cursor-pointer"
          style={{ color: '#333333' }}
        >
          ← Return to Module Index
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

      <section className="pt-6 border-t border-[#e0e0e0] space-y-4">
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
          <div className="py-12 px-6 bg-white text-center space-y-4 border border-[#e5e5e5]">
            <p className="text-xs uppercase tracking-widest text-[#666666]">
              Read First
            </p>
            <h3 className="text-base font-normal text-[#333333]">
              Prerequisite Reading Verification
            </h3>
            <p className="text-sm text-[#4a4a4a] max-w-md mx-auto leading-relaxed">
              Ensure you have reviewed the four-paragraph passage on formal logic and
              computational thinking above before activating the interactive diagram.
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
                  Begin Exercise →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white py-4">
            {moduleItem.mode === 'builtin' && renderInteractiveModule()}

            {moduleItem.mode === 'embed' && moduleItem.embed_url && (
              <div className="space-y-3">
                <div className="aspect-video w-full overflow-hidden bg-white">
                  <iframe
                    src={moduleItem.embed_url}
                    title={moduleItem.title}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs italic text-[#555555] text-right">
                  Figure 1.1b: Embedded computational module viewport.
                </p>
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
    </article>
  );
};
