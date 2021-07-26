import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert, Container, Row, Col, Carousel } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db } from '../../firebase'

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Password do not match')
    }

    try {
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value).then((data) => {
        db.collection("Systems").doc(data.user.uid).collection('userSystems').doc('noOfSystem').set({
          noOfSystems: 0
        })
          .then(function () {
            console.log("Document successfully written!");
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      })

      history.push("/login")
    } catch {
      setError('Failed to create an account!')
    }
    setLoading(false)


  }

  return (
    <>
      <Container className="my-container">
        <Row>
          <Col md={6} className="my-col">
            <div className="left">
              <Card className="login-card">
                <Card.Body>
                  <h2 className="text-center mb-4">Sign Up</h2>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id='email' className="input-field">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" required ref={emailRef} />
                    </Form.Group>
                    <Form.Group id='password' className="input-field">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" required ref={passwordRef} />
                    </Form.Group>
                    <Form.Group id='password-confirm' className="input-field">
                      <Form.Label>Password Confirmation</Form.Label>
                      <Form.Control type="password" required ref={passwordConfirmRef} />
                    </Form.Group>
                    <Button disbaled={loading} className="w-100 my-btn" type="submit">Sign Up</Button>
                  </Form>
                </Card.Body>
              </Card>
              <div className="text-center signuplink">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </div>
          </Col>
          <Col md={6} className="my-col">
            <div className="right">
              <Carousel className="my-carousel">
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousel-image"
                    src={require("../../images/bookmark_red.svg")}
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>System Monitor</h3>
                    <p>Get live statistics about your system and databases.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousel-image"
                    src={require("../../images/codeprofiler.svg")}
                    alt="Second slide"
                  />

                  <Carousel.Caption>
                    <h3>Code Profiler</h3>
                    <p>Profile your code to get useful insights & improve it.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 carousel-image"
                    src={require("../../images/prediction.svg")}
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h3>Anomaly Detection</h3>
                    <p>Get notified about anomalies to keep the system in perfect state.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
