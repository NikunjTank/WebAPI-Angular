import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FAQ, GetFAQRequest } from '../../../model/fAQ';
import { FAQCategory, GetFAQCategoryRequest } from '../../../model/fAQCategory';
import { FAQAdminService } from '../../../service/admin/fAQ.service';
import { FAQCategoryAdminService } from '../../../service/admin/fAQCategory.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fAQ.component.html'
})

export class FAQAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fAQService: FAQAdminService, private _fAQCategoryService: FAQCategoryAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fAQ: FAQ;
    fAQId: number = 0;
    searchText: string = '';
    frmFAQ: FormGroup;
    msg: string;
    files: any;

    fAQCategories: DropDown[] = [];

    addUpdateText: string;

    pdfServerPath: string = Global.FAQ_PDF_FILEPATH;
    fAQPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmFAQ = this.formBuilder.group({
            FAQId: [''],
            CategoryId: ['', Validators.required],
            TopicName: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let fAQId = this._global.decryptValue(params['fAQId']);

            if (fAQId) {
                this.addUpdateText = "Update";
                this.fAQId = parseInt(fAQId);
                this.EditFAQ(parseInt(fAQId));
            } else {
                this.GetFAQCategory(null);
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmFAQ.get('PDF').setValue(this.files[0].name);
            this.frmFAQ.updateValueAndValidity();
        } else {
            this.frmFAQ.get('PDF').setValue(null);
            this.frmFAQ.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
        }
    }

    GetFAQCategory(fAQData): void {
        this.spinnerService.show();

        let getFAQCategoryRequest = new GetFAQCategoryRequest();

        this._fAQCategoryService.getFAQCategory(getFAQCategoryRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fAQCategories = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fAQCategories.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.fAQCategories.push({ Value: item.FAQCategoryId, Text: item.CategoryName });
                    });

                    this.frmFAQ.get("CategoryId").setValue((fAQData != null) ? fAQData.CategoryId : "");
                    this.frmFAQ.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFAQ(fAQId: number) {
        this.spinnerService.show();

        let getFAQRequest = new GetFAQRequest();
        getFAQRequest.FAQId = fAQId;
        getFAQRequest.IsActive = null;

        this._fAQService.getFAQ(getFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.fAQPDFName = data.Response[0].PDF;
                this.GetFAQCategory(data.Response[0]);

                this.frmFAQ.setValue({
                    FAQId: fAQId,
                    CategoryId: data.Response[0].CategoryId,
                    TopicName: data.Response[0].TopicName,
                    PDF: data.Response[0].PDF
                });

                this.frmFAQ.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFAQ(formData) {
        this.spinnerService.show();

        if (formData.value.FAQId) {
            this._fAQService.updateFAQ(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/faqs']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true });
                    });
        } else {
            this._fAQService.addFAQ(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/faqs']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFAQ(formData: any) {
        this.isSubmited = true;

        if (this.frmFAQ.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._fAQService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmFAQ.get('PDF').setValue(response.Response);
                            this.frmFAQ.updateValueAndValidity();
                            formData.value.PDF = response.Response;

                            this.files = null;

                            this.SaveFAQ(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveFAQ(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelFAQ() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/faqs']);
        });
    }
}
