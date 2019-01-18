export class MasterDirectionChapter {
    MasterDirectionChapterId: number;
    MasterDirectionId: number;
    Chapter: string;
    SortId: number;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterDirectionChapterRequest {
    MasterDirectionChapterId: number;
    MasterDirectionId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}