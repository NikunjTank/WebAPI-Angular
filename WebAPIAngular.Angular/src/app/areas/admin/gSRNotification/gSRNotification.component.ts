import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GSRNotification, GSRNotificationType, GetGSRNotificationRequest, GetGSRNotificationTypeRequest } from '../../../model/gSRNotification';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { GSRNotificationAdminService } from '../../../service/admin/gSRNotification.service';
import { RulesAdminService } from '../../../service/admin/rules.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './gSRNotification.component.html'
})

export class GSRNotificationAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _gSRNotificationService: GSRNotificationAdminService, private _rulesService: RulesAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    gSRNotification: GSRNotification;
    gSRNotificationTypes: DropDown[] = [];
    ruless: DropDown[] = [];

    gSRNotificationId: number = 0;

    searchText: string = '';
    frmGSRNotification: FormGroup;
    msg: string;
    files: any;

    pdfServerPath: string = Global.GSR_NOTIFICATION_PDF_FILEPATH;
    gsrNotificationPDFName: string;

    addUpdateText: string;

    minDate: any = { year: 1970, month: 1, day: 1 };

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let gSRNotificationId = this._global.decryptValue(params['gSRNotificationId']);

            if (gSRNotificationId) {
                this.addUpdateText = "Update";

                this.gSRNotificationId = parseInt(gSRNotificationId);
                this.EditGSRNotification(parseInt(gSRNotificationId));
            } else {
                this.GetGSRNotificationType(null);

                this.addUpdateText = "Add";
            }
        });

        this.frmGSRNotification = this.formBuilder.group({
            GSRNotificationId: [''],
            RulesId: [''],
            GSRNotificationNo: ['', Validators.required],
            GSRNotificationName: ['', Validators.required],
            GSRNotificationDate: ['', Validators.required],
            GSRNotificationEffectiveDate: ['', Validators.required],
            GSRNotificationTypeId: ['', Validators.required],
            PDF: ['', Validators.required]
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmGSRNotification.get('PDF').setValue(this.files[0].name);
            this.frmGSRNotification.updateValueAndValidity();
        } else {
            this.frmGSRNotification.get('PDF').setValue(null);
            this.frmGSRNotification.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
        }
    }

    GetGSRNotificationType(gSRNotificationData): void {
        this.spinnerService.show();

        let getGSRNotificationTypeRequest = new GetGSRNotificationTypeRequest();

        this._gSRNotificationService.getGSRNotificationType(getGSRNotificationTypeRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.GetRules(gSRNotificationData);

                this.gSRNotificationTypes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.gSRNotificationTypes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.gSRNotificationTypes.push({ Value: item.GSRNotificationTypeId, Text: item.GSRNotificationTypeName });
                    });

                    this.frmGSRNotification.get("GSRNotificationTypeId").setValue((gSRNotificationData != null) ? gSRNotificationData.GSRNotificationTypeId : "");
                    this.frmGSRNotification.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRules(gSRNotificationData): void {
        this.spinnerService.show();

        let getRulesRequest = new GetRulesRequest();

        this._rulesService.getRules(getRulesRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.ruless = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.ruless.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.ruless.push({ Value: item.RulesId, Text: item.RulesName });
                    });

                    this.frmGSRNotification.get("RulesId").setValue((gSRNotificationData != null) ? (gSRNotificationData.RulesId) ? gSRNotificationData.RulesId : "" : "");
                    this.frmGSRNotification.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditGSRNotification(gSRNotificationId: number) {
        this.spinnerService.show();

        let getGSRNotificationRequest = new GetGSRNotificationRequest();
        getGSRNotificationRequest.GSRNotificationId = gSRNotificationId;
        getGSRNotificationRequest.IsActive = null;

        this._gSRNotificationService.getGSRNotification(getGSRNotificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetGSRNotificationType(data.Response[0]);

                this.gsrNotificationPDFName = data.Response[0].PDF;

                let gSRNotificationDate = new Date(data.Response[0].GSRNotificationDate);
                let gSRNotificationEffectiveDate = new Date(data.Response[0].GSRNotificationEffectiveDate);

                this.frmGSRNotification.setValue({
                    GSRNotificationId: gSRNotificationId,
                    RulesId: data.Response[0].RulesId,
                    GSRNotificationNo: data.Response[0].GSRNotificationNo,
                    GSRNotificationName: data.Response[0].GSRNotificationName,
                    GSRNotificationDate: { year: gSRNotificationDate.getFullYear(), month: gSRNotificationDate.getMonth() + 1, day: gSRNotificationDate.getDate() },
                    GSRNotificationEffectiveDate: { year: gSRNotificationEffectiveDate.getFullYear(), month: gSRNotificationEffectiveDate.getMonth() + 1, day: gSRNotificationEffectiveDate.getDate() },
                    GSRNotificationTypeId: data.Response[0].GSRNotificationTypeId,
                    PDF: data.Response[0].PDF
                });

                this.frmGSRNotification.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    ClearGSRNotificationDate() {
        this.frmGSRNotification.get("GSRNotificationDate").setValue("");
        this.frmGSRNotification.updateValueAndValidity();
    }

    ClearGSRNotificationEffectiveDate() {
        this.frmGSRNotification.get("GSRNotificationEffectiveDate").setValue("");
        this.frmGSRNotification.updateValueAndValidity();
    }

    SaveGSRNotification(formData) {
        this.spinnerService.show();

        formData.value.GSRNotificationDate = (formData.value.GSRNotificationDate != null) ? formData.value.GSRNotificationDate.year + "/" + formData.value.GSRNotificationDate.month + "/" + formData.value.GSRNotificationDate.day : null;
        formData.value.GSRNotificationEffectiveDate = (formData.value.GSRNotificationEffectiveDate != null) ? formData.value.GSRNotificationEffectiveDate.year + "/" + formData.value.GSRNotificationEffectiveDate.month + "/" + formData.value.GSRNotificationEffectiveDate.day : null;

        if (formData.value.GSRNotificationId) {
            this._gSRNotificationService.updateGSRNotification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/gsrnotifications']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true });
                    });
        } else {
            this._gSRNotificationService.addGSRNotification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/gsrnotifications']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitGSRNotification(formData: any) {
        this.isSubmited = true;

        if (this.frmGSRNotification.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._gSRNotificationService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmGSRNotification.get('PDF').setValue(response.Response);
                            this.frmGSRNotification.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;
                            
                            this.SaveGSRNotification(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_GSR_NOTIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
            } else {
                if (formData.value.PDF) {
                    this.SaveGSRNotification(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelGSRNotification() {
        this.router.navigate(['/admin/secure/gsrnotifications']);
    }
}
