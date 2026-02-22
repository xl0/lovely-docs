## Overview

Build a code generator agent using Google ADK that generates, tests, and verifies code in Daytona sandboxes. The agent takes natural language descriptions, generates implementations in Python/JavaScript/TypeScript, creates and executes tests, iterates on failures, and returns verified working code.

## Setup

Clone the repository:
```bash
git clone https://github.com/daytonaio/daytona
cd daytona/guides/python/google-adk/code-generator-agent/gemini
```

Install dependencies (Python 3.10+):
```bash
pip install -U google-adk daytona-adk python-dotenv
```

Configure `.env`:
```
DAYTONA_API_KEY=dtn_***
GOOGLE_API_KEY=***
```

## Core Components

**Google ADK:**
- `Agent`: AI model wrapper that processes requests and uses tools
- `App`: Container bundling agents with plugins for centralized management
- `InMemoryRunner`: Execution engine that orchestrates event-driven loops and manages state

**DaytonaPlugin:** Provides tools to execute code (Python/JavaScript/TypeScript), run shell commands, upload/read files, and start background processes in isolated sandboxes.

## Implementation

Initialize and load environment:
```python
import asyncio
import logging
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.runners import InMemoryRunner
from daytona_adk import DaytonaPlugin

load_dotenv()
logging.basicConfig(level=logging.DEBUG)
```

Extract final response from ADK events:
```python
def extract_final_response(response: list) -> str:
    """Extract the final text response from a list of ADK events."""
    for event in reversed(response):
        if hasattr(event, "text") and event.text:
            return event.text
        if hasattr(event, "content") and event.content:
            content = event.content
            if hasattr(content, "parts") and content.parts:
                for part in content.parts:
                    if hasattr(part, "text") and part.text:
                        return part.text
            if hasattr(content, "text") and content.text:
                return content.text
        if isinstance(event, dict):
            text = event.get("text") or event.get("content", {}).get("text")
            if text:
                return text
    return ""
```

Define agent instruction enforcing test-driven workflow:
```python
AGENT_INSTRUCTION = """You are a code generator agent that writes verified, working code.
You support Python, JavaScript, and TypeScript.

Your workflow for every code request:
1. Write the function
2. Write tests for it
3. EXECUTE the code in the sandbox to verify it works - do not skip this step
4. If execution fails, fix and re-execute until tests pass
5. Once verified, respond with ONLY the function (no tests)

You must always execute code before responding. Never return untested code.
Only include tests in your response if the user explicitly asks for them.
"""
```

Configure plugin:
```python
plugin = DaytonaPlugin(
    labels={"example": "code-generator"},
    # Optional: api_key, sandbox_name, plugin_name, env_vars, auto_stop_interval, auto_delete_interval
)
```

Create agent with Gemini model:
```python
agent = Agent(
    model="gemini-2.5-pro",
    name="code_generator_agent",
    instruction=AGENT_INSTRUCTION,
    tools=plugin.get_tools(),
)
```

Bundle and run with InMemoryRunner:
```python
app = App(
    name="code_generator_app",
    root_agent=agent,
    plugins=[plugin],
)

async with InMemoryRunner(app=app) as runner:
    prompt = "Write a TypeScript function called 'groupBy' that takes an array and a key function, and groups array elements by the key. Use proper type annotations."
    response = await runner.run_debug(prompt)
    final_response = extract_final_response(response)
    print(final_response)
```

The context manager automatically cleans up the sandbox on exit.

## Execution Flow

With `logging.DEBUG` enabled, you see:
1. **Sandbox creation**: `Daytona sandbox created: <id>`
2. **Plugin registration**: `Plugin 'daytona_plugin' registered`
3. **Code generation**: Agent writes implementation and tests
4. **Execution**: `execute_code_in_daytona` tool invoked with code and language
5. **Iteration**: If tests fail (exit_code != 0), agent fixes and re-executes
6. **Response**: Once tests pass, agent returns verified code
7. **Cleanup**: Sandbox automatically deleted when context exits

## Output Control

By default, agent returns only the working function. To include tests in response:
```python
prompt = "Write a TypeScript function called 'groupBy'... Return the tests also in a separate code block"
```

## Complete Example

```python
"""Code Generator & Tester Agent Example."""
import asyncio
import logging
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.runners import InMemoryRunner
from daytona_adk import DaytonaPlugin

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

def extract_final_response(response: list) -> str:
    for event in reversed(response):
        if hasattr(event, "text") and event.text:
            return event.text
        if hasattr(event, "content") and event.content:
            content = event.content
            if hasattr(content, "parts") and content.parts:
                for part in content.parts:
                    if hasattr(part, "text") and part.text:
                        return part.text
            if hasattr(content, "text") and content.text:
                return content.text
        if isinstance(event, dict):
            text = event.get("text") or event.get("content", {}).get("text")
            if text:
                return text
    return ""

AGENT_INSTRUCTION = """You are a code generator agent that writes verified, working code.
You support Python, JavaScript, and TypeScript.

Your workflow for every code request:
1. Write the function
2. Write tests for it
3. EXECUTE the code in the sandbox to verify it works - do not skip this step
4. If execution fails, fix and re-execute until tests pass
5. Once verified, respond with ONLY the function (no tests)

You must always execute code before responding. Never return untested code.
Only include tests in your response if the user explicitly asks for them.
"""

async def main() -> None:
    plugin = DaytonaPlugin(labels={"example": "code-generator"})
    agent = Agent(
        model="gemini-2.5-pro",
        name="code_generator_agent",
        instruction=AGENT_INSTRUCTION,
        tools=plugin.get_tools(),
    )
    app = App(name="code_generator_app", root_agent=agent, plugins=[plugin])

    async with InMemoryRunner(app=app) as runner:
        prompt = "Write a TypeScript function called 'groupBy' that takes an array and a key function, and groups array elements by the key. Use proper type annotations."
        response = await runner.run_debug(prompt)
        final_response = extract_final_response(response)
        print(final_response)

if __name__ == "__main__":
    asyncio.run(main())
```

Run with `python main.py`.

## API Reference

See daytona-adk documentation for complete API reference of available tools and configuration options.