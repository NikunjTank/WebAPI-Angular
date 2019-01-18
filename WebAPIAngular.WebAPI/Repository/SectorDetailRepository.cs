using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SectorDetailRepository : ISectorDetail
    {
        #region Add SectorDetail
        public int AddSectorDetail(SectorDetail sectorDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SectorDetailAdd(sectorDetail.SectorId, sectorDetail.SubSectorId, sectorDetail.Year, sectorDetail.PressNoteId, sectorDetail.NotificationId, sectorDetail.APDIRCircularId, sectorDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update SectorDetail data
        public int UpdateSectorDetail(SectorDetail sectorDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SectorDetailUpdate(sectorDetail.SectorDetailId, sectorDetail.SectorId, sectorDetail.SubSectorId, sectorDetail.Year, sectorDetail.PressNoteId, sectorDetail.NotificationId, sectorDetail.APDIRCircularId, sectorDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get SectorDetail data
        public IEnumerable<SectorDetail> GetSectorDetail(SectorDetail sectorDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var sectorDetails = dataContext.SectorDetailGet(sectorDetail.SectorDetailId, sectorDetail.SectorId, sectorDetail.SubSectorId, Utility.TrimString(sectorDetail.SearchText), sectorDetail.IsActive, sectorDetail.PageNumber, sectorDetail.PageSize, sectorDetail.IsPagingRequired, Utility.TrimString(sectorDetail.OrderBy), Utility.TrimString(sectorDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var sectorDetailList = new List<SectorDetail>();
                foreach (var sectorDetailDetail in sectorDetails)
                {
                    sectorDetailList.Add(new SectorDetail()
                    {
                        SectorDetailId = sectorDetailDetail.SectorDetailId,
                        SectorId = sectorDetailDetail.SectorId,
                        SubSectorId = sectorDetailDetail.SubSectorId,
                        SubSectorName = sectorDetailDetail.SubSectorName,
                        Year = sectorDetailDetail.Year,
                        PressNoteId = sectorDetailDetail.PressNoteId,
                        PressNoteNos = sectorDetailDetail.PressNoteNos,
                        NotificationId = sectorDetailDetail.NotificationId,
                        NotificationNos = sectorDetailDetail.NotificationNumbers,
                        APDIRCircularId = sectorDetailDetail.APDIRCircularId,
                        APDIRCircularNos = sectorDetailDetail.APDIRCircularNos,
                        PressNotePDFs = sectorDetailDetail.PressNotePDFs,
                        NotificationPDFs = sectorDetailDetail.NotificationPDFs,
                        APDIRCircularPDFs = sectorDetailDetail.APDIRCircularPDFs,
                        IsActive = sectorDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return sectorDetailList;
            }
        }
        #endregion

        #region Delete SectorDetail
        public int DeleteSectorDetail(SectorDetail sectorDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SectorDetailDelete(sectorDetail.SectorDetailId, sectorDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}