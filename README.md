# FinPrompt

> AI-powered prompt optimization platform that transforms simple user requests into clear, structured, and effective AI prompts.

## Overview

FinPrompt is a full-stack AI application that helps users improve simple or vague prompts before sending them to an AI model.

A user enters a basic request such as:

> Write an email to my manager

FinPrompt sends the request to a FastAPI backend, which uses the Groq API and GPT-OSS-120B to generate a more detailed and structured prompt.

The optimized prompt is then returned to the React frontend and displayed to the user.

## Problem

Many users know what they want to ask an AI model but struggle to write prompts that provide enough context, constraints, tone, and desired output details.

FinPrompt addresses this problem by turning a short natural-language request into a more useful AI instruction.

## How It Works

```text
User enters a simple prompt
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
          |
          v
     User copies result
