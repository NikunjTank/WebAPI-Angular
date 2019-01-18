using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Package
    {
        public int? PackageId { get; set; }
        public int PackageTypeId { get; set; }
        public string PackageTypeName { get; set; }
        public string PackageName { get; set; }
        public int PackageDuration { get; set; }
        public decimal Amount { get; set; }
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

    public class GetPackageRequest
    {
        public int? PackageId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetPackageResponse
    {
        public int PackageId { get; set; }
        public int PackageTypeId { get; set; }
        public string PackageTypeName { get; set; }
        public string PackageName { get; set; }
        public int PackageDuration { get; set; }
        public decimal Amount { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }


}