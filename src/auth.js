// src/auth.js
// Chamadas ao Neon Auth (Managed Better Auth) usando fetch.

const AUTH_URL = process.env.EXPO_PUBLIC_NEON_AUTH_URL;

// O Neon Auth exige o cabeçalho "Origin" nos POSTs.
// O navegador envia sozinho; o React Native NÃO envia. Por isso enviamos aqui.
// Qualquer origem localhost é aceita por padrão pelo Neon Auth.
const ORIGIN = 'http://localhost:3000';

// Tradução das mensagens de erro mais comuns.
const MENSAGENS = {
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha incorretos.',
  USER_ALREADY_EXISTS: 'Este e-mail já está cadastrado.',
  PASSWORD_TOO_SHORT: 'A senha é muito curta (mínimo 8 caracteres).',
  INVALID_EMAIL: 'E-mail inválido.',
};

function traduzirErro(data, status) {
  const code = data && data.code ? String(data.code) : '';
  const chave = Object.keys(MENSAGENS).find((k) => code.startsWith(k));
  if (chave) return MENSAGENS[chave];
  return (data && data.message) || 'Erro inesperado (' + status + ').';
}

// Função base: todas as outras usam esta.
async function request(path, { method = 'GET', body } = {}) {
  if (!AUTH_URL) {
    throw new Error(
      'Variável EXPO_PUBLIC_NEON_AUTH_URL não encontrada. Confira o arquivo .env e recarregue o app.'
    );
  }

  let resposta;
  try {
    resposta = await fetch(AUTH_URL + path, {
      method,
      credentials: 'include', // deixa o celular guardar o cookie de sessão
      headers: {
        'Content-Type': 'application/json',
        Origin: ORIGIN,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error('Não foi possível conectar. Verifique sua internet.');
  }

  const texto = await resposta.text();
  let data = null;
  try {
    data = texto ? JSON.parse(texto) : null;
  } catch (e) {
    data = null;
  }

  if (!resposta.ok) {
    throw new Error(traduzirErro(data, resposta.status));
  }
  return data;
}

// 1) Cadastro
export function cadastrar({ name, email, password }) {
  return request('/sign-up/email', {
    method: 'POST',
    body: { name, email, password },
  });
}

// 2) Login
export function entrar({ email, password }) {
  return request('/sign-in/email', {
    method: 'POST',
    body: { email, password },
  });
}

// 3) Logout
export function sair() {
  return request('/sign-out', { method: 'POST', body: {} });
}

// 4) Quem está logado? Devolve { session, user } ou null.
export async function buscarSessao() {
  const data = await request('/get-session');
  return data && data.user ? data : null;
}
