
export enum Platform {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  LinkedIn = 'LinkedIn',
  X = 'X',
  TikTok = 'TikTok',
  Pinterest = 'Pinterest'
}

export enum ContentGoal {
  Awareness = 'Awareness',
  Engagement = 'Engagement',
  Leads = 'Leads',
  Sales = 'Sales'
}

export enum BrandTone {
  Professional = 'Professional',
  Conversational = 'Conversational',
  Bold = 'Bold',
  Playful = 'Playful'
}

export enum HookStyle {
  Question = 'Question-based',
  Statement = 'Bold statement',
  Interrupt = 'Pattern Interrupt',
  Emotional = 'Emotional',
  Educational = 'Educational',
  Curiosity = 'Curiosity Gap',
  Benefit = 'Direct Benefit',
  Controversial = 'Controversial/Polarizing'
}

export interface StrategyInput {
  platform: Platform[];
  goal: ContentGoal;
  tone: BrandTone;
  hookStyle: HookStyle;
  industry?: string;
  exclusions?: string;
  image: File | null;
}

export interface GeneratedContent {
  platformName: string;
  hook: string;
  caption: string;
  overlayText?: string;
  hashtags: string[];
  engagementStrength: 'Low' | 'Medium' | 'High';
  engagementReason: string;
}

export interface SavedStrategy {
  id: string;
  timestamp: number;
  input: Omit<StrategyInput, 'image'>;
  results: GeneratedContent[];
  imagePrompt: string | null;
  scheduledDate?: string; // YYYY-MM-DD format for planning
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}
