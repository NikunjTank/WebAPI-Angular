import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDirectionIndexAmendment, GetMasterDirectionIndexAmendmentRequest } from '../../../model/masterDirectionIndexAmendment';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { Notification, GetNotificationRequest } from '../../../model/notification';
import { MasterDirectionIndex, GetMasterDirectionIndexRequest } from '../../../model/masterDirectionIndex';
import { MasterDirectionSubIndex, GetMasterDirectionSubIndexRequest } from '../../../model/masterDirectionSubIndex';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../../model/masterDirectionChapter';
import { MasterDirectionIndexAmendmentAdminService } from '../../../service/admin/masterDirectionIndexAmendment.service';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';
import { MasterDirectionIndexAdminService } from '../../../service/admin/masterDirectionIndex.service';
import { MasterDirectionSubIndexAdminService } from '../../../service/admin/masterDirectionSubIndex.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { MasterDirectionChapterAdminService } from '../../../service/admin/masterDirectionChapter.service';
import { NotificationAdminService } from '../../../service/admin/notification.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterDirectionIndexAmendment.component.html'
})

export class MasterDirectionIndexAmendmentAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterDirectionIndexAmendmentService: MasterDirectionIndexAmendmentAdminService, private _aPDIRCircularService: APDIRCircularAdminService, private _masterDirectionIndexService: MasterDirectionIndexAdminService, private _masterDirectionSubIndexService: MasterDirectionSubIndexAdminService, private _masterDirectionService: MasterDirectionAdminService, private _masterDirectionChapterService: MasterDirectionChapterAdminService, private _notificationService: NotificationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    notifications: DropDown[] = [];
    aPDIRCirculars: DropDown[] = [];
    masterDirectionChapters: DropDown[] = [];
    masterDirectionIndexes: DropDown[] = [];
    masterDirectionSubIndexes: DropDown[] = [];
    masterDirectionIndexAmendmentYears: DropDown[] = [];
    updatedInsertedByRBI: DropDown[] = [];
    notificationDropDownSettings = {};
    aPDIRCircularDropDownSettings = {};
    selectedNotifications: any = [];
    selectedAPDIRCirculars: any = [];

    masterDirection: MasterDirection = new MasterDirection();

    masterDirectionId: number = 0;
    masterDirectionIndexAmendmentId: number = 0;

    frmMasterDirectionIndexAmendment: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;
    isAPDIRCircularNotification: boolean = false;

    minDate: any = { year: 1970, month: 1, day: 1 };

    masterDirectionPDFPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let masterDirectionId = this._global.decryptValue(params['masterDirectionId']);
            let masterDirectionIndexAmendmentId = this._global.decryptValue(params['masterDirectionIndexAmendmentId']);

            this.masterDirectionId = parseInt(masterDirectionId);

            if (masterDirectionId) {
                this.GetMasterDirection(this.masterDirectionId);

                if (masterDirectionIndexAmendmentId) {
                    this.addUpdateText = "Update";

                    this.masterDirectionIndexAmendmentId = parseInt(masterDirectionIndexAmendmentId);
                    this.EditMasterDirectionIndexAmendment(parseInt(masterDirectionIndexAmendmentId));
                } else {
                    this.GetAPDIRCircular(null);
                    this.GetMasterDirectionChapter(null);
                    this.GetMasterDirectionIndexAmendmentYear(null);
                    this.GetNotification(null);

                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/masterdirections'], {
                        queryParams: {
                            indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmMasterDirectionIndexAmendment = this.formBuilder.group({
            MasterDirectionIndexAmendmentId: [''],
            MasterDirectionId: [this.masterDirectionId],
            NotificationIds: [''],
            APDIRCircularIds: [''],
            MasterDirectionChapterId: ['', Validators.required],
            MasterDirectionIndexId: ['', Validators.required],
            MasterDirectionSubIndexId: [''],
            Year: ['', Validators.required],
            IndexAmendmentContent: ['', Validators.required],
            UpdatedInsertedByRBI: [''],
            UpdatedInsertedDateByRBI: ['']
        });
    }

    ClearDate() {
        this.frmMasterDirectionIndexAmendment.get("UpdatedInsertedDateByRBI").setValue(null);
        this.frmMasterDirectionIndexAmendment.updateValueAndValidity();
    }

    GetUpdatedInsertedByRBI(masterDirectionIndexAmendmentData): void {
        this.updatedInsertedByRBI = [];

        this.updatedInsertedByRBI.push({ Value: "", Text: "--Select--" });

        this.updatedInsertedByRBI.push({ Value: "true", Text: "Yes" });
        this.updatedInsertedByRBI.push({ Value: "false", Text: "No" });
        
        this.frmMasterDirectionIndexAmendment.get("UpdatedInsertedByRBI").setValue((masterDirectionIndexAmendmentData != null) ? (masterDirectionIndexAmendmentData.UpdatedInsertedByRBI != null) ? masterDirectionIndexAmendmentData.UpdatedInsertedByRBI : "" : "");
        this.frmMasterDirectionIndexAmendment.updateValueAndValidity();
    }

    GetMasterDirectionIndexAmendmentYear(masterDirectionIndexAmendmentData): void {
        this.spinnerService.show();

        this._masterDirectionIndexAmendmentService.getMasterDirectionIndexAmendmentYear()
            .subscribe(data => {
                this.spinnerService.hide();

                this.masterDirectionIndexAmendmentYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionIndexAmendmentYears.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterDirectionIndexAmendmentYears.push({ Value: item, Text: item });
                    });

                    this.frmMasterDirectionIndexAmendment.get("Year").setValue((masterDirectionIndexAmendmentData != null) ? masterDirectionIndexAmendmentData.Year : "");
                    this.frmMasterDirectionIndexAmendment.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetNotification(masterDirectionIndexAmendmentData): void {
        this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.notifications = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.notifications.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.notifications.push({ Value: item.NotificationId, Text: item.NotificationNumber });
                    });

                    //this.frmMasterDirectionIndexAmendment.get("NotificationId").setValue((masterDirectionIndexAmendmentData != null) ? (masterDirectionIndexAmendmentData.NotificationId) ? masterDirectionIndexAmendmentData.NotificationId : "" : "");
                    //this.frmMasterDirectionIndexAmendment.updateValueAndValidity();

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

                    if (masterDirectionIndexAmendmentData != null) {
                        masterDirectionIndexAmendmentData.NotificationIds.split(',').forEach(item => {
                            if (item)
                                selectedNotifications.push({ Value: parseInt(item), Text: this.notifications.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedNotifications = selectedNotifications;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirection(masterDirectionId: number) {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();
        getMasterDirectionRequest.MasterDirectionId = masterDirectionId;
        getMasterDirectionRequest.IsActive = null;

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirection = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetAPDIRCircular(masterDirectionIndexAmendmentData): void {
        this.spinnerService.show();

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();
        getAPDIRCircularRequest.MasterDirectionId = this.masterDirectionId;

        this._aPDIRCircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                this.aPDIRCirculars = [];

                this.GetUpdatedInsertedByRBI(masterDirectionIndexAmendmentData);

                if (data.Status == Global.API_SUCCESS) {

                    //this.aPDIRCirculars.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.aPDIRCirculars.push({ Value: item.APDIRCircularId, Text: item.APDIRCircularNo });
                    });

                    //this.frmMasterDirectionIndexAmendment.get("APDIRCircularId").setValue((masterDirectionIndexAmendmentData != null) ? (masterDirectionIndexAmendmentData.APDIRCircularId) ? masterDirectionIndexAmendmentData.APDIRCircularId : "" : "");
                    //this.frmMasterDirectionIndexAmendment.updateValueAndValidity();

                    this.aPDIRCircularDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedAPDIRCirculars = [];

                    if (masterDirectionIndexAmendmentData != null) {
                        masterDirectionIndexAmendmentData.APDIRCircularIds.split(',').forEach(item => {
                            if (item)
                                selectedAPDIRCirculars.push({ Value: parseInt(item), Text: this.aPDIRCirculars.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedAPDIRCirculars = selectedAPDIRCirculars;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirectionChapter(masterDirectionIndexAmendmentData): void {
        this.spinnerService.show();

        let getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();
        getMasterDirectionChapterRequest.MasterDirectionId = this.masterDirectionId;

        this._masterDirectionChapterService.getMasterDirectionChapter(getMasterDirectionChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.masterDirectionChapters = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionChapters.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterDirectionChapters.push({ Value: item.MasterDirectionChapterId, Text: item.Chapter });
                    });

                    this.frmMasterDirectionIndexAmendment.get("MasterDirectionChapterId").setValue((masterDirectionIndexAmendmentData != null) ? masterDirectionIndexAmendmentData.MasterDirectionChapterId : "");
                    this.frmMasterDirectionIndexAmendment.updateValueAndValidity();

                    if (masterDirectionIndexAmendmentData != null)
                        this.GetMasterDirectionIndex(masterDirectionIndexAmendmentData.MasterDirectionChapterId, masterDirectionIndexAmendmentData);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnChapterChange(masterDirectionChapterId: number) {
        this.masterDirectionIndexes = [];

        if (masterDirectionChapterId) {
            this.GetMasterDirectionIndex(masterDirectionChapterId, null);
        } else {
            this.frmMasterDirectionIndexAmendment.get("MasterDirectionChapterId").setValue('');
            this.frmMasterDirectionIndexAmendment.updateValueAndValidity();
        }
    }

    OnAPDIRCircularChange(formData) {
        if (formData.value.APDIRCircularId || formData.value.NotificationId) {
            this.isAPDIRCircularNotification = false;
        } else {
            this.isAPDIRCircularNotification = true;
        }
    }

    OnNotificationChange(formData) {
        if (formData.value.APDIRCircularId || formData.value.NotificationId) {
            this.isAPDIRCircularNotification = false;
        } else {
            this.isAPDIRCircularNotification = true;
        }
    }

    GetMasterDirectionIndex(masterDirectionChapterId, masterDirectionIndexAmendmentData): void {
        this.spinnerService.show();

        let getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();
        getMasterDirectionIndexRequest.MasterDirectionChapterId = masterDirectionChapterId;

        this._masterDirectionIndexService.getMasterDirectionIndex(getMasterDirectionIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterDirectionIndexes.push({ Value: item.MasterDirectionIndexId, Text: item.IndexNo + ' - ' + item.IndexName });
                    });

                    this.frmMasterDirectionIndexAmendment.get("MasterDirectionIndexId").setValue((masterDirectionIndexAmendmentData != null) ? masterDirectionIndexAmendmentData.MasterDirectionIndexId : "");
                    this.frmMasterDirectionIndexAmendment.updateValueAndValidity();

                    if (masterDirectionIndexAmendmentData != null)
                        this.GetMasterDirectionSubIndex(masterDirectionIndexAmendmentData.MasterDirectionIndexId, masterDirectionIndexAmendmentData);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnIndexChange(masterDirectionIndexId: number) {
        this.masterDirectionSubIndexes = [];

        if (masterDirectionIndexId) {
            this.GetMasterDirectionSubIndex(masterDirectionIndexId, null);
        } else {
            this.frmMasterDirectionIndexAmendment.get("MasterDirectionIndexId").setValue('');
            this.frmMasterDirectionIndexAmendment.updateValueAndValidity();
        }
    }

    GetMasterDirectionSubIndex(masterDirectionIndexId, masterDirectionIndexAmendmentData): void {
        this.spinnerService.show();

        let getMasterDirectionSubIndexRequest = new GetMasterDirectionSubIndexRequest();
        getMasterDirectionSubIndexRequest.MasterDirectionIndexId = masterDirectionIndexId;

        this._masterDirectionSubIndexService.getMasterDirectionSubIndex(getMasterDirectionSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionSubIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterDirectionSubIndexes.push({ Value: item.MasterDirectionSubIndexId, Text: item.SubIndexNo + ' - ' + item.SubIndexName });
                    });

                    this.frmMasterDirectionIndexAmendment.get("MasterDirectionSubIndexId").setValue((masterDirectionIndexAmendmentData != null) ? (masterDirectionIndexAmendmentData.MasterDirectionSubIndexId) ? masterDirectionIndexAmendmentData.MasterDirectionSubIndexId : "" : "");
                    this.frmMasterDirectionIndexAmendment.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditMasterDirectionIndexAmendment(masterDirectionIndexAmendmentId: number) {
        this.spinnerService.show();

        let getMasterDirectionIndexAmendmentRequest = new GetMasterDirectionIndexAmendmentRequest();
        getMasterDirectionIndexAmendmentRequest.MasterDirectionIndexAmendmentId = masterDirectionIndexAmendmentId;
        getMasterDirectionIndexAmendmentRequest.MasterDirectionId = this.masterDirectionId;
        getMasterDirectionIndexAmendmentRequest.IsActive = null;

        this._masterDirectionIndexAmendmentService.getMasterDirectionIndexAmendment(getMasterDirectionIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetAPDIRCircular(data.Response[0]);
                this.GetMasterDirectionChapter(data.Response[0]);
                this.GetMasterDirectionIndexAmendmentYear(data.Response[0]);
                this.GetNotification(data.Response[0]);
                
                let updatedInsertedDateByRBI = new Date(data.Response[0].UpdatedInsertedDateByRBI);

                this.frmMasterDirectionIndexAmendment.setValue({
                    MasterDirectionIndexAmendmentId: masterDirectionIndexAmendmentId,
                    MasterDirectionId: data.Response[0].MasterDirectionId,
                    NotificationIds: [],
                    APDIRCircularIds: [],
                    MasterDirectionChapterId: data.Response[0].MasterDirectionChapterId,
                    MasterDirectionIndexId: data.Response[0].MasterDirectionIndexId,
                    MasterDirectionSubIndexId: data.Response[0].MasterDirectionSubIndexId,
                    Year: data.Response[0].Year,
                    IndexAmendmentContent: data.Response[0].IndexAmendmentContent,
                    UpdatedInsertedByRBI: data.Response[0].UpdatedInsertedByRBI,
                    UpdatedInsertedDateByRBI: (data.Response[0].UpdatedInsertedDateByRBI) ? { year: updatedInsertedDateByRBI.getFullYear(), month: updatedInsertedDateByRBI.getMonth() + 1, day: updatedInsertedDateByRBI.getDate() } : null
                });

                this.frmMasterDirectionIndexAmendment.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterDirectionIndexAmendment(formData) {
        this.spinnerService.show();

        formData.value.UpdatedInsertedDateByRBI = (formData.value.UpdatedInsertedDateByRBI != null && formData.value.UpdatedInsertedByRBI && formData.value.UpdatedInsertedByRBI.toString() == 'true') ? formData.controls.UpdatedInsertedDateByRBI.value.year + "/" + formData.controls.UpdatedInsertedDateByRBI.value.month + "/" + formData.controls.UpdatedInsertedDateByRBI.value.day : null;

        if (formData.value.MasterDirectionIndexAmendmentId) {
            this._masterDirectionIndexAmendmentService.updateMasterDirectionIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterDirectionIndexAmendmentService.addMasterDirectionIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitMasterDirectionIndexAmendment(formData: any) {
        this.isSubmited = true;

        let aPDIRCircularIds = formData.value.APDIRCircularIds;
        let notificationIds = formData.value.NotificationIds;
        
        if ((aPDIRCircularIds || notificationIds || formData.value.UpdatedInsertedByRBI.toString() != "") && (aPDIRCircularIds.length > 0 || notificationIds.length > 0 || formData.value.UpdatedInsertedByRBI.toString() != "")) {
            this.isAPDIRCircularNotification = false;

            formData.value.NotificationIds = this._global.convertArrayToCommaSeperatedString(notificationIds);
            formData.value.APDIRCircularIds = this._global.convertArrayToCommaSeperatedString(aPDIRCircularIds);

            if (this.frmMasterDirectionIndexAmendment.valid) {
                this.SaveMasterDirectionIndexAmendment(formData);
            }
        } else {
            this.isAPDIRCircularNotification = true;
        }
    }

    CancelMasterDirectionIndexAmendment() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/masterdirections'], {
                queryParams: {
                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
