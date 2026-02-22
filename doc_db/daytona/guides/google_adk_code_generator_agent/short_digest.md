## Setup

Install: `pip install -U google-adk daytona-adk python-dotenv`

Configure `.env` with `DAYTONA_API_KEY` and `GOOGLE_API_KEY`.

## Implementation

```python
import asyncio
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.runners import InMemoryRunner
from daytona_adk import DaytonaPlugin

load_dotenv()

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
        print(extract_final_response(response))

asyncio.run(main())
```

**Key points:**
- `DaytonaPlugin` provides sandbox execution tools for Python/JavaScript/TypeScript
- `Agent` with instruction enforces test-driven workflow: write → test → execute → iterate → return verified code
- `App` bundles agent with plugins; `InMemoryRunner` executes and auto-cleans sandbox on context exit
- Extract final response from reversed event list to get agent's text output
- Optional: include "Return the tests also" in prompt to get tests in response