import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FIPBReview, GetFIPBReviewRequest } from '../../../model/fIPBReview';
import { FIPBReviewAdminService } from '../../../service/admin/fIPBReview.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fIPBReview.component.html'
})

export class FIPBReviewAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fIPBReviewService: FIPBReviewAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fIPBReview: FIPBReview;
    fIPBReviewId: number = 0;
    searchText: string = '';
    frmFIPBReview: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.FIPBREVIEW_PDF_FILEPATH;
    fIPBReviewPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmFIPBReview = this.formBuilder.group({
            FIPBReviewId: [''],
            Name: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let fIPBReviewId = this._global.decryptValue(params['fIPBReviewId']);

            if (fIPBReviewId) {
                this.addUpdateText = "Update";
                this.fIPBReviewId = parseInt(fIPBReviewId);
                this.EditFIPBReview(parseInt(fIPBReviewId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmFIPBReview.get('PDF').setValue(this.files[0].name);
            this.frmFIPBReview.updateValueAndValidity();
        } else {
            this.frmFIPBReview.get('PDF').setValue(null);
            this.frmFIPBReview.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
        }
    }

    EditFIPBReview(fIPBReviewId: number) {
        this.spinnerService.show();

        let getFIPBReviewRequest = new GetFIPBReviewRequest();
        getFIPBReviewRequest.FIPBReviewId = fIPBReviewId;
        getFIPBReviewRequest.IsActive = null;

        this._fIPBReviewService.getFIPBReview(getFIPBReviewRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.fIPBReviewPDFName = data.Response[0].PDF;

                this.frmFIPBReview.setValue({
                    FIPBReviewId: fIPBReviewId,
                    Name: data.Response[0].Name,
                    PDF: data.Response[0].PDF
                });

                this.frmFIPBReview.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFIPBReview(formData) {
        this.spinnerService.show();

        if (formData.value.FIPBReviewId) {
            this._fIPBReviewService.updateFIPBReview(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/fipbreviews']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { enableHtml: true });
                    });
        } else {
            this._fIPBReviewService.addFIPBReview(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/fipbreviews']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFIPBReview(formData: any) {
        this.isSubmited = true;

        if (this.frmFIPBReview.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }
                
                this._fIPBReviewService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmFIPBReview.get('PDF').setValue(response.Response);
                            this.frmFIPBReview.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveFIPBReview(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveFIPBReview(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelFIPBReview() {
        this.router.navigate(['/admin/secure/fipbreviews']);
    }
}
