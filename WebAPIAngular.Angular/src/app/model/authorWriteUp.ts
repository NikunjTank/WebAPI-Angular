export class AuthorWriteUp {
    AuthorWriteUpId: number;
    TopicId: number;
    TopicName: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAuthorWriteUpRequest {
    AuthorWriteUpId: number;
    TopicId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}

//export class Topic {
//    TopicId: number;
//    TopicName: string;
//}

//export class GetTopicRequest {
//    TopicId: number;
//}