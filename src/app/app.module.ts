import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import {routing} from "./app-routing.module";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AppComponent } from './app.component';
import { MatButtonModule, MatExpansionModule, MatCardModule, MatMenuModule, MatToolbarModule,MatSnackBarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { RestService } from './shared/services/rest.service';
import { CommonService } from './shared/services/common.service';
import { SearchResultsComponent, ActionDialogComponent } from './components/home/search-results/search-results.component';
import { BookDetailsComponent } from './components/home/book-details/book-details.component';
import { ReadBookComponent } from './components/home/read-book/read-book.component';
import { UploadBookComponent } from './components/home/upload-book/upload-book.component';
import { LandingPageComponent } from './components/home/landing-page/landing-page.component';
import { ManageInstitutionsComponent } from './components/home/manage-institutions/manage-institutions.component';
import { RegisterComponent } from './components/home/register/register.component';
import { LoginComponent } from './components/home/login/login.component';
import { CommonActionDialogComponent } from './shared/components/common-action-dialog/common-action-dialog.component';
import { PieChartComponent } from './shared/components/pie-chart/pie-chart.component';
import { ViewerComponent } from './components/home/viewer/viewer.component';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { SafePipe } from './shared/pipes/safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SearchResultsComponent,
    BookDetailsComponent,
    ReadBookComponent,
    UploadBookComponent,
    LandingPageComponent,
    ActionDialogComponent,
    ManageInstitutionsComponent,
    RegisterComponent,
    LoginComponent,
    CommonActionDialogComponent,
    PieChartComponent,
    ViewerComponent,
    ToasterComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    SimplePdfViewerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatExpansionModule,
    MatInputModule,
    MatSnackBarModule,
    FlexLayoutModule,
    routing,
    RouterModule.forRoot([]),
    Ng4LoadingSpinnerModule.forRoot(),
    FormsModule 
  ],
  entryComponents: [ActionDialogComponent,CommonActionDialogComponent,ToasterComponent],
  providers: [RestService,CommonService,ToasterComponent,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
