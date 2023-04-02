export class Ref {
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
  getRef() {
    let properties = this.node.properties;
    let sourceNodeId = properties[0].value;
    let destNodeId = properties[1].value;
    let labelName = properties[2].value;
    console.log(`prevResult:`);
    console.log(this.prevResult);
    let firstName = this.prevResult.name ?? '';
    let middleName = this.prevResult.middle_name ?? '';
    let lastName = this.prevResult.last_name ?? '';
    let dob = this.prevResult.dob ?? '';
    let aadhar = this.prevResult.aadhar ?? '';
    let paragraph = this.prevResult.paragraph ?? '';

    return {
      firstName,
      middleName,
      lastName,
      dob,
      aadhar,
      toNode: destNodeId,
      labelName,
      paragraph,
    };
  }

  checkRef(destNodeValue, check) {
    if (destNodeValue === check) {
      return true;
    } else {
      return false;
    }
  }

  checkIsInclude(paragraph, word) {
    if (paragraph.includes(word)) {
      return true;
    } else {
      return false;
    }
  }
}
