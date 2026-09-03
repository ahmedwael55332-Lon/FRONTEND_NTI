import { Component, OnDestroy, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

interface EmergencyNotification {
  requestId: string;
  bloodType: 'A' | 'B' | 'AB' | 'O';
  rh: 'Positive' | 'Negative';
  urgency: 'normal' | 'emergency';
  message: string;
  createdAt?: string;
}

@Component({
  selector: 'app-donor-notifications',
  templateUrl: './donor-notifications.component.html',
  styleUrls: ['./donor-notifications.component.css']
})
export class DonorNotificationsComponent
  implements OnInit, OnDestroy {

  navItems: any[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/donor'
    },
    {
      label: 'Profile',
      icon: 'person',
      route: '/donor/profile'
    },
    {
      label: 'Medical Check',
      icon: 'health_and_safety',
      route: '/donor/medical-check'
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/donor/notifications'
    }
  ];

  notifications: EmergencyNotification[] = [];

  socket: Socket | null = null;

  constructor(private authService: AuthService) {}

  connected = false;
  socketError = '';

  browserNotificationsSupported =
    'Notification' in window;

  browserNotificationsEnabled =
    'Notification' in window &&
    Notification.permission === 'granted';

  ngOnInit(): void {
    this.connectSocket();
  }

  connectSocket(): void {

    const token = this.authService.getToken();

    if (!token) {
      this.socketError =
        'Authentication token not found.';
      return;
    }

    const socketUrl =
      environment.apiUrl.replace(/\/api\/?$/, '');

    this.socket = io(socketUrl, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {

      console.log(
        'Socket connected:',
        this.socket?.id
      );

      this.connected = true;
      this.socketError = '';
    });

    this.socket.on(
      'connect_error',
      (error) => {

        console.error(
          'Socket connection error:',
          error
        );

        this.connected = false;

        this.socketError =
          error?.message ||
          'Failed to connect to notification server.';
      }
    );

    this.socket.on(
      'emergency:new-request',
      (notification: EmergencyNotification) => {

        console.log(
          'NEW EMERGENCY REQUEST:',
          notification
        );

        this.notifications.unshift(
          notification
        );

        this.showBrowserNotification(
          notification
        );
      }
    );

    this.socket.on(
      'disconnect',
      (reason) => {

        console.log(
          'Socket disconnected:',
          reason
        );

        this.connected = false;
      }
    );
  }

  showBrowserNotification(
    notification: EmergencyNotification
  ): void {

    if (
      this.browserNotificationsSupported &&
      this.browserNotificationsEnabled
    ) {

      new Notification(
        'Emergency Blood Request',
        {
          body: notification.message
        }
      );
    }
  }

  enableBrowserNotifications(): void {

    if (!this.browserNotificationsSupported) {
      return;
    }

    if (Notification.permission === 'default') {

      Notification.requestPermission()
        .then((permission) => {

          this.browserNotificationsEnabled =
            permission === 'granted';

        });

      return;
    }

    this.browserNotificationsEnabled =
      Notification.permission === 'granted';
  }

  formatDate(date?: string): string {

    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString(
      'en-US',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    );
  }

  clearNotifications(): void {
    this.notifications = [];
  }

  ngOnDestroy(): void {

    if (this.socket) {

      this.socket.removeAllListeners();

      this.socket.disconnect();

      this.socket = null;
    }
  }
}