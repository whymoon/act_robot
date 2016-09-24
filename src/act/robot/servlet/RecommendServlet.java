package act.robot.servlet;

import act.robot.util.HttpUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;

/**
 * Created by my dell on 2016/8/21.
 */
public class RecommendServlet extends HttpServlet{
    public void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException , IOException{
        String keys = request.getParameter("keys");
        System.out.println(keys);
        JSONArray resArray = new JSONArray();
        try{
            JSONArray keyArray = new JSONArray(keys);
            for (int i = 0; i < keyArray.length(); i++){
                String resJson = HttpUtil.sendGet("http://ring.cnbigdata.org/api/esearch?wd=" + URLEncoder.encode(keyArray.getString(i), "utf-8"));
                resArray.put(new JSONObject(resJson));
            }
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        response.setContentType("text/json; charset=UTF-8");//text/json
        response.getWriter().write(resArray.toString());
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
