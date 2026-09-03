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
struct IntPtrU5BU5D_tFD177F8C806A6921AD7150264CCC62FA00CAD832;
struct StackTraceU5BU5D_t32FBCB20930EAF5BAE3F450FF75228E5450DA0DF;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IDictionary_t6D03155AF1FA9083817AA5B6AD7DEEACC26AB220;
struct IRXQuick_t7CD53A880C453B80D6E101BDDFD7A1C83175CFC1;
struct MethodInfo_t;
struct NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8;
struct RXGameRoleInfo_tD5E712E264C08E03DD41986EE6C04EAA884DAA1C;
struct RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct SafeSerializationManager_tCBB85B95DFD1634237140CD892E82D06ECB3F5E6;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXQuick_t7CD53A880C453B80D6E101BDDFD7A1C83175CFC1_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C const RuntimeMethod* RXQuickWrapperNotSupport_SetGameRoleInfo_m5B9C5FFD7AFA89B79012DC793E3DD819A165F680_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* RXQuickWrapperNotSupport_VerifyRealName_m1FF059495610AC32CE444D6A30F0EB30CF1DF7DE_RuntimeMethod_var;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;
struct Exception_t_marshaled_com;
struct Exception_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_tF048A9A37505EB75070395A2F64CCC39B4592CF4 
{
};
struct RXGameRoleInfo_tD5E712E264C08E03DD41986EE6C04EAA884DAA1C  : public RuntimeObject
{
	String_t* ___serverID;
	String_t* ___serverName;
	String_t* ___gameRoleName;
	String_t* ___gameRoleID;
	String_t* ___gameUserLevel;
	String_t* ___vipLevel;
	String_t* ___gameBalance;
	String_t* ___partyName;
	String_t* ___roleCreateTime;
	String_t* ___partyId;
	String_t* ___gameRoleGender;
	String_t* ___gameRolePower;
	String_t* ___partyRoleId;
	String_t* ___partyRoleName;
	String_t* ___professionId;
	String_t* ___profession;
	String_t* ___friendlist;
};
struct RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5  : public RuntimeObject
{
};
struct RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786  : public RuntimeObject
{
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
struct Exception_t  : public RuntimeObject
{
	String_t* ____className;
	String_t* ____message;
	RuntimeObject* ____data;
	Exception_t* ____innerException;
	String_t* ____helpURL;
	RuntimeObject* ____stackTrace;
	String_t* ____stackTraceString;
	String_t* ____remoteStackTraceString;
	int32_t ____remoteStackIndex;
	RuntimeObject* ____dynamicMethods;
	int32_t ____HResult;
	String_t* ____source;
	SafeSerializationManager_tCBB85B95DFD1634237140CD892E82D06ECB3F5E6* ____safeSerializationManager;
	StackTraceU5BU5D_t32FBCB20930EAF5BAE3F450FF75228E5450DA0DF* ___captured_traces;
	IntPtrU5BU5D_tFD177F8C806A6921AD7150264CCC62FA00CAD832* ___native_trace_ips;
	int32_t ___caught_in_unmanaged;
};
struct Exception_t_marshaled_pinvoke
{
	char* ____className;
	char* ____message;
	RuntimeObject* ____data;
	Exception_t_marshaled_pinvoke* ____innerException;
	char* ____helpURL;
	Il2CppIUnknown* ____stackTrace;
	char* ____stackTraceString;
	char* ____remoteStackTraceString;
	int32_t ____remoteStackIndex;
	Il2CppIUnknown* ____dynamicMethods;
	int32_t ____HResult;
	char* ____source;
	SafeSerializationManager_tCBB85B95DFD1634237140CD892E82D06ECB3F5E6* ____safeSerializationManager;
	StackTraceU5BU5D_t32FBCB20930EAF5BAE3F450FF75228E5450DA0DF* ___captured_traces;
	Il2CppSafeArray* ___native_trace_ips;
	int32_t ___caught_in_unmanaged;
};
struct Exception_t_marshaled_com
{
	Il2CppChar* ____className;
	Il2CppChar* ____message;
	RuntimeObject* ____data;
	Exception_t_marshaled_com* ____innerException;
	Il2CppChar* ____helpURL;
	Il2CppIUnknown* ____stackTrace;
	Il2CppChar* ____stackTraceString;
	Il2CppChar* ____remoteStackTraceString;
	int32_t ____remoteStackIndex;
	Il2CppIUnknown* ____dynamicMethods;
	int32_t ____HResult;
	Il2CppChar* ____source;
	SafeSerializationManager_tCBB85B95DFD1634237140CD892E82D06ECB3F5E6* ____safeSerializationManager;
	StackTraceU5BU5D_t32FBCB20930EAF5BAE3F450FF75228E5450DA0DF* ___captured_traces;
	Il2CppSafeArray* ___native_trace_ips;
	int32_t ___caught_in_unmanaged;
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
struct SystemException_tCC48D868298F4C0705279823E34B00F4FBDB7295  : public Exception_t
{
};
struct NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8  : public SystemException_tCC48D868298F4C0705279823E34B00F4FBDB7295
{
};
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3  : public MulticastDelegate_t
{
};
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113  : public MulticastDelegate_t
{
};
struct RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_StaticFields
{
	RuntimeObject* ____sdk;
};
struct Boolean_t09A6377A54BE2F9E6985A8149F19234FD7DDFE22_StaticFields
{
	String_t* ___TrueString;
	String_t* ___FalseString;
};
#ifdef __clang__
#pragma clang diagnostic pop
#endif



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXQuickWrapperNotSupport__ctor_mBC83A03C66EBE0955732436923F93F77C6384C76 (RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void NotImplementedException__ctor_mDAB47BC6BD0E342E8F2171E5CABE3E67EA049F1C (NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXQuickWrapper_SetGameRoleInfo_mFAE7E591DC9611D102CB72F2C33E89300AE7770E (RXGameRoleInfo_tD5E712E264C08E03DD41986EE6C04EAA884DAA1C* ___0_rxGameRoleInfo, bool ___1_createRole, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXQuick_t7CD53A880C453B80D6E101BDDFD7A1C83175CFC1_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_StaticFields*)il2cpp_codegen_static_fields_for(RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var))->____sdk;
		RXGameRoleInfo_tD5E712E264C08E03DD41986EE6C04EAA884DAA1C* L_1 = ___0_rxGameRoleInfo;
		bool L_2 = ___1_createRole;
		NullCheck(L_0);
		InterfaceActionInvoker2< RXGameRoleInfo_tD5E712E264C08E03DD41986EE6C04EAA884DAA1C*, bool >::Invoke(0, IRXQuick_t7CD53A880C453B80D6E101BDDFD7A1C83175CFC1_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXQuickWrapper_VerifyRealName_mA1214B1A923D0D507766B00D1DF7EF44703C94BB (RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_responseDelegate, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_errorDelegate, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXQuick_t7CD53A880C453B80D6E101BDDFD7A1C83175CFC1_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_StaticFields*)il2cpp_codegen_static_fields_for(RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var))->____sdk;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_1 = ___0_responseDelegate;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_2 = ___1_errorDelegate;
		NullCheck(L_0);
		InterfaceActionInvoker2< RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(1, IRXQuick_t7CD53A880C453B80D6E101BDDFD7A1C83175CFC1_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXQuickWrapper__cctor_m7C581A8937CB68B3D8C24860F4002B1FC7335DDF (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786* L_0 = (RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786*)il2cpp_codegen_object_new(RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786_il2cpp_TypeInfo_var);
		RXQuickWrapperNotSupport__ctor_mBC83A03C66EBE0955732436923F93F77C6384C76(L_0, NULL);
		((RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_StaticFields*)il2cpp_codegen_static_fields_for(RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_StaticFields*)il2cpp_codegen_static_fields_for(RXQuickWrapper_t85A15076FBFAD168CE31F46F2539C95C43542EA5_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXQuickWrapperNotSupport_SetGameRoleInfo_m5B9C5FFD7AFA89B79012DC793E3DD819A165F680 (RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786* __this, RXGameRoleInfo_tD5E712E264C08E03DD41986EE6C04EAA884DAA1C* ___0_rxGameRoleInfo, bool ___1_createRole, const RuntimeMethod* method) 
{
	{
		NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8* L_0 = (NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8*)il2cpp_codegen_object_new(((RuntimeClass*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var)));
		NotImplementedException__ctor_mDAB47BC6BD0E342E8F2171E5CABE3E67EA049F1C(L_0, NULL);
		IL2CPP_RAISE_MANAGED_EXCEPTION(L_0, ((RuntimeMethod*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&RXQuickWrapperNotSupport_SetGameRoleInfo_m5B9C5FFD7AFA89B79012DC793E3DD819A165F680_RuntimeMethod_var)));
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXQuickWrapperNotSupport_VerifyRealName_m1FF059495610AC32CE444D6A30F0EB30CF1DF7DE (RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786* __this, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___0_responseDelegate, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___1_errorDelegate, const RuntimeMethod* method) 
{
	{
		NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8* L_0 = (NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8*)il2cpp_codegen_object_new(((RuntimeClass*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var)));
		NotImplementedException__ctor_mDAB47BC6BD0E342E8F2171E5CABE3E67EA049F1C(L_0, NULL);
		IL2CPP_RAISE_MANAGED_EXCEPTION(L_0, ((RuntimeMethod*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&RXQuickWrapperNotSupport_VerifyRealName_m1FF059495610AC32CE444D6A30F0EB30CF1DF7DE_RuntimeMethod_var)));
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXQuickWrapperNotSupport__ctor_mBC83A03C66EBE0955732436923F93F77C6384C76 (RXQuickWrapperNotSupport_t651A0C396DFF3490FE93A2F8DCF8526D75301786* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXGameRoleInfo__ctor_m22BA93CCFE036A1A1601B4CB595F46F39FB3476A (RXGameRoleInfo_tD5E712E264C08E03DD41986EE6C04EAA884DAA1C* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
