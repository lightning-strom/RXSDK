// @keepTs
// @ts-nocheck
import { Message } from './MessageHandler';
export declare class HostProxy {
    Loop(c200: ESObject): void;
}
export declare function GetHostProxy(): HostProxy;
export declare function PROCESS_WORKER_MESSAGE(z199: Message): number;
export declare function POST_MESSAGE(y199: ESObject): void;
export declare function POST_MESSAGE_TO_HOST(x199: ESObject): void;
