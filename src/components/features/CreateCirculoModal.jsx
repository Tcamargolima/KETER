/**
 * CreateCirculoModal Component
 * 
 * Modal para criar novo círculo
 * - Nome do círculo
 * - Descrição
 * - Fase relacionada (opcional)
 * - Público/Privado
 * - Cor tema
 */

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCirculos } from '../../hooks/useCirculos';

export const CreateCirculoModal = ({ isOpen, onClose, userId }) => {
  const { criarCirculo } = useCirculos(userId);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    fase_relacionada: '',
    is_public: true,
    cor_tema: 'purple'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cores = [
    { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
    { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
    { value: 'green', label: 'Verde', class: 'bg-green-500' },
    { value: 'amber', label: 'Âmbar', class: 'bg-amber-500' },
    { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
    { value: 'emerald', label: 'Esmeralda', class: 'bg-emerald-500' },
    { value: 'violet', label: 'Violeta', class: 'bg-violet-500' },
    { value: 'cyan', label: 'Ciano', class: 'bg-cyan-500' }
  ];

  const fases = [
    { value: '', label: 'Todas as fases' },
    { value: '1', label: 'Fase 1 - Despertar' },
    { value: '2', label: 'Fase 2 - Prática' },
    { value: '3', label: 'Fase 3 - Bondade' },
    { value: '4', label: 'Fase 4 - Evolução' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.nome.trim()) {
      setError('Nome do círculo é obrigatório');
      return;
    }

    setLoading(true);

    const dados = {
      ...formData,
      fase_relacionada: formData.fase_relacionada ? parseInt(formData.fase_relacionada) : null
    };

    const result = await criarCirculo(dados);

    setLoading(false);

    if (result.success) {
      // Reset form
      setFormData({
        nome: '',
        descricao: '',
        fase_relacionada: '',
        is_public: true,
        cor_tema: 'purple'
      });
      onClose();
    } else {
      setError(result.error || 'Erro ao criar círculo');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Criar Novo Círculo
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Círculo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Reflexões da Noite"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={100}
              required
              disabled={loading}
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o propósito deste círculo..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={500}
              disabled={loading}
            />
          </div>

          {/* Fase Relacionada */}
          <div>
            <label htmlFor="fase_relacionada" className="block text-sm font-medium text-gray-700 mb-2">
              Fase Relacionada
            </label>
            <select
              id="fase_relacionada"
              name="fase_relacionada"
              value={formData.fase_relacionada}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            >
              {fases.map(fase => (
                <option key={fase.value} value={fase.value}>
                  {fase.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Círculos relacionados a uma fase específica ajudam usuários naquela etapa
            </p>
          </div>

          {/* Visibilidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilidade
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="is_public"
                  checked={formData.is_public === true}
                  onChange={() => setFormData(prev => ({ ...prev, is_public: true }))}
                  className="w-4 h-4 text-purple-600"
                  disabled={loading}
                />
                <div>
                  <div className="font-medium text-gray-900">Público</div>
                  <div className="text-xs text-gray-500">
                    Qualquer pessoa pode ver e entrar
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="is_public"
                  checked={formData.is_public === false}
                  onChange={() => setFormData(prev => ({ ...prev, is_public: false }))}
                  className="w-4 h-4 text-purple-600"
                  disabled={loading}
                />
                <div>
                  <div className="font-medium text-gray-900">Privado</div>
                  <div className="text-xs text-gray-500">
                    Apenas por convite (em breve)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Cor do Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor do Tema
            </label>
            <div className="grid grid-cols-4 gap-2">
              {cores.map(cor => (
                <button
                  key={cor.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cor_tema: cor.value }))}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                    formData.cor_tema === cor.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <div className={`w-8 h-8 rounded-full ${cor.class}`} />
                  <span className="text-xs text-gray-600">{cor.label}</span>
                  {formData.cor_tema === cor.value && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.nome.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando...</span>
                </>
              ) : (
                <span>Criar Círculo</span>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Você pode criar até 3 círculos
          </p>
        </form>
      </div>
    </div>
  );
};
