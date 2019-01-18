export class FDIChapter {
    FDIChapterId: number;
    FDICircularId: number;
    Chapter: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    SortId: number;
    ModifiedDate: string;
}

export class GetFDIChapterRequest {
    FDIChapterId: number;
    FDICircularId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}