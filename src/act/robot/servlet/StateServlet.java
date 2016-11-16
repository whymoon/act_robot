package act.robot.servlet;

import act.robot.util.RobotHelper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * Created by my dell on 2016/9/22.
 */
public class StateServlet extends HttpServlet{
    int count = 1;

    String uiProgram = "/home/robot/ulbrain_2dnav_ui-linux-x64/ulbrain_2dnav_ui";
    String navProgram = "/home/robot/github/ulbrain_2dnav/build/test/ulbrain_2dnav_socket";
    String navProgramDir = "/home/robot/github/ulbrain_2dnav";

    public static final double DIST_THRESHOLD = 2;

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
            Runtime.getRuntime().exec(uiProgram);
            response.getWriter().write("done");
        }
        else if(type.equals("stopBackGround")){
            Runtime.getRuntime().exec("killall ulbrain_2dnav_socket");
            response.getWriter().write("done");
        }
        else if(type.equals("startBackGround")){
            try {
//                Runtime.getRuntime().exec("ls > /home/robot/out.txt");
                ProcessBuilder process = new ProcessBuilder(navProgram.split(" ")).directory(new File(navProgramDir));
                process.redirectOutput(new File("/home/robot/out.txt"));
                process.redirectError(new File("/home/robot/error.txt"));
                process.start();
                response.getWriter().write("done");
            } catch (Exception e) {
                e.printStackTrace();
                response.getWriter().write("error");
            }
        }
        else if(type.equals("isHome")){
            List<Double> current = RobotHelper.getPoseInMap();
            double dist = Math.hypot(
                    current.get(0) - NavServlet.getInitialPose().get(0),
                    current.get(1) - NavServlet.getInitialPose().get(1));
            if(dist > DIST_THRESHOLD)
                response.getWriter().write("false");
            else
                response.getWriter().write("true");
//            response.getWriter().write("false");
        }

    }
    protected  void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        doPost(request,response);
    }
}
