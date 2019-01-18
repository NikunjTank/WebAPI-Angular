import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterDirection.component.html'
})

export class MasterDirectionAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterDirectionService: MasterDirectionAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    masterDirection: MasterDirection;
    masterDirectionId: number = 0;
    searchText: string = '';
    frmMasterDirection: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;
    masterDirectionPDFName: string;

    masterDirectionYears: DropDown[] = [];

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmMasterDirection = this.formBuilder.group({
            MasterDirectionId: [''],
            MasterDirectionName: ['', Validators.required],
            Year: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let masterDirectionId = this._global.decryptValue(params['masterDirectionId']);

            if (masterDirectionId) {
                this.addUpdateText = "Update";
                this.masterDirectionId = parseInt(masterDirectionId);
                this.EditMasterDirection(parseInt(masterDirectionId));
            } else {
                this.GetMasterDirectionYear(null);
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmMasterDirection.get('PDF').setValue(this.files[0].name);
            this.frmMasterDirection.updateValueAndValidity();
        } else {
            this.frmMasterDirection.get('PDF').setValue(null);
            this.frmMasterDirection.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
        }
    }

    EditMasterDirection(masterDirectionId: number) {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();
        getMasterDirectionRequest.MasterDirectionId = masterDirectionId;
        getMasterDirectionRequest.IsActive = null;

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetMasterDirectionYear(data.Response[0]);

                this.masterDirectionPDFName = data.Response[0].PDF;

                this.frmMasterDirection.setValue({
                    MasterDirectionId: masterDirectionId,
                    MasterDirectionName: data.Response[0].MasterDirectionName,
                    Year: data.Response[0].Year,
                    PDF: data.Response[0].PDF
                });

                this.frmMasterDirection.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterDirection(formData) {
        this.spinnerService.show();

        if (formData.value.MasterDirectionId) {
            this._masterDirectionService.updateMasterDirection(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterDirectionService.addMasterDirection(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    GetMasterDirectionYear(masterDirectionData): void {
        this.spinnerService.show();

        this._masterDirectionService.getMasterDirectionYear()
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionYears.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterDirectionYears.push({ Value: item, Text: item });
                    });

                    this.frmMasterDirection.get("Year").setValue((masterDirectionData != null) ? masterDirectionData.Year : "");
                    this.frmMasterDirection.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnSubmitMasterDirection(formData: any) {
        this.isSubmited = true;

        if (this.frmMasterDirection.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._masterDirectionService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmMasterDirection.get('PDF').setValue(response.Response);
                            this.frmMasterDirection.updateValueAndValidity();
                            formData.value.PDF = response.Response;

                            this.files = null;

                            this.SaveMasterDirection(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveMasterDirection(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelMasterDirection() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/masterdirections'], {
                queryParams: {
                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
