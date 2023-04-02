class GraphProperties {
  name: string;
  type: string;
  default: string | string[];
  isOptional: boolean;
  value: string;
  isInMutable: boolean;
}

class Graph {
  [key: string]: {
    properties: GraphProperties[];
    connectableTo: string[];
    isComplete: boolean;
    isFailed: boolean;
  };
}

// type=[string, drop-down, number, password, upload]
export const graphData: Graph = {
  input: {
    properties: [
      {
        name: 'Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Attribute Type',
        type: 'drop-down',
        default: ['string', 'number'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Cross Check Key ',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Cross Check Dataset',
        type: 'upload',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Regex',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
    ],
    connectableTo: [],
    isComplete: false,
    isFailed: false,
  },
  database: {
    properties: [
      {
        name: 'Host Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Database Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Port',
        type: 'number',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Username',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Password',
        type: 'password',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Table Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Fields',
        type: 'string',
        default: '*',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'FilterBy',
        type: 'string',
        default: '',
        isOptional: true,
        value: '',
        isInMutable: false,
      },
      {
        name: 'SQL Query',
        type: 'string',
        default: '',
        isOptional: true,
        value: '',
        isInMutable: false,
      },
    ],
    connectableTo: ['input', 'file'],
    isComplete: false,
    isFailed: false,
  },
  api: {
    properties: [
      {
        name: 'EndPoint',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Direction',
        type: 'drop-down',
        default: ['post', 'fetch'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Url (if Fetch)',
        type: 'number',
        default: '',
        isOptional: true,
        value: '',
        isInMutable: false,
      },
    ],
    connectableTo: ['input', 'file'],
    isComplete: false,
    isFailed: false,
  },
  file: {
    properties: [
      {
        name: 'Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Attribute Type',
        type: 'drop-down',
        default: ['url', 'blob'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Cross Check Key ',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: false,
      },
    ],
    connectableTo: ['aadhar', 'pan'],
    isComplete: false,
    isFailed: false,
  },
  aadhar: {
    properties: [
      {
        name: 'First Name Reference:',
        type: 'ref',
        default: ['input'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Middle Name Reference:',
        type: 'ref',
        default: ['input'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Last Name Reference:',
        type: 'ref',
        default: ['input'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'DOB Reference:',
        type: 'ref',
        default: ['input'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
      {
        name: 'Aadhar Reference:',
        type: 'ref',
        default: ['input'],
        isOptional: false,
        value: '',
        isInMutable: false,
      },
    ],
    connectableTo: [],
    isComplete: false,
    isFailed: false,
  },
  pan: {
    properties: [],
    connectableTo: [],
    isComplete: false,
    isFailed: false,
  },
  ref: {
    properties: [
      {
        name: 'Source',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: true,
      },
      {
        name: 'Destination',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: true,
      },
      {
        name: 'For',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
        isInMutable: true,
      },
    ],
    connectableTo: [],
    isComplete: false,
    isFailed: false,
  },
};

// TODO: can use connectable as to fetch file from url or blob to file
