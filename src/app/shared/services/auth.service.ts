import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

    constructor(private router: Router,private commonService: CommonService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.commonService.isLoggedIn()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}