import { Component, OnInit, ViewChild} from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { SimplePdfViewerComponent } from 'simple-pdf-viewer';
import { SimpleProgressData, SimplePDFBookmark } from 'simple-pdf-viewer';
import { ViewerComponent } from '../viewer/viewer.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
const OUTLINE_MENU = 2;


@Component({
  selector: 'app-read-book',
  templateUrl: './read-book.component.html',
  styleUrls: ['./read-book.component.scss']
})
export class ReadBookComponent implements OnInit {
  book:any;
  src:any;
  constructor(private commonService: CommonService,private spinner: Ng4LoadingSpinnerService) { 
    this.book = this.commonService.getBookDetails();
    this.src = 'http://' + this.book.repo_path;
  }

  ngOnInit() {
    this.book = this.commonService.getBookDetails();
    this.src = 'https://' + this.book.repo_path;
  }
  menu = 1;
  backButtonVisible = false;
  errorMsg = '';
  bookmarks: SimplePDFBookmark[] = [];
  snapshots: string[] = [];
  displayedImage: string = '';

  urlBox: any;
  firstPageBox: any;
  firstZoomBox: any;
  pageBox: any;
  zoomBox: any;
  searchBox: any;

  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;
  @ViewChild(ViewerComponent) private imgViewer: ViewerComponent;

  isActiveMenu(menu: number): boolean {
    return this.menu === menu && (this.pdfViewer.isDocumentLoaded() || menu === 1);
  }

  setActiveMenu(menu: number) {
    this.menu = menu;
    if(menu == OUTLINE_MENU) {
      this.backButtonVisible = true;
    } else {
      this.backButtonVisible =false;
    }
  }

  openDocument(documents: File[]) {
    this.errorMsg = '';
    if (documents && documents.length > 0) {
      this.pdfViewer.openFile(documents[0]);
    }
  }

  openUrl(url: string) {
    this.errorMsg = '';
    if (url && url.length > 0) {
      this.pdfViewer.openUrl(url);
    }
  }

  onError(event: any) {
    this.errorMsg = 'Failed to load the document';
  }

  onProgress(progress: SimpleProgressData) {
    this.spinner.show();
  }

  onLoadComplete(event: any)  {
    console.log('Document is loaded');
    this.spinner.hide();
    // see the whole document
    this.pdfViewer.zoomFullPage();
  }
  isDocumentLoaded(event: any){
    console.log('Document is loaded');
    this.spinner.hide();
    // see the whole document
    this.pdfViewer.zoomFullPage();
  }

  createBookmark() {
    this.pdfViewer.createBookmark().then(bookmark => {
      if(bookmark) {
        this.bookmarks.push(bookmark);
      }
    })
  }

  getPageSnapshot() {
    this.pdfViewer.getPageSnapshot().then(snapshot => {
      if(snapshot) {
        this.snapshots.push(URL.createObjectURL(snapshot));
      }
    })
  }

  openImage(url: string) {
    this.displayedImage = url;
    this.imgViewer.show();
    //window.open(url);
  }

}
