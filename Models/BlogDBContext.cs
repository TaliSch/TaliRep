using MyBlogEmpty.Migrations;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MyBlogEmpty.Models
{
    public class BlogDBContext : DbContext
    {
        public DbSet<Post> Posts { get; set; }

        public DbSet<UserPreferences> UserPreferences { get; set; }

        public DbSet<UserCredentials> UserCredentials { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<BlogDBContext, Configuration>());
        }
    }
}