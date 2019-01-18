export class MasterCircularOfFEMASubModuleDetail {
    MasterCircularId: number;
    MasterCircularName: string;        
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterCircularOfFEMASubModuleDetailRequest {
    FEMASubModuleOfModuleId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}