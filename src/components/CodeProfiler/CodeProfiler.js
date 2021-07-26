import React, { Component } from 'react';
import './CodeProfiler.css';
import { Container, Row, Col, Card, ListGroup, Toast, Tabs, Tab, Table } from 'react-bootstrap';
import { HiX, HiMenu } from 'react-icons/hi';

class CodeProfiler extends Component {

  state = {

    //Thread Dump Data
    threadData : [],
    blockCount : [],
    blockCountBool: false,
    cpuTime : [],
    cpuTimeBool: false,
    lockedResources: [],
    lockedResourcesBool: false,
    threadPriority: [],
    threadPriorityBool: false,
    threadState: [],
    threadStateBool: false,
    usrThread : [],
    usrThreadBool: false,
    waitCount : [],
    waitCountBool: false,
    threadIdCount : [],
    threadIndex : 0,

    //Stack Dump Data
    allMethodAllThread: {     
      arr : [],
    },
    allMethodAllThreadBool : false,
    allMethodCount : -1,
    allMethodCountBool : false,
    stackIdCount : [],
    stackIndex: 0,
    amatClassName: [],
    amatFileName: [],
    amatLineNumber: [],
    amatMethod: [],

    allMethodOneThreadBool: false,
    amotId : 0,
    amotClassName: [],
    amotFileName: [],
    amotLineNumber: [],
    amotMethod: [],

    stackDataMethodCount : 0,
    stackDataMethodCountBool : false,

    //Heap Dump Data
    heapDumpAllClasses : [],
    heapDumpAllClassesBool : false,
    heapDumpClassName: [],
    heapDumpTotalNameBool : false,
    heapDumpClassInstance : [],
    heapDumpClassMemory : 0,
    heapDumpTotalClasses : [],
    heapDumpTotalClassesBool : false,
    heapDumpTotalInstances : [],
    heapDumpTotalInstancesBool : false,
    heapDumpTotalMemory : [],
    heapDumpTotalMemoryBool : false,

    //Heap Data
    heapInstances : [],
    heapInstancesBool : false,
    heapNames : [],
    heapMemory : [],

    //Boolean for notification state
    threadDumpShow : false,
    memShow : false,

  };

  async componentDidMount() {

    this.fetchThreadDumpData();

    this.fetchStackDumpData();

    this.fetchHeapData();

    this.fetchHeapDumpData();

  }

  fetchHeapDumpData = async () => {
    const heapDumpResponse = await fetch('http://localhost:8080/api/v1/HeapDump');
    const heapDumpBody = await heapDumpResponse.json();

    this.setState({
      heapDumpAllClasses : heapDumpBody.ac.classes,
      heapDumpClassName : heapDumpBody.ci.name,
      heapDumpClassInstance : heapDumpBody.ci.instances,
      heapDumpClassMemory : heapDumpBody.cm.memory,
      heapDumpTotalClasses : heapDumpBody.tc.classes,
      heapDumpTotalInstances : heapDumpBody.ti.instances,
      heapDumpTotalMemory : heapDumpBody.tmu.memory,
    })

    this.checkHeapDumpValues();

  }

  fetchHeapData = async () => {
    const heapResponse = await fetch('http://localhost:8080/api/v1/Heap');
    const heapBody = await heapResponse.json();

    this.setState({
      heapInstances : heapBody.heap.instances,
      heapNames : heapBody.heap.name,
      heapMemory : heapBody.heap.memory,
    })

    this.checkHeapValues();
  }

  checkHeapValues(){
    if(this.state.heapInstances.length > 0){
      this.setState({ heapInstancesBool : true })
    }
  }

  checkHeapDumpValues(){
    if(this.state.heapDumpTotalMemory > 0){
      this.setState({ heapDumpTotalMemoryBool : true })
    }

    if(this.state.heapDumpTotalClasses > 0){
      this.setState({ heapDumpTotalClassesBool : true })
    }

    if(this.state.heapDumpTotalInstances > 0){
      this.setState({ heapDumpTotalInstancesBool : true })
    }

    if(this.state.heapDumpClassMemory !== 0){
      this.setState({ heapDumpTotalNameBool : true })
    }

    if(this.state.heapDumpAllClasses.length > 0){
      this.setState({ heapDumpAllClassesBool : true })
    }
    
  }

  fetchStackDumpData = async () => {
    const stackDumpResponse = await fetch('http://localhost:8080/api/v1/StackDump');
    const stackDumpBody = await stackDumpResponse.json();

    this.checkStackLength(stackDumpBody)

    this.setState({
      //AMAT
      allMethodAllThread : stackDumpBody.amat,
      amatClassName : stackDumpBody.amat.arr[this.state.stackIndex].className,
      amatFileName : stackDumpBody.amat.arr[this.state.stackIndex].fileName,
      amatLineNumber : stackDumpBody.amat.arr[this.state.stackIndex].lineNumber,
      amatMethod : stackDumpBody.amat.arr[this.state.stackIndex].method,

      //AMC
      allMethodCount : stackDumpBody.amc.count,

      //AMOT
      amotId : stackDumpBody.amot.id,
      amotClassName : stackDumpBody.amot.className,
      amotFileName : stackDumpBody.amot.fileName,
      amotLineNumber : stackDumpBody.amot.lineNumber,
      amotMethod : stackDumpBody.amot.method,

      //MC
      stackDataMethodCount : stackDumpBody.mc,
    })    

    this.checkStackValues();

  }

  checkStackValues(){
    if(this.state.allMethodAllThread.arr.length > 0){
      this.setState({ allMethodAllThreadBool : true })
    }

    if(this.state.allMethodCount > 0){
      this.setState({ allMethodCountBool : true })
    }

    if(this.state.amotClassName.length > 0){
      this.setState({ allMethodOneThreadBool : true })
    }

    if(this.state.stackDataMethodCount < -1){
      this.setState({ stackDataMethodCountBool : true })
    }
    
  }

  checkStackLength(stackDumpBody){
    this.setState({
      stackIdCount : stackDumpBody.amat.arr,
    })
  }

  fetchThreadDumpData = async () => {
    const threadDumpResponse = await fetch('http://localhost:8080/api/v1/ThreadDump');
    const threadDumpBody = await threadDumpResponse.json();

    this.checkThreadLength(threadDumpBody);
    
    this.setState({
      threadData : threadDumpBody,
      blockCount : threadDumpBody.bc.count,
      cpuTime : threadDumpBody.cpu.time,
      lockedResources: threadDumpBody.lr,
      threadPriority: threadDumpBody.ps.priority,
      threadState : threadDumpBody.ps.state,
      usrThread : threadDumpBody.usr.time,
      waitCount : threadDumpBody.wc.count,
    })
    this.checkThreadDumpValues();
  }

  checkThreadLength(threadDumpBody){
    if( threadDumpBody.bc.id.length > 0 ){
      this.setState({
        threadIdCount : threadDumpBody.bc.id
      })
    }
    else if( threadDumpBody.cpu.id.length > 0 ){
      this.setState({
        threadIdCount : threadDumpBody.cpu.id
      })
    }
    else if( threadDumpBody.lr.id.length > 0 ){
      this.setState({
        threadIdCount : threadDumpBody.lr.id
      })
    }
    else if( threadDumpBody.ps.id.length > 0 ){
      this.setState({
        threadIdCount : threadDumpBody.ps.id
      })
    }
    else if( threadDumpBody.usr.id.length > 0 ){
      this.setState({
        threadIdCount : threadDumpBody.usr.id
      })
    }
    else if( threadDumpBody.bc.id.length > 0 ){
      this.setState({
        threadIdCount : threadDumpBody.wc.id
      })
    }
  }

  checkThreadDumpValues(){
    if(this.state.blockCount.length > 0){
      this.setState({ blockCountBool : true })
    }

    if(this.state.cpuTime.length > 0){
      this.setState({ cpuTimeBool : true })
    }

    if(this.state.cpuTime.length > 0){
      this.setState({ cpuTimeBool : true })
    }

    if(this.state.lockedResources.length > 0){
      this.setState({ lockedResourcesBool : true })
    }

    if(this.state.threadPriority.length > 0){
      this.setState({ threadPriorityBool : true })
    }

    if(this.state.threadState.length > 0){
      this.setState({ threadStateBool : true })
    }

    if(this.state.usrThread.length > 0){
      this.setState({ usrThreadBool : true })
    }

    if(this.state.waitCount.length > 0){
      this.setState({ waitCountBool : true })
    }
  }

  setThreadDumpShow(){
    this.setState({
      threadDumpShow : !this.state.threadDumpShow
    })
  }

  setMemShow(){
    this.setState({
      memShow : !this.state.memShow
    })
  }

  threadIdClicked(index){
    this.setState({
      threadIndex : index
    })
  }

  stackIdClicked(index){
    this.setState({
      stackIndex : index,
    })

    this.setState({
      amatClassName : this.state.allMethodAllThread.arr[this.state.stackIndex].className,
      amatFileName : this.state.allMethodAllThread.arr[this.state.stackIndex].fileName,
      amatLineNumber : this.state.allMethodAllThread.arr[this.state.stackIndex].lineNumber,
      amatMethod : this.state.allMethodAllThread.arr[this.state.stackIndex].method,
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
              <div className="code-profiler-first-box">
                <Card>
                  <Card.Body className="card-body">
                    <Row className="stat-title-row">
                      <Col md={6} className="stat-title-col">
                        <Card.Title className="main-heading">Thread Analysis</Card.Title>
                      </Col>
                      <Col md={5} className="my-toast-col">
                        <Toast onClose={() => this.setThreadDumpShow(false)} show={this.state.threadDumpShow} delay={3000} autohide className="my-toast">
                          <Toast.Header closeButton={false}>
                            <strong className="mr-auto">Notification</strong>
                            <small>10 mins ago</small>
                          </Toast.Header>
                          <Toast.Body className="my-toast-body">You active memory is very high.You active memory is very high.</Toast.Body>
                        </Toast>
                      </Col>
                      <Col md={1} className="stat-icon-col"> 
                      {
                        this.state.threadDumpShow === false && <HiMenu className="menu-icon" onClick={() => this.setThreadDumpShow(true)}/>
                      }
                      {
                        this.state.threadDumpShow === true && <HiX className="menu-icon" onClick={() => this.setThreadDumpShow(true)}/>
                      }
                      </Col>
                    </Row>
                    <Row className="stat-content-row"> 
                      <Col md={2}>
                        <Card className="thread-id-card">
                          <Card.Body className="thread-id-card-body">
                            <Row className="stat-title-row">
                              <Col md={12} className="stat-title-col">
                                <Card.Title className="main-heading thread-id-main-heading">Thread Ids</Card.Title>
                              </Col>
                            </Row>
                            <Row className="thread-id-content-row">
                              <Col md={12}>
                                <div className="list-div">
                                  <ListGroup>
                                    { this.state.threadIdCount.map( (data,index) => 
                                        <ListGroup.Item action onClick={() => this.threadIdClicked(index)}>{data}</ListGroup.Item>
                                    )}
                                  </ListGroup>
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={10}>
                        <Tabs defaultActiveKey="bc" id="uncontrolled-tab-example" fill justify>
                          <Tab eventKey="bc" title="Block Count">
                            {
                              !this.state.blockCountBool 
                              &&
                              <p className="t-message">Use <strong>block count</strong> method in code to get insights.</p>
                            }
                            {
                              this.state.blockCountBool 
                              &&
                              <div className="second-box second-box-first-div">
                                <Card>
                                  <Card.Body className="card-body">
                                    <Card.Title className="main-heading">Block Count</Card.Title>
                                    <div className="second-box-inside-div">
                                      <div className="line"></div>
                                      <Card.Text className="thread-second-box-text">
                                        This thread was blocked {this.state.blockCount[this.state.threadIndex]} times.
                                      </Card.Text>
                                    </div>
                                  </Card.Body>
                                </Card>                
                              </div>
                            }
                          </Tab>
                          <Tab eventKey="cpu" title="CPU Time">
                            {
                              !this.state.cpuTimeBool 
                              &&
                              <p className="t-message">Use <strong>cpu time</strong> method in code to get insights.</p>
                            }
                            {
                              this.state.cpuTimeBool 
                              &&
                              <div className="second-box second-box-third-div">
                                <Card>
                                  <Card.Body className="card-body">
                                    <Card.Title className="main-heading">CPU Time</Card.Title>
                                    <div className="second-box-inside-div">
                                      <div className="line"></div>
                                      <Card.Text className="thread-second-box-text">
                                        This thread took {parseInt(this.state.cpuTime[this.state.threadIndex] / 1000)} microseconds.
                                      </Card.Text>
                                    </div>
                                  </Card.Body>
                                </Card>                
                              </div>
                            }
                          </Tab>
                          {/* <Tab eventKey="lr" title="Locked Resources">
                            <div className="my-tab-content">
                              
                            </div>
                          </Tab> */}
                          <Tab eventKey="ps" title="Priority & State">
                            <div className="my-tab-content">
                              {
                                !this.state.threadPriorityBool 
                                &&
                                <p className="t-message">Use <strong>priority & state</strong> method in code to get insights.</p>
                              }
                              {
                                this.state.threadPriorityBool 
                                &&
                                <Row>
                                  <Col md={6}>
                                    <div className="second-box second-box-first-div">
                                      <Card>
                                        <Card.Body className="card-body">
                                          <Card.Title className="main-heading">Priority</Card.Title>
                                          <div className="second-box-inside-div">
                                            <div className="line"></div>
                                            <Card.Text className="thread-second-box-text">
                                              Thread has priority {this.state.threadPriority[this.state.threadIndex]}.
                                            </Card.Text>
                                          </div>
                                        </Card.Body>
                                      </Card>                
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <div className="second-box second-box-fourth-div">
                                      <Card>
                                        <Card.Body className="card-body">
                                          <Card.Title className="main-heading">State</Card.Title>
                                          <div className="second-box-inside-div">
                                            <div className="line"></div>
                                            <Card.Text className="thread-second-box-text">
                                              {this.state.threadState[this.state.threadIndex]}.
                                            </Card.Text>
                                          </div>
                                        </Card.Body>
                                      </Card>                
                                    </div>
                                  </Col>
                                </Row>
                              }
                            </div>
                          </Tab>
                          <Tab eventKey="usr" title="User Threads">
                            {
                              !this.state.usrThreadBool 
                              &&
                              <p className="t-message">Use <strong>usr thread</strong> method in code to get insights.</p>
                            }
                            {
                              this.state.usrThreadBool 
                              &&
                              <div className="second-box second-box-second-div">
                                <Card>
                                  <Card.Body className="card-body">
                                    <Card.Title className="main-heading">Time</Card.Title>
                                    <div className="second-box-inside-div">
                                      <div className="line"></div>
                                      <Card.Text className="thread-second-box-text">
                                        Thread used for {parseInt(this.state.usrThread[this.state.threadIndex] / 1000)} microseconds.
                                      </Card.Text>
                                    </div>
                                  </Card.Body>
                                </Card>                
                              </div>
                            }
                            
                          </Tab>
                          <Tab eventKey="wc" title="Wait Count">
                            {
                              !this.state.waitCountBool 
                              &&
                              <p className="t-message">Use <strong>wait count</strong> method in code to get insights.</p>
                            }
                            {
                              this.state.waitCountBool 
                              &&
                              <div className="second-box second-box-fourth-div">
                                <Card>
                                  <Card.Body className="card-body">
                                    <Card.Title className="main-heading">Wait Count</Card.Title>
                                    <div className="second-box-inside-div">
                                      <div className="line"></div>
                                      <Card.Text className="thread-second-box-text">
                                        Thread wait count is {parseInt(this.state.waitCount[this.state.threadIndex])}.
                                      </Card.Text>
                                    </div>
                                  </Card.Body>
                                </Card>                
                              </div>
                            }
                          </Tab>
                        </Tabs>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            </Col>  
          </Row>

          <Row>
            <Col md={3}>
              <div className="second-box second-box-first-div">
                <Card>
                  <Card.Body className="card-body">
                    {
                      !this.state.heapDumpTotalClassesBool 
                      &&
                      <p className="t-message-2">Use <strong>total classes</strong> method in code to get insights.</p>
                    }
                    {
                      this.state.heapDumpTotalClassesBool 
                      &&
                      <div>
                        <Card.Title className="main-heading">Total Classes</Card.Title>
                        <div className="second-box-inside-div">
                          <div className="line"></div>
                          <Card.Text className="second-box-text">
                            {this.state.heapDumpTotalClasses}
                          </Card.Text>
                        </div>
                      </div>
                    }
                  </Card.Body>
                </Card>                
              </div>
            </Col>
  
            <Col md={3}> 
              <div className="second-box second-box-second-div">
                <Card>
                  <Card.Body className="card-body">
                    {
                      !this.state.heapDumpTotalInstancesBool 
                      &&
                      <p className="t-message-2">Use <strong>total instances</strong> method in code to get insights.</p>
                    }
                    {
                      this.state.heapDumpTotalInstancesBool 
                      &&
                      <div>
                        <Card.Title className="main-heading">Total Instances</Card.Title>
                        <div className="second-box-inside-div">
                          <div className="line"></div>
                          <Card.Text className="second-box-text">
                            {this.state.heapDumpTotalInstances}
                          </Card.Text>
                        </div>
                      </div>
                    }
                  </Card.Body>
                </Card>     
              </div>
            </Col>
                  
            <Col md={3}>
              <div className="second-box second-box-third-div">
                <Card>
                  <Card.Body className="card-body">
                    {
                      !this.state.heapDumpTotalMemoryBool 
                      &&
                      <p className="t-message-2">Use <strong>total memory</strong> method in code to get insights.</p>
                    }
                    {
                      this.state.heapDumpTotalMemoryBool 
                      &&
                      <div>
                        <Card.Title className="main-heading">Total Memory Used</Card.Title>
                          <div className="second-box-inside-div">
                            <div className="line"></div>
                            <Card.Text className="second-box-text">
                              {parseInt(this.state.heapDumpTotalMemory / 1000)}
                            </Card.Text>
                            <Card.Text className="second-box-unit-text">
                              KBs
                            </Card.Text>
                          </div>
                      </div>
                    }
                  </Card.Body>
                </Card>    
              </div>
            </Col>
            
            <Col md={3}>
              <div className="second-box second-box-fourth-div">
                <Card>
                  <Card.Body className="card-body">
                    {
                      !this.state.heapDumpTotalNameBool 
                      &&
                      <p className="t-message-2">Use <strong>total memory used</strong> method in code to get insights.</p>
                    }
                    {
                      this.state.heapDumpTotalNameBool 
                      &&
                      <div>
                        <Card.Title className="main-heading">{this.state.heapDumpClassName} Memory </Card.Title>
                        <div className="second-box-inside-div">
                          <div className="line"></div>
                          <Card.Text className="second-box-text">
                            {parseInt(this.state.heapDumpClassMemory / 1000)}
                          </Card.Text>
                          <Card.Text className="second-box-unit-text">
                            KBs
                          </Card.Text>
                        </div>
                      </div>
                    }
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
  
          <Row>
            <Col md={8}>
              <div className="code-profiler-third-box">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">Heap Instance</Card.Title>
                    {
                      !this.state.heapInstancesBool 
                      &&
                      <p className="t-message-3">Use <strong>Write Heap to File</strong> function in code to get insights.</p>
                    }
                    {
                      this.state.heapInstancesBool 
                      &&
                      <Row> 
                        <Col md={12}>
                          <div className="my-table-div-2">
                            <Row>
                              <Col>
                                <Table bordered hover>
                                  <thead>
                                    <th>Heap Name</th>
                                  </thead>
                                  <tbody>
                                    {this.state.heapNames.map(data =>
                                      <tr>
                                        <td>{data}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </Col>
                              <Col>
                                <Table bordered hover>
                                  <thead>
                                    <th>Heap Intances</th>
                                  </thead>
                                  <tbody>
                                    {this.state.heapInstances.map(data =>
                                      <tr>
                                        <td>{data}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </Col>
                              <Col>
                                <Table bordered hover>
                                  <thead>
                                    <th>Heap Memory</th>
                                  </thead>
                                  <tbody>
                                    {this.state.heapMemory.map(data =>
                                      <tr>
                                        <td>{data}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    }
                  </Card.Body>
                </Card>
              </div>
              
            </Col>  
  
            <Col md={4}>
              <div className="code-profiler-third-box">
                <Card>
                  <Card.Body>
                    <Card.Title className="main-heading">Heap Analysis</Card.Title>
                    {
                      !this.state.heapDumpAllClassesBool 
                      &&
                      <p className="t-message-4">Use <strong>all classes</strong> function in code to get insights.</p>
                    }
                    {
                      this.state.heapDumpAllClassesBool 
                      &&
                      <Row> 
                        <Col md={12}>
                          <div className="my-table-div-2">
                            <Row>
                              <Col>
                                <Table bordered hover>
                                  <thead>
                                    <th>All Classes</th>
                                  </thead>
                                  <tbody>
                                    {this.state.heapDumpAllClasses.map(data =>
                                      <tr>
                                        <td>{data}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    }
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <div className="code-profiler-second-box">
                <Card>
                  <Card.Body className="card-body">
                    <Row className="stat-title-row">
                      <Col md={6} className="stat-title-col">
                        <Card.Title className="main-heading">Stack Analysis</Card.Title>
                      </Col>
                      <Col md={5} className="my-toast-col">
                        <Toast onClose={() => this.setThreadDumpShow(false)} show={this.state.threadDumpShow} delay={3000} autohide className="my-toast">
                          <Toast.Header closeButton={false}>
                            <strong className="mr-auto">Notification</strong>
                            <small>10 mins ago</small>
                          </Toast.Header>
                          <Toast.Body className="my-toast-body">You active memory is very high.You active memory is very high.</Toast.Body>
                        </Toast>
                      </Col>
                      <Col md={1} className="stat-icon-col"> 
                      {
                        this.state.threadDumpShow === false && <HiMenu className="menu-icon" onClick={() => this.setThreadDumpShow(true)}/>
                      }
                      {
                        this.state.threadDumpShow === true && <HiX className="menu-icon" onClick={() => this.setThreadDumpShow(true)}/>
                      }
                      </Col>
                    </Row>
                    <Row className="stat-content-row"> 
                      <Col md={12}>
                        <Tabs defaultActiveKey="amat" id="uncontrolled-tab-example" fill justify className="my-tab-content">
                          <Tab eventKey="amat" title="All Method All Thread" >
                            {
                              !this.state.allMethodAllThreadBool 
                              &&
                              <p className="t-message">Use <strong>all method all thread</strong> function in code to get insights.</p>
                            }
                            {
                              this.state.allMethodAllThreadBool 
                              &&
                              <Row> 
                                <Col md={2}>
                                  <Card className="thread-id-card">
                                    <Card.Body className="thread-id-card-body">
                                      <Row className="stat-title-row">
                                        <Col md={12} className="stat-title-col">
                                          <Card.Title className="main-heading thread-id-main-heading">Thread Ids</Card.Title>
                                        </Col>
                                      </Row>
                                      <Row className="thread-id-content-row">
                                        <Col md={12}>
                                          <div className="list-div">
                                            <ListGroup>
                                              { this.state.stackIdCount.map( (data,index) => 
                                                  <ListGroup.Item action onClick={() => this.stackIdClicked(index)}>{data.id}</ListGroup.Item>
                                              )}
                                            </ListGroup>
                                          </div>
                                        </Col>
                                      </Row>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={10}>
                                  <div className="my-table-div">
                                    <Row>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>Line Number</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amatLineNumber.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>File Name</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amatFileName.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>Class Name</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amatClassName.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>Method</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amatMethod.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            }
                          </Tab>
                          <Tab eventKey="amc" title="All Method Count">
                            {
                              !this.state.allMethodCountBool 
                              &&
                              <p className="t-message">Use <strong>all method count</strong> function in code to get insights.</p>
                            }
                            {
                              this.state.allMethodCountBool 
                              &&
                              <div className="second-box second-box-second-div">
                                <Card>
                                  <Card.Body className="card-body">
                                    <Card.Title className="main-heading">All Method Count</Card.Title>
                                    <div className="second-box-inside-div">
                                      <div className="line"></div>
                                      <Card.Text className="thread-second-box-text">
                                        Total number of methods in stack are {parseInt(this.state.allMethodCount)}.
                                      </Card.Text>
                                    </div>
                                  </Card.Body>
                                </Card>                
                              </div>
                            }
                          </Tab>
                          <Tab eventKey="amot" title="All Method One Thread">
                            {
                              !this.state.allMethodOneThreadBool 
                              &&
                              <p className="t-message">Use <strong>all method one thread</strong> function in code to get insights.</p>
                            }
                            {
                              this.state.allMethodOneThreadBool 
                              &&
                              <div className="my-tab-content">
                              <Row> 
                                <Col md={3}>
                                  <div className="second-box second-box-first-div">
                                    <Card>
                                      <Card.Body className="card-body">
                                        <Card.Title className="main-heading">Thread Id</Card.Title>
                                        <div className="second-box-inside-div">
                                          <div className="line"></div>
                                          <Card.Text className="second-box-text">
                                            {this.state.amotId}
                                          </Card.Text>
                                        </div>
                                      </Card.Body>
                                    </Card>                
                                  </div>
                                </Col>
                                <Col md={9}>
                                  <div className="my-table-div">
                                    <Row>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>Line Number</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amotLineNumber.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>File Name</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amotFileName.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>Class Name</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amotClassName.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      <Col>
                                        <Table bordered hover>
                                          <thead>
                                            <th>Method</th>
                                          </thead>
                                          <tbody>
                                            {this.state.amotMethod.map(data =>
                                              <tr>
                                                <td>{data}</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            }
                            
                          </Tab>
                          <Tab eventKey="mc" title="Method Count">
                            <div className="my-tab-content">
                              {
                                !this.state.stackDataMethodCountBool 
                                &&
                                <p className="t-message">Use <strong>method count</strong> function in code to get insights.</p>
                              }
                              {
                                this.state.stackDataMethodCountBool 
                                &&
                                <Row>
                                  <Col md={12}>
                                    <div className="second-box second-box-third-div">
                                      <Card>
                                        <Card.Body className="card-body">
                                          <Card.Title className="main-heading">Method Count</Card.Title>
                                          <div className="second-box-inside-div">
                                            <div className="line"></div>
                                            <Card.Text className="thread-second-box-text">
                                              Method ''<strong>{this.state.stackDataMethodCount.name}</strong>'' was called <strong>{this.state.stackDataMethodCount.count}</strong> times.
                                            </Card.Text>
                                          </div>
                                        </Card.Body>
                                      </Card>                
                                    </div>
                                  </Col>
                                </Row>
                              }
                            </div>
                          </Tab>
                        </Tabs>
                      </Col>
                    </Row>
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

export default CodeProfiler;