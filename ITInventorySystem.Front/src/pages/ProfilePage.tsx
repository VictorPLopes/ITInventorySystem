import React, { useState } from "react";
import axios from "axios";
import JwtUser from "../types/JwtUser";
import "./style/profile.css";

interface ProfilePageProps {
  loggedUser: JwtUser | null;
  port: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ loggedUser, port }) => {
  const [oldPassword, setOldPassword] = useState(""); // Adicionado para capturar a senha antiga
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const handlePasswordChange = async () => {
    setError("");
    setMessage("");

    if (!loggedUser) {
      setError("Usuário não identificado. Faça login novamente.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
   
    try {
      const endpoint = `https://localhost:${port}/users/${loggedUser.nameid}/update-my-password`;
      await axios.post(endpoint, { oldPassword, newPassword }); // Enviando a senha antiga e nova
      setMessage("Senha alterada com sucesso!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao alterar a senha.");
    }
  };

  if (!loggedUser) {
    return (
      <div className="profile-page-container">
        <h2>Erro</h2>
        <p>Usuário não está logado. Por favor, faça login novamente.</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Abas de Navegação */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Meu Perfil
        </button>
        <button
          className={`profile-tab ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Alterar Senha
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === "profile" && (
        <div className="profile-content">
          <h2>Informações Pessoais</h2>
          <div className="profile-field">
            <label>Nome Completo:</label>
            <input type="text" value={loggedUser.unique_name} disabled />
          </div>
          <div className="profile-field">
            <label>E-mail:</label>
            <input type="email" value={loggedUser.email} disabled />
          </div>
          <div className="profile-field">
            <label>Função:</label>
            <input type="text" value={loggedUser.role} disabled />
          </div>
        </div>
      )}

      {activeTab === "password" && (
        <div className="profile-content">
          <h2>Alterar Senha</h2>
          <p>Insira a senha antiga, nova senha e confirme-a para alterar.</p>
          <div className="profile-field">
            <label>Senha Atual:</label>
            <input
              type="password"
              placeholder="Digite a senha atual"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="profile-field">
            <label>Nova Senha:</label>
            <input
              type="password"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="profile-field">
            <label>Confirmar Nova Senha:</label>
            <input
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="save-button" onClick={handlePasswordChange}>
            Alterar Senha
          </button>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
