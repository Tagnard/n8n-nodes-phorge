/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { PHID } from 'phorge-ts';
import { connectToPhorgeServer } from '../helpers';
import { TaskTransactions } from 'phorge-ts/dist/models/maniphest';

export async function updateTask(thisFunc: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const { client } = await connectToPhorgeServer.call(thisFunc);
	const returnItems: INodeExecutionData[] = [];

	const taskPhid = thisFunc.getNodeParameter('taskPHID', 0) as string;
	const fields = thisFunc.getNodeParameter('taskUpdateOptions', 0) as IDataObject;

	if (!taskPhid) {
		throw new NodeOperationError(thisFunc.getNode(), 'Task PHID is required to update a task');
	}

	const transaction: TaskTransactions = {};

	if (fields.addCommits) {
		const commits_list = (fields.addCommits as string)
			.split(',')
			.map((c) => c.trim())
			.filter(Boolean);
		transaction.commits = {
			add: commits_list as unknown as PHID<'CMIT'>[],
		};
	}

	if (fields.addParents) {
		const parents_list = (fields.addParents as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.parents = {
			add: parents_list as unknown as PHID<'TASK'>[],
		};
	}

	if (fields.addProjects) {
		const projects_list = (fields.addProjects as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.projects = {
			add: projects_list as unknown as PHID<'PROJ'>[],
		};
	}

	if (fields.addSubscribers) {
		const subscribers_list = (fields.addSubscribers as string)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		transaction.subscribers = {
			add: subscribers_list as unknown as PHID<'USER'>[],
		};
	}

	if (fields.addSubtasks) {
		const subtasks_list = (fields.addSubtasks as string)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		transaction.subtasks = {
			add: subtasks_list as unknown as PHID<'TASK'>[],
		};
	}

	if (fields.editPolicy) {
		transaction.edit = fields.editPolicy as string;
	}

	if (fields.viewPolicy) {
		transaction.view = fields.viewPolicy as string;
	}

	if (fields.column) {
		transaction.column = fields.column as PHID<'COLN'>;
	}

	if (fields.comment) {
		transaction.comment = fields.comment as string;
	}

	if (fields.mfa) {
		transaction.mfa = fields.mfa as string;
	}

	if (fields.owner) {
		transaction.owner = fields.owner as PHID<'USER'>;
	}

	if (fields.priority) {
		transaction.priority = fields.priority as string;
	}

	if (fields.removeCommits) {
		const commits_list = (fields.removeCommits as string)
			.split(',')
			.map((c) => c.trim())
			.filter(Boolean);
		transaction.commits = transaction.commits || {};
		transaction.commits.remove = commits_list as unknown as PHID<'CMIT'>[];
	}

	if (fields.removeParents) {
		const parents_list = (fields.removeParents as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.parents = transaction.parents || {};
		transaction.parents.remove = parents_list as unknown as PHID<'TASK'>[];
	}

	if (fields.removeProjects) {
		const projects_list = (fields.removeProjects as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.projects = transaction.projects || {};
		transaction.projects.remove = projects_list as unknown as PHID<'PROJ'>[];
	}

	if (fields.removeSubscribers) {
		const subscribers_list = (fields.removeSubscribers as string)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		transaction.subscribers = transaction.subscribers || {};
		transaction.subscribers.remove = subscribers_list as unknown as PHID<'USER'>[];
	}

	if (fields.removeSubtasks) {
		const subtasks_list = (fields.removeSubtasks as string)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		transaction.subtasks = transaction.subtasks || {};
		transaction.subtasks.remove = subtasks_list as unknown as PHID<'TASK'>[];
	}

	if (fields.setCommits) {
		const commits_list = (fields.setCommits as string)
			.split(',')
			.map((c) => c.trim())
			.filter(Boolean);
		transaction.commits = transaction.commits || {};
		transaction.commits.set = commits_list as unknown as PHID<'CMIT'>[];
	}

	if (fields.setParents) {
		const parents_list = (fields.setParents as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.parents = transaction.parents || {};
		transaction.parents.set = parents_list as unknown as PHID<'TASK'>[];
	}

	if (fields.setProjects) {
		const projects_list = (fields.setProjects as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.projects = transaction.projects || {};
		transaction.projects.set = projects_list as unknown as PHID<'PROJ'>[];
	}

	if (fields.setSubscribers) {
		const subscribers_list = (fields.setSubscribers as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.subscribers = transaction.subscribers || {};
		transaction.subscribers.set = subscribers_list as unknown as PHID<'USER'>[];
	}

	if (fields.setSubtasks) {
		const subtasks_list = (fields.setSubtasks as string)
			.split(',')
			.map((p) => p.trim())
			.filter(Boolean);
		transaction.subtasks = transaction.subtasks || {};
		transaction.subtasks.set = subtasks_list as unknown as PHID<'TASK'>[];
	}

	if (fields.space) {
		transaction.space = fields.space as PHID<'SPCE'>;
	}

	if (fields.status) {
		transaction.status = fields.status as string;
	}

	if (fields.subtype) {
		transaction.subtype = fields.subtype as string;
	}

	try {
		const updateTask = await client.updateTask(taskPhid as PHID<'TASK'>, transaction);

		returnItems.push({
			json: updateTask as IDataObject,
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new NodeOperationError(thisFunc.getNode(), `Error creating task: ${error.message}`);
		}
	}

	return [];
}
