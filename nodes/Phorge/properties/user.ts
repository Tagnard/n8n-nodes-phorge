import { INodeProperties } from 'n8n-workflow';
import { phids } from './shared';

const ids: INodeProperties = {
    displayName: 'IDs',
    name: 'ids',
    type: 'string',
    default: '',
    placeholder: '1,2,3',
    description: 'Comma-separated list of project IDs',
};

const usernames: INodeProperties = {
    displayName: 'Usernames',
    name: 'usernames',
    type: 'string',
    default: '',
    placeholder: 'username1,username2',
    description: 'Comma-separated list of user PHIDs who are members of the projects',
};

const nameLike: INodeProperties = {
    displayName: 'Name Contains',
    name: 'nameLike',
    type: 'string',
    default: '',
    description: 'Find projects whose names contain a substring',
};

const isAdmin: INodeProperties = {
    displayName: 'Is Admin',
    name: 'isAdmin',
    type: 'boolean',
    default: false,
    description: 'Whether to find only administrators',
};

const isDisabled: INodeProperties = {
    displayName: 'Is Disabled',
    name: 'isDisabled',
    type: 'boolean',
    default: false,
    description: 'Whether to find only disabled users',
};

const isBot: INodeProperties = {
    displayName: 'Is Bot',
    name: 'isBot',
    type: 'boolean',
    default: false,
    description: 'Whether to find only bots',
};

const isMailingList: INodeProperties = {
    displayName: 'Is Mailing List',
    name: 'isMailingList',
    type: 'boolean',
    default: false,
    description: 'Whether to find only mailing lists',
};

const needsApproval: INodeProperties = {
    displayName: 'Needs Approval',
    name: 'needsApproval',
    type: 'boolean',
    default: false,
    description: 'Whether to find only users awaiting administrative approval',
};

const mfa: INodeProperties = {
    displayName: 'Has MFA',
    name: 'mfa',
    type: 'boolean',
    default: false,
    description: 'Whether to find only users who are enrolled in MFA, or false to omit these users',
};

const createdAfter: INodeProperties = {
    displayName: 'Joined After',
    name: 'createdStart',
    type: 'string',
    default: '',
    description: 'Find user accounts created after a given time',
};

const createdBefore: INodeProperties = {
    displayName: 'Joined Before',
    name: 'createdEnd',
    type: 'string',
    default: '',
    description: 'Find user accounts created before a given time',
};

const query: INodeProperties = {
    displayName: 'Query',
    name: 'query',
    type: 'string',
    default: '',
    description: 'Find objects matching a fulltext search query. See "Search User Guide" in the documentation for details.',
};

const userSearchConstraintsOptions: INodeProperties[] = [
    ids,
    phids('user'),
    usernames,
    nameLike,
    isAdmin,
    isDisabled,
    isBot,
    isMailingList,
    needsApproval,
    mfa,
    createdAfter,
    createdBefore,
    query,
];

export const userSearchAttachments: INodeProperties = {
    displayName: 'Attachments',
    name: 'attachments',
    type: 'multiOptions',
    description: 'Specify which attachments to include in the response',
    default: [],
    displayOptions: {
        show: {
            action: ['searchUser'],
        },
    },
    options: [
        { name: 'Availability', value: 'availability' },
    ],
};

export const userSearchConstraints: INodeProperties = {
    displayName: 'Constraints',
    name: 'userSearchConstraints',
    type: 'collection',
    default: {},
    displayOptions: {
        show: {
            action: ['searchUser'],
        },
    },
    options: userSearchConstraintsOptions,
};