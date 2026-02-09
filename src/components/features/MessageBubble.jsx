/**
 * MessageBubble Component
 * 
 * Exibe uma mensagem individual do chat
 * - Bubble colorida por usuário
 * - Modo anônimo
 * - Timestamp
 * - Opções de editar/deletar
 */

import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const MessageBubble = ({
  mensagem,
  isOwnMessage,
  canDelete,
  canEdit,
  onDelete,
  onEdit,
  corUsuario
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(mensagem.mensagem);
  const [showOptions, setShowOptions] = useState(false);

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== mensagem.mensagem) {
      onEdit(mensagem.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(mensagem.mensagem);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar esta mensagem?')) {
      onDelete(mensagem.id);
    }
  };

  // Nome a ser exibido
  const displayName = mensagem.anonimo
    ? 'Anônimo'
    : mensagem.keteros?.nome || mensagem.user_nome || 'Usuário';

  // Iniciais para avatar
  const initials = mensagem.anonimo
    ? '🎭'
    : (displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());

  // Timestamp formatado
  const timeAgo = formatDistanceToNow(new Date(mensagem.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div
      className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {mensagem.keteros?.foto_url && !mensagem.anonimo ? (
          <img
            src={mensagem.keteros.foto_url}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
              mensagem.anonimo ? 'bg-gray-500' : corUsuario
            }`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-md ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Nome e Timestamp */}
        {!isOwnMessage && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-sm font-medium text-gray-700">
              {displayName}
            </span>
            <span className="text-xs text-gray-500">
              {timeAgo}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-2 shadow-sm ${
            isOwnMessage
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          {isEditing ? (
            // Edit Mode
            <div className="flex flex-col gap-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSaveEdit}
                  className="p-1 hover:bg-green-100 rounded transition-colors"
                  title="Salvar"
                >
                  <Check className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Cancelar"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            // Display Mode
            <>
              <p className="text-sm whitespace-pre-wrap break-words">
                {mensagem.mensagem}
              </p>
              {mensagem.editada && (
                <span className="text-xs opacity-70 italic mt-1 block">
                  (editada)
                </span>
              )}
            </>
          )}
        </div>

        {/* Options (Edit/Delete) */}
        {showOptions && !isEditing && (canEdit || canDelete) && (
          <div className={`flex gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Editar mensagem"
              >
                <Edit2 className="w-3 h-3 text-gray-500" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-red-100 rounded transition-colors"
                title="Deletar mensagem"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            )}
          </div>
        )}

        {/* Timestamp for own messages */}
        {isOwnMessage && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {timeAgo}
          </span>
        )}
      </div>
    </div>
  );
};
