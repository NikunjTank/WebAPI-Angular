using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SubSectorRepository : ISubSector
    {
        #region Add SubSector
        public int AddSubSector(SubSector subSector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SubSectorAdd(subSector.SectorId, Utility.TrimString(subSector.Name), subSector.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update SubSector data
        public int UpdateSubSector(SubSector subSector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SubSectorUpdate(subSector.SubSectorId, subSector.SectorId, Utility.TrimString(subSector.Name), subSector.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get SubSector data
        public IEnumerable<SubSector> GetSubSector(SubSector subSector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var subSectors = dataContext.SubSectorGet(subSector.SubSectorId, subSector.SectorId, Utility.TrimString(subSector.SearchText), subSector.IsActive, subSector.PageNumber, subSector.PageSize, subSector.IsPagingRequired, Utility.TrimString(subSector.OrderBy), Utility.TrimString(subSector.OrderByDirection), totalPageCount, totalRecord).ToList();

                var subSectorList = new List<SubSector>();
                foreach (var subSectorDetail in subSectors)
                {
                    subSectorList.Add(new SubSector()
                    {
                        SubSectorId = subSectorDetail.SubSectorId,
                        SectorId = subSectorDetail.SectorId,
                        Name = subSectorDetail.Name,
                        IsActive = subSectorDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return subSectorList;
            }
        }
        #endregion

        #region Delete SubSector
        public int DeleteSubSector(SubSector subSector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SubSectorDelete(subSector.SubSectorId, subSector.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}