const $ = (id) => document.getElementById(id);
let numeroAtual = 0;

const MAX_ALEATORIO = 151; // primeira geração
const MAX_HISTORICO = 5;
let historico = []; // { numero, nome }, o mais recente primeiro

// Desafio 1: a API continua mandando em inglês; só a tela traduz.
const TIPOS_PT = {
  normal: 'normal', fire: 'fogo', water: 'água', electric: 'elétrico',
  grass: 'planta', ice: 'gelo', fighting: 'lutador', poison: 'veneno',
  ground: 'terra', flying: 'voador', psychic: 'psíquico', bug: 'inseto',
  rock: 'pedra', ghost: 'fantasma', dragon: 'dragão', dark: 'sombrio',
  steel: 'aço', fairy: 'fada',
};

async function pedirPokemon(termo) {
  let resposta;
  try {
    resposta = await fetch(`/api/pokemons/${encodeURIComponent(termo)}`);
  } catch {
    throw new Error('Sem conexão com o servidor. Ele está rodando?');
  }
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(corpo.erro ?? `Erro ${resposta.status}`);
  return corpo;
}

function mostrarAviso(texto, tipo = 'erro') {
  $('aviso').textContent = texto;
  $('aviso').className = `aviso ${tipo}`;
  $('aviso').hidden = false;
}

// Desafio 3: últimos 5 Pokémon vistos, clicáveis.
function registrarNoHistorico(p) {
  historico = [{ numero: p.numero, nome: p.nome }, ...historico.filter((h) => h.numero !== p.numero)]
    .slice(0, MAX_HISTORICO);
  desenharHistorico();
}

function desenharHistorico() {
  $('secao-historico').hidden = historico.length === 0;
  $('historico').replaceChildren(...historico.map((h) => {
    const li = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = `#${String(h.numero).padStart(3, '0')} ${h.nome}`;
    botao.classList.toggle('atual', h.numero === numeroAtual);
    botao.addEventListener('click', () => buscar(String(h.numero)));
    li.append(botao);
    return li;
  }));
}

function mostrarPokemon(p) {
  numeroAtual = p.numero;
  $('aviso').hidden = true;
  $('numero').textContent = `#${String(p.numero).padStart(3, '0')}`;
  $('nome').textContent = p.nome;
  $('tipos').replaceChildren(...p.tipos.map((tipo) => {
    const li = document.createElement('li');
    li.textContent = TIPOS_PT[tipo] ?? tipo;
    li.className = `tipo tipo-${tipo}`;
    return li;
  }));

  // A borda da tela ganha a cor do primeiro tipo (reaproveita as cores do CSS).
  const primeiro = $('tipos').firstElementChild;
  document.querySelector('.tela').style.borderColor = primeiro ? getComputedStyle(primeiro).backgroundColor : '';

  const img = $('imagem');
  img.hidden = !p.imagem;
  if (p.imagem) { img.src = p.imagem; img.alt = p.nome; }
  // Reinicia a animação de entrada.
  img.classList.remove('entrada');
  void img.offsetWidth;
  img.classList.add('entrada');

  registrarNoHistorico(p);
}

function travarBotoes(travar) {
  for (const b of document.querySelectorAll('button')) b.disabled = travar;
  if (!travar) $('anterior').disabled = numeroAtual <= 1;
}

async function buscar(termo) {
  mostrarAviso('Buscando...', 'info');
  travarBotoes(true);
  try {
    mostrarPokemon(await pedirPokemon(termo));
  } catch (erro) {
    mostrarAviso(erro.message);
  } finally {
    travarBotoes(false);
  }
}

// Desafio 4: sorteia um número entre 1 e 151, diferente do que está na tela.
function sortear() {
  let n;
  do { n = Math.floor(Math.random() * MAX_ALEATORIO) + 1; } while (n === numeroAtual);
  return n;
}

$('imagem').addEventListener('error', () => { $('imagem').hidden = true; });
$('busca').addEventListener('submit', (e) => {
  e.preventDefault();
  buscar(e.target.termo.value.trim());
});
$('anterior').addEventListener('click', () => buscar(String(numeroAtual - 1)));
$('proximo').addEventListener('click', () => buscar(String(numeroAtual + 1)));
$('aleatorio').addEventListener('click', () => buscar(String(sortear())));

// Setas do teclado, exceto enquanto a pessoa digita no campo.
document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  if (e.key === 'ArrowLeft') $('anterior').click(); // botão travado ignora o clique
  if (e.key === 'ArrowRight') $('proximo').click();
});

buscar('1');
