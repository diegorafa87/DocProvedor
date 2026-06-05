import React, { useState, useEffect } from 'react';
import { getMesesComDados } from '../services/clienteMeses';

/**
 * Componente que exibe quais meses têm dados preenchidos para um cliente
 * Versão somente leitura, sem checkboxes interativos.
 * 
 * Props:
 * - clienteCNPJ: CNPJ do cliente para buscar dados
 */
export default function MesesComDadosIndicador({ clienteCNPJ }) {
  const [meses, setMeses] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mesesComDados, setMesesComDados] = useState(new Set());

  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  useEffect(() => {
    const buscarMeses = async () => {
      setCarregando(true);
      const dados = await getMesesComDados(clienteCNPJ);
      setMeses(dados);

      const mesesComDadosSet = new Set(
        Object.values(dados || {})
          .flatMap((lista) => lista || [])
          .map(Number)
          .filter((mes) => Number.isInteger(mes) && mes >= 1 && mes <= 12)
      );

      setMesesComDados(mesesComDadosSet);
      setCarregando(false);
    };

    if (clienteCNPJ) {
      buscarMeses();
    }
  }, [clienteCNPJ]);

  if (carregando) {
    return <div style={{ fontSize: '12px', color: '#999' }}>↻</div>;
  }

  if (!meses) {
    return <div style={{ fontSize: '12px', color: '#999' }}>-</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '0.5rem'
    }}>
      {mesesNomes.map((mes, idx) => {
        const mesNum = idx + 1;
        const temDados = mesesComDados.has(mesNum);

        return (
          <div
            key={mesNum}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: temDados ? 1 : 0.5,
              userSelect: 'none'
            }}
            title={temDados ? `${mes} - com dados` : `${mes} - sem dados`}
          >
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: temDados ? '#388e3c' : '#ccc',
              display: 'inline-block'
            }} />
            <span style={{
              fontSize: '13px',
              color: '#333',
              fontWeight: temDados ? '600' : '400'
            }}>
              {mes}
            </span>
          </div>
        );
      })}
    </div>
  );
}
