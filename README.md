# Pokédex UC33

Serviço web em TypeScript (Node.js + Express 5) que consome a PokéAPI, com uma página em HTML/CSS/JS que consome só o nosso serviço.

## Como rodar
```
npm install
npm run dev      # desenvolvimento, em http://localhost:3000
npm run build    # confere tipos e gera dist/
npm start        # roda a versão compilada
```

## Rota da API
`GET /api/pokemons/:termo` (nome ou número)

```json
{"numero":25,"nome":"pikachu","tipos":["electric"],"imagem":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"}
```

Erros: `400` nome inválido, `404` não encontrado, `503` PokéAPI lenta/fora (timeout de 5 s). Formato: `{ "erro": "mensagem" }`.

## Desafios feitos
- Desafio 1: tipos em português. Um objeto `TIPOS_PT` no `app.js` traduz os 18 tipos só na tela; a API continua devolvendo em inglês, e a classe CSS (`tipo-fire` etc.) segue usando o nome original. Tipos que não estiverem no objeto aparecem no nome original.
- Desafio 2: cores para todos os tipos. O `style.css` agora tem uma classe `.tipo-*` para cada um dos 18 tipos de Pokémon (antes eram só 6), com tons escuros o bastante para o texto branco ficar legível.
- Desafio 3: histórico. Os últimos 5 Pokémon vistos aparecem como botões clicáveis abaixo dos controles (sem duplicar o mesmo Pokémon). Clicar volta para ele, e como o servidor tem cache, a resposta é instantânea.
- Desafio 4: botão Aleatório. Sorteia um número de 1 a 151 com `Math.random()`, nunca repetindo o que está na tela.
- Desafio 5: visual próprio. CSS refeito do zero: em vez do aparelho vermelho centralizado, a tela é dividida em um palco (Pokémon grande, número em contorno, nome em destaque) e um painel (busca, navegação e histórico com miniaturas). O palco troca de cor conforme os tipos do Pokémon, em degradê quando são dois tipos.
- Extras de interação: setas ← → do teclado, animação de entrada da imagem, estados de hover e foco nos botões (respeitando `prefers-reduced-motion`) e layout responsivo para celular.
