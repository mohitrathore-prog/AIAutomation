import './globals.css';
import React from 'react';

export const metadata = {
  title: 'AI Content Factory - Enterprise Orchestrator',
  description: 'Production-ready content automation, generation, scheduling, and analytics platform powered by AI agents.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground transition-all duration-300">
        {children}
      </body>
    </html>
  );
}
