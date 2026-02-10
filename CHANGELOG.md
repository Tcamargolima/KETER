# Changelog

All notable changes to the KETER project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Supabase Edge Functions for secure AI operations
  - `chat-ia`: AI chat functionality moved to backend
  - `analisar-reflexao`: Reflection analysis moved to backend
- Rate limiting for AI features (50 messages/day for chat, 3/day for reflections)
- Comprehensive deployment documentation for Edge Functions

### Changed
- Migrated OpenAI API calls from frontend to backend (Supabase Edge Functions)
- Updated `.env.production.example` to remove exposed API keys
- Modified `useGuiaInteligente` hook to use Edge Functions instead of direct OpenAI calls

### Removed
- `VITE_OPENAI_API_KEY` from production environment variables (security improvement)
- `src/pages/TestUI.jsx` - debug page removed from production build
- Test UI route from application routes

### Security
- **CRITICAL**: OpenAI API key no longer exposed in frontend code
- API keys now stored securely in Supabase backend
- User authentication required for all AI function calls
- Rate limiting implemented to prevent abuse and control costs

---

## [1.0.0] - 2024-XX-XX

### Initial Release
- Four-phase personal evolution system
  - Phase 1: DESPERTAR (14 days) - Initial self-awareness
  - Phase 2: DISCIPLINA (16 days) - Building sustainable habits
  - Phase 3: CONSCIÊNCIA (30 days) - Perceiving transformation
  - Phase 4: SERVIÇO (unlimited) - Impact on the world
- Daily practice system with guided exercises
- Night reflection journaling
- AI-powered guidance and analysis
- Progress tracking and statistics
- User authentication and profile management
- Responsive design for mobile and desktop

---

## Historical Changes

For detailed change history prior to v1.0, see:
- [docs/history/CORRECAO-04-SUMMARY.md](./docs/history/CORRECAO-04-SUMMARY.md)
- [docs/history/CORRECAO-05-SUMMARY.md](./docs/history/CORRECAO-05-SUMMARY.md)
- [docs/history/CORRECAO-06-SUMMARY.md](./docs/history/CORRECAO-06-SUMMARY.md)
- [docs/history/CORRECAO-07-SUMMARY.md](./docs/history/CORRECAO-07-SUMMARY.md)

---

## Versioning Notes

- **Major version** (X.0.0): Breaking changes, major features
- **Minor version** (0.X.0): New features, backwards compatible
- **Patch version** (0.0.X): Bug fixes, small improvements

---

## Upgrade Guide

### From Development to v1.0

1. **Environment Variables**
   - Remove `VITE_OPENAI_API_KEY` from frontend environment
   - Add `OPENAI_API_KEY` to Supabase Edge Functions secrets
   - Deploy Edge Functions: `chat-ia` and `analisar-reflexao`

2. **Frontend Updates**
   - Update imports to use new Edge Function calls
   - Remove any direct OpenAI API usage
   - Test AI features with new backend integration

3. **Database**
   - Run migration scripts for performance indexes
   - Update RLS policies if needed
   - Verify data integrity

---

## Support

For questions or issues:
- Open an issue on GitHub
- Contact the development team
- Check documentation in `/docs`

---

[Unreleased]: https://github.com/Tcamargolima/KETER/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Tcamargolima/KETER/releases/tag/v1.0.0
