import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../../../Component/Folder.module.scss';
import { images } from '../../../assets';
import Header from '../../../Component/Header';
import config from '../../../config';
import { getCookie } from '../../../warehouse';

const cx = classNames.bind(styles);

function Approve() {
    const navigate = useNavigate();

    if (getCookie().isadminlogin) {
        return (
            <div>
                <Header path="/approve/report" />
                <div className={cx('main-wrapper')}>
                    <img className={cx('logo')} src={images.logoAoOpacity} />
                    <div>
                        <div className={cx('block-wrapper')}>
                            <Link to={config.routes.approve.report.marahurd} className={cx('item-wrapper')}>
                                Marathon và hurdling
                            </Link>
                            <Link to={config.routes.approve.report.vocab} className={cx('item-wrapper')}>
                                Vocab
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

export default Approve;
