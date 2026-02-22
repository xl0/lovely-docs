**Claude Agent SDK**: Two-agent system (local Project Manager + sandbox Developer) or single-agent system with Claude Agent SDK in sandbox. Supports CLI and programmatic PTY execution with real-time streaming.

**Python RLMs**: DSPy RLMs with DaytonaInterpreter for iterative code execution in sandbox with `llm_query()` bridging. Recursive agents spawn sub-agents in parallel with unlimited recursion depth.

**AgentKit**: Autonomous coding agent with specialized tools (shell, file upload, dev server management) for multi-step workflows.

**OpenAI Codex SDK**: Autonomous agent with thread persistence, custom system prompt, automatic dev server detection and preview links.

**AI Data Analysis**: Agentic loop with Claude generating/refining Python analysis code iteratively based on sandbox execution feedback; automatic chart capture.

**Google ADK**: Code generator with test-driven workflow (write → test → execute → iterate until pass).

**LangChain Integration**: `DaytonaDataAnalysisTool` for agents to generate and execute Python analysis code with artifact capture.

**Letta Code**: Stateful agent with persistent memory, PTY bidirectional communication, stream-json messages, automatic preview links.

**Mastra**: ChatGPT-like interface (Mastra Studio) with visual debugging, tool inspection, conversation history; tools: createSandbox, writeFiles, runCommand.

**OpenClaw**: AI assistant in sandbox with Telegram/WhatsApp integration, device pairing, gateway token authentication, 24/7 uptime.

**OpenCode**: Web interface agent supporting 75+ LLM providers, automatic preview links, custom system prompt configuration.

**TRL + GRPO**: Train code-generating LLMs with 500 parallel sandboxes for safe concurrent evaluation; sanitize completions, check banned patterns, build test harness, execute, parse JSON results, compute rewards (0-1 for test pass rate, -1 for errors), bridge sync/async with event loop.