import React, { Component } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table } from 'react-bootstrap';


const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;

  if (payload.anomaly === -1) {
    return (
      <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="white">
        <g transform="translate(4 4)">
          <circle r="4" fill="red" />
          <circle r="2" fill="white" />
        </g>
      </svg>
    );
  }

  return (
    <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="white">
      <g transform="translate(4 4)">
        <circle r="4" fill="green" />
        <circle r="2" fill="white" />
      </g>
    </svg>
  );
};

const CustomizedActiveDot = (props) => {
  const { cx, cy, payload } = props;

  if (payload.anomaly === -1) {
    return (
      <svg x={cx - 8} y={cy - 8} width={16} height={16} fill="white">
        <g transform="translate(8 8)">
          <circle r="8" fill="red" />
          <circle r="4" fill="white" />
        </g>
      </svg>
    );
  }

  return (
    <svg x={cx - 8} y={cy - 8} width={16} height={16} fill="white">
      <g transform="translate(8 8)">
        <circle r="8" fill="green" />
        <circle r="4" fill="white" />
      </g>
    </svg>
  );
};

class Predictions extends Component {

  state = {
    cpuShow: false,
    memShow: false,
    data: [],
    isLoading: true,
    numAnomalies: 0,
    tempNumAnomalies: 0,
    apiData: []
  };

  async componentDidMount() {
    this.fetchAnomalyData();
    setInterval(this.fetchAnomalyData, 30000);
  }

  fetchAnomalyData = async () => {
    this.setState({
      isLoading: true,
      data: [],
      tempNumAnomalies: 0,
    })
    const response = await fetch('http://localhost:8080/api/v1/getMemCluster');
    const body = await response.json();
    this.setState({
      apiData: body,
    })// eslint-disable-next-line
    body.reverse().map(el => {

      const newObj = {
        name: el.occurance.toString(),
        active: parseInt(el.active),
        anomaly: el.anomaly,
      }

      this.state.data.push(newObj);

      if (el.anomaly === -1) {
        this.setState({
          tempNumAnomalies: this.state.tempNumAnomalies + 1,
        })
      }
    })

    this.setState({
      isLoading: false,
      numAnomalies: this.state.tempNumAnomalies,
    })
  }

  render() {
    return (
      <div className='main-content'>
        <Container fluid>

          <Row className="heading">
            <Col>
              <h2 className="main-heading">Hello, Mustafa Shah</h2>
              <h5 className="sub-heading">This is your dashboard</h5>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <div className="first-box p-first-box">
                <Card>
                  <Card.Body>
                    <Row className="stat-title-row">
                      <Col md={4} className="stat-title-col">
                        <Card.Title className="main-heading">Data Trend</Card.Title>
                      </Col>
                    </Row>
                    {
                      !this.state.isLoading &&
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          width={500}
                          height={300}
                          data={this.state.data}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" interval={0} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="active" stroke="#8884d8" activeDot={<CustomizedActiveDot />} dot={<CustomizedDot />} />
                        </LineChart>
                      </ResponsiveContainer>
                    }
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div className="second-box second-box-second-div">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">Total Anomalies Detected</Card.Title>
                    <div className="second-box-inside-div">
                      <div className="line"></div>
                      <Card.Text className="second-box-text">
                        40
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>

            <Col md={6}>
              <div className="second-box second-box-third-div">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">Anomalies Detected in this Batch</Card.Title>
                    <div className="second-box-inside-div">
                      <div className="line"></div>
                      <Card.Text className="second-box-text">
                        {this.state.numAnomalies}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>

          </Row>

          <Row className='remove-bottom-margin'>
            <Col md={12}>
              <div className="p-third-row">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">Anomaly Table</Card.Title>
                    <div className="p-table">
                      <Table bordered hover>
                        <thead>
                          <th>Time</th>
                          <th>Value</th>
                          <th>Anomaly</th>
                        </thead>
                        <tbody>
                          {
                            // eslint-disable-next-line
                            this.state.apiData.map(
                              el => (el.anomaly === -1) ?
                                <tr>
                                  <td>{el.occurance}</td>
                                  <td>{el.active}</td>
                                  <td>Detected</td>
                                </tr>
                                : null
                            )
                          }
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

        </Container>
      </div>
    );
  }
}

export default Predictions;