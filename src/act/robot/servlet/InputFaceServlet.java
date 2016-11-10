package act.robot.servlet;

import act.robot.constant.FaceConstant;
import act.robot.util.DBConnector;
import com.facepp.http.HttpRequests;
import com.facepp.http.PostParameters;
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
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;
import java.util.concurrent.ExecutionException;

/**
 * Created by whymoon 2016/8/2.
 */
@MultipartConfig
public class InputFaceServlet extends HttpServlet {
    static final int NUM_PHOTOS = 5;
    private Connection con;
    private Statement statement;
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<ByteArrayOutputStream> photos = new ArrayList<ByteArrayOutputStream>();
        int result = 0;
        for(int i = 0; i < NUM_PHOTOS; i++){
            Part filePart = request.getPart("photo" + i);
            String fileName = filePart.getSubmittedFileName();
            InputStream fileContent = filePart.getInputStream();
            ByteArrayOutputStream photo = new ByteArrayOutputStream();
            byte[] temp = new byte[1024*10];
            int size = 0;
            while((size = fileContent.read(temp)) != -1)
                photo.write(temp, 0, size);
            photos.add(photo);
        }
        String personTag = URLDecoder.decode(request.getParameter("userName"), "utf-8");
        String personName = request.getParameter("userId");
        String personBirthplace = URLDecoder.decode(request.getParameter("userBirthplace"), "utf-8");
        String personJob = URLDecoder.decode(request.getParameter("userJob"), "utf-8");
        String personDepartment = URLDecoder.decode(request.getParameter("userDepartment"), "utf-8");
        String personMajor = URLDecoder.decode(request.getParameter("userMajor"), "utf-8");
        try{
            HttpRequests httpRequests = new HttpRequests(
                    FaceConstant.API_KEY,
                    FaceConstant.API_SECRET, true, true);
            httpRequests.personCreate(new PostParameters().setPersonName(personName).setTag(personTag));
            List<String> faceIds = new ArrayList<String>();
            for(int i = 0; i < photos.size(); i++){
                JSONObject res = httpRequests.detectionDetect(new PostParameters().setImg(photos.get(i).toByteArray()));
                if(res.getJSONArray("face").length() > 0)
                    faceIds.add(res.getJSONArray("face").getJSONObject(0).getString("face_id"));

            }
            httpRequests.personAddFace(new PostParameters().setPersonName(personName).setFaceId(faceIds.toArray(new String[0])));
            httpRequests.groupAddPerson(new PostParameters().setGroupName(FaceConstant.GROUP_NAME).setPersonName(personName));
            httpRequests.trainIdentify(new PostParameters().setGroupName(FaceConstant.GROUP_NAME));
        }
        catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

        try {
            String sql = "INSERT INTO user_info (user_id,user_name,user_birthplace,user_job,user_department,user_major)VALUES ( '" + personName + "', '" + personTag + "', '" + personBirthplace + "','" + personJob + "','" + personDepartment + "','" + personMajor + "')";
            con = DBConnector.connect();
            statement = con.createStatement();
            result  = statement.executeUpdate(sql);
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        response.getWriter().write(result);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
