export class RegulationOfFEMASubModuleDetail {
    NotificationId: number;
    RegulationId: number;
    RegulationNumber: string;
    RegulationName: string;
    NotificationNumber: string;
    NotificationName: string;
    NotificationDate: string;
    NotificationEffectiveDate: string;
    GSRNo: string;
    GSRDate: string;
    NotificationPDF: string;
    GSRPDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRegulationOfFEMASubModuleDetailRequest {
    FEMASubModuleOfModuleId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}