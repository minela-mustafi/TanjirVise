using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TanjirVise.DTO;

namespace TanjirVise.DAL
{
    public class TanjirViseContext : DbContext
    {
        private IConfiguration configuration;

        public TanjirViseContext(IConfiguration configuration) : base()
        {
            this.configuration = configuration;
        }

        public TanjirViseContext() : base() { }


        public DbSet<User> Users { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<FoodRequest> FoodRequests { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            if(this.configuration != null)
            {
                var connectionString = configuration.GetSection("ConnectionString:SqlConnection").Value;
                if (!string.IsNullOrEmpty(connectionString))
                {
                    builder.UseSqlServer(connectionString);
                }
                else
                {
                    throw new ArgumentNullException("Connection String is missing.");
                }
            }
            else
            {
                throw new ArgumentException("Configuration is missing.");
            }
            
            builder.UseLazyLoadingProxies(true);
            base.OnConfiguring(builder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<User>().HasQueryFilter(x => !x.Deleted);
            builder.Entity<Volunteer>().HasQueryFilter(x => !x.Deleted);
            builder.Entity<Restaurant>().HasQueryFilter(x => !x.Deleted);
            builder.Entity<FoodRequest>().HasQueryFilter(x => !x.Deleted);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken token = default)
        {
            try
            {
                foreach (var entry in ChangeTracker.Entries().Where(
                    x => x.State == EntityState.Deleted && x.Entity is BaseClass))
                {
                    entry.State = EntityState.Modified;
                    entry.CurrentValues["Deleted"] = true;
                }
                return await base.SaveChangesAsync(token);
            }
            catch (Exception e)
            {
                return 0;
            }
        }
    }
}
