const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../db_logs.json');

function lerDB() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { logs: parsed, acompanhamentoPostes: {}, acompanhamentoSCM: {} };
    }
    return { acompanhamentoPostes: {}, acompanhamentoSCM: {}, ...parsed, logs: parsed.logs || [] };
  } catch (e) {
    return { logs: [], acompanhamentoPostes: {}, acompanhamentoSCM: {} };
  }
}

function lerAcompanhamentoPostes() {
  return lerDB().acompanhamentoPostes || {};
}

function salvarAcompanhamentoPostes(acompanhamentoPostes) {
  const db = lerDB();
  db.acompanhamentoPostes = acompanhamentoPostes;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

exports.getPostesStatus = (req, res) => {
  const { cnpj } = req.params;
  const dados = lerAcompanhamentoPostes();
  res.json(dados[cnpj] || { anosDesligados: {}, anosOcultos: {} });
};

exports.setPostesStatus = (req, res) => {
  const { cnpj } = req.params;
  const { anosDesligados, anosOcultos } = req.body;
  const dados = lerAcompanhamentoPostes();
  dados[cnpj] = { anosDesligados, anosOcultos };
  salvarAcompanhamentoPostes(dados);
  res.json({ success: true });
};
