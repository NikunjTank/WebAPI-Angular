import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Global } from '../common/global';


@Injectable()
export class AuthGuardAdmin implements CanActivate {

    constructor(private router: Router) { }

    _global: Global = new Global();

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {
        if (this._global.getToken() && Number(this._global.getRoleId()) == Global.ADMIN_ROLEID) {
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/admin/login'], { queryParams: { returnUrl: routerStateSnapshot.url } });
        return false;
    }
}

@Injectable()
export class AuthGuardUser implements CanActivate {

    constructor(private router: Router) { }

    _global: Global = new Global();

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {
        if (this._global.getUserToken() && Number(this._global.getRoleId()) == Global.USER_ROLEID) {
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/user/login'], { queryParams: { returnUrl: routerStateSnapshot.url } });
        return false;
    }
}