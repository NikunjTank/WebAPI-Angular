export class RulesOfFEMASubModuleDetail {
    RulesId: number;
    RulesName: string;
    RulesNo: string;
    Year: string;
    PublicationDate: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRulesOfFEMASubModuleDetailRequest {
    FEMASubModuleOfModuleId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}