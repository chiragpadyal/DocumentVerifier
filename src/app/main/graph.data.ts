class GraphProperties {
  name: string;
  type: string;
  default: string | string[];
  isOptional: boolean;
  value: string;
}

class Graph {
  [key: string]: {
    properties: GraphProperties[];
    connectableTo: string[];
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
      },
      {
        name: 'Attribute Type',
        type: 'drop-down',
        default: ['string', 'number'],
        isOptional: false,
        value: '',
      },
      {
        name: 'Cross Check Key ',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Cross Check Dataset',
        type: 'upload',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Regex',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
    ],
    connectableTo: [],
  },
  database: {
    properties: [
      {
        name: 'Host Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Database Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Port',
        type: 'number',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Username',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Password',
        type: 'password',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Table Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Fields',
        type: 'string',
        default: '*',
        isOptional: false,
        value: '',
      },
      {
        name: 'FilterBy',
        type: 'string',
        default: '',
        isOptional: true,
        value: '',
      },
      {
        name: 'SQL Query',
        type: 'string',
        default: '',
        isOptional: true,
        value: '',
      },
    ],
    connectableTo: ['input', 'file'],
  },
  api: {
    properties: [
      {
        name: 'EndPoint',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Direction',
        type: 'drop-down',
        default: ['post', 'fetch'],
        isOptional: false,
        value: '',
      },
      {
        name: 'Url (if Fetch)',
        type: 'number',
        default: '',
        isOptional: true,
        value: '',
      },
    ],
    connectableTo: ['input', 'file'],
  },
  file: {
    properties: [
      {
        name: 'Name',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
      {
        name: 'Attribute Type',
        type: 'drop-down',
        default: ['url', 'blob'],
        isOptional: false,
        value: '',
      },
      {
        name: 'Cross Check Key ',
        type: 'string',
        default: '',
        isOptional: false,
        value: '',
      },
    ],
    connectableTo: ['aadhar', 'pan'],
  },
  aadhar: {
    properties: [],
    connectableTo: [],
  },
  pan: {
    properties: [],
    connectableTo: [],
  },
};

// TODO: can use connectable as to fetch file from url or blob to file
