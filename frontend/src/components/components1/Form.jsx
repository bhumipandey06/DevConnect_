import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Tech stack options
const techOptions = {
  Frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Bootstrap",
  ],
  Backend: [
    "Node.js",
    "Express.js",
    "MongoDB",
    "Firebase",
    "PostgreSQL",
    "GraphQL",
    "Socket.IO",
    "Prisma",
  ],
  Tools: [
    "Git",
    "GitHub",
    "Vercel",
    "Netlify",
    "Render",
    "Docker",
    "AWS",
    "Linux",
    "Figma",
  ],
  Languages: ["Python", "Java", "C++", "Go", "Rust"],
  Other: ["Zustand", "Other"],
};

const Form = ({
  name,
  setName,
  bio,
  setBio,
  techStack,
  setTechStack,
  github,
  setGithub,
  linkedin,
  setLinkedin,
  portfolio,
  setPortfolio,
  profileImage,
  setProfileImage,
  savedProfiles,
  setSavedProfiles,
  selectedProfileId,
  setSelectedProfileId,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleCheckboxChange = (tech) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  // ✅ Save existing profile
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (github && !github.startsWith("https://")) {
      setError("GitHub link must start with https://");
      return;
    }
    if (linkedin && !linkedin.startsWith("https://")) {
      setError("Linkedin link must start with https://");
      return;
    }
    if (portfolio && !portfolio.startsWith("https://")) {
      setError("Portfolio link must start with https://");
      return;
    }

    setError("");

    const profileData = {
      name,
      bio,
      github,
      linkedin,
      portfolio,
      techStack,
      profileImage,
    };

    try {
      if (selectedProfileId) {
        const { data: result } = await axios.put(
          `https://devconnect-backend-xvdx.onrender.com/api/form/${selectedProfileId}`,
          profileData
        );

        if (result.success) {
          alert("✅ Profile updated successfully!");
        } else {
          alert("⚠️ Failed to update profile.");
        }
      } else {
        alert("❌ Please use 'Save New Profile' to create a new profile.");
        return;
      }

      const { data: updated } = await axios.get(
        "https://devconnect-backend-xvdx.onrender.com/api/form/profiles"
      );

      if (updated.success) {
        setSavedProfiles(updated.data);
      }
    } catch (err) {
      console.error("Save error:", err.message);
      alert("❌ An error occurred while saving the profile.");
    }
  };

  // ✅ Save as new profile
  const handleSaveAsNew = async () => {
    const profileLabel = prompt("Enter a name for this saved profile:");
    if (!profileLabel) return;

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (github && !github.startsWith("https://")) {
      setError("GitHub link must start with https://");
      return;
    }
    if (linkedin && !linkedin.startsWith("https://")) {
      setError("Linkedin link must start with https://");
      return;
    }
    if (portfolio && !portfolio.startsWith("https://")) {
      setError("Portfolio link must start with https://");
      return;
    }

    const profileData = {
      name,
      bio,
      github,
      linkedin,
      portfolio,
      techStack,
      profileImage,
      label: profileLabel,
    };

    try {
      const { data: result } = await axios.post(
        "https://devconnect-backend-xvdx.onrender.com/api/form/submit",
        profileData
      );

      if (result.success) {
        alert("✅ Profile saved as new successfully!");

        const { data } = await axios.get(
          "https://devconnect-backend-xvdx.onrender.com/api/form/profiles"
        );

        if (data.success) {
          setSavedProfiles(data.data);
        }
      } else {
        alert("❌ Failed to save new profile.");
      }
    } catch (err) {
      console.error("Save as new error:", err.message);
      alert("❌ Error saving new profile.");
    }
  };

  const handleSelectProfile = (e) => {
    const selectedId = e.target.value;
    setSelectedProfileId(selectedId);
    if (!selectedId) return;

    const selectedProfile = savedProfiles.find((p) => p._id === selectedId);
    if (!selectedProfile) return;

    const {
      name: savedName,
      bio: savedBio,
      github: savedGithub,
      linkedin: savedLinkedin,
      portfolio: savedPortfolio,
      techStack: savedTechStack,
      profileImage: savedProfileImage,
    } = selectedProfile;

    setName(savedName || "");
    setBio(savedBio || "");
    setGithub(savedGithub || "");
    setLinkedin(savedLinkedin || "");
    setPortfolio(savedPortfolio || "");
    setTechStack(savedTechStack || []);
    setProfileImage(savedProfileImage || "");
  };

  // ✅ Delete profile
  const handleDeleteProfile = async () => {
    if (!selectedProfileId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (!confirmDelete) return;

    try {
      const { data: result } = await axios.delete(
        `https://devconnect-backend-xvdx.onrender.com/api/form/${selectedProfileId}`
      );

      if (!result.success) {
        throw new Error(result.message || "Failed to delete");
      }

      alert("🗑️ Profile deleted successfully!");

      const { data: updatedData } = await axios.get(
        "https://devconnect-backend-xvdx.onrender.com/api/form/profiles"
      );
      setSavedProfiles(updatedData.data);

      setSelectedProfileId("");
      setName("");
      setBio("");
      setGithub("");
      setLinkedin("");
      setPortfolio("");
      setTechStack([]);
      setProfileImage("");
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("❌ Failed to delete profile.");
    }
  };

  return (
    <form
      className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* 🔹 Profile Selector + Delete */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Saved Profile</label>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <select
            onChange={handleSelectProfile}
            className="w-full sm:w-2/3 px-3 py-2 border rounded bg-white text-black"
            value={selectedProfileId}
          >
            <option value="" disabled>
              -- Select a Profile --
            </option>
            {savedProfiles.map((profile) => (
              <option key={profile._id} value={profile._id}>
                {profile.label || profile.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleDeleteProfile}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
            disabled={!selectedProfileId}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bhumi Pandey"
          className="w-full px-4 py-2 text-sm border rounded"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className="block mb-1 font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="e.g. Full Stack Developer"
          className="w-full px-4 py-2 text-sm border rounded"
        />
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block mb-1 font-medium">Tech Stack</label>
        {Object.entries(techOptions).map(([category, techList]) => (
          <div key={category} className="mb-4">
            <h4 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 mb-2">
              {category}
            </h4>
            <div className="flex flex-wrap gap-4">
              {techList.map((tech) => (
                <label key={tech} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={techStack.includes(tech)}
                    onChange={() => handleCheckboxChange(tech)}
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Links */}
      <div>
        <label className="block mb-1 font-medium">GitHub Link</label>
        <input
          type="url"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          placeholder="https://github.com/username"
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">LinkedIn Link</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/in/username"
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Portfolio Link</label>
        <input
          type="url"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="https://yourportfolio.com"
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* Upload Image */}
      <div>
        <label className="block mb-1 font-medium">Upload Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfileImage(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="block w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {selectedProfileId && (
          <button
            type="button"
            onClick={() => navigate(`/profile/${selectedProfileId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            View My Public Profile
          </button>
        )}

        <button
          type="button"
          onClick={handleSaveProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Save Profile
        </button>

        <button
          type="button"
          onClick={handleSaveAsNew}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Save New Profile
        </button>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("devconnect_profile");
            window.location.reload();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
        >
          Clear Profile
        </button>
      </div>
    </form>
  );
};

export default Form;
