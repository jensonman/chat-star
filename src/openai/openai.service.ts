import { Injectable, Res } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { Response } from 'express';
@Injectable()
export class OpenAIService {
    private openai;
    private postMessage: string;
    constructor() {
        const configuration = new Configuration({
            // organization: "org-8diNszBGN4guuoBsGiinbKzr",
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(configuration); // 替换为你的 OpenAI API 密钥
    }

    async generateText(response: Response, prompt: string) {
        // const response = await this.openai.createCompletion({
        //     model: "text-davinci-002",
        //     prompt: "Say this is a test",
        //     max_tokens: 6,
        //     temperature: 0,
        //     stream: true,
        //   });
        console.log("responseponse:")
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Connection', 'keep-alive');
        response.setHeader('Access-Control-Allow-Origin', '*');

        response.write("retry: 10000\n");
        response.write("event: connecttime\n");
        response.write("data: " + (new Date()) + "\n\n");
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
                        response.write(message);
                        response.end(); // Stream finished, close the response
                        return;
                    }
                    try {
                        const parsed = JSON.parse(message);
                        response.write("data: " + (parsed.choices[0].text) + "\n\n");
                        console.log(parsed.choices[0].text)
                        // res.write(parsed.choices[0].text);
                        // Send data to the SSE connection on the front end
                        // 示例：将数据发送给前端的EventSource对象
                        // EventSource.send(parsed.choices[0].text);
                    } catch (error) {
                        console.error('Could not JSON parse stream message', message, error);
                    }
                }
            });
        } catch (error) {
            console.log(error)
        }

        response.addListener("close", function () {
            console.log() 
        });
    }

    setPostMessage(message: string) {
        this.postMessage = message
    }

    getPostMessage(): string {
        return this.postMessage
    }

}
