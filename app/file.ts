import * as fs from 'fs';
import axios from 'axios';
import * as mime from 'mime-types';
export class File {
  node = {
    properties: [
      {
        value: '',
      },
    ],
  };
  prevResult;
  constructor(node, prevResult) {
    this.node = node;
    this.prevResult = prevResult;
  }
  async openFile() {
    return new Promise(async (resolve, reject) => {
      let properties = this.node.properties;
      let name = properties[0].value;
      let attributeType = properties[1].value;
      let crossCheckKey = properties[2].value;
      let final = [];
      for (let element of this.prevResult) {
        try {
          if (attributeType === 'url') {
            const url = element[crossCheckKey];
            const response = await axios.get(url, {
              responseType: 'arraybuffer',
            });
            const contentType = response.headers['content-type'];
            const extension = mime.extension(contentType);
            const buffer = Buffer.from(response.data, 'binary');
            await fs.promises.writeFile(`temp/${name}.${extension}`, buffer);
            final.push(`${name}.${extension}`);
          } else if (attributeType === 'blob') {
            console.log('reached blob');
            let col = element;
            let blob = col[crossCheckKey];

            // create a Buffer from the Blob data
            const buffer = Buffer.from(blob);

            // write the Buffer data to a file
            fs.writeFileSync('temp/' + name + '.' + 'jpg', buffer);
            final.push(`${name}.jpg`);
          } else {
            console.log('Wrong Attribute Type value.');
          }
        } catch (err) {}
      }
      resolve(final);
    });
  }
}
