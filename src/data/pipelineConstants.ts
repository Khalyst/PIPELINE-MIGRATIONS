import { FormatMeta, PipelineFormat, PipelineTemplate } from '../types/pipeline';

export const PIPELINE_FORMATS: Record<PipelineFormat, FormatMeta> = {
  'jenkins': {
    id: 'jenkins',
    name: 'Jenkins Pipeline',
    shortName: 'Jenkins',
    badge: 'Jenkinsfile',
    filename: 'Jenkinsfile',
    language: 'groovy',
    color: '#D33833',
    bgColor: '#FDF2F2',
    borderColor: '#FECACA',
    description: 'Jenkins Declarative / Scripted Groovy pipeline DSL',
    officialDocUrl: 'https://www.jenkins.io/doc/book/pipeline/syntax/',
  },
  'gitlab': {
    id: 'gitlab',
    name: 'GitLab CI/CD',
    shortName: 'GitLab',
    badge: '.gitlab-ci.yml',
    filename: '.gitlab-ci.yml',
    language: 'yaml',
    color: '#FC6D26',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    description: 'GitLab CI/CD YAML with stages, jobs, image, artifacts, and rules',
    officialDocUrl: 'https://docs.gitlab.com/ci/yaml/',
  },
  'github-actions': {
    id: 'github-actions',
    name: 'GitHub Actions',
    shortName: 'GitHub',
    badge: '.github/workflows',
    filename: '.github/workflows/pipeline.yml',
    language: 'yaml',
    color: '#2088FF',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    description: 'GitHub Actions workflow YAML syntax with reusable actions & jobs',
    officialDocUrl: 'https://docs.github.com/en/actions/writing-workflows',
  },
  'aws': {
    id: 'aws',
    name: 'AWS CodePipeline / CodeBuild',
    shortName: 'AWS',
    badge: 'buildspec.yml',
    filename: 'buildspec.yml',
    language: 'yaml',
    color: '#FF9900',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    description: 'AWS CodeBuild buildspec v0.2 YAML with phased execution lifecycle',
    officialDocUrl: 'https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html',
  },
  'gcp': {
    id: 'gcp',
    name: 'Google Cloud Build',
    shortName: 'GCP',
    badge: 'cloudbuild.yaml',
    filename: 'cloudbuild.yaml',
    language: 'yaml',
    color: '#4285F4',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    description: 'Google Cloud Build YAML containerized steps and substitutions',
    officialDocUrl: 'https://cloud.google.com/build/docs/build-config-file-schema',
  },
  'azure': {
    id: 'azure',
    name: 'Azure DevOps Pipelines',
    shortName: 'Azure',
    badge: 'azure-pipelines.yml',
    filename: 'azure-pipelines.yml',
    language: 'yaml',
    color: '#0078D4',
    bgColor: '#F0F7FF',
    borderColor: '#BFDBFE',
    description: 'Azure DevOps Pipelines YAML with multi-stage jobs and tasks',
    officialDocUrl: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/',
  },
};

export const COMMON_ENV_VARS: { name: string; jenkins: string; gitlab: string; gha: string; aws: string; gcp: string; azure: string; description: string }[] = [
  {
    name: 'Build / Run ID',
    jenkins: 'env.BUILD_NUMBER',
    gitlab: '$CI_PIPELINE_IID',
    gha: 'github.run_number',
    aws: '$CODEBUILD_BUILD_NUMBER',
    gcp: '$BUILD_ID',
    azure: 'Build.BuildId',
    description: 'Unique sequential number or identifier for this execution',
  },
  {
    name: 'Git Branch',
    jenkins: 'env.BRANCH_NAME',
    gitlab: '$CI_COMMIT_REF_NAME',
    gha: 'github.ref_name',
    aws: '$CODEBUILD_WEBHOOK_HEAD_REF',
    gcp: '$BRANCH_NAME',
    azure: 'Build.SourceBranchName',
    description: 'The Git branch triggering or checked out in the pipeline',
  },
  {
    name: 'Git Commit SHA',
    jenkins: 'env.GIT_COMMIT',
    gitlab: '$CI_COMMIT_SHA',
    gha: 'github.sha',
    aws: '$CODEBUILD_RESOLVED_SOURCE_VERSION',
    gcp: '$COMMIT_SHA',
    azure: 'Build.SourceVersion',
    description: 'Full Git commit SHA checksum of the checked out code',
  },
  {
    name: 'Workspace / Root Directory',
    jenkins: 'env.WORKSPACE',
    gitlab: '$CI_PROJECT_DIR',
    gha: 'github.workspace',
    aws: '$CODEBUILD_SRC_DIR',
    gcp: '/workspace',
    azure: 'Pipeline.Workspace',
    description: 'Root folder where source repository files are cloned',
  },
  {
    name: 'Repository Name',
    jenkins: 'env.JOB_NAME',
    gitlab: '$CI_PROJECT_PATH',
    gha: 'github.repository',
    aws: '$CODEBUILD_SOURCE_REPO_URL',
    gcp: '$REPO_NAME',
    azure: 'Build.Repository.Name',
    description: 'Repository name or identifier',
  },
];

export const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  {
    id: 'jenkins-node-docker',
    title: 'Node.js + Docker CI/CD (Jenkins)',
    category: 'Node.js',
    format: 'jenkins',
    description: 'Standard enterprise Jenkinsfile with checkout, npm test, docker build, and artifact archiving',
    code: `pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_REGISTRY = 'registry.mycompany.com'
        IMAGE_NAME = 'frontend-service'
        APP_PORT = '3000'
    }

    tools {
        nodejs 'NodeJS-18'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from git...'
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                echo 'Running dependencies installation and lint tests'
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm run test:ci'
            }
        }

        stage('Build Production Asset') {
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-registry-creds', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                    sh '''
                        echo "$REG_PASS" | docker login -u "$REG_USER" --password-stdin "$DOCKER_REGISTRY"
                        docker build -t "$DOCKER_REGISTRY/$IMAGE_NAME:\${env.BUILD_NUMBER}" .
                        docker push "$DOCKER_REGISTRY/$IMAGE_NAME:\${env.BUILD_NUMBER}"
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline successfully executed! Artifacts archived.'
        }
        failure {
            echo 'Pipeline failed! Sending alert notification.'
        }
    }
}`,
  },
  {
    id: 'jenkins-java-maven',
    title: 'Java Maven & SonarQube (Jenkins)',
    category: 'Java',
    format: 'jenkins',
    description: 'Multi-stage Java Spring Boot pipeline with Maven clean verify and container packaging',
    code: `pipeline {
    agent {
        docker {
            image 'maven:3.8.6-openjdk-17'
            args '-v /root/.m2:/root/.m2'
        }
    }

    environment {
        MAVEN_OPTS = '-Xmx1024m'
        PROJECT_VERSION = '1.0.0'
    }

    stages {
        stage('Compile & Test') {
            steps {
                sh 'mvn clean compile'
                sh 'mvn test'
            }
        }

        stage('Package Jar') {
            steps {
                sh 'mvn package -DskipTests'
                junit 'target/surefire-reports/*.xml'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }

        stage('Publish Artifact') {
            steps {
                echo "Publishing target jar for release \${env.BUILD_NUMBER}"
            }
        }
    }
}`,
  },
  {
    id: 'jenkins-python-microservice',
    title: 'Python FastAPI Microservice (Jenkins)',
    category: 'Python',
    format: 'jenkins',
    description: 'Python testing with pytest, flake8, and container deployment',
    code: `pipeline {
    agent any

    environment {
        PYTHONUNBUFFERED = '1'
        ENVIRONMENT = 'staging'
    }

    stages {
        stage('Lint & Format') {
            steps {
                sh 'python -m venv venv'
                sh '. venv/bin/activate && pip install --upgrade pip'
                sh '. venv/bin/activate && pip install -r requirements.txt'
                sh '. venv/bin/activate && flake8 src/ tests/'
            }
        }

        stage('Run PyTest & Coverage') {
            steps {
                sh '. venv/bin/activate && pytest --cov=src --cov-report=xml tests/'
            }
        }

        stage('Deploy Staging') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Kubernetes staging cluster...'
                sh 'kubectl apply -f k8s/staging/'
            }
        }
    }
}`,
  },
  {
    id: 'gha-node-workflow',
    title: 'Node.js CI/CD (GitHub Actions)',
    category: 'Node.js',
    format: 'github-actions',
    description: 'GitHub Actions workflow with matrix testing, npm build, and artifact upload',
    code: `name: Node.js CI/CD

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

env:
  NODE_ENV: production
  IMAGE_NAME: frontend-service

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run test suite
      run: npm test

    - name: Build production bundle
      run: npm run build

    - name: Archive build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: dist-files
        path: dist/
`,
  },
  {
    id: 'aws-codebuild-standard',
    title: 'AWS CodeBuild BuildSpec (AWS)',
    category: 'Full-Stack',
    format: 'aws',
    description: 'AWS CodeBuild buildspec.yml v0.2 for Docker container build and ECR push',
    code: `version: 0.2

env:
  variables:
    AWS_DEFAULT_REGION: "us-east-1"
    IMAGE_REPO_NAME: "api-service"
  secrets-manager:
    DOCKERHUB_TOKEN: "arn:aws:secretsmanager:us-east-1:123456789012:secret:dockerhub"

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo "Installing dependencies..."
      - npm ci

  pre_build:
    commands:
      - echo "Logging in to Amazon ECR..."
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=\${COMMIT_HASH:-latest}

  build:
    commands:
      - echo "Building project..."
      - npm run build
      - echo "Building Docker image..."
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG

  post_build:
    commands:
      - echo "Pushing Docker image to ECR..."
      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
      - printf '[{"name":"app-container","imageUri":"%s"}]' "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG" > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
    - dist/**/*
`,
  },
  {
    id: 'gcp-cloudbuild-standard',
    title: 'Google Cloud Build CI/CD (GCP)',
    category: 'Docker',
    format: 'gcp',
    description: 'Google Cloud Build cloudbuild.yaml with container build, test, and Artifact Registry push',
    code: `steps:
  # Step 1: Install dependencies & run tests
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['ci']

  - name: 'node:18'
    entrypoint: 'npm'
    args: ['test']

  # Step 2: Build container image with Kaniko or Docker
  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'build',
      '-t', 'gcr.io/$PROJECT_ID/service-app:$BUILD_ID',
      '-t', 'gcr.io/$PROJECT_ID/service-app:latest',
      '.'
    ]

  # Step 3: Push container image to Google Container Registry / Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/service-app:$BUILD_ID']

images:
  - 'gcr.io/$PROJECT_ID/service-app:$BUILD_ID'
  - 'gcr.io/$PROJECT_ID/service-app:latest'

substitutions:
  _REGION: 'us-central1'

options:
  logging: CLOUD_LOGGING_ONLY
`,
  },
  {
    id: 'azure-pipeline-yaml',
    title: 'Azure DevOps Pipeline (Azure)',
    category: 'Full-Stack',
    format: 'azure',
    description: 'Multi-stage Azure DevOps YAML pipeline with build, test, Docker task, and publishing',
    code: `trigger:
  branches:
    include:
      - main
      - releases/*

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'
  imageRepository: 'microservice-app'
  containerRegistry: 'myAzureContainerRegistry'
  dockerfilePath: '$(Build.SourcesDirectory)/Dockerfile'
  tag: '$(Build.BuildId)'

stages:
- stage: BuildAndTest
  displayName: 'Build and Unit Test'
  jobs:
  - job: Compile
    displayName: 'Node.js CI'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'

    - script: |
        npm ci
        npm run test -- --ci
        npm run build
      displayName: 'npm install, test and build'

    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: '$(System.DefaultWorkingDirectory)/dist'
        ArtifactName: 'drop'
        publishLocation: 'Container'

- stage: ContainerPublish
  displayName: 'Build & Push Docker Image'
  dependsOn: BuildAndTest
  jobs:
  - job: DockerBuild
    steps:
    - task: Docker@2
      displayName: 'Build and Push Docker Image'
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(containerRegistry)
        tags: |
          $(tag)
          latest
`,
  },
  {
    id: 'gitlab-node-ci-cd',
    title: 'Node.js & Docker CI/CD (GitLab CI)',
    category: 'Node.js',
    format: 'gitlab',
    description: 'Complete GitLab CI pipeline with test, build, Docker-in-Docker packaging, and container registry push',
    code: `stages:
  - test
  - build
  - package
  - deploy

variables:
  NODE_ENV: 'production'
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: ""
  CONTAINER_RELEASE_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

default:
  image: node:20-alpine
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - .npm/

unit-tests:
  stage: test
  before_script:
    - npm ci --cache .npm --prefer-offline
  script:
    - npm run lint
    - npm test -- --coverage
  artifacts:
    when: always
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build-app:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

docker-build:
  stage: package
  image: docker:24.0.5
  services:
    - docker:24.0.5-dind
  before_script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin "$CI_REGISTRY"
  script:
    - docker build --pull -t "$CONTAINER_RELEASE_IMAGE" -t "$CI_REGISTRY_IMAGE:latest" .
    - docker push "$CONTAINER_RELEASE_IMAGE"
    - docker push "$CI_REGISTRY_IMAGE:latest"
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy-staging:
  stage: deploy
  image: alpine:3.18
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Deploying container image $CONTAINER_RELEASE_IMAGE to staging..."
    - curl -X POST "$DEPLOY_WEBHOOK_URL"
  environment:
    name: staging
    url: https://staging.example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
`,
  },
  {
    id: 'gitlab-java-maven',
    title: 'Java Maven & Container Registry (GitLab CI)',
    category: 'Java',
    format: 'gitlab',
    description: 'Multi-stage Maven compilation, surefire test reports, and Kaniko unprivileged container build',
    code: `image: maven:3.8.6-openjdk-17

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=WARN"

stages:
  - build
  - test
  - containerize

cache:
  paths:
    - .m2/repository

compile-and-package:
  stage: build
  script:
    - mvn clean package -DskipTests
  artifacts:
    paths:
      - target/*.jar
    expire_in: 3 days

test-suite:
  stage: test
  script:
    - mvn test
  artifacts:
    when: always
    reports:
      junit:
        - target/surefire-reports/TEST-*.xml

kaniko-build:
  stage: containerize
  image:
    name: gcr.io/kaniko-project/executor:v1.14.0-debug
    entrypoint: [""]
  script:
    - mkdir -p /kaniko/.docker
    - echo "{\\"auths\\":{\\"$CI_REGISTRY\\":{\\"username\\":\\"$CI_REGISTRY_USER\\",\\"password\\":\\"$CI_REGISTRY_PASSWORD\\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA --destination $CI_REGISTRY_IMAGE:latest
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
`,
  },
];
