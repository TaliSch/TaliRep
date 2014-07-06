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
        [Display(Name="Name")]
        public string Name { get; set; }
        [DataType(DataType.Date)]
        [Display(Name = "Last Saved")]
        public DateTime Date { get; set; }
    }

    public class PostData
    {
        public int ID { get; set; }
        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }
        [Required]
        public string Data { get; set; }
    }

    public class PostDBContext : DbContext
    {
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostData> PostDatas { get; set; }
    }
    public class PostDBContext2 : DbContext
    {
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostData> PostDatas { get; set; }
    }
}