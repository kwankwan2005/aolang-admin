import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header({ path }) {
    return <h2 className={cx('path')}>{path}</h2>;
}

export default Header;
