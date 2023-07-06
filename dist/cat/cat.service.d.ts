import { Model } from 'mongoose';
import { Cat, CatDocument } from './cat.schema';
export declare class CatService {
    private catModel;
    constructor(catModel: Model<CatDocument>);
    create(createCatDto: any): Promise<Cat>;
    findAll(): Promise<Cat[]>;
}
