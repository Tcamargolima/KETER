#!/usr/bin/env node
/**
 * Script para resetar o banco de dados
 * ATENÇÃO: Este script apaga dados! Use apenas em desenvolvimento.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Configurar dotenv
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar definidos no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetDatabase() {
  console.log('🔄 Iniciando reset do banco de dados...\n');
  console.log('⚠️  ATENÇÃO: Isso irá apagar dados!\n');

  try {
    // 1. Limpar práticas
    console.log('🗑️  Limpando tabela praticas...');
    const { error: praticasError } = await supabase
      .from('praticas')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (praticasError && praticasError.code !== 'PGRST116') {
      console.warn('⚠️  Aviso ao limpar práticas:', praticasError.message);
    } else {
      console.log('✅ Tabela praticas limpa');
    }

    // 2. Limpar práticas diárias (histórico de usuários)
    console.log('🗑️  Limpando tabela praticas_diarias...');
    const { error: diariasError } = await supabase
      .from('praticas_diarias')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (diariasError && diariasError.code !== 'PGRST116') {
      console.warn('⚠️  Aviso ao limpar práticas diárias:', diariasError.message);
    } else {
      console.log('✅ Tabela praticas_diarias limpa');
    }

    console.log('\n✨ Reset concluído com sucesso!\n');
    console.log('💡 Execute "npm run db:seed" para popular o banco com dados iniciais.\n');
  } catch (error) {
    console.error('❌ Erro durante reset:', error);
    process.exit(1);
  }
}

// Executar reset
resetDatabase();
