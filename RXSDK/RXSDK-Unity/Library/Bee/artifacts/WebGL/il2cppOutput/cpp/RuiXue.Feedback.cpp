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

struct Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710;
struct Dictionary_2_tF9C7F3DE8B5C1D019BD256B407AAE78DA79EB755;
struct IEqualityComparer_1_tAE94C8F24AD5B94D4EE85CA9FC59E3409D41CAF7;
struct KeyCollection_tE66790F09E854C19C7F612BEAD203AE626E90A36;
struct ValueCollection_tC9D91E8A3198E40EA339059703AB10DFC9F5CC2E;
struct EntryU5BU5D_t233BB24ED01E2D8D65B0651D54B8E3AD125CAF96;
struct ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10;
struct JsCallBackHandlerBase_tAC1693BE801D90A8ACCAABFA2816CA7A6D40D2DF;
struct MethodInfo_t;
struct RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral58E13265E5BE8401EC26118BBF13600867B648D3;
IL2CPP_EXTERN_C String_t* _stringLiteral88C7997D0155A31D391FA4D0F65481071B0A7FAB;
IL2CPP_EXTERN_C String_t* _stringLiteralA35B4DB6C62E7669E7C8E890AF4D607C31F4E944;
IL2CPP_EXTERN_C String_t* _stringLiteralC400C3B1D4E93A89AFC77F6E6854A1C6F1E62E41;
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
struct JsCallBackHandlerBase_tAC1693BE801D90A8ACCAABFA2816CA7A6D40D2DF  : public RuntimeObject
{
	Dictionary_2_tF9C7F3DE8B5C1D019BD256B407AAE78DA79EB755* ____callBacks;
};
struct RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5  : public RuntimeObject
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
struct IntPtr_t 
{
	void* ___m_value;
};
struct RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B  : public JsCallBackHandlerBase_tAC1693BE801D90A8ACCAABFA2816CA7A6D40D2DF
{
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
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3  : public MulticastDelegate_t
{
};
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113  : public MulticastDelegate_t
{
};
struct RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_StaticFields
{
	RuntimeObject* ____sdk;
};
struct String_t_StaticFields
{
	String_t* ___Empty;
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL__ctor_m00C74886071921D50C32A9A86A7DD81CC72438C4 (RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void JsCallBackHandlerBase_RegisterJsCallBack_m58E34423499CB37BEC266FDD38F45F729D6F7245 (JsCallBackHandlerBase_tAC1693BE801D90A8ACCAABFA2816CA7A6D40D2DF* __this, String_t* ___0_api, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onSuccess, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_rx_getFeedbackKindList_mD3396C60B7CEDC0F329D387C458FDEA5A3B8C09C (const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D (RuntimeObject* ___0_obj, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_rx_createFeedback_mF306363B2FB399C363ADD2D44E121EE2ED29BB3E (String_t* ___0_json, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_rx_satisfactionEvaluation_mC65EFFD5D1A4C2EA74E37D1714AF0F43B43F9797 (String_t* ___0_json, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9 (String_t* ___0_funcName, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void JsCallBackHandlerBase__ctor_m173173C9EFB47A00770DDA05141901BB18E85FB9 (JsCallBackHandlerBase_tAC1693BE801D90A8ACCAABFA2816CA7A6D40D2DF* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C void DEFAULT_CALL rx_getFeedbackKindList();
IL2CPP_EXTERN_C void DEFAULT_CALL rx_createFeedback(char*);
IL2CPP_EXTERN_C void DEFAULT_CALL rx_satisfactionEvaluation(char*);
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
		InterfaceActionInvoker3< ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(3, IRXFeedback_tB9D0A8AD2E47CC5286618336EC9AB153FCF1AD10_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedback__cctor_m4947B68A2D27E3721D40FC5624C37885F227638A (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedback_t01FA7961FC9EB284FD51FC6C34E0F59BABBC3CD5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B* L_0 = (RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B*)il2cpp_codegen_object_new(RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B_il2cpp_TypeInfo_var);
		RXFeedbackWebGL__ctor_m00C74886071921D50C32A9A86A7DD81CC72438C4(L_0, NULL);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_GetFeedbackKindList_m7ED34E84590000EED73A0E283F416BF4696C6502 (RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B* __this, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral58E13265E5BE8401EC26118BBF13600867B648D3);
		s_Il2CppMethodInitialized = true;
	}
	{
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_0 = ___0_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_1 = ___1_onError;
		JsCallBackHandlerBase_RegisterJsCallBack_m58E34423499CB37BEC266FDD38F45F729D6F7245(__this, _stringLiteral58E13265E5BE8401EC26118BBF13600867B648D3, L_0, L_1, NULL);
		RXFeedbackWebGL_rx_getFeedbackKindList_mD3396C60B7CEDC0F329D387C458FDEA5A3B8C09C(NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_CreateFeedback_mCB1B011F2F273019DC8EB1063E22EA543ED86566 (RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_hashMap, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralA35B4DB6C62E7669E7C8E890AF4D607C31F4E944);
		s_Il2CppMethodInitialized = true;
	}
	{
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_0 = ___0_hashMap;
		String_t* L_1;
		L_1 = RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D(L_0, NULL);
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		JsCallBackHandlerBase_RegisterJsCallBack_m58E34423499CB37BEC266FDD38F45F729D6F7245(__this, _stringLiteralA35B4DB6C62E7669E7C8E890AF4D607C31F4E944, L_2, L_3, NULL);
		RXFeedbackWebGL_rx_createFeedback_mF306363B2FB399C363ADD2D44E121EE2ED29BB3E(L_1, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_SatisfactionEvaluation_mC8D828B7082BF96245BF99A70469D7DBA8DF042D (RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_hashMap, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral88C7997D0155A31D391FA4D0F65481071B0A7FAB);
		s_Il2CppMethodInitialized = true;
	}
	{
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_0 = ___0_hashMap;
		String_t* L_1;
		L_1 = RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D(L_0, NULL);
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		JsCallBackHandlerBase_RegisterJsCallBack_m58E34423499CB37BEC266FDD38F45F729D6F7245(__this, _stringLiteral88C7997D0155A31D391FA4D0F65481071B0A7FAB, L_2, L_3, NULL);
		RXFeedbackWebGL_rx_satisfactionEvaluation_mC65EFFD5D1A4C2EA74E37D1714AF0F43B43F9797(L_1, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_ReportFeedbackLog_mF018C001836806310F60288D5F7B0EDC3476036E (RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B* __this, ByteU5BU5D_tA6237BF417AE52AD70CFB4EF24A7A82613DF9031* ___0_data, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralC400C3B1D4E93A89AFC77F6E6854A1C6F1E62E41);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralC400C3B1D4E93A89AFC77F6E6854A1C6F1E62E41, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_rx_getFeedbackKindList_mD3396C60B7CEDC0F329D387C458FDEA5A3B8C09C (const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) ();

	reinterpret_cast<PInvokeFunc>(rx_getFeedbackKindList)();

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_rx_createFeedback_mF306363B2FB399C363ADD2D44E121EE2ED29BB3E (String_t* ___0_json, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*);

	char* ____0_json_marshaled = NULL;
	____0_json_marshaled = il2cpp_codegen_marshal_string(___0_json);

	reinterpret_cast<PInvokeFunc>(rx_createFeedback)(____0_json_marshaled);

	il2cpp_codegen_marshal_free(____0_json_marshaled);
	____0_json_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL_rx_satisfactionEvaluation_mC65EFFD5D1A4C2EA74E37D1714AF0F43B43F9797 (String_t* ___0_json, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*);

	char* ____0_json_marshaled = NULL;
	____0_json_marshaled = il2cpp_codegen_marshal_string(___0_json);

	reinterpret_cast<PInvokeFunc>(rx_satisfactionEvaluation)(____0_json_marshaled);

	il2cpp_codegen_marshal_free(____0_json_marshaled);
	____0_json_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackWebGL__ctor_m00C74886071921D50C32A9A86A7DD81CC72438C4 (RXFeedbackWebGL_t88FA1F8477013BB2D5B2347B8002D7580023A87B* __this, const RuntimeMethod* method) 
{
	{
		JsCallBackHandlerBase__ctor_m173173C9EFB47A00770DDA05141901BB18E85FB9(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
