package com.ruixue.openapi

import android.animation.Animator
import android.animation.ValueAnimator
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import android.view.animation.Interpolator
import android.widget.ImageView

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/23
 */
abstract class SplashActivity : Activity() {
    protected var img: ImageView? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val splashImgId = resources.getIdentifier("splash_img", "drawable", packageName)
        if (splashImgId <= 0) {
            return
        }
        if (!isTaskRoot) { //处理应用切到后台，再切回来，重复显示闪屏页的问题
            val intent = intent
            val intentAction = intent.action
            if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && intentAction != null && intentAction == Intent.ACTION_MAIN) {
                finish()
                return
            }
        }
        requestWindowFeature(Window.FEATURE_NO_TITLE)
//        this.window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN)
        setContentView(resources.getIdentifier("rx_splash_img", "layout", packageName))

        //加载闪屏图片
        img = findViewById(resources.getIdentifier("img", "id", packageName))
        val tmp = img
        tmp?.setImageResource(splashImgId)
        startAnim()
    }

    abstract fun onSplashEnd()
    fun startAnim() {
        val va = ValueAnimator.ofFloat(0f, 1f, 1f, 0f)
        va.addUpdateListener { animation: ValueAnimator ->
            val params = animation.animatedValue as Float
            img!!.alpha = params
        }
        va.interpolator = Interpolator { input: Float -> input }
        va.duration = 3000
        va.repeatCount = 0
        va.addListener(object : Animator.AnimatorListener {
            override fun onAnimationStart(animation: Animator) {}
            override fun onAnimationEnd(animation: Animator) {
                onSplashEnd()
            }

            override fun onAnimationCancel(animation: Animator) {}
            override fun onAnimationRepeat(animation: Animator) {}
        })
        va.start()
    }

    override fun onBackPressed() {
        //处理闪屏页按返回键不finish
    }
}