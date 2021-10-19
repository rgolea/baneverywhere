import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export function mongooseConfigFactory(
  configService: ConfigService
): MongooseModuleOptions {
  console.log(configService);
  return {
    uri:
      configService.get<string>('MONGODB_URI') ||
      'mongodb://localhost:27017/baneverywhere',
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };
}
