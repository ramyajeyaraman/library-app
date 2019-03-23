import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  search = {
    'authorKeyword':'',
    'titleKeyword':'',
    'contentKeyword':'',
    'genreKeyword':''
  };
  genreCount = [];
  featuredBooks = [];

  constructor(private commonService: CommonService, private router: Router,private restService: RestService,
    private toaster: ToasterComponent, private spinner: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.getBooksCountByGenre();
    this.getFeaturedBooks();
  }
  register(){
    this.commonService.setFlow('register-user');
    this.router.navigate(['/register']);
  }
  displayBookDetails(data){
    this.commonService.setBookDetails(data);
    this.router.navigate(['/book-details']);
  }
  getFeaturedBooks(){
    this.spinner.show();
    this.restService.getData(WS.getFeaturedBooks.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.featuredBooks = data;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.featuredBooks = [];
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getFeaturedBooks.errorMessage,'Close');
      }
      else{
        this.featuredBooks = [];
        this.spinner.hide();
      }
    });
  }
  getBooksCountByGenre(){
    this.spinner.show();
    this.restService.getData(WS.getBookGenreCountAdmin.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.genreCount = data;
        if(this.genreCount.length>5){
          this.genreCount = this.genreCount.slice(0, 4);
        }
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.genreCount = [];
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getBookGenreCountAdmin.errorMessage,'Close');
      }
      else{
        this.genreCount = [];
        this.spinner.hide();
      }
    });
  }
  searchBook(){
    let isTitleSearch = (this.search.titleKeyword && this.search.titleKeyword  !== '' && this.search.titleKeyword  !== undefined);
    let isAuthorSearch = (this.search.authorKeyword && this.search.authorKeyword  !== '' && this.search.authorKeyword  !== undefined);
    let isGenreSearch = (this.search.genreKeyword && this.search.genreKeyword  !== '' && this.search.genreKeyword  !== undefined);
    let isContentSearch = (this.search.contentKeyword && this.search.contentKeyword  !== '' && this.search.contentKeyword  !== undefined);
    let url:any;
    let searchParams = [];
    let isTitleOnly = (isTitleSearch && !isAuthorSearch && !isGenreSearch && !isContentSearch);
    let isAuthorOnly = (isAuthorSearch && !isTitleSearch && !isGenreSearch && !isContentSearch);
    let isGenreOnly = (isGenreSearch && !isTitleSearch && !isAuthorSearch && !isContentSearch);
    let isContentOnly = (isContentSearch && !isTitleSearch && !isAuthorSearch && !isGenreSearch);
    if(isTitleOnly || isAuthorOnly || isGenreOnly || isContentOnly){
      this.spinner.show();
      if(isTitleSearch){
        url = WS.getBookByTitle;
        searchParams.push({'key':'title','value':this.search.titleKeyword});
      }
      else if(isAuthorSearch){
        url = WS.getBookByAuthor;
        searchParams.push({'key':'authorname','value':this.search.authorKeyword});
      }
      else if(isGenreSearch){
        url = WS.getBookByGenre;
        searchParams.push({'key':'genre','value':this.search.genreKeyword});
      }
      else if(isContentSearch){
        url = WS.getBookByContent;
        searchParams.push({'key':'keywords','value':this.search.contentKeyword});
      }
      searchParams.push({'key':'institution_id','value':''});
      this.restService.getData(url.endpoint,(data) => {
        if(data && data.length>0 && !data.error){
          if(isContentSearch){
            let reqVal = [];
            data.forEach((val)=>{
              reqVal.push(val.bookid);
            });
            this.restService.postData(WS.getBookContent.endpoint,reqVal,false,(dataVal) => {
              if(dataVal && dataVal.length>0 && !dataVal.error){
                this.commonService.setBooksList(dataVal);
                this.commonService.setFlow('search-book-unauthorised');
                this.router.navigate(['/search-results']);
                this.spinner.hide();
              }
              else if(dataVal && dataVal.status === 500){
                this.commonService.setBooksList([]);
                this.spinner.hide();
                this.toaster.openSnackBar(WS.getBookContent.errorMessage,'Close');
              }
              else{
                this.commonService.setBooksList([]);
                this.commonService.setFlow('search-book-unauthorised');
                this.router.navigate(['/search-results']);
                this.spinner.hide();
              }
            }); 
          }
          else{
            this.commonService.setBooksList(data);
            this.commonService.setFlow('search-book-unauthorised');
            this.router.navigate(['/search-results']);
            this.spinner.hide();
          }
        }
        else if(data && data.status === 500){
          this.commonService.setBooksList([]);
          this.spinner.hide();
          this.toaster.openSnackBar(url.errorMessage,'Close');
        }
        else{
          this.commonService.setBooksList([]);
          this.commonService.setFlow('search-book-unauthorised');
          this.router.navigate(['/search-results']);
          this.spinner.hide();
        }
      },searchParams);
    }
    else{
      this.toaster.openSnackBar('Please enter valid search keyword in either one of the fields','Close');
    }
  }
  isLoggedInUser(){
    return this.commonService.isLoggedIn();
  }
}
