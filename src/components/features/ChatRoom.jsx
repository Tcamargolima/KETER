/**
 * ChatRoom Component
 * 
 * Interface de chat em tempo real para um círculo
 * - Lista de mensagens com scroll automático
 * - Input para enviar mensagens
 * - Opção de mensagem anônima
 * - Lista de membros
 * - Real-time updates via Supabase
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Users,
  UserX,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCirculoChat } from '../../hooks/useCirculoChat';
import { useCirculos } from '../../hooks/useCirculos';
import { MessageBubble } from './MessageBubble';

export const ChatRoom = ({ userId }) => {
  const { id: circuloId } = useParams();
  const navigate = useNavigate();

  const {
    mensagens,
    membros,
    loading,
    sending,
    error,
    enviarMensagem,
    deletarMensagem,
    editarMensagem,
    podeDeletarMensagem,
    podeEditarMensagem,
    getCorUsuario
  } = useCirculoChat(circuloId, userId);

  const { obterCirculo, sairCirculo } = useCirculos(userId);

  const [circulo, setCirculo] = useState(null);
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [modoAnonimo, setModoAnonimo] = useState(false);
  const [showMembros, setShowMembros] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Carregar informações do círculo
  useEffect(() => {
    const carregar = async () => {
      const result = await obterCirculo(circuloId);
      if (result.success) {
        setCirculo(result.data);
      }
    };
    carregar();
  }, [circuloId, obterCirculo]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Focus no input ao carregar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleEnviar = async () => {
    if (!mensagemTexto.trim() || sending) return;

    const result = await enviarMensagem(mensagemTexto, modoAnonimo);

    if (result.success) {
      setMensagemTexto('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const handleSairCirculo = async () => {
    if (window.confirm('Tem certeza que deseja sair deste círculo?')) {
      const result = await sairCirculo(circuloId);
      if (result.success) {
        navigate('/circulos');
      }
    }
  };

  if (loading && !circulo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!circulo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Círculo não encontrado</p>
          <button
            onClick={() => navigate('/circulos')}
            className="text-purple-600 hover:underline"
          >
            Voltar para Círculos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/circulos')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {circulo.nome}
            </h1>
            <p className="text-xs text-gray-500">
              {membros.length} {membros.length === 1 ? 'membro' : 'membros'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMembros(!showMembros)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Ver membros"
          >
            <Users className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleSairCirculo}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
            title="Sair do círculo"
          >
            <UserX className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {loading && mensagens.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : mensagens.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">👋</p>
                  <p>Seja o primeiro a enviar uma mensagem!</p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {mensagens.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    mensagem={msg}
                    isOwnMessage={msg.user_id === userId}
                    canDelete={podeDeletarMensagem(msg)}
                    canEdit={podeEditarMensagem(msg)}
                    onDelete={deletarMensagem}
                    onEdit={editarMensagem}
                    corUsuario={getCorUsuario(msg.user_id)}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            {error && (
              <div className="mb-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                {error}
              </div>
            )}
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={mensagemTexto}
                    onChange={(e) => setMensagemTexto(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={1}
                    disabled={sending}
                  />
                  <div className="flex items-center gap-2 mt-2 px-2">
                    <button
                      onClick={() => setModoAnonimo(!modoAnonimo)}
                      className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full transition-colors ${
                        modoAnonimo
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {modoAnonimo ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Anônimo</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Visível</span>
                        </>
                      )}
                    </button>
                    <span className="text-xs text-gray-500">
                      {modoAnonimo
                        ? 'Sua mensagem será enviada anonimamente'
                        : 'Seu nome será exibido'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleEnviar}
                  disabled={!mensagemTexto.trim() || sending}
                  className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembros && (
          <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Membros ({membros.length})
              </h3>
              <div className="space-y-3">
                {membros.map((membro) => (
                  <div key={membro.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {membro.keteros?.nome
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {membro.keteros?.nome || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {membro.role === 'owner'
                          ? '👑 Criador'
                          : membro.role === 'moderator'
                          ? '🛡️ Moderador'
                          : 'Membro'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
