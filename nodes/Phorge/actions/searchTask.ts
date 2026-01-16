import { IDataObject, IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { TaskSearchOptions } from 'phorge-ts';
import { connectToPhorgeServer } from '../helpers';
import { buildConstraints } from '../FilterHelper';

export async function searchTask(thisFunc: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const { client } = await connectToPhorgeServer.call(thisFunc);
	let returnItems: INodeExecutionData[] = [];

	const taskSearchConstraints = (thisFunc.getNodeParameter('taskSearchConstraints', 0) as {
		ids?: string;
		phids?: string;
		assigned?: string;
		authorPHIDs?: string;
		status?: string;
		priorities?: string;
		subtype?: string;
		columnPHIDs?: string;
		hasParents?: boolean;
		hasSubtasks?: boolean;
		parentIDs?: string;
		subtaskIDs?: string;
		group?: string;
		createdBefore?: string;
		createdAfter?: string;
		modifiedBefore?: string;
		modifiedAfter?: string;
		closedStart?: string;
		closedEnd?: string;
		closerPHIDs?: string;
		query?: string;
		subscribers?: string;
		projects?: string;
	}) || {};

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

	const constraints = buildConstraints(taskSearchConstraints, thisFunc.getNode);

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
