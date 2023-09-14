using Microsoft.EntityFrameworkCore;
using OSKITestAPI.Models;

namespace OSKITestAPI.Data
{
    public partial class OSKIDBContext : DbContext
    {
        public OSKIDBContext(DbContextOptions <OSKIDBContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Models.Result> Results { get; set; } = default!;
        public DbSet<Test> Tests { get; set; }
        public DbSet<Question> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Test>()
                .HasMany(t => t.Questions)
                .WithOne(q => q.Test)
                .HasForeignKey(q => q.TestId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
