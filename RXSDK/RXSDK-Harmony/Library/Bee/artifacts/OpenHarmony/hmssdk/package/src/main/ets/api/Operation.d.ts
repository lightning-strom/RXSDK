import { Announcement, IOperation, RCallback, RXResult } from '../types/Index';
declare class Operation implements IOperation {
    getOperationScene(a2?: RCallback): Promise<RXResult<object>>;
    /**
     * 获取公告列表
     * @param limit 获取条数
     * @param callback 回调
     */
    getAnnouncement(y1?: number, z1?: RCallback<Announcement[]>): Promise<RXResult<Announcement[]>>;
    getEmailList(w1?: any, x1?: RCallback): Promise<RXResult<object>>;
    deleteEmail(u1: {
        cp_user_id: string;
        type: number;
        rx_mail_id?: number;
    }, v1?: RCallback): Promise<RXResult<object>>;
    getEmailDetail(r1: number, s1?: string, t1?: RCallback): Promise<RXResult<object>>;
    getEmailAward(p1: {
        cp_user_id: string;
        type: number;
        rx_mail_id?: number;
    }, q1?: RCallback): Promise<RXResult<object>>;
}
declare const _default: Operation;
export default _default;
