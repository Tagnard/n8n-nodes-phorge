/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import { IDataObject, IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { TaskSearchOptions, PHID, TaskConstraints } from 'phorge-ts';
import { connectToPhorgeServer, stringToArray } from '../helpers';

export async function searchTask(thisFunc: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const { client } = await connectToPhorgeServer.call(thisFunc);
    let returnItems: INodeExecutionData[] = [];

    const taskSearchConstraints = thisFunc.getNodeParameter('taskSearchConstraints', 0) as {
		ids?: string;
		phids?: string;
		assigned?: string;
		authorPHIDs?: string;
		statuses?: string;
		priorities?: string;
		subtypes?: string;
		columnPHIDs?: string;
		hasParents?: boolean;
		hasSubtasks?: boolean;
		groupBy?: string;
		createdBefore?: string;
		createdAfter?: string;
		modifiedBefore?: string;
		modifiedAfter?: string;
		closedBefore?: string;
		closedAfter?: string;
		closerPHIDs?: string;
		query?: string;
		subscribers?: string;
		projects?: string;
	};

	const attachments = thisFunc.getNodeParameter('attachments', 0) as string[];

	const params: TaskSearchOptions = {};

	if (attachments.length > 0) {
		// Map selected attachment keys (strings) to the expected object shape with boolean flags
		const attachmentsObj: { columns?: boolean; projects?: boolean; subscribers?: boolean } = {};
		for (const a of attachments) {
			if (a === 'columns' || a === 'projects' || a === 'subscribers') {
				attachmentsObj[a] = true;
			}
		}
		params.attachments = attachmentsObj;
	}

	const constraints: TaskConstraints = {};

	// IDs
	if (taskSearchConstraints.ids) {
		const ids_list = stringToArray(taskSearchConstraints.ids);
		constraints.ids = ids_list as unknown as number[];
	}

	// PHIDs
	if (taskSearchConstraints.phids) {
		const phids_list = stringToArray<PHID<'TASK'>>(taskSearchConstraints.phids);
		const phidRegex = /^PHID-TASK-[a-z0-9]+$/;
		if (!phids_list.every((p) => phidRegex.test(p))) {
			throw new NodeOperationError(
				thisFunc.getNode(),
				'PHIDs must be a comma-separated list of valid TASK PHIDs, e.g., PHID-TASK-yi2nwyjcvkwskag5ncqx',
			);
		}
		constraints.phids = phids_list;
	}

	if (taskSearchConstraints.assigned) {
		constraints.assigned = [taskSearchConstraints.assigned] as PHID<'USER'>[];
	}

	if (taskSearchConstraints.createdBefore) {
		constraints.createdStart = Number(taskSearchConstraints.createdBefore);
	}

	if (taskSearchConstraints.createdAfter) {
		constraints.createdEnd = Number(taskSearchConstraints.createdAfter);
	}

	if (taskSearchConstraints.query) {
		constraints.query = taskSearchConstraints.query;
	}

	if (Object.keys(constraints).length > 0) {
		params.constraints = constraints;
	}

	try {
		const items = await client.searchTask(params);

		// Return full task objects
		returnItems = items.map((item) => ({
			json: item as IDataObject,
		}));

        return returnItems;
	} catch (error) {
		if (error instanceof Error) {
			thisFunc.logger.error(error.cause as string);
			throw new NodeOperationError(thisFunc.getNode(), `Error fetching tasks: ${error.message}`);
		}
	}
    return []
}
