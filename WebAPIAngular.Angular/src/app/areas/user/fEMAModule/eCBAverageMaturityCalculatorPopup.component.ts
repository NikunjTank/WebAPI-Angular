import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

declare var jsPDF: any;

@Component({
    selector: 'my-app',
    templateUrl: './eCBAverageMaturityCalculatorPopup.component.html'
})

export class ECBAverageMaturityCalculatorPopupUserComponent {

    loanAmount: any;

    minDate: any = { year: 1970, month: 1, day: 1 };

    averageMaturityDetailsData: Array<any> = [];
    averageMaturityDetails: Array<any> = [];
    averageMaturityDetailRecent: any = { DrawalMinimumDate: { year: 1970, month: 1, day: 1 } };

    isDisabledAverageMaturityDetails: boolean = false;
    totalAverageMaturity: number = 0;

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {

    }

    constructor(private formBuilder: FormBuilder,
        private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        public sanitizer: DomSanitizer) { }

    addAverageMaturityDetail() {
        if (!this.isDisabledAverageMaturityDetails) {
            if (this.averageMaturityDetailRecent.DrawalDate != undefined) {
                this.averageMaturityDetails.push(this.averageMaturityDetailRecent);

                let newDrawalMinimumDate: Date = this.GetNewDrawalMinimumDate(this.averageMaturityDetailRecent);
                this.averageMaturityDetailRecent = { DrawalMinimumDate: { year: newDrawalMinimumDate.getFullYear(), month: newDrawalMinimumDate.getMonth() + 1, day: newDrawalMinimumDate.getDate() } };
            }
            else {
                this._toastrService.error("Drawal date is required", Global.TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE);
            }
        }
    }

    GetNewDrawalMinimumDate(averageMaturityDetail) {
        let currentDrawalDate: any = new Date(averageMaturityDetail.DrawalDate.year + '-' + averageMaturityDetail.DrawalDate.month + '-' + averageMaturityDetail.DrawalDate.day);
        let day: any = 60 * 60 * 24 * 1000;
        return new Date(currentDrawalDate.getTime() + day);
    }

    deleteAverageMaturityDetail(index) {
        if (!this.isDisabledAverageMaturityDetails) {
            this.averageMaturityDetails.splice(index, 1);
            this.RemoveFutureAverageMaturityDetails(index - 1);
        }
    }

    OnChangeAverageMaturityDetail() {
        let balanceAmount = this.GetBalanceAmount();
        if (balanceAmount > this.loanAmount) {
            this.averageMaturityDetailRecent.DrawalAmount = 0;
            this.averageMaturityDetailRecent.RepaymentAmount = 0;
            this.averageMaturityDetailRecent.BalanceAmount = 0;
            this._toastrService.error("Invalid Drawal Amount", Global.TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE);
        } else if (balanceAmount < 0) {
            this.averageMaturityDetailRecent.RepaymentAmount = 0;
            this.averageMaturityDetailRecent.BalanceAmount = this.GetBalanceAmount();
            this._toastrService.error("Invalid Repayment Amount", Global.TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE);
        }
        else {
            this.averageMaturityDetailRecent.BalanceAmount = balanceAmount;
        }
    }

    GetBalanceAmount() {
        let previousBalance: any = this.averageMaturityDetails.length > 0 ? this.averageMaturityDetails[this.averageMaturityDetails.length - 1].BalanceAmount : 0;
        let drawalAmount: any = (!isNaN(this.averageMaturityDetailRecent.DrawalAmount)) ? Number(this.averageMaturityDetailRecent.DrawalAmount) : 0;
        let repaymentAmount: any = (!isNaN(this.averageMaturityDetailRecent.RepaymentAmount)) ? Number(this.averageMaturityDetailRecent.RepaymentAmount) : 0;
        return (previousBalance + drawalAmount) - repaymentAmount;
    }

    OnChangeAverageMaturityDetails(index) {
        let balanceAmount = this.GetBalanceAmountAverageMaturityDetails(index);
        if (balanceAmount > this.loanAmount) {
            this.averageMaturityDetails[index].DrawalAmount = 0;
            this.averageMaturityDetails[index].RepaymentAmount = 0;
            this.averageMaturityDetails[index].BalanceAmount = 0;
            this._toastrService.error("Invalid Drawal Amount", Global.TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE);
        } else if (balanceAmount < 0) {
            this.averageMaturityDetails[index].RepaymentAmount = 0;
            this.averageMaturityDetails[index].BalanceAmount = this.GetBalanceAmountAverageMaturityDetails(index);
            this._toastrService.error("Invalid Repayment Amount", Global.TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE);
        }
        this.RemoveFutureAverageMaturityDetails(index);
    }

    GetBalanceAmountAverageMaturityDetails(index) {
        let previousBalance: any = (index > 0) ? this.averageMaturityDetails[index - 1].BalanceAmount : 0;
        let drawalAmount: any = (!isNaN(this.averageMaturityDetails[index].DrawalAmount)) ? Number(this.averageMaturityDetails[index].DrawalAmount) : 0;
        let repaymentAmount: any = (!isNaN(this.averageMaturityDetails[index].RepaymentAmount)) ? Number(this.averageMaturityDetails[index].RepaymentAmount) : 0;
        return (previousBalance + drawalAmount) - repaymentAmount;
    }

    RemoveFutureAverageMaturityDetails(index) {
        let rowIndexToRemove = index + 1;
        if (rowIndexToRemove < this.averageMaturityDetails.length) {
            this.averageMaturityDetails.splice(rowIndexToRemove, this.averageMaturityDetails.length - rowIndexToRemove);
        }

        if (this.averageMaturityDetails.length > 0) {
            let newDrawalMinimumDate: Date = this.GetNewDrawalMinimumDate(this.averageMaturityDetails[index]);
            this.averageMaturityDetailRecent = { DrawalMinimumDate: { year: newDrawalMinimumDate.getFullYear(), month: newDrawalMinimumDate.getMonth() + 1, day: newDrawalMinimumDate.getDate() } };
        } else {
            this.averageMaturityDetailRecent = { DrawalMinimumDate: { year: 1970, month: 1, day: 1 } };

        }
    }

    AverageMaturityDetailsSubmit() {
        if (this.averageMaturityDetailRecent.DrawalDate == undefined) {
            this._toastrService.error("Drawal date is required", Global.TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE);
            return;
        }
        if (this.averageMaturityDetailRecent.BalanceAmount == "0") {
            this.isDisabledAverageMaturityDetails = true;
            this.averageMaturityDetailsData = [];

            this.averageMaturityDetails.forEach(item => {
                this.averageMaturityDetailsData.push(item);
            });

            this.averageMaturityDetailsData.push(this.averageMaturityDetailRecent);

            for (let index = 0; index < this.averageMaturityDetailsData.length - 1; index++) {
                let currentDrawalDate: any = new Date(this.averageMaturityDetailsData[index].DrawalDate.year + '-' + this.averageMaturityDetailsData[index].DrawalDate.month + '-' + this.averageMaturityDetailsData[index].DrawalDate.day);
                let nextDrawalDate: any = new Date(this.averageMaturityDetailsData[index + 1].DrawalDate.year + '-' + this.averageMaturityDetailsData[index + 1].DrawalDate.month + '-' + this.averageMaturityDetailsData[index + 1].DrawalDate.day);
                this.averageMaturityDetailsData[index].NoofDaysBalance = Math.round((nextDrawalDate - currentDrawalDate) / (1000 * 60 * 60 * 24));

                this.averageMaturityDetailsData[index].Product = ((this.averageMaturityDetailsData[index].BalanceAmount * this.averageMaturityDetailsData[index].NoofDaysBalance) / (this.loanAmount * 360)).toFixed(4);
            }

            this.totalAverageMaturity = this.averageMaturityDetailsData.reduce(function (a, b) {
                let sumTillCurrentRow = (!isNaN(b.Product)) ? parseFloat(a) + parseFloat(b.Product) : parseFloat(a);
                return sumTillCurrentRow.toFixed(4);
            }, 0);

        } else {
            this._toastrService.error("Please provide all details until Balance becomes 0", Global.TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE);
        }
    }

    AverageMaturityDetailsReset() {
        this.loanAmount = "";
        this.averageMaturityDetails = [];
        this.averageMaturityDetailRecent = {};
        this.isDisabledAverageMaturityDetails = false;
        this.averageMaturityDetailsData = [];
    }

    AverageMaturityDetailsDownloadPDF() {
        var columns = ["Date of Drawal \n (DD/MM/YYYY)", "Drawal", "Repayment", "Balance", "No. of Days \n balance with \n the borrower", "Product \n = (Col.4 * Col. 5) \n /(Loan amount * 360)"];
        var rows = [];
        this.averageMaturityDetailsData.forEach(item => {
            rows.push([item.DrawalDate.day + '-' + item.DrawalDate.month + '-' + item.DrawalDate.year, item.DrawalAmount, item.RepaymentAmount, item.BalanceAmount, item.NoofDaysBalance, item.Product]);
        });
        rows.push(["", "", "", "", "Average Maturity", this.totalAverageMaturity]);

        var doc = new jsPDF('p', 'pt');
        doc.setFontSize(12);
        doc.text(40, 50, 'Calculation of Average Maturity - An Illustration');

        doc.setFontSize(11);
        doc.text(40, 80, 'Loan Amount : ' + this.loanAmount);

        doc.autoTable(columns, rows, {
            margin: { top: 90 },
            styles: {

            },
            addPageContent: function (data) {

            }
        });

        doc.save('Average Maturity Calculation.pdf'); // Generated PDF
    }

    LoanAmountChange() {
        this.averageMaturityDetails = [];
        this.averageMaturityDetailRecent = {};
        this.isDisabledAverageMaturityDetails = false;
        this.averageMaturityDetailsData = [];
    }
}