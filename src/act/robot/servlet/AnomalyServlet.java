package act.robot.servlet;

import act.robot.constant.InspectorConstant;
import act.robot.util.SqliteConnector;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


/**
 * Created by robot on 17-12-17.
 */
public class AnomalyServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String url = "jdbc:sqlite:" + InspectorConstant.tsmrosPath + "db/obj_mem.db";
        response.setContentType("application/json; charset=utf-8");
        String lastId = request.getParameter("lastId");
        Connection con = null;
        Statement statement = null;
        try {
            con = SqliteConnector.connect(url);
            statement = con.createStatement();
            ResultSet rs = statement.executeQuery(
                    "SELECT * FROM outlier INNER JOIN obj_mem ON outlier.datum_id = obj_mem.id WHERE outlier.id > "
                    + lastId + ";"
            );
            JSONArray array = new JSONArray();
            while (rs.next()) {
                JSONObject ele = new JSONObject();
                ele.put("id", "" + rs.getInt("id"));
                ele.put("obj", rs.getString("obj"));
                ele.put("outlier_type", rs.getString("outlier_type"));
                ele.put("time", rs.getString("time"));
                ele.put("loc_x", rs.getString("loc_x"));
                ele.put("loc_y", rs.getString("loc_y"));
                ele.put("pos", rs.getString("pos"));
                ele.put("img_path", rs.getString("img_path"));
                array.put(ele);
            }
            System.out.println(array.toString());
            response.getWriter().write(array.toString());
            return;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if(statement != null)
                    statement.close();
                if(con != null)
                    con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        response.getWriter().write("[]");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
