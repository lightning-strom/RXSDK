package com.ruixue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
public class ExampleUnitTest {
    @Test
    public void addition_isCorrect() {

        String[] func_tags = new String[]{"sd", "dd"};
        Map<String, Object> hashMap = new HashMap<>();

        try {
            JSONArray jsonArray = new JSONArray(func_tags);
//            jsonObject.putOpt("func_tags", jsonArray);
            hashMap.put("func_tags", jsonArray);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Map<String, Object> hashMaps = new HashMap<>();
        hashMaps.put("func_tags", func_tags);

        JSONObject s=new JSONObject(hashMap) ;
        JSONObject b=new JSONObject(hashMaps) ;
        System.out.println(s);
        System.out.println(b);

//        String s = "https://www.baidu.com/s?type=rx&download_link_id=7&method=4&rsv_dl=fyb_n_homepage&landing_id=14&cl=3&fr=top1000&materialid=60&wd=%E6%95%B0%E8%AF%BB%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E7%B2%BE%E7%A5%9E&share_from=rxugVdQKeXl2NMXhO7Q1fGA_4G75v1R3&sa=fyb_n_homepage&func=match&content_type=1&share_first=&hisfilter=1&appid=1002&strategy_id=64&action=share&tn=baidutop10&rsv_idx=2&channelid=100";

//        String s = "http://jl.myweileapp.com/mks/single/distribute/page-1/index.html?type=rx&download_link_id=7&func=match&method=4&content_type=1&share_first=&landing_id=14&appid=1002&strategy_id=64&action=share&materialid=60&share_from=rxugVdQKeXl2NMXhO7Q1fGA_4G75v1R3&channelid=100";
//System.out.println(s.length());
//
//        String longUrl = "http://somelink.com/very/long/url";


//        System.out.println(DomainName.getDomainName("http://localhost:8080/test/session"));//http://localhost:8080/
//        System.out.println(DomainName.getDomainName("http://localhost:8080/test/session/", 3));

        assertEquals(4, 2 + 2);
    }
}