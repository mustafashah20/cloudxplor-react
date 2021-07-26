import React, { useState, useEffect } from "react";
import './Sidebar.css';
import { Dropdown, ProgressBar, Popover, OverlayTrigger, Form, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { HiDotsVertical, HiChartBar, HiPlus, HiOutlineCog, HiCode, HiOutlineSearch, HiOutlineTrendingUp, HiDownload } from 'react-icons/hi'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios';
import { TiWeatherWindyCloudy } from 'react-icons/ti'
import Image from 'react-bootstrap/Image';

const Sidebar = () => {

  const { currentUser, logout } = useAuth()
  const history = useHistory()

  const addSystem = (e) => {
    e.preventDefault()
    db.collection("Systems")
      .doc(currentUser.uid)
      .collection('userSystems')
      .doc('noOfSystem')
      .get()
      .then(doc => {
        const data = doc.data();
        var no = data.noOfSystems;
        no += 1;
        db.collection("Systems").doc(currentUser.uid).collection('userSystems').doc('system' + no).set({
          name: machineName,
          id: currentUser.uid + "system" + no
        })
          .then(function () {
            console.log("Document successfully written!");
            db.collection("Systems").doc(currentUser.uid).collection('userSystems').doc('noOfSystem').set({
              noOfSystems: no
            })
              .then(function () {
                console.log("number of system updated");
              })
              .catch(function (error) {
                console.error("Error changing the number of system: ", error);
              });
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      });
    setMachineName()
  }

  function downloadConfigFile() {
    var temp = "";
    db.collection("Systems")
      .doc(currentUser.uid)
      .collection('userSystems')
      .where("id", "!=", null)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        for (var i = 0; i < data.length; i++) {
          if (data[i].id === selectedMachineID) {
            temp += (data[i].id + '\n');
          }
        }
        const element = document.createElement("a");
        const file = new Blob([currentUser.uid + ('\n') + temp], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = "config.txt";
        document.body.appendChild(element);
        element.click();
      });
  }

  function sendMachineId(machineID) {
    axios({
      method: 'post',
      url: 'http://localhost:8080/api/v1/machineID',
      data: {
        id: machines[machineID].id,
        userId: currentUser.uid,
      }
    })
    setMachineDropdownValue(machines[machineID].name);
    setSelectedMachineID(machines[machineID].id);
  }

  const [selectedMachineID, setSelectedMachineID] = useState();

  const [machines, setMachines] = useState([]);

  const [tempBool, setTempBool] = useState(false)

  const [machineDropdownValue, setMachineDropdownValue] = useState("Select Machine");

  function getMachineIds() {
    const list = machines
    db.collection("Systems")
      .doc(currentUser.uid)
      .collection('userSystems')
      .where("id", "!=", null)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        for (var i = 0; i < data.length; i++) {
          list[i] = data[i]
        }
        setMachines(list)
        setTempBool(true)

        if (machines.length > 0) {
          axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/machineID',
            data: {
              id: machines[0].id,
              userId: currentUser.uid,
            }
          })
          setMachineDropdownValue(machines[0].name);
          setSelectedMachineID(machines[0].id);
        }

      });
  }

  function tempFunc() {
    getMachineIds()
  }

  useEffect(() => {
    tempFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    try {
      await logout()
      history.push("/login")
      window.location.reload();

    } catch {
      console.log('Failed to logout')
    }
  }

  const componentRef = React.useRef();
  const currentdate = new Date().toDateString();

  const [machineName, setMachineName] = useState("");

  const onInput = ({ target: { value } }) => setMachineName(value);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Enter Machine Data</Popover.Title>
      <Popover.Content>
        <Form onSubmit={addSystem}>
          <Form.Group controlId="formBasicText">
            <Form.Label>Machine Name</Form.Label>
            <Form.Control type="text" placeholder="e.g. Machine32" onChange={onInput} />
            <Form.Text className="text-muted">
              This name will be shown in your sidebar.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={() => document.body.click()}>
            Submit
          </Button>
        </Form>
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <nav className="sidebar">
        <ul className="sidebar-side">
          <li className="logo">
            <Link to='#' className='top-logo'>
              <TiWeatherWindyCloudy className="sidebar-icon logo-icon" />
              <svg id="logo" className="logo-text" viewBox="0 0 829 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path ref={node => componentRef.current = node} d="M2 58.304C2 48.512 4.208 39.728 8.624 31.952C13.04 24.08 19.04 17.936 26.624 13.52C34.304 9.104 42.8 6.896 52.112 6.896C63.056 6.896 72.608 9.536 80.768 14.816C88.928 20.096 94.88 27.584 98.624 37.28H82.928C80.144 31.232 76.112 26.576 70.832 23.312C65.648 20.048 59.408 18.416 52.112 18.416C45.104 18.416 38.816 20.048 33.248 23.312C27.68 26.576 23.312 31.232 20.144 37.28C16.976 43.232 15.392 50.24 15.392 58.304C15.392 66.272 16.976 73.28 20.144 79.328C23.312 85.28 27.68 89.888 33.248 93.152C38.816 96.416 45.104 98.048 52.112 98.048C59.408 98.048 65.648 96.464 70.832 93.296C76.112 90.032 80.144 85.376 82.928 79.328H98.624C94.88 88.928 88.928 96.368 80.768 101.648C72.608 106.832 63.056 109.424 52.112 109.424C42.8 109.424 34.304 107.264 26.624 102.944C19.04 98.528 13.04 92.432 8.624 84.656C4.208 76.88 2 68.096 2 58.304Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M131.234 2V108.56H118.13V2H131.234Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M187.984 109.856C180.592 109.856 173.872 108.176 167.824 104.816C161.872 101.456 157.168 96.704 153.712 90.56C150.352 84.32 148.672 77.12 148.672 68.96C148.672 60.896 150.4 53.792 153.856 47.648C157.408 41.408 162.208 36.656 168.256 33.392C174.304 30.032 181.072 28.352 188.56 28.352C196.048 28.352 202.816 30.032 208.864 33.392C214.912 36.656 219.664 41.36 223.12 47.504C226.672 53.648 228.448 60.8 228.448 68.96C228.448 77.12 226.624 84.32 222.976 90.56C219.424 96.704 214.576 101.456 208.432 104.816C202.288 108.176 195.472 109.856 187.984 109.856ZM187.984 98.336C192.688 98.336 197.104 97.232 201.232 95.024C205.36 92.816 208.672 89.504 211.168 85.088C213.76 80.672 215.056 75.296 215.056 68.96C215.056 62.624 213.808 57.248 211.312 52.832C208.816 48.416 205.552 45.152 201.52 43.04C197.488 40.832 193.12 39.728 188.416 39.728C183.616 39.728 179.2 40.832 175.168 43.04C171.232 45.152 168.064 48.416 165.664 52.832C163.264 57.248 162.064 62.624 162.064 68.96C162.064 75.392 163.216 80.816 165.52 85.232C167.92 89.648 171.088 92.96 175.024 95.168C178.96 97.28 183.28 98.336 187.984 98.336Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M315.661 29.648V108.56H302.557V96.896C300.061 100.928 296.557 104.096 292.045 106.4C287.629 108.608 282.733 109.712 277.357 109.712C271.213 109.712 265.693 108.464 260.797 105.968C255.901 103.376 252.013 99.536 249.133 94.448C246.349 89.36 244.957 83.168 244.957 75.872V29.648H257.917V74.144C257.917 81.92 259.885 87.92 263.821 92.144C267.757 96.272 273.133 98.336 279.949 98.336C286.957 98.336 292.477 96.176 296.509 91.856C300.541 87.536 302.557 81.248 302.557 72.992V29.648H315.661Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M332.891 68.816C332.891 60.752 334.523 53.696 337.787 47.648C341.051 41.504 345.515 36.752 351.179 33.392C356.939 30.032 363.371 28.352 370.475 28.352C376.619 28.352 382.331 29.792 387.611 32.672C392.891 35.456 396.923 39.152 399.707 43.76V2H412.955V108.56H399.707V93.728C397.115 98.432 393.275 102.32 388.187 105.392C383.099 108.368 377.147 109.856 370.331 109.856C363.323 109.856 356.939 108.128 351.179 104.672C345.515 101.216 341.051 96.368 337.787 90.128C334.523 83.888 332.891 76.784 332.891 68.816ZM399.707 68.96C399.707 63.008 398.507 57.824 396.107 53.408C393.707 48.992 390.443 45.632 386.315 43.328C382.283 40.928 377.819 39.728 372.923 39.728C368.027 39.728 363.563 40.88 359.531 43.184C355.499 45.488 352.283 48.848 349.883 53.264C347.483 57.68 346.283 62.864 346.283 68.816C346.283 74.864 347.483 80.144 349.883 84.656C352.283 89.072 355.499 92.48 359.531 94.88C363.563 97.184 368.027 98.336 372.923 98.336C377.819 98.336 382.283 97.184 386.315 94.88C390.443 92.48 393.707 89.072 396.107 84.656C398.507 80.144 399.707 74.912 399.707 68.96Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M514.53 58.448L545.346 108.56H530.514L506.466 69.392L483.57 108.56H469.026L499.698 58.448L468.882 8.192H483.57L507.762 47.504L530.802 8.192H545.49L514.53 58.448Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M576.031 44.192C578.623 39.68 582.463 35.936 587.551 32.96C592.735 29.888 598.735 28.352 605.551 28.352C612.559 28.352 618.895 30.032 624.559 33.392C630.319 36.752 634.831 41.504 638.095 47.648C641.359 53.696 642.991 60.752 642.991 68.816C642.991 76.784 641.359 83.888 638.095 90.128C634.831 96.368 630.319 101.216 624.559 104.672C618.895 108.128 612.559 109.856 605.551 109.856C598.831 109.856 592.879 108.368 587.695 105.392C582.607 102.32 578.719 98.528 576.031 94.016V146H562.927V29.648H576.031V44.192ZM629.599 68.816C629.599 62.864 628.399 57.68 625.999 53.264C623.599 48.848 620.335 45.488 616.207 43.184C612.175 40.88 607.711 39.728 602.815 39.728C598.015 39.728 593.551 40.928 589.423 43.328C585.391 45.632 582.127 49.04 579.631 53.552C577.231 57.968 576.031 63.104 576.031 68.96C576.031 74.912 577.231 80.144 579.631 84.656C582.127 89.072 585.391 92.48 589.423 94.88C593.551 97.184 598.015 98.336 602.815 98.336C607.711 98.336 612.175 97.184 616.207 94.88C620.335 92.48 623.599 89.072 625.999 84.656C628.399 80.144 629.599 74.864 629.599 68.816Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M673.344 2V108.56H660.24V2H673.344Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M730.093 109.856C722.701 109.856 715.981 108.176 709.933 104.816C703.981 101.456 699.277 96.704 695.821 90.56C692.461 84.32 690.781 77.12 690.781 68.96C690.781 60.896 692.509 53.792 695.965 47.648C699.517 41.408 704.317 36.656 710.365 33.392C716.413 30.032 723.181 28.352 730.669 28.352C738.157 28.352 744.925 30.032 750.973 33.392C757.021 36.656 761.773 41.36 765.229 47.504C768.781 53.648 770.557 60.8 770.557 68.96C770.557 77.12 768.733 84.32 765.085 90.56C761.533 96.704 756.685 101.456 750.541 104.816C744.397 108.176 737.581 109.856 730.093 109.856ZM730.093 98.336C734.797 98.336 739.213 97.232 743.341 95.024C747.469 92.816 750.781 89.504 753.277 85.088C755.869 80.672 757.165 75.296 757.165 68.96C757.165 62.624 755.917 57.248 753.421 52.832C750.925 48.416 747.661 45.152 743.629 43.04C739.597 40.832 735.229 39.728 730.525 39.728C725.725 39.728 721.309 40.832 717.277 43.04C713.341 45.152 710.173 48.416 707.773 52.832C705.373 57.248 704.173 62.624 704.173 68.96C704.173 75.392 705.325 80.816 707.629 85.232C710.029 89.648 713.197 92.96 717.133 95.168C721.069 97.28 725.389 98.336 730.093 98.336Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
                <path d="M800.891 42.464C803.195 37.952 806.459 34.448 810.683 31.952C815.003 29.456 820.235 28.208 826.379 28.208V41.744H822.923C808.235 41.744 800.891 49.712 800.891 65.648V108.56H787.787V29.648H800.891V42.464Z" stroke="white" strokeWidth="4" mask="url(#path-1-outside-1)" />
              </svg>
              {/* <span className="logo-text">Cloud Xplor</span> */}
            </Link>
            <div className="divider"></div>
          </li>

          <li className="side-item">
            <div className='side-link side-bar-top-block'>
              {
                tempBool &&
                <Dropdown className="my-custom-dropdown" size="lg">
                  <Dropdown.Toggle variant="info" id="dropdown-basic " className="my-custom-dropdown-toggle">
                    {machineDropdownValue}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="my-custom-dropdown-menu">
                    {
                      machines.map((data, index) =>
                        <Dropdown.Item action onClick={() => sendMachineId(index)} className="my-custom-dropdown-item">
                          {data.name}
                        </Dropdown.Item>
                      )
                    }
                  </Dropdown.Menu>
                </Dropdown>
              }
            </div>
          </li>

          <li className="side-item">
            <Link to='home' className='side-link'>
              <HiChartBar className="sidebar-icon" />
              <span className="link-text">Dashboard</span>
            </Link>
          </li>

          <li className="side-item">
            <Link to='resourcemonitor' className='side-link'>
              <HiOutlineSearch className="sidebar-icon" />
              <span className="link-text">Database Monitor</span>
            </Link>
          </li>

          <li className="side-item">
            <Link to='codeprofiler' className='side-link'>
              <HiCode className="sidebar-icon" />
              <span className="link-text">Code Profiler</span>
            </Link>
          </li>

          <li className="side-item">
            <Link to='predictions' className='side-link'>
              <HiOutlineTrendingUp className="sidebar-icon" />
              <span className="link-text">Predictions</span>
            </Link>
          </li>

          <li className="side-item">
            <Link to='predictions' className='side-link'>
              <span className="link-text shortcut">Shortcuts</span>
            </Link>
          </li>

          <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose={true}>
            <li className="side-item">
              <Link className='side-link'>
                <HiPlus className="sidebar-icon" />
                <span className="link-text">Add Machine</span>
              </Link>
            </li>
          </OverlayTrigger>

          <li className="side-item" onClick={downloadConfigFile}>
            <Link className='side-link'>
              <HiDownload className="sidebar-icon" />
              <span className="link-text">Download Config</span>
            </Link>
          </li>

          <li className="side-item">
            <Link to='dashboard' className='side-link'>
              <HiOutlineCog className="sidebar-icon" />
              <span className="link-text">Settings</span>
            </Link>
          </li>

          <li className="side-item">
            <div className='side-link side-bar-bottom-block'>
              <span className="bottom-block-text">System Space</span>
              <span className="bottom-block-text-2">Last Updated: 9:00 am</span>
              <span className="bottom-block-text-3">{currentdate}</span>
              <div className="progress-percentage-text">
                <span className="bottom-block-text-4">50%</span>
              </div>
              <div className="progressbar-div">
                <ProgressBar now={50} />
              </div>
              <svg className="ripple-svg">
                <circle className="ripple-circle" r="59" cx="70" cy="70" />
                <circle className="ripple-circle" r="49" cx="70" cy="70" />
                <circle className="ripple-circle" r="39" cx="70" cy="70" />
                <circle className="ripple-circle" r="29" cx="70" cy="70" />
              </svg>
            </div>
          </li>

          <li className="side-item last-side-item">
            <div className="divider"></div>
            <div className='bottom-profile'>
              <Image src={require('../../images/profile50x50.png')} />
              <span className="bottom-profile-text">Mustafa Shah</span>
              <Dropdown className="my-dropdown">
                <Dropdown.Toggle className="sidebar-dropdown-toggle">
                  <HiDotsVertical className="sidebar-icon profile-setting" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="sidebar-dropdown-menu">
                  <Dropdown.Item onClick={handleLogout} className="logout-button">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>

        </ul>
      </nav>
    </>
  );
}

export default Sidebar;