import { AxiosError } from 'axios'
import { OpenAI } from 'openai'
import { GenerateCommitMessageErrorEnum } from '../generateCommitMessageFromGitDiff'
import { tokenCount } from '../utils/tokenCount'
import type { AiEngine, AiEngineConfig } from './Engine'

export interface OpenAiConfig extends AiEngineConfig {}

export class OpenAiEngine implements AiEngine {
  private readonly config: OpenAiConfig
  private readonly client: OpenAI

  constructor(config: OpenAiConfig) {
    this.config = config
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || undefined,
    })
  }

  public async generateCommitMessage(
    messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>
  ): Promise<string> {
    const params: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: this.config.model,
      messages,
      temperature: 0,
      top_p: 0.1,
      max_tokens: this.config.maxTokensOutput,
    }

    try {
      const REQUEST_TOKENS = messages.reduce(
        (total, msg) => total + tokenCount(msg.content as string) + 4,
        0
      )

      if (REQUEST_TOKENS > this.config.maxTokensInput - this.config.maxTokensOutput) {
        throw new Error(GenerateCommitMessageErrorEnum.tooMuchTokens)
      }

      const completion = await this.client.chat.completions.create(params)
      const message = completion.choices[0].message

      if (!message?.content) {
        throw new Error('No content generated')
      }

      return message.content
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        const openAiError = error.response.data.error
        if (openAiError?.message) {
          throw new Error(openAiError.message)
        }
      }
      throw error
    }
  }
}
