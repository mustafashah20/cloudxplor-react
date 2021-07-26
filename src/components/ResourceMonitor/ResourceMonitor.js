import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import './ResourceMonitor.css'
import { Container, Row, Col, Card } from 'react-bootstrap';
//import { HiOutlineArrowNarrowUp, HiOutlineArrowNarrowDown } from 'react-icons/hi'
import StatementCompare from './../StatementCompare/StatementCompare'

class ResourceMonitor extends Component {
  
  state = {
    index : 0,
    statementAnalysisData : [],

    //statement analysis variables
    statement_avg_lat : 0,
    statement_total_lat : 0,
    statement_lock_lat : 0,
    statement_max_lat : 0,
    statement_err_count : 0,
    statement_exec_count : 0,
    statement_rows_affected : 0,
    statement_rows_examined : 0,

    //statement analysis difference variables
    statement_avg_lat_diff : 0,
    statement_total_lat_diff : 0,
    statement_lock_lat_diff : 0,
    statement_max_lat_diff : 0,
    statement_err_count_diff : 0,
    statement_exec_count_diff : 0,
    statement_rows_affected_diff : 0,
    statement_rows_examined_diff : 0,

    //used to calculate statement analysis differences
    oldStatementAnalysisData : [],
    
    hostSummaryGroups : [],
    listSelected : true,
  };

  componentDidMount() {

    this.fetchStatementAnalysisData()
    setInterval(this.fetchStatementAnalysisData, 5000);
    
    this.updateHostSummaryData()
    setInterval(this.updateHostSummaryData, 5000);

  }

  fetchStatementAnalysisData = () => {

    fetch('http://localhost:8080/api/v1/StatementAnalysis').then(
      (statementAnalysisresponse) => statementAnalysisresponse.json().then(
        (statementAnalysisBody) => {
          if(statementAnalysisBody.length > 0){
            this.setState({ 
              statementAnalysisData: statementAnalysisBody,
              statement_avg_lat : parseInt(statementAnalysisBody[this.state.index].avg_lat),
              statement_total_lat : parseInt(statementAnalysisBody[this.state.index].total_lat),
              statement_lock_lat : parseInt(statementAnalysisBody[this.state.index].lock_lat),
              statement_max_lat : parseInt(statementAnalysisBody[this.state.index].max_lat),
              statement_err_count : parseInt(statementAnalysisBody[this.state.index].err_count),
              statement_exec_count : parseInt(statementAnalysisBody[this.state.index].exec_count),
              statement_rows_affected : parseInt(statementAnalysisBody[this.state.index].rows_affected),
              statement_rows_examined : parseInt(statementAnalysisBody[this.state.index].rows_examined),
            });
            // this.setState({
            //   oldStatementAnalysisData : statementAnalysisBody
            // })
          }
        }
      )
    )
  }

  updateStatementAnalysisData =  () => {

    fetch('http://localhost:8080/api/v1/StatementAnalysis').then(
      (statementAnalysisresponse) => statementAnalysisresponse.json().then(
        (statementAnalysisBody) => {
          console.log(statementAnalysisBody)
          if(statementAnalysisBody.length > 0){
            this.setState({ 
              statementAnalysisData: statementAnalysisBody,
              statement_avg_lat : parseInt(statementAnalysisBody[this.state.index].avg_lat),
              statement_total_lat : parseInt(statementAnalysisBody[this.state.index].total_lat),
              statement_lock_lat : parseInt(statementAnalysisBody[this.state.index].lock_lat),
              statement_max_lat : parseInt(statementAnalysisBody[this.state.index].max_lat),
              statement_err_count : parseInt(statementAnalysisBody[this.state.index].err_count),
              statement_exec_count : parseInt(statementAnalysisBody[this.state.index].exec_count),
              statement_rows_affected : parseInt(statementAnalysisBody[this.state.index].rows_affected),
              statement_rows_examined : parseInt(statementAnalysisBody[this.state.index].rows_examined),
            });
        
            this.calculateDifference(this.state.oldStatementAnalysisData,statementAnalysisBody)
            this.setState({
              oldStatementAnalysisData : statementAnalysisBody
            })
          }
        }
      )
    )
  }

  calculateDifference(oldData,newData){
    this.setState({
      statement_avg_lat_diff : parseInt(newData[this.state.index].avg_lat) - parseInt(oldData[this.state.index].avg_lat),
      statement_total_lat_diff : parseInt(newData[this.state.index].total_lat) - parseInt(oldData[this.state.index].total_lat),
      statement_lock_lat_diff : parseInt(newData[this.state.index].lock_lat) - parseInt(oldData[this.state.index].lock_lat),
      statement_max_lat_diff : parseInt(newData[this.state.index].max_lat) - parseInt(oldData[this.state.index].max_lat),
      statement_err_count_diff : parseInt(newData[this.state.index].err_count) - parseInt(oldData[this.state.index].err_count),
      statement_exec_count_diff : parseInt(newData[this.state.index].exec_count) - parseInt(oldData[this.state.index].exec_count),
      statement_rows_affected_diff : parseInt(newData[this.state.index].rows_affected) - parseInt(oldData[this.state.index].rows_affected),
      statement_rows_examined_diff : parseInt(newData[this.state.index].rows_examined) - parseInt(oldData[this.state.index].rows_examined),
    })
  }

  updateHostSummaryData = () => {

    fetch('http://localhost:8080/api/v1/HostSummary').then(
      (hostSummaryResponse) => hostSummaryResponse.json().then(
        (hostSummaryBody) => {
          if(hostSummaryBody.length > 0){
            this.setState({ 
              hostSummaryGroups: hostSummaryBody 
            });
          }
        }
      )
    )
  }


  tableRowClicked (new_index) {

    const {
      statementAnalysisData,
    } = this.state;

    this.setState( 
      {
        statement_avg_lat : parseInt(statementAnalysisData[this.state.index].avg_lat),
        statement_total_lat : parseInt(statementAnalysisData[this.state.index].total_lat),
        statement_lock_lat : parseInt(statementAnalysisData[this.state.index].lock_lat),
        statement_max_lat : parseInt(statementAnalysisData[this.state.index].max_lat),
        statement_err_count : parseInt(statementAnalysisData[this.state.index].err_count),
        statement_exec_count : parseInt(statementAnalysisData[this.state.index].exec_count),
        statement_rows_affected : parseInt(statementAnalysisData[this.state.index].rows_affected),
        statement_rows_examined : parseInt(statementAnalysisData[this.state.index].rows_examined),
        index : new_index
      }
    );
  }

  render() {

    const {
      statementAnalysisData,
      hostSummaryGroups,
    } = this.state;

    return (
      <div className='main-content'>
        <Container fluid>

          <Row className="heading">
            <Col>
              <h2 className="main-heading">Hello, Mustafa Shah</h2>
              <h5 className="sub-heading">This is your dashboard</h5>
            </Col>
          </Row>
          <Row className='remove-bottom-margin'>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <div className="db-first-box">
                  <Card className="host-summary-table">
                    <Card.Body className="card-body">
                      <Card.Title className="main-heading">Statement List</Card.Title>
                        <div className="table-container">
                          <Table bordered hover>
                            <thead>
                              <th>ID</th>
                              <th>Statement</th>
                            </thead>
                            <tbody>
                            {statementAnalysisData.map( (statementAnalysisGroups,index) =>
                              <tr action onClick={() => this.tableRowClicked(index)}>
                                <td>{statementAnalysisGroups.id}</td>
                                <td>{statementAnalysisGroups.query}</td>
                              </tr>
                            )}
                            </tbody>
                          </Table>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div className="db-first-box">
                  <Card className="host-summary-table">
                    <Card.Body className="card-body">
                      <Card.Title className="main-heading">Compare Statements</Card.Title>
                        <StatementCompare />
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col md={6}>
              <Row>
                <Col md={6}>
                  <div className="second-box db-second-box-first-div db-line-1">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Statement Average Latency</Card.Title>
                        <div className="second-box-inside-div">
                          <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                            {this.state.statement_avg_lat}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            ms
                          </Card.Text>
                          {/* {
                            this.state.statement_avg_lat_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_avg_lat_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_avg_lat_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>                
                  </div>
                </Col>

                <Col md={6}> 
                  <div className="second-box db-second-box-second-div db-line-2">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Total Latency</Card.Title>
                        <div className="second-box-inside-div">
                          <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                            {this.state.statement_total_lat}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            ms
                          </Card.Text>
                          {/* {
                            this.state.statement_total_lat_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_total_lat_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_total_lat_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>     
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="second-box db-second-box-third-div db-line-3">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Lock Latency</Card.Title>
                        <div className="second-box-inside-div">
                        <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                            {this.state.statement_lock_lat}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            ms
                          </Card.Text>
                          {/* {
                            this.state.statement_lock_lat_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_lock_lat_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_lock_lat_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>    
                  </div>
                </Col>

                <Col md={6}>
                  <div className="second-box db-second-box-fourth-div db-line-4">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Max Latency</Card.Title>
                          <div className="second-box-inside-div">
                          <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                           {this.state.statement_max_lat}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            ms
                          </Card.Text>
                          {/* {
                            this.state.statement_max_lat_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_max_lat_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_max_lat_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="second-box db-second-box-third-div db-line-5">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Error Count</Card.Title>
                        <div className="second-box-inside-div">
                        <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                            {this.state.statement_err_count}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            
                          </Card.Text>
                          {/* {
                            this.state.statement_err_count_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_err_count_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_err_count_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>    
                  </div>
                </Col>

                <Col md={6}>
                  <div className="second-box db-second-box-fourth-div db-line-6">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Execution Count</Card.Title>
                          <div className="second-box-inside-div">
                          <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                            {this.state.statement_exec_count}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            
                          </Card.Text>
                          {/* {
                            this.state.statement_exec_count_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_exec_count_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_exec_count_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="second-box db-second-box-third-div db-line-7">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Rows Affected</Card.Title>
                        <div className="second-box-inside-div">
                        <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                            {this.state.statement_rows_affected}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            
                          </Card.Text>
                          {/* {
                            this.state.statement_rows_affected_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_rows_affected_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_rows_affected_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>    
                  </div>
                </Col>

                <Col md={6}>
                  <div className="second-box db-second-box-fourth-div db-line-8">
                    <Card className="db-card">
                      <Card.Body className="card-body">
                        <Card.Title className="db-second-box-main-heading">Rows Examined</Card.Title>
                          <div className="second-box-inside-div">
                          <div className="db-line"></div>
                          <Card.Text className="db-second-box-text">
                            {this.state.statement_rows_examined}
                          </Card.Text>
                          <Card.Text className="db-second-box-unit-text">
                            
                          </Card.Text>
                          {/* {
                            this.state.statement_rows_examined_diff >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                          }
                          {
                            this.state.statement_rows_examined_diff < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                          }
                          <Card.Text className="db-second-box-diffrence-text">
                            {this.state.statement_rows_examined_diff}
                          </Card.Text> */}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className='remove-bottom-margin'>
            <Col md={12}>
              <div className="db-third-row">
              <Card>
                <Card.Body className="card-body">
                  <Card.Title className="main-heading">Host Summary</Card.Title>
                  <Table bordered hover>
                    <thead>
                      <th>ID</th>
                      <th>Host</th>
                      <th>Statement</th>
                      <th>Statement Latency</th>
                      <th>Statement Average Latency</th>
                      <th>Table Scans</th>
                      <th>File IO's</th>
                      <th>File IO Latency</th>
                      <th>Current Connections</th>
                      <th>Total Connections</th>
                      <th>Unique Users</th>
                      <th>Current Memory</th>
                      <th>Total Memory Allocated</th>
                    </thead>
                    <tbody>
                    {hostSummaryGroups.map(group =>
                    <tr>
                      <td>{group.id}</td>
                      <td>{group.host}</td>
                      <td>{group.statement}</td>
                      <td>{group.statement_latency}</td>
                      <td>{group.statement_avg_lat}</td>
                      <td>{group.table_scans}</td>
                      <td>{group.file_ios}</td>
                      <td>{group.file_io_lat}</td>
                      <td>{group.current_connect}</td>
                      <td>{group.total_connect}</td>
                      <td>{group.unique_users}</td>
                      <td>{group.current_memory}</td>
                      <td>{group.total_memory_allocated}</td>
                    </tr>
                  )}
                    </tbody>
                  </Table>
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

export default ResourceMonitor;