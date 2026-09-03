package com.ruixue.storage;

import android.content.SharedPreferences;
import android.util.Log;

import com.ruixue.RuiXueSdk;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public abstract class SharedPreferencesStorage<T> {

    private static final long SP_LOAD_TIMEOUT_MS = 5000L;

    protected T data;
    protected final String storageKey;
    protected final Future<SharedPreferences> loadStoredPreferences;
    /** 不可对 Future 本身加锁，否则可能与 FutureTask 完成通知互相等待。 */
    private final Object lock = new Object();

    protected SharedPreferencesStorage(final Future<SharedPreferences> loadStoredPreferences, final String storageKey) {
        this.loadStoredPreferences = loadStoredPreferences;
        this.storageKey = storageKey;
    }

    private SharedPreferences awaitSharedPreferences() {
        try {
            return loadStoredPreferences.get(SP_LOAD_TIMEOUT_MS, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            Log.e(RuiXueSdk.TAG, "SharedPreferences load timeout key=" + storageKey, e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            Log.e(RuiXueSdk.TAG, "SharedPreferences load interrupted key=" + storageKey, e);
        } catch (ExecutionException e) {
            Log.e(RuiXueSdk.TAG, "SharedPreferences load failed key=" + storageKey, e);
        }
        return null;
    }

    // return default value.
    T create() {
        return null;
    }

    // save the data to sharedPreference. If the type of T is not String, override this method.
    void save(SharedPreferences.Editor editor, T data) {
        editor.putString(storageKey, (String) data);
        editor.apply();
    }

    // load the data from sharedPreference. If the type of T is not String, override this method.
    @SuppressWarnings("unchecked")
    void load(SharedPreferences sharedPreferences) {
        String data = sharedPreferences.getString(this.storageKey, null);
        if (data == null) {
            put(create());
        } else {
            this.data = (T) data;
        }
    }

    void remove(SharedPreferences.Editor editor) {
        editor.remove(storageKey);
        editor.apply();
        this.data = create();
    }

    public void remove() {
        synchronized (lock) {
            final SharedPreferences.Editor editor = getEditor();
            if (editor != null) {
                remove(editor);
            }
        }
    }

    /**
     * 获取保存在 SharedPreference 中的值
     *
     * @return value of the storageKey.
     */
    public T get() {
        if (this.data == null) {
            synchronized (lock) {
                if (this.data == null) {
                    SharedPreferences sharedPreferences = awaitSharedPreferences();
                    if (sharedPreferences != null) {
                        load(sharedPreferences);
                    } else {
                        this.data = create();
                    }
                }
            }
        }
        return this.data;
    }

    /**
     * 设置 storage key 的值，并保存到 sharedPreference 中.
     *
     * @param data 需要设置的值.
     */
    public void put(T data) {
        this.data = data;
        synchronized (lock) {
            final SharedPreferences.Editor editor = getEditor();
            if (editor != null) {
                save(editor, this.data);
            }
        }
    }

    private SharedPreferences.Editor getEditor() {
        SharedPreferences sharedPreferences = awaitSharedPreferences();
        if (sharedPreferences != null) {
            return sharedPreferences.edit();
        } else {
            return null;
        }
    }

}
