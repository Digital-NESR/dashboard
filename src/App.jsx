import Dashboard from './ME_Logistics_Dashboard.jsx';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}>
      <Dashboard />
      <div style={{
        width: '100%',
        maxWidth: 1400,
        padding: '0 20px',
        marginTop: 24,
        marginBottom: 32,
        boxSizing: 'border-box',
      }}>
        <iframe
          src="https://claude.site/public/artifacts/0d95f19b-cca4-481b-8e3c-10450fa8e012/embed"
          title="Claude Artifact"
          width="100%"
          height="600"
          frameBorder="0"
          allow="clipboard-write"
          allowFullScreen
          style={{ borderRadius: 10, border: '1px solid #E2E8F0' }}
        />
      </div>
    </div>
  );
}

export default App;