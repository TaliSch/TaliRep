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
    [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
    public class AdminController : Controller
    {
        private BlogDBContext db = new BlogDBContext();
        
        public ActionResult Index()
        {
            ViewBag.Admin = new Shared.ConrollerSession(Session).Admin;
            var userPreferences = db.UserPreferences.Find("Tali");
            return View(userPreferences);
        }

        public ActionResult NextItems(int from, int to)
        {
            var userPreferences = db.UserPreferences.Find("Tali");

            var postDatas = GetNextItems(from, to);

            return Json(new AdminViewModel() { AdminEnabled = new Shared.ConrollerSession(Session).Admin, PostDatas = postDatas }, JsonRequestBehavior.AllowGet);
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
            ViewBag.Admin = new Shared.ConrollerSession(Session).Admin;
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

        [HttpPost]
        public ActionResult UploadFaceImage(string data) 
        {
            if (data == null)
                return Json(false);

            var userPreferences = db.UserPreferences.Find("Tali");
            userPreferences.Face = data;
            db.Entry(userPreferences).State = EntityState.Modified;

            bool rv = db.SaveChanges() == 1;

            return Json(rv);
        }

        [HttpPost]
        public ActionResult UploadBackgroundImage(string data)
        {
            if (data == null)
                return Json(false);

            var userPreferences = db.UserPreferences.Find("Tali");
            userPreferences.Backgrownd = data;
            db.Entry(userPreferences).State = EntityState.Modified;

            bool rv = db.SaveChanges() == 1;

            return Json(rv);
        }

        [HttpPost]
        public ActionResult Style(string styleIndex)
        {
            var user = db.UserPreferences.Find("Tali");
            user.Style = styleIndex;
            db.Entry(user).State = EntityState.Modified;
            bool rv = db.SaveChanges() == 1;

            return Json(rv);
        }

        [HttpPost]
        public ActionResult Preferences(string title, string style, string faceImage, string backgroundImage)
        {
            var userPreferences = db.UserPreferences.Find("Tali");
            if (!string.IsNullOrEmpty(title))
                userPreferences.Title = title;
            if (!string.IsNullOrEmpty(style))
                userPreferences.Style = style;
            if (faceImage != null)
                userPreferences.Face = faceImage;
            if (backgroundImage != null)
                userPreferences.Backgrownd = backgroundImage;

            db.Entry(userPreferences).State = EntityState.Modified;
            
            bool rv = db.SaveChanges() == 1;

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
       
        public ActionResult SignOut()
        {
            new Shared.ConrollerSession(Session).Admin = false;
            
            return Json(true, JsonRequestBehavior.AllowGet);
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

        IEnumerable<PostData> GetNextItems(int from, int to)
        {
            IEnumerable<PostData> rv = new List<PostData>();
            var postsLen = db.Posts.Count();

            to = Math.Min(postsLen - 1, to); // including

            if (from < postsLen && from <= to)
            {
                var posts = db.Posts.OrderByDescending(item => item.Date);
                rv = posts.Skip(from).Take(to - from + 1).Select(x => new PostData() { Date = x.Date, ID = x.ID, Title = x.Title }); ;
            }

            return (rv);
        }
    }
}
