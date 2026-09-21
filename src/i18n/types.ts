export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationDictionary {
  app: {
    title: string;
    subtitle: string;
    poweredBy: string;
    footerText: string;
    activeMigrationPath: string;
    multiTargetActive: string;
    singleTargetActive: string;
    allOtherPlatforms: string;
    dismiss: string;
    pleaseEnterCode: string;
    convertedSuccess: string;
    convertedAllSuccess: string;
    conversionFailed: string;
    templateLoaded: string;
  };
  nav: {
    studio: string;
    matrix: string;
    sampleTemplates: string;
    convertAll: string;
    targetLabel: string;
    allFormats: string;
    convertPipeline: string;
    migrating: string;
    language: string;
  };
  editor: {
    sourcePipeline: string;
    selectFormat: string;
    uploadFile: string;
    uploadTooltip: string;
    clear: string;
    copy: string;
    copied: string;
    lines: string;
    characters: string;
    syntaxIssues: string;
    noIssues: string;
    dragAndDrop: string;
    placeholder: string;
    loadTemplatePrompt: string;
  };
  viewer: {
    targetPipeline: string;
    convertedFile: string;
    copyCode: string;
    copied: string;
    downloadFile: string;
    complexity: string;
    aiOptimized: string;
    astTranslated: string;
    runningTranslation: string;
    waitingPrompt: string;
    convertNow: string;
    switchTabHint: string;
  };
  insights: {
    emptyState: string;
    envVarsTab: string;
    secretsTab: string;
    warningsTab: string;
    stepsTab: string;
    sourceVar: string;
    targetVar: string;
    purpose: string;
    sourceSecret: string;
    targetStore: string;
    migrationSteps: string;
    warningTitle: string;
    remediation: string;
    originalStep: string;
    targetEquivalent: string;
    syntaxNotes: string;
    criticalCount: string;
    totalWarnings: string;
    safeNotice: string;
  };
  cheatsheet: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    showingResults: string;
    variableConcept: string;
    quickCopy: string;
    copiedNotice: string;
    bestPracticesTitle: string;
    secretsTitle: string;
    secretsDescription: string;
  };
  templates: {
    title: string;
    subtitle: string;
    allCategories: string;
    loadButton: string;
    currentFormatMatch: string;
    close: string;
  };
}
