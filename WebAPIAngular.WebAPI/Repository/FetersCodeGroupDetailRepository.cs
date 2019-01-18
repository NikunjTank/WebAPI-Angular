using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FetersCodeGroupDetailRepository : IFetersCodeGroupDetail
    {
        #region Add FetersCodeGroupDetail
        public int AddFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeGroupDetailAdd(fetersCodeGroupDetail.FetersCodeDetailId, Utility.TrimString(fetersCodeGroupDetail.PurposeCode), Utility.TrimString(fetersCodeGroupDetail.Description), fetersCodeGroupDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FetersCodeGroupDetail data
        public int UpdateFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeGroupDetailUpdate(fetersCodeGroupDetail.FetersCodeGroupDetailId, fetersCodeGroupDetail.FetersCodeDetailId, Utility.TrimString(fetersCodeGroupDetail.PurposeCode), Utility.TrimString(fetersCodeGroupDetail.Description), fetersCodeGroupDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FetersCodeGroupDetail data
        public IEnumerable<FetersCodeGroupDetail> GetFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fetersCodeGroupDetails = dataContext.FetersCodeGroupDetailGet(fetersCodeGroupDetail.FetersCodeGroupDetailId, fetersCodeGroupDetail.FetersCodeDetailId, Utility.TrimString(fetersCodeGroupDetail.SearchText), fetersCodeGroupDetail.IsActive, fetersCodeGroupDetail.PageNumber, fetersCodeGroupDetail.PageSize, fetersCodeGroupDetail.IsPagingRequired, Utility.TrimString(fetersCodeGroupDetail.OrderBy), Utility.TrimString(fetersCodeGroupDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fetersCodeGroupDetailList = new List<FetersCodeGroupDetail>();
                foreach (var fetersCodeGroupDetailDetail in fetersCodeGroupDetails)
                {
                    fetersCodeGroupDetailList.Add(new FetersCodeGroupDetail()
                    {
                        FetersCodeDetailId = fetersCodeGroupDetailDetail.FetersCodeDetailId,
                        FetersCodeGroupDetailId = fetersCodeGroupDetailDetail.FetersCodeGroupDetailId,
                        PurposeCode = fetersCodeGroupDetailDetail.PurposeCode,
                        Description = fetersCodeGroupDetailDetail.Description,
                        IsActive = fetersCodeGroupDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fetersCodeGroupDetailList;
            }
        }
        #endregion

        #region Delete FetersCodeGroupDetail
        public int DeleteFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeGroupDetailDelete(fetersCodeGroupDetail.FetersCodeGroupDetailId, fetersCodeGroupDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}