## Overview

`DaytonaDataAnalysisTool` is a LangChain tool integration enabling agents to perform secure Python data analysis in sandboxed environments. Agents receive natural language prompts, reason about the task, generate Python code, execute it securely in Daytona sandbox, and process results.

## Setup

### Dependencies
```bash
pip install -U langchain langchain-anthropic langchain-daytona-data-analysis python-dotenv
```

Requires Python 3.10+.

### Environment Configuration
```bash
DAYTONA_API_KEY=dtn_***
ANTHROPIC_API_KEY=sk-ant-***
```

Get keys from Daytona Dashboard and Anthropic Console.

## Basic Usage

### Initialize Model
```python
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(
    model_name="claude-sonnet-4-5-20250929",
    temperature=0,
    timeout=None,
    max_retries=2,
)
```

### Define Result Handler
```python
import base64
from daytona import ExecutionArtifacts

def process_data_analysis_result(result: ExecutionArtifacts):
    print("Result stdout", result.stdout)
    result_idx = 0
    for chart in result.charts:
        if chart.png:
            with open(f'chart-{result_idx}.png', 'wb') as f:
                f.write(base64.b64decode(chart.png))
            print(f'Chart saved to chart-{result_idx}.png')
            result_idx += 1
```

### Initialize Tool and Upload Data
```python
from langchain_daytona_data_analysis import DaytonaDataAnalysisTool

DataAnalysisTool = DaytonaDataAnalysisTool(
    on_result=process_data_analysis_result
)

with open("./dataset.csv", "rb") as f:
    DataAnalysisTool.upload_file(
        f,
        description=(
            "CSV file containing vehicle valuations. "
            "Columns:\n"
            "- 'year': integer, manufacturing year\n"
            "- 'price_in_euro': float, price in Euros\n"
            "Drop rows with missing/non-numeric values or outliers."
        )
    )
```

### Create and Run Agent
```python
from langchain.agents import create_agent

agent = create_agent(model, tools=[DataAnalysisTool], debug=True)

agent_response = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Analyze how vehicle prices vary by manufacturing year. Create a line chart showing average price per year."
    }]
})

DataAnalysisTool.close()
```

## Execution Flow

1. Agent receives natural language request
2. Agent determines need for `DaytonaDataAnalysisTool`
3. Agent generates Python code for analysis
4. Code executes securely in Daytona sandbox
5. Results processed by handler function
6. Charts saved to local directory
7. Sandbox resources cleaned up

The agent typically explores the dataset first (shape, columns, data types), then generates detailed analysis code with data cleaning, outlier removal, calculations, and visualizations.

## API Reference

### upload_file
```python
def upload_file(file: IO, description: str) -> SandboxUploadedFile
```
Uploads file to sandbox at `/home/daytona/`. Description explains file purpose and data structure.

### download_file
```python
def download_file(remote_path: str) -> bytes
```
Downloads file from sandbox by remote path.

### remove_uploaded_file
```python
def remove_uploaded_file(uploaded_file: SandboxUploadedFile) -> None
```
Removes previously uploaded file from sandbox.

### get_sandbox
```python
def get_sandbox() -> Sandbox
```
Returns current sandbox instance for inspecting properties and metadata.

### install_python_packages
```python
def install_python_packages(package_names: str | list[str]) -> None
```
Installs Python packages in sandbox using pip. Preinstalled packages available in Daytona's Default Snapshot documentation.

### close
```python
def close() -> None
```
Closes and deletes sandbox environment. Call when finished with all analysis tasks.

## Data Structures

### SandboxUploadedFile
- `name`: str - Name of uploaded file in sandbox
- `remote_path`: str - Full path to file in sandbox
- `description`: str - Description provided during upload

### Sandbox
Represents Daytona sandbox instance. See full structure in Daytona Python SDK Sandbox documentation.

## Example: Vehicle Price Analysis

Complete working example analyzing vehicle valuations dataset:

```python
import base64
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_anthropic import ChatAnthropic
from daytona import ExecutionArtifacts
from langchain_daytona_data_analysis import DaytonaDataAnalysisTool

load_dotenv()

model = ChatAnthropic(
    model_name="claude-sonnet-4-5-20250929",
    temperature=0,
    timeout=None,
    max_retries=2,
)

def process_data_analysis_result(result: ExecutionArtifacts):
    print("Result stdout", result.stdout)
    result_idx = 0
    for chart in result.charts:
        if chart.png:
            with open(f'chart-{result_idx}.png', 'wb') as f:
                f.write(base64.b64decode(chart.png))
            print(f'Chart saved to chart-{result_idx}.png')
            result_idx += 1

def main():
    DataAnalysisTool = DaytonaDataAnalysisTool(
        on_result=process_data_analysis_result
    )

    try:
        with open("./dataset.csv", "rb") as f:
            DataAnalysisTool.upload_file(
                f,
                description=(
                    "CSV file containing vehicle valuations. "
                    "Columns:\n"
                    "- 'year': integer, manufacturing year\n"
                    "- 'price_in_euro': float, price in Euros\n"
                    "Drop rows with missing/non-numeric values or outliers."
                )
            )

        agent = create_agent(model, tools=[DataAnalysisTool], debug=True)

        agent_response = agent.invoke(
            {"messages": [{"role": "user", "content": "Analyze how vehicle prices vary by manufacturing year. Create a line chart showing average price per year."}]}
        )
    finally:
        DataAnalysisTool.close()

if __name__ == "__main__":
    main()
```

Agent generates code that:
- Loads CSV and explores structure
- Converts columns to numeric, removes missing values
- Removes outliers using IQR method
- Calculates average price per year
- Creates line chart with proper formatting and labels
- Outputs statistics (total vehicles, year range, price range, overall average)

Example output shows vehicle prices increasing from €5,968 (2005) to €33,862 (2022) with slight decrease in 2023.