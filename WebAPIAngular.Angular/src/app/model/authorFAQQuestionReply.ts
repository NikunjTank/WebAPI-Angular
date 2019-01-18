export class AuthorFAQQuestionReply {
    AuthorFAQQuestionReplyId: number;
    AuthorFAQDetailId: number;
    Question: string;
    Reply: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAuthorFAQQuestionReplyRequest {
    AuthorFAQQuestionReplyId: number;
    AuthorFAQDetailId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}