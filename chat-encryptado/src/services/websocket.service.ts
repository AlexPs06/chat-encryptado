import { Injectable, OnInit } from '@angular/core';
import { Socket} from 'ngx-socket-io';
import { from, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnInit {

  private url = environment.wsURL ;  
  private socket1;

  public socketStatus=false;
  

  constructor(
    private socket : Socket,
    private router: Router,
    private http: HttpClient
  ) { 
    this.checkStatus();
    this.socket1 = io(this.url);
    this.socket.on('destroy', (data) => {
     
    });
    
  }
  ngOnInit(){

  }

  checkStatus(){
    console.log('ejecutando')
    this.socket.on('connect',()=>{
      console.log('conectado')
      this.socketStatus=true;
    })
    this.socket.on('disconnect',()=>{
      console.log('Desconectado')
      //localStorage.clear();
      //this.router.navigateByUrl("");
      this.socketStatus=false;
    })
    
    
    
  }
 
  public sendMessage(_message, _idLobby, _idUser){
    console.log(`Message: ${ _message } - idLobby: ${ _idLobby } - idUser: ${ _idUser }`)
    this.socket.emit('message', { message: _message, idLobby: _idLobby, idUser: _idUser, username:localStorage.getItem("username") })
  }

  public sendDataWinner(username, name_image){
    console.log("I send: " + username + "-name_image: " + name_image)
    this.socket.emit('winner_event', { username: username, name_image: name_image })
  }

  public getAllMessages(idLobby){
    return this.http.get<any[]>(this.url+'/messages');
  }

  

  public getNewMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('new-message', (message) => {
          observer.next(message);
        });
    });
  }

  public getWinner = () => {
    return Observable.create((observer) => {
        this.socket.on('set_winner', (data) => {
            observer.next(data);
        });
    });
  }


}
