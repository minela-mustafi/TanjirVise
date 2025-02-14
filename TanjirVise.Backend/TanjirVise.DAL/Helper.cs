using TanjirVise.DTO;

namespace TanjirVise.DAL
{
    public static class Helper
    {
        public static async Task Create<T>(this T ent, TanjirViseContext context)
        {
            if (typeof(T) == typeof(FoodRequest)) await Build(ent as FoodRequest, context);
        }

        public static async Task Build(FoodRequest foodRequest, TanjirViseContext context)
        {
            foodRequest.User = await context.Users.FindAsync(foodRequest.User.Id);
            if (foodRequest.Volunteer != null)
                foodRequest.Volunteer = await context.Volunteers.FindAsync(foodRequest.Volunteer.Id);
            if (foodRequest.Restaurant != null)
                foodRequest.Restaurant = await context.Restaurants.FindAsync(foodRequest.Restaurant.Id);
        }


        public static void Update<T>(this T oldEnt, T newEnt)
        {
            if (typeof(T) == typeof(FoodRequest)) UpdateLink(oldEnt as FoodRequest, newEnt as FoodRequest);
        }

        public static void UpdateLink(FoodRequest oldFoodReques, FoodRequest newFoodRequest)
        {
            oldFoodReques.User = newFoodRequest.User;
            oldFoodReques.Volunteer = newFoodRequest.Volunteer;
            oldFoodReques.Restaurant = newFoodRequest.Restaurant;
        }


        public static bool CanDelete<T>(this T ent)
        {
            if (typeof(T) == typeof(BaseUser)) return HasNoChildren(ent as BaseUser);
            return true;
        }

        public static bool HasNoChildren(BaseUser user)
        {
            return user.FoodRequests.Count == 0;
        }
    }
}
