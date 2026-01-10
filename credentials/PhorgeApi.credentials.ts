import type {
	Icon,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PhorgeApi implements ICredentialType {
	name = 'phorgeApi';

	displayName = 'Phorge API';

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
}
