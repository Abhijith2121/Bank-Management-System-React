import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userDetail } from '../../../services/ApiServices';
import { userDetailUpdate } from '../../../services/ApiServices';

function UpdateUser() {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({});
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [userPosition, setUserPosition] = useState('');
    const [userStatus, setUserStatus] = useState('');

    const [message, setMessage] = useState('');

    const disappear=(time)=>{
     setTimeout(() => {
            setMessage('');
          }, time);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userDetail(userId);
                setUserDetails(response.data);
                setUserName(response.data.username);
                setEmail(response.data.email);
                setUserType(response.data.user_type);
                setUserPosition(response.data.user_position);
                setUserStatus(response.data.status);
            } catch (error) {
                setMessage(error);
            }
        };

        fetchData();
    }, []);

    const data = {
        username: userName,
        email: email,
        user_type: userType,
        user_position: userPosition,
        status: userStatus,
    };

    const handleUpdateUser = async (e, id) => {
        e.preventDefault();
        try {
            const response = await userDetailUpdate(id, data);
            setMessage(response.data.message);
            
        } catch (error) {
            setMessage(error);
           disappear(2000)
        }
    };

    return (
        <div>
            <div className="page-wrapper p-t-45 p-b-50">
                <div className="wrapper wrapper--w790">
                    <div className="card card-5">
                        <div className="card-heading">
                            <h2 className="title">Update User</h2>
                        </div>
                        <div className="card-body">
                            <form method="POST">
                            {message && <div className={`alert ${message === 'successfully registered' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                                <div className="form-row">
                                    <div className="name">User Name</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input
                                                className="input--style-5"
                                                type="text"
                                                name="username"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                placeholder='Name'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">Email</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input
                                                className="input--style-5"
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder='Email'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">User Type</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input
                                                className="input--style-5"
                                                type="text"
                                                name="user_type"
                                                value={userType}
                                                onChange={(e) => setUserType(e.target.value)}
                                                placeholder='User Type'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">User Position</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input
                                                className="input--style-5"
                                                type="text"
                                                name="user_position"
                                                value={userPosition}
                                                onChange={(e) => setUserPosition(e.target.value)}
                                                placeholder='User Position'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">Status</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input
                                                className="input--style-5"
                                                type="text"
                                                name="status"
                                                value={userStatus}
                                                onChange={(e) => setUserStatus(e.target.value)}
                                                placeholder='Status'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn--radius-2 btn--green ml-2 larger-button "
                                        type="submit"
                                        onClick={(e) => handleUpdateUser(e, userDetails.id)}
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateUser;
