import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteValidacao from '../components/ClienteValidacao';

const ValidarClientesPage = () => {
  const [consultoria, setConsultoria] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const consultoriaLogada = localStorage.getItem('consultoriaLogada');
    if (!consultoriaLogada) {
      navigate('/consultoria-login');
      return;
    }
    setConsultoria(consultoriaLogada);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('consultoriaLogada');
    navigate('/consultoria-login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      <div style={{ background: '#2c3e50', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Gestão de Consultoria - {consultoria}</h1>
        <button
          onClick={handleLogout}
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Sair
        </button>
      </div>
      <ClienteValidacao consultoria={consultoria} />
    </div>
  );
};

export default ValidarClientesPage;
