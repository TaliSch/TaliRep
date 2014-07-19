using MyBlogEmpty.Models;
using MyBlogEmpty.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyBlogEmpty.Controllers
{
    public class HomeController : Controller
    {
        private BlogDBContext db = new BlogDBContext();
        // GET: /Home/

        public ActionResult Index()
        {
            var taliP = db.UserPreferences.Find("Tali");
            if (taliP == null)
            {
                var taliC = new Models.UserCredentials() { ID = "Tali", Password = "ykhBlog"};
                taliP = new Models.UserPreferences() { ID = "Tali", Style = "2", Name = "Tali's Blog", Title = "Tali's Blog" };
                db.UserCredentials.Add(taliC);
                db.UserPreferences.Add(taliP);
                db.SaveChanges();
            }
            else if (string.IsNullOrEmpty(taliP.Title))
            {
                taliP.Title = taliP.Name = "Tali's Blog";
                db.Entry(taliP).State = EntityState.Modified;
                db.SaveChanges();
            }

            var count = Math.Min(db.Posts.Count(), 10);
            
            return View(new HomeViewModel() { Posts = db.Posts.Take(count), Preferences = (UserPreferences)taliP });
        }

        [HttpPost]
        public ActionResult Index(int from, int to)
        {
            try
            {
                var index = db.UserPreferences.Find("Tali").Style;
                //var index = "1";
                var count = Math.Min(db.Posts.Count() - from, to - from + 1);
                return Json(db.Posts.Skip(from).Take(count));
            }
            catch (Exception)
            {
            }
            return Json(new List<Post>());
        }

        [HttpPost]
        public ActionResult Style(string styleIndex)
        {
            var user = db.UserPreferences.Find("Tali");
            user.Style = styleIndex;
            db.Entry(user).State = EntityState.Modified;
            db.SaveChanges();

            return Json(true);
        }

        [HttpPost]
        public ActionResult Login(string password)
        {
            var tali = db.UserCredentials.Find("Tali");
            return Json(tali.Password == password);
        }
    }
}
