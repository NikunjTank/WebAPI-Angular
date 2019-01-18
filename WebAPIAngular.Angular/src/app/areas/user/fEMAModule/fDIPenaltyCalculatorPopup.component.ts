import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { CalculatorSubTopic, GetCalculatorSubTopicRequest } from '../../../model/calculatorSubTopic';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DropDown } from '../../../common/dropDown';

import { PenaltyDetail, GetPenaltyDetailRequest } from '../../../model/penaltyDetail';
import { PenaltyDetailUserService } from '../../../service/user/penaltyDetail.service';
import { CalculatorSubTopicUserService } from '../../../service/user/calculatorSubTopic.service';

declare var jsPDF: any;

@Component({
    selector: 'my-app',
    templateUrl: './fDIPenaltyCalculatorPopup.component.html'
})

export class FDIPenaltyCalculatorPopupUserComponent {

    moduleTab: string = "illustration1";

    penaltyDetails: PenaltyDetail[];

    illustration1Data: Array<any> = [];
    illustration1FieldArray: Array<any> = [];
    illustration1NewAttribute: any = { ReceiptMinDate: { year: 1970, month: 1, day: 1 }, ReportingMinDate: { year: 1970, month: 1, day: 1 } };
    sumOfIllustration1Amount: string;
    sumOfIllustration1AmountImposed: string;
    illustration1FixedAmount: number = 0;
    totalOfIllustration1AmountImposed: string;

    isDisabledIllustration1: boolean = false;

    illustration2Data: Array<any> = [];
    illustration2FieldArray: Array<any> = [];
    illustration2NewAttribute: any = { ReceiptMinDate: { year: 1970, month: 1, day: 1 }, ReportingMinDate: { year: 1970, month: 1, day: 1 } };
    sumOfIllustration2Amount: string;
    sumOfIllustration2AmountImposed: string;
    illustration2FixedAmount: number = 0;
    totalOfIllustration2AmountImposed: string;

    isDisabledIllustration2: boolean = false;

    illustration3Data: Array<any> = [];
    illustration3FieldArray: Array<any> = [];
    illustration3NewAttribute: any = { ReceiptMinDate: { year: 1970, month: 1, day: 1 }, ReportingMinDate: { year: 1970, month: 1, day: 1 } };
    sumOfIllustration3Amount: string;
    sumOfIllustration3AmountImposed: string;
    illustration3FixedAmount: number = 0;
    totalOfIllustration3AmountImposed: string;

    isDisabledIllustration3: boolean = false;

    calculatorSubTopics: DropDown[] = [];
    calculatorSubTopicId: string = "";

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.OnClickModuleTab('illustration1');
        this.GetPenaltyDetail();
    }

    constructor(private formBuilder: FormBuilder,
        private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        private _penaltyDetailService: PenaltyDetailUserService,
        private _calculatorSubTopicService: CalculatorSubTopicUserService,
        public sanitizer: DomSanitizer) { }

    GetPenaltyDetail() {
        this._spinnerService.show();

        let getPenaltyDetailRequest = new GetPenaltyDetailRequest();
        getPenaltyDetailRequest.CalculatorID = Global.COMMON_FIELD_FDI_PENALTY_CALCULATOR;

        this._penaltyDetailService.getPenaltyDetail(getPenaltyDetailRequest)
            .subscribe(data => {
                //this._spinnerService.hide();
                this.GetCalculatorSubTopic();

                if (data.Status == Global.API_SUCCESS) {
                    this.penaltyDetails = data.Response;
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_PENALTY_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PENALTY_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    RemoveIllustration1Details(index) {
        let rowIndexToRemove = index + 1;
        if (rowIndexToRemove < this.illustration1FieldArray.length) {
            this.illustration1FieldArray.splice(rowIndexToRemove, this.illustration1FieldArray.length - rowIndexToRemove);
        }

        if (this.illustration1FieldArray.length > 0) {
            let newReceiptMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration1FieldArray[index]);
            this.illustration1NewAttribute = { ReceiptMinDate: { year: newReceiptMinimumDate.getFullYear(), month: newReceiptMinimumDate.getMonth() + 1, day: newReceiptMinimumDate.getDate() } };
        } else {
            this.illustration1NewAttribute = { ReceiptMinDate: { year: 1970, month: 1, day: 1 } };

        }
    }

    addIllustration1FieldValue() {
        if (!this.isDisabledIllustration1) {
            if (this.illustration1NewAttribute.ReceiptDate != undefined) {
                this.illustration1FieldArray.push(this.illustration1NewAttribute);

                let newReceiptMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration1NewAttribute);
                this.illustration1NewAttribute = { ReceiptMinDate: { year: newReceiptMinimumDate.getFullYear(), month: newReceiptMinimumDate.getMonth() + 1, day: newReceiptMinimumDate.getDate() } };
            }
            else {
                this._toastrService.error("Receipt date is required", Global.TOASTR_FDI_PENALTY_CALCULATOR_TITLE);
            }
        }
    }

    deleteIllustration1FieldValue(index) {
        if (!this.isDisabledIllustration1) {
            this.illustration1FieldArray.splice(index, 1);
            this.RemoveIllustration1Details(index - 1);
        }
    }

    OnChangeIllustration1ReceiptDateResetNewData() {
        if (this.illustration1NewAttribute.ReportingDate) {
            delete this.illustration1NewAttribute.ReportingDate;
            delete this.illustration1NewAttribute.Delay;
            delete this.illustration1NewAttribute.ContraventionPeriod;
            delete this.illustration1NewAttribute.VariableAmount;
            delete this.illustration1NewAttribute.AmountImposed;
        }
    }

    OnChangeIllustration1ReceiptDateResetArrayData(index) {
        if (this.illustration1FieldArray[index].ReportingDate) {
            delete this.illustration1FieldArray[index].ReportingDate;
            delete this.illustration1FieldArray[index].Delay;
            delete this.illustration1FieldArray[index].ContraventionPeriod;
            delete this.illustration1FieldArray[index].VariableAmount;
            delete this.illustration1FieldArray[index].AmountImposed;
        }
    }

    GetNewReportingMinimumDate(illustration1Detail) {
        let currentReceiptDate: any = new Date(illustration1Detail.ReceiptDate.year + '-' + illustration1Detail.ReceiptDate.month + '-' + illustration1Detail.ReceiptDate.day);
        let day: any = 60 * 60 * 24 * 1000;
        return new Date(currentReceiptDate.getTime() + day);
    }

    OnChangeIllustration1NewFieldValue() {
        if (this.illustration1NewAttribute.ReceiptDate) {
            let newReportingMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration1NewAttribute);
            this.illustration1NewAttribute.ReportingMinDate = { year: newReportingMinimumDate.getFullYear(), month: newReportingMinimumDate.getMonth() + 1, day: newReportingMinimumDate.getDate() };
        }

        if (!isNaN(Number(this.illustration1NewAttribute.Amount))) {
            delete this.illustration1NewAttribute.VariableAmount;

            if (this.illustration1NewAttribute.ReceiptDate && this.illustration1NewAttribute.ReportingDate) {
                let receiptDate: any = new Date(this.illustration1NewAttribute.ReceiptDate.year + '-' + this.illustration1NewAttribute.ReceiptDate.month + '-' + this.illustration1NewAttribute.ReceiptDate.day);
                let reportingDate: any = new Date(this.illustration1NewAttribute.ReportingDate.year + '-' + this.illustration1NewAttribute.ReportingDate.month + '-' + this.illustration1NewAttribute.ReportingDate.day);
                let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - receiptDate);
                let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
                let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
                let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

                if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration1NewAttribute.Delay = (yearNo == 0) ? '' : yearNo + ' year ';
                    this.illustration1NewAttribute.Delay += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
                    this.illustration1NewAttribute.Delay += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
                } else {
                    this.illustration1NewAttribute.Delay = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                        (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                            (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                                (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                                    (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                        (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';
                }

                this.illustration1NewAttribute.ContraventionPeriod = (yearNo + (monthNo / 12) + (dayNo / 365)).toFixed(2);

                if (this.illustration1NewAttribute.Amount) {
                    let range = "";
                    let tempPenaltyDetails = this.penaltyDetails;

                    if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                        if (this.illustration1NewAttribute.Amount <= 1000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_UPTO_10_LAKHS;
                        else if (this.illustration1NewAttribute.Amount > 1000000 && this.illustration1NewAttribute.Amount <= 4000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_40_LAKHS;
                        else if (this.illustration1NewAttribute.Amount > 4000000 && this.illustration1NewAttribute.Amount <= 10000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_40_TO_100_LAKHS;
                        else if (this.illustration1NewAttribute.Amount > 10000000 && this.illustration1NewAttribute.Amount <= 100000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_10_CRORE;
                        else if (this.illustration1NewAttribute.Amount > 100000000 && this.illustration1NewAttribute.Amount <= 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_100_CRORE;
                        else if (this.illustration1NewAttribute.Amount > 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_ABOVE_100_CRORE;

                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.Range == range);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration1NewAttribute.VariableAmount = tempPenaltyDetails[0].Amount;
                            this.illustration1NewAttribute.AmountImposed = this.illustration1NewAttribute.ContraventionPeriod * this.illustration1NewAttribute.VariableAmount;
                            this.illustration1NewAttribute.AmountImposed = Math.round(this.illustration1NewAttribute.AmountImposed);
                        }
                    } else {
                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.RangeAfter07November2017 == this.illustration1NewAttribute.Delay);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration1NewAttribute.VariableAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                            this.illustration1NewAttribute.AmountImposed = this.illustration1NewAttribute.Amount * this.illustration1NewAttribute.VariableAmount;
                            this.illustration1NewAttribute.AmountImposed = Math.round(this.illustration1NewAttribute.AmountImposed);
                        }
                    }
                }
            }
        } else {
            delete this.illustration1NewAttribute.Amount;
            delete this.illustration1NewAttribute.ContraventionPeriod;
            delete this.illustration1NewAttribute.VariableAmount;
            delete this.illustration1NewAttribute.AmountImposed;
        }
    }

    OnChangeIllustration1ArrayFieldValue(index) {
        if (this.illustration1FieldArray[index].ReceiptDate) {
            let newReportingMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration1FieldArray[index]);
            this.illustration1FieldArray[index].ReportingMinDate = { year: newReportingMinimumDate.getFullYear(), month: newReportingMinimumDate.getMonth() + 1, day: newReportingMinimumDate.getDate() };
        }

        if (!isNaN(Number(this.illustration1FieldArray[index].Amount))) {
            delete this.illustration1FieldArray[index].VariableAmount;

            if (this.illustration1FieldArray[index].ReceiptDate && this.illustration1FieldArray[index].ReportingDate) {
                let receiptDate: any = new Date(this.illustration1FieldArray[index].ReceiptDate.year + '-' + this.illustration1FieldArray[index].ReceiptDate.month + '-' + this.illustration1FieldArray[index].ReceiptDate.day);
                let reportingDate: any = new Date(this.illustration1FieldArray[index].ReportingDate.year + '-' + this.illustration1FieldArray[index].ReportingDate.month + '-' + this.illustration1FieldArray[index].ReportingDate.day);
                let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - receiptDate);
                let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
                let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
                let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

                if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration1FieldArray[index].Delay = (yearNo == 0) ? '' : yearNo + ' year ';
                    this.illustration1FieldArray[index].Delay += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
                    this.illustration1FieldArray[index].Delay += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
                } else {
                    this.illustration1FieldArray[index].Delay = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                        (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                            (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                                (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                                    (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                        (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';
                }

                this.illustration1FieldArray[index].ContraventionPeriod = (yearNo + (monthNo / 12) + (dayNo / 365)).toFixed(2);

                if (this.illustration1FieldArray[index].Amount) {
                    let range = "";
                    let tempPenaltyDetails = this.penaltyDetails;

                    if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                        if (this.illustration1FieldArray[index].Amount <= 1000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_UPTO_10_LAKHS;
                        else if (this.illustration1FieldArray[index].Amount > 1000000 && this.illustration1FieldArray[index].Amount <= 4000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_40_LAKHS;
                        else if (this.illustration1FieldArray[index].Amount > 4000000 && this.illustration1FieldArray[index].Amount <= 10000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_40_TO_100_LAKHS;
                        else if (this.illustration1FieldArray[index].Amount > 10000000 && this.illustration1FieldArray[index].Amount <= 100000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_10_CRORE;
                        else if (this.illustration1FieldArray[index].Amount > 100000000 && this.illustration1FieldArray[index].Amount <= 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_100_CRORE;
                        else if (this.illustration1FieldArray[index].Amount > 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_ABOVE_100_CRORE;

                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.Range == range);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration1FieldArray[index].VariableAmount = tempPenaltyDetails[0].Amount;
                            this.illustration1FieldArray[index].AmountImposed = this.illustration1FieldArray[index].ContraventionPeriod * this.illustration1FieldArray[index].VariableAmount;
                            this.illustration1FieldArray[index].AmountImposed = Math.round(this.illustration1FieldArray[index].AmountImposed);
                        }
                    } else {
                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.RangeAfter07November2017 == this.illustration1FieldArray[index].Delay);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration1FieldArray[index].VariableAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                            this.illustration1FieldArray[index].AmountImposed = this.illustration1FieldArray[index].Amount * this.illustration1FieldArray[index].VariableAmount;
                            this.illustration1FieldArray[index].AmountImposed = Math.round(this.illustration1FieldArray[index].AmountImposed);
                        }
                    }
                }
            }
        } else {
            delete this.illustration1FieldArray[index].Amount;
            delete this.illustration1FieldArray[index].ContraventionPeriod;
            delete this.illustration1FieldArray[index].VariableAmount;
            delete this.illustration1FieldArray[index].AmountImposed;
        }
    }

    OnClickIllustration1Save() {
        if (this.illustration1FieldArray.length > 0 || (this.illustration1NewAttribute.ReceiptDate && this.illustration1NewAttribute.Amount && this.illustration1NewAttribute.ReportingDate)) {
            this.isDisabledIllustration1 = true;
            this.illustration1Data = [];

            this.illustration1FieldArray.forEach(item => {
                if (item.ReceiptDate && item.ReportingDate && item.Amount) {
                    item.Amount = Math.round(item.Amount);
                    item.AmountImposed = Math.round(item.AmountImposed);
                    this.illustration1Data.push(item);
                }
            });

            if (this.illustration1NewAttribute.ReceiptDate && this.illustration1NewAttribute.ReportingDate && this.illustration1NewAttribute.Amount) {
                this.illustration1NewAttribute.Amount = Math.round(this.illustration1NewAttribute.Amount);
                this.illustration1NewAttribute.AmountImposed = Math.round(this.illustration1NewAttribute.AmountImposed);
                this.illustration1Data.push(this.illustration1NewAttribute);
            }

            this.sumOfIllustration1Amount = Math.round(this.illustration1Data.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.Amount); }, 0)).toString();
            this.sumOfIllustration1AmountImposed = Math.round(this.illustration1Data.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.AmountImposed); }, 0)).toString();

            this.illustration1Data.forEach(item => {
                let tempPenaltyDetails = this.penaltyDetails.filter(x => x.IsFixedPenalty == true && x.CalculatorSubTopicID == null);
                let receiptDate: any = new Date(item.ReceiptDate.year + '-' + item.ReceiptDate.month + '-' + item.ReceiptDate.day);

                if (receiptDate > Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration1FixedAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                    return;
                } else {
                    this.illustration1FixedAmount = tempPenaltyDetails[0].Amount;
                }
            });

            this.totalOfIllustration1AmountImposed = Math.round(this.illustration1FixedAmount + parseFloat(this.sumOfIllustration1AmountImposed)).toString();
        } else {
            this._toastrService.error("Must be required filled one row.", Global.TOASTR_ADMIN_PENALTY_DETAIL_TITLE);
        }
    }

    OnClickIllustration1Cancel() {
        this.isDisabledIllustration1 = false;
        this.illustration1Data = [];
        this.illustration1FieldArray = [];
        this.illustration1NewAttribute = { ReceiptMinDate: { year: 1970, month: 1, day: 1 }, ReportingMinDate: { year: 1970, month: 1, day: 1 } };
        this.sumOfIllustration1Amount = "";
        this.sumOfIllustration1AmountImposed = "";
        this.illustration1FixedAmount = 0;
        this.totalOfIllustration1AmountImposed = "";
    }

    OnClickIllustration1Print() {
        var columns = ["Date of \nreceipt", "Amount \n(Rs.)", "Date of \nReporting \nto RBI", "Delay", "Period of \ncontravention \n(years)", "Variable Amount \napplicable as per \npara I.1 of \nGuidance Note", "Amount \nimposed \n(Rs.)"];
        var rows = [];

        this.illustration1Data.forEach(item => {
            rows.push([item.ReceiptDate.day + '-' + item.ReceiptDate.month + '-' + item.ReceiptDate.year, item.Amount, item.ReportingDate.day + '-' + item.ReportingDate.month + '-' + item.ReportingDate.year, item.Delay, item.ContraventionPeriod, item.VariableAmount, item.AmountImposed]);
        });

        rows.push(["", this.sumOfIllustration1Amount, "", "", "", "Variable Amount", this.sumOfIllustration1AmountImposed]);
        rows.push(["", "", "", "", "", "Fixed Amount", this.illustration1FixedAmount]);
        rows.push(["", "", "", "", "", "Total Imposed", this.totalOfIllustration1AmountImposed]);

        var doc = new jsPDF('p', 'pt');
        doc.setFontSize(12);
        doc.text(40, 50, 'Illustration I - Contravention of Para 9(1)(A) of Schedule 1 to Notification No.FEMA20/2000-RB');
        doc.autoTable(columns, rows, {
            createdCell: function (cell, data) {
                if (data.row.index >= rows.length - 3) {
                    cell.styles.fontStyle = 'bold';
                }
            },
            margin: { top: 70 },
            styles: {

            },
            addPageContent: function (data) {
            }
        });

        doc.save('FDI Penalty Calculator.pdf'); // Generated PDF
    }

    RemoveIllustration2Details(index) {
        let rowIndexToRemove = index + 1;
        if (rowIndexToRemove < this.illustration2FieldArray.length) {
            this.illustration2FieldArray.splice(rowIndexToRemove, this.illustration2FieldArray.length - rowIndexToRemove);
        }

        if (this.illustration2FieldArray.length > 0) {
            let newReceiptMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration2FieldArray[index]);
            this.illustration2NewAttribute = { ReceiptMinDate: { year: newReceiptMinimumDate.getFullYear(), month: newReceiptMinimumDate.getMonth() + 1, day: newReceiptMinimumDate.getDate() } };
        } else {
            this.illustration2NewAttribute = { ReceiptMinDate: { year: 1970, month: 1, day: 1 } };

        }
    }

    addIllustration2FieldValue() {
        if (!this.isDisabledIllustration2) {
            if (this.illustration2NewAttribute.ReceiptDate != undefined) {
                this.illustration2FieldArray.push(this.illustration2NewAttribute);

                let newReceiptMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration2NewAttribute);
                this.illustration2NewAttribute = { ReceiptMinDate: { year: newReceiptMinimumDate.getFullYear(), month: newReceiptMinimumDate.getMonth() + 1, day: newReceiptMinimumDate.getDate() } };
            }
            else {
                this._toastrService.error("Receipt date is required", Global.TOASTR_FDI_PENALTY_CALCULATOR_TITLE);
            }
        }
    }

    deleteIllustration2FieldValue(index) {
        if (!this.isDisabledIllustration2) {
            this.illustration2FieldArray.splice(index, 1);
            this.RemoveIllustration2Details(index - 1);
        }
    }

    OnChangeIllustration2ReceiptDateResetNewData() {
        if (this.illustration2NewAttribute.ReportingDate) {
            delete this.illustration2NewAttribute.ReportingDate;
            delete this.illustration2NewAttribute.Delay;
            delete this.illustration2NewAttribute.ContraventionPeriod;
            delete this.illustration2NewAttribute.VariableAmount;
            delete this.illustration2NewAttribute.AmountImposed;
        }
    }

    OnChangeIllustration2ReceiptDateResetArrayData(index) {
        if (this.illustration2FieldArray[index].ReportingDate) {
            delete this.illustration2FieldArray[index].ReportingDate;
            delete this.illustration2FieldArray[index].Delay;
            delete this.illustration2FieldArray[index].ContraventionPeriod;
            delete this.illustration2FieldArray[index].VariableAmount;
            delete this.illustration2FieldArray[index].AmountImposed;
        }
    }

    OnChangeIllustration2NewFieldValue() {
        if (this.illustration2NewAttribute.ReceiptDate) {
            let newReportingMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration2NewAttribute);
            this.illustration2NewAttribute.ReportingMinDate = { year: newReportingMinimumDate.getFullYear(), month: newReportingMinimumDate.getMonth() + 1, day: newReportingMinimumDate.getDate() };
        }

        if (!isNaN(Number(this.illustration2NewAttribute.Amount))) {
            delete this.illustration2NewAttribute.VariableAmount;

            if (this.illustration2NewAttribute.ReceiptDate && this.illustration2NewAttribute.ReportingDate) {
                let receiptDate: any = new Date(this.illustration2NewAttribute.ReceiptDate.year + '-' + this.illustration2NewAttribute.ReceiptDate.month + '-' + this.illustration2NewAttribute.ReceiptDate.day);
                let reportingDate: any = new Date(this.illustration2NewAttribute.ReportingDate.year + '-' + this.illustration2NewAttribute.ReportingDate.month + '-' + this.illustration2NewAttribute.ReportingDate.day);
                let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - receiptDate);
                let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
                let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
                let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

                if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration2NewAttribute.Delay = (yearNo == 0) ? '' : yearNo + ' year ';
                    this.illustration2NewAttribute.Delay += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
                    this.illustration2NewAttribute.Delay += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
                } else {
                    this.illustration2NewAttribute.Delay = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                        (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                            (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                                (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                                    (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                        (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';
                }

                this.illustration2NewAttribute.ContraventionPeriod = (yearNo + (monthNo / 12) + (dayNo / 365)).toFixed(2);

                if (this.illustration2NewAttribute.Amount) {
                    let range = "";
                    let tempPenaltyDetails = this.penaltyDetails;

                    if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                        if (this.illustration2NewAttribute.Amount <= 1000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_UPTO_10_LAKHS;
                        else if (this.illustration2NewAttribute.Amount > 1000000 && this.illustration2NewAttribute.Amount <= 4000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_40_LAKHS;
                        else if (this.illustration2NewAttribute.Amount > 4000000 && this.illustration2NewAttribute.Amount <= 10000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_40_TO_100_LAKHS;
                        else if (this.illustration2NewAttribute.Amount > 10000000 && this.illustration2NewAttribute.Amount <= 100000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_10_CRORE;
                        else if (this.illustration2NewAttribute.Amount > 100000000 && this.illustration2NewAttribute.Amount <= 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_100_CRORE;
                        else if (this.illustration2NewAttribute.Amount > 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_ABOVE_100_CRORE;

                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.Range == range);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration2NewAttribute.VariableAmount = tempPenaltyDetails[0].Amount;
                            this.illustration2NewAttribute.AmountImposed = this.illustration2NewAttribute.ContraventionPeriod * this.illustration2NewAttribute.VariableAmount;
                            this.illustration2NewAttribute.AmountImposed = Math.round(this.illustration2NewAttribute.AmountImposed);
                        }
                    } else {
                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.RangeAfter07November2017 == this.illustration2NewAttribute.Delay);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration2NewAttribute.VariableAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                            this.illustration2NewAttribute.AmountImposed = this.illustration2NewAttribute.Amount * this.illustration2NewAttribute.VariableAmount;
                            this.illustration2NewAttribute.AmountImposed = Math.round(this.illustration2NewAttribute.AmountImposed);
                        }
                    }
                }
            }
        } else {
            delete this.illustration2NewAttribute.Amount;
            delete this.illustration2NewAttribute.ContraventionPeriod;
            delete this.illustration2NewAttribute.VariableAmount;
            delete this.illustration2NewAttribute.AmountImposed;
        }
    }

    OnChangeIllustration2ArrayFieldValue(index) {
        if (this.illustration2FieldArray[index].ReceiptDate) {
            let newReportingMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration2FieldArray[index]);
            this.illustration2FieldArray[index].ReportingMinDate = { year: newReportingMinimumDate.getFullYear(), month: newReportingMinimumDate.getMonth() + 1, day: newReportingMinimumDate.getDate() };
        }

        if (!isNaN(Number(this.illustration2FieldArray[index].Amount))) {
            delete this.illustration2FieldArray[index].VariableAmount;

            if (this.illustration2FieldArray[index].ReceiptDate && this.illustration2FieldArray[index].ReportingDate) {
                let receiptDate: any = new Date(this.illustration2FieldArray[index].ReceiptDate.year + '-' + this.illustration2FieldArray[index].ReceiptDate.month + '-' + this.illustration2FieldArray[index].ReceiptDate.day);
                let reportingDate: any = new Date(this.illustration2FieldArray[index].ReportingDate.year + '-' + this.illustration2FieldArray[index].ReportingDate.month + '-' + this.illustration2FieldArray[index].ReportingDate.day);
                let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - receiptDate);
                let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
                let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
                let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

                if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration2FieldArray[index].Delay = (yearNo == 0) ? '' : yearNo + ' year ';
                    this.illustration2FieldArray[index].Delay += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
                    this.illustration2FieldArray[index].Delay += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
                } else {
                    this.illustration2FieldArray[index].Delay = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                        (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                            (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                                (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                                    (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                        (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';
                }

                this.illustration2FieldArray[index].ContraventionPeriod = (yearNo + (monthNo / 12) + (dayNo / 365)).toFixed(2);

                if (this.illustration2FieldArray[index].Amount) {
                    let range = "";
                    let tempPenaltyDetails = this.penaltyDetails;

                    if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                        if (this.illustration2FieldArray[index].Amount <= 1000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_UPTO_10_LAKHS;
                        else if (this.illustration2FieldArray[index].Amount > 1000000 && this.illustration2FieldArray[index].Amount <= 4000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_40_LAKHS;
                        else if (this.illustration2FieldArray[index].Amount > 4000000 && this.illustration2FieldArray[index].Amount <= 10000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_40_TO_100_LAKHS;
                        else if (this.illustration2FieldArray[index].Amount > 10000000 && this.illustration2FieldArray[index].Amount <= 100000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_10_CRORE;
                        else if (this.illustration2FieldArray[index].Amount > 100000000 && this.illustration2FieldArray[index].Amount <= 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_100_CRORE;
                        else if (this.illustration2FieldArray[index].Amount > 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_ABOVE_100_CRORE;

                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.Range == range);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration2FieldArray[index].VariableAmount = tempPenaltyDetails[0].Amount;
                            this.illustration2FieldArray[index].AmountImposed = this.illustration2FieldArray[index].ContraventionPeriod * this.illustration2FieldArray[index].VariableAmount;
                            this.illustration2FieldArray[index].AmountImposed = Math.round(this.illustration2FieldArray[index].AmountImposed);
                        }
                    } else {
                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == null && x.RangeAfter07November2017 == this.illustration2FieldArray[index].Delay);

                        if (tempPenaltyDetails.length > 0) {
                            this.illustration2FieldArray[index].VariableAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                            this.illustration2FieldArray[index].AmountImposed = this.illustration2FieldArray[index].Amount * this.illustration2FieldArray[index].VariableAmount;
                            this.illustration2FieldArray[index].AmountImposed = Math.round(this.illustration2FieldArray[index].AmountImposed);
                        }
                    }
                }
            }
        } else {
            delete this.illustration2FieldArray[index].Amount;
            delete this.illustration2FieldArray[index].ContraventionPeriod;
            delete this.illustration2FieldArray[index].VariableAmount;
            delete this.illustration2FieldArray[index].AmountImposed;
        }
    }

    OnClickIllustration2Save() {
        if (this.illustration2FieldArray.length > 0 || (this.illustration2NewAttribute.ReceiptDate && this.illustration2NewAttribute.Amount && this.illustration2NewAttribute.ReportingDate)) {
            this.isDisabledIllustration2 = true;
            this.illustration2Data = [];

            this.illustration2FieldArray.forEach(item => {
                if (item.ReceiptDate && item.ReportingDate && item.Amount) {
                    item.Amount = Math.round(item.Amount);
                    item.AmountImposed = Math.round(item.AmountImposed);
                    this.illustration2Data.push(item);
                }
            });

            if (this.illustration2NewAttribute.ReceiptDate && this.illustration2NewAttribute.ReportingDate && this.illustration2NewAttribute.Amount) {
                this.illustration2NewAttribute.Amount = Math.round(this.illustration2NewAttribute.Amount);
                this.illustration2NewAttribute.AmountImposed = Math.round(this.illustration2NewAttribute.AmountImposed);
                this.illustration2Data.push(this.illustration2NewAttribute);
            }

            this.sumOfIllustration2Amount = Math.round(this.illustration2Data.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.Amount); }, 0)).toString();
            this.sumOfIllustration2AmountImposed = Math.round(this.illustration2Data.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.AmountImposed); }, 0)).toString();

            this.illustration2Data.forEach(item => {
                let tempPenaltyDetails = this.penaltyDetails.filter(x => x.IsFixedPenalty == true && x.CalculatorSubTopicID == null);
                let receiptDate: any = new Date(item.ReceiptDate.year + '-' + item.ReceiptDate.month + '-' + item.ReceiptDate.day);

                if (receiptDate > Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration2FixedAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                    return;
                } else {
                    this.illustration2FixedAmount = tempPenaltyDetails[0].Amount;
                }
            });

            this.totalOfIllustration2AmountImposed = Math.round(this.illustration2FixedAmount + parseFloat(this.sumOfIllustration2AmountImposed)).toString();
        } else {
            this._toastrService.error("Must be required filled one row.", Global.TOASTR_ADMIN_PENALTY_DETAIL_TITLE);
        }
    }

    OnClickIllustration2Cancel() {
        this.isDisabledIllustration2 = false;
        this.illustration2Data = [];
        this.illustration2FieldArray = [];
        this.illustration2NewAttribute = { ReceiptMinDate: { year: 1970, month: 1, day: 1 }, ReportingMinDate: { year: 1970, month: 1, day: 1 } };
        this.sumOfIllustration2Amount = "";
        this.sumOfIllustration2AmountImposed = "";
        this.illustration2FixedAmount = 0;
        this.totalOfIllustration2AmountImposed = "";
    }

    OnClickIllustration2Print() {
        var columns = ["Date of \nAllotment", "Amount \n(Rs.)", "Date of \nReporting \nto RBI", "Delay \nNumber \nof \ndays", "Period of \ncontravention \n(years)", "Variable Amount \napplicable as per \npara I.1 of \nGuidance Note", "Amount \nimposed \n(Rs.)"];
        var rows = [];

        this.illustration2Data.forEach(item => {
            rows.push([item.ReceiptDate.day + '-' + item.ReceiptDate.month + '-' + item.ReceiptDate.year, item.Amount, item.ReportingDate.day + '-' + item.ReportingDate.month + '-' + item.ReportingDate.year, item.Delay, item.ContraventionPeriod, item.VariableAmount, item.AmountImposed]);
        });

        rows.push(["", this.sumOfIllustration2Amount, "", "", "", "Variable Amount", this.sumOfIllustration2AmountImposed]);
        rows.push(["", "", "", "", "", "Fixed Amount", this.illustration2FixedAmount]);
        rows.push(["", "", "", "", "", "Total Imposed", this.totalOfIllustration2AmountImposed]);

        var doc = new jsPDF('p', 'pt');
        doc.setFontSize(12);
        doc.text(40, 50, 'Illustration II - Contravention of Para 9(1)(B) of Schedule 1 to Notification No.FEMA20/2000-RB');
        doc.autoTable(columns, rows, {
            createdCell: function (cell, data) {
                if (data.row.index >= rows.length - 3) {
                    cell.styles.fontStyle = 'bold';
                }
            },
            margin: { top: 70 },
            styles: {

            },
            addPageContent: function (data) {
            }
        });

        doc.save('FDI Penalty Calculator.pdf'); // Generated PDF
    }

    GetCalculatorSubTopic(): void {
        this._spinnerService.show();

        let getCalculatorSubTopicRequest = new GetCalculatorSubTopicRequest();

        this._calculatorSubTopicService.getCalculatorSubTopic(getCalculatorSubTopicRequest)
            .subscribe(data => {
                this._spinnerService.hide();
                this.calculatorSubTopics = [];
                
                if (data.Status == Global.API_SUCCESS) {
                    this.calculatorSubTopics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        if (item.CalculatorSubTopicId == 5 || item.CalculatorSubTopicId == 6 || item.CalculatorSubTopicId == 7)
                            this.calculatorSubTopics.push({ Value: item.CalculatorSubTopicId, Text: item.CalculatorSubTopicName });
                    });
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_PENALTY_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PENALTY_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnChangeCalculatorSubTopic(calculatorSubTopicId) {
        this.calculatorSubTopicId = calculatorSubTopicId;

        this.OnClickIllustration3Cancel();
    }

    RemoveIllustration3Details(index) {
        let rowIndexToRemove = index + 1;
        if (rowIndexToRemove < this.illustration3FieldArray.length) {
            this.illustration3FieldArray.splice(rowIndexToRemove, this.illustration3FieldArray.length - rowIndexToRemove);
        }

        if (this.illustration3FieldArray.length > 0) {
            let newReceiptMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration3FieldArray[index]);
            this.illustration3NewAttribute = { ReceiptMinDate: { year: newReceiptMinimumDate.getFullYear(), month: newReceiptMinimumDate.getMonth() + 1, day: newReceiptMinimumDate.getDate() } };
        } else {
            this.illustration3NewAttribute = { ReceiptMinDate: { year: 1970, month: 1, day: 1 } };

        }
    }

    addIllustration3FieldValue() {
        if (!this.isDisabledIllustration3) {
            if (this.illustration3NewAttribute.ReceiptDate != undefined) {
                this.illustration3FieldArray.push(this.illustration3NewAttribute);

                let newReceiptMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration3NewAttribute);
                this.illustration3NewAttribute = { ReceiptMinDate: { year: newReceiptMinimumDate.getFullYear(), month: newReceiptMinimumDate.getMonth() + 1, day: newReceiptMinimumDate.getDate() } };
            }
            else {
                this._toastrService.error("Receipt date is required", Global.TOASTR_FDI_PENALTY_CALCULATOR_TITLE);
            }
        }
    }

    deleteIllustration3FieldValue(index) {
        if (!this.isDisabledIllustration3) {
            this.illustration3FieldArray.splice(index, 1);
            this.RemoveIllustration3Details(index - 1);
        }
    }

    OnChangeIllustration3ReceiptDateResetNewData() {
        if (this.illustration3NewAttribute.ReportingDate) {
            delete this.illustration3NewAttribute.ReportingDate;
            delete this.illustration3NewAttribute.Delay;
            delete this.illustration3NewAttribute.ContraventionPeriod;
            delete this.illustration3NewAttribute.VariableAmount;
            delete this.illustration3NewAttribute.AmountImposed;
        }
    }

    OnChangeIllustration3ReceiptDateResetArrayData(index) {
        if (this.illustration3FieldArray[index].ReportingDate) {
            delete this.illustration3FieldArray[index].ReportingDate;
            delete this.illustration3FieldArray[index].Delay;
            delete this.illustration3FieldArray[index].ContraventionPeriod;
            delete this.illustration3FieldArray[index].VariableAmount;
            delete this.illustration3FieldArray[index].AmountImposed;
        }
    }

    OnChangeIllustration3NewFieldValue() {
        if (this.illustration3NewAttribute.ReceiptDate) {
            let newReportingMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration3NewAttribute);
            this.illustration3NewAttribute.ReportingMinDate = { year: newReportingMinimumDate.getFullYear(), month: newReportingMinimumDate.getMonth() + 1, day: newReportingMinimumDate.getDate() };
        }

        if (!isNaN(Number(this.illustration3NewAttribute.Amount))) {
            delete this.illustration3NewAttribute.VariableAmount;

            if (this.illustration3NewAttribute.ReceiptDate && this.illustration3NewAttribute.ReportingDate) {
                let receiptDate: any = new Date(this.illustration3NewAttribute.ReceiptDate.year + '-' + this.illustration3NewAttribute.ReceiptDate.month + '-' + this.illustration3NewAttribute.ReceiptDate.day);
                let reportingDate: any = new Date(this.illustration3NewAttribute.ReportingDate.year + '-' + this.illustration3NewAttribute.ReportingDate.month + '-' + this.illustration3NewAttribute.ReportingDate.day);
                let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - receiptDate);
                let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
                let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
                let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

                let delay = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                    (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                        (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                            (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                                (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                    (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';

                if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration3NewAttribute.Delay = (yearNo == 0) ? '' : yearNo + ' year ';
                    this.illustration3NewAttribute.Delay += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
                    this.illustration3NewAttribute.Delay += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
                } else {
                    this.illustration3NewAttribute.Delay = delay;
                }

                this.illustration3NewAttribute.ContraventionPeriod = (yearNo + (monthNo / 12) + (dayNo / 365)).toFixed(2);

                if (this.illustration3NewAttribute.Amount) {
                    let tempPenaltyDetails = this.penaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == parseInt(this.calculatorSubTopicId) && x.Range == delay);

                    if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                        if (tempPenaltyDetails.length > 0)
                            this.illustration3NewAttribute.VariableAmount = tempPenaltyDetails[0].Amount;
                    } else {
                        if (tempPenaltyDetails.length > 0)
                            this.illustration3NewAttribute.VariableAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                    }

                    this.illustration3NewAttribute.AmountImposed = this.illustration3NewAttribute.Amount * this.illustration3NewAttribute.VariableAmount;
                    this.illustration3NewAttribute.AmountImposed = Math.round(this.illustration3NewAttribute.AmountImposed);
                }
            }
        } else {
            delete this.illustration3NewAttribute.Amount;
            delete this.illustration3NewAttribute.ContraventionPeriod;
            delete this.illustration3NewAttribute.VariableAmount;
            delete this.illustration3NewAttribute.AmountImposed;
        }
    }

    OnChangeIllustration3ArrayFieldValue(index) {
        if (this.illustration3FieldArray[index].ReceiptDate) {
            let newReportingMinimumDate: Date = this.GetNewReportingMinimumDate(this.illustration3FieldArray[index]);
            this.illustration3FieldArray[index].ReportingMinDate = { year: newReportingMinimumDate.getFullYear(), month: newReportingMinimumDate.getMonth() + 1, day: newReportingMinimumDate.getDate() };
        }

        if (!isNaN(Number(this.illustration3FieldArray[index].Amount))) {
            delete this.illustration3FieldArray[index].VariableAmount;

            if (this.illustration3FieldArray[index].ReceiptDate && this.illustration3FieldArray[index].ReportingDate) {
                let receiptDate: any = new Date(this.illustration3FieldArray[index].ReceiptDate.year + '-' + this.illustration3FieldArray[index].ReceiptDate.month + '-' + this.illustration3FieldArray[index].ReceiptDate.day);
                let reportingDate: any = new Date(this.illustration3FieldArray[index].ReportingDate.year + '-' + this.illustration3FieldArray[index].ReportingDate.month + '-' + this.illustration3FieldArray[index].ReportingDate.day);
                let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - receiptDate);
                let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
                let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
                let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

                let delay = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                    (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                        (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                            (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                                (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                    (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';

                if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration3FieldArray[index].Delay = (yearNo == 0) ? '' : yearNo + ' year ';
                    this.illustration3FieldArray[index].Delay += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
                    this.illustration3FieldArray[index].Delay += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
                } else {
                    this.illustration3FieldArray[index].Delay = delay;
                }

                this.illustration3FieldArray[index].ContraventionPeriod = (yearNo + (monthNo / 12) + (dayNo / 365)).toFixed(2);

                if (this.illustration3FieldArray[index].Amount) {
                    let tempPenaltyDetails = this.penaltyDetails.filter(x => x.IsFixedPenalty == false && x.CalculatorSubTopicID == parseInt(this.calculatorSubTopicId) && x.Range == delay);

                    if (receiptDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                        if (tempPenaltyDetails.length > 0)
                            this.illustration3FieldArray[index].VariableAmount = tempPenaltyDetails[0].Amount;
                    } else {
                        if (tempPenaltyDetails.length > 0)
                            this.illustration3FieldArray[index].VariableAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                    }

                    this.illustration3FieldArray[index].AmountImposed = this.illustration3FieldArray[index].Amount * this.illustration3FieldArray[index].VariableAmount;
                    this.illustration3FieldArray[index].AmountImposed = Math.round(this.illustration3FieldArray[index].AmountImposed);
                }
            }
        } else {
            delete this.illustration3FieldArray[index].Amount;
            delete this.illustration3FieldArray[index].ContraventionPeriod;
            delete this.illustration3FieldArray[index].VariableAmount;
            delete this.illustration3FieldArray[index].AmountImposed;
        }
    }

    OnClickIllustration3Save() {
        if (this.illustration3FieldArray.length > 0 || (this.illustration3NewAttribute.ReceiptDate && this.illustration3NewAttribute.Amount && this.illustration3NewAttribute.ReportingDate)) {
            this.isDisabledIllustration3 = true;
            this.illustration3Data = [];

            this.illustration3FieldArray.forEach(item => {
                if (item.ReceiptDate && item.ReportingDate && item.Amount) {
                    item.Amount = Math.round(item.Amount);
                    item.AmountImposed = Math.round(item.AmountImposed);
                    this.illustration3Data.push(item);
                }
            });

            if (this.illustration3NewAttribute.ReceiptDate && this.illustration3NewAttribute.ReportingDate && this.illustration3NewAttribute.Amount) {
                this.illustration3NewAttribute.Amount = Math.round(this.illustration3NewAttribute.Amount);
                this.illustration3NewAttribute.AmountImposed = Math.round(this.illustration3NewAttribute.AmountImposed);
                this.illustration3Data.push(this.illustration3NewAttribute);
            }

            this.sumOfIllustration3Amount = Math.round(this.illustration3Data.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.Amount); }, 0)).toString();
            this.sumOfIllustration3AmountImposed = Math.round(this.illustration3Data.reduce(function (a, b) { return parseFloat(a) + parseFloat(b.AmountImposed); }, 0)).toString();

            let tempPenaltyDetails = this.penaltyDetails.filter(x => x.IsFixedPenalty == true && x.CalculatorSubTopicID == parseInt(this.calculatorSubTopicId));

            this.illustration3Data.forEach(item => {
                let receiptDate: any = new Date(item.ReceiptDate.year + '-' + item.ReceiptDate.month + '-' + item.ReceiptDate.day);

                if (receiptDate > Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                    this.illustration3FixedAmount = tempPenaltyDetails[0].AmountAfter07November2017;
                    return;
                } else {
                    this.illustration3FixedAmount = tempPenaltyDetails[0].Amount;
                }
            });

            this.totalOfIllustration3AmountImposed = Math.round((this.illustration3FixedAmount + parseFloat(this.sumOfIllustration3AmountImposed)) * tempPenaltyDetails[0].ExtraPenaltyRange).toString();
        } else {
            this._toastrService.error("Must be required filled one row.", Global.TOASTR_ADMIN_PENALTY_DETAIL_TITLE);
        }
    }

    OnClickIllustration3Cancel() {
        this.isDisabledIllustration3 = false;
        this.illustration3Data = [];
        this.illustration3FieldArray = [];
        this.illustration3NewAttribute = { ReceiptMinDate: { year: 1970, month: 1, day: 1 }, ReportingMinDate: { year: 1970, month: 1, day: 1 } };
        this.sumOfIllustration3Amount = "";
        this.sumOfIllustration3AmountImposed = "";
        this.illustration3FixedAmount = 0;
        this.totalOfIllustration3AmountImposed = "";
    }

    OnClickIllustration3Print() {
        var columns = ["Date of \nreceipt", "Amount \n(Rs.)", "Date of \nReporting \nto RBI", "Delay", "Period of \ncontravention \n(years)", "Variable Amount \napplicable as per \npara I.1 of \nGuidance Note", "Amount \nimposed \n(Rs.)"];
        var rows = [];

        this.illustration3Data.forEach(item => {
            rows.push([item.ReceiptDate.day + '-' + item.ReceiptDate.month + '-' + item.ReceiptDate.year, item.Amount, item.ReportingDate.day + '-' + item.ReportingDate.month + '-' + item.ReportingDate.year, item.Delay, item.ContraventionPeriod, item.VariableAmount, item.AmountImposed]);
        });

        rows.push(["", this.sumOfIllustration3Amount, "", "", "", "Variable Amount", this.sumOfIllustration3AmountImposed]);
        rows.push(["", "", "", "", "", "Fixed Amount", this.illustration3FixedAmount]);
        rows.push(["", "", "", "", "", "Total Imposed", this.totalOfIllustration3AmountImposed]);

        var doc = new jsPDF('p', 'pt');
        doc.setFontSize(12);
        doc.text(40, 50, 'Illustration III - Contravention of Para 8 of Schedule 1 to Notification No.FEMA20/2000-RB');

        doc.setFontSize(11);
        doc.text(40, 80, 'Calculator Topic : ' + this.calculatorSubTopics.filter(x => x.Value == this.calculatorSubTopicId)[0].Text);

        doc.autoTable(columns, rows, {
            createdCell: function (cell, data) {
                if (data.row.index >= rows.length - 3) {
                    cell.styles.fontStyle = 'bold';
                }
            },
            margin: { top: 90 },
            styles: {

            },
            addPageContent: function (data) {
            }
        });

        doc.save('FDI Penalty Calculator.pdf'); // Generated PDF
    }

    OnClickModuleTab(moduleTab) {
        this.moduleTab = moduleTab;
    }
}