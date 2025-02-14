using System;
using TanjirVise.DTO;

namespace TanjirVise.DAL
{
    public class UnitOfWork : IDisposable
    {
        public UnitOfWork(TanjirViseContext context) => Context = context;

        public TanjirViseContext Context { get; }


        private IRepository<User> _users;
        private IRepository<Volunteer> _volunteers;
        private IRepository<Restaurant> _restaurants;
        private IRepository<FoodRequest> _foodRequests;


        public IRepository<User> Users => _users ?? (_users = new Repository<User>(Context));
        public IRepository<Volunteer> Volunteers => _volunteers ?? (_volunteers = new Repository<Volunteer>(Context));
        public IRepository<Restaurant> Restaurants => _restaurants ?? (_restaurants = new Repository<Restaurant>(Context));
        public IRepository<FoodRequest> FoodRequests => _foodRequests ?? (_foodRequests = new Repository<FoodRequest>(Context));


        public async Task<int> Save()
        {
            int x = await Context.SaveChangesAsync();
            return x;
        }

        public void Dispose() => Context.Dispose();
    }
}
