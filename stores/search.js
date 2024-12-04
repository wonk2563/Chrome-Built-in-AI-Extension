import { defineStore } from 'pinia'
import { storage } from 'wxt/storage';
import { useSecretStore } from '@/stores/secret'

export const useSearchStore = defineStore('search', {
    state: () => ({
        results: [],
        history: [],
        searching: false,
        errorMsg: ''
    }),

    actions: {
        async init() {
            this.results = await this.getSearchResult()
            this.history = await this.getHistory()
        },

        async search(input) {
            try {
                if (!input) return

                this.errorMsg = ''
                this.searching = true

                const response = await chrome.runtime.sendMessage({ 
                    action: 'prompt', 
                    systemPrompt: `
                    You are an AI assistant specialized in extracting keywords and generating JSON responses. Your task is to identify the most relevant keywords or topics from a user's input, regardless of length or complexity, and return them in a clear and structured JSON format.

                    Your behavior:
                    1. Analyze the user's input to identify the main themes, subjects, or keywords.
                    2. Prioritize clarity and accuracy. Select keywords that best summarize the user's intent or description.
                    3. Always return a valid JSON object with the following structure:
                    - "keywords": A list of the most relevant keywords or key phrases.
                    - "context": A brief summary of the input or its main theme.

                    Example User Inputs and Outputs:

                    **Input:** "I'm looking for tips on improving my photography skills, especially with lighting."
                    **Output:**
                    {
                        "keywords": ["photography", "lighting", "improving skills"],
                        "context": "The user is seeking advice on enhancing photography skills, focusing on lighting."
                    }

                    **Input:** "Can you find me information about the Great Wall of China?"
                    **Output:**
                    {
                        "keywords": ["Great Wall of China", "information"],
                        "context": "The user is requesting details about the Great Wall of China."
                    }

                    Instructions:
                    - If the input is vague, make reasonable assumptions based on context.
                    - For extremely short inputs, use the exact text as the primary keyword.
                    - Ensure every response is formatted as valid JSON.
                    `.trim(), 
                    content: input
                });
                
                if (!response.success) {
                    this.results = []
                    this.errorMsg = 'search failed: analyze failed'
                    this.searching = false
                    return
                }

                const keywords = JSON.parse(response.data).keywords
                const context = JSON.parse(response.data).context
                const query = keywords.join(' ')

                const secretstore = useSecretStore()
                const list = await chrome.runtime.sendMessage({ 
                    action: 'search', 
                    key: secretstore.customSearchKey, 
                    cx: secretstore.customSearchCX, 
                    query: query
                });

                if (!list.data?.items || list.data?.error) {
                    this.results = []
                    this.errorMsg = 'search failed: no result'
                    this.searching = false
                    return
                }

                const items = list.data.items.map(result => ({
                    title: result.title || "",
                    formattedUrl: result.formattedUrl || "",
                    snippet: result.snippet || ""
                }));

                const sortResponse = await chrome.runtime.sendMessage({ 
                    action: 'prompt', 
                    systemPrompt: `
                    You are an AI assistant designed to analyze search results and sort them based on relevance to the user's specified keywords and context. Your goal is to prioritize results that closely align with the user's intent.

                    ### Your Behavior:
                    1. Analyze the user's provided \`keywords\` and \`context\`.
                    2. For each result in the provided search array, evaluate its relevance to the \`keywords\` and \`context\`. Consider the following factors:
                    - **Title Match:** Does the title include any of the keywords?
                    - **Snippet Match:** Does the snippet include the keywords or provide information related to the context?
                    - **Overall Relevance:** How well does the result align with the overall context provided by the user?

                    3. Assign a relevance score (e.g., 0-1) to each result based on the above factors.

                    4. Sort the results in descending order of relevance score.

                    5. Return the sorted results in a structured JSON format:
                    - Include the original fields of each result (e.g., title, formattedUrl, snippet).
                    - Add a \`relevance_score\` field to indicate the assigned relevance score.

                    Return the tabs sorted by score in descending order in JSON format. Example output:
                    [
                        {
                            "title": "AI For Everyone Course (DeepLearning.AI) | Coursera",
                            "formattedUrl": "https://www.coursera.org/learn/ai-for-everyone",
                            "snippet": "Learn AI terminology, capabilities, and applications. Ideal for non-technical professionals.",
                            "relevance_score": 0.9
                        },
                        {
                            "title": "Stanford AI in Healthcare Specialization",
                            "formattedUrl": "https://www.coursera.org/specializations/ai-healthcare",
                            "snippet": "Explore AI applications in healthcare, including machine learning and data science.",
                            "relevance_score": 0.8
                        }
                    ]

                    ### Instructions:
                    - If multiple results have the same relevance score, preserve their original order.
                    - Focus on delivering accurate and meaningful sorting based on user intent.
                    `.trim(), 
                    content: JSON.stringify({ keywords: keywords, context: context, items: items })
                });

                chrome.runtime.sendMessage({ action: 'console', data: JSON.parse(sortResponse.data) });
                if (!sortResponse.success) {
                    this.results = []
                    this.errorMsg = 'search failed: sort failed'
                    this.searching = false
                    return
                }
                
                this.searching = false
                await this.setSearchResult(input, JSON.parse(sortResponse.data))
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'search error' })
                this.errorMsg = 'search error'
                this.searching = false
            }
        },

        async getSearchResult() {
            try {
                this.errorMsg = ''
                const result = await storage.getItem('local:searchResults')
                if (result) return Object.values(result)

                return []
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'getSearchResult error' })
                this.errorMsg = 'getSearchResult error'
            }
        },

        async setSearchResult(query, result) {
            try {
                this.errorMsg = ''
                this.results = result
                await storage.setItem('local:searchResults', this.results)
                await this.addToHistory({
                    query: query,
                    date: new Date().toISOString()
                })
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'setResult error' })
                this.errorMsg = 'setResult error'
            }
        },

        async clearResult() {
            try {
                this.errorMsg = ''
                this.results = []
                await storage.removeItem('local:searchResults')
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'clear error' })
                this.errorMsg = 'clear error'
            }
        },

        async getHistory() {
            try {
                this.errorMsg = ''
                const history = await storage.getItem('local:searchHistory')
                if (history) return Object.values(history)

                return []
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'getHistory error' })
                this.errorMsg = 'getHistory error'
            }
        },

        async addToHistory(query) {
            try {
                this.errorMsg = ''
                this.history.unshift(query)
                await storage.setItem('local:searchHistory', this.history)
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'addToHistory error' })
                this.errorMsg = 'addToHistory error'
            }
        },

        async removeFromHistory(query) {
            try {
                this.errorMsg = ''
                this.history = this.history.filter((item) => item !== query)
                await storage.setItem('local:searchHistory', this.history)
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'removeFromHistory error' })
                this.errorMsg = 'removeFromHistory error'
            }
        },

        async clearHistory() {
            try {
                this.errorMsg = ''
                await storage.removeItem('local:searchHistory')
                this.history = []
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'clearHistory error' })
                this.errorMsg = 'clearHistory error'
            }
        }
    }
})