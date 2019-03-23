import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import * as moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-manage-institutions',
  templateUrl: './manage-institutions.component.html',
  styleUrls: ['./manage-institutions.component.scss']
})
export class ManageInstitutionsComponent implements OnInit {
  flow:String;
  userDetails:any;
  institutionsList:any;
  constructor(private commonService: CommonService, private router: Router,private restService: RestService,
    private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.flow = this.commonService.getFlow();
    this.getInstitutionsList();
  }
  registerLibrarian(){
    this.commonService.setFlow('register-librarian');
    this.router.navigate(['/register']);
  }
  registerInstitution(){
    this.commonService.setFlow('register-institution');
    this.router.navigate(['/upload-book']);
  }
  getInstitutionsList(){
    this.spinner.show();
    let serviceParams = [];
    serviceParams.push({'key':'status','value':'active'});
    this.restService.getData(WS.getInstitutionsList.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.institutionsList = data;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.institutionsList = [];
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getInstitutionsList.errorMessage,'Close');
      }
      else{
        this.institutionsList = [];
        this.spinner.hide();
      }
    },serviceParams);
  }
  getCreatedDate(date){
    return moment(date).format('MM/DD/YYYY');
  }
  deactivate(institution){
    this.spinner.show();
    this.userDetails = this.commonService.getUserDetails();
    let req = {
      'userid':this.userDetails.user_info.user_id,
	    'institutionid':institution.institution_id,
      'status':'deactivate'
    };
    this.restService.postData(WS.deactivateInstitution.endpoint,req,false,(data) => {
      if(data && !data.error){
        this.spinner.hide();
        this.getInstitutionsList();
        this.toaster.openSnackBar('Institution deactivated successfully','Close');
      }
      else if(data && data.status === 500){
        this.spinner.hide();
        this.toaster.openSnackBar(WS.deactivateInstitution.errorMessage,'Close');
      }
      else{
        this.spinner.hide();
      }
    });
  }
}
