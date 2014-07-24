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
        //bool AdminSession
        //{
        //    get
        //    {
        //        if (Session["admin"] == null)
        //            Session["admin"] = false;
        //        return (bool)Session["admin"];
        //    }
        //    set { Session["admin"] = value; }
        //}

        int NextPosSession
        {
            get { return (int)Session["nextPos"]; }
            set { Session["nextPos"] = value; }
        }
        
        public ActionResult Index()
        {
            
            NextPosSession = 0;
           // var admin = (bool)Session["admin"];
            ViewBag.Admin = new Shared.ConrollerSession(Session).Admin;
           
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

            //var count = Math.Min(db.Posts.Count(), 10);
            //var from = db.Posts.Count() - count;
            //SetNextPos(from);
            var posts = GetNextItems(10);
           
            return View(new HomeViewModel() { Posts = posts, Preferences = (UserPreferences)taliP });
        }

        [HttpPost]
        public ActionResult NextIndex()
        {
            try
            {
                return Json(GetNextItems(10));               
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
        public ActionResult SignIn(string password)
        {
            var tali = db.UserCredentials.Find("Tali");
            bool correct = (tali.Password == password);
            if (correct)
                new Shared.ConrollerSession(Session).Admin = correct;            
            return Json(correct);
        }

        [HttpPost]
        public ActionResult SignOut()
        {
            new Shared.ConrollerSession(Session).Admin = false;

            return Json(true);
        }
       
        IEnumerable<Post> GetNextItems(int count)
        {
            IEnumerable<Post> rv = new List<Post>();
            var postsLen = db.Posts.Count();

            int from = NextPosSession;// including
            int to = Math.Min(postsLen-1, from+count-1); // including

            if (from < postsLen && from <=  to)
            {
                var posts = db.Posts.OrderByDescending(item => item.Date);
                rv = posts.Skip(from).Take(to - from + 1);

                NextPosSession += (to - from + 1);
            }

            return (rv);
        }

    }
}
