using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterDirectionIndexAmendmentRepository : IMasterDirectionIndexAmendment
    {
        #region Add MasterDirectionIndexAmendment
        public int AddMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MDIndexAmendmentAdd(masterDirectionIndexAmendment.MasterDirectionId, masterDirectionIndexAmendment.APDIRCircularIds, masterDirectionIndexAmendment.NotificationIds, masterDirectionIndexAmendment.MasterDirectionChapterId, masterDirectionIndexAmendment.MasterDirectionIndexId, masterDirectionIndexAmendment.MasterDirectionSubIndexId, Utility.TrimString(masterDirectionIndexAmendment.IndexAmendmentContent), Utility.TrimString(masterDirectionIndexAmendment.Year), masterDirectionIndexAmendment.UpdatedInsertedByRBI, masterDirectionIndexAmendment.UpdatedInsertedDateByRBI, masterDirectionIndexAmendment.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update MasterDirectionIndexAmendment data
        public int UpdateMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MDIndexAmendmentUpdate(masterDirectionIndexAmendment.MasterDirectionIndexAmendmentId, masterDirectionIndexAmendment.MasterDirectionId, masterDirectionIndexAmendment.APDIRCircularIds, masterDirectionIndexAmendment.NotificationIds, masterDirectionIndexAmendment.MasterDirectionChapterId, masterDirectionIndexAmendment.MasterDirectionIndexId, masterDirectionIndexAmendment.MasterDirectionSubIndexId, Utility.TrimString(masterDirectionIndexAmendment.IndexAmendmentContent), Utility.TrimString(masterDirectionIndexAmendment.Year), masterDirectionIndexAmendment.UpdatedInsertedByRBI, masterDirectionIndexAmendment.UpdatedInsertedDateByRBI, masterDirectionIndexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get MasterDirectionIndexAmendment data
        public IEnumerable<MasterDirectionIndexAmendment> GetMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterDirectionIndexAmendments = dataContext.MDIndexAmendmentGet(masterDirectionIndexAmendment.MasterDirectionIndexAmendmentId, masterDirectionIndexAmendment.MasterDirectionId, Utility.TrimString(masterDirectionIndexAmendment.SearchText), masterDirectionIndexAmendment.IsActive, masterDirectionIndexAmendment.PageNumber, masterDirectionIndexAmendment.PageSize, masterDirectionIndexAmendment.IsPagingRequired, Utility.TrimString(masterDirectionIndexAmendment.OrderBy), Utility.TrimString(masterDirectionIndexAmendment.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterDirectionIndexAmendmentList = new List<MasterDirectionIndexAmendment>();
                foreach (var masterDirectionIndexAmendmentDetail in masterDirectionIndexAmendments)
                {
                    masterDirectionIndexAmendmentList.Add(new MasterDirectionIndexAmendment()
                    {
                        MasterDirectionIndexAmendmentId = masterDirectionIndexAmendmentDetail.MasterDirectionIndexAmendmentId,
                        MasterDirectionId = masterDirectionIndexAmendmentDetail.MasterDirectionId,
                        APDIRCircularIds = masterDirectionIndexAmendmentDetail.APDIRCircularIds,
                        APDIRCirculars = masterDirectionIndexAmendmentDetail.APDIRCirculars,
                        NotificationIds = masterDirectionIndexAmendmentDetail.NotificationIds,
                        Notifications = masterDirectionIndexAmendmentDetail.Notifications,
                        MasterDirectionChapterId = masterDirectionIndexAmendmentDetail.MasterDirectionChapterId,
                        Chapter = masterDirectionIndexAmendmentDetail.PartData,
                        MasterDirectionIndexId = masterDirectionIndexAmendmentDetail.MasterDirectionIndexId,
                        IndexNo = masterDirectionIndexAmendmentDetail.ParaIndexNo,
                        IndexName = masterDirectionIndexAmendmentDetail.IndexName,
                        MasterDirectionSubIndexId = masterDirectionIndexAmendmentDetail.MasterDirectionSubIndexId,
                        SubIndexNo = masterDirectionIndexAmendmentDetail.SubIndexNo,
                        SubIndexName = masterDirectionIndexAmendmentDetail.SubIndexName,
                        IndexAmendmentContent = masterDirectionIndexAmendmentDetail.IndexAmendmentContent,
                        Year = masterDirectionIndexAmendmentDetail.Year,
                        UpdatedInsertedByRBI = masterDirectionIndexAmendmentDetail.UpdatedInsertedByRBI,
                        UpdatedInsertedDateByRBI = masterDirectionIndexAmendmentDetail.UpdatedInsertedDateByRBI,
                        IsActive = masterDirectionIndexAmendmentDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterDirectionIndexAmendmentList;
            }
        }
        #endregion

        #region Delete MasterDirectionIndexAmendment
        public int DeleteMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MDIndexAmendmentDelete(masterDirectionIndexAmendment.MasterDirectionIndexAmendmentId, masterDirectionIndexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}