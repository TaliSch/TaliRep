using MyBlogEmpty.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyBlogEmpty.Controllers
{
    public class HomeController : Controller
    {
        private PostDBContext db = new PostDBContext();
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(int from, int to)
        {
            return Json(db.PostDatas);
        }

    }
}
