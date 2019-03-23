import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  optionsList1:any;
  optionsList2:any;
  flow:String;
  register = {
    'user_id': '',
    'password': '',
    'confirmpwd':'',
    'email_id': '',
    'role': '',
    'user_fname': '',
    'user_lname': '',
    'recovery_question1': '',
    'recovery_answer1': '',
    'recovery_question2': '',
    'recovery_answer2': '',
    'invite_id': '',
    'institution_id': '',
    'institution_name': '',
    'mobile': '',
    'creation_date': '',
    'last_update_date': '',
    'status': 'active',
    'is_locked': 'CLEAN'
  };
  constructor(private commonService: CommonService, private router: Router, private restService: RestService,
    private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.flow = this.commonService.getFlow();
    this.optionsList1 = ['FAVORITE ANIMAL','FAVORITE CAR','FAVORITE SPORT'];
    this.optionsList2 = ['NATIVE PLACE','CITY WHERE YOU MET YOUR SPOUSE','WHERE WOULD YOU LIKE TO GO FOR VACATION'];
  }
  displaySuccessMessage(flow){
    this.spinner.show();
    let req = {};
    if(this.register.user_fname && this.register.user_lname && this.register.email_id && this.register.password && this.register.confirmpwd && 
      this.register.mobile && this.register.recovery_question1 && this.register.recovery_answer1 && this.register.recovery_question2 && 
      this.register.recovery_answer2){
      if(this.register.password && this.register.confirmpwd && this.register.password === this.register.confirmpwd){
        let contactSize = this.register.mobile;
        if(contactSize && contactSize.toString().length === 10){
          let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(this.register.email_id && emailRegex.test(this.register.email_id) && this.register.email_id.endsWith('.edu')){
            if(flow === 'register-user'){
              this.register.role = 'gn';
            }
            else if(flow === 'register-librarian'){
              this.register.role = 'lib';
            }
            delete this.register.confirmpwd;
            req = this.register;
            this.restService.postData(WS.registerUser.endpoint,req,false,(data) => {
              if(data && !data.error){
                this.spinner.hide();
                this.toaster.openSnackBar('User registered successfully','Close');
                let setupreq = {
                  'mailid':data.email_id,
                  'userid':data.user_id,
                  'password':data.password,
                  'role':data.role
                };
                this.restService.postData(WS.emailSetup.endpoint,setupreq,false,(dataVal) => {
                  if(dataVal && !dataVal.error){
                    this.spinner.hide();
                  }
                  else if(dataVal && dataVal.status === 500){
                    this.spinner.hide();
                  }
                  else{
                    this.spinner.hide();
                  }
                });
                if(flow === 'register-user'){
                  this.router.navigate(['/login']);
                }
              }
              else if(data && data.status === 500){
                this.spinner.hide();
                this.toaster.openSnackBar(WS.registerUser.errorMessage,'Close');
              }
              else{
                this.spinner.hide();
              }
            });
          }
          else{
            this.spinner.hide();
          this.toaster.openSnackBar('Email Id is not valid','Close');
          }
        }
        else{
          this.spinner.hide();
          this.toaster.openSnackBar('Contact number should have 10 digits','Close');
        }
      }
      else{
        this.spinner.hide();
        this.toaster.openSnackBar('Password and Confirm password fields do not match','Close');
      }
    }
    else{
      this.spinner.hide();
      this.toaster.openSnackBar('All fields are mandatory','Close');
    }
  }
}
