import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../../../Component/Folder.module.scss';
import { images } from '../../../assets';
import Header from '../../../Component/Header';
import config from '../../../config';
import { getCookie } from '../../../warehouse';

const cx = classNames.bind(styles);

function Vocab() {
    const navigate = useNavigate();

    if (getCookie().isadminlogin) {
        return (
            <div>
                <Header path="/dynamic/vocab" />
                <div className={cx('main-wrapper')}>
                    <img className={cx('logo')} src={images.logoAoOpacity} />
                    <div>
                        <div className={cx('block-wrapper')}>
                            <Link to={config.routes.dynamic.vocab.website} className={cx('item-wrapper')}>
                                Trực tiếp
                            </Link>
                            <Link to={config.routes.dynamic.vocab.file} className={cx('item-wrapper')}>
                                Qua file
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

export default Vocab;
