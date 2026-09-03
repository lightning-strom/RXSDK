package com.ruixue.sdk;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class ExampleUnitTest {

    @Test
    public void fillDefaultHqType_whenMissing_usesXuteng() {
        Map<String, Object> params = new HashMap<>();

        DFBillingImpl.fillDefaultHqType(params);

        assertEquals("xuteng", params.get("hq_type"));
    }

    @Test
    public void fillDefaultHqType_whenPresent_keepsExistingValue() {
        Map<String, Object> params = new HashMap<>();
        params.put("hq_type", "custom");

        DFBillingImpl.fillDefaultHqType(params);

        assertEquals("custom", params.get("hq_type"));
    }

    @Test
    public void normalizeRoleLevel_parsesPositiveLevel() {
        assertEquals(23, DFSdkApiImpl.normalizeRoleLevel("23"));
    }

    @Test
    public void normalizeRoleLevel_invalidOrNonPositive_fallsBackToOne() {
        assertEquals(1, DFSdkApiImpl.normalizeRoleLevel("invalid"));
        assertEquals(1, DFSdkApiImpl.normalizeRoleLevel("0"));
    }
}