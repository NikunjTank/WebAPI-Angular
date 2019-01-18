import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterCircular, GetMasterCircularRequest } from '../../../model/masterCircular';
import { MasterCircularAdminService } from '../../../service/admin/masterCircular.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterCircular.component.html'
})

export class MasterCircularAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterCircularService: MasterCircularAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    masterCircular: MasterCircular;
    masterCircularId: number = 0;
    searchText: string = '';
    frmMasterCircular: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmMasterCircular = this.formBuilder.group({
            MasterCircularId: [''],
            MasterCircularName: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let masterCircularId = this._global.decryptValue(params['masterCircularId']);

            if (masterCircularId) {
                this.addUpdateText = "Update";
                this.masterCircularId = parseInt(masterCircularId);
                this.EditMasterCircular(parseInt(masterCircularId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    EditMasterCircular(masterCircularId: number) {
        this.spinnerService.show();

        let getMasterCircularRequest = new GetMasterCircularRequest();
        getMasterCircularRequest.MasterCircularId = masterCircularId;
        getMasterCircularRequest.IsActive = null;

        this._masterCircularService.getMasterCircular(getMasterCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.frmMasterCircular.setValue({
                    MasterCircularId: masterCircularId,
                    MasterCircularName: data.Response[0].MasterCircularName
                });

                this.frmMasterCircular.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterCircular(formData) {
        this.spinnerService.show();

        if (formData.value.MasterCircularId) {
            this._masterCircularService.updateMasterCircular(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/mastercirculars']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterCircularService.addMasterCircular(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/mastercirculars']).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitMasterCircular(formData: any) {
        this.isSubmited = true;

        if (this.frmMasterCircular.valid) {
            this.SaveMasterCircular(formData);
        }
    }

    CancelMasterCircular() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/mastercirculars']);
        });
    }
}
