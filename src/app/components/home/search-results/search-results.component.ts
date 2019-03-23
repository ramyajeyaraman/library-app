import { Component, OnInit, Inject, NgModule} from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';
import {ToasterComponent} from "../../../shared/components/toaster/toaster.component";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  flow:String;
  books:any;
  imageFormat:String;
  imageIndex:String;
  search = {
    'authorKeyword':'',
    'titleKeyword':'',
    'contentKeyword':'',
    'genreKeyword':''
  };
  userDetails:any;
  constructor(private commonService: CommonService, private router: Router,public dialog: MatDialog,private restService: RestService,
    private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService) { 

  }

  ngOnInit() {
    this.flow = this.commonService.getFlow();
    if(this.flow === 'search-book-unauthorised'){
      this.books = this.commonService.getBooksList();
    }
    else if(this.flow === 'admin-manage-books' || this.flow === 'librarian-manage-books'){
      this.getAdminLibrarianBooksList(this.flow);
    }
    else if(this.flow === 'students-home'){
      this.getStudentBooksList(this.flow);
    }
    this.imageFormat = '.png';
  }
  getStudentBooksList(flow){
    this.spinner.show();
    let serviceParams = [];
    serviceParams.push({'key':'univid','value':''});
    this.restService.getData(WS.getBooksListAdmin.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.books = data;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getBooksListAdmin.errorMessage,'Close');
        this.books = [];
      }
      else{
        this.spinner.hide();
        this.books = [];
      }
    },serviceParams);
  }
  getAdminLibrarianBooksList(flow){
    this.spinner.show();
    let serviceParams = [];
    this.userDetails = this.commonService.getUserDetails();
    serviceParams.push({'key':'univid','value':this.userDetails.user_info.institution_id});
    this.restService.getData(WS.getBooksListAdmin.endpoint,(data) => {
      if(data && data.length>0 && !data.error){
        this.books = data;
        this.spinner.hide();
      }
      else if(data && data.status === 500){
        this.spinner.hide();
        this.toaster.openSnackBar(WS.getBooksListAdmin.errorMessage,'Close');
        this.books = [];
      }
      else{
        this.spinner.hide();
        this.books = [];
      }
    },serviceParams);
  }
  openBookDetails(data){
    this.commonService.setBookDetails(data);
    this.router.navigate(['/book-details']);
  }
  deleteBook(book){
    this.spinner.show();
    this.restService.postData(WS.removeBook.endpoint,{},false,(data) => {
      if(data && !data.error){
        this.spinner.hide();
        this.getAdminLibrarianBooksList(this.flow);
        this.toaster.openSnackBar('Book deleted successfully','Close');
      }
      else if(data && data.status === 500){
        this.spinner.hide();
        this.toaster.openSnackBar(WS.removeBook.errorMessage,'Close');
      }
      else{
        this.spinner.hide();
      }
    },book.book_id,'bookId');
  }
  addBook(){
    this.router.navigate(['/upload-book']);
  }
  openDialog(flow,book){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if(flow==='edit'){
      dialogConfig.width = '1000px';
      dialogConfig.height = '600px';
      dialogConfig.data = {'book':book,
                          'flow':flow};
    }
    else{
      dialogConfig.width = '800px';
      dialogConfig.height = '400px';
      dialogConfig.data = {'book':{},
                          'flow':this.flow};
    }
    const dialogRef = this.dialog.open(ActionDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log("Dialog output:", data);
      if(data === 'search success'){
        this.books = this.commonService.getBooksList();
      }
      this.imageFormat = '.png';
    }); 
  }
  searchBook(){
    let isTitleSearch = (this.search.titleKeyword && this.search.titleKeyword  !== '' && this.search.titleKeyword  !== undefined);
    let isAuthorSearch = (this.search.authorKeyword && this.search.authorKeyword  !== '' && this.search.authorKeyword  !== undefined);
    let isGenreSearch = (this.search.genreKeyword && this.search.genreKeyword  !== '' && this.search.genreKeyword  !== undefined);
    let isContentSearch = (this.search.contentKeyword && this.search.contentKeyword  !== '' && this.search.contentKeyword  !== undefined);
    let url:any;
    let serviceParams = [];
    let isTitleOnly = (isTitleSearch && !isAuthorSearch && !isGenreSearch && !isContentSearch);
    let isAuthorOnly = (isAuthorSearch && !isTitleSearch && !isGenreSearch && !isContentSearch);
    let isGenreOnly = (isGenreSearch && !isTitleSearch && !isAuthorSearch && !isContentSearch);
    let isContentOnly = (isContentSearch && !isTitleSearch && !isAuthorSearch && !isGenreSearch);
    if(isTitleOnly || isAuthorOnly || isGenreOnly || isContentOnly){
      this.spinner.show();
      if(isTitleSearch){
        url = WS.getBookByTitle;
        serviceParams.push({'key':'title','value':this.search.titleKeyword});
      }
      else if(isAuthorSearch){
        url = WS.getBookByAuthor;
        serviceParams.push({'key':'authorname','value':this.search.authorKeyword});
      }
      else if(isGenreSearch){
        url = WS.getBookByGenre;
        serviceParams.push({'key':'genre','value':this.search.genreKeyword});
      }
      else if(isContentSearch){
        url = WS.getBookByContent;
        serviceParams.push({'key':'keywords','value':this.search.contentKeyword});
      }
      this.userDetails = this.commonService.getUserDetails();
      serviceParams.push({'key':'institution_id','value':''});
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
                this.books = this.commonService.getBooksList();
                this.imageFormat = '.png';
                this.spinner.hide();
              }
              else if(dataVal && dataVal.status === 500){
                this.commonService.setBooksList([]);
                this.spinner.hide();
                this.toaster.openSnackBar(WS.getBookContent.errorMessage,'Close');
              }
              else{
                this.commonService.setBooksList([]);
                this.books = this.commonService.getBooksList();
                this.imageFormat = '.png';
                this.spinner.hide();
              }
            }); 
          }
          else{
            this.commonService.setBooksList(data);
            this.books = this.commonService.getBooksList();
            this.imageFormat = '.png';
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
          this.books = this.commonService.getBooksList();
          this.imageFormat = '.png';
          this.spinner.hide();
        }
      },serviceParams);
    }
    else{
      this.toaster.openSnackBar('Please enter valid search keyword in either one of the fields','Close');
    }
  }
}


@Component({
  selector: 'action-dialog-component',
  templateUrl: './action-dialog-component.html',
  styleUrls: ['./action-dialog-component.scss']
})
export class ActionDialogComponent implements OnInit{
  bookData:any;
  flow:String;
  userDetails:any;
  searchVal = {
    'authorKeyword':'',
    'titleKeyword':'',
    'genreKeyword':''
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data,private dialogRef: MatDialogRef<ActionDialogComponent>,private restService: RestService, 
  private commonService: CommonService, private router: Router,private toaster: ToasterComponent,private spinner: Ng4LoadingSpinnerService) {
    this.bookData = data.book;
    this.flow = data.flow;
  }
  ngOnInit() {
    
  }
  save() {
    this.spinner.show();
    if(this.bookData.book_name && this.bookData.author && this.bookData.book_isbn && this.bookData.book_genre && this.bookData.edition){
      let req = this.bookData;
      this.restService.postData(WS.modifyBook.endpoint,req,false,(data) => {
        if(data && !data.error){
          this.spinner.hide();
          this.toaster.openSnackBar('Book details updated successfully','Close');
        }
        else if(data && data.status === 500){
          this.spinner.hide();
          this.toaster.openSnackBar(WS.modifyBook.errorMessage,'Close');
        }
        else{
          this.spinner.hide();
        }
      });
      this.dialogRef.close('Edit success');
    }
    else{
      this.spinner.hide();
      this.toaster.openSnackBar('Fields cannot be empty','Close');
    }
  }
  search() {
    let isTitleSearch = (this.searchVal.titleKeyword && this.searchVal.titleKeyword  !== '' && this.searchVal.titleKeyword  !== undefined);
    let isAuthorSearch = (this.searchVal.authorKeyword && this.searchVal.authorKeyword  !== '' && this.searchVal.authorKeyword  !== undefined);
    let isGenreSearch = (this.searchVal.genreKeyword && this.searchVal.genreKeyword  !== '' && this.searchVal.genreKeyword  !== undefined);
    let url:any;
    let serviceParams = [];
    let isTitleOnly = (isTitleSearch && !isAuthorSearch && !isGenreSearch);
    let isAuthorOnly = (isAuthorSearch && !isTitleSearch && !isGenreSearch);
    let isGenreOnly = (isGenreSearch && !isTitleSearch && !isAuthorSearch);
    if(isTitleOnly || isAuthorOnly || isGenreOnly){
      this.spinner.show();
      if(isTitleSearch){
        url = WS.getBookByTitle;
        serviceParams.push({'key':'title','value':this.searchVal.titleKeyword});
      }
      else if(isAuthorSearch){
        url = WS.getBookByAuthor;
        serviceParams.push({'key':'authorname','value':this.searchVal.authorKeyword});
      }
      else if(isGenreSearch){
        url = WS.getBookByGenre;
        serviceParams.push({'key':'genre','value':this.searchVal.genreKeyword});
      }
      this.userDetails = this.commonService.getUserDetails();
      serviceParams.push({'key':'institution_id','value':this.userDetails.user_info.institution_id});
      this.restService.getData(url.endpoint,(data) => {
        if(data && data.length>0 && !data.error){
          this.commonService.setBooksList(data);
          this.spinner.hide();
        }
        else if(data && data.status === 500){
          this.commonService.setBooksList([]);
          this.spinner.hide();
          this.toaster.openSnackBar(url.errorMessage,'Close');
        }
        else{
          this.commonService.setBooksList([]);
          this.spinner.hide();
        }
      },serviceParams);
      this.dialogRef.close('search success');
    }
    else{
      this.toaster.openSnackBar('Please enter valid search keyword in either one of the fields','Close');
    }
  }

  cancel() {
      this.dialogRef.close();
  }
}
