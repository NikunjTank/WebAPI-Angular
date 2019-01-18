import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router'
import { Global } from '../../../common/global';
import { ToastrService } from 'ngx-toastr';

import { SpinnerService } from '../../../service/common/spinner.service';
import { AccountService } from '../../../service/common/account.service'

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: [
        '../../../../assets/css/bootstrap.min.css',
        '../../../../assets/css/components.min.css',
        '../../../../assets/css/darkblue.min.css',
        '../../../../assets/css/font-awesome.min.css',
        '../../../../assets/css/layout.min.css',
        '../../../../assets/css/login.css',
        '../../../../assets/css/styles.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class AdminComponent implements OnInit {

    constructor(private _accountService: AccountService, private toastr: ToastrService, public router: Router, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    lblFullName: string;

    ngOnInit() {
        document.addEventListener('contextmenu', event => event.preventDefault());

        if (this.IsLoggedIn() && Number(this._global.getRoleId()) == Global.ADMIN_ROLEID) {
            return true;
        }
        else {
            this.router.navigate(['admin/login']);
            return false;
        }
    }

    IsLoggedIn() {
        if (this._global.getToken())
            return true;
        return false;
    }

    Logout(): void {
        this.spinnerService.show();

        this._accountService.logout()
            .subscribe(data => {
                if (data.Status == Global.API_SUCCESS) {
                    //this._global.setToken('', '');
                    this._global.deleteToken();
                    this.router.navigate(['/admin/login']);
                } else {
                    this.spinnerService.hide();
                    this.toastr.error(data.Description, Global.TOASTR_LOGOUT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_LOGOUT_TITLE, { enableHtml: true, closeButton: true });
            });
    }
}