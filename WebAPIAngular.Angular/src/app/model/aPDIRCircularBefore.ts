export class APDIRCircularBefore {
    APDIRCircularBeforeId: number;
    APDIRCircularParentId: number;
    APDIRCircularId: number;
    APDIRCircularNo: string;
    APDIRCircularName: string;
    APDIRCircularDate: string;
    APDIRCircularEffectiveDate: string;
    Year: string;
    APDIRCircularYearName: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAPDIRCircularBeforeRequest {
    APDIRCircularBeforeId: number;
    APDIRCircularParentId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}