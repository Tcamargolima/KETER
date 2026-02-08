// ================================================
// KINDNESS TREE - Visual Impact Component
// ================================================
// Growing tree visualization based on micro-acts completed

import React from 'react';
import { Sprout, TreeDeciduous, Sparkles } from 'lucide-react';

export const KindnessTree = ({ totalMicroAtos = 0 }) => {
  // Calculate tree growth stage based on total micro-acts
  const getTreeStage = (total) => {
    if (total === 0) return 0; // Empty ground
    if (total < 7) return 1;   // Seed/Sprout
    if (total < 21) return 2;  // Small tree
    if (total < 50) return 3;  // Medium tree
    if (total < 100) return 4; // Large tree
    return 5;                  // Magnificent tree
  };

  const stage = getTreeStage(totalMicroAtos);
  
  const stageInfo = [
    { 
      icon: '🌱', 
      label: 'Plante a Primeira Semente', 
      color: 'from-gray-300 to-gray-400',
      message: 'Comece sua jornada de bondade!'
    },
    { 
      icon: '🌱', 
      label: 'Semente Germinando', 
      color: 'from-green-300 to-green-400',
      message: 'Seus primeiros passos de bondade!'
    },
    { 
      icon: '🌿', 
      label: 'Broto Crescendo', 
      color: 'from-green-400 to-green-500',
      message: 'Sua bondade está crescendo!'
    },
    { 
      icon: '🌳', 
      label: 'Árvore Jovem', 
      color: 'from-green-500 to-emerald-600',
      message: 'Uma bela árvore está surgindo!'
    },
    { 
      icon: '🌳', 
      label: 'Árvore Robusta', 
      color: 'from-emerald-600 to-green-700',
      message: 'Sua bondade inspira outros!'
    },
    { 
      icon: '🌳', 
      label: 'Árvore da Vida', 
      color: 'from-green-600 to-emerald-800',
      message: 'Você é uma fonte de luz e bondade!'
    }
  ];

  const currentStage = stageInfo[stage];
  const progressToNext = stage < 5 ? calculateProgress(totalMicroAtos, stage) : 100;
  const nextMilestone = getNextMilestone(stage);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Árvore da Bondade</h3>
        <Sparkles className="text-amber-500" size={24} />
      </div>

      {/* Tree Visualization */}
      <div className="flex flex-col items-center mb-6">
        <div 
          className={`
            w-32 h-32 rounded-full flex items-center justify-center text-6xl 
            bg-gradient-to-br ${currentStage.color} shadow-lg mb-4
            transition-all duration-500 hover:scale-110
          `}
        >
          {currentStage.icon}
        </div>
        
        <h4 className="text-lg font-bold text-gray-900 mb-1">
          {currentStage.label}
        </h4>
        <p className="text-sm text-gray-600 text-center mb-4">
          {currentStage.message}
        </p>

        {/* Counter */}
        <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
          <TreeDeciduous className="text-green-600" size={20} />
          <span className="text-2xl font-bold text-gray-900">{totalMicroAtos}</span>
          <span className="text-gray-600">atos realizados</span>
        </div>
      </div>

      {/* Progress to Next Stage */}
      {stage < 5 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Próximo estágio
            </span>
            <span className="text-sm font-semibold text-green-600">
              {totalMicroAtos} / {nextMilestone}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Faltam {nextMilestone - totalMicroAtos} atos para o próximo nível
          </p>
        </div>
      )}

      {/* Achievement Message */}
      {stage === 5 && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 text-white">
          <p className="text-center font-semibold">
            🎉 Você alcançou o nível máximo! Continue espalhando bondade pelo mundo! 🌟
          </p>
        </div>
      )}
    </div>
  );
};

// Helper functions
function calculateProgress(total, stage) {
  const milestones = [0, 7, 21, 50, 100];
  const currentMilestone = milestones[stage];
  const nextMilestone = milestones[stage + 1];
  
  if (!nextMilestone) return 100;
  
  const progress = ((total - currentMilestone) / (nextMilestone - currentMilestone)) * 100;
  return Math.min(100, Math.max(0, progress));
}

function getNextMilestone(stage) {
  const milestones = [0, 7, 21, 50, 100];
  return milestones[stage + 1] || 100;
}

export default KindnessTree;
