package act.robot.constant;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

/**
 * Created by qfeel on 16-9-25.
 */
public class NavHelper {
    public static Process navProgram = null;
   static  String  initialPose = "82.62 32.78 1.57";
//    static  String  initialPose = "62.97 62.27 0";
    static String program = "/home/qfeel/.CLion2016.2/system/cmake/generated/ulbrain_2dnav-de8ced5d/de8ced5d/RelWithDebInfo/test/ulbrain_2dnav_main ";
    static String dir="/home/qfeel/gitroot/ulbrain_2dnav";
    public  static void start(String goal){
        if(navProgram==null||!navProgram.isAlive()){
            String cmd = program + initialPose;
            ProcessBuilder process = new ProcessBuilder(cmd.split(" ")).directory(new File(dir));
            try {
                navProgram = process.start();
//                process.redirectInput(ProcessBuilder.Redirect.INHERIT);
                process.redirectOutput(ProcessBuilder.Redirect.INHERIT);
                Thread.sleep(3000);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }

        PrintWriter out =new PrintWriter( navProgram.getOutputStream());
        out.println(goal);
        out.flush();
//        out.close();
    }
}
