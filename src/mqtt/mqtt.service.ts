import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';

import * as trackings from './data/tracking.json'

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;
  private mqttUrl: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.mqttUrl = this.configService.get<string>('MQTT_URL');
  }

  onModuleInit() {
    this.connectToMQTTServer();
    for (const tracking of trackings) {
      const result = Object.values(tracking).join(',');
      this.sendMessage('plot', result);
    }   
  }

  onModuleDestroy() {
    this.disconnectToMQTTServer();
  }

  private connectToMQTTServer() {
    this.client = mqtt.connect(this.mqttUrl);

    this.client.on('connect', () => {
      console.log('cliente MQQT conectado');
    });

    this.client.on('error', (error) => {
      console.log(error);
      this.client.end();
    });
  }

  private async sendMessage(topic: string, message: string) {
    try {
      const hexMessage = Buffer.from(message);
      await this.client.publishAsync(topic, hexMessage);
      console.log('Mensaje enviado correctamente');
    } catch (error) {
      console.log('Error al enviar mensaje');
      console.log(error);
    }
  }

  private disconnectToMQTTServer() {
    if (this.client) {
      this.client.end();
    }
  }

}
