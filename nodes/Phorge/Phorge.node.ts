/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import type { PHID, ProjectSearchOptions, UserSearchOptions } from 'phorge-ts';
import { connectToPhorgeServer } from './helpers';
import {
	taskCraeteProperties,
} from './properties/maniphest';
import { searchTask } from './actions/searchTask';
import { createTask } from './actions/createTask';
import { updateTask } from './actions/updateTask';

let allTagOptions: INodePropertyOptions[] = [];

export class Phorge implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Phorge',
		name: 'phorge',
		icon: { dark: 'file:../../icons/phorge.white.svg', light: 'file:../../icons/phorge.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["action"]}}',
		description: 'Interact with Phorge Conduit API',
		defaults: {
			name: 'Phorge',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'phorgeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',

				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Task',
						value: 'task',
						description: 'Operations on tasks',
					},
					{
						name: 'Project',
						value: 'project',
						description: 'Operations on projects',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Operations on users',
					},
				],
				default: 'task',
			},
			// ----------------------------------
			//         operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new task',
						action: 'Create an task',
					},
					{
						name: 'Create Comment',
						value: 'createComment',
						description: 'Create a new comment on an task',
						action: 'Create a comment on an task',
					},
					{
						name: 'Edit',
						value: 'edit',
						description: 'Edit an task',
						action: 'Edit an task',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get the data of a single task',
						action: 'Get an task',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search for projects',
						action: 'Search for projects',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search for users',
						action: 'Search for users',
					},
				],
				default: 'search',
			},
			...taskCraeteProperties,
			// taskSearchAttachments,
			// taskSearchConstraints,
			// 
			// ...taskUpdateProperties,
			// taskUpdateOptions,
			// projectSearchAttachments,
			// projectSearchConstraints,
			// userSearchAttachments,
			// userSearchConstraints,
		],
	};

	async execute(this: IExecuteFunctions) {
		const { client } = await connectToPhorgeServer.call(this);

		const resource = this.getNodeParameter('resource', 0);
		const action = this.getNodeParameter('action', 0);

		let returnItems: INodeExecutionData[] = [];

		if (resource === 'task') {
			if (action === 'search') {
				returnItems = await searchTask(this);
			} else if (action === 'create') {
				returnItems = await createTask(this);
			} else if (action === 'edit') {
				returnItems = await updateTask(this);
			}
		} else if (resource === 'project') {
			if (action === 'searchProject') {
				const projectSearchConstraints = this.getNodeParameter('projectSearchConstraints', 0) as {
					ids?: string;
					phids?: string;
					slugs?: string;
					members?: string;
					watchers?: string;
					status?: string;
					isMilestone?: boolean;
					isRoot?: boolean;
					minDepth?: number;
					maxDepth?: number;
					subtypes?: string;
					icons?: string;
					colors?: string;
					parents?: string;
					ancestors?: string;
					query?: string;
				};

				const params: ProjectSearchOptions = {};

				const attachments = this.getNodeParameter('attachments', 0) as string[];
				if (attachments.length > 0) {
					// Map selected attachment keys (strings) to the expected object shape with boolean flags
					const attachmentsObj: { members?: boolean; watchers?: boolean; ancestors?: boolean } = {};
					for (const a of attachments) {
						if (a === 'members' || a === 'watchers' || a === 'ancestors') {
							attachmentsObj[a] = true;
						}
					}
					params.attachments = attachmentsObj;
				}

				// IDs
				if (projectSearchConstraints.ids) {
					params.constraints = params.constraints || {};
					const ids_list = projectSearchConstraints.ids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					params.constraints.ids = ids_list as unknown as number[];
				}

				// PHIDs
				if (projectSearchConstraints.phids) {
					params.constraints = params.constraints || {};
					const ids_list = projectSearchConstraints.phids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					params.constraints.phids = ids_list as PHID<'PROJ'>[];
				}

				// Slugs
				if (projectSearchConstraints.slugs) {
					params.constraints = params.constraints || {};
					const slugs_list = projectSearchConstraints.slugs
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					params.constraints.slugs = slugs_list;
				}

				// Members
				if (projectSearchConstraints.members) {
					params.constraints = params.constraints || {};
					const members_list = projectSearchConstraints.members
						.split(',')
						.map((m) => m.trim())
						.filter(Boolean);
					params.constraints.members = members_list as PHID<'USER'>[];
				}

				// Watchers
				if (projectSearchConstraints.watchers) {
					params.constraints = params.constraints || {};
					const watchers_list = projectSearchConstraints.watchers
						.split(',')
						.map((w) => w.trim())
						.filter(Boolean);
					params.constraints.watchers = watchers_list as PHID<'USER'>[];
				}

				// Status
				if (projectSearchConstraints.status) {
					params.constraints = params.constraints || {};
					params.constraints.status = projectSearchConstraints.status as
						| 'active'
						| 'archived'
						| 'all';
				}

				// isMilestone
				if (projectSearchConstraints.isMilestone !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.isMilestone = projectSearchConstraints.isMilestone;
				}

				// isRoot
				if (projectSearchConstraints.isRoot !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.isRoot = projectSearchConstraints.isRoot;
				}

				// minDepth
				if (projectSearchConstraints.minDepth !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.minDepth = projectSearchConstraints.minDepth;
				}

				// maxDepth
				if (projectSearchConstraints.maxDepth !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.maxDepth = projectSearchConstraints.maxDepth;
				}

				// subtypes
				if (projectSearchConstraints.subtypes) {
					params.constraints = params.constraints || {};
					const subtypes_list = projectSearchConstraints.subtypes
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					params.constraints.subtypes = subtypes_list;
				}

				// icons
				if (projectSearchConstraints.icons) {
					params.constraints = params.constraints || {};
					const icons_list = projectSearchConstraints.icons
						.split(',')
						.map((i) => i.trim())
						.filter(Boolean);
					params.constraints.icons = icons_list;
				}

				// colors
				if (projectSearchConstraints.colors) {
					params.constraints = params.constraints || {};
					const colors_list = projectSearchConstraints.colors
						.split(',')
						.map((c) => c.trim())
						.filter(Boolean);
					params.constraints.colors = colors_list;
				}

				// parents
				if (projectSearchConstraints.parents) {
					params.constraints = params.constraints || {};
					const parents_list = projectSearchConstraints.parents
						.split(',')
						.map((p) => p.trim())
						.filter(Boolean);
					params.constraints.parents = parents_list as PHID<'PROJ'>[];
				}

				// ancestors
				if (projectSearchConstraints.ancestors) {
					params.constraints = params.constraints || {};
					const ancestors_list = projectSearchConstraints.ancestors
						.split(',')
						.map((a) => a.trim())
						.filter(Boolean);
					params.constraints.ancestors = ancestors_list as PHID<'PROJ'>[];
				}

				// query
				if (projectSearchConstraints.query) {
					params.constraints = params.constraints || {};
					params.constraints.query = projectSearchConstraints.query;
				}

				const projects = await client.searchProject(params);

				returnItems = projects.map((project) => ({
					json: project as IDataObject,
				}));
			}
		} else if (resource === 'user') {
			if (action == 'searchUser') {
				const userSearchConstraints = this.getNodeParameter('userSearchConstraints', 0) as {
					ids?: string;
					phids?: string;
					usernames?: string;
					nameLike?: string;
					isAdmin?: boolean;
					isDisabled?: boolean;
					isBot?: boolean;
					isMailingList?: boolean;
					needsApproval?: boolean;
					mfa?: boolean;
					createdAfter?: string;
					createdBefore?: string;
					query?: string;
				};

				const params: UserSearchOptions = {};

				// IDs
				if (userSearchConstraints.ids) {
					params.constraints = params.constraints || {};
					const ids_list = userSearchConstraints.ids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					params.constraints.ids = ids_list as unknown as number[];
				}

				// PHIDs
				if (userSearchConstraints.phids) {
					params.constraints = params.constraints || {};
					const ids_list = userSearchConstraints.phids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					params.constraints.phids = ids_list as PHID<'USER'>[];
				}

				// Usernames
				if (userSearchConstraints.usernames) {
					params.constraints = params.constraints || {};
					const usernames_list = userSearchConstraints.usernames
						.split(',')
						.map((u) => u.trim())
						.filter(Boolean);
					params.constraints.usernames = usernames_list;
				}

				// nameLike
				if (userSearchConstraints.nameLike) {
					params.constraints = params.constraints || {};
					params.constraints.nameLike = userSearchConstraints.nameLike;
				}

				// isAdmin
				if (userSearchConstraints.isAdmin !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.isAdmin = userSearchConstraints.isAdmin;
				}

				// isDisabled
				if (userSearchConstraints.isDisabled !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.isDisabled = userSearchConstraints.isDisabled;
				}

				// isBot
				if (userSearchConstraints.isBot !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.isBot = userSearchConstraints.isBot;
				}

				// isMailingList
				if (userSearchConstraints.isMailingList !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.isMailingList = userSearchConstraints.isMailingList;
				}

				// needsApproval
				if (userSearchConstraints.needsApproval !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.needsApproval = userSearchConstraints.needsApproval;
				}

				// mfa
				if (userSearchConstraints.mfa !== undefined) {
					params.constraints = params.constraints || {};
					params.constraints.mfa = userSearchConstraints.mfa;
				}

				// createdAfter
				if (userSearchConstraints.createdAfter) {
					params.constraints = params.constraints || {};
					params.constraints.createdStart = Number(userSearchConstraints.createdAfter);
				}

				// createdBefore
				if (userSearchConstraints.createdBefore) {
					params.constraints = params.constraints || {};
					params.constraints.createdEnd = Number(userSearchConstraints.createdBefore);
				}

				// query
				if (userSearchConstraints.query) {
					params.constraints = params.constraints || {};
					params.constraints.query = userSearchConstraints.query;
				}

				const users = await client.searchUser(params);

				returnItems = users.map((user) => ({
					json: user as IDataObject,
				}));
			}
		}

		return [returnItems];
	}

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions) {
				const { client } = await connectToPhorgeServer.call(this);

				if (allTagOptions.length === 0) {
					const tags = await client.searchProject();
					allTagOptions = tags.map((project) => ({
						name: project.fields.name,
						value: project.phid,
					}));
				}

				const selectedValues = (this.getCurrentNodeParameter('tags') as string[]) || [];
				return allTagOptions.filter((o) => !selectedValues.includes(o.value as string));
			},
		},
	};
}
