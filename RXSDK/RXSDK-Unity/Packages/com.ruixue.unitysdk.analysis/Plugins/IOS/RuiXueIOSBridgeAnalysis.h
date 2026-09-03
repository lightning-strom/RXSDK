#ifndef __RuiXue__IOSBridge__Analysis__
#define __RuiXue__IOSBridge__Analysis__


extern "C"
{
// 数据埋点（逐条上报）
bool ios_analysis_addLogSingleWithEvent(const char* evnet, const char* distinctId, const char* jsonDicProperties);

// 设置公共属性
void ios_analysis_setPublicProperties(const char* jsonDicProperties);

// 修改公共属性
void ios_analysis_updatePublicProperties(const char* jsonDicProperties);

// 删除公共属性
void ios_analysis_deletePublicProperties(const char* jsonArrayPropterties);
}

#endif
