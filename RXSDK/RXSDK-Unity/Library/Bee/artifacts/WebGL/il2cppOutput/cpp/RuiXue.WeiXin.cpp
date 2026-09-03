#include "pch-cpp.hpp"

#ifndef _MSC_VER
# include <alloca.h>
#else
# include <malloc.h>
#endif


#include <limits>


template <typename R>
struct InterfaceFuncInvoker0
{
	typedef R (*Func)(void*, const RuntimeMethod*);

	static inline R Invoke (Il2CppMethodSlot slot, RuntimeClass* declaringInterface, RuntimeObject* obj)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_interface_invoke_data(slot, obj, declaringInterface);
		return ((Func)invokeData.methodPtr)(obj, invokeData.method);
	}
};
template <typename R, typename T1, typename T2, typename T3>
struct InterfaceFuncInvoker3
{
	typedef R (*Func)(void*, T1, T2, T3, const RuntimeMethod*);

	static inline R Invoke (Il2CppMethodSlot slot, RuntimeClass* declaringInterface, RuntimeObject* obj, T1 p1, T2 p2, T3 p3)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_interface_invoke_data(slot, obj, declaringInterface);
		return ((Func)invokeData.methodPtr)(obj, p1, p2, p3, invokeData.method);
	}
};

struct Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710;
struct IEqualityComparer_1_tAE94C8F24AD5B94D4EE85CA9FC59E3409D41CAF7;
struct KeyCollection_tE66790F09E854C19C7F612BEAD203AE626E90A36;
struct ValueCollection_tC9D91E8A3198E40EA339059703AB10DFC9F5CC2E;
struct EntryU5BU5D_t233BB24ED01E2D8D65B0651D54B8E3AD125CAF96;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393;
struct MethodInfo_t;
struct RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral893625257D4C9F914EA9558C72B6699A95518379;
IL2CPP_EXTERN_C String_t* _stringLiteralA89BF627F53504DEA7509E6DC7585BAB396F8F28;
IL2CPP_EXTERN_C String_t* _stringLiteralAA1D13B6063D5FA4DF06DEA5A1444912F706956A;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t673D1FAF22C5EC187260347C769A5496DE7A78C1 
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
struct RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7  : public RuntimeObject
{
};
struct RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA  : public RuntimeObject
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
struct Boolean_t09A6377A54BE2F9E6985A8149F19234FD7DDFE22 
{
	bool ___m_value;
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
struct RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_StaticFields
{
	RuntimeObject* ____sdk;
};
struct String_t_StaticFields
{
	String_t* ___Empty;
};
struct Boolean_t09A6377A54BE2F9E6985A8149F19234FD7DDFE22_StaticFields
{
	String_t* ___TrueString;
	String_t* ___FalseString;
};
#ifdef __clang__
#pragma clang diagnostic pop
#endif



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXWeiXinNotSupport__ctor_mBF704870320D63B0535D1EC9AC413EFC48E9ACC0 (RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9 (String_t* ___0_funcName, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2 (RuntimeObject* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXWeiXin_IsWXAppInstalled_m9026CCCB0FC736BAC4B0417E9A3E71FEEBB90060 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_StaticFields*)il2cpp_codegen_static_fields_for(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var))->____sdk;
		bool L_1;
		L_1 = InterfaceFuncInvoker0< bool >::Invoke(0, IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXWeiXin_OpenWXApp_m5F9B12AF91CC1148130F21E3B9C203F630D5F1F5 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_StaticFields*)il2cpp_codegen_static_fields_for(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var))->____sdk;
		bool L_1;
		L_1 = InterfaceFuncInvoker0< bool >::Invoke(1, IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXWeiXin_OpenMiniProgram_m0A5C02C319E219194D61F11B7F1356A04DE9C36A (Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_hashMap, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_StaticFields*)il2cpp_codegen_static_fields_for(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var))->____sdk;
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_1 = ___0_hashMap;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		bool L_4;
		L_4 = InterfaceFuncInvoker3< bool, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(2, IRXWeiXin_t836C0F3724409C6B62B61C040D3CC330D4B54393_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return L_4;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXWeiXin__cctor_m337E8A20BAB99E5795B650A03909792CE59DA1D3 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA* L_0 = (RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA*)il2cpp_codegen_object_new(RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA_il2cpp_TypeInfo_var);
		RXWeiXinNotSupport__ctor_mBF704870320D63B0535D1EC9AC413EFC48E9ACC0(L_0, NULL);
		((RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_StaticFields*)il2cpp_codegen_static_fields_for(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_StaticFields*)il2cpp_codegen_static_fields_for(RXWeiXin_t87DC3AED7FD926B6D24C4D07121A7E0BF8CFF7A7_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXWeiXinNotSupport_IsWXAppInstalled_m85BEF315DD011563BCDE4B06CCBA708DA60FC593 (RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralA89BF627F53504DEA7509E6DC7585BAB396F8F28);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralA89BF627F53504DEA7509E6DC7585BAB396F8F28, NULL);
		return (bool)0;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXWeiXinNotSupport_OpenWXApp_mE7FF951CFCA584A72113C9087B5C1B16F6483C0B (RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralAA1D13B6063D5FA4DF06DEA5A1444912F706956A);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralAA1D13B6063D5FA4DF06DEA5A1444912F706956A, NULL);
		return (bool)0;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXWeiXinNotSupport_OpenMiniProgram_m5C9E8895C54D8302ED39A1CE6B29EB6EDC6BF61B (RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_hashMap, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral893625257D4C9F914EA9558C72B6699A95518379);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral893625257D4C9F914EA9558C72B6699A95518379, NULL);
		return (bool)0;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXWeiXinNotSupport__ctor_mBF704870320D63B0535D1EC9AC413EFC48E9ACC0 (RXWeiXinNotSupport_t8216E531D9B95595A816CA92DAE9A0340921A6CA* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
