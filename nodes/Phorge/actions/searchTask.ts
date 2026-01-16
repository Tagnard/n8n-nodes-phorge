import { IDataObject, IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { TaskSearchOptions, PHID } from 'phorge-ts';
import { connectToPhorgeServer, stringToArray } from '../helpers';

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

	const constraints: IDataObject = {};

	// IDs
	if (taskSearchConstraints.ids) {
		constraints.ids = stringToArray(taskSearchConstraints.ids).map(Number);
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
		constraints.assigned = stringToArray<PHID<'USER'>>(taskSearchConstraints.assigned);
	}

	if (taskSearchConstraints.authorPHIDs) {
		constraints.authorPHIDs = stringToArray<PHID<'USER'>>(taskSearchConstraints.authorPHIDs);
	}

	if (taskSearchConstraints.status) {
		constraints.statuses = stringToArray(taskSearchConstraints.status);
	}

	if (taskSearchConstraints.priorities) {
		constraints.priorities = stringToArray(taskSearchConstraints.priorities).map(Number);
	}

	if (taskSearchConstraints.subtype) {
		constraints.subtypes = stringToArray(taskSearchConstraints.subtype);
	}

	if (taskSearchConstraints.columnPHIDs) {
		constraints.columnPHIDs = stringToArray<PHID<'PCOL'>>(taskSearchConstraints.columnPHIDs);
	}

	if (taskSearchConstraints.hasParents !== undefined) {
		constraints.hasParents = taskSearchConstraints.hasParents;
	}

	if (taskSearchConstraints.hasSubtasks !== undefined) {
		constraints.hasSubtasks = taskSearchConstraints.hasSubtasks;
	}

	if (taskSearchConstraints.parentIDs) {
		constraints.parentIDs = stringToArray<PHID<'TASK'>>(taskSearchConstraints.parentIDs);
	}

	if (taskSearchConstraints.subtaskIDs) {
		constraints.subtaskIDs = stringToArray<PHID<'TASK'>>(taskSearchConstraints.subtaskIDs);
	}

	if (taskSearchConstraints.group && taskSearchConstraints.group !== 'none') {
		constraints.group = taskSearchConstraints.group;
	}

	if (taskSearchConstraints.createdBefore) {
		constraints.createdEnd = Number(taskSearchConstraints.createdBefore);
	}

	if (taskSearchConstraints.createdAfter) {
		constraints.createdStart = Number(taskSearchConstraints.createdAfter);
	}

	if (taskSearchConstraints.modifiedBefore) {
		constraints.modifiedEnd = Number(taskSearchConstraints.modifiedBefore);
	}

	if (taskSearchConstraints.modifiedAfter) {
		constraints.modifiedStart = Number(taskSearchConstraints.modifiedAfter);
	}

	if (taskSearchConstraints.closedStart) {
		constraints.closedStart = Number(taskSearchConstraints.closedStart);
	}

	if (taskSearchConstraints.closedEnd) {
		constraints.closedEnd = Number(taskSearchConstraints.closedEnd);
	}

	if (taskSearchConstraints.closerPHIDs) {
		constraints.closerPHIDs = stringToArray<PHID<'USER'>>(taskSearchConstraints.closerPHIDs);
	}

	if (taskSearchConstraints.query) {
		constraints.query = taskSearchConstraints.query;
	}

	if (taskSearchConstraints.subscribers) {
		constraints.subscribers = stringToArray<PHID<'USER'>>(taskSearchConstraints.subscribers);
	}

	if (taskSearchConstraints.projects) {
		constraints.projects = stringToArray<PHID<'PROJ'>>(taskSearchConstraints.projects);
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
