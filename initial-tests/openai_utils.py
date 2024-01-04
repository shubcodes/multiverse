import os
import openai

def setup_openai_api():
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key is None:
        raise ValueError("OpenAI API key not found in environment variables")
    openai.api_key = api_key

def get_decision_points(story):
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": f"Identify the decision points in the following story:\n\n{story}"}
        ],
    )
    return response.choices[0].message.content

def continue_story(story, decision):
    prompt = f"Continue the story given the decision: {decision}. Story: {story}"
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
    return response.choices[0].message.content
