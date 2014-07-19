namespace MyBlogEmpty.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserPreferences",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 10),
                        Style = c.String(nullable: false),
                        Name = c.String(),
                        Title = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.UserCredentials",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 10),
                        Password = c.String(nullable: false, maxLength: 10),
                    })
                .PrimaryKey(t => t.ID);
            
            AddColumn("dbo.Posts", "Title", c => c.String(nullable: false));
            AddColumn("dbo.Posts", "Content", c => c.String());
            DropColumn("dbo.Posts", "Name");
            DropTable("dbo.PostDatas");
            DropTable("dbo.Users");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 128),
                        Password = c.String(nullable: false),
                        Style = c.String(nullable: false),
                        Name = c.String(),
                        Title = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.PostDatas",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Data = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            AddColumn("dbo.Posts", "Name", c => c.String(nullable: false));
            DropColumn("dbo.Posts", "Content");
            DropColumn("dbo.Posts", "Title");
            DropTable("dbo.UserCredentials");
            DropTable("dbo.UserPreferences");
        }
    }
}
