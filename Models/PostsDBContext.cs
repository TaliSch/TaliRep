using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MyBlogEmpty.Models
{
    public class PostDBContext : DbContext
    {
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostData> PostDatas { get; set; }
        public DbSet<User> Users { get; set; }
    }
}