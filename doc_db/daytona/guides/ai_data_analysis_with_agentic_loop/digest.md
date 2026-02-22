## AI Data Analysis Workflow

Run AI-generated code in Daytona Sandbox to analyze data:
1. User provides dataset (CSV or other formats)
2. LLM generates code (usually Python) based on user's data
3. Sandbox executes the code and returns results
4. LLM receives feedback and iterates to refine code if needed
5. Display final results to user

## Building an AI Data Analyst

Example: Analyze vehicle valuation dataset, identify price relation to manufacturing year, generate visualizations using Claude and Daytona's secure sandbox with agentic loop for iterative refinement.

### Setup

Install dependencies:
```bash
# Python
pip install daytona anthropic python-dotenv

# TypeScript
npm install @daytonaio/sdk @anthropic-ai/sdk dotenv
```

Configure `.env`:
```
DAYTONA_API_KEY=dtn_***
ANTHROPIC_API_KEY=sk-ant-***
```

### Dataset Preparation

Download vehicle valuation dataset from `https://download.daytona.io/dataset.csv` and save as `dataset.csv`.

Create sandbox and upload dataset:
```python
from daytona import Daytona
daytona = Daytona()
sandbox = daytona.create()
sandbox.fs.upload_file("dataset.csv", "/home/daytona/dataset.csv")
```

```typescript
import { Daytona } from '@daytonaio/sdk'
const daytona = new Daytona()
const sandbox = await daytona.create()
await sandbox.fs.uploadFile('dataset.csv', '/home/daytona/dataset.csv')
```

### Code Execution Handler

Function to execute code and extract charts:

```python
import base64
from typing import TypedDict

class ExecutionResult(TypedDict):
    stdout: str
    exit_code: int
    charts: list

def run_ai_generated_code(sandbox, ai_generated_code: str) -> ExecutionResult:
    execution = sandbox.process.code_run(ai_generated_code)
    result = ExecutionResult(
        stdout=execution.result or "",
        exit_code=execution.exit_code,
        charts=execution.artifacts.charts if execution.artifacts else []
    )
    if execution.artifacts and execution.artifacts.charts:
        for idx, chart in enumerate(execution.artifacts.charts):
            if chart.png:
                with open(f'chart-{idx}.png', 'wb') as f:
                    f.write(base64.b64decode(chart.png))
    return result
```

```typescript
import fs from 'fs'
import { Sandbox } from '@daytonaio/sdk'

interface ExecutionResult {
  stdout: string
  exitCode: number
  charts?: Array<{ png?: string }>
}

async function runAIGeneratedCode(
  sandbox: Sandbox,
  aiGeneratedCode: string
): Promise<ExecutionResult> {
  const execution = await sandbox.process.codeRun(aiGeneratedCode)
  const result: ExecutionResult = {
    stdout: execution.result || "",
    exitCode: execution.exitCode,
    charts: execution.artifacts?.charts
  }
  if (execution.artifacts?.charts) {
    for (let idx = 0; idx < execution.artifacts.charts.length; idx++) {
      const chart = execution.artifacts.charts[idx]
      if (chart.png) {
        fs.writeFileSync(`chart-${idx}.png`, chart.png, { encoding: 'base64' })
      }
    }
  }
  return result
}
```

### Analysis Prompt

Define what Claude should analyze:
```python
from anthropic import Anthropic

prompt = """
I have a CSV file with vehicle valuations at /home/daytona/dataset.csv.
Columns: 'year' (int), 'price_in_euro' (float)
Analyze how price varies by manufacturing year.
Drop rows with missing/non-numeric/'outlier' values.
Create a line chart showing average price per year.
Write Python code and finish with plt.show()."""

anthropic = Anthropic()
```

### Tool Definition

Define tool for Claude to execute Python code:
```python
tools = [
    {
        'name': 'run_python_code',
        'description': 'Run Python code in sandbox and get results',
        'input_schema': {
            'type': 'object',
            'properties': {
                'code': {
                    'type': 'string',
                    'description': 'Python code to run',
                },
            },
            'required': ['code'],
        },
    },
]
```

```typescript
import type { Tool } from '@anthropic-ai/sdk/resources/messages.mjs'

const tools: Tool[] = [
  {
    name: 'run_python_code',
    description: 'Run Python code in sandbox and get results',
    input_schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Python code to run',
        },
      },
      required: ['code'],
    },
  },
]
```

### Agentic Loop

Iterative loop allowing Claude to refine code based on execution feedback:

```python
from anthropic import Anthropic

messages = [{'role': 'user', 'content': prompt}]
continue_loop = True
iteration_count = 0
max_iterations = 10

while continue_loop and iteration_count < max_iterations:
    iteration_count += 1
    print(f"\n=== Iteration {iteration_count} ===")
    
    msg = anthropic.messages.create(
        model='claude-sonnet-4-5',
        max_tokens=64000,
        messages=messages,
        tools=tools
    )
    
    for content_block in msg.content:
        if content_block.type == 'text':
            print("\nClaude's response:")
            print(content_block.text)
    
    tool_uses = [block for block in msg.content if block.type == 'tool_use']
    
    if len(tool_uses) == 0:
        print("\nTask completed - no more actions needed.")
        continue_loop = False
        break
    
    messages.append({'role': 'assistant', 'content': msg.content})
    tool_results = []
    
    for tool_use in tool_uses:
        if tool_use.name == 'run_python_code':
            code = tool_use.input['code']
            print("\n--- Executing Python code ---")
            print(code)
            
            execution_result = run_ai_generated_code(sandbox, code)
            
            result_content = ""
            if execution_result['exit_code'] == 0:
                result_content += "Execution successful!\n\n"
                if execution_result['stdout']:
                    result_content += f"Output:\n{execution_result['stdout']}\n"
                if execution_result['charts']:
                    result_content += f"\nGenerated {len(execution_result['charts'])} chart(s)."
                else:
                    result_content += "\nNote: No charts generated. Use plt.show()."
            else:
                result_content += f"Execution failed with exit code {execution_result['exit_code']}\n\n"
                if execution_result['stdout']:
                    result_content += f"Output:\n{execution_result['stdout']}\n"
            
            tool_results.append({
                'type': 'tool_result',
                'tool_use_id': tool_use.id,
                'content': result_content
            })
    
    messages.append({'role': 'user', 'content': tool_results})

if iteration_count >= max_iterations:
    print("\n⚠️  Reached maximum iteration limit.")
```

```typescript
import type { MessageParam, ToolUseBlock } from '@anthropic-ai/sdk/resources/messages.mjs'

const messages: MessageParam[] = [
  { role: 'user', content: initialPrompt }
]

let continueLoop = true
let iterationCount = 0
const maxIterations = 10

while (continueLoop && iterationCount < maxIterations) {
  iterationCount++
  console.log(`\n=== Iteration ${iterationCount} ===`)
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 64000,
    messages: messages,
    tools: tools
  })
  
  for (const contentBlock of message.content) {
    if (contentBlock.type === 'text') {
      console.log("\nClaude's response:")
      console.log(contentBlock.text)
    }
  }
  
  const toolUses = message.content.filter(
    (block): block is ToolUseBlock => block.type === 'tool_use'
  )
  
  if (toolUses.length === 0) {
    console.log("\nTask completed - no more actions needed.")
    continueLoop = false
    break
  }
  
  messages.push({
    role: 'assistant',
    content: message.content
  })
  
  const toolResults = []
  
  for (const toolUse of toolUses) {
    if (toolUse.name === 'run_python_code') {
      const code = (toolUse.input as { code: string }).code
      console.log("\n--- Executing Python code ---")
      console.log(code)
      
      const executionResult = await runAIGeneratedCode(sandbox, code)
      
      let resultContent = ""
      if (executionResult.exitCode === 0) {
        resultContent += `Execution successful!\n\n`
        if (executionResult.stdout) {
          resultContent += `Output:\n${executionResult.stdout}\n`
        }
        if (executionResult.charts && executionResult.charts.length > 0) {
          resultContent += `\nGenerated ${executionResult.charts.length} chart(s).`
        } else {
          resultContent += `\nNote: No charts generated. Use plt.show().`
        }
      } else {
        resultContent += `Execution failed with exit code ${executionResult.exitCode}\n\n`
        if (executionResult.stdout) {
          resultContent += `Output:\n${executionResult.stdout}\n`
        }
      }
      
      toolResults.push({
        type: 'tool_result' as const,
        tool_use_id: toolUse.id,
        content: resultContent
      })
    }
  }
  
  messages.push({
    role: 'user',
    content: toolResults
  })
}
```

**Loop workflow:**
1. Send initial prompt to Claude with tool definition
2. For each iteration (max 10):
   - Claude generates response with optional tool calls
   - If tool calls exist, execute Python code in sandbox
   - Send execution results back to Claude (errors or success)
   - Claude refines code based on feedback
3. Loop ends when Claude signals no more tool calls or max iterations reached

**Advantages:**
- Secure execution in isolated sandboxes
- Automatic artifact capture (charts, tables, outputs)
- Built-in error detection and logging
- Language agnostic (Python used here, but Daytona supports multiple languages)

### Running the Analysis

```bash
# Python
python data-analysis.py

# TypeScript
npx tsx data-analysis.ts
```

Generates chart saved to `chart-0.png` showing vehicle valuation by manufacturing year.