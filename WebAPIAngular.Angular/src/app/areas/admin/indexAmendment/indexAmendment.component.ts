import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexAmendment, GetIndexAmendmentRequest } from '../../../model/indexAmendment';
import { Notification, GetNotificationRequest } from '../../../model/notification';
import { FemaIndex, GetFemaIndexRequest } from '../../../model/femaIndex';
import { FemaSubIndex, GetFemaSubIndexRequest } from '../../../model/femaSubIndex';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { IndexAmendmentAdminService } from '../../../service/admin/indexAmendment.service';
import { NotificationAdminService } from '../../../service/admin/notification.service';
import { FemaIndexAdminService } from '../../../service/admin/femaIndex.service';
import { FemaSubIndexAdminService } from '../../../service/admin/femaSubIndex.service';
import { RegulationAdminService } from '../../../service/admin/regulation.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './indexAmendment.component.html'
})

export class IndexAmendmentAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _indexAmendmentService: IndexAmendmentAdminService, private _notificationService: NotificationAdminService, private _femaIndexService: FemaIndexAdminService, private _femaSubIndexService: FemaSubIndexAdminService, private _regulationService: RegulationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    notifications: DropDown[] = [];
    femaIndexes: DropDown[] = [];
    femaSubIndexes: DropDown[] = [];
    notificationDropDownSettings = {};
    selectedNotifications: any = [];

    regulation: Regulation = new Regulation();

    regulationId: number = 0;
    indexAmendmentId: number = 0;

    frmIndexAmendment: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let regulationId = this._global.decryptValue(params['regulationId']);
            let indexAmendmentId = this._global.decryptValue(params['indexAmendmentId']);

            this.regulationId = parseInt(regulationId);

            if (regulationId) {
                this.GetRegulation(this.regulationId);

                if (indexAmendmentId) {
                    this.addUpdateText = "Update";

                    this.indexAmendmentId = parseInt(indexAmendmentId);
                    this.EditIndexAmendment(parseInt(indexAmendmentId));
                } else {
                    this.GetNotification(null);

                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/regulations'], {
                        queryParams: {
                            indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmIndexAmendment = this.formBuilder.group({
            IndexAmendmentId: [''],
            RegulationId: [this.regulationId],
            NotificationIds: ['', Validators.required],
            IndexId: ['', Validators.required],
            SubIndexId: [''],
            IndexAmendmentContent: ['', Validators.required]
        });
    }

    GetRegulation(regulationId: number) {
        this.spinnerService.show();

        let getRegulationRequest = new GetRegulationRequest();
        getRegulationRequest.RegulationId = regulationId;
        getRegulationRequest.IsActive = null;

        this._regulationService.getRegulation(getRegulationRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.regulation = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetNotification(indexAmendmentData): void {
        this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();
        getNotificationRequest.RegulationId = this.regulationId;

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                this.GetIndex(indexAmendmentData);

                this.notifications = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.notifications.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.notifications.push({ Value: item.NotificationId, Text: item.NotificationNumber });
                    });

                    //this.frmIndexAmendment.get("NotificationId").setValue((indexAmendmentData != null) ? indexAmendmentData.NotificationId : "");
                    //this.frmIndexAmendment.updateValueAndValidity();

                    this.notificationDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedNotifications = [];

                    if (indexAmendmentData != null) {
                        indexAmendmentData.NotificationIds.split(',').forEach(item => {
                            if (item)
                                selectedNotifications.push({ Value: parseInt(item), Text: this.notifications.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedNotifications = selectedNotifications;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetIndex(indexAmendmentData): void {
        this.spinnerService.show();

        let getFemaIndexRequest = new GetFemaIndexRequest();
        getFemaIndexRequest.RegulationId = this.regulationId;

        this._femaIndexService.getFemaIndex(getFemaIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.femaIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.femaIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.femaIndexes.push({ Value: item.IndexId, Text: item.IndexNo + ' - ' + item.IndexName });
                    });

                    this.frmIndexAmendment.get("IndexId").setValue((indexAmendmentData != null) ? indexAmendmentData.IndexId : "");
                    this.frmIndexAmendment.updateValueAndValidity();

                    if (indexAmendmentData != null)
                        this.GetSubIndex(indexAmendmentData.IndexId, indexAmendmentData);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnIndexChange(indexId: number) {
        this.femaSubIndexes = [];

        if (indexId) {
            this.GetSubIndex(indexId, null);
        } else {
            this.frmIndexAmendment.get("IndexId").setValue('');
            this.frmIndexAmendment.updateValueAndValidity();
        }
    }

    GetSubIndex(indexId, indexAmendmentData): void {
        this.spinnerService.show();

        let getFemaSubIndexRequest = new GetFemaSubIndexRequest();
        getFemaSubIndexRequest.IndexId = indexId;

        this._femaSubIndexService.getFemaSubIndex(getFemaSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.femaSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.femaSubIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.femaSubIndexes.push({ Value: item.SubIndexId, Text: item.SubIndexNo + ' - ' + item.SubIndexName });
                    });

                    this.frmIndexAmendment.get("SubIndexId").setValue((indexAmendmentData != null) ? (indexAmendmentData.SubIndexId) ? indexAmendmentData.SubIndexId : "" : "");
                    this.frmIndexAmendment.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditIndexAmendment(indexAmendmentId: number) {
        this.spinnerService.show();

        let getIndexAmendmentRequest = new GetIndexAmendmentRequest();
        getIndexAmendmentRequest.IndexAmendmentId = indexAmendmentId;
        getIndexAmendmentRequest.RegulationId = this.regulationId;
        getIndexAmendmentRequest.IsActive = null;

        this._indexAmendmentService.getIndexAmendment(getIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetNotification(data.Response[0]);
                this.GetIndex(data.Response[0]);

                this.frmIndexAmendment.setValue({
                    IndexAmendmentId: indexAmendmentId,
                    RegulationId: data.Response[0].RegulationId,
                    NotificationIds: [],
                    IndexId: data.Response[0].IndexId,
                    SubIndexId: data.Response[0].SubIndexId,
                    IndexAmendmentContent: data.Response[0].IndexAmendmentContent
                });

                this.frmIndexAmendment.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveIndexAmendment(formData) {
        this.spinnerService.show();

        if (formData.value.SubIndexId == 'null') {
            formData.value.SubIndexId = null;
        }

        if (formData.value.IndexAmendmentId) {
            this._indexAmendmentService.updateIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { enableHtml: true });
                    });
        } else {
            this._indexAmendmentService.addIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitIndexAmendment(formData: any) {
        this.isSubmited = true;

        if (this.frmIndexAmendment.valid) {
            formData.value.NotificationIds = this._global.convertArrayToCommaSeperatedString(formData.value.NotificationIds);

            this.SaveIndexAmendment(formData);
        }
    }

    CancelIndexAmendment() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/regulations'], {
                queryParams: {
                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
