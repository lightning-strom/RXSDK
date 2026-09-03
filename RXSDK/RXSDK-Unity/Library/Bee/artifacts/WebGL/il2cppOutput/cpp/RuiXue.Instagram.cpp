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

struct IRInstagram_t64E7C903941DB2A74B29C955E87B1E8C369ECD7B;
struct RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8;
struct String_t;

IL2CPP_EXTERN_C RuntimeClass* IRInstagram_t64E7C903941DB2A74B29C955E87B1E8C369ECD7B_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral1C7A9E8795DAC93A625C23D6E9F2BC7332ABF459;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_tCC6964D8A848766255587EFF9ED73DD9BE11965F 
{
};
struct RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8  : public RuntimeObject
{
};
struct RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8  : public RuntimeObject
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
struct RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_StaticFields
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXInstagramNotSupport__ctor_m37B0962ADB780106A5C296D36E5B6C63C814A405 (RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXInstagram_init_mAAADC5CC77686BB75DBB64295588B166728FDBFE (String_t* ___0_clientID, String_t* ___1_redirectURI, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRInstagram_t64E7C903941DB2A74B29C955E87B1E8C369ECD7B_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_StaticFields*)il2cpp_codegen_static_fields_for(RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_clientID;
		String_t* L_2 = ___1_redirectURI;
		InterfaceActionInvoker2< String_t*, String_t* >::Invoke(0, IRInstagram_t64E7C903941DB2A74B29C955E87B1E8C369ECD7B_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXInstagram__cctor_m427F392FFF14B1DB65BD973DA93FFA1461814A28 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8* L_0 = (RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8*)il2cpp_codegen_object_new(RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8_il2cpp_TypeInfo_var);
		RXInstagramNotSupport__ctor_m37B0962ADB780106A5C296D36E5B6C63C814A405(L_0, NULL);
		((RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_StaticFields*)il2cpp_codegen_static_fields_for(RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_StaticFields*)il2cpp_codegen_static_fields_for(RXInstagram_t4F644AAE5723E4D8C30D377700EC5DE38D93D8D8_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXInstagramNotSupport_init_m4F08CA7BC0BEDCE7D47C4290A92011ABA10E2630 (RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8* __this, String_t* ___0_clientID, String_t* ___1_redirectURI, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral1C7A9E8795DAC93A625C23D6E9F2BC7332ABF459);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral1C7A9E8795DAC93A625C23D6E9F2BC7332ABF459, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXInstagramNotSupport__ctor_m37B0962ADB780106A5C296D36E5B6C63C814A405 (RXInstagramNotSupport_t006C7B19EE839172AD2D9C1E84BBD3BBA49124D8* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
