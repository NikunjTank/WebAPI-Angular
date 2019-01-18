export class RulesIndex {
    IndexId: number;
    RulesId: number;
    IndexNo: string;
    IndexName: string;
    IndexContent: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRulesIndexRequest {
    IndexId: number;
    RulesId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}