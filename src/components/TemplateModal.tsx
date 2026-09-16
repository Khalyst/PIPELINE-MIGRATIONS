import React, { useState } from 'react';
import { 
  X, 
  FileCode2, 
  Check, 
  Layers, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { PIPELINE_TEMPLATES, PIPELINE_FORMATS } from '../data/pipelineConstants';
import { PipelineFormat, PipelineTemplate } from '../types/pipeline';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PipelineTemplate) => void;
  currentFormat: PipelineFormat;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentFormat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Node.js', 'Java', 'Python', 'Docker', 'Full-Stack'];

  const filteredTemplates = PIPELINE_TEMPLATES.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Real-World Enterprise Pipeline Templates
              </h3>
              <p className="text-xs text-slate-400">
                Load authentic production CI/CD pipelines to test cross-platform conversion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900 flex items-center gap-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {filteredTemplates.map((template) => {
            const fMeta = PIPELINE_FORMATS[template.format];
            const isMatch = template.format === currentFormat;

            return (
              <div
                key={template.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                      {template.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {template.category}
                    </span>
                    <span
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border"
                      style={{
                        borderColor: fMeta.borderColor,
                        color: fMeta.color,
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      }}
                    >
                      {fMeta.shortName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {template.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Template</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Templates include multi-stage build, container release, credentials bindings, and test suites.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
