package act.robot.servlet;

import act.robot.constant.FaceConstant;
import act.robot.util.DBConnector;
import com.facepp.http.HttpRequests;
import com.facepp.http.PostParameters;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.json.JSONObject;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by whymo on 2016/11/10.
 */
public class InputUserServlet extends HttpServlet {
    private static final int MEMORY_THRESHOLD = 1024 * 1024 * 3;  // 3MB
    private static final int MAX_FILE_SIZE = 1024 * 1024 * 40; // 40MB
    private static final int MAX_REQUEST_SIZE = 1024 * 1024 * 50; // 50MB
    private Connection con;
    private Statement statement;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {
//        request.setCharacterEncoding("UTF-8");
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setSizeThreshold(MEMORY_THRESHOLD);
        factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setHeaderEncoding("UTF-8");
        upload.setFileSizeMax(MAX_FILE_SIZE);
        upload.setSizeMax(MAX_REQUEST_SIZE);
        Map<String, String> params = new HashMap<>();
        String res = "提交失败，请重试";
        try {
            @SuppressWarnings("unchecked")
            List<FileItem> formItems = upload.parseRequest(request);
            if (formItems != null && formItems.size() > 0) {
                for (FileItem item : formItems) {
                    if (item.isFormField()) {
                        InputStream stream = item.getInputStream();
                        String value = Streams.asString(stream, "UTF-8");
                        params.put(item.getFieldName(), value);
                    }
                }
                System.out.println(params);
                List<ByteArrayOutputStream> photos = new ArrayList<ByteArrayOutputStream>();
                for (FileItem item : formItems) {
                    if (!item.isFormField()) {
                        InputStream fileContent = item.getInputStream();
                        ByteArrayOutputStream photo = new ByteArrayOutputStream();
                        BufferedImage image = Thumbnails.of(fileContent).scale(1).asBufferedImage();
                        System.out.println(image.getWidth() + " " + image.getHeight());
//                        ByteArrayOutputStream os = new ByteArrayOutputStream();
                        ImageIO.write(image, "jpeg", photo);
//                        byte[] temp = new byte[1024 * 10];
//                        int size = 0;
//                        while ((size = fileContent.read(temp)) != -1)
//                            photo.write(temp, 0, size);
                        photos.add(photo);
//                        File img = new File("C:\\Users\\whymo\\Desktop\\test.jpg");
//                        item.write(img);
//                        System.out.println(img.getAbsolutePath());
                    }
                }
                if(addPerson(photos, params)){
                    res = "提交成功";
                }
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
        }
        response.setContentType("text/plain; charset=UTF-8");
        response.getWriter().write(res);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    private boolean addPerson(List<ByteArrayOutputStream> photos, Map<String, String> params) {
        String personTag = params.get("name");
        String personName = params.get("id");
        String personBirthplace = params.get("home");
        String personJob = params.get("job");
        String personDepartment = params.get("org");
        String personMajor = params.get("major");
        try {
            HttpRequests httpRequests = new HttpRequests(
                    FaceConstant.API_KEY,
                    FaceConstant.API_SECRET, true, true);

            List<String> faceIds = new ArrayList<String>();
            for (int i = 0; i < photos.size(); i++) {
                JSONObject res = httpRequests.detectionDetect(new PostParameters().setImg(photos.get(i).toByteArray()));
                System.out.println(res);
                if (res.getJSONArray("face").length() > 0)
                    faceIds.add(res.getJSONArray("face").getJSONObject(0).getString("face_id"));

            }
            if(faceIds.size() == 0)
                return false;
            httpRequests.personCreate(new PostParameters().setPersonName(personName).setTag(personTag));
            httpRequests.personAddFace(new PostParameters().setPersonName(personName).setFaceId(faceIds.toArray(new String[0])));
            httpRequests.groupAddPerson(new PostParameters().setGroupName(FaceConstant.GROUP_NAME).setPersonName(personName));
            httpRequests.trainIdentify(new PostParameters().setGroupName(FaceConstant.GROUP_NAME));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return false;
        }
        try {
            String sql = "INSERT INTO user_info (user_id,user_name,user_birthplace,user_job,user_department,user_major)VALUES ( '"
                    + personName + "', '" + personTag + "', '" + personBirthplace + "','"
                    + personJob + "','" + personDepartment + "','" + personMajor + "')";
            con = DBConnector.connect();
            statement = con.createStatement();
            statement.executeUpdate(sql);
            con.close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
            return false;
        }
        return true;
    }
}
