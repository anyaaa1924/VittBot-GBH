import os
import requests
import json
import base64
import uuid
from dotenv import load_dotenv
from playsound import playsound
import gradio as gr
from loan import responses  # Import responses from loan.py

# Load API key from .env
load_dotenv()
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

# API Endpoints
STT_URL = "https://api.sarvam.ai/speech-to-text"
TTS_URL = "https://api.sarvam.ai/text-to-speech"
TRANSLATE_URL = "https://api.sarvam.ai/translate"

# Available Voices (with gender mapping)
VOICE_OPTIONS = {
    "Meera (F)": ("meera", "Female"), "Pavithra (F)": ("pavithra", "Female"), 
    "Maitreyi (F)": ("maitreyi", "Female"), "Diya (F)": ("diya", "Female"), 
    "Maya (F)": ("maya", "Female"), "Misha (F - Western)": ("misha", "Female"), 
    "Arvind (M)": ("arvind", "Male"), "Amol (M)": ("amol", "Male"), 
    "Amartya (M)": ("amartya", "Male"), "Neel (M)": ("neel", "Male"), 
    "Arjun (M)": ("arjun", "Male"), "Vian (M - Western)": ("vian", "Male")
}

# Function to translate text (only for text output)
def translate_text(user_input, target_lang):
    headers = {"API-Subscription-Key": SARVAM_API_KEY, "Content-Type": "application/json"}
    data = {
        "input": user_input,
        "source_language_code": "auto",  # Automatically detect language
        "target_language_code": target_lang,
        "mode": "formal",
        "enable_preprocessing": False,
        "output_script": "fully-native",
        "numerals_format": "international"
    }
    response = requests.post(TRANSLATE_URL, headers=headers, json=data)

    if response.status_code != 200:
        return f"Error: {response.status_code}"

    return response.json().get("translated_text", "Translation error!")

# Function to handle loan queries (text only)
def loan_assistant(user_input, target_lang):
    translated_query = translate_text(user_input, "en-IN")
    text_lower = translated_query.lower()
    
    for key, response in responses.items():
        if key in text_lower:
            return translate_text(response, target_lang)
    
    return translate_text("I can help with loans. Ask about interest rates, EMI, eligibility, or approval process!", target_lang)

# Function to transcribe speech
def speech_to_text(audio_file):
    if not audio_file:
        return "Error: No audio file received!", None
    
    with open(audio_file, "rb") as f:
        files = {"file": (audio_file, f, "audio/wav")}
        headers = {"API-Subscription-Key": SARVAM_API_KEY}
        data = {"model": "saarika:v2", "with_diarization": False}
        response = requests.post(STT_URL, headers=headers, files=files, data=data)
    
    if response.status_code == 200:
        return response.json().get("transcript", ""), response.json().get("language_code", "en-IN")
    else:
        return None, None

# Function for Text-to-Speech (voice output will use detected speech language)
def text_to_speech(text, detected_lang, selected_voice):
    speaker_value, _ = VOICE_OPTIONS.get(selected_voice, ("meera", "Female"))

    headers = {"API-Subscription-Key": SARVAM_API_KEY, "Content-Type": "application/json"}
    data = json.dumps({
        "inputs": [text],
        "target_language_code": detected_lang,  # **🔹 Voice will use detected language**
        "speaker": speaker_value,
        "pace": 1.2,
        "pitch": 0.0,
        "loudness": 1.0,
        "speech_sample_rate": 16000,
        "enable_preprocessing": True,
        "model": "bulbul:v1"
    })
    response = requests.post(TTS_URL, headers=headers, data=data)
    
    if response.status_code == 200:
        audio_base64 = response.json()["audios"][0]
        audio_filename = f"audio_output_{uuid.uuid4().hex}.wav"
        
        if os.path.exists(audio_filename):
            os.remove(audio_filename)

        with open(audio_filename, "wb") as f:
            f.write(base64.b64decode(audio_base64))

        playsound(audio_filename)
        return audio_filename
    return None

# Function to handle voice input
def voice_assistant(audio_file, selected_voice):
    text, detected_lang = speech_to_text(audio_file)
    
    if not text or text == "Error: No audio file received!":
        return "Could not detect speech. Try again.", None

    response_text = loan_assistant(text, detected_lang)  # **🔹 Text output uses detected lang**
    audio_output = text_to_speech(response_text, detected_lang, selected_voice)  # **🔹 Voice uses detected lang**
    
    return response_text, audio_output

# Gradio UI
with gr.Blocks() as demo:
    gr.Markdown("# Loan Assistance Chatbot")
    
    with gr.Row():
        user_input = gr.Textbox(placeholder="Ask about loans", label="Your Question")
        audio_input = gr.Audio(sources=["microphone"], type="filepath", label="Or Speak Your Question")

    target_lang = gr.Dropdown(choices=["hi-IN", "en-IN", "kn-IN", "mr-IN", "gu-IN", "ml-IN", "bn-IN", "od-IN", "ta-IN", "te-IN", "pa-IN"], label="Target Language (For Text)", value="en-IN")
    voice_selection = gr.Dropdown(choices=list(VOICE_OPTIONS.keys()), label="Select Voice", value="Meera (F)")

    text_output = gr.Textbox(label="Chatbot Response")
    audio_output = gr.Audio(label="Audio Response", type="filepath")

    submit_button = gr.Button("Submit")

    # **🔹 Trigger response when 'Enter' is pressed**
    user_input.submit(loan_assistant, inputs=[user_input, target_lang], outputs=text_output)

    # **🔹 Click event for Submit button**
    submit_button.click(loan_assistant, inputs=[user_input, target_lang], outputs=text_output)

    # **🔹 Process voice input on change**
    audio_input.change(voice_assistant, inputs=[audio_input, voice_selection], outputs=[text_output, audio_output])

demo.launch(share=True)
