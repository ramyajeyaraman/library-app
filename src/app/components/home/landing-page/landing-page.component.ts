import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import {PieChartComponent } from '../../../shared/components/pie-chart/pie-chart.component';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  role:String;
  userDetails:any;
  institutionBooksCount:any;
  institutionStudentsCount:any;
  adminBooksCount:any;
  adminStudentsCount:any;
  adminInstitutionsCount:any;
  librarianChartData:any;
  librarianChartLabels:any;
  adminChartData:any;
  adminChartLabels:any;
  pieChartType:string = 'pie';
  pieChartOptions:any = {'backgroundColor': ["#FF6384","#4BC0C0","#FFCE56","#E7E9ED","#36A2EB"],'responsive':true,'maintainAspectRatio': false};
  isAdminChartDataAvailable:boolean;
  isLibrarianChartDataAvailable:boolean;
  librarianBarChartData:any;
  adminBarChartData:any;
  barChartType:string = 'bar';
  barChartOptions:any = {
    'responsive':true,
    'maintainAspectRatio': false
  };
  barChartOptions1:any = {
    'responsive':true,
    'maintainAspectRatio': false, 
    scales: {
    xAxes: [{ stacked: true }],
    yAxes: [{ stacked: true }]
  }};
  barChartSeries = ['My Institutions Transactions','Other Institutions Transactions'];
  barChartLabels =  ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  isAdminBarChartDataAvailable:boolean;
  isLibrarianBarChartDataAvailable:boolean;
  constructor(private restService: RestService, private commonService: CommonService, private router: Router,
    private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.role = this.commonService.getRole();
    if(this.role === 'librarian'){
      this.getLibrarianCount();
    }
    else if(this.role === 'admin'){
      this.getAdminCount();
    }
  }
  getLibrarianCount(){
    this.spinner.show();
    this.userDetails = this.commonService.getUserDetails();
    let serviceParams = [];
    serviceParams.push({'key':'institution_id','value':this.userDetails.user_info.institution_id});
    this.restService.getData(WS.getInstitutionStudentsCount.endpoint,(data) => {
      if(data && !data.error){
        this.institutionStudentsCount = data.value;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.institutionStudentsCount = '0';
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getInstitutionStudentsCount.errorMessage,'Close');
      }
      else{
        this.institutionStudentsCount = '0';
        this.spinner.hide();
      }
    },serviceParams);
    this.loadLibrarianChartData();
    this.loadLibrarianBarChartData();
  }
  getAdminCount(){
    this.spinner.show();
    this.restService.getData(WS.getTotalStudentsCount.endpoint,(data) => {
      if(data && !data.error){
        this.adminStudentsCount = data.value;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.adminStudentsCount = '0';
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getTotalStudentsCount.errorMessage,'Close');
      }
      else{
        this.adminStudentsCount = '0';
        this.spinner.hide();
      }
    });
    this.spinner.show();
    this.restService.getData(WS.getTotalInstitutionsCount.endpoint,(data) => {
      if(data && !data.error){
        this.adminInstitutionsCount = data.value;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.adminInstitutionsCount = '0';
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getTotalInstitutionsCount.errorMessage,'Close');
      }
      else{
        this.adminInstitutionsCount = '0';
        this.spinner.hide();
      }
    });
    this.loadAdminChartData();
    this.loadAdminBarChartData();
  }
  loadBooks(role){
    if(role === 'admin'){
      this.commonService.setFlow('admin-manage-books');
      this.router.navigate(['/search-results']);
    }
    else if(role === 'librarian'){
      this.commonService.setFlow('librarian-manage-books');
      this.router.navigate(['/search-results']);
    }
  }
  loadInstitutions(role){
    if(role === 'admin'){
      this.commonService.setFlow('admin-manage-institutions');
      this.router.navigate(['/manage-institutions']);
    }
  }
   // events on slice click
   public adminChartClicked(e:any):void {
    console.log(e);
  }
 
  // event on pie chart slice hover
  public adminChartHovered(e:any):void {
    console.log(e);
  }
   // events on slice click
   public adminBarChartClicked(e:any):void {
    console.log(e);
  }
 
  // event on pie chart slice hover
  public adminBarChartHovered(e:any):void {
    console.log(e);
  }
  loadAdminChartData(){
    this.spinner.show();
    this.isAdminChartDataAvailable = false;
    let admincount = 0;
    this.restService.getData(WS.getBookGenreCountAdmin.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.adminChartLabels = [];
        this.adminChartData = [];
        data.forEach((val) => {
          this.adminChartLabels.push(val.key);
          this.adminChartData.push(parseInt(val.value));
          admincount = admincount + parseInt(val.value);
          this.isAdminChartDataAvailable = true;
        });
        this.adminBooksCount = admincount;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.adminChartData = [];
        this.adminChartLabels = [];
        this.adminBooksCount = 0;
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getBookGenreCountAdmin.errorMessage,'Close');
      }
      else{
        this.adminChartData = [];
        this.adminChartLabels = [];
        this.adminBooksCount = 0;
        this.spinner.hide();
      }
    });
  }
  loadAdminBarChartData(){
    this.spinner.show();
    this.userDetails = this.commonService.getUserDetails();
    this.isAdminBarChartDataAvailable = false;
    let serviceParams = [];
    serviceParams.push({'key':'institutionid','value':this.userDetails.user_info.institution_id});
    this.restService.getData(WS.getWeeksData.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.barChartLabels = [];
        this.adminBarChartData = [];
        this.adminBarChartData = [
          {
            label: 'Total Transactions per week',
            data: [],
            backgroundColor: ["#FF6384","#4BC0C0","#FFCE56","#E7E9ED"]
          }
        ];
        data.forEach((value)=>{
          this.barChartLabels.push(value.key);
          this.adminBarChartData[0].data.push(value.value);
          this.isAdminBarChartDataAvailable = true;
        });
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.adminBarChartData = [];
        this.barChartLabels = [];
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getWeeksData.errorMessage,'Close');
      }
      else{
        this.adminBarChartData = [];
        this.barChartLabels = [];
        this.spinner.hide();
      }
    },serviceParams);
  }
  // events on slice click
  public librarianChartClicked(e:any):void {
    console.log(e);
  }
 
  // event on pie chart slice hover
  public librarianChartHovered(e:any):void {
    console.log(e);
  }
  loadLibrarianChartData(){
    this.spinner.show();
    this.userDetails = this.commonService.getUserDetails();
    this.isLibrarianChartDataAvailable = false;
    let librariancount = 0;
    let serviceParams = [];
    serviceParams.push({'key':'institutionId','value':this.userDetails.user_info.institution_id});
    this.restService.getData(WS.getInstitutionBooksCount.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.librarianChartLabels = [];
        this.librarianChartData = [];
        data.forEach((val) => {
          this.librarianChartLabels.push(val.key);
          this.librarianChartData.push(parseInt(val.value));
          librariancount = librariancount + parseInt(val.value);
          this.isLibrarianChartDataAvailable = true;
        });
        this.institutionBooksCount = librariancount;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.librarianChartData = [];
        this.librarianChartLabels = [];
        this.institutionBooksCount = 0;
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getInstitutionBooksCount.errorMessage,'Close');
      }
      else{
        this.librarianChartData = [];
        this.librarianChartLabels = [];
        this.institutionBooksCount = 0;
        this.spinner.hide();
      }
    },serviceParams);
  }
  // events on slice click
  public librarianBarChartClicked(e:any):void {
    console.log(e);
  }
 
  // event on pie chart slice hover
  public librarianBarChartHovered(e:any):void {
    console.log(e);
  }
  loadLibrarianBarChartData(){
    this.spinner.show();
    this.userDetails = this.commonService.getUserDetails();
    this.isLibrarianBarChartDataAvailable = false;
    let serviceParams = [];
    serviceParams.push({'key':'institutionid','value':this.userDetails.user_info.institution_id});
    this.restService.getData(WS.getWeeksData.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.barChartLabels = [];
        this.librarianBarChartData = [
          {
            label: 'My Institution Transactions',
            data: [],
            backgroundColor: ["#FF6384","#4BC0C0","#FFCE56","#E7E9ED"]
          },
          {
            label: 'Other Institutions Transactions',
            data: [],
            backgroundColor: ["#FF6384","#4BC0C0","#FFCE56","#E7E9ED"]
          }
        ];
        data.forEach((value)=>{
          this.barChartLabels.push(value.key);
          let valueArr = value.value.split(',');
          this.isLibrarianBarChartDataAvailable = true;          
          this.librarianBarChartData[0].data.push(parseInt(valueArr[0]));
          this.librarianBarChartData[1].data.push(parseInt(valueArr[1]));
        });
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.librarianBarChartData = [];
        this.barChartLabels = [];
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getWeeksData.errorMessage,'Close');
      }
      else{
        this.librarianBarChartData = [];
        this.barChartLabels = [];
        this.spinner.hide();
      }
    },serviceParams);
  }
}
