import { useState, useEffect, useCallback } from 'react';

const FASES_CONFIG = [
    { phase: 'init', unlocks: [] },
    { phase: 'loading', unlocks: ['data'] },
    { phase: 'phase1', unlocks: ['phase2'], duration: 5000 },
    { phase: 'phase2', unlocks: ['phase3'], duration: 5000 },
    { phase: 'done', unlocks: ['completed'] },
];

const useFaseTransicao = () => {
    const [currentPhase, setCurrentPhase] = useState(FASES_CONFIG[0]);
    const [progress, setProgress] = useState(0);
    const [animationsViewed, setAnimationsViewed] = useState({});

    const loadCurrentData = useCallback(() => {
        // Load data for the current phase
        console.log(`Loading data for phase: ${currentPhase.phase}`);
    }, [currentPhase]);

    const markAnimationAsViewed = (phase) => {
        setAnimationsViewed((prev) => ({ ...prev, [phase]: true }));
    };

    const addFeedback = useCallback((feedback) => {
        console.log(`Feedback for phase ${currentPhase.phase}:`, feedback);
    }, [currentPhase]);

    const calculateVisualProgress = (duration) => {
        // Calculate visual progress based on the current phase duration
        setProgress((prev) => Math.min(prev + (100 / duration), 100));
    };

    const getUnlocks = () => {
        return currentPhase.unlocks;
    };

    const subscribeToRealTimeUpdates = () => {
        // Subscribe to real-time updates (this could be through WebSocket, for example)
        console.log(`Subscribing to updates for phase: ${currentPhase.phase}`);
    };

    useEffect(() => {
        loadCurrentData();
        subscribeToRealTimeUpdates();

        // Start phase transitions
        const currentIndex = FASES_CONFIG.findIndex(f => f.phase === currentPhase.phase);
        const nextPhaseIndex = currentIndex + 1;
        if (nextPhaseIndex < FASES_CONFIG.length) {
            const duration = FASES_CONFIG[currentIndex].duration || 1000;
            const timeout = setTimeout(() => {
                setCurrentPhase(FASES_CONFIG[nextPhaseIndex]);
                markAnimationAsViewed(currentPhase.phase);
                calculateVisualProgress(duration);
            }, duration);

            return () => clearTimeout(timeout);
        }
    }, [currentPhase, loadCurrentData, markAnimationAsViewed, calculateVisualProgress]);

    return { currentPhase, progress, getUnlocks, addFeedback, animationsViewed };  
};

export default useFaseTransicao;
