import { Injectable, inject } from '@angular/core';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  // private rxStompService = inject(RxStompService);

  // private rxStompConfig: InjectableRxStompConfig = {
  //   brokerURL: 'ws://localhost:8080/stomp-endpoint',
  //   connectHeaders: {},
  //   heartbeatIncoming: 0,
  //   heartbeatOutgoing: 20000,
  //   reconnectDelay: 200,
  // };



}
