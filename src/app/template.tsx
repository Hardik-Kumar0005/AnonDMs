import React from 'react';
import IntroAnimation from '@/components/IntroAnimation';

interface TemplateProps { children: React.ReactNode }

export default function Template({ children }: TemplateProps) {
  return (
    <div className="text-black text-center relative">
      <IntroAnimation />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
