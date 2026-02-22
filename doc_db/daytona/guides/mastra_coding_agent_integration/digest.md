## Overview

Integrate the Mastra coding agent with Daytona sandboxes to execute AI-powered coding tasks in secure, isolated environments. Use Mastra Studio for a ChatGPT-like interface with human-in-the-loop workflows.

## Requirements

- Node.js 20+
- OpenAI API key (or other LLM provider)
- Daytona API key from the Daytona Dashboard

## Setup

Clone the template repository:
```bash
git clone https://github.com/mastra-ai/template-coding-agent.git
cd template-coding-agent
```

Create `.env` file with LLM and Daytona configuration:
```env
OPENAI_API_KEY=your_openai_key
MODEL=openai/gpt-4o-mini
DAYTONA_API_KEY=your-daytona-api-key-here
```

Install dependencies:
```bash
pnpm install
```

## Running the Agent

Start the dev server:
```bash
pnpm run dev
```

Access Mastra Studio at `http://localhost:4111`. The interface provides:
- Conversation history organized in threads
- Visual debugging of agent execution steps and tool calls
- Model switching between different AI providers
- Real-time tool inspection

## Tool Calls and Execution

The agent uses several tools to interact with Daytona sandboxes:

**createSandbox**: Provisions a new sandbox
```json
{
  "name": "reverse_string_project",
  "language": "python",
  "labels": null,
  "envVars": null
}
```
Returns: `{"sandboxId": "bdfa9456-4945-43a7-97df-b9bfbcbdc62e"}`

**writeFiles**: Create multiple files in a sandbox
```json
{
  "sandboxId": "bdfa9456-4945-43a7-97df-b9bfbcbdc62e",
  "files": [
    {"path": "reverse_string.py", "data": "def reverse_string(s):\n    return s[::-1]\n"},
    {"path": "test_reverse_string.py", "data": "import unittest\nfrom reverse_string import reverse_string\n\nclass TestReverseString(unittest.TestCase):\n    def test_regular(self):\n        self.assertEqual(reverse_string(\"hello\"), \"olleh\")\n    def test_empty(self):\n        self.assertEqual(reverse_string(\"\"), \"\")\n    def test_single_char(self):\n        self.assertEqual(reverse_string(\"a\"), \"a\")\n    def test_numbers(self):\n        self.assertEqual(reverse_string(\"12345\"), \"54321\")\n\nif __name__ == \"__main__\":\n    unittest.main()\n"}
  ]
}
```
Returns: `{"success": true, "filesWritten": ["/home/daytona/reverse_string.py", "/home/daytona/test_reverse_string.py"]}`

**runCommand**: Execute commands in the sandbox
```json
{
  "sandboxId": "bdfa9456-4945-43a7-97df-b9bfbcbdc62e",
  "command": "python3 test_reverse_string.py",
  "envs": null,
  "workingDirectory": null,
  "timeoutSeconds": 20,
  "captureOutput": true
}
```
Returns: `{"success": true, "exitCode": 0, "stdout": "....\n----------------------------------------------------------------------\nRan 4 tests in 0.000s\n\nOK\n", "command": "python3 test_reverse_string.py", "executionTime": 218}`

## Terminal Logging

Tool calls and results are logged with full visibility including arguments, results, token usage with caching metrics, and unique identifiers for debugging:
```json
{
  "text": "",
  "toolCalls": [{
    "type": "tool-call",
    "runId": "ab2a1d08-91c6-4028-9046-3446a721527f",
    "from": "AGENT",
    "payload": {
      "toolCallId": "call_NiLLgBmgrYLSL0MsrG54E4A5",
      "toolName": "writeFile",
      "args": {
        "sandboxId": "2152d23b-5742-47c2-9992-4414d4144869",
        "path": "hello.js",
        "content": "console.log('Hello, world!');"
      }
    }
  }],
  "toolResults": [{
    "type": "tool-result",
    "runId": "ab2a1d08-91c6-4028-9046-3446a721527f",
    "from": "AGENT",
    "payload": {
      "toolCallId": "call_NiLLgBmgrYLSL0MsrG54E4A5",
      "toolName": "writeFile",
      "result": {"success": true, "path": "/home/daytona/hello.js"}
    }
  }],
  "finishReason": "tool-calls",
  "usage": {
    "inputTokens": 4243,
    "outputTokens": 53,
    "totalTokens": 4296,
    "reasoningTokens": 0,
    "cachedInputTokens": 4096
  }
}
```

## Sandbox Management

Active sandboxes appear in the Daytona Dashboard. Clean up resources when finished unless the sandbox needs to remain active for preview URLs or ongoing development.

## Key Advantages

- Secure isolation: all operations run in isolated Daytona sandboxes
- Multi-language support: execute code across different programming languages
- Enhanced debugging: visualize and debug agent workflows in Mastra Studio
- Scalable execution: leverage Daytona's cloud infrastructure