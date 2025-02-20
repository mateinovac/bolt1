export interface Prompt {
  id: string;
  name: string;
  template?: string;
  description: string;
}

export const PROMPTS: Prompt[] = [
  { id: 'math', name: 'Math', description: 'Solve mathematical problems' },
  { id: 'code-generator', name: 'Code Generator', description: 'Generate code snippets' },
  { id: 'design-generator', name: 'Design Generator', description: 'Generate design ideas' },
  { id: 'image-prompt', name: 'Image Prompt Generator', description: 'Create image generation prompts' },
  { id: 'search-internet', name: 'Search Internet', description: 'Search the web for information' },
  { id: 'article-generator', name: 'Article Generator', description: 'Generate article content' },
  { id: 'essay-generator', name: 'Essay Generator', description: 'Generate essay content' },
  { id: 'human-rewriter', name: 'Human Rewriter', description: 'Rewrite text in a more human way' },
  { id: 'quote-generator', name: 'Quote Generator', description: 'Generate relevant quotes' },
  { id: 'website-summarizer', name: 'Website Summarizer', description: 'Summarize website content' },
  { id: 'summarizer', name: 'Summarizer', description: 'Summarize any text' },
  { id: 'fact-checker', name: 'Fact Checker', description: 'Verify facts and claims' },
  { id: 'poetry', name: 'Poetry Composer', description: 'Compose poetry' },
  { id: 'social-media', name: 'Social Media Post', description: 'Create social media content' }
];
