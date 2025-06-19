import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PythonBridge {
  constructor() {
    this.pythonPath = path.join(__dirname, '../../brightbridgeDir');
    this.scriptPath = path.join(this.pythonPath, 'agent_bridge.py');
  }

  async callPythonAgent(agentType, message, userName, conversationHistory) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [this.scriptPath], {
        cwd: this.pythonPath,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      const requestData = JSON.stringify({
        agent_type: agentType,
        message: message,
        user_name: userName,
        conversation_history: conversationHistory
      });

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(outputData.trim());
            resolve(result.response);
          } catch (error) {
            reject(new Error(`Failed to parse Python response: ${error.message}`));
          }
        } else {
          reject(new Error(`Python process failed with code ${code}: ${errorData}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });

      // Send the request data to Python
      pythonProcess.stdin.write(requestData);
      pythonProcess.stdin.end();

      // Set a timeout to prevent hanging
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python process timeout'));
      }, 30000); // 30 second timeout
    });
  }
}