import type {
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PhorgeApi implements ICredentialType {
	name = 'phorgeApi';

	displayName = 'Phorge Conduit API';

	icon: Icon = { light: 'file:../icons/github.svg', dark: 'file:../icons/github.dark.svg' };

	documentationUrl = 'https://github.com/Tagnard/n8n-nodes-phorge';

	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'https://phorge.example.com',
		},
		{
			displayName: 'Conduit API Token',
			name: 'token',
			type: 'string',
			hint: 'api-xxxxxx',
			typeOptions: { password: true },
			default: '',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '={{ $credentials.host }}',
			url: '/api/user.whoami',
			body: {
				'api.token': '={{ $credentials.token }}',
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	};
}
