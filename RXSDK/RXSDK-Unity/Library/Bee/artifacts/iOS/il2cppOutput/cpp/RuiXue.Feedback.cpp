#include "pch-cpp.hpp"

#ifndef _MSC_VER
# include <alloca.h>
#else
# include <malloc.h>
#endif


#include <limits>


template <typename T1, typename T2>
struct InterfaceActionInvoker2
{
	typedef void (*Action)(void*, T1, T2, const RuntimeMethod*);

	static inline void Invoke (Il2CppMethodSlot slot, RuntimeClass* declaringInterface, RuntimeObject* obj, T1 p1, T2 p2)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_interface_invoke_data(slot, obj, declaringInterface);
		((Action)invokeData.methodPtr)(obj, p1, p2, invokeData.method);
	}
};
template <typename T1, typename T2, typename T3>
struct InterfaceActionInvoker3
{
	typedef void (*Action)(void*, T1, T2, T3, const RuntimeMethod*);

	static inline void Invoke (Il2CppMethodSlot slot, RuntimeClass* declaringInterface, RuntimeObject* obj, T1 p1, T2 p2, T3 p3)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_interface_invoke_data(slot, obj, declaringInterface);
		((Action)invokeData.methodPtr)(obj, p1, p2, p3, invokeData.method);
	}
};

struct Dictionary_2_tAFFFC9BCDC0E8601FDB252CD80C438376B1177C6;
struct Dictionary_2_tCABF29E2E992CA896E7F85C3E8A7647AD903AC2A;
struct Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710;
struct IEqualityComparer_1_tAE94C8F24AD5B94D4EE85CA9FC59E3409D41CAF7;
struct KeyCollection_tE66790F09E854C19C7F612BEAD203AE626E90A36;
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD;
struct ValueCollection_tC9D91E8A3198E40EA339059703AB10DFC9F5CC2E;
struct EntryU5BU5D_t233BB24ED01E2D8D65B0651D54B8E3AD125CAF96;
struct ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C;
struct CancellationTokenSource_tAAE1E0033BCFC233801F8CB4CED5C852B350CB7B;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727;
struct IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10;
struct MethodInfo_t;
struct RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral48A054575FE69FCDA04CEF5EB7A32131586DA416;
IL2CPP_EXTERN_C String_t* _stringLiteral6CD816D955EE812907140053D8A46D38451451FD;
IL2CPP_EXTERN_C String_t* _stringLiteralA97B163459CBDB9D2157DAF5AE0C0E8BFBD61307;
IL2CPP_EXTERN_C String_t* _stringLiteralF5A2E0D6B37D174651C0282B357D2508DD6BA34E;
IL2CPP_EXTERN_C const RuntimeMethod* RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;

struct ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031;

IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_tCEEC9514743C8DB36CF6CA6CB64FCF03D074C9A0 
{
};
struct Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710  : public RuntimeObject
{
	Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C* ____buckets;
	EntryU5BU5D_t233BB24ED01E2D8D65B0651D54B8E3AD125CAF96* ____entries;
	int32_t ____count;
	int32_t ____freeList;
	int32_t ____freeCount;
	int32_t ____version;
	RuntimeObject* ____comparer;
	KeyCollection_tE66790F09E854C19C7F612BEAD203AE626E90A36* ____keys;
	ValueCollection_tC9D91E8A3198E40EA339059703AB10DFC9F5CC2E* ____values;
	RuntimeObject* ____syncRoot;
};
struct RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5  : public RuntimeObject
{
};
struct RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A  : public RuntimeObject
{
};
struct String_t  : public RuntimeObject
{
	int32_t ____stringLength;
	Il2CppChar ____firstChar;
};
struct ValueType_t6D9B272BD21782F0A9A14F2E41F85A50E97A986F  : public RuntimeObject
{
};
struct ValueType_t6D9B272BD21782F0A9A14F2E41F85A50E97A986F_marshaled_pinvoke
{
};
struct ValueType_t6D9B272BD21782F0A9A14F2E41F85A50E97A986F_marshaled_com
{
};
struct Byte_t94D9231AC217BE4D2E004C4CD32DF6D099EA41A3 
{
	uint8_t ___m_value;
};
struct IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 
{
	RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___onResponse;
	RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___onError;
};
struct IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6_marshaled_pinvoke
{
	Il2CppMethodPointer ___onResponse;
	Il2CppMethodPointer ___onError;
};
struct IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6_marshaled_com
{
	Il2CppMethodPointer ___onResponse;
	Il2CppMethodPointer ___onError;
};
struct Int32_t680FF22E76F6EFAD4375103CBBFFA0421349384C 
{
	int32_t ___m_value;
};
struct IntPtr_t 
{
	void* ___m_value;
};
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915 
{
	union
	{
		struct
		{
		};
		uint8_t Void_t4861ACF8F4594C3437BB48B6E56783494B843915__padding[1];
	};
};
struct Delegate_t  : public RuntimeObject
{
	intptr_t ___method_ptr;
	intptr_t ___invoke_impl;
	RuntimeObject* ___m_target;
	intptr_t ___method;
	intptr_t ___delegate_trampoline;
	intptr_t ___extra_arg;
	intptr_t ___method_code;
	intptr_t ___interp_method;
	intptr_t ___interp_invoke_impl;
	MethodInfo_t* ___method_info;
	MethodInfo_t* ___original_method_info;
	DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E* ___data;
	bool ___method_is_virtual;
};
struct Delegate_t_marshaled_pinvoke
{
	intptr_t ___method_ptr;
	intptr_t ___invoke_impl;
	Il2CppIUnknown* ___m_target;
	intptr_t ___method;
	intptr_t ___delegate_trampoline;
	intptr_t ___extra_arg;
	intptr_t ___method_code;
	intptr_t ___interp_method;
	intptr_t ___interp_invoke_impl;
	MethodInfo_t* ___method_info;
	MethodInfo_t* ___original_method_info;
	DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E* ___data;
	int32_t ___method_is_virtual;
};
struct Delegate_t_marshaled_com
{
	intptr_t ___method_ptr;
	intptr_t ___invoke_impl;
	Il2CppIUnknown* ___m_target;
	intptr_t ___method;
	intptr_t ___delegate_trampoline;
	intptr_t ___extra_arg;
	intptr_t ___method_code;
	intptr_t ___interp_method;
	intptr_t ___interp_invoke_impl;
	MethodInfo_t* ___method_info;
	MethodInfo_t* ___original_method_info;
	DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E* ___data;
	int32_t ___method_is_virtual;
};
struct Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C  : public RuntimeObject
{
	intptr_t ___m_CachedPtr;
};
struct Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C_marshaled_pinvoke
{
	intptr_t ___m_CachedPtr;
};
struct Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C_marshaled_com
{
	intptr_t ___m_CachedPtr;
};
struct Component_t39FBE53E5EFCF4409111FB22C15FF73717632EC3  : public Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C
{
};
struct MulticastDelegate_t  : public Delegate_t
{
	DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771* ___delegates;
};
struct MulticastDelegate_t_marshaled_pinvoke : public Delegate_t_marshaled_pinvoke
{
	Delegate_t_marshaled_pinvoke** ___delegates;
};
struct MulticastDelegate_t_marshaled_com : public Delegate_t_marshaled_com
{
	Delegate_t_marshaled_com** ___delegates;
};
struct Behaviour_t01970CFBBA658497AE30F311C447DB0440BAB7FA  : public Component_t39FBE53E5EFCF4409111FB22C15FF73717632EC3
{
};
struct IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727  : public MulticastDelegate_t
{
};
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3  : public MulticastDelegate_t
{
};
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113  : public MulticastDelegate_t
{
};
struct MonoBehaviour_t532A11E69716D348D8AA7F854AFCBFCB8AD17F71  : public Behaviour_t01970CFBBA658497AE30F311C447DB0440BAB7FA
{
	CancellationTokenSource_tAAE1E0033BCFC233801F8CB4CED5C852B350CB7B* ___m_CancellationTokenSource;
};
struct RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF  : public MonoBehaviour_t532A11E69716D348D8AA7F854AFCBFCB8AD17F71
{
	Dictionary_2_tCABF29E2E992CA896E7F85C3E8A7647AD903AC2A* ____mapIOSCallBacks;
	Dictionary_2_tAFFFC9BCDC0E8601FDB252CD80C438376B1177C6* ____mapJsCallBackHandler;
};
struct RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields
{
	RuntimeObject* ____sdk;
};
struct String_t_StaticFields
{
	String_t* ___Empty;
};
struct IntPtr_t_StaticFields
{
	intptr_t ___Zero;
};
struct RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_StaticFields
{
	RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF* ____instance;
	String_t* ___U3CCacheInitParamCpidU3Ek__BackingField;
	String_t* ___U3CCacheInitParamProductidU3Ek__BackingField;
	String_t* ___U3CCacheInitParamChannelidU3Ek__BackingField;
	List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* ___U3CCacheInitParamBaseUrlListU3Ek__BackingField;
};
#ifdef __clang__
#pragma clang diagnostic pop
#endif
struct ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031  : public RuntimeArray
{
	ALIGN_FIELD (8) uint8_t m_Items[1];

	inline uint8_t GetAt(il2cpp_array_size_t index) const
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items[index];
	}
	inline uint8_t* GetAddressAt(il2cpp_array_size_t index)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items + index;
	}
	inline void SetAt(il2cpp_array_size_t index, uint8_t value)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		m_Items[index] = value;
	}
	inline uint8_t GetAtUnchecked(il2cpp_array_size_t index) const
	{
		return m_Items[index];
	}
	inline uint8_t* GetAddressAtUnchecked(il2cpp_array_size_t index)
	{
		return m_Items + index;
	}
	inline void SetAtUnchecked(il2cpp_array_size_t index, uint8_t value)
	{
		m_Items[index] = value;
	}
};



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS__ctor_m1AA68C7B44A9640575FCE8DC28B8E980356FB3B1 (RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1 (String_t* ___0_func, IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 ___1_wrapper, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60 (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_getFeedbackKindList_mFEE36B1F75FE30CAE2C11B75C77378AAFFE08E3F (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___0_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D (RuntimeObject* ___0_obj, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_createFeedbackWithParams_m1B98D541E45BAB24BF7F9BEF16764CF43BF806CB (String_t* ___0_paramDicJson, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_onError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_satisfactionEvaluationWithParams_m16D5034C2DFE5039C5DAB18350558F52E19435AF (String_t* ___0_paramDicJson, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_onError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_reportFeedbackLogWithData_mB63CE03A4815D632904F1897274060B39970D391 (ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* ___0_byteData, int32_t ___1_length, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___3_onError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2 (RuntimeObject* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C void DEFAULT_CALL ios_getFeedbackKindList(Il2CppMethodPointer, Il2CppMethodPointer);
IL2CPP_EXTERN_C void DEFAULT_CALL ios_createFeedbackWithParams(char*, Il2CppMethodPointer, Il2CppMethodPointer);
IL2CPP_EXTERN_C void DEFAULT_CALL ios_satisfactionEvaluationWithParams(char*, Il2CppMethodPointer, Il2CppMethodPointer);
IL2CPP_EXTERN_C void DEFAULT_CALL ios_reportFeedbackLogWithData(uint8_t*, int32_t, Il2CppMethodPointer, Il2CppMethodPointer);
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedback_GetFeedbackKindList_m46D7ACFCC13D219CF9AF0B715AC1B8095AB8BEFE (RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var))->____sdk;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_1 = ___0_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_2 = ___1_onError;
		NullCheck(L_0);
		InterfaceActionInvoker2< RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(0, IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedback_CreateFeedback_m3DB0E7C44726ADCB6AB8FA265F499FAFF7347BE2 (Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var))->____sdk;
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_1 = ___0_dic;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		NullCheck(L_0);
		InterfaceActionInvoker3< Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(1, IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedback_SatisfactionEvaluation_m0B20688AE310FB3D50A7F49A94F6EF46D47758F2 (Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var))->____sdk;
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_1 = ___0_dic;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		NullCheck(L_0);
		InterfaceActionInvoker3< Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(2, IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedback_ReportFeedbackLog_m5406D618096152E3B18C5563BC34BA19C83EB868 (ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* ___0_data, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var))->____sdk;
		ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* L_1 = ___0_data;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		NullCheck(L_0);
		InterfaceActionInvoker3< ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(3, IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedback__cctor_m4947B68A2D27E3721D40FC5624C37885F227638A (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A* L_0 = (RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A*)il2cpp_codegen_object_new(RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A_il2cpp_TypeInfo_var);
		RXFeedbackIOS__ctor_m1AA68C7B44A9640575FCE8DC28B8E980356FB3B1(L_0, NULL);
		((RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_GetFeedbackKindList_m377AFBE95E051862926FD1CD23819513AA4C7D45 (RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A* __this, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralF5A2E0D6B37D174651C0282B357D2508DD6BA34E);
		s_Il2CppMethodInitialized = true;
	}
	IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 V_0;
	memset((&V_0), 0, sizeof(V_0));
	{
		il2cpp_codegen_initobj((&V_0), sizeof(IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6));
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_0 = ___0_onResponse;
		(&V_0)->___onResponse = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onResponse), (void*)L_0);
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_1 = ___1_onError;
		(&V_0)->___onError = L_1;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onError), (void*)L_1);
		IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 L_2 = V_0;
		RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1(_stringLiteralF5A2E0D6B37D174651C0282B357D2508DD6BA34E, L_2, NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_3 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_3, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var), NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_4 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_4, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var), NULL);
		RXFeedbackIOS_ios_getFeedbackKindList_mFEE36B1F75FE30CAE2C11B75C77378AAFFE08E3F(L_3, L_4, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_CreateFeedback_mC0C2085713E04C6B0E54956E863FD962D901EFB8 (RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_hashMap, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral6CD816D955EE812907140053D8A46D38451451FD);
		s_Il2CppMethodInitialized = true;
	}
	IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 V_0;
	memset((&V_0), 0, sizeof(V_0));
	{
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_0 = ___0_hashMap;
		String_t* L_1;
		L_1 = RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D(L_0, NULL);
		il2cpp_codegen_initobj((&V_0), sizeof(IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6));
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		(&V_0)->___onResponse = L_2;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onResponse), (void*)L_2);
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		(&V_0)->___onError = L_3;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onError), (void*)L_3);
		IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 L_4 = V_0;
		RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1(_stringLiteral6CD816D955EE812907140053D8A46D38451451FD, L_4, NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_5 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_5, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var), NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_6 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_6, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var), NULL);
		RXFeedbackIOS_ios_createFeedbackWithParams_m1B98D541E45BAB24BF7F9BEF16764CF43BF806CB(L_1, L_5, L_6, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_SatisfactionEvaluation_m421DAB580963CB78CB0F5C4A81C2F3911E7372C6 (RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_hashMap, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral48A054575FE69FCDA04CEF5EB7A32131586DA416);
		s_Il2CppMethodInitialized = true;
	}
	IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 V_0;
	memset((&V_0), 0, sizeof(V_0));
	{
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_0 = ___0_hashMap;
		String_t* L_1;
		L_1 = RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D(L_0, NULL);
		il2cpp_codegen_initobj((&V_0), sizeof(IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6));
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		(&V_0)->___onResponse = L_2;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onResponse), (void*)L_2);
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		(&V_0)->___onError = L_3;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onError), (void*)L_3);
		IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 L_4 = V_0;
		RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1(_stringLiteral48A054575FE69FCDA04CEF5EB7A32131586DA416, L_4, NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_5 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_5, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var), NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_6 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_6, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var), NULL);
		RXFeedbackIOS_ios_satisfactionEvaluationWithParams_m16D5034C2DFE5039C5DAB18350558F52E19435AF(L_1, L_5, L_6, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ReportFeedbackLog_m201947C1645FE73102A83A00DD64096E0046644F (RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A* __this, ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* ___0_data, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralA97B163459CBDB9D2157DAF5AE0C0E8BFBD61307);
		s_Il2CppMethodInitialized = true;
	}
	IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 V_0;
	memset((&V_0), 0, sizeof(V_0));
	{
		il2cpp_codegen_initobj((&V_0), sizeof(IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6));
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_0 = ___1_onResponse;
		(&V_0)->___onResponse = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onResponse), (void*)L_0);
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_1 = ___2_onError;
		(&V_0)->___onError = L_1;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onError), (void*)L_1);
		IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 L_2 = V_0;
		RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1(_stringLiteralA97B163459CBDB9D2157DAF5AE0C0E8BFBD61307, L_2, NULL);
		ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* L_3 = ___0_data;
		ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* L_4 = ___0_data;
		NullCheck(L_4);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_5 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_5, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var), NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_6 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_6, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var), NULL);
		RXFeedbackIOS_ios_reportFeedbackLogWithData_mB63CE03A4815D632904F1897274060B39970D391(L_3, ((int32_t)(((RuntimeArray*)L_4)->max_length)), L_5, L_6, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_getFeedbackKindList_mFEE36B1F75FE30CAE2C11B75C77378AAFFE08E3F (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___0_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onError, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (Il2CppMethodPointer, Il2CppMethodPointer);

	Il2CppMethodPointer ____0_onSuccess_marshaled = NULL;
	____0_onSuccess_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___0_onSuccess));

	Il2CppMethodPointer ____1_onError_marshaled = NULL;
	____1_onError_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___1_onError));

	reinterpret_cast<PInvokeFunc>(ios_getFeedbackKindList)(____0_onSuccess_marshaled, ____1_onError_marshaled);

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_createFeedbackWithParams_m1B98D541E45BAB24BF7F9BEF16764CF43BF806CB (String_t* ___0_paramDicJson, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_onError, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*, Il2CppMethodPointer, Il2CppMethodPointer);

	char* ____0_paramDicJson_marshaled = NULL;
	____0_paramDicJson_marshaled = il2cpp_codegen_marshal_string(___0_paramDicJson);

	Il2CppMethodPointer ____1_onSuccess_marshaled = NULL;
	____1_onSuccess_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___1_onSuccess));

	Il2CppMethodPointer ____2_onError_marshaled = NULL;
	____2_onError_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___2_onError));

	reinterpret_cast<PInvokeFunc>(ios_createFeedbackWithParams)(____0_paramDicJson_marshaled, ____1_onSuccess_marshaled, ____2_onError_marshaled);

	il2cpp_codegen_marshal_free(____0_paramDicJson_marshaled);
	____0_paramDicJson_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_satisfactionEvaluationWithParams_m16D5034C2DFE5039C5DAB18350558F52E19435AF (String_t* ___0_paramDicJson, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_onError, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*, Il2CppMethodPointer, Il2CppMethodPointer);

	char* ____0_paramDicJson_marshaled = NULL;
	____0_paramDicJson_marshaled = il2cpp_codegen_marshal_string(___0_paramDicJson);

	Il2CppMethodPointer ____1_onSuccess_marshaled = NULL;
	____1_onSuccess_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___1_onSuccess));

	Il2CppMethodPointer ____2_onError_marshaled = NULL;
	____2_onError_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___2_onError));

	reinterpret_cast<PInvokeFunc>(ios_satisfactionEvaluationWithParams)(____0_paramDicJson_marshaled, ____1_onSuccess_marshaled, ____2_onError_marshaled);

	il2cpp_codegen_marshal_free(____0_paramDicJson_marshaled);
	____0_paramDicJson_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS_ios_reportFeedbackLogWithData_mB63CE03A4815D632904F1897274060B39970D391 (ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* ___0_byteData, int32_t ___1_length, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___3_onError, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (uint8_t*, int32_t, Il2CppMethodPointer, Il2CppMethodPointer);

	uint8_t* ____0_byteData_marshaled = NULL;
	if (___0_byteData != NULL)
	{
		____0_byteData_marshaled = reinterpret_cast<uint8_t*>((___0_byteData)->GetAddressAtUnchecked(0));
	}

	Il2CppMethodPointer ____2_onSuccess_marshaled = NULL;
	____2_onSuccess_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___2_onSuccess));

	Il2CppMethodPointer ____3_onError_marshaled = NULL;
	____3_onError_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___3_onError));

	reinterpret_cast<PInvokeFunc>(ios_reportFeedbackLogWithData)(____0_byteData_marshaled, ___1_length, ____2_onSuccess_marshaled, ____3_onError_marshaled);

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackIOS__ctor_m1AA68C7B44A9640575FCE8DC28B8E980356FB3B1 (RXFeedbackIOS_t994070F09B0C756CEDFB4ACD4F418B15BD6BD98A* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
