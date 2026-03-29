# 🚀 Fluxo AGES 2.0 - Front-end

Frontend do Fluxo AGES 2.0: a nova versão do sistema web para gestão de horas e relatórios da Agência Experimental de Eng. de Software (AGES) da PUCRS. Feito em React + TS (Vite).

Este projeto foi construído com foco em performance e organização, utilizando as seguintes tecnologias principais:
- **React** com **TypeScript**
- **Vite** (Build tool super rápida)

---

## 🛠️ Como rodar o projeto localmente

Para baixar e rodar este front-end na sua máquina, siga os passos abaixo:

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** instalado na sua máquina (versão 18 ou superior recomendada).

### 2. Clone o repositório
Abra o seu terminal e clone o projeto baixando da nossa organização oficial:

```bash
git clone [https://github.com/Fluxo-Alunos-AGES-2-0/fluxo-ages-frontend.git](https://github.com/Fluxo-Alunos-AGES-2-0/fluxo-ages-frontend.git)
```

### 3. Instale as dependências
Entre na pasta do projeto e instale os pacotes necessários:

```bash
cd fluxo-ages-frontend
npm install
```

### 4. Configure as Variáveis de Ambiente
Temos um arquivo de exemplo com as variáveis que o projeto precisa para rodar.
1. Crie uma cópia do arquivo `.env.example` e renomeie a cópia para `.env`.
2. O arquivo `.env` já está no `.gitignore`, então suas senhas e links locais estarão seguros e não subirão para o GitHub.

### 5. Rode o Servidor de Desenvolvimento
Com tudo instalado e configurado, suba o projeto:

```bash
npm run dev
```
O terminal vai mostrar um link (geralmente `http://localhost:5173`). É só clicar nele para ver a aplicação rodando no seu navegador!

---

## 🌿 Fluxo de Trabalho e Branches

A nossa branch principal de desenvolvimento é a **`dev`**. A branch `main` está protegida e guarda apenas código pronto para produção.

**Como contribuir (Regra para a equipe de dev):**
1. Atualize sua branch local: `git pull origin dev`
2. Crie uma nova branch para a sua tarefa: `git checkout -b feature/nome-da-sua-tela`
3. Faça suas alterações e seus commits.
4. Envie sua branch para o GitHub: `git push origin feature/nome-da-sua-tela`
5. Abra um **Pull Request (PR)** apontando para a branch `dev`.
6. Aguarde o Code Review da equipe de Infraestrutura (AGES III) para aprovação e merge.
7. teste-front
