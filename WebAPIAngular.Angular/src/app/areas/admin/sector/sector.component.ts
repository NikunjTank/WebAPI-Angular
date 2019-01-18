import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sector, GetSectorRequest } from '../../../model/sector';
import { SectorAdminService } from '../../../service/admin/sector.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './sector.component.html'
})

export class SectorAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _sectorService: SectorAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    sector: Sector;
    sectorId: number = 0;
    searchText: string = '';
    frmSector: FormGroup;
    msg: string;

    sectorYears: any[];

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmSector = this.formBuilder.group({
            SectorId: [''],
            Name: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let sectorId = this._global.decryptValue(params['sectorId']);

            if (sectorId) {
                this.addUpdateText = "Update";
                this.sectorId = parseInt(sectorId);
                this.EditSector(parseInt(sectorId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }
    
    EditSector(sectorId: number) {
        this.spinnerService.show();

        let getSectorRequest = new GetSectorRequest();
        getSectorRequest.SectorId = sectorId;
        getSectorRequest.IsActive = null;

        this._sectorService.getSector(getSectorRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                
                this.frmSector.setValue({
                    SectorId: sectorId,
                    Name: data.Response[0].Name
                });

                this.frmSector.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveSector(formData) {
        this.spinnerService.show();

        if (formData.value.NotificationId == 'null')
            formData.value.NotificationId = null;

        if (formData.value.APDIRCircularId == 'null')
            formData.value.APDIRCircularId = null;

        if (formData.value.SectorId) {
            this._sectorService.updateSector(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/sectors'], {
                                queryParams: {
                                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true });
                    });
        } else {
            this._sectorService.addSector(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/sectors'], {
                                queryParams: {
                                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitSector(formData: any) {
        this.isSubmited = true;

        if (this.frmSector.valid) {
            this.SaveSector(formData);
        }
    }

    CancelSector() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/sectors'], {
                queryParams: {
                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
