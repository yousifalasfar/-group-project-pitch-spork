import React, { useState } from "react";
import _ from "lodash";

const ReviewForm = (props) => {
  const [getForm, setForm] = useState({
    rating: "",
    name: "",
    email: "",
    reviewBody: "",
  });
  const [errors, setErrors] = useState({});

  const postForm = async () => {
    try {
      const response = await fetch(`/api/v1/review/create/${props.id}`, {
        method: "POST",
        credentials: "same-origin",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(getForm),
      });
      if (!response.ok) {
        if (response.status === 422) {
          const backendErrors = await response.json();
          setErrors(backendErrors);
        } else {
          const errorMessage = `${response.status} {${response.statusText}}`;
          throw new Error(errorMessage);
        }
      } else {
        const newlyCreatedReview = await response.json();
        props.toggleFormShow();
        props.updateReviews(newlyCreatedReview);
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleChange = (event) => {
    setForm({
      ...getForm,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const validForSubmission = () => {
    let submitErrors = {};
    const requiredFields = ["rating", "name", "email"];
    requiredFields.forEach((field) => {
      if (getForm[field].trim() === "") {
        submitErrors = {
          ...submitErrors,
          [field]: "cannot be blank",
        };
      }
    });
    setErrors(submitErrors);
    return _.isEmpty(submitErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validForSubmission()) {
      postForm();
      clearForm();
    }
  };

  const clearForm = (event) => {
    event.preventDefault();
    setForm({
      rating: "",
      name: "",
      email: "",
      reviewBody: "",
    });
  };

  return (
    <div>
      <h3>Review Form</h3>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <label htmlFor="rating">
          Your Album rating:
          <select
            id="rating"
            name="rating"
            value={getForm.rating}
            onChange={handleChange}
            placeholder="Your Rating"
          >
            <option value="">Please Select</option>
            <option value="1">&#1645;</option>
            <option value="2">&#1645;&#1645;</option>
            <option value="3">&#1645;&#1645;&#1645;</option>
            <option value="4">&#1645;&#1645;&#1645;&#1645;</option>
            <option value="5">&#1645;&#1645;&#1645;&#1645;&#1645;</option>
          </select>
          <span className="error">{errors.rating}</span>
        </label>

        <label htmlFor="name">
          Your Name:
          <input
            id="name"
            type="text"
            name="name"
            value={getForm.name}
            onChange={handleChange}
          />
          <span className="error">{errors.name}</span>
        </label>

        <label htmlFor="email">
          E-Mail address:
          <input
            id="email"
            type="email"
            name="email"
            value={getForm.email}
            onChange={handleChange}
            placeholder="youremail@email.com"
          />
          <span className="error">{errors.email}</span>
        </label>

        <label htmlFor="reviewBody">
          Your Album review:
          <textarea
            id="reviewBody"
            name="reviewBody"
            value={getForm.reviewBody}
            onChange={handleChange}
            placeholder="Your Album Review"
          ></textarea>
        </label>

        <div className="button-group align-justify">
          <button className="button" onClick={clearForm}>
            Clear Form
          </button>
          <input className="button" type="submit" value="Submit your review" />
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
