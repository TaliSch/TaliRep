using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyBlogEmpty.Models;

namespace MyBlogEmpty.ViewModels
{
    public class HomeViewModel
    {
        public IEnumerable<Post> Posts { get; set; }
        public UserPreferences Preferences { get; set; }
    }
}