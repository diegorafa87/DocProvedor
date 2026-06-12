const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../db_logs.json');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Lê o db_logs.json e retorna sempre um objeto { logs, acompanhamentoSCM, ...resto }.
 * Caso o arquivo seja um array legado, converte automaticamente.
 */
function lerDB() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Migração automática: array legado → objeto estruturado
      return { logs: parsed, acompanhamentoSCM: {} };
    }
    return {
      acompanhamentoSCM: {},
      ...parsed,
      logs: parsed.logs || []
    };
  } catch (e) {
    return { logs: [], acompanhamentoSCM: {} };
  }
}

/**
 * Salva o objeto de volta no db_logs.json preservando todas as chaves.
 */
function salvarDB(obj) {
  fs.writeFileSync(dbPath, JSON.stringify(obj, null, 2));
}

function lerAcompanhamentoSCM() {
  return lerDB().acompanhamentoSCM || {};
}

function salvarAcompanhamentoSCM(acompanhamentoSCM) {
  const db = lerDB();
  db.acompanhamentoSCM = acompanhamentoSCM;
  salvarDB(db);
}

// ─── Exports ─────────────────────────────────────────────────────────────────

exports.getSCMStatus = (req, res) => {
  const { cnpj } = req.params;
  const dados = lerAcompanhamentoSCM();
  res.json(dados[cnpj] || { anosDesligados: {}, anosOcultos: {} });
};

exports.setSCMStatus = (req, res) => {
  const { cnpj } = req.params;
  const { anosDesligados, anosOcultos } = req.body;
  const dados = lerAcompanhamentoSCM();
  dados[cnpj] = { anosDesligados, anosOcultos };
  salvarAcompanhamentoSCM(dados);
  res.json({ success: true });
};

// Listar histórico de geração de CSV SCM
exports.getSCMHistoricoCSV = (req, res) => {
  try {
    const db = lerDB();
    const historico = db.logs
      .filter(item => item.acao === 'GERAR_CSV_SCM')
      .sort((a, b) => new Date(b?.data || 0).getTime() - new Date(a?.data || 0).getTime());
    res.json(historico);
  } catch (e) {
    res.json([]);
  }
};

// Adicionar entrada ao histórico de geração de CSV SCM
exports.addSCMHistoricoCSV = (req, res) => {
  try {
    const db = lerDB();
    const novaEntrada = {
      ...req.body,
      acao: req.body?.acao || 'GERAR_CSV_SCM',
      data: req.body?.data || new Date().toISOString()
    };
    // Insere no topo para manter as mais recentes primeiro
    db.logs.unshift(novaEntrada);
    salvarDB(db);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro ao salvar histórico' });
  }
};

// Excluir entrada do histórico de geração de CSV SCM por nome, data e usuario
exports.deleteSCMHistoricoCSV = (req, res) => {
  const { nome, nomeDetalhes, data, usuario } = req.body;

  const normalizarTexto = (valor = '') => String(valor).trim().toLowerCase();
  const obterNomeArquivo = (item = {}) => item.nome || item?.detalhes?.nomeArquivo || '';

  const nomeAlvo = normalizarTexto(nome || nomeDetalhes || '');
  const dataAlvo = normalizarTexto(data || '');
  const usuarioAlvo = normalizarTexto(usuario || '');

  try {
    const db = lerDB();

    db.logs = db.logs.filter(item => {
      if (item.acao !== 'GERAR_CSV_SCM') return true;
      if (!nomeAlvo && !dataAlvo && !usuarioAlvo) return true;

      const nomeItem = normalizarTexto(obterNomeArquivo(item));
      const dataItem = normalizarTexto(item.data || '');
      const usuarioItem = normalizarTexto(item.usuario || '');

      const mesmoNome = nomeAlvo ? nomeItem === nomeAlvo : false;
      const mesmaData = dataAlvo ? dataItem === dataAlvo : true;
      const mesmoUsuario = usuarioAlvo ? usuarioItem === usuarioAlvo : true;

      const removerExato = mesmoNome && mesmaData && mesmoUsuario;
      const removerDuplicadoMesmoArquivo = mesmoNome && mesmoUsuario;

      return !(removerExato || removerDuplicadoMesmoArquivo);
    });

    salvarDB(db);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro ao excluir histórico' });
  }
};
