import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { WebsocketService } from 'src/services/websocket.service';
import * as Crypto from 'crypto-js'


export interface Message {
  message: string
  idLobby: string
  idUser: string
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})


export class ChatComponent implements OnInit {


  formGroupMessage: FormGroup;
  idLobby: number
  topic: string
  lobbyData = 'room<1>.topic<test>'
  idUser: string
  currentUser: string
  array_messages: any[] = [];

  constructor(
    private websocket: WebsocketService,
    private socket: Socket,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.idLobby = 1
    this.topic = 'testCryptoChat'
    this.currentUser = localStorage.getItem("username")

    this.websocket.getAllMessages(this.idLobby).subscribe(data => {
      data.forEach(element => {
        let decrypted = Crypto.AES.decrypt(element.message, `room<${this.idLobby}>.topic<${this.topic}>`);
        element.message = decrypted.toString(Crypto.enc.Utf8)
        this.array_messages.push(element)
      });
      console.log(data)
    })


  }

  ngOnInit() {
    this.idUser = localStorage.getItem("idUser")
    this.formGroupMessage = this.formBuilder.group({
      message: ''
    })

    this.websocket.getNewMessages().subscribe(data => {
      let _message = data as Message

      if (localStorage.getItem("idLobby") == _message.idLobby) {

        let decrypted = Crypto.AES.decrypt(_message.message, `room<${this.idLobby}>.topic<${this.topic}>`);
        _message.message = decrypted.toString(Crypto.enc.Utf8)
        this.array_messages.push(_message)

        if (_message.idUser == localStorage.getItem("username")) {
          this.formGroupMessage.get('message').setValue("")
        }
      }
      console.log(this.array_messages)

    })



  }



  sendMessage(el: HTMLElement) {
    let value: string = this.formGroupMessage.get("message").value
    if (this.formGroupMessage.valid && value.length != 0) {
      let encrypted = Crypto.AES.encrypt(this.formGroupMessage.get('message').value, `room<${this.idLobby}>.topic<${this.topic}>`)
      this.websocket.sendMessage(encrypted.toString(), localStorage.getItem("idLobby"), localStorage.getItem("username"))
      console.log(this.array_messages)
      // el.scrollTop = el.scrollHeight;

    }
  }

}
