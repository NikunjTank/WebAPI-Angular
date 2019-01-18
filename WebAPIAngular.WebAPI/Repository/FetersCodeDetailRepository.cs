using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FetersCodeDetailRepository : IFetersCodeDetail
    {
        #region Add FetersCodeDetail
        public int AddFetersCodeDetail(FetersCodeDetail fetersCodeDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeDetailAdd(fetersCodeDetail.FetersCodeId, Utility.TrimString(fetersCodeDetail.GroupNo), Utility.TrimString(fetersCodeDetail.PurposeGroupName), Utility.TrimString(fetersCodeDetail.LRSItem), Utility.TrimString(fetersCodeDetail.LRSFetersCode), fetersCodeDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FetersCodeDetail data
        public int UpdateFetersCodeDetail(FetersCodeDetail fetersCodeDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeDetailUpdate(fetersCodeDetail.FetersCodeDetailId, fetersCodeDetail.FetersCodeId, Utility.TrimString(fetersCodeDetail.GroupNo), Utility.TrimString(fetersCodeDetail.PurposeGroupName), Utility.TrimString(fetersCodeDetail.LRSItem), Utility.TrimString(fetersCodeDetail.LRSFetersCode), fetersCodeDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FetersCodeDetail data
        public IEnumerable<FetersCodeDetail> GetFetersCodeDetail(FetersCodeDetail fetersCodeDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fetersCodeDetails = dataContext.FetersCodeDetailGet(fetersCodeDetail.FetersCodeDetailId, fetersCodeDetail.FetersCodeId, Utility.TrimString(fetersCodeDetail.SearchText), fetersCodeDetail.IsActive, fetersCodeDetail.PageNumber, fetersCodeDetail.PageSize, fetersCodeDetail.IsPagingRequired, Utility.TrimString(fetersCodeDetail.OrderBy), Utility.TrimString(fetersCodeDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fetersCodeDetailList = new List<FetersCodeDetail>();
                foreach (var fetersCodeDetailDetail in fetersCodeDetails)
                {
                    fetersCodeDetailList.Add(new FetersCodeDetail()
                    {
                        FetersCodeId = fetersCodeDetailDetail.FetersCodeId,
                        FetersCodeDetailId = fetersCodeDetailDetail.FetersCodeDetailId,
                        GroupNo = fetersCodeDetailDetail.GroupNo,
                        PurposeGroupName = fetersCodeDetailDetail.PurposeGroupName,
                        SerialNo = fetersCodeDetailDetail.SerialNo,
                        LRSItem = fetersCodeDetailDetail.LRSItem,
                        LRSFetersCode = fetersCodeDetailDetail.LRSFetersCode,
                        IsActive = fetersCodeDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fetersCodeDetailList;
            }
        }
        #endregion

        #region Delete FetersCodeDetail
        public int DeleteFetersCodeDetail(FetersCodeDetail fetersCodeDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeDetailDelete(fetersCodeDetail.FetersCodeDetailId, fetersCodeDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}