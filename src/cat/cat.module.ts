import { Module } from '@nestjs/common';
import {  MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './cat.schema';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';
@Module({
    
    imports:[MongooseModule.forFeature([{name: 'Cat', schema: CatSchema, collection: 'test'}])],
    providers: [CatService],
    controllers: [CatController],
    exports: [CatService]
})
export class CatModule {}
