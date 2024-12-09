import requests
from moviepy.editor import VideoFileClip
import speech_recognition as sr
import os

def download_video(url, filename="downloaded_video.mp4"):
    try:
        print(f"Downloading video from {url}...")
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(filename, "wb") as file:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        file.write(chunk)
            print("Download complete.")
            return True
        else:
            print("Failed to download video. Check the URL.")
            return False
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while downloading the video: {e}")
        return False

def extract_audio(video_path, audio_path):
    if not os.path.exists(video_path):
        print("The video file does not exist. Cannot extract audio.")
        return False
    try:
        print("Extracting audio...")
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_path)
        print("Audio extracted.")
        return True
    except Exception as e:
        print(f"An error occurred while extracting audio: {e}")
        return False

def transcribe_audio(audio_path):
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            print("Transcribing audio...")
            text = recognizer.recognize_google(audio_data)
            print("Transcription complete.")
            return text
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
    except FileNotFoundError:
        print("Audio file not found for transcription.")
    return ""

def main():
    video_url = input("Enter the URL of the video to transcribe: ")
    video_path = "downloaded_video.mp4"
    audio_path = "extracted_audio.wav"
    
    # Step 1: Download the video
    if download_video(video_url, video_path):
        # Step 2: Extract audio from the video
        if extract_audio(video_path, audio_path):
            # Step 3: Transcribe the audio
            transcription = transcribe_audio(audio_path)
            if transcription:
                print("Transcription:\n")
                print(transcription)
                
                # Save the transcription to a text file
                with open("transcription.txt", "w") as f:
                    f.write(transcription)
                    print("\nTranscription saved to transcription.txt")
            else:
                print("No transcription available.")
        else:
            print("Failed to extract audio.")
    else:
        print("Video download failed.")
    
    # Cleanup
    if os.path.exists(video_path):
        os.remove(video_path)
    if os.path.exists(audio_path):
        os.remove(audio_path)

if __name__ == "__main__":
    main()
