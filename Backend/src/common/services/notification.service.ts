import { Injectable } from '@nestjs/common';
import axios from 'axios'
import { Notification } from 'src/model/entity/notification.entity';

@Injectable()
export class NotificationService {
  private readonly socketURL: string;
  private readonly tokenSocket: string;
 
  constructor() {
    this.socketURL = process.env.SocketURL;
    this.tokenSocket = process.env.TokenSocket;
  }

  async pushNotification(notification: Notification, url: string): Promise<boolean> {
    if (!notification) {
      throw new Error('Notification object is required');
    }
    await this.doPushNotification(notification, url);
    return true;
  }

  private async doPushNotification(notification: Notification, url: string): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-AUTH-TOKEN': this.tokenSocket,
    };

    try {
      const response = await axios.post(`${this.socketURL}/api/${url}`, notification, { headers });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
    } catch (error) {
      console.error('Error:', error.message);
    }

    return null;
  }
}
