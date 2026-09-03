using RuiXue.Bytedance.Impl;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueBytedanceDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_SetContext;
    
    void Start()
    {
        _Button_SetContext.onClick.AddListener(OnSetContext);
    }

    public void OnSetContext()
    {
        RXBytedance.SetContext();
    }

}
