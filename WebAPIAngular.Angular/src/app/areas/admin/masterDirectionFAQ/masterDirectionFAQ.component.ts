import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterDirectionFAQ, GetMasterDirectionFAQRequest } from '../../../model/masterDirectionFAQ';
import { FAQ, GetFAQRequest } from '../../../model/fAQ';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { MasterDirectionFAQAdminService } from '../../../service/admin/masterDirectionFAQ.service';
import { FAQAdminService } from '../../../service/admin/fAQ.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterDirectionFAQ.component.html'
})

export class MasterDirectionFAQAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterDirection: MasterDirectionAdminService, private _masterDirectionFAQService: MasterDirectionFAQAdminService, private _fAQService: FAQAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fAQs: DropDown[] = [];
    masterDirection: MasterDirection = new MasterDirection();

    masterDirectionId: number = 0;
    masterDirectionFAQId: number = 0;

    frmMasterDirectionFAQ: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    masterDirectionPDFPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let masterDirectionId = this._global.decryptValue(params['masterDirectionId']);
            let masterDirectionFAQId = this._global.decryptValue(params['masterDirectionFAQId']);

            if (masterDirectionId) {
                this.masterDirectionId = parseInt(masterDirectionId);

                this.GetMasterDirection(this.masterDirectionId);

                if (masterDirectionFAQId) {
                    this.addUpdateText = "Update";

                    this.masterDirectionFAQId = parseInt(masterDirectionFAQId);
                    this.EditMasterDirectionFAQ(parseInt(masterDirectionFAQId));
                } else {
                    this.GetFAQ(null);
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

        this.frmMasterDirectionFAQ = this.formBuilder.group({
            MasterDirectionFAQId: [''],
            MasterDirectionId: [this.masterDirectionId],
            FAQId: ['', Validators.required]
        });
    }

    GetMasterDirection(masterDirectionId: number) {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();
        getMasterDirectionRequest.MasterDirectionId = masterDirectionId;
        getMasterDirectionRequest.IsActive = null;

        this._masterDirection.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirection = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetFAQ(masterDirectionFAQData): void {
        this.spinnerService.show();

        let getFAQRequest = new GetFAQRequest();

        this._fAQService.getFAQ(getFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fAQs = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fAQs.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.fAQs.push({ Value: item.FAQId, Text: item.TopicName });
                    });

                    this.frmMasterDirectionFAQ.get("FAQId").setValue((masterDirectionFAQData != null) ? masterDirectionFAQData.FAQId : "");
                    this.frmMasterDirectionFAQ.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditMasterDirectionFAQ(masterDirectionFAQId: number) {
        this.spinnerService.show();

        let getMasterDirectionFAQRequest = new GetMasterDirectionFAQRequest();
        getMasterDirectionFAQRequest.MasterDirectionFAQId = masterDirectionFAQId;
        getMasterDirectionFAQRequest.IsActive = null;

        this._masterDirectionFAQService.getMasterDirectionFAQ(getMasterDirectionFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetFAQ(data.Response[0]);

                this.frmMasterDirectionFAQ.setValue({
                    MasterDirectionFAQId: masterDirectionFAQId,
                    MasterDirectionId: data.Response[0].MasterDirectionId,
                    FAQId: data.Response[0].FAQId
                });

                this.frmMasterDirectionFAQ.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterDirectionFAQ(formData) {
        this.spinnerService.show();

        if (formData.value.MasterDirectionFAQId) {
            this._masterDirectionFAQService.updateMasterDirectionFAQ(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterDirectionFAQService.addMasterDirectionFAQ(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitMasterDirectionFAQ(formData: any) {
        this.isSubmited = true;

        if (this.frmMasterDirectionFAQ.valid) {
            this.SaveMasterDirectionFAQ(formData);
        }
    }

    CancelMasterDirectionFAQ() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/masterdirections'], {
                queryParams: {
                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
