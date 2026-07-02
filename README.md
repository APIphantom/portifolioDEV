# Adriano Oliveira — Portfólio

Este é o meu portfólio profissional, um projeto front-end de alta performance desenvolvido com foco em modernidade, fluidez e organização. O núcleo inicial deste projeto foi construído utilizando o Lovable, ferramenta que permitiu acelerar a prototipagem e a estruturação do corpo base da aplicação, garantindo uma base sólida para a integração das funcionalidades avançadas.

## 🚀 Stack Tecnológica

A aplicação utiliza as ferramentas mais atuais do ecossistema front-end para garantir escalabilidade e uma experiência de usuário impecável:

- **Estrutura Base:** Desenvolvido com Lovable para o design system e corpo inicial.
- **Framework:** TanStack Start + Vite.
- **Linguagem:** React 19 + TypeScript.
- **Estilização:** Tailwind CSS 4.
- **Animações:** Framer Motion.
- **Deploy:** Vercel.
- **Banco de dados:** Supabase.
- **Infraestrutura:** Deploy automatizado via Cloudflare Workers (wrangler).

## 🛠 Desenvolvimento

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório e instale as dependências:**
   ```bash
   git clone [https://github.com/APIphantom/portifolioDEV.git]
   cd [portifolioDEV]
   npm install

  
3. **Configuração de Variáveis:**
   ```bash
   cp .env.example .env


2. **Ambiente de Desenvolvimento:**
   ```bash
   npm run dev

   
3. **Build e Deploy:**
   ```bash
   npm run build
   npm run deploy

Para realizar o deploy em ambiente de produção utilizando o Cloudflare Workers:
  


Nota: Certifique-se de configurar no painel da Cloudflare (ou no seu .env local) todas as variáveis de ambiente com o prefixo VITE_* listadas no arquivo .env.example.

## ⚙️ Gestão de Conteúdo (Admin)
O portfólio possui um painel administrativo integrado para gestão dinâmica dos seus projetos:

Acesse o painel Admin via npm run dev.

Navegue até a aba Importar GitHub.

Insira o link do repositório ([https://github.com/APIphantom/portifolioDEV.git]) ou apenas o seu username (APIphantom).

Utilize o Preview para realizar ajustes e clique em Salvar no portfólio.

Importação em Lote: O sistema suporta a importação de até 12 repositórios públicos simultaneamente.

Funcionalidades extras: Para autenticação, utilize o GITHUB_TOKEN e configure o Supabase conforme descrito em docs/GITHUB_IMPORT.md.


## ⚖️ Licença

Projeto pessoal — Todos os direitos reservados.
