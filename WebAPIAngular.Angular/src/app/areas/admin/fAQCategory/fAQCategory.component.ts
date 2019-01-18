import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FAQCategory, GetFAQCategoryRequest } from '../../../model/fAQCategory';
import { FAQCategoryAdminService } from '../../../service/admin/fAQCategory.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fAQCategory.component.html'
})

export class FAQCategoryAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fAQCategoryService: FAQCategoryAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fAQCategory: FAQCategory;
    fAQCategoryId: number = 0;
    searchText: string = '';
    frmFAQCategory: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmFAQCategory = this.formBuilder.group({
            FAQCategoryId: [''],
            CategoryName: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let fAQCategoryId = this._global.decryptValue(params['fAQCategoryId']);

            if (fAQCategoryId) {
                this.addUpdateText = "Update";
                this.fAQCategoryId = parseInt(fAQCategoryId);
                this.EditFAQCategory(parseInt(fAQCategoryId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    EditFAQCategory(fAQCategoryId: number) {
        this.spinnerService.show();

        let getFAQCategoryRequest = new GetFAQCategoryRequest();
        getFAQCategoryRequest.FAQCategoryId = fAQCategoryId;
        getFAQCategoryRequest.IsActive = null;

        this._fAQCategoryService.getFAQCategory(getFAQCategoryRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.frmFAQCategory.setValue({
                    FAQCategoryId: fAQCategoryId,
                    CategoryName: data.Response[0].CategoryName
                });

                this.frmFAQCategory.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFAQCategory(formData) {
        this.spinnerService.show();

        if (formData.value.FAQCategoryId) {
            this._fAQCategoryService.updateFAQCategory(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/faqcategories']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { enableHtml: true });
                    });
        } else {
            this._fAQCategoryService.addFAQCategory(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/faqcategories']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_CATEGORY_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFAQCategory(formData: any) {
        this.isSubmited = true;

        if (this.frmFAQCategory.valid) {
            this.SaveFAQCategory(formData);
        }
    }

    CancelFAQCategory() {
        this.router.navigate(['/admin/secure/faqcategories']);
    }
}
