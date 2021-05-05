import React, { useState, useEffect } from "react";
import { db, auth } from "./services/firebase";
import './App.css';
import { render } from "@testing-library/react";

function App() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Pulling data from Firestore.
  useEffect(() => {

    db.collection("students")
      .get()
      .then(snapshot => {
        const tempStudents = [];

        snapshot.forEach(doc => {
          tempStudents.push(doc.data());
        })

        setStudents(tempStudents)
      })
      .catch(error =>  console.log(error));
      return function cleanup() {}
  }, []); // Second condition in useEffect() is to rerender if there is a change in student state.

  // Add new student to Firestore.
  const addNewStudent = () => {
    db.collection("students")
      .add({
        name: "Bob",
        age: 20,
        graduated: true,
        points: 2000,
        joined_at: new Date()
      })
  }

  // Render students in state.
  const renderStudents = () => students.map((student, index) => {
    return (
      <div key={index}>
        <h2> Name: {student.name}</h2>
        <h4> Age: {student.age}</h4>
        <h4> Graduated: {student.graduated.toString()}</h4>
        <h4> Point(s): {student.points}</h4>
        <h4> Joined: {student.joined_at.toDate().toString()} </h4>
      </div>
    )
    
  })

  const renderForm = () => {
    return (
      <form>
        <label for="name"> Name: </label>
        <input type="text" id="name" name="name" required />
        <br />

        <label for="age"> Age: </label>
        <input type="number" id="age" name="age" min="5" max="100" required />
        
        <p>Graduated: </p>
        <input type="radio" id="true-grad" name="grad" value="True" />
        <label for="true-grad"> Yes </label>
        <input type="radio" id="false-grad" name="grad" value="False" />
        <label for="false-grad"> No </label>

        <input type="points" name="points" value="0" hidden/>
        <input type="joined_at" id="joined_at" name="joined_at" value={new Date()} hidden/>
        <br />

        <button type="submit"> Add new Student! </button>
      </form>
    )
  }

  return (
    <>
      <h1> Hello World </h1>
      {console.log(showForm)}
      {showForm && renderForm()}
      <button onClick={() => setShowForm(!showForm)}>{showForm ? "Close Form" : "Add New Student"}</button>
      {students.length > 0 ? renderStudents() : "No Students Available"}
    </>
  );
}

export default App;
