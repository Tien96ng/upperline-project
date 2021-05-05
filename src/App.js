import React, { useState, useEffect } from "react";
import { db, auth } from "./services/firebase";
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: 0,
    graduated: true,
    points: 0,
    joined_at: new Date()
  })

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
  }, [students]); // Second condition in useEffect() is to rerender if there is a change in student state.

  const handleFormChange = (e, field) => {
    let tempNewStudent = {...newStudent};
    if(field === "name") {
      tempNewStudent[field] = e.target.value.slice(0, 1).toUpperCase() + e.target.value.slice(1).toLowerCase();
    } else {
      tempNewStudent[field] = e.target.value;
    }
    setNewStudent({...tempNewStudent});
  }

  // Add new student to Firestore.
  const addNewStudent = e => {
    e.preventDefault();
    setShowForm(false);
    db.collection("students")
      .add(newStudent);
  }

  const handleDeleteStudent = id => {
    console.log(id)
    db.collection("students").get().then(snapshot => {
      console.log(snapshot);
    })
  }

  // Render students in state.
  const renderStudents = () => students.map((student, index) => {
    return (
      <div key={index} className="student-card">
        <h2> Name: {student.name}</h2>
        <h4> Age: {student.age}</h4>
        <h4> Graduated: {student.graduated.toString()}</h4>
        <h4> Point(s): {student.points}</h4>
        <h4> Joined: {student.joined_at.toDate().toString()} </h4>
        <button type="click" onClick={() => handleDeleteStudent(index)}>Delete</button>
      </div>
    )
    
  })

  const renderForm = () => {
    return (
      <form onSubmit={addNewStudent}>
        <label for="name"> Name: </label>
        <input 
          type="text"
          id="name"
          name="name" 
          value={newStudent.name} 
          onChange={e => handleFormChange(e, "name")} 
          required 
        />
        <br />

        <label for="age"> Age: </label>
        <input 
          type="number" 
          id="age" 
          name="age" 
          min="5" 
          max="100"
          value={newStudent.age}
          onChange={e => handleFormChange(e, "age")}
          required 
        />
        
        <p>Graduated: </p>
        <input 
          type="radio" 
          id="true-grad" 
          name="grad" 
          value="True"
          onChange={e => handleFormChange(e, "graduated")} 
        />
        <label for="true-grad"> Yes </label>
        <input 
          type="radio" 
          id="false-grad" 
          name="grad" 
          value="False" 
          onChange={e => handleFormChange(e, "graduated")} 
        />
        <label for="false-grad"> No </label>

        <br />

        <button type="submit"> Add new Student! </button>
      </form>
    )
  }

  return (
    <>
      <h1> Hello World </h1>
      {showForm && renderForm()}
      <button onClick={() => setShowForm(!showForm)}>{showForm ? "Close Form" : "Add New Student"}</button>
      <div className="container">
        {students.length > 0 ? renderStudents() : "No Students Available"}
      </div>
    </>
  );
}

export default App;
