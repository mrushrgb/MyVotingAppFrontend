import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { BASE_URL } from '../../../../config/api';
import UserNavigation from '../../navigation/UserNavigation';

const Feedback = () => {

    var name = localStorage.getItem('auth');
    var userID = localStorage.getItem('id');

    const [getFeedback, setFeedback] = useState([]);
    const [getUserID, setGetID] = useState([]);

    const [inputs, setInputs] = useState({
        name: name,
        feedBack: "",
        userID: userID
    });

    const handleChange = (event) => {
        event.persist();
        setInputs({ ...inputs, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        load();
    }, []);

    const load = () => {
        axios.get(BASE_URL + '/feedbackById/' + userID).then(res => {
            console.log(res.data);
            setGetID(res.data.userID);
            setFeedback(res.data.feedBack);
        }).catch((e) => {
            console.log(e);
        })
    }

    const handleFormsubmit = (event) => {
        event.preventDefault();

        let data = {
            name: inputs.name,
            feedBack: inputs.feedBack,
            userID: inputs.userID
        }

        axios.post(BASE_URL + '/addFeedback', data).then(res => {
            console.log(res.status);
            if (res.status === 201 || res.status === 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: "Successfully inserted your feedback",
                    showConfirmButton: false,
                    timer: 1500
                });

                load();
            }


        }).catch((e) => {
            if (e.message === "Request failed with status code 401") {
                Swal.fire({
                    title: "Warning !",
                    icon: 'warning',
                    text: "Invalid credentials",
                    button: "Ok!"
                });
            }

            else {
                Swal.fire({
                    title: "Warning !",
                    icon: 'warning',
                    text: "Please connect your database",
                    button: "Ok!"
                });
            }
        })
    }

    const btnUpdate = () => {
        Swal.fire({
            title: "Warning !",
            icon: 'warning',
            text: "This Component Is Currently Under Development And Will Soon Be Released In Its Full Version",
            button: "Ok!"
        });
    }

    return (
        <div>
            <UserNavigation />
            <div className='bg-primary p-3 mb-3 d-flex flex-row-reverse text-white mt-3 mt-lg-0'>Home / Feedback</div>

            <div className="card shadow">
                <h5 className="card-header py-4 fw-bold text-white bg-secondary">
                    <div className='admin-text fw-bold fs-3'><i className='bx bxs-message-dots'></i> Feedback</div>
                </h5>
                <div className="card-body">
                    <div className='col-12 col-md-6'>
                        <form autoComplete="off" onSubmit={handleFormsubmit}>
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">User Name</label>
                                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" name="name" value={name} disabled />
                            </div>
                            <div class="mb-3">
                                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" name='userID' value={inputs.userID} hidden />
                            </div>

                            {
                                getUserID == userID ? (
                                    <>
                                        <div class="mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Give your feedback</label>
                                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name='feedBack' value={getFeedback}></textarea>
                                        </div>
                                        <button type="button" class="btn btn-primary btn-sm" onClick={btnUpdate}>Update the feedback</button>
                                    </>
                                ) : (


                                    <>
                                        <div class="mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Give your feedback</label>
                                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name='feedBack' value={inputs.feedBack} onChange={handleChange}></textarea>
                                        </div>
                                        <button type="submit" class="btn btn-success btn-sm">Submit the feedback</button>
                                    </>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feedback