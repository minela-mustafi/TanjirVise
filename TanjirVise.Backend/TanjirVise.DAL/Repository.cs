using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace TanjirVise.DAL
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected TanjirViseContext _ctx;
        protected DbSet<T> dbSet;

        public Repository(TanjirViseContext context)
        {
            _ctx = context;
            dbSet = _ctx.Set<T>();
        }

        public async Task<IList<T>> Get() => await dbSet.ToListAsync();

        public async Task<IList<T>> Get(Expression<Func<T, bool>> where) => await dbSet.Where(where).ToListAsync();

        public async Task<T> Get(int id) => await dbSet.FindAsync(id);

        public virtual async Task Insert(T newEnt)
        {
            await newEnt.Create(_ctx);
            dbSet.Add(newEnt);
        }

        public virtual async Task Update(T newEnt, int id)
        {
            T oldEnt = await Get(id);
            if (oldEnt != null)
            {
                await newEnt.Create(_ctx);
                _ctx.Entry(oldEnt).CurrentValues.SetValues(newEnt);
                oldEnt.Update(newEnt);
            }
        }

        public void Delete(T entity) => dbSet.Remove(entity);

        public async Task<bool> Delete(int id)
        {
            try
            {
                T entity = await Get(id);
                if (entity == null || !entity.CanDelete()) return false;
                Delete(entity);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
