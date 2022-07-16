declare namespace Zaimki {
    interface User {
        username: string;
        email: string;
        emailHash?: string;
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        // @ts-ignore
        LOCALES: string[];
    }
}

declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}