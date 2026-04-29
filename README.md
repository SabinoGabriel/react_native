# Brasil em Foco

Protótipo desenvolvido para as disciplinas de PISI 3 e DSI da UFRPE.

## Objetivo deste guia

Este guia ajuda novos desenvolvedores a entender a arquitetura atual do projeto, manter o padrão visual e contribuir sem quebrar a organização.

## Pré-requisitos

1. Git instalado
2. Node.js LTS (recomendado: 20.x)
3. npm (já vem com o Node)
4. Expo Go no celular (Android ou iOS)

## Como começar

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/IsadoraMoraiss/Dsi_repository
cd Dsi_repository
```

Instale as dependências:

```bash
npm install
```

## Como rodar no Expo Go

1. Suba o servidor Expo:

```bash
npx expo start
```

2. Abra o app Expo Go no celular e escaneie o QR code exibido no terminal.

## Scripts úteis

```bash
npm run start   # Inicia o projeto
npm run android # Roda no emulador Android
npm run ios     # Roda no emulador iOS
npm run web     # Roda no navegador
```

## Arquitetura atual

O projeto usa Expo Router com separação clara entre rota, lógica e apresentação:

- `src/app`: páginas/rotas (estado, validação e navegação)
- `src/components`: apresentação e blocos reutilizáveis por domínio
- `src/constants`: design tokens e constantes visuais
- `src/utils`: utilitários de responsividade
- `src/data`: dados mockados
- `src/types`: declarações de tipos globais (ex.: assets)

### Estrutura do projeto

```text
Dsi_repository/
├── assets/
│   ├── icons/
│   └── README.md
├── src/
│   ├── app/                    # Rotas e telas (Expo Router)
│   │   ├── index.tsx           # Splash
│   │   ├── login.tsx
│   │   ├── cadastro.tsx
│   │   ├── redefinir.tsx
│   │   ├── verificacao.tsx
│   │   ├── home.tsx
│   │   └── _layout.tsx         # Stack de navegação
│   ├── components/
│   │   ├── ui/                 # Componentes genéricos
│   │   ├── auth/components/    # Blocos de autenticação
│   │   └── home/               # Blocos da home
│   ├── constants/
│   │   ├── Colors.ts
│   │   ├── Tokens.ts
│   │   └── Typography.ts
│   ├── data/
│   │   └── mockCidades.ts
│   ├── types/
│   │   └── assets.d.ts
│   └── utils/
│       └── responsive.ts
├── app.json
├── package.json
└── tsconfig.json
```

## Padrão de implementação das telas

As páginas em `src/app` devem ser "lógica-only":

- controlam estado (`useState`)
- executam validações e handlers
- fazem navegação (`router.push`, `router.replace`)
- delegam layout e estilo para componentes em `src/components`

Exemplo do padrão:

- `login.tsx` e `cadastro.tsx` usam `AuthScreenLayout`, `FormField`, `CustomInput` e `PrimaryButton`
- `home.tsx` mantém estado de busca/navegação e delega UI para `HomeScreenContent`

## Design system e responsividade

### Tokens

Todo ajuste visual deve priorizar tokens em `src/constants/Tokens.ts`:

- `Spacing`
- `Radius`
- `Size`
- `IconSize`
- `Font`
- `Shadow`

### Responsividade

A base de responsividade está em `src/utils/responsive.ts`:

- `scale`, `vScale`, `mScale`, `fontScale`
- `useResponsive()` para ajustes por dimensão em tempo real

Regra prática:

- Evite valores fixos soltos nas páginas
- Em componentes de layout dinâmico (como `home`), prefira `useResponsive()`
- Em componentes de UI base, priorize tokens do tema

## Como criar nova página

1. Criar arquivo em `src/app/nova-rota.tsx`
2. Implementar apenas lógica da tela
3. Criar componente de apresentação em `src/components/<feature>/...`
4. Reutilizar `CustomInput`, `PrimaryButton` e blocos existentes quando possível
5. Registrar no stack em `src/app/_layout.tsx` se necessário
6. Validar com:

```bash
npx tsc --noEmit
```

## Como alterar página existente sem quebrar o padrão

1. Ajuste regra de negócio na página (`src/app`)
2. Ajuste visual no componente (`src/components`)
3. Se houver repetição, extraia componente reutilizável
4. Se o ajuste for global (tamanho, espaçamento, tipografia), altere tokens
5. Teste os fluxos principais:
- splash -> login
- login -> home
- cadastro -> home
- redefinir -> verificacao

## Troubleshooting rápido

### Erro: package.json não encontrado

Você provavelmente está na pasta errada. Entre no diretório do projeto:

```bash
cd Dsi_repository
npx expo start
```

### Porta ocupada ou cache antigo

```bash
npx expo start --clear
```

### Expo Go não conecta ao projeto

- Verifique se celular e computador estão na mesma rede
- Reinicie Expo Go e o servidor Expo
- Verifique firewall/VPN

## Versões de referência

- expo: `~54.0.0`
- expo-router: `~6.0.23`
- react: `19.1.0`
- react-native: `0.81.5`
