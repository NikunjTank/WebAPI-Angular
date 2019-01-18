import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notification, NotificationType, GetNotificationRequest, GetNotificationTypeRequest } from '../../../model/notification';
import { NotificationAdminService } from '../../../service/admin/notification.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './notifications.component.html'
})

export class NotificationsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _notificationService: NotificationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    notifications: Notification[];

    frmNotification: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    sortingField: string;
    sortingDirection: string;

    notificationPDFServerPath: string = Global.NOTIFICATION_PDF_FILEPATH;
    gSRPDFServerPath: string = Global.GSR_PDF_FILEPATH;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmNotification = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetNotification(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    SearchNotification(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetNotification(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetNotification(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetNotification(this.searchText, null, this.pageSize);
    }

    EditNotification(notificationId) {
        this.router.navigate(['/admin/secure/notification/' + this._global.encryptValue(notificationId)]);
    }

    DeleteNotification(notificationId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteNotification = {
                "NotificationId": notificationId
            };

            this._notificationService.deleteNotification(deleteNotification)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                        this.GetNotification();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    GetNotification(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();
        getNotificationRequest.SearchText = searchText;
        getNotificationRequest.IsActive = null;
        getNotificationRequest.OrderBy = this.sortingField;
        getNotificationRequest.OrderByDirection = this.sortingDirection;
        getNotificationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getNotificationRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.notifications = data.Response;

                    this.pageSize = getNotificationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnSort(fieldName) {
        this.sortingDirection = (this.sortingField == fieldName) ? (this.sortingDirection == "A") ? "D" : "A" : "A";
        this.sortingField = fieldName;
        this.GetNotification(this.searchText, this.currentPage, this.pageSize);
    }
}
