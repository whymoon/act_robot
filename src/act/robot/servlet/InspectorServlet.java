package act.robot.servlet;

import act.robot.constant.InspectorConstant;
import act.robot.util.SqliteConnector;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.rmi.server.ExportException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class InspectorServlet extends HttpServlet {
    String url = "jdbc:sqlite:" + InspectorConstant.tsmrosPath + "db/pos.db";
    Connection con = null;
    Statement statement = null;

    @Override
    public void destroy() {
        super.destroy();
        try {
//            if(statement != null)
//                statement.close();
            if(con != null)
                con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void init() throws ServletException {
        super.init();
        con = SqliteConnector.connect(url);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json; charset=utf-8");
        String type = request.getParameter("type");
        if(type.equals("pos")){
            JSONObject res = new JSONObject();
            try {
                statement = con.createStatement();
                ResultSet rs = statement.executeQuery("select * from pos order by id desc limit 0,1;");
                res.put("x", rs.getString("x"));
                res.put("y", rs.getString("y"));
                res.put("angle", rs.getString("angle"));
                res.put("id", rs.getString("id"));
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    if (statement != null)
                        statement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            response.getWriter().write(res.toString());
        } else if (type.equals("map")){
            JSONObject res = new JSONObject();
            try {
                copyFile(InspectorConstant.tsmrosPath + "map/map_color.bmp", InspectorConstant.serverPath + "image/map_color.bmp");
                File picture = new File(InspectorConstant.serverPath + "image/map_color.bmp");
                BufferedImage sourceImg = ImageIO.read(new FileInputStream(picture));
                res.put("path", "image/map_color.bmp");
                res.put("resolution", "" + getResolution());
                res.put("height", sourceImg.getHeight());
                res.put("width", sourceImg.getWidth());
            } catch (Exception e) {
                e.printStackTrace();
            }
            response.getWriter().write(res.toString());
        } else if (type.equals("goal")){
            JSONArray res = new JSONArray();
            try {
                FileReader reader = new FileReader(InspectorConstant.tsmrosPath + "map/map_key_point.yaml");
                BufferedReader br = new BufferedReader(reader);
                String str = null;
                while ((str = br.readLine()) != null) {
                    String content = str.split(":")[1].trim();
                    content = content.replaceAll("\\[", " ").replaceAll("\\]", " ");
                    String[] points = content.split(",");
                    int i = 0;
                    while (i < points.length){
                        JSONObject ele = new JSONObject();
                        ele.put("x", Integer.parseInt(points[i].trim()));
                        ele.put("y", Integer.parseInt(points[i + 1].trim()));
                        ele.put("angle", Double.parseDouble(points[i + 2]));
                        i += 3;
                        res.put(ele);
                    }
                }
                br.close();
                reader.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            response.getWriter().write(res.toString());
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    private double getResolution() {
        double res = 1.0;
        try {
            FileReader reader = new FileReader(InspectorConstant.tsmrosPath + "map/map.yaml");
            BufferedReader br = new BufferedReader(reader);
            String str = null;
            while ((str = br.readLine()) != null) {
                if(str.contains("resolution"))
                    res = Double.parseDouble(str.split(":")[1]);
            }
            br.close();
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    private void copyFile(String fromFile, String toFile) throws IOException{
        FileInputStream ins = new FileInputStream(new File(fromFile));
        FileOutputStream out = new FileOutputStream(new File(toFile));
        byte[] b = new byte[1024];
        int n=0;
        while((n=ins.read(b))!=-1){
            out.write(b, 0, n);
        }
        ins.close();
        out.close();
    }
}
