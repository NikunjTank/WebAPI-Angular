using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class PressNoteRepository : IPressNote
    {
        #region Add PressNote
        public int AddPressNote(PressNote pressNote)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteAdd(Utility.TrimString(pressNote.PressNoteNo), Utility.TrimString(pressNote.PressNoteName), pressNote.PressNoteDate, pressNote.PressNoteEffectiveDate, Utility.TrimString(pressNote.Year), Utility.TrimString(pressNote.PressNotePDF), pressNote.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update PressNote data
        public int UpdatePressNote(PressNote pressNote)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteUpdate(pressNote.PressNoteId, Utility.TrimString(pressNote.PressNoteNo), Utility.TrimString(pressNote.PressNoteName), pressNote.PressNoteDate, pressNote.PressNoteEffectiveDate, Utility.TrimString(pressNote.Year), Utility.TrimString(pressNote.PressNotePDF), pressNote.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get PressNote data
        public IEnumerable<PressNote> GetPressNote(PressNote pressNote)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var pressNotes = dataContext.PressNoteGet(pressNote.PressNoteId, Utility.TrimString(pressNote.Year), Utility.TrimString(pressNote.SearchText), pressNote.IsActive, pressNote.PageNumber, pressNote.PageSize, pressNote.IsPagingRequired, Utility.TrimString(pressNote.OrderBy), Utility.TrimString(pressNote.OrderByDirection), totalPageCount, totalRecord).ToList();

                var pressNoteList = new List<PressNote>();
                foreach (var pressNoteDetail in pressNotes)
                {
                    pressNoteList.Add(new PressNote()
                    {
                        PressNoteId = pressNoteDetail.PressNoteId,
                        PressNoteNo = pressNoteDetail.PressNoteNo,
                        PressNoteName = pressNoteDetail.PressNoteName,
                        PressNoteDate = pressNoteDetail.PressNoteDate,
                        PressNoteEffectiveDate = pressNoteDetail.PressNoteEffectiveDate,
                        Year = pressNoteDetail.Year,
                        PressNotePDF = pressNoteDetail.PDF,
                        IsActive = pressNoteDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return pressNoteList;
            }
        }
        #endregion

        #region Delete PressNote
        public int DeletePressNote(PressNote pressNote)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteDelete(pressNote.PressNoteId, pressNote.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}