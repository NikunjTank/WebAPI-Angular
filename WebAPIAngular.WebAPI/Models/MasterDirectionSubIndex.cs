﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class MasterDirectionSubIndex
    {
        public int? MasterDirectionSubIndexId { get; set; }
        public int? MasterDirectionId { get; set; }
        public int? MasterDirectionIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string SubIndexName { get; set; }
        public string SubIndexContent { get; set; }
        public int? SortId { get; set; }
        public int? SaveAfterSubIndexId { get; set; }
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

    public class GetMasterDirectionSubIndexRequest
    {
        public int? MasterDirectionSubIndexId { get; set; }
        public int? MasterDirectionId { get; set; }
        public int? MasterDirectionIndexId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetMasterDirectionSubIndexResponse
    {
        public int? MasterDirectionSubIndexId { get; set; }
        public int? MasterDirectionIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string SubIndexName { get; set; }
        public string SubIndexContent { get; set; }
        public int? SortId { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddMasterDirectionSubIndexRequest
    {
        [Required]
        public int? MasterDirectionIndexId { get; set; }
        [Required]
        public string SubIndexNo { get; set; }
        [Required]
        public string SubIndexName { get; set; }
        [Required]
        public string SubIndexContent { get; set; }
        public int? SaveAfterSubIndexId { get; set; }
    }

    public class UpdateMasterDirectionSubIndexRequest
    {
        [Required]
        public int MasterDirectionSubIndexId { get; set; }
        [Required]
        public int MasterDirectionIndexId { get; set; }
        [Required]
        public string SubIndexNo { get; set; }
        [Required]
        public string SubIndexName { get; set; }
        [Required]
        public string SubIndexContent { get; set; }
        public int? SaveAfterSubIndexId { get; set; }
    }

    public class DeleteMasterDirectionSubIndexRequest
    {
        [Required]
        public int MasterDirectionSubIndexId { get; set; }
        [Required]
        public int MasterDirectionIndexId { get; set; }
    }
}