import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginVal:any = {
    'username':'',
    'password':''
  }
  constructor(private commonService: CommonService, private router: Router,private restService: RestService,
    private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService,private cookieService: CookieService) { }

  ngOnInit() {
  }
  login(){
    let loggedInUser:any;
    let req:any;
    this.spinner.show();
    req = this.loginVal;
    if(req.username && req.password){
      this.restService.postData(WS.loginUser.endpoint,req,false,(data) => {
        if(data && !data.error && data.message === 'Accepted'){
          loggedInUser = data;
          this.commonService.setUserDetails(loggedInUser);
          this.cookieService.set('JSESSIONID', loggedInUser.uid);
          if(loggedInUser.user_info.role.toLowerCase() === 'adm'){
            this.router.navigate(['/landing-page']);
          }
          else if(loggedInUser.user_info.role.toLowerCase() === 'lib'){
            this.router.navigate(['/landing-page']);
          }
          else if(loggedInUser.user_info.role.toLowerCase() === 'gn'){
            this.commonService.setFlow('students-home');
            this.router.navigate(['/search-results']);
          }
          this.spinner.hide();
        }
        else if(data && data.message === 'Wrong password'){
          this.spinner.hide();
          this.toaster.openSnackBar('Invalid Password','Close');
        }
        else if(data && data.status === 500){
          this.spinner.hide();
          this.toaster.openSnackBar('User cannot be Validated','Close');
        }
        else{
          this.spinner.hide();
        }
      });
    }
    else{
      this.spinner.hide();
      this.toaster.openSnackBar('Username and password are mandatory','Close');
    }
  }

}
