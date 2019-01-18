import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyDefinitionEvent, GetKeyDefinitionEventRequest } from '../../../model/keyDefinitionEvent';
import { KeyDefinitionEventAdminService } from '../../../service/admin/keyDefinitionEvent.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './keyEvents.component.html'
})

export class KeyEventsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _keyDefinitionEventService: KeyDefinitionEventAdminService, private vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    keyDefinitionEvents: KeyDefinitionEvent[];

    frmKeyDefinitionEvent: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    sortingField: string;
    sortingDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmKeyDefinitionEvent = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetKeyDefinitionEvent(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    SearchKeyDefinitionEvent(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetKeyDefinitionEvent(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetKeyDefinitionEvent(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.GetKeyDefinitionEvent(this.searchText, null, this.pageSize);
    }

    EditKeyDefinitionEvent(keyDefinitionEventId) {
        this.router.navigate(['/admin/secure/keyevent/' + this._global.encryptValue(keyDefinitionEventId)]);
    }

    DeleteKeyDefinitionEvent(keyDefinitionEventId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteKeyDefinitionEvent = {
                "KeyDefinitionEventId": keyDefinitionEventId
            };

            this._keyDefinitionEventService.deleteKeyDefinitionEvent(deleteKeyDefinitionEvent)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { closeButton: true });
                        this.GetKeyDefinitionEvent();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    GetKeyDefinitionEvent(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getKeyDefinitionEventRequest = new GetKeyDefinitionEventRequest();
        getKeyDefinitionEventRequest.DefinitionEventName = Global.KEY_EVENT_FIELDNAME;
        getKeyDefinitionEventRequest.SearchText = searchText;
        getKeyDefinitionEventRequest.IsActive = null;
        getKeyDefinitionEventRequest.OrderBy = this.sortingField;
        getKeyDefinitionEventRequest.OrderByDirection = this.sortingDirection;
        getKeyDefinitionEventRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getKeyDefinitionEventRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._keyDefinitionEventService.getKeyDefinitionEvent(getKeyDefinitionEventRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.keyDefinitionEvents = data.Response;

                    this.pageSize = getKeyDefinitionEventRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_EVENT_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnSort(fieldName) {
        this.sortingDirection = (this.sortingField == fieldName) ? (this.sortingDirection == "A") ? "D" : "A" : "A";
        this.sortingField = fieldName;
        this.GetKeyDefinitionEvent(this.searchText, this.currentPage, this.pageSize);
    }
}
