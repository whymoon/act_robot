package act.robot.util;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.nio.ByteBuffer;
import java.util.List;

import org.zeromq.ZMQ;
import org.zeromq.ZMsg;

/**
 * Created by qfeel on 16-9-25.
 */
public class RobotHelper {
//    public static Process navProgram = null;
//    static String initialPose = "82.62 32.78 1.57";
    //    static  String  initialPose = "62.97 62.27 0";
//    static String program = "/home/qfeel/.CLion2016.2/system/cmake/generated/ulbrain_2dnav-de8ced5d/de8ced5d/RelWithDebInfo/test/ulbrain_2dnav_main ";
//    static String dir = "/home/qfeel/gitroot/ulbrain_2dnav";
    static ZMQ.Context context = null;
    static ZMQ.Socket requester = null;

    private static final int HEADER_LEN = 6;

    private static byte MSG_REQ = 0x00;
    private static byte MSG_RES = 0x11;

    private static byte SET_INIPOSE = 0x05;
    private static byte SET_TARGET = 0x06;
    private static byte SET_MODE = 0x07;
    private static byte GET_POSE = 0x00;

    public static byte MODE_STOP = 0x00;
    public static byte MODE_CONTINUE = 0x01;

    private static void initContext(){
        if(context == null){
            context = ZMQ.context(1);
            requester = context.socket(ZMQ.REQ);
            requester.connect("tcp://localhost:5555");
        }
    }

//    public static void start(String goal) {
//        if (navProgram == null || !navProgram.isAlive()) {
//            String cmd = program + initialPose;
//            ProcessBuilder process = new ProcessBuilder(cmd.split(" ")).directory(new File(dir));
//            try {
//                navProgram = process.start();
////                process.redirectInput(ProcessBuilder.Redirect.INHERIT);
//                process.redirectOutput(ProcessBuilder.Redirect.INHERIT);
//                Thread.sleep(3000);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//
//        }
//
//        PrintWriter out = new PrintWriter(navProgram.getOutputStream());
//        out.println(goal);
//        out.flush();
////        out.close();
//    }

    public static void setInitialPose(List<Double> initialPose){
        sendPose(initialPose, SET_INIPOSE);
    }

    public static void setGoal(List<Double> goal){
        sendPose(goal, SET_TARGET);
    }

    private static void sendPose(List<Double> pose, byte type){
        initContext();
        ByteBuffer req = ByteBuffer.allocate(pose.size()*8 + HEADER_LEN);
        req.put(MSG_REQ).put(type).putInt(pose.size()*8);
        for(int i = 0; i < pose.size(); i++){
            req.putDouble(pose.get(i));
        }
        req.flip();
        requester.sendByteBuffer(req, 0);
        requester.recv();
    }

    private static byte[] getPose(){
        initContext();
        ByteBuffer req = ByteBuffer.allocate(HEADER_LEN);
        req.put(MSG_REQ).put(GET_POSE).putInt(0);
        req.flip();
        requester.sendByteBuffer(req, 0);
        return requester.recv();

    }

    public static double getBattery(){

        ByteBuffer resBuffer = ByteBuffer.wrap(getPose());

        resBuffer.position(15*8 + HEADER_LEN);
        return resBuffer.getDouble();
    }

    public static boolean isNavFinished(){

        ByteBuffer resBuffer = ByteBuffer.wrap(getPose());

        resBuffer.position(16*8 + HEADER_LEN);
        byte res = resBuffer.get();
        if(res == 0x00)
            return false;
        else
            return true;
    }

    public static void changeNavMode(byte mode){
        initContext();
        ByteBuffer req = ByteBuffer.allocate(HEADER_LEN + 1);
        req.put(MSG_REQ).put(SET_MODE).putInt(1).put(mode);
        req.flip();
        requester.sendByteBuffer(req, 0);
        requester.recv();
    }
}
