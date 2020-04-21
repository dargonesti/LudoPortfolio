
import utils from './utils';

export async function canvasEncode(shouldCompress, file, cb, quality = 25, type = "image/jpeg") {
  return new Promise(async (resolve, reject) => {
    if (!shouldCompress) {
      await cb(file);
      resolve();
      return;
    } else {
      var img = new Image();
      var canvasCopy = document.createElement("canvas");
      var copyContext = canvasCopy.getContext("2d");

      img.onload = async function () {

        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        copyContext.drawImage(img, 0, 0);


        let blob;

        if ('toBlob' in canvasCopy) {
          canvasCopy.toBlob(async (blob) => {
            utils.log(blob);

            await cb(blob);
            resolve();
          }, type, quality / 100);
        } else {
          // Welcome to Edge.
          // TypeScript thinks `canvas` is 'never', so it needs casting. => (canvas as HTMLCanvasElement).toDataURL(type, quality);
          const dataUrl = canvasCopy.toDataURL(type, quality / 100);
          const result = /data:([^;]+);base64,(.*)$/.exec(dataUrl);

          const outputType = result[1];
          const binaryStr = atob(result[2]);
          const data = new Uint8Array(binaryStr.length);

          for (let i = 0; i < data.length; i += 1) {
            data[i] = binaryStr.charCodeAt(i);
          }

          blob = new Blob([data], { type: outputType });
          cb(blob);
         resolve();
        }
      };
      img.src = file.preview;
    }
  });
}

export default {
  canvasEncode
};