export class Input {
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
  getInput() {
    let properties = this.node.properties;
    let name = properties[0].value;
    let attributeType = properties[1].value;
    let crossCheckKey = properties[2].value;
    let crossCheckDataSet = properties[3].value;
    let regex = properties[4].value;
    let result = this.prevResult[0][crossCheckKey];
    if (regex != '') {
      result = result.match(regex);
    }
    if (result) {
      return result;
    } else {
      throw Error('failed to get input');
    }
  }
}
