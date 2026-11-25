# Arda Atlas — Mapa da Terra-média

Projeto de fã inspirado na exploração de LEGO O Senhor dos Anéis. Front-end em React, JavaScript (JSX), Vite e CSS. O mapa é uma representação vetorial esquemática original e não um atlas oficial ou completo de todas as terras de Tolkien.

## Executar

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

Build: `npm run build`. Prévia: `npm run preview`. Testes unitários de geometria: `npm test`.

## Funcionalidades

- Espaço + arrastar com o mouse; zoom por botões e rodinha; retorno à visão geral.
- Navegação por toque, teclado, minimapa, busca e localidades clicáveis.
- Interface responsiva, sem API ou banco de dados.

## Estrutura

```
src/
  components/    # Interface e componentes reutilizáveis
  data/          # Localidades
  hooks/         # Estado e eventos de navegação
  map/           # Cartografia e funções puras de geometria
  App.jsx
  main.jsx
  styles.css
tests/           # Testes unitários
```

Projeto independente, sem afiliação com Tolkien Estate, Warner Bros. ou LEGO. Não utiliza arquivos extraídos do jogo.
