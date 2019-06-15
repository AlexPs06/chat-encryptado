import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router : Router,
  ) { 

    this.loginFormGroup= this.formBuilder.group({
      'username' : [''],
      'password' : [''],
    })
  }

  ngOnInit() {
  }

  iniciarSesion(){
    console.log(this.loginFormGroup.value)
    if(this.loginFormGroup.get("username").value=="Alex" && this.loginFormGroup.get("password").value=="Alejandro1998" ){
      this.router.navigateByUrl("chat");
      localStorage.setItem("username", "Alex")
      localStorage.setItem("idUser", "1")
      localStorage.setItem("idLobby", "1")

    }
    else
      console.log("no")
    if(this.loginFormGroup.get("username").value=="Augusto" && this.loginFormGroup.get("password").value=="12345" ){
      this.router.navigateByUrl("chat");
      localStorage.setItem("username", "Augusto")
      localStorage.setItem("idUser", "2")
      localStorage.setItem("idLobby", "1")

    }
    else
      console.log("no")

  }

}
