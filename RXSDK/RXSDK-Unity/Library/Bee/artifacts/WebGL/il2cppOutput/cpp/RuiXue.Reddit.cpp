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

struct IRReddit_tBF918702B1E4A00AC89EC1D0FE6A010FE0289A66;
struct RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73;
struct String_t;

IL2CPP_EXTERN_C RuntimeClass* IRReddit_tBF918702B1E4A00AC89EC1D0FE6A010FE0289A66_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral1C7A9E8795DAC93A625C23D6E9F2BC7332ABF459;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t4A32025C893421853E3C6335BFB54C72ED604464 
{
};
struct RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F  : public RuntimeObject
{
};
struct RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73  : public RuntimeObject
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
struct RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_StaticFields
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditNotSupport__ctor_m55980FB9C82C4C51D138200A0C6981915C02BF5E (RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73* __this, const RuntimeMethod* method) ;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXReddit_init_m9B0CAC6AC1D76FD10A1B9D10F44CBBA006EADCBE (String_t* ___0_clientID, String_t* ___1_redirectURI, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRReddit_tBF918702B1E4A00AC89EC1D0FE6A010FE0289A66_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_StaticFields*)il2cpp_codegen_static_fields_for(RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_clientID;
		String_t* L_2 = ___1_redirectURI;
		InterfaceActionInvoker2< String_t*, String_t* >::Invoke(0, IRReddit_tBF918702B1E4A00AC89EC1D0FE6A010FE0289A66_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXReddit__cctor_m3A5BCAF24AEB10D76814D9131048DAE023E87AE2 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73* L_0 = (RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73*)il2cpp_codegen_object_new(RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73_il2cpp_TypeInfo_var);
		RXRedditNotSupport__ctor_m55980FB9C82C4C51D138200A0C6981915C02BF5E(L_0, NULL);
		((RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_StaticFields*)il2cpp_codegen_static_fields_for(RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_StaticFields*)il2cpp_codegen_static_fields_for(RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditNotSupport_init_m9EDA94C43442F053922D464C0FD5D275B9F9CCD7 (RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73* __this, String_t* ___0_clientID, String_t* ___1_redirectURI, const RuntimeMethod* method) 
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditNotSupport__ctor_m55980FB9C82C4C51D138200A0C6981915C02BF5E (RXRedditNotSupport_t3A0AED01D8EF12E74BF013F57A767D20979FBF73* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
