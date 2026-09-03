export interface LoginConfig {
    method: string;
}
export interface UAConfig {
    of: boolean;
    no: number;
    max: number;
    version?: string;
}
export interface InitConfig {
    event_public_attr?: {
        public_attr?: Record<string, any>;
        refresh?: number;
        version?: string;
    };
    advertise_switch?: {
        switch?: number;
        window_days?: number;
    };
    pay_third_goods?: {
        third_goods?: Record<string, any>;
        version?: string;
    };
    websocket?: {
        ws_list?: string[];
        version?: string;
        method?: string;
    };
    client_login?: {
        list?: Array<LoginConfig>;
        version?: string;
        cer?: boolean;
    };
    feedback?: {
        log_limit?: number;
        version?: string;
    };
    subcq?: {
        subc?: any[];
        version?: string;
    };
    cp?: {
        of?: boolean;
        version?: string;
    };
    log?: {
        of?: boolean;
        no?: number;
        lp?: boolean;
        version?: string;
        ce?: boolean;
        ua?: UAConfig;
    };
    apps?: {
        ts?: number;
        in?: string[];
        version?: string;
    };
    device?: {
        sd?: {
            of?: boolean;
        };
        version?: string;
        net?: {
            of?: boolean;
        };
        mod?: {
            of?: boolean;
        };
        pb?: number;
    };
    lang?: {
        df?: string;
        n?: string;
        version?: string;
    };
    uab?: {
        of?: boolean;
        ph?: string;
        ts?: number;
    };
    pay?: {
        fa?: boolean;
        version?: string;
    };
    channel?: {
        ul?: string;
        sh?: string;
        ra?: {
            of?: boolean;
            cof?: boolean;
            fa?: boolean;
            ckb?: boolean;
            iifaa?: boolean;
            sh?: string;
        };
        sp?: {
            of?: boolean;
        };
        dr?: {
            of?: boolean;
            type?: number;
        };
        uc?: {
            list?: string[];
        };
        version?: string;
    };
    ia?: {
        sk2?: boolean;
        version?: string;
    };
    oi?: {
        appid?: string;
        version?: string;
    };
    [key: string]: any;
}
