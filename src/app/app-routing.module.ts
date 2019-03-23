import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './components/home/home-page/home-page.component';
import { SearchResultsComponent } from './components/home/search-results/search-results.component';
import { BookDetailsComponent } from './components/home/book-details/book-details.component';
import { ReadBookComponent } from './components/home/read-book/read-book.component';
import { UploadBookComponent } from './components/home/upload-book/upload-book.component';
import { LandingPageComponent } from './components/home/landing-page/landing-page.component';
import { ManageInstitutionsComponent } from './components/home/manage-institutions/manage-institutions.component';
import { RegisterComponent } from './components/home/register/register.component';
import { LoginComponent } from './components/home/login/login.component';
import { AuthService } from './shared/services/auth.service';

const appRoutes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'search-results', component: SearchResultsComponent },
    { path: 'book-details', component: BookDetailsComponent },
    { path: 'read-book', component: ReadBookComponent,canActivate: [AuthService] },
    { path: 'upload-book', component: UploadBookComponent,canActivate: [AuthService] },
    { path: 'landing-page', component: LandingPageComponent,canActivate: [AuthService] },
    { path: 'manage-institutions', component: ManageInstitutionsComponent,canActivate: [AuthService]},
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
