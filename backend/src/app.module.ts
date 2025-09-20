import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TechnologiesModule } from './technologies/technologies.module';

@Module({
  imports: [TechnologiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
