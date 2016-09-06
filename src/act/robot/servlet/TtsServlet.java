package act.robot.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.iflytek.cloud.speech.SpeechConstant;
import com.iflytek.cloud.speech.SpeechError;
import com.iflytek.cloud.speech.SpeechSynthesizer;
import com.iflytek.cloud.speech.SpeechUtility;
import com.iflytek.cloud.speech.SynthesizerListener;

import act.robot.constant.TtsConstant;

public class TtsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	private void initParamMap(Map<String, String> mParamMap) {
        mParamMap.put(SpeechConstant.ENGINE_TYPE, TtsConstant.ENG_TYPE);
        mParamMap.put(SpeechConstant.VOICE_NAME, TtsConstant.VOICE);
        mParamMap.put(SpeechConstant.BACKGROUND_SOUND, TtsConstant.BG_SOUND);
        mParamMap.put(SpeechConstant.SPEED, TtsConstant.SPEED);
        mParamMap.put(SpeechConstant.PITCH, TtsConstant.PITCH);
        mParamMap.put(SpeechConstant.VOLUME, TtsConstant.VOLUME);
        mParamMap.put(SpeechConstant.TTS_AUDIO_PATH, null);
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Map<String, String> mParamMap = new HashMap<String, String>();
		SpeechUtility.createUtility(SpeechConstant.APPID + "=" + TtsConstant.APPID);
        SpeechSynthesizer mTts = SpeechSynthesizer.createSynthesizer();
        initParamMap(mParamMap);
        for( Map.Entry<String, String> entry : mParamMap.entrySet() ){
            String value = entry.getValue();
            mTts.setParameter( entry.getKey(), value );
        }
        SynthesizerListener mSynListener = new SynthesizerListener() {
            @Override
            public void onBufferProgress(int i, int i1, int i2, String s) {}
            @Override
            public void onSpeakBegin() {}
            @Override
            public void onSpeakProgress(int i, int i1, int i2) {}
            @Override
            public void onSpeakPaused() {}
            @Override
            public void onSpeakResumed() {}
            @Override
            public void onCompleted(SpeechError speechError) {}
        };
        mTts.startSpeaking(request.getParameter("text"), mSynListener);
        response.getWriter().write("finished");
	}

}
