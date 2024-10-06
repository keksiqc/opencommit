import { getConfig, OCO_AI_PROVIDER_ENUM } from '../commands/config'
import { AnthropicEngine } from '../engine/anthropic'
import { AzureEngine } from '../engine/azure'
import type { AiEngine } from '../engine/Engine'
import { FlowiseEngine } from '../engine/flowise'
import { GeminiEngine } from '../engine/gemini'
import { OllamaEngine } from '../engine/ollama'
import { OpenAiEngine } from '../engine/openAi'
import { TestAi, type TestMockType } from '../engine/testAi'
import { GroqEngine } from '../engine/groq'

export function getEngine(): AiEngine {
  const config = getConfig()
  const provider = config.OCO_AI_PROVIDER

  const DEFAULT_CONFIG = {
    model: config.OCO_MODEL!,
    maxTokensOutput: config.OCO_TOKENS_MAX_OUTPUT!,
    maxTokensInput: config.OCO_TOKENS_MAX_INPUT!,
    baseURL: config.OCO_API_URL!,
    apiKey: config.OCO_API_KEY!,
  }

  const engineMap: Record<OCO_AI_PROVIDER_ENUM, () => AiEngine> = {
    [OCO_AI_PROVIDER_ENUM.OLLAMA]: () => new OllamaEngine(DEFAULT_CONFIG),
    [OCO_AI_PROVIDER_ENUM.ANTHROPIC]: () => new AnthropicEngine(DEFAULT_CONFIG),
    [OCO_AI_PROVIDER_ENUM.TEST]: () => new TestAi(config.OCO_TEST_MOCK_TYPE as TestMockType),
    [OCO_AI_PROVIDER_ENUM.GEMINI]: () => new GeminiEngine(DEFAULT_CONFIG),
    [OCO_AI_PROVIDER_ENUM.AZURE]: () => new AzureEngine(DEFAULT_CONFIG),
    [OCO_AI_PROVIDER_ENUM.FLOWISE]: () => new FlowiseEngine(DEFAULT_CONFIG),
    [OCO_AI_PROVIDER_ENUM.GROQ]: () => new GroqEngine(DEFAULT_CONFIG),
    [OCO_AI_PROVIDER_ENUM.OPENAI]: () => new OpenAiEngine(DEFAULT_CONFIG),
  }

  return (engineMap[provider] || engineMap[OCO_AI_PROVIDER_ENUM.OPENAI])()
}
