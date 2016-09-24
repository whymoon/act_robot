package act.robot.servlet;

import act.robot.util.HttpUtil;
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
import java.net.URLEncoder;

/**
 * Created by my dell on 2016/8/17.
 */
public class RingServlet extends HttpServlet{
    protected  void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        String str = "";
        request.setCharacterEncoding("UTF-8");
        String key = request.getParameter("wd");
        String ring = request.getParameter("ring");

        try {
            if(ring.equals("yes"))
                str = HttpUtil.sendGet("http://ring.cnbigdata.org/api/newevent?type=latest");
            else
                str = HttpUtil.sendGet("http://ring.cnbigdata.org/api/esearch?wd=" + URLEncoder.encode(key, "utf-8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        response.setContentType("text/json;charset = UTF-8");
        response.getWriter().write(str);
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        doPost(request,response);
    }

}
