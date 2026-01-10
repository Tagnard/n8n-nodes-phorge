/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { PHID } from 'phorge-ts';
import { connectToPhorgeServer, stringToArray } from '../helpers';
import { TaskTransactions } from 'phorge-ts/dist/models/maniphest';

export async function createTask(thisFunc: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const { client } = await connectToPhorgeServer.call(thisFunc);
	const returnItems: INodeExecutionData[] = [];

	const fields = thisFunc.getNodeParameter('taskCreateOptions', 0) as {
		addCommits: string;
		addParents: string;
		addProjects: string;
		addSubscribers: string;
		addSubtasks: string;
		editPolicy: string;
		viewPolicy: string;
		column: PHID<'COLN'>;
		comment: string;
		description: string;
		mfa: string;
		owner: PHID<'USER'>;
		parent: string;
		priority: string;
		removeCommits: string;
		removeParents: string;
		removeProjects: string;
		removeSubscribers: string;
		removeSubtasks: string;
		setCommits: string;
		setParents: string;
		setProjects: string;
		setSubscribers: string;
		setSubtasks: string;
		space: string;
		status: string;
		subtype: string;
		title: string;
	};

	if (!fields.title || !fields.description) {
		throw new NodeOperationError(
			thisFunc.getNode(),
			'Title and a Description is required to create a task',
		);
	}

	const transaction: TaskTransactions = {
		title: fields.title,
		description: fields.description,
	};

	if (fields.editPolicy) transaction.edit = fields.editPolicy;
	if (fields.viewPolicy) transaction.view = fields.viewPolicy;
	if (fields.column) transaction.column = fields.column;
	if (fields.comment) transaction.comment = fields.comment;
	if (fields.mfa) transaction.mfa = fields.mfa;
	if (fields.owner) transaction.owner = fields.owner;
	if (fields.priority) transaction.priority = fields.priority;
	if (fields.space) transaction.space = fields.space as PHID<'SPCE'>;
	if (fields.status) transaction.status = fields.status;
	if (fields.subtype) transaction.subtype = fields.subtype;

	if (fields.addCommits) {
		transaction.commits = transaction.commits || {};
		transaction.commits = {
			add: stringToArray<PHID<'CMIT'>>(fields.addCommits),
		};
	}

	if (fields.addParents) {
		transaction.parents = transaction.parents || {};
		transaction.parents = {
			add: stringToArray<PHID<'TASK'>>(fields.addParents),
		};
	}

	if (fields.addProjects) {
		transaction.projects = transaction.projects || {};
		transaction.projects = {
			add: stringToArray<PHID<'PROJ'>>(fields.addProjects),
		};
	}

	if (fields.addSubscribers) {
		transaction.subscribers = transaction.subscribers || {};
		transaction.subscribers = {
			add: stringToArray<PHID<'USER'>>(fields.addSubscribers),
		};
	}

	if (fields.addSubtasks) {
		transaction.subtasks = transaction.subtasks || {};
		transaction.subtasks = {
			add: stringToArray<PHID<'TASK'>>(fields.addSubtasks),
		};
	}

	if (fields.removeCommits) {
		transaction.commits = transaction.commits || {};
		transaction.commits.remove = stringToArray<PHID<'CMIT'>>(fields.removeCommits);
	}

	if (fields.removeParents) {
		transaction.parents = transaction.parents || {};
		transaction.parents.remove = stringToArray<PHID<'TASK'>>(fields.removeParents);
	}

	if (fields.removeProjects) {
		transaction.projects = transaction.projects || {};
		transaction.projects.remove = stringToArray<PHID<'PROJ'>>(fields.removeProjects);
	}

	if (fields.removeSubscribers) {
		transaction.subscribers = transaction.subscribers || {};
		transaction.subscribers.remove = stringToArray<PHID<'USER'>>(fields.removeSubscribers);
	}

	if (fields.removeSubtasks) {
		transaction.subtasks = transaction.subtasks || {};
		transaction.subtasks.remove = stringToArray<PHID<'TASK'>>(fields.removeSubtasks);
	}

	if (fields.setCommits) {
		transaction.commits = transaction.commits || {};
		transaction.commits.set = stringToArray<PHID<'CMIT'>>(fields.setCommits);
	}

	if (fields.setParents) {
		transaction.parents = transaction.parents || {};
		transaction.parents.set = stringToArray<PHID<'TASK'>>(fields.setParents);
	}

	if (fields.setProjects) {
		transaction.projects = transaction.projects || {};
		transaction.projects.set = stringToArray<PHID<'PROJ'>>(fields.setProjects);
	}

	if (fields.setSubscribers) {
		transaction.subscribers = transaction.subscribers || {};
		transaction.subscribers.set = stringToArray<PHID<'USER'>>(fields.setSubscribers);
	}

	if (fields.setSubtasks) {
		transaction.subtasks = transaction.subtasks || {};
		transaction.subtasks.set = stringToArray<PHID<'TASK'>>(fields.setSubtasks);
	}

	try {
		const createdTask = await client.createTask(transaction);

		returnItems.push({
			json: createdTask as IDataObject,
		});

        return returnItems;
	} catch (error) {
		if (error instanceof Error) {
			throw new NodeOperationError(thisFunc.getNode(), `Error creating task: ${error.message}`);
		}
	}

	return [];
}
