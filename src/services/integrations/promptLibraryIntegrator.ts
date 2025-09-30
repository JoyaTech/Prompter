/**
 * Prompt Library Integrator
 * Handles integration with multiple external prompt libraries
 */

export interface PromptLibrarySource {
  id: string;
  name: string;
  description: string;
  url: string;
  apiEndpoint?: string;
  syncInterval: number; // minutes
  isActive: boolean;
  lastSyncAt?: Date;
  totalPrompts: number;
  categories: string[];
  language: 'en' | 'he' | 'multilingual';
  requiresAuth: boolean;
  authConfig?: {
    type: 'github' | 'notion' | 'api_key';
    token?: string;
  };
}

export interface ExternalPrompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  category: string[];
  tags: string[];
  author: string;
  source: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  language: string;
  usageCount: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncResult {
  source: string;
  success: boolean;
  promptsFound: number;
  promptsImported: number;
  promptsUpdated: number;
  errors: string[];
  syncDuration: number;
}

class PromptLibraryIntegrator {
  private sources: Map<string, PromptLibrarySource> = new Map();
  private syncInProgress: Set<string> = new Set();

  constructor() {
    this.initializeSources();
  }

  private initializeSources() {
    const defaultSources: PromptLibrarySource[] = [
      {
        id: 'awesome-chatgpt',
        name: 'Awesome ChatGPT Prompts',
        description: 'Community-curated collection of ChatGPT prompts',
        url: 'https://github.com/f/awesome-chatgpt-prompts',
        apiEndpoint: 'https://api.github.com/repos/f/awesome-chatgpt-prompts/contents/prompts.csv',
        syncInterval: 1440, // 24 hours
        isActive: true,
        totalPrompts: 200,
        categories: ['business', 'education', 'entertainment', 'development'],
        language: 'en',
        requiresAuth: true,
        authConfig: {
          type: 'github',
          token: process.env.GITHUB_TOKEN
        }
      },
      {
        id: 'sabrina-library',
        name: "Sabrina Ramonov's Business Library",
        description: 'Professional business and productivity prompts',
        url: 'https://www.notion.so/sabrina-ramonov/prompt-library',
        apiEndpoint: process.env.NOTION_API_ENDPOINT,
        syncInterval: 10080, // 7 days
        isActive: true,
        totalPrompts: 100,
        categories: ['business', 'sales', 'marketing', 'productivity'],
        language: 'en',
        requiresAuth: true,
        authConfig: {
          type: 'notion',
          token: process.env.NOTION_API_KEY
        }
      },
      {
        id: 'promptbase-free',
        name: 'PromptBase Free Collection',
        description: 'Free prompts from the PromptBase marketplace',
        url: 'https://promptbase.com/free',
        apiEndpoint: 'https://api.promptbase.com/v1/prompts/free',
        syncInterval: 360, // 6 hours
        isActive: true,
        totalPrompts: 2300,
        categories: ['all'],
        language: 'multilingual',
        requiresAuth: false
      },
      {
        id: 'hebrew-business',
        name: 'Hebrew Business Prompts',
        description: 'Business prompts tailored for the Israeli market',
        url: 'https://docs.google.com/spreadsheets/hebrew-business-prompts',
        syncInterval: 2880, // 48 hours
        isActive: true,
        totalPrompts: 75,
        categories: ['business', 'sales', 'marketing', 'startup'],
        language: 'he',
        requiresAuth: false
      },
      {
        id: 'israeli-startups',
        name: 'Israeli Startup Ecosystem',
        description: 'Prompts specific to Israeli startup culture and market',
        url: 'https://airtable.com/israeli-startup-prompts',
        syncInterval: 4320, // 72 hours
        isActive: true,
        totalPrompts: 50,
        categories: ['startup', 'venture-capital', 'market-entry'],
        language: 'multilingual',
        requiresAuth: false
      },
      {
        id: 'music-creativity',
        name: 'Music & Creative Arts',
        description: 'Prompts for musicians, producers, and creative professionals',
        url: 'https://github.com/music-ai/creative-prompts',
        syncInterval: 1440, // 24 hours
        isActive: true,
        totalPrompts: 150,
        categories: ['music', 'creativity', 'production', 'songwriting'],
        language: 'multilingual',
        requiresAuth: false
      }
    ];

    defaultSources.forEach(source => {
      this.sources.set(source.id, source);
    });
  }

  /**
   * Sync all active sources
   */
  async syncAllSources(): Promise<SyncResult[]> {
    const activeSources = Array.from(this.sources.values()).filter(s => s.isActive);
    const results: SyncResult[] = [];

    for (const source of activeSources) {
      if (!this.shouldSync(source)) continue;
      
      try {
        const result = await this.syncSource(source);
        results.push(result);
      } catch (error) {
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

    return results;
  }

  /**
   * Sync a specific source
   */
  async syncSource(source: PromptLibrarySource): Promise<SyncResult> {
    const startTime = Date.now();
    this.syncInProgress.add(source.id);

    try {
      const result = await this.performSync(source);
      
      // Update last sync time
      source.lastSyncAt = new Date();
      this.sources.set(source.id, source);

      return {
        ...result,
        syncDuration: Date.now() - startTime
      };
    } finally {
      this.syncInProgress.delete(source.id);
    }
  }

  private async performSync(source: PromptLibrarySource): Promise<Omit<SyncResult, 'syncDuration'>> {
    switch (source.id) {
      case 'awesome-chatgpt':
        return await this.syncAwesomeChatGPT(source);
      case 'sabrina-library':
        return await this.syncSabrinaLibrary(source);
      case 'promptbase-free':
        return await this.syncPromptBase(source);
      case 'hebrew-business':
        return await this.syncHebrewBusiness(source);
      case 'israeli-startups':
        return await this.syncIsraeliStartups(source);
      case 'music-creativity':
        return await this.syncMusicCreativity(source);
      default:
        throw new Error(`Unknown source: ${source.id}`);
    }
  }

  private async syncAwesomeChatGPT(source: PromptLibrarySource): Promise<Omit<SyncResult, 'syncDuration'>> {
    const response = await fetch(source.apiEndpoint!, {
      headers: {
        'Authorization': `token ${source.authConfig?.token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const csvContent = await response.text();
    const prompts = this.parseAwesomeChatGPTCSV(csvContent);
    
    return {
      source: source.id,
      success: true,
      promptsFound: prompts.length,
      promptsImported: await this.importPrompts(prompts),
      promptsUpdated: 0,
      errors: []
    };
  }

  private async syncSabrinaLibrary(source: PromptLibrarySource): Promise<Omit<SyncResult, 'syncDuration'>> {
    const response = await fetch(`https://api.notion.com/v1/databases/${process.env.SABRINA_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${source.authConfig?.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      }
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    const prompts = this.parseNotionDatabase(data.results);
    
    return {
      source: source.id,
      success: true,
      promptsFound: prompts.length,
      promptsImported: await this.importPrompts(prompts),
      promptsUpdated: 0,
      errors: []
    };
  }

  private async syncPromptBase(source: PromptLibrarySource): Promise<Omit<SyncResult, 'syncDuration'>> {
    const response = await fetch(source.apiEndpoint!);
    
    if (!response.ok) {
      throw new Error(`PromptBase API error: ${response.status}`);
    }

    const data = await response.json();
    const prompts = this.parsePromptBaseResponse(data);
    
    return {
      source: source.id,
      success: true,
      promptsFound: prompts.length,
      promptsImported: await this.importPrompts(prompts),
      promptsUpdated: 0,
      errors: []
    };
  }

  private async syncHebrewBusiness(source: PromptLibrarySource): Promise<Omit<SyncResult, 'syncDuration'>> {
    // Implementation for Hebrew business prompts
    // This would connect to a Google Sheets or custom API
    const prompts = await this.fetchHebrewBusinessPrompts();
    
    return {
      source: source.id,
      success: true,
      promptsFound: prompts.length,
      promptsImported: await this.importPrompts(prompts),
      promptsUpdated: 0,
      errors: []
    };
  }

  private async syncIsraeliStartups(source: PromptLibrarySource): Promise<Omit<SyncResult, 'syncDuration'>> {
    // Implementation for Israeli startup prompts
    const prompts = await this.fetchIsraeliStartupPrompts();
    
    return {
      source: source.id,
      success: true,
      promptsFound: prompts.length,
      promptsImported: await this.importPrompts(prompts),
      promptsUpdated: 0,
      errors: []
    };
  }

  private async syncMusicCreativity(source: PromptLibrarySource): Promise<Omit<SyncResult, 'syncDuration'>> {
    // Implementation for music and creativity prompts
    const prompts = await this.fetchMusicCreativityPrompts();
    
    return {
      source: source.id,
      success: true,
      promptsFound: prompts.length,
      promptsImported: await this.importPrompts(prompts),
      promptsUpdated: 0,
      errors: []
    };
  }

  private shouldSync(source: PromptLibrarySource): boolean {
    if (!source.isActive || this.syncInProgress.has(source.id)) {
      return false;
    }

    if (!source.lastSyncAt) {
      return true;
    }

    const timeSinceLastSync = Date.now() - source.lastSyncAt.getTime();
    const syncIntervalMs = source.syncInterval * 60 * 1000;
    
    return timeSinceLastSync >= syncIntervalMs;
  }

  private parseAwesomeChatGPTCSV(csvContent: string): ExternalPrompt[] {
    const lines = csvContent.split('\n');
    const prompts: ExternalPrompt[] = [];
    
    for (let i = 1; i < lines.length; i++) { // Skip header
      const [act, prompt] = lines[i].split('","');
      if (act && prompt) {
        prompts.push({
          id: `awesome-${i}`,
          title: act.replace(/"/g, ''),
          content: prompt.replace(/"/g, ''),
          category: ['general'],
          tags: [],
          author: 'Community',
          source: 'awesome-chatgpt',
          difficulty: 'intermediate',
          language: 'en',
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    return prompts;
  }

  private parseNotionDatabase(pages: any[]): ExternalPrompt[] {
    return pages.map((page, index) => ({
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text || `Sabrina Prompt ${index}`,
      content: page.properties.Prompt?.rich_text?.[0]?.plain_text || '',
      description: page.properties.Description?.rich_text?.[0]?.plain_text,
      category: page.properties.Category?.multi_select?.map((c: any) => c.name) || ['business'],
      tags: page.properties.Tags?.multi_select?.map((t: any) => t.name) || [],
      author: 'Sabrina Ramonov',
      source: 'sabrina-library',
      difficulty: (page.properties.Difficulty?.select?.name || 'intermediate') as any,
      language: 'en',
      usageCount: page.properties.UsageCount?.number || 0,
      rating: page.properties.Rating?.number,
      createdAt: new Date(page.created_time),
      updatedAt: new Date(page.last_edited_time)
    }));
  }

  private parsePromptBaseResponse(data: any): ExternalPrompt[] {
    return data.prompts?.map((prompt: any) => ({
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      description: prompt.description,
      category: prompt.categories || ['general'],
      tags: prompt.tags || [],
      author: prompt.author?.name || 'Unknown',
      source: 'promptbase-free',
      difficulty: prompt.difficulty || 'intermediate',
      language: prompt.language || 'en',
      usageCount: prompt.downloads || 0,
      rating: prompt.rating,
      createdAt: new Date(prompt.created_at),
      updatedAt: new Date(prompt.updated_at)
    })) || [];
  }

  private async fetchHebrewBusinessPrompts(): Promise<ExternalPrompt[]> {
    // Mock implementation - in real app would fetch from actual source
    return [
      {
        id: 'heb-1',
        title: 'מכירות B2B בישראל',
        content: 'אתה מומחה מכירות B2B בשוק הישראלי. לקוח פונה אליך בבעיה...',
        category: ['sales', 'hebrew'],
        tags: ['b2b', 'israel', 'sales'],
        author: 'Hebrew Community',
        source: 'hebrew-business',
        difficulty: 'intermediate',
        language: 'he',
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private async fetchIsraeliStartupPrompts(): Promise<ExternalPrompt[]> {
    // Mock implementation
    return [];
  }

  private async fetchMusicCreativityPrompts(): Promise<ExternalPrompt[]> {
    // Mock implementation
    return [];
  }

  private async importPrompts(prompts: ExternalPrompt[]): Promise<number> {
    // This would integrate with the main database/storage system
    // For now, return the count as if all were imported
    console.log(`Importing ${prompts.length} prompts...`);
    return prompts.length;
  }

  /**
   * Get all configured sources
   */
  getSources(): PromptLibrarySource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Get sync status for a source
   */
  getSyncStatus(sourceId: string): { inProgress: boolean; lastSync?: Date } {
    const source = this.sources.get(sourceId);
    return {
      inProgress: this.syncInProgress.has(sourceId),
      lastSync: source?.lastSyncAt
    };
  }

  /**
   * Enable/disable a source
   */
  toggleSource(sourceId: string, enabled: boolean): void {
    const source = this.sources.get(sourceId);
    if (source) {
      source.isActive = enabled;
      this.sources.set(sourceId, source);
    }
  }
}

export default PromptLibraryIntegrator;