//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DemystifyFema.Service.Models
{
    using System;
    
    public partial class MDIndexAmendmentGet_Result
    {
        public int MasterDirectionIndexAmendmentId { get; set; }
        public int MasterDirectionId { get; set; }
        public int MasterDirectionChapterId { get; set; }
        public int MasterDirectionIndexId { get; set; }
        public Nullable<int> MasterDirectionSubIndexId { get; set; }
        public string Year { get; set; }
        public string IndexAmendmentContent { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string ParaIndexNo { get; set; }
        public string SubIndexNo { get; set; }
        public string PartData { get; set; }
        public string IndexName { get; set; }
        public string SubIndexName { get; set; }
        public Nullable<bool> UpdatedInsertedByRBI { get; set; }
        public Nullable<System.DateTime> UpdatedInsertedDateByRBI { get; set; }
        public string APDIRCircularIds { get; set; }
        public string NotificationIds { get; set; }
        public string APDIRCirculars { get; set; }
        public string Notifications { get; set; }
    }
}