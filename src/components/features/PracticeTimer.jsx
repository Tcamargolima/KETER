import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Star, ChevronLeft } from 'lucide-react';
import { getPraticaById, completarPratica } from '../../lib/supabase';

/**
 * Custom Hook para Timer
 */
const useTimer = (duration, onComplete) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, onComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return { timeLeft, isRunning, progress, start, pause, reset };
};

/**
 * Componente PracticeTimer
 * Timer circular com instruções passo a passo
 * Carrega prática dinamicamente do Supabase
 */
const PracticeTimer = ({ praticaId, userId, onComplete, onBack }) => {
  const [pratica, setPratica] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [instrucoes, setInstrucoes] = useState([]);
  const [completado, setCompletado] = useState(false);

  // Carregar prática do Supabase
  useEffect(() => {
    if (!praticaId) return;

    const carregarPratica = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const { data, error } = await getPraticaById(praticaId);

        if (error) throw error;

        setPratica(data);

        // Parse instruções (podem estar em JSON)
        const instrucoesArray = typeof data.instrucoes_texto === 'string'
          ? JSON.parse(data.instrucoes_texto)
          : data.instrucoes_texto || [];

        setInstrucoes(instrucoesArray);
      } catch (err) {
        console.error('Erro ao carregar prática:', err);
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarPratica();
  }, [praticaId]);

  const handleComplete = async () => {
    setCompletado(true);

    // Salvar no Supabase se userId estiver disponível
    if (userId && pratica) {
      try {
        await completarPratica(userId, {
          id: pratica.id,
          titulo: pratica.titulo,
          categoria: pratica.categoria,
          duracao: pratica.duracao_min * 60,
          feedback: {} // Pode adicionar feedback aqui
        });
      } catch (err) {
        console.error('Erro ao salvar prática:', err);
      }
    }
  };

  const {
    timeLeft,
    isRunning,
    progress,
    start,
    pause,
    reset
  } = useTimer(
    pratica ? pratica.duracao_min * 60 : 180,
    handleComplete
  );

  // Calcular instrução atual baseada no progresso
  const currentInstrucaoIndex = Math.min(
    Math.floor((progress / 100) * instrucoes.length),
    instrucoes.length - 1
  );
  const currentInstrucao = instrucoes[currentInstrucaoIndex];

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Loading
  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando prática...</p>
        </div>
      </div>
    );
  }

  // Erro
  if (erro || !pratica) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 text-center">
          <p className="text-red-400 mb-4">
            {erro || 'Prática não encontrada'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-purple-200">{pratica.titulo}</h2>
          <p className="text-slate-400">{pratica.subtitulo || pratica.categoria}</p>
        </div>

        {/* Timer Circle */}
        <div className="flex justify-center">
          <div className="relative w-80 h-80">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="150"
                stroke="rgba(100, 116, 139, 0.3)"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="160"
                cy="160"
                r="150"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 150}`}
                strokeDashoffset={`${2 * Math.PI * 150 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                {isRunning && (
                  <div className="w-20 h-20 mx-auto bg-purple-500/20 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instrução Atual */}
        {isRunning && currentInstrucao && (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 text-center">
            {currentInstrucao.titulo && (
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                {currentInstrucao.titulo}
              </h3>
            )}
            <p className="text-2xl text-purple-200 leading-relaxed">
              {currentInstrucao.instrucoes}
            </p>
          </div>
        )}

        {/* Dica (antes de iniciar) */}
        {!isRunning && progress === 0 && pratica.dica && (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
            <p className="text-purple-200">
              💡 <strong>Dica:</strong> {pratica.dica}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning && progress === 0 && (
            <button
              onClick={start}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
            >
              <Play className="inline w-6 h-6 mr-2" />
              Iniciar
            </button>
          )}
          {isRunning && (
            <button
              onClick={pause}
              className="px-12 py-4 bg-slate-800 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-slate-700 transition-all"
            >
              <Pause className="inline w-6 h-6 mr-2" />
              Pausar
            </button>
          )}
          {!isRunning && progress > 0 && progress < 100 && (
            <>
              <button
                onClick={start}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-lg"
              >
                <Play className="inline w-5 h-5 mr-2" />
                Retomar
              </button>
              <button
                onClick={reset}
                className="px-8 py-4 bg-slate-800 text-white text-lg font-semibold rounded-full"
              >
                <RotateCcw className="inline w-5 h-5 mr-2" />
                Reiniciar
              </button>
            </>
          )}
        </div>

        {/* Completion */}
        {completado && progress === 100 && (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 text-center space-y-4">
            <Star className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-3xl font-bold text-white">Parabéns!</h3>
            <p className="text-purple-200">Você completou sua prática! 🌟</p>
            <button
              onClick={() => onComplete && onComplete(pratica)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full"
            >
              Finalizar
            </button>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          className="w-full py-3 text-slate-400 hover:text-slate-300 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>
      </div>
    </div>
  );
};

export default PracticeTimer;
