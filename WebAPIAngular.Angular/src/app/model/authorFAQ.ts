export class AuthorFAQ {
    AuthorFAQId: number;
    TopicName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetAuthorFAQRequest {
    AuthorFAQId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}

//export class Topic {
//    TopicId: number;
//    TopicName: string;
//}

//export class GetTopicRequest {
//    TopicId: number;
//}