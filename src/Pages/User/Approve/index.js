import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';
import styles from './Approve.module.scss';
import { getCookie, request } from '../../../warehouse';
import Page from '../../../Component/Page';
import Header from '../../../Component/Header';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const cx = classNames.bind(styles);

function Approve() {
    const [numberOfAccount, setNumberOfAccount] = useState('');
    const [done, setDone] = useState(false);
    const [users, setUsers] = useState([
        {
            id: '',
            username: '',
            fullname: '',
            schoolname: '',
            districtname: '',
            provincename: '',
            email: '',
            securityQuestion: '',
            securityAnswer: '',
            ip: '',
            birthday: '',
        },
    ]);
    const [start, setStart] = useState(0);
    const [limit, setLimit] = useState(1);
    const [reason, setReason] = useState('');
    const [saveStates, setSaveStates] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        request.get('/user/getNumberOfAccount.php').then((res) => setNumberOfAccount(res));
    }, []);

    useEffect(() => {
        setReason('');
        setSaveStates('');
        request
            .get('/user/getListAccount.php', {
                params: {
                    start: start,
                    perpage: limit,
                },
            })
            .then((res) => {
                if (res.length > 0) setUsers(res);
            });
    }, [start, limit, done]);

    const approveAccount = (id, isApproved, close) => {
        const payload = new FormData();
        payload.append('id', id);
        payload.append('isApproved', isApproved ? 2 : 1);
        payload.append('reason', reason);
        request.post('/user/approveAccount.php', payload).then((res) => {
            setSaveStates(res);
            setDone((prev) => !prev);
            setNumberOfAccount((prev) => prev - 1);
        });
    };

    if (getCookie().isadminlogin) {
        return (
            <div>
                <Header path="/user/approve" />
                <div id="captain" className={cx('wrapper')}>
                    {users.map((user) => {
                        return (
                            <div className={user} key={user.id}>
                                <p>
                                    <span>Tên đăng nhập:</span> {user.username}
                                </p>
                                <p>
                                    <span>Tên:</span> {user.fullname}
                                </p>
                                <p>
                                    <span>Trường:</span> {user.schoolname}
                                </p>
                                <p>
                                    <span>Huyện:</span> {user.districtname}
                                </p>
                                <p>
                                    <span>Tỉnh:</span> {user.provincename}
                                </p>
                                <p>
                                    <span>Email:</span> {user.email}{' '}
                                </p>
                                <p>
                                    <span>IP:</span> {user.ip}
                                </p>
                                <p>
                                    <span>Sinh nhật:</span> {user.birthday}
                                </p>
                                <label>Lí do: </label>
                                <textarea
                                    className={cx('reason')}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                ></textarea>
                                <div>
                                    <Popup
                                        modal
                                        trigger={<button className={cx('approve-btn', 'yes-btn')}>Duyệt</button>}
                                        onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                    >
                                        {(close) => (
                                            <div className="popup-wrapper">
                                                <p>Bạn thực sự muốn duyệt không?</p>
                                                <div className={cx('popup-header')}>
                                                    <button className="popup-btn wrong-color" onClick={close}>
                                                        Không
                                                    </button>
                                                    <button
                                                        className="popup-btn correct-color"
                                                        onClick={() => {
                                                            approveAccount(user.id, true);
                                                            document
                                                                .getElementById('captain')
                                                                .classList.remove('popupOpen');
                                                            // close();
                                                        }}
                                                    >
                                                        Có
                                                    </button>
                                                </div>
                                                {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                                            </div>
                                        )}
                                    </Popup>
                                    <Popup
                                        modal
                                        trigger={<button className={cx('approve-btn', 'no-btn')}>Không duyệt</button>}
                                        onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                    >
                                        {(close) => (
                                            <div className="popup-wrapper">
                                                <p>Bạn thực sự muốn từ chối không?</p>
                                                <div className={cx('popup-header')}>
                                                    <button className="popup-btn wrong-color" onClick={close}>
                                                        Không
                                                    </button>
                                                    <button
                                                        className="popup-btn correct-color"
                                                        onClick={() => {
                                                            approveAccount(user.id, false);
                                                            document
                                                                .getElementById('captain')
                                                                .classList.remove('popupOpen');
                                                            // close();
                                                        }}
                                                    >
                                                        Có
                                                    </button>
                                                </div>
                                                {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Page totalRecords={numberOfAccount} setStart={setStart} setLimit={setLimit} />
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Approve;
