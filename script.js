// Use localhost:3010 proxy to avoid CORS issues (port updated)
// If proxy is not running, fallback to direct URL (might have CORS issues)
const OLLAMA_API_URL = 'http://localhost:3010';

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const modelSelect = document.getElementById('modelSelect');

let conversationHistory = [];

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'message-sender';
    senderSpan.textContent = isUser ? 'You' : 'AfricAI GPT';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
        <span class="message-sender">AfricAI GPT</span>
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
    
    addMessage(message, true);
    messageInput.value = '';
    sendButton.disabled = true;
    
    const typingIndicator = showTypingIndicator();
    
    try {
        const selectedModel = modelSelect.value;
        
        const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: selectedModel,
                prompt: message,
                stream: false,
                context: conversationHistory
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        typingIndicator.remove();
        
        if (data.response) {
            addMessage(data.response);
            conversationHistory = data.context || [];
        } else {
            throw new Error('No response from AI');
        }
        
    } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        
        let errorMessage = 'Sorry, I encountered an error. ';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Unable to connect to the AI service. Please check if the service is running.';
        } else if (error.message.includes('404')) {
            errorMessage += `The model "${modelSelect.value}" might not be available. Try selecting a different model.`;
        } else {
            errorMessage += 'Please try again later.';
        }
        
        addMessage(errorMessage);
    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function checkAvailableModels() {
    try {
        const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
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
                
                // Remove the warning message if models are found
                const warningMsg = document.querySelector('.no-models-warning');
                if (warningMsg) warningMsg.remove();
            } else {
                // No models available - show warning
                showNoModelsWarning();
            }
        }
    } catch (error) {
        console.log('Could not fetch available models, using defaults');
    }
}

function showNoModelsWarning() {
    // Update the initial message to show no models warning
    const firstMessage = document.querySelector('.bot-message .message-content');
    if (firstMessage) {
        firstMessage.innerHTML = `
            <strong>⚠️ No models detected on the Ollama server!</strong><br><br>
            To use AfricAI GPT, you need to pull a model first. Try one of these popular models:<br><br>
            <code>curl -X POST https://ollama-xoa4.onrender.com/api/pull -d '{"name": "llama2"}'</code><br>
            <code>curl -X POST https://ollama-xoa4.onrender.com/api/pull -d '{"name": "mistral"}'</code><br>
            <code>curl -X POST https://ollama-xoa4.onrender.com/api/pull -d '{"name": "codellama"}'</code><br><br>
            After pulling a model, refresh this page to start chatting!
        `;
    }
    
    // Disable send button
    sendButton.disabled = true;
    messageInput.disabled = true;
    messageInput.placeholder = "Please pull a model first...";
}

window.addEventListener('load', () => {
    checkAvailableModels();
    messageInput.focus();
});