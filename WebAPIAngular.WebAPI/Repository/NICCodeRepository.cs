using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class NICCodeRepository : INICCode
    {
        #region Add NICCode
        public int AddNICCode(NICCode nICCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.NICCodeAdd(Utility.TrimString(nICCode.NICCodeName), Utility.TrimString(nICCode.PDF), nICCode.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update NICCode data
        public int UpdateNICCode(NICCode nICCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.NICCodeUpdate(nICCode.NICCodeId, Utility.TrimString(nICCode.NICCodeName), Utility.TrimString(nICCode.PDF), nICCode.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get NICCode data
        public IEnumerable<NICCode> GetNICCode(NICCode nICCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var nICCodes = dataContext.NICCodeGet(nICCode.NICCodeId, Utility.TrimString(nICCode.SearchText), nICCode.IsActive, nICCode.PageNumber, nICCode.PageSize, nICCode.IsPagingRequired, Utility.TrimString(nICCode.OrderBy), Utility.TrimString(nICCode.OrderByDirection), totalPageCount, totalRecord).ToList();

                var nICCodeList = new List<NICCode>();
                foreach (var nICCodeDetail in nICCodes)
                {
                    nICCodeList.Add(new NICCode()
                    {
                        NICCodeId = nICCodeDetail.NICCodeId,
                        NICCodeName = nICCodeDetail.NICCodeName,
                        PDF = nICCodeDetail.PDF,
                        IsActive = nICCodeDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return nICCodeList;
            }
        }
        #endregion

        #region Delete NICCode
        public int DeleteNICCode(NICCode nICCode)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.NICCodeDelete(nICCode.NICCodeId, nICCode.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}