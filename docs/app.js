const eventListEl = document.getElementById('eventList');
const eventDetailEl = document.getElementById('eventDetail');
const newEventBtn = document.getElementById('newEventBtn');
const eventDialog = document.getElementById('eventDialog');
const eventForm = document.getElementById('eventForm');
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');
const cancelEvent = document.getElementById('cancelEvent');
const eventTemplate = document.getElementById('eventTemplate');

const STORAGE_KEY = 'eventchart-demo-state';
const username = `Guest-${Math.floor(Math.random() * 9000) + 1000}`;

let appState = {
  events: [
    {
      id: 'event-1',
      title: 'Will the price of Bitcoin close above $70K this week?',
      description: 'Prediction event for BTC price movement ending this week.',
      yes: 78,
      no: 42,
      messages: [
        { from: 'Alex', text: 'I think BTC will blow past it.' },
        { from: 'Sam', text: 'I prefer the safe side: no.' }
      ]
    },
    {
      id: 'event-2',
      title: 'Will the next Tesla earnings beat expectations?',
      description: 'Bet whether Tesla reports stronger than analyst estimates.',
      yes: 62,
      no: 38,
      messages: [
        { from: 'Jamie', text: 'Earnings momentum is strong right now.' }
      ]
    }
  ]
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      appState = JSON.parse(stored);
      if (!Array.isArray(appState.events)) {
        appState = { events: [] };
      }
    } catch (error) {
      appState = { events: [] };
    }
  }
}

function renderEvents() {
  eventListEl.innerHTML = '';
  appState.events.forEach((event) => {
    const clone = eventTemplate.content.cloneNode(true);
    clone.querySelector('.event-title').textContent = event.title;
    clone.querySelector('.event-meta').textContent = `${event.yes} yes / ${event.no} no`
    clone.querySelector('.selectBtn').addEventListener('click', () => {
      renderDetail(event.id);
    });
    eventListEl.appendChild(clone);
  });
}

function renderDetail(eventId) {
  const event = appState.events.find((item) => item.id === eventId);
  if (!event) {
    eventDetailEl.innerHTML = '<p>Event not found.</p>';
    return;
  }

  eventDetailEl.innerHTML = `
    <header>
      <div>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
      </div>
      <div class="event-meta">${event.yes} yes / ${event.no} no</div>
    </header>
    <div class="event-actions-row">
      <div class="bet-buttons">
        <button class="primary" id="betYes">Bet Yes</button>
        <button class="secondary" id="betNo">Bet No</button>
      </div>
      <button class="secondary" id="resetVotes">Reset Votes</button>
    </div>
    <div class="chat-box">
      <h4>Chat room</h4>
      <div id="chatList" class="chat-list"></div>
      <form id="chatForm" class="chat-form">
        <input id="chatInput" type="text" placeholder="Send a message..." required maxlength="120" />
        <button type="submit" class="primary">Send</button>
      </form>
    </div>
  `;

  const betYesBtn = document.getElementById('betYes');
  const betNoBtn = document.getElementById('betNo');
  const resetVotesBtn = document.getElementById('resetVotes');
  const chatList = document.getElementById('chatList');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  function updateChat() {
    chatList.innerHTML = '';
    event.messages.forEach((message) => {
      const messageEl = document.createElement('div');
      messageEl.className = 'chat-message';
      messageEl.innerHTML = `<strong>${message.from}</strong><span>${message.text}</span>`;
      chatList.appendChild(messageEl);
    });
    chatList.scrollTop = chatList.scrollHeight;
  }

  betYesBtn.addEventListener('click', () => {
    event.yes += 1;
    saveState();
    renderEvents();
    renderDetail(eventId);
  });

  betNoBtn.addEventListener('click', () => {
    event.no += 1;
    saveState();
    renderEvents();
    renderDetail(eventId);
  });

  resetVotesBtn.addEventListener('click', () => {
    event.yes = 0;
    event.no = 0;
    saveState();
    renderEvents();
    renderDetail(eventId);
  });

  chatForm.addEventListener('submit', (eventFormSubmit) => {
    eventFormSubmit.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    event.messages.push({ from: username, text: message });
    chatInput.value = '';
    saveState();
    updateChat();
  });

  updateChat();
}

function openDialog() {
  eventDialog.showModal();
}

function closeDialog() {
  eventDialog.close();
  eventForm.reset();
}

newEventBtn.addEventListener('click', openDialog);
cancelEvent.addEventListener('click', closeDialog);

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = eventTitle.value.trim();
  const description = eventDescription.value.trim();
  if (!title || !description) return;
  appState.events.unshift({
    id: `event-${Date.now()}`,
    title,
    description,
    yes: 0,
    no: 0,
    messages: [
      { from: 'System', text: 'This event has been created for the demo.' }
    ]
  });
  saveState();
  renderEvents();
  closeDialog();
});

loadState();
renderEvents();
