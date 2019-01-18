import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notification, NotificationType, GetNotificationRequest, GetNotificationTypeRequest } from '../../../model/notification';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { NotificationAdminService } from '../../../service/admin/notification.service';
import { RegulationAdminService } from '../../../service/admin/regulation.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './notification.component.html'
})

export class NotificationAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _notificationService: NotificationAdminService, private _regulationService: RegulationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService, private _masterDirectionService: MasterDirectionAdminService) { }

    _global: Global = new Global();

    notification: Notification;
    notificationTypes: NotificationType[] = [];
    regulations: Regulation[] = [];
    masterDirections: MasterDirection[] = [];

    notificationId: number = 0;

    searchText: string = '';
    frmNotification: FormGroup;
    msg: string;
    notificationPDF: any;
    gSRPDF: any;

    addUpdateText: string;

    minDate: any = { year: 1970, month: 1, day: 1 };

    notificationPDFServerPath: string = Global.NOTIFICATION_PDF_FILEPATH;
    gSRPDFServerPath: string = Global.GSR_PDF_FILEPATH;

    notificationPDFName: string;
    gSRPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let notificationId = this._global.decryptValue(params['notificationId']);

            if (notificationId) {
                this.addUpdateText = "Update";

                this.notificationId = parseInt(notificationId);
                this.EditNotification(parseInt(notificationId));
            } else {
                this.GetNotificationType(null);

                this.addUpdateText = "Add";
            }
        });

        this.frmNotification = this.formBuilder.group({
            NotificationId: [''],
            RegulationId: [''],
            MasterDirectionId:[''],
            NotificationNumber: ['', Validators.required],
            NotificationName: ['', Validators.required],
            NotificationDate: ['', Validators.required],
            NotificationEffectiveDate: ['', Validators.required],
            NotificationTypeId: ['', Validators.required],
            GSRNo: ['', Validators.required],
            GSRDate: ['', Validators.required],
            NotificationPDF: ['', Validators.required],
            GSRPDF: ['']
        });
    }

    GetMasterDirection(notificationData): void {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirections = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirections.push({ MasterDirectionId: null, MasterDirectionName: "--Select--", CreatedDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, PDF: null, Year: null });

                    data.Response.forEach(item => {
                        this.masterDirections.push({ MasterDirectionId: item.MasterDirectionId, MasterDirectionName: item.MasterDirectionName, CreatedDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, PDF: null, Year: null });
                    });

                    this.frmNotification.get("MasterDirectionId").setValue((notificationData != null) ? notificationData.MasterDirectionId : notificationData);
                    this.frmNotification.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetNotificationType(notificationData): void {
        this.spinnerService.show();

        let getNotificationTypeRequest = new GetNotificationTypeRequest();

        this._notificationService.getNotificationType(getNotificationTypeRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.GetRegulation(notificationData);

                this.notificationTypes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.notificationTypes.push({ NotificationTypeId: null, NotificationTypeName: "--Select--" });

                    data.Response.forEach(item => {
                        this.notificationTypes.push({ NotificationTypeId: item.NotificationTypeId, NotificationTypeName: item.NotificationTypeName });
                    });

                    this.frmNotification.get("NotificationTypeId").setValue((notificationData != null) ? notificationData.NotificationTypeId : notificationData);
                    this.frmNotification.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRegulation(notificationData): void {
        this.spinnerService.show();

        let getRegulationRequest = new GetRegulationRequest();

        this._regulationService.getRegulation(getRegulationRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                this.GetMasterDirection(notificationData);

                this.regulations = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.regulations.push({ RegulationId: null, RegulationNumber: "--Select--", RegulationName: null, CreatedDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, PublicationDate: null, Year: null });

                    data.Response.forEach(item => {
                        this.regulations.push({ RegulationId: item.RegulationId, RegulationNumber: item.RegulationNumber, RegulationName: null, CreatedDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, PublicationDate: null, Year: null });
                    });

                    this.frmNotification.get("RegulationId").setValue((notificationData != null) ? notificationData.RegulationId : notificationData);
                    this.frmNotification.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    notificationPDFChange(event: any) {
        this.notificationPDF = event.target.files;

        if (this.notificationPDF[0].type == "application/pdf") {
            this.frmNotification.get('NotificationPDF').setValue(this.notificationPDF[0].name);
            this.frmNotification.updateValueAndValidity();
        } else {
            this.frmNotification.get('NotificationPDF').setValue(null);
            this.frmNotification.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
        }
    }

    gSRPDFChange(event: any) {
        this.gSRPDF = event.target.files;

        if (this.gSRPDF[0].type == "application/pdf") {
            this.frmNotification.get('GSRPDF').setValue(this.gSRPDF[0].name);
            this.frmNotification.updateValueAndValidity();
        } else {
            this.frmNotification.get('GSRPDF').setValue(null);
            this.frmNotification.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
        }
    }

    EditNotification(notificationId: number) {
        this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();
        getNotificationRequest.NotificationId = notificationId;
        getNotificationRequest.IsActive = null;

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetNotificationType(data.Response[0]);
                //this.GetRegulation(data.Response[0]);

                let notificationDate = new Date(data.Response[0].NotificationDate);
                let notificationEffectiveDate = new Date(data.Response[0].NotificationEffectiveDate);
                let gSRDate = new Date(data.Response[0].GSRDate);

                this.notificationPDFName = data.Response[0].NotificationPDF;
                this.gSRPDFName = data.Response[0].GSRPDF;

                this.frmNotification.setValue({
                    NotificationId: notificationId,
                    RegulationId: data.Response[0].RegulationId,
                    MasterDirectionId: data.Response[0].MasterDirectionId,
                    NotificationNumber: data.Response[0].NotificationNumber,
                    NotificationName: data.Response[0].NotificationName,
                    NotificationDate: { year: notificationDate.getFullYear(), month: notificationDate.getMonth() + 1, day: notificationDate.getDate() },
                    NotificationEffectiveDate: { year: notificationEffectiveDate.getFullYear(), month: notificationEffectiveDate.getMonth() + 1, day: notificationEffectiveDate.getDate() },
                    NotificationTypeId: data.Response[0].NotificationTypeId,
                    GSRNo: data.Response[0].GSRNo,
                    GSRDate: { year: gSRDate.getFullYear(), month: gSRDate.getMonth() + 1, day: gSRDate.getDate() },
                    NotificationPDF: data.Response[0].NotificationPDF,
                    GSRPDF: data.Response[0].GSRPDF
                });

                this.frmNotification.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    ClearNotificationDate() {
        this.frmNotification.get("NotificationDate").setValue("");
        this.frmNotification.updateValueAndValidity();
    }

    ClearNotificationEffectiveDate() {
        this.frmNotification.get("NotificationEffectiveDate").setValue("");
        this.frmNotification.updateValueAndValidity();
    }

    ClearGSRDate() {
        this.frmNotification.get("GSRDate").setValue("");
        this.frmNotification.updateValueAndValidity();
    }

    SaveNotification(formData) {
        formData.value.NotificationDate = (formData.value.NotificationDate != null) ? formData.value.NotificationDate.year + "/" + formData.value.NotificationDate.month + "/" + formData.value.NotificationDate.day : null;
        formData.value.NotificationEffectiveDate = (formData.value.NotificationEffectiveDate != null) ? formData.value.NotificationEffectiveDate.year + "/" + formData.value.NotificationEffectiveDate.month + "/" + formData.value.NotificationEffectiveDate.day : null;
        formData.value.GSRDate = (formData.value.GSRDate != null) ? formData.value.GSRDate.year + "/" + formData.value.GSRDate.month + "/" + formData.value.GSRDate.day : null;

        if (formData.value.NotificationId) {
            this._notificationService.updateNotification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/notifications']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true });
                    });
        } else {
            this._notificationService.addNotification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/notifications']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitNotification(formData: any) {
        this.isSubmited = true;

        if (this.frmNotification.valid) {
            this.UploadNotificationPDF(formData);
        }
    }

    UploadNotificationPDF(formData) {
        this.spinnerService.show();

        if (this.notificationPDF != null && this.notificationPDF.length > 0) {
            let notificationFileFormData: FormData = new FormData();
            for (var i = 0; i < this.notificationPDF.length; i++) {
                notificationFileFormData.append(this.notificationPDF[i].name, this.notificationPDF[i]);
            }

            this._notificationService.notificationPDFUpload(notificationFileFormData)
                .subscribe(response => {
                    if (response.Status == "Success") {
                        this.frmNotification.get('NotificationPDF').setValue(response.Response);
                        this.frmNotification.updateValueAndValidity();
                        formData.value.NotificationPDF = response.Response;
                        this.notificationPDF = null;

                        this.UploadGSRPDF(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            if (formData.value.NotificationPDF) {
                this.UploadGSRPDF(formData);
            } else {
                this.spinnerService.hide();
            }
        }
    }

    UploadGSRPDF(formData) {
        if (this.gSRPDF != null && this.gSRPDF.length > 0) {
            let gSRFileFormData: FormData = new FormData();
            for (var i = 0; i < this.gSRPDF.length; i++) {
                gSRFileFormData.append(this.gSRPDF[i].name, this.gSRPDF[i]);
            }

            this._notificationService.gSRPDFUpload(gSRFileFormData)
                .subscribe(response => {
                    if (response.Status == "Success") {
                        this.frmNotification.get('GSRPDF').setValue(response.Response);
                        this.frmNotification.updateValueAndValidity();
                        formData.value.GSRPDF = response.Response;
                        this.gSRPDF = null;

                        this.SaveNotification(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            this.SaveNotification(formData);
        }
    }

    CancelNotification() {
        this.router.navigate(['/admin/secure/notifications']);
    }
}
