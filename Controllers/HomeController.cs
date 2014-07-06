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
        //
        // GET: /Home/

        //public ActionResult Index()
        //{
        //    return View();
        //}

        private PostDBContext2 db = new PostDBContext2();
        //
        // GET: /Editor/

        public ActionResult Index()
        {
            return View(db.Posts.ToList());
        }

    }
}
