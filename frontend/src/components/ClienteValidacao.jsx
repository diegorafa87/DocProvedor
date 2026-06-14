import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ClienteValidacao = ({ consultoria }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientes();
  }, [consultoria]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/user/clientes?consultoria=${encodeURIComponent(consultoria)}`);
      setClientes(response.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar clientes.');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCliente = async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/validar-cliente`, {
        email,
        consultoria,
      });
      setMessage(response.data?.message || 'Cliente validado com sucesso!');
      await fetchClientes(); // Recarrega a lista
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao validar cliente.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Validar Clientes</h2>
      <p style={{ color: '#666' }}>Consultoria: <strong>{consultoria}</strong></p>

      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <p>Carregando clientes...</p>
      ) : clientes.length === 0 ? (
        <p style={{ color: '#999' }}>Não há clientes pendentes de validação.</p>
      ) : (
        <div>
          <p style={{ marginBottom: '1rem' }}>Clientes pendentes: <strong>{clientes.length}</strong></p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Data de Cadastro</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{cliente.name || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{cliente.email}</td>
                  <td style={{ padding: '0.75rem' }}>{new Date(cliente.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleValidarCliente(cliente.email)}
                      style={{
                        background: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Validar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClienteValidacao;
