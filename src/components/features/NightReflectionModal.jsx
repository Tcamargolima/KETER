// ================================================
// NIGHT REFLECTION MODAL - Sistema de Reflexões Noturnas
// ================================================
// Modal com gradiente roxo-âmbar, questionário de 5 perguntas
// em formato de steps/accordion

import React, { useState } from 'react';
import { Moon, ChevronRight, ChevronLeft, X, Save, Check } from 'lucide-react';

// ================================================
// COMPONENTE PRINCIPAL
// ================================================

export const NightReflectionModal = ({ onSave, onClose, userId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    humor_dia: 5, // 1-10 slider
    padroes_linguisticos: '', // textarea
    aprendizado_praticas: '', // textarea
    micro_ato_bondade: '', // sim/não + descrição
    micro_ato_descricao: '',
    notas_livres: '' // textarea
  });

  // Definição das 5 perguntas
  const questions = [
    {
      id: 'humor_dia',
      title: '1. Como está seu humor hoje?',
      subtitle: 'De 1 a 10, como você avalia seu estado emocional',
      type: 'slider',
      required: true
    },
    {
      id: 'padroes_linguisticos',
      title: '2. Padrões Linguísticos',
      subtitle: 'Você notou padrões como vitimização, agência, gratidão em seus pensamentos?',
      type: 'textarea',
      placeholder: 'Descreva os padrões que você observou em sua linguagem interna e externa...',
      maxLength: 500,
      required: true
    },
    {
      id: 'aprendizado_praticas',
      title: '3. Aprendizado das Práticas',
      subtitle: 'O que você aprendeu com as práticas de hoje?',
      type: 'textarea',
      placeholder: 'Compartilhe seus insights e descobertas...',
      maxLength: 500,
      required: true
    },
    {
      id: 'micro_ato_bondade',
      title: '4. Micro-ato de Bondade',
      subtitle: 'Você realizou algum micro-ato de bondade hoje?',
      type: 'boolean_with_description',
      required: true
    },
    {
      id: 'notas_livres',
      title: '5. Notas Livres',
      subtitle: 'Espaço livre para suas reflexões',
      type: 'textarea',
      placeholder: 'Registre qualquer pensamento, sentimento ou observação adicional...',
      maxLength: 1000,
      required: false
    }
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const isFirstStep = currentStep === 0;

  // Validar se a pergunta atual está respondida
  const isCurrentStepValid = () => {
    const question = questions[currentStep];
    if (!question.required) return true;

    switch (question.type) {
      case 'slider':
        return answers[question.id] !== null && answers[question.id] !== undefined;
      case 'textarea':
        return answers[question.id]?.trim().length > 0;
      case 'boolean_with_description':
        return answers.micro_ato_bondade !== '';
      default:
        return true;
    }
  };

  // Atualizar resposta
  const updateAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  // Navegar entre steps
  const handleNext = () => {
    if (isCurrentStepValid() && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Submeter reflexão
  const handleSubmit = async () => {
    if (!isCurrentStepValid()) return;

    const reflexaoData = {
      ketero_id: userId,
      data: new Date().toISOString().split('T')[0],
      humor_dia: answers.humor_dia,
      padroes_linguisticos: answers.padroes_linguisticos,
      aprendizado_praticas: answers.aprendizado_praticas,
      micro_ato_realizado: answers.micro_ato_bondade === 'sim',
      micro_ato_descricao: answers.micro_ato_descricao,
      notas_livres: answers.notas_livres
    };

    await onSave(reflexaoData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900 rounded-3xl p-8 max-w-3xl w-full border border-purple-500/30 shadow-2xl my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-200 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center shadow-lg">
            <Moon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Reflexão Noturna</h2>
            <p className="text-purple-200 text-sm">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 text-sm font-medium">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-purple-200 text-sm">
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="mb-8 min-h-[300px]">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentQuestion.title}
            </h3>
            <p className="text-purple-200">
              {currentQuestion.subtitle}
            </p>
            {currentQuestion.required && (
              <span className="text-amber-400 text-sm font-medium">* Obrigatório</span>
            )}
          </div>

          {/* Render based on question type */}
          {currentQuestion.type === 'slider' && (
            <div className="space-y-6">
              <div className="relative pt-6">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={answers.humor_dia}
                  onChange={(e) => updateAnswer('humor_dia', parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-purple-300 mt-2">
                  <span>😢 Muito mal</span>
                  <span>😐 Neutro</span>
                  <span>😊 Muito bem</span>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 shadow-lg">
                  <span className="text-3xl font-bold text-white">{answers.humor_dia}</span>
                </div>
              </div>
            </div>
          )}

          {currentQuestion.type === 'textarea' && (
            <div className="space-y-2">
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                maxLength={currentQuestion.maxLength}
                rows="8"
                className="w-full bg-purple-900/30 text-white placeholder-purple-300 rounded-xl p-4 border-2 border-purple-700 focus:border-amber-500 outline-none resize-none transition-colors"
              />
              <div className="flex justify-between text-xs text-purple-300">
                <span>{currentQuestion.placeholder?.substring(0, 50)}...</span>
                <span>
                  {(answers[currentQuestion.id] || '').length}/{currentQuestion.maxLength}
                </span>
              </div>
            </div>
          )}

          {currentQuestion.type === 'boolean_with_description' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => updateAnswer('micro_ato_bondade', 'sim')}
                  className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                    answers.micro_ato_bondade === 'sim'
                      ? 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/30'
                      : 'border-purple-700 bg-purple-900/30 hover:border-purple-600'
                  }`}
                >
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-white font-semibold">Sim</div>
                  <div className="text-purple-200 text-sm">Realizei um ato de bondade</div>
                </button>
                <button
                  onClick={() => {
                    updateAnswer('micro_ato_bondade', 'nao');
                    updateAnswer('micro_ato_descricao', '');
                  }}
                  className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                    answers.micro_ato_bondade === 'nao'
                      ? 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/30'
                      : 'border-purple-700 bg-purple-900/30 hover:border-purple-600'
                  }`}
                >
                  <div className="text-4xl mb-2">❌</div>
                  <div className="text-white font-semibold">Não</div>
                  <div className="text-purple-200 text-sm">Não realizei hoje</div>
                </button>
              </div>

              {answers.micro_ato_bondade === 'sim' && (
                <div className="space-y-2 animate-fade-in">
                  <label className="block text-purple-200 text-sm font-medium">
                    Descreva o que você fez (opcional)
                  </label>
                  <textarea
                    value={answers.micro_ato_descricao || ''}
                    onChange={(e) => updateAnswer('micro_ato_descricao', e.target.value)}
                    placeholder="Ex: Ajudei um colega com um problema, fiz um elogio sincero..."
                    maxLength={300}
                    rows="4"
                    className="w-full bg-purple-900/30 text-white placeholder-purple-300 rounded-xl p-4 border-2 border-purple-700 focus:border-amber-500 outline-none resize-none transition-colors"
                  />
                  <div className="text-xs text-purple-300 text-right">
                    {(answers.micro_ato_descricao || '').length}/300
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="px-6 py-3 bg-purple-900/50 text-purple-200 rounded-xl hover:bg-purple-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="flex-1" />

          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Próxima
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/50 transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Iniciar Reflexão
            </button>
          )}
        </div>

        {/* Inspirational Quote */}
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm italic">
            "A reflexão é o começo da sabedoria."
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7 0%, #f59e0b 100%);
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7 0%, #f59e0b 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NightReflectionModal;
