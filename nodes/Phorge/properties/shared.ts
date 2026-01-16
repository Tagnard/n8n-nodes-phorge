import { INodeProperties } from 'n8n-workflow';

export const ids: INodeProperties = {
	displayName: 'IDs',
	name: 'ids',
	type: 'string',
	default: '',
	placeholder: '123,456,789',
	description: 'Comma-separated list of IDs',
};

export const phids = (objectType: string): INodeProperties => {
	return {
		displayName: 'PHIDs',
		name: 'phids',
		type: 'string',
		default: '',
		placeholder: `PHID-${objectType.toUpperCase()}-xxxxxx`,
		description: 'Comma-separated list of PHIDs',
	};
};

export const createdBefore = (objectType: string): INodeProperties => {
	return {
		displayName: 'Created Before',
		hint: `Search for ${objectType} created before a certain date.`,
		name: 'createdBefore',
		type: 'string',
		default: '',
		description: `Only return ${objectType} with an Unixtimestamp in seconds less than this value`,
	};
};

export const createdAfter = (objectType: string): INodeProperties => {
	return {
		displayName: 'Created After',
		hint: `Search for ${objectType} created after a certain date.`,
		name: 'createdAfter',
		type: 'string',
		default: '',
		description: `Only return ${objectType} with an Unixtimestamp in seconds later than this value`,
	};
};

export const modifiedBefore = (objectType: string): INodeProperties => {
	return {
		displayName: 'Modified Before',
		hint: `Search for ${objectType} modified before a certain date.`,
		name: 'modifiedBefore',
		type: 'string',
		default: '',
		description: `Only return ${objectType} with an Unixtimestamp in seconds less than this value`,
	};
};

export const modifiedAfter = (objectType: string): INodeProperties => {
	return {
		displayName: 'Modified After',
		hint: `Search for ${objectType} modified after a certain date.`,
		name: 'modifiedAfter',
		type: 'string',
		default: '',
		description: `Only return ${objectType} with an Unixtimestamp in seconds later than this value`,
	};
};

export const objectIdentifier: INodeProperties = {
		displayName: `Object Identifier`,
		name: 'objectIdentifier',
		type: 'string',
		default: '',
		placeholder: `PHID-xxxxxx or 123`,
		description: 'Numeric ID or PHID to operate on',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['edit', 'createComment'],
			},
		},
	};