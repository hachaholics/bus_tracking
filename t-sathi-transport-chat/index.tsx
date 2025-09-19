// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
// */
// import { GoogleGenAI, Chat } from '@google/genai';

// // --- DOM Elements ---
// const chatContainer = document.getElementById('chat-container') as HTMLDivElement;
// const chatForm = document.getElementById('chat-form') as HTMLFormElement;
// const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
// const sendButton = chatForm.querySelector('button') as HTMLButtonElement;

// // --- System Prompt ---
// const SYSTEM_PROMPT = `
// You are an advanced AI assistant named "T-Sathi" (Telangana-Sathi), the official chatbot for a Telangana bus tracking application. Your primary goal is to provide users with accurate, real-time, and easy-to-understand information about public transportation in Telangana, with a primary focus on TSRTC (Telangana State Road Transport Corporation) buses and supplementary information on Hyderabad Metro. Your ultimate priority is user satisfaction through helpful and crisp responses.

// **Core Capabilities:**
// You are expected to perform the following tasks:
// * **Real-Time Bus Tracking:** When a user asks for the location of a specific bus (e.g., by providing a bus number like "218D"), you must query the live GPS database and provide its current location, the next major stop, and an estimated time of arrival (ETA) if available.
// * **Route Information:** Provide detailed information about bus routes between two specified locations (e.g., "Buses from Secunderabad to Hitec City"). This includes direct bus numbers, alternative routes, approximate frequency, and a Google Maps link showing the transit route.
// * **Nearby Stops & Stations:** Identify and list nearby TSRTC bus stops and Hyderabad Metro stations based on the user's location or a landmark. For each stop, provide a Google Maps link for walking directions.
// * **First/Last Bus Timings:** Provide the first and last bus timings for specific routes.
// * **General Transport Queries:** Answer general questions related to TSRTC services and Hyderabad Metro lines.

// **Knowledge Base and Data Sources:**
// * **Primary Source:** Your core knowledge is a real-time database of TSRTC bus locations, routes, schedules, and official bus stop locations.
// * **Secondary Source:** You have access to a static database of Hyderabad Metro routes, station names, and their geographical coordinates.
// * **Fallback Mechanism:** If a query is outside your knowledge base (e.g., "rules for student bus passes?"), you can use general AI knowledge, but preface the response with a disclaimer like: "Based on general information..."

// **Interaction Style and Persona:**
// * **Tone:** Be professional, friendly, and concise. Use simple language and lists.
// * **Multilingual:** Understand and respond fluently in the user's language, prioritizing English, Telugu, and Hindi/Dakhni.
// * **Proactive Clarification:** If a query is ambiguous, ask for more details.

// **Output Format and Specific Instructions:**
// * **Google Maps Integration:** Whenever providing a location, route, or direction, generate and include a direct Google Maps link.
//     * **Route:** \`https://www.google.com/maps/dir/?api=1&origin=[StartPoint]&destination=[EndPoint]&travelmode=transit\`
//     * **Location/Stop:** \`https://www.google.com/maps/search/?api=1&query=[Latitude],[Longitude]\`
//     * **Directions to a stop:** \`https://www.google.com/maps/dir/?api=1&destination=[StopLatitude],[StopLongitude]&travelmode=walking\`
// * **Structured Responses:**
//     * **Where is the bus?:** "Bus No: **[Number]** is currently near **[Landmark/Area]**. It is heading towards **[Destination]**. [Live Tracking Link]"
//     * **Buses from A to B?:** "Here are the buses from **[A]** to **[B]**:\\n**Direct Buses:**\\n• **[Bus No. 1]**\\n• **[Bus No. 2]**\\nFor the full route on a map, click here: [Google Maps Transit Link]"
//     * **Nearby bus stops?:** "The nearest bus stops to you are:\\n1. **[Stop Name 1]** (Approx. 5 min walk) - [Walking Directions Link]\\n2. **[Stop Name 2]** (Approx. 8 min walk) - [Walking Directions Link]"

// **Constraints (What NOT to do):**
// * Do not guess or provide inaccurate information. If data is unavailable, state it clearly.
// * Do not provide fare information unless you have 100% accurate data.
// * Do not engage in long, non-transport-related conversations. Politely steer them back to your purpose.
// `;

// // --- Gemini API Initialization ---
// const API_KEY = process.env.API_KEY;
// if (!API_KEY) {
//     addMessage('<strong>Error:</strong> API_KEY is not configured. Please set the API_KEY environment variable.', 'bot');
// }
// const ai = new GoogleGenAI({apiKey: API_KEY});
// const chat: Chat = ai.chats.create({
//   model: 'gemini-2.5-flash',
//   config: {
//     systemInstruction: SYSTEM_PROMPT,
//   },
// });


// /**
//  * Appends a message to the chat container.
//  * @param text The message text.
//  * @param sender The sender ('user' or 'bot').
//  * @returns The message element that was just added.
//  */
// function addMessage(text: string, sender: 'user' | 'bot'): HTMLDivElement {
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', `${sender}-message`);
//     // Basic Markdown to HTML conversion
//     let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
//     html = html.replace(/\n/g, '<br>'); // Newlines
//     // Make links clickable
//     html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
//     messageElement.innerHTML = html;
//     chatContainer.appendChild(messageElement);
//     chatContainer.scrollTop = chatContainer.scrollHeight;
//     return messageElement;
// }

// /**
//  * Creates a loading indicator and adds it to the chat.
//  * @returns The loading indicator element.
//  */
// function addLoadingIndicator(): HTMLDivElement {
//     const botMessage = document.createElement('div');
//     botMessage.classList.add('message', 'bot-message');
//     botMessage.innerHTML = `
//         <div class="loading">
//             <span></span>
//             <span></span>
//             <span></span>
//         </div>
//     `;
//     chatContainer.appendChild(botMessage);
//     chatContainer.scrollTop = chatContainer.scrollHeight;
//     return botMessage;
// }


// /**
//  * Handles the chat form submission.
//  * @param event The form submission event.
//  */
// async function handleFormSubmit(event: SubmitEvent) {
//     event.preventDefault();
//     const prompt = promptInput.value.trim();

//     if (!prompt) return;

//     // Disable form
//     promptInput.value = '';
//     promptInput.disabled = true;
//     sendButton.disabled = true;
//     autoResizeTextarea(); // shrink textarea

//     // Add user message to UI
//     addMessage(prompt, 'user');

//     // Add loading indicator
//     const loadingIndicator = addLoadingIndicator();

//     try {
//         const responseStream = await chat.sendMessageStream({ message: prompt });
//         let firstChunk = true;
//         let responseText = '';

//         for await (const chunk of responseStream) {
//             if (firstChunk) {
//                 // Replace loading indicator with the actual message content
//                 loadingIndicator.innerHTML = '';
//                 firstChunk = false;
//             }
//             responseText += chunk.text;
//             // Basic Markdown to HTML conversion for streaming
//             let html = responseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//             html = html.replace(/\n/g, '<br>');
//             html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
//             loadingIndicator.innerHTML = html;
//             chatContainer.scrollTop = chatContainer.scrollHeight;
//         }

//     } catch (error) {
//         console.error(error);
//         loadingIndicator.innerHTML = 'Sorry, something went wrong. Please try again.';
//     } finally {
//         // Re-enable form
//         promptInput.disabled = false;
//         sendButton.disabled = false;
//         promptInput.focus();
//     }
// }

// /**
//  * Auto-resizes the textarea based on its content.
//  */
// function autoResizeTextarea() {
//     promptInput.style.height = 'auto'; // Reset height
//     promptInput.style.height = `${promptInput.scrollHeight}px`;
// }

// // --- Event Listeners ---
// chatForm.addEventListener('submit', handleFormSubmit);
// promptInput.addEventListener('input', autoResizeTextarea);
// promptInput.addEventListener('keydown', (e) => {
//     // Allow Shift+Enter for new line, but Enter alone submits.
//     if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         chatForm.requestSubmit();
//     }
// });

// // Initial greeting
// addMessage("Hello! I'm T-Sathi, your Telangana transport assistant. How can I help you today?", 'bot');
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- DOM Elements ---
const chatContainer = document.getElementById('chat-container') as HTMLDivElement;
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const sendButton = chatForm.querySelector('button') as HTMLButtonElement;

/**
 * Appends a message to the chat container.
 * @param text The message text.
 * @param sender The sender ('user' or 'bot').
 * @returns The message element that was just added.
 */
function addMessage(text: string, sender: 'user' | 'bot'): HTMLDivElement {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);

  // Markdown → HTML
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n/g, '<br>');
  html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

  messageElement.innerHTML = html;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return messageElement;
}

/**
 * Creates a loading indicator and adds it to the chat.
 * @returns The loading indicator element.
 */
function addLoadingIndicator(): HTMLDivElement {
  const botMessage = document.createElement('div');
  botMessage.classList.add('message', 'bot-message');
  botMessage.innerHTML = `
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatContainer.appendChild(botMessage);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return botMessage;
}

/**
 * Handles the chat form submission.
 * Sends user message → backend → displays bot reply.
 */
async function handleFormSubmit(event: SubmitEvent) {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  // Disable form
  promptInput.value = "";
  promptInput.disabled = true;
  sendButton.disabled = true;

  // Add user message
  addMessage(prompt, "user");

  // Add loading indicator
  const loadingIndicator = addLoadingIndicator();

  try {
    const response = await fetch("http://localhost:5000/api/chatbot/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await response.json();
    loadingIndicator.innerHTML = data.reply; // show backend reply
  } catch (error) {
    console.error(error);
    loadingIndicator.innerHTML = "Sorry, something went wrong.";
  } finally {
    // Re-enable form
    promptInput.disabled = false;
    sendButton.disabled = false;
    promptInput.focus();
  }
}

/**
 * Auto-resizes the textarea based on its content.
 */
function autoResizeTextarea() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${promptInput.scrollHeight}px`;
}

// --- Event Listeners ---
chatForm.addEventListener("submit", handleFormSubmit);
promptInput.addEventListener("input", autoResizeTextarea);
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

// Initial greeting
addMessage("Hello! I'm T-Sathi, your Telangana transport assistant. How can I help you today?", "bot");
