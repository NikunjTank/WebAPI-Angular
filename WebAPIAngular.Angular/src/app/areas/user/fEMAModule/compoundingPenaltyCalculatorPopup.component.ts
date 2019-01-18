import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DropDown } from '../../../common/dropDown';

import { GetCommonFieldRequest } from '../../../model/commonField';
import { CalculatorSubTopic, GetCalculatorSubTopicRequest } from '../../../model/calculatorSubTopic';
import { PenaltyDetail, GetPenaltyDetailRequest } from '../../../model/penaltyDetail';

import { PenaltyDetailUserService } from '../../../service/user/penaltyDetail.service';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { CalculatorSubTopicUserService } from '../../../service/user/calculatorSubTopic.service';

declare var jsPDF: any;

@Component({
    selector: 'my-app',
    templateUrl: './compoundingPenaltyCalculatorPopup.component.html'
})

export class CompoundingPenaltyCalculatorPopupUserComponent {

    calculatorTopics: DropDown[] = [];
    tempCalculatorTopics: any;
    calculatorSubTopics: DropDown[] = [];
    penaltyDetails: PenaltyDetail[];
    compundingPenaltyCalculator: Array<any> = [];

    contraventionMinDate = { year: 1970, month: 1, day: 1 };
    reportingMinDate = { year: 1970, month: 1, day: 1 };

    isDisabledCompoundingPenaltyCalculator: boolean = false;
    isContraventionDateDatePicker: boolean = false;
    isReportingDateDatePicker: boolean = false;
    isSubmited: boolean = false;

    isContraventionAmountDisabled: boolean = false;
    isTotalAPR_AAC_FCGPRDisabled: boolean = false;

    frmCompoundingPenaltyCalculator: FormGroup;

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.GetCalculatorTopic();

        this.frmCompoundingPenaltyCalculator = this.formBuilder.group({
            CalculatorTopicId: ['', Validators.required],
            CalculatorSubTopicId: ['', Validators.required],
            ContraventionDate: ['', Validators.required],
            ReportingDate: ['', Validators.required],
            WhetherSameOffence: ['', Validators.required],
            ContraventionAmount: [''],
            NoOfYear: [''],
            TotalAPR_AAC_FCGPR: [''],
            Years: ['']
        });
    }

    constructor(private formBuilder: FormBuilder,
        private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        private _commonFieldService: CommonFieldService,
        private _calculatorSubTopicService: CalculatorSubTopicUserService,
        private _penaltyDetailService: PenaltyDetailUserService,
        public sanitizer: DomSanitizer) { }

    GetCalculatorTopic() {
        this._spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_MODULE;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this._spinnerService.hide();
                this.calculatorTopics = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.calculatorTopics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        item.FieldName = (item.FieldId == 15) ? "Others" : item.FieldName;

                        if (item.FieldId == 1 || item.FieldId == 2 || item.FieldId == 3 || item.FieldId == 5 || item.FieldId == 6 || item.FieldId == 7 || item.FieldId == 15)
                            this.calculatorTopics.push({ Value: item.FieldId, Text: item.FieldName });
                    });

                    this.frmCompoundingPenaltyCalculator.get("CalculatorTopicId").setValue("");
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_COMPOUNDING_PENALTY_CALCULATOR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_COMPOUNDING_PENALTY_CALCULATOR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetCalculatorSubTopic() {
        this._spinnerService.show();

        let getCalculatorSubTopicRequest = new GetCalculatorSubTopicRequest();
        getCalculatorSubTopicRequest.FEMAModuleId = parseInt(this.frmCompoundingPenaltyCalculator.value.CalculatorTopicId);

        this._calculatorSubTopicService.getCalculatorSubTopic(getCalculatorSubTopicRequest)
            .subscribe(data => {
                this._spinnerService.hide();
                this.calculatorSubTopics = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.tempCalculatorTopics = data.Response;
                    this.calculatorSubTopics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.calculatorSubTopics.push({ Value: item.CalculatorSubTopicId, Text: item.CalculatorSubTopicName });
                    });

                    this.frmCompoundingPenaltyCalculator.get("CalculatorSubTopicId").setValue("");
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_COMPOUNDING_PENALTY_CALCULATOR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_COMPOUNDING_PENALTY_CALCULATOR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetNewReportingMinimumDate(formData) {
        let currentReceiptDate: any = new Date(formData.ContraventionDate.year + '-' + formData.ContraventionDate.month + '-' + formData.ContraventionDate.day);
        let day: any = 60 * 60 * 24 * 1000;
        return new Date(currentReceiptDate.getTime() + day);
    }

    OnCalculatorTopicChange() {
        this.calculatorSubTopics = [];

        if (this.frmCompoundingPenaltyCalculator.value.CalculatorTopicId)
            this.GetCalculatorSubTopic();
    }

    OnCalculatorSubTopicChange() {
        this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").enable();
        this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").enable();
        this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").setValue(0);
        this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").setValue(0);
        this.frmCompoundingPenaltyCalculator.get("ContraventionDate").setValue(null);
        this.frmCompoundingPenaltyCalculator.get("ReportingDate").setValue(null);

        if (this.frmCompoundingPenaltyCalculator.value.CalculatorSubTopicId) {
            this.isContraventionAmountDisabled = !this.tempCalculatorTopics.filter(x => x.CalculatorSubTopicId == this.frmCompoundingPenaltyCalculator.value.CalculatorSubTopicId)[0].IsAmountOfContraventionNeeded;
            this.isTotalAPR_AAC_FCGPRDisabled = !this.tempCalculatorTopics.filter(x => x.CalculatorSubTopicId == this.frmCompoundingPenaltyCalculator.value.CalculatorSubTopicId)[0].IsTotalNoOfAPR_AAC_FCGPRNeeded;

            if (this.isContraventionAmountDisabled)
                this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").disable();

            if (this.isTotalAPR_AAC_FCGPRDisabled)
                this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").disable();
            else {
                this.frmCompoundingPenaltyCalculator.get("ContraventionDate").setValue(this.contraventionMinDate);
                this.frmCompoundingPenaltyCalculator.get("ReportingDate").setValue(this.reportingMinDate);
                this.frmCompoundingPenaltyCalculator.updateValueAndValidity();
            }
        }
    }

    OnChangeContraventionDate() {
        this.frmCompoundingPenaltyCalculator.get("ReportingDate").setValue("");

        if (this.frmCompoundingPenaltyCalculator.value.ContraventionDate) {
            let newReportingMinimumDate: Date = this.GetNewReportingMinimumDate(this.frmCompoundingPenaltyCalculator.value);
            this.reportingMinDate = { year: newReportingMinimumDate.getFullYear(), month: newReportingMinimumDate.getMonth() + 1, day: newReportingMinimumDate.getDate() };
        }
    }

    OnChangeAmount() {
        if (isNaN(Number(this.frmCompoundingPenaltyCalculator.value.ContraventionAmount)))
            this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").setValue(0);

        if (isNaN(Number(this.frmCompoundingPenaltyCalculator.value.TotalAPR_AAC_FCGPR)))
            this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").setValue(0);

    }

    OnChangeReportingDate() {
        let contraventionDate: any = new Date(this.frmCompoundingPenaltyCalculator.value.ContraventionDate.year + '-' + this.frmCompoundingPenaltyCalculator.value.ContraventionDate.month + '-' + this.frmCompoundingPenaltyCalculator.value.ContraventionDate.day);
        let reportingDate: any = new Date(this.frmCompoundingPenaltyCalculator.value.ReportingDate.year + '-' + this.frmCompoundingPenaltyCalculator.value.ReportingDate.month + '-' + this.frmCompoundingPenaltyCalculator.value.ReportingDate.day);
        let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - contraventionDate);
        let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
        let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
        let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

        let years = "";

        if (contraventionDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
            years = (yearNo == 0) ? '' : yearNo + ' year ';
            years += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
            years += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
        } else {
            years = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                    (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                        (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                            (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';
        }

        this.frmCompoundingPenaltyCalculator.get("Years").setValue(years);
        this.frmCompoundingPenaltyCalculator.get("NoOfYear").setValue((yearNo + (monthNo / 12) + (dayNo / 365)).toFixed(2));
    }

    GetPenaltyDetail() {
        this._spinnerService.show();

        let getPenaltyDetailRequest = new GetPenaltyDetailRequest();
        getPenaltyDetailRequest.CalculatorID = Global.COMMON_FIELD_COMPOUNDING_PENALTY_CALCULATOR;
        getPenaltyDetailRequest.CalculatorSubTopicID = parseInt(this.frmCompoundingPenaltyCalculator.get("CalculatorSubTopicId").value);

        this._penaltyDetailService.getPenaltyDetail(getPenaltyDetailRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.penaltyDetails = data.Response;

                    this.compundingPenaltyCalculator = [];

                    let tempPenaltyDetails = this.penaltyDetails.filter(x => x.IsFixedPenalty == true);
                    let contraventionDate: any = new Date(this.frmCompoundingPenaltyCalculator.value.ContraventionDate.year + '-' + this.frmCompoundingPenaltyCalculator.value.ContraventionDate.month + '-' + this.frmCompoundingPenaltyCalculator.value.ContraventionDate.day);
                    let reportingDate: any = new Date(this.frmCompoundingPenaltyCalculator.value.ReportingDate.year + '-' + this.frmCompoundingPenaltyCalculator.value.ReportingDate.month + '-' + this.frmCompoundingPenaltyCalculator.value.ReportingDate.day);
                    let differenceBetweenReceiptAndReportingDate: any = new Date(reportingDate - contraventionDate);
                    let yearNo = differenceBetweenReceiptAndReportingDate.toISOString().slice(0, 4) - 1970;
                    let monthNo = differenceBetweenReceiptAndReportingDate.getMonth();
                    let dayNo = differenceBetweenReceiptAndReportingDate.getDate();

                    if (contraventionDate > Global.FDI_PENALTY_CALCULATOR_FIXED_DATE)
                        this.compundingPenaltyCalculator.push({ PenaltyParticulars: "Fixed Penalty", Amount: tempPenaltyDetails[0].AmountAfter07November2017 });
                    else
                        this.compundingPenaltyCalculator.push({ PenaltyParticulars: "Fixed Penalty", Amount: tempPenaltyDetails[0].Amount });

                    let range = "";
                    let amount = 0;
                    let years = (yearNo == 0 || (yearNo == 1 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR :
                        (yearNo == 1 || (yearNo == 2 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS :
                            (yearNo == 2 || (yearNo == 3 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS :
                                (yearNo == 3 || (yearNo == 4 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS :
                                    (yearNo == 4 || (yearNo == 5 && monthNo == 0 && dayNo == 0)) ? Global.FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS :
                                        (yearNo > 5 || (yearNo == 5 && (monthNo > 0 || dayNo > 0))) ? Global.FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS : '';

                    tempPenaltyDetails = this.penaltyDetails;

                    if (contraventionDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                        tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false);

                        if (this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value <= 1000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_UPTO_10_LAKHS;
                        else if (this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value > 1000000 && this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value <= 4000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_40_LAKHS;
                        else if (this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value > 4000000 && this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value <= 10000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_40_TO_100_LAKHS;
                        else if (this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value > 10000000 && this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value <= 100000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_1_TO_10_CRORE;
                        else if (this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value > 100000000 && this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value <= 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_10_TO_100_CRORE;
                        else if (this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value > 1000000000)
                            range = Global.FDI_PENALTY_CALCULATOR_RANGE_ABOVE_100_CRORE;

                        if (this.isTotalAPR_AAC_FCGPRDisabled) {
                            if (this.isTotalAPR_AAC_FCGPRDisabled && !this.isContraventionAmountDisabled) {
                                tempPenaltyDetails = tempPenaltyDetails.filter(x => x.Range == range || x.Range == years);
                            }

                            if (tempPenaltyDetails.length > 0)
                                amount = tempPenaltyDetails[0].Amount * (tempPenaltyDetails[0].Range == years ? this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value : this.frmCompoundingPenaltyCalculator.get("NoOfYear").value);
                        } else {
                            if (tempPenaltyDetails.length > 0)
                                amount = tempPenaltyDetails[0].Amount * parseInt(this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").value);
                        }

                        this.compundingPenaltyCalculator.push({ PenaltyParticulars: "Variable Amount", Amount: Math.round(amount) });

                    } else {
                        if (contraventionDate <= Global.FDI_PENALTY_CALCULATOR_FIXED_DATE) {
                            years = (yearNo == 0) ? '' : yearNo + ' year ';
                            years += (yearNo > 0 && monthNo == 0) ? monthNo + ' month ' : (monthNo == 0) ? '' : monthNo + ' month ';
                            years += (yearNo > 0 && monthNo == 0) ? dayNo + ' day ' : dayNo + ' day ';
                        }

                        if (this.isTotalAPR_AAC_FCGPRDisabled) {
                            if (this.isTotalAPR_AAC_FCGPRDisabled && !this.isContraventionAmountDisabled) {
                                tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false && x.RangeAfter07November2017 == years);
                            }

                            if (tempPenaltyDetails.length > 0)
                                amount = tempPenaltyDetails[0].AmountAfter07November2017 * this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").value;
                        } else {
                            tempPenaltyDetails = tempPenaltyDetails.filter(x => x.IsFixedPenalty == false);
                            if (tempPenaltyDetails.length > 0)
                                amount = tempPenaltyDetails[0].AmountAfter07November2017 * parseInt(this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").value);
                        }

                        this.compundingPenaltyCalculator.push({ PenaltyParticulars: "Variable Amount", Amount: Math.round(amount) });
                    }

                    this.compundingPenaltyCalculator.push({
                        PenaltyParticulars: "Penalty for Shares not allotted but refunded with / without approval",
                        Amount: Math.round(tempPenaltyDetails[0].ExtraPenaltyRange > 0 ? ((this.compundingPenaltyCalculator[0].Amount + this.compundingPenaltyCalculator[1].Amount) * ((tempPenaltyDetails[0].ExtraPenaltyRange - 1) * 100) / 100) : 0)
                    });
                    this.compundingPenaltyCalculator.push({
                        PenaltyParticulars: "Additional Penalty (50% of Fixed + Variable + Other if compounded earlier)for the same offence",
                        Amount: Math.round((this.frmCompoundingPenaltyCalculator.get("WhetherSameOffence").value == "true") ? ((parseFloat(this.compundingPenaltyCalculator[0].Amount) + parseFloat(this.compundingPenaltyCalculator[1].Amount) + parseFloat(this.compundingPenaltyCalculator[2].Amount)) * 50) / 100 : 0)
                    });
                    this.compundingPenaltyCalculator.push({
                        PenaltyParticulars: "TOTAL PENALTY",
                        Amount: Math.round(parseFloat(this.compundingPenaltyCalculator[0].Amount) + parseFloat(this.compundingPenaltyCalculator[1].Amount) + parseFloat(this.compundingPenaltyCalculator[2].Amount) + parseFloat(this.compundingPenaltyCalculator[3].Amount))
                    });

                    this.frmCompoundingPenaltyCalculator.get("CalculatorTopicId").disable();
                    this.frmCompoundingPenaltyCalculator.get("CalculatorSubTopicId").disable();
                    this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").disable();
                    this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").disable();
                    this.frmCompoundingPenaltyCalculator.get("WhetherSameOffence").disable();
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_COMPOUNDING_PENALTY_CALCULATOR_TITLE, { closeButton: true });
                }
            }, error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_COMPOUNDING_PENALTY_CALCULATOR_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnSubmitCompoundingPenaltyCalculator(formData) {
        this.isSubmited = true;

        if (this.frmCompoundingPenaltyCalculator.valid) {
            this.isDisabledCompoundingPenaltyCalculator = true;

            if (!this.frmCompoundingPenaltyCalculator.value.ContraventionAmount)
                this.frmCompoundingPenaltyCalculator.value.ContraventionAmount = 0;

            if (!this.frmCompoundingPenaltyCalculator.value.TotalAPR_AAC_FCGPR)
                this.frmCompoundingPenaltyCalculator.value.TotalAPR_AAC_FCGPR = 0;

            this.GetPenaltyDetail();
        }
    }

    OnClickPrint() {
        var columns = ["Penalty Particulars", "Penalty Amount (in INR)"];
        var rows = [];

        this.compundingPenaltyCalculator.forEach(item => {
            rows.push([item.PenaltyParticulars, item.Amount]);
        });

        var doc = new jsPDF('p', 'pt');
        doc.setFontSize(12);
        doc.text(40, 50, 'Compounding Penalty');
        doc.autoTable(columns, rows, {
            createdCell: function (cell, data) {
                if (data.row.index >= rows.length - 1) {
                    cell.styles.fontStyle = 'bold';
                }
            },
            margin: { top: 70 },
            styles: {
                overflow: 'linebreak'
            },
            addPageContent: function (data) {
            }
        });

        doc.save('Compounding Penalty Calculator.pdf'); // Generated PDF
    }

    OnClickReset() {
        this.isDisabledCompoundingPenaltyCalculator = false;
        this.frmCompoundingPenaltyCalculator.reset();

        this.frmCompoundingPenaltyCalculator.get("CalculatorTopicId").setValue("");
        this.isContraventionAmountDisabled = false;
        this.isTotalAPR_AAC_FCGPRDisabled = false;

        this.frmCompoundingPenaltyCalculator.get("CalculatorTopicId").enable();
        this.frmCompoundingPenaltyCalculator.get("CalculatorSubTopicId").enable();
        this.frmCompoundingPenaltyCalculator.get("ContraventionAmount").enable();
        this.frmCompoundingPenaltyCalculator.get("TotalAPR_AAC_FCGPR").enable();
        this.frmCompoundingPenaltyCalculator.get("WhetherSameOffence").enable();

        this.calculatorSubTopics = [];
        this.isSubmited = false;
    }
}