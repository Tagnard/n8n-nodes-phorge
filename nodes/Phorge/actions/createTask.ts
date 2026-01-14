/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { PHID } from 'phorge-ts';
import { connectToPhorgeServer, stringToArray } from '../helpers';
import { TaskTransaction } from 'phorge-ts/dist/models/maniphest';

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

	const transactions: TaskTransaction[] = [
		{ type: 'title', value: fields.title },
		{ type: 'description', value: fields.description },
	];

	if (fields.editPolicy)
		transactions.push({ type: 'edit', value: fields.editPolicy as string });
	if (fields.viewPolicy)
		transactions.push({ type: 'view', value: fields.viewPolicy as string });
	if (fields.column) transactions.push({ type: 'column', value: fields.column });
	if (fields.comment) transactions.push({ type: 'comment', value: fields.comment });
	if (fields.mfa) transactions.push({ type: 'mfa', value: fields.mfa });
	if (fields.owner) transactions.push({ type: 'owner', value: fields.owner });
	if (fields.priority) transactions.push({ type: 'priority', value: fields.priority });
	if (fields.space) transactions.push({ type: 'space', value: fields.space });
	if (fields.status) transactions.push({ type: 'status', value: fields.status });
	if (fields.subtype) transactions.push({ type: 'subtype', value: fields.subtype });

	if (fields.addCommits) {
		transactions.push({ type: 'commits.add', value: stringToArray(fields.addCommits as string) });
	}
	if (fields.removeCommits) {
		transactions.push({
			type: 'commits.remove',
			value: stringToArray(fields.removeCommits as string),
		});
	}
	if (fields.setCommits) {
		transactions.push({ type: 'commits.set', value: stringToArray(fields.setCommits as string) });
	}

	if (fields.addParents) {
		transactions.push({ type: 'parents.add', value: stringToArray(fields.addParents as string) });
	}
	if (fields.removeParents) {
		transactions.push({
			type: 'parents.remove',
			value: stringToArray(fields.removeParents as string),
		});
	}
	if (fields.setParents) {
		transactions.push({ type: 'parents.set', value: stringToArray(fields.setParents as string) });
	}

	if (fields.addProjects) {
		transactions.push({
			type: 'projects.add',
			value: stringToArray(fields.addProjects as string),
		});
	}
	if (fields.removeProjects) {
		transactions.push({
			type: 'projects.remove',
			value: stringToArray(fields.removeProjects as string),
		});
	}
	if (fields.setProjects) {
		transactions.push({
			type: 'projects.set',
			value: stringToArray(fields.setProjects as string),
		});
	}

	if (fields.addSubscribers) {
		transactions.push({
			type: 'subscribers.add',
			value: stringToArray(fields.addSubscribers as string),
		});
	}
	if (fields.removeSubscribers) {
		transactions.push({
			type: 'subscribers.remove',
			value: stringToArray(fields.removeSubscribers as string),
		});
	}
	if (fields.setSubscribers) {
		transactions.push({
			type: 'subscribers.set',
			value: stringToArray(fields.setSubscribers as string),
		});
	}

	if (fields.addSubtasks) {
		transactions.push({ type: 'subtasks.add', value: stringToArray(fields.addSubtasks as string) });
	}
	if (fields.removeSubtasks) {
		transactions.push({
			type: 'subtasks.remove',
			value: stringToArray(fields.removeSubtasks as string),
		});
	}
	if (fields.setSubtasks) {
		transactions.push({ type: 'subtasks.set', value: stringToArray(fields.setSubtasks as string) });
	}

	try {
		const createdTask = await client.createTask(transactions);

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
