import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../../Component/Folder.module.scss';
import { images } from '../../assets';
import Header from '../../Component/Header';
import config from '../../config';
import { getCookie } from '../../warehouse';

const cx = classNames.bind(styles);

function User() {
    const navigate = useNavigate();

    if (getCookie().isadminlogin) {
        return (
            <div>
                <Header path="/user" />
                <div className={cx('main-wrapper')}>
                    <img className={cx('logo')} src={images.logoAoOpacity} />
                    <div>
                        <div className={cx('block-wrapper')}>
                            <Link to={config.routes.user.approve} className={cx('item-wrapper')}>
                                Duyệt tài khoản
                            </Link>
                            <Link to={config.routes.user.manage} className={cx('item-wrapper')}>
                                Quản lí người dùng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default User;
