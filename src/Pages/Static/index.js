import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../../Component/Folder.module.scss';
import { images } from '../../assets';
import Header from '../../Component/Header';
import config from '../../config';
import { getCookie } from '../../warehouse';

const cx = classNames.bind(styles);

function Static() {
    const navigate = useNavigate();

    if (getCookie().isadminlogin) {
        return (
            <div className={cx('wrapper')}>
                <Header path="/" />
                <div className={cx('main-wrapper')}>
                    <img className={cx('logo')} src={images.logoAoOpacity} />
                    <div>
                        <div className={cx('block-wrapper')}>
                            <Link
                                to={config.routes.static.content + '?mode=publicypolicy'}
                                className={cx('item-wrapper')}
                            >
                                CS quyền riêng tư
                            </Link>
                            <Link
                                to={config.routes.static.content + '?mode=termofservice'}
                                className={cx('item-wrapper')}
                            >
                                Điều khoản dịch vụ
                            </Link>
                            <Link to={config.routes.static.content + '?mode=manual'} className={cx('item-wrapper')}>
                                Hướng dẫn sử dụng
                            </Link>
                        </div>
                        <div className={cx('block-wrapper')}>
                            <Link to={config.routes.static.content + '?mode=format'} className={cx('item-wrapper')}>
                                Format
                            </Link>
                            <Link to={config.routes.static.content + '?mode=season'} className={cx('item-wrapper')}>
                                Các mùa giải
                            </Link>
                            <a className={cx('item-wrapper')}>Lịch sử hình thành</a>
                        </div>
                        <div className={cx('block-wrapper')}>
                            <a className={cx('item-wrapper')}>Thành viên</a>
                            <a className={cx('item-wrapper')}>Bộ máy tổ chức</a>
                            <a className={cx('item-wrapper')}>Liên kết ngoài</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Static;
