using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SectorRepository : ISector
    {
        #region Add Sector
        public int AddSector(Sector sector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SectorAdd(Utility.TrimString(sector.Name), sector.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update Sector data
        public int UpdateSector(Sector sector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SectorUpdate(sector.SectorId, Utility.TrimString(sector.Name), sector.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get Sector data
        public IEnumerable<Sector> GetSector(Sector sector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var sectors = dataContext.SectorGet(sector.SectorId, Utility.TrimString(sector.SearchText), sector.IsActive, sector.PageNumber, sector.PageSize, sector.IsPagingRequired, Utility.TrimString(sector.OrderBy), Utility.TrimString(sector.OrderByDirection), totalPageCount, totalRecord).ToList();

                var sectorList = new List<Sector>();
                foreach (var sectorDetail in sectors)
                {
                    sectorList.Add(new Sector()
                    {
                        SectorId = sectorDetail.SID,
                        Name = sectorDetail.Name,
                        IsActive = sectorDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return sectorList;
            }
        }
        #endregion

        #region Delete Sector
        public int DeleteSector(Sector sector)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SectorDelete(sector.SectorId, sector.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}