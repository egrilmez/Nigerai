// Direct connection to Ollama service - no proxy needed
// Options:
// 1. Your Render instance (needs fixing): 'https://ollama-xoa4.onrender.com'
// 2. Local Ollama: 'http://localhost:11434'
// 3. Any public Ollama API endpoint
const OLLAMA_API_URL = 'http://localhost:11434'; // Change this to your working endpoint

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const modelSelect = document.getElementById('modelSelect');

let conversationHistory = [];
let currentController = null;

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'message-sender';
    senderSpan.className = 'message-sender';
    if (isUser) {
        senderSpan.textContent = 'You';
    } else {
        senderSpan.innerHTML = 'n<strong>AI</strong>ja GPT';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return contentDiv;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
        <span class="message-sender">n<strong>AI</strong>ja GPT</span>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    messageInput.value = '';
    sendButton.disabled = true;
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    // Create abort controller for cancellation
    currentController = new AbortController();
    
    try {
        const selectedModel = modelSelect.value;
        
        // Try streaming first for better UX
        const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: selectedModel,
                prompt: message,
                stream: true,
                context: conversationHistory
            }),
            signal: currentController.signal,
            mode: 'cors'
        });
        
        if (!response.ok) {
            // If streaming fails, try non-streaming
            const fallbackResponse = await fetch(`${OLLAMA_API_URL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: selectedModel,
                    prompt: message,
                    stream: false,
                    context: conversationHistory
                }),
                signal: currentController.signal,
                mode: 'cors'
            });
            
            if (!fallbackResponse.ok) {
                throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
            }
            
            const data = await fallbackResponse.json();
            typingIndicator.remove();
            
            if (data.response) {
                addMessage(data.response);
                conversationHistory = data.context || [];
            } else {
                throw new Error('No response from AI');
            }
        } else {
            // Handle streaming response
            typingIndicator.remove();
            const messageContent = addMessage('', false);
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            fullResponse += data.response;
                            messageContent.textContent = fullResponse;
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                        if (data.context) {
                            conversationHistory = data.context;
                        }
                    } catch (e) {
                        // Skip invalid JSON lines
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        
        let errorMessage = 'Sorry, I encountered an error. ';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request was cancelled.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage += 'Unable to connect. This might be a CORS issue. The Ollama service needs to be configured to allow cross-origin requests from your domain.';
        } else if (error.message.includes('404')) {
            errorMessage += `The model "${modelSelect.value}" might not be available. Try pulling it first or select a different model.`;
        } else {
            errorMessage += 'Please try again later.';
        }
        
        addMessage(errorMessage);
    } finally {
        sendButton.disabled = false;
        messageInput.focus();
        currentController = null;
    }
}

// Cancel current request if needed
function cancelRequest() {
    if (currentController) {
        currentController.abort();
        currentController = null;
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Add ESC key to cancel request
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cancelRequest();
    }
});

async function checkAvailableModels() {
    try {
        const response = await fetch(`${OLLAMA_API_URL}/api/tags`, {
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.models && data.models.length > 0) {
                modelSelect.innerHTML = '';
                data.models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name;
                    option.textContent = model.name;
                    modelSelect.appendChild(option);
                });
                console.log('Available models loaded:', data.models.map(m => m.name));
                
                // Enable inputs
                sendButton.disabled = false;
                messageInput.disabled = false;
                messageInput.placeholder = "Type your message here...";
            } else {
                showNoModelsWarning();
            }
        } else {
            showCorsWarning();
        }
    } catch (error) {
        console.log('Could not fetch available models:', error);
        showCorsWarning();
    }
}

function showNoModelsWarning() {
    const firstMessage = document.querySelector('.bot-message .message-content');
    if (firstMessage) {
        firstMessage.innerHTML = `
            <strong>⚠️ No models detected on the Ollama server!</strong><br><br>
            To use n<strong>AI</strong>ja GPT, you need to pull a model first. Use these commands on the server:<br><br>
            <code>ollama pull llama2</code><br>
            <code>ollama pull mistral</code><br>
            <code>ollama pull codellama</code><br><br>
            After pulling a model, refresh this page to start chatting!
        `;
    }
    
    sendButton.disabled = true;
    messageInput.disabled = true;
    messageInput.placeholder = "Please pull a model first...";
}

function showCorsWarning() {
    const firstMessage = document.querySelector('.bot-message .message-content');
    if (firstMessage) {
        firstMessage.innerHTML = `
            <strong>⚠️ CORS Configuration Required</strong><br><br>
            The Ollama service needs to be configured to allow requests from web browsers.<br><br>
            <strong>To fix this, the Ollama server needs to be started with CORS enabled:</strong><br><br>
            <code>OLLAMA_ORIGINS="*" ollama serve</code><br><br>
            Or set environment variable:<br>
            <code>export OLLAMA_ORIGINS="*"</code><br><br>
            For production, replace "*" with your specific domain:<br>
            <code>OLLAMA_ORIGINS="https://your-domain.vercel.app"</code><br><br>
            <em>Note: The server at ${OLLAMA_API_URL} needs this configuration.</em>
        `;
    }
    
    sendButton.disabled = true;
    messageInput.disabled = true;
    messageInput.placeholder = "CORS configuration needed on server...";
}

// Initialize on load
window.addEventListener('load', () => {
    checkAvailableModels();
    messageInput.focus();
    
    // Add help text
    const helpText = document.createElement('div');
    helpText.style.cssText = 'text-align: center; padding: 10px; color: #666; font-size: 0.9em;';
    helpText.innerHTML = 'Press <strong>ESC</strong> to cancel a request';
    document.querySelector('.model-selector').appendChild(helpText);
});