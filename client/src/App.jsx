import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const client = axios.create({ baseURL: `${backend}/api` });

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [message, setMessage] = useState('');

  const selectedDetail = useMemo(() => selectedEvent, [selectedEvent]);

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await client.get('/events');
      setEvents(response.data.events || []);
    } catch (err) {
      setError('Unable to load events from backend.');
    } finally {
      setLoading(false);
    }
  };

  const selectEvent = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await client.get(`/events/${id}`);
      setSelectedEvent(response.data.event);
    } catch (err) {
      setError('Unable to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;
    setError('');
    try {
      const response = await client.post('/events', {
        title: newTitle,
        description: newDescription
      });
      setNewTitle('');
      setNewDescription('');
      setEvents((prev) => [response.data.event, ...prev]);
      setSelectedEvent(response.data.event);
      setMessage('Event created successfully.');
    } catch (err) {
      setError('Unable to create the event.');
    }
  };

  const vote = async (id, option) => {
    if (!selectedDetail) return;
    setLoading(true);
    setError('');
    try {
      await client.post(`/events/${id}/vote`, { vote: option });
      await selectEvent(id);
      await loadEvents();
    } catch (err) {
      setError('Unable to submit vote.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>EventChart</h1>
          <p>Real React frontend connected to your Express backend.</p>
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <div className="panel-header">
            <h2>Events</h2>
            <button onClick={() => setMessage('Fill the form below to add an event.')}>
              New Event
            </button>
          </div>

          <form className="create-form" onSubmit={createEvent}>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Event title"
              required
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Event description"
              rows="3"
              required
            />
            <button type="submit">Create event</button>
          </form>

          {loading && <div className="status">Loading events…</div>}
          {error && <div className="status error">{error}</div>}
          {message && <div className="status notice">{message}</div>}

          <div className="event-list">
            {events.length === 0 && <p>No events yet. Create one above.</p>}
            {events.map((event) => (
              <article key={event.id} className="event-card">
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                </div>
                <button onClick={() => selectEvent(event.id)}>View</button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel detail-panel">
          <h2>Event detail</h2>
          {selectedDetail ? (
            <div>
              <h3>{selectedDetail.title}</h3>
              <p>{selectedDetail.description}</p>
              <div className="votes">
                <div>Yes: {selectedDetail.yes}</div>
                <div>No: {selectedDetail.no}</div>
              </div>
              <div className="actions">
                <button onClick={() => vote(selectedDetail.id, 'yes')}>Vote Yes</button>
                <button onClick={() => vote(selectedDetail.id, 'no')}>Vote No</button>
              </div>
            </div>
          ) : (
            <p>Select an event to see details.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
