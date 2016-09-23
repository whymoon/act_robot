package act.robot.servlet;

import act.robot.constant.FaceConstant;
import com.facepp.http.HttpRequests;
import com.facepp.http.PostParameters;
import org.apache.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;


/**
 * Created by my dell on 2016/9/22.
 */
@MultipartConfig
public class HelloServlet extends HttpServlet{
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub
        int len = 0;
        try{
        Part filePart = request.getPart("photo");
        String fileName = filePart.getSubmittedFileName();
        InputStream fileContent = filePart.getInputStream();
        ByteArrayOutputStream photo = new ByteArrayOutputStream();
        byte[] temp = new byte[1024*10];
        int size = 0;
        while((size = fileContent.read(temp)) != -1)
            photo.write(temp, 0, size);

        HttpRequests httpRequests = new HttpRequests(
                FaceConstant.API_KEY,
                FaceConstant.API_SECRET, true, true);

        JSONObject res = httpRequests.detectionDetect(new PostParameters().setImg(photo.toByteArray()));
        JSONArray face = res.getJSONArray("face");
        len = face.length();

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
        response.setContentType("text/plain; charset=utf-8");
        response.getWriter().write(String.valueOf(len));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
        doPost(request,response);
    }
}
