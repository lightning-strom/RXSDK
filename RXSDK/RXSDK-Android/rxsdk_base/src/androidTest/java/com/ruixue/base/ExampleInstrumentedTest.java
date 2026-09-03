package com.ruixue.base;

import android.content.Context;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.test.platform.app.InstrumentationRegistry;

import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXException;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.passport.LoginMethod;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
//InstrumentationRegistry.getInstrumentation()返回当前正在运行的Instrumentation
//InstrumentationRegistry.getContext()返回此Instrumentation软件包的上下文。
//InstrumentationRegistry.getTargetContext()返回目标应用的应用上下文。
//InstrumentationRegistry.getArguments()返回传递给此Instrumentation的参数Bundle。

//@RunWith(AndroidJUnit4.class)
//@RunWith(Parameterized.class)
public class ExampleInstrumentedTest {
    private static final String TAG = "rxtest";
//    @Rule
//    public ActivityTestRule<MyActivity> myActivityTestRule =
//            new ActivityTestRule<>(MyActivity.class, true, true);

    private HandlerThread t;

    private Handler tH;

    @Before
    public void setUp() {


     }

    @Test
    public void testPlatformsApi() {

    }

    @Test
    public void testGetShareData() {

    }

    @Test
    public void testLoginByGuset() throws InterruptedException {
        Map<String, Object> map = new HashMap<>();
        map.put("method", LoginMethod.GUEST);
        final CountDownLatch signal = new CountDownLatch(1);
        final JSONObject[] respData = new JSONObject[1];
        RXApiHelper.Passport.login(map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                respData[0] = data;
                Log.i(TAG, respData[0].toString());
//                assertTrue(data!=null);
                assertNotNull(respData[0]);
                signal.countDown();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Log.i(TAG, cause.toString());

                signal.countDown();
            }


            @Override
            public void onError(RXException exception) {
                Log.i(TAG, exception.getMessage());

                signal.countDown();
            }
        });
        signal.await();
        assertNotNull(respData[0]);

    }

    @Test
    public void testLoginByGuset1() throws InterruptedException {
        Map<String, Object> map = new HashMap<>();
        map.put("method", LoginMethod.GUEST);
        final Object lock = new Object();

        final JSONObject[] respData = new JSONObject[1];
        RXApiHelper.Passport.login(map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                respData[0] = data;
                Log.i(TAG, respData[0].toString());
//                assertTrue(data!=null);
                assertNotNull(respData[0]);
                synchronized (lock) {
                    lock.notify();
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Log.i(TAG, cause.toString());
                synchronized (lock) {
                    lock.notify();
                }
            }


            @Override
            public void onError(RXException exception) {
                Log.i(TAG, exception.getMessage());
                synchronized (lock) {
                    lock.notify();
                }
            }
        });
        try {
            synchronized (lock) {
                lock.wait();
            }

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        assertNotNull(respData[0]);

    }

    @Test
    public void testCrypt() {

        String key = "1001Eea9AcC22cBBefa0Ad42BE48Ab88750d1001";
        String data = "啊啊东风";
        String encrypt = RuiXueSdk.encrypt(data, key, 0);
        System.out.println(encrypt);

        String decodeData = RuiXueSdk.decrypt(encrypt, key);
        System.out.println(decodeData);

        if (data.equals(decodeData)) {
            System.out.println("加密，解密成功。");
        } else {
            System.out.println(data);
            System.out.println("加密，解密失败。");
        }

        assertEquals("断言", data, decodeData);

        // Context of the app under test.
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.ruixue.base.test", appContext.getPackageName());
    }


    @After
    public void tearDown() throws Exception {
        System.out.println("测试结束后的执行代码在这里执行，可做释放资源操作");
    }
}