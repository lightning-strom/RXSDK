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
struct RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68;
struct String_t;

IL2CPP_EXTERN_C RuntimeClass* IRReddit_tBF918702B1E4A00AC89EC1D0FE6A010FE0289A66_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var;


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
struct RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68  : public RuntimeObject
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditIOS__ctor_mFC7381D4B4A8C8253B4B157F5E8658E0960399EF (RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditIOS_iOS_reddit_init_mA4DF9A1597B2FB85CF85F8D32F7427C72EA5B2DB (String_t* ___0_clientID, String_t* ___1_redirectURI, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2 (RuntimeObject* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C void DEFAULT_CALL iOS_reddit_init(char*, char*);
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
		NullCheck(L_0);
		InterfaceActionInvoker2< String_t*, String_t* >::Invoke(0, IRReddit_tBF918702B1E4A00AC89EC1D0FE6A010FE0289A66_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXReddit__cctor_m3A5BCAF24AEB10D76814D9131048DAE023E87AE2 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXReddit_t7FCF9967DBCDB6562847B632F28E83890FF0D68F_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68* L_0 = (RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68*)il2cpp_codegen_object_new(RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68_il2cpp_TypeInfo_var);
		RXRedditIOS__ctor_mFC7381D4B4A8C8253B4B157F5E8658E0960399EF(L_0, NULL);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditIOS_init_m89F02D58F2610030F7765BBF6F55E9035F8D2994 (RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68* __this, String_t* ___0_clientID, String_t* ___1_redirectURI, const RuntimeMethod* method) 
{
	{
		String_t* L_0 = ___0_clientID;
		String_t* L_1 = ___1_redirectURI;
		RXRedditIOS_iOS_reddit_init_mA4DF9A1597B2FB85CF85F8D32F7427C72EA5B2DB(L_0, L_1, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditIOS_iOS_reddit_init_mA4DF9A1597B2FB85CF85F8D32F7427C72EA5B2DB (String_t* ___0_clientID, String_t* ___1_redirectURI, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*, char*);

	char* ____0_clientID_marshaled = NULL;
	____0_clientID_marshaled = il2cpp_codegen_marshal_string(___0_clientID);

	char* ____1_redirectURI_marshaled = NULL;
	____1_redirectURI_marshaled = il2cpp_codegen_marshal_string(___1_redirectURI);

	reinterpret_cast<PInvokeFunc>(iOS_reddit_init)(____0_clientID_marshaled, ____1_redirectURI_marshaled);

	il2cpp_codegen_marshal_free(____0_clientID_marshaled);
	____0_clientID_marshaled = NULL;

	il2cpp_codegen_marshal_free(____1_redirectURI_marshaled);
	____1_redirectURI_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXRedditIOS__ctor_mFC7381D4B4A8C8253B4B157F5E8658E0960399EF (RXRedditIOS_t757005D1F963FD1CCE2A15F54FAC2D8D4DA76A68* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
