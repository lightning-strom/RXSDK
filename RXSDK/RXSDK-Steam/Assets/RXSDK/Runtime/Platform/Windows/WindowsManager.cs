using UnityEngine;
using RXSDK;
using System;

public class WindowsManager : MonoBehaviour
{


    private void Start()
    {
        Debug.Log("Windows  platform features initialized successfully");
    }


    private void OnApplicationQuit()
    {

        Debug.Log("Windows  platform features shutdown successfully");

    }
}