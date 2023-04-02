import { createWorker } from 'tesseract.js';

export class Aadhar {
  node = {
    properties: [
      {
        value: '',
      },
    ],
  };
  prevResult;
  d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  // permutation table p
  p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  // inverse table inv
  inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

  constructor(node, prevResult) {
    this.node = node;
    this.prevResult = prevResult;
  }
  aadharScan() {
    return new Promise(async (resolve, reject) => {
      let output: any = {
        isValid: false,
        name: '',
        dob: '',
        aadhar: '',
      };

      output = this.ocrAadhar();
      if (output === false) {
        reject('failed');
      }
      resolve(output);
    });
  }

  // converts string or number to an array and inverts it
  invArray(array) {
    if (Object.prototype.toString.call(array) == '[object Number]') {
      array = String(array);
    }

    if (Object.prototype.toString.call(array) == '[object String]') {
      array = array.split('').map(Number);
    }

    return array.reverse();
  }

  // generates checksum
  generate(array) {
    var c = 0;
    var invertedArray = this.invArray(array);

    for (var i = 0; i < invertedArray.length; i++) {
      c = this.d[c][this.p[(i + 1) % 8][invertedArray[i]]];
    }

    return this.inv[c];
  }

  // validates checksum
  validate(array) {
    var c = 0;
    var invertedArray = this.invArray(array);

    for (var i = 0; i < invertedArray.length; i++) {
      c = this.d[c][this.p[i % 8][invertedArray[i]]];
    }

    return c === 0;
  }

  validateAadhaar(aadhaarString) {
    // remove white spaces from string
    let newAadhaarString = aadhaarString.replace(/\s/g, '');
    if (newAadhaarString.length != 12) {
      return new Error('Aadhaar numbers should be 12 digit in length');
    }
    if (newAadhaarString.match(/[^$,.\d]/)) {
      return new Error('Aadhaar numbers must contain only numbers');
    }
    var aadhaarArray = newAadhaarString.split('');
    var toCheckChecksum = aadhaarArray.pop();
    if (this.generate(aadhaarArray) == toCheckChecksum) {
      return true;
    } else {
      return false;
    }
  }

  async ocrAadhar() {
    let final = [];
    for (let element of this.prevResult) {
      try {
        console.log(this.prevResult);
        const worker = await createWorker({
          logger: (m) => '',
        });

        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const {
          data: { text },
        } = await worker.recognize(`temp/${element}`);
        // console.log(text);

        let ocrOutput = text;
        const regex = /^([^\n]*\n){3}([^\n]*)/;
        const dobMatch = ocrOutput.match(/DOB:\s*(\d{2}\/\d{2}\/\d{4})/);
        const dob = dobMatch ? dobMatch[1] : null;
        const pattern = /^(\d{4})\s.*$/gm;
        const num = ocrOutput.match(pattern)[0];
        const nameMatch = ocrOutput.match(regex);
        const name = nameMatch ? nameMatch.slice(1, 5).join(' ') : null;
        const cleanedText = (txt) => txt.replace(/\n/g, '');
        console.log(cleanedText(dob), cleanedText(num), cleanedText(name));

        let result = this.validateAadhaar(cleanedText(num));
        if (result) {
          console.log('correct aadhar');
        } else {
          console.log('wrong aadhar');
        }
        let output = {
          isValid: result,
          name: cleanedText(name),
          dob: cleanedText(dob),
          aadhar: cleanedText(num),
          paragraph: ocrOutput,
        };
        await worker.terminate();
        final.push(output);
      } catch (e) {}
    }
    return final;
  }
}
