package act.robot.servlet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import act.robot.constant.FaceConstant;

import act.robot.util.DBConnector;
import com.facepp.error.FaceppParseException;
import com.facepp.http.HttpRequests;
import com.facepp.http.PostParameters;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONString;

@MultipartConfig
public class FaceIdentifyServlet extends HttpServlet {
    private Connection con;
    private Statement statement;
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Part filePart = request.getPart("photo");
	    String fileName = filePart.getSubmittedFileName();
	    InputStream fileContent = filePart.getInputStream();
	    ByteArrayOutputStream photo = new ByteArrayOutputStream();
	    byte[] temp = new byte[1024*10];
	    int size = 0;
	    while((size = fileContent.read(temp)) != -1)
	    	photo.write(temp, 0, size);
		String res = "1";
        JSONObject information = new JSONObject();
		
		HttpRequests httpRequests = new HttpRequests(
				FaceConstant.API_KEY,
				FaceConstant.API_SECRET, true, true);
		
		try {
			JSONObject json = httpRequests.recognitionIdentify(
			        new PostParameters().setGroupName(FaceConstant.GROUP_NAME).setImg(photo.toByteArray()));
            JSONArray face = json.getJSONArray("face");
            if(face.length() > 0) {
                res = face.getJSONObject(0).getJSONArray("candidate").getJSONObject(0).getString("person_name");
            }

		} catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
        try{

//            con = DBConnector.connect();
//            statement = con.createStatement();
//            String user_name= "select user_name from user_info where user_id= ' " + res + " ' ";
//            String user_birthplace = "select user_birthplace from user_info where user_id= ' " + res + " ' ";
//            int result = statement.executeUpdate();
//
//            con.close();
            information.put("user_id", res);
            information.put("user_name", " ");
            information.put("user_birthplace", " ");
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

		System.out.println(res);
        response.setContentType("application/json; charset=utf-8");
        response.getWriter().write(information.toString());

    }

}
