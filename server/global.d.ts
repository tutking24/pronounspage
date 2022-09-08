import type { RawUser } from '~/src/authenticate';
import type { Locale } from '~/src/buildLocaleList';
import type { LazyDatabase } from "~/server/index";
declare global {
    type Nullish = null | undefined;

    type GeneratorFunc<R, Args extends any[]> = (...args: Args) => Generator<R>;

    namespace Express {
        interface Request {
            rawUser: RawUser | Nullish;
            user: RawUser | Nullish;
            isGranted(area?: string, locale?: string): boolean;
            locales: Record<string, Locale>;
            db: LazyDatabase;
            isUserAllowedToPost(): Promise<boolean>;
        }
    }

    const config: any;
    const translations: any;
    namespace NodeJS {
        interface Global {
            config: any;
            translations: any;
        }
    }
}