package com.ruixue.demo.gamearea;

import androidx.annotation.NonNull;

public class GameAreaTestFormData {

    public final String areaId;
    public final String areaName;
    public final String areaStatus;
    public final String areaType;
    public final String areaGuild;
    public final String areaPower;
    public final String characterId;
    public final String characterName;
    public final String characterLevel;
    public final String characterFaction;
    public final String characterProfession;
    public final String characterStatus;
    public final String characterType;
    public final String characterVipLevel;
    public final String cpUserId;

    public GameAreaTestFormData(@NonNull String areaId,
                                @NonNull String areaName,
                                @NonNull String areaStatus,
                                @NonNull String areaType,
                                @NonNull String areaGuild,
                                @NonNull String areaPower,
                                @NonNull String characterId,
                                @NonNull String characterName,
                                @NonNull String characterLevel,
                                @NonNull String characterFaction,
                                @NonNull String characterProfession,
                                @NonNull String characterStatus,
                                @NonNull String characterType,
                                @NonNull String characterVipLevel,
                                @NonNull String cpUserId) {
        this.areaId = safe(areaId, "1001");
        this.areaName = safe(areaName, "New Area");
        this.areaStatus = safe(areaStatus, "active");
        this.areaType = safe(areaType, "PVE");
        this.areaGuild = safe(areaGuild, "Mighty Warriors");
        this.areaPower = safe(areaPower, "5000");
        this.characterId = safe(characterId, "char12345");
        this.characterName = safe(characterName, "Hero123");
        this.characterLevel = safe(characterLevel, "50");
        this.characterFaction = safe(characterFaction, "Alliance");
        this.characterProfession = safe(characterProfession, "Mage");
        this.characterStatus = safe(characterStatus, "active");
        this.characterType = safe(characterType, "Standard");
        this.characterVipLevel = safe(characterVipLevel, "VIP5");
        this.cpUserId = safe(cpUserId, "user789");
    }

    @NonNull
    public java.util.Map<String, Object> buildExtension() {
        java.util.Map<String, Object> extension = new java.util.HashMap<>();
        extension.put("guild", areaGuild);
        extension.put("power", getAreaPowerValue());
        return extension;
    }

    public int getAreaPowerValue() {
        try {
            return Integer.parseInt(areaPower.trim());
        } catch (Exception ignore) {
            return 5000;
        }
    }

    @NonNull
    private static String safe(@NonNull String value, @NonNull String fallback) {
        String result = value.trim();
        return result.isEmpty() ? fallback : result;
    }
}
