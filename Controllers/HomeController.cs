using MyBlogEmpty.Models;
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
            //var tali = db.Users.Find("Tali");
            //if (tali == null)
            //{
            //    db.Users.Add(new Models.User() { ID = "Tali", Password = "ykhBlog", Style = "2" });
            //    db.SaveChanges();
            //}
            //var index = db.Users.Find("Tali").Style;
            var index = "1";
            ViewBag.StyleIndex = index;
            return View();
        }

        [HttpPost]
        public ActionResult Index(int from, int to)
        {
            //var index = db.Users.Find("Tali").Style;
            var index = "1";
            ViewBag.StyleIndex = index;
            return Json(db.PostDatas);
        }

        [HttpPost]
        public ActionResult Style(string styleIndex)
        {
            var user = db.Users.Find("Tali");
            user.Style = styleIndex;
            db.Entry(user).State = EntityState.Modified;
            db.SaveChanges();

            return Json(true);
        }

    }
}
