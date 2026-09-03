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

struct IRXBytedance_t9CBA45F264C5B21A60CBD8BCB99A838C7D84C96E;

IL2CPP_EXTERN_C RuntimeClass* IRXBytedance_t9CBA45F264C5B21A60CBD8BCB99A838C7D84C96E_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXBytedance_t31204877478170197F39213BF331555BC6ACDE9D_il2cpp_TypeInfo_var;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t5B4C5BD313AD986E004785BEF9E29D05CFF80800 
{
};
struct RXBytedance_t31204877478170197F39213BF331555BC6ACDE9D  : public RuntimeObject
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
struct RXBytedance_t31204877478170197F39213BF331555BC6ACDE9D_StaticFields
{
	RuntimeObject* ____sdk;
};
#ifdef __clang__
#pragma clang diagnostic pop
#endif



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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXBytedance_SetContext_m57CDFB1B4275EF5B3F6E5BBD567DA60F67B3BC06 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXBytedance_t9CBA45F264C5B21A60CBD8BCB99A838C7D84C96E_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXBytedance_t31204877478170197F39213BF331555BC6ACDE9D_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	RuntimeObject* G_B2_0 = NULL;
	RuntimeObject* G_B1_0 = NULL;
	{
		RuntimeObject* L_0 = ((RXBytedance_t31204877478170197F39213BF331555BC6ACDE9D_StaticFields*)il2cpp_codegen_static_fields_for(RXBytedance_t31204877478170197F39213BF331555BC6ACDE9D_il2cpp_TypeInfo_var))->____sdk;
		RuntimeObject* L_1 = L_0;
		if (L_1)
		{
			G_B2_0 = L_1;
			goto IL_000a;
		}
		G_B1_0 = L_1;
	}
	{
		return;
	}

IL_000a:
	{
		NullCheck(G_B2_0);
		InterfaceActionInvoker0::Invoke(0, IRXBytedance_t9CBA45F264C5B21A60CBD8BCB99A838C7D84C96E_il2cpp_TypeInfo_var, G_B2_0);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
