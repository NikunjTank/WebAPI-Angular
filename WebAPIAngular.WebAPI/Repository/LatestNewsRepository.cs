using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class LatestNewsRepository : ILatestNews
    {
        #region Get latest news data
        public IEnumerable<LatestNews> GetLatestNews()
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                var latestNewss = dataContext.LatestNewsGet().ToList();

                var latestNewsList = new List<LatestNews>();
                foreach (var lastesNewsDetail in latestNewss)
                {
                    latestNewsList.Add(new LatestNews()
                    {
                        CategoryId = Convert.ToInt32(lastesNewsDetail.CategoryId),
                        Number = lastesNewsDetail.Number,
                        Name = lastesNewsDetail.Name,
                        PDF = lastesNewsDetail.PDF
                    });
                }
                return latestNewsList;
            }
        }
        #endregion
    }
}