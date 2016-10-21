package act.robot.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnector {
	public static Connection conn;
	private static String driver = "com.mysql.jdbc.Driver";
	private static String url = "jdbc:mysql://127.0.0.1:3306/robot";
	private static String user = "root";
	private static String password = "robot";
	
	public static Connection  connect() 
	{
		try {			
			Class.forName(driver);
			conn =DriverManager.getConnection(url, user, password);
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
