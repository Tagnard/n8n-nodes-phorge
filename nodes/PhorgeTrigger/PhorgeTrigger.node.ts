/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	IPollFunctions,
	INodeExecutionData,
    IDataObject,
    NodeOperationError,
} from 'n8n-workflow';
import { Client, TaskSearchOptions } from 'phorge-ts';

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

		// Implement your polling logic here based on the selected event
		if (event === 'taskCreated') {
			try {
				const items = await client.searchTask({
                    constraints: {
                        createdStart: lastPoll,
                    },
                } as TaskSearchOptions)
            
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
				const items = await client.searchTask({
                    constraints: {
                        modifiedStart: lastPoll,
                    },
                } as TaskSearchOptions)
            
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
