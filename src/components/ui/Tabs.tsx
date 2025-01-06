import React from 'react';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className = '', children }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={`space-y-4 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab }: any) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab, setActiveTab });
          }
          return child;
        })}
      </nav>
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }: TabsTriggerProps) {
  return (
    <button
      onClick={() => setActiveTab?.(value)}
      className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors
        ${activeTab === value
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}

export function TabsContent({ value, children, activeTab }: TabsContentProps) {
  if (value !== activeTab) return null;
  return <div className="py-6">{children}</div>;
}