import { Injectable } from '@angular/core';
import { defaultIterableDiffers } from '@angular/core/src/change_detection/change_detection';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  bookDetails:any;
  booksList:any;
  flow:String;
  spinnerText:String;
  spinnerDisplay:boolean;
  userDetails:any;
  dialogData:any;
  constructor() { 

  }
  setBookDetails(value){
    this.bookDetails = value;
  }
  getBookDetails(){
    return this.bookDetails;
  }
  setBooksList(value){
    this.booksList = value;
  }
  getBooksList(){
    return this.booksList;
  }
  getRole(){
    let details:any = this.getUserDetails();
    if(details && details.user_info.role.toLowerCase() === 'gn'){
      return 'user';
    }
    else if(details && details.user_info.role.toLowerCase() === 'adm'){
      return 'admin';
    }
    else if(details && details.user_info.role.toLowerCase() === 'lib'){
      return 'librarian';
    }
  }
  setFlow(value){
    this.flow = value;
  }
  getFlow(){
    return this.flow;
  }
  setUserDetails(value){
    this.userDetails = value;
    localStorage.setItem('user-details', JSON.stringify(value));
  }
  getUserDetails(){
    return JSON.parse(localStorage.getItem('user-details'));
  }
  setUserEditedDetails(value){
    let editedDetails = JSON.parse(localStorage['user-details']);
    editedDetails.user_info = value;
    localStorage['user-details'] = JSON.stringify(editedDetails);
  }
  setDialogData(value){
    this.dialogData = value;
  }
  getDialogData(){
    return this.dialogData;
  }
  isLoggedIn() {
    let userDetails = localStorage.getItem('user-details');
    return (userDetails && userDetails !== null && userDetails !== undefined && userDetails !== '');
  }
}
