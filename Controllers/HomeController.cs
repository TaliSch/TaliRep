﻿using MyBlogEmpty.Models;
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
        private PostDBContext db = new PostDBContext();
        // GET: /Home/

        public ActionResult Index()
        {          
            var index = db.Users.Find("Tali").Style;

            ViewBag.StyleIndex = index;
            return View();
        }

        [HttpPost]
        public ActionResult Index(int from, int to)
        {
            var index = db.Users.Find("Tali").Style;

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
