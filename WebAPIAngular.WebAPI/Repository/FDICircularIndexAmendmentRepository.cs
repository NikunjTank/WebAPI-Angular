using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FDICircularIndexAmendmentRepository : IFDICircularIndexAmendment
    {
        #region Add FDICircularIndexAmendment
        public int AddFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularIndexAmendmentAdd(fDICircularIndexAmendment.FDICircularId, fDICircularIndexAmendment.PressNoteIds, fDICircularIndexAmendment.FDIChapterId, fDICircularIndexAmendment.FDICircularIndexId, fDICircularIndexAmendment.FDICircularSubIndexId, Utility.TrimString(fDICircularIndexAmendment.IndexAmendmentContent), Utility.TrimString(fDICircularIndexAmendment.Year), fDICircularIndexAmendment.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FDICircularIndexAmendment data
        public int UpdateFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularIndexAmendmentUpdate(fDICircularIndexAmendment.FDICircularIndexAmendmentId, fDICircularIndexAmendment.FDICircularId, fDICircularIndexAmendment.PressNoteIds, fDICircularIndexAmendment.FDIChapterId, fDICircularIndexAmendment.FDICircularIndexId, fDICircularIndexAmendment.FDICircularSubIndexId, Utility.TrimString(fDICircularIndexAmendment.IndexAmendmentContent), Utility.TrimString(fDICircularIndexAmendment.Year), fDICircularIndexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FDICircularIndexAmendment data
        public IEnumerable<FDICircularIndexAmendment> GetFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fDICircularIndexAmendments = dataContext.FDICircularIndexAmendmentGet(fDICircularIndexAmendment.FDICircularIndexAmendmentId, fDICircularIndexAmendment.FDICircularId, Utility.TrimString(fDICircularIndexAmendment.SearchText), fDICircularIndexAmendment.IsActive, fDICircularIndexAmendment.PageNumber, fDICircularIndexAmendment.PageSize, fDICircularIndexAmendment.IsPagingRequired, Utility.TrimString(fDICircularIndexAmendment.OrderBy), Utility.TrimString(fDICircularIndexAmendment.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fDICircularIndexAmendmentList = new List<FDICircularIndexAmendment>();
                foreach (var fDICircularIndexAmendmentDetail in fDICircularIndexAmendments)
                {
                    fDICircularIndexAmendmentList.Add(new FDICircularIndexAmendment()
                    {
                        FDICircularIndexAmendmentId = fDICircularIndexAmendmentDetail.FDICircularIndexAmendmentId,
                        FDICircularId = fDICircularIndexAmendmentDetail.FDICircularId,
                        PressNoteIds = fDICircularIndexAmendmentDetail.PressNoteIds,
                        PressNotes = fDICircularIndexAmendmentDetail.PressNotes,
                        FDIChapterId = fDICircularIndexAmendmentDetail.FDIChapterId,
                        Chapter = fDICircularIndexAmendmentDetail.Chapter,
                        FDICircularIndexId = fDICircularIndexAmendmentDetail.FDICircularIndexId,
                        IndexNo = fDICircularIndexAmendmentDetail.IndexNo,
                        FDICircularSubIndexId = fDICircularIndexAmendmentDetail.FDICircularSubIndexId,
                        SubIndexNo = fDICircularIndexAmendmentDetail.SubIndexNo,
                        IndexAmendmentContent = fDICircularIndexAmendmentDetail.IndexAmendmentContent,
                        Year = fDICircularIndexAmendmentDetail.Year,
                        IsActive = fDICircularIndexAmendmentDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fDICircularIndexAmendmentList;
            }
        }
        #endregion

        #region Delete FDICircularIndexAmendment
        public int DeleteFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularIndexAmendmentDelete(fDICircularIndexAmendment.FDICircularIndexAmendmentId, fDICircularIndexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}