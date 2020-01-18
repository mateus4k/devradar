import React from "react";

import "./styles.css";

function DevItem({ dev, onDelete }) {
  async function handleDelete(id) {
    if (!id) return;

    await onDelete(id);
  }

  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name ? dev.name : dev.github_username}</strong>
          <span>{dev.techs.join(", ")}</span>
        </div>
      </header>
      <p>{dev.bio}</p>
      <footer>
        <a href={`http://github.com/${dev.github_username}`}>
          Acessar perfil no Github
        </a>
        <span
          className="user-delete"
          onClick={() => {
            handleDelete(dev._id);
          }}
        >
          x
        </span>
      </footer>
    </li>
  );
}
export default DevItem;
