package act.robot.servlet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by my dell on 2016/8/21.
 */
public class RecommendServlet extends HttpServlet{
    public void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException , IOException{
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject0= new JSONObject();
        JSONObject jsonObject1= new JSONObject();
        JSONObject jsonObject2= new JSONObject();
        JSONObject jsonObject3= new JSONObject();
        try {
            jsonObject0.put("content", "Dapibus ac facilisis in");
            jsonObject1.put("content", "Morbi leo risus");
            jsonObject2.put("content","Porta ac consectetur ac");
            jsonObject3.put("content","Vestibulum at eros");
            jsonArray.put(jsonObject0);
            jsonArray.put(jsonObject1);
            jsonArray.put(jsonObject2);
            jsonArray.put(jsonObject3);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        response.setContentType("text/json; charset=UTF-8");//text/json
        response.getWriter().write(jsonArray.toString());
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
