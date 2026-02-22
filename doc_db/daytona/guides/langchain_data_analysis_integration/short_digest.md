## LangChain Data Analysis Tool

`DaytonaDataAnalysisTool` enables LangChain agents to perform secure Python data analysis in sandboxed environments.

### Setup
```bash
pip install -U langchain langchain-anthropic langchain-daytona-data-analysis python-dotenv
```

Environment: `DAYTONA_API_KEY` and `ANTHROPIC_API_KEY`

### Basic Usage
```python
from langchain_anthropic import ChatAnthropic
from langchain_daytona_data_analysis import DaytonaDataAnalysisTool
from langchain.agents import create_agent
import base64
from daytona import ExecutionArtifacts

model = ChatAnthropic(model_name="claude-sonnet-4-5-20250929", temperature=0)

def process_result(result: ExecutionArtifacts):
    print("Result stdout", result.stdout)
    for idx, chart in enumerate(result.charts):
        if chart.png:
            with open(f'chart-{idx}.png', 'wb') as f:
                f.write(base64.b64decode(chart.png))

tool = DaytonaDataAnalysisTool(on_result=process_result)

with open("dataset.csv", "rb") as f:
    tool.upload_file(f, description="CSV with columns: year, price_in_euro")

agent = create_agent(model, tools=[tool], debug=True)
agent.invoke({"messages": [{"role": "user", "content": "Analyze vehicle prices by year and create a chart"}]})

tool.close()
```

### API Methods
- `upload_file(file: IO, description: str) -> SandboxUploadedFile` - Upload to `/home/daytona/`
- `download_file(remote_path: str) -> bytes` - Download from sandbox
- `remove_uploaded_file(uploaded_file: SandboxUploadedFile)` - Remove file
- `get_sandbox() -> Sandbox` - Get sandbox instance
- `install_python_packages(package_names: str | list[str])` - Install packages
- `close()` - Close and delete sandbox

### Execution Flow
Agent receives natural language request → generates Python code → executes in sandbox → processes results via handler → saves artifacts (charts, outputs)