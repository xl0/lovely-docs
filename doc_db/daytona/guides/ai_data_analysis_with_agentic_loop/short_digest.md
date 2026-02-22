## AI Data Analysis with Agentic Loop

Run AI-generated code in Daytona Sandbox with iterative refinement via Claude.

### Setup
```bash
pip install daytona anthropic python-dotenv
npm install @daytonaio/sdk @anthropic-ai/sdk dotenv
```

Create `.env` with `DAYTONA_API_KEY` and `ANTHROPIC_API_KEY`.

### Workflow

1. **Upload dataset** to sandbox
2. **Define analysis prompt** describing dataset and desired analysis
3. **Create tool** allowing Claude to execute Python code
4. **Run agentic loop** (max 10 iterations):
   - Claude generates code based on prompt
   - Sandbox executes code, returns results/errors
   - Claude refines code based on feedback
   - Loop ends when Claude signals completion

### Code Execution Handler

```python
def run_ai_generated_code(sandbox, code: str):
    execution = sandbox.process.code_run(code)
    result = {
        'stdout': execution.result or "",
        'exit_code': execution.exit_code,
        'charts': execution.artifacts.charts if execution.artifacts else []
    }
    # Save charts as PNG files
    if execution.artifacts and execution.artifacts.charts:
        for idx, chart in enumerate(execution.artifacts.charts):
            if chart.png:
                with open(f'chart-{idx}.png', 'wb') as f:
                    f.write(base64.b64decode(chart.png))
    return result
```

### Agentic Loop

```python
from anthropic import Anthropic

messages = [{'role': 'user', 'content': prompt}]
anthropic = Anthropic()

for iteration in range(10):
    msg = anthropic.messages.create(
        model='claude-sonnet-4-5',
        max_tokens=64000,
        messages=messages,
        tools=tools
    )
    
    tool_uses = [b for b in msg.content if b.type == 'tool_use']
    if not tool_uses:
        break
    
    messages.append({'role': 'assistant', 'content': msg.content})
    
    tool_results = []
    for tool_use in tool_uses:
        if tool_use.name == 'run_python_code':
            result = run_ai_generated_code(sandbox, tool_use.input['code'])
            tool_results.append({
                'type': 'tool_result',
                'tool_use_id': tool_use.id,
                'content': f"Exit code: {result['exit_code']}\nOutput: {result['stdout']}"
            })
    
    messages.append({'role': 'user', 'content': tool_results})
```

**Key advantages:** Secure isolated execution, automatic artifact capture, error handling, iterative refinement.