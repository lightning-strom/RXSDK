namespace RuiXue.Share
{
    public class RXCustomShareConfig
    {
        public string platform = "wechat";
        public int shareScene;
        public string material_type;
        public string title;
        public string content;
        public string image;
        public string url;
        public int x;
        public int y;
        public int width;
        public int height;
        public int wh;
        
        public bool show_content_in_circle = false;
        public string appid;

        public string openId;
        public string username;
        public string path = "";
        public string use_scheme ;
        public string protocol_ios ;
        public string protocol_android ;
        public bool withShareTicket = true;
        public string extData;
    }
}