// core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CoreService } from './core.service';
import { MapperService } from 'src/common/services/mapper.service';
import { EmailService } from '../common/services/email.service';
import { HttpContextService } from 'src/common/services/http-context.service';
import { UploadService } from 'src/common/services/upload.service';
import { NotificationService } from 'src/common/services/notification.service';

@Global()
@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    
  ],
  providers: [ 
    EmailService,
    MapperService,
    CoreService,
    HttpContextService,
    UploadService,
    NotificationService
],
  exports: [ 
    CoreService
],
})
export class CoreModule {}
