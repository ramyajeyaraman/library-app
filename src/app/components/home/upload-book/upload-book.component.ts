import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-upload-book',
  templateUrl: './upload-book.component.html',
  styleUrls: ['./upload-book.component.scss']
})
export class UploadBookComponent implements OnInit {
  flow:String;
  userDetails:any;
  register = {
    'created_by': '',
    'created_date': '',
    'institution_address': '',
    'institution_contact': '',
    'institution_email_domain': '',
    'institution_email_id': '',
    'institution_id': '',
    'institution_invite_id': '',
    'institution_name': '',
    'server_repo_path': '',
    'status': 'active'
  };
  newBook = {
    'author': '',
    'book_cover_path': '',
    'book_genre':'',
    'book_id': '',
    'book_isbn': '',
    'book_name': '',
    'created_date': '',
    'edition': '',
    'institution_id': '',
    'institution_name': '',
    'repo_path': '',
    'status': '',
    'user_id': ''
  };
  file: File ;
  formData:FormData = new FormData();
  constructor(private commonService: CommonService, private router: Router,private restService: RestService,
    private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.flow = this.commonService.getFlow();
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    this.file = fileList[0];
}
  displayHomePage(flow){
    this.spinner.show();
    if(flow === 'register-institution'){
      if(this.register.institution_name && this.register.institution_address && this.register.institution_email_id && 
        this.register.institution_contact){
        let contactSize = this.register.institution_contact;
        if(contactSize && contactSize.toString().length === 10){
          let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(this.register.institution_email_id && emailRegex.test(this.register.institution_email_id) && this.register.institution_email_id.endsWith('.edu')){
            let req = {};
            this.userDetails = this.commonService.getUserDetails();
            this.register.created_by = this.userDetails.user_info.user_id;
            req = this.register;
            this.restService.postData(WS.registerInstitution.endpoint,req,false,(data) => {
              if(data && !data.error){
                this.commonService.setFlow('admin-manage-institutions');
                let instReq = {
                  'server_repo_path':data.server_repo_path
                };
                this.restService.postData(WS.institutionSetup.endpoint,instReq,false,(data) => {
                    this.spinner.hide();
                });
                this.spinner.hide();
                this.router.navigate(['/manage-institutions']);
              }
              else if(data && data.status === 500){
                this.spinner.hide();
                this.toaster.openSnackBar(WS.registerInstitution.errorMessage,'Close');
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
        this.toaster.openSnackBar('Fields cannot be empty','Close');
      }
    }
    else if(flow === 'admin-manage-books' || flow === 'librarian-manage-books'){
      this.userDetails = this.commonService.getUserDetails();
      this.newBook.institution_id = this.userDetails.user_info.institution_id;
      this.newBook.user_id = this.userDetails.user_info.user_id;
      if(this.newBook.book_name && this.newBook.book_isbn && this.newBook.author && this.newBook.book_genre && 
        this.newBook.edition && this.file && this.file.name){
        let newReq = {};
        newReq = this.newBook;
        this.restService.postData(WS.uploadBookInitial.endpoint,newReq,false,(data) => {
          if(data && !data.error){
            const uploadData = new FormData();
            uploadData.append('file', this.file, this.file.name);
            let uploadReq = {
              'key':data.value,
              'value':data.key
            };
            this.restService.postDataFile(WS.uploadFile.endpoint,uploadData,uploadReq,(dataVal) => {
              if(dataVal && !dataVal.error){
                this.spinner.hide();
                this.toaster.openSnackBar('The uploaded book will be added to the repository soon. Please check after some time.','Close');
                this.router.navigate(['/search-results']); 
              }
              else if(dataVal && dataVal.status === 500){
                this.spinner.hide();
                this.toaster.openSnackBar(WS.uploadFile.errorMessage,'Close');
              }
              else{
                this.spinner.hide();
              }
            });
          }
          else if(data && data.status === 500){
            this.spinner.hide();
            this.toaster.openSnackBar(WS.uploadBookInitial.errorMessage,'Close');
          }
          else{
            this.spinner.hide();
          }
        });
      }
      else{
        this.spinner.hide();
        this.toaster.openSnackBar('Fields cannot be empty','Close');
      }
    }
  }
}
