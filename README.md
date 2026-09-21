# DevOps Pipeline Migrator 🚀

> Migrez et convertissez vos pipelines CI/CD entre **Jenkins**, **GitLab CI/CD**, **GitHub Actions**, **AWS CodeBuild**, **Google Cloud Build** et **Azure DevOps Pipelines** grâce à un **Moteur IA Universel** multi-fournisseurs ou un analyseur déterministe AST 100% hors-ligne.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Moteur IA](https://img.shields.io/badge/Moteur%20IA-Universel%20%26%20AST-indigo?logo=openai&logoColor=white)](https://aistudio.google.com/)
[![i18n](https://img.shields.io/badge/i18n-7%20Languages-emerald)](https://github.com/)

---

## 📖 Overview / Présentation Générale

Migrating enterprise CI/CD pipelines between cloud providers and automated build tools is often difficult, error-prone, and time-consuming. Syntax conventions, secret injection strategies, runner tags, and built-in environment variables differ significantly between platforms.

Propulsé par un **Moteur IA** (Universal AI Engine) de nouvelle génération, **DevOps Pipeline Migrator** automatise intégralement cette transition. Le **moteur IA** analyse la sémantique de vos workflows, traduit la syntaxe native, fait correspondre les variables d'environnement et les secrets, détecte les incompatibilités architecturales et génère des équivalences parfaites à travers les 6 formats CI/CD leaders du marché.

---

## ✨ Key Features / Fonctionnalités Clés

### 🌐 Moteur IA Universel & BYOK (Universal AI & Bring Your Own Key Engine)
Le **moteur IA** de l'application est conçu pour être agnostique, hautement résilient et adaptable aux exigences de sécurité de chaque organisation :
- **Architecture Multi-Fournisseurs du Moteur IA** :
  - **Google Gemini** : `gemini-3.8-flash`, `gemini-3.1-flash-lite`, `gemini-3.1-pro-preview` (clé intégrée ou clé API personnalisée).
  - **OpenAI** : `gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini`.
  - **Anthropic Claude** : `claude-3-7-sonnet-latest`, `claude-3-5-haiku-latest`.
  - **Groq Cloud** : Inférence ultra-rapide (800+ tokens/s) avec `llama-3.3-70b-versatile`, `deepseek-r1-distill-llama-70b`.
  - **DeepSeek** : `deepseek-chat` (V3), `deepseek-reasoner` (R1).
  - **OpenRouter** : Routage unifié vers plus de 100 modèles d'IA.
  - **Ollama (Moteur IA 100% Local)** : Exécution totalement privée et hors-ligne sur votre infrastructure locale (`llama3`, `codellama`, `qwen2.5-coder`, `mistral`) sans aucune fuite de données vers l'extérieur.
  - **Passerelle Personnalisée (Custom OpenAI-Compatible API)** : Raccordement direct aux passerelles d'entreprise (vLLM, LM Studio, TGI, Azure OpenAI).
- **Résilience et Cascade du Moteur IA** :
  - En cas de saturation temporaire des quotas gratuits (HTTP 429), le **moteur IA** bascule automatiquement vers un modèle alternatif haute capacité (`gemini-3.1-flash-lite`).
  - Si aucune connexion IA n'est disponible, le **moteur IA** active son analyseur déterministe AST pour garantir une conversion instantanée et sans interruption.
- **Mode Déterministe AST (Sans IA)** : Mode zéro-réseau, instantané et sans aucune clé requise, idéal pour les environnements air-gapped.
- **Diagnostic en Direct** : Testeur de connectivité intégré affichant la latence réelle en millisecondes (`ms`) pour valider la configuration du **moteur IA**.

### 🌍 International Multi-Language Support (7 Languages)
Instant one-click language toggle across the entire application:
- 🇺🇸 **English** (US)
- 🇫🇷 **Français** (French)
- 🇪🇸 **Español** (Spanish)
- 🇩🇪 **Deutsch** (German)
- 🇯🇵 **日本語** (Japanese)
- 🇨🇳 **中文** (Simplified Chinese)
- 🇵🇹 **Português** (Portuguese)

### 🔄 6-Way Cross-Platform Pipeline Conversion
Convert between any combination of the following formats:
- **Jenkins** (`Jenkinsfile` — Declarative & Scripted Groovy DSL)
- **GitLab CI/CD** (`.gitlab-ci.yml` — Stages, jobs, rules, cache, artifacts, services)
- **GitHub Actions** (`.github/workflows/pipeline.yml` — Jobs, steps, actions, matrix, `needs`)
- **AWS CodeBuild / CodePipeline** (`buildspec.yml` v0.2 — Phases, artifacts, env cache)
- **Google Cloud Build** (`cloudbuild.yaml` — Steps, substitutions, cloud builders)
- **Azure DevOps Pipelines** (`azure-pipelines.yml` — Stages, jobs, tasks, service connections)

### ⚡ Multi-Target Parallel Conversion
Convert any source pipeline into **all 5 other cloud formats simultaneously** in a single click. Compare how AWS, GCP, Azure, GitLab, and GitHub Actions structure the identical workflow.

### 🔍 Deep Migration Diagnostics
- **Environment Variable Mapping**: Automatically translates dynamic build IDs, commit SHAs, branch references, and workspace paths.
- **Secrets & Auth Migration Guide**: Step-by-step instructions for migrating credentials (e.g., Jenkins `withCredentials`, GitLab masked variables, GitHub Secrets, AWS SSM/Secrets Manager, GCP Secret Manager, Azure Key Vault).
- **Migration Warnings & Gotchas**: Automated detection of unsupported plugins, legacy shell constructs, Docker-in-Docker requirements, and runner architectural differences.
- **Stage & Step Equivalence**: Structural phase-by-phase mapping to ensure parity between source and target pipelines.

### 📚 Pre-Loaded Enterprise Templates
Test migrations instantly with real-world production pipelines:
- **Node.js & Docker CI/CD** (Linting, coverage reports, multi-stage Docker builds, container push)
- **Java Maven + SonarQube** (Compiles, unit tests, code quality gates, artifact archival)
- **Python FastAPI Microservice** (Poetry dependencies, PyTest, security scanning)
- **AWS CodeBuild BuildSpec** (Multi-phase native build specifications)
- **GCP Cloud Build** (Official Cloud Builder image steps & substitutions)
- **Azure DevOps Pipelines** (Multi-stage Azure Pipelines with staging/production approvals)
- **GitLab CI with Kaniko** (Unprivileged rootless Docker container build and push)

### 📊 Cross-Platform DevOps Cheatsheet
Built-in searchable matrix detailing syntax equivalents, pre-defined environment variables, trigger hooks, and secret management patterns across all platforms.

---

## 🗂️ Environment Variable Reference Matrix

| Variable Concept | Jenkins | GitLab CI/CD | GitHub Actions | AWS CodeBuild | GCP Cloud Build | Azure DevOps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Build / Run ID** | `env.BUILD_NUMBER` | `$CI_PIPELINE_IID` | `github.run_number` | `$CODEBUILD_BUILD_NUMBER` | `$BUILD_ID` | `Build.BuildId` |
| **Git Branch** | `env.BRANCH_NAME` | `$CI_COMMIT_REF_NAME` | `github.ref_name` | `$CODEBUILD_WEBHOOK_HEAD_REF` | `$BRANCH_NAME` | `Build.SourceBranchName` |
| **Commit SHA** | `env.GIT_COMMIT` | `$CI_COMMIT_SHA` | `github.sha` | `$CODEBUILD_RESOLVED_SOURCE_VERSION` | `$COMMIT_SHA` | `Build.SourceVersion` |
| **Workspace Root** | `env.WORKSPACE` | `$CI_PROJECT_DIR` | `github.workspace` | `$CODEBUILD_SRC_DIR` | `/workspace` | `Pipeline.Workspace` |
| **Repository Name** | `env.JOB_NAME` | `$CI_PROJECT_PATH` | `github.repository` | `$CODEBUILD_SOURCE_REPO_URL` | `$REPO_NAME` | `Build.Repository.Name` |

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)
- **Backend**: [Express](https://expressjs.com/), [Node.js](https://nodejs.org/) (ESM + CommonJS bundling with `esbuild`), `tsx`
- **Moteur IA (AI Engine)**: Moteur IA universel et modulaire (`/server/aiDispatcher.ts`) orchestrant Google Gemini (`@google/genai`), Anthropic Claude, OpenAI, Groq, DeepSeek, Ollama local, et moteur déterministe AST hors-ligne.
- **Internationalisation (i18n)**: Contexte React natif supportant 7 langues avec mémorisation locale.
- **Deployment**: Docker / Google Cloud Run / AI Studio container environment

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Gemini API Key / Clé Moteur IA**: Get one free at [Google AI Studio](https://aistudio.google.com/) or configure your preferred provider in the in-app AI Engine settings.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/devops-pipeline-migrator.git
   cd devops-pipeline-migrator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key (optional — deterministic AST conversion works offline):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 📦 Production Build & Deployment

### Local Production Build
```bash
# Compiles Vite frontend and bundles the Express server with esbuild into dist/server.cjs
npm run build

# Start the compiled production server
npm start
```

### 🌐 Publish this App with Google

You have two simple ways to publish this application with Google:

#### Method 1: AI Studio 1-Click Cloud Run Deployment (Easiest)
1. In the top right corner of the AI Studio Build workspace, click the **Deploy** or **Share** button.
2. Select **Deploy to Cloud Run**.
3. Choose your Google Cloud Project or allow AI Studio to provision a managed instance.
4. Your application will be live on an official Google Cloud Run HTTPS URL (e.g. `https://your-app-xxxx.run.app`).

#### Method 2: Deploy from CLI via `gcloud`
1. Ensure the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) is installed and authenticated:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_GOOGLE_CLOUD_PROJECT_ID
   ```
2. Build and deploy directly using Cloud Run:
   ```bash
   gcloud run deploy devops-pipeline-migrator \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars GEMINI_API_KEY="your_api_key_here"
   ```

---

### 🐙 Copy and Push to your GitHub Account

To copy or sync this repository and its files to your GitHub account:

#### Method 1: Export directly via AI Studio UI
1. In Google AI Studio Build, click on the **Settings** (gear icon) in the navigation bar.
2. Click **Export to GitHub** or **Download ZIP**.
3. Authorize your GitHub account (`akay94@gmail.com`) and choose your target repository name.
4. The entire codebase, including all commit history and this `README.md`, will be synced directly to your repository!

#### Method 2: Git Command Line
```bash
# 1. Initialize git if not already initialized
git init

# 2. Add all project files
git add .
git commit -m "feat: complete DevOps Pipeline Migrator with Universal AI and 7-language i18n"

# 3. Create a new repository on your GitHub account (e.g., devops-pipeline-migrator)
# 4. Link your remote repository and push:
git remote add origin https://github.com/your-username/devops-pipeline-migrator.git
git branch -M main
git push -u origin main
```

### 🐳 Docker Container Deployment

The application includes an optimized multi-stage `Dockerfile` and `docker-compose.yml`:
- **Lightweight multi-stage build** based on `node:20-alpine` (builder + minimal runtime).
- **Security hardened**: runs as the unprivileged `node` user.
- **Built-in healthcheck**: monitors `http://127.0.0.1:3000/api/health`.

#### Option A: Run with Docker Compose (Recommended)
```bash
# Start container in detached mode
docker compose up -d

# View container logs
docker compose logs -f

# Stop container
docker compose down
```

#### Option B: Build and Run with Docker CLI
```bash
# 1. Build the Docker image
docker build -t devops-pipeline-migrator .

# 2. Run container on port 3000
docker run -d \
  --name devops-pipeline-migrator \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_api_key_here" \
  --restart unless-stopped \
  devops-pipeline-migrator

# 3. Check health status
docker inspect --format='{{json .State.Health.Status}}' devops-pipeline-migrator
```
Once running, open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
devops-pipeline-migrator/
├── Dockerfile                    # Multi-stage production container definition
├── docker-compose.yml            # Docker Compose service definition
├── .dockerignore                 # Excluded build paths for Docker daemon
├── .env.example                  # Environment variable configuration template
├── index.html                    # Application HTML entry point
├── metadata.json                 # AI Studio & applet metadata
├── package.json                  # Scripts & dependencies
├── package-lock.json             # Pinned dependency lockfile for Docker builds
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build and Tailwind plugins
├── server.ts                     # Express server & API endpoints (/api/convert, /api/validate, /api/test-ai-config)
├── server/
│   ├── aiDispatcher.ts           # Moteur IA universel multi-fournisseurs (Gemini, Claude, OpenAI, Ollama, Groq, DeepSeek)
│   ├── converter.ts              # Moteur de conversion & parseur déterministe AST hors-ligne
│   └── errorUtils.ts             # Gestionnaire d'erreurs et de quotas du Moteur IA
└── src/
    ├── main.tsx                  # React DOM entry point
    ├── App.tsx                   # Main workstation layout & state coordinator
    ├── index.css                 # Tailwind CSS styling entry
    ├── types/
    │   ├── pipeline.ts           # TypeScript interfaces for formats, stages, and issues
    │   └── ai.ts                 # Interfaces et configurations du Moteur IA
    ├── data/
    │   ├── pipelineConstants.ts  # Format metadata, cheatsheet table, and sample templates
    │   └── aiConstants.ts        # Presets des fournisseurs et modèles du Moteur IA
    ├── i18n/
    │   ├── I18nContext.tsx       # Contexte d'internationalisation
    │   └── translations.ts       # Dictionnaires de traduction pour 7 langues (dont Français)
    └── components/
        ├── Header.tsx            # Navigation, format selectors & action controls
        ├── SourceEditor.tsx      # Input editor with file drop, line numbers & linting
        ├── TargetViewer.tsx      # Converted output viewer with copy & download
        ├── MigrationInsights.tsx # Diagnostics (variables, secrets, gotchas, stages)
        ├── EnvVarCheatsheet.tsx  # Cross-platform variable & secret reference matrix
        ├── AISettingsModal.tsx   # Centre de configuration du Moteur IA (BYOK, local, cloud)
        └── TemplateModal.tsx     # Enterprise template selector modal
```

---

## 🔌 API Endpoints

### `POST /api/convert`
Translates pipeline code from one format to another or to all formats in parallel using the selected **moteur IA** or deterministic AST engine.

**Request Body (Single Format):**
```json
{
  "sourceCode": "pipeline { agent any; stages { stage('Build') { steps { sh 'npm test' } } } }",
  "sourceFormat": "jenkins",
  "targetFormat": "github-actions",
  "convertAll": false,
  "aiConfig": {
    "provider": "gemini",
    "model": "gemini-3.8-flash"
  }
}
```

**Request Body (Multi-Target Mode):**
```json
{
  "sourceCode": "...",
  "sourceFormat": "gitlab",
  "convertAll": true,
  "aiConfig": {
    "provider": "ollama",
    "model": "codellama",
    "baseUrl": "http://localhost:11434/v1"
  }
}
```

### `POST /api/test-ai-config`
Tests connectivity and measures response latency (in milliseconds) for the configured **moteur IA** (Gemini, Claude, OpenAI, Groq, Ollama, DeepSeek).

### `POST /api/validate`
Performs real-time syntax checking and sanity validation on the pipeline input.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

