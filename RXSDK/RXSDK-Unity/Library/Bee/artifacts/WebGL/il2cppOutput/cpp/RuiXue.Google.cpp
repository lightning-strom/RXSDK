#include "pch-cpp.hpp"

#ifndef _MSC_VER
# include <alloca.h>
#else
# include <malloc.h>
#endif


#include <limits>


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

struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IRXGoogle_tA79DE850A01271A42BCB14D77987F4BC66AB2800;
struct MethodInfo_t;
struct RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXGoogle_tA79DE850A01271A42BCB14D77987F4BC66AB2800_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteralCDB119796C4F37148EEC3969851F2E795A27213C;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t833461B1588E66891CB3CDC26ADA0E2F5630AE9D 
{
};
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD  : public RuntimeObject
{
	StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* ____items;
	int32_t ____size;
	int32_t ____version;
	RuntimeObject* ____syncRoot;
};
struct RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0  : public RuntimeObject
{
};
struct RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F  : public RuntimeObject
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
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD_StaticFields
{
	StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* ___s_emptyArray;
};
struct RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_StaticFields
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXGoogleNotSupport__ctor_m00563AC04F7D07F2F3C4988194BEC4684531EC9B (RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXGoogle_QueryProductDetailsAsync_m902475F359EC5829DFFBE07CB28F0A27AA277F72 (List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* ___0_skusList, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_errorDelegate, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXGoogle_tA79DE850A01271A42BCB14D77987F4BC66AB2800_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_StaticFields*)il2cpp_codegen_static_fields_for(RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_il2cpp_TypeInfo_var))->____sdk;
		List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* L_1 = ___0_skusList;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_errorDelegate;
		InterfaceActionInvoker3< List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(0, IRXGoogle_tA79DE850A01271A42BCB14D77987F4BC66AB2800_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXGoogle__cctor_m176CE953E4750DADE4B1EB2F8D64E8787C0406F7 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F* L_0 = (RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F*)il2cpp_codegen_object_new(RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F_il2cpp_TypeInfo_var);
		RXGoogleNotSupport__ctor_m00563AC04F7D07F2F3C4988194BEC4684531EC9B(L_0, NULL);
		((RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_StaticFields*)il2cpp_codegen_static_fields_for(RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_StaticFields*)il2cpp_codegen_static_fields_for(RXGoogle_t4417FD85F26E99B79AED6430304C54B1554A9FF0_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXGoogleNotSupport_QueryProductDetailsAsync_mD2E744BB3DBE4EFEA0AC514B10475F168204E7F4 (RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F* __this, List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* ___0_skusList, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_errorDelegate, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralCDB119796C4F37148EEC3969851F2E795A27213C);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralCDB119796C4F37148EEC3969851F2E795A27213C, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXGoogleNotSupport__ctor_m00563AC04F7D07F2F3C4988194BEC4684531EC9B (RXGoogleNotSupport_tBF72019FEE0C3C35AA3218775EAC300CFDBD552F* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
