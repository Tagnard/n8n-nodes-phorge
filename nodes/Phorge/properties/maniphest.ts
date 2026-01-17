import { INodeProperties } from 'n8n-workflow';
import { createdAfter, createdBefore, ids, modifiedAfter, modifiedBefore, phids } from './shared';

const assigned: INodeProperties = {
	displayName: 'Assigned To',
	name: 'assigned',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx',
	description: 'Comma-separated list of user PHIDs to whom the tasks are assigned',
};

const authorPHIDs: INodeProperties = {
	displayName: 'Authors',
	name: 'authorPHIDs',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx',
	description: 'Comma-separated list of user PHIDs who are the authors of the tasks',
};

const status: INodeProperties = {
	displayName: 'Statuses',
	name: 'status',
	type: 'string',
	default: 'open',
	description: 'Filter tasks by status',
};

const priorities: INodeProperties = {
	displayName: 'Priorities',
	name: 'priorities',
	type: 'string',
	default: '',
	placeholder: '1,2,3',
	description: 'Comma-separated list of priority levels to filter by',
};

const subtype: INodeProperties = {
	displayName: 'Subtypes',
	name: 'subtype',
	type: 'string',
	default: '',
	description: 'Comma-separated list of subtypes to filter by',
};

const columnPHIDs: INodeProperties = {
	displayName: 'Columns',
	name: 'columnPHIDs',
	type: 'string',
	default: '',
	placeholder: 'PHID-PCOL-xxxxxx',
	description: 'Comma-separated list of workboard column PHIDs to filter by',
};

const hasParents: INodeProperties = {
	displayName: 'Open Parents',
	name: 'hasParents',
	type: 'boolean',
	default: false,
	description: 'Whether to search for tasks which block open parent tasks',
};

const hasSubtasks: INodeProperties = {
	displayName: 'Open Subtasks',
	name: 'hasSubtasks',
	type: 'boolean',
	default: false,
	description: 'Whether to search for tasks blocked by open subtasks',
};

const parentIDs: INodeProperties = {
	displayName: 'Parent IDs',
	name: 'parentIDs',
	type: 'string',
	default: '',
	placeholder: '123,456',
	description: 'Comma-separated list of parent task IDs to filter by',
};

const subtaskIDs: INodeProperties = {
	displayName: 'Subtask IDs',
	name: 'subtaskIDs',
	type: 'string',
	default: '',
	placeholder: '123,456',
	description: 'Comma-separated list of subtask IDs to filter by',
};

const groupBy: INodeProperties = {
	displayName: 'Group By',
	name: 'group',
	type: 'options',
	options: [
		{
			name: 'Priority',
			value: 'priority',
		},
		{
			name: 'Status',
			value: 'status',
		},
		{
			name: 'Project',
			value: 'project',
		},
		{
			name: 'None',
			value: 'none',
		},
	],
	default: 'none',
	description: 'Group results by a certain parameter',
};

const closedBefore: INodeProperties = {
	displayName: 'Closed After',
	hint: 'Search for tasks closed after a certain date.',
	name: 'closedStart',
	type: 'string',
	default: '',
	description: 'Only return tasks with an Unixtimestamp in seconds later than this value',
};

const closedAfter: INodeProperties = {
	displayName: 'Closed Before',
	hint: 'Search for tasks closed before a certain date.',
	name: 'closedEnd',
	type: 'string',
	default: '',
	description: 'Only return tasks with an Unixtimestamp in seconds less than this value',
};

const closerPHIDs: INodeProperties = {
	displayName: 'Closed By',
	name: 'closerPHIDs',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx',
	description: 'Comma-separated list of user PHIDs who closed the tasks',
};

const query: INodeProperties = {
	displayName: 'Query',
	name: 'query',
	type: 'string',
	default: '',
	description: 'The full text search query to use',
};

const subscribers: INodeProperties = {
	displayName: 'Subscribers',
	name: 'subscribers',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx',
	description: 'Comma-separated list of user PHIDs who are subscribers to the tasks',
};

const projects: INodeProperties = {
	displayName: 'Tags',
	name: 'projects',
	type: 'string',
	default: '',
	placeholder: 'PHID-PROJ-xxxxxx',
	description: 'Comma-separated list of project PHIDs to filter by',
};

const addCommits: INodeProperties = {
	displayName: 'Add Commits',
	name: 'addCommits',
	type: 'string',
	default: '',
	placeholder: 'PHID-CMIT-xxxxxx,PHID-CMIT-yyyyyy',
	description: 'Comma-separated list of commit PHIDs to relate to the task',
};

const addParents: INodeProperties = {
	displayName: 'Add Parents',
	name: 'addParents',
	type: 'string',
	default: '',
	placeholder: 'PHID-TASK-xxxxxx,PHID-TASK-yyyyyy',
	description: 'Comma-separated list of parent task PHIDs to add to the task',
};

const addProjects: INodeProperties = {
	displayName: 'Add Projects',
	name: 'addProjects',
	type: 'string',
	default: '',
	placeholder: 'PHID-PROJ-xxxxxx,PHID-PROJ-yyyyyy',
	description: 'Comma-separated list of project PHIDs to add to the task',
};

const addSubscribers: INodeProperties = {
	displayName: 'Add Subscribers',
	name: 'addSubscribers',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx,PHID-USER-yyyyyy',
	description: 'Comma-separated list of user PHIDs to add as subscribers to the task',
};

const addSubtasks: INodeProperties = {
	displayName: 'Add Subtasks',
	name: 'addSubtasks',
	type: 'string',
	default: '',
	placeholder: 'PHID-TASK-xxxxxx,PHID-TASK-yyyyyy',
	description: 'Comma-separated list of subtask PHIDs to add to the task',
};

const editPolicy: INodeProperties = {
	displayName: 'Change Edit Policy',
	name: 'editPolicy',
	type: 'string',
	default: '',
	placeholder: 'PHID-POL-xxxxxx',
	description: 'PHID of the policy to set as the edit policy for the task',
};

const viewPolicy: INodeProperties = {
	displayName: 'Change View Policy',
	name: 'viewPolicy',
	type: 'string',
	default: '',
	placeholder: 'PHID-POL-xxxxxx',
	description: 'PHID of the policy to set as the view policy for the task',
};

const column: INodeProperties = {
	displayName: 'Column',
	name: 'column',
	type: 'string',
	default: '',
	placeholder: 'PHID-COL-xxxxxx',
	description: 'PHID of the workboard column to place the task in',
};

const comment: INodeProperties = {
	displayName: 'Comment',
	name: 'comment',
	type: 'string',
	typeOptions: {
		alwaysOpenEditWindow: true,
		rows: 5,
	},
	default: '',
	placeholder: 'This is an example comment.',
	description: 'Comment to add while creating the task',
};

const createCommentProperty: INodeProperties = {
	displayName: 'Comment',
	name: 'comment',
	type: 'string',
	typeOptions: {
		alwaysOpenEditWindow: true,
		rows: 5,
	},
	default: '',
	placeholder: 'This is an example comment.',
	description: 'Comment to add while creating the task',
	displayOptions: {
		show: {
			resource: ['task'],
			operation: ['createComment'],
		},
	},
};

export const description: INodeProperties = {
	displayName: 'Description',
	name: 'description',
	type: 'string',
	typeOptions: {
		alwaysOpenEditWindow: true,
		rows: 5,
	},
	default: '',
	placeholder: 'This is an example task description.',
	description: 'Description of the task to create',
	displayOptions: {
		show: {
			resource: ['task'],
			operation: ['create'],
		},
	},
};

const mfa: INodeProperties = {
	displayName: 'MFA',
	name: 'mfa',
	type: 'boolean',
	default: false,
	description: 'Whether to sign this transaction group with MFA',
};

const owner: INodeProperties = {
	displayName: 'Owner',
	name: 'owner',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx',
	description: 'PHID of the user to assign the task to',
};

const parent: INodeProperties = {
	displayName: 'Parent',
	name: 'parent',
	type: 'string',
	default: '',
	placeholder: 'PHID-TASK-xxxxxx',
	description: 'PHID of the parent task, if creating a subtask',
};

const priority: INodeProperties = {
	displayName: 'Priority',
	name: 'priority',
	type: 'number',
	default: 0,
	description: 'Priority level of the task',
};

const removeCommits: INodeProperties = {
	displayName: 'Remove Commits',
	name: 'removeCommits',
	type: 'string',
	default: '',
	placeholder: 'PHID-CMIT-xxxxxx,PHID-CMIT-yyyyyy',
	description: 'Comma-separated list of commit PHIDs to remove from the task',
};

const removeParents: INodeProperties = {
	displayName: 'Remove Parents',
	name: 'removeParents',
	type: 'string',
	default: '',
	placeholder: 'PHID-TASK-xxxxxx,PHID-TASK-yyyyyy',
	description: 'Comma-separated list of parent task PHIDs to remove from the task',
};

const removeProjects: INodeProperties = {
	displayName: 'Remove Projects',
	name: 'removeProjects',
	type: 'string',
	default: '',
	placeholder: 'PHID-PROJ-xxxxxx,PHID-PROJ-yyyyyy',
	description: 'Comma-separated list of project PHIDs to remove from the task',
};

const removeSubscribers: INodeProperties = {
	displayName: 'Remove Subscribers',
	name: 'removeSubscribers',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx,PHID-USER-yyyyyy',
	description: 'Comma-separated list of user PHIDs to remove as subscribers from the task',
};

const removeSubtasks: INodeProperties = {
	displayName: 'Remove Subtasks',
	name: 'removeSubtasks',
	type: 'string',
	default: '',
	placeholder: 'PHID-TASK-xxxxxx,PHID-TASK-yyyyyy',
	description: 'Comma-separated list of subtask PHIDs to remove from the task',
};

const setCommits: INodeProperties = {
	displayName: 'Set Commits',
	name: 'setCommits',
	type: 'string',
	default: '',
	placeholder: 'PHID-CMIT-xxxxxx,PHID-CMIT-yyyyyy',
	description: 'Comma-separated list of commit PHIDs to set for the task',
};

const setParents: INodeProperties = {
	displayName: 'Set Parents',
	name: 'setParents',
	type: 'string',
	default: '',
	placeholder: 'PHID-TASK-xxxxxx,PHID-TASK-yyyyyy',
	description: 'Comma-separated list of parent task PHIDs to set for the task',
};

const setProjects: INodeProperties = {
	displayName: 'Set Projects',
	name: 'setProjects',
	type: 'string',
	default: '',
	placeholder: 'PHID-PROJ-xxxxxx,PHID-PROJ-yyyyyy',
	description: 'Comma-separated list of project PHIDs to set for the task',
};

const setSubscribers: INodeProperties = {
	displayName: 'Set Subscribers',
	name: 'setSubscribers',
	type: 'string',
	default: '',
	placeholder: 'PHID-USER-xxxxxx,PHID-USER-yyyyyy',
	description: 'Comma-separated list of user PHIDs to set as subscribers for the task',
};

const setSubtasks: INodeProperties = {
	displayName: 'Set Subtasks',
	name: 'setSubtasks',
	type: 'string',
	default: '',
	placeholder: 'PHID-TASK-xxxxxx,PHID-TASK-yyyyyy',
	description: 'Comma-separated list of subtask PHIDs to set for the task',
};

const space: INodeProperties = {
	displayName: 'Space',
	name: 'space',
	type: 'string',
	default: '',
	placeholder: 'PHID-SPCE-xxxxxx',
	description: 'PHID of the space to create the task in',
};

export const title: INodeProperties = {
	displayName: 'Title',
	name: 'title',
	type: 'string',
	default: '',
	placeholder: 'Example Task Title',
	description: 'Title of the task to create',
	displayOptions: {
		show: {
			resource: ['task'],
			operation: ['create'],
		},
	},
};

export const taskUpdateProperties: INodeProperties[] = [
	{
		displayName: 'Task PHID',
		name: 'taskPHID',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'PHID-TASK-xxxxxx',
		description: 'PHID of the task to update',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['edit'],
			},
		},
	},
];

const createTaskProperties: INodeProperties[] = [
  addCommits,
  addParents,
  addProjects,
  addSubscribers,
  addSubtasks,
  editPolicy,
  viewPolicy,
  column,
  comment,
  mfa,
  owner,
  parent,
  priority,
  removeCommits,
  removeParents,
  removeProjects,
  removeSubscribers,
  removeSubtasks,
  setCommits,
  setParents,
  setProjects,
  setSubscribers,
  setSubtasks,
  space,
  status,
  subtype,
];

export const taskSearchConstraintsOptions: INodeProperties[] = [
	ids,
	phids('task'),
	assigned,
	authorPHIDs,
	status,
	priorities,
	subtype,
	columnPHIDs,
	hasParents,
	hasSubtasks,
	parentIDs,
	subtaskIDs,
	groupBy,
	createdBefore('tasks'),
	createdAfter('tasks'),
	modifiedBefore('tasks'),
	modifiedAfter('tasks'),
	closedBefore,
	closedAfter,
	closerPHIDs,
	query,
	subscribers,
	projects,
];

export const taskTriggerConstraintsOptions: INodeProperties[] = [
	assigned,
	authorPHIDs,
	status,
	priorities,
	subtype,
	columnPHIDs,
	hasParents,
	hasSubtasks,
	parentIDs,
	subtaskIDs,
	closerPHIDs,
	query,
	subscribers,
	projects,
];

export const taskSearchAttachments: INodeProperties = {
	displayName: 'Attachments',
	name: 'attachments',
	type: 'multiOptions',
	default: [],
	description: 'Specify which attachments to include in the response',
	displayOptions: {
		show: {
			resource: ['task'],
			operation: ['search'],
		},
	},
	options: [
		{
			name: 'Columns',
			value: 'columns',
		},
		{
			name: 'Projects',
			value: 'projects',
		},
		{
			name: 'Subscribers',
			value: 'subscribers',
		},
	],
};

export const taskUpdateOptions: INodeProperties = {
	displayName: 'Options',
	name: 'taskUpdateOptions',
	type: 'collection',
	default: {},
	displayOptions: {
		show: {
			resource: ['task'],
			operation: ['edit'],
		},
	},
	options: createTaskProperties,
};


export const taskSearchConstraints: INodeProperties = {
	displayName: 'Constraints',
	name: 'taskSearchConstraints',
	type: 'collection',
	default: {},
	displayOptions: {
		show: {
			resource: ['task'],
			operation: ['search'],
		},
	},
	options: taskSearchConstraintsOptions,
};

export const taskCreateOptions: INodeProperties = {
	displayName: 'Additional Fields',
	name: 'taskCreateOptions',
	type: 'collection',
	default: {},
	options: createTaskProperties,
	displayOptions: {
		show: {
			resource: ['task'],
			operation: ['create'],
		},
	},
};

export const taskCreateProperties: INodeProperties[] = [
	title,
	description,
	taskCreateOptions,
];

export const taskCreateCommentProperties: INodeProperties[] = [
	createCommentProperty,
];

export const taskEditProperties: INodeProperties[] = [
	taskUpdateOptions,
];

