import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSector, GetSubSectorRequest } from '../../../model/subSector';
import { Sector, GetSectorRequest } from '../../../model/sector';
//import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
//import { PressNoteNotification, GetPressNoteNotificationRequest } from '../../../model/pressNoteNotification';
//import { PressNoteAPDIRCircular, GetPressNoteAPDIRCircularRequest } from '../../../model/pressNoteAPDIRCircular';
import { SubSectorAdminService } from '../../../service/admin/subSector.service';
import { SectorAdminService } from '../../../service/admin/sector.service';
//import { PressNoteAdminService } from '../../../service/admin/pressNote.service';
//import { PressNoteNotificationAdminService } from '../../../service/admin/pressNoteNotification.service';
//import { PressNoteAPDIRCircularAdminService } from '../../../service/admin/pressNoteAPDIRCircular.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './subSector.component.html'
})

export class SubSectorAdminComponent implements OnInit {

    //constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _subSectorService: SubSectorAdminService, private _sectorService: SectorAdminService, private _pressNoteService: PressNoteAdminService, private _pressNoteNotificationService: PressNoteNotificationAdminService, private _pressNoteAPDIRCircularService: PressNoteAPDIRCircularAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }
    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _subSectorService: SubSectorAdminService, private _sectorService: SectorAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    subSector: SubSector;
    sector: Sector = new Sector();
    subSectorId: number = 0;
    sectorId: number;

    frmSubSector: FormGroup;
    msg: string;

    //pressNotes: PressNote[] = [];
    //notifications: PressNoteNotification[] = [];
    //aPDIRCirculars: PressNoteAPDIRCircular[] = [];
    //subSectorYears: any[];

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let sectorId = this._global.decryptValue(params['sectorId']);
            let subSectorId = this._global.decryptValue(params['subSectorId']);

            this.sectorId = parseInt(sectorId);

            if (sectorId) {
                this.GetSector(this.sectorId);

                if (subSectorId) {
                    this.addUpdateText = "Update";

                    this.subSectorId = parseInt(subSectorId);
                    this.EditSubSector(parseInt(subSectorId));
                } else {
                    //this.GetPressNote(null);

                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/sectors'], {
                        queryParams: {
                            indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmSubSector = this.formBuilder.group({
            SubSectorId: [''],
            SectorId: [this.sectorId],
            Name: ['', Validators.required]
            //Year: ['', Validators.required],
            //PressNoteId: ['', Validators.required],
            //NotificationId: [''],
            //APDIRCircularId: ['']
        });
    }

    //GetSubSectorYear(sectorData): void {
    //    this.spinnerService.show();

    //    this._subSectorService.getSubSectorYear()
    //        .subscribe(data => {
    //            this.spinnerService.hide();
    //            this.subSectorYears = [];

    //            if (data.Status == Global.API_SUCCESS) {

    //                this.subSectorYears.push({ YearId: null, YearName: "--Select--" });

    //                data.Response.forEach(item => {
    //                    this.subSectorYears.push({ YearId: item, YearName: item });
    //                });

    //                this.frmSubSector.get("Year").setValue((sectorData != null) ? sectorData.Year : sectorData);
    //                this.frmSubSector.updateValueAndValidity();
    //            } else {
    //                this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
    //            }
    //        }, error => {
    //            this.spinnerService.hide();
    //            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
    //        });
    //}

    GetSector(sectorId: number) {
        this.spinnerService.show();

        let getSectorRequest = new GetSectorRequest();
        getSectorRequest.SectorId = sectorId;
        getSectorRequest.IsActive = null;

        this._sectorService.getSector(getSectorRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.sector = data.Response[0];
            }, error => this.msg = <any>error);
    }

    //GetPressNote(sectorData): void {
    //    this.spinnerService.show();

    //    let getPressNoteRequest = new GetPressNoteRequest();

    //    this._pressNoteService.getPressNote(getPressNoteRequest)
    //        .subscribe(data => {
    //            //this.spinnerService.hide();

    //            this.GetSubSectorYear(sectorData);

    //            this.pressNotes = [];

    //            if (data.Status == Global.API_SUCCESS) {

    //                this.pressNotes.push({ PressNoteId: null, PressNoteNo: "--Select--", CreatedDate: null, PressNoteDate: null, PressNoteEffectiveDate: null, PressNoteName: null, IsActive: null, IsDeleted: null, ModifiedDate: null, PressNotePDF: null, Year: null });

    //                data.Response.forEach(item => {
    //                    this.pressNotes.push({ PressNoteId: item.PressNoteId, PressNoteNo: item.PressNoteNo, CreatedDate: null, PressNoteDate: null, PressNoteEffectiveDate: null, PressNoteName: null, IsActive: null, IsDeleted: null, ModifiedDate: null, PressNotePDF: null, Year: null });
    //                });

    //                this.frmSubSector.get("PressNoteId").setValue((sectorData != null) ? sectorData.PressNoteId : sectorData);
    //                this.frmSubSector.updateValueAndValidity();

    //                if (sectorData != null) {
    //                    this.GetNotification(sectorData.PressNoteId, sectorData);
    //                    this.GetAPDIRCircular(sectorData.PressNoteId, sectorData);
    //                }
    //            } else {
    //                this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
    //            }
    //        }, error => {
    //            this.spinnerService.hide();
    //            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
    //        });
    //}

    //OnPressNoteChange(pressNoteId: number) {
    //    this.notifications = [];
    //    this.aPDIRCirculars = [];

    //    if (pressNoteId.toString() != 'null') {
    //        this.GetNotification(pressNoteId, null);
    //        this.GetAPDIRCircular(pressNoteId, null);
    //    } else {
    //        this.frmSubSector.get("NotificationId").setValue('');
    //        this.frmSubSector.updateValueAndValidity();
    //        this.frmSubSector.get("APDIRCircularId").setValue('');
    //        this.frmSubSector.updateValueAndValidity();
    //    }
    //}

    //GetNotification(pressNoteId, sectorData): void {
    //    this.spinnerService.show();

    //    let getPressNoteNotificationRequest = new GetPressNoteNotificationRequest();
    //    getPressNoteNotificationRequest.PressNoteId = pressNoteId;

    //    this._pressNoteNotificationService.getPressNoteNotification(getPressNoteNotificationRequest)
    //        .subscribe(data => {
    //            this.spinnerService.hide();
    //            this.notifications = [];

    //            if (data.Status == Global.API_SUCCESS) {

    //                this.notifications.push({ NotificationId: null, NotificationNumber: "--Select--", CreatedDate: null, GSRDate: null, GSRNo: null, GSRPDF: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationDate: null, NotificationEffectiveDate: null, NotificationName: null, NotificationPDF: null, NotificationTypeId: null, NotificationTypeName: null, PressNoteId: null, PressNoteNotificationId: null, RegulationId: null, RegulationNumber: null });

    //                data.Response.forEach(item => {
    //                    this.notifications.push({ NotificationId: item.NotificationId, NotificationNumber: item.NotificationNumber, CreatedDate: null, GSRDate: null, GSRNo: null, GSRPDF: null, IsActive: null, IsDeleted: null, ModifiedDate: null, NotificationDate: null, NotificationEffectiveDate: null, NotificationName: null, NotificationPDF: null, NotificationTypeId: null, NotificationTypeName: null, PressNoteId: null, PressNoteNotificationId: null, RegulationId: null, RegulationNumber: null });
    //                });

    //                this.frmSubSector.get("NotificationId").setValue((sectorData != null) ? sectorData.NotificationId : sectorData);
    //                this.frmSubSector.updateValueAndValidity();
    //            } else {
    //                this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
    //            }
    //        }, error => {
    //            this.spinnerService.hide();
    //            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
    //        });
    //}

    //GetAPDIRCircular(pressNoteId, sectorData): void {
    //    this.spinnerService.show();

    //    let getPressNoteAPDIRCircularRequest = new GetPressNoteAPDIRCircularRequest();
    //    getPressNoteAPDIRCircularRequest.PressNoteId = pressNoteId;

    //    this._pressNoteAPDIRCircularService.getPressNoteAPDIRCircular(getPressNoteAPDIRCircularRequest)
    //        .subscribe(data => {
    //            this.spinnerService.hide();
    //            this.aPDIRCirculars = [];

    //            if (data.Status == Global.API_SUCCESS) {

    //                this.aPDIRCirculars.push({ PressNoteId: null, APDIRCircularId: null, APDIRCircularNo: "--Select--", CreatedDate: null, APDIRCircularDate: null, APDIRCircularEffectiveDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, APDIRCircularName: null, Year: null, APDIRCircularPDF: null, PressNoteAPDIRCircularId: null });

    //                data.Response.forEach(item => {
    //                    this.aPDIRCirculars.push({ PressNoteId: null, APDIRCircularId: item.APDIRCircularId, APDIRCircularNo: item.APDIRCircularNo, CreatedDate: null, APDIRCircularDate: item.APDIRCircularDate, APDIRCircularEffectiveDate: null, IsActive: null, IsDeleted: null, ModifiedDate: null, APDIRCircularName: null, Year: null, APDIRCircularPDF: null, PressNoteAPDIRCircularId: null });
    //                });

    //                this.frmSubSector.get("APDIRCircularId").setValue((sectorData != null) ? sectorData.APDIRCircularId : sectorData);
    //                this.frmSubSector.updateValueAndValidity();
    //            } else {
    //                this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
    //            }
    //        }, error => {
    //            this.spinnerService.hide();
    //            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
    //        });
    //}

    EditSubSector(subSectorId: number) {
        this.spinnerService.show();

        let getSubSectorRequest = new GetSubSectorRequest();
        getSubSectorRequest.SubSectorId = subSectorId;
        getSubSectorRequest.IsActive = null;

        this._subSectorService.getSubSector(getSubSectorRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                //this.GetPressNote(data.Response[0]);

                this.frmSubSector.setValue({
                    SubSectorId: subSectorId,
                    SectorId: data.Response[0].SectorId,
                    Name: data.Response[0].Name
                    //Year: data.Response[0].Year,
                    //PressNoteId: data.Response[0].PressNoteId,
                    //NotificationId: data.Response[0].NotificationId,
                    //APDIRCircularId: data.Response[0].APDIRCircularId
                });

                this.frmSubSector.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveSubSector(formData) {
        this.spinnerService.show();

        if (formData.value.NotificationId == 'null')
            formData.value.NotificationId = null;

        if (formData.value.APDIRCircularId == 'null')
            formData.value.APDIRCircularId = null;

        if (formData.value.SubSectorId) {
            this._subSectorService.updateSubSector(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/sectors'], {
                                queryParams: {
                                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUBSECTOR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUBSECTOR_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBSECTOR_TITLE, { enableHtml: true });
                    });
        } else {
            this._subSectorService.addSubSector(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/sectors'], {
                                queryParams: {
                                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUBSECTOR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUBSECTOR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBSECTOR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitSubSector(formData: any) {
        this.isSubmited = true;

        if (this.frmSubSector.valid) {
            this.SaveSubSector(formData);
        }
    }

    CancelSubSector() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/sectors'], {
                queryParams: {
                    indexSector1: params["indexSector1"], indexSector2: params["indexSector2"], sortingSectorField: params["sortingSectorField"], sortingSectorDirection: params["sortingSectorDirection"], sortingSectorDetailField: params["sortingSectorDetailField"], sortingSectorDetailDirection: params["sortingSectorDetailDirection"], sortingSubSectorField: params["sortingSubSectorField"], sortingSubSectorDirection: params["sortingSubSectorDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
