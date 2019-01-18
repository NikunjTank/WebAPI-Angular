using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FIPBPressReleaseCaseRepository : IFIPBPressReleaseCase
    {
        #region Add FIPBPressReleaseCase
        public int AddFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FIPBPressReleaseCaseAdd(Utility.TrimString(fIPBPressReleaseCase.MinistryName), Utility.TrimString(fIPBPressReleaseCase.MeetingNo_Detail), Utility.TrimString(fIPBPressReleaseCase.PDF), fIPBPressReleaseCase.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FIPBPressReleaseCase data
        public int UpdateFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FIPBPressReleaseCaseUpdate(fIPBPressReleaseCase.FIPBPressReleaseCaseId, Utility.TrimString(fIPBPressReleaseCase.MinistryName), Utility.TrimString(fIPBPressReleaseCase.MeetingNo_Detail), Utility.TrimString(fIPBPressReleaseCase.PDF), fIPBPressReleaseCase.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FIPBPressReleaseCase data
        public IEnumerable<FIPBPressReleaseCase> GetFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fIPBPressReleaseCases = dataContext.FIPBPressReleaseCaseGet(fIPBPressReleaseCase.FIPBPressReleaseCaseId, Utility.TrimString(fIPBPressReleaseCase.SearchText), fIPBPressReleaseCase.IsActive, fIPBPressReleaseCase.PageNumber, fIPBPressReleaseCase.PageSize, fIPBPressReleaseCase.IsPagingRequired, Utility.TrimString(fIPBPressReleaseCase.OrderBy), Utility.TrimString(fIPBPressReleaseCase.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fIPBPressReleaseCaseList = new List<FIPBPressReleaseCase>();
                foreach (var fIPBPressReleaseCaseDetail in fIPBPressReleaseCases)
                {
                    fIPBPressReleaseCaseList.Add(new FIPBPressReleaseCase()
                    {
                        FIPBPressReleaseCaseId = fIPBPressReleaseCaseDetail.FIPBPressReleaseCaseId,
                        MinistryName = fIPBPressReleaseCaseDetail.MinistryName,
                        MeetingNo_Detail = fIPBPressReleaseCaseDetail.MeetingNo_Detail,
                        PDF = fIPBPressReleaseCaseDetail.PDF,
                        IsActive = fIPBPressReleaseCaseDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fIPBPressReleaseCaseList;
            }
        }
        #endregion

        #region Delete FIPBPressReleaseCase
        public int DeleteFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FIPBPressReleaseCaseDelete(fIPBPressReleaseCase.FIPBPressReleaseCaseId, fIPBPressReleaseCase.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}