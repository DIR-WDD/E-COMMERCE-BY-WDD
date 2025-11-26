import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AnalyticsData } from '../types';
import { Sparkles, BarChart2, FileText, Loader2, ArrowRight } from 'lucide-react';

export const AiInsightsWidget: React.FC<{ analytics: AnalyticsData[] }> = ({ analytics }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following sales data (B2C vs B2B) for the last 7 months: ${JSON.stringify(analytics)}. 
        Provide a concise executive summary with 3 clear actionable bullet points for growth in the next quarter. 
        Format nicely with bolding where appropriate.`,
      });
      setInsights(response.text || "No insights generated.");
    } catch (e) {
      console.error(e);
      setInsights("Unable to generate insights. Please ensure your API key is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <Sparkles size={140} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
            <BarChart2 size={20} className="text-indigo-200" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">AI Strategic Insights</h3>
            <p className="text-xs text-indigo-300 mt-1">Powered by Gemini 2.5</p>
          </div>
        </div>
        
        {!insights && !loading && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur-sm text-center">
            <p className="text-indigo-200 mb-4 text-sm leading-relaxed">
              Unlock hidden trends in your B2B/B2C performance data. 
              Get instant actionable advice based on your last 7 months of sales.
            </p>
            <button 
              onClick={generateInsights}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2 mx-auto"
            >
              <Sparkles size={16} /> Analyze Data
            </button>
          </div>
        )}

        {loading && (
          <div className="bg-white/5 rounded-lg p-8 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-indigo-200">
            <Loader2 size={32} className="animate-spin mb-3 text-indigo-400" />
            <span className="text-sm font-medium animate-pulse">Analyzing revenue streams...</span>
          </div>
        )}

        {insights && (
          <div className="bg-white/10 rounded-lg p-5 border border-white/10 backdrop-blur-sm animate-fade-in">
            <div className="prose prose-invert prose-sm max-w-none">
               <div className="whitespace-pre-wrap font-light text-sm leading-relaxed text-indigo-50">{insights}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setInsights(null)} 
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                Start New Analysis <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AiDescriptionGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name || !keywords) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a compelling ecommerce product description for a product named "${name}". 
        Keywords/Features to include: ${keywords}. 
        Format:
        - A catchy headline
        - A 2-sentence emotional hook
        - 3 bullet points of key technical benefits
        Tone: Professional, persuasive, tech-focused.`,
      });
      setResult(response.text || "");
    } catch (e) {
      console.error(e);
      setResult("Error generating content. Please check API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">AI Content Studio</h3>
          <p className="text-xs text-slate-500">Generate product copy instantly</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Product Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
            placeholder="e.g. Nexus Pro Headset"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Keywords / Features</label>
          <input 
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
            placeholder="e.g. Noise cancelling, 20h battery"
          />
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={loading || !name}
          className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-600/20 flex justify-center items-center gap-2 mt-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'Generating...' : 'Generate Description'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100 animate-fade-in relative">
            <div className="absolute top-2 right-2 text-purple-200">
               <FileText size={48} />
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-700 relative z-10 font-medium leading-relaxed">{result}</p>
            <button 
              onClick={() => {navigator.clipboard.writeText(result); alert('Copied to clipboard!')}}
              className="mt-3 text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 relative z-10"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};