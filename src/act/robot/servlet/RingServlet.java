package act.robot.servlet;

import org.json.JSONArray;
import org.json.JSONObject;
import sun.net.www.http.HttpClient;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by my dell on 2016/8/17.
 */
public class RingServlet extends HttpServlet{
    protected  void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        try{
            Thread.sleep(1500);
        }catch (InterruptedException e){
            e.printStackTrace();
        }
        String str = "";
        request.setCharacterEncoding("UTF-8");
        String key = request.getParameter("wd");
        try {
            str = sendGet(key);
        } catch (Exception e) {
            e.printStackTrace();
        }
        response.setContentType("text/json;charset = UTF-8");
        response.getWriter().write(str);
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        doPost(request,response);
    }

    protected String sendGet( String param)throws Exception {
        String url = "http://ring.cnbigdata.org/api/esearch?wd=" + param;
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        //设置属性
        con.setRequestMethod("GET");//optional default is GET
        //con.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1");//**
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
