# Breve resumo das alterações feitas
 - **Disclaimer importante**: A maioria do trabalho foi guiado pelas respostas do Gemini 3.1 Pro + AG Kit, especialmente a skill brainstorm.

## O que foi desenvolvido
1. **Infraestrutura e Banco de Dados:**
   - Integração completa com o **Firebase** (`firebase/app`, `firestore`, `auth`).
   - Implementação do **React Query (TanStack Query)** para gerenciar o cache das requisições, melhorando radicalmente a performance e criando uma UX de aplicativo "premium".
2. **Novas Telas (Features Faltantes):**
   - **Detalhes da Cidade** (`cidade/[id].tsx`): Carrega os dados reais da cidade, exibe foto e tem navegação para as interações.
   - **Sistema de Avaliações (CRUD)** (`avaliacoes/[id].tsx`): Formulário 100% funcional onde o usuário logado dá nota (1 a 5 estrelas) e escreve um review. Usa "Optimistic Updates" para que o comentário apareça instantaneamente na tela, sem "loadings" chatos.
   - **Roteiros** (`roteiro/[id].tsx`): Lista otimizada que busca no Firebase as sugestões de turismo filtrando pelo ID da cidade.
   - **Perfil do Usuário** (`perfil.tsx`): Tela onde exibe as informações de conta vinculadas à sessão do Firebase Auth, contendo botão de Log-out.
   - **Mapa Interativo** (`mapa.tsx`): Implementado com `react-native-maps`, usando as coordenadas geográficas reais para renderizar o mapa visual e os marcadores de destinos.
3. **Refatoração e Qualidade:**
   - A `Home` foi conectada ao banco real. Criamos um sistema de *Fallback* inteligente: caso o banco esteja vazio (sem cidades aterrissadas ainda), ele renderiza o Mock local para o app não ficar "quebrado".
   - Todo o código passou numa rígida auditoria de UX e TypeScript (100% funcional e zero erros de compilação), e foram adicionadas as *tags* de acessibilidade necessárias (`aria-label`).

---

## O que vocês (Donos do Projeto) precisam fazer agora

Para que o aplicativo conecte de fato com o banco de vocês e opere em produção real:

1. **Configurar as Chaves no `.env` (Como conseguir os dados do Firebase)**
   - No repositório, foi criado um arquivo modelo chamado `.env.example`. Vocês precisam criar um arquivo chamado `.env` na raiz do projeto e preencher com as credenciais de vocês.
   - **Passo a passo para pegar as chaves:**
     1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um novo projeto (ou abra o projeto do TCC).
     2. No painel inicial do projeto, clique no ícone de engrenagem (Configurações do projeto) no menu lateral esquerdo superior.
     3. Role a aba "Geral" até a seção "Seus aplicativos" (Your apps). Se não houver nenhum aplicativo, clique no ícone de Web (`</>`) para adicionar um App Web.
     4. Registre o app com um nome (ex: "Brasil em Foco").
     5. O Firebase vai gerar um bloco de código `firebaseConfig`. Copie os valores ali presentes (como `apiKey`, `authDomain`, `projectId`, etc).
     6. No computador de vocês, crie o arquivo `.env` e cole os valores seguindo o modelo do `.env.example`. Vai ficar parecido com isso:
        `EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyB..."`

2. **Regras do Firestore (Security Rules)**
   - No Firebase Console > Firestore Database > Rules, cole a seguinte regra de segurança que já foi pensada para o projeto não vazar dados e funcionar com as avaliações:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Cidades e Rotas são públicas para leitura
       match /cities/{city} { allow read: if true; allow write: if false; }
       match /routes/{route} { allow read: if true; allow write: if false; }
       
       // Avaliações: logado pode ler/criar, e só pode editar a sua própria
       match /reviews/{review} {
         allow read: if request.auth != null;
         allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
         allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

3. **Habilitar Autenticação (Authentication)**
   - No Firebase Console, vá na aba de "Authentication" > "Get Started" (ou "Começar").
   - Na aba "Sign-in method" (Método de login), ative o provedor **Email/Password** (E-mail/Senha). Se isso não for feito, as telas de Login e Cadastro que fizemos vão retornar erro de "provider disabled".

4. **Cadastrar os Dados Reais (Firestore)**
   - Atualmente a Home e o Mapa usam um sistema inteligente de *Fallback*: se a coleção `cities` não existir ou estiver vazia no Firestore, o app exibe dados falsos locais (Mocks) para não quebrar a apresentação.
   - **Passo a passo para criar os dados reais:**
     1. No Firebase Console, vá no menu lateral esquerdo em **"Firestore Database"**.
     2. Clique em "Create database" (Criar banco de dados), escolha o local padrão e confirme.
     3. Já dentro do banco de dados, clique em **Start collection** (Iniciar coleção) e dê o nome exato de `cities`.
     4. Na criação do primeiro documento, clique no botão **Auto-ID** para gerar o ID automaticamente.
     5. Adicione os seguintes campos (fields) exatamente com estes nomes e tipos para a primeira cidade:
        - `nome` *(string)*: ex: "Recife"
        - `estado` *(string)*: ex: "PE"
        - `regiao` *(string)*: ex: "Nordeste"
        - `categoria` *(string)*: ex: "Praia", "Cultura", "Gastronomia", "Natureza" ou "Histórico"
        - `avaliacao` *(number)*: ex: 4.8
        - `imagemUrl` *(string)*: Um link real de uma imagem na web.
        - `latitude` *(number)*: ex: -8.0476 (Pode pegar no Google Maps)
        - `longitude` *(number)*: ex: -34.8770
     6. Clique em **Save** (Salvar). A partir desse instante exato, o App vai abandonar os Mocks automaticamente e vai passar a carregar apenas os dados que vocês estão criando no banco!
     7. **(Opcional)** Podem repetir o mesmo processo para a coleção `routes` caso queiram criar roteiros reais.