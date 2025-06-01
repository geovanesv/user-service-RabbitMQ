import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class MessagingService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect('amqp://rabbitmq:5672');
      this.channel = await this.connection.createChannel();

      // Declarar exchange
      await this.channel.assertExchange('user_events', 'topic', {
        durable: true,
      });

      console.log('Connected to RabbitMQ from User Service');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publishUserCreated(userData: {
    userId: string;
    email: string;
    name: string;
  }) {
    const message = {
      event: 'user.created',
      data: userData,
      timestamp: new Date().toISOString(),
    };

    await this.channel.publish(
      'user_events',
      'user.created',
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );

    console.log('Published user.created event:', userData);
  }
}
