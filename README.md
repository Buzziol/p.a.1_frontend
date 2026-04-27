# AegisDerm

Este é o projeto frontend do **AegisDerm**, desenvolvido com **Vue.js 3**, **Vite** e **Tailwind CSS**.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em sua máquina:

*   **Node.js** (versão 18 ou superior recomendada)
*   **npm** (gerenciador de pacotes padrão do Node)

## 🚀 Instalação

Siga os passos abaixo para configurar o projeto localmente:

1.  **Clone o repositório** (caso ainda não tenha feito):
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd aegisderm-front
    ```

2.  **Instale as dependências**:
    Na raiz do projeto (onde está o arquivo `package.json`), execute:
    ```bash
    npm install
    ```

3.  **Configuração da API**:
    Crie um arquivo `.env` na raiz do projeto e defina a URL da API (se diferente do padrão):
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api/v1
    ```

## 💻 Como Rodar o Projeto

### Ambiente de Desenvolvimento

Para iniciar o servidor de desenvolvimento com *Hot Module Replacement (HMR)*:

```bash
npm run dev
```

O terminal exibirá o endereço local (geralmente `http://localhost:5173`) para você acessar a aplicação no navegador.

### Build de Produção

Para gerar os arquivos otimizados para produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`.

### Visualizar Build (Preview)

Para testar localmente a versão de produção gerada:

```bash
npm run preview
```

## 🛠️ Tecnologias Utilizadas

*   [Vue.js 3](https://vuejs.org/) - Framework JavaScript Progressivo
*   [Vite](https://vitejs.dev/) - Build tool rápida para desenvolvimento web moderno
*   [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
*   [PostCSS](https://postcss.org/) & [Autoprefixer](https://github.com/postcss/autoprefixer) - Processamento de CSS

## 📂 Estrutura de Pastas

*   `src/` - Código fonte da aplicação
*   `public/` - Arquivos estáticos
*   `index.html` - Ponto de entrada da aplicação
*   `vite.config.js` - Configuração do Vite
*   `tailwind.config.cjs` - Configuração do Tailwind CSS
