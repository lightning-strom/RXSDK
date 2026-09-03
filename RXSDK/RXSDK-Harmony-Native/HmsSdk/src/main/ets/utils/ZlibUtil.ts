import { zlib } from "@kit.BasicServicesKit";
import { BufferUtil } from "./BufferUtil";
import { Logger } from "./Logger";
import pako from 'pako';

export default class ZlibUtil {
  static async gzip(data: string | Object | ArrayBuffer) {
    try {
      let arrBuf = BufferUtil.toArrayBuffer(data);
      let buf = pako.gzip(arrBuf)
      return buf?.buffer
    } catch (e) {
      Logger.e(e)
    }
  }
  static async gzip2(data: string | Object | ArrayBuffer) {
    try {
      const gzip = zlib.createGZipSync();

    } catch (e) {
      Logger.e(e)
    }
  }

  static async compress(data: string | Object | ArrayBuffer): Promise<ArrayBuffer> {
    try {
      const arrayBufferIn = BufferUtil.toArrayBuffer(data);
      let arrayBufferOut = new ArrayBuffer(8 + arrayBufferIn.byteLength);
      const zip = zlib.createZipSync();
      const outInfo = await zip.compress(arrayBufferOut, arrayBufferIn);
      let compressedData = arrayBufferOut.slice(0, outInfo.destLen);
      return compressedData
    } catch (e) {
      Logger.e(e)
    }
  }


  static async deflate(data: string | Object | ArrayBuffer): Promise<ArrayBuffer> {
    try {
      const arrayBufferIn = BufferUtil.toArrayBuffer(data);
      let arrayBufferOut = new ArrayBuffer(8 + arrayBufferIn.byteLength);
      let zStream: zlib.ZStream = {
        nextIn: arrayBufferIn,
        availableIn: arrayBufferIn.byteLength,
        nextOut: arrayBufferOut,
        availableOut: arrayBufferOut.byteLength
      };
      const zip = zlib.createZipSync();
      const initStatus = await zip.deflateInit(zStream, zlib.CompressLevel.COMPRESS_LEVEL_BEST_SPEED);
      // console.log('rxsdk initStatus:', initStatus);
      const deflateStatus = await zip.deflate(zStream, zlib.CompressFlushMode.FINISH);
      // console.log('rxsdk deflateStatus:', deflateStatus);
      const endStatus = await zip.deflateEnd(zStream);
      // console.log('rxsdk endStatus:', endStatus);
      const compressedData = BufferUtil.removeTrailingZeros(arrayBufferOut)
      // Logger.d(`length: ${compressedData.byteLength}  data:`, Objects.stringify(compressedData))
      return compressedData;
    } catch (e) {
      Logger.e(e)
    }
  }

  static async inflate(zData: string | Object | ArrayBuffer): Promise<ArrayBuffer> {
    try {
      let arrayBufferOut = new ArrayBuffer(1024);
      const arrayBufferIn = BufferUtil.toArrayBuffer(zData);
      let dzStream: zlib.ZStream = {
        nextIn: arrayBufferIn,
        availableIn: arrayBufferIn.byteLength,
        nextOut: arrayBufferOut,
        availableOut: arrayBufferOut.byteLength
      };
      const zip = zlib.createZipSync();
      await zip.inflateInit(dzStream)
      await zip.inflate(dzStream, zlib.CompressFlushMode.FINISH)
      await zip.inflateEnd(dzStream)
      arrayBufferOut = BufferUtil.removeTrailingZeros(arrayBufferOut)
      return arrayBufferOut;
    } catch (e) {
      Logger.e(e)
    }
  }
}


