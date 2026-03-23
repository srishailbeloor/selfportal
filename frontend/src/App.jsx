import { useState, useEffect } from 'react'
import './App.css';
function App() {
  const [namespace, setNamespace] = useState('')
  const [namespaces, setNamespaces] = useState([])
  const [owner, setOwner] = useState('')
  const [cpu, setCpu] = useState('')
  const [memory, setMemory] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
  fetch("http://127.0.0.1:8000/list/")
    .then(res => res.json())
    .then(data => setNamespaces(data));
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      namespace,
      owner,
      cpu_quota: cpu,
      memory_quota: memory
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      alert(result.message)
      setMessage(result.message)

    } catch (error) {
      alert('Backend connection failed')
    }
  }

  const handleDelete = async (ns) => {

  // ✅ Confirmation popup
  const confirmDelete = window.confirm(
    `Are you sure you want to delete namespace "${ns}"?`
  );

  if (!confirmDelete) {
    return; // ❌ Stop if user clicks Cancel
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/delete/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        namespace: ns,
      }),
    });

    const data = await response.json();
    alert(data.message || data.error);

    // refresh list
    fetch("http://127.0.0.1:8000/list/")
      .then(res => res.json())
      .then(data => setNamespaces(data));

  } catch (error) {
    alert("Delete failed");
  }
};
  

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h2>Namespace Self-Service Portal</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Namespace Name"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Owner Name"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="CPU Quota"
          value={cpu}
          onChange={(e) => setCpu(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Memory Quota"
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
        />
        <br /><br />

        <button type="submit" className="create-btn">Create Namespace</button>
      </form>
      <h2>Namespaces</h2>

<div style={{ maxWidth: "500px", margin: "auto" }}>
  {namespaces.map((item) => (
    <div
      key={item.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div>
        <strong>{item.namespace}</strong> ({item.status})
      </div>

      <button
        onClick={() => handleDelete(item.namespace)}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  ))}
</div>

      <br />
      <p>{message}</p>
    </div>
  )
}

export default App

