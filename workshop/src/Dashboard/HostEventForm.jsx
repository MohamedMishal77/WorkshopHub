import React, { useState } from "react";
import "../Styles/HostEventForm.css";

const HostEventForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    category: "",
    description: "",
    banner: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    console.log("New Event:", formData);
    setFormData({
      title: "",
      date: "",
      time: "",
      duration: "",
      category: "",
      description: "",
      banner: "",
    });
  };

  return (
    <form className="host-event-form" onSubmit={handleSubmit}>
      <h2>Host a New Workshop</h2>

      <label>
        Title
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-row">
        <label>
          Date
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Duration (mins)
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Category
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Data Science">Data Science</option>
          <option value="Business">Business</option>
          <option value="Creative">Creative</option>
        </select>
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </label>

      <label>
        Banner Image URL
        <input
          type="url"
          name="banner"
          value={formData.banner}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg (Use PostImage for free Url  )"
          required
        />
      </label>

      <button type="submit" className="submit-btn">
        Create Workshop
      </button>
    </form>
  );
};

export default HostEventForm;
