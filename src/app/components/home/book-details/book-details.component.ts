import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  bookDetails:any;
  imageFormat:String;
  imageIndex:String;
  videosList:any;
  userDetails:any;
  youtubePath = 'https://www.googleapis.com/youtube/v3/search';
  youtubeDisplayPath = 'https://www.youtube.com/embed/';
  youtubeKey = 'AIzaSyCdHnhhYCunYU9Fik1F0ySc_GX22Cf4Lck';
  constructor(private router: Router, private commonService: CommonService,private restService: RestService,
    private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.bookDetails = this.commonService.getBookDetails();
    this.imageFormat = '.png';
    this.retrieveVideos();
  }
  readBook(){
    this.spinner.show();
    this.userDetails = this.commonService.getUserDetails();
    let req = {
      'transaction_id':'',
      'book_id':this.bookDetails.book_id,
      'user_id':this.userDetails.user_info.user_id,
      'transaction_date':'',
      'institution_id':this.userDetails.user_info.institution_id
    };
    this.restService.postData(WS.saveReadBook.endpoint,req,false,(data) => {
      if(data && !data.error){
        this.router.navigate(['/read-book']);
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.spinner.hide();
        this.toaster.openSnackBar(WS.saveReadBook.errorMessage,'Close');
      }
      else{
        this.spinner.hide();
      }
    });
  }
  isLoggedInUser(){
    return this.commonService.isLoggedIn();
  }
  retrieveVideos(){
    const params: string = [
      'q=${this.bookDetails.book_name}',
      'key=${this.youtubeKey}',
      'part=snippet',
      'type=video',
      'maxResults=5'
    ].join('&');
    let url = this.youtubePath + '?' + 'q=' + this.bookDetails.book_name + '&' + 'key=' + this.youtubeKey + '&part=snippet&type=video&maxResults=5';
    this.restService.getDataVideos(url,(results)=>{
      if(results && !results.error){
        this.videosList = [];
        results.items.forEach((item)=>{
          this.videosList.push(this.youtubeDisplayPath + item.id.videoId);
        });
      }
      else{
        this.videosList = [];
      }
    });
  }
}
