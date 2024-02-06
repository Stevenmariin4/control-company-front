import { Component, OnInit, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss'
})
export class InvitationComponent   implements OnInit{
  private  actionCodeSettings:any;
  firestore = inject(Firestore);
  constructor () {
    this.actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'http://localhost:4200/auth/register',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'http://localhost:4200/auth/register'}
  }
  ngOnInit(): void {
   //this.sendInvitation()
  }
  

  private sendInvitation(){
    try {
      const auth = getAuth();
      sendSignInLinkToEmail(auth, 'stevenmariin4@gmail.com', this.actionCodeSettings).then((value)=>{
        console.log("Email Send", value)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
