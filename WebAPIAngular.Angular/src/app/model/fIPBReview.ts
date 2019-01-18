export class FIPBReview {
    FIPBReviewId: number;
    Name: number;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFIPBReviewRequest {
    FIPBReviewId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}