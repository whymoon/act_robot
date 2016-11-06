package act.robot.servlet;

import act.robot.util.RobotHelper;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InterruptedIOException;
import java.io.PrintWriter;

/**
 * Created by my dell on 2016/9/22.
 */
public class StateServlet extends HttpServlet{
    int count = 1;
    protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        String type = request.getParameter("type");
        if(type.equals("battery")){
            String num = (int)(RobotHelper.getBattery() * 100) + "";
            response.getWriter().write(num);
        }
        else if(type.equals("isNavFinished")){
//            response.getWriter().write(RobotHelper.isNavFinished() + "");
            count++;
            if(count % 10 == 0)
                response.getWriter().write(true + "");
            else
                response.getWriter().write(false + "");
        }
    }
    protected  void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        doPost(request,response);
    }
}
