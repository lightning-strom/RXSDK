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
template <typename T1>
struct InterfaceActionInvoker1
{
	typedef void (*Action)(void*, T1, const RuntimeMethod*);

	static inline void Invoke (Il2CppMethodSlot slot, RuntimeClass* declaringInterface, RuntimeObject* obj, T1 p1)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_interface_invoke_data(slot, obj, declaringInterface);
		((Action)invokeData.methodPtr)(obj, p1, invokeData.method);
	}
};
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

struct Dictionary_2_tAFFFC9BCDC0E8601FDB252CD80C438376B1177C6;
struct Dictionary_2_tCABF29E2E992CA896E7F85C3E8A7647AD903AC2A;
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD;
struct StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248;
struct CancellationTokenSource_tAAE1E0033BCFC233801F8CB4CED5C852B350CB7B;
struct IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C;
struct RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral78213F6858633125288256D108BC17D96595ACE1;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_tCF02E5E860F36F2B4F6DD0DF697F6A2D874BA163 
{
};
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD  : public RuntimeObject
{
	StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* ____items;
	int32_t ____size;
	int32_t ____version;
	RuntimeObject* ____syncRoot;
};
struct RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4  : public RuntimeObject
{
};
struct RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C  : public RuntimeObject
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
struct Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C  : public RuntimeObject
{
	intptr_t ___m_CachedPtr;
};
struct Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C_marshaled_pinvoke
{
	intptr_t ___m_CachedPtr;
};
struct Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C_marshaled_com
{
	intptr_t ___m_CachedPtr;
};
struct Component_t39FBE53E5EFCF4409111FB22C15FF73717632EC3  : public Object_tC12DECB6760A7F2CBF65D9DCF18D044C2D97152C
{
};
struct Behaviour_t01970CFBBA658497AE30F311C447DB0440BAB7FA  : public Component_t39FBE53E5EFCF4409111FB22C15FF73717632EC3
{
};
struct MonoBehaviour_t532A11E69716D348D8AA7F854AFCBFCB8AD17F71  : public Behaviour_t01970CFBBA658497AE30F311C447DB0440BAB7FA
{
	CancellationTokenSource_tAAE1E0033BCFC233801F8CB4CED5C852B350CB7B* ___m_CancellationTokenSource;
};
struct RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF  : public MonoBehaviour_t532A11E69716D348D8AA7F854AFCBFCB8AD17F71
{
	Dictionary_2_tCABF29E2E992CA896E7F85C3E8A7647AD903AC2A* ____mapIOSCallBacks;
	Dictionary_2_tAFFFC9BCDC0E8601FDB252CD80C438376B1177C6* ____mapJsCallBackHandler;
};
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD_StaticFields
{
	StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* ___s_emptyArray;
};
struct RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields
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
struct RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_StaticFields
{
	RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF* ____instance;
	String_t* ___U3CCacheInitParamCpidU3Ek__BackingField;
	String_t* ___U3CCacheInitParamProductidU3Ek__BackingField;
	String_t* ___U3CCacheInitParamChannelidU3Ek__BackingField;
	List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* ___U3CCacheInitParamBaseUrlListU3Ek__BackingField;
};
#ifdef __clang__
#pragma clang diagnostic pop
#endif



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS__ctor_m499A2B7522A14B0EA8272FEA48DA84E1DE220561 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) ;
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* RuiXueSdkDriver_get_CacheInitParamBaseUrlList_m616999ED198FB40E831682A13532E0E88A45AF0E_inline (const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D (RuntimeObject* ___0_obj, const RuntimeMethod* method) ;
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR String_t* RuiXueSdkDriver_get_CacheInitParamProductid_m4F192FC7B677B8AC98F44F4ED6D3B4D1E07AA053_inline (const RuntimeMethod* method) ;
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR String_t* RuiXueSdkDriver_get_CacheInitParamChannelid_m0B128A6EAFE9659A5B9676C0CA44D6AC318C912D_inline (const RuntimeMethod* method) ;
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR String_t* RuiXueSdkDriver_get_CacheInitParamCpid_mC91EE9A30CB11944BEDD3456583DFE6D6C2031DB_inline (const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_initWithProductId_m984533736E0FF442BB3216AC23E24F8F10A7295A (String_t* ___0_productId, String_t* ___1_channelId, String_t* ___2_cpid, String_t* ___3_baseUrlArrayJson, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_registerDeviceToken_m5529F955E2867CC4EA579028C1C721DF1384BD9A (const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_reliveBindingPushDevice_mCC6DEC2D989DC9213826C37B284894767A6183B5 (const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXPushIOS_ios_push_getDeviceToken_m453CB6871D5B5C1EC3411F7B9DC63F05D569B26C (const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_bindingAlias_m1E5D2DC6CD7F7F77A227F88D10EA430071218379 (String_t* ___0_alias, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_reliveBinding_m011BF69F577CFB488C5234A5BE3DFC5458D45276 (const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2 (RuntimeObject* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C void DEFAULT_CALL ios_push_initWithProductId(char*, char*, char*, char*);
IL2CPP_EXTERN_C void DEFAULT_CALL ios_push_registerDeviceToken();
IL2CPP_EXTERN_C void DEFAULT_CALL ios_push_reliveBindingPushDevice();
IL2CPP_EXTERN_C char* DEFAULT_CALL ios_push_getDeviceToken();
IL2CPP_EXTERN_C void DEFAULT_CALL ios_push_bindingAlias(char*);
IL2CPP_EXTERN_C void DEFAULT_CALL ios_push_reliveBinding();
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPush_Init_m957BD4F0E99F98B4049CFAD39335A085E7E03A1B (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		InterfaceActionInvoker0::Invoke(0, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPush_RegisterToken_m8437EF86E26571C80D153A9AD2512BAF75893826 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		InterfaceActionInvoker0::Invoke(1, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPush_UnRegisterToken_mB4D65B4689F4136ECDA7778A3C5F6CEE767627EE (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		InterfaceActionInvoker0::Invoke(2, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXPush_GetDeviceToken_m0FEE97C25E45F1841BBCB1908D77D1FDA8E8E846 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		String_t* L_1;
		L_1 = InterfaceFuncInvoker0< String_t* >::Invoke(3, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXPush_IsSupport_mD029B30C8F53ABF2163FD2A7C91AEF25E905E89B (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		bool L_1;
		L_1 = InterfaceFuncInvoker0< bool >::Invoke(4, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXPush_GetBrandName_m244D52DAA4F0E98F7E36E00B6C3830074FBFDE9C (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		NullCheck(L_0);
		String_t* L_1;
		L_1 = InterfaceFuncInvoker0< String_t* >::Invoke(5, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPush_BindAlias_mEA10814FE0F5D07EA07A9765016DE16268B06F9E (String_t* ___0_alias, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_alias;
		NullCheck(L_0);
		InterfaceActionInvoker1< String_t* >::Invoke(6, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0, L_1);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPush_UnBindAlias_m55D772064046195E2ECF60E4CAEA38EEF29CE804 (String_t* ___0_alias, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_alias;
		NullCheck(L_0);
		InterfaceActionInvoker1< String_t* >::Invoke(7, IRXPush_t7E7D6AA19A5C220988A1719F899D41BDE76CE61C_il2cpp_TypeInfo_var, L_0, L_1);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPush__cctor_mAA86AF0D5C4AA4A892FEF339136C93A009AF62C6 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* L_0 = (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C*)il2cpp_codegen_object_new(RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C_il2cpp_TypeInfo_var);
		RXPushIOS__ctor_m499A2B7522A14B0EA8272FEA48DA84E1DE220561(L_0, NULL);
		((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_StaticFields*)il2cpp_codegen_static_fields_for(RXPush_tEBC9B9EE0089E45E3D187472391961A7106E33E4_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_Init_m75D62C8D9D1134CE2907FC915302CDEF4AB9080D (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) 
{
	String_t* V_0 = NULL;
	{
		List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* L_0;
		L_0 = RuiXueSdkDriver_get_CacheInitParamBaseUrlList_m616999ED198FB40E831682A13532E0E88A45AF0E_inline(NULL);
		String_t* L_1;
		L_1 = RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D(L_0, NULL);
		V_0 = L_1;
		String_t* L_2;
		L_2 = RuiXueSdkDriver_get_CacheInitParamProductid_m4F192FC7B677B8AC98F44F4ED6D3B4D1E07AA053_inline(NULL);
		String_t* L_3;
		L_3 = RuiXueSdkDriver_get_CacheInitParamChannelid_m0B128A6EAFE9659A5B9676C0CA44D6AC318C912D_inline(NULL);
		String_t* L_4;
		L_4 = RuiXueSdkDriver_get_CacheInitParamCpid_mC91EE9A30CB11944BEDD3456583DFE6D6C2031DB_inline(NULL);
		String_t* L_5 = V_0;
		RXPushIOS_ios_push_initWithProductId_m984533736E0FF442BB3216AC23E24F8F10A7295A(L_2, L_3, L_4, L_5, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_RegisterToken_mD555A6CE55832D52D17687D4ADAE492EFC9BBC73 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) 
{
	{
		RXPushIOS_ios_push_registerDeviceToken_m5529F955E2867CC4EA579028C1C721DF1384BD9A(NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_UnRegisterToken_m7B7BF944445A6DB4B7274B6387390FF17CAB3D08 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) 
{
	{
		RXPushIOS_ios_push_reliveBindingPushDevice_mCC6DEC2D989DC9213826C37B284894767A6183B5(NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXPushIOS_GetDeviceToken_mCDE9A5CAEBD9C3A572B2B1B199B86DD75F4C30C1 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) 
{
	{
		String_t* L_0;
		L_0 = RXPushIOS_ios_push_getDeviceToken_m453CB6871D5B5C1EC3411F7B9DC63F05D569B26C(NULL);
		return L_0;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool RXPushIOS_IsSupport_m6E20B58E2586DE3BB5CD04661B8A7051381EFACC (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) 
{
	{
		return (bool)1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXPushIOS_GetBrandName_m8020EE7DF1F10ABFD259B3A86175CA058CA3CEE7 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral78213F6858633125288256D108BC17D96595ACE1);
		s_Il2CppMethodInitialized = true;
	}
	{
		return _stringLiteral78213F6858633125288256D108BC17D96595ACE1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_BindAlias_m4B6CC42CE4390A50A07B4360AC97B9C80825D280 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, String_t* ___0_alias, const RuntimeMethod* method) 
{
	{
		String_t* L_0 = ___0_alias;
		RXPushIOS_ios_push_bindingAlias_m1E5D2DC6CD7F7F77A227F88D10EA430071218379(L_0, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_UnBindAlias_mD370CEF4FB43596AB3BF78F78DB4B553F1B3E3D8 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, String_t* ___0_alias, const RuntimeMethod* method) 
{
	{
		RXPushIOS_ios_push_reliveBinding_m011BF69F577CFB488C5234A5BE3DFC5458D45276(NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_initWithProductId_m984533736E0FF442BB3216AC23E24F8F10A7295A (String_t* ___0_productId, String_t* ___1_channelId, String_t* ___2_cpid, String_t* ___3_baseUrlArrayJson, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*, char*, char*, char*);

	char* ____0_productId_marshaled = NULL;
	____0_productId_marshaled = il2cpp_codegen_marshal_string(___0_productId);

	char* ____1_channelId_marshaled = NULL;
	____1_channelId_marshaled = il2cpp_codegen_marshal_string(___1_channelId);

	char* ____2_cpid_marshaled = NULL;
	____2_cpid_marshaled = il2cpp_codegen_marshal_string(___2_cpid);

	char* ____3_baseUrlArrayJson_marshaled = NULL;
	____3_baseUrlArrayJson_marshaled = il2cpp_codegen_marshal_string(___3_baseUrlArrayJson);

	reinterpret_cast<PInvokeFunc>(ios_push_initWithProductId)(____0_productId_marshaled, ____1_channelId_marshaled, ____2_cpid_marshaled, ____3_baseUrlArrayJson_marshaled);

	il2cpp_codegen_marshal_free(____0_productId_marshaled);
	____0_productId_marshaled = NULL;

	il2cpp_codegen_marshal_free(____1_channelId_marshaled);
	____1_channelId_marshaled = NULL;

	il2cpp_codegen_marshal_free(____2_cpid_marshaled);
	____2_cpid_marshaled = NULL;

	il2cpp_codegen_marshal_free(____3_baseUrlArrayJson_marshaled);
	____3_baseUrlArrayJson_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_registerDeviceToken_m5529F955E2867CC4EA579028C1C721DF1384BD9A (const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) ();

	reinterpret_cast<PInvokeFunc>(ios_push_registerDeviceToken)();

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_reliveBindingPushDevice_mCC6DEC2D989DC9213826C37B284894767A6183B5 (const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) ();

	reinterpret_cast<PInvokeFunc>(ios_push_reliveBindingPushDevice)();

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXPushIOS_ios_push_getDeviceToken_m453CB6871D5B5C1EC3411F7B9DC63F05D569B26C (const RuntimeMethod* method) 
{
	typedef char* (DEFAULT_CALL *PInvokeFunc) ();

	char* returnValue = reinterpret_cast<PInvokeFunc>(ios_push_getDeviceToken)();

	String_t* _returnValue_unmarshaled = NULL;
	_returnValue_unmarshaled = il2cpp_codegen_marshal_string_result(returnValue);

	il2cpp_codegen_marshal_free(returnValue);
	returnValue = NULL;

	return _returnValue_unmarshaled;
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_bindingAlias_m1E5D2DC6CD7F7F77A227F88D10EA430071218379 (String_t* ___0_alias, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*);

	char* ____0_alias_marshaled = NULL;
	____0_alias_marshaled = il2cpp_codegen_marshal_string(___0_alias);

	reinterpret_cast<PInvokeFunc>(ios_push_bindingAlias)(____0_alias_marshaled);

	il2cpp_codegen_marshal_free(____0_alias_marshaled);
	____0_alias_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS_ios_push_reliveBinding_m011BF69F577CFB488C5234A5BE3DFC5458D45276 (const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) ();

	reinterpret_cast<PInvokeFunc>(ios_push_reliveBinding)();

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPushIOS__ctor_m499A2B7522A14B0EA8272FEA48DA84E1DE220561 (RXPushIOS_t6BE194D2367847AFC292C5EA0F439F33D0F0AA6C* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* RuiXueSdkDriver_get_CacheInitParamBaseUrlList_m616999ED198FB40E831682A13532E0E88A45AF0E_inline (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* L_0 = ((RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_StaticFields*)il2cpp_codegen_static_fields_for(RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var))->___U3CCacheInitParamBaseUrlListU3Ek__BackingField;
		return L_0;
	}
}
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR String_t* RuiXueSdkDriver_get_CacheInitParamProductid_m4F192FC7B677B8AC98F44F4ED6D3B4D1E07AA053_inline (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		String_t* L_0 = ((RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_StaticFields*)il2cpp_codegen_static_fields_for(RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var))->___U3CCacheInitParamProductidU3Ek__BackingField;
		return L_0;
	}
}
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR String_t* RuiXueSdkDriver_get_CacheInitParamChannelid_m0B128A6EAFE9659A5B9676C0CA44D6AC318C912D_inline (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		String_t* L_0 = ((RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_StaticFields*)il2cpp_codegen_static_fields_for(RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var))->___U3CCacheInitParamChannelidU3Ek__BackingField;
		return L_0;
	}
}
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR String_t* RuiXueSdkDriver_get_CacheInitParamCpid_mC91EE9A30CB11944BEDD3456583DFE6D6C2031DB_inline (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		String_t* L_0 = ((RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_StaticFields*)il2cpp_codegen_static_fields_for(RuiXueSdkDriver_t048AC63028A340A8CF5DE899621CD2D0B06BC5EF_il2cpp_TypeInfo_var))->___U3CCacheInitParamCpidU3Ek__BackingField;
		return L_0;
	}
}
