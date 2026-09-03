import http from "@ohos:net.http";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
export class HttpRequestResponse {
    async httpRequest(v60: string, w60: number, x60: number): Promise<http.HttpResponse> {
        let y60 = {
            method: http.RequestMethod.GET,
            connectTimeout: 60000,
            readTimeout: 60000,
            header: {
                'Content-Type': 'application/json'
            },
            extraData: {
                'lat': w60.toString(),
                'lon': x60.toString()
            }
        };
        Logger.info(`request options = ${JSON.stringify(y60)}`);
        return await http.createHttp().request(v60, y60);
    }
}
export default new HttpRequestResponse;
