package act.robot.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by robot on 17-12-17.
 */
public class SqliteConnector {
    public static Connection conn;
    private static String driver = "org.sqlite.JDBC";

    public static Connection connect(String url)
    {
        try {
            Class.forName(driver);
            conn = DriverManager.getConnection(url);
            return conn;
        } catch(ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        } catch(SQLException e) {
            e.printStackTrace();
            return null;
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
