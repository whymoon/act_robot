package act.robot.servlet;

import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by my dell on 2016/9/22.
 */
public class ChargingServlet extends HttpServlet{
    protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        int ran = (int) (Math.random()*100);
        String num = String.valueOf(ran);
        response.getWriter().write("50");
    }
    protected  void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException,IOException{
        doPost(request,response);

    }
}
