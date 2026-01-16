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
	taskCreateProperties,
	taskEditProperties,
	taskSearchAttachments,
	taskSearchConstraints,
} from './properties/maniphest';
import { searchTask } from './actions/searchTask';
import { createTask } from './actions/createTask';
import { objectIdentifier } from './properties/shared';
import { editTask } from './actions/editTask';

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
						name: 'Edit',
						value: 'edit',
						description: 'Edit an task',
						action: 'Edit an task',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for tasks',
						action: 'Search for tasks',
					}
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
			// Create 
			objectIdentifier,
			...taskCreateProperties,
			...taskEditProperties,
			taskSearchAttachments,
			taskSearchConstraints,
			// ...taskUpdateProperties,
			// taskUpdateOptions,
			// projectSearchAttachments,
			//projectSearchConstraints,
			// userSearchAttachments,
			// userSearchConstraints,
		],
	};

	async execute(this: IExecuteFunctions) {
		const { client } = await connectToPhorgeServer.call(this);

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let returnItems: INodeExecutionData[] = [];

		if (resource === 'task') {
			if (operation === 'search') {
				returnItems = await searchTask(this);
			} else if (operation === 'create') {
				returnItems = await createTask(this);
			} else if (operation === 'edit') {
				returnItems = await editTask(this);
			}
		} else if (resource === 'project') {
			if (operation === 'search') {
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
				const constraints: IDataObject = {};

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
					const ids_list = projectSearchConstraints.ids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					constraints.ids = ids_list as unknown as number[];
				}

				// PHIDs
				if (projectSearchConstraints.phids) {
					const ids_list = projectSearchConstraints.phids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					constraints.phids = ids_list as PHID<'PROJ'>[];
				}

				// Slugs
				if (projectSearchConstraints.slugs) {
					const slugs_list = projectSearchConstraints.slugs
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					constraints.slugs = slugs_list;
				}

				// Members
				if (projectSearchConstraints.members) {
					const members_list = projectSearchConstraints.members
						.split(',')
						.map((m) => m.trim())
						.filter(Boolean);
					constraints.members = members_list as PHID<'USER'>[];
				}

				// Watchers
				if (projectSearchConstraints.watchers) {
					const watchers_list = projectSearchConstraints.watchers
						.split(',')
						.map((w) => w.trim())
						.filter(Boolean);
					constraints.watchers = watchers_list as PHID<'USER'>[];
				}

				// Status
				if (projectSearchConstraints.status) {
					constraints.status = projectSearchConstraints.status as
						| 'active'
						| 'archived'
						| 'all';
				}

				// isMilestone
				if (projectSearchConstraints.isMilestone !== undefined) {
					constraints.isMilestone = projectSearchConstraints.isMilestone;
				}

				// isRoot
				if (projectSearchConstraints.isRoot !== undefined) {
					constraints.isRoot = projectSearchConstraints.isRoot;
				}

				// minDepth
				if (projectSearchConstraints.minDepth !== undefined) {
					constraints.minDepth = projectSearchConstraints.minDepth;
				}

				// maxDepth
				if (projectSearchConstraints.maxDepth !== undefined) {
					constraints.maxDepth = projectSearchConstraints.maxDepth;
				}

				// subtypes
				if (projectSearchConstraints.subtypes) {
					const subtypes_list = projectSearchConstraints.subtypes
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					constraints.subtypes = subtypes_list;
				}

				// icons
				if (projectSearchConstraints.icons) {
					const icons_list = projectSearchConstraints.icons
						.split(',')
						.map((i) => i.trim())
						.filter(Boolean);
					constraints.icons = icons_list;
				}

				// colors
				if (projectSearchConstraints.colors) {
					const colors_list = projectSearchConstraints.colors
						.split(',')
						.map((c) => c.trim())
						.filter(Boolean);
					constraints.colors = colors_list;
				}

				// parents
				if (projectSearchConstraints.parents) {
					const parents_list = projectSearchConstraints.parents
						.split(',')
						.map((p) => p.trim())
						.filter(Boolean);
					constraints.parents = parents_list as PHID<'PROJ'>[];
				}

				// ancestors
				if (projectSearchConstraints.ancestors) {
					const ancestors_list = projectSearchConstraints.ancestors
						.split(',')
						.map((a) => a.trim())
						.filter(Boolean);
					constraints.ancestors = ancestors_list as PHID<'PROJ'>[];
				}

				// query
				if (projectSearchConstraints.query) {
					constraints.query = projectSearchConstraints.query;
				}

				if (Object.keys(constraints).length > 0) {
					params.constraints = constraints;
				}

				const projects = await client.searchProject(params);

				returnItems = projects.map((project) => ({
					json: project as IDataObject,
				}));
			}
		} else if (resource === 'user') {
			if (operation == 'search') {
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
				const constraints: IDataObject = {};

				// IDs
				if (userSearchConstraints.ids) {
					const ids_list = userSearchConstraints.ids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					constraints.ids = ids_list as unknown as number[];
				}

				// PHIDs
				if (userSearchConstraints.phids) {
					const ids_list = userSearchConstraints.phids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
					constraints.phids = ids_list as PHID<'USER'>[];
				}

				// Usernames
				if (userSearchConstraints.usernames) {
					const usernames_list = userSearchConstraints.usernames
						.split(',')
						.map((u) => u.trim())
						.filter(Boolean);
					constraints.usernames = usernames_list;
				}

				// nameLike
				if (userSearchConstraints.nameLike) {
					constraints.nameLike = userSearchConstraints.nameLike;
				}

				// isAdmin
				if (userSearchConstraints.isAdmin !== undefined) {
					constraints.isAdmin = userSearchConstraints.isAdmin;
				}

				// isDisabled
				if (userSearchConstraints.isDisabled !== undefined) {
					constraints.isDisabled = userSearchConstraints.isDisabled;
				}

				// isBot
				if (userSearchConstraints.isBot !== undefined) {
					constraints.isBot = userSearchConstraints.isBot;
				}

				// isMailingList
				if (userSearchConstraints.isMailingList !== undefined) {
					constraints.isMailingList = userSearchConstraints.isMailingList;
				}

				// needsApproval
				if (userSearchConstraints.needsApproval !== undefined) {
					constraints.needsApproval = userSearchConstraints.needsApproval;
				}

				// mfa
				if (userSearchConstraints.mfa !== undefined) {
					constraints.mfa = userSearchConstraints.mfa;
				}

				// createdAfter
				if (userSearchConstraints.createdAfter) {
					constraints.createdStart = Number(userSearchConstraints.createdAfter);
				}

				// createdBefore
				if (userSearchConstraints.createdBefore) {
					constraints.createdEnd = Number(userSearchConstraints.createdBefore);
				}

				// query
				if (userSearchConstraints.query) {
					constraints.query = userSearchConstraints.query;
				}

				if (Object.keys(constraints).length > 0) {
					params.constraints = constraints;
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
						name: project.fields.name as string,
						value: project.phid,
					}));
				}

				const selectedValues = (this.getCurrentNodeParameter('tags') as string[]) || [];
				return allTagOptions.filter((o) => !selectedValues.includes(o.value as string));
			},
		},
	};
}
