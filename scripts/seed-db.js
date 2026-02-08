#!/usr/bin/env node
/**
 * Script para fazer seed do banco de dados
 * Popula o banco com dados iniciais (práticas de exemplo)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar definidos no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Práticas de exemplo para seed
 */
const PRATICAS_SEED = [
  {
    titulo: 'Respiração 4-7-8',
    subtitulo: 'A base de tudo',
    fase: 1,
    categoria: 'Respiração',
    duracao_min: 3,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 30,
        titulo: 'Preparação',
        instrucoes: 'Encontre uma posição confortável. Pode ser sentado ou deitado. Feche os olhos suavemente.'
      },
      {
        duracao: 150,
        titulo: 'Respiração 4-7-8',
        instrucoes: 'Inspire profundamente pelo nariz contando até 4... Segure o ar por 7 segundos... Expire lentamente pela boca contando até 8... Repita este ciclo, observando cada respiração sem julgar.'
      }
    ]),
    ordem: 1,
    dificuldade: 'Iniciante',
    icone: 'wind',
    cor_categoria: '#60A5FA',
    objetivo: 'Aprender a ancorar-se no presente através da respiração',
    beneficios: ['Reduz ansiedade', 'Aumenta foco', 'Acalma mente'],
    dica: 'Se sua mente vagar, gentilmente traga sua atenção de volta para a respiração. É normal e esperado.'
  },
  {
    titulo: 'Intenção do Dia',
    subtitulo: 'Definindo seu norte',
    fase: 1,
    categoria: 'Propósito',
    duracao_min: 4,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Centramento',
        instrucoes: 'Respire profundamente três vezes. Deixe o corpo relaxar. Sinta-se presente neste momento.'
      },
      {
        duracao: 120,
        titulo: 'Definição',
        instrucoes: 'Pergunte a si mesmo: Qual é minha intenção para hoje? Pode ser uma qualidade (paciência, gentileza), uma ação (ouvir mais, julgar menos) ou um foco (estar presente com minha família).'
      },
      {
        duracao: 60,
        titulo: 'Ancoragem',
        instrucoes: 'Visualize seu dia fluindo com essa intenção. Sinta em seu corpo a energia dessa escolha. Essa é sua âncora para o dia.'
      }
    ]),
    ordem: 2,
    dificuldade: 'Iniciante',
    icone: 'compass',
    cor_categoria: '#F59E0B',
    objetivo: 'Estabelecer uma direção consciente para o dia',
    beneficios: ['Clareza mental', 'Ações alinhadas', 'Propósito diário'],
    dica: 'Escreva sua intenção em algum lugar visível. Revisite-a durante o dia.'
  },
  {
    titulo: 'Gratidão Profunda',
    subtitulo: 'Reconhecendo o que há',
    fase: 1,
    categoria: 'Coração',
    duracao_min: 4,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Preparação do coração',
        instrucoes: 'Coloque uma mão no coração. Respire fundo. Sinta o calor da sua mão.'
      },
      {
        duracao: 120,
        titulo: 'Três gratidões',
        instrucoes: 'Pense em 3 coisas pelas quais você é grato HOJE. Não podem ser genéricas. Busque especificidade: o café quente esta manhã, o sorriso do meu filho, ter acordado sem dor.'
      },
      {
        duracao: 60,
        titulo: 'Sentir',
        instrucoes: 'Não apenas liste. SINTA cada gratidão. Deixe o sentimento de apreciação se expandir pelo seu corpo. Respire essa sensação.'
      }
    ]),
    ordem: 3,
    dificuldade: 'Iniciante',
    icone: 'heart',
    cor_categoria: '#EC4899',
    objetivo: 'Cultivar gratidão genuína, não mecânica',
    beneficios: ['Melhora humor', 'Muda perspectiva', 'Aumenta satisfação'],
    dica: 'Gratidão genuína é sentida no corpo, não apenas pensada na mente.'
  },
  {
    titulo: 'Meditação Guiada',
    subtitulo: 'Silêncio interior',
    fase: 2,
    categoria: 'Meditação',
    duracao_min: 10,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 120,
        titulo: 'Preparação',
        instrucoes: 'Sente-se confortavelmente com a coluna ereta. Feche os olhos. Deixe o corpo relaxar completamente.'
      },
      {
        duracao: 420,
        titulo: 'Observação',
        instrucoes: 'Observe sua respiração natural, sem controlá-la. Note como o ar entra e sai. Quando pensamentos surgirem, apenas observe-os e volte gentilmente para a respiração.'
      },
      {
        duracao: 60,
        titulo: 'Encerramento',
        instrucoes: 'Respire fundo 3 vezes. Mova suavemente dedos e mãos. Abra os olhos lentamente. Note como se sente.'
      }
    ]),
    ordem: 1,
    dificuldade: 'Intermediário',
    icone: 'brain',
    cor_categoria: '#6B46C1',
    objetivo: 'Desenvolver capacidade de observar a mente sem julgar',
    beneficios: ['Reduz estresse', 'Aumenta clareza', 'Melhora foco'],
    dica: 'Não tente esvaziar a mente. O objetivo é observar, não controlar.'
  },
  {
    titulo: 'Body Scan',
    subtitulo: 'Conexão corpo-mente',
    fase: 2,
    categoria: 'Consciência Corporal',
    duracao_min: 8,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Preparação',
        instrucoes: 'Deite-se ou sente-se confortavelmente. Feche os olhos. Respire fundo 3 vezes.'
      },
      {
        duracao: 360,
        titulo: 'Varredura',
        instrucoes: 'Comece pelos pés. Sinta cada parte do corpo por alguns segundos: pés, pernas, quadris, abdômen, peito, mãos, braços, ombros, pescoço, rosto. Apenas observe as sensações sem julgar.'
      },
      {
        duracao: 60,
        titulo: 'Integração',
        instrucoes: 'Sinta seu corpo como um todo. Respire profundamente. Agradeça ao seu corpo por tudo que ele faz por você.'
      }
    ]),
    ordem: 2,
    dificuldade: 'Intermediário',
    icone: 'user',
    cor_categoria: '#8B5CF6',
    objetivo: 'Desenvolver consciência corporal e detectar tensões',
    beneficios: ['Reduz tensão', 'Aumenta autoconsciência', 'Melhora sono'],
    dica: 'Não force relaxamento. Apenas observe onde há tensão, sem julgamento.'
  },
  {
    titulo: 'Visualização Positiva',
    subtitulo: 'Criando o futuro desejado',
    fase: 2,
    categoria: 'Imaginação',
    duracao_min: 5,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Centramento',
        instrucoes: 'Respire profundamente. Relaxe corpo e mente. Sinta-se presente e calmo.'
      },
      {
        duracao: 180,
        titulo: 'Visualização',
        instrucoes: 'Imagine-se vivendo seu dia ideal. Veja as cores, ouça os sons, sinta as emoções positivas. Seja específico: como você age, como se sente, como interage com os outros.'
      },
      {
        duracao: 60,
        titulo: 'Ancoragem',
        instrucoes: 'Escolha uma palavra ou imagem dessa visualização. Respire profundamente e sinta essa sensação positiva em seu corpo.'
      }
    ]),
    ordem: 3,
    dificuldade: 'Intermediário',
    icone: 'eye',
    cor_categoria: '#14B8A6',
    objetivo: 'Programar a mente para resultados positivos',
    beneficios: ['Aumenta motivação', 'Clarifica objetivos', 'Melhora humor'],
    dica: 'Visualização funciona melhor quando você realmente SENTE as emoções, não apenas imagina.'
  },
  {
    titulo: 'Loving-Kindness (Metta)',
    subtitulo: 'Cultivando compaixão',
    fase: 3,
    categoria: 'Compaixão',
    duracao_min: 10,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Preparação',
        instrucoes: 'Sente-se confortavelmente. Respire fundo. Coloque uma mão no coração.'
      },
      {
        duracao: 480,
        titulo: 'Frases de Metta',
        instrucoes: 'Repita mentalmente: Que eu seja feliz. Que eu seja saudável. Que eu esteja em paz. Depois, estenda para outros: um ente querido, uma pessoa neutra, alguém difícil, todos os seres.'
      },
      {
        duracao: 60,
        titulo: 'Integração',
        instrucoes: 'Sinta a expansão do seu coração. Respire essa sensação de bondade universal.'
      }
    ]),
    ordem: 1,
    dificuldade: 'Avançado',
    icone: 'heart',
    cor_categoria: '#F43F5E',
    objetivo: 'Desenvolver compaixão por si mesmo e pelos outros',
    beneficios: ['Reduz raiva', 'Aumenta empatia', 'Melhora relacionamentos'],
    dica: 'Se for difícil desejar bem a alguém difícil, comece com você mesmo e vá expandindo gradualmente.'
  },
  {
    titulo: 'Caminhada Consciente',
    subtitulo: 'Meditação em movimento',
    fase: 3,
    categoria: 'Movimento',
    duracao_min: 15,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Preparação',
        instrucoes: 'Escolha um local tranquilo para caminhar. Pode ser dentro de casa ou ao ar livre.'
      },
      {
        duracao: 780,
        titulo: 'Caminhada',
        instrucoes: 'Caminhe lentamente. Sinta cada passo: o pé levantando, movendo, tocando o chão. Observe as sensações no corpo. Se a mente vagar, volte para as sensações dos pés tocando o chão.'
      },
      {
        duracao: 60,
        titulo: 'Encerramento',
        instrucoes: 'Pare. Respire fundo. Note como se sente. Agradeça a si mesmo por esse momento de presença.'
      }
    ]),
    ordem: 2,
    dificuldade: 'Avançado',
    icone: 'footprints',
    cor_categoria: '#10B981',
    objetivo: 'Trazer mindfulness para atividades cotidianas',
    beneficios: ['Reduz ansiedade', 'Aumenta presença', 'Melhora humor'],
    dica: 'Não precisa ser rápido. O objetivo é presença, não exercício físico.'
  },
  {
    titulo: 'Diário de Insights',
    subtitulo: 'Capturando sabedoria',
    fase: 3,
    categoria: 'Reflexão',
    duracao_min: 10,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 120,
        titulo: 'Reflexão Guiada',
        instrucoes: 'Respire fundo. Pergunte a si mesmo: Que padrão notei em mim hoje? Que insight tive sobre minha vida? O que aprendi sobre mim mesmo?'
      },
      {
        duracao: 420,
        titulo: 'Escrita Livre',
        instrucoes: 'Escreva livremente suas reflexões. Não julgue, não edite. Deixe os pensamentos fluírem para o papel ou tela.'
      },
      {
        duracao: 60,
        titulo: 'Síntese',
        instrucoes: 'Releia o que escreveu. Circule ou destaque uma frase que ressoa. Essa é sua sabedoria do dia.'
      }
    ]),
    ordem: 3,
    dificuldade: 'Avançado',
    icone: 'book-open',
    cor_categoria: '#F59E0B',
    objetivo: 'Desenvolver autoconsciência através da escrita reflexiva',
    beneficios: ['Aumenta clareza', 'Processa emoções', 'Revela padrões'],
    dica: 'Não precisa ser perfeito ou profundo. O simples ato de escrever já traz insights.'
  },
  {
    titulo: 'Micro-ato de Bondade',
    subtitulo: 'Pequenos gestos, grande impacto',
    fase: 3,
    categoria: 'Serviço',
    duracao_min: 5,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Intenção',
        instrucoes: 'Respire fundo. Conecte-se com sua intenção de fazer o bem, por menor que seja o gesto.'
      },
      {
        duracao: 180,
        titulo: 'Ação',
        instrucoes: 'Faça um pequeno ato de bondade: um elogio sincero, ajudar alguém, doar algo, sorrir para um estranho, enviar uma mensagem carinhosa.'
      },
      {
        duracao: 60,
        titulo: 'Reflexão',
        instrucoes: 'Note como você se sente. A bondade beneficia quem dá tanto quanto quem recebe.'
      }
    ]),
    ordem: 4,
    dificuldade: 'Intermediário',
    icone: 'gift',
    cor_categoria: '#10B981',
    objetivo: 'Cultivar a prática do serviço desinteressado',
    beneficios: ['Aumenta felicidade', 'Cria conexões', 'Dá propósito'],
    dica: 'Não precisa ser grande. O impacto está na intenção sincera, não no tamanho do gesto.'
  }
];

async function seedPraticas() {
  console.log('🌱 Iniciando seed de práticas...\n');

  try {
    // 1. Verificar se a tabela existe
    const { error: checkError } = await supabase
      .from('praticas')
      .select('count')
      .limit(1);

    if (checkError) {
      console.error('❌ Erro: Tabela "praticas" não existe.');
      console.log('💡 Execute primeiro a migration: database/migration-praticas-table.sql\n');
      process.exit(1);
    }

    // 2. Limpar práticas existentes (opcional - comentar se não quiser limpar)
    console.log('🗑️  Limpando práticas existentes...');
    const { error: deleteError } = await supabase
      .from('praticas')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn('⚠️  Aviso ao limpar:', deleteError.message);
    }

    // 3. Inserir práticas
    console.log(`📝 Inserindo ${PRATICAS_SEED.length} práticas...\n`);
    
    for (const pratica of PRATICAS_SEED) {
      const { data, error } = await supabase
        .from('praticas')
        .insert([pratica])
        .select();

      if (error) {
        console.error(`❌ Erro ao inserir "${pratica.titulo}":`, error.message);
      } else {
        console.log(`✅ Inserida: ${pratica.titulo} (Fase ${pratica.fase}, ${pratica.duracao_min}min)`);
      }
    }

    // 4. Verificar resultado
    console.log('\n📊 Verificando práticas inseridas...');
    const { data: praticas, error: countError } = await supabase
      .from('praticas')
      .select('fase, ordem, titulo, categoria, duracao_min')
      .order('fase')
      .order('ordem');

    if (countError) {
      console.error('❌ Erro ao verificar:', countError.message);
    } else {
      console.log(`\n✅ Total de práticas: ${praticas.length}\n`);
      
      // Agrupar por fase
      const porFase = praticas.reduce((acc, p) => {
        acc[p.fase] = (acc[p.fase] || 0) + 1;
        return acc;
      }, {});

      console.log('📈 Práticas por fase:');
      Object.entries(porFase).forEach(([fase, count]) => {
        console.log(`   Fase ${fase}: ${count} práticas`);
      });
    }

    console.log('\n✨ Seed concluído com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro durante seed:', error);
    process.exit(1);
  }
}

// Executar seed
seedPraticas();
