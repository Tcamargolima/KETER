import React, { useState, useEffect, useRef } from 'react';
import { Brain, Heart, Users, TrendingUp, Clock, Sparkles, Target, Sunrise, Lock, Trophy, Flame, BookOpen, Send, Menu, X, ChevronRight, Play, Pause, RotateCcw, Check, Star, Zap } from 'lucide-react';

// ==================== CONSTANTS & DATA ====================
const FASES = [
  {
    id: 1,
    nome: "DESPERTAR",
    cor: "#F59E0B",
    icone: Sunrise,
    duracao: 14,
    objetivo: "Conhecer a si mesmo"
  },
  {
    id: 2,
    nome: "DISCIPLINA",
    cor: "#EC4899",
    icone: Target,
    duracao: 16,
    objetivo: "Criar hábito sustentável"
  },
  {
    id: 3,
    nome: "CONSCIÊNCIA",
    cor: "#6B46C1",
    icone: Brain,
    duracao: 30,
    objetivo: "Perceber transformação"
  },
  {
    id: 4,
    nome: "SERVIÇO",
    cor: "#10B981",
    icone: Heart,
    duracao: null,
    objetivo: "Impacto no mundo"
  }
];

const PRATICAS = [
  {
    id: 1,
    titulo: "Respiração Consciente",
    duracao: 180,
    categoria: "Fundação",
    instrucoes: [
      "Encontre uma posição confortável",
      "Inspire profundamente pelo nariz contando até 4",
      "Segure o ar por 4 segundos",
      "Expire lentamente pela boca contando até 6",
      "Repita este ciclo, observando cada respiração"
    ]
  },
  {
    id: 2,
    titulo: "Intenção Diária",
    duracao: 240,
    categoria: "Propósito",
    instrucoes: [
      "Feche os olhos e respire profundamente 3 vezes",
      "Pergunte a si mesmo: Qual minha intenção para hoje?",
      "Visualize seu dia fluindo com essa intenção",
      "Sinta a energia dessa intenção em seu corpo",
      "Abra os olhos e leve essa clareza com você"
    ]
  },
  {
    id: 3,
    titulo: "Gratidão Profunda",
    duracao: 180,
    categoria: "Coração",
    instrucoes: [
      "Coloque uma mão no coração",
      "Pense em 3 coisas pelas quais é grato hoje",
      "Sinta genuinamente cada gratidão",
      "Deixe esse sentimento se expandir",
      "Respire essa sensação por alguns momentos"
    ]
  }
];

// ==================== CUSTOM HOOKS ====================
function useTimer(duration, onComplete) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

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
}

// ==================== STORAGE MANAGER ====================
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
};

// ==================== MAIN APP COMPONENT ====================
export default function KeterApp() {
  const [currentView, setCurrentView] = useState('welcome');
  const [user, setUser] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    sentimento: 5,
    habitos: [],
    tempo: '',
    busca: []
  });
  const [selectedPratica, setSelectedPratica] = useState(null);
  const [userStats, setUserStats] = useState({
    diaAtual: 1,
    faseAtual: 1,
    sequencia: 0,
    totalPraticas: 0,
    conquistas: []
  });
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Olá! Sou o Guia Keter, sua IA de evolução pessoal. Como posso ajudar você hoje?\n\nPosso:\n• Analisar sua evolução\n• Responder dúvidas sobre práticas\n• Sugerir próximos passos\n• Ajudar com desafios' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showConquista, setShowConquista] = useState(null);

  // Load user data on mount
  useEffect(() => {
    const savedUser = storage.get('keter_user');
    const savedStats = storage.get('keter_stats');
    if (savedUser) {
      setUser(savedUser);
      setCurrentView('home');
    }
    if (savedStats) {
      setUserStats(savedStats);
    }
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    if (user) {
      storage.set('keter_stats', userStats);
    }
  }, [userStats, user]);

  const completarPratica = () => {
    const novasStats = {
      ...userStats,
      totalPraticas: userStats.totalPraticas + 1,
      sequencia: userStats.sequencia + 1
    };
    
    // Check for achievements
    if (novasStats.totalPraticas === 1 && !userStats.conquistas.includes('primeiro-passo')) {
      novasStats.conquistas = [...novasStats.conquistas, 'primeiro-passo'];
      setShowConquista({ nome: 'Primeiro Passo', descricao: 'Completou sua primeira prática!' });
    }
    if (novasStats.sequencia === 7 && !userStats.conquistas.includes('semana-completa')) {
      novasStats.conquistas = [...novasStats.conquistas, 'semana-completa'];
      setShowConquista({ nome: 'Constância', descricao: '7 dias de prática seguida!' });
    }
    
    setUserStats(novasStats);
    setCurrentView('home');
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Vejo que você está em sua jornada há ${userStats.diaAtual} dias. Suas ${userStats.totalPraticas} práticas mostram comprometimento genuíno. Continue assim!`,
        `Sua sequência de ${userStats.sequencia} dias é inspiradora. A consistência é o caminho para a transformação real.`,
        `Percebi evolução nas suas práticas. Você está progredindo da Fase ${userStats.faseAtual}. Estou aqui para apoiar você.`,
        `Lembre-se: evolução não é linear. Cada dia de prática é uma vitória, mesmo quando parece pequeno.`
      ];
      const aiMsg = { 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  // ==================== VIEW COMPONENTS ====================
  
  const WelcomeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-500 blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 p-1">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 text-transparent bg-clip-text leading-tight" style={{fontFamily: 'Georgia, serif'}}>
              KETER
            </h1>
            <p className="text-3xl md:text-4xl text-purple-200 font-light" style={{fontFamily: 'Georgia, serif'}}>
              Sua evolução pessoal,
              <br />
              <span className="text-amber-300">acompanhada por IA</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-slate-300 text-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>5 minutos por dia</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>IA que te conhece</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span>Sempre gratuito</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('onboarding')}
            className="mt-12 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95"
          >
            Começar minha jornada
            <ChevronRight className="inline-block ml-2 w-6 h-6" />
          </button>

          <p className="text-slate-400 text-sm mt-8">
            Sem promessas mágicas. Sem gurus. Apenas evolução real.
          </p>
        </div>
      </div>
    </div>
  );

  const OnboardingView = () => {
    const habitos = [
      { id: 'meditacao', label: 'Meditação diária', icon: Brain },
      { id: 'paciencia', label: 'Mais paciência', icon: Heart },
      { id: 'exercicio', label: 'Exercício físico', icon: Zap },
      { id: 'reflexao', label: 'Reflexão regular', icon: BookOpen },
      { id: 'perdao', label: 'Perdoar mais', icon: Sparkles },
      { id: 'servir', label: 'Servir aos outros', icon: Users }
    ];

    const buscas = ['Paz interior', 'Disciplina', 'Propósito', 'Conexão', 'Perdão', 'Autoconhecimento'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-purple-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                style={{ width: `${(onboardingStep / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-slate-400 text-sm mt-2">Etapa {onboardingStep} de 4</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            {onboardingStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-purple-200">Como você se sente na maior parte do tempo?</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-4xl">
                    {['😢', '😟', '😐', '🙂', '😊'][Math.floor((onboardingData.sentimento - 1) / 2)]}
                    <span className="text-2xl text-purple-300">{onboardingData.sentimento}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={onboardingData.sentimento}
                    onChange={(e) => setOnboardingData({...onboardingData, sentimento: parseInt(e.target.value)})}
                    className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300">O que mais te incomoda hoje? (opcional)</label>
                  <textarea
                    className="w-full bg-slate-800 text-slate-200 rounded-xl p-4 border border-slate-700 focus:border-purple-500 outline-none resize-none"
                    rows="3"
                    maxLength="500"
                    placeholder="Ex: Ansiedade, falta de propósito..."
                  ></textarea>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-purple-200">Quais hábitos você gostaria de ter?</h2>
                  <p className="text-slate-400 mt-2">Selecione quantos quiser</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {habitos.map(habito => {
                    const Icon = habito.icon;
                    const isSelected = onboardingData.habitos.includes(habito.id);
                    return (
                      <button
                        key={habito.id}
                        onClick={() => {
                          const newHabitos = isSelected
                            ? onboardingData.habitos.filter(h => h !== habito.id)
                            : [...onboardingData.habitos, habito.id];
                          setOnboardingData({...onboardingData, habitos: newHabitos});
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                        <p className="text-slate-200 text-sm">{habito.label}</p>
                        {isSelected && <Check className="w-5 h-5 text-purple-400 mt-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-purple-200">Quanto tempo você tem por dia?</h2>
                  <p className="text-slate-400 mt-2">Seja realista. Começaremos pequeno.</p>
                </div>
                
                <div className="space-y-4">
                  {['3-5 minutos', '10-15 minutos', '20+ minutos'].map((tempo, idx) => (
                    <button
                      key={tempo}
                      onClick={() => setOnboardingData({...onboardingData, tempo})}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        onboardingData.tempo === tempo
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Clock className={`w-${6 + idx * 2} h-${6 + idx * 2} ${onboardingData.tempo === tempo ? 'text-purple-400' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xl font-semibold text-slate-200">{tempo}</p>
                          <p className="text-slate-400 text-sm">
                            {idx === 0 ? 'Perfeito para começar' : idx === 1 ? 'Tempo ideal' : 'Mergulho profundo'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-purple-200">O que você mais busca agora?</h2>
                  <p className="text-slate-400 mt-2">Escolha até 3 opções</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {buscas.map(busca => {
                    const isSelected = onboardingData.busca.includes(busca);
                    return (
                      <button
                        key={busca}
                        onClick={() => {
                          if (isSelected) {
                            setOnboardingData({...onboardingData, busca: onboardingData.busca.filter(b => b !== busca)});
                          } else if (onboardingData.busca.length < 3) {
                            setOnboardingData({...onboardingData, busca: [...onboardingData.busca, busca]});
                          }
                        }}
                        className={`px-6 py-3 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                            : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {busca}
                      </button>
                    );
                  })}
                </div>
                <p className="text-slate-400 text-sm">{onboardingData.busca.length} de 3 selecionados</p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {onboardingStep > 1 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={() => {
                  if (onboardingStep === 4) {
                    const newUser = { nome: 'Ketero', email: 'demo@keter.com' };
                    setUser(newUser);
                    storage.set('keter_user', newUser);
                    setCurrentView('home');
                  } else {
                    setOnboardingStep(onboardingStep + 1);
                  }
                }}
                disabled={onboardingStep === 2 && onboardingData.habitos.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {onboardingStep === 4 ? 'Completar' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HomeView = () => {
    const faseAtual = FASES[userStats.faseAtual - 1];
    const Icon = faseAtual.icone;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-xl border-b border-purple-500/20 p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-purple-200">Olá, {user?.nome || 'Ketero'} 👋</h1>
              <p className="text-slate-400">Bem-vindo de volta</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
              {(user?.nome || 'K')[0]}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Fase Atual */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: `${faseAtual.cor}20`, border: `2px solid ${faseAtual.cor}`}}>
                <Icon className="w-8 h-8" style={{color: faseAtual.cor}} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{color: faseAtual.cor}}>{faseAtual.nome}</h2>
                <p className="text-slate-400">{faseAtual.objetivo}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Dia {userStats.diaAtual} de {faseAtual.duracao || '∞'}</span>
                <span>{Math.round((userStats.diaAtual / (faseAtual.duracao || userStats.diaAtual)) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(userStats.diaAtual / (faseAtual.duracao || userStats.diaAtual)) * 100}%`,
                    background: `linear-gradient(to right, ${faseAtual.cor}, ${FASES[userStats.faseAtual]?.cor || faseAtual.cor})`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Sequência */}
          {userStats.sequencia > 0 && (
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-4 border border-orange-500/30">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-orange-200 font-bold text-xl">{userStats.sequencia} dias de sequência!</p>
                  <p className="text-orange-300/80 text-sm">Continue assim para manter o fogo aceso</p>
                </div>
              </div>
            </div>
          )}

          {/* Prática do Dia */}
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <h3 className="text-xl text-purple-200 mb-4">Prática de Hoje</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-3xl font-bold text-white mb-2">{PRATICAS[userStats.diaAtual % PRATICAS.length].titulo}</h4>
                <p className="text-purple-300">
                  <Clock className="inline w-4 h-4 mr-1" />
                  {Math.floor(PRATICAS[userStats.diaAtual % PRATICAS.length].duracao / 60)} minutos
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPratica(PRATICAS[userStats.diaAtual % PRATICAS.length]);
                  setCurrentView('pratica');
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95"
              >
                <Play className="inline w-6 h-6 mr-2" />
                Começar Prática
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20">
              <Flame className="w-8 h-8 text-orange-400 mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.sequencia}</p>
              <p className="text-slate-400 text-sm">Sequência</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20">
              <Target className="w-8 h-8 text-purple-400 mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.totalPraticas}</p>
              <p className="text-slate-400 text-sm">Práticas</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20">
              <Trophy className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.conquistas.length}</p>
              <p className="text-slate-400 text-sm">Conquistas</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20">
              <Clock className="w-8 h-8 text-pink-400 mb-2" />
              <p className="text-2xl font-bold text-white">{Math.floor(userStats.totalPraticas * 3)}</p>
              <p className="text-slate-400 text-sm">Minutos</p>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  };

  const PraticaView = () => {
    const { timeLeft, isRunning, progress, start, pause, reset } = useTimer(
      selectedPratica?.duracao || 180,
      completarPratica
    );

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const currentInstrucao = Math.floor((progress / 100) * (selectedPratica?.instrucoes.length || 1));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-purple-200">{selectedPratica?.titulo}</h2>
            <p className="text-slate-400">{selectedPratica?.categoria}</p>
          </div>

          {/* Timer Circle */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  stroke="rgba(100, 116, 139, 0.3)"
                  strokeWidth="12"
                  fill="none"
                />
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
          {isRunning && selectedPratica?.instrucoes[currentInstrucao] && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 text-center">
              <p className="text-2xl text-purple-200 leading-relaxed">
                {selectedPratica.instrucoes[currentInstrucao]}
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

          {progress === 100 && (
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 text-center space-y-4">
              <Star className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-3xl font-bold text-white">Parabéns!</h3>
              <p className="text-purple-200">Você completou sua prática! 🌟</p>
              <button
                onClick={completarPratica}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full"
              >
                Finalizar
              </button>
            </div>
          )}

          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-3 text-slate-400 hover:text-slate-300 transition-all"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  };

  const GuiaView = () => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24">
        <div className="bg-slate-900/50 backdrop-blur-xl border-b border-purple-500/20 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-purple-200">Guia Keter</h1>
                <p className="text-slate-400 text-sm">IA personalizada</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-4 mb-24">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 text-slate-200'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-slate-900/90 backdrop-blur-xl text-slate-200 rounded-full px-6 py-3 border border-purple-500/20 focus:border-purple-500 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  };

  const PerfilView = () => {
    const faseAtual = FASES[userStats.faseAtual - 1];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24">
        <div className="bg-slate-900/50 backdrop-blur-xl border-b border-purple-500/20 p-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
              {(user?.nome || 'K')[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-200">{user?.nome || 'Ketero'}</h1>
              <p className="text-slate-400">Membro desde {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Fase Atual */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
            <h3 className="text-xl text-purple-200 mb-4">Nível Atual</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: `${faseAtual.cor}20`, border: `2px solid ${faseAtual.cor}`}}>
                {React.createElement(faseAtual.icone, {className: "w-8 h-8", style: {color: faseAtual.cor}})}
              </div>
              <div>
                <h4 className="text-2xl font-bold" style={{color: faseAtual.cor}}>{faseAtual.nome}</h4>
                <p className="text-slate-400">{faseAtual.objetivo}</p>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
            <h3 className="text-xl text-purple-200 mb-4">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{userStats.sequencia}</p>
                <p className="text-slate-400 text-sm">Sequência atual</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{userStats.totalPraticas}</p>
                <p className="text-slate-400 text-sm">Total de práticas</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <Clock className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{Math.floor(userStats.totalPraticas * 3)}</p>
                <p className="text-slate-400 text-sm">Minutos totais</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{userStats.conquistas.length}</p>
                <p className="text-slate-400 text-sm">Conquistas</p>
              </div>
            </div>
          </div>

          {/* Conquistas */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
            <h3 className="text-xl text-purple-200 mb-4">Conquistas Desbloqueadas</h3>
            <div className="grid grid-cols-3 gap-4">
              {['primeiro-passo', 'semana-completa', '21-dias'].map(conquista => {
                const desbloqueada = userStats.conquistas.includes(conquista);
                return (
                  <div key={conquista} className={`text-center p-4 rounded-xl ${desbloqueada ? 'bg-amber-500/20 border-2 border-amber-500' : 'bg-slate-800/30 border border-slate-700'}`}>
                    <Trophy className={`w-12 h-12 mx-auto mb-2 ${desbloqueada ? 'text-amber-400' : 'text-slate-600'}`} />
                    {!desbloqueada && <Lock className="w-4 h-4 mx-auto text-slate-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  };

  const BottomNav = () => {
    const navItems = [
      { id: 'home', icon: Sunrise, label: 'Casa' },
      { id: 'guia', icon: Brain, label: 'Guia' },
      { id: 'circulos', icon: Users, label: 'Círculos' },
      { id: 'perfil', icon: Heart, label: 'Perfil' }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto flex justify-around p-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => item.id === 'circulos' ? null : setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  item.id === 'circulos'
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive
                    ? 'text-purple-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
                {item.id === 'circulos' && <Lock className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Conquista Modal
  const ConquistaModal = () => {
    if (!showConquista) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-amber-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-amber-500 max-w-md w-full text-center space-y-4 animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-50 animate-pulse"></div>
            <Trophy className="w-24 h-24 text-amber-400 mx-auto relative" />
          </div>
          <h2 className="text-3xl font-bold text-amber-200">Conquista Desbloqueada!</h2>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">{showConquista.nome}</h3>
            <p className="text-amber-200">{showConquista.descricao}</p>
          </div>
          <button
            onClick={() => setShowConquista(null)}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/50 transition-all"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="font-sans antialiased">
      {currentView === 'welcome' && <WelcomeView />}
      {currentView === 'onboarding' && <OnboardingView />}
      {currentView === 'home' && <HomeView />}
      {currentView === 'pratica' && <PraticaView />}
      {currentView === 'guia' && <GuiaView />}
      {currentView === 'perfil' && <PerfilView />}
      <ConquistaModal />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
