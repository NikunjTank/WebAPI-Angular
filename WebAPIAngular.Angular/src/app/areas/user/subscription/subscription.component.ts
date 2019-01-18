import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { DropDown } from '../../../common/dropDown';
import { GetPackageRequest, Package } from '../../../model/package';


import { GetSubscriptionRequest } from '../../../model/subscription';
import { SubscriptionUserService } from '../../../service/user/subscription.service';
import { PackageUserService } from '../../../service/user/package.service';

@Component({
    selector: 'my-app',
    templateUrl: './subscription.component.html'
})

export class SubscriptionUserComponent implements OnInit {

    packages: DropDown[] = [];

    frmSubscription: FormGroup;

    isSubmited: boolean = false;
    moduleTab: string = 'features';
    msg: string;
    isSubscriptionRequested: boolean = false;
    isSubscribedUser: boolean = false;

    _global: Global = new Global();

    ngOnInit(): void {
        this.frmSubscription = this.formBuilder.group({
            PackageId: ['', Validators.required]
        });

        this.CheckIsSubscribed();
    }

    constructor(private formBuilder: FormBuilder,
        private spinnerService: SpinnerService,
        private toastr: ToastrService,
        private router: Router,
        private _subscriptionService: SubscriptionUserService,
        private _packageService: PackageUserService) { }

    CheckIsSubscribed() {
        this.isSubscribedUser = false;
        this.isSubscriptionRequested = false;

        let getSubscriptionRequest = new GetSubscriptionRequest();
        getSubscriptionRequest.UserId = parseInt(this._global.getCookie(Global.USER_ID));

        this._subscriptionService.getSubscription(getSubscriptionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Response.length > 0 && data.Response[0].IsExpired == false && data.Response[0].IsActive == true) {
                    if (data.Response[0].StartDate)
                        this.isSubscribedUser = true;
                    else
                        this.isSubscriptionRequested = true;
                } else {
                    this.GetPackage();
                }
            }, error => this.msg = <any>error);
    }

    GetPackage() {
        this.spinnerService.show();

        let getPackageRequest = new GetPackageRequest();

        this._packageService.getPackage(getPackageRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.packages = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.packages.push({ Value: item.PackageId, Text: item.PackageName });
                    });

                    this.frmSubscription.get("PackageId").setValue(this.packages[0].Value);
                    this.frmSubscription.get("PackageId").updateValueAndValidity();
                }
                else {
                    this.toastr.error(data.Description, Global.TOASTR_SUBSCRIPTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_SUBSCRIPTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SaveSubscription(formData) {
        this.spinnerService.show();

        this._subscriptionService.addSubscription(formData.value)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.isSubmited = false;
                    this.frmSubscription.reset();
                    this.CheckIsSubscribed();

                    this.toastr.success(data.Description, Global.TOASTR_SUBSCRIPTION_TITLE, { closeButton: true });
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_SUBSCRIPTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_SUBSCRIPTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnSubmitSupportTicket(formData: any) {
        this.isSubmited = true;

        if (this.frmSubscription.valid) {
            this.SaveSubscription(formData);
        }
    }

    OnClickModuleTab(moduleTab) {
        this.moduleTab = moduleTab;
    }
}