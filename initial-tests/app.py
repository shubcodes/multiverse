import streamlit as st
import openai_utils

# Initialize OpenAI API (API key is fetched from environment variables inside the function)
openai_utils.setup_openai_api()

# Streamlit interface
st.title("Interactive Story Explorer")

user_story = st.text_area("Enter your story here")
decision_point = None
new_story = None

if st.button("Identify Decision Points"):
    decision_points = openai_utils.get_decision_points(user_story)
    decision_point = st.selectbox("Choose a decision point to explore", decision_points.split('\n'))

if decision_point:
    new_decision = st.text_input("Enter an alternate scenario based on the selected decision point")
    if st.button("Continue story with new decision"):
        new_story = openai_utils.continue_story(user_story, new_decision)
        st.write(new_story)