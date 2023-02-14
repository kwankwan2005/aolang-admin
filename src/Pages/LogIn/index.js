import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '../../assets';
import styles from './Login.module.scss';
import { getCookie, request, useGlobalStates } from '../../warehouse';
import config from '../../config';

const cx = classNames.bind(styles);

function LogIn() {
    const dispatch = useGlobalStates()[1];
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verify, setVerify] = useState('');
    const [checked, setChecked] = useState(false);
    const [eyesChecked, setEyesChecked] = useState(false);
    let navigate = useNavigate();

    const toLogIn = () => {
        if (username.length > 0 && password.length > 0) {
            const payload = new FormData();
            payload.append('input', username);
            payload.append('password', password);
            request.post('/user/login.php', payload).then((res) => {
                if (res === 'Tên đăng nhập hoặc mật khẩu không khớp') {
                    setVerify(res);
                } else {
                    if (res.privilege === '0') {
                        setVerify('Bạn không được quyền vào trang này');
                    } else {
                        setVerify('');
                        if (checked) {
                            document.cookie = 'isadminlogin=true; expires=1 Jan 2122 00:00:00 UTC';
                        } else {
                            var date = new Date();
                            date.setTime(date.getTime() + 3600000);
                            document.cookie = 'isadminlogin=true; expires=' + date.toUTCString();
                        }
                        navigate(config.routes.home);
                    }
                }
            });
        }
    };

    useEffect(() => {
        if (getCookie().isadminlogin) navigate(config.routes.home);
    }, []);

    const toLogInWhenEnter = (e) => {
        if (e.keyCode === 13) toLogIn();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-wrapper')}>
                <div className={cx('field', 'login-field')}>
                    <label className={cx('field-label')}>Tên đăng nhập hoặc email</label>
                    <input
                        className={cx('field-input')}
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className={cx('field', 'login-field')}>
                    <div className={cx('checkbox-login-wrapper')}>
                        <label className={cx('field-label')}>Mật khẩu</label>
                        <img
                            className={cx('eyes')}
                            src={eyesChecked ? images.eyesClose : images.eyesOpen}
                            onClick={() => setEyesChecked(!eyesChecked)}
                        />
                    </div>
                    {eyesChecked ? (
                        <input
                            className={cx('field-input')}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            onKeyUp={(e) => toLogInWhenEnter(e)}
                        />
                    ) : (
                        <input
                            type="password"
                            className={cx('field-input')}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            onKeyUp={(e) => toLogInWhenEnter(e)}
                        />
                    )}
                </div>
                <p className={cx('validate-info', 'login-field')}>{verify}</p>
                <div>
                    <input type="checkbox" onChange={(e) => setChecked(e.target.checked)} />
                    <span className={cx('remember-login')}>Ghi nhớ đăng nhập</span>
                </div>
                <button className={cx('register-button')} onClick={toLogIn}>
                    Đăng nhập
                </button>
            </div>
            <img className={cx('logo')} src={images.logoAoOpacity} alt="logo aolang" />
        </div>
    );
}

export default LogIn;
