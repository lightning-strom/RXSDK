#if UNITY_ANDROID
using System;
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue
{
    public class JavaCallBackToMainThread : MonoBehaviour
    {
        private static JavaCallBackToMainThread _instance;
    
        private void Awake()
        {
            _instance = this;
        }
    
        private List<Action> _pendingActions = new List<Action>();
        private List<Action> _readyToAdd = new List<Action>();
    
        // Update is called once per frame
        void Update()
        {
            if (_readyToAdd.Count > 0)
            {
                _pendingActions.AddRange(_readyToAdd);
                _readyToAdd.Clear();
            }
            
            if (_pendingActions.Count == 0)
                return;
    
            for (int i = 0; i < _pendingActions.Count; i++)
            {
                var action = _pendingActions[i];
                try
                {
                    action.Invoke();
                }
                catch (Exception e)
                {
                    Debug.LogError(e.Message);
                }
            }
            
            _pendingActions.Clear();
        }
    
        public static void CheckInit()
        {
            if (_instance == null)
            {
                GameObject go = new GameObject("JavaCallBackToMainThread");
                _instance = go.AddComponent<JavaCallBackToMainThread>();
                DontDestroyOnLoad(go);
            }
        }
        
        public static void Add(Action action)
        {
            _instance._readyToAdd.Add(action);
        }
    }

}
#endif