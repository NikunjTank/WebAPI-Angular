import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { RulesAdminService } from '../../../service/admin/rules.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './rules.component.html'
})

export class RulesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rulesService: RulesAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    rules: Rules;
    rulesId: number = 0;

    searchText: string = '';
    frmRules: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;
    rulesYears: any[];

    minDate: any = { year: 1970, month: 1, day: 1 };

    ngOnInit(): void {
        this.frmRules = this.formBuilder.group({
            RulesId: [''],
            RulesNo: ['', Validators.required],
            RulesName: ['', Validators.required],
            Year: ['', Validators.required],
            PublicationDate: ['', Validators.required],
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let rulesId = this._global.decryptValue(params['rulesId']);

            if (rulesId) {
                this.addUpdateText = "Update";
                this.rulesId = parseInt(rulesId);
                this.EditRules(parseInt(rulesId));
            } else {
                this.GetRulesYear(null);
                this.addUpdateText = "Add";
            }
        });
    }

    EditRules(rulesId: number) {
        this.spinnerService.show();
        
        let getRulesRequest = new GetRulesRequest();
        getRulesRequest.RulesId = rulesId;
        getRulesRequest.IsActive = null;

        this._rulesService.getRules(getRulesRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                let publicationDate = new Date(data.Response[0].PublicationDate);

                this.GetRulesYear(data.Response[0]);

                this.frmRules.setValue({
                    RulesId: rulesId,
                    RulesNo: data.Response[0].RulesNo,
                    RulesName: data.Response[0].RulesName,
                    Year: data.Response[0].Year,
                    PublicationDate: { year: publicationDate.getFullYear(), month: publicationDate.getMonth() + 1, day: publicationDate.getDate() }
                });

                this.frmRules.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    GetRulesYear(rulesData): void {
        this.spinnerService.show();

        this._rulesService.getRulesYear()
            .subscribe(data => {
                this.spinnerService.hide();
                this.rulesYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.rulesYears.push({ YearId: null, YearName: "--Select--" });

                    data.Response.forEach(item => {
                        this.rulesYears.push({ YearId: item, YearName: item });
                    });

                    this.frmRules.get("Year").setValue((rulesData != null) ? rulesData.Year : rulesData);
                    this.frmRules.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    SaveRules(formData) {
        this.spinnerService.show();

        formData.value.PublicationDate = (formData.value.PublicationDate != null) ? formData.value.PublicationDate.year + "/" + formData.value.PublicationDate.month + "/" + formData.value.PublicationDate.day : null;

        if (formData.value.RulesId) {
            this._rulesService.updateRules(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true });
                    });
        } else {
            this._rulesService.addRules(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    ClearDate() {
        this.frmRules.get("PublicationDate").setValue("");
        this.frmRules.updateValueAndValidity();
    }

    OnSubmitRules(formData: any) {
        this.isSubmited = true;

        if (this.frmRules.valid) {
            this.SaveRules(formData);
        }
    }

    CancelRules() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/rules'], {
                queryParams: {
                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
