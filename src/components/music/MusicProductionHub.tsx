import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MusicPrompt {
  id: string;
  title: string;
  content: string;
  category: 'production' | 'songwriting' | 'mixing' | 'collaboration' | 'practice';
  genre?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  tools: string[]; // DAW, instruments, plugins required
  estimatedTime: number; // in minutes
  tags: string[];
}

interface MusicProductionHubProps {
  onPromptSelect?: (prompt: MusicPrompt) => void;
}

const MusicProductionHub: React.FC<MusicProductionHubProps> = ({ onPromptSelect }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<MusicPrompt['category']>('production');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const musicPrompts: MusicPrompt[] = [
    // Beat Creation
    {
      id: 'beat-trap-basic',
      title: 'Create a Trap Beat Foundation',
      content: 'Design a modern trap beat with the following elements: 1) Start with a punchy kick pattern on beats 1 and 3, 2) Add crispy snares on beats 2 and 4 with some ghost notes, 3) Create a rolling hi-hat pattern with triplets and occasional open hats, 4) Design a dark, minor key melody using 808s and synths, 5) Keep the BPM around 140-150. Focus on space and dynamics.',
      category: 'production',
      genre: 'trap',
      difficulty: 'intermediate',
      tools: ['FL Studio', 'Ableton Live', '808 samples', 'Trap drum kit'],
      estimatedTime: 45,
      tags: ['hip-hop', 'modern', '808s', 'rhythmic']
    },
    {
      id: 'beat-lofi-chill',
      title: 'Lo-Fi Hip Hop Study Beat',
      content: 'Create a relaxing lo-fi hip hop beat perfect for studying: 1) Use a laid-back drum pattern around 70-90 BPM, 2) Add vinyl crackle and tape saturation for warmth, 3) Include jazz-influenced chord progressions, 4) Layer soft piano or electric piano sounds, 5) Add subtle bass lines, 6) Include ambient textures and field recordings for atmosphere.',
      category: 'production',
      genre: 'lo-fi',
      difficulty: 'beginner',
      tools: ['Any DAW', 'Piano samples', 'Vinyl plugins', 'Ambient sounds'],
      estimatedTime: 60,
      tags: ['chill', 'jazz', 'ambient', 'relaxing']
    },

    // Songwriting
    {
      id: 'songwriting-pop-verse',
      title: 'Pop Song Verse Structure',
      content: 'Write a compelling pop song verse using this framework: 1) Start with a strong visual or emotional hook in the first line, 2) Build the story throughout 4-8 lines, 3) Use conversational language that feels natural, 4) Include at least one internal rhyme per line, 5) End with a line that sets up the chorus emotionally, 6) Keep the melody simple but memorable with stepwise motion.',
      category: 'songwriting',
      genre: 'pop',
      difficulty: 'intermediate',
      tools: ['Piano/Guitar', 'Voice recorder', 'Notebook'],
      estimatedTime: 30,
      tags: ['lyrics', 'melody', 'structure', 'commercial']
    },
    {
      id: 'songwriting-hebrew-ballad',
      title: 'Hebrew Ballad Composition',
      content: 'כתוב בלדה עברית רגשית: 1) התחל בתמונה או זיכרון חזק, 2) פתח עם אקורד מינור או מז\'ור עם tension, 3) השתמש בחרוזים פנימיים ובמשחק מילים עברי, 4) בנה מתח אמוציונלי לקראת הפזמון, 5) השתמש בביטויים ישראליים אותנטיים, 6) שמור על מלודיה פשוטה שקל לשיר.',
      category: 'songwriting',
      genre: 'hebrew',
      difficulty: 'advanced',
      tools: ['Guitar', 'Piano', 'Hebrew rhyming dictionary'],
      estimatedTime: 90,
      tags: ['hebrew', 'ballad', 'emotional', 'israeli']
    },

    // Mixing
    {
      id: 'mixing-vocal-clarity',
      title: 'Achieve Crystal Clear Vocals',
      content: 'Mix vocals for maximum clarity and presence: 1) Start with proper gain staging and eliminate noise, 2) Apply high-pass filter around 80-100Hz, 3) Use gentle compression (3:1 ratio) to control dynamics, 4) Add subtle EQ boost around 2-5kHz for presence, 5) Create depth with reverb (short plate or hall), 6) Use de-esser to control sibilance, 7) Double-check mono compatibility.',
      category: 'mixing',
      genre: 'all',
      difficulty: 'intermediate',
      tools: ['Pro Tools', 'Logic Pro', 'EQ', 'Compressor', 'Reverb'],
      estimatedTime: 45,
      tags: ['vocals', 'eq', 'compression', 'clarity']
    },

    // Collaboration
    {
      id: 'collab-remote-session',
      title: 'Remote Collaboration Session Plan',
      content: 'Plan an effective remote music collaboration: 1) Choose cloud-based DAW or file sharing method, 2) Establish BPM, key, and basic structure beforehand, 3) Create a shared folder with stems and project files, 4) Set up video call for real-time communication, 5) Assign specific roles (producer, songwriter, mixer), 6) Plan 2-hour focused sessions with breaks, 7) Document all creative decisions.',
      category: 'collaboration',
      genre: 'all',
      difficulty: 'beginner',
      tools: ['BandLab', 'Splice', 'Zoom', 'Google Drive'],
      estimatedTime: 120,
      tags: ['remote', 'teamwork', 'planning', 'communication']
    },

    // Practice
    {
      id: 'practice-guitar-technique',
      title: 'Daily Guitar Practice Routine',
      content: 'Structure a 30-minute daily practice session: 1) Warm-up (5 min): Chromatic exercises and finger stretches, 2) Technique (10 min): Focus on alternate picking or sweep picking, 3) Scales (8 min): Practice modes in different positions, 4) Song work (5 min): Learn or refine a challenging piece, 5) Improvisation (2 min): Free play over backing track. Record yourself weekly to track progress.',
      category: 'practice',
      genre: 'all',
      difficulty: 'intermediate',
      tools: ['Guitar', 'Metronome', 'Backing tracks', 'Recording app'],
      estimatedTime: 30,
      tags: ['guitar', 'technique', 'routine', 'improvement']
    }
  ];

  const categories = [
    { key: 'production' as const, label: 'Production', icon: '🎛️' },
    { key: 'songwriting' as const, label: 'Songwriting', icon: '✍️' },
    { key: 'mixing' as const, label: 'Mixing', icon: '🎚️' },
    { key: 'collaboration' as const, label: 'Collaboration', icon: '🤝' },
    { key: 'practice' as const, label: 'Practice', icon: '🎯' }
  ];

  const genres = ['all', 'pop', 'hip-hop', 'trap', 'lo-fi', 'hebrew', 'rock', 'electronic', 'jazz'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'professional'];

  const filteredPrompts = musicPrompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'production' || prompt.category === selectedCategory;
    const matchesGenre = selectedGenre === 'all' || prompt.genre === selectedGenre;
    const matchesDifficulty = selectedDifficulty === 'all' || prompt.difficulty === selectedDifficulty;
    const matchesSearch = searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesGenre && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'professional': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="music-production-hub">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-main mb-2">{t('music_title')}</h2>
        <p className="text-text-secondary">{t('music_desc')}</p>
      </div>

      {/* Category Navigation */}
      <div className="category-nav mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                ${selectedCategory === category.key 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-card text-text-main hover:bg-card-secondary'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{t(`music_${category.key}_title`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters mb-6 bg-card p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('search.placeholder')}</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('music_genre')}</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? t('all_genres') : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('difficulty_levels.difficulty')}</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? t('all_difficulties') : t(`difficulty_levels.${difficulty}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedGenre('all');
                setSelectedDifficulty('all');
                setSearchTerm('');
              }}
              className="w-full px-3 py-2 text-sm text-text-secondary hover:text-text-main border border-border rounded-lg hover:bg-card-secondary transition-colors"
            >
              {t('search.clear_filters')}
            </button>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="prompts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map(prompt => (
          <div
            key={prompt.id}
            className="prompt-card bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onPromptSelect?.(prompt)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg line-clamp-2">{prompt.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(prompt.difficulty)}`}>
                {t(`difficulty_levels.${prompt.difficulty}`)}
              </span>
            </div>

            {/* Content Preview */}
            <p className="text-text-secondary text-sm mb-4 line-clamp-3">
              {prompt.content}
            </p>

            {/* Metadata */}
            <div className="space-y-2 text-sm">
              {/* Tools */}
              <div>
                <span className="font-medium text-text-main">Tools: </span>
                <span className="text-text-secondary">{prompt.tools.join(', ')}</span>
              </div>

              {/* Time and Genre */}
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">
                  ⏱️ ~{prompt.estimatedTime} {t('minutes')}
                </span>
                {prompt.genre && (
                  <span className="text-primary font-medium">
                    {prompt.genre.charAt(0).toUpperCase() + prompt.genre.slice(1)}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {prompt.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-accent text-text-main text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">{t('music_no_prompts_found')}</h3>
          <p className="text-text-secondary">{t('music_try_different_filters')}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{t('music_quick_actions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-border rounded-lg hover:bg-card-secondary transition-colors">
            <div className="text-2xl mb-2">🎼</div>
            <div className="font-medium">{t('music_create_custom_prompt')}</div>
            <div className="text-sm text-text-secondary">{t('music_custom_prompt_desc')}</div>
          </button>
          
          <button className="p-4 text-left border border-border rounded-lg hover:bg-card-secondary transition-colors">
            <div className="text-2xl mb-2">🎹</div>
            <div className="font-medium">{t('music_practice_session')}</div>
            <div className="text-sm text-text-secondary">{t('music_practice_session_desc')}</div>
          </button>
          
          <button className="p-4 text-left border border-border rounded-lg hover:bg-card-secondary transition-colors">
            <div className="text-2xl mb-2">🤝</div>
            <div className="font-medium">{t('music_collaboration_tools')}</div>
            <div className="text-sm text-text-secondary">{t('music_collaboration_desc')}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicProductionHub;