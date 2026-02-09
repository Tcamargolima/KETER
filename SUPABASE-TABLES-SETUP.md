# Supabase Tables Setup Guide

## Overview
This document provides instructions for creating the required database tables in Supabase to fix 404 errors related to missing tables.

## Required Tables

The KETER application requires the following tables to be created in your Supabase database:

### 1. **keteros** (Users table)
- **Location**: `supabase-schema.sql` (lines 10-40)
- **Purpose**: Stores user profiles and statistics
- **Status**: ✅ Should exist (created during initial setup)

### 2. **praticas** (Practice Library)
- **Location**: `database/migration-praticas-table.sql`
- **Purpose**: Library of meditation and spiritual practices organized by phase
- **Status**: ⚠️ May be missing - causes 404 errors
- **How to create**:
  ```bash
  # Execute this SQL file in Supabase SQL Editor
  database/migration-praticas-table.sql
  ```
- **After creation**: Seed with data using `database/seed-praticas.sql`

### 3. **praticas_diarias** (Daily Practices Completed)
- **Location**: `supabase-schema.sql` (lines 79-108)
- **Purpose**: Tracks practices completed by users daily
- **Status**: ⚠️ May be missing - causes 404 errors
- **How to create**:
  ```sql
  -- Execute in Supabase SQL Editor
  CREATE TABLE IF NOT EXISTS praticas_diarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
    pratica_id INTEGER NOT NULL,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    titulo VARCHAR(255),
    categoria VARCHAR(100),
    duracao_minutos INTEGER,
    completada BOOLEAN DEFAULT false,
    sentimento_pos VARCHAR(50),
    nota_opcional TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(ketero_id, data)
  );
  
  -- Enable RLS
  ALTER TABLE praticas_diarias ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Usuários veem apenas suas práticas"
    ON praticas_diarias FOR ALL
    USING (ketero_id = auth.uid());
  
  -- Create indexes
  CREATE INDEX idx_praticas_ketero_data ON praticas_diarias(ketero_id, data DESC);
  CREATE INDEX idx_praticas_completada ON praticas_diarias(ketero_id, completada);
  ```

### 4. **reflexoes** (Night Reflections - Enhanced)
- **Location**: `database/schema-reflexoes-enhanced.sql`
- **Purpose**: Stores daily night reflections with AI analysis
- **Status**: ⚠️ May be missing OR using old table name 'reflexoes_noturnas'
- **How to create/migrate**:
  ```bash
  # Execute this SQL file in Supabase SQL Editor
  database/schema-reflexoes-enhanced.sql
  ```
- **Note**: The old table name was `reflexoes_noturnas`, but the code now uses `reflexoes`

### 5. **conteudo_educacional** (Educational Content)
- **Location**: `database/migrations/add-conteudo-educacional.sql`
- **Purpose**: Educational content library (articles, videos, courses)
- **Status**: ⚠️ May be missing - causes 404 errors
- **How to create**:
  ```bash
  # Execute this migration file in Supabase SQL Editor
  database/migrations/add-conteudo-educacional.sql
  ```
- **After creation**: Seed with data using `database/seed-conteudo-educacional.sql`

### 6. **micro_atos** (Micro Acts of Kindness)
- **Location**: `supabase-schema.sql` (lines 142-163)
- **Purpose**: Tracks daily micro-acts of kindness
- **Status**: ✅ Should exist

### 7. Supporting Tables
Other tables that should exist but rarely cause 404 errors:
- `avaliacoes_iniciais` - Initial assessments
- `conquistas` - Achievements/badges
- `keteros_conquistas` - User achievements junction table
- `conversas_guia` - AI chat conversations
- `notifications` - User notifications
- `circulos` - Study circles (Phase 11)
- `circulo_membros` - Circle members

## Quick Setup Script

To create all missing tables at once, execute these SQL files in order in the Supabase SQL Editor:

1. **Base schema** (if starting fresh):
   ```bash
   supabase-schema.sql
   ```

2. **Practices library**:
   ```bash
   database/migration-praticas-table.sql
   database/seed-praticas.sql
   ```

3. **Enhanced reflections**:
   ```bash
   database/schema-reflexoes-enhanced.sql
   ```

4. **Educational content**:
   ```bash
   database/migrations/add-conteudo-educacional.sql
   database/seed-conteudo-educacional.sql
   ```

5. **Micro acts**:
   ```bash
   database/seed-micro-atos.sql
   ```

6. **Notifications** (if needed):
   ```bash
   supabase-notifications-schema.sql
   ```

## Verifying Table Creation

After creating the tables, verify they exist by running this query in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'keteros',
    'praticas',
    'praticas_diarias',
    'reflexoes',
    'conteudo_educacional',
    'micro_atos',
    'conquistas',
    'keteros_conquistas'
  )
ORDER BY table_name;
```

Expected result: All 8 tables should be listed.

## Row Level Security (RLS) Policies

⚠️ **IMPORTANT**: All user-specific tables must have RLS enabled and appropriate policies:

- **praticas**: Public read access (all users can view)
- **praticas_diarias**: Users can only see/modify their own records
- **reflexoes**: Users can only see/modify their own records
- **conteudo_educacional**: Public read access
- **keteros**: Users can only see/modify their own profile

Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('praticas_diarias', 'reflexoes', 'keteros');
```

All should show `rowsecurity = true`.

## Error Codes Reference

The application now logs specific error codes when tables are missing:

- **PGRST116**: Table or view not found
- **relation "table_name" does not exist**: PostgreSQL error for missing table
- **42P01**: PostgreSQL error code for undefined table

When you see these errors in the console, it means the table needs to be created.

## Testing After Setup

After creating the tables, test the application by:

1. **Login/Signup**: Verify keteros table works
2. **View Practices**: Check if practices library loads
3. **Complete a Practice**: Verify praticas_diarias table works
4. **Night Reflection**: Test reflexoes table
5. **Educational Content**: Check conteudo_educacional table

## Troubleshooting

### "Table not found" errors persist after creating tables
1. Clear browser cache and reload
2. Check table names are exactly as specified (case-sensitive)
3. Verify RLS policies allow authenticated users access
4. Check Supabase project URL and keys in `.env` file

### Authentication issues
1. Verify `auth.uid()` is available in RLS policies
2. Check user is properly authenticated
3. Ensure JWT secret is correctly configured

### Data not showing up
1. Check if tables have data: `SELECT COUNT(*) FROM table_name;`
2. Verify RLS policies with: `SELECT * FROM pg_policies WHERE tablename = 'table_name';`
3. Test queries directly in SQL Editor as authenticated user

## Support

If you continue to experience issues after following this guide:
1. Check the console logs for specific error codes
2. Verify all migration files have been executed
3. Review RLS policies in Supabase dashboard
4. Ensure your Supabase project is on a paid plan if using advanced features

---

**Last Updated**: 2026-02-09
**Version**: 1.0
