import React, { Component } from 'react';
import './Home.css';
import { HiX, HiMenu } from 'react-icons/hi';
//import { HiOutlineArrowNarrowUp, HiOutlineArrowNarrowDown, HiX, HiMenu } from 'react-icons/hi';
import { Container, Row, Col, Card, ListGroup, Toast } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart} from 'recharts';
import { PieChart, Pie, Sector } from "recharts";


const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Value = ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class Home extends Component {

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  state = {

    activeIndex: 0,

    //Memory Data
    free : 0, 
    inact : 0,
    active : 0,

    //CPU Data
    usr : 0,
    nice : 0,
    sys : 0,
    ioWait : 0,
    irq : 0,
    soft : 0,
    steal : 0,
    guest : 0,
    gnice : 0,
    idle : 0,

    //DiskData
    rd_total : 0,
    rd_merged : 0,
    wr_total : 0,
    wr_merged : 0,

    //IoData
    ioData : [],
    device_id: 8,
    tps : 0,
    readSpeed : 0,
    writeSpeed : 0,
    read : 0,
    write : 0,
    tps_difference : 0,
    readSpeed_difference : 0,
    writeSpeed_difference : 0,
    read_difference : 0,
    write_difference : 0,

    //Used for difference calculation
    oldIoData : [],

    //Boolean for notification state
    cpuShow : false,
    memShow : false
  };

  componentDidMount() {
    this.updateMemData()
    setInterval(this.updateMemData, 15000);

    this.updateDiskData()
    setInterval(this.updateDiskData, 15000);
    
    this.updateCpuData()
    setInterval(this.updateCpuData, 15000);

    this.fetchIoData()
    setInterval(this.fetchIoData, 15000);
  }

  updateMemData = () => {
    try {
      fetch('http://localhost:8080/api/v1/memData').then(
      (memDataresponse) => memDataresponse.json().then(
        (memDataBody) => {
          //console.log(memDataBody)
          if(memDataBody.length > 0){
            this.setState({
              free : parseInt(memDataBody[memDataBody.length-1].free),
              inact : parseInt(memDataBody[memDataBody.length-1].inact),
              active: parseInt(memDataBody[memDataBody.length-1].active),
            })
          }
        }
      )
    )
    } catch (error) {
      console.log(error)
    }
  }

  updateDiskData = () => {

    try {
      fetch('http://localhost:8080/api/v1/diskData').then(
      (diskDataResponse) => diskDataResponse.json().then(
        (diskDataBody) => {
          //console.log(diskDataBody)
          if( diskDataBody.length > 0){
            this.setState({
              rd_total : parseInt(diskDataBody[diskDataBody.length-1].total),
              rd_merged : parseInt(diskDataBody[diskDataBody.length-1].merged),
              wr_total: parseInt(diskDataBody[diskDataBody.length-1].total2),
              wr_merged: parseInt(diskDataBody[diskDataBody.length-1].merged2),
            })
          }
        }
      )
    )
    } catch (error) {
      console.log(error)
    }
  }

  updateCpuData = () => {
    
    try {
      fetch('http://localhost:8080/api/v1/cpuData').then(
      (cpuDataResponse) => cpuDataResponse.json().then(
        (cpuDataBody) => {
          //console.log(cpuDataBody)
          if(cpuDataBody.length > 0){
            this.setState({
              usr : parseInt(cpuDataBody[0].usr),
              ioWait: parseInt(cpuDataBody[0].ioWait),
              idle: parseInt(cpuDataBody[0].idle),
              sys : parseInt(cpuDataBody[0].sys),
            })
          }
        }
      )
    )
    } catch (error) {
      console.log(error)
    }
  }

  fetchIoData = () => {

    try {
      fetch('http://localhost:8080/api/v1/ioData/').then(
        (ioDataResponse) => ioDataResponse.json().then(
          (ioDataBody) => {
            console.log()
            if(ioDataBody.length > 0){
              let temp = parseInt(ioDataBody[this.state.device_id].write_col);
              temp = temp / 1000000;
              temp = temp.toFixed(2);
          
              this.setState({
                ioData : ioDataBody,
                tps : parseInt(ioDataBody[this.state.device_id].tps_col),
                readSpeed : parseInt(ioDataBody[this.state.device_id].readSpeed_col),
                writeSpeed : parseInt(ioDataBody[this.state.device_id].writeSpeed_col),
                write : temp,
              })
              // this.setState({
              //   oldIoData : ioDataBody
              // })
            }
          }
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  updateIoData = () => {
    try {
      fetch('http://localhost:8080/api/v1/ioData/').then(
        (ioDataResponse) => ioDataResponse.json().then(
          (ioDataBody) => {
            console.log(ioDataBody)
            if(ioDataBody.length > 0){
              let temp = parseInt(ioDataBody[this.state.device_id].write_col);
              temp = temp / 1000000;
              temp = temp.toFixed(2);
          
              this.setState({
                ioData : ioDataBody,
                tps : parseInt(ioDataBody[this.state.device_id].tps_col),
                readSpeed : parseInt(ioDataBody[this.state.device_id].readSpeed_col),
                writeSpeed : parseInt(ioDataBody[this.state.device_id].writeSpeed_col),
                write : temp,
              })
              this.calculateDifference(this.state.oldIoData,ioDataBody)
              this.setState({
                oldIoData : ioDataBody
              })
            }
          }
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  calculateDifference(oldData,newData){
    let temp = parseInt(newData[this.state.device_id].write_col) - parseInt(oldData[this.state.device_id].write_col);
    temp = temp / 1000000;
    temp = temp.toFixed(2);
    this.setState({
      tps_difference : parseInt(newData[this.state.device_id].tps_col) - parseInt(oldData[this.state.device_id].tps_col),
      readSpeed_difference : parseInt(newData[this.state.device_id].readSpeed_col) - parseInt(oldData[this.state.device_id].readSpeed_col),
      writeSpeed_difference :  parseInt(newData[this.state.device_id].writeSpeed_col) -  parseInt(oldData[this.state.device_id].writeSpeed_col),
      write_difference : temp,
    })
  }


  ioDeviceClicked (index) {
    const {
      ioData,
    } = this.state;

    let temp = parseInt(ioData[index].write_col);
    temp = temp / 1000000;
    temp = temp.toFixed(2);
    
    this.setState( {
        tps: parseInt(ioData[index].tps_col),
        readSpeed: parseInt(ioData[index].readSpeed_col),
        writeSpeed: parseInt(ioData[index].writeSpeed_col),
        read: parseInt(ioData[index].read_col),
        write: temp,
        device_id : index,
    });
  }

  setCpuShow(){
    this.setState({
      cpuShow : !this.state.cpuShow
    })
  }

  setMemShow(){
    this.setState({
      memShow : !this.state.memShow
    })
  }
  
  render() {

    const rechartMemoryData = [
      {
        name: 'Free',
        memdata: this.state.free,
      },
      {
        name: 'Inactive',
        memdata: this.state.inact,
      },
      {
        name: 'Active',
        memdata: this.state.active,
      }
    ];

    const rechartDiskData = [
      {
        name: 'rd_total',
        diskData: this.state.rd_total,
      },
      {
        name: 'rd_merged',
        diskData: this.state.rd_merged,
      },
      {
        name: 'wr_total',
        diskData: this.state.wr_total,
      },
      {
        name: 'wr_merged',
        diskData: this.state.wr_merged,
      }
    ];

    const reachartPieData = [
      { 
        name: '%idle', 
        value: this.state.idle
      },
      { 
        name: '%ioWait', 
        value: this.state.ioWait
      },
      { 
        name: '%usr', 
        value: this.state.usr
      },
      { 
        name: '%sys', 
        value: this.state.sys
      },
    ];

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
            <Col md={7}>
              <div className="first-box">
                <Card>
                  <Card.Body className="card-body">
                    <Row className="stat-title-row">
                      <Col md={6} className="stat-title-col">
                        <Card.Title className="main-heading">Memory Stats</Card.Title>
                      </Col>
                      <Col md={5} className="my-toast-col">
                        <Toast onClose={() => this.setMemShow(false)} show={this.state.memShow} delay={3000} autohide className="my-toast">
                          <Toast.Header closeButton={false}>
                            {/* <img
                              src="holder.js/20x20?text=%20"
                              className="rounded mr-2"
                              alt=""
                            /> */}
                            <strong className="mr-auto">Notification</strong>
                            <small>10 mins ago</small>
                          </Toast.Header>
                          <Toast.Body className="my-toast-body">You active memory is very high.You active memory is very high.</Toast.Body>
                        </Toast>
                      </Col>
                      <Col md={1} className="stat-icon-col"> 
                      {
                        this.state.memShow === false && <HiMenu className="menu-icon" onClick={() => this.setMemShow(true)}/>
                      }
                      {
                        this.state.memShow === true && <HiX className="menu-icon" onClick={() => this.setMemShow(true)}/>
                      }
                      </Col>
                    </Row>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        layout="vertical"
                        data={rechartMemoryData}
                        margin={{
                          top: 20,
                          right: 0,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" scale="band" />
                        <Tooltip />
                        <Bar dataKey="memdata" barSize={30} className="my-bar" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </div>
              
            </Col>  
  
            <Col md={5}>
              <div className="first-box">
                <Card>
                  <Card.Body>
                    <Row className="stat-title-row">
                      <Col md={4} className="stat-title-col">
                        <Card.Title className="main-heading">CPU Stats</Card.Title>
                      </Col>
                      <Col md={7} className="my-toast-col">
                        <Toast onClose={() => this.setCpuShow(false)} show={this.state.cpuShow} delay={3000} autohide className="my-toast">
                          <Toast.Header closeButton={false}>
                            {/* <img
                              src="holder.js/20x20?text=%20"
                              className="rounded mr-2"
                              alt=""
                            /> */}
                            <strong className="mr-auto">Notification</strong>
                            <small>10 mins ago</small>
                          </Toast.Header>
                          <Toast.Body  className="my-toast-body">You CPU is being under used.You CPU is being under used.You CPU is being under used.</Toast.Body>
                        </Toast>
                      </Col>
                      <Col md={1} className="stat-icon-col"> 
                      {
                        this.state.cpuShow === false && <HiMenu className="menu-icon" onClick={() => this.setCpuShow(true)}/>
                      }
                      {
                        this.state.cpuShow === true && <HiX className="menu-icon" onClick={() => this.setCpuShow(true)}/>
                      }
                      </Col>
                    </Row>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          activeIndex={this.state.activeIndex}
                          activeShape={renderActiveShape}
                          data={reachartPieData}
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={this.onPieEnter}
                        />
                      </PieChart>
                    </ResponsiveContainer>
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
                    <Card.Title className="main-heading">TPS</Card.Title>
                    <div className="second-box-inside-div">
                      <div className="line"></div>
                      <Card.Text className="second-box-text">
                        {this.state.tps}
                      </Card.Text>
                      {/* {
                        this.state.tps_difference >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                      }
                      {
                        this.state.tps_difference < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                      }
                      <Card.Text className="second-box-diffrence-text">
                        {this.state.tps_difference}
                      </Card.Text> */}
                    </div>
                  </Card.Body>
                </Card>                
              </div>
            </Col>
  
            <Col md={3}> 
              <div className="second-box second-box-second-div">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">Read Speed</Card.Title>
                    <div className="second-box-inside-div">
                      <div className="line"></div>
                      <Card.Text className="second-box-text">
                        {this.state.readSpeed}
                      </Card.Text>
                      <Card.Text className="second-box-unit-text">
                        Kb/s
                      </Card.Text>
                      {/* {
                        this.state.readSpeed_difference >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                      }
                      {
                        this.state.readSpeed_difference < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                      }
                      <Card.Text className="second-box-diffrence-text">
                        {this.state.readSpeed_difference}
                      </Card.Text> */}
                    </div>
                  </Card.Body>
                </Card>     
              </div>
            </Col>
                  
            <Col md={3}>
              <div className="second-box second-box-third-div">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">Write Speed</Card.Title>
                    <div className="second-box-inside-div">
                      <div className="line"></div>
                      <Card.Text className="second-box-text">
                        {this.state.writeSpeed}
                      </Card.Text>
                      <Card.Text className="second-box-unit-text">
                        Kb/s
                      </Card.Text>
                      {/* {
                        this.state.writeSpeed_difference >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                      }
                      {
                        this.state.writeSpeed_difference < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                      }
                      <Card.Text className="second-box-diffrence-text">
                        {this.state.writeSpeed_difference}
                      </Card.Text> */}
                    </div>
                  </Card.Body>
                </Card>    
              </div>
            </Col>
            
            <Col md={3}>
              <div className="second-box second-box-fourth-div">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">Total Writes</Card.Title>
                    <div className="second-box-inside-div">
                      <div className="line"></div>
                      <Card.Text className="second-box-text">
                        {this.state.write}
                      </Card.Text>
                      <Card.Text className="second-box-unit-text">
                        GBs
                      </Card.Text>
                      {/* {
                        this.state.write_difference >= 0 && <HiOutlineArrowNarrowUp className="arrow-icon-up"/>
                      }
                      {
                        this.state.write_difference < 0 && <HiOutlineArrowNarrowDown className="arrow-icon-down"/>
                      }
                      <Card.Text className="second-box-diffrence-text">
                        {this.state.write_difference}
                      </Card.Text> */}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
  
          <Row>
            <Col md={8}>
              <div className="third-box">
                <Card>
                  <Card.Body className="card-body">
                    <Card.Title className="main-heading">IO Devices</Card.Title>
                    <div className="list-div">
                      <ListGroup>
                          { this.state.ioData.map( (data,index) => 
                              <ListGroup.Item action onClick={() => this.ioDeviceClicked(index)}>{data.device_col}</ListGroup.Item>
                          )}
                      </ListGroup>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              
            </Col>  
  
            <Col md={4}>
              <div className="third-box">
                <Card>
                  <Card.Body>
                    <Card.Title className="main-heading">Disk Stats</Card.Title>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={rechartDiskData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="diskData" barSize={30} fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
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

export default Home;