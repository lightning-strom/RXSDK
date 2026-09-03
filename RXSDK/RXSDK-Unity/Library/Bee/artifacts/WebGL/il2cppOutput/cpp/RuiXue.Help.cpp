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

struct Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710;
struct IEqualityComparer_1_tAE94C8F24AD5B94D4EE85CA9FC59E3409D41CAF7;
struct KeyCollection_tE66790F09E854C19C7F612BEAD203AE626E90A36;
struct ValueCollection_tC9D91E8A3198E40EA339059703AB10DFC9F5CC2E;
struct EntryU5BU5D_t233BB24ED01E2D8D65B0651D54B8E3AD125CAF96;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IRXHelp_t17823D4377ECEAF178653955F710BB4937FDB0D0;
struct MethodInfo_t;
struct RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXHelp_t17823D4377ECEAF178653955F710BB4937FDB0D0_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral0407368945FB50CC029096B68ACB46F37680E3FC;
IL2CPP_EXTERN_C String_t* _stringLiteralE6A662FEC1D1B7294691975FFC4BA6FE7B7074D3;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t3925DE7283474EABCD4A26608EFEA74A59E5B9A9 
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
struct RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE  : public RuntimeObject
{
};
struct RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0  : public RuntimeObject
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
struct RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_StaticFields
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXHelpNotSupport__ctor_m90213A954CA5AA4A06803B200C6C829DB917D884 (RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXHelp_HelperCenterUI_m33A0984B25C927D3FE1FA4AC77CD303C194A9674 (Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_responseDelegate, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_errorDelegate, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXHelp_t17823D4377ECEAF178653955F710BB4937FDB0D0_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_StaticFields*)il2cpp_codegen_static_fields_for(RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var))->____sdk;
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_1 = ___0_dic;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_responseDelegate;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_errorDelegate;
		InterfaceActionInvoker3< Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(0, IRXHelp_t17823D4377ECEAF178653955F710BB4937FDB0D0_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXHelp_ChatServiceUI_mCAE8E8A6C2D3C842DA6586785AD0A2DF1B8D420A (Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_responseDelegate, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_errorDelegate, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXHelp_t17823D4377ECEAF178653955F710BB4937FDB0D0_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_StaticFields*)il2cpp_codegen_static_fields_for(RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var))->____sdk;
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_1 = ___0_dic;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_responseDelegate;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_errorDelegate;
		InterfaceActionInvoker3< Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(1, IRXHelp_t17823D4377ECEAF178653955F710BB4937FDB0D0_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXHelp__cctor_m40F77F4ACF86A6E542D223CD47E58E7537612FA4 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0* L_0 = (RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0*)il2cpp_codegen_object_new(RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0_il2cpp_TypeInfo_var);
		RXHelpNotSupport__ctor_m90213A954CA5AA4A06803B200C6C829DB917D884(L_0, NULL);
		((RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_StaticFields*)il2cpp_codegen_static_fields_for(RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_StaticFields*)il2cpp_codegen_static_fields_for(RXHelp_t35202256DF7E1D74DADB79AE5F41103071D83FEE_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXHelpNotSupport_HelperCenterUI_mA50B763DD01CF407DA43FCF1DDC2E6B64A563515 (RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_responseDelegate, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_errorDelegate, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral0407368945FB50CC029096B68ACB46F37680E3FC);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral0407368945FB50CC029096B68ACB46F37680E3FC, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXHelpNotSupport_ChatServiceUI_m54870018C34E86B084C4C7A422FBBA07DADFC466 (RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_responseDelegate, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_errorDelegate, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralE6A662FEC1D1B7294691975FFC4BA6FE7B7074D3);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralE6A662FEC1D1B7294691975FFC4BA6FE7B7074D3, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXHelpNotSupport__ctor_m90213A954CA5AA4A06803B200C6C829DB917D884 (RXHelpNotSupport_t96C451BA138601B866EFC05CF548062C318AE8E0* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
