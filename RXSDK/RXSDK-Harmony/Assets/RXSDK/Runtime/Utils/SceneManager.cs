using UnityEngine;
using System.Collections.Generic;

namespace RXSDK
{
    public class SceneManager : MonoBehaviour
    {
        private static SceneManager instance;
        private static readonly HashSet<GameObject> persistentObjects = new();

        public static SceneManager Instance
        {
            get
            {
                if (instance == null)
                {
                    var go = new GameObject("SceneManager");
                    instance = go.AddComponent<SceneManager>();
                    DontDestroyOnLoad(go);
                }
                return instance;
            }
        }

        public static void RegisterPersistentObject(GameObject obj)
        {
            if (obj != null && !persistentObjects.Contains(obj))
            {
                persistentObjects.Add(obj);
                DontDestroyOnLoad(obj);
            }
        }

        public static void UnregisterPersistentObject(GameObject obj)
        {
            if (obj != null)
            {
                persistentObjects.Remove(obj);
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