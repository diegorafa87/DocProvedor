import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authAPI';

export default function AdminCreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    name: '',
    consultoria: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.criarUsuario(form.email, form.name, form.consultoria, form.password);
      if (response?.status === 201) {
        setMessage('Usuário criado com sucesso.');
        setForm({ email: '', name: '', consultoria: '', password: '' });
      } else {
        setError(response?.data?.error || 'Erro ao criar usuário.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: 16, boxShadow: '0 18px 60px rgba(15,23,42,0.12)' }}>
      <h2 style={{ marginBottom: 16, color: '#153a6b' }}>Criar novo usuário</h2>

      {message && <div style={{ marginBottom: 16, color: '#166534', background: '#dcfce7', padding: 12, borderRadius: 10 }}>{message}</div>}
      {error && <div style={{ marginBottom: 16, color: '#991b1b', background: '#fee2e2', padding: 12, borderRadius: 10 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={{ padding: 12, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 16 }}
        />

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nome"
          style={{ padding: 12, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 16 }}
        />

        <input
          type="text"
          name="consultoria"
          value={form.consultoria}
          onChange={handleChange}
          placeholder="Consultoria"
          required
          style={{ padding: 12, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 16 }}
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Senha padrão"
          required
          style={{ padding: 12, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 16 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, minWidth: 140, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Criando...' : 'Criar usuário'}
          </button>
          <button type="button" onClick={() => navigate('/')} style={{ flex: 1, minWidth: 140, background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
