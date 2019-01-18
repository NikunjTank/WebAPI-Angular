using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FetersCodeRepository : IFetersCode
    {
        #region Add FetersCode
        public int AddFetersCode(FetersCode fetersCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeAdd(Utility.TrimString(fetersCode.FetersCodeName), Utility.TrimString(fetersCode.PDF), fetersCode.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FetersCode data
        public int UpdateFetersCode(FetersCode fetersCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeUpdate(fetersCode.FetersCodeId, Utility.TrimString(fetersCode.FetersCodeName), Utility.TrimString(fetersCode.PDF), fetersCode.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FetersCode data
        public IEnumerable<FetersCode> GetFetersCode(FetersCode fetersCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fetersCodes = dataContext.FetersCodeGet(fetersCode.FetersCodeId, Utility.TrimString(fetersCode.SearchText), fetersCode.IsActive, fetersCode.PageNumber, fetersCode.PageSize, fetersCode.IsPagingRequired, Utility.TrimString(fetersCode.OrderBy), Utility.TrimString(fetersCode.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fetersCodeList = new List<FetersCode>();
                foreach (var fetersCodeDetail in fetersCodes)
                {
                    fetersCodeList.Add(new FetersCode()
                    {
                        FetersCodeId = fetersCodeDetail.Id,
                        FetersCodeName = fetersCodeDetail.FetersCodeName,
                        PDF = fetersCodeDetail.PDF,
                        IsActive = fetersCodeDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fetersCodeList;
            }
        }
        #endregion

        #region Delete FetersCode
        public int DeleteFetersCode(FetersCode fetersCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FetersCodeDelete(fetersCode.FetersCodeId, fetersCode.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}