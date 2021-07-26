import React, { Component } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import './DeviceList.css'

class DeviceList extends Component {
    state = {
    isLoading: true,
    groups: [],
    tps: 0,
    readSpeed: 0,
    writeSpeed: 0,
    read: 0,
    write: 0,
    };

    async componentDidMount() {
        const response = await fetch('http://localhost:8080/api/v1/ioData');
        const body = await response.json();
        this.setState({ groups: body, isLoading: false });
    }

    firstClicked (index) {
        const {groups} = this.state;
        
        this.setState( {
            tps: groups[index].tps_col,
            readSpeed: groups[index].readSpeed_col,
            writeSpeed: groups[index].writeSpeed_col,
            read: groups[index].read_col,
            write: groups[index].write_col,
        });
    }

    render() {
    const {groups, isLoading, tps, readSpeed, writeSpeed, read, write} = this.state;

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <Row>
            <Col md={3} style={{padding:32}}>
                <div className="list-div">
                    <ListGroup >
                        { groups.map( (data,index) => 
                            <ListGroup.Item action onClick={() => this.firstClicked(index)}>{data.device_col}</ListGroup.Item>
                        )}
                    </ListGroup>
                </div>
            </Col>
            {/* <Col style={{padding:32}} className="d-flex align-items-center" >
                <Container fluid>
                    <Row className="row-margin">
                        <Col md={4}>
                            <h4>tps</h4>
                            <div className="box2 d-flex justify-content-center align-items-center">
                            <h3>{tps}</h3>
                            </div>
                        </Col>
                        <Col md={4}>
                            <h4>kB_read/s</h4>
                            <div className="box2 d-flex justify-content-center align-items-center">
                            <h3>{readSpeed}</h3>
                            </div>
                        </Col>
                        <Col md={4}>
                            <h4>kB_wrtn/s</h4>
                            <div className="box2 d-flex justify-content-center align-items-center">
                            <h3>{writeSpeed}</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row className="row-margin">
                        <Col md={6}>
                            <h4>kB_read</h4>
                            <div className="box2 d-flex justify-content-center align-items-center">
                            <h3>{read}</h3>
                            </div>
                        </Col>
                        <Col md={6}>
                            <h4>kB_wrtn</h4>
                            <div className="box2 d-flex justify-content-center align-items-center">
                            <h3>{write}</h3>
                            </div>
                        </Col>
                    </Row>
                </Container>  
            </Col> */}
        </Row>
    );
    }
}

export default DeviceList;