package act.robot.servlet;

import act.robot.constant.FaceConstant;
import com.facepp.http.HttpRequests;
import com.facepp.http.PostParameters;
import com.sun.imageio.plugins.jpeg.JPEG;
import net.coobird.thumbnailator.Thumbnails;
import org.json.JSONObject;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
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

//            readImageInformation(new File("C:\\Users\\whymo\\Desktop\\test5.jpg"));
//            scaleImage("C:\\Users\\whymo\\Desktop\\bbb.jpg", "C:\\Users\\whymo\\Desktop\\test5_a.jpg", 0.5, "jpeg");
//            File file = new File("C:\\Users\\whymo\\Desktop\\test5.jpg");
//            BufferedImage image = Thumbnails.of(file).scale(1).asBufferedImage();
//            ByteArrayOutputStream os = new ByteArrayOutputStream();
//            ImageIO.write(image, "jpeg", os);

//            ByteArrayOutputStream photo = new ByteArrayOutputStream();
//            byte[] temp = new byte[1024*10];
//            int size = 0;
//            while((size = in.read(temp)) != -1)
//                photo.write(temp, 0, size);

//            JSONObject res = httpRequests.detectionDetect(new PostParameters().setImg(os.toByteArray()));
            JSONObject syncRet = httpRequests.trainIdentify(
                    new PostParameters().setGroupName(FaceConstant.GROUP_NAME));
            while (!httpRequests.getSessionSync(
                    syncRet.getString("session_id")).getJSONObject("result").getBoolean("success")){
                Thread.sleep(500);
            }
//            System.out.println(httpRequests.infoGetPersonList());
//            ArrayList<String> ids = new ArrayList<>();
//            ids.add("jsl");
//            ids.add("ljw2");
//            ids.add("hm");
//            ids.add("ljw");
//            ids.add("songxinxin");
//            ids.add("xxsong");
//            ids.add("sxx");
//            ids.add("why2333");
//            ids.add("why233");
//            ids.add("why2");
//            ids.add("xwc");
//            ids.add("why43");
//            System.out.println(httpRequests.personDelete(new PostParameters().setPersonName(ids)));
        }
        catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
        response.getWriter().write("finished");
    }

//    public static void readImageInformation(File imageFile)  throws IOException, MetadataException, ImageProcessingException {
//        Metadata metadata = ImageMetadataReader.readMetadata(imageFile);
//        Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
//        JpegDirectory jpegDirectory = metadata.getFirstDirectoryOfType(JpegDirectory.class);
//
//        int orientation = 1;
//        try {
//            orientation = directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
//        } catch (MetadataException me) {
//        }
//        System.out.println(orientation);
//        int width = jpegDirectory.getImageWidth();
//        int height = jpegDirectory.getImageHeight();
//        System.out.println(width + " " + height);
//    }
    public static void scaleImage(String sourceImagePath,
                                  String destinationPath, double scale,String format) {

        File file = new File(sourceImagePath);
        JPEG jpeg;
        BufferedImage bufferedImage;
        try {
            bufferedImage =
                    ImageIO.read(file);
            int width = bufferedImage.getWidth();
            int height = bufferedImage.getHeight();
            System.out.println(width);
            System.out.println(height);
            BufferedImage image = Thumbnails.of(file).scale(1).asBufferedImage();
            System.out.println(image.getWidth() + " " + image.getHeight());
            width = (int)(width * scale);
            height = (int) (height * scale);

//            Image image = bufferedImage.getScaledInstance(width, height,
//                    Image.SCALE_SMOOTH);
//            BufferedImage outputImage = new BufferedImage(width, height,
//                    BufferedImage.TYPE_INT_RGB);
//            Graphics graphics = outputImage.getGraphics();
//            graphics.drawImage(image, 0, 0, null);
//            graphics.dispose();
//
//            ImageIO.write(outputImage, format, new File(destinationPath));
        } catch (IOException e) {
            System.out.println("scaleImage方法压缩图片时出错了");
            e.printStackTrace();
        }

    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
