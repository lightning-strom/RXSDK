using System;
using System.Collections;
using UnityEngine;

namespace RXSDK
{
    public class SceneUtility
    {
        public enum LoadingState
        {
            None,
            Loading,
            Complete,
            Failed
        }

        private static LoadingState currentState = LoadingState.None;
        public static LoadingState CurrentState => currentState;

        private static float currentProgress = 0f;
        public static float CurrentProgress => currentProgress;

        private static string currentError = string.Empty;
        public static string CurrentError => currentError;

        public static event Action<float> OnProgressChanged;
        public static event Action<LoadingState> OnStateChanged;
        public static event Action<string> OnError;

        public static bool IsSceneInBuildSettings(string sceneName)
        {
            // Get all enabled scenes from build settings
            var sceneCount = UnityEngine.SceneManagement.SceneManager.sceneCountInBuildSettings;
            for (int i = 0; i < sceneCount; i++)
            {
                string path = UnityEngine.SceneManagement.SceneUtility.GetScenePathByBuildIndex(i);
                if (path.Contains(sceneName))
                {
                    return true;
                }
            }
            return false;
        }

        public static void LoadSceneAsync(string sceneName, Action<bool> onComplete = null, MonoBehaviour mono = null)
        {
            if (string.IsNullOrEmpty(sceneName))
            {
                ReportError("Scene name cannot be empty");
                onComplete?.Invoke(false);
                return;
            }

            if (currentState == LoadingState.Loading)
            {
                ReportError("Another scene is currently loading");
                onComplete?.Invoke(false);
                return;
            }

            // 使用 SceneLoader 单例
            var loader = mono != null ? mono : SceneLoader.Instance;
            loader.StartCoroutine(LoadSceneRoutine(sceneName, loader, onComplete));
        }

        private static IEnumerator LoadSceneRoutine(string sceneName, MonoBehaviour loader, Action<bool> onComplete)
        {

            UpdateState(LoadingState.Loading);
            UpdateProgress(0f);

            // 检查场景是否存在
            if (!IsSceneInBuildSettings(sceneName))
            {
                throw new Exception($"Scene '{sceneName}' is not included in build settings");
            }

            // 检查是否已在目标场景
            if (UnityEngine.SceneManagement.SceneManager.GetActiveScene().name == sceneName)
            {
                Debug.Log($"Already in scene '{sceneName}'");
                UpdateProgress(1f);
                UpdateState(LoadingState.Complete);
                onComplete?.Invoke(true);
                yield break;
            }

            // 开始异步加载
            AsyncOperation asyncOperation = UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(sceneName);
            asyncOperation.allowSceneActivation = false; // 先不激活场景

            // HandleAsyncOperation(asyncOperation).MoveNext();
            yield return HandleAsyncOperation(asyncOperation, true);

            yield return new WaitForSeconds(0.1f);
            UpdateProgress(0.9f);

            // 激活场景
            asyncOperation.allowSceneActivation = true;

            // 等待加载完成
            yield return HandleAsyncOperation(asyncOperation, true);

            UpdateProgress(1f);
            UpdateState(LoadingState.Complete);
            onComplete?.Invoke(true);

        }

        private static IEnumerator HandleAsyncOperation(AsyncOperation asyncOperation, bool isFinalStage = false)
        {
            while (!asyncOperation.isDone && (!isFinalStage || asyncOperation.progress < 0.9f))
            {
                UpdateProgress(isFinalStage ? Mathf.Lerp(0.9f, 1f, asyncOperation.progress) : asyncOperation.progress);
                yield return null;
            }
        }

        private static void UpdateProgress(float progress)
        {
            currentProgress = progress;
            OnProgressChanged?.Invoke(progress);
        }

        private static void UpdateState(LoadingState state)
        {
            currentState = state;
            // Debug.Log("UpdateState" + currentState);
            OnStateChanged?.Invoke(state);
        }

        private static void ReportError(string error)
        {
            currentError = error;
            Debug.LogError($"Scene loading error: {error}");
            OnError?.Invoke(error);
        }
    }

    internal class SceneLoader : MonoBehaviour
    {
        private static SceneLoader instance;
        public static SceneLoader Instance
        {
            get
            {
                if (instance == null)
                {
                    var go = new GameObject("SceneLoader");
                    instance = go.AddComponent<SceneLoader>();
                    DontDestroyOnLoad(go);
                }
                return instance;
            }
        }

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }

            instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void OnDestroy()
        {
            if (instance == this)
            {
                instance = null;
            }
        }
    }
}
