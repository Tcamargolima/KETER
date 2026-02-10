// BIBLIOTECA COMPLETA DE 30 PRÁTICAS KETER
// Práticas organizadas por fase e categoria

export const PRATICAS_BIBLIOTECA = [
  // ========== FASE 1: DESPERTAR (Dias 1-14) ==========
  {
    id: 1,
    dia: 1,
    fase: 1,
    titulo: "Respiração Consciente",
    subtitulo: "A base de tudo",
    duracao: 180, // segundos
    categoria: "Respiração",
    dificuldade: "Iniciante",
    icone: "wind",
    corCategoria: "#60A5FA",
    objetivo: "Aprender a ancorar-se no presente através da respiração",
    beneficios: ["Reduz ansiedade", "Aumenta foco", "Acalma mente"],
    etapas: [
      {
        duracao: 30,
        titulo: "Preparação",
        instrucoes: "Encontre uma posição confortável. Pode ser sentado ou deitado. Feche os olhos suavemente."
      },
      {
        duracao: 150,
        titulo: "Respiração 4-4-6",
        instrucoes: "Inspire profundamente pelo nariz contando até 4... Segure o ar por 4 segundos... Expire lentamente pela boca contando até 6... Repita este ciclo, observando cada respiração sem julgar."
      }
    ],
    dica: "Se sua mente vagar, gentilmente traga sua atenção de volta para a respiração. É normal e esperado."
  },
  
  {
    id: 2,
    dia: 2,
    fase: 1,
    titulo: "Intenção do Dia",
    subtitulo: "Definindo seu norte",
    duracao: 240,
    categoria: "Propósito",
    dificuldade: "Iniciante",
    icone: "compass",
    corCategoria: "#F59E0B",
    objetivo: "Estabelecer uma direção consciente para o dia",
    beneficios: ["Clareza mental", "Ações alinhadas", "Propósito diário"],
    etapas: [
      {
        duracao: 60,
        titulo: "Centramento",
        instrucoes: "Respire profundamente três vezes. Deixe o corpo relaxar. Sinta-se presente neste momento."
      },
      {
        duracao: 120,
        titulo: "Definição",
        instrucoes: "Pergunte a si mesmo: 'Qual é minha intenção para hoje?' Pode ser uma qualidade (paciência, gentileza), uma ação (ouvir mais, julgar menos) ou um foco (estar presente com minha família)."
      },
      {
        duracao: 60,
        titulo: "Ancoragem",
        instrucoes: "Visualize seu dia fluindo com essa intenção. Sinta em seu corpo a energia dessa escolha. Essa é sua âncora para o dia."
      }
    ],
    dica: "Escreva sua intenção em algum lugar visível. Revisite-a durante o dia."
  },

  {
    id: 3,
    dia: 3,
    fase: 1,
    titulo: "Gratidão Profunda",
    subtitulo: "Reconhecendo o que há",
    duracao: 240,
    categoria: "Coração",
    dificuldade: "Iniciante",
    icone: "heart",
    corCategoria: "#EC4899",
    objetivo: "Cultivar gratidão genuína, não mecânica",
    beneficios: ["Melhora humor", "Muda perspectiva", "Aumenta satisfação"],
    etapas: [
      {
        duracao: 60,
        titulo: "Preparação do coração",
        instrucoes: "Coloque uma mão no coração. Respire fundo. Sinta o calor da sua mão."
      },
      {
        duracao: 120,
        titulo: "Três gratidões",
        instrucoes: "Pense em 3 coisas pelas quais você é grato HOJE. Não podem ser genéricas. Busque especificidade: 'o café quente esta manhã', 'o sorriso do meu filho', 'ter acordado sem dor'."
      },
      {
        duracao: 60,
        titulo: "Sentir",
        instrucoes: "Não apenas liste. SINTA cada gratidão. Deixe o sentimento de apreciação se expandir pelo seu corpo. Respire essa sensação."
      }
    ],
    dica: "Gratidão genuína é sentida no corpo, não apenas pensada na mente."
  },

  {
    id: 4,
    dia: 4,
    fase: 1,
    titulo: "Presença no Corpo",
    subtitulo: "Body scan",
    duracao: 300,
    categoria: "Meditação",
    dificuldade: "Iniciante",
    icone: "user",
    corCategoria: "#8B5CF6",
    objetivo: "Reconectar-se com as sensações corporais",
    beneficios: ["Reduz tensão", "Aumenta consciência", "Alivia dor"],
    etapas: [
      {
        duracao: 60,
        titulo: "Ancoragem",
        instrucoes: "Deite-se ou sente-se confortavelmente. Feche os olhos. Respire fundo três vezes."
      },
      {
        duracao: 180,
        titulo: "Escaneamento",
        instrucoes: "Leve sua atenção para os pés. Sinta sensações: temperatura, formigamento, peso. Suba lentamente: pernas... quadril... abdômen... peito... braços... pescoço... cabeça. Apenas observe, sem julgar."
      },
      {
        duracao: 60,
        titulo: "Integração",
        instrucoes: "Sinta seu corpo como um todo. Una. Presente. Respire agradecendo ao seu corpo por te carregar hoje."
      }
    ],
    dica: "Se encontrar tensão, respire para aquela área. Não force relaxamento, apenas observe."
  },

  {
    id: 5,
    dia: 5,
    fase: 1,
    titulo: "Perdão Pequeno",
    subtitulo: "Soltando ressentimentos menores",
    duracao: 300,
    categoria: "Perdão",
    dificuldade: "Intermediário",
    icone: "smile",
    corCategoria: "#10B981",
    objetivo: "Praticar perdão com situações pequenas",
    beneficios: ["Libera ressentimento", "Alivia peso emocional", "Treina compaixão"],
    etapas: [
      {
        duracao: 60,
        titulo: "Identificação",
        instrucoes: "Pense em algo pequeno que te incomodou recentemente. Alguém que te cortou no trânsito. Um comentário indelicado. Algo menor, não um trauma profundo."
      },
      {
        duracao: 120,
        titulo: "Compreensão",
        instrucoes: "Essa pessoa estava tendo um dia difícil? Estava apressada? Com medo? Faça um esforço honesto de ver a humanidade dela. Você já fez algo semelhante?"
      },
      {
        duracao: 120,
        titulo: "Soltar",
        instrucoes: "Ao expirar, visualize soltar esse ressentimento como areia escorrendo entre os dedos. Você não precisa aprovar a ação. Apenas decide não carregar mais esse peso."
      }
    ],
    dica: "Perdão não é concordar. É escolher não carregar veneno em você."
  },

  {
    id: 6,
    dia: 6,
    fase: 1,
    titulo: "Auto-Compaixão",
    subtitulo: "Ser gentil consigo mesmo",
    duracao: 300,
    categoria: "Coração",
    dificuldade: "Intermediário",
    icone: "heart",
    corCategoria: "#EC4899",
    objetivo: "Desenvolver gentileza consigo mesmo",
    beneficios: ["Reduz autocrítica", "Aumenta resiliência", "Melhora autoestima"],
    etapas: [
      {
        duracao: 60,
        titulo: "Reconhecimento",
        instrucoes: "Pense em algo que você se critica. Uma falha recente. Um erro. Um arrependimento. Reconheça sem esconder."
      },
      {
        duracao: 120,
        titulo: "Humanidade compartilhada",
        instrucoes: "Lembre-se: todos erram. Todos falham. Todos carregam arrependimentos. Você não está sozinho nisso. Sofrer é humano."
      },
      {
        duracao: 120,
        titulo: "Gentileza",
        instrucoes: "Coloque a mão no coração. Fale consigo como falaria com um amigo querido: 'Está tudo bem. Você está fazendo o melhor que pode. Você merece compaixão também.'"
      }
    ],
    dica: "Auto-compaixão não é auto-indulgência. É reconhecer sua humanidade."
  },

  {
    id: 7,
    dia: 7,
    fase: 1,
    titulo: "Revisão Semanal",
    subtitulo: "Olhando para trás com honestidade",
    duracao: 360,
    categoria: "Reflexão",
    dificuldade: "Intermediário",
    icone: "book-open",
    corCategoria: "#6366F1",
    objetivo: "Refletir sobre os primeiros 7 dias",
    beneficios: ["Auto-conhecimento", "Reconhece progresso", "Ajusta curso"],
    etapas: [
      {
        duracao: 120,
        titulo: "O que aprendi",
        instrucoes: "Dos últimos 6 dias, qual prática te marcou mais? O que você descobriu sobre si mesmo? Seja específico."
      },
      {
        duracao: 120,
        titulo: "Desafios",
        instrucoes: "Quais foram suas dificuldades? Quando foi mais difícil praticar? O que te atrapalhou? Sem julgamento, apenas observe."
      },
      {
        duracao: 120,
        titulo: "Próxima semana",
        instrucoes: "O que você quer levar desta semana para a próxima? Que pequeno ajuste faria sua prática ainda melhor?"
      }
    ],
    dica: "Seja honesto mas gentil consigo mesmo. Progresso não é linear."
  },

  // ========== FASE 2: DISCIPLINA (Dias 8-23) ==========
  
  {
    id: 8,
    dia: 8,
    fase: 2,
    titulo: "Respiração Quadrada",
    subtitulo: "Técnica avançada de respiração",
    duracao: 240,
    categoria: "Respiração",
    dificuldade: "Intermediário",
    icone: "wind",
    corCategoria: "#60A5FA",
    objetivo: "Dominar padrão respiratório 4-4-4-4",
    beneficios: ["Calma profunda", "Foco intenso", "Regula sistema nervoso"],
    etapas: [
      {
        duracao: 60,
        titulo: "Preparação",
        instrucoes: "Sente-se com coluna ereta. Ombros relaxados. Feche os olhos."
      },
      {
        duracao: 180,
        titulo: "Quadrado respiratório",
        instrucoes: "Inspire por 4... Segure por 4... Expire por 4... Segure vazio por 4... Repita. Visualize desenhar um quadrado com sua respiração."
      }
    ],
    dica: "Se 4 segundos é muito, use 3. O importante é a regularidade, não a duração."
  },

  {
    id: 9,
    dia: 9,
    fase: 2,
    titulo: "Meditação da Vela",
    subtitulo: "Foco visual",
    duracao: 300,
    categoria: "Meditação",
    dificuldade: "Intermediário",
    icone: "flame",
    corCategoria: "#8B5CF6",
    objetivo: "Desenvolver concentração através de âncora visual",
    beneficios: ["Foco aprimorado", "Quietude mental", "Presença"],
    etapas: [
      {
        duracao: 60,
        titulo: "Preparação",
        instrucoes: "Acenda uma vela. Coloque-a à altura dos olhos, a 1-2 metros de você. Respire fundo."
      },
      {
        duracao: 180,
        titulo: "Contemplação",
        instrucoes: "Olhe fixamente para a chama. Observe o movimento, as cores, a dança. Quando sua mente vagar, gentilmente retorne à chama."
      },
      {
        duracao: 60,
        titulo: "Integração",
        instrucoes: "Feche os olhos. Visualize a chama dentro de você. Essa luz está sempre presente."
      }
    ],
    dica: "Não force. Piscar é natural. A prática é perceber quando a mente distrai e retornar."
  },

  {
    id: 10,
    dia: 10,
    fase: 2,
    titulo: "Mantra Silencioso",
    subtitulo: "Âncora sonora interna",
    duracao: 300,
    categoria: "Meditação",
    dificuldade: "Intermediário",
    icone: "music",
    corCategoria: "#8B5CF6",
    objetivo: "Usar repetição mental para acalmar mente",
    beneficios: ["Silencia tagarelice mental", "Aprofunda meditação", "Paz interior"],
    etapas: [
      {
        duracao: 60,
        titulo: "Escolha",
        instrucoes: "Escolha uma palavra ou frase curta que ressoe com você. Pode ser 'paz', 'amor', 'eu sou', 'tudo passa'. Não precisa ser espiritual."
      },
      {
        duracao: 180,
        titulo: "Repetição",
        instrucoes: "Feche os olhos. Comece a repetir mentalmente seu mantra. Não precisa sincronizar com respiração. Deixe fluir naturalmente. Quando perceber que parou, retome."
      },
      {
        duracao: 60,
        titulo: "Silêncio",
        instrucoes: "Pare a repetição. Apenas sente no silêncio. Observe o espaço criado."
      }
    ],
    dica: "O mantra é um veículo, não o destino. Use-o para chegar ao silêncio."
  },

  {
    id: 11,
    dia: 11,
    fase: 2,
    titulo: "Caminhada Consciente",
    subtitulo: "Meditação em movimento",
    duracao: 360,
    categoria: "Movimento",
    dificuldade: "Iniciante",
    icone: "footprints",
    corCategoria: "#14B8A6",
    objetivo: "Praticar presença durante movimento",
    beneficios: ["Integra corpo-mente", "Presença ativa", "Energia renovada"],
    etapas: [
      {
        duracao: 60,
        titulo: "Preparação",
        instrucoes: "Escolha um local tranquilo para caminhar. Pode ser dentro de casa, num corredor. Fique de pé, sinta seu peso."
      },
      {
        duracao: 240,
        titulo: "Caminhada lenta",
        instrucoes: "Caminhe muito lentamente. Sinta cada parte do movimento: calcanhar toca o chão... peso transfere... dedos empurram... Observe cada passo com curiosidade."
      },
      {
        duracao: 60,
        titulo: "Gratidão ao corpo",
        instrucoes: "Pare. Agradeça a seus pés, pernas, corpo por te carregar. Respire profundamente."
      }
    ],
    dica: "Não precisa ser em local especial. Pode ser no seu quarto, sala, quintal."
  },

  {
    id: 12,
    dia: 12,
    fase: 2,
    titulo: "Observação dos Pensamentos",
    subtitulo: "Separar observador do pensamento",
    duracao: 300,
    categoria: "Meditação",
    dificuldade: "Avançado",
    icone: "eye",
    corCategoria: "#8B5CF6",
    objetivo: "Perceber que você não é seus pensamentos",
    beneficios: ["Liberdade mental", "Menos identificação com mente", "Paz"],
    etapas: [
      {
        duracao: 60,
        titulo: "Postura",
        instrucoes: "Sente-se confortavelmente. Coluna ereta mas relaxada. Respire fundo três vezes."
      },
      {
        duracao: 180,
        titulo: "Observação",
        instrucoes: "Imagine que está sentado à margem de um rio. Cada pensamento que surge é uma folha passando na água. Apenas observe passar. Não se agarre. Não rejeite. Apenas observe."
      },
      {
        duracao: 60,
        titulo: "Reconhecimento",
        instrucoes: "Perceba: há pensamentos (folhas) e há quem observa (você). Você não é o rio. Você é a margem."
      }
    ],
    dica: "O objetivo não é parar pensamentos. É perceber que você não é eles."
  },

  {
    id: 13,
    dia: 13,
    fase: 2,
    titulo: "Perdão Profundo",
    subtitulo: "Trabalhando ressentimentos maiores",
    duracao: 420,
    categoria: "Perdão",
    dificuldade: "Avançado",
    icone: "heart",
    corCategoria: "#10B981",
    objetivo: "Começar processo de perdão em mágoa significativa",
    beneficios: ["Libera dor antiga", "Cura emocional", "Liberdade"],
    etapas: [
      {
        duracao: 60,
        titulo: "Preparação emocional",
        instrucoes: "AVISO: Escolha algo que ainda dói, mas não um trauma profundo. Respire. Você está seguro agora."
      },
      {
        duracao: 180,
        titulo: "Reconhecimento da dor",
        instrucoes: "Permita-se sentir a dor. Não a empurre. Onde você sente no corpo? Como é essa sensação? Respire para ela."
      },
      {
        duracao: 120,
        titulo: "Ver humanidade",
        instrucoes: "Aquela pessoa também sofre. Também tem dor. Isso não justifica o que fez, mas contextualiza. Pessoas machucadas machucam pessoas."
      },
      {
        duracao: 60,
        titulo: "Liberação",
        instrucoes: "Diga mentalmente: 'Eu escolho não carregar mais esse peso. Eu me liberto disso, não por você, mas por mim.' Respire fundo. Solte."
      }
    ],
    dica: "Perdão profundo é processo, não evento. Você pode precisar fazer isso múltiplas vezes. Tudo bem."
  },

  {
    id: 14,
    dia: 14,
    fase: 2,
    titulo: "Celebração de Duas Semanas",
    subtitulo: "Reconhecendo seu comprometimento",
    duracao: 300,
    categoria: "Reflexão",
    dificuldade: "Iniciante",
    icone: "star",
    corCategoria: "#F59E0B",
    objetivo: "Reconhecer e celebrar progresso",
    beneficios: ["Auto-reconhecimento", "Motivação", "Gratidão por si"],
    etapas: [
      {
        duracao: 120,
        titulo: "Olhar para trás",
        instrucoes: "Você completou 14 dias. Isso é significativo. Muitos começam, poucos continuam. Você está aqui. Reconheça isso."
      },
      {
        duracao: 120,
        titulo: "Mudanças sutis",
        instrucoes: "O que mudou em você? Pode ser sutil: está mais consciente? Mais paciente? Respira antes de reagir? Liste 3 pequenas mudanças."
      },
      {
        duracao: 60,
        titulo: "Gratidão a si mesmo",
        instrucoes: "Coloque a mão no coração. Agradeça a si mesmo por se dar essa chance. Por investir em você. Você merece."
      }
    ],
    dica: "Progresso real é quase sempre invisível no começo. Confie no processo."
  },

  // Continuando com mais práticas variadas...

  {
    id: 15,
    dia: 15,
    fase: 2,
    titulo: "Escuta Profunda",
    subtitulo: "Meditação nos sons",
    duracao: 300,
    categoria: "Meditação",
    dificuldade: "Iniciante",
    icone: "ear",
    corCategoria: "#8B5CF6",
    objetivo: "Desenvolver atenção auditiva sem julgamento",
    beneficios: ["Presença", "Reduz tagarelice mental", "Conexão com ambiente"],
    etapas: [
      {
        duracao: 60,
        titulo: "Acomodação",
        instrucoes: "Sente-se confortavelmente. Feche os olhos. Respire três vezes."
      },
      {
        duracao: 180,
        titulo: "Escuta pura",
        instrucoes: "Apenas escute. Sons próximos... sons distantes... Sons altos, baixos... Não categorize ('isso é um carro'). Apenas perceba sons como sensações sonoras puras."
      },
      {
        duracao: 60,
        titulo: "Silêncio interior",
        instrucoes: "Mesmo em meio a sons, perceba o silêncio que contém todos os sons. Você é esse espaço silencioso."
      }
    ],
    dica: "Não existe 'silêncio perfeito'. Use os sons como âncoras, não como distrações."
  },

  {
    id: 16,
    dia: 16,
    fase: 2,
    titulo: "Visualização de Luz",
    subtitulo: "Imaginação guiada curativa",
    duracao: 360,
    categoria: "Visualização",
    dificuldade: "Intermediário",
    icone: "sun",
    corCategoria: "#F59E0B",
    objetivo: "Usar visualização para promover bem-estar",
    beneficios: ["Relaxamento profundo", "Cura emocional", "Paz interior"],
    etapas: [
      {
        duracao: 60,
        titulo: "Preparação",
        instrucoes: "Deite-se ou sente-se confortavelmente. Feche os olhos. Respire profundamente três vezes."
      },
      {
        duracao: 240,
        titulo: "Luz dourada",
        instrucoes: "Imagine uma luz dourada e quente acima da sua cabeça. A cada inspiração, essa luz desce pelo seu corpo. Preenche sua cabeça... pescoço... peito... Dissolve tensões... Aquece áreas de dor... Desce até seus pés."
      },
      {
        duracao: 60,
        titulo: "Integração",
        instrucoes: "Agora você está completamente preenchido por essa luz. Você É essa luz. Respire nessa sensação."
      }
    ],
    dica: "Se não consegue visualizar, apenas sinta. A sensação é mais importante que a imagem."
  },

  {
    id: 17,
    dia: 17,
    fase: 2,
    titulo: "Yoga Nidra Curto",
    subtitulo: "Sono consciente",
    duracao: 480,
    categoria: "Meditação",
    dificuldade: "Intermediário",
    icone: "moon",
    corCategoria: "#8B5CF6",
    objetivo: "Relaxamento profundo consciente",
    beneficios: ["Restauração profunda", "Reduz estresse", "Melhora sono"],
    etapas: [
      {
        duracao: 60,
        titulo: "Postura",
        instrucoes: "Deite-se de costas. Braços ao lado do corpo, palmas para cima. Pernas levemente afastadas. Feche os olhos."
      },
      {
        duracao: 60,
        titulo: "Sankalpa (intenção)",
        instrucoes: "Faça uma intenção curta e positiva. Algo que você quer cultivar. Ex: 'Estou em paz'. Repita 3 vezes mentalmente."
      },
      {
        duracao: 240,
        titulo: "Rotação de consciência",
        instrucoes: "Leve atenção rapidamente: dedo do pé direito... calcanhar... tornozelo... joelho... (suba por todo corpo rapidamente). Não mova, apenas conscientize. Corpo relaxa profundamente."
      },
      {
        duracao: 60,
        titulo: "Retorno",
        instrucoes: "Respire fundo. Mova dedos suavemente. Espreguice. Abra os olhos lentamente."
      },
      {
        duracao: 60,
        titulo: "Sankalpa final",
        instrucoes: "Repita sua intenção 3 vezes. Ela está plantada em você."
      }
    ],
    dica: "É normal adormecer. Se acontecer, tudo bem. Seu subconsciente absorve."
  },

  // Adicionando práticas únicas e criativas...

  {
    id: 18,
    dia: 18,
    fase: 2,
    titulo: "Meditação do Sorriso Interior",
    subtitulo: "Cultivando alegria interna",
    duracao: 300,
    categoria: "Coração",
    dificuldade: "Iniciante",
    icone: "smile",
    corCategoria: "#EC4899",
    objetivo: "Gerar alegria sem motivo externo",
    beneficios: ["Melhora humor", "Libera endorfinas", "Cultiva contentamento"],
    etapas: [
      {
        duracao: 60,
        titulo: "Preparação",
        instrucoes: "Sente-se confortavelmente. Relaxe o rosto completamente, especialmente mandíbula."
      },
      {
        duracao: 180,
        titulo: "Sorriso interno",
        instrucoes: "Deixe um pequeno sorriso formar-se nos lábios. Não forçado, apenas suave. Leve esse sorriso para dentro: imagine sorrir para seu coração... seu estômago... cada órgão... Envie apreciação gentil para seu corpo."
      },
      {
        duracao: 60,
        titulo: "Irradiação",
        instrucoes: "Esse sorriso interno se expande. Preenche todo seu ser. Você é esse sorriso."
      }
    ],
    dica: "Estudos mostram que sorrir, mesmo artificialmente, muda química cerebral. Tente!"
  },

  {
    id: 19,
    dia: 19,
    fase: 2,
    titulo: "Meditação das Mãos",
    subtitulo: "Atenção tátil",
    duracao: 240,
    categoria: "Meditação",
    dificuldade: "Iniciante",
    icone: "hand",
    corCategoria: "#8B5CF6",
    objetivo: "Desenvolver sensibilidade sutil",
    beneficios: ["Presença", "Sensibilidade aumentada", "Calma"],
    etapas: [
      {
        duracao: 60,
        titulo: "Posicionamento",
        instrucoes: "Sente-se. Coloque as mãos em concha, uma de frente para a outra, sem tocar. Cerca de 10cm de distância."
      },
      {
        duracao: 120,
        titulo: "Percepção sutil",
        instrucoes: "Feche os olhos. Sinta a energia entre as mãos. Pode ser calor, formigamento, magnetismo. Aproxime lentamente... afaste... Apenas observe as sensações."
      },
      {
        duracao: 60,
        titulo: "Expansão",
        instrucoes: "Essa mesma energia sutil permeia todo seu corpo. Você só não estava prestando atenção. Agora está."
      }
    ],
    dica: "Não existe certo ou errado. O que você sente é válido, mesmo se for 'nada'."
  },

  {
    id: 20,
    dia: 20,
    fase: 2,
    titulo: "Reflexão da Impermanência",
    subtitulo: "Tudo muda, sempre",
    duracao: 360,
    categoria: "Filosofia",
    dificuldade: "Avançado",
    icone: "clock",
    corCategoria: "#6366F1",
    objetivo: "Contemplar natureza transitória da existência",
    beneficios: ["Perspectiva", "Aceita mudança", "Aprecia presente"],
    etapas: [
      {
        duracao: 120,
        titulo: "Observação externa",
        instrucoes: "Pense em algo que você via como permanente mas mudou: uma amizade que acabou, um emprego que perdeu, um corpo que envelheceu. Tudo muda."
      },
      {
        duracao: 120,
        titulo: "Observação interna",
        instrucoes: "Suas próprias emoções: raiva que passou, alegria que veio e foi, medo que se dissolveu. Até seus pensamentos não ficam. Tudo é passageiro."
      },
      {
        duracao: 120,
        titulo: "Liberdade na impermanência",
        instrucoes: "Se tudo passa, inclusive esse momento difícil, inclusive esse medo... há liberdade nisso. Nada precisa ser eterno para ser valioso."
      }
    ],
    dica: "Impermanência não é depressivo. É libertador. Aprecie o momento porque ele é único."
  },

  // Práticas mais criativas para manter variedade...

  {
    id: 21,
    dia: 21,
    fase: 2,
    titulo: "Celebração de 21 Dias",
    subtitulo: "Você criou um hábito!",
    duracao: 300,
    categoria: "Reflexão",
    dificuldade: "Iniciante",
    icone: "trophy",
    corCategoria: "#F59E0B",
    objetivo: "Celebrar conquista significativa",
    beneficios: ["Auto-reconhecimento", "Motivação", "Consolidação de hábito"],
    etapas: [
      {
        duracao: 120,
        titulo: "Reconhecimento científico",
        instrucoes: "21 dias é o tempo que pesquisas mostram para começar formar um hábito. Você está aqui. Isso não é trivial. Você venceu a inércia inicial."
      },
      {
        duracao: 120,
        titulo: "Transformações observadas",
        instrucoes: "Compare você hoje com você há 21 dias. O que mudou? Como você reage diferente? O que você nota que antes ignorava? Liste internamente."
      },
      {
        duracao: 60,
        titulo: "Compromisso renovado",
        instrucoes: "Pergunta honesta: você quer continuar? Se sim, diga a si mesmo: 'Eu continuo. Não por perfeição, mas por prática.'"
      }
    ],
    dica: "Hábitos se formam pela repetição, não pela perfeição. Continue mesmo quando imperfeito."
  },

  {
    id: 22,
    dia: 22,
    fase: 2,
    titulo: "Respiração Alternada",
    subtitulo: "Nadi Shodhana",
    duracao: 300,
    categoria: "Respiração",
    dificuldade: "Avançado",
    icone: "wind",
    corCategoria: "#60A5FA",
    objetivo: "Equilibrar hemisférios cerebrais",
    beneficios: ["Equilíbrio mental", "Calma profunda", "Clareza"],
    etapas: [
      {
        duracao: 60,
        titulo: "Postura e preparação",
        instrucoes: "Sente-se ereto. Relaxe ombros. Use mão direita: polegar fecha narina direita, anelar fecha esquerda."
      },
      {
        duracao: 180,
        titulo: "Alternância",
        instrucoes: "Feche narina direita. Inspire pela esquerda (4). Feche esquerda. Expire pela direita (4). Inspire pela direita (4). Feche direita. Expire pela esquerda (4). Isso é um ciclo completo. Repita."
      },
      {
        duracao: 60,
        titulo: "Integração",
        instrucoes: "Solte as mãos. Respire livremente. Sinta equilíbrio interno."
      }
    ],
    dica: "Se confundir, não tem problema. Rir de si mesmo também é prática espiritual!"
  },

  {
    id: 23,
    dia: 23,
    fase: 2,
    titulo: "Meditação Amorosa-Bondade",
    subtitulo: "Metta Bhavana",
    duracao: 420,
    categoria: "Coração",
    dificuldade: "Intermediário",
    icone: "heart",
    corCategoria: "#EC4899",
    objetivo: "Cultivar amor incondicional",
    beneficios: ["Aumenta compaixão", "Reduz raiva", "Conexão universal"],
    etapas: [
      {
        duracao: 60,
        titulo: "Para si mesmo",
        instrucoes: "Coloque mão no coração. Diga mentalmente: 'Que eu seja feliz. Que eu esteja em paz. Que eu seja livre de sofrimento.' Sinta genuinamente."
      },
      {
        duracao: 90,
        titulo: "Para pessoa amada",
        instrucoes: "Pense em alguém que você ama. Veja o rosto. Envie: 'Que você seja feliz. Que você esteja em paz. Que você seja livre de sofrimento.'"
      },
      {
        duracao: 90,
        titulo: "Para pessoa neutra",
        instrucoes: "Alguém que você vê mas não conhece (caixa de mercado, vizinho). Mesmo desejo: 'Que você seja feliz...'"
      },
      {
        duracao: 90,
        titulo: "Para pessoa difícil",
        instrucoes: "Alguém que te irritou. Não precisa gostar dela. Apenas deseje bem: 'Que você seja feliz. Que você esteja em paz.' Pode ser difícil. Tente."
      },
      {
        duracao: 90,
        titulo: "Para todos os seres",
        instrucoes: "Expanda: 'Que todos os seres sejam felizes. Que todos estejam em paz. Que todos sejam livres de sofrimento.' Sinta conexão universal."
      }
    ],
    dica: "Não precisa sentir amor imediato pela pessoa difícil. A intenção planta sementes."
  },

  // ========== FASE 3: CONSCIÊNCIA (Dias 24-30) ==========

  {
    id: 24,
    dia: 24,
    fase: 3,
    titulo: "Contemplação da Morte",
    subtitulo: "Maranasati - memento mori",
    duracao: 360,
    categoria: "Filosofia",
    dificuldade: "Avançado",
    icone: "skull",
    corCategoria: "#6366F1",
    objetivo: "Usar impermanência final para viver melhor",
    beneficios: ["Priorização de valores", "Reduz trivialidades", "Aprecia vida"],
    etapas: [
      {
        duracao: 120,
        titulo: "Reconhecimento",
        instrucoes: "Você vai morrer. Eu vou morrer. Todos que amamos vão morrer. Isso não é mórbido - é realidade. Respire com isso."
      },
      {
        duracao: 120,
        titulo: "Últimos dias",
        instrucoes: "Se você tivesse 1 mês de vida, o que mudaria hoje? Com quem falaria? O que deixaria de se preocupar? O que faria diferente?"
      },
      {
        duracao: 120,
        titulo: "Viver plenamente agora",
        instrucoes: "Você não tem 1 mês. Você não sabe quanto tem. Isso torna cada dia precioso. Como você quer viver HOJE sabendo que é finito?"
      }
    ],
    dica: "Mestres espirituais usam contemplação da morte não para deprimir, mas para viver plenamente."
  },

  {
    id: 25,
    dia: 25,
    fase: 3,
    titulo: "Meditação do Vazio",
    subtitulo: "Shunya - o espaço entre",
    duracao: 480,
    categoria: "Meditação",
    dificuldade: "Avançado",
    icone: "circle",
    corCategoria: "#8B5CF6",
    objetivo: "Perceber o espaço consciente",
    beneficios: ["Paz profunda", "Transcende ego", "Liberdade"],
    etapas: [
      {
        duracao: 120,
        titulo: "Preparação profunda",
        instrucoes: "Sente-se. Respire até relaxar completamente. Não há pressa. Você tem todo o tempo."
      },
      {
        duracao: 240,
        titulo: "Percebendo o vazio",
        instrucoes: "Observe espaço entre pensamentos... Silêncio entre sons... Pausa entre inspiração e expiração... Esse espaço não é 'nada'. É consciência pura. É você antes de qualquer forma."
      },
      {
        duracao: 120,
        titulo: "Repouso no vazio",
        instrucoes: "Não faça nada. Apenas seja esse espaço consciente. Pensamentos vêm e vão nesse espaço. Você é o espaço, não o conteúdo."
      }
    ],
    dica: "Esta é prática avançada. Se parecer abstrato demais, volte para respiração."
  },

  {
    id: 26,
    dia: 26,
    fase: 3,
    titulo: "Prática da Presença Radical",
    subtitulo: "Aqui e agora intensamente",
    duracao: 300,
    categoria: "Meditação",
    dificuldade: "Intermediário",
    icone: "crosshair",
    corCategoria: "#8B5CF6",
    objetivo: "Estar 100% presente em cada sensação",
    beneficios: ["Presença intensificada", "Fim ruminação", "Vitalidade"],
    etapas: [
      {
        duracao: 60,
        titulo: "Ancoragem total",
        instrucoes: "Sente-se. Sinta peso do corpo na cadeira... temperatura do ar na pele... sons ao redor... Não pense SOBRE sensações, SINTA diretamente."
      },
      {
        duracao: 180,
        titulo: "Presente radical",
        instrucoes: "Cada segundo, pergunte: 'Estou aqui agora?' Se mente divagou, não há problema. Volte. 'Estou aqui agora?' Corpo... respiração... sons... Agora. Agora. Agora."
      },
      {
        duracao: 60,
        titulo: "Reconhecimento",
        instrucoes: "Quando você está verdadeiramente presente, não há problema. Problemas vivem no passado e futuro. AGORA, neste segundo, está tudo bem."
      }
    ],
    dica: "Eckhart Tolle: 'Realize profundamente que o momento presente é tudo que você tem.'"
  },

  {
    id: 27,
    dia: 27,
    fase: 3,
    titulo: "Desidentificação do Ego",
    subtitulo: "Quem sou eu realmente?",
    duracao: 420,
    categoria: "Filosofia",
    dificuldade: "Avançado",
    icone: "user-x",
    corCategoria: "#6366F1",
    objetivo: "Questionar construção do 'eu'",
    beneficios: ["Liberdade do ego", "Menos sofrimento", "Paz profunda"],
    etapas: [
      {
        duracao: 120,
        titulo: "Investigação",
        instrucoes: "Você não é seu corpo (ele muda constantemente). Você não é suas emoções (elas vêm e vão). Você não é seus pensamentos (você os observa). Então quem é você?"
      },
      {
        duracao: 180,
        titulo: "Observador",
        instrucoes: "Há algo em você que observa tudo isso. Observa corpo, emoções, pensamentos. Esse observador... é sempre o mesmo. Calmo. Presente. Esse é você?"
      },
      {
        duracao: 120,
        titulo: "Descanso",
        instrucoes: "Descanse como esse observador silencioso. Não é vazio. É plenitude. É paz. É consciência pura."
      }
    ],
    dica: "Ramana Maharshi passou vida perguntando 'Quem sou eu?'. É pergunta libertadora."
  },

  {
    id: 28,
    dia: 28,
    fase: 3,
    titulo: "Integração Corpo-Mente-Espírito",
    subtitulo: "União das dimensões",
    duracao: 360,
    categoria: "Meditação",
    dificuldade: "Intermediário",
    icone: "layers",
    corCategoria: "#8B5CF6",
    objetivo: "Perceber unidade de todas dimensões",
    beneficios: ["Wholeness", "Integração", "Harmonia interna"],
    etapas: [
      {
        duracao: 120,
        titulo: "Corpo",
        instrucoes: "Sinta seu corpo. Peso, temperatura, batimento cardíaco. Agradeça. Você É corpo."
      },
      {
        duracao: 120,
        titulo: "Mente",
        instrucoes: "Perceba pensamentos surgindo. A mente que pensa, planeja, lembra. Agradeça. Você É mente."
      },
      {
        duracao: 120,
        titulo: "Espírito",
        instrucoes: "Perceba a consciência que testemunha corpo e mente. O ser que simplesmente É. Agradeça. Você É espírito. E você é TUDO isso, integrado, uno."
      }
    ],
    dica: "Não são partes separadas. São dimensões da mesma realidade: você."
  },

  {
    id: 29,
    dia: 29,
    fase: 3,
    titulo: "Meditação do Serviço",
    subtitulo: "Seva - ação altruísta",
    duracao: 300,
    categoria: "Serviço",
    dificuldade: "Intermediário",
    icone: "users",
    corCategoria: "#10B981",
    objetivo: "Preparar coração para servir",
    beneficios: ["Propósito", "Conexão", "Alegria altruísta"],
    etapas: [
      {
        duracao: 120,
        titulo: "Reconhecer interconexão",
        instrucoes: "Tudo que você tem - comida, roupa, teto - veio do trabalho de outros. Você depende de incontáveis pessoas. Todos dependem de todos."
      },
      {
        duracao: 120,
        titulo: "Impulso de dar",
        instrucoes: "Naturalmente, surge desejo de retribuir. Como você pode servir? Não precisa ser grande. Pequenos atos contam: um sorriso, uma escuta, uma ajuda."
      },
      {
        duracao: 60,
        titulo: "Compromisso",
        instrucoes: "Comprometa-se: esta semana, farei 1 ato de serviço genuíno. Sem esperar reconhecimento. Apenas por servir."
      }
    ],
    dica: "Servir sem ego é uma das práticas espirituais mais poderosas."
  },

  {
    id: 30,
    dia: 30,
    fase: 3,
    titulo: "Celebração de 30 Dias",
    subtitulo: "Você chegou aqui!",
    duracao: 420,
    categoria: "Reflexão",
    dificuldade: "Iniciante",
    icone: "award",
    corCategoria: "#F59E0B",
    objetivo: "Celebrar jornada completa de 30 dias",
    beneficios: ["Fechamento de ciclo", "Reconhecimento", "Preparação próxima fase"],
    etapas: [
      {
        duracao: 120,
        titulo: "Reconhecimento profundo",
        instrucoes: "30 dias. Você fez isso. Muitos desistem. Você persistiu. Isso diz algo fundamental sobre você: você é capaz de mudança."
      },
      {
        duracao: 120,
        titulo: "Transformação real",
        instrucoes: "Você não é a mesma pessoa de 30 dias atrás. Algo mudou. Pode ser sutil, mas é real. Como você se relaciona com você mesmo? Com outros? Com desafios?"
      },
      {
        duracao: 120,
        titulo: "Próximo capítulo",
        instrucoes: "Isso não é fim. É início. Você construiu fundação. Agora aprofunda. Fase 4 te espera: Serviço. Transformar sua evolução em impacto no mundo."
      },
      {
        duracao: 60,
        titulo: "Gratidão final",
        instrucoes: "Agradeça a si mesmo. Agradeça a cada prática. Agradeça aos desafios que te trouxeram aqui. Você merece celebrar."
      }
    ],
    dica: "Evolução real nunca é linear, mas com 30 dias de prática, você mudou. Confie nisso."
  }
];

// Função helper para obter prática por dia
export function getPraticaDoDia(dia) {
  return PRATICAS_BIBLIOTECA.find(p => p.dia === dia) || PRATICAS_BIBLIOTECA[0];
}

// Função helper para obter práticas por fase
export function getPraticasPorFase(fase) {
  return PRATICAS_BIBLIOTECA.filter(p => p.fase === fase);
}

// Função helper para obter prática aleatória de uma categoria
export function getPraticaAleatoria(categoria) {
  const praticasCategoria = PRATICAS_BIBLIOTECA.filter(p => p.categoria === categoria);
  return praticasCategoria[Math.floor(Math.random() * praticasCategoria.length)];
}
