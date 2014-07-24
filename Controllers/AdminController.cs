using MyBlogEmpty.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Data;
using MyBlogEmpty.ViewModels;

namespace MyBlogEmpty.Controllers
{
    public class AdminController : Controller
    {
        private BlogDBContext db = new BlogDBContext();
        //
        // GET: /Editor/

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

       
        public ActionResult Index()
        {
            ViewBag.Admin = new Shared.ConrollerSession(Session).Admin;
            var postDatas = db.Posts.Select(i=>new PostData() { ID = i.ID, Date = i.Date, Title = i.Title});
            var userPreferences = db.UserPreferences.Find("Tali");
            return View(new AdminViewModel() { Preferences = userPreferences, PostDatas = postDatas });
        }
        [HttpPost]
        public ActionResult Create(Post post)
        {
            bool rv;
            if (ModelState.IsValid)
            {              
                post.Date = DateTime.Now;
                db.Posts.Add(post);
                rv = db.SaveChanges() == 1;
            }
            else
                rv = false;

            return Json(rv);
        }

      
        public ActionResult Create()
        {
            ViewBag.Admin = new Shared.ConrollerSession(Session).Admin;
            return View();
        }

        public ActionResult Edit(int id = 0)
        {
            Post post = db.Posts.Find(id);
            if (post == null)
                return HttpNotFound();
            return View(post);           
        }

        [HttpPost]
        public ActionResult Edit(Post post)
        {
            bool rv;
            if (ModelState.IsValid)
            {
                Post dbPost = db.Posts.Find(post.ID);                

                if (dbPost != null)
                {
                    dbPost.Title = post.Title;
                    dbPost.Date = DateTime.Now;
                    dbPost.Content = post.Content;
                    db.Entry(dbPost).State = EntityState.Modified;
                    
                    rv = db.SaveChanges() == 1;
                }
                else
                    rv = false;
            }
            else
                rv = false;
            return Json(rv);
        }

        //public ActionResult Delete(int id = 0)
        //{
        //    PostData postData = db.PostDatas.Find(id);
        //    if (postData == null)
        //        return HttpNotFound();
        //    return View(postData);  
        //}

        //
        // POST: /Default1/Delete/5

        [HttpPost]
        public ActionResult Delete(int id)
        {
            bool rv;
            Post post = db.Posts.Find(id);
            
            if (post == null)
                rv = false;
            else
            {                
                db.Posts.Remove(post);
            }
            rv = db.SaveChanges() == 1;

            return Json(rv);
        }

        [HttpPost]
        public ActionResult SignOut()
        {
            new Shared.ConrollerSession(Session).Admin = false;
            
            return Json(true);
        }

        [HttpPost]
        public ActionResult SignIn(string password)
        {
            var tali = db.UserCredentials.Find("Tali");
            bool correct = (tali.Password == password);
            if (correct)
                new Shared.ConrollerSession(Session).Admin = true;            
            return Json(correct);
        }
    }
}
