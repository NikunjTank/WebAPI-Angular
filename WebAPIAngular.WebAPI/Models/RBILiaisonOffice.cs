using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace DemystifyFema.Service.Models
{
    public class RBILiaisonOffice
    {
        public int? RBILiaisonOfficeId { get; set; }
        public int? SerialNo { get; set; }
        public string NameAndAddressOfTheCompany { get; set; }
        public string PlaceOfTheLiaisonOffice { get; set; }
        public DateTime DateOfApprovalGrantedOrUINAlloted { get; set; }
        public string UIN { get; set; }
        public XElement RBILiaisonOffices { get; set; }
        public int ModifiedBy { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int Result { get; set; }
    }

    public class GetRBILiaisonOfficeRequest
    {
        public int? RBILiaisonOfficeId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class AddRBILiaisonOfficeFromFileResponse
    {
        public int SuccessRow { get; set; }
        public int SkippedRow { get; set; }
        public int ErrorRow { get; set; }
        public List<NotProcessedRow> NotProcessedRow { get; set; }
    }

    public class GetRBILiaisonOfficeResponse
    {
        public int RBILiaisonOfficeId { get; set; }
        public int? SerialNo { get; set; }
        public string NameAndAddressOfTheCompany { get; set; }
        public string PlaceOfTheLiaisonOffice { get; set; }
        public DateTime DateOfApprovalGrantedOrUINAlloted { get; set; }
        public string UIN { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class NotProcessedRow
    {
        public int? SerialNo { get; set; }
        public string NameAndAddressOfTheCompany { get; set; }
        public string PlaceOfTheLiaisonOffice { get; set; }
        public string DateOfApprovalGrantedOrUINAlloted { get; set; }
        public string UIN { get; set; }
        public string Status { get; set; }
        public string LineNumber { get; set; }
    }
}