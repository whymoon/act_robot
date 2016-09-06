package act.robot.servlet;

import act.robot.constant.IatConstant;

import com.iflytek.cloud.speech.*;
import com.iflytek.msc.MSC;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Moon on 2016/7/29.
 */
public class IatServlet extends HttpServlet {
    private String recognizeRes = "";
    
    private void initParamMap(Map<String, String> mParamMap) {
        mParamMap.put(SpeechConstant.ENGINE_TYPE, IatConstant.ENG_TYPE);
        mParamMap.put(SpeechConstant.SAMPLE_RATE, IatConstant.RATE);
        mParamMap.put(SpeechConstant.NET_TIMEOUT, IatConstant.NET_TIMEOUT);
        mParamMap.put(SpeechConstant.KEY_SPEECH_TIMEOUT, IatConstant.SPEECH_TIMEOUT);

        mParamMap.put(SpeechConstant.LANGUAGE, IatConstant.LANGUAGE);
        mParamMap.put(SpeechConstant.ACCENT, IatConstant.ACCENT);
        mParamMap.put(SpeechConstant.DOMAIN, IatConstant.DOMAIN);
        mParamMap.put(SpeechConstant.VAD_BOS, IatConstant.VAD_BOS);

        mParamMap.put(SpeechConstant.VAD_EOS, IatConstant.VAD_EOS);
        mParamMap.put(SpeechConstant.ASR_NBEST, IatConstant.NBEST);
        mParamMap.put(SpeechConstant.ASR_WBEST, IatConstant.WBEST);
        mParamMap.put(SpeechConstant.ASR_PTT, IatConstant.PTT);

        mParamMap.put(SpeechConstant.RESULT_TYPE, IatConstant.RESULT_TYPE);
        mParamMap.put(SpeechConstant.ASR_AUDIO_PATH, null);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Map<String, String> mParamMap = new HashMap<String, String>();
        SpeechUtility.createUtility(SpeechConstant.APPID + "=" + IatConstant.APPID);
        SpeechRecognizer mIat = SpeechRecognizer.createRecognizer();
        final Object mutex = new Object();
        initParamMap(mParamMap);
        recognizeRes = "";
        RecognizerListener mRecoListener = new RecognizerListener() {
            @Override
            public void onVolumeChanged(int i) {
            }

            @Override
            public void onBeginOfSpeech() {
                System.out.println("begin");
            }

            @Override
            public void onEndOfSpeech() {
                System.out.println("end");
            }

            @Override
            public void onResult(RecognizerResult recognizerResult, boolean isLast) {
                if (!isLast) {
                    System.out.println(recognizerResult.getResultString());
                    recognizeRes = recognizeRes + recognizerResult.getResultString();
                }
                else{
                	synchronized (mutex) {
                		mutex.notify();
					}                	
                }
            }

            @Override
            public void onError(SpeechError speechError) {
                System.out.println("error" + speechError.getErrorDescription(true));
            }

            @Override
            public void onEvent(int i, int i1, int i2, String s) {
                System.out.println("event");
            }
        };
        for (Map.Entry<String, String> entry : mParamMap.entrySet()) {
            mIat.setParameter(entry.getKey(), entry.getValue());
        }
        mIat.startListening(mRecoListener);
        synchronized (mutex) {
        	try {
				mutex.wait();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        	response.setContentType("text/plain; charset=UTF-8");
            response.getWriter().write(recognizeRes);
		}
        
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
