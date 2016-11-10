package act.robot.servlet;

import act.robot.constant.FaceConstant;
import com.facepp.http.HttpRequests;
import com.facepp.http.PostParameters;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by whymo on 2016/8/2.
 */
public class CheckFaceIdServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userId = request.getParameter("userId");
        HttpRequests httpRequests = new HttpRequests(
                FaceConstant.API_KEY,
                FaceConstant.API_SECRET, true, true);
        try {
            JSONObject json = httpRequests.groupGetInfo(
                    new PostParameters().setGroupName(FaceConstant.GROUP_NAME));
            JSONArray persons = json.getJSONArray("person");
            for(int i = 0; i < persons.length(); i++){
//                System.out.println(persons.getJSONObject(i).getString("person_name"));
                if(persons.getJSONObject(i).getString("person_name").equals(userId)){
                    response.getWriter().write("1");
                    return;
                }
            }
            response.getWriter().write("0");
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
