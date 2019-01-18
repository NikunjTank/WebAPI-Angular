export class RBICompoundingOrder {
    RBICompoundingOrderId: number;
    ApplicantName: string;
    OrderGist: string;
    Topic: string;
    FEMRegulationRuleNo: string;
    OrderDate: Date;
    PenaltyAmount: number;
    Regional_CentralOfficeOfRBI: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRBICompoundingOrderRequest {
    RBICompoundingOrderId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}