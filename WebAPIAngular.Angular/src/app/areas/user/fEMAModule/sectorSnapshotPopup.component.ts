import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DropDown } from '../../../common/dropDown';

import { Sector, GetSectorRequest } from '../../../model/sector';
import { SubSector, GetSubSectorRequest } from '../../../model/subSector';
import { SectorDetail, GetSectorDetailRequest } from '../../../model/sectorDetail';

import { SectorUserService } from '../../../service/user/sector.service';

@Component({
    selector: 'my-app',
    templateUrl: './sectorSnapshotPopup.component.html'
})

export class SectorSnapshotPopupUserComponent {

    sectors: DropDown[] = [];
    subSectors: DropDown[] = [];
    sectorDetails: any = [];

    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    pressNotePDFServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;
    notificationPDFServerPath: string = Global.NOTIFICATION_PDF_FILEPATH;
    aPDIRCircularPDFServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;

    sectorId: number;
    subSectorId: number;

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.GetSector();
    }

    constructor(private formBuilder: FormBuilder,
        private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        private _sectorService: SectorUserService,
        public sanitizer: DomSanitizer) { }

    GetSector() {
        this._spinnerService.show();

        let getSectorRequest = new GetSectorRequest();

        this._sectorService.getSector(getSectorRequest)
            .subscribe(data => {
                this.sectors = [];

                if (data.Status == Global.API_SUCCESS) {
                    //this.sectors.push({ Value: "", Text: "Select All Sector" });

                    data.Response.sort().forEach(item => {
                        this.sectors.push({ Value: item.SectorId, Text: item.Name });
                    });

                    if (this.sectors.length > 0) {
                        this.sectorId = parseInt(this.sectors[0].Value);
                        this.GetSubSector();
                    }
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetSubSector() {
        this._spinnerService.show();

        let getSubSectorRequest = new GetSubSectorRequest();
        getSubSectorRequest.SectorId = this.sectorId;

        this._sectorService.getSubSector(getSubSectorRequest)
            .subscribe(data => {
                this.subSectors = [];

                if (data.Status == Global.API_SUCCESS) {
                    //this.subSectors.push({ Value: "", Text: "Select All SubSector" });

                    if (this.sectorId) {
                        data.Response.forEach(item => {
                            this.subSectors.push({ Value: item.SubSectorId, Text: item.Name });
                        });

                        if (this.subSectors.length > 0)
                            this.subSectorId = parseInt(this.subSectors[0].Value);
                    }
                    this.GetSectorDetail();
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_SUBSECTOR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBSECTOR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetSectorDetail(): void {
        this._spinnerService.show();

        let getSectorDetailRequest = new GetSectorDetailRequest();
        getSectorDetailRequest.SectorId = this.sectorId;
        getSectorDetailRequest.SubSectorId = this.subSectorId;
        
        this._sectorService.getSectorDetail(getSectorDetailRequest)
            .subscribe(data => {
                this._spinnerService.hide();
                this.sectorDetails = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.sectorDetails.push({ Year: item.Year, PressNoteNos: item.PressNoteNos.split(', '), NotificationNos: item.NotificationNos.split(', '), APDIRCircularNos: item.APDIRCircularNos.split(', '), PressNotePDFs: item.PressNotePDFs.split(', '), NotificationPDFs: item.NotificationPDFs.split(', '), APDIRCircularPDFs: item.APDIRCircularPDFs.split(', ') });
                    });
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeSector(sectorId) {
        this.sectorId = sectorId;
        this.subSectorId = null;

        this.GetSubSector();
    }

    OnChangeSubSector(subSectorId) {
        this.subSectorId = subSectorId;

        this.GetSectorDetail();
    }
}