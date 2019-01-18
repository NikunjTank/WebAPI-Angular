using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class PressNoteAPDIRCircularRepository : IPressNoteAPDIRCircular
    {
        #region Add PressNoteAPDIRCircular
        public int AddPressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteAPDIRCircularAdd(pressNoteAPDIRCircular.PressNoteId, pressNoteAPDIRCircular.APDIRCircularId, pressNoteAPDIRCircular.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update PressNoteAPDIRCircular data
        public int UpdatePressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteAPDIRCircularUpdate(pressNoteAPDIRCircular.PressNoteAPDIRCircularId, pressNoteAPDIRCircular.PressNoteId, pressNoteAPDIRCircular.APDIRCircularId, pressNoteAPDIRCircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get PressNoteAPDIRCircular data
        public IEnumerable<PressNoteAPDIRCircular> GetPressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var pressNoteAPDIRCirculars = dataContext.PressNoteAPDIRCircularGet(pressNoteAPDIRCircular.PressNoteAPDIRCircularId, pressNoteAPDIRCircular.PressNoteId, Utility.TrimString(pressNoteAPDIRCircular.SearchText), pressNoteAPDIRCircular.IsActive, pressNoteAPDIRCircular.PageNumber, pressNoteAPDIRCircular.PageSize, pressNoteAPDIRCircular.IsPagingRequired, Utility.TrimString(pressNoteAPDIRCircular.OrderBy), Utility.TrimString(pressNoteAPDIRCircular.OrderByDirection), totalPageCount, totalRecord).ToList();

                var pressNoteAPDIRCircularList = new List<PressNoteAPDIRCircular>();
                foreach (var pressNoteAPDIRCircularDetail in pressNoteAPDIRCirculars)
                {
                    pressNoteAPDIRCircularList.Add(new PressNoteAPDIRCircular()
                    {
                        PressNoteAPDIRCircularId = pressNoteAPDIRCircularDetail.PressNoteAPDIRCircularId,
                        PressNoteId = pressNoteAPDIRCircularDetail.PressNoteId,
                        APDIRCircularId = pressNoteAPDIRCircularDetail.APDIRCircularId,
                        APDIRCircularNo = pressNoteAPDIRCircularDetail.APDIRCircularNo,
                        APDIRCircularName = pressNoteAPDIRCircularDetail.APDIRCircularName,
                        APDIRCircularDate = pressNoteAPDIRCircularDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = pressNoteAPDIRCircularDetail.APDIRCircularEffectiveDate,
                        Year = pressNoteAPDIRCircularDetail.Year,
                        APDIRCircularPDF = pressNoteAPDIRCircularDetail.PDF,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return pressNoteAPDIRCircularList;
            }
        }
        #endregion

        #region Delete PressNoteAPDIRCircular
        public int DeletePressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteAPDIRCircularDelete(pressNoteAPDIRCircular.PressNoteAPDIRCircularId, pressNoteAPDIRCircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}