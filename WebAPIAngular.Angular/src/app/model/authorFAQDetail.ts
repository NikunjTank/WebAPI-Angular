export class AuthorFAQDetail {
    AuthorFAQDetailId: number;
    SubTopicName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAuthorFAQDetailRequest {
    AuthorFAQDetailId: number;
    AuthorFAQId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}

export class SubTopic {
    SubTopicId: number;
    SubTopicName: string;
}

export class GetSubTopicRequest {
    SubTopicId: number;
}