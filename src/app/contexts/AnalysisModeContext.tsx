'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AnalysisMode = 'template' | 'template-auto' | 'full-auto';

interface AnalysisModeContextType {
    mode: AnalysisMode;
    setMode: (mode: AnalysisMode) => void;
}

const AnalysisModeContext = createContext<AnalysisModeContextType | undefined>(undefined);

export function AnalysisModeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<AnalysisMode>('template');

    // Load mode from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('analysisMode') as AnalysisMode;
        if (savedMode && ['template', 'template-auto', 'full-auto'].includes(savedMode)) {
            setModeState(savedMode);
        }
    }, []);

    // Wrapper for setMode that also updates localStorage
    const setMode = (newMode: AnalysisMode) => {
        setModeState(newMode);
        localStorage.setItem('analysisMode', newMode);
    };

    return (
        <AnalysisModeContext.Provider value={{ mode, setMode }}>
            {children}
        </AnalysisModeContext.Provider>
    );
}

export function useAnalysisMode() {
    const context = useContext(AnalysisModeContext);
    if (context === undefined) {
        throw new Error('useAnalysisMode must be used within an AnalysisModeProvider');
    }
    return context;
} 