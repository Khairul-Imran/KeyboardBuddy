import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { Message, Stomp, StompConfig } from '@stomp/stompjs';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  
  // private stompClient: any;

  // constructor() { }

  // ngOnInit(): void {
  //   const socketUrl = 'ws://localhost:8080/stomp-endpoint';
  //   const stompConfig = {
  //     url: socketUrl,
  //     heartbeat_in: 0,
  //     heartbeat_out: 20000,
  //     reconnect_delay: 5000,
  //     debug: (str: string) => {
  //       console.log(str);
  //     },
  //   };

  //   this.stompClient = Stomp.client(socketUrl);
  //   this.stompClient.heartbeat.incoming = stompConfig.heartbeat_in;
  //   this.stompClient.heartbeat.outgoing = stompConfig.heartbeat_out;
  //   this.stompClient.reconnect_delay = stompConfig.reconnect_delay;
  //   this.stompClient.debug = stompConfig.debug;

  //   this.stompClient.connect({}, (frame: any) => {
  //     console.log('Connected: ' + frame);
  //     this.stompClient.subscribe('/topic/greetings', (message: Message) => {
  //       console.log(message.body);
  //       // Handle the received message here
  //       // You can update your component's properties or perform any necessary actions
  //     });
  //   }, (error: string) => {
  //     console.error('Error connecting to WebSocket:', error);
  //     // Handle the connection error here
  //   });
  // }

  // onSendMessage(): void {
  //   const message = { name: 'John' };
  //   this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  // }

  // ngOnDestroy(): void {
  //   if (this.stompClient !== null) {
  //     this.stompClient.disconnect();
  //   }
  // }
  

}
