package act.robot.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by whymo on 2016/9/24.
 */
public class HttpUtil {
    public static String sendGet(String url)throws Exception {
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        //设置属性
        con.setRequestMethod("GET");//optional default is GET
        con.setRequestProperty("Charset", "utf-8");

        //建立连接
        con.connect();
        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
        String line;
        String result = "";
        while ((line = in.readLine()) != null) {
            result += line;
        }
        in.close();
        System.out.print(result);
        return result;
    }
}
