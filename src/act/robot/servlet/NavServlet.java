package act.robot.servlet;

import act.robot.constant.NavHelper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

/**
 * Created by my dell on 2016/9/8.
 */
public class NavServlet extends HttpServlet {
    Map<String, String> destinations = new HashMap<>();

    String program = "/home/qfeel/.CLion2016.2/system/cmake/generated/ulbrain_2dnav-de8ced5d/de8ced5d/RelWithDebInfo/test/ulbrain_2dnav_main ";
    String dir="/home/qfeel/gitroot/ulbrain_2dnav";
    public NavServlet(){
        destinations.put("电梯间", "74.67 40.67");
        destinations.put("会议室", "82.62 32.78");
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
        if(des.equals("empty") && !text.equals("empty")){
            String tmpDes = "";
            if(Pattern.matches(regex,text)==true) {
                System.out.print("匹配成功！");
                String [] strs = text.split("[请|带我去|带我们|我们去|吧|我想去]");
                for(int i = 0;i<strs.length;i++){
                    System.out.println(strs[i]);
                    if(!strs[i].equals("")){
                        tmpDes = strs[i];
                        break;
                    }
                }
                if (destinations.containsKey(tmpDes)) {
                    System.out.println("去" + tmpDes);
//                     NavHelper.start(destinations.get(tmpDes));
                    returnCode = tmpDes;
                }

            }
            else
                System.out.print("匹配失败！");
//            if(text.startsWith("带我去")||text.startsWith("我想去")||text.startsWith("我要去")){
//                String tmpDes = text.substring(3);
//                if (destinations.containsKey(tmpDes)){
//                    System.out.println("去"+tmpDes);
////                    String cmd = program + initialPose + " " + destinations.get(tmpDes);
////                    ProcessBuilder process = new ProcessBuilder(cmd.split(" ")).directory(new File(dir));
////                    process.start();
//                    NavHelper.start(destinations.get(tmpDes));
////                    Runtime.getRuntime().exec(program + initialPose + " " + destinations.get(tmpDes).toString());
//                    returnCode = tmpDes;
//                }
//            }
        }
        else if(!des.equals("empty") && text.equals("empty")){
            if (destinations.containsKey(des)){
                System.out.println("去"+des);
//                String cmd = program + initialPose + " " + destinations.get(des);
//                ProcessBuilder process = new ProcessBuilder(cmd.split(" ")).directory(new File(dir));
//                process.redirectInput(ProcessBuilder.Redirect.INHERIT);
//                process.redirectOutput(ProcessBuilder.Redirect.INHERIT);
                System.out.print("进入start之前");
//                NavHelper.start(destinations.get(des));
                System.out.print("进入start之后");
//                try {
////                    process.start().waitFor(1, TimeUnit.HOURS);
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                }

//                Runtime.getRuntime().exec(program + initialPose + " " + destinations.get(des).toString());
                returnCode = des;
            }
        }
        response.setContentType("text/plain;charset = UTF-8");
        response.getWriter().write(returnCode);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
