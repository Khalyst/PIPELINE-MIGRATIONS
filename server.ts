import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { convertPipelineWithGemini, fallbackConvertPipeline } from './server/converter';
import { PipelineFormat, SingleConversionResult } from './src/types/pipeline';
import { PIPELINE_TEMPLATES } from './src/data/pipelineConstants';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get pre-loaded templates
  app.get('/api/templates', (req, res) => {
    res.json({ templates: PIPELINE_TEMPLATES });
  });

  // Convert pipeline endpoint (single or all targets)
  app.post('/api/convert', async (req, res) => {
    try {
      const {
        sourceCode,
        sourceFormat,
        targetFormat,
        convertAll,
        options,
      }: {
        sourceCode: string;
        sourceFormat: PipelineFormat;
        targetFormat?: PipelineFormat;
        convertAll?: boolean;
        options?: { includeComments?: boolean; targetRunner?: string; optimizeSteps?: boolean };
      } = req.body;

      if (!sourceCode || !sourceCode.trim()) {
        return res.status(400).json({ error: 'Source pipeline code is required' });
      }

      if (!sourceFormat) {
        return res.status(400).json({ error: 'Source format is required' });
      }

      const allFormats: PipelineFormat[] = ['jenkins', 'gitlab', 'github-actions', 'aws', 'gcp', 'azure'];

      if (convertAll) {
        // Convert to all other 4 target formats concurrently
        const targetFormats = allFormats.filter((f) => f !== sourceFormat);
        const conversionPromises = targetFormats.map(async (target) => {
          const result = await convertPipelineWithGemini(sourceCode, sourceFormat, target, options);
          return { target, result };
        });

        const completed = await Promise.all(conversionPromises);
        const resultsMap: Record<string, SingleConversionResult> = {};
        completed.forEach(({ target, result }) => {
          resultsMap[target] = result;
        });

        return res.json({
          sourceFormat,
          results: resultsMap,
          convertedCount: completed.length,
        });
      }

      // Single target conversion
      const finalTarget: PipelineFormat = targetFormat || (sourceFormat === 'jenkins' ? 'github-actions' : 'jenkins');
      const result = await convertPipelineWithGemini(sourceCode, sourceFormat, finalTarget, options);

      return res.json({
        sourceFormat,
        result,
      });
    } catch (error: any) {
      console.error('Pipeline conversion failed:', error);
      res.status(500).json({ error: error.message || 'Internal server error during conversion' });
    }
  });

  // Quick syntax validator endpoint
  app.post('/api/validate', (req, res) => {
    try {
      const { code, format }: { code: string; format: PipelineFormat } = req.body;
      if (!code) {
        return res.json({ valid: true, issues: [] });
      }

      const issues: { line?: number; type: 'error' | 'warning'; message: string }[] = [];
      const lines = code.split('\n');

      if (format === 'jenkins') {
        const hasPipeline = code.includes('pipeline') || code.includes('node');
        if (!hasPipeline) {
          issues.push({
            type: 'warning',
            message: 'Jenkinsfile should normally define either a declarative "pipeline { ... }" or scripted "node { ... }" block.',
          });
        }
        // Check brace balance
        let openBraces = (code.match(/\{/g) || []).length;
        let closeBraces = (code.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
          issues.push({
            type: 'error',
            message: `Mismatched curly braces in Groovy pipeline: ${openBraces} open '{' vs ${closeBraces} close '}'.`,
          });
        }
      } else {
        // YAML checks for GHA, AWS, GCP, Azure
        lines.forEach((line, idx) => {
          if (line.includes('\t')) {
            issues.push({
              line: idx + 1,
              type: 'error',
              message: `Tab character detected on line ${idx + 1}. YAML syntax strictly forbids tabs for indentation; use spaces instead.`,
            });
          }
        });

        if (format === 'github-actions') {
          if (!code.includes('jobs:')) {
            issues.push({ type: 'error', message: 'GitHub Actions workflow missing top-level "jobs:" definition.' });
          }
          if (!code.includes('runs-on:') && !code.includes('uses:')) {
            issues.push({ type: 'warning', message: 'No "runs-on:" runner environment specified for jobs.' });
          }
        } else if (format === 'aws') {
          if (!code.includes('version: 0.2') && !code.includes('phases:')) {
            issues.push({ type: 'warning', message: 'AWS CodeBuild buildspec files typically specify "version: 0.2" and "phases:".' });
          }
        } else if (format === 'gcp') {
          if (!code.includes('steps:')) {
            issues.push({ type: 'error', message: 'Google Cloud Build config file must contain a top-level "steps:" list.' });
          }
        } else if (format === 'azure') {
          if (!code.includes('steps:') && !code.includes('stages:') && !code.includes('jobs:')) {
            issues.push({ type: 'warning', message: 'Azure Pipelines file should define "steps:", "jobs:", or "stages:".' });
          }
        } else if (format === 'gitlab') {
          if (!code.includes('script:') && !code.includes('stages:')) {
            issues.push({ type: 'warning', message: 'GitLab CI file (.gitlab-ci.yml) typically defines "stages:" and jobs with "script:" blocks.' });
          }
        }
      }

      res.json({
        valid: issues.filter((i) => i.type === 'error').length === 0,
        issues,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DevOps Pipeline Migrator server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
