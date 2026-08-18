# FinPrompt

> AI-powered prompt optimization platform that transforms simple user requests into clear, structured, and effective prompts.

## Overview

FinPrompt is a full-stack AI application designed to help users improve their prompts before sending them to an AI model.

Users can enter a simple request, select a category, tone, and preferred length, and receive an optimized prompt generated through the Groq API.

The application also provides prompt history, allowing users to reuse or delete previously optimized prompts.

## Features

- AI-powered prompt optimization
- Prompt category selection
- Tone selection
- Response length selection
- Prompt history
- Reuse previous prompts
- Delete individual history items
- Clear prompt history
- Copy optimized prompts
- Loading and error states
- Responsive React interface

## Architecture

```text
User
  |
  v
React Frontend
  |
  | POST /optimize
  v
FastAPI Backend
  |
  v
Groq API
  |
  v
GPT-OSS-120B
  |
  v
Optimized Prompt
  |
  v
React Frontend
