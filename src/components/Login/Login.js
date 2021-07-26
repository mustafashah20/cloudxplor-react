import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert, Container, Row, Col, Carousel } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'


export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/")
      window.location.reload(false);
    } catch {
      setError('Failed to sign in!')
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
                  <h2 className="text-center mb-4 title">Login</h2>
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
                    <Button disbaled={loading} className="w-100 my-btn" type="submit">Login</Button>
                  </Form>
                  <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                </Card.Body>
              </Card>
              <div className="text-center signuplink">
                Need an account? <Link to="/signup">Sign Up</Link>
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

