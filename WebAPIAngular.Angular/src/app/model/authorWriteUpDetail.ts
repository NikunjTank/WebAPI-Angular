export class AuthorWriteUpDetail {
    AuthorWriteUpDetailId: number;
    SubTopicId: number;
    SubTopicName: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAuthorWriteUpDetailRequest {
    AuthorWriteUpDetailId: number;
    AuthorWriteUpId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}

export class SubTopic {
    SubTopicId: number;
    SubTopicName: string;
}

export class GetSubTopicRequest {
    SubTopicId: number;
}