import { INodeProperties } from 'n8n-workflow';
import { ids, phids } from './shared';

const slugs: INodeProperties = {
	displayName: 'Slugs',
	name: 'slugs',
	type: 'string',
	default: '',
	placeholder: 'one,two,three',
	description: 'Comma-separated list of slugs',
	hint: 'Search for projects with particular slugs. (Slugs are the same as project hashtags.)',
};

const members: INodeProperties = {
	displayName: 'Members',
	name: 'members',
	type: 'string',
	default: '',
	placeholder: 'Select Members',
	description: 'Comma-separated list of user PHIDs',
};

const watchers: INodeProperties = {
	displayName: 'Watchers',
	name: 'watchers',
	type: 'string',
	default: '',
	description: 'Comma-separated list of user PHIDs',
};

const status: INodeProperties = {
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Archived',
			value: 'archived',
		},
		{
			name: 'All',
			value: 'all',
		},
	],
	default: 'active',
	description: 'Search for projects with a given status',
};

const isMilestone: INodeProperties = {
	displayName: 'Is Milestone',
	name: 'isMilestone',
	type: 'boolean',
	default: false,
	description: 'Whether to find only milestones to omit them',
};

const isRoot: INodeProperties = {
	displayName: 'Is Root',
	name: 'isRoot',
	type: 'boolean',
	default: false,
	description: 'Whether to find only root projects, or to omit them',
};

const minDepth: INodeProperties = {
	displayName: 'Minimum Depth',
	name: 'minDepth',
	type: 'number',
	default: 0,
	description:
		'Find projects with a given minimum depth. Root projects have depth 0, their immediate children have depth 1, and so on.',
};

const maxDepth: INodeProperties = {
	displayName: 'Maximum Depth',
	name: 'maxDepth',
	type: 'number',
	default: 0,
	description:
		'Find projects with a given maximum depth. Root projects have depth 0, their immediate children have depth 1, and so on.',
};

const subtypes: INodeProperties = {
	displayName: 'Subtypes',
	name: 'subtypes',
	type: 'string',
	default: '',
	placeholder: 'one,two,three',
	description: 'Comma-separated list of subtypes',
};

const icons: INodeProperties = {
	displayName: 'Icons',
	name: 'icons',
	type: 'string',
	default: '',
	placeholder: 'one,two,three',
	description: 'Comma-separated list of icons',
};

const colors: INodeProperties = {
	displayName: 'Colors',
	name: 'colors',
	type: 'options',
	default: 'blue',
	description: 'Color of the project',
	options: [
		{ name: 'Blue', value: 'blue' },
		{ name: 'Checkerd', value: 'checkerd' },
		{ name: 'Gray', value: 'gray' },
		{ name: 'Green', value: 'green' },
		{ name: 'Indigo', value: 'indigo' },
		{ name: 'Orange', value: 'orange' },
		{ name: 'Pink', value: 'pink' },
		{ name: 'Red', value: 'red' },
		{ name: 'Yellow', value: 'yellow' },
	],
};

const parents: INodeProperties = {
	displayName: 'Parent Projects',
	name: 'parents',
	type: 'string',
	default: '',
	description: 'Comma-separated list of parent project PHIDs',
};

const ancestors: INodeProperties = {
	displayName: 'Ancestor Projects',
	name: 'ancestors',
	type: 'string',
	default: '',
	description: 'Comma-separated list of ancestor project PHIDs',
};

const query: INodeProperties = {
	displayName: 'Query',
	name: 'query',
	type: 'string',
	default: '',
	description: 'Find objects matching a fulltext search query',
};

const projectSearchConstraintsOptions: INodeProperties[] = [
	ids,
	phids('proj'),
	slugs,
	members,
	watchers,
	status,
	isMilestone,
	isRoot,
	minDepth,
	maxDepth,
	subtypes,
	icons,
	colors,
	parents,
	ancestors,
	query,
];

export const projectSearchAttachments: INodeProperties = {
	displayName: 'Attachments',
	name: 'attachments',
	type: 'multiOptions',
	default: [],
	description: 'Specify which attachments to include in the response',
	displayOptions: {
		show: {
			action: ['searchProject'],
		},
	},
	options: [
		{
			name: 'Members',
			value: 'members',
		},
		{
			name: 'Watchers',
			value: 'watchers',
		},
		{
			name: 'Ancestors',
			value: 'ancestors',
		},
	],
};

export const projectSearchConstraints: INodeProperties = {
	displayName: 'Constraints',
	name: 'projectSearchConstraints',
	type: 'collection',
	default: {},
	displayOptions: {
		show: {
			action: ['searchProject'],
		},
	},
	options: projectSearchConstraintsOptions,
};
