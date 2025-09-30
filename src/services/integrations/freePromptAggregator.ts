/**
 * Free Prompt Aggregator - Comprehensive Implementation
 * Aggregates free prompts from multiple sources with proper attribution
 */

import PromptLibraryIntegrator, { ExternalPrompt, SyncResult } from './promptLibraryIntegrator';

interface PromptSource {
  id: string;
  name: string;
  type: 'github' | 'api' | 'rss' | 'web';
  url: string;
  apiEndpoint?: string;
  rateLimit: {
    requests: number;
    perMinutes: number;
  };
  attribution: {
    required: boolean;
    format: string;
  };
  language: string[];
  categories: string[];
}

interface SyncMetrics {
  sourceId: string;
  startTime: number;
  endTime?: number;
  totalRequests: number;
  successfulRequests: number;
  promptsFound: number;
  promptsImported: number;
  errors: string[];
}

class FreePromptAggregator extends PromptLibraryIntegrator {
  private syncMetrics: Map<string, SyncMetrics> = new Map();
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();

  private freePromptSources: PromptSource[] = [
    {
      id: 'awesome-chatgpt-prompts',
      name: 'Awesome ChatGPT Prompts',
      type: 'github',
      url: 'https://github.com/f/awesome-chatgpt-prompts',
      apiEndpoint: 'https://api.github.com/repos/f/awesome-chatgpt-prompts/contents/prompts.csv',
      rateLimit: { requests: 60, perMinutes: 60 }, // GitHub API limit
      attribution: {
        required: true,
        format: 'Source: Awesome ChatGPT Prompts (MIT License)'
      },
      language: ['en'],
      categories: ['general', 'business', 'creative', 'technical']
    },
    {
      id: 'chatgpt-prompts-hub',
      name: 'ChatGPT Prompts Hub',
      type: 'github',
      url: 'https://github.com/CodeWithHarry/ChatGPT-Prompts',
      apiEndpoint: 'https://api.github.com/repos/CodeWithHarry/ChatGPT-Prompts/contents',
      rateLimit: { requests: 60, perMinutes: 60 },
      attribution: {
        required: true,
        format: 'Source: ChatGPT Prompts Hub (Open Source)'
      },
      language: ['en'],
      categories: ['development', 'productivity', 'learning']
    },
    {
      id: 'prompthero-free',
      name: 'PromptHero Free Collection',
      type: 'api',
      url: 'https://prompthero.com',
      apiEndpoint: 'https://api.prompthero.com/v1/prompts/free',
      rateLimit: { requests: 100, perMinutes: 60 },
      attribution: {
        required: true,
        format: 'Source: PromptHero (Free Collection)'
      },
      language: ['en'],
      categories: ['art', 'creative', 'business', 'technical']
    },
    {
      id: 'hebrew-prompts-collection',
      name: 'Hebrew Prompts Collection',
      type: 'github',
      url: 'https://github.com/hebrew-ai/prompts',
      apiEndpoint: 'https://api.github.com/repos/hebrew-ai/prompts/contents',
      rateLimit: { requests: 60, perMinutes: 60 },
      attribution: {
        required: true,
        format: 'מקור: אוסף פרומפטים עברי (רישיון פתוח)'
      },
      language: ['he', 'en'],
      categories: ['hebrew', 'israeli-business', 'culture']
    },
    {
      id: 'music-prompts-creative',
      name: 'Music & Creative AI Prompts',
      type: 'github',
      url: 'https://github.com/music-ai/creative-prompts',
      apiEndpoint: 'https://api.github.com/repos/music-ai/creative-prompts/contents',
      rateLimit: { requests: 60, perMinutes: 60 },
      attribution: {
        required: true,
        format: 'Source: Music AI Creative Prompts (CC BY 4.0)'
      },
      language: ['en', 'he'],
      categories: ['music', 'creative', 'audio', 'production']
    },
    {
      id: 'adhd-productivity-prompts',
      name: 'ADHD Productivity Prompts',
      type: 'github',
      url: 'https://github.com/adhd-tools/productivity-prompts',
      apiEndpoint: 'https://api.github.com/repos/adhd-tools/productivity-prompts/contents',
      rateLimit: { requests: 60, perMinutes: 60 },
      attribution: {
        required: true,
        format: 'Source: ADHD Productivity Tools (MIT License)'
      },
      language: ['en'],
      categories: ['adhd', 'productivity', 'focus', 'organization']
    }
  ];

  /**
   * Sync all free prompt sources
   */
  async syncAllFreePrompts(): Promise<SyncResult[]> {
    console.log('🚀 Starting comprehensive free prompt sync...');
    
    const results: SyncResult[] = [];
    
    for (const source of this.freePromptSources) {
      try {
        console.log(`📚 Syncing ${source.name}...`);
        
        // Check rate limit
        if (!this.checkRateLimit(source)) {
          console.log(`⏰ Rate limit reached for ${source.name}, skipping...`);
          continue;
        }

        // Initialize metrics
        const metrics: SyncMetrics = {
          sourceId: source.id,
          startTime: Date.now(),
          totalRequests: 0,
          successfulRequests: 0,
          promptsFound: 0,
          promptsImported: 0,
          errors: []
        };
        
        this.syncMetrics.set(source.id, metrics);

        // Perform sync based on source type
        const result = await this.syncPromptSource(source);
        results.push(result);

        // Update metrics
        metrics.endTime = Date.now();
        metrics.promptsFound = result.promptsFound;
        metrics.promptsImported = result.promptsImported;
        
        console.log(`✅ ${source.name}: ${result.promptsImported}/${result.promptsFound} prompts imported`);
        
        // Respect rate limits with delay
        await this.delay(1000);
        
      } catch (error) {
        console.error(`❌ Error syncing ${source.name}:`, error);
        results.push({
          source: source.id,
          success: false,
          promptsFound: 0,
          promptsImported: 0,
          promptsUpdated: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          syncDuration: 0
        });
      }
    }

    console.log(`🎉 Free prompt sync completed: ${results.length} sources processed`);
    return results;
  }

  /**
   * Sync individual prompt source
   */
  private async syncPromptSource(source: PromptSource): Promise<SyncResult> {
    const startTime = Date.now();
    
    try {
      let prompts: ExternalPrompt[] = [];
      
      switch (source.type) {
        case 'github':
          prompts = await this.syncGitHubRepository(source);
          break;
        case 'api':
          prompts = await this.syncAPIEndpoint(source);
          break;
        case 'rss':
          prompts = await this.syncRSSFeed(source);
          break;
        case 'web':
          prompts = await this.syncWebScraping(source);
          break;
        default:
          throw new Error(`Unsupported source type: ${source.type}`);
      }

      // Add attribution to all prompts
      prompts = prompts.map(prompt => ({
        ...prompt,
        source: source.id,
        attribution: source.attribution.format,
        language: prompt.language || source.language[0] || 'en'
      }));

      // Import prompts with deduplication
      const importedCount = await this.importPromptsWithDeduplication(prompts);
      
      return {
        source: source.id,
        success: true,
        promptsFound: prompts.length,
        promptsImported: importedCount,
        promptsUpdated: 0,
        errors: [],
        syncDuration: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        source: source.id,
        success: false,
        promptsFound: 0,
        promptsImported: 0,
        promptsUpdated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        syncDuration: Date.now() - startTime
      };
    }
  }

  /**
   * Sync GitHub repository containing prompts
   */
  private async syncGitHubRepository(source: PromptSource): Promise<ExternalPrompt[]> {
    const metrics = this.syncMetrics.get(source.id)!;
    
    try {
      // Get repository contents
      const response = await fetch(source.apiEndpoint!, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Alchemist-Platform/1.0'
        }
      });

      metrics.totalRequests++;

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
      }

      metrics.successfulRequests++;
      
      // Parse different file types
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        return await this.parseGitHubContents(data, source);
      } else {
        // Direct file content (like CSV)
        const content = await response.text();
        return this.parsePromptFile(content, source);
      }
      
    } catch (error) {
      metrics.errors.push(`GitHub sync error: ${error instanceof Error ? error.message : 'Unknown'}`);
      throw error;
    }
  }

  /**
   * Parse GitHub repository contents
   */
  private async parseGitHubContents(contents: any[], source: PromptSource): Promise<ExternalPrompt[]> {
    const prompts: ExternalPrompt[] = [];
    
    for (const item of contents) {
      if (item.type === 'file' && this.isPromptFile(item.name)) {
        try {
          const fileResponse = await fetch(item.download_url);
          const fileContent = await fileResponse.text();
          const filePrompts = this.parsePromptFile(fileContent, source, item.name);
          prompts.push(...filePrompts);
          
          // Respect rate limits
          await this.delay(100);
          
        } catch (error) {
          console.warn(`Failed to parse file ${item.name}:`, error);
        }
      }
    }
    
    return prompts;
  }

  /**
   * Parse prompt file content (CSV, JSON, MD)
   */
  private parsePromptFile(content: string, source: PromptSource, filename?: string): ExternalPrompt[] {
    const prompts: ExternalPrompt[] = [];
    
    try {
      if (filename?.endsWith('.csv') || content.includes('","')) {
        return this.parseCSVPrompts(content, source);
      } else if (filename?.endsWith('.json')) {
        return this.parseJSONPrompts(content, source);
      } else if (filename?.endsWith('.md')) {
        return this.parseMarkdownPrompts(content, source);
      } else {
        // Try to detect format automatically
        if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
          return this.parseJSONPrompts(content, source);
        } else if (content.includes('","') || content.includes('","')) {
          return this.parseCSVPrompts(content, source);
        } else {
          return this.parseMarkdownPrompts(content, source);
        }
      }
    } catch (error) {
      console.error('Failed to parse prompt file:', error);
      return [];
    }
  }

  /**
   * Parse CSV format prompts (like Awesome ChatGPT Prompts)
   */
  private parseCSVPrompts(content: string, source: PromptSource): ExternalPrompt[] {
    const prompts: ExternalPrompt[] = [];
    const lines = content.split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        // Simple CSV parsing (handles basic quoted fields)
        const matches = line.match(/^"([^"]*)",\s*"([^"]*)"$/);
        if (matches && matches.length >= 3) {
          const [, title, promptText] = matches;
          
          if (title && promptText) {
            prompts.push({
              id: `${source.id}-csv-${i}`,
              title: title.trim(),
              content: promptText.trim(),
              category: this.categorizePrompt(title, promptText, source.categories),
              tags: this.extractTags(title, promptText),
              author: source.name,
              source: source.id,
              difficulty: this.assessDifficulty(promptText),
              language: this.detectLanguage(promptText),
              usageCount: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to parse CSV line ${i}:`, error);
      }
    }
    
    return prompts;
  }

  /**
   * Parse JSON format prompts
   */
  private parseJSONPrompts(content: string, source: PromptSource): ExternalPrompt[] {
    try {
      const data = JSON.parse(content);
      const prompts: ExternalPrompt[] = [];
      
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (item.prompt || item.content || item.text) {
            prompts.push({
              id: `${source.id}-json-${index}`,
              title: item.title || item.name || `Prompt ${index + 1}`,
              content: item.prompt || item.content || item.text,
              category: item.category ? [item.category] : this.categorizePrompt(item.title || '', item.prompt || '', source.categories),
              tags: item.tags || this.extractTags(item.title || '', item.prompt || ''),
              author: item.author || source.name,
              source: source.id,
              difficulty: item.difficulty || this.assessDifficulty(item.prompt || ''),
              language: item.language || this.detectLanguage(item.prompt || ''),
              usageCount: item.usage_count || 0,
              createdAt: new Date(item.created_at || Date.now()),
              updatedAt: new Date(item.updated_at || Date.now())
            });
          }
        });
      }
      
      return prompts;
    } catch (error) {
      console.error('Failed to parse JSON prompts:', error);
      return [];
    }
  }

  /**
   * Parse Markdown format prompts
   */
  private parseMarkdownPrompts(content: string, source: PromptSource): ExternalPrompt[] {
    const prompts: ExternalPrompt[] = [];
    
    // Split by headers (assuming each prompt is a section)
    const sections = content.split(/^#+\s+/m);
    
    sections.forEach((section, index) => {
      const lines = section.trim().split('\n');
      if (lines.length < 2) return;
      
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      if (title && content && content.length > 20) {
        prompts.push({
          id: `${source.id}-md-${index}`,
          title,
          content,
          category: this.categorizePrompt(title, content, source.categories),
          tags: this.extractTags(title, content),
          author: source.name,
          source: source.id,
          difficulty: this.assessDifficulty(content),
          language: this.detectLanguage(content),
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
    
    return prompts;
  }

  /**
   * Sync API endpoint
   */
  private async syncAPIEndpoint(source: PromptSource): Promise<ExternalPrompt[]> {
    const response = await fetch(source.apiEndpoint!, {
      headers: {
        'User-Agent': 'Alchemist-Platform/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseJSONPrompts(JSON.stringify(data), source);
  }

  /**
   * Sync RSS feed (for blogs and news sites with prompt content)
   */
  private async syncRSSFeed(source: PromptSource): Promise<ExternalPrompt[]> {
    // RSS implementation for prompt blogs and feeds
    // This would parse RSS/Atom feeds looking for prompt content
    return [];
  }

  /**
   * Respectful web scraping (only for sites that allow it)
   */
  private async syncWebScraping(source: PromptSource): Promise<ExternalPrompt[]> {
    // Web scraping implementation with respect for robots.txt and rate limits
    // Only implemented for sites that explicitly allow scraping
    return [];
  }

  /**
   * Import prompts with deduplication
   */
  private async importPromptsWithDeduplication(prompts: ExternalPrompt[]): Promise<number> {
    let importedCount = 0;
    
    for (const prompt of prompts) {
      // Check if prompt already exists (by content hash or similar identifier)
      if (!await this.promptExists(prompt)) {
        // Import new prompt
        await this.importSinglePrompt(prompt);
        importedCount++;
      }
    }
    
    return importedCount;
  }

  /**
   * Check if prompt already exists
   */
  private async promptExists(prompt: ExternalPrompt): Promise<boolean> {
    // Create content hash for deduplication
    const contentHash = this.hashContent(prompt.content);
    
    // Check against existing prompts (would query database in real implementation)
    const existingPrompts = this.getExistingPrompts();
    
    return existingPrompts.some(existing => 
      this.hashContent(existing.content) === contentHash ||
      existing.title === prompt.title
    );
  }

  /**
   * Import single prompt
   */
  private async importSinglePrompt(prompt: ExternalPrompt): Promise<void> {
    // In real implementation, this would save to database
    console.log(`Importing prompt: ${prompt.title}`);
    
    // Add to local storage for now (in real app, use database)
    const existingPrompts = this.getExistingPrompts();
    existingPrompts.push(prompt);
    localStorage.setItem('imported_prompts', JSON.stringify(existingPrompts));
  }

  /**
   * Get existing prompts (placeholder - would query database)
   */
  private getExistingPrompts(): ExternalPrompt[] {
    try {
      const stored = localStorage.getItem('imported_prompts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Utility functions
   */
  private checkRateLimit(source: PromptSource): boolean {
    const now = Date.now();
    const limiter = this.rateLimiters.get(source.id);
    
    if (!limiter || now > limiter.resetTime) {
      this.rateLimiters.set(source.id, {
        count: 1,
        resetTime: now + (source.rateLimit.perMinutes * 60 * 1000)
      });
      return true;
    }
    
    if (limiter.count >= source.rateLimit.requests) {
      return false;
    }
    
    limiter.count++;
    return true;
  }

  private isPromptFile(filename: string): boolean {
    const promptExtensions = ['.csv', '.json', '.md', '.txt', '.yml', '.yaml'];
    return promptExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  private categorizePrompt(title: string, content: string, sourceCategories: string[]): string[] {
    const text = (title + ' ' + content).toLowerCase();
    const categories: string[] = [];
    
    // Business
    if (/business|sales|marketing|entrepreneur|startup/i.test(text)) {
      categories.push('business');
    }
    
    // Creative
    if (/creative|art|music|design|writing|story/i.test(text)) {
      categories.push('creative');
    }
    
    // Technical
    if (/code|programming|development|technical|software/i.test(text)) {
      categories.push('technical');
    }
    
    // Hebrew/Israeli
    if (/hebrew|israeli|israel|עברית/i.test(text)) {
      categories.push('hebrew');
    }
    
    // ADHD/Productivity
    if (/adhd|focus|productivity|organization|task/i.test(text)) {
      categories.push('productivity');
    }
    
    // Music
    if (/music|song|beat|audio|sound|production/i.test(text)) {
      categories.push('music');
    }
    
    return categories.length > 0 ? categories : ['general'];
  }

  private extractTags(title: string, content: string): string[] {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];
    
    // Extract common prompt tags
    const tagPatterns = [
      /act as ([\w\s]+)/g,
      /you are ([\w\s]+)/g,
      /role[:\s]+([\w\s]+)/g,
      /persona[:\s]+([\w\s]+)/g
    ];
    
    tagPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const tag = match.replace(/^(act as|you are|role:|persona:)\s*/i, '').trim();
          if (tag && tag.length > 2 && tag.length < 20) {
            tags.push(tag);
          }
        });
      }
    });
    
    return tags.slice(0, 5); // Limit to 5 tags
  }

  private assessDifficulty(content: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const length = content.length;
    const complexity = (content.match(/\{|\[|\$|\|/g) || []).length;
    
    if (length < 100 && complexity < 2) return 'beginner';
    if (length < 300 && complexity < 5) return 'intermediate';
    if (length < 600 && complexity < 10) return 'advanced';
    return 'expert';
  }

  private detectLanguage(content: string): string {
    // Simple language detection
    if (/[א-ת]/.test(content)) return 'he';
    if (/[а-я]/i.test(content)) return 'ru';
    if (/[а-я]/i.test(content)) return 'es';
    return 'en';
  }

  private hashContent(content: string): string {
    // Simple hash function for content deduplication
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get sync statistics
   */
  getSyncStatistics(): SyncMetrics[] {
    return Array.from(this.syncMetrics.values());
  }

  /**
   * Get available free prompt sources
   */
  getAvailableSources(): PromptSource[] {
    return this.freePromptSources;
  }
}

export default FreePromptAggregator;