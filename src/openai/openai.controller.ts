import { Controller, Post, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { OpenAIService } from './openai.service';
@Controller('openai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('generate')
  async generateText(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Transfer-Encoding', 'chunked');

    const prompt = 'hello...';
    this.openaiService.generateText(prompt);
    // for await (const chunk of generator) {
    //     console.log("chunk:---", chunk)
    //   res.write(`data: ${chunk}\n\n`);
    // }

    res.end();
  }
}
