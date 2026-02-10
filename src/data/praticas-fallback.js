// ================================================
// PRÁTICAS FALLBACK - Modo Offline
// ================================================
// Essas práticas são usadas quando o Supabase não está disponível
// ou durante o desenvolvimento local

export const PRATICAS_FALLBACK = [
  {
    id: 'resp-1',
    nome: 'Respiração Consciente',
    descricao: 'Concentre-se na sua respiração por 3 minutos. Inspire profundamente pelo nariz contando até 4, segure por 4 segundos, e expire lentamente pela boca contando até 6.',
    tipo: 'respiracao',
    duracao: 180,
    fase_minima: 1,
    categoria: 'Respiração',
    dificuldade: 'Iniciante',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
    beneficios: ['Reduz ansiedade', 'Aumenta foco', 'Acalma a mente']
  },
  {
    id: 'grat-1',
    nome: 'Gratidão Diária',
    descricao: 'Liste 3 coisas pelas quais você é grato hoje. Reflita sobre por que cada uma delas é importante para você.',
    tipo: 'gratidao',
    duracao: 300,
    fase_minima: 1,
    categoria: 'Gratidão',
    dificuldade: 'Iniciante',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3588/3588435.png',
    beneficios: ['Melhora humor', 'Aumenta positividade', 'Reduz estresse']
  },
  {
    id: 'int-1',
    nome: 'Intenção do Dia',
    descricao: 'Defina sua intenção principal para hoje. O que você quer focar? Como você quer se sentir?',
    tipo: 'intencao',
    duracao: 180,
    fase_minima: 1,
    categoria: 'Propósito',
    dificuldade: 'Iniciante',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2917/2917641.png',
    beneficios: ['Clareza mental', 'Ações alinhadas', 'Propósito diário']
  },
  {
    id: 'med-1',
    nome: 'Meditação Guiada',
    descricao: 'Sente-se confortavelmente e observe seus pensamentos sem julgamento. Foque no momento presente.',
    tipo: 'meditacao',
    duracao: 600,
    fase_minima: 2,
    categoria: 'Meditação',
    dificuldade: 'Intermediário',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3588/3588592.png',
    beneficios: ['Paz interior', 'Autoconhecimento', 'Reduz ansiedade']
  },
  {
    id: 'refl-1',
    nome: 'Reflexão Semanal',
    descricao: 'Reflita sobre sua semana. O que aprendeu? O que pode melhorar? Quais foram seus sucessos?',
    tipo: 'reflexao',
    duracao: 900,
    fase_minima: 2,
    categoria: 'Reflexão',
    dificuldade: 'Intermediário',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2917/2917722.png',
    beneficios: ['Autoconhecimento', 'Crescimento pessoal', 'Clareza']
  }
]

export default PRATICAS_FALLBACK
