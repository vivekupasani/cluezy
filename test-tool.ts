import dotenv from 'dotenv';
import { academicSearchTool } from './lib/tools/acadamic-search';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
    const query = process.argv[2] || 'transformer architectures in llms';
    console.log(`Running academic search for: "${query}"...`);

    try {
        const result = await academicSearchTool.execute({ query }, {
            toolCallId: 'test-call-id',
            messages: []
        } as any);

        console.log('--- Results ---');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error running tool:', error);
    }
}

main();
