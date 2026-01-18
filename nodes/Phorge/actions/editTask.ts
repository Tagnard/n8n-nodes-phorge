/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { PHID } from 'phorge-ts';
import { connectToPhorgeServer, stringToArray } from '../helpers';
import { ManiphestUpdateTransaction } from 'phorge-ts/dist/models/maniphest';

export async function editTask(thisFunc: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const { client } = await connectToPhorgeServer.call(thisFunc);
	const returnItems: INodeExecutionData[] = [];

	const objectIdentifier = thisFunc.getNodeParameter('objectIdentifier', 0) as string;
	const fields = thisFunc.getNodeParameter('taskUpdateOptions', 0) as IDataObject;

	if (!objectIdentifier) {
		throw new NodeOperationError(thisFunc.getNode(), 'Task PHID or ID is required to update a task');
	}

	const transactions: ManiphestUpdateTransaction[] = [];

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

	if (fields.editPolicy) {
		transactions.push({ type: 'edit', value: fields.editPolicy as string });
	}

	if (fields.viewPolicy) {
		transactions.push({ type: 'view', value: fields.viewPolicy as string });
	}

	if (fields.column) {
		transactions.push({ type: 'column', value: fields.column as PHID<'COLN'> });
	}

	if (fields.comment) {
		transactions.push({ type: 'comment', value: fields.comment as string });
	}

	if (fields.mfa) {
		transactions.push({ type: 'mfa', value: fields.mfa as string });
	}

	if (fields.owner) {
		transactions.push({ type: 'owner', value: fields.owner as PHID<'USER'> });
	}

	if (fields.priority) {
		transactions.push({ type: 'priority', value: fields.priority as string });
	}

	if (fields.space) {
		transactions.push({ type: 'space', value: fields.space as PHID<'SPCE'> });
	}

	if (fields.status) {
		transactions.push({ type: 'status', value: fields.status as string });
	}

	if (fields.subtype) {
		transactions.push({ type: 'subtype', value: fields.subtype as string });
	}

	try {
		const updateTask = await client.updateManiphest(objectIdentifier as PHID<'TASK'>, transactions);

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
