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

struct IntPtrU5BU5D_tFD177F8C806A6921AD7150264CCC62FA00CAD832;
struct StackTraceU5BU5D_t32FBCB20930EAF5BAE3F450FF75228E5450DA0DF;
struct IDictionary_t6D03155AF1FA9083817AA5B6AD7DEEACC26AB220;
struct IRXOaidv2_t2C8C826ACA6C1502582C1CB0400902FC01586515;
struct NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8;
struct RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823;
struct SafeSerializationManager_tCBB85B95DFD1634237140CD892E82D06ECB3F5E6;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXOaidv2_t2C8C826ACA6C1502582C1CB0400902FC01586515_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C const RuntimeMethod* RXOaidv2NotSupport_GetOAID_m9548F1499CEEB56E1612306DDAD25A71AFB27293_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* RXOaidv2NotSupport_IsSupport_mD7998878D057A8B2AF1EF85353E4892945B68C3C_RuntimeMethod_var;
struct Exception_t_marshaled_com;
struct Exception_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t10C148FFFFBD75F024E5287E6FE8F2F91F9E0ECC 
{
};
struct RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A  : public RuntimeObject
{
};
struct RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823  : public RuntimeObject
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
struct SystemException_tCC48D868298F4C0705279823E34B00F4FBDB7295  : public Exception_t
{
};
struct NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8  : public SystemException_tCC48D868298F4C0705279823E34B00F4FBDB7295
{
};
struct RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_StaticFields
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXOaidv2NotSupport__ctor_mE06C3CA8514C0025F2332E65848FB7479E517A40 (RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXOaidv2_IsSupport_m6478075A4C7EF2A3B1E5D7FB94ED0ED94FC54D6B (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXOaidv2_t2C8C826ACA6C1502582C1CB0400902FC01586515_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_StaticFields*)il2cpp_codegen_static_fields_for(RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		bool L_1;
		L_1 = InterfaceFuncInvoker0< bool >::Invoke(0, IRXOaidv2_t2C8C826ACA6C1502582C1CB0400902FC01586515_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXOaidv2_GetOAID_m04553FA7A049906C170A9BEE4A5A61858C5F4608 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXOaidv2_t2C8C826ACA6C1502582C1CB0400902FC01586515_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_StaticFields*)il2cpp_codegen_static_fields_for(RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		String_t* L_1;
		L_1 = InterfaceFuncInvoker0< String_t* >::Invoke(1, IRXOaidv2_t2C8C826ACA6C1502582C1CB0400902FC01586515_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXOaidv2__cctor_mB2F31E1ABCF129085A025CCBD7004F7D15D1EF76 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823* L_0 = (RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823*)il2cpp_codegen_object_new(RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823_il2cpp_TypeInfo_var);
		RXOaidv2NotSupport__ctor_mE06C3CA8514C0025F2332E65848FB7479E517A40(L_0, NULL);
		((RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_StaticFields*)il2cpp_codegen_static_fields_for(RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_StaticFields*)il2cpp_codegen_static_fields_for(RXOaidv2_t5CDE0A995E7A367E1CD4D714C3662FAD9BA7A41A_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXOaidv2NotSupport_IsSupport_mD7998878D057A8B2AF1EF85353E4892945B68C3C (RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823* __this, const RuntimeMethod* method) 
{
	{
		NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8* L_0 = (NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8*)il2cpp_codegen_object_new(((RuntimeClass*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var)));
		NotImplementedException__ctor_mDAB47BC6BD0E342E8F2171E5CABE3E67EA049F1C(L_0, NULL);
		IL2CPP_RAISE_MANAGED_EXCEPTION(L_0, ((RuntimeMethod*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&RXOaidv2NotSupport_IsSupport_mD7998878D057A8B2AF1EF85353E4892945B68C3C_RuntimeMethod_var)));
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXOaidv2NotSupport_GetOAID_m9548F1499CEEB56E1612306DDAD25A71AFB27293 (RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823* __this, const RuntimeMethod* method) 
{
	{
		NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8* L_0 = (NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8*)il2cpp_codegen_object_new(((RuntimeClass*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var)));
		NotImplementedException__ctor_mDAB47BC6BD0E342E8F2171E5CABE3E67EA049F1C(L_0, NULL);
		IL2CPP_RAISE_MANAGED_EXCEPTION(L_0, ((RuntimeMethod*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&RXOaidv2NotSupport_GetOAID_m9548F1499CEEB56E1612306DDAD25A71AFB27293_RuntimeMethod_var)));
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXOaidv2NotSupport__ctor_mE06C3CA8514C0025F2332E65848FB7479E517A40 (RXOaidv2NotSupport_t215004F1B056A6490AA0C05225DE82145CDBF823* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
