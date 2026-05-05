# AegisDerm Frontend

Frontend do sistema **AegisDerm** (TCC), desenvolvido com **Vue 3 + Vite + Tailwind + Axios**.

Este README foi preparado para facilitar a execução do projeto em **outras máquinas** (Windows, Linux e macOS).

---

## 1- Requisitos

Antes de executar, instale:

- Node.js 18+ (recomendado: Node 20 LTS)
- npm 9+
- Git

Verifique versões:

node -v  
npm -v  
git --version  

---

## 2- Clonar o projeto

git clone <URL_DO_REPOSITORIO>  
cd p.a.1_frontend  

> Se o nome da pasta local for diferente, use o nome correto no cd.

---

## 3- Instalar dependências

npm install  

Se houver erro de cache, tente:

npm cache clean --force  
npm install  

---

## 4- Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

VITE_API_BASE_URL=http://localhost:5000/api/v1  

Observação importante:

- O frontend depende do backend Flask rodando localmente nessa URL.
- Se o backend estiver em outro host/porta, ajuste VITE_API_BASE_URL.

---

## 5- Rodar em desenvolvimento

npm run dev  

Acesse no navegador a URL mostrada no terminal (normalmente http://localhost:5173).

---

## 6- Build e preview (produção local)

Build:

npm run build  

Gera os arquivos em dist/.

Preview:

npm run preview  

---

## 7- Fluxo básico de teste manual

1. Abra /login  
2. Faça login com usuário seedado do backend  
3. Verifique redirecionamento para /dashboard  
4. Navegue por pacientes/agenda conforme o perfil  

Usuários de teste:

superadmin@dermato.local / Admin123!  
admin@dermato.local / Admin123!  
medico@dermato.local / Admin123!  
recepcao@dermato.local / Admin123!  

---

## 8- Problemas comuns

### 8.1 npm install falha

Verifique internet/proxy corporativo  
Verifique permissão no registry npm  

Tente:

rm -rf node_modules package-lock.json  
npm install  

---

### 8.2 Erro de CORS no login/API

Confirme backend ativo em http://localhost:5000  
Confirme VITE_API_BASE_URL correta  
Reinicie o frontend após alterar .env  

---

### 8.3 Login retorna 401/403

Verifique credenciais  
Limpe localStorage no navegador  
Faça novo login  

---

## 9- Stack do projeto

Vue 3  
Vite  
Tailwind CSS  
Axios  
Pinia  
Vue Router  

---

## 10- Estrutura principal

src/ → código fonte  
src/pages/ → páginas  
src/components/ → componentes  
src/services/ → API  
src/stores/ → estado global  
src/router/ → rotas  
docs/ → documentação  

---

## 11- Comandos úteis

npm run dev       → desenvolvimento  
npm run build     → build  
npm run preview   → preview  