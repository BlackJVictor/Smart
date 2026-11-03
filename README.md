# SmartAcessórios - Assistência & E-commerce (São Roque)

Aplicação React + TypeScript + Vite + Tailwind CSS pronta para deploy no **Vercel**.

## 🚀 Como fazer Deploy no Vercel

### Opção 1: Pelo GitHub (Recomendado)
1. Suba este projeto para o seu repositório no [GitHub](https://github.com).
2. Acesse [vercel.com](https://vercel.com) e faça login.
3. Clique em **"Add New..."** > **"Project"**.
4. Importe o repositório do projeto.
5. As configurações padrão são detectadas automaticamente:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Clique em **"Deploy"** e em menos de 1 minuto seu site estará no ar!

---

### Opção 2: Pelo Terminal (Vercel CLI)
Caso prefira enviar direto pelo terminal no seu computador:
```bash
npm install -g vercel
vercel
```
Siga as instruções rápidas na tela e o projeto será publicado.

---

## 🛠️ Configuração de Rotas
O arquivo `vercel.json` já está configurado na raiz com redirecionamento de rotas SPA (`index.html`) para garantir que todas as páginas e rotas funcionem perfeitamente sem erros de 404.
