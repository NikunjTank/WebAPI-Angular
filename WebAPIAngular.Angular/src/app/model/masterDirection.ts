export class MasterDirection {
    MasterDirectionId: number;
    MasterDirectionName: string;
    Year: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterDirectionRequest {
    MasterDirectionId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}