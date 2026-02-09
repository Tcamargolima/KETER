#!/usr/bin/env node
/**
 * Script para fazer seed do banco de dados em PRODUÇÃO
 * Execute apenas uma vez após o deploy inicial
 * 
 * ATENÇÃO: Este script ADICIONA dados, não reseta o banco!
 * Para reset completo, use reset-db.js (apenas em dev/staging)
 * 
 * Uso:
 *   node scripts/seed-prod.js
 * 
 * Requisitos:
 *   - VITE_SUPABASE_URL configurado
 *   - SUPABASE_SERVICE_KEY configurado (chave de serviço, não anon key!)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Validações
if (!supabaseUrl) {
  console.error('❌ Erro: VITE_SUPABASE_URL não está definido');
  console.error('Configure no .env ou nas variáveis de ambiente do Vercel');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Erro: SUPABASE_SERVICE_KEY não está definido');
  console.error('Esta é a chave de SERVIÇO (service_role key), não a anon key!');
  console.error('Obtenha em: https://app.supabase.com/project/_/settings/api');
  process.exit(1);
}

// Verificar se não é produção acidentalmente
const isProduction = process.env.NODE_ENV === 'production' || supabaseUrl.includes('.supabase.co');

if (isProduction) {
  console.log('⚠️  ATENÇÃO: Executando em ambiente de PRODUÇÃO');
  console.log('📊 URL:', supabaseUrl);
  console.log('');
  
  // Confirmar antes de continuar
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const answer = await new Promise(resolve => {
    rl.question('Tem certeza que deseja adicionar dados em produção? (sim/não): ', resolve);
  });
  rl.close();
  
  if (answer.toLowerCase() !== 'sim') {
    console.log('❌ Seed cancelado pelo usuário');
    process.exit(0);
  }
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Práticas iniciais para produção
 * Versão reduzida - apenas práticas essenciais da Fase 1
 */
const PRATICAS_PROD = [
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
        instrucoes: 'Encontre uma posição confortável. Feche os olhos suavemente.'
      },
      {
        duracao: 150,
        titulo: 'Respiração 4-7-8',
        instrucoes: 'Inspire pelo nariz (4s)... Segure (7s)... Expire pela boca (8s)... Repita observando cada respiração.'
      }
    ]),
    beneficios: JSON.stringify(['Reduz ansiedade', 'Melhora foco', 'Acalma sistema nervoso']),
    tags: JSON.stringify(['respiração', 'ansiedade', 'base', 'despertar']),
    dificuldade: 1,
    ativa: true
  },
  {
    titulo: 'Gratidão Diária',
    subtitulo: 'Reprograme seu cérebro',
    fase: 1,
    categoria: 'Reflexão',
    duracao_min: 5,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Preparação',
        instrucoes: 'Respire fundo. Relaxe o corpo. Prepare-se para refletir sobre as bênçãos do dia.'
      },
      {
        duracao: 180,
        titulo: 'Três Gratidões',
        instrucoes: 'Pense em 3 coisas pelas quais você é grato hoje. Podem ser pequenas: um café, um sorriso, o sol. Sinta a gratidão genuinamente.'
      },
      {
        duracao: 60,
        titulo: 'Registro',
        instrucoes: 'Anote ou mentalize essas 3 gratidões. Observe como se sente ao reconhecer as bênçãos.'
      }
    ]),
    beneficios: JSON.stringify(['Aumenta felicidade', 'Reduz depressão', 'Melhora sono', 'Fortalece relacionamentos']),
    tags: JSON.stringify(['gratidão', 'reflexão', 'felicidade', 'despertar']),
    dificuldade: 1,
    ativa: true
  },
  {
    titulo: 'Intenção do Dia',
    subtitulo: 'Defina seu norte',
    fase: 1,
    categoria: 'Reflexão',
    duracao_min: 3,
    instrucoes_texto: JSON.stringify([
      {
        duracao: 60,
        titulo: 'Preparação',
        instrucoes: 'Feche os olhos. Respire profundamente 3 vezes.'
      },
      {
        duracao: 120,
        titulo: 'Defina Intenção',
        instrucoes: 'Complete a frase: "Hoje eu escolho..." (ex: ser paciente, ouvir com atenção, praticar gentileza). Visualize-se vivendo essa intenção.'
      }
    ]),
    beneficios: JSON.stringify(['Clareza mental', 'Foco no que importa', 'Viver com propósito']),
    tags: JSON.stringify(['intenção', 'propósito', 'foco', 'despertar']),
    dificuldade: 1,
    ativa: true
  }
];

async function seedProduction() {
  console.log('🚀 Iniciando seed de produção...\n');

  try {
    // 1. Verificar se já existem práticas
    const { data: existingPraticas, error: checkError } = await supabase
      .from('praticas')
      .select('id, titulo')
      .limit(1);

    if (checkError) {
      console.error('❌ Erro ao verificar práticas existentes:', checkError);
      throw checkError;
    }

    if (existingPraticas && existingPraticas.length > 0) {
      console.log('⚠️  Atenção: Já existem práticas cadastradas no banco!');
      console.log('Este script adiciona práticas, não substitui.');
      console.log('');
      
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('Deseja adicionar práticas mesmo assim? (sim/não): ', resolve);
      });
      rl.close();
      
      if (answer.toLowerCase() !== 'sim') {
        console.log('❌ Seed cancelado');
        return;
      }
    }

    // 2. Inserir práticas
    console.log('📝 Adicionando práticas iniciais...');
    const { data: praticas, error: praticasError } = await supabase
      .from('praticas')
      .insert(PRATICAS_PROD)
      .select();

    if (praticasError) {
      console.error('❌ Erro ao inserir práticas:', praticasError);
      throw praticasError;
    }

    console.log(`✅ ${praticas.length} práticas adicionadas com sucesso!`);

    // 3. Verificar Row Level Security (RLS)
    console.log('\n🔒 Verificando segurança (Row Level Security)...');
    console.log('⚠️  IMPORTANTE: Verifique manualmente no Supabase Dashboard:');
    console.log('   1. Todas as tabelas devem ter RLS ENABLED');
    console.log('   2. Policies devem permitir apenas acesso autenticado');
    console.log('   3. Anon key não deve ter acesso de escrita');
    console.log('');
    console.log('   Dashboard: https://app.supabase.com/project/_/auth/policies');

    // 4. Resumo
    console.log('\n✅ Seed de produção concluído com sucesso!\n');
    console.log('📊 Resumo:');
    console.log(`   - Práticas: ${praticas.length}`);
    console.log('');
    console.log('🔍 Próximos passos:');
    console.log('   1. Verifique RLS no Supabase Dashboard');
    console.log('   2. Teste o app em produção');
    console.log('   3. Configure Vercel Analytics');
    console.log('   4. Configure Sentry para monitoramento');
    console.log('');

  } catch (error) {
    console.error('\n❌ Erro durante seed de produção:', error);
    process.exit(1);
  }
}

// Executar seed
seedProduction();
