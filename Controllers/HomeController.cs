using MyBlogEmpty.Models;
using MyBlogEmpty.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyBlogEmpty.Controllers
{
    [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
    public class HomeController : Controller
    {
        private BlogDBContext db = new BlogDBContext();

        public ActionResult Index()
        {
            ViewBag.Admin = new Shared.ConrollerSession(Session).Admin;

            var taliP = db.UserPreferences.Find("Tali");
            if (taliP == null)
            {
                var taliC = new Models.UserCredentials() { ID = "Tali", Password = "ykhBlog" };
                taliP = new Models.UserPreferences() { ID = "Tali", Style = "2", Title = "Tali's Blog" };
                db.UserCredentials.Add(taliC);
                db.UserPreferences.Add(taliP);
                db.SaveChanges();
            }
            else if (string.IsNullOrEmpty(taliP.Title))
            {
                taliP.Title = "Tali's Blog";
                db.Entry(taliP).State = EntityState.Modified;
                db.SaveChanges();
            }

          
            return View((UserPreferences)taliP);
        }
        
        //public ActionResult Index(int from = 0, int to = 9)
        //{          
        //    ViewBag.Admin = new Shared.ConrollerSession(Session).Admin;
           
        //    var taliP = db.UserPreferences.Find("Tali");
        //    if (taliP == null)
        //    {
        //        var taliC = new Models.UserCredentials() { ID = "Tali", Password = "ykhBlog"};
        //        taliP = new Models.UserPreferences() { ID = "Tali", Style = "2", Title = "Tali's Blog" };
        //        db.UserCredentials.Add(taliC);
        //        db.UserPreferences.Add(taliP);
        //        db.SaveChanges();
        //    }
        //    else if (string.IsNullOrEmpty(taliP.Title))
        //    {
        //        taliP.Title = "Tali's Blog";
        //        db.Entry(taliP).State = EntityState.Modified;
        //        db.SaveChanges();
        //    }

        //    var posts = GetNextItems(from, to);
           
        //    return View(new HomeViewModel() { Posts = posts, Preferences = (UserPreferences)taliP });
        //}
     
        public ActionResult NextIndex(int from, int to)
        {
            try
            {
                return Json(GetNextItems(from, to), JsonRequestBehavior.AllowGet);               
            }
            catch (Exception)
            {
            }
            
            return Json(new List<Post>(), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult SignIn(string password)
        {
            var tali = db.UserCredentials.Find("Tali");
            bool correct = (tali.Password == password);
            if (correct)
                new Shared.ConrollerSession(Session).Admin = correct;            
            return Json(correct);
        }

        public ActionResult SignOut()
        {
            new Shared.ConrollerSession(Session).Admin = false;

            return Json(true, JsonRequestBehavior.AllowGet);
        }
       
        IEnumerable<Post> GetNextItems(int from, int to)
        {
            IEnumerable<Post> rv = new List<Post>();
            var postsLen = db.Posts.Count();
            
            to = Math.Min(postsLen-1, to); // including

            if (from < postsLen && from <=  to)
            {
                var posts = db.Posts.OrderByDescending(item => item.Date);
                rv = posts.Skip(from).Take(to - from + 1);
            }

            return (rv);
        }

    }
}
