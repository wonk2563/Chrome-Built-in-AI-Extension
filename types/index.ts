interface TabRecommendation {
    id: string
    title: string
    url: string
    relevance: number
}

interface SearchResult {
    url: string
    title: string
}

interface SearchResult {
    url: string
    title: string
    summary: string
}

interface WebpageContent {
    url: string
    title: string
    mainContent: string
    extractedAt: Date
    error?: string
}

interface ReadLaterItem {
    id: string
    url: string
    title: string
    summary?: string
    addedAt: string
    reminderSettings?: ReminderSettings
}

interface ReminderSettings {
    type: 'specific_time' | 'duration'
    specificTime?: string
    duration?: '1h' | '4h' | '1d' | '3d'
}

interface Window {
    ai: any,
    translation: any,
}

interface chrome {
    readingList: any,
}