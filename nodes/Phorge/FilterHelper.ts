import { IDataObject, INode, NodeOperationError } from 'n8n-workflow';
import { PHID } from 'phorge-ts';
import { stringToArray } from './helpers';

export function buildConstraints(filters: IDataObject, getNode: () => INode): IDataObject {
	const constraints: IDataObject = {};

	// IDs
	if (filters.ids) {
		constraints.ids = stringToArray(filters.ids as string).map(Number);
	}

	// PHIDs
	if (filters.phids) {
		const phids_list = stringToArray<PHID<'TASK'>>(filters.phids as string);
		const phidRegex = /^PHID-TASK-[a-z0-9]+$/;
		if (!phids_list.every((p) => phidRegex.test(p))) {
			throw new NodeOperationError(
				getNode(),
				'PHIDs must be a comma-separated list of valid TASK PHIDs, e.g., PHID-TASK-yi2nwyjcvkwskag5ncqx',
			);
		}
		constraints.phids = phids_list;
	}

	if (filters.assigned) {
		constraints.assigned = stringToArray<PHID<'USER'>>(filters.assigned as string);
	}

	if (filters.authorPHIDs) {
		constraints.authorPHIDs = stringToArray<PHID<'USER'>>(filters.authorPHIDs as string);
	}

	if (filters.status) {
		constraints.statuses = stringToArray(filters.status as string);
	}

	if (filters.priorities) {
		constraints.priorities = stringToArray(filters.priorities as string).map(Number);
	}

	if (filters.subtype) {
		constraints.subtypes = stringToArray(filters.subtype as string);
	}

	if (filters.columnPHIDs) {
		constraints.columnPHIDs = stringToArray<PHID<'PCOL'>>(filters.columnPHIDs as string);
	}

	if (filters.hasParents !== undefined) {
		constraints.hasParents = filters.hasParents;
	}

	if (filters.hasSubtasks !== undefined) {
		constraints.hasSubtasks = filters.hasSubtasks;
	}

	if (filters.parentIDs) {
		constraints.parentIDs = stringToArray<PHID<'TASK'>>(filters.parentIDs as string);
	}

	if (filters.subtaskIDs) {
		constraints.subtaskIDs = stringToArray<PHID<'TASK'>>(filters.subtaskIDs as string);
	}

	if (filters.group && filters.group !== 'none') {
		constraints.group = filters.group;
	}

	if (filters.createdBefore) {
		constraints.createdEnd = Number(filters.createdBefore);
	}

	if (filters.createdAfter) {
		constraints.createdStart = Number(filters.createdAfter);
	}

	if (filters.modifiedBefore) {
		constraints.modifiedEnd = Number(filters.modifiedBefore);
	}

	if (filters.modifiedAfter) {
		constraints.modifiedStart = Number(filters.modifiedAfter);
	}

	if (filters.closedStart) {
		constraints.closedStart = Number(filters.closedStart);
	}

	if (filters.closedEnd) {
		constraints.closedEnd = Number(filters.closedEnd);
	}

	if (filters.closerPHIDs) {
		constraints.closerPHIDs = stringToArray<PHID<'USER'>>(filters.closerPHIDs as string);
	}

	if (filters.query) {
		constraints.query = filters.query;
	}

	if (filters.subscribers) {
		constraints.subscribers = stringToArray<PHID<'USER'>>(filters.subscribers as string);
	}

	if (filters.projects) {
		constraints.projects = stringToArray<PHID<'PROJ'>>(filters.projects as string);
	}

	return constraints;
}
