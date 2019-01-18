export class APDIRCircularOfFEMASubModuleDetail {
    APDIRCircularId: number;
    MasterDirectionId: number;
    MasterDirectionName: string;
    APDIRCircularNo: string;
    APDIRCircularName: string;
    APDIRCircularDate: Date;
    Year: string;
    APDIRCircularYearName: string;
    APDIRCircularPDF: string;
    GSRDate: string;
    APDIRCircularEffectiveDate: Date;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAPDIRCircularOfFEMASubModuleDetailRequest {
    APDIRCircularId: number;
    MasterDirectionId: number;
    Year: string;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}