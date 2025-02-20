import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  math: string;
  inline?: boolean;
}

export function MathRenderer({ math, inline = false }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: !inline,
          throwOnError: false,
          errorColor: '#ff5555',
          macros: {
            '\\sin': '\\text{sin}',
            '\\cos': '\\text{cos}',
            '\\tan': '\\text{tan}',
            '\\csc': '\\text{csc}',
            '\\sec': '\\text{sec}',
            '\\cot': '\\text{cot}',
            '\\arcsin': '\\text{arcsin}',
            '\\arccos': '\\text{arccos}',
            '\\arctan': '\\text{arctan}',
            '\\sinh': '\\text{sinh}',
            '\\cosh': '\\text{cosh}',
            '\\tanh': '\\text{tanh}',
            '\\log': '\\text{log}',
            '\\ln': '\\text{ln}',
            '\\lim': '\\text{lim}',
            '\\int': '\\int\\limits',
            '\\sum': '\\sum\\limits',
            '\\prod': '\\prod\\limits',
            '\\implies': '\\Rightarrow',
            '\\iff': '\\Leftrightarrow',
            '\\given': '\\,\\vert\\,'
          }
        });

        // Remove sliders under fractions
        const fractionElements = containerRef.current.querySelectorAll('.katex .frac-line');
        fractionElements.forEach(frac => {
          const parent = frac.parentElement;
          if (parent) {
            const sliders = parent.querySelectorAll('input[type="range"]');
            sliders.forEach(slider => slider.remove());
          }
        });

      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = math;
        }
      }
    }
  }, [math, inline]);

  return (
    <span
      ref={containerRef}
      className={`${inline ? 'inline-math' : 'block-math'} ${
        inline ? 'text-sm' : 'text-base'
      }`}
      style={{
        display: inline ? 'inline-block' : 'block',
        margin: inline ? '0 0.2em' : '0.5em auto',
        textAlign: 'center',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
    />
  );
}
