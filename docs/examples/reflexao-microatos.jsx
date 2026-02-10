// SISTEMA DE REFLEXÃO NOTURNA E MICRO-ATOS

import React, { useState } from 'react';
import { Moon, Heart, CheckCircle, X, Save } from 'lucide-react';

// ==================== REFLEXÃO NOTURNA ====================

export const PERGUNTAS_REFLEXAO = {
  fase1: [
    {
      id: 'sentimento_dia',
      pergunta: 'Como você se sentiu durante o dia?',
      tipo: 'textarea',
      placeholder: 'Seja honesto consigo mesmo...',
      maxLength: 500,
      obrigatorio: true
    },
    {
      id: 'paciencia_bondade',
      pergunta: 'Você tratou alguém com paciência ou bondade hoje?',
      tipo: 'radio',
      opcoes: [
        { valor: 'sim_orgulho', label: 'Sim, me orgulho disso', emoji: '😊' },
        { valor: 'tentei_dificil', label: 'Tentei, mas foi difícil', emoji: '😅' },
        { valor: 'nao_arrependo', label: 'Não, e me arrependo', emoji: '😔' },
        { valor: 'sem_oportunidade', label: 'Não tive oportunidade', emoji: '🤷' }
      ],
      obrigatorio: true
    },
    {
      id: 'mudaria_algo',
      pergunta: 'Se pudesse reviver hoje, mudaria algo?',
      tipo: 'textarea',
      placeholder: 'Compartilhe seus aprendizados...',
      maxLength: 500,
      obrigatorio: false
    }
  ],
  
  fase2: [
    {
      id: 'sentimento_dia',
      pergunta: 'Como você se sentiu durante o dia?',
      tipo: 'textarea',
      placeholder: 'Observe suas emoções sem julgamento...',
      maxLength: 500,
      obrigatorio: true
    },
    {
      id: 'micro_ato_executado',
      pergunta: 'Você executou seu micro-ato de bondade hoje?',
      tipo: 'radio',
      opcoes: [
        { valor: 'sim_impacto', label: 'Sim, e percebi impacto positivo', emoji: '✨' },
        { valor: 'sim_simples', label: 'Sim, foi algo simples', emoji: '😊' },
        { valor: 'esqueci', label: 'Esqueci, mas vou fazer amanhã', emoji: '😅' },
        { valor: 'nao_consegui', label: 'Não consegui, mas tentei', emoji: '💪' }
      ],
      obrigatorio: true
    },
    {
      id: 'desafio_disciplina',
      pergunta: 'Qual foi seu maior desafio de disciplina hoje?',
      tipo: 'textarea',
      placeholder: 'Seja específico sobre o que foi difícil...',
      maxLength: 500,
      obrigatorio: false
    },
    {
      id: 'gratidao_dia',
      pergunta: 'Pelo que você é grato hoje?',
      tipo: 'textarea',
      placeholder: 'Liste 3 coisas específicas...',
      maxLength: 300,
      obrigatorio: true
    }
  ],
  
  fase3: [
    {
      id: 'observacao_mudanca',
      pergunta: 'Que mudança você observou em si mesmo hoje?',
      tipo: 'textarea',
      placeholder: 'Pode ser sutil: um pensamento diferente, uma reação nova...',
      maxLength: 500,
      obrigatorio: true
    },
    {
      id: 'momento_consciencia',
      pergunta: 'Houve um momento hoje em que você estava plenamente presente?',
      tipo: 'radio',
      opcoes: [
        { valor: 'sim_varios', label: 'Sim, vários momentos', emoji: '🌟' },
        { valor: 'sim_um', label: 'Sim, um momento marcante', emoji: '✨' },
        { valor: 'tentei', label: 'Tentei, mas foi difícil', emoji: '🙏' },
        { valor: 'esqueci', label: 'Me peguei no piloto automático', emoji: '😴' }
      ],
      obrigatorio: true
    },
    {
      id: 'padrao_observado',
      pergunta: 'Você notou algum padrão se repetindo em seus pensamentos ou comportamentos?',
      tipo: 'textarea',
      placeholder: 'A consciência de padrões é o primeiro passo para mudá-los...',
      maxLength: 500,
      obrigatorio: false
    },
    {
      id: 'impacto_outros',
      pergunta: 'Como suas ações impactaram outras pessoas hoje?',
      tipo: 'textarea',
      placeholder: 'Reflita sobre o efeito ripple das suas escolhas...',
      maxLength: 400,
      obrigatorio: true
    }
  ]
};

export function ReflexaoNoturna({ fase, onSalvar, onFechar }) {
  const perguntas = PERGUNTAS_REFLEXAO[`fase${fase}`] || PERGUNTAS_REFLEXAO.fase1;
  const [respostas, setRespostas] = useState({});
  const [caracteres, setCaracteres] = useState({});

  const handleResposta = (perguntaId, valor) => {
    setRespostas({ ...respostas, [perguntaId]: valor });
    if (typeof valor === 'string') {
      setCaracteres({ ...caracteres, [perguntaId]: valor.length });
    }
  };

  const podeSalvar = () => {
    return perguntas
      .filter(p => p.obrigatorio)
      .every(p => respostas[p.id] && respostas[p.id].trim().length > 0);
  };

  const handleSalvar = () => {
    if (podeSalvar()) {
      onSalvar({
        data: new Date().toISOString(),
        fase,
        respostas
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 max-w-2xl w-full border border-purple-500/30 shadow-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Moon className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-200">Reflexão Noturna</h2>
              <p className="text-slate-400 text-sm">Fase {fase} - {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Perguntas */}
        <div className="space-y-6">
          {perguntas.map((pergunta, idx) => (
            <div key={pergunta.id} className="space-y-3">
              <label className="block text-lg text-purple-200">
                {idx + 1}. {pergunta.pergunta}
                {pergunta.obrigatorio && <span className="text-pink-400 ml-1">*</span>}
              </label>

              {pergunta.tipo === 'textarea' && (
                <div className="space-y-2">
                  <textarea
                    value={respostas[pergunta.id] || ''}
                    onChange={(e) => handleResposta(pergunta.id, e.target.value)}
                    placeholder={pergunta.placeholder}
                    maxLength={pergunta.maxLength}
                    rows="4"
                    className="w-full bg-slate-800/80 text-slate-200 rounded-xl p-4 border border-slate-700 focus:border-purple-500 outline-none resize-none"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{pergunta.placeholder}</span>
                    <span>{caracteres[pergunta.id] || 0}/{pergunta.maxLength}</span>
                  </div>
                </div>
              )}

              {pergunta.tipo === 'radio' && (
                <div className="space-y-2">
                  {pergunta.opcoes.map((opcao) => (
                    <button
                      key={opcao.valor}
                      onClick={() => handleResposta(pergunta.id, opcao.valor)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                        respostas[pergunta.id] === opcao.valor
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl">{opcao.emoji}</span>
                      <span className="text-slate-200">{opcao.label}</span>
                      {respostas[pergunta.id] === opcao.valor && (
                        <CheckCircle className="w-5 h-5 text-purple-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onFechar}
            className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={!podeSalvar()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar Reflexão
          </button>
        </div>

        <p className="text-slate-400 text-sm mt-4 text-center">
          "A vida não examinada não vale a pena ser vivida." - Sócrates
        </p>
      </div>
    </div>
  );
}

// ==================== MICRO-ATOS ====================

export const CATEGORIAS_MICRO_ATOS = [
  {
    id: 'bondade',
    nome: 'Bondade',
    cor: '#EC4899',
    icone: 'heart',
    atos: [
      'Enviar mensagem carinhosa para alguém que você não fala há tempo',
      'Elogiar genuinamente alguém',
      'Fazer café/chá para alguém sem pedir nada em troca',
      'Segurar a porta para alguém',
      'Sorrir para um estranho',
      'Dar passagem no trânsito com paciência',
      'Agradecer sinceramente alguém que te ajudou',
      'Oferecer ajuda sem esperar reconhecimento'
    ]
  },
  {
    id: 'perdao',
    nome: 'Perdão',
    cor: '#10B981',
    icone: 'smile',
    atos: [
      'Perdoar mentalmente alguém que te magoou (mesmo sem contar)',
      'Liberar um ressentimento pequeno',
      'Pedir desculpas por algo que você fez',
      'Escolher não revidar uma ofensa',
      'Soltar um julgamento que você tem sobre alguém',
      'Perdoar a si mesmo por um erro passado'
    ]
  },
  {
    id: 'generosidade',
    nome: 'Generosidade',
    cor: '#F59E0B',
    icone: 'gift',
    atos: [
      'Doar algo que você não usa mais',
      'Dar gorjeta generosa',
      'Compartilhar conhecimento ou habilidade gratuitamente',
      'Oferecer seu tempo para ajudar alguém',
      'Pagar café de alguém na fila',
      'Compartilhar algo que você gosta com outros'
    ]
  },
  {
    id: 'presenca',
    nome: 'Presença',
    cor: '#8B5CF6',
    icone: 'user',
    atos: [
      'Ouvir alguém com atenção total (sem celular)',
      'Fazer uma refeição sem distrações',
      'Brincar/conversar com criança com presença total',
      'Abraçar alguém com atenção plena',
      'Fazer contato visual genuíno numa conversa',
      'Dar atenção total a um pet'
    ]
  },
  {
    id: 'servico',
    nome: 'Serviço',
    cor: '#14B8A6',
    icone: 'users',
    atos: [
      'Limpar algo que não é sua responsabilidade',
      'Ajudar alguém com tarefa difícil',
      'Ensinar algo que você sabe',
      'Fazer trabalho voluntário (mesmo 30 min)',
      'Cuidar de alguém que precisa',
      'Resolver um problema que afeta outros'
    ]
  },
  {
    id: 'gratidao',
    nome: 'Gratidão',
    cor: '#F59E0B',
    icone: 'star',
    atos: [
      'Escrever bilhete de gratidão para alguém',
      'Agradecer publicamente alguém que te ajudou',
      'Reconhecer trabalho de alguém que passa despercebido',
      'Expressar gratidão aos pais/familiares',
      'Agradecer a si mesmo por algo que conseguiu',
      'Valorizar em voz alta algo que alguém fez'
    ]
  }
];

export function MicroAtosSelector({ onSelecionar, onFechar }) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [atoSelecionado, setAtoSelecionado] = useState(null);
  const [atoCustomizado, setAtoCustomizado] = useState('');

  const handleConfirmar = () => {
    const ato = atoSelecionado || atoCustomizado;
    if (ato) {
      onSelecionar({
        categoria: categoriaSelecionada?.id || 'customizado',
        descricao: ato,
        data: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-pink-900 rounded-3xl p-8 max-w-2xl w-full border border-pink-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-pink-200">Micro-Ato de Hoje</h2>
              <p className="text-slate-400 text-sm">Pequenas ações, grande impacto</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!categoriaSelecionada ? (
          /* Seleção de Categoria */
          <div className="space-y-4">
            <p className="text-purple-200 mb-4">Escolha uma categoria de ação:</p>
            {CATEGORIAS_MICRO_ATOS.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaSelecionada(categoria)}
                className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-pink-500 hover:bg-pink-500/10 transition-all text-left flex items-center gap-4"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${categoria.cor}20` }}
                >
                  <Heart className="w-6 h-6" style={{ color: categoria.cor }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-200">{categoria.nome}</h3>
                  <p className="text-slate-400 text-sm">{categoria.atos.length} sugestões</p>
                </div>
              </button>
            ))}

            <button
              onClick={() => setCategoriaSelecionada({ id: 'customizado', nome: 'Customizado' })}
              className="w-full p-4 rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/30 hover:border-purple-500 transition-all text-slate-300"
            >
              + Criar meu próprio micro-ato
            </button>
          </div>
        ) : (
          /* Seleção de Ato */
          <div className="space-y-4">
            <button
              onClick={() => {
                setCategoriaSelecionada(null);
                setAtoSelecionado(null);
                setAtoCustomizado('');
              }}
              className="text-purple-300 hover:text-purple-200 text-sm flex items-center gap-1"
            >
              ← Voltar para categorias
            </button>

            <h3 className="text-xl font-bold text-pink-200">{categoriaSelecionada.nome}</h3>

            {categoriaSelecionada.id !== 'customizado' ? (
              <div className="space-y-3">
                {categoriaSelecionada.atos.map((ato, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAtoSelecionado(ato)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      atoSelecionado === ato
                        ? 'border-pink-500 bg-pink-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <p className="text-slate-200">{ato}</p>
                    {atoSelecionado === ato && (
                      <CheckCircle className="w-5 h-5 text-pink-400 mt-2" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-purple-200">
                  Descreva seu micro-ato de bondade:
                </label>
                <textarea
                  value={atoCustomizado}
                  onChange={(e) => setAtoCustomizado(e.target.value)}
                  placeholder="Ex: Vou ligar para minha avó e perguntar como ela está..."
                  rows="4"
                  maxLength="200"
                  className="w-full bg-slate-800/80 text-slate-200 rounded-xl p-4 border border-slate-700 focus:border-pink-500 outline-none resize-none"
                />
                <p className="text-slate-400 text-sm">{atoCustomizado.length}/200</p>
              </div>
            )}

            <button
              onClick={handleConfirmar}
              disabled={!atoSelecionado && !atoCustomizado.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirmar Micro-Ato
            </button>
          </div>
        )}

        <p className="text-slate-400 text-sm mt-6 text-center italic">
          "Não há ato de bondade, por menor que seja, que seja desperdiçado." - Esopo
        </p>
      </div>
    </div>
  );
}

// ==================== COMPONENTE DE REGISTRO DE EXECUÇÃO ====================

export function MicroAtoExecucao({ microAto, onConcluir, onFechar }) {
  const [reflexao, setReflexao] = useState('');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-green-900 rounded-3xl p-8 max-w-lg w-full border border-green-500/30 shadow-2xl">
        <div className="text-center space-y-4 mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-green-200">Você fez seu micro-ato! ✨</h2>
          <p className="text-slate-300 bg-slate-800/50 rounded-xl p-4">
            "{microAto.descricao}"
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <label className="block text-purple-200">
            Como foi a experiência? Como a pessoa reagiu?
            <span className="text-slate-400 text-sm ml-2">(opcional)</span>
          </label>
          <textarea
            value={reflexao}
            onChange={(e) => setReflexao(e.target.value)}
            placeholder="Compartilhe como se sentiu ao fazer esse ato de bondade..."
            rows="4"
            maxLength="300"
            className="w-full bg-slate-800/80 text-slate-200 rounded-xl p-4 border border-slate-700 focus:border-green-500 outline-none resize-none"
          />
          <p className="text-slate-400 text-sm text-right">{reflexao.length}/300</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onFechar}
            className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
          >
            Ainda não fiz
          </button>
          <button
            onClick={() => onConcluir(reflexao)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all"
          >
            Confirmar Conclusão
          </button>
        </div>
      </div>
    </div>
  );
}
