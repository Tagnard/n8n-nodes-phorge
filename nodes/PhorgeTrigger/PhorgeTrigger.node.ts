/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { Client, ManiphestSearchOptions } from 'phorge-ts';
import { taskTriggerConstraintsOptions } from '../Phorge/properties/maniphest';
import { buildConstraints } from '../Phorge/FilterHelper';

export class PhorgeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Phorge Trigger',
		name: 'phorgeTrigger',
		icon: { dark: 'file:../../icons/phorge.white.svg', light: 'file:../../icons/phorge.svg' },
		group: ['trigger'],
		version: [1],
		description:
			'Fetches items from Phorge and starts the workflow on specified polling intervals.',
		subtitle: '={{"Phorge Trigger"}}',
		defaults: {
			name: 'Phorge Trigger',
		},
		credentials: [
			{
				name: 'phorgeApi',
				required: true,
			},
		],
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'taskCreated',
				options: [
					{
						name: 'Task Created',
						value: 'taskCreated',
					},
					{
						name: 'Task Updated',
						value: 'taskUpdated',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				default: {},
				placeholder: 'Add Filter',
				options: taskTriggerConstraintsOptions,
				displayOptions: {
					show: {
						event: ['taskCreated', 'taskUpdated'],
					},
				},
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const staticData = this.getWorkflowStaticData('node');
		const now = Math.floor(Date.now() / 1000);

		let returnItems: INodeExecutionData[] = [];

		const lastPoll = typeof staticData.lastPoll === 'number' ? staticData.lastPoll : 1;

		this.logger.debug(`Last poll time: ${lastPoll}, Current time: ${now}`);

		const event = this.getNodeParameter('event') as string;
		const auth: { host: string; token: string } = await this.getCredentials('phorgeApi');

		const client = new Client(auth.host, auth.token);

		const filters = this.getNodeParameter('filters', 0) as IDataObject;
		const constraints = buildConstraints(filters, this.getNode);

		// Implement your polling logic here based on the selected event
		if (event === 'taskCreated') {
			try {
				const items = await client.searchManiphest({
					constraints: {
						...constraints,
						createdStart: lastPoll,
					},
				} as ManiphestSearchOptions);

				// Return full task objects
				returnItems = items.map((item) => ({
					json: item as IDataObject,
				}));

				staticData.lastPoll = now;

				return [returnItems];
			} catch (error) {
				if (error instanceof Error) {
					throw new NodeOperationError(this.getNode(), `Error creating task: ${error.message}`);
				}
			}
		} else if (event === 'taskUpdated') {
			try {
				const items = await client.searchManiphest({
					constraints: {
						...constraints,
						modifiedStart: lastPoll,
					},
				} as ManiphestSearchOptions);

				// Return full task objects
				returnItems = items.map((item) => ({
					json: item as IDataObject,
				}));

				staticData.lastPoll = now;

				return [returnItems];
			} catch (error) {
				if (error instanceof Error) {
					throw new NodeOperationError(this.getNode(), `Error creating task: ${error.message}`);
				}
			}
		}

		return null;
	}
}
