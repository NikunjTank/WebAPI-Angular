using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RBIDataDetailRepository : IRBIDataDetail
    {
        #region Add RBIDataDetail
        public int AddRBIDataDetail(RBIDataDetail rBIDataDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBIDataDetailAdd(rBIDataDetail.RBIDataId, rBIDataDetail.Month, rBIDataDetail.Year, Utility.TrimString(rBIDataDetail.Excel), Utility.TrimString(rBIDataDetail.PDF), rBIDataDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update RBIDataDetail data
        public int UpdateRBIDataDetail(RBIDataDetail rBIDataDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBIDataDetailUpdate(rBIDataDetail.RBIDataDetailId, rBIDataDetail.RBIDataId, rBIDataDetail.Month, rBIDataDetail.Year, Utility.TrimString(rBIDataDetail.Excel), Utility.TrimString(rBIDataDetail.PDF), rBIDataDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get RBIDataDetail data
        public IEnumerable<RBIDataDetail> GetRBIDataDetail(RBIDataDetail rBIDataDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var rBIDataDetails = dataContext.RBIDataDetailGet(rBIDataDetail.RBIDataDetailId, rBIDataDetail.RBIDataId, rBIDataDetail.Year, rBIDataDetail.Month, Utility.TrimString(rBIDataDetail.SearchText), rBIDataDetail.IsActive, rBIDataDetail.PageNumber, rBIDataDetail.PageSize, rBIDataDetail.IsPagingRequired, Utility.TrimString(rBIDataDetail.OrderBy), Utility.TrimString(rBIDataDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rBIDataDetailList = new List<RBIDataDetail>();
                foreach (var rBIDataDetailDetail in rBIDataDetails)
                {
                    rBIDataDetailList.Add(new RBIDataDetail()
                    {
                        RBIDataDetailId = rBIDataDetailDetail.RBIDataDetailId,
                        RBIDataId = rBIDataDetailDetail.RBIDataId,
                        Month = rBIDataDetailDetail.Month,
                        Year = rBIDataDetailDetail.Year,
                        Excel = rBIDataDetailDetail.Excel,
                        PDF = rBIDataDetailDetail.PDF,
                        IsActive = rBIDataDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rBIDataDetailList;
            }
        }
        #endregion

        #region Delete RBIDataDetail
        public int DeleteRBIDataDetail(RBIDataDetail rBIDataDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBIDataDetailDelete(rBIDataDetail.RBIDataDetailId, rBIDataDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}