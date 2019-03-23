import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { RestService } from '../../../shared/services/rest.service';
import { CommonService } from '../../../shared/services/common.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent } from '../../../shared/components/toaster/toaster.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-common-action-dialog',
  templateUrl: './common-action-dialog.component.html',
  styleUrls: ['./common-action-dialog.component.scss']
})
export class CommonActionDialogComponent implements OnInit {
  userData:any;
  optionsList1:any;
  optionsList2:any;
  constructor(private dialogRef: MatDialogRef<CommonActionDialogComponent>,private restService: RestService,
  private toaster: ToasterComponent,private commonService: CommonService,private spinner: Ng4LoadingSpinnerService) { 
  }

  ngOnInit() {
    this.optionsList1 = ['FAVORITE ANIMAL','FAVORITE CAR','FAVORITE SPORT'];
    this.optionsList2 = ['NATIVE PLACE','CITY WHERE YOU MET YOUR SPOUSE','WHERE WOULD YOU LIKE TO GO FOR VACATION'];
    this.userData = this.commonService.getDialogData();
  }
  save() {
    this.spinner.show();
    if(this.userData.flow === 'edit-profile'){
      if(this.userData.email_id && this.userData.password && this.userData.recovery_question1 && 
        this.userData.recovery_question2 && this.userData.recovery_answer1 && this.userData.recovery_answer2){
          let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(this.userData.email_id && emailRegex.test(this.userData.email_id) && this.userData.email_id.endsWith('.edu')){
          let req = {};
          delete this.userData.flow;
          req = this.userData;
          this.restService.postData(WS.modifyUser.endpoint,req,false,(data) => {
            if(data && !data.error){
              this.commonService.setUserEditedDetails(data);
              this.spinner.hide();
              this.toaster.openSnackBar('User Details updated successfully','Close');
            }
            else if(data && data.status === 500){
              this.spinner.hide();
              this.toaster.openSnackBar(WS.modifyUser.errorMessage,'Close');
            }
            else{
              this.spinner.hide();
            }
          });
          this.dialogRef.close('edit success');
        }
        else{
          this.spinner.hide();
          this.toaster.openSnackBar('Email Id is not valid','Close');
        }
      }
      else{
        this.spinner.hide();
        this.toaster.openSnackBar('Fields cannot be empty','Close');
      }
    }
    else if(this.userData.flow === 'logout-profile'){
      this.spinner.hide();
      this.dialogRef.close('logout success');
    }
  }

  cancel() {
      this.dialogRef.close();
  }

}
