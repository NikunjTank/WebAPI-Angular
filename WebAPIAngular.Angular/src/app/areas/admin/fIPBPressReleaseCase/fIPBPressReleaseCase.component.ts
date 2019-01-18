import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FIPBPressReleaseCase, GetFIPBPressReleaseCaseRequest } from '../../../model/fIPBPressReleaseCase';
import { FIPBPressReleaseCaseAdminService } from '../../../service/admin/fIPBPressReleaseCase.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fIPBPressReleaseCase.component.html'
})

export class FIPBPressReleaseCaseAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fIPBPressReleaseCaseService: FIPBPressReleaseCaseAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fIPBPressReleaseCase: FIPBPressReleaseCase;
    fIPBPressReleaseCaseId: number = 0;
    searchText: string = '';
    frmFIPBPressReleaseCase: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.FIPB_PRESS_RELEASE_CASE_PDF_FILEPATH;
    fIPBPressReleaseCasePDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmFIPBPressReleaseCase = this.formBuilder.group({
            FIPBPressReleaseCaseId: [''],
            MinistryName: ['', Validators.required],
            MeetingNo_Detail: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let fIPBPressReleaseCaseId = this._global.decryptValue(params['fIPBPressReleaseCaseId']);

            if (fIPBPressReleaseCaseId) {
                this.addUpdateText = "Update";
                this.fIPBPressReleaseCaseId = parseInt(fIPBPressReleaseCaseId);
                this.EditFIPBPressReleaseCase(parseInt(fIPBPressReleaseCaseId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmFIPBPressReleaseCase.get('PDF').setValue(this.files[0].name);
            this.frmFIPBPressReleaseCase.updateValueAndValidity();
        } else {
            this.frmFIPBPressReleaseCase.get('PDF').setValue(null);
            this.frmFIPBPressReleaseCase.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
        }
    }

    EditFIPBPressReleaseCase(fIPBPressReleaseCaseId: number) {
        this.spinnerService.show();

        let getFIPBPressReleaseCaseRequest = new GetFIPBPressReleaseCaseRequest();
        getFIPBPressReleaseCaseRequest.FIPBPressReleaseCaseId = fIPBPressReleaseCaseId;
        getFIPBPressReleaseCaseRequest.IsActive = null;

        this._fIPBPressReleaseCaseService.getFIPBPressReleaseCase(getFIPBPressReleaseCaseRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.fIPBPressReleaseCasePDFName = data.Response[0].PDF;

                this.frmFIPBPressReleaseCase.setValue({
                    FIPBPressReleaseCaseId: fIPBPressReleaseCaseId,
                    MinistryName: data.Response[0].MinistryName,
                    MeetingNo_Detail: data.Response[0].MeetingNo_Detail,
                    PDF: data.Response[0].PDF
                });

                this.frmFIPBPressReleaseCase.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFIPBPressReleaseCase(formData) {
        this.spinnerService.show();

        if (formData.value.FIPBPressReleaseCaseId) {
            this._fIPBPressReleaseCaseService.updateFIPBPressReleaseCase(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/fipbpressreleasecases']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { enableHtml: true });
                    });
        } else {
            this._fIPBPressReleaseCaseService.addFIPBPressReleaseCase(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/fipbpressreleasecases']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFIPBPressReleaseCase(formData: any) {
        this.isSubmited = true;

        if (this.frmFIPBPressReleaseCase.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }
                
                this._fIPBPressReleaseCaseService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmFIPBPressReleaseCase.get('PDF').setValue(response.Response);
                            this.frmFIPBPressReleaseCase.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveFIPBPressReleaseCase(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveFIPBPressReleaseCase(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelFIPBPressReleaseCase() {
        this.router.navigate(['/admin/secure/fipbpressreleasecases']);
    }
}
