package act.robot.servlet;

import act.robot.constant.FaceConstant;
import com.facepp.http.HttpRequests;
import com.facepp.http.PostParameters;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by whymo on 2016/8/3.
 */
public class TrainFaceServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try{
            HttpRequests httpRequests = new HttpRequests(
                    FaceConstant.API_KEY,
                    FaceConstant.API_SECRET, true, true);
            JSONObject syncRet = httpRequests.trainIdentify(
                    new PostParameters().setGroupName(FaceConstant.GROUP_NAME));
            while (!httpRequests.getSessionSync(
                    syncRet.getString("session_id")).getJSONObject("result").getBoolean("success")){
                Thread.sleep(500);
            }
        }
        catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
        response.getWriter().write("finished");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
