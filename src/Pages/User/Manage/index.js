import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Manage.module.scss';
import Header from '../../../Component/Header';
import { request, useDebounce, getCookie } from '../../../warehouse';
import config from '../../../config';
import Page from '../../../Component/Page';
import Popup from 'reactjs-popup';

const cx = classNames.bind(styles);

function Manage() {
    const [numberOfAccount, setNumberOfAccount] = useState('');
    const [users, setUsers] = useState([
        {
            username: '',
            email: '',
            fullName: '',
            birthday: '',
            provincename: '',
            districtname: '',
            schoolName: '',
            privilege: '',
            lotus: '',
            avatar: '',
            ban: '',
        },
    ]);
    const [start, setStart] = useState(0);
    const [limit, setLimit] = useState(1);
    const [search, setSearch] = useState('');
    const [ban, setBan] = useState(0);
    const [unit, setUnit] = useState('');
    const [reason, setReason] = useState('');
    const [lotusadd, setLotusadd] = useState(0);
    const [saveStates, setSaveStates] = useState('');

    const navigate = useNavigate();
    const searchDebounced = useDebounce(search, 700);

    useEffect(() => {
        setSaveStates('');
        request
            .get('/user/getNumberOfAccount2.php', {
                params: {
                    search: searchDebounced,
                },
            })
            .then((res) => {
                setNumberOfAccount(res);
            });
    }, [searchDebounced]);

    useEffect(() => {
        request
            .get('/user/getListAccount2.php', {
                params: {
                    start: start,
                    limit: limit,
                    search: searchDebounced,
                },
            })
            .then((res) => setUsers(res));
    }, [searchDebounced, start, limit]);

    const updateUsers = (value, position) => {
        const newUsers = [...users];
        newUsers.splice(position, 1, value);
        setUsers(newUsers);
    };

    const saveInfo = (user) => {
        const payload = new FormData();
        payload.append('user', JSON.stringify(user));
        request.post('/user/updateAccount2.php', payload).then((res) => setSaveStates('Đã lưu thông tin thành công'));
    };

    const saveBan = (user) => {
        const payload = new FormData();
        payload.append('username', user.username);
        payload.append('ban', new Date().getTime() + ban * unit);
        payload.append('reason', reason);
        request.post('/user/ban.php', payload).then((res) => setSaveStates('Đã khóa tài khoản thành công'));
    };

    const saveUnban = (user) => {
        const payload = new FormData();
        payload.append('username', user.username);
        request.post('/user/unBan.php', payload).then((res) => setSaveStates('Đã mở khóa tài khoản thành công'));
    };

    const saveLotus = (user) => {
        const payload = new FormData();
        payload.append('lotus', lotusadd);
        payload.append('username', user.username);
        request.post('/user/lotus.php', payload).then((res) => {
            setSaveStates('Đã thêm sen thông tin thành công');
        });
    };

    if (getCookie().isadminlogin) {
        return (
            <div>
                <Header path="user/management" />
                <div id="captain" className={cx('wrapper')}>
                    <div className={cx('btn-wrapper')}>
                        <input
                            className={cx('text-input')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {users.map((user, index) => (
                        <div key={user.username}>
                            <div className={cx('member-header-wrapper')}>
                                {user.avatar && <img className={cx('member-header-image')} src={user.avatar} alt="" />}
                                <div className={cx('member-header-info')}>
                                    <input
                                        className={cx('field-input')}
                                        value={user.fullName}
                                        onChange={(e) => updateUsers({ ...user, fullName: e.target.value }, index)}
                                    />
                                    <input
                                        className={cx('field-input')}
                                        value={user.username}
                                        onChange={(e) => updateUsers({ ...user, username: e.target.value }, index)}
                                    />
                                    <input
                                        className={cx('field-input')}
                                        value={user.email}
                                        onChange={(e) => updateUsers({ ...user, email: e.target.value }, index)}
                                    />
                                </div>
                            </div>
                            <p>
                                {user.schoolName} - {user.districtname} - {user.provincename}
                            </p>
                            <p>Ngày sinh: {user.birthday}</p>

                            <p>
                                Admin:{' '}
                                <input
                                    type="checkbox"
                                    checked={user.privilege === '1'}
                                    onChange={(e) =>
                                        updateUsers({ ...user, privilege: e.target.checked ? '1' : '0' }, index)
                                    }
                                />
                            </p>
                            <div>
                                Khóa tài khoản:{' '}
                                <input
                                    className={cx('text-input', 'short-text-input')}
                                    value={ban}
                                    onChange={(e) => setBan(e.target.value)}
                                />
                                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                                    <option value="60000">Phút</option>
                                    <option value="3600000">Giờ</option>
                                    <option value="86400000">Ngày</option>
                                    <option value="2592000000">Tháng</option>
                                    <option value="31536000000">Năm</option>
                                </select>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="lí do"
                                    className={cx('text-input')}
                                ></textarea>
                            </div>
                            <p>
                                {user.lotus} sen{' '}
                                <input
                                    className={cx('text-input', 'short-text-input')}
                                    placeholder="số sen +"
                                    value={lotusadd}
                                    onChange={(e) => setLotusadd(e.target.value)}
                                />
                            </p>
                            <div className={cx('btn-wrapper')}>
                                <Popup
                                    modal
                                    trigger={<button className={cx('btn')}>Sửa thông tin và cấp/bỏ quyền admin</button>}
                                    onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                                    onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                >
                                    {(close) => (
                                        <div className="popup-wrapper">
                                            <p>
                                                Bạn thực sự muốn sửa thông tin và cấp quyền admin cho tài khoản{' '}
                                                {user.username} không?
                                            </p>
                                            <div className={cx('popup-header')}>
                                                <button className="popup-btn wrong-color" onClick={close}>
                                                    Không
                                                </button>
                                                <button
                                                    className="popup-btn correct-color"
                                                    onClick={() => saveInfo(user)}
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
                                    trigger={<button className={cx('btn')}>Khoá tài khoản</button>}
                                    onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                                    onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                >
                                    {(close) => (
                                        <div className="popup-wrapper">
                                            <p>Bạn thực sự muốn khóa tài khoản {user.username} không?</p>
                                            <div className={cx('popup-header')}>
                                                <button className="popup-btn wrong-color" onClick={close}>
                                                    Không
                                                </button>
                                                <button
                                                    className="popup-btn correct-color"
                                                    onClick={() => saveBan(user)}
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
                                    trigger={<button className={cx('btn')}>Bỏ khoá tài khoản</button>}
                                    onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                                    onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                >
                                    {(close) => (
                                        <div className="popup-wrapper">
                                            <p>Bạn thực sự muốn mở khóa tài khoản {user.username} không?</p>
                                            <div className={cx('popup-header')}>
                                                <button className="popup-btn wrong-color" onClick={close}>
                                                    Không
                                                </button>
                                                <button
                                                    className="popup-btn correct-color"
                                                    onClick={() => saveUnban(user)}
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
                                    trigger={<button className={cx('btn')}>Cộng/trừ sen</button>}
                                    onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                                    onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                >
                                    {(close) => (
                                        <div className="popup-wrapper">
                                            <p>Bạn thực sự muốn cộng sen cho tài khoản {user.username} không?</p>
                                            <div className={cx('popup-header')}>
                                                <button className="popup-btn wrong-color" onClick={close}>
                                                    Không
                                                </button>
                                                <button
                                                    className="popup-btn correct-color"
                                                    onClick={() => saveLotus(user)}
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
                    ))}
                </div>
                <Page totalRecords={numberOfAccount} setStart={setStart} setLimit={setLimit} />
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Manage;
