import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DropDown } from '../../../common/dropDown';

import { RBIData, GetRBIDataRequest } from '../../../model/rBIData';
import { RBIDataDetail, GetRBIDataDetailRequest } from '../../../model/rBIDataDetail';
import { RBIDataUserService } from '../../../service/user/rBIData.service';

@Component({
    selector: 'my-app',
    templateUrl: './rBIODIPopup.component.html'
})

export class RBIODIPopupUserComponent {

    rBIDataDetailPDFServerPath: string = Global.RBIDATA_DETAIL_PDF_FILEPATH;
    rBIDataDetailExcelServerPath: string = Global.RBIDATA_DETAIL_EXCEL_FILEPATH;
    rBIDataExcelServerPath: string = Global.RBIDATA_EXCEL_FILEPATH;
    rBIDataExcelFullPath: string;

    rBIDataDetailYears: DropDown[] = [];
    rBIDataDetailMonths: DropDown[] = [];
    rBIDataDetail: RBIDataDetail = new RBIDataDetail();

    year: number;
    month: number;

    month_name = function (month) {
        let mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return mlist[month];
    };

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.GetRBIDataDetailYear();
    }

    constructor(private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        private _rBIDataService: RBIDataUserService,
        public sanitizer: DomSanitizer) { }

    GetRBIDataDetailYear(): void {
        this._spinnerService.show();

        this._rBIDataService.getRBIDataDetailYears()
            .subscribe(data => {
                this.rBIDataDetailYears = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.rBIDataDetailYears.push({ Value: item, Text: item });
                    });

                    this.GetRBIDataDetailMonth();
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                }
            }, error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRBIDataDetailMonth(): void {
        this.rBIDataDetailMonths = [];

        for (var month = 0; month <= 11; month++)
            this.rBIDataDetailMonths.push({ Value: (month + 1).toString(), Text: this.month_name(month) });

        this.year = parseInt(this.rBIDataDetailYears[0].Value);
        this.month = parseInt(this.rBIDataDetailMonths[0].Value);

        this.GetRBIDataDetail();
    }

    GetRBIDataDetail() {
        this._spinnerService.show();

        let getRBIDataRequest = new GetRBIDataRequest();

        this._rBIDataService.getRBIData(getRBIDataRequest)
            .subscribe(data => {
                this.rBIDataExcelFullPath = this.rBIDataExcelServerPath + data.Response[0].Excel;

                let rBIDataId = (data.Response.length > 0) ? data.Response.filter(x => x.RBIDataName == Global.RBIDATA_ODI_NAME)[0].RBIDataId : null;

                let getRBIDataDetailRequest = new GetRBIDataDetailRequest();
                getRBIDataDetailRequest.RBIDataId = rBIDataId;
                getRBIDataDetailRequest.Year = this.year;
                getRBIDataDetailRequest.Month = this.month;

                this._rBIDataService.getRBIDataDetail(getRBIDataDetailRequest)
                    .subscribe(data => {
                        this._spinnerService.hide();

                        if (data.Status == Global.API_SUCCESS) {
                            if (data.Response.length > 0)
                                this.rBIDataDetail = data.Response[0];
                        }
                        else {
                            this._toastrService.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
                        }

                    },
                        error => {
                            this._spinnerService.hide();
                            this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                        });
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeRBIDataDetailYear(year) {
        this.rBIDataDetail = new RBIDataDetail();
        this.year = year;
        this.GetRBIDataDetail();
    }

    OnChangeRBIDataDetailMonth(month) {
        this.rBIDataDetail = new RBIDataDetail();
        this.month = month;
        this.GetRBIDataDetail();
    }
}