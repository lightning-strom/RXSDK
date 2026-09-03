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

struct Dictionary_2_tAFFFC9BCDC0E8601FDB252CD80C438376B1177C6;
struct Dictionary_2_tCABF29E2E992CA896E7F85C3E8A7647AD903AC2A;
struct Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710;
struct IEqualityComparer_1_tAE94C8F24AD5B94D4EE85CA9FC59E3409D41CAF7;
struct KeyCollection_tE66790F09E854C19C7F612BEAD203AE626E90A36;
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD;
struct ValueCollection_tC9D91E8A3198E40EA339059703AB10DFC9F5CC2E;
struct EntryU5BU5D_t233BB24ED01E2D8D65B0651D54B8E3AD125CAF96;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C;
struct StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248;
struct CancellationTokenSource_tAAE1E0033BCFC233801F8CB4CED5C852B350CB7B;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727;
struct IRXPay_tE1AC6DEFE2D941D270ED92FC7A880F0CE01C83E2;
struct MethodInfo_t;
struct RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0;
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3;
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113;
struct String_t;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;

IL2CPP_EXTERN_C RuntimeClass* IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* IRXPay_tE1AC6DEFE2D941D270ED92FC7A880F0CE01C83E2_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral1A19816E26DD57F2F0ADC9810B8BCE1AD258F782;
IL2CPP_EXTERN_C String_t* _stringLiteralE75B4A40CFCB0E216F5520C89CDE9F7CFBEAE2E0;
IL2CPP_EXTERN_C const RuntimeMethod* RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;


IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_tFC004A063F2A42C89A761F91978613BBDACEC3A2 
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
struct List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD  : public RuntimeObject
{
	StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* ____items;
	int32_t ____size;
	int32_t ____version;
	RuntimeObject* ____syncRoot;
};
struct RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7  : public RuntimeObject
{
};
struct RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0  : public RuntimeObject
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
struct IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 
{
	RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___onResponse;
	RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___onError;
};
struct IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6_marshaled_pinvoke
{
	Il2CppMethodPointer ___onResponse;
	Il2CppMethodPointer ___onError;
};
struct IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6_marshaled_com
{
	Il2CppMethodPointer ___onResponse;
	Il2CppMethodPointer ___onError;
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
struct Behaviour_t01970CFBBA658497AE30F311C447DB0440BAB7FA  : public Component_t39FBE53E5EFCF4409111FB22C15FF73717632EC3
{
};
struct IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727  : public MulticastDelegate_t
{
};
struct RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3  : public MulticastDelegate_t
{
};
struct RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113  : public MulticastDelegate_t
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
struct RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_StaticFields
{
	RuntimeObject* ____sdk;
};
struct String_t_StaticFields
{
	String_t* ___Empty;
};
struct IntPtr_t_StaticFields
{
	intptr_t ___Zero;
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



IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS_GetProductInfos_mF26B850AA864D81F3B923F3E9AF57AC5A8549B2D (RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* __this, List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* ___0_productIds, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS__ctor_mC876E92BAA63456067B1C3EBD79F6A810C4F2EA6 (RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D (RuntimeObject* ___0_obj, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1 (String_t* ___0_func, IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 ___1_wrapper, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60 (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS_ios_iap_requestWithDict_m77FB3EBF7E2F7500857C4E22AAF61AAE8FCD7271 (String_t* ___0_dictJson, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_requestResponse, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_requestError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS_ios_getProductInfoWithProductIdArr_m7DBC9BDE0DE1F5DA676397F0C4DC380304ECF6AB (String_t* ___0_productIdArr, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_requestResponse, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_requestError, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2 (RuntimeObject* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C void DEFAULT_CALL ios_iap_requestWithDict(char*, Il2CppMethodPointer, Il2CppMethodPointer);
IL2CPP_EXTERN_C void DEFAULT_CALL ios_getProductInfoWithProductIdArr(char*, Il2CppMethodPointer, Il2CppMethodPointer);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPay_Pay_mC0FA253BB772B9ACC6BDF1934428A7E1FE310A0D (Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXPay_tE1AC6DEFE2D941D270ED92FC7A880F0CE01C83E2_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_StaticFields*)il2cpp_codegen_static_fields_for(RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var))->____sdk;
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_1 = ___0_dic;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		NullCheck(L_0);
		InterfaceActionInvoker3< Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710*, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113*, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* >::Invoke(0, IRXPay_tE1AC6DEFE2D941D270ED92FC7A880F0CE01C83E2_il2cpp_TypeInfo_var, L_0, L_1, L_2, L_3);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPay_IOS_GetProductInfos_m83F9E71796C1B531574B980ABCE48E1B4E6CA7EC (List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* ___0_productIds, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* V_0 = NULL;
	{
		il2cpp_codegen_runtime_class_init_inline(RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_StaticFields*)il2cpp_codegen_static_fields_for(RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var))->____sdk;
		V_0 = ((RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0*)IsInstClass((RuntimeObject*)L_0, RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0_il2cpp_TypeInfo_var));
		RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* L_1 = V_0;
		if (!L_1)
		{
			goto IL_0017;
		}
	}
	{
		RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* L_2 = V_0;
		List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* L_3 = ___0_productIds;
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_4 = ___1_onResponse;
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_5 = ___2_onError;
		NullCheck(L_2);
		RXPayIOS_GetProductInfos_mF26B850AA864D81F3B923F3E9AF57AC5A8549B2D(L_2, L_3, L_4, L_5, NULL);
	}

IL_0017:
	{
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPay__cctor_mBE4446CBCE411F371B06E05559D0022411042C82 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* L_0 = (RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0*)il2cpp_codegen_object_new(RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0_il2cpp_TypeInfo_var);
		RXPayIOS__ctor_mC876E92BAA63456067B1C3EBD79F6A810C4F2EA6(L_0, NULL);
		((RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_StaticFields*)il2cpp_codegen_static_fields_for(RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_StaticFields*)il2cpp_codegen_static_fields_for(RXPay_tF989B3E2282FA9C200B24D31FE055C274BDD6DC7_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS_Pay_m3B187E3ED251A0C7274E2546D16D839419A21556 (RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* __this, Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* ___0_dic, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralE75B4A40CFCB0E216F5520C89CDE9F7CFBEAE2E0);
		s_Il2CppMethodInitialized = true;
	}
	IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 V_0;
	memset((&V_0), 0, sizeof(V_0));
	{
		Dictionary_2_tA348003A3C1CEFB3096E9D2A0BC7F1AC8EC4F710* L_0 = ___0_dic;
		String_t* L_1;
		L_1 = RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D(L_0, NULL);
		il2cpp_codegen_initobj((&V_0), sizeof(IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6));
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		(&V_0)->___onResponse = L_2;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onResponse), (void*)L_2);
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		(&V_0)->___onError = L_3;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onError), (void*)L_3);
		IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 L_4 = V_0;
		RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1(_stringLiteralE75B4A40CFCB0E216F5520C89CDE9F7CFBEAE2E0, L_4, NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_5 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_5, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var), NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_6 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_6, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var), NULL);
		RXPayIOS_ios_iap_requestWithDict_m77FB3EBF7E2F7500857C4E22AAF61AAE8FCD7271(L_1, L_5, L_6, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS_GetProductInfos_mF26B850AA864D81F3B923F3E9AF57AC5A8549B2D (RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* __this, List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* ___0_productIds, RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* ___1_onResponse, RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* ___2_onError, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral1A19816E26DD57F2F0ADC9810B8BCE1AD258F782);
		s_Il2CppMethodInitialized = true;
	}
	IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 V_0;
	memset((&V_0), 0, sizeof(V_0));
	{
		List_1_tF470A3BE5C1B5B68E1325EF3F109D172E60BD7CD* L_0 = ___0_productIds;
		String_t* L_1;
		L_1 = RXJsonUtil_ToJson_m684B6E0B598485650777E7E34532961DB9B5542D(L_0, NULL);
		il2cpp_codegen_initobj((&V_0), sizeof(IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6));
		RequestResponseDelegate_t60E0E99D7C2E2B7D0DB2ED50130449DFCCCE1113* L_2 = ___1_onResponse;
		(&V_0)->___onResponse = L_2;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onResponse), (void*)L_2);
		RequestErrorDelegate_t052A3F18DF0521375B3E39E57562D46099A3C7D3* L_3 = ___2_onError;
		(&V_0)->___onError = L_3;
		Il2CppCodeGenWriteBarrier((void**)(&(&V_0)->___onError), (void*)L_3);
		IOSCallBackWrapper_tAF0BDADB3133983E38973FC0A1C6F34A79A230D6 L_4 = V_0;
		RuiXueSdkDriver_RegisterIOSCallBack_m308C45C697B0D40A41C29906D3F48BE82B12AFC1(_stringLiteral1A19816E26DD57F2F0ADC9810B8BCE1AD258F782, L_4, NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_5 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_5, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnResponse_mDC5D3F2EAD7857613F1E165908BF01F612643EAD_RuntimeMethod_var), NULL);
		IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* L_6 = (IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727*)il2cpp_codegen_object_new(IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727_il2cpp_TypeInfo_var);
		IOSCallBackCommonDelegate__ctor_mD83CC4ED7AB2660E8AFCA0162AFEB80A2131CA60(L_6, NULL, (intptr_t)((void*)RuiXueSdkDriver_IOSCallBackOnError_m5F9ADB4251D3AEEA6CB6FD3EC13E72894A829084_RuntimeMethod_var), NULL);
		RXPayIOS_ios_getProductInfoWithProductIdArr_m7DBC9BDE0DE1F5DA676397F0C4DC380304ECF6AB(L_1, L_5, L_6, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS_ios_iap_requestWithDict_m77FB3EBF7E2F7500857C4E22AAF61AAE8FCD7271 (String_t* ___0_dictJson, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_requestResponse, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_requestError, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*, Il2CppMethodPointer, Il2CppMethodPointer);

	char* ____0_dictJson_marshaled = NULL;
	____0_dictJson_marshaled = il2cpp_codegen_marshal_string(___0_dictJson);

	Il2CppMethodPointer ____1_requestResponse_marshaled = NULL;
	____1_requestResponse_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___1_requestResponse));

	Il2CppMethodPointer ____2_requestError_marshaled = NULL;
	____2_requestError_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___2_requestError));

	reinterpret_cast<PInvokeFunc>(ios_iap_requestWithDict)(____0_dictJson_marshaled, ____1_requestResponse_marshaled, ____2_requestError_marshaled);

	il2cpp_codegen_marshal_free(____0_dictJson_marshaled);
	____0_dictJson_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS_ios_getProductInfoWithProductIdArr_m7DBC9BDE0DE1F5DA676397F0C4DC380304ECF6AB (String_t* ___0_productIdArr, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___1_requestResponse, IOSCallBackCommonDelegate_t16B9CA546BCAFD129F43D73ACDA1E83AFA9F6727* ___2_requestError, const RuntimeMethod* method) 
{
	typedef void (DEFAULT_CALL *PInvokeFunc) (char*, Il2CppMethodPointer, Il2CppMethodPointer);

	char* ____0_productIdArr_marshaled = NULL;
	____0_productIdArr_marshaled = il2cpp_codegen_marshal_string(___0_productIdArr);

	Il2CppMethodPointer ____1_requestResponse_marshaled = NULL;
	____1_requestResponse_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___1_requestResponse));

	Il2CppMethodPointer ____2_requestError_marshaled = NULL;
	____2_requestError_marshaled = il2cpp_codegen_marshal_delegate(reinterpret_cast<MulticastDelegate_t*>(___2_requestError));

	reinterpret_cast<PInvokeFunc>(ios_getProductInfoWithProductIdArr)(____0_productIdArr_marshaled, ____1_requestResponse_marshaled, ____2_requestError_marshaled);

	il2cpp_codegen_marshal_free(____0_productIdArr_marshaled);
	____0_productIdArr_marshaled = NULL;

}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXPayIOS__ctor_mC876E92BAA63456067B1C3EBD79F6A810C4F2EA6 (RXPayIOS_t65B26F5FF3EE9E08710390AD49010E434C8FE4F0* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
