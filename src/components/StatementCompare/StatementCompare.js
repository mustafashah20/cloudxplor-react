import React, { Component } from 'react';
import './../ResourceMonitor/ResourceMonitor.css'
import './StatementCompare.css'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';

class StatementCompare extends Component {

    state = {
        index : 0,
        groups: [],
    
        //STATEMENT ANALYSIS DATA
        statementAnalysisGroups : [],
        statementAnalysisId : [],
        statementAnalysisAverageLatency : [],
        statementAnalysisTotalLatency : [],
        statementAnalysisLockLatency : [],
        statementAnalysisMaxLatency : [],
        statementAnalysisQuery : [],
        data : [],

        statementAnalysisGroupsBool : false,
    
        firstIndexofList : 0,
        secondIndexofList :  0,
        listSelected : false,

        firstDropDownValue: "Select a Statement",
        secondDropDownValue: "Select a Statement",
    };
  
    
    async componentDidMount() {
        
        this.updateStatementAnalysisData();
        setInterval(this.updateStatementAnalysisData,5000);
       
    }

    updateStatementAnalysisData = async () => {
        const statementAnalysisresponse = await fetch('http://localhost:8080/api/v1/StatementAnalysis');
        const statementAnalysisbody = await statementAnalysisresponse.json();
        this.setState({ statementAnalysisGroups: statementAnalysisbody});

        if(statementAnalysisbody.length >0){
            this.setState({
                statementAnalysisGroupsBool : true
            })
    
            if(this.state.statementAnalysisGroupsBool){
                this.setState({
                    data : [
                        {
                            subject: 'Avg Latency',
                            A: this.state.statementAnalysisGroups[this.state.firstIndexofList].avg_lat,
                            B: this.state.statementAnalysisGroups[this.state.secondIndexofList].avg_lat,
                            fullMark: 1000,
                        },
                        {
                            subject: 'Total Latency',
                            A: this.state.statementAnalysisGroups[this.state.firstIndexofList].total_lat,
                            B: this.state.statementAnalysisGroups[this.state.secondIndexofList].total_lat,
                            fullMark: 1000,
                        },
                        {
                            subject: 'Lock Latency',
                            A: this.state.statementAnalysisGroups[this.state.firstIndexofList].lock_lat,
                            B: this.state.statementAnalysisGroups[this.state.secondIndexofList].lock_lat,
                            fullMark: 1000,
                        },
                        {
                            subject: 'Max Latency',
                            A: this.state.statementAnalysisGroups[this.state.firstIndexofList].max_lat,
                            B: this.state.statementAnalysisGroups[this.state.secondIndexofList].max_lat,
                            fullMark: 1000,
                        },
                    ],
                })
            }
        }
    }

    firstDropdownItemClicked (new_index) {
        this.setState( {
            firstIndexofList: new_index,
            firstDropDownValue: "Statement " + (new_index + 1)
        });
    }

    secondDropdownItemClicked (new_index) {
        this.setState( {
            secondIndexofList: new_index,
            secondDropDownValue: "Statement " + (new_index + 1)
        });
    }

    compareButtonClicked () {
        this.setState( {
            listSelected: true,
        });
        
        this.setState({
            data : [
                {
                    subject: 'Avg Latency',
                    A: this.state.statementAnalysisGroups[this.state.firstIndexofList].avg_lat,
                    B: this.state.statementAnalysisGroups[this.state.secondIndexofList].avg_lat,
                    fullMark: 1000,
                },
                {
                    subject: 'Total Latency',
                    A: this.state.statementAnalysisGroups[this.state.firstIndexofList].total_lat,
                    B: this.state.statementAnalysisGroups[this.state.secondIndexofList].total_lat,
                    fullMark: 1000,
                },
                {
                    subject: 'Lock Latency',
                    A: this.state.statementAnalysisGroups[this.state.firstIndexofList].lock_lat,
                    B: this.state.statementAnalysisGroups[this.state.secondIndexofList].lock_lat,
                    fullMark: 1000,
                },
                {
                    subject: 'Max Latency',
                    A: this.state.statementAnalysisGroups[this.state.firstIndexofList].max_lat,
                    B: this.state.statementAnalysisGroups[this.state.secondIndexofList].max_lat,
                    fullMark: 1000,
                },
            ],
        })
    }

    selectStatementClicked () {
        this.setState( {
            listSelected: false,
        });
    }
  
    render() {
        if (this.state.listSelected) {
            return (
                <Row className="justify-content-center">
                    <Col md={12}>
                        <Row className="justify-content-end">
                            <Col md={2}>
                                    <Button variant="outline-secondary" action onClick={() => this.selectStatementClicked()}>
                                        Go Back
                                    </Button>
                            </Col>
                        </Row> 
                        <Row>
                            <Col md={12}>
                                <div className="testing-div">
                                    <ResponsiveContainer>
                                        <RadarChart cx="50%" cy="50%" width={730} height={250} outerRadius="80%" data={this.state.data}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis angle={30} domain={[0, 750]} />
                                            <Radar name={"Statement " + this.state.statementAnalysisGroups[this.state.firstIndexofList].id} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                            <Radar name={"Statement " + this.state.statementAnalysisGroups[this.state.secondIndexofList].id} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                            <Legend layout="vetical" verticalAlign="middle" align="left" />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        }
    
        else {
            return (
                <div className="list-selector-component">
                    <Container>
                        <Row className="justify-content-md-center statement-compare-rows compare-button">
                            <Col md="auto">
                                <DropdownButton id="dropdown-basic-button first-dropdown" variant="secondary" title={this.state.firstDropDownValue} size="lg">
                                    {this.state.statementAnalysisGroups.map( (statementAnalysisGroups,index) =>
                                        <Dropdown.Item ref={this.myRef} action onClick={() => this.firstDropdownItemClicked(index)}>
                                            {statementAnalysisGroups.id}
                                        </Dropdown.Item>
                                    )}
                                </DropdownButton>
                            </Col>

                            <Col md="auto">
                                <DropdownButton id="dropdown-basic-button second-dropdown" variant="secondary" title={this.state.secondDropDownValue} size="lg">
                                    {this.state.statementAnalysisGroups.map( (statementAnalysisGroups,index) =>
                                        <Dropdown.Item action onClick={() => this.secondDropdownItemClicked(index)}>
                                            {statementAnalysisGroups.id}
                                        </Dropdown.Item>
                                    )}
                                </DropdownButton>
                            </Col>
                        </Row>

                        <Row className="justify-content-md-center statement-compare-rows compare-button">
                            <Col md="auto">
                                <Button variant="outline-secondary" action onClick={() => this.compareButtonClicked()}>
                                    Compare
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }
        
    }
  }
  
  export default StatementCompare;