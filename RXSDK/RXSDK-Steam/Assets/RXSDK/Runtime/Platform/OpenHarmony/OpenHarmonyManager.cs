using UnityEngine;
using RXSDK;

using System;

public class OpenHarmonyManager : MonoBehaviour
{


    private void Start()
    {
        Debug.Log("OpenHarmony platform features initialized successfully");
    }


    private void OnApplicationQuit()
    {
        try
        {
            Debug.Log("OpenHarmony platform features shutdown successfully");
        }
        catch (Exception e)
        {
            Debug.LogError($"Error during OpenHarmony platform shutdown: {e.Message}");
        }
    }
}