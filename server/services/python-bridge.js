import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PythonBridge {
  constructor() {
    this.pythonPath = path.join(__dirname, '../../brightbridgeDir');
    this.scriptPath = path.join(this.pythonPath, 'agent_bridge.py');
    
    // Enhanced Python command detection for Railway
    this.pythonCommands = [
      'python3',  // Railway default
      'python',
      'python3.11',
      'python3.10',
      'python3.9',
      '/usr/bin/python3',
      '/usr/local/bin/python3'
    ];
  }

  async findPythonCommand() {
    // Check if we're on Railway
    if (process.env.RAILWAY_ENVIRONMENT_NAME) {
      console.log('Detected Railway environment, using python3');
      return 'python3';
    }

    for (const cmd of this.pythonCommands) {
      try {
        const testProcess = spawn(cmd, ['--version'], { stdio: 'pipe' });
        await new Promise((resolve, reject) => {
          testProcess.on('close', (code) => {
            if (code === 0) resolve();
            else reject();
          });
          testProcess.on('error', reject);
          setTimeout(() => reject(new Error('timeout')), 3000);
        });
        console.log(`Found Python command: ${cmd}`);
        return cmd;
      } catch (error) {
        console.log(`Python command ${cmd} not available:`, error.message);
        continue;
      }
    }
    throw new Error('No Python interpreter found');
  }

  async callPythonAgent(agentType, message, userName, conversationHistory) {
    return new Promise(async (resolve, reject) => {
      try {
        const pythonCmd = await this.findPythonCommand();
        console.log(`Using Python command: ${pythonCmd}`);
        
        const pythonProcess = spawn(pythonCmd, [this.scriptPath], {
          cwd: this.pythonPath,
          stdio: ['pipe', 'pipe', 'pipe'],
          env: {
            ...process.env,
            PYTHONPATH: this.pythonPath,
            PYTHONUNBUFFERED: '1',
            // Railway-specific environment
            RAILWAY_ENVIRONMENT_NAME: process.env.RAILWAY_ENVIRONMENT_NAME || '',
            NODE_ENV: process.env.NODE_ENV || 'production'
          }
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
          console.error('Python stderr:', data.toString());
        });

        pythonProcess.on('close', (code) => {
          console.log(`Python process closed with code ${code}`);
          console.log('Python stdout:', outputData);
          if (errorData) console.log('Python stderr:', errorData);
          
          if (code === 0 && outputData.trim()) {
            try {
              const result = JSON.parse(outputData.trim());
              if (result.success) {
                resolve(result.response);
              } else {
                console.error('Python agent error:', result.error);
                resolve(result.response || "I'm experiencing technical difficulties. Please try again.");
              }
            } catch (parseError) {
              console.error('Failed to parse Python response:', parseError);
              console.error('Raw output:', outputData);
              resolve("I'm having trouble processing your request right now. Please try again.");
            }
          } else {
            console.error(`Python process failed with code ${code}`);
            console.error('Error output:', errorData);
            resolve("I'm experiencing technical difficulties with my AI agents. Please try again in a moment.");
          }
        });

        pythonProcess.on('error', (error) => {
          console.error('Failed to start Python process:', error);
          resolve("I'm having trouble starting my AI agents. Please try again.");
        });

        // Send the request data to Python
        pythonProcess.stdin.write(requestData);
        pythonProcess.stdin.end();

        // Set a timeout appropriate for Railway
        const timeout = process.env.RAILWAY_ENVIRONMENT_NAME ? 30000 : 45000;
        setTimeout(() => {
          if (!pythonProcess.killed) {
            pythonProcess.kill('SIGTERM');
            resolve("I'm taking longer than usual to respond. Please try again with a shorter message.");
          }
        }, timeout);
        
      } catch (error) {
        console.error('Python bridge setup error:', error);
        resolve("I'm experiencing setup issues with my AI agents. Please try again.");
      }
    });
  }
}