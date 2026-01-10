/* eslint-disable @n8n/community-nodes/no-restricted-imports */

import { IExecuteFunctions, ILoadOptionsFunctions, ITriggerFunctions, NodeApiError } from "n8n-workflow";
import { Client } from "phorge-ts";

export async function connectToPhorgeServer(this: IExecuteFunctions | ITriggerFunctions | ILoadOptionsFunctions): Promise<{ client: Client }> {
	try {
		const credentials = await this.getCredentials('phorgeApi') as unknown as { host:string, token: string };
		const client = new Client(credentials.host, credentials.token);

		return { client };
	} catch (error) {
		throw new NodeApiError(this.getNode(), error, { message: `Failed to connect to Phorge Server` });
	}
}

export function stringToArray<R>(input: string): R[] {
	return input.split(',').map((p) => p.trim()).filter(Boolean) as R[]
}