import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AccordionContextType {
  activePanel: string | null;
  togglePanel: (panelId: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an <Accordion>');
  }
  return context;
};

interface AccordionItemContextType {
  panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('Accordion components must be used within an <AccordionItem>');
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultActivePanel?: string | null;
}

export function Accordion({ children, defaultActivePanel = null }: AccordionProps) {
  const [activePanel, setActivePanel] = useState<string | null>(defaultActivePanel);

  const togglePanel = (panelId: string) => {
    setActivePanel((prev) => (prev === panelId ? null : panelId));
  };

  return (
    <AccordionContext.Provider value={{ activePanel, togglePanel }}>
      <div className="accordion-container">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  panelId: string;
  children: ReactNode;
}

export function AccordionItem({ panelId, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ panelId }}>
      <div className="accordion-item">
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionHeaderProps {
  children: ReactNode;
}

export function AccordionHeader({ children }: AccordionHeaderProps) {
  const { activePanel, togglePanel } = useAccordionContext();
  const { panelId } = useAccordionItemContext();
  
  const isOpen = activePanel === panelId;

  return (
    <button 
      className={`accordion-header ${isOpen ? 'active' : ''}`}
      onClick={() => togglePanel(panelId)}
      aria-expanded={isOpen}
    >
      <span className="accordion-header-title">{children}</span>
      <span className="accordion-header-icon">{isOpen ? '−' : '+'}</span>
    </button>
  );
}

interface AccordionPanelProps {
  children: ReactNode;
}

export function AccordionPanel({ children }: AccordionPanelProps) {
  const { activePanel } = useAccordionContext();
  const { panelId } = useAccordionItemContext();
  
  const isOpen = activePanel === panelId;

  if (!isOpen) return null;

  return (
    <div className="accordion-panel">
      {children}
    </div>
  );
}
