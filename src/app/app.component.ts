import { AuthService } from '@auth0/auth0-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { courses } from './course';
import { DOCUMENT, Location } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})


export class AppComponent {


  constructor(public auth: AuthService,
  @Inject(DOCUMENT) private doc: Document) {}
  

  //log in stuff

  loginWithRedirect(): void {
    this.auth.loginWithRedirect();
  }


   logout(): void {
     this.auth.logout({returnTo: this.doc.location.origin});
   }
 
   

  //log in stuff


}

//implements OnInit maybe