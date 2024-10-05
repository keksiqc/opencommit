import type AnthropicClient from '@anthropic-ai/sdk'
import type { OpenAIClient as AzureOpenAIClient } from '@azure/openai'
import type { GoogleGenerativeAI as GeminiClient } from '@google/generative-ai'
import type { AxiosInstance as RawAxiosClient } from 'axios'
import type { OpenAI as OpenAIClient } from 'openai'

export interface AiEngineConfig {
  apiKey: string
  model: string
  maxTokensOutput: number
  maxTokensInput: number
  baseURL?: string
}

type Client =
  | OpenAIClient
  | AzureOpenAIClient
  | AnthropicClient
  | RawAxiosClient
  | GeminiClient

export interface AiEngine {
  config: AiEngineConfig
  client: Client
  generateCommitMessage(
    messages: Array<OpenAIClient.Chat.Completions.ChatCompletionMessageParam>,
  ): Promise<string | null | undefined>
}
