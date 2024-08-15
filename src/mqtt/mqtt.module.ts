import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Module({
  controllers: [],
  providers: [MqttService],
})
export class MqttModule {}
