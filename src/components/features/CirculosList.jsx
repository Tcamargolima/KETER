/**
 * CirculosList Component
 * 
 * Lista de círculos disponíveis
 * - Círculos públicos
 * - Círculos que o usuário participa
 * - Botão para criar novo círculo
 * - Botão para entrar/acessar círculo
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  MessageCircle,
  Users,
  Lock,
  Globe,
  Loader2,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { useCirculos } from '../../hooks/useCirculos';
import { CreateCirculoModal } from './CreateCirculoModal';

export const CirculosList = ({ userId }) => {
  const navigate = useNavigate();
  const {
    circulos,
    meusCirculos,
    loading,
    error,
    entrarCirculo,
    sairCirculo
  } = useCirculos(userId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joiningCirculo, setJoiningCirculo] = useState(null);

  const handleEntrarCirculo = async (circuloId) => {
    setJoiningCirculo(circuloId);
    const result = await entrarCirculo(circuloId);

    if (result.success) {
      // Navegar para o chat room
      navigate(`/circulos/${circuloId}`);
    } else {
      alert(result.error || 'Erro ao entrar no círculo');
    }
    setJoiningCirculo(null);
  };

  const handleAcessarCirculo = (circuloId) => {
    navigate(`/circulos/${circuloId}`);
  };

  const renderCirculoCard = (circulo) => {
    const isMember = circulo.is_member;
    const isOwner = circulo.user_role === 'owner';

    return (
      <div
        key={circulo.id}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200"
      >
        {/* Header colorido */}
        <div
          className={`h-2 bg-gradient-to-r ${
            circulo.cor_tema === 'green'
              ? 'from-green-400 to-emerald-500'
              : circulo.cor_tema === 'amber'
              ? 'from-amber-400 to-orange-500'
              : circulo.cor_tema === 'purple'
              ? 'from-purple-400 to-pink-500'
              : circulo.cor_tema === 'blue'
              ? 'from-blue-400 to-cyan-500'
              : circulo.cor_tema === 'emerald'
              ? 'from-emerald-400 to-teal-500'
              : circulo.cor_tema === 'violet'
              ? 'from-violet-400 to-purple-500'
              : 'from-purple-400 to-pink-500'
          }`}
        />

        <div className="p-5">
          {/* Título e badges */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {circulo.nome}
              </h3>
              {circulo.descricao && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {circulo.descricao}
                </p>
              )}
            </div>
          </div>

          {/* Metadados */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{circulo.total_membros || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              {circulo.is_public ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Público</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Privado</span>
                </>
              )}
            </div>
            {circulo.fase_relacionada && (
              <div className="flex items-center gap-1">
                <span className="text-purple-600 font-medium">
                  Fase {circulo.fase_relacionada}
                </span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {isOwner && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                👑 Criador
              </span>
            )}
            {isMember && !isOwner && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                ✓ Membro
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isMember ? (
              <button
                onClick={() => handleAcessarCirculo(circulo.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir Chat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleEntrarCirculo(circulo.id)}
                disabled={joiningCirculo === circulo.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joiningCirculo === circulo.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Círculos 🌟
              </h1>
              <p className="text-gray-600">
                Conecte-se com outros Keteros em círculos de conversa
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Criar Círculo</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Meus Círculos */}
        {meusCirculos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              Meus Círculos ({meusCirculos.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meusCirculos.map((circulo) => {
                // Adicionar info de membro aos círculos
                const circuloCompleto = circulos.find(c => c.id === circulo.id) || circulo;
                return renderCirculoCard({ ...circuloCompleto, is_member: true });
              })}
            </div>
          </div>
        )}

        {/* Círculos Disponíveis */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Círculos Disponíveis ({circulos.filter(c => !c.is_member).length})
          </h2>
          {circulos.filter(c => !c.is_member).length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Você já está em todos os círculos disponíveis!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-purple-600 hover:underline font-medium"
              >
                Criar um novo círculo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circulos
                .filter(c => !c.is_member)
                .map((circulo) => renderCirculoCard(circulo))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <CreateCirculoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={userId}
      />
    </div>
  );
};
