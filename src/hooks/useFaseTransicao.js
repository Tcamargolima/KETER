import { useState, useEffect, useCallback } from 'react';

// Configuration for phases
const FASES_CONFIG = ['Semente', 'Raiz', 'Tronco', 'Copa', 'Flor'];

const useFaseTransicao = () => {
    const [currentPhase, setCurrentPhase] = useState(FASES_CONFIG[0]);
    const [animationViewed, setAnimationViewed] = useState(false);
    const [feedback, setFeedback] = useState('');

    // This function loads the current phase
    const loadCurrentPhase = useCallback(() => {
        // Logic to load the current phase
        // For example, fetching from a backend...
    }, []);

    // This function verifies if the transition to the next phase is valid
    const verifyTransition = (nextPhase) => {
        const currentIndex = FASES_CONFIG.indexOf(currentPhase);
        return nextPhase === FASES_CONFIG[currentIndex + 1];
    };

    // This function marks the animation as viewed
    const markAnimationViewed = () => {
        setAnimationViewed(true);
    };

    // This function adds feedback for the transition
    const addFeedback = (newFeedback) => {
        setFeedback(newFeedback);
    };

    // This function gets the visual progress based on phases
    const getVisualProgress = () => {
        return (FASES_CONFIG.indexOf(currentPhase) / (FASES_CONFIG.length - 1)) * 100;
    };

    // This function gets unlocks based on the phase
    const getUnlocks = () => {
        // Logic to return unlocks for the current phase
    };

    // Real-time subscriptions to phase changes (example with dummy logic)
    useEffect(() => {
        const handlePhaseChange = (newPhase) => {
            if (newPhase) {
                setCurrentPhase(newPhase);
                setAnimationViewed(false);
            }
        };

        // Assume subscribeToPhaseChanges is a function that subscribes to phase changes
        const unsubscribe = subscribeToPhaseChanges(handlePhaseChange);

        // Initial load for the current phase
        loadCurrentPhase();

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [loadCurrentPhase]);

    return { currentPhase, verifyTransition, markAnimationViewed, addFeedback, getVisualProgress, getUnlocks }; 
};

export default useFaseTransicao;
