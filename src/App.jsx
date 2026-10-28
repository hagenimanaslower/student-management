
import { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom'
import './App.css'

// Home page
function Home() {
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [shouldScroll, setShouldScroll] = useState(false)

  const studentsRef = useRef(null)
  const nameInputRef = useRef(null)
  const nextStudentId = useRef(1)

  // Register a student
  function handleSubmit(event) {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanCourse = course.trim()

    if (!cleanName || !cleanCourse) {
      setError('Please enter both your name and course.')
      return
    }

    const newStudent = {
      id: nextStudentId.current++,
      name: cleanName,
      course: cleanCourse
    }

    setStudents((currentStudents) => [
      ...currentStudents,
      newStudent
    ])

    setName('')
    setCourse('')
    setSearchTerm('')
    setError('')
    setShouldScroll(true)
  }

  // Scroll to records after registering a student
  useEffect(() => {
    if (shouldScroll && studentsRef.current) {
      studentsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      setShouldScroll(false)
    }
  }, [shouldScroll])

  // Clear only the form fields
  function clearForm() {
    setName('')
    setCourse('')
    setError('')
    nameInputRef.current?.focus()
  }

  // Delete one registered student
  function deleteStudent(student) {
    const confirmed = window.confirm(
      `Delete the record for ${student.name}?`
    )

    if (!confirmed) return

    setStudents((currentStudents) =>
      currentStudents.filter(
        (item) => item.id !== student.id
      )
    )
  }

  // Delete all registered students
  function deleteAllStudents() {
    if (students.length === 0) return

    const confirmed = window.confirm(
      'Are you sure you want to delete ALL registered students? This cannot be undone.'
    )

    if (!confirmed) return

    setStudents([])
    setSearchTerm('')
    setError('')
  }

  // Search by student name
  const filteredStudents = students.filter((student) =>
    student.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  )

  return (
    <main className="container">
      <div className="page-icon">🎓</div>

      <h1>Student Registration</h1>

      <p className="subtitle">
        Enter student details to register a student.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="student-name">Student Name</label>

        <input
          ref={nameInputRef}
          id="student-name"
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
        />

        <label htmlFor="student-course">Course</label>

        <input
          id="student-course"
          type="text"
          placeholder="e.g. Software Development"
          value={course}
          onChange={(event) => {
            setCourse(event.target.value)
            setError('')
          }}
        />

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button type="submit">
          Register Student
        </button>

        <button
          type="button"
          className="clear-button"
          onClick={clearForm}
        >
          Clear Form
        </button>
      </form>

      <section
        className="students-section"
        ref={studentsRef}
      >
        <div className="section-heading">
          <div>
            <h2>Student Records</h2>
            <p className="section-description">
              Search, view, or delete registered students.
            </p>
          </div>

          <span className="record-count">
            Total: {students.length}
          </span>
        </div>

        {students.length > 0 && (
          <button
            type="button"
            className="delete-all-button"
            onClick={deleteAllStudents}
          >
            Delete All Students
          </button>
        )}

        <label htmlFor="search-student">
          Search Student by Name
        </label>

        <input
          id="search-student"
          type="search"
          placeholder="Type a student's name..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        {students.length === 0 ? (
          <p className="empty-state">
            No students registered yet.
          </p>
        ) : filteredStudents.length === 0 ? (
          <p className="empty-state">
            No student found with that name.
          </p>
        ) : (
          <div className="student-list">
            {filteredStudents.map((student, index) => (
              <article
                className="student-card"
                key={student.id}
              >
                <div className="student-number">
                  {index + 1}
                </div>

                <div className="student-details">
                  <h3>{student.name}</h3>

                  <p>
                    <strong>Course:</strong> {student.course}
                  </p>
                </div>

                <button
                  type="button"
                  className="delete-student-button"
                  onClick={() => deleteStudent(student)}
                  aria-label={`Delete ${student.name}`}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

// About page
function About() {
  return (
    <main className="container about-page">
      <div className="page-icon">💻</div>

      <h1>About This App</h1>

      <p className="subtitle">
        A student registration application built with React.
      </p>

      <div className="about-card">
        <h2>Application Features</h2>

        <ul>
          <li>Register students with their names and courses.</li>
          <li>Display registered student information.</li>
          <li>Search for students by name.</li>
          <li>Clear registration form fields.</li>
          <li>Delete one student or all students.</li>
          <li>Navigate between Home and About pages.</li>
        </ul>
      </div>

      <p className="technology">
        Built with React, React Router, and CSS.
      </p>

      <Link className="home-button" to="/">
        ← Return to Home
      </Link>
    </main>
  )
}

// Navigation bar
function Navigation() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <Link
        className={location.pathname === '/' ? 'active' : ''}
        to="/"
      >
        Home
      </Link>

      <Link
        className={
          location.pathname === '/about' ? 'active' : ''
        }
        to="/about"
      >
        About
      </Link>
    </nav>
  )
}

// Main application
export default function App() {
  const [showWelcome, setShowWelcome] = useState(false)

  // Display a welcome message when the app loads
  useEffect(() => {
    setShowWelcome(true)
  }, [])

  return (
    <BrowserRouter>
      <Navigation />

      {showWelcome && (
        <section
          className="welcome-message"
          role="status"
          aria-live="polite"
        >
          <div className="welcome-content">
            <span className="welcome-icon" aria-hidden="true">
              👋
            </span>

            <div>
              <h2>Welcome to Student Registration!</h2>

              <p>
                Register students, search by name,
                and manage student records.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="welcome-close"
            aria-label="Close welcome message"
            onClick={() => setShowWelcome(false)}
          >
            ×
          </button>
        </section>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
