package com.ruixue.sdk.adjust;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;

import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.games.GamesSignInClient;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.PlayGamesSdk;
import com.google.android.gms.games.Player;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.play.core.tasks.Task;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/10
 */
public class GooglePlayGameSdkHelper {

    //在您的类的onCreate(..)回调中初始化 Play Games SDK 。Application
    public static void init(Context context) {
        PlayGamesSdk.initialize(context);
    }

    public static void isAuthenticated(Activity activity, RXJSONCallback callback) {
        GamesSignInClient gamesSignInClient = PlayGames.getGamesSignInClient(activity);

        gamesSignInClient.isAuthenticated().addOnCompleteListener(isAuthenticatedTask -> {
            boolean isAuthenticated =
                    (isAuthenticatedTask.isSuccessful() &&
                            isAuthenticatedTask.getResult().isAuthenticated());

            if (isAuthenticated) {
                // Continue with Play Games Services
            } else {
                // Disable your integration with Play Games Services or show a
                // login button to ask  players to sign-in. Clicking it should
                // call GamesSignInClient.signIn().
            }
        });
    }

    public static void requestServerSideAccess(Activity activity, String webClientId, RXStringCallback callback) {
        GamesSignInClient gamesSignInClient = PlayGames.getGamesSignInClient(activity);
        gamesSignInClient
                .requestServerSideAccess(webClientId,
                        /*forceRefreshToken=*/ false)
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        String serverAuthToken = task.getResult();
                        // Send authentication code to the backend game server to be
                        // exchanged for an access token and used to verify the
                        // player via the Play Games Services REST APIs.
                        callback.onSuccess(serverAuthToken);
                    } else {
                        // Failed to retrieve authentication code.
                        callback.onFailed(-1," Failed to retrieve authentication code","");
                    }
                });

    }

    public static void getCurrentPlayer(Activity activity, RXJSONCallback callback) {
        PlayGames.getPlayersClient(activity)
                .getCurrentPlayer()
                .addOnCompleteListener(new OnCompleteListener<Player>() {
                    @Override
                    public void onComplete(@NonNull com.google.android.gms.tasks.Task<Player> task) {
                        Player player = task.getResult();
                    }
                });

    }
}
