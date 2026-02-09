/**
 * Circulos Page
 * 
 * Página principal de círculos
 */

import React from 'react';
import { CirculosList } from '../../components/features/CirculosList';

const Circulos = ({ userId }) => {
  return <CirculosList userId={userId} />;
};

export default Circulos;
