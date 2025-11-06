import os
import re
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware Configuration ---
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gemini API Configuration ---
try:
    GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
    MODEL_NAME = "gemini-pro"
    API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"
    print("✅ Gemini API configured successfully.")
except KeyError:
    print("❌ ERROR: GEMINI_API_KEY environment variable not set.")
    API_URL = None

# --- Pydantic Model for Incoming Data ---
class CodeSnippet(BaseModel):
    code: str
    language: str

# --- Helper Function to Call Gemini via HTTP ---
def call_gemini_http(prompt: str) -> str:
    if not API_URL:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except requests.exceptions.RequestException as e:
        print(f"❌ Gemini API HTTP Error: {e}")
        error_detail = "Failed to get response from Gemini API."
        try:
            error_detail = e.response.json().get('error', {}).get('message', error_detail)
        except:
            pass
        raise HTTPException(status_code=500, detail=error_detail)

# --- Original Code Analysis Logic ---
def estimate_time_complexity(code: str) -> str:
    lines = code.splitlines()
    loop_lines = []
    for line in lines:
        stripped_line = line.strip()
        if stripped_line.startswith(('for ', 'while ')):
            indentation = len(line) - len(line.lstrip(' '))
            loop_lines.append(indentation)
    if not loop_lines: return "O(1)"
    first_loop_indent = loop_lines[0]
    for indent in loop_lines[1:]:
        if indent > first_loop_indent: return "O(n^2)"
    return "O(n)"

@app.post("/analyze")
def analyze_code(snippet: CodeSnippet):
    print(f"ML Service: Analyzing code in {snippet.language}...")
    time_complexity_result = estimate_time_complexity(snippet.code)
    complexity_score = 1
    decision_keywords = ['if', 'for', 'while', 'case', 'catch', '&&', '||', '?', '->']
    for keyword in decision_keywords:
        pattern = r'\b' + re.escape(keyword) + r'\b' if keyword.isalnum() else re.escape(keyword)
        matches = re.findall(pattern, snippet.code)
        complexity_score += len(matches)
    readability_score = max(0, 100 - (complexity_score - 1) * 10)
    lines_of_code = len(snippet.code.splitlines())
    return {
        "linesOfCode": lines_of_code,
        "timeComplexity": time_complexity_result,
        "cyclomaticComplexity": complexity_score,
        "readabilityScore": readability_score,
        "suggestions": [f"Code has an estimated time complexity of {time_complexity_result}."],
    }

# --- Gemini-Powered Endpoints ---

@app.post("/generate-docstring")
def generate_docstring(snippet: CodeSnippet):
    prompt = f"Generate a professional docstring for the following {snippet.language} code. Only return the docstring itself, without any extra explanation or formatting. Code:\n```\n{snippet.code}\n```"
    docstring = call_gemini_http(prompt)
    return {"docstring": docstring}

@app.post("/refactor-code")
def refactor_code(snippet: CodeSnippet):
    prompt = f"You are an expert programmer. Refactor the following {snippet.language} code to improve its readability, efficiency, and to follow best practices. Provide only the refactored code in a single code block, without any explanation. Code:\n```\n{snippet.code}\n```"
    refactored_code = call_gemini_http(prompt)
    return {"refactored_code": refactored_code}

@app.post("/explain-code")
def explain_code(snippet: CodeSnippet):
    prompt = f"You are a helpful programming tutor. Explain the following {snippet.language} code snippet step-by-step. Break down the logic, explain what each part does, and describe the overall purpose of the code. Format your explanation clearly using markdown. Assume the reader is a beginner. Code:\n```\n{snippet.code}\n```"
    explanation = call_gemini_http(prompt)
    return {"explanation": explanation}

@app.post("/find-bugs")
def find_bugs(snippet: CodeSnippet):
    prompt = f"""
    You are an expert code debugger. Analyze the following {snippet.language} code snippet.
    Identify any potential bugs, logical errors, or edge cases that might not be handled correctly.
    If you find any issues, explain what the bug is, why it's a problem, and suggest a way to fix it.
    If you find no bugs, simply respond with "No obvious bugs found."
    Format your response clearly using markdown.

    Code to analyze:
    ```
    {snippet.code}
    ```
    """ # <-- THIS CLOSING """ WAS MISSING
    bug_report = call_gemini_http(prompt)
    return {"bug_report": bug_report}

# --- Root Endpoint for Health Check ---
@app.get("/")
def root():
    return {"message": "✅ CodeReviewGPT ML Service is running!"}