import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { WebsocketService } from 'src/services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  formGroupMessage : FormGroup;
  idLobby:"1"
  idUser: string
  array_messages: Message[] = [];

  constructor(
    private websocket : WebsocketService,
    private socket : Socket,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.idUser= localStorage.getItem("idUser") 
    this.formGroupMessage  = this.formBuilder.group({
      message: ''
    })
   }

  ngOnInit() {

    this.websocket.getMessages().subscribe( data =>{
      let _message = data as Message

      if(localStorage.getItem("idLobby") == _message.idLobby){
        this.array_messages.push(_message)
        if(_message.idUser == localStorage.getItem("username")){
          this.formGroupMessage.get('message').setValue("")
        }
      }
    })
  }
  sendMessage(){
    let  value : string = this.formGroupMessage.get("message").value
    if(this.formGroupMessage.valid && value.length != 0){
      this.websocket.sendMessage(this.formGroupMessage.get('message').value, localStorage.getItem("idLobby"), localStorage.getItem("username"))
    }
  }
  
}
export interface Message {
  message: string
  idLobby: string
  idUser: string
}