import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PressNoteNotification, GetPressNoteNotificationRequest } from '../../../model/pressNoteNotification';
import { Notification, GetNotificationRequest } from '../../../model/notification';
import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
import { PressNoteNotificationAdminService } from '../../../service/admin/pressNoteNotification.service';
import { NotificationAdminService } from '../../../service/admin/notification.service';
import { PressNoteAdminService } from '../../../service/admin/pressNote.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './pressNoteNotification.component.html'
})

export class PressNoteNotificationAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _pressNoteNotificationService: PressNoteNotificationAdminService, private _notificationService: NotificationAdminService, private _pressNoteService: PressNoteAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    notifications: Notification[] = [];
    pressNote: PressNote = new PressNote();

    pressNoteId: number = 0;
    pressNoteNotificationId: number = 0;

    frmPressNoteNotification: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let pressNoteId = this._global.decryptValue(params['pressNoteId']);
            let pressNoteNotificationId = this._global.decryptValue(params['pressNoteNotificationId']);

            this.pressNoteId = parseInt(pressNoteId);

            if (pressNoteId) {
                this.GetPressNote(this.pressNoteId);

                if (pressNoteNotificationId) {
                    this.addUpdateText = "Update";
                    
                    this.pressNoteNotificationId = parseInt(pressNoteNotificationId);
                    this.EditPressNoteNotification(parseInt(pressNoteNotificationId));
                } else {
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/pressnotes'], {
                        queryParams: {
                            indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmPressNoteNotification = this.formBuilder.group({
            PressNoteNotificationId: [''],
            PressNoteId: [this.pressNoteId],
            NotificationId: ['', Validators.required]
        });
    }

    GetPressNote(pressNoteId: number) {
        this.spinnerService.show();

        let getPressNoteRequest = new GetPressNoteRequest();
        getPressNoteRequest.PressNoteId = pressNoteId;
        getPressNoteRequest.IsActive = null;

        this._pressNoteService.getPressNote(getPressNoteRequest)
            .subscribe(data => {

                if (this.pressNoteNotificationId == 0)
                    this.GetNotification(null);

                this.pressNote = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetNotification(pressNoteNotificationData): void {
        //this.spinnerService.show();

        let getNotificationRequest = new GetNotificationRequest();

        this._notificationService.getNotification(getNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.notifications = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.notifications.push({ NotificationId: null, NotificationNumber: "--Select--", CreatedDate: null, GSRDate: null, GSRNo: null, GSRPDF: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationDate: null, NotificationEffectiveDate: null, NotificationName: null, NotificationPDF: null, NotificationTypeId: null, NotificationTypeName: null, RegulationId: null });

                    data.Response.forEach(item => {
                        this.notifications.push({ NotificationId: item.NotificationId, NotificationNumber: item.NotificationNumber, CreatedDate: null, GSRDate: null, GSRNo: null, GSRPDF: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationDate: null, NotificationEffectiveDate: null, NotificationName: null, NotificationPDF: null, NotificationTypeId: null, NotificationTypeName: null, RegulationId: null });
                    });

                    this.frmPressNoteNotification.get("NotificationId").setValue((pressNoteNotificationData != null) ? pressNoteNotificationData.NotificationId : pressNoteNotificationData);
                    this.frmPressNoteNotification.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditPressNoteNotification(pressNoteNotificationId: number) {
        this.spinnerService.show();

        let getPressNoteNotificationRequest = new GetPressNoteNotificationRequest();
        getPressNoteNotificationRequest.PressNoteNotificationId = pressNoteNotificationId;
        getPressNoteNotificationRequest.IsActive = null;

        this._pressNoteNotificationService.getPressNoteNotification(getPressNoteNotificationRequest)
            .subscribe(data => {
                
                this.GetNotification(data.Response[0]);
                
                this.frmPressNoteNotification.setValue({
                    PressNoteNotificationId: pressNoteNotificationId,
                    PressNoteId: data.Response[0].PressNoteId,
                    NotificationId: data.Response[0].NotificationId
                });

                this.frmPressNoteNotification.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SavePressNoteNotification(formData) {
        this.spinnerService.show();

        if (formData.value.PressNoteNotificationId) {
            this._pressNoteNotificationService.updatePressNoteNotification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/pressnotes'], {
                                queryParams: {
                                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE, { enableHtml: true });
                    });
        } else {
            this._pressNoteNotificationService.addPressNoteNotification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/pressnotes'], {
                                queryParams: {
                                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitPressNoteNotification(formData: any) {
        this.isSubmited = true;

        if (this.frmPressNoteNotification.valid) {
            this.SavePressNoteNotification(formData);
        }
    }

    CancelPressNoteNotification() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/pressnotes'], {
                queryParams: {
                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
