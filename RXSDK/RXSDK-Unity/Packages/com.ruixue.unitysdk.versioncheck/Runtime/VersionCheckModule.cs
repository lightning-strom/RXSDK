namespace RuiXue.VersionCheck
{
    public class VersionCheckModule
    {
        public string module_tag;
        public string category_tag;
        public int clientversion;
        public int checkversion;

        public VersionCheckModule()
        {
        }

        public VersionCheckModule(string moduleTag, string categoryTag, int clientVersion, int checkVersion)
        {
            module_tag = moduleTag;
            category_tag = categoryTag;
            clientversion = clientVersion;
            checkversion = checkVersion;
        }
    }
}
