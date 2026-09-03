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

struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IRXLegal_t29E5C7059CEDDD82978DA35B3B78C44674185A7F;
struct MethodInfo_t;
struct RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXLegal_t29E5C7059CEDDD82978DA35B3B78C44674185A7F_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteralBA73F9322A20E62351A6FF31AE4168DBF28270A3;
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
struct RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0  : public RuntimeObject
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
struct RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_StaticFields
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalNotSupport__ctor_m6B2D23C4934E3F3BE6B333083DB893CFD18FCCD2 (RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0* __this, const RuntimeMethod* method) ;
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
		InterfaceActionInvoker2< RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(0, IRXLegal_t29E5C7059CEDDD82978DA35B3B78C44674185A7F_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegal__cctor_m1B3E99619A017A959BAF35CAFEB2E4B3C5BC34A6 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXLegal_t911181443E8A01B6B3D85639D576CAC3E4427624_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0* L_0 = (RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0*)il2cpp_codegen_object_new(RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0_il2cpp_TypeInfo_var);
		RXLegalNotSupport__ctor_m6B2D23C4934E3F3BE6B333083DB893CFD18FCCD2(L_0, NULL);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalNotSupport_Legal_m5B5848D4A2685B04325EB343A0319E63EABF82FE (RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0* __this, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralBA73F9322A20E62351A6FF31AE4168DBF28270A3);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralBA73F9322A20E62351A6FF31AE4168DBF28270A3, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXLegalNotSupport__ctor_m6B2D23C4934E3F3BE6B333083DB893CFD18FCCD2 (RXLegalNotSupport_t91A2D471F93F16AC73D8F9C45BCB48F4F56798B0* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
