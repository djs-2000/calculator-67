import React from 'react';
import { CalculatorWidget } from '../calculator/CalculatorWidget';

interface CalculatorPageProps {
  onSecretSequence?: () => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  onSecretSequence,
}) => {
  return (
    <section
      aria-label="Calculator"
      className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-10"
    >
      <CalculatorWidget onSecretSequence={onSecretSequence} />
    </section>
  );
};
