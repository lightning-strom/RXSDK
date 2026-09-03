using RuiXue;
using RuiXue.Review;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueReviewDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_JumpToAppStore;
    
    void Start()
    {
        _Button_JumpToAppStore.onClick.AddListener(OnJumpToAppStore);
    }

    public void OnJumpToAppStore()
    {
        LogUtil.Log("EventManager", $"JumpToAppStore  : {RXReview.JumpToAppStore()}");

    }


}
