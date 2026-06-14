const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// Endpoint temporário para listar todos os usuários
exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar usuário diretamente no sistema
exports.criarUsuario = async (req, res) => {
  const { email, name, password, consultoria } = req.body;
  if (!email || !password || !consultoria) {
    return res.status(400).json({ error: 'Email, senha e consultoria são obrigatórios.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Já existe um usuário com esse email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, name: name || '', consultoria, passwordHash });
    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso.', user: { email: user.email, name: user.name, consultoria: user.consultoria } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar consultoria do usuário pelo e-mail
exports.getUserConsultoria = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json({ consultoria: user.consultoria });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Cria ou atualiza usuário com consultoria
exports.setUserConsultoria = async (req, res) => {
  const { email, consultoria } = req.body;
  if (!email || !consultoria) return res.status(400).json({ error: 'Email e consultoria são obrigatórios.' });
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { consultoria },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
