using System.Linq.Expressions;

namespace TanjirVise.DAL
{
    public interface IRepository<T>
    {
        Task<IList<T>> Get();
        Task<IList<T>> Get(Expression<Func<T, bool>> where);
        Task<T> Get(int id);

        Task Insert(T entity);
        Task Update(T entity, int id);
        void Delete(T entity);
        Task<bool> Delete(int id);
    }
}
