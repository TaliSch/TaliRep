using MyBlogEmpty.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;

namespace MyBlogEmpty.Controllers
{
    public class PostsController : Controller
    {
        private PostDBContext db = new PostDBContext();
        //
        // GET: /Editor/

        public ActionResult Index()
        {
            return View(db.Posts.ToList());
        }
        [HttpPost]
        public ActionResult Create(PostData postData)
        {
            bool rv;
            if (ModelState.IsValid)
            {
                DateTime date = DateTime.Now;
                Post post = new Post() { ID = postData.ID, Date = date, Name = postData.Name };
                db.PostDatas.Add(postData);
                db.Posts.Add(post);
                rv = db.SaveChanges() == 2;
            }
            else
                rv = false;

            return Json(rv ? true : false);
        }

      
        public ActionResult Create()
        {
            return View();
        }

        public ActionResult Edit(int id = 0)
        {
            PostData postData = db.PostDatas.Find(id);
            if (postData == null)
                return HttpNotFound();
            return View(postData);           
        }

        [HttpPost]
        public ActionResult Edit(PostData postData)
        {
            bool rv;
            if (ModelState.IsValid)
            {
                PostData dbPostData = db.PostDatas.Find(postData.ID);
                Post dbPost = db.Posts.Find(postData.ID);                

                if (dbPostData != null && dbPost != null)
                {
                    dbPost.Name = dbPostData.Name = postData.Name;
                    dbPostData.Data = postData.Data;
                    db.Entry(dbPostData).State = System.Data.EntityState.Modified;
                    db.Entry(dbPost).State = System.Data.EntityState.Modified;
                    rv = db.SaveChanges() == 2;
                }
                else
                    rv = false;
            }
            else
                rv = false;
            return Json(rv ? true : false);
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
            PostData postData = db.PostDatas.Find(id);
            Post post = db.Posts.Find(id);
            if (post == null || postData == null)
                rv = false;
            else
            {
                db.PostDatas.Remove(postData);
                db.Posts.Remove(post);
            }
            rv = db.SaveChanges() == 2;
            return Json(rv ? true : false);
        }
    }
}
