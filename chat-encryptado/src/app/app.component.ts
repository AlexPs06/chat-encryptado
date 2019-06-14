import { Component } from '@angular/core';
import { WebsocketService } from 'src/services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-encryptado';
  constructor(
    private websocket : WebsocketService,

  ){

  }
}
