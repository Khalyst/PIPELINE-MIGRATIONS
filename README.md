# DevOps Pipeline Migrator 🚀

> Seamlessly migrate and convert CI/CD pipelines across **Jenkins**, **GitLab CI/CD**, **GitHub Actions**, **AWS CodeBuild**, **Google Cloud Build**, and **Azure DevOps Pipelines**.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)

---

## 📖 Overview

Migrating enterprise CI/CD pipelines between cloud providers and automated build tools is often difficult, error-prone, and time-consuming. Syntax conventions, secret injection strategies, runner tags, and built-in environment variables differ significantly between platforms.

**DevOps Pipeline Migrator** automates this process. It translates pipeline syntax, maps environment variables and secret stores, highlights architectural gotchas, and provides side-by-side comparative inspection across all 6 major CI/CD formats.

---

## ✨ Key Features

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

### 🧠 Dual Translation Engine
- **AI-Powered Translation**: Leverages **Google Gemini 3.8 Flash** (`@google/genai`) to understand build scripts, complex condition trees, containerization steps, and plugin equivalents.
- **Deterministic AST Fallback**: Built-in regex and AST parser guarantees 100% offline conversion reliability even if an external API key is not configured.

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
- **AI Engine**: Google Gemini API via `@google/genai` TypeScript SDK
- **Deployment**: Docker / Google Cloud Run / AI Studio container environment

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Gemini API Key**: For AI-powered deep conversions. Get one free at [Google AI Studio](https://aistudio.google.com/).

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

### Deploy to Google Cloud Run
1. Ensure the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) is installed and authenticated.
2. Build and deploy directly:
   ```bash
   gcloud run deploy devops-pipeline-migrator \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars GEMINI_API_KEY="your_api_key_here"
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
├── server.ts                     # Express server & API endpoints (/api/convert, /api/validate)
├── server/
│   └── converter.ts              # Gemini AI & Deterministic AST conversion engines
└── src/
    ├── main.tsx                  # React DOM entry point
    ├── App.tsx                   # Main workstation layout & state coordinator
    ├── index.css                 # Tailwind CSS styling entry
    ├── types/
    │   └── pipeline.ts           # TypeScript interfaces for formats, stages, and issues
    ├── data/
    │   └── pipelineConstants.ts  # Format metadata, cheatsheet table, and sample templates
    └── components/
        ├── Header.tsx            # Navigation, format selectors & action controls
        ├── SourceEditor.tsx      # Input editor with file drop, line numbers & linting
        ├── TargetViewer.tsx      # Converted output viewer with copy & download
        ├── MigrationInsights.tsx # Diagnostics (variables, secrets, gotchas, stages)
        ├── EnvVarCheatsheet.tsx  # Cross-platform variable & secret reference matrix
        └── TemplateModal.tsx     # Enterprise template selector modal
```

---

## 🔌 API Endpoints

### `POST /api/convert`
Translates pipeline code from one format to another or to all formats in parallel.

**Request Body (Single Format):**
```json
{
  "sourceCode": "pipeline { agent any; stages { stage('Build') { steps { sh 'npm test' } } } }",
  "sourceFormat": "jenkins",
  "targetFormat": "github-actions",
  "convertAll": false
}
```

**Request Body (Multi-Target Mode):**
```json
{
  "sourceCode": "...",
  "sourceFormat": "gitlab",
  "convertAll": true
}
```

**Response Format:**
```json
{
  "sourceFormat": "gitlab",
  "result": {
    "targetFormat": "github-actions",
    "filename": ".github/workflows/pipeline.yml",
    "convertedCode": "name: CI/CD Pipeline\n...",
    "explanation": "Converted GitLab stages into GitHub Actions jobs...",
    "envVarMappings": [
      { "sourceVar": "$CI_COMMIT_SHA", "targetVar": "github.sha", "notes": "Commit SHA" }
    ],
    "secretMappings": [
      { "sourceSecret": "GitLab CI/CD Variables", "targetMechanism": "${{ secrets.VAR }}", "setupInstructions": "..." }
    ],
    "migrationWarnings": [],
    "stepEquivalence": [],
    "complexity": "Medium",
    "aiPowered": true
  }
}
```

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
