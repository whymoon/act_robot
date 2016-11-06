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
    private List<Double> initialPose = Arrays.asList(81.85, 72.25, Math.PI / 2, 0.0, 0.0, 0.0);
    private boolean isFirst = true;

    public NavServlet() {
        destinations.put("电梯间", Arrays.asList(78.53, 81.57, -Math.PI / 2));
        destinations.put("会议室", Arrays.asList(86.64, 71.27, Math.PI / 2));
        destinations.put("初始点", Arrays.asList(initialPose.get(0), initialPose.get(1), initialPose.get(2)));
        destinations.put("大厅", Arrays.asList(initialPose.get(0), initialPose.get(1), initialPose.get(2)));
        destinations.put("510", Arrays.asList(86.64, 71.27, Math.PI / 2));
        destinations.put("508", Arrays.asList(86.63,78.38,-Math.PI / 2));
        destinations.put("507", Arrays.asList(86.67,86.60,-Math.PI / 2));
        destinations.put("506", Arrays.asList(86.67,96.69,-Math.PI / 2));
        destinations.put("505", Arrays.asList(86.60,102.75,-Math.PI / 2));
        destinations.put("504", Arrays.asList(86.46,103.42,0.0));
        destinations.put("503", Arrays.asList(76.40,103.42,0.0));
        destinations.put("502", Arrays.asList(68.11,103.22,0.0));
        destinations.put("501", Arrays.asList(56.12,86.63,-Math.PI / 2));
        destinations.put("男厕所", Arrays.asList(73.27,35.90,Math.PI));
        destinations.put("女厕所", Arrays.asList(80.22,35.85,0.0));
        destinations.put("洗手间", Arrays.asList(76.50,35.85,0.0));
        destinations.put("茶水间a", Arrays.asList(56.39,96.48,-Math.PI / 2));
        destinations.put("茶水间b", Arrays.asList(56.23,88.74,-Math.PI / 2));
        destinations.put("茶水间", Arrays.asList(56.23,88.74,-Math.PI / 2));
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String text = request.getParameter("text");
        String des = request.getParameter("des");
        String returnCode = "error";
        System.out.println(text + " " + des);
        String regex = "(^带我去.*)|" +
                "(^我们去.*)|" +
                "(^请带我去.*)|" +
                "(^我想去.*)|" +
                "(^我要去.*)";
        if (des.equals("back") || text.equals("返航")){
            navToDes("初始点");
            returnCode = "初始点";
        }else if (des.equals("empty") && !text.equals("empty")) {
            String tmpDes = "";
            if (Pattern.matches(regex, text) == true) {
                System.out.print("匹配成功！");
                String[] strs = text.split("[请|带我去|带我们|我们去|吧|我想去]");
                for (int i = 0; i < strs.length; i++) {
                    System.out.println(strs[i]);
                    if (!strs[i].trim().equals("")) {
                        tmpDes = strs[i].trim();
                        if(navToDes(tmpDes)){
                            returnCode = tmpDes;
                            break;
                        }
                    }
                }
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
//                RobotHelper.setInitialPose(initialPose);
                isFirst = false;
            }
//            RobotHelper.setGoal(destinations.get(des));
            return true;
        }
        return false;
    }
}
