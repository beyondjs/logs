import { Logging } from '@google-cloud/logging';
import { join } from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();
const projectId = process.env.PROJECT_ID;
const keyFilename = join(process.cwd(), './credentials/gcloud.json');

const logging: Logging = (() => {
	if (process.env.LOGS_DISABLED) return;

	if (!projectId && !keyFilename) return new Logging();

	const specs: { projectId?: string; keyFilename?: string } = {};
	projectId && (specs.projectId = projectId);
	fs.existsSync(keyFilename) && (specs.keyFilename = keyFilename);

	return new Logging(specs);
})();

export /*bundle*/ class Logger {
	private id: string;
	private logger: any;

	constructor(id: string) {
		if (!id) throw new Error('Invalid parameters');

		this.id = id;
		this.logger = logging?.log(this.id);
	}

	async add(data: string | Record<string, any>, severity: string = 'INFO'): Promise<void> {
		const metadata = { severity };
		const entry = this.logger.entry(metadata, data);

		this.logger ? await this.logger.write(entry) : console.log(data);
	}

	async get(): Promise<any[]> {
		const projectId = await logging.auth.getProjectId();
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
