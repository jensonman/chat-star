import { AppService } from './app.service';
import { CatService } from './cat/cat.service';
export declare class AppController {
    private readonly appService;
    private readonly catService;
    constructor(appService: AppService, catService: CatService);
    getHello(): Promise<any>;
}
