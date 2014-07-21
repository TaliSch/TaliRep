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
            if (Session["admin"] == null)
                Session["admin"] = false;
           // var admin = (bool)Session["admin"];
            ViewBag.Admin = (bool)Session["admin"];
           
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
            IncNextPos(count);
            return View(new HomeViewModel() { Posts = db.Posts.Take(count), Preferences = (UserPreferences)taliP });
        }

        [HttpPost]
        public ActionResult NextIndex()
        {
            try
            {
                int from = (int)Session["nextPos"];
                int to = from + 10;
                
                //var index = "1";
                var count = Math.Min(db.Posts.Count() - from+1, to - from + 1);
                to = from + count;

                List<Post> nextItems = new List<Post>();

                int index = 0;
                foreach(Post post in db.Posts)
                {
                    if (index  >= to)
                        break;
                    if (index >= from)
                        nextItems.Add(post);
                }

                IncNextPos(count);

                return Json(nextItems);
                
               //return Json(db.Posts.Where((item,i)=>i>=from && i< from+count));

                //return Json(db.Posts.Skip(from).Take(count));
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
            bool correct = (tali.Password == password);
            Session["admin"] = correct;
            return Json(correct);
        }

        void IncNextPos(int by)
        {
            var nextPos = Session["nextPos"];
            if (nextPos == null)
            {
                Session["nextPos"] = by;
            }
            else
            {
                Session["nextPos"] = (int)nextPos + by;
            }
        }
    }
}
