package org.gradle.accessors.dm;

import org.gradle.api.NonNullApi;
import org.gradle.api.artifacts.MinimalExternalModuleDependency;
import org.gradle.plugin.use.PluginDependency;
import org.gradle.api.artifacts.ExternalModuleDependencyBundle;
import org.gradle.api.artifacts.MutableVersionConstraint;
import org.gradle.api.provider.Provider;
import org.gradle.api.model.ObjectFactory;
import org.gradle.api.provider.ProviderFactory;
import org.gradle.api.internal.catalog.AbstractExternalDependencyFactory;
import org.gradle.api.internal.catalog.DefaultVersionCatalog;
import java.util.Map;
import javax.inject.Inject;

/**
 * A catalog of dependencies accessible via the `libs` extension.
*/
@NonNullApi
public class LibrariesForLibs extends AbstractExternalDependencyFactory {

    private final AbstractExternalDependencyFactory owner = this;
    private final AuthLibraryAccessors laccForAuthLibraryAccessors = new AuthLibraryAccessors(owner);
    private final CommonsLibraryAccessors laccForCommonsLibraryAccessors = new CommonsLibraryAccessors(owner);
    private final EspressoLibraryAccessors laccForEspressoLibraryAccessors = new EspressoLibraryAccessors(owner);
    private final FirebaseLibraryAccessors laccForFirebaseLibraryAccessors = new FirebaseLibraryAccessors(owner);
    private final FlowLibraryAccessors laccForFlowLibraryAccessors = new FlowLibraryAccessors(owner);
    private final GlideLibraryAccessors laccForGlideLibraryAccessors = new GlideLibraryAccessors(owner);
    private final HmsLibraryAccessors laccForHmsLibraryAccessors = new HmsLibraryAccessors(owner);
    private final HonorLibraryAccessors laccForHonorLibraryAccessors = new HonorLibraryAccessors(owner);
    private final HttpdnsLibraryAccessors laccForHttpdnsLibraryAccessors = new HttpdnsLibraryAccessors(owner);
    private final JfsdkLibraryAccessors laccForJfsdkLibraryAccessors = new JfsdkLibraryAccessors(owner);
    private final JsonLibraryAccessors laccForJsonLibraryAccessors = new JsonLibraryAccessors(owner);
    private final KotlinxLibraryAccessors laccForKotlinxLibraryAccessors = new KotlinxLibraryAccessors(owner);
    private final LegacyLibraryAccessors laccForLegacyLibraryAccessors = new LegacyLibraryAccessors(owner);
    private final MockitoLibraryAccessors laccForMockitoLibraryAccessors = new MockitoLibraryAccessors(owner);
    private final NavigationLibraryAccessors laccForNavigationLibraryAccessors = new NavigationLibraryAccessors(owner);
    private final NirvanaLibraryAccessors laccForNirvanaLibraryAccessors = new NirvanaLibraryAccessors(owner);
    private final OaidLibraryAccessors laccForOaidLibraryAccessors = new OaidLibraryAccessors(owner);
    private final OperateLibraryAccessors laccForOperateLibraryAccessors = new OperateLibraryAccessors(owner);
    private final OppoLibraryAccessors laccForOppoLibraryAccessors = new OppoLibraryAccessors(owner);
    private final PlayLibraryAccessors laccForPlayLibraryAccessors = new PlayLibraryAccessors(owner);
    private final QmfLibraryAccessors laccForQmfLibraryAccessors = new QmfLibraryAccessors(owner);
    private final SupportLibraryAccessors laccForSupportLibraryAccessors = new SupportLibraryAccessors(owner);
    private final TestLibraryAccessors laccForTestLibraryAccessors = new TestLibraryAccessors(owner);
    private final ToponLibraryAccessors laccForToponLibraryAccessors = new ToponLibraryAccessors(owner);
    private final VivoLibraryAccessors laccForVivoLibraryAccessors = new VivoLibraryAccessors(owner);
    private final XiaomiLibraryAccessors laccForXiaomiLibraryAccessors = new XiaomiLibraryAccessors(owner);
    private final ZxingLibraryAccessors laccForZxingLibraryAccessors = new ZxingLibraryAccessors(owner);
    private final VersionAccessors vaccForVersionAccessors = new VersionAccessors(providers, config);
    private final BundleAccessors baccForBundleAccessors = new BundleAccessors(objects, providers, config);
    private final PluginAccessors paccForPluginAccessors = new PluginAccessors(providers, config);

    @Inject
    public LibrariesForLibs(DefaultVersionCatalog config, ProviderFactory providers, ObjectFactory objects) {
        super(config, providers, objects);
    }

        /**
         * Creates a dependency provider for annotation (androidx.annotation:annotation)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getAnnotation() { return create("annotation"); }

        /**
         * Creates a dependency provider for appcompat (androidx.appcompat:appcompat)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getAppcompat() { return create("appcompat"); }

        /**
         * Creates a dependency provider for butterknife (com.jakewharton:butterknife)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getButterknife() { return create("butterknife"); }

        /**
         * Creates a dependency provider for constraintlayout (androidx.constraintlayout:constraintlayout)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getConstraintlayout() { return create("constraintlayout"); }

        /**
         * Creates a dependency provider for eventbus (org.greenrobot:eventbus)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getEventbus() { return create("eventbus"); }

        /**
         * Creates a dependency provider for gdt (com.qq:gdt)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getGdt() { return create("gdt"); }

        /**
         * Creates a dependency provider for gson (com.google.code.gson:gson)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getGson() { return create("gson"); }

        /**
         * Creates a dependency provider for junit (junit:junit)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getJunit() { return create("junit"); }

        /**
         * Creates a dependency provider for material (com.google.android.material:material)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getMaterial() { return create("material"); }

        /**
         * Creates a dependency provider for multidex (androidx.multidex:multidex)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getMultidex() { return create("multidex"); }

        /**
         * Creates a dependency provider for okhttp (com.squareup.okhttp3:okhttp)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getOkhttp() { return create("okhttp"); }

        /**
         * Creates a dependency provider for timber (com.jakewharton.timber:timber)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getTimber() { return create("timber"); }

        /**
         * Creates a dependency provider for truth (com.google.truth:truth)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getTruth() { return create("truth"); }

        /**
         * Creates a dependency provider for volley (com.android.volley:volley)
         * This dependency was declared in catalog libs.versions.toml
         */
        public Provider<MinimalExternalModuleDependency> getVolley() { return create("volley"); }

    /**
     * Returns the group of libraries at auth
     */
    public AuthLibraryAccessors getAuth() { return laccForAuthLibraryAccessors; }

    /**
     * Returns the group of libraries at commons
     */
    public CommonsLibraryAccessors getCommons() { return laccForCommonsLibraryAccessors; }

    /**
     * Returns the group of libraries at espresso
     */
    public EspressoLibraryAccessors getEspresso() { return laccForEspressoLibraryAccessors; }

    /**
     * Returns the group of libraries at firebase
     */
    public FirebaseLibraryAccessors getFirebase() { return laccForFirebaseLibraryAccessors; }

    /**
     * Returns the group of libraries at flow
     */
    public FlowLibraryAccessors getFlow() { return laccForFlowLibraryAccessors; }

    /**
     * Returns the group of libraries at glide
     */
    public GlideLibraryAccessors getGlide() { return laccForGlideLibraryAccessors; }

    /**
     * Returns the group of libraries at hms
     */
    public HmsLibraryAccessors getHms() { return laccForHmsLibraryAccessors; }

    /**
     * Returns the group of libraries at honor
     */
    public HonorLibraryAccessors getHonor() { return laccForHonorLibraryAccessors; }

    /**
     * Returns the group of libraries at httpdns
     */
    public HttpdnsLibraryAccessors getHttpdns() { return laccForHttpdnsLibraryAccessors; }

    /**
     * Returns the group of libraries at jfsdk
     */
    public JfsdkLibraryAccessors getJfsdk() { return laccForJfsdkLibraryAccessors; }

    /**
     * Returns the group of libraries at json
     */
    public JsonLibraryAccessors getJson() { return laccForJsonLibraryAccessors; }

    /**
     * Returns the group of libraries at kotlinx
     */
    public KotlinxLibraryAccessors getKotlinx() { return laccForKotlinxLibraryAccessors; }

    /**
     * Returns the group of libraries at legacy
     */
    public LegacyLibraryAccessors getLegacy() { return laccForLegacyLibraryAccessors; }

    /**
     * Returns the group of libraries at mockito
     */
    public MockitoLibraryAccessors getMockito() { return laccForMockitoLibraryAccessors; }

    /**
     * Returns the group of libraries at navigation
     */
    public NavigationLibraryAccessors getNavigation() { return laccForNavigationLibraryAccessors; }

    /**
     * Returns the group of libraries at nirvana
     */
    public NirvanaLibraryAccessors getNirvana() { return laccForNirvanaLibraryAccessors; }

    /**
     * Returns the group of libraries at oaid
     */
    public OaidLibraryAccessors getOaid() { return laccForOaidLibraryAccessors; }

    /**
     * Returns the group of libraries at operate
     */
    public OperateLibraryAccessors getOperate() { return laccForOperateLibraryAccessors; }

    /**
     * Returns the group of libraries at oppo
     */
    public OppoLibraryAccessors getOppo() { return laccForOppoLibraryAccessors; }

    /**
     * Returns the group of libraries at play
     */
    public PlayLibraryAccessors getPlay() { return laccForPlayLibraryAccessors; }

    /**
     * Returns the group of libraries at qmf
     */
    public QmfLibraryAccessors getQmf() { return laccForQmfLibraryAccessors; }

    /**
     * Returns the group of libraries at support
     */
    public SupportLibraryAccessors getSupport() { return laccForSupportLibraryAccessors; }

    /**
     * Returns the group of libraries at test
     */
    public TestLibraryAccessors getTest() { return laccForTestLibraryAccessors; }

    /**
     * Returns the group of libraries at topon
     */
    public ToponLibraryAccessors getTopon() { return laccForToponLibraryAccessors; }

    /**
     * Returns the group of libraries at vivo
     */
    public VivoLibraryAccessors getVivo() { return laccForVivoLibraryAccessors; }

    /**
     * Returns the group of libraries at xiaomi
     */
    public XiaomiLibraryAccessors getXiaomi() { return laccForXiaomiLibraryAccessors; }

    /**
     * Returns the group of libraries at zxing
     */
    public ZxingLibraryAccessors getZxing() { return laccForZxingLibraryAccessors; }

    /**
     * Returns the group of versions at versions
     */
    public VersionAccessors getVersions() { return vaccForVersionAccessors; }

    /**
     * Returns the group of bundles at bundles
     */
    public BundleAccessors getBundles() { return baccForBundleAccessors; }

    /**
     * Returns the group of plugins at plugins
     */
    public PluginAccessors getPlugins() { return paccForPluginAccessors; }

    public static class AuthLibraryAccessors extends SubDependencyFactory {
        private final AuthNumberLibraryAccessors laccForAuthNumberLibraryAccessors = new AuthNumberLibraryAccessors(owner);

        public AuthLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Returns the group of libraries at auth.number
         */
        public AuthNumberLibraryAccessors getNumber() { return laccForAuthNumberLibraryAccessors; }

    }

    public static class AuthNumberLibraryAccessors extends SubDependencyFactory {

        public AuthNumberLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for product (com.mobile.auth:auth_number_product)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getProduct() { return create("auth.number.product"); }

    }

    public static class CommonsLibraryAccessors extends SubDependencyFactory {

        public CommonsLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for codec (commons-codec:commons-codec)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCodec() { return create("commons.codec"); }

    }

    public static class EspressoLibraryAccessors extends SubDependencyFactory {

        public EspressoLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for core (androidx.test.espresso:espresso-core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("espresso.core"); }

    }

    public static class FirebaseLibraryAccessors extends SubDependencyFactory {
        private final FirebaseMessagingLibraryAccessors laccForFirebaseMessagingLibraryAccessors = new FirebaseMessagingLibraryAccessors(owner);

        public FirebaseLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for bom (com.google.firebase:firebase-bom)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getBom() { return create("firebase.bom"); }

        /**
         * Returns the group of libraries at firebase.messaging
         */
        public FirebaseMessagingLibraryAccessors getMessaging() { return laccForFirebaseMessagingLibraryAccessors; }

    }

    public static class FirebaseMessagingLibraryAccessors extends SubDependencyFactory {

        public FirebaseMessagingLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for directboot (com.google.firebase:firebase-messaging-directboot)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getDirectboot() { return create("firebase.messaging.directboot"); }

    }

    public static class FlowLibraryAccessors extends SubDependencyFactory {

        public FlowLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for layout (com.nex3z:flow-layout)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getLayout() { return create("flow.layout"); }

    }

    public static class GlideLibraryAccessors extends SubDependencyFactory implements DependencyNotationSupplier {

        public GlideLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for glide (com.github.bumptech.glide:glide)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> asProvider() { return create("glide"); }

            /**
             * Creates a dependency provider for compiler (com.github.bumptech.glide:compiler)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCompiler() { return create("glide.compiler"); }

    }

    public static class HmsLibraryAccessors extends SubDependencyFactory {
        private final HmsReplayLibraryAccessors laccForHmsReplayLibraryAccessors = new HmsReplayLibraryAccessors(owner);

        public HmsLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for analytics (com.huawei.hms:hianalytics)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getAnalytics() { return create("hms.analytics"); }

            /**
             * Creates a dependency provider for game (com.huawei.hms:game)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getGame() { return create("hms.game"); }

            /**
             * Creates a dependency provider for hwid (com.huawei.hms:hwid)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getHwid() { return create("hms.hwid"); }

            /**
             * Creates a dependency provider for iap (com.huawei.hms:iap)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getIap() { return create("hms.iap"); }

            /**
             * Creates a dependency provider for moment (com.huawei.game.moment.sdk:gamemomentsdk)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getMoment() { return create("hms.moment"); }

        /**
         * Returns the group of libraries at hms.replay
         */
        public HmsReplayLibraryAccessors getReplay() { return laccForHmsReplayLibraryAccessors; }

    }

    public static class HmsReplayLibraryAccessors extends SubDependencyFactory {

        public HmsReplayLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for common (com.huawei.game.replay:common)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCommon() { return create("hms.replay.common"); }

            /**
             * Creates a dependency provider for record (com.huawei.game.replay:replayrecord)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getRecord() { return create("hms.replay.record"); }

            /**
             * Creates a dependency provider for template (com.huawei.game.replay:replaytemplate)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getTemplate() { return create("hms.replay.template"); }

    }

    public static class HonorLibraryAccessors extends SubDependencyFactory {
        private final HonorAdsLibraryAccessors laccForHonorAdsLibraryAccessors = new HonorAdsLibraryAccessors(owner);

        public HonorLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for game (com.hihonor.mcs:game)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getGame() { return create("honor.game"); }

        /**
         * Returns the group of libraries at honor.ads
         */
        public HonorAdsLibraryAccessors getAds() { return laccForHonorAdsLibraryAccessors; }

    }

    public static class HonorAdsLibraryAccessors extends SubDependencyFactory {

        public HonorAdsLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for identifier (com.hihonor.mcs:ads-identifier)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getIdentifier() { return create("honor.ads.identifier"); }

    }

    public static class HttpdnsLibraryAccessors extends SubDependencyFactory {

        public HttpdnsLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for sdk (io.github.dnspod:httpdns-sdk)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getSdk() { return create("httpdns.sdk"); }

    }

    public static class JfsdkLibraryAccessors extends SubDependencyFactory {

        public JfsdkLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for base (com.juefeng.base:jfsdk_base)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getBase() { return create("jfsdk.base"); }

            /**
             * Creates a dependency provider for core (com.jfsdk.billing:jfsdk_core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("jfsdk.core"); }

            /**
             * Creates a dependency provider for sdk (com.jfsdk.sdk:jfsdk)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getSdk() { return create("jfsdk.sdk"); }

    }

    public static class JsonLibraryAccessors extends SubDependencyFactory {

        public JsonLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for test (org.json:json)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getTest() { return create("json.test"); }

    }

    public static class KotlinxLibraryAccessors extends SubDependencyFactory {
        private final KotlinxCoroutinesLibraryAccessors laccForKotlinxCoroutinesLibraryAccessors = new KotlinxCoroutinesLibraryAccessors(owner);

        public KotlinxLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Returns the group of libraries at kotlinx.coroutines
         */
        public KotlinxCoroutinesLibraryAccessors getCoroutines() { return laccForKotlinxCoroutinesLibraryAccessors; }

    }

    public static class KotlinxCoroutinesLibraryAccessors extends SubDependencyFactory {

        public KotlinxCoroutinesLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for core (org.jetbrains.kotlinx:kotlinx-coroutines-core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("kotlinx.coroutines.core"); }

    }

    public static class LegacyLibraryAccessors extends SubDependencyFactory {
        private final LegacySupportLibraryAccessors laccForLegacySupportLibraryAccessors = new LegacySupportLibraryAccessors(owner);

        public LegacyLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Returns the group of libraries at legacy.support
         */
        public LegacySupportLibraryAccessors getSupport() { return laccForLegacySupportLibraryAccessors; }

    }

    public static class LegacySupportLibraryAccessors extends SubDependencyFactory {

        public LegacySupportLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for v4 (androidx.legacy:legacy-support-v4)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getV4() { return create("legacy.support.v4"); }

    }

    public static class MockitoLibraryAccessors extends SubDependencyFactory {

        public MockitoLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for core (org.mockito:mockito-core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("mockito.core"); }

    }

    public static class NavigationLibraryAccessors extends SubDependencyFactory {

        public NavigationLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for fragment (androidx.navigation:navigation-fragment)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getFragment() { return create("navigation.fragment"); }

            /**
             * Creates a dependency provider for ui (androidx.navigation:navigation-ui)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getUi() { return create("navigation.ui"); }

    }

    public static class NirvanaLibraryAccessors extends SubDependencyFactory {

        public NirvanaLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for logger (com.nirvana.tools.logger:logger)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getLogger() { return create("nirvana.logger"); }

            /**
             * Creates a dependency provider for main (com.nirvana.tools.base:main)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getMain() { return create("nirvana.main"); }

    }

    public static class OaidLibraryAccessors extends SubDependencyFactory {
        private final OaidSdkLibraryAccessors laccForOaidSdkLibraryAccessors = new OaidSdkLibraryAccessors(owner);

        public OaidLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Returns the group of libraries at oaid.sdk
         */
        public OaidSdkLibraryAccessors getSdk() { return laccForOaidSdkLibraryAccessors; }

    }

    public static class OaidSdkLibraryAccessors extends SubDependencyFactory implements DependencyNotationSupplier {

        public OaidSdkLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for sdk (com.bun.miitmdid:oaid_sdk)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> asProvider() { return create("oaid.sdk"); }

            /**
             * Creates a dependency provider for v2 (com.bun.miitmdid:oaid_sdk)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getV2() { return create("oaid.sdk.v2"); }

    }

    public static class OperateLibraryAccessors extends SubDependencyFactory {

        public OperateLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for 4399 (cn.m4399.sdk:operate)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> get4399() { return create("operate.4399"); }

    }

    public static class OppoLibraryAccessors extends SubDependencyFactory {

        public OppoLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for push (com.heytap.msp:push)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getPush() { return create("oppo.push"); }

    }

    public static class PlayLibraryAccessors extends SubDependencyFactory {
        private final PlayServicesLibraryAccessors laccForPlayServicesLibraryAccessors = new PlayServicesLibraryAccessors(owner);

        public PlayLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Returns the group of libraries at play.services
         */
        public PlayServicesLibraryAccessors getServices() { return laccForPlayServicesLibraryAccessors; }

    }

    public static class PlayServicesLibraryAccessors extends SubDependencyFactory {
        private final PlayServicesAdsLibraryAccessors laccForPlayServicesAdsLibraryAccessors = new PlayServicesAdsLibraryAccessors(owner);

        public PlayServicesLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Returns the group of libraries at play.services.ads
         */
        public PlayServicesAdsLibraryAccessors getAds() { return laccForPlayServicesAdsLibraryAccessors; }

    }

    public static class PlayServicesAdsLibraryAccessors extends SubDependencyFactory {

        public PlayServicesAdsLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for identifier (com.google.android.gms:play-services-ads-identifier)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getIdentifier() { return create("play.services.ads.identifier"); }

    }

    public static class QmfLibraryAccessors extends SubDependencyFactory {

        public QmfLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for ppplugin (com.chinaums.pppay:qmf-ppplugin)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getPpplugin() { return create("qmf.ppplugin"); }

    }

    public static class SupportLibraryAccessors extends SubDependencyFactory {

        public SupportLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for v4 (com.android.support:support-v4)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getV4() { return create("support.v4"); }

    }

    public static class TestLibraryAccessors extends SubDependencyFactory {
        private final TestExtLibraryAccessors laccForTestExtLibraryAccessors = new TestExtLibraryAccessors(owner);

        public TestLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

        /**
         * Returns the group of libraries at test.ext
         */
        public TestExtLibraryAccessors getExt() { return laccForTestExtLibraryAccessors; }

    }

    public static class TestExtLibraryAccessors extends SubDependencyFactory {

        public TestExtLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for junit (androidx.test.ext:junit)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getJunit() { return create("test.ext.junit"); }

    }

    public static class ToponLibraryAccessors extends SubDependencyFactory {

        public ToponLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for banner (com.anythink.sdk:banner-tpn)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getBanner() { return create("topon.banner"); }

            /**
             * Creates a dependency provider for core (com.anythink.sdk:core-tpn)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getCore() { return create("topon.core"); }

            /**
             * Creates a dependency provider for interstitial (com.anythink.sdk:interstitial-tpn)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getInterstitial() { return create("topon.interstitial"); }

            /**
             * Creates a dependency provider for nativead (com.anythink.sdk:nativead-tpn)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getNativead() { return create("topon.nativead"); }

            /**
             * Creates a dependency provider for rewardedvideo (com.anythink.sdk:rewardedvideo-tpn)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getRewardedvideo() { return create("topon.rewardedvideo"); }

            /**
             * Creates a dependency provider for splash (com.anythink.sdk:splash-tpn)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getSplash() { return create("topon.splash"); }

    }

    public static class VivoLibraryAccessors extends SubDependencyFactory {

        public VivoLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for push (com.vivo:vivo_pushSDK)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getPush() { return create("vivo.push"); }

    }

    public static class XiaomiLibraryAccessors extends SubDependencyFactory {

        public XiaomiLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for push (com.xiaomi.push:MiPush_SDK_Client)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getPush() { return create("xiaomi.push"); }

    }

    public static class ZxingLibraryAccessors extends SubDependencyFactory implements DependencyNotationSupplier {
        private final ZxingAndroidLibraryAccessors laccForZxingAndroidLibraryAccessors = new ZxingAndroidLibraryAccessors(owner);

        public ZxingLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for zxing (com.google.zxing:core)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> asProvider() { return create("zxing"); }

        /**
         * Returns the group of libraries at zxing.android
         */
        public ZxingAndroidLibraryAccessors getAndroid() { return laccForZxingAndroidLibraryAccessors; }

    }

    public static class ZxingAndroidLibraryAccessors extends SubDependencyFactory {

        public ZxingAndroidLibraryAccessors(AbstractExternalDependencyFactory owner) { super(owner); }

            /**
             * Creates a dependency provider for embedded (com.journeyapps:zxing-android-embedded)
             * This dependency was declared in catalog libs.versions.toml
             */
            public Provider<MinimalExternalModuleDependency> getEmbedded() { return create("zxing.android.embedded"); }

    }

    public static class VersionAccessors extends VersionFactory  {

        private final AuthVersionAccessors vaccForAuthVersionAccessors = new AuthVersionAccessors(providers, config);
        private final CommonsVersionAccessors vaccForCommonsVersionAccessors = new CommonsVersionAccessors(providers, config);
        private final EspressoVersionAccessors vaccForEspressoVersionAccessors = new EspressoVersionAccessors(providers, config);
        private final FirebaseVersionAccessors vaccForFirebaseVersionAccessors = new FirebaseVersionAccessors(providers, config);
        private final FlowVersionAccessors vaccForFlowVersionAccessors = new FlowVersionAccessors(providers, config);
        private final GuavaVersionAccessors vaccForGuavaVersionAccessors = new GuavaVersionAccessors(providers, config);
        private final HmsVersionAccessors vaccForHmsVersionAccessors = new HmsVersionAccessors(providers, config);
        private final HonorVersionAccessors vaccForHonorVersionAccessors = new HonorVersionAccessors(providers, config);
        private final HttpdnsVersionAccessors vaccForHttpdnsVersionAccessors = new HttpdnsVersionAccessors(providers, config);
        private final JsonVersionAccessors vaccForJsonVersionAccessors = new JsonVersionAccessors(providers, config);
        private final KotlinVersionAccessors vaccForKotlinVersionAccessors = new KotlinVersionAccessors(providers, config);
        private final KotlinxVersionAccessors vaccForKotlinxVersionAccessors = new KotlinxVersionAccessors(providers, config);
        private final KwaisdkVersionAccessors vaccForKwaisdkVersionAccessors = new KwaisdkVersionAccessors(providers, config);
        private final LegacyVersionAccessors vaccForLegacyVersionAccessors = new LegacyVersionAccessors(providers, config);
        private final MockitoVersionAccessors vaccForMockitoVersionAccessors = new MockitoVersionAccessors(providers, config);
        private final NavigationVersionAccessors vaccForNavigationVersionAccessors = new NavigationVersionAccessors(providers, config);
        private final NearmeVersionAccessors vaccForNearmeVersionAccessors = new NearmeVersionAccessors(providers, config);
        private final NirvanaVersionAccessors vaccForNirvanaVersionAccessors = new NirvanaVersionAccessors(providers, config);
        private final OaidVersionAccessors vaccForOaidVersionAccessors = new OaidVersionAccessors(providers, config);
        private final OperateVersionAccessors vaccForOperateVersionAccessors = new OperateVersionAccessors(providers, config);
        private final OppoVersionAccessors vaccForOppoVersionAccessors = new OppoVersionAccessors(providers, config);
        private final PlayVersionAccessors vaccForPlayVersionAccessors = new PlayVersionAccessors(providers, config);
        private final ProvidersVersionAccessors vaccForProvidersVersionAccessors = new ProvidersVersionAccessors(providers, config);
        private final QmfVersionAccessors vaccForQmfVersionAccessors = new QmfVersionAccessors(providers, config);
        private final RangersVersionAccessors vaccForRangersVersionAccessors = new RangersVersionAccessors(providers, config);
        private final SignalVersionAccessors vaccForSignalVersionAccessors = new SignalVersionAccessors(providers, config);
        private final SnapVersionAccessors vaccForSnapVersionAccessors = new SnapVersionAccessors(providers, config);
        private final SupportVersionAccessors vaccForSupportVersionAccessors = new SupportVersionAccessors(providers, config);
        private final TestVersionAccessors vaccForTestVersionAccessors = new TestVersionAccessors(providers, config);
        private final ToponVersionAccessors vaccForToponVersionAccessors = new ToponVersionAccessors(providers, config);
        private final VivoVersionAccessors vaccForVivoVersionAccessors = new VivoVersionAccessors(providers, config);
        private final XiaomiVersionAccessors vaccForXiaomiVersionAccessors = new XiaomiVersionAccessors(providers, config);
        private final XutengVersionAccessors vaccForXutengVersionAccessors = new XutengVersionAccessors(providers, config);
        private final ZaloVersionAccessors vaccForZaloVersionAccessors = new ZaloVersionAccessors(providers, config);
        private final ZxingVersionAccessors vaccForZxingVersionAccessors = new ZxingVersionAccessors(providers, config);
        public VersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: annotation (1.3.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getAnnotation() { return getVersion("annotation"); }

            /**
             * Returns the version associated to this alias: appcompat (1.4.2)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getAppcompat() { return getVersion("appcompat"); }

            /**
             * Returns the version associated to this alias: brsdk (9.4.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getBrsdk() { return getVersion("brsdk"); }

            /**
             * Returns the version associated to this alias: butterknife (10.1.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getButterknife() { return getVersion("butterknife"); }

            /**
             * Returns the version associated to this alias: constraintlayout (2.1.2)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getConstraintlayout() { return getVersion("constraintlayout"); }

            /**
             * Returns the version associated to this alias: eventbus (3.3.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getEventbus() { return getVersion("eventbus"); }

            /**
             * Returns the version associated to this alias: gdt (1.9.5)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getGdt() { return getVersion("gdt"); }

            /**
             * Returns the version associated to this alias: glide (4.13.2)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getGlide() { return getVersion("glide"); }

            /**
             * Returns the version associated to this alias: gson (2.8.8)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getGson() { return getVersion("gson"); }

            /**
             * Returns the version associated to this alias: jfsdk (5.7.5)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getJfsdk() { return getVersion("jfsdk"); }

            /**
             * Returns the version associated to this alias: junit (4.+)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getJunit() { return getVersion("junit"); }

            /**
             * Returns the version associated to this alias: material (1.9.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getMaterial() { return getVersion("material"); }

            /**
             * Returns the version associated to this alias: multidex (2.0.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getMultidex() { return getVersion("multidex"); }

            /**
             * Returns the version associated to this alias: okhttp (3.12.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getOkhttp() { return getVersion("okhttp"); }

            /**
             * Returns the version associated to this alias: timber (5.0.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getTimber() { return getVersion("timber"); }

            /**
             * Returns the version associated to this alias: truth (1.2.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getTruth() { return getVersion("truth"); }

            /**
             * Returns the version associated to this alias: volley (1.2.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getVolley() { return getVersion("volley"); }

        /**
         * Returns the group of versions at versions.auth
         */
        public AuthVersionAccessors getAuth() { return vaccForAuthVersionAccessors; }

        /**
         * Returns the group of versions at versions.commons
         */
        public CommonsVersionAccessors getCommons() { return vaccForCommonsVersionAccessors; }

        /**
         * Returns the group of versions at versions.espresso
         */
        public EspressoVersionAccessors getEspresso() { return vaccForEspressoVersionAccessors; }

        /**
         * Returns the group of versions at versions.firebase
         */
        public FirebaseVersionAccessors getFirebase() { return vaccForFirebaseVersionAccessors; }

        /**
         * Returns the group of versions at versions.flow
         */
        public FlowVersionAccessors getFlow() { return vaccForFlowVersionAccessors; }

        /**
         * Returns the group of versions at versions.guava
         */
        public GuavaVersionAccessors getGuava() { return vaccForGuavaVersionAccessors; }

        /**
         * Returns the group of versions at versions.hms
         */
        public HmsVersionAccessors getHms() { return vaccForHmsVersionAccessors; }

        /**
         * Returns the group of versions at versions.honor
         */
        public HonorVersionAccessors getHonor() { return vaccForHonorVersionAccessors; }

        /**
         * Returns the group of versions at versions.httpdns
         */
        public HttpdnsVersionAccessors getHttpdns() { return vaccForHttpdnsVersionAccessors; }

        /**
         * Returns the group of versions at versions.json
         */
        public JsonVersionAccessors getJson() { return vaccForJsonVersionAccessors; }

        /**
         * Returns the group of versions at versions.kotlin
         */
        public KotlinVersionAccessors getKotlin() { return vaccForKotlinVersionAccessors; }

        /**
         * Returns the group of versions at versions.kotlinx
         */
        public KotlinxVersionAccessors getKotlinx() { return vaccForKotlinxVersionAccessors; }

        /**
         * Returns the group of versions at versions.kwaisdk
         */
        public KwaisdkVersionAccessors getKwaisdk() { return vaccForKwaisdkVersionAccessors; }

        /**
         * Returns the group of versions at versions.legacy
         */
        public LegacyVersionAccessors getLegacy() { return vaccForLegacyVersionAccessors; }

        /**
         * Returns the group of versions at versions.mockito
         */
        public MockitoVersionAccessors getMockito() { return vaccForMockitoVersionAccessors; }

        /**
         * Returns the group of versions at versions.navigation
         */
        public NavigationVersionAccessors getNavigation() { return vaccForNavigationVersionAccessors; }

        /**
         * Returns the group of versions at versions.nearme
         */
        public NearmeVersionAccessors getNearme() { return vaccForNearmeVersionAccessors; }

        /**
         * Returns the group of versions at versions.nirvana
         */
        public NirvanaVersionAccessors getNirvana() { return vaccForNirvanaVersionAccessors; }

        /**
         * Returns the group of versions at versions.oaid
         */
        public OaidVersionAccessors getOaid() { return vaccForOaidVersionAccessors; }

        /**
         * Returns the group of versions at versions.operate
         */
        public OperateVersionAccessors getOperate() { return vaccForOperateVersionAccessors; }

        /**
         * Returns the group of versions at versions.oppo
         */
        public OppoVersionAccessors getOppo() { return vaccForOppoVersionAccessors; }

        /**
         * Returns the group of versions at versions.play
         */
        public PlayVersionAccessors getPlay() { return vaccForPlayVersionAccessors; }

        /**
         * Returns the group of versions at versions.providers
         */
        public ProvidersVersionAccessors getProviders() { return vaccForProvidersVersionAccessors; }

        /**
         * Returns the group of versions at versions.qmf
         */
        public QmfVersionAccessors getQmf() { return vaccForQmfVersionAccessors; }

        /**
         * Returns the group of versions at versions.rangers
         */
        public RangersVersionAccessors getRangers() { return vaccForRangersVersionAccessors; }

        /**
         * Returns the group of versions at versions.signal
         */
        public SignalVersionAccessors getSignal() { return vaccForSignalVersionAccessors; }

        /**
         * Returns the group of versions at versions.snap
         */
        public SnapVersionAccessors getSnap() { return vaccForSnapVersionAccessors; }

        /**
         * Returns the group of versions at versions.support
         */
        public SupportVersionAccessors getSupport() { return vaccForSupportVersionAccessors; }

        /**
         * Returns the group of versions at versions.test
         */
        public TestVersionAccessors getTest() { return vaccForTestVersionAccessors; }

        /**
         * Returns the group of versions at versions.topon
         */
        public ToponVersionAccessors getTopon() { return vaccForToponVersionAccessors; }

        /**
         * Returns the group of versions at versions.vivo
         */
        public VivoVersionAccessors getVivo() { return vaccForVivoVersionAccessors; }

        /**
         * Returns the group of versions at versions.xiaomi
         */
        public XiaomiVersionAccessors getXiaomi() { return vaccForXiaomiVersionAccessors; }

        /**
         * Returns the group of versions at versions.xuteng
         */
        public XutengVersionAccessors getXuteng() { return vaccForXutengVersionAccessors; }

        /**
         * Returns the group of versions at versions.zalo
         */
        public ZaloVersionAccessors getZalo() { return vaccForZaloVersionAccessors; }

        /**
         * Returns the group of versions at versions.zxing
         */
        public ZxingVersionAccessors getZxing() { return vaccForZxingVersionAccessors; }

    }

    public static class AuthVersionAccessors extends VersionFactory  {

        private final AuthNumberVersionAccessors vaccForAuthNumberVersionAccessors = new AuthNumberVersionAccessors(providers, config);
        public AuthVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.auth.number
         */
        public AuthNumberVersionAccessors getNumber() { return vaccForAuthNumberVersionAccessors; }

    }

    public static class AuthNumberVersionAccessors extends VersionFactory  {

        public AuthNumberVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: auth.number.product (2.14.14)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getProduct() { return getVersion("auth.number.product"); }

    }

    public static class CommonsVersionAccessors extends VersionFactory  {

        public CommonsVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: commons.codec (1.6)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCodec() { return getVersion("commons.codec"); }

    }

    public static class EspressoVersionAccessors extends VersionFactory  {

        public EspressoVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: espresso.core (3.4.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCore() { return getVersion("espresso.core"); }

    }

    public static class FirebaseVersionAccessors extends VersionFactory  {

        private final FirebaseMessagingVersionAccessors vaccForFirebaseMessagingVersionAccessors = new FirebaseMessagingVersionAccessors(providers, config);
        public FirebaseVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: firebase.bom (33.7.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getBom() { return getVersion("firebase.bom"); }

        /**
         * Returns the group of versions at versions.firebase.messaging
         */
        public FirebaseMessagingVersionAccessors getMessaging() { return vaccForFirebaseMessagingVersionAccessors; }

    }

    public static class FirebaseMessagingVersionAccessors extends VersionFactory  {

        public FirebaseMessagingVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: firebase.messaging.directboot (24.1.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getDirectboot() { return getVersion("firebase.messaging.directboot"); }

    }

    public static class FlowVersionAccessors extends VersionFactory  {

        public FlowVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: flow.layout (1.3.3)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getLayout() { return getVersion("flow.layout"); }

    }

    public static class GuavaVersionAccessors extends VersionFactory  {

        public GuavaVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: guava.android (24.0-android)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getAndroid() { return getVersion("guava.android"); }

    }

    public static class HmsVersionAccessors extends VersionFactory  {

        private final HmsReplayVersionAccessors vaccForHmsReplayVersionAccessors = new HmsReplayVersionAccessors(providers, config);
        public HmsVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: hms.analytics (6.12.0.300)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getAnalytics() { return getVersion("hms.analytics"); }

            /**
             * Returns the version associated to this alias: hms.game (6.14.0.300)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getGame() { return getVersion("hms.game"); }

            /**
             * Returns the version associated to this alias: hms.hwid (6.12.0.300)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getHwid() { return getVersion("hms.hwid"); }

            /**
             * Returns the version associated to this alias: hms.iap (6.13.0.300)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getIap() { return getVersion("hms.iap"); }

            /**
             * Returns the version associated to this alias: hms.moment (13.5.1.301)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getMoment() { return getVersion("hms.moment"); }

        /**
         * Returns the group of versions at versions.hms.replay
         */
        public HmsReplayVersionAccessors getReplay() { return vaccForHmsReplayVersionAccessors; }

    }

    public static class HmsReplayVersionAccessors extends VersionFactory  {

        public HmsReplayVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: hms.replay.common (14.1.1.301)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCommon() { return getVersion("hms.replay.common"); }

            /**
             * Returns the version associated to this alias: hms.replay.record (14.1.1.301)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getRecord() { return getVersion("hms.replay.record"); }

            /**
             * Returns the version associated to this alias: hms.replay.template (14.1.1.301)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getTemplate() { return getVersion("hms.replay.template"); }

    }

    public static class HonorVersionAccessors extends VersionFactory  {

        private final HonorAdsVersionAccessors vaccForHonorAdsVersionAccessors = new HonorAdsVersionAccessors(providers, config);
        public HonorVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: honor.game (2.0.14.301)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getGame() { return getVersion("honor.game"); }

        /**
         * Returns the group of versions at versions.honor.ads
         */
        public HonorAdsVersionAccessors getAds() { return vaccForHonorAdsVersionAccessors; }

    }

    public static class HonorAdsVersionAccessors extends VersionFactory  {

        public HonorAdsVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: honor.ads.identifier (1.0.3.300)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getIdentifier() { return getVersion("honor.ads.identifier"); }

    }

    public static class HttpdnsVersionAccessors extends VersionFactory  {

        public HttpdnsVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: httpdns.sdk (4.11.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getSdk() { return getVersion("httpdns.sdk"); }

    }

    public static class JsonVersionAccessors extends VersionFactory  {

        public JsonVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: json.test (20231013)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getTest() { return getVersion("json.test"); }

    }

    public static class KotlinVersionAccessors extends VersionFactory  {

        public KotlinVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: kotlin.stdlib (1.8.22)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getStdlib() { return getVersion("kotlin.stdlib"); }

    }

    public static class KotlinxVersionAccessors extends VersionFactory  {

        private final KotlinxCoroutinesVersionAccessors vaccForKotlinxCoroutinesVersionAccessors = new KotlinxCoroutinesVersionAccessors(providers, config);
        public KotlinxVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.kotlinx.coroutines
         */
        public KotlinxCoroutinesVersionAccessors getCoroutines() { return vaccForKotlinxCoroutinesVersionAccessors; }

    }

    public static class KotlinxCoroutinesVersionAccessors extends VersionFactory  {

        public KotlinxCoroutinesVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: kotlinx.coroutines.core (1.7.3)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCore() { return getVersion("kotlinx.coroutines.core"); }

    }

    public static class KwaisdkVersionAccessors extends VersionFactory  {

        public KwaisdkVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: kwaisdk.base (1.5.0-5540439)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getBase() { return getVersion("kwaisdk.base"); }

    }

    public static class LegacyVersionAccessors extends VersionFactory  {

        private final LegacySupportVersionAccessors vaccForLegacySupportVersionAccessors = new LegacySupportVersionAccessors(providers, config);
        public LegacyVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.legacy.support
         */
        public LegacySupportVersionAccessors getSupport() { return vaccForLegacySupportVersionAccessors; }

    }

    public static class LegacySupportVersionAccessors extends VersionFactory  {

        public LegacySupportVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: legacy.support.v4 (1.0.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getV4() { return getVersion("legacy.support.v4"); }

    }

    public static class MockitoVersionAccessors extends VersionFactory  {

        public MockitoVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: mockito.core (4.11.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCore() { return getVersion("mockito.core"); }

    }

    public static class NavigationVersionAccessors extends VersionFactory  {

        public NavigationVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: navigation.fragment (2.7.7)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getFragment() { return getVersion("navigation.fragment"); }

            /**
             * Returns the version associated to this alias: navigation.ui (2.7.7)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getUi() { return getVersion("navigation.ui"); }

    }

    public static class NearmeVersionAccessors extends VersionFactory  {

        private final NearmeGamesdkVersionAccessors vaccForNearmeGamesdkVersionAccessors = new NearmeGamesdkVersionAccessors(providers, config);
        public NearmeVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.nearme.gamesdk
         */
        public NearmeGamesdkVersionAccessors getGamesdk() { return vaccForNearmeGamesdkVersionAccessors; }

    }

    public static class NearmeGamesdkVersionAccessors extends VersionFactory  implements VersionNotationSupplier {

        public NearmeGamesdkVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the version associated to this alias: nearme.gamesdk (20250722)
         * If the version is a rich version and that its not expressible as a
         * single version string, then an empty string is returned.
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> asProvider() { return getVersion("nearme.gamesdk"); }

            /**
             * Returns the version associated to this alias: nearme.gamesdk.common (20250722)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCommon() { return getVersion("nearme.gamesdk.common"); }

    }

    public static class NirvanaVersionAccessors extends VersionFactory  {

        public NirvanaVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: nirvana.logger (2.2.2)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getLogger() { return getVersion("nirvana.logger"); }

            /**
             * Returns the version associated to this alias: nirvana.main (2.2.3)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getMain() { return getVersion("nirvana.main"); }

    }

    public static class OaidVersionAccessors extends VersionFactory  {

        private final OaidSdkVersionAccessors vaccForOaidSdkVersionAccessors = new OaidSdkVersionAccessors(providers, config);
        public OaidVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.oaid.sdk
         */
        public OaidSdkVersionAccessors getSdk() { return vaccForOaidSdkVersionAccessors; }

    }

    public static class OaidSdkVersionAccessors extends VersionFactory  implements VersionNotationSupplier {

        public OaidSdkVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the version associated to this alias: oaid.sdk (1.0.25)
         * If the version is a rich version and that its not expressible as a
         * single version string, then an empty string is returned.
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> asProvider() { return getVersion("oaid.sdk"); }

            /**
             * Returns the version associated to this alias: oaid.sdk.v2 (2.5.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getV2() { return getVersion("oaid.sdk.v2"); }

    }

    public static class OperateVersionAccessors extends VersionFactory  {

        public OperateVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: operate.4399 (3.14.5)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> get4399() { return getVersion("operate.4399"); }

    }

    public static class OppoVersionAccessors extends VersionFactory  {

        public OppoVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: oppo.push (3.5.3)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getPush() { return getVersion("oppo.push"); }

    }

    public static class PlayVersionAccessors extends VersionFactory  {

        private final PlayServicesVersionAccessors vaccForPlayServicesVersionAccessors = new PlayServicesVersionAccessors(providers, config);
        public PlayVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.play.services
         */
        public PlayServicesVersionAccessors getServices() { return vaccForPlayServicesVersionAccessors; }

    }

    public static class PlayServicesVersionAccessors extends VersionFactory  {

        private final PlayServicesAdsVersionAccessors vaccForPlayServicesAdsVersionAccessors = new PlayServicesAdsVersionAccessors(providers, config);
        public PlayServicesVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.play.services.ads
         */
        public PlayServicesAdsVersionAccessors getAds() { return vaccForPlayServicesAdsVersionAccessors; }

    }

    public static class PlayServicesAdsVersionAccessors extends VersionFactory  {

        public PlayServicesAdsVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: play.services.ads.identifier (18.2.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getIdentifier() { return getVersion("play.services.ads.identifier"); }

    }

    public static class ProvidersVersionAccessors extends VersionFactory  {

        public ProvidersVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: providers.toutiao (1.1.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getToutiao() { return getVersion("providers.toutiao"); }

    }

    public static class QmfVersionAccessors extends VersionFactory  {

        public QmfVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: qmf.ppplugin (3.1.4)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getPpplugin() { return getVersion("qmf.ppplugin"); }

    }

    public static class RangersVersionAccessors extends VersionFactory  {

        private final RangersApplogVersionAccessors vaccForRangersApplogVersionAccessors = new RangersApplogVersionAccessors(providers, config);
        public RangersVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.rangers.applog
         */
        public RangersApplogVersionAccessors getApplog() { return vaccForRangersApplogVersionAccessors; }

    }

    public static class RangersApplogVersionAccessors extends VersionFactory  {

        public RangersApplogVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: rangers.applog.convert (6.14.3)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getConvert() { return getVersion("rangers.applog.convert"); }

            /**
             * Returns the version associated to this alias: rangers.applog.lite (6.14.3)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getLite() { return getVersion("rangers.applog.lite"); }

    }

    public static class SignalVersionAccessors extends VersionFactory  {

        public SignalVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: signal.log (1.0.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getLog() { return getVersion("signal.log"); }

            /**
             * Returns the version associated to this alias: signal.sdk (1.0.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getSdk() { return getVersion("signal.sdk"); }

    }

    public static class SnapVersionAccessors extends VersionFactory  {

        public SnapVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: snap.corekit (3.0.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCorekit() { return getVersion("snap.corekit"); }

            /**
             * Returns the version associated to this alias: snap.creativekit (3.0.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCreativekit() { return getVersion("snap.creativekit"); }

            /**
             * Returns the version associated to this alias: snap.loginkit (3.0.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getLoginkit() { return getVersion("snap.loginkit"); }

    }

    public static class SupportVersionAccessors extends VersionFactory  {

        public SupportVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: support.v4 (28.0.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getV4() { return getVersion("support.v4"); }

    }

    public static class TestVersionAccessors extends VersionFactory  {

        private final TestExtVersionAccessors vaccForTestExtVersionAccessors = new TestExtVersionAccessors(providers, config);
        public TestVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the group of versions at versions.test.ext
         */
        public TestExtVersionAccessors getExt() { return vaccForTestExtVersionAccessors; }

    }

    public static class TestExtVersionAccessors extends VersionFactory  {

        public TestExtVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: test.ext.junit (1.1.3)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getJunit() { return getVersion("test.ext.junit"); }

    }

    public static class ToponVersionAccessors extends VersionFactory  {

        public ToponVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: topon.core (6.3.50)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCore() { return getVersion("topon.core"); }

    }

    public static class VivoVersionAccessors extends VersionFactory  {

        public VivoVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: vivo.push (4.0.6.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getPush() { return getVersion("vivo.push"); }

    }

    public static class XiaomiVersionAccessors extends VersionFactory  {

        public XiaomiVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: xiaomi.push (6.0.1)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getPush() { return getVersion("xiaomi.push"); }

    }

    public static class XutengVersionAccessors extends VersionFactory  {

        private final XutengSdkVersionAccessors vaccForXutengSdkVersionAccessors = new XutengSdkVersionAccessors(providers, config);
        public XutengVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: xuteng.xuteng (1.1.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getXuteng() { return getVersion("xuteng.xuteng"); }

        /**
         * Returns the group of versions at versions.xuteng.sdk
         */
        public XutengSdkVersionAccessors getSdk() { return vaccForXutengSdkVersionAccessors; }

    }

    public static class XutengSdkVersionAccessors extends VersionFactory  {

        public XutengSdkVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: xuteng.sdk.core (1.1.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getCore() { return getVersion("xuteng.sdk.core"); }

    }

    public static class ZaloVersionAccessors extends VersionFactory  {

        public ZaloVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: zalo.sdk (4.24.1101)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getSdk() { return getVersion("zalo.sdk"); }

    }

    public static class ZxingVersionAccessors extends VersionFactory  implements VersionNotationSupplier {

        private final ZxingAndroidVersionAccessors vaccForZxingAndroidVersionAccessors = new ZxingAndroidVersionAccessors(providers, config);
        public ZxingVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

        /**
         * Returns the version associated to this alias: zxing (3.5.3)
         * If the version is a rich version and that its not expressible as a
         * single version string, then an empty string is returned.
         * This version was declared in catalog libs.versions.toml
         */
        public Provider<String> asProvider() { return getVersion("zxing"); }

        /**
         * Returns the group of versions at versions.zxing.android
         */
        public ZxingAndroidVersionAccessors getAndroid() { return vaccForZxingAndroidVersionAccessors; }

    }

    public static class ZxingAndroidVersionAccessors extends VersionFactory  {

        public ZxingAndroidVersionAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

            /**
             * Returns the version associated to this alias: zxing.android.embedded (3.4.0)
             * If the version is a rich version and that its not expressible as a
             * single version string, then an empty string is returned.
             * This version was declared in catalog libs.versions.toml
             */
            public Provider<String> getEmbedded() { return getVersion("zxing.android.embedded"); }

    }

    public static class BundleAccessors extends BundleFactory {

        public BundleAccessors(ObjectFactory objects, ProviderFactory providers, DefaultVersionCatalog config) { super(objects, providers, config); }

    }

    public static class PluginAccessors extends PluginFactory {

        public PluginAccessors(ProviderFactory providers, DefaultVersionCatalog config) { super(providers, config); }

    }

}
