// ================================================
// BIBLIOTECA DE MICRO-ATOS DE BONDADE
// ================================================
// 60+ micro-atos categorizados para seleção diária

export const CATEGORIAS_MICRO_ATOS = {
  BONDADE: 'bondade',
  PERDAO: 'perdao',
  GENEROSIDADE: 'generosidade',
  PRESENCA: 'presenca',
  SERVICO: 'servico',
  GRATIDAO: 'gratidao'
};

export const microAtosLibrary = {
  bondade: {
    titulo: 'Bondade',
    emoji: '💝',
    cor: '#EC4899', // rosa
    atos: [
      'Enviar uma mensagem carinhosa para alguém que você não fala há tempo',
      'Fazer um elogio sincero a um desconhecido',
      'Segurar a porta para alguém que vem atrás',
      'Dar um abraço genuíno em alguém querido',
      'Oferecer ajuda a um colega sobrecarregado',
      'Levar um café ou lanche para alguém',
      'Sorrir genuinamente para pessoas na rua',
      'Perguntar "como você está?" e realmente ouvir a resposta',
      'Compartilhar algo que você tem com alguém que precisa',
      'Deixar uma nota de agradecimento para alguém'
    ]
  },
  
  perdao: {
    titulo: 'Perdão',
    emoji: '🕊️',
    cor: '#6B46C1', // roxo
    atos: [
      'Liberar um ressentimento que você está carregando',
      'Pedir desculpas por algo que você fez errado',
      'Escolher não responder com raiva a uma provocação',
      'Entrar em contato com alguém que você magoou',
      'Perdoar-se por um erro do passado',
      'Aceitar as limitações de alguém sem julgamento',
      'Deixar ir uma mágoa pequena do dia',
      'Agradecer a alguém por ter te perdoado',
      'Escolher compreensão ao invés de julgamento',
      'Soltar a necessidade de estar certo em uma discussão'
    ]
  },
  
  generosidade: {
    titulo: 'Generosidade',
    emoji: '🎁',
    cor: '#F59E0B', // âmbar
    atos: [
      'Doar algo que você não usa mais',
      'Compartilhar conhecimento com alguém',
      'Dar uma gorjeta generosa',
      'Pagar o café de alguém na fila',
      'Compartilhar uma oportunidade com outra pessoa',
      'Emprestar algo valioso para você',
      'Oferecer seu tempo para ajudar alguém',
      'Doar para uma causa em que você acredita',
      'Compartilhar comida com quem tem fome',
      'Dar crédito a alguém pelo trabalho deles'
    ]
  },
  
  presenca: {
    titulo: 'Presença',
    emoji: '🧘',
    cor: '#8B5CF6', // violeta
    atos: [
      'Guardar o celular durante uma conversa',
      'Olhar nos olhos de alguém enquanto conversam',
      'Ouvir sem interromper ou dar conselhos',
      'Passar 10 minutos de qualidade com alguém',
      'Observar a natureza por 5 minutos',
      'Comer uma refeição sem distrações',
      'Fazer uma caminhada prestando atenção ao redor',
      'Brincar de forma presente com uma criança ou pet',
      'Meditar mesmo que por 3 minutos',
      'Respirar conscientemente 10 vezes seguidas'
    ]
  },
  
  servico: {
    titulo: 'Serviço',
    emoji: '🤝',
    cor: '#10B981', // verde
    atos: [
      'Fazer uma tarefa doméstica que não é sua',
      'Ajudar alguém com tecnologia',
      'Organizar algo que beneficia outras pessoas',
      'Voluntariar seu tempo em alguma causa',
      'Ensinar algo útil para alguém',
      'Fazer uma tarefa desagradável para aliviar outro',
      'Cuidar de algo para facilitar a vida de alguém',
      'Oferecer carona para alguém',
      'Ajudar um vizinho idoso',
      'Limpar algo em espaço compartilhado'
    ]
  },
  
  gratidao: {
    titulo: 'Gratidão',
    emoji: '🙏',
    cor: '#F97316', // laranja
    atos: [
      'Agradecer verbalmente a três pessoas hoje',
      'Escrever uma carta de gratidão',
      'Reconhecer algo bom que alguém fez',
      'Agradecer por algo "pequeno" que você tem',
      'Dizer "obrigado" com mais presença',
      'Compartilhar publicamente sua gratidão por alguém',
      'Agradecer por um desafio que te fez crescer',
      'Reconhecer o esforço de alguém em voz alta',
      'Expressar gratidão por estar vivo hoje',
      'Agradecer a si mesmo por algo que fez bem'
    ]
  }
};

/**
 * Obter todos os micro-atos de todas as categorias
 */
export const getTodosMicroAtos = () => {
  const todosAtos = [];
  
  Object.keys(microAtosLibrary).forEach(categoria => {
    const { atos, titulo, emoji, cor } = microAtosLibrary[categoria];
    atos.forEach(ato => {
      todosAtos.push({
        descricao: ato,
        categoria,
        categoriaLabel: titulo,
        emoji,
        cor
      });
    });
  });
  
  return todosAtos;
};

/**
 * Obter micro-atos por categoria
 */
export const getMicroAtosPorCategoria = (categoria) => {
  const cat = microAtosLibrary[categoria];
  if (!cat) return [];
  
  return cat.atos.map(ato => ({
    descricao: ato,
    categoria,
    categoriaLabel: cat.titulo,
    emoji: cat.emoji,
    cor: cat.cor
  }));
};

/**
 * Obter um micro-ato aleatório
 */
export const getMicroAtoAleatorio = (categoria = null) => {
  if (categoria) {
    const atos = getMicroAtosPorCategoria(categoria);
    return atos[Math.floor(Math.random() * atos.length)];
  }
  
  const todosAtos = getTodosMicroAtos();
  return todosAtos[Math.floor(Math.random() * todosAtos.length)];
};

/**
 * Obter categorias disponíveis
 */
export const getCategorias = () => {
  return Object.keys(microAtosLibrary).map(key => ({
    id: key,
    titulo: microAtosLibrary[key].titulo,
    emoji: microAtosLibrary[key].emoji,
    cor: microAtosLibrary[key].cor,
    total: microAtosLibrary[key].atos.length
  }));
};

/**
 * Recomendar micro-ato baseado na fase do usuário
 */
export const recomendarMicroAtoPorFase = (fase, historico = []) => {
  const recomendacoesPorFase = {
    1: ['bondade', 'gratidao'], // Despertar - foco em básico
    2: ['servico', 'generosidade', 'bondade'], // Disciplina - ação no mundo
    3: ['presenca', 'perdao', 'gratidao'], // Consciência - profundidade
    4: ['servico', 'generosidade', 'perdao'] // Serviço - impacto amplo
  };
  
  const categoriasRecomendadas = recomendacoesPorFase[fase] || recomendacoesPorFase[1];
  
  // Evitar categorias já usadas recentemente
  const categoriasRecentes = historico
    .slice(0, 3)
    .map(h => h.tipo)
    .filter(Boolean);
  
  const categoriasDisponiveis = categoriasRecomendadas.filter(
    cat => !categoriasRecentes.includes(cat)
  );
  
  const categoria = categoriasDisponiveis.length > 0
    ? categoriasDisponiveis[Math.floor(Math.random() * categoriasDisponiveis.length)]
    : categoriasRecomendadas[0];
  
  return getMicroAtoAleatorio(categoria);
};

export default microAtosLibrary;
