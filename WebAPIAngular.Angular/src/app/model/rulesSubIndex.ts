export class RulesSubIndex {
    SubIndexId: number;
    IndexId: number;
    SubIndexNo: string;
    SubIndexName: string;
    SubIndexContent: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRulesSubIndexRequest {
    SubIndexId: number;
    IndexId: number;
    RulesId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}