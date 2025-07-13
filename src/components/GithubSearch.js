import "./GithubSearch.css";
import React, { useState } from "react";
import axios from "axios";

function GithubSearch() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username.");
      setProfileData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}`
      );
      setProfileData(response.data);
    } catch (error) {
      setError("User not found.");
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-heading">GitHub Dev Detective</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for a GitHub user..."
          value={username}
          className="search-input"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && <p className="info-message">🔍 Searching GitHub...</p>}
      {error && <p className="error-message">{error}</p>}

      {profileData && (
        <div className="profile-container">
          <div className="profile-content">
            {/* Avatar */}
            <div className="profile-img">
              <img
                src={profileData.avatar_url}
                alt={`${profileData.login}'s avatar`}
                className="profile-avatar"
              />
            </div>

            {/* Details */}
            <div className="profile-details">
              <div className="profile-des">
                <h2 className="profile-name">{profileData.name}</h2>
                <p className="profile-created">
                  Joined:{" "}
                  {new Date(profileData.created_at).toLocaleDateString()}
                </p>
              </div>

              <a
                href={profileData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                @{profileData.login}
              </a>

              <p className="profile-bio">
                {profileData.bio || "No bio available"}
              </p>

              {/* Stats */}
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">Followers:</span>
                  <span className="stat-value">{profileData.followers}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Following:</span>
                  <span className="stat-value">{profileData.following}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Public Repos:</span>
                  <span className="stat-value">{profileData.public_repos}</span>
                </div>
              </div>

              {/* Location & Website */}
              <div className="profile-footer">
                {profileData.location && (
                  <p className="footer-location">📍 {profileData.location}</p>
                )}
                {profileData.blog && (
                  <a
                    href={
                      profileData.blog.startsWith("http")
                        ? profileData.blog
                        : `https://${profileData.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    🔗 {profileData.blog}
                  </a>
                )}
              </div>

              {/* View on GitHub Button */}
              <button
                className="view-github-btn small"
                onClick={() => window.open(profileData.html_url, "_blank")}
              >
                🔗 View on GitHub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GithubSearch;
