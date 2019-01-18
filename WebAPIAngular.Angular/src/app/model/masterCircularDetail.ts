export class MasterCircularDetail {
    MasterCircularDetailId: number;
    MasterCircularId: number;
    Year: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterCircularDetailRequest {
    MasterCircularDetailId: number;
    MasterCircularId: number;
    Year: string;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}