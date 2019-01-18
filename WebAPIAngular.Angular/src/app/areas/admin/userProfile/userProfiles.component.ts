import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfile, GetUserProfileRequest } from '../../../model/userProfile';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { UserProfileAdminService } from '../../../service/admin/userProfile.service';
import { SubscriptionAdminService } from '../../../service/admin/subscription.service';

@Component({
    selector: 'my-app',
    templateUrl: './userProfiles.component.html'
})

export class UserProfilesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private _userProfileService: UserProfileAdminService,
        private _subscriptionService: SubscriptionAdminService,
        private toastr: ToastrService,
        private vcr: ViewContainerRef,
        private spinnerService: SpinnerService,
        private router: Router) { }

    _global: Global = new Global();

    userProfiles: UserProfile[];

    frmUserProfile: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    sortingUserProfileField: string;
    sortingUserProfileDirection: string;
    colourCode: any = { "Active": "#32CD32", "Expired": "#FF0000", "No Subscription": "#666600", "Pending": "#0000FF" }

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;

            this.sortingUserProfileField = params["sortingUserProfileField"];
            this.sortingUserProfileDirection = params["sortingUserProfileDirection"];
        });


        this.frmUserProfile = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetUserProfile(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetUserProfile(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getUserProfileRequest = new GetUserProfileRequest();
        getUserProfileRequest.SearchText = searchText;
        getUserProfileRequest.IsActive = null;
        getUserProfileRequest.OrderBy = this.sortingUserProfileField;
        getUserProfileRequest.OrderByDirection = this.sortingUserProfileDirection;
        getUserProfileRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getUserProfileRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._userProfileService.getUserProfile(getUserProfileRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.userProfiles = data.Response;

                    this.pageSize = getUserProfileRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_USER_PROFILE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchUserProfile(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetUserProfile(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetUserProfile(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetUserProfile(this.searchText, null, this.pageSize);
    }

    ViewUserProfile(userId) {
        this.router.navigate(['/admin/secure/userprofile/' + this._global.encryptValue(userId)], {
            queryParams: {
                sortingUserProfileField: this.sortingUserProfileField, sortingUserProfileDirection: this.sortingUserProfileDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    OnUserProfileSort(fieldName) {
        this.sortingUserProfileDirection = (this.sortingUserProfileField == fieldName) ? (this.sortingUserProfileDirection == "A") ? "D" : "A" : "A";
        this.sortingUserProfileField = fieldName;

        this.GetUserProfile(this.searchText, this.currentPage, this.pageSize);
    }

    UnsubscribeUser(data) {
        let confirmBox = confirm("Are you sure, You want to deactive user?");
        if (confirmBox) {
            this.spinnerService.show();

            let updateSubscription = {
                UserId: data.UserId,
                SubscriptionId: data.SubscriptionId,
                IsExpired: true,
                IsActive: false
            }

            this._subscriptionService.updateSubscription(updateSubscription)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_SUBSCRIPTION_TITLE, { closeButton: true });
                        this.GetUserProfile(this.searchText, this.currentPage, this.pageSize);
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_SUBSCRIPTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_SUBSCRIPTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }
}
