import streamlit as st
from google import genai
from google.genai import types
import os

# Set page config
st.set_page_config(page_title="AI Project Mentor", page_icon="💡", layout="wide")

st.title("🎓 AI Project Idea Generator & Mentor")
st.markdown("Generate personalized final-year project ideas and get step-by-step guidance to build them.")

# --- Sidebar Configuration ---
with st.sidebar:
    st.header("Configuration")
    api_key = st.text_input("Gemini API Key", type="password", help="Get your API key from Google AI Studio")
    if not api_key:
        api_key = os.environ.get("GEMINI_API_KEY")
    
    st.markdown("---")
    st.markdown("""
    ### How it works:
    1. **Brainstorm**: Enter your skills and interests.
    2. **Generate**: Get 3 customized project ideas.
    3. **Mentorship**: Switch to the AI Mentor tab to ask for roadmaps, architectural advice, or code snippets!
    """)

# --- State Management ---
if "generated_ideas" not in st.session_state:
    st.session_state.generated_ideas = ""
if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

# --- Helper Functions ---
def get_client():
    if api_key:
        return genai.Client(api_key=api_key)
    return None

def generate_ideas(interests, skills, domain, difficulty):
    client = get_client()
    if not client:
        st.error("Please enter your Gemini API Key in the sidebar.")
        return None
    
    prompt = f"""
    You are an expert academic advisor and senior software engineer.
    A final-year university student is looking for a capstone/final-year project idea.
    
    Student Profile:
    - Interests: {interests}
    - Technical Skills: {skills}
    - Target Domain/Industry: {domain}
    - Desired Difficulty: {difficulty}
    
    Please provide 3 distinct, innovative, and practical project ideas. 
    For each idea, provide:
    1. **Project Title**
    2. **Brief Description** (2-3 sentences)
    3. **Key Features** (bullet points)
    4. **Recommended Tech Stack**
    5. **Why it's a good final-year project**
    
    Format the output clearly using Markdown.
    """
    
    try:
        with st.spinner("Brainstorming project ideas..."):
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            return response.text
    except Exception as e:
        st.error(f"Error generating ideas: {e}")
        return None

# --- Main UI ---
tab1, tab2 = st.tabs(["💡 1. Generate Ideas", "🧑‍🏫 2. AI Mentor Chat"])

with tab1:
    st.header("Tell us about your background")
    
    col1, col2 = st.columns(2)
    with col1:
        interests = st.text_area("What are your interests/passions? (e.g., healthcare, finance, gaming, sustainability)", height=100)
        domain = st.text_input("Target Domain (e.g., Web App, Mobile, IoT, Machine Learning, Data Science)")
    with col2:
        skills = st.text_area("What are your current technical skills? (e.g., Python, React, SQL, AWS, Java)", height=100)
        difficulty = st.selectbox("Desired Difficulty Level", ["Beginner-Friendly", "Intermediate", "Advanced (Research-oriented)"])
        
    if st.button("Generate Project Ideas", type="primary", use_container_width=True):
        if interests and skills:
            ideas = generate_ideas(interests, skills, domain, difficulty)
            if ideas:
                st.session_state.generated_ideas = ideas
                # Clear chat history when new ideas are generated
                st.session_state.chat_messages = [] 
        else:
            st.warning("Please fill in at least your interests and technical skills.")
            
    if st.session_state.generated_ideas:
        st.markdown("---")
        st.subheader("Your Personalized Project Ideas")
        st.markdown(st.session_state.generated_ideas)
        
        st.success("Ideas generated! Head over to the 'AI Mentor Chat' tab to get step-by-step guidance on how to build one of these.")

with tab2:
    st.header("Get Mentorship & Guidance")
    
    if not st.session_state.generated_ideas:
        st.warning("Please generate project ideas in the first tab before consulting the mentor.")
    else:
        st.markdown("Ask the mentor anything about your project ideas! (e.g., *'Can you break down Idea 2 into weekly milestones?'* or *'What database should I use for the first idea?'*)")
        
        # Display chat messages
        for message in st.session_state.chat_messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
                
        # Chat input
        if prompt := st.chat_input("Ask your AI Mentor..."):
            # Add user message to state
            st.session_state.chat_messages.append({"role": "user", "content": prompt})
            
            # Display user message
            with st.chat_message("user"):
                st.markdown(prompt)
                
            # Generate AI response
            client = get_client()
            if client:
                try:
                    system_instruction = f"""
                    You are a supportive, expert software engineering mentor helping a final year student build their project.
                    Here are the project ideas they are currently considering based on their skills:
                    
                    {st.session_state.generated_ideas}
                    
                    Answer their questions clearly, provide practical advice, and encourage best practices (version control, testing, clean code).
                    If they ask for a roadmap, break it down into logical phases or sprints. Be encouraging and educational.
                    """
                    
                    # Prepare history for the API
                    contents = []
                    for msg in st.session_state.chat_messages:
                        role = "user" if msg["role"] == "user" else "model"
                        contents.append(types.Content(role=role, parts=[types.Part.from_text(text=msg["content"])]))
                        
                    with st.chat_message("assistant"):
                        with st.spinner("Thinking..."):
                            response = client.models.generate_content(
                                model='gemini-2.5-flash',
                                contents=contents,
                                config=types.GenerateContentConfig(
                                    system_instruction=system_instruction
                                )
                            )
                            st.markdown(response.text)
                            
                    # Add assistant response to state
                    st.session_state.chat_messages.append({"role": "assistant", "content": response.text})
                    
                except Exception as e:
                    st.error(f"Error communicating with mentor: {e}")
            else:
                st.error("Please ensure your API key is set in the sidebar.")