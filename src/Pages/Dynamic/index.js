import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../../Component/Folder.module.scss';
import { images } from '../../assets';
import Header from '../../Component/Header';
import config from '../../config';
import { getCookie } from '../../warehouse';

const cx = classNames.bind(styles);

function Dynamic() {
    const navigate = useNavigate();

    if (getCookie().isadminlogin) {
        return (
            <div>
                <Header path="/dynamic" />
                <div className={cx('main-wrapper')}>
                    <img className={cx('logo')} src={images.logoAoOpacity} />
                    <div>
                        <div className={cx('block-wrapper')}>
                            <Link to={config.routes.dynamic.marahurd._} className={cx('item-wrapper')}>
                                Marathon và hurding
                            </Link>
                            <Link to={config.routes.dynamic.vocab._} className={cx('item-wrapper')}>
                                Vocab
                            </Link>
                        </div>
                        <div className={cx('block-wrapper')}>
                            <a className={cx('item-wrapper')}>Tên huyện</a>
                            <a className={cx('item-wrapper')}>Tên tỉnh</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Dynamic;
