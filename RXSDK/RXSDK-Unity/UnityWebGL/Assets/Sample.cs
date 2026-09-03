using System;
using UnityEngine;
using UnityEngine.UI;

public class Sample : MonoBehaviour
{
    [SerializeField] private Button Button_init;
    [SerializeField] private Button Button_login;
    [SerializeField] private Button Button_loginopenid;
    [SerializeField] private Button Button_deregister;
    [SerializeField] private Button Button_realauth;
    [SerializeField] private Button Button_helpcenter;

    private void Start()
    {
        Button_init.onClick.AddListener(onBtnInit);
        Button_login.onClick.AddListener(onBtnLogin);
        Button_loginopenid.onClick.AddListener(onBtnLoginOpenid);
        Button_deregister.onClick.AddListener(onBtnDeregister);
        Button_realauth.onClick.AddListener(onBtnRealAuth);
        Button_helpcenter.onClick.AddListener(onBtnHelpCenter);
    }

    private void onBtnInit()
    {
        Debug.Log("初始化");
    }

    private void onBtnLogin()
    {
        Debug.Log("登录");
    }

    private void onBtnLoginOpenid()
    {
        Debug.Log("二次登录");
    }

    private void onBtnDeregister()
    {
        Debug.Log("注销");
    }

    private void onBtnRealAuth()
    {
        Debug.Log("实名认证");
    }

    private void onBtnHelpCenter()
    {
        Debug.Log("帮助中心");
    }
}