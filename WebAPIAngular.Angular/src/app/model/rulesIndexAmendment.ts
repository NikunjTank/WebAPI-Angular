export class RulesIndexAmendment {
    RulesIndexAmendmentId: number;
    RulesId: number;
    GSRNotificationId: number;
    GSRNotificationDate: string;
    IndexId: number;
    SubIndexId: number;
    IndexAmendmentContent: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRulesIndexAmendmentRequest {
    RulesIndexAmendmentId: number;
    RulesId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}