using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyBlogEmpty.Models
{
    public class Post
    {
        public int ID { get; set; }
        [Required]
        [Display(Name = "Title")]
        public string Title { get; set; }
        [DataType(DataType.Date)]
        [Display(Name = "Last Saved")]
        public DateTime Date { get; set; }
        public string Content { get; set; }
    }
}