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

struct Dictionary_2_t14FE4A752A83D53771C584E4C8D14E01F2AFD7BA;
struct Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B;
struct HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF;
struct HashSet_1_t2F33BEB06EEA4A872E2FAF464382422AA39AE885;
struct IEnumerable_1_t4E33AE80EB833E4E5C63CBE4E5B9DD8DB10B24B4;
struct IEqualityComparer_1_tEE4D3FB93D9675E4FBAB3721DAD93744997E2781;
struct IEqualityComparer_1_tAE94C8F24AD5B94D4EE85CA9FC59E3409D41CAF7;
struct KeyCollection_t3621516C1F044CBE908201327DB95E5EBB068414;
struct List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D;
struct ValueCollection_tFD39059B9A8214CD1930CB1EEBED9E26D277F611;
struct EntryU5BU5D_t30E3AC645E949CF91927AEB0F9CB0CEA1D96A092;
struct SlotU5BU5D_tD46D6B1ACC01CB5C36D20A149F2DFB578BDD97E6;
struct Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C;
struct MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593;
struct IMtkAppViewEventCallback_t48384141FF6E80B198F9E9995BA55303AEE74435;
struct SerializationInfo_t3C47F63E24BEB9FCE2DC6309E027F238DC5C5E37;
struct String_t;

IL2CPP_EXTERN_C RuntimeClass* Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* IMtkAppViewEventCallback_t48384141FF6E80B198F9E9995BA55303AEE74435_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C RuntimeClass* MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_il2cpp_TypeInfo_var;
IL2CPP_EXTERN_C const RuntimeMethod* Dictionary_2_TryGetValue_m073BD2C71762989F590BDFDA4D6F94960ACCBA69_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* Dictionary_2__ctor_mD080F06D6C9B3644C7B7EE83CE4D2070A9146957_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* Enumerator_Dispose_m38D392F91D005D97A70E363BB76906C796962FB4_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* Enumerator_MoveNext_m39FF4E8B33F0A41B05BB2A3B73736BFE922B0E13_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* Enumerator_get_Current_m31B3B5DB06BEF188458BAF6A7AB52E71B8B6C044_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* HashSet_1_GetEnumerator_m1599728F9BECD8BF987ED37FA86065EDA15E4E7A_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* List_1_AddRange_m56EB5CE1E5F4FFB7B4A71AFA641C9E8DC40A3008_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* List_1_ToArray_m7AE6CFF229095EE4556F92E6777CDEB2E1B08EE2_RuntimeMethod_var;
IL2CPP_EXTERN_C const RuntimeMethod* List_1__ctor_mBE164DE7AC98AA6A8DF591285737D081180582E8_RuntimeMethod_var;

struct MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593;

IL2CPP_EXTERN_C_BEGIN
IL2CPP_EXTERN_C_END

#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
struct U3CModuleU3E_t43CD4477AD1E48CD6F10F51293548F4B0A1E684C 
{
};
struct Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B  : public RuntimeObject
{
	Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C* ____buckets;
	EntryU5BU5D_t30E3AC645E949CF91927AEB0F9CB0CEA1D96A092* ____entries;
	int32_t ____count;
	int32_t ____freeList;
	int32_t ____freeCount;
	int32_t ____version;
	RuntimeObject* ____comparer;
	KeyCollection_t3621516C1F044CBE908201327DB95E5EBB068414* ____keys;
	ValueCollection_tFD39059B9A8214CD1930CB1EEBED9E26D277F611* ____values;
	RuntimeObject* ____syncRoot;
};
struct HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF  : public RuntimeObject
{
	Int32U5BU5D_t19C97395396A72ECAF310612F0760F165060314C* ____buckets;
	SlotU5BU5D_tD46D6B1ACC01CB5C36D20A149F2DFB578BDD97E6* ____slots;
	int32_t ____count;
	int32_t ____lastIndex;
	int32_t ____freeList;
	RuntimeObject* ____comparer;
	int32_t ____version;
	SerializationInfo_t3C47F63E24BEB9FCE2DC6309E027F238DC5C5E37* ____siInfo;
};
struct List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D  : public RuntimeObject
{
	MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* ____items;
	int32_t ____size;
	int32_t ____version;
	RuntimeObject* ____syncRoot;
};
struct MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224  : public RuntimeObject
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
struct Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41 
{
	HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF* ____set;
	int32_t ____index;
	int32_t ____version;
	RuntimeObject* ____current;
};
struct Enumerator_t72556E98D7DDBE118A973D782D523D15A96461C8 
{
	HashSet_1_t2F33BEB06EEA4A872E2FAF464382422AA39AE885* ____set;
	int32_t ____index;
	int32_t ____version;
	RuntimeObject* ____current;
};
struct Boolean_t09A6377A54BE2F9E6985A8149F19234FD7DDFE22 
{
	bool ___m_value;
};
struct Vector2_t1FD6F485C871E832B347AB2DC8CBA08B739D8DF7 
{
	float ___x;
	float ___y;
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
struct MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0 
{
	int32_t ___touchID;
	Vector2_t1FD6F485C871E832B347AB2DC8CBA08B739D8DF7 ___touchUV;
	int32_t ___touchPhase;
};
struct List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D_StaticFields
{
	MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* ___s_emptyArray;
};
struct MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_StaticFields
{
	Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B* ___mtkAppViewEventCallbacks;
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
struct MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593  : public RuntimeArray
{
	ALIGN_FIELD (8) MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0 m_Items[1];

	inline MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0 GetAt(il2cpp_array_size_t index) const
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items[index];
	}
	inline MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0* GetAddressAt(il2cpp_array_size_t index)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		return m_Items + index;
	}
	inline void SetAt(il2cpp_array_size_t index, MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0 value)
	{
		IL2CPP_ARRAY_BOUNDS_CHECK(index, (uint32_t)(this)->max_length);
		m_Items[index] = value;
	}
	inline MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0 GetAtUnchecked(il2cpp_array_size_t index) const
	{
		return m_Items[index];
	}
	inline MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0* GetAddressAtUnchecked(il2cpp_array_size_t index)
	{
		return m_Items + index;
	}
	inline void SetAtUnchecked(il2cpp_array_size_t index, MtkAppViewTouchEvent_t3A57777F8347F59D91F5E9BC5A34ABE0EF08E0D0 value)
	{
		m_Items[index] = value;
	}
};


IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void List_1__ctor_mBE164DE7AC98AA6A8DF591285737D081180582E8_gshared (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool Dictionary_2_TryGetValue_mD15380A4ED7CDEE99EA45881577D26BA9CE1B849_gshared (Dictionary_2_t14FE4A752A83D53771C584E4C8D14E01F2AFD7BA* __this, RuntimeObject* ___0_key, RuntimeObject** ___1_value, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR Enumerator_t72556E98D7DDBE118A973D782D523D15A96461C8 HashSet_1_GetEnumerator_m143B98FEED7E9CABA2C494AB2F04DAD60A504635_gshared (HashSet_1_t2F33BEB06EEA4A872E2FAF464382422AA39AE885* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Enumerator_Dispose_mFB582AEAA2E73F3128B5571197BEDE256A83F657_gshared (Enumerator_t72556E98D7DDBE118A973D782D523D15A96461C8* __this, const RuntimeMethod* method) ;
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR RuntimeObject* Enumerator_get_Current_m139A176CD271A0532D75BE08DA7831C8C45CE28F_gshared_inline (Enumerator_t72556E98D7DDBE118A973D782D523D15A96461C8* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void List_1_AddRange_m56EB5CE1E5F4FFB7B4A71AFA641C9E8DC40A3008_gshared (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* __this, RuntimeObject* ___0_collection, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR bool Enumerator_MoveNext_m27565F5ACCCC75C3DD34CC4CAE3E6AEFEB9144A6_gshared (Enumerator_t72556E98D7DDBE118A973D782D523D15A96461C8* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* List_1_ToArray_m7AE6CFF229095EE4556F92E6777CDEB2E1B08EE2_gshared (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* __this, const RuntimeMethod* method) ;
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void Dictionary_2__ctor_m5B32FBC624618211EB461D59CFBB10E987FD1329_gshared (Dictionary_2_t14FE4A752A83D53771C584E4C8D14E01F2AFD7BA* __this, const RuntimeMethod* method) ;

inline void List_1__ctor_mBE164DE7AC98AA6A8DF591285737D081180582E8 (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* __this, const RuntimeMethod* method)
{
	((  void (*) (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D*, const RuntimeMethod*))List_1__ctor_mBE164DE7AC98AA6A8DF591285737D081180582E8_gshared)(__this, method);
}
inline bool Dictionary_2_TryGetValue_m073BD2C71762989F590BDFDA4D6F94960ACCBA69 (Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B* __this, String_t* ___0_key, HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF** ___1_value, const RuntimeMethod* method)
{
	return ((  bool (*) (Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B*, String_t*, HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF**, const RuntimeMethod*))Dictionary_2_TryGetValue_mD15380A4ED7CDEE99EA45881577D26BA9CE1B849_gshared)(__this, ___0_key, ___1_value, method);
}
inline Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41 HashSet_1_GetEnumerator_m1599728F9BECD8BF987ED37FA86065EDA15E4E7A (HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF* __this, const RuntimeMethod* method)
{
	return ((  Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41 (*) (HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF*, const RuntimeMethod*))HashSet_1_GetEnumerator_m143B98FEED7E9CABA2C494AB2F04DAD60A504635_gshared)(__this, method);
}
inline void Enumerator_Dispose_m38D392F91D005D97A70E363BB76906C796962FB4 (Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41* __this, const RuntimeMethod* method)
{
	((  void (*) (Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41*, const RuntimeMethod*))Enumerator_Dispose_mFB582AEAA2E73F3128B5571197BEDE256A83F657_gshared)(__this, method);
}
inline RuntimeObject* Enumerator_get_Current_m31B3B5DB06BEF188458BAF6A7AB52E71B8B6C044_inline (Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41* __this, const RuntimeMethod* method)
{
	return ((  RuntimeObject* (*) (Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41*, const RuntimeMethod*))Enumerator_get_Current_m139A176CD271A0532D75BE08DA7831C8C45CE28F_gshared_inline)(__this, method);
}
inline void List_1_AddRange_m56EB5CE1E5F4FFB7B4A71AFA641C9E8DC40A3008 (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* __this, RuntimeObject* ___0_collection, const RuntimeMethod* method)
{
	((  void (*) (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D*, RuntimeObject*, const RuntimeMethod*))List_1_AddRange_m56EB5CE1E5F4FFB7B4A71AFA641C9E8DC40A3008_gshared)(__this, ___0_collection, method);
}
inline bool Enumerator_MoveNext_m39FF4E8B33F0A41B05BB2A3B73736BFE922B0E13 (Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41* __this, const RuntimeMethod* method)
{
	return ((  bool (*) (Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41*, const RuntimeMethod*))Enumerator_MoveNext_m27565F5ACCCC75C3DD34CC4CAE3E6AEFEB9144A6_gshared)(__this, method);
}
inline MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* List_1_ToArray_m7AE6CFF229095EE4556F92E6777CDEB2E1B08EE2 (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* __this, const RuntimeMethod* method)
{
	return ((  MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* (*) (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D*, const RuntimeMethod*))List_1_ToArray_m7AE6CFF229095EE4556F92E6777CDEB2E1B08EE2_gshared)(__this, method);
}
inline void Dictionary_2__ctor_mD080F06D6C9B3644C7B7EE83CE4D2070A9146957 (Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B* __this, const RuntimeMethod* method)
{
	((  void (*) (Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B*, const RuntimeMethod*))Dictionary_2__ctor_m5B32FBC624618211EB461D59CFBB10E987FD1329_gshared)(__this, method);
}
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
#ifdef __clang__
#pragma clang diagnostic pop
#endif
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* MtkAppTouchManager_Internal_OnProcessTouchInputEvents_mD2C831CC3BE92B58AFEEB40916AF00E66C9E52AD (String_t* ___0_appPackageName, const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&Dictionary_2_TryGetValue_m073BD2C71762989F590BDFDA4D6F94960ACCBA69_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&Enumerator_Dispose_m38D392F91D005D97A70E363BB76906C796962FB4_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&Enumerator_MoveNext_m39FF4E8B33F0A41B05BB2A3B73736BFE922B0E13_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&Enumerator_get_Current_m31B3B5DB06BEF188458BAF6A7AB52E71B8B6C044_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&HashSet_1_GetEnumerator_m1599728F9BECD8BF987ED37FA86065EDA15E4E7A_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&IMtkAppViewEventCallback_t48384141FF6E80B198F9E9995BA55303AEE74435_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&List_1_AddRange_m56EB5CE1E5F4FFB7B4A71AFA641C9E8DC40A3008_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&List_1_ToArray_m7AE6CFF229095EE4556F92E6777CDEB2E1B08EE2_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&List_1__ctor_mBE164DE7AC98AA6A8DF591285737D081180582E8_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* V_0 = NULL;
	HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF* V_1 = NULL;
	bool V_2 = false;
	Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41 V_3;
	memset((&V_3), 0, sizeof(V_3));
	RuntimeObject* V_4 = NULL;
	MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* V_5 = NULL;
	{
		List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* L_0 = (List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D*)il2cpp_codegen_object_new(List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D_il2cpp_TypeInfo_var);
		List_1__ctor_mBE164DE7AC98AA6A8DF591285737D081180582E8(L_0, List_1__ctor_mBE164DE7AC98AA6A8DF591285737D081180582E8_RuntimeMethod_var);
		V_0 = L_0;
		il2cpp_codegen_runtime_class_init_inline(MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_il2cpp_TypeInfo_var);
		Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B* L_1 = ((MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_StaticFields*)il2cpp_codegen_static_fields_for(MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_il2cpp_TypeInfo_var))->___mtkAppViewEventCallbacks;
		String_t* L_2 = ___0_appPackageName;
		NullCheck(L_1);
		bool L_3;
		L_3 = Dictionary_2_TryGetValue_m073BD2C71762989F590BDFDA4D6F94960ACCBA69(L_1, L_2, (&V_1), Dictionary_2_TryGetValue_m073BD2C71762989F590BDFDA4D6F94960ACCBA69_RuntimeMethod_var);
		V_2 = L_3;
		bool L_4 = V_2;
		if (!L_4)
		{
			goto IL_0057;
		}
	}
	{
		HashSet_1_t8F6878B628F77AA99D047FA5ACF4A03C84B2E9BF* L_5 = V_1;
		NullCheck(L_5);
		Enumerator_t51E1CC2BDDDE074F766C808E8B34892F37D4BE41 L_6;
		L_6 = HashSet_1_GetEnumerator_m1599728F9BECD8BF987ED37FA86065EDA15E4E7A(L_5, HashSet_1_GetEnumerator_m1599728F9BECD8BF987ED37FA86065EDA15E4E7A_RuntimeMethod_var);
		V_3 = L_6;
	}
	{
		auto __finallyBlock = il2cpp::utils::Finally([&]
		{

FINALLY_0047:
			{
				Enumerator_Dispose_m38D392F91D005D97A70E363BB76906C796962FB4((&V_3), Enumerator_Dispose_m38D392F91D005D97A70E363BB76906C796962FB4_RuntimeMethod_var);
				return;
			}
		});
		try
		{
			{
				goto IL_003c_1;
			}

IL_0023_1:
			{
				RuntimeObject* L_7;
				L_7 = Enumerator_get_Current_m31B3B5DB06BEF188458BAF6A7AB52E71B8B6C044_inline((&V_3), Enumerator_get_Current_m31B3B5DB06BEF188458BAF6A7AB52E71B8B6C044_RuntimeMethod_var);
				V_4 = L_7;
				List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* L_8 = V_0;
				RuntimeObject* L_9 = V_4;
				NullCheck(L_9);
				List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* L_10;
				L_10 = InterfaceFuncInvoker0< List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* >::Invoke(0, IMtkAppViewEventCallback_t48384141FF6E80B198F9E9995BA55303AEE74435_il2cpp_TypeInfo_var, L_9);
				NullCheck(L_8);
				List_1_AddRange_m56EB5CE1E5F4FFB7B4A71AFA641C9E8DC40A3008(L_8, L_10, List_1_AddRange_m56EB5CE1E5F4FFB7B4A71AFA641C9E8DC40A3008_RuntimeMethod_var);
			}

IL_003c_1:
			{
				bool L_11;
				L_11 = Enumerator_MoveNext_m39FF4E8B33F0A41B05BB2A3B73736BFE922B0E13((&V_3), Enumerator_MoveNext_m39FF4E8B33F0A41B05BB2A3B73736BFE922B0E13_RuntimeMethod_var);
				if (L_11)
				{
					goto IL_0023_1;
				}
			}
			{
				goto IL_0056;
			}
		}
		catch(Il2CppExceptionWrapper& e)
		{
			__finallyBlock.StoreException(e.ex);
		}
	}

IL_0056:
	{
	}

IL_0057:
	{
		List_1_t44D17504F0616D4DCADD7AB0B61FE45651346C7D* L_12 = V_0;
		NullCheck(L_12);
		MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* L_13;
		L_13 = List_1_ToArray_m7AE6CFF229095EE4556F92E6777CDEB2E1B08EE2(L_12, List_1_ToArray_m7AE6CFF229095EE4556F92E6777CDEB2E1B08EE2_RuntimeMethod_var);
		V_5 = L_13;
		goto IL_0061;
	}

IL_0061:
	{
		MtkAppViewTouchEventU5BU5D_tC01C800F3342206F3E39AAB235FBD4AC1A649593* L_14 = V_5;
		return L_14;
	}
}
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void MtkAppTouchManager__cctor_m950E2A5B0B5D772108D8F5DB59F6AD3C489150FB (const RuntimeMethod* method) 
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&Dictionary_2__ctor_mD080F06D6C9B3644C7B7EE83CE4D2070A9146957_RuntimeMethod_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B_il2cpp_TypeInfo_var);
		il2cpp_codegen_initialize_runtime_metadata((uintptr_t*)&MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_il2cpp_TypeInfo_var);
		s_Il2CppMethodInitialized = true;
	}
	{
		Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B* L_0 = (Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B*)il2cpp_codegen_object_new(Dictionary_2_t49C86A47D504F19CB4D76FC88754CA82F2986B2B_il2cpp_TypeInfo_var);
		Dictionary_2__ctor_mD080F06D6C9B3644C7B7EE83CE4D2070A9146957(L_0, Dictionary_2__ctor_mD080F06D6C9B3644C7B7EE83CE4D2070A9146957_RuntimeMethod_var);
		((MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_StaticFields*)il2cpp_codegen_static_fields_for(MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_il2cpp_TypeInfo_var))->___mtkAppViewEventCallbacks = L_0;
		Il2CppCodeGenWriteBarrier((void**)(&((MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_StaticFields*)il2cpp_codegen_static_fields_for(MtkAppTouchManager_t6850369E073FBF1DA5ECCB00FA270D39EEA40224_il2cpp_TypeInfo_var))->___mtkAppViewEventCallbacks), (void*)L_0);
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
IL2CPP_MANAGED_FORCE_INLINE IL2CPP_METHOD_ATTR RuntimeObject* Enumerator_get_Current_m139A176CD271A0532D75BE08DA7831C8C45CE28F_gshared_inline (Enumerator_t72556E98D7DDBE118A973D782D523D15A96461C8* __this, const RuntimeMethod* method) 
{
	{
		RuntimeObject* L_0 = __this->____current;
		return L_0;
	}
}
