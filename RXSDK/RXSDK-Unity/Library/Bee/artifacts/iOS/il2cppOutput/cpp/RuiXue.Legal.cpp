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

struct Dictionary_2_tAFFFC9BCDC0E8601FDB252CD80C438376B1177C6;
struct Dictionary_2_tCABF29E2E992CA896E7F85C3E8A7647AD903AC2A;
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct CancellationTokenSource_tAAE1E0033BCFC233801F8CB4CED5C852B350CB7B;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727;
struct IRXLegal_t29E5C7059CEDDD82978DA35B3B78C44674185A7F;
struct MethodInfo_t;
struct RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* IRXLegal_t29E5C7059CEDDD82978DA35B3B78C44674185A7F_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral4516BB55CB54A5709EC94B97CCFA9E0626AABB21;
IL2CPP_EXTERN_C const RuntimeMethod* RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t2FE28FFDD2177402605C2F529497074ED6E394D9 
{
};
struct RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624  : public RuntimeObject
{
};
struct RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5  : public RuntimeObject
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
struct RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_StaticFields
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalIOS__ctor_m9104B44F76F8ADBF5DEFFCB7EF9A810EE3F97936 (RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1 (String_t* ___0_func, IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 ___1_wrapper, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60 (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalIOS_getLegalInfo_m09FF753378E44CE10C6775D5FC940B8D3305F060 (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___0_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2 (RuntimeObject* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C void DEFAULT_CALL getLegalInfo(Il2CppMethodPointer, Il2CppMethodPointer);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegal_Legal_m9E565B2A71D1DCDDD48AB1064CA3167E78C1B5C9 (RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXLegal_t29E5C7059CEDDD82978DA35B3B78C44674185A7F_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_StaticFields*)il2cpp_codegen_static_fields_for(RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var))->____sdk;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_1 = ___0_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_2 = ___1_onError;
		NullCheck(L_0);
		InterfaceActionInvoker2< RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(0, IRXLegal_t29E5C7059CEDDD82978DA35B3B78C44674185A7F_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegal__cctor_m1B3E99619A017A959BAF35CAFEB2E4B3C5BC34A6 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5* L_0 = (RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5*)il2cpp_codegen_object_new(RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5_il2cpp_TypeInfo_var);
		RXLegalIOS__ctor_m9104B44F76F8ADBF5DEFFCB7EF9A810EE3F97936(L_0, NULL);
		((RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_StaticFields*)il2cpp_codegen_static_fields_for(RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_StaticFields*)il2cpp_codegen_static_fields_for(RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalIOS_Legal_m77619FD2B19C3488D2192C3C84AAEE7C0E43914D (RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5* __this, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral4516BB55CB54A5709EC94B97CCFA9E0626AABB21);
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
		RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1(_stringLiteral4516BB55CB54A5709EC94B97CCFA9E0626AABB21, L_2, NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_3 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_3, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var), NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_4 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_4, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var), NULL);
		RXLegalIOS_getLegalInfo_m09FF753378E44CE10C6775D5FC940B8D3305F060(L_3, L_4, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalIOS_getLegalInfo_m09FF753378E44CE10C6775D5FC940B8D3305F060 (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___0_onSuccess, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_onError, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (Il2CppMethodPointer, Il2CppMethodPointer);

	Il2CppMethodPointer ____0_onSuccess_marshaled = NULL;
	____0_onSuccess_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___0_onSuccess));

	Il2CppMethodPointer ____1_onError_marshaled = NULL;
	____1_onError_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___1_onError));

	reinterpret_cast<PInvokeFunc>(getLegalInfo)(____0_onSuccess_marshaled, ____1_onError_marshaled);

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalIOS__ctor_m9104B44F76F8ADBF5DEFFCB7EF9A810EE3F97936 (RXLegalIOS_tDD95D4100E1BBAA848BC12B036EE058C1A4D72A5* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
