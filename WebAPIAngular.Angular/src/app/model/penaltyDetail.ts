export class PenaltyDetail {
    PenaltyDetailID: number;
    CalculatorID: number;
    CalculatorSubTopicID: number;
    IsFixedPenalty: boolean;
    Range: string;
    Amount: number;
    RangeAfter07November2017: string;
    AmountAfter07November2017: number;
    ExtraPenaltyRange: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetPenaltyDetailRequest {
    CalculatorID: number;
    CalculatorSubTopicID: number;
}