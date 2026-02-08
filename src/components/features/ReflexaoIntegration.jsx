// ================================================
// REFLEXÃO INTEGRATION - Componente integrador completo
// ================================================
// Gerencia o fluxo completo de reflexão noturna

import React, { useState } from 'react';
import NightReflectionModal from './NightReflectionModal';
import { AnaliseIAModal, AnaliseLoadingModal } from './AnaliseIAModal';
import { useReflexoes } from '../../hooks/useReflexoes';

export const ReflexaoIntegration = ({ userId, onComplete }) => {
  const {
    mostrarModal,
    setMostrarModal,
    salvarReflexao,
    analisando,
    analiseResultado
  } = useReflexoes(userId);

  const [mostrarAnalise, setMostrarAnalise] = useState(false);

  const handleSalvar = async (reflexaoData) => {
    const resultado = await salvarReflexao(reflexaoData);
    
    if (resultado.success) {
      if (resultado.analiseIA) {
        setMostrarAnalise(true);
      } else {
        // Se não tiver análise IA, fecha o modal e chama onComplete
        setMostrarModal(false);
        onComplete?.();
      }
    }
  };

  const handleFecharAnalise = () => {
    setMostrarAnalise(false);
    setMostrarModal(false);
    onComplete?.();
  };

  return (
    <>
      {/* Modal de reflexão */}
      {mostrarModal && (
        <NightReflectionModal
          onSave={handleSalvar}
          onClose={() => setMostrarModal(false)}
          userId={userId}
        />
      )}

      {/* Loading enquanto analisa */}
      <AnaliseLoadingModal mostrar={analisando} />

      {/* Modal com análise da IA */}
      <AnaliseIAModal
        analise={analiseResultado}
        mostrar={mostrarAnalise}
        onFechar={handleFecharAnalise}
      />
    </>
  );
};

export default ReflexaoIntegration;
