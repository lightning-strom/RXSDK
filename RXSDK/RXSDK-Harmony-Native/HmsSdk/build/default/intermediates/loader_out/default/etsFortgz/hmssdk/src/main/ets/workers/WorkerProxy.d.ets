// @keepTs
// @ts-nocheck
export declare class WorkerProxy {
    private constructor();
    /**
     * post message to worker thread. For now we have only one worker - TuanjieMainWorker
     * @param msg
     */
    static postMessage(f203: ESObject, g203: string | undefined): void;
}
export declare function POST_MESSAGE(e203: ESObject): void;
export declare function POST_MESSAGE_TO_WORKER(c203: ESObject, d203: string | undefined): void;
