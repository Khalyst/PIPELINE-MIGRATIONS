export type PipelineFormat = 'jenkins' | 'gitlab' | 'github-actions' | 'aws' | 'gcp' | 'azure';

export interface FormatMeta {
  id: PipelineFormat;
  name: string;
  shortName: string;
  badge: string;
  filename: string;
  language: 'groovy' | 'yaml';
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  officialDocUrl: string;
}

export interface EnvVarMapping {
  sourceVar: string;
  targetVar: string;
  notes: string;
}

export interface SecretMapping {
  sourceSecret: string;
  targetMechanism: string;
  setupInstructions: string;
}

export interface MigrationWarning {
  level: 'info' | 'warning' | 'critical';
  title: string;
  detail: string;
  actionRequired: string;
}

export interface StepMapping {
  originalStep: string;
  convertedStep: string;
  targetSyntaxNotes: string;
}

export interface SingleConversionResult {
  targetFormat: PipelineFormat;
  convertedCode: string;
  filename: string;
  explanation: string;
  envVarMappings: EnvVarMapping[];
  secretMappings: SecretMapping[];
  migrationWarnings: MigrationWarning[];
  stepMappings: StepMapping[];
  complexityScore: 'Low' | 'Medium' | 'High' | 'Complex';
  aiPowered: boolean;
}

export interface MultiConversionResponse {
  sourceFormat: PipelineFormat;
  sourceCode: string;
  results: Record<PipelineFormat, SingleConversionResult>;
  summary: string;
}

export interface PipelineTemplate {
  id: string;
  title: string;
  category: 'Full-Stack' | 'Java' | 'Node.js' | 'Python' | 'Docker' | 'Microservices';
  description: string;
  format: PipelineFormat;
  code: string;
}

export interface SyntaxValidationIssue {
  line?: number;
  type: 'error' | 'warning';
  message: string;
}

export interface ValidationResponse {
  valid: boolean;
  format: PipelineFormat;
  issues: SyntaxValidationIssue[];
  summary: string;
}
