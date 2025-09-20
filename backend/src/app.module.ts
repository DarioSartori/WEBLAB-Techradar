import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TechnologiesModule } from './technologies/technologies.module';
import { RadarModule } from './radar/radar.module';

@Module({
  imports: [TechnologiesModule, RadarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
