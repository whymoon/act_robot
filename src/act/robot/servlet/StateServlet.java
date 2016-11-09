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
    String program = "/home/robot/ulbrain_2dnav_ui-linux-x64/ulbrain_2dnav_ui &";
    protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        String type = request.getParameter("type");
        if(type.equals("battery")){
            String num = (int)(RobotHelper.getBattery() * 100) + "";
            response.getWriter().write(num);
        }
        else if(type.equals("isNavFinished")){
            response.getWriter().write(RobotHelper.isNavFinished() + "");
//            count++;
//            if(count % 10 == 0)
//                response.getWriter().write(true + "");
//            else
//                response.getWriter().write(false + "");
        }
        else if(type.equals("stop")){
            RobotHelper.changeNavMode(RobotHelper.MODE_STOP);
            response.getWriter().write("done");
        }
        else if(type.equals("continueGuide")){
            RobotHelper.changeNavMode(RobotHelper.MODE_CONTINUE);
            response.getWriter().write("done");
        }
        else if(type.equals("detail")){
            Runtime.getRuntime().exec(program);
//            Process navProgram
            response.getWriter().write("done");
        }

    }
    protected  void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        doPost(request,response);
    }
}
