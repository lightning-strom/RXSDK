#include "pch-cpp.hpp"

#ifndef _MSC_VER
# include <alloca.h>
#else
# include <malloc.h>
#endif


#include <limits>


struct VirtualActionInvoker0
{
	typedef void (*Action)(void*, const RuntimeMethod*);

	static inline void Invoke (Il2CppMethodSlot slot, RuntimeObject* obj)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_virtual_invoke_data(slot, obj);
		((Action)invokeData.methodPtr)(obj, invokeData.method);
	}
};
template <typename T1>
struct VirtualActionInvoker1
{
	typedef void (*Action)(void*, T1, const RuntimeMethod*);

	static inline void Invoke (Il2CppMethodSlot slot, RuntimeObject* obj, T1 p1)
	{
		const VirtualInvokeData& invokeData = il2cpp_codegen_get_virtual_invoke_data(slot, obj);
		((Action)invokeData.methodPtr)(obj, p1, invokeData.method);
	}
};
struct GenericVirtualActionInvoker0
{
	typedef void (*Action)(void*, const RuntimeMethod*);

	static inline void Invoke (const RuntimeMethod* method, RuntimeObject* obj)
	{
		VirtualInvokeData invokeData;
		il2cpp_codegen_get_generic_virtual_invoke_data(method, obj, &invokeData);
		((Action)invokeData.methodPtr)(obj, invokeData.method);
	}
};
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
struct GenericInterfaceActionInvoker0
{
	typedef void (*Action)(void*, const RuntimeMethod*);

	static inline void Invoke (const RuntimeMethod* method, RuntimeObject* obj)
	{
		VirtualInvokeData invokeData;
		il2cpp_codegen_get_generic_interface_invoke_data(method, obj, &invokeData);
		((Action)invokeData.methodPtr)(obj, invokeData.method);
	}
};

struct ExporterFunc_1_t82AADA520E3D285B2C535DAB0921287867F242F5;
struct ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E;
struct Stack_1_t44FB67BF903D1071667858BDE91082DBE0D3111D;
struct CharU5BU5D_t799905CF001DD5F13F7DBB310181FC4D8B7D0AAB;
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248;
struct Delegate_t;
struct DelegateData_t9B286B493293CD2D23A5B2B5EF0E5B1324C2B77E;
struct IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3;
struct JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4;
struct LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E;
struct MethodInfo_t;
struct NumberFormatInfo_t8E26808B202927FEBF9064FCFEEA4D6E076E6472;
struct OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2;
struct OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF;
struct OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5;
struct OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507;
struct OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E;
struct RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602;
struct RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A;
struct RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE;
struct RxAdjustEvent_t986D61ED879233B31D09559DE46832AFE331F70A;
struct RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937;
struct RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67;
struct RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C;
struct RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928;
struct String_t;
struct StringBuilder_t;
struct TextWriter_tA9E5461506CF806E17B6BBBF2119359DEDA3F0F3;
struct Void_t4861ACF8F4594C3437BB48B6E56783494B843915;
struct WriterContext_tFD31C5B726C8F9C32D608876B8820A9E108A3EA1;
struct U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB;

IL2CPP_EXTERN_C RuntimeClass* ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* JsonMapper_t95BBA0663ABA3962D9E5B27D93A3DD7E934500D5_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C String_t* _stringLiteral01E730127C088326891582B75A775E355EBED894;
IL2CPP_EXTERN_C String_t* _stringLiteral054CEB307D5C07A45B77830C65BED23F89D65179;
IL2CPP_EXTERN_C String_t* _stringLiteral12EBBA3AB49FD6DE67070D2F4464018D948E52C3;
IL2CPP_EXTERN_C String_t* _stringLiteral2017290B58803666B9D4AD5EB9F9BF52345C9285;
IL2CPP_EXTERN_C String_t* _stringLiteral20F616F9A41CDD7032F779F9A6AE28C2C38E4206;
IL2CPP_EXTERN_C String_t* _stringLiteral21A930BD189C83C0D76EDA1B4B2D5A6622FFBE0F;
IL2CPP_EXTERN_C String_t* _stringLiteral3C74EE53B1AF65557F9BDF1EAF0C416BADC79DB9;
IL2CPP_EXTERN_C String_t* _stringLiteral47C5DB115362FD0ECFB5E8E9A93E894085ADB5F4;
IL2CPP_EXTERN_C String_t* _stringLiteral495C990A791B2C40CEC4B2EEE42829D02EB6090A;
IL2CPP_EXTERN_C String_t* _stringLiteral49668966BD86E02A4AFB16C55B364B3F72F8B27A;
IL2CPP_EXTERN_C String_t* _stringLiteral4B8E43025AA50BBDA47F8348E8D11B94659B027A;
IL2CPP_EXTERN_C String_t* _stringLiteral5B9A9DFD98762595F0C77843A5E01B4CFCEE395A;
IL2CPP_EXTERN_C String_t* _stringLiteral68C68AD7967ED4BF155A3CFA96B71B8567927BF6;
IL2CPP_EXTERN_C String_t* _stringLiteral6E6C18EDE843369A99EF66BA5108FA1E7AA8FD81;
IL2CPP_EXTERN_C String_t* _stringLiteral7E341A2D789505292ED5E8185688D5E724F214C2;
IL2CPP_EXTERN_C String_t* _stringLiteral80F5C93D7D1A75B619CA6EB5616A6123A15789FF;
IL2CPP_EXTERN_C String_t* _stringLiteral8E95218C2581DC22D3A227EA4F3574901140D0D4;
IL2CPP_EXTERN_C String_t* _stringLiteral905BE2C061FC057817F49D9F2E106C1982F82949;
IL2CPP_EXTERN_C String_t* _stringLiteralC02FF05EF85D2BB8BF3F59FD39CACD8586595766;
IL2CPP_EXTERN_C String_t* _stringLiteralC8D14F11493A217A7CE33C6522B70404C50681E3;
IL2CPP_EXTERN_C String_t* _stringLiteralCCCDF6DDDE85AE25C01B4F6F0E15D31FF28AA2AB;
IL2CPP_EXTERN_C String_t* _stringLiteralD97CFC38956F8E5A11AEDE75B2BFA5C64B223CF8;
IL2CPP_EXTERN_C String_t* _stringLiteralDA39A3EE5E6B4B0D3255BFEF95601890AFD80709;
IL2CPP_EXTERN_C String_t* _stringLiteralDE3B6A2C5E593C426C45B02FECD2C46E1E2F8E33;
IL2CPP_EXTERN_C String_t* _stringLiteralF33A1DE1A23F6582648240EE4650A24DD2EFE8E9;
IL2CPP_EXTERN_C String_t* _stringLiteralFF5437B70E75CEBDEDEAA72C5146790EA0D48D74;
IL2CPP_EXTERN_C const RuntimeMethod* JsonMapper_RegisterExporter_TisRxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE_m75F98F0C27027FBE1BF8FCD7E63BAAE068721CE8_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* U3CU3Ec_U3C_ctorU3Eb__32_0_m25131328C75E636B683694D09104AE3C2E8EDD72_RuntimeMethod_var;
struct Delegate_t_marshaled_com;
struct Delegate_t_marshaled_pinvoke;

struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771;
struct StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248;

IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t585B7FF0B89C3007A7B408E8D650AFFD5D1700C7 
{
};
struct JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4  : public RuntimeObject
{
	WriterContext_tFD31C5B726C8F9C32D608876B8820A9E108A3EA1* ___context;
	Stack_1_t44FB67BF903D1071667858BDE91082DBE0D3111D* ___ctx_stack;
	bool ___has_reached_end;
	CharU5BU5D_t799905CF001DD5F13F7DBB310181FC4D8B7D0AAB* ___hex_seq;
	int32_t ___indentation;
	int32_t ___indent_value;
	StringBuilder_t* ___inst_string_builder;
	bool ___pretty_print;
	bool ___validate;
	bool ___lower_case_properties;
	TextWriter_tA9E5461506CF806E17B6BBBF2119359DEDA3F0F3* ___writer;
};
struct RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81  : public RuntimeObject
{
};
struct RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602  : public RuntimeObject
{
};
struct RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A  : public RuntimeObject
{
	String_t* ___adid;
};
struct RxAdjustEvent_t986D61ED879233B31D09559DE46832AFE331F70A  : public RuntimeObject
{
	String_t* ___eventToken;
	double ___revenue;
};
struct RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937  : public RuntimeObject
{
};
struct RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67  : public RuntimeObject
{
};
struct RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C  : public RuntimeObject
{
};
struct RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928  : public RuntimeObject
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
struct U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB  : public RuntimeObject
{
};
struct Boolean_t09A6377A54BE2F9E6985A8149F19234FD7DDFE22 
{
	bool ___m_value;
};
struct Double_tE150EF3D1D43DEE85D533810AB4C742307EEDE5F 
{
	double ___m_value;
};
struct Enum_t2A1A94B24E3B776EEF4E5E485E290BB9D4D072E2  : public ValueType_t6D9B272BD21782F0A9A14F2E41F85A50E97A986F
{
};
struct Enum_t2A1A94B24E3B776EEF4E5E485E290BB9D4D072E2_marshaled_pinvoke
{
};
struct Enum_t2A1A94B24E3B776EEF4E5E485E290BB9D4D072E2_marshaled_com
{
};
struct Int32_t680FF22E76F6EFAD4375103CBBFFA0421349384C 
{
	int32_t ___m_value;
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
struct RxLogLevel_t84110DA1BA4729E62CBAE9F1C758FE2D4D3CFDB7 
{
	int32_t ___value__;
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
struct RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE  : public RuntimeObject
{
	String_t* ___appToken;
	String_t* ___environment;
	bool ___eventBufferingEnabled;
	OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* ___OnRxAttributionChangedDelegateListener;
	OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* ___OnRxEventTrackingSucceededDelegateListener;
	OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* ___OnRxEventTrackingFailedDelegateListener;
	OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* ___OnRxSessionTrackingSucceededDelegateListener;
	OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* ___OnRxSessionTrackingFailedDelegateListener;
	LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* ___OnRxDeeplinkDelegateResponseListener;
	bool ___sendInBackground;
	double ___delayStart;
	String_t* ___externalDeviceId;
	bool ___preinstallTrackingEnabled;
	bool ___needsCost;
	String_t* ___urlStrategy;
	int32_t ___rxLogLevel;
};
struct ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E  : public MulticastDelegate_t
{
};
struct LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E  : public MulticastDelegate_t
{
};
struct OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2  : public MulticastDelegate_t
{
};
struct OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF  : public MulticastDelegate_t
{
};
struct OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5  : public MulticastDelegate_t
{
};
struct OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507  : public MulticastDelegate_t
{
};
struct OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E  : public MulticastDelegate_t
{
};
struct JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4_StaticFields
{
	NumberFormatInfo_t8E26808B202927FEBF9064FCFEEA4D6E076E6472* ___number_format;
};
struct RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields
{
	RuntimeObject* ____sdk;
};
struct String_t_StaticFields
{
	String_t* ___Empty;
};
struct U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_StaticFields
{
	U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB* ___U3CU3E9;
	ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* ___U3CU3E9__32_0;
};
struct Boolean_t09A6377A54BE2F9E6985A8149F19234FD7DDFE22_StaticFields
{
	String_t* ___TrueString;
	String_t* ___FalseString;
};
struct IntPtr_t_StaticFields
{
	intptr_t ___Zero;
};
#ifdef __clang__
#pragma clang diagnostic pop
#endif
struct DelegateU5BU5D_tC5AB7E8F745616680F337909D3A8E6C722CDF771  : public RuntimeArray
{
	ALIGN_FIELD (8) Delegate_t* m_Items[1];

	inline Delegate_t* GetAt(il2cpp_array_size_t index) const
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items[index];
	}
	inline Delegate_t** GetAddressAt(il2cpp_array_size_t index)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items + index;
	}
	inline void SetAt(il2cpp_array_size_t index, Delegate_t* value)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		m_Items[index] = value;
		Il2CppCodeGenWriteBarrier((void**)m_Items + index, (void*)value);
	}
	inline Delegate_t* GetAtUnchecked(il2cpp_array_size_t index) const
	{
		return m_Items[index];
	}
	inline Delegate_t** GetAddressAtUnchecked(il2cpp_array_size_t index)
	{
		return m_Items + index;
	}
	inline void SetAtUnchecked(il2cpp_array_size_t index, Delegate_t* value)
	{
		m_Items[index] = value;
		Il2CppCodeGenWriteBarrier((void**)m_Items + index, (void*)value);
	}
};
struct StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248  : public RuntimeArray
{
	ALIGN_FIELD (8) String_t* m_Items[1];

	inline String_t* GetAt(il2cpp_array_size_t index) const
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items[index];
	}
	inline String_t** GetAddressAt(il2cpp_array_size_t index)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items + index;
	}
	inline void SetAt(il2cpp_array_size_t index, String_t* value)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		m_Items[index] = value;
		Il2CppCodeGenWriteBarrier((void**)m_Items + index, (void*)value);
	}
	inline String_t* GetAtUnchecked(il2cpp_array_size_t index) const
	{
		return m_Items[index];
	}
	inline String_t** GetAddressAtUnchecked(il2cpp_array_size_t index)
	{
		return m_Items + index;
	}
	inline void SetAtUnchecked(il2cpp_array_size_t index, String_t* value)
	{
		m_Items[index] = value;
		Il2CppCodeGenWriteBarrier((void**)m_Items + index, (void*)value);
	}
};


IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void ExporterFunc_1__ctor_mB434285676820B1878FB87752803EA9CF1845F7B_gshared (ExporterFunc_1_t82AADA520E3D285B2C535DAB0921287867F242F5* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void JsonMapper_RegisterExporter_TisRuntimeObject_m79ECBE9A95237E7763EE09D45CE13E013266864C_gshared (ExporterFunc_1_t82AADA520E3D285B2C535DAB0921287867F242F5* ___0_exporter, const RuntimeMethod* method) ;

IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2 (RuntimeObject* __this, const RuntimeMethod* method) ;
inline void ExporterFunc_1__ctor_m375721B036F8DDC98C29892C0804DB7C9254FB4D (ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method)
{
	((  void (*) (ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E*, RuntimeObject*, intptr_t, const RuntimeMethod*))ExporterFunc_1__ctor_mB434285676820B1878FB87752803EA9CF1845F7B_gshared)(__this, ___0_object, ___1_method, method);
}
inline void JsonMapper_RegisterExporter_TisRxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE_m75F98F0C27027FBE1BF8FCD7E63BAAE068721CE8 (ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* ___0_exporter, const RuntimeMethod* method)
{
	((  void (*) (ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E*, const RuntimeMethod*))JsonMapper_RegisterExporter_TisRuntimeObject_m79ECBE9A95237E7763EE09D45CE13E013266864C_gshared)(___0_exporter, method);
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void U3CU3Ec__ctor_m602BFE7FC3B8E3FF2125D62B7E3B247EF1BC1981 (U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport__ctor_m1B4BF83CF249902935D338A34228442AB3ED3CA0 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9 (String_t* ___0_funcName, const RuntimeMethod* method) ;
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
void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_Multicast(OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method)
{
	il2cpp_array_size_t length = __this->___delegates->max_length;
	Delegate_t** delegatesToInvoke = reinterpret_cast<Delegate_t**>(__this->___delegates->GetAddressAtUnchecked(0));
	for (il2cpp_array_size_t i = 0; i < length; i++)
	{
		OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* currentDelegate = reinterpret_cast<OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2*>(delegatesToInvoke[i]);
		typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A*, const RuntimeMethod*);
		((FunctionPointerType)currentDelegate->___invoke_impl)((Il2CppObject*)currentDelegate->___method_code, ___0_attribution, reinterpret_cast<RuntimeMethod*>(currentDelegate->___method));
	}
}
void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenInst(OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_attribution, method);
}
void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenStatic(OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_attribution, method);
}
void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenVirtual(OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method)
{
	VirtualActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), ___0_attribution);
}
void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenInterface(OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method)
{
	InterfaceActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), il2cpp_codegen_method_get_declaring_type(method), ___0_attribution);
}
void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenGenericVirtual(OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method)
{
	GenericVirtualActionInvoker0::Invoke(method, ___0_attribution);
}
void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenGenericInterface(OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method)
{
	GenericInterfaceActionInvoker0::Invoke(method, ___0_attribution);
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnAttributionChangedDelegate__ctor_m8CDFCABF9FE0BC5AE5096D201B621BD5A7157E51 (OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) 
{
	__this->___method_ptr = (intptr_t)il2cpp_codegen_get_method_pointer((RuntimeMethod*)___1_method);
	__this->___method = ___1_method;
	__this->___m_target = ___0_object;
	Il2CppCodeGenWriteBarrier((void**)(&__this->___m_target), (void*)___0_object);
	int parameterCount = il2cpp_codegen_method_parameter_count((RuntimeMethod*)___1_method);
	__this->___method_code = (intptr_t)__this;
	if (MethodIsStatic((RuntimeMethod*)___1_method))
	{
		bool isOpen = parameterCount == 1;
		if (isOpen)
			__this->___invoke_impl = (intptr_t)&OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenStatic;
		else
			{
				__this->___invoke_impl = __this->___method_ptr;
				__this->___method_code = (intptr_t)__this->___m_target;
			}
	}
	else
	{
		bool isOpen = parameterCount == 0;
		if (isOpen)
		{
			if (__this->___method_is_virtual)
			{
				if (il2cpp_codegen_method_is_generic_instance_method((RuntimeMethod*)___1_method))
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenGenericInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenGenericVirtual;
				else
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenVirtual;
			}
			else
			{
				__this->___invoke_impl = (intptr_t)&OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_OpenInst;
			}
		}
		else
		{
			if (___0_object == NULL)
				il2cpp_codegen_raise_exception(il2cpp_codegen_get_argument_exception(NULL, "Delegate to an instance method cannot have null 'this'."), NULL);
			__this->___invoke_impl = __this->___method_ptr;
			__this->___method_code = (intptr_t)__this->___m_target;
		}
	}
	__this->___extra_arg = (intptr_t)&OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0_Multicast;
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnAttributionChangedDelegate_Invoke_m3967B3AF9DD73F810877BD4F893D157DD91B7ED0 (OnAttributionChangedDelegate_tBD981DC801306B89EF0EF69C78E5847C83B33CC2* __this, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* ___0_attribution, const RuntimeMethod* method) 
{
	typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A*, const RuntimeMethod*);
	((FunctionPointerType)__this->___invoke_impl)((Il2CppObject*)__this->___method_code, ___0_attribution, reinterpret_cast<RuntimeMethod*>(__this->___method));
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_Multicast(OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method)
{
	il2cpp_array_size_t length = __this->___delegates->max_length;
	Delegate_t** delegatesToInvoke = reinterpret_cast<Delegate_t**>(__this->___delegates->GetAddressAtUnchecked(0));
	for (il2cpp_array_size_t i = 0; i < length; i++)
	{
		OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* currentDelegate = reinterpret_cast<OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5*>(delegatesToInvoke[i]);
		typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67*, const RuntimeMethod*);
		((FunctionPointerType)currentDelegate->___invoke_impl)((Il2CppObject*)currentDelegate->___method_code, ___0_eventSuccessResponseData, reinterpret_cast<RuntimeMethod*>(currentDelegate->___method));
	}
}
void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenInst(OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_eventSuccessResponseData, method);
}
void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenStatic(OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_eventSuccessResponseData, method);
}
void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenVirtual(OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method)
{
	VirtualActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), ___0_eventSuccessResponseData);
}
void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenInterface(OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method)
{
	InterfaceActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), il2cpp_codegen_method_get_declaring_type(method), ___0_eventSuccessResponseData);
}
void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenGenericVirtual(OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method)
{
	GenericVirtualActionInvoker0::Invoke(method, ___0_eventSuccessResponseData);
}
void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenGenericInterface(OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method)
{
	GenericInterfaceActionInvoker0::Invoke(method, ___0_eventSuccessResponseData);
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedEventTrackingSucceededDelegate__ctor_m17EDC6F898FF4E13D5912CF1CFEF7D42ACB0D8BB (OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) 
{
	__this->___method_ptr = (intptr_t)il2cpp_codegen_get_method_pointer((RuntimeMethod*)___1_method);
	__this->___method = ___1_method;
	__this->___m_target = ___0_object;
	Il2CppCodeGenWriteBarrier((void**)(&__this->___m_target), (void*)___0_object);
	int parameterCount = il2cpp_codegen_method_parameter_count((RuntimeMethod*)___1_method);
	__this->___method_code = (intptr_t)__this;
	if (MethodIsStatic((RuntimeMethod*)___1_method))
	{
		bool isOpen = parameterCount == 1;
		if (isOpen)
			__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenStatic;
		else
			{
				__this->___invoke_impl = __this->___method_ptr;
				__this->___method_code = (intptr_t)__this->___m_target;
			}
	}
	else
	{
		bool isOpen = parameterCount == 0;
		if (isOpen)
		{
			if (__this->___method_is_virtual)
			{
				if (il2cpp_codegen_method_is_generic_instance_method((RuntimeMethod*)___1_method))
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenGenericInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenGenericVirtual;
				else
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenVirtual;
			}
			else
			{
				__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_OpenInst;
			}
		}
		else
		{
			if (___0_object == NULL)
				il2cpp_codegen_raise_exception(il2cpp_codegen_get_argument_exception(NULL, "Delegate to an instance method cannot have null 'this'."), NULL);
			__this->___invoke_impl = __this->___method_ptr;
			__this->___method_code = (intptr_t)__this->___m_target;
		}
	}
	__this->___extra_arg = (intptr_t)&OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5_Multicast;
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedEventTrackingSucceededDelegate_Invoke_m8EC8C839CBA49C7E5A8FE4C9220C6D8D09E3C1E5 (OnFinishedEventTrackingSucceededDelegate_t1A6F5D3EC4CAE729A984B739DF42502B342D27D5* __this, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* ___0_eventSuccessResponseData, const RuntimeMethod* method) 
{
	typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67*, const RuntimeMethod*);
	((FunctionPointerType)__this->___invoke_impl)((Il2CppObject*)__this->___method_code, ___0_eventSuccessResponseData, reinterpret_cast<RuntimeMethod*>(__this->___method));
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_Multicast(OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method)
{
	il2cpp_array_size_t length = __this->___delegates->max_length;
	Delegate_t** delegatesToInvoke = reinterpret_cast<Delegate_t**>(__this->___delegates->GetAddressAtUnchecked(0));
	for (il2cpp_array_size_t i = 0; i < length; i++)
	{
		OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* currentDelegate = reinterpret_cast<OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF*>(delegatesToInvoke[i]);
		typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937*, const RuntimeMethod*);
		((FunctionPointerType)currentDelegate->___invoke_impl)((Il2CppObject*)currentDelegate->___method_code, ___0_rxAdjustEventFailure, reinterpret_cast<RuntimeMethod*>(currentDelegate->___method));
	}
}
void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenInst(OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_rxAdjustEventFailure, method);
}
void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenStatic(OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_rxAdjustEventFailure, method);
}
void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenVirtual(OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method)
{
	VirtualActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), ___0_rxAdjustEventFailure);
}
void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenInterface(OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method)
{
	InterfaceActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), il2cpp_codegen_method_get_declaring_type(method), ___0_rxAdjustEventFailure);
}
void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenGenericVirtual(OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method)
{
	GenericVirtualActionInvoker0::Invoke(method, ___0_rxAdjustEventFailure);
}
void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenGenericInterface(OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method)
{
	GenericInterfaceActionInvoker0::Invoke(method, ___0_rxAdjustEventFailure);
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedEventTrackingFailedDelegate__ctor_m830EE6B5FAE40D74DE19280ED536813F8CA940F8 (OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) 
{
	__this->___method_ptr = (intptr_t)il2cpp_codegen_get_method_pointer((RuntimeMethod*)___1_method);
	__this->___method = ___1_method;
	__this->___m_target = ___0_object;
	Il2CppCodeGenWriteBarrier((void**)(&__this->___m_target), (void*)___0_object);
	int parameterCount = il2cpp_codegen_method_parameter_count((RuntimeMethod*)___1_method);
	__this->___method_code = (intptr_t)__this;
	if (MethodIsStatic((RuntimeMethod*)___1_method))
	{
		bool isOpen = parameterCount == 1;
		if (isOpen)
			__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenStatic;
		else
			{
				__this->___invoke_impl = __this->___method_ptr;
				__this->___method_code = (intptr_t)__this->___m_target;
			}
	}
	else
	{
		bool isOpen = parameterCount == 0;
		if (isOpen)
		{
			if (__this->___method_is_virtual)
			{
				if (il2cpp_codegen_method_is_generic_instance_method((RuntimeMethod*)___1_method))
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenGenericInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenGenericVirtual;
				else
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenVirtual;
			}
			else
			{
				__this->___invoke_impl = (intptr_t)&OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_OpenInst;
			}
		}
		else
		{
			if (___0_object == NULL)
				il2cpp_codegen_raise_exception(il2cpp_codegen_get_argument_exception(NULL, "Delegate to an instance method cannot have null 'this'."), NULL);
			__this->___invoke_impl = __this->___method_ptr;
			__this->___method_code = (intptr_t)__this->___m_target;
		}
	}
	__this->___extra_arg = (intptr_t)&OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2_Multicast;
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedEventTrackingFailedDelegate_Invoke_m5AA017E94C4A602DA8A3E97A1680BCC7B8342BF2 (OnFinishedEventTrackingFailedDelegate_tD8FE7A3FC45686BCA534EF908240D021C000A4EF* __this, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* ___0_rxAdjustEventFailure, const RuntimeMethod* method) 
{
	typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937*, const RuntimeMethod*);
	((FunctionPointerType)__this->___invoke_impl)((Il2CppObject*)__this->___method_code, ___0_rxAdjustEventFailure, reinterpret_cast<RuntimeMethod*>(__this->___method));
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_Multicast(OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method)
{
	il2cpp_array_size_t length = __this->___delegates->max_length;
	Delegate_t** delegatesToInvoke = reinterpret_cast<Delegate_t**>(__this->___delegates->GetAddressAtUnchecked(0));
	for (il2cpp_array_size_t i = 0; i < length; i++)
	{
		OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* currentDelegate = reinterpret_cast<OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E*>(delegatesToInvoke[i]);
		typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928*, const RuntimeMethod*);
		((FunctionPointerType)currentDelegate->___invoke_impl)((Il2CppObject*)currentDelegate->___method_code, ___0_rxAdjustSessionSuccess, reinterpret_cast<RuntimeMethod*>(currentDelegate->___method));
	}
}
void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenInst(OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_rxAdjustSessionSuccess, method);
}
void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenStatic(OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_rxAdjustSessionSuccess, method);
}
void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenVirtual(OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method)
{
	VirtualActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), ___0_rxAdjustSessionSuccess);
}
void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenInterface(OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method)
{
	InterfaceActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), il2cpp_codegen_method_get_declaring_type(method), ___0_rxAdjustSessionSuccess);
}
void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenGenericVirtual(OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method)
{
	GenericVirtualActionInvoker0::Invoke(method, ___0_rxAdjustSessionSuccess);
}
void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenGenericInterface(OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method)
{
	GenericInterfaceActionInvoker0::Invoke(method, ___0_rxAdjustSessionSuccess);
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedSessionTrackingSucceededDelegate__ctor_m449660A51A239E3EE91A73E80F9FA922A86EA589 (OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) 
{
	__this->___method_ptr = (intptr_t)il2cpp_codegen_get_method_pointer((RuntimeMethod*)___1_method);
	__this->___method = ___1_method;
	__this->___m_target = ___0_object;
	Il2CppCodeGenWriteBarrier((void**)(&__this->___m_target), (void*)___0_object);
	int parameterCount = il2cpp_codegen_method_parameter_count((RuntimeMethod*)___1_method);
	__this->___method_code = (intptr_t)__this;
	if (MethodIsStatic((RuntimeMethod*)___1_method))
	{
		bool isOpen = parameterCount == 1;
		if (isOpen)
			__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenStatic;
		else
			{
				__this->___invoke_impl = __this->___method_ptr;
				__this->___method_code = (intptr_t)__this->___m_target;
			}
	}
	else
	{
		bool isOpen = parameterCount == 0;
		if (isOpen)
		{
			if (__this->___method_is_virtual)
			{
				if (il2cpp_codegen_method_is_generic_instance_method((RuntimeMethod*)___1_method))
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenGenericInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenGenericVirtual;
				else
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenVirtual;
			}
			else
			{
				__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_OpenInst;
			}
		}
		else
		{
			if (___0_object == NULL)
				il2cpp_codegen_raise_exception(il2cpp_codegen_get_argument_exception(NULL, "Delegate to an instance method cannot have null 'this'."), NULL);
			__this->___invoke_impl = __this->___method_ptr;
			__this->___method_code = (intptr_t)__this->___m_target;
		}
	}
	__this->___extra_arg = (intptr_t)&OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97_Multicast;
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedSessionTrackingSucceededDelegate_Invoke_mF88DB396A2A0D11A6F23D793B79DE945EACD2A97 (OnFinishedSessionTrackingSucceededDelegate_t41133673404DD1A71A03D7B30BFB23C258A7E49E* __this, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* ___0_rxAdjustSessionSuccess, const RuntimeMethod* method) 
{
	typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928*, const RuntimeMethod*);
	((FunctionPointerType)__this->___invoke_impl)((Il2CppObject*)__this->___method_code, ___0_rxAdjustSessionSuccess, reinterpret_cast<RuntimeMethod*>(__this->___method));
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_Multicast(OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method)
{
	il2cpp_array_size_t length = __this->___delegates->max_length;
	Delegate_t** delegatesToInvoke = reinterpret_cast<Delegate_t**>(__this->___delegates->GetAddressAtUnchecked(0));
	for (il2cpp_array_size_t i = 0; i < length; i++)
	{
		OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* currentDelegate = reinterpret_cast<OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507*>(delegatesToInvoke[i]);
		typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C*, const RuntimeMethod*);
		((FunctionPointerType)currentDelegate->___invoke_impl)((Il2CppObject*)currentDelegate->___method_code, ___0_rxAdjustSessionFailure, reinterpret_cast<RuntimeMethod*>(currentDelegate->___method));
	}
}
void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenInst(OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_rxAdjustSessionFailure, method);
}
void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenStatic(OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method)
{
	typedef void (*FunctionPointerType) (RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C*, const RuntimeMethod*);
	((FunctionPointerType)__this->___method_ptr)(___0_rxAdjustSessionFailure, method);
}
void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenVirtual(OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method)
{
	VirtualActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), ___0_rxAdjustSessionFailure);
}
void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenInterface(OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method)
{
	InterfaceActionInvoker0::Invoke(il2cpp_codegen_method_get_slot(method), il2cpp_codegen_method_get_declaring_type(method), ___0_rxAdjustSessionFailure);
}
void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenGenericVirtual(OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method)
{
	GenericVirtualActionInvoker0::Invoke(method, ___0_rxAdjustSessionFailure);
}
void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenGenericInterface(OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method)
{
	GenericInterfaceActionInvoker0::Invoke(method, ___0_rxAdjustSessionFailure);
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedSessionTrackingFailedDelegate__ctor_m2D6BCECB20BBAEF62D2FA71270471A76F33A4C85 (OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) 
{
	__this->___method_ptr = (intptr_t)il2cpp_codegen_get_method_pointer((RuntimeMethod*)___1_method);
	__this->___method = ___1_method;
	__this->___m_target = ___0_object;
	Il2CppCodeGenWriteBarrier((void**)(&__this->___m_target), (void*)___0_object);
	int parameterCount = il2cpp_codegen_method_parameter_count((RuntimeMethod*)___1_method);
	__this->___method_code = (intptr_t)__this;
	if (MethodIsStatic((RuntimeMethod*)___1_method))
	{
		bool isOpen = parameterCount == 1;
		if (isOpen)
			__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenStatic;
		else
			{
				__this->___invoke_impl = __this->___method_ptr;
				__this->___method_code = (intptr_t)__this->___m_target;
			}
	}
	else
	{
		bool isOpen = parameterCount == 0;
		if (isOpen)
		{
			if (__this->___method_is_virtual)
			{
				if (il2cpp_codegen_method_is_generic_instance_method((RuntimeMethod*)___1_method))
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenGenericInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenGenericVirtual;
				else
					if (il2cpp_codegen_method_is_interface_method((RuntimeMethod*)___1_method))
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenInterface;
					else
						__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenVirtual;
			}
			else
			{
				__this->___invoke_impl = (intptr_t)&OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_OpenInst;
			}
		}
		else
		{
			if (___0_object == NULL)
				il2cpp_codegen_raise_exception(il2cpp_codegen_get_argument_exception(NULL, "Delegate to an instance method cannot have null 'this'."), NULL);
			__this->___invoke_impl = __this->___method_ptr;
			__this->___method_code = (intptr_t)__this->___m_target;
		}
	}
	__this->___extra_arg = (intptr_t)&OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502_Multicast;
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void OnFinishedSessionTrackingFailedDelegate_Invoke_m28242948F51C4A0D7264938E42E1F834BDD2F502 (OnFinishedSessionTrackingFailedDelegate_tA0F0F2088C4899627CEB6A4CBFD45CA2872E5507* __this, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* ___0_rxAdjustSessionFailure, const RuntimeMethod* method) 
{
	typedef void (*FunctionPointerType) (RuntimeObject*, RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C*, const RuntimeMethod*);
	((FunctionPointerType)__this->___invoke_impl)((Il2CppObject*)__this->___method_code, ___0_rxAdjustSessionFailure, reinterpret_cast<RuntimeMethod*>(__this->___method));
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
bool LaunchReceivedDeeplinkDelegate_Invoke_mB40F5AE53D48320A6A77B4180BA51431929665C8_Multicast(LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* __this, String_t* ___0_deeplink, const RuntimeMethod* method)
{
	il2cpp_array_size_t length = __this->___delegates->max_length;
	Delegate_t** delegatesToInvoke = reinterpret_cast<Delegate_t**>(__this->___delegates->GetAddressAtUnchecked(0));
	bool retVal = false;
	for (il2cpp_array_size_t i = 0; i < length; i++)
	{
		LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* currentDelegate = reinterpret_cast<LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E*>(delegatesToInvoke[i]);
		typedef bool (*FunctionPointerType) (RuntimeObject*, String_t*, const RuntimeMethod*);
		retVal = ((FunctionPointerType)currentDelegate->___invoke_impl)((Il2CppObject*)currentDelegate->___method_code, ___0_deeplink, reinterpret_cast<RuntimeMethod*>(currentDelegate->___method));
	}
	return retVal;
}
bool LaunchReceivedDeeplinkDelegate_Invoke_mB40F5AE53D48320A6A77B4180BA51431929665C8_OpenInst(LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* __this, String_t* ___0_deeplink, const RuntimeMethod* method)
{
	typedef bool (*FunctionPointerType) (String_t*, const RuntimeMethod*);
	return ((FunctionPointerType)__this->___method_ptr)(___0_deeplink, method);
}
bool LaunchReceivedDeeplinkDelegate_Invoke_mB40F5AE53D48320A6A77B4180BA51431929665C8_OpenStatic(LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* __this, String_t* ___0_deeplink, const RuntimeMethod* method)
{
	typedef bool (*FunctionPointerType) (String_t*, const RuntimeMethod*);
	return ((FunctionPointerType)__this->___method_ptr)(___0_deeplink, method);
}
IL2CPP_EXTERN_C  bool DelegatePInvokeWrapper_LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E (LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* __this, String_t* ___0_deeplink, const RuntimeMethod* method)
{
	typedef int32_t (DEFAULT_CALL *PInvokeFunc)(char*);
	PInvokeFunc il2cppPInvokeFunc = reinterpret_cast<PInvokeFunc>(il2cpp_codegen_get_reverse_pinvoke_function_ptr(__this));
	char* ____0_deeplink_marshaled = NULL;
	____0_deeplink_marshaled = il2cpp_codegen_marshal_string(___0_deeplink);

	int32_t returnValue = il2cppPInvokeFunc(____0_deeplink_marshaled);

	il2cpp_codegen_marshal_free(____0_deeplink_marshaled);
	____0_deeplink_marshaled = NULL;

	return static_cast<bool>(returnValue);
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void LaunchReceivedDeeplinkDelegate__ctor_m8C61720CD660C340D983CFFACFAD268A676C668A (LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* __this, RuntimeObject* ___0_object, intptr_t ___1_method, const RuntimeMethod* method) 
{
	__this->___method_ptr = (intptr_t)il2cpp_codegen_get_method_pointer((RuntimeMethod*)___1_method);
	__this->___method = ___1_method;
	__this->___m_target = ___0_object;
	Il2CppCodeGenWriteBarrier((void**)(&__this->___m_target), (void*)___0_object);
	int parameterCount = il2cpp_codegen_method_parameter_count((RuntimeMethod*)___1_method);
	__this->___method_code = (intptr_t)__this;
	if (MethodIsStatic((RuntimeMethod*)___1_method))
	{
		bool isOpen = parameterCount == 1;
		if (isOpen)
			__this->___invoke_impl = (intptr_t)&LaunchReceivedDeeplinkDelegate_Invoke_mB40F5AE53D48320A6A77B4180BA51431929665C8_OpenStatic;
		else
			{
				__this->___invoke_impl = __this->___method_ptr;
				__this->___method_code = (intptr_t)__this->___m_target;
			}
	}
	else
	{
		bool isOpen = parameterCount == 0;
		if (isOpen)
		{
			__this->___invoke_impl = (intptr_t)&LaunchReceivedDeeplinkDelegate_Invoke_mB40F5AE53D48320A6A77B4180BA51431929665C8_OpenInst;
		}
		else
		{
			if (___0_object == NULL)
				il2cpp_codegen_raise_exception(il2cpp_codegen_get_argument_exception(NULL, "Delegate to an instance method cannot have null 'this'."), NULL);
			__this->___invoke_impl = __this->___method_ptr;
			__this->___method_code = (intptr_t)__this->___m_target;
		}
	}
	__this->___extra_arg = (intptr_t)&LaunchReceivedDeeplinkDelegate_Invoke_mB40F5AE53D48320A6A77B4180BA51431929665C8_Multicast;
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool LaunchReceivedDeeplinkDelegate_Invoke_mB40F5AE53D48320A6A77B4180BA51431929665C8 (LaunchReceivedDeeplinkDelegate_t778907E75381ECCF06353CB38A8AF1B7E927F50E* __this, String_t* ___0_deeplink, const RuntimeMethod* method) 
{
	typedef bool (*FunctionPointerType) (RuntimeObject*, String_t*, const RuntimeMethod*);
	return ((FunctionPointerType)__this->___invoke_impl)((Il2CppObject*)__this->___method_code, ___0_deeplink, reinterpret_cast<RuntimeMethod*>(__this->___method));
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustAttribution__ctor_mD1F9F96AFAD1EF205DF597035419AF9409C8601A (RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* __this, const RuntimeMethod* method) 
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustConfig__ctor_m0ED065962EE65FD1B191A080DE73590C498BA2F7 (RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* __this, String_t* ___0_appToken, String_t* ___1_environment, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&JsonMapper_RegisterExporter_TisRxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE_m75F98F0C27027FBE1BF8FCD7E63BAAE068721CE8_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&JsonMapper_t95BBA0663ABA3962D9E5B27D93A3DD7E934500D5_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&U3CU3Ec_U3C_ctorU3Eb__32_0_m25131328C75E636B683694D09104AE3C2E8EDD72_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* G_B2_0 = NULL;
	ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* G_B1_0 = NULL;
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		String_t* L_0 = ___0_appToken;
		__this->___appToken = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&__this->___appToken), (void*)L_0);
		String_t* L_1 = ___1_environment;
		__this->___environment = L_1;
		Il2CppCodeGenWriteBarrier((void**)(&__this->___environment), (void*)L_1);
		il2cpp_codegen_runtime_class_init_inline(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var);
		ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* L_2 = ((U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_StaticFields*)il2cpp_codegen_static_fields_for(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var))->___U3CU3E9__32_0;
		ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* L_3 = L_2;
		if (L_3)
		{
			G_B2_0 = L_3;
			goto IL_0033;
		}
		G_B1_0 = L_3;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var);
		U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB* L_4 = ((U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_StaticFields*)il2cpp_codegen_static_fields_for(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var))->___U3CU3E9;
		ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* L_5 = (ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E*)il2cpp_codegen_object_new(ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E_il2cpp_TypeInfo_var);
		ExporterFunc_1__ctor_m375721B036F8DDC98C29892C0804DB7C9254FB4D(L_5, L_4, (intptr_t)((void*)U3CU3Ec_U3C_ctorU3Eb__32_0_m25131328C75E636B683694D09104AE3C2E8EDD72_RuntimeMethod_var), NULL);
		ExporterFunc_1_t89E694B153D6D631A918FFA9708A0F8C64BE8C8E* L_6 = L_5;
		((U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_StaticFields*)il2cpp_codegen_static_fields_for(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var))->___U3CU3E9__32_0 = L_6;
		Il2CppCodeGenWriteBarrier((void**)(&((U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_StaticFields*)il2cpp_codegen_static_fields_for(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var))->___U3CU3E9__32_0), (void*)L_6);
		G_B2_0 = L_6;
	}

IL_0033:
	{
		il2cpp_codegen_runtime_class_init_inline(JsonMapper_t95BBA0663ABA3962D9E5B27D93A3DD7E934500D5_il2cpp_TypeInfo_var);
		JsonMapper_RegisterExporter_TisRxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE_m75F98F0C27027FBE1BF8FCD7E63BAAE068721CE8(G_B2_0, JsonMapper_RegisterExporter_TisRxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE_m75F98F0C27027FBE1BF8FCD7E63BAAE068721CE8_RuntimeMethod_var);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustConfig_SetLogLevel_m8E0B028D91872F01F9D322307F1A925E988510A4 (RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* __this, int32_t ___0_rxLogLevel, const RuntimeMethod* method) 
{
	{
		int32_t L_0 = ___0_rxLogLevel;
		__this->___rxLogLevel = L_0;
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void U3CU3Ec__cctor_m59D4468D8FFA0B2144EC279908DE7A2A080FFEA5 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB* L_0 = (U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB*)il2cpp_codegen_object_new(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var);
		U3CU3Ec__ctor_m602BFE7FC3B8E3FF2125D62B7E3B247EF1BC1981(L_0, NULL);
		((U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_StaticFields*)il2cpp_codegen_static_fields_for(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var))->___U3CU3E9 = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_StaticFields*)il2cpp_codegen_static_fields_for(U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB_il2cpp_TypeInfo_var))->___U3CU3E9), (void*)L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void U3CU3Ec__ctor_m602BFE7FC3B8E3FF2125D62B7E3B247EF1BC1981 (U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void U3CU3Ec_U3C_ctorU3Eb__32_0_m25131328C75E636B683694D09104AE3C2E8EDD72 (U3CU3Ec_t1B3AF3AC58BA3AB2B7ECBF9D79AF04776DE394CB* __this, RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* ___0_obj, JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* ___1_writer, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral054CEB307D5C07A45B77830C65BED23F89D65179);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral12EBBA3AB49FD6DE67070D2F4464018D948E52C3);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral47C5DB115362FD0ECFB5E8E9A93E894085ADB5F4);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral495C990A791B2C40CEC4B2EEE42829D02EB6090A);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral7E341A2D789505292ED5E8185688D5E724F214C2);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral80F5C93D7D1A75B619CA6EB5616A6123A15789FF);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralC8D14F11493A217A7CE33C6522B70404C50681E3);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralD97CFC38956F8E5A11AEDE75B2BFA5C64B223CF8);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralDE3B6A2C5E593C426C45B02FECD2C46E1E2F8E33);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralF33A1DE1A23F6582648240EE4650A24DD2EFE8E9);
		s_Il2CppMethodInitialized = true;
	}
	{
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_0 = ___1_writer;
		VirtualActionInvoker0::Invoke(15, L_0);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_1 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_1, _stringLiteralDE3B6A2C5E593C426C45B02FECD2C46E1E2F8E33);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_2 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_3 = ___0_obj;
		String_t* L_4 = L_3->___appToken;
		VirtualActionInvoker1< String_t* >::Invoke(10, L_2, L_4);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_5 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_5, _stringLiteral80F5C93D7D1A75B619CA6EB5616A6123A15789FF);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_6 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_7 = ___0_obj;
		String_t* L_8 = L_7->___environment;
		VirtualActionInvoker1< String_t* >::Invoke(10, L_6, L_8);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_9 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_9, _stringLiteral12EBBA3AB49FD6DE67070D2F4464018D948E52C3);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_10 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_11 = ___0_obj;
		bool L_12 = L_11->___eventBufferingEnabled;
		VirtualActionInvoker1< bool >::Invoke(4, L_10, L_12);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_13 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_13, _stringLiteralD97CFC38956F8E5A11AEDE75B2BFA5C64B223CF8);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_14 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_15 = ___0_obj;
		bool L_16 = L_15->___sendInBackground;
		VirtualActionInvoker1< bool >::Invoke(4, L_14, L_16);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_17 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_17, _stringLiteralF33A1DE1A23F6582648240EE4650A24DD2EFE8E9);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_18 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_19 = ___0_obj;
		double L_20 = L_19->___delayStart;
		VirtualActionInvoker1< double >::Invoke(6, L_18, L_20);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_21 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_21, _stringLiteral495C990A791B2C40CEC4B2EEE42829D02EB6090A);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_22 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_23 = ___0_obj;
		String_t* L_24 = L_23->___externalDeviceId;
		VirtualActionInvoker1< String_t* >::Invoke(10, L_22, L_24);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_25 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_25, _stringLiteral47C5DB115362FD0ECFB5E8E9A93E894085ADB5F4);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_26 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_27 = ___0_obj;
		bool L_28 = L_27->___preinstallTrackingEnabled;
		VirtualActionInvoker1< bool >::Invoke(4, L_26, L_28);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_29 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_29, _stringLiteral7E341A2D789505292ED5E8185688D5E724F214C2);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_30 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_31 = ___0_obj;
		bool L_32 = L_31->___needsCost;
		VirtualActionInvoker1< bool >::Invoke(4, L_30, L_32);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_33 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_33, _stringLiteralC8D14F11493A217A7CE33C6522B70404C50681E3);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_34 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_35 = ___0_obj;
		String_t* L_36 = L_35->___urlStrategy;
		VirtualActionInvoker1< String_t* >::Invoke(10, L_34, L_36);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_37 = ___1_writer;
		VirtualActionInvoker1< String_t* >::Invoke(16, L_37, _stringLiteral054CEB307D5C07A45B77830C65BED23F89D65179);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_38 = ___1_writer;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_39 = ___0_obj;
		int32_t L_40 = L_39->___rxLogLevel;
		VirtualActionInvoker1< int32_t >::Invoke(8, L_38, L_40);
		JsonWriter_t52BBC74752B110F073ECDC8E138A4BFCCA9C4BA4* L_41 = ___1_writer;
		VirtualActionInvoker0::Invoke(14, L_41);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustEvent__ctor_m0196CF90D47B3F29759FE0D9921C16FA32F4F9E7 (RxAdjustEvent_t986D61ED879233B31D09559DE46832AFE331F70A* __this, String_t* ___0_var1, const RuntimeMethod* method) 
{
	{
		__this->___revenue = (-1.0);
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		String_t* L_0 = ___0_var1;
		__this->___eventToken = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&__this->___eventToken), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustEventFailure__ctor_m31D1D12FAC979C493242692A76FD85E57A2817F6 (RxAdjustEventFailure_tB764C959F8DE2E8A96C2E417BAC797DB24695937* __this, const RuntimeMethod* method) 
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustEventSuccess__ctor_mC8BD2F2627BAB87E95028FDA67F0BF00C69BC139 (RxAdjustEventSuccess_t7CCF5351D1F972F1C87CC489935D8F1159461B67* __this, const RuntimeMethod* method) 
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustSessionFailure__ctor_m8D42AD53F46BF0E106910E812979FE1C5BE590D1 (RxAdjustSessionFailure_tBFABCD7EC4E691E48CDBA0C4BAD38368A7AEAE4C* __this, const RuntimeMethod* method) 
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RxAdjustSessionSuccess__ctor_m8647C062061D123BE20C404C68E0ABC41BE51FB6 (RxAdjustSessionSuccess_t2CC4EF93BBFFFFDDA0B2056EEA95D78CB9081928* __this, const RuntimeMethod* method) 
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
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_Init_mA27F3BE0C8774880F867143E99EF3CDC1E703E00 (RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* ___0_rxAdjustConfig, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* L_1 = ___0_rxAdjustConfig;
		InterfaceActionInvoker1< RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* >::Invoke(0, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_OnResume_m10F687A40C00C7F345501BB3313BC4D3A7657C48 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		InterfaceActionInvoker0::Invoke(1, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_OnPause_m169521CAC1B6964FF7CDA2C14FBD7B248C81BE01 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		InterfaceActionInvoker0::Invoke(2, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_TrackEvent_mBC0BCB4CE26B04F25ACDEE732A149653C350DD8D (RxAdjustEvent_t986D61ED879233B31D09559DE46832AFE331F70A* ___0_rxAdjustEvent, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		RxAdjustEvent_t986D61ED879233B31D09559DE46832AFE331F70A* L_1 = ___0_rxAdjustEvent;
		InterfaceActionInvoker1< RxAdjustEvent_t986D61ED879233B31D09559DE46832AFE331F70A* >::Invoke(3, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXAdjust_GetData_mCC2FBBDCBB107CC7D38D8E708079735C5DC372AA (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1;
		L_1 = InterfaceFuncInvoker0< String_t* >::Invoke(4, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_AppWillOpenUrl_m759967EE9290AF8C9E93D580C523CE6B680D4B98 (String_t* ___0_data, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_data;
		InterfaceActionInvoker1< String_t* >::Invoke(5, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_ResolveLink_m30BED2F9474E2EF45C4E1D84C11D371E467D8EBE (String_t* ___0_url, StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* ___1_arr, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_url;
		StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* L_2 = ___1_arr;
		InterfaceActionInvoker2< String_t*, StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* >::Invoke(6, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_AddSessionCallbackParameter_m2F37B870182C5669B04B4BBB7E9D23083B97FCBE (String_t* ___0_key, String_t* ___1_val, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_key;
		String_t* L_2 = ___1_val;
		InterfaceActionInvoker2< String_t*, String_t* >::Invoke(7, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_RemoveSessionCallbackParameter_m38BC8FABCD96C1CF461749EDB6B3254E01041E83 (String_t* ___0_key, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_key;
		InterfaceActionInvoker1< String_t* >::Invoke(8, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_ResetSessionCallbackParameters_m44D02D46CD5BFACE0B602B81E090F1126D7FE163 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		InterfaceActionInvoker0::Invoke(9, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_AddSessionPartnerParameter_m1D5CC1FEC6A29094639DE9EE412BFC0E799C2E4F (String_t* ___0_key, String_t* ___1_val, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_key;
		String_t* L_2 = ___1_val;
		InterfaceActionInvoker2< String_t*, String_t* >::Invoke(10, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1, L_2);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_RemoveSessionPartnerParameter_mBBD622C8933A59C6E3175B1C86F21A0B4ADDA81F (String_t* ___0_key, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		String_t* L_1 = ___0_key;
		InterfaceActionInvoker1< String_t* >::Invoke(11, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0, L_1);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_ResetSessionPartnerParameters_mA6A89371281E8546964905BA137418B16FB4CB41 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		InterfaceActionInvoker0::Invoke(12, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust_SendFirstPackages_m98C348EBEDE652E22C8F91F9E147BF9B4B1BDDA3 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		InterfaceActionInvoker0::Invoke(13, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* RXAdjust_GetAttribution_m8BC5BBD39524AC8B20688CAF51399D58AC9A1854 (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		il2cpp_codegen_runtime_class_init_inline(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		RuntimeObject* L_0 = ((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk;
		RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* L_1;
		L_1 = InterfaceFuncInvoker0< RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* >::Invoke(14, IRXAdjust_t2D57FFE7387F03029D4100D3A2DA3FA76ED1B1E3_il2cpp_TypeInfo_var, L_0);
		return L_1;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjust__cctor_m7BFE38661545F8704C1AE2985DAEAF3BA0458DFC (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* L_0 = (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602*)il2cpp_codegen_object_new(RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602_il2cpp_TypeInfo_var);
		RXAdjustNotSupport__ctor_m1B4BF83CF249902935D338A34228442AB3ED3CA0(L_0, NULL);
		((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_StaticFields*)il2cpp_codegen_static_fields_for(RXAdjust_t56A20B5A144E8BC86B1E5D791BCC8967C807EF81_il2cpp_TypeInfo_var))->____sdk), (void*)L_0);
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
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_Init_mA5E87C82E29B3F33A124242DFC08B7A5472148E3 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, RxAdjustConfig_t0181CE1172A2EAA8CCBD91F277B1787F0E2D87CE* ___0_rxAdjustConfig, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral3C74EE53B1AF65557F9BDF1EAF0C416BADC79DB9);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral3C74EE53B1AF65557F9BDF1EAF0C416BADC79DB9, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_OnResume_m378D0402098D15794D1F6B1CFE85F77FB889E505 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral2017290B58803666B9D4AD5EB9F9BF52345C9285);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral2017290B58803666B9D4AD5EB9F9BF52345C9285, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_OnPause_mA7CBC677501C0A1866B9C135C29644A3E8737673 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral5B9A9DFD98762595F0C77843A5E01B4CFCEE395A);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral5B9A9DFD98762595F0C77843A5E01B4CFCEE395A, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_TrackEvent_m9F945C5BE41B0B9B4D1FC0270E188A867804E2B8 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, RxAdjustEvent_t986D61ED879233B31D09559DE46832AFE331F70A* ___0_rxAdjustEvent, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral21A930BD189C83C0D76EDA1B4B2D5A6622FFBE0F);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral21A930BD189C83C0D76EDA1B4B2D5A6622FFBE0F, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR String_t* RXAdjustNotSupport_GetData_mEE08408A190B9AAA1FE053E3EB356D3300326A46 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral6E6C18EDE843369A99EF66BA5108FA1E7AA8FD81);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralDA39A3EE5E6B4B0D3255BFEF95601890AFD80709);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral6E6C18EDE843369A99EF66BA5108FA1E7AA8FD81, NULL);
		return _stringLiteralDA39A3EE5E6B4B0D3255BFEF95601890AFD80709;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_AppWillOpenUrl_m0D1A254A499DDA9A353C1654799D995FAD15EC8E (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, String_t* ___0_data, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralC02FF05EF85D2BB8BF3F59FD39CACD8586595766);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralC02FF05EF85D2BB8BF3F59FD39CACD8586595766, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_ResolveLink_mDAEE7B3013EA6626946C324709931A450AD284BB (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, String_t* ___0_url, StringU5BU5D_t7674CD946EC0CE7B3AE0BE70E6EE85F2ECD9F248* ___1_arr, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralFF5437B70E75CEBDEDEAA72C5146790EA0D48D74);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralFF5437B70E75CEBDEDEAA72C5146790EA0D48D74, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_AddSessionCallbackParameter_mC336037E763B08A4A4DCB23D6B177E29C46C3F5C (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, String_t* ___0_key, String_t* ___1_val, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral905BE2C061FC057817F49D9F2E106C1982F82949);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral905BE2C061FC057817F49D9F2E106C1982F82949, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_RemoveSessionCallbackParameter_m6A70C556E4B23C64C45837AD3F26E6012EA23D33 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, String_t* ___0_key, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteralCCCDF6DDDE85AE25C01B4F6F0E15D31FF28AA2AB);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteralCCCDF6DDDE85AE25C01B4F6F0E15D31FF28AA2AB, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_ResetSessionCallbackParameters_m07D346A04FFD625BC166D6FF4AAE456AF2C1AE9A (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral68C68AD7967ED4BF155A3CFA96B71B8567927BF6);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral68C68AD7967ED4BF155A3CFA96B71B8567927BF6, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_AddSessionPartnerParameter_mF83188763AD8C9604F832043DD7C05F0BC5FFD26 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, String_t* ___0_key, String_t* ___1_val, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral8E95218C2581DC22D3A227EA4F3574901140D0D4);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral8E95218C2581DC22D3A227EA4F3574901140D0D4, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_RemoveSessionPartnerParameter_mC39379C1044EA88B7B0615B5976889621EF9D2C8 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, String_t* ___0_key, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral4B8E43025AA50BBDA47F8348E8D11B94659B027A);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral4B8E43025AA50BBDA47F8348E8D11B94659B027A, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_ResetSessionPartnerParameters_m858C8C6CD13A1870DEAF75E423BC0D64F44581AB (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral49668966BD86E02A4AFB16C55B364B3F72F8B27A);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral49668966BD86E02A4AFB16C55B364B3F72F8B27A, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport_SendFirstPackages_m512236638E9EF873725D7D2E514EDF1A93BED318 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral20F616F9A41CDD7032F779F9A6AE28C2C38E4206);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral20F616F9A41CDD7032F779F9A6AE28C2C38E4206, NULL);
		return;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A* RXAdjustNotSupport_GetAttribution_m3A614BCB62A862008220F9A2495F6723735A86E0 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&_stringLiteral01E730127C088326891582B75A775E355EBED894);
		s_Il2CppMethodInitialized = true;
	}
	{
		LogUtil_WarningNotSupport_m89B70D233EF71969332EE8B3C35BF968C8659ED9(_stringLiteral01E730127C088326891582B75A775E355EBED894, NULL);
		return (RxAdjustAttribution_t0134122757B490F94AB33B9969631F404E7E486A*)NULL;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void RXAdjustNotSupport__ctor_m1B4BF83CF249902935D338A34228442AB3ED3CA0 (RXAdjustNotSupport_tC0C41B0AEFC698DBF32429373DF463FAD63C2602* __this, const RuntimeMethod* method) 
{
	{
		Object__ctor_mE837C6B9FA8C6D5D109F4B2EC885D79919AC0EA2(__this, NULL);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
