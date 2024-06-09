import { Logging } from '@google-cloud/logging';
import { join } from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();
const projectId = process.env.PROJECT_ID;
const keyFilename = join(process.cwd(), './credentials/gcloud.json');

const logging = projectId && fs.existsSync(keyFilename) ? new Logging({ projectId, keyFilename }) : void 0;

export default class Logger {
	private id: string;
	private logger: any;

	constructor(id: string) {
		if (!id) throw new Error('Invalid parameters');

		this.id = id;
		this.logger = logging?.log(this.id);
	}

	async add(text: string, severity: string = 'INFO'): Promise<void> {
		const metadata = { severity };
		const entry = this.logger.entry(metadata, text);

		this.logger ? await this.logger.write(entry) : console.log(text);
	}

	async get(): Promise<any[]> {
		const entries = await logging.getEntries({
			filter: `logName="projects/${projectId}/logs/${this.id}"`
		});

		return entries.length ? entries : [];
	}

	close(): void {
		this.logger?.flush().catch((err: Error) => {
			console.error('Error flushing logs:', err);
		});
	}
}
