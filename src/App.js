import React, { useState, useEffect } from "react";
import { db, auth } from "./services/firebase";
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: 0,
    graduated: true,
    points: 0,
    joined_at: new Date()
  });


  // Pulling data from Firestore.
  useEffect(() => {

    db.collection("students")
      .get()
      .then(snapshot => {
        const tempStudents = [];

        snapshot.forEach(doc => {
          let id = doc.id;
          let data = doc.data();
          tempStudents.push({id, data});
        })

        setStudents(tempStudents)
      })
      .catch(error =>  console.log(error));
      return function cleanup() {}
  }, [students]); // Second condition in useEffect() is to rerender if there is a change in student state.

  // Handle Change in form values
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

  // Handle Delete student on Doc Id
  const handleDeleteStudent = id => {
    db.collection("students")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch(error => console.log("Error Removing Document: ", error));
  }

  const handleEditStudent = id => {
    setEditForm(true);
    let tempStudent = {};
    db.collection("students")
      .doc(id)
      .get()
      .then(snapshot => {
        tempStudent = snapshot.data();
      })
    setSelectedStudent(tempStudent);
    console.log(selectedStudent);
  }

  // Render students in state.
  const renderStudents = () => students.map(student => {
    return (
      <div key={student.id} className="student-card">
        <h2> Name: {student.data.name}</h2>
        <h4> Age: {student.data.age}</h4>
        <h4> Graduated: {student.data.graduated.toString()}</h4>
        <h4> Point(s): {student.data.points}</h4>
        <h4> Joined: {student.data.joined_at.toDate().toString()} </h4>
        <button type="click" onClick={() => handleEditStudent(student.id)}> Edit {`${student.data.name}`}</button>
        <br />
        <button type="click" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
      </div>
    )
    
  })

  const renderEditForm = () => {
    return (
      <>
      </>
    )
  }

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
      <button onClick={() => setShowForm(!showForm)}>{showForm ? "Close/Cancel Form" : "Add New Student"}</button>
      <div className="container">
        {students.length > 0 ? renderStudents() : "No Students Available"}
      </div>
    </>
  );
}

export default App;
