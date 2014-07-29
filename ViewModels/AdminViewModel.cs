using MyBlogEmpty.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace MyBlogEmpty.ViewModels
{
    public class PostData
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }        
    }
    public class AdminViewModel
    {
        public IEnumerable<PostData> PostDatas { get; set; }
        public UserPreferences Preferences { get; set; }
    }
}