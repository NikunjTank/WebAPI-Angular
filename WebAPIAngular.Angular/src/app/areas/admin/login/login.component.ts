import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountService } from '../../../service/common/account.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';

import { SpinnerService } from '../../../service/common/spinner.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginAdminComponent {

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private toastr: ToastrService, private router: Router, private _accountService: AccountService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    returnUrl: string;
    frmLogin: FormGroup;

    errorMessage: string;
    _global: Global = new Global();

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmLogin = this.fb.group({
            //UserName: ['', Validators.compose([Validators.required, Validators.email])],
            UserName: ['', Validators.required],
            Password: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    Login(formData: any): void {
        this._global.setToken('', '');
        
        this.isSubmited = true;
        this.errorMessage = "";

        if (this.frmLogin.valid) {
            this.spinnerService.show();

            let user = {
                UserName: formData.value.UserName,
                Password: formData.value.Password,
                LoginFrom: Global.LOGIN_FROM_WEB
            }

            this._accountService.loginWithUserName(user)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this._global.setToken(data.Response.Token, data.Response.RoleId);

                        //if (this.returnUrl == "/") {
                        if (data.Response.RoleId == Global.ADMIN_ROLEID)
                            this.router.navigate(['/admin/secure/dashboard']);
                        else {
                            data.Description = "Invalid credentials"
                            this.toastr.error(data.Description, Global.TOASTR_LOGIN_TITLE, { closeButton: true });
                            this.errorMessage = data.Description;
                        }
                        //}
                        //else
                        //    this.router.navigateByUrl(this.returnUrl);

                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_LOGIN_TITLE, { closeButton: true });
                        this.errorMessage = data.Description;
                        return;
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_LOGIN_TITLE, { enableHtml: true, closeButton: true });
                        this.errorMessage = Global.ERROR_MESSAGE;
                        return;
                    });
        }
    }
}
