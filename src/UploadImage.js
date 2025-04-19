import React, { useState } from "react";
import axios from "axios";
const backendURL = "https://e-waste-sorting-assistant-backend.onrender.com";

const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${backendURL}/classify`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data); // Display the classification result in the console
  } catch (error) {
    console.error("Error:", error); // Handle any errors
  }
};
const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setPrediction(""); // Reset prediction when new file is selected
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/classify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response from server:", response.data); // Debugging

      if (response.data && response.data.category) {
        setPrediction(`
          🏷 <b>Category:</b> ${response.data.category} <br/>
          📜 <b>Classification:</b> ${response.data.classification} <br/>
          🚮 <b>Disposal Info:</b> ${response.data.disposal_info}
        `);
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setFile(null); // Reset file selection
    setPrediction(""); // Reset prediction
  };

  return (
    <div className="container">
      <p className="quote">"E-waste isn't trash—it's a lost opportunity. Recycle, repurpose, and restore our planet." ♻️🌍</p>

      {prediction ? (
        <div className="prediction-box">
          <h3>Classification Result</h3>
          <p dangerouslySetInnerHTML={{ __html: prediction }}></p>
          <button className="back-button" onClick={handleBack}>⬅ Back</button>
        </div>
      ) : (
        <div>
          {file && !prediction && <p>Image selected: {file.name}</p>}
          <input type="file" className="file-input" onChange={handleFileChange} />
          <button className="upload-button" onClick={handleUpload}>
            {loading ? "Processing..." : "Upload & Classify"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
