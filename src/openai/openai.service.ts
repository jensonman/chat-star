import { Injectable } from '@nestjs/common';
import {Configuration, OpenAIApi} from 'openai';

@Injectable()
export class OpenAIService {
  private openai;

  constructor() {
    const configuration = new Configuration({
        // organization: "org-8diNszBGN4guuoBsGiinbKzr",
        apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration); // 替换为你的 OpenAI API 密钥
  }

  async generateText(prompt: string) {
    // const res = await this.openai.createCompletion({
    //     model: "text-davinci-002",
    //     prompt: "Say this is a test",
    //     max_tokens: 6,
    //     temperature: 0,
    //     stream: true,
    //   });


      try {
        const res = await this.openai.createCompletion({
            model: "text-davinci-002",
            prompt: prompt,
            max_tokens: 100,
            temperature: 0,
            stream: true,
        }, { responseType: 'stream' });
        
        res.data.on('data', data => {
            const lines = data.toString().split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                const message = line.replace(/^data: /, '');
                if (message === '[DONE]') {
                    return; // Stream finished
                }
                try {
                    const parsed = JSON.parse(message);
                    console.log(parsed.choices[0].text);
                } catch(error) {
                    console.error('Could not JSON parse stream message', message, error);
                }
            }
        });
    } catch (error) {
        if (error.response?.status) {
            console.error(error.response.status, error.message);
            error.response.data.on('data', data => {
                const message = data.toString();
                try {
                    const parsed = JSON.parse(message);
                    console.error('An error occurred during OpenAI request: ', parsed);
                } catch(error) {
                    console.error('An error occurred during OpenAI request: ', message);
                }
            });
        } else {
            console.error('An error occurred during OpenAI request', error);
        }
    }
  }
}
