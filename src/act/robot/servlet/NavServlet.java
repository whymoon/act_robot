package act.robot.servlet;

import act.robot.util.RobotHelper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Created by my dell on 2016/9/8.
 */
public class NavServlet extends HttpServlet {
    private Map<String, List<Double>> destinations = new HashMap<>();
//    private List<Double> initialPose = Arrays.asList(82.62, 32.78, 1.57, 0.0, 0.0, 0.0);
    private List<Double> initialPose = Arrays.asList(16.0, 11.6, 0.0, 0.0, 0.0, 0.0);
    private boolean isFirst = true;

    public NavServlet() {
//        destinations.put("电梯间", Arrays.asList(74.67, 40.67, 0.0));
        destinations.put("电梯间", Arrays.asList(11.54, 12.63, 0.0));
        destinations.put("会议室", Arrays.asList(82.62, 32.78, 0.0));
        destinations.put("初始点", Arrays.asList(initialPose.get(0), initialPose.get(1), initialPose.get(2)));
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String text = request.getParameter("text");
        String des = request.getParameter("des");
        String returnCode = "error";
        System.out.println(text + " " + des);
        String regex = "(带我去[\\u4e00-\\u9fa5]+)|" +
                "(我们去[\\u4e00-\\u9fa5]+)|" +
                "(请带我去[\\u4e00-\\u9fa5]+)|" +
                "(我想去[\\u4e00-\\u9fa5]+)|" +
                "(我要去[\\u4e00-\\u9fa5]+)|";
        if (des.equals("back")){
            navToDes("初始点");
            returnCode = "初始点";
        }else if (des.equals("empty") && !text.equals("empty")) {
            String tmpDes = "";
            if (Pattern.matches(regex, text) == true) {
                System.out.print("匹配成功！");
                String[] strs = text.split("[请|带我去|带我们|我们去|吧|我想去]");
                for (int i = 0; i < strs.length; i++) {
                    System.out.println(strs[i]);
                    if (!strs[i].equals("")) {
                        tmpDes = strs[i];
                        break;
                    }
                }
                if(navToDes(tmpDes))
                    returnCode = tmpDes;
            } else
                System.out.print("匹配失败！");
        } else if (!des.equals("empty") && text.equals("empty")) {
            if(navToDes(des))
                returnCode = des;
        }
        response.setContentType("text/plain;charset = UTF-8");
        response.getWriter().write(returnCode);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    private boolean navToDes(String des){
        if (destinations.containsKey(des)) {
            System.out.println("去" + des);
            if(isFirst){
                RobotHelper.setInitialPose(initialPose);

                isFirst = false;
            }

            RobotHelper.setGoal(destinations.get(des));
            return true;
        }
        return false;
    }
}
