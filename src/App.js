import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./App.css";
import "./global.css";
import "./Sidebar.css";
import "./Main.css";

import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const { data } = await api.get("/devs");

      setDevs(data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    if (!data) return;

    const response = await api.post("/devs", data);

    if (!!response.data.error) return;

    setDevs([...devs, response.data]);
  }

  async function handleDeleteDev(id) {
    if (!id) return;

    await api.delete(`/devs/${id}`);

    setDevs(devs.filter(dev => dev._id !== id));
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {!!devs
            ? devs.map(dev => (
                <DevItem key={dev._id} dev={dev} onDelete={handleDeleteDev} />
              ))
            : ""}
        </ul>
      </main>
    </div>
  );
}

export default App;
