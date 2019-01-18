using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class KeyDefinitionEventRepository : IKeyDefinitionEvent
    {
        #region Add all keyDefinitionEvent
        public int AddKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.KeyDefinitionEventAdd(Utility.TrimString(keyDefinitionEvent.DefinitionEventName), keyDefinitionEvent.ModuleIds, Utility.TrimString(keyDefinitionEvent.DefinitionName), Utility.TrimString(keyDefinitionEvent.DefinitionAuthorNote), Utility.TrimString(keyDefinitionEvent.DefinitionContent), Utility.TrimString(keyDefinitionEvent.EventName), keyDefinitionEvent.EventDate, Utility.TrimString(keyDefinitionEvent.EventAuthorNote), keyDefinitionEvent.NotificationIds, keyDefinitionEvent.GSRNotificationIds, keyDefinitionEvent.FDICircularIds, keyDefinitionEvent.PressNoteIds, keyDefinitionEvent.ActIds, keyDefinitionEvent.MasterDirectionIds, keyDefinitionEvent.APDIRCircularIds, keyDefinitionEvent.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update keyDefinitionEvent data
        public int UpdateKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.KeyDefinitionEventUpdate(keyDefinitionEvent.KeyDefinitionEventId, Utility.TrimString(keyDefinitionEvent.DefinitionEventName), keyDefinitionEvent.ModuleIds, Utility.TrimString(keyDefinitionEvent.DefinitionName), Utility.TrimString(keyDefinitionEvent.DefinitionAuthorNote), Utility.TrimString(keyDefinitionEvent.DefinitionContent), Utility.TrimString(keyDefinitionEvent.EventName), keyDefinitionEvent.EventDate, Utility.TrimString(keyDefinitionEvent.EventAuthorNote), keyDefinitionEvent.NotificationIds, keyDefinitionEvent.GSRNotificationIds, keyDefinitionEvent.FDICircularIds, keyDefinitionEvent.PressNoteIds, keyDefinitionEvent.ActIds, keyDefinitionEvent.MasterDirectionIds, keyDefinitionEvent.APDIRCircularIds, keyDefinitionEvent.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get keyDefinitionEvent data
        public IEnumerable<KeyDefinitionEvent> GetKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var keyDefinitionEvents = dataContext.KeyDefinitionEventGet(keyDefinitionEvent.KeyDefinitionEventId, Utility.TrimString(keyDefinitionEvent.DefinitionEventName), Utility.TrimString(keyDefinitionEvent.SearchText), keyDefinitionEvent.IsActive, keyDefinitionEvent.PageNumber, keyDefinitionEvent.PageSize, keyDefinitionEvent.IsPagingRequired, Utility.TrimString(keyDefinitionEvent.OrderBy), Utility.TrimString(keyDefinitionEvent.OrderByDirection), totalPageCount, totalRecord).ToList();

                var keyDefinitionEventList = new List<KeyDefinitionEvent>();
                foreach (var keyDefinitionEventDetail in keyDefinitionEvents)
                {
                    keyDefinitionEventList.Add(new KeyDefinitionEvent()
                    {
                        KeyDefinitionEventId = keyDefinitionEventDetail.KeyDefinitionEventId,
                        DefinitionName = keyDefinitionEventDetail.DefinitionName,
                        DefinitionAuthorNote = keyDefinitionEventDetail.DefinitionAuthorNote,
                        DefinitionContent = keyDefinitionEventDetail.DefinitionContent,
                        EventName = keyDefinitionEventDetail.EventName,
                        EventAuthorNote = keyDefinitionEventDetail.EventAuthorNote,
                        EventDate = keyDefinitionEventDetail.EventDate,
                        ModuleIds = keyDefinitionEventDetail.CommonFieldModuleIds,
                        Modules = keyDefinitionEventDetail.Modules,
                        Notifications = keyDefinitionEventDetail.Notifications,
                        GSRNotifications = keyDefinitionEventDetail.GSRNotifications,
                        FDICirculars = keyDefinitionEventDetail.FDICirculars,
                        PressNotes = keyDefinitionEventDetail.PressNotes,
                        Acts = keyDefinitionEventDetail.Acts,
                        MasterDirections = keyDefinitionEventDetail.MasterDirections,
                        APDIRCirculars = keyDefinitionEventDetail.APDIRCirculars,
                        NotificationIds = keyDefinitionEventDetail.NotificationIds,
                        GSRNotificationIds = keyDefinitionEventDetail.GSRNotificationIds,
                        FDICircularIds = keyDefinitionEventDetail.FDICircularIds,
                        PressNoteIds = keyDefinitionEventDetail.PressNoteIds,
                        ActIds = keyDefinitionEventDetail.ActIds,
                        MasterDirectionIds = keyDefinitionEventDetail.MasterDirectionIds,
                        APDIRCircularIds = keyDefinitionEventDetail.APDIRCircularIds,
                        IsActive = keyDefinitionEventDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return keyDefinitionEventList;
            }
        }
        #endregion

        #region Delete keyDefinitionEvent
        public int DeleteKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.KeyDefinitionEventDelete(keyDefinitionEvent.KeyDefinitionEventId, keyDefinitionEvent.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}