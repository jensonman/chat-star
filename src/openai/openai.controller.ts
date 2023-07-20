import { Controller, Get,  Post, Req,  Res, Sse } from '@nestjs/common';
import { Response, Request } from 'express';
import { OpenAIService } from './openai.service';
@Controller('openai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('generate')
  async generateText(@Req() req:Request, @Res() res: Response) {


    const prompt = req.body.promptMessage.value;
    this.openaiService.setPostMessage(prompt)
    // for await (const chunk of generator) {
    //     console.log("chunk:---", chunk)
    //   res.write(`data: ${chunk}\n\n`);
    // }
  }
  @Get('generate/text')
  async text(@Res() res: Response){
    const prompt = this.openaiService.getPostMessage()
    this.openaiService.generateText(res,prompt);
  }
}
