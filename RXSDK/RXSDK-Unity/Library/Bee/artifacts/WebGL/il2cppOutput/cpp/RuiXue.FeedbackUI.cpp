#include "pch-cpp.hpp"

#ifndef _MSC_VER
# include <alloca.h>
#else
# include <malloc.h>
#endif


#include <limits>


struct InterfaceActionInvoker0
{
	typedef void (*Action)(void*, const RuntimeMethod*);

	static inline void Invoke (Il2CppMethodSlot slot, RuntimeClass* declaringInterface, RuntimeObject* obj)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_interface_invoke_data(slot, obj, declaringInterface);
		((Action)invokeData.methodPtr)(obj, invokeData.method);
	}
};

struct IntPtrU5BU5D_tFD177F8C806A6921AD7150264CCC62FA00CAD832;
struct StackTraceU5BU5D_t32FBCB20930EAF5BAE3F450FF75228E5450DA0DF;
struct IDictionary_t6D03155AF1FA9083817AA5B6AD7DEEACC26AB220;
struct IRXFeedbackUI_tA8C506D266DB09F21C090C6DEFCEE47C6721EE45;
struct NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8;
struct RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE;
struct SafeSerializationManager_tCBB85B95DFD1634237140CD892E82D06ECB3F5E6;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXFeedbackUI_tA8C506D266DB09F21C090C6DEFCEE47C6721EE45_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C const RuntimeMethod* RXFeedbackUINotSupport_ShowCreateFeedbackView_m7488CD5184220964D6129B2103D627FA5005F055_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* RXFeedbackUINotSupport_ShowFeedbackListView_mECA6CF9CD10773A3CBD2FE9525B6CBA47BD5E649_RuntimeMethod_var;
struct Exception_t_marshaled_com;
struct Exception_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t3661322747A005E61593A59A847E52D49A4E4986 
{
};
struct RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB  : public RuntimeObject
{
};
struct RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE  : public RuntimeObject
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
struct RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_StaticFields
{
	RuntimeObject* ____sdk;
};
#ifdef __clang__
#pragma clang diagnostic pop
#endif



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackUINotSupport__ctor_mCEF21940C2546D9217C95B309E3BC92E3EBE1A78 (RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackUI_ShowCreateFeedbackView_mBF0B3F1F5B34A421F7E26DE11797ECDE5D3DB68E (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXFeedbackUI_tA8C506D266DB09F21C090C6DEFCEE47C6721EE45_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var))->____sdk;
		InterfaceActionInvoker0::Invoke(0, IRXFeedbackUI_tA8C506D266DB09F21C090C6DEFCEE47C6721EE45_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackUI_ShowFeedbackListView_m825487A702982D2D5BDFED0B0430058265C4F4D5 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXFeedbackUI_tA8C506D266DB09F21C090C6DEFCEE47C6721EE45_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var))->____sdk;
		InterfaceActionInvoker0::Invoke(1, IRXFeedbackUI_tA8C506D266DB09F21C090C6DEFCEE47C6721EE45_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackUI__cctor_m8C44115FCFC5ECCD77ECFE7EDF9293EAC81F5B66 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE* L_0 = (RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE*)il2cpp_codegen_object_new(RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE_il2cpp_TypeInfo_var);
		RXFeedbackUINotSupport__ctor_mCEF21940C2546D9217C95B309E3BC92E3EBE1A78(L_0, NULL);
		((RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_StaticFields*)il2cpp_codegen_static_fields_for(RXFeedbackUI_t51C32D654536B4C61F66F491A19498F47B4AABEB_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackUINotSupport_ShowCreateFeedbackView_m7488CD5184220964D6129B2103D627FA5005F055 (RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE* __this, const RuntimeMethod* method) 
{
	{
		NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8* L_0 = (NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8*)il2cpp_codegen_object_new(((RuntimeClass*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var)));
		NotImplementedException__ctor_mDAB47BC6BD0E342E8F2171E5CABE3E67EA049F1C(L_0, NULL);
		IL2CPP_RAISE_MANAGED_EXCEPTION(L_0, ((RuntimeMethod*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&RXFeedbackUINotSupport_ShowCreateFeedbackView_m7488CD5184220964D6129B2103D627FA5005F055_RuntimeMethod_var)));
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackUINotSupport_ShowFeedbackListView_mECA6CF9CD10773A3CBD2FE9525B6CBA47BD5E649 (RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE* __this, const RuntimeMethod* method) 
{
	{
		NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8* L_0 = (NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8*)il2cpp_codegen_object_new(((RuntimeClass*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&NotImplementedException_t6366FE4DCF15094C51F4833B91A2AE68D4DA90E8_il2cpp_TypeInfo_var)));
		NotImplementedException__ctor_mDAB47BC6BD0E342E8F2171E5CABE3E67EA049F1C(L_0, NULL);
		IL2CPP_RAISE_MANAGED_EXCEPTION(L_0, ((RuntimeMethod*)il2cpp_codegen_initialize_runtime_metadata_inline((uintptr_t*)&RXFeedbackUINotSupport_ShowFeedbackListView_mECA6CF9CD10773A3CBD2FE9525B6CBA47BD5E649_RuntimeMethod_var)));
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXFeedbackUINotSupport__ctor_mCEF21940C2546D9217C95B309E3BC92E3EBE1A78 (RXFeedbackUINotSupport_tAB2053BFAEDE8D51FDDA775B42FD3C36F81313AE* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
