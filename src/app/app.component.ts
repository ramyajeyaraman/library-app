import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { CommonActionDialogComponent } from './shared/components/common-action-dialog/common-action-dialog.component';
import { CommonService } from '../app/shared/services/common.service';
import { RestService } from '../app/shared/services/rest.service';
import {ToasterComponent} from '../app/shared/components/toaster/toaster.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WS } from '../app/shared/constants/endpoint';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Kmax';
  template = '<img class="loading-image" src="./assets/images/spinner.gif" />';
  optionsList1:any;
  optionsList2:any;
  spinnerDisplay:boolean;
  userDetails:any;
  constructor(public dialog: MatDialog,private commonService: CommonService, private router: Router,
    private restService: RestService,private toaster: ToasterComponent, private spinner: Ng4LoadingSpinnerService,
    private cookieService: CookieService) { 
    this.spinnerDisplay = false;
  }

  ngOnInit() {
    this.spinnerDisplay = this.commonService.spinnerDisplay;
    this.userDetails = this.commonService.getUserDetails();
  }
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '900px';
    dialogConfig.height = '500px';
    let userVal:any = this.commonService.getUserDetails();
    let user = {
      'flow':'edit-profile',
      'email_id':userVal.user_info.email_id,
      'password':userVal.user_info.password,
      'recovery_question1':userVal.user_info.recovery_question1,
      'recovery_question2':userVal.user_info.recovery_question2,
      'recovery_answer1':userVal.user_info.recovery_answer1,
      'recovery_answer2':userVal.user_info.recovery_answer2,
      'user_id':userVal.user_info.user_id
    };
    this.commonService.setDialogData(user);
    const dialogRef = this.dialog.open(CommonActionDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    ); 
  }
  logout(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '200px';
    let user = {
      'flow':'logout-profile',
      'content':'Are you sure you want to logout?'
    };
    this.commonService.setDialogData(user);
    const dialogRef = this.dialog.open(CommonActionDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if(data === 'logout success'){
        this.spinner.show();
        this.restService.postData(WS.logout.endpoint,{},false,(data) => {
          if(data && !data.error){
            this.commonService.setFlow([]);
            this.commonService.setUserDetails('');
            this.cookieService.delete('JSESSIONID');
            localStorage.clear();
            this.spinner.hide();
            this.router.navigate(['/login']);
          }
          else if(data && data.status === 500){
            this.spinner.hide();
            this.toaster.openSnackBar(WS.logout.errorMessage,'Close');
          }
          else{
            this.spinner.hide();
          }
        });
      }
    }); 
  }
  loggedInUser(){
    return this.commonService.isLoggedIn();
  }
  getUserDetails(){
    let userName = '';
    this.userDetails = this.commonService.getUserDetails();
    if(this.userDetails && this.commonService.isLoggedIn()){
      userName = this.userDetails.user_info.user_fname + ' ' + this.userDetails.user_info.user_lname;
    }
    else{
      userName ='';
    }
    return userName;
  }
  navigateToHomePage(){
    this.userDetails = this.commonService.getUserDetails();
    let role = this.commonService.getRole();
    if(this.commonService.isLoggedIn() && this.userDetails && role === 'admin'){
      this.router.navigate(['/landing-page']);
    }
    else if(this.commonService.isLoggedIn() && this.userDetails && role === 'librarian'){
      this.router.navigate(['/landing-page']);
    }
    else if(this.commonService.isLoggedIn() && this.userDetails && role === 'user'){
      this.commonService.setFlow('students-home');
      this.router.navigate(['/search-results']);
    }
    else{
      this.router.navigate(['']);
    }
  }
}
