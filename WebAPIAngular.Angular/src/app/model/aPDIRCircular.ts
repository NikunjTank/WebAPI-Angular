export class APDIRCircular {
    APDIRCircularId: number;
    APDIRCircularNo: string;
    MasterDirectionName: string;
    APDIRCircularName: string;
    APDIRCircularDate: string;
    APDIRCircularEffectiveDate: string;
    Year: string;
    APDIRCircularYearName: string;
    APDIRCircularPDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAPDIRCircularRequest {
    APDIRCircularId: number;
    MasterDirectionId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}