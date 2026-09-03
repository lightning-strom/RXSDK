namespace RXSDK
{
    public interface IPlatformInterface
    {
        string PlatformName { get; }
        string PlatformId { get; }
        bool IsInitialized { get; }

        bool Initialize();
        void Shutdown();

        // 用户相关
        bool IsLoggedIn { get; }
        void Login(System.Action<bool, string> callback);
        void Logout();

        // 商店和支付
        void PurchaseProduct(string productId, System.Action<bool, string> callback);
        void GetProducts(System.Action<Product[]> callback);

        // 好友系统
        void GetFriends(System.Action<Friend[]> callback);

        // 云存档
        void SaveToCloud(string key, string data, System.Action<bool> callback);
        void LoadFromCloud(string key, System.Action<string> callback);
    }

    // 数据模型
    public class Achievement
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsUnlocked { get; set; }
    }

    public class Product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
    }

    public class Friend
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsOnline { get; set; }
    }
}