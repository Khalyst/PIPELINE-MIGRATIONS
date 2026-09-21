import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  ExternalLink,
  Variable,
  Layers,
  KeyRound,
  Terminal
} from 'lucide-react';
import { COMMON_ENV_VARS, PIPELINE_FORMATS } from '../data/pipelineConstants';
import { PipelineFormat } from '../types/pipeline';
import { useI18n } from '../i18n/I18nContext';

export const EnvVarCheatsheet: React.FC = () => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredVars = COMMON_ENV_VARS.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      v.jenkins.toLowerCase().includes(search.toLowerCase()) ||
      (v.gitlab && v.gitlab.toLowerCase().includes(search.toLowerCase())) ||
      v.gha.toLowerCase().includes(search.toLowerCase()) ||
      v.aws.toLowerCase().includes(search.toLowerCase()) ||
      v.gcp.toLowerCase().includes(search.toLowerCase()) ||
      v.azure.toLowerCase().includes(search.toLowerCase())
  );

  const copyVal = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const platforms: PipelineFormat[] = ['jenkins', 'gitlab', 'github-actions', 'aws', 'gcp', 'azure'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              {t.cheatsheet.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.cheatsheet.subtitle}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.cheatsheet.searchPlaceholder}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Built-in Environment Variables Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Variable className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t.cheatsheet.variableConcept}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {filteredVars.length} {t.cheatsheet.showingResults}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-[11px]">
                <th className="p-3 font-semibold">{t.cheatsheet.variableConcept}</th>
                <th className="p-3 font-semibold text-red-400">Jenkins</th>
                <th className="p-3 font-semibold text-orange-400">GitLab CI</th>
                <th className="p-3 font-semibold text-blue-400">GitHub Actions</th>
                <th className="p-3 font-semibold text-amber-400">AWS CodeBuild</th>
                <th className="p-3 font-semibold text-sky-400">GCP Cloud Build</th>
                <th className="p-3 font-semibold text-indigo-400">Azure Pipelines</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredVars.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 font-sans font-medium text-slate-200">
                    <div>{row.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{row.description}</div>
                  </td>
                  <td className="p-3 text-slate-300">
                    <button
                      onClick={() => copyVal(row.jenkins, `jen-${idx}`)}
                      className="hover:text-white flex items-center gap-1 group"
                      title="Click to copy"
                    >
                      <span>{row.jenkins}</span>
                      {copiedKey === `jen-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-orange-300">
                    <button
                      onClick={() => copyVal(row.gitlab, `gl-${idx}`)}
                      className="hover:text-white flex items-center gap-1 group"
                      title="Click to copy"
                    >
                      <span>{row.gitlab}</span>
                      {copiedKey === `gl-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-slate-300">
                    <button
                      onClick={() => copyVal(row.gha, `gha-${idx}`)}
                      className="hover:text-white flex items-center gap-1 group"
                      title="Click to copy"
                    >
                      <span>{row.gha}</span>
                      {copiedKey === `gha-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-slate-300">
                    <button
                      onClick={() => copyVal(row.aws, `aws-${idx}`)}
                      className="hover:text-white flex items-center gap-1 group"
                      title="Click to copy"
                    >
                      <span>{row.aws}</span>
                      {copiedKey === `aws-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-slate-300">
                    <button
                      onClick={() => copyVal(row.gcp, `gcp-${idx}`)}
                      className="hover:text-white flex items-center gap-1 group"
                      title="Click to copy"
                    >
                      <span>{row.gcp}</span>
                      {copiedKey === `gcp-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-slate-300">
                    <button
                      onClick={() => copyVal(row.azure, `az-${idx}`)}
                      className="hover:text-white flex items-center gap-1 group"
                      title="Click to copy"
                    >
                      <span>{row.azure}</span>
                      {copiedKey === `az-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-500" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secret & Credential Handling Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Secrets Management Architecture by CI/CD Platform
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <span>Jenkins Credentials Plugin</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Uses <code className="text-slate-200 font-mono">withCredentials([string(credentialsId: &apos;...&apos;)])</code> or <code className="text-slate-200 font-mono">usernamePassword(...)</code>. Credentials stored in Jenkins master credential store.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-orange-400">
              <span>GitLab CI/CD Variables & Masking</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Configured under <code className="text-slate-200 font-mono">Project -&gt; Settings -&gt; CI/CD -&gt; Variables</code>. Flags include <code className="text-slate-200 font-mono">Masked</code> (hides values from logs) and <code className="text-slate-200 font-mono">Protected</code>. Automatically exported to job shell environment.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-400">
              <span>GitHub Actions Encrypted Secrets</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Injected via <code className="text-slate-200 font-mono">${'{{'} secrets.SECRET_NAME {'}}'}</code>. Scoped at repository, environment, or organization level with automatic log masking.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <span>AWS CodeBuild Secrets Manager / SSM</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Specified in buildspec <code className="text-slate-200 font-mono">env: secrets-manager: KEY: &quot;arn:aws:...&quot;</code> or <code className="text-slate-200 font-mono">parameter-store</code>. Requires IAM task role permissions.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-400">
              <span>Google Cloud Build Secret Manager</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Configured via <code className="text-slate-200 font-mono">availableSecrets: secretManager: [...]</code> and consumed with <code className="text-slate-200 font-mono">secretEnv: [&apos;SECRET_KEY&apos;]</code> in steps.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <span>Azure DevOps Variable Groups / Key Vault</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Linked via <code className="text-slate-200 font-mono">variables: - group: my-variable-group</code> or via AzureKeyVault task <code className="text-slate-200 font-mono">task: AzureKeyVault@2</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span>DevOps Migration Strategy</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Always separate pipeline logic from secrets. When migrating, create equivalent secret keys in target cloud secret store prior to running migrated pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
