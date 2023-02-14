import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';
import * as xlsx from 'xlsx';
import styles from './Vocab.module.scss';
import Header from '../../../Component/Header';
import { useState } from 'react';
import { request, getCookie } from '../../../warehouse';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const cx = classNames.bind(styles);

function File() {
    const [saveStates, setSaveStates] = useState('');
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    const toUpdate = () => {
        const payload = new FormData();
        payload.append('questions', JSON.stringify(data));
        request.post('/vocab/updateWord.php', payload).then((res) => setSaveStates('Đã sửa thành công'));
    };

    const toDelete = () => {
        const payload = new FormData();
        payload.append('questions', JSON.stringify(data));
        request.post('/vocab/deleteWord.php', payload).then((res) => setSaveStates('Đã xóa thành công'));
    };

    const toInsert = () => {
        const payload = new FormData();
        payload.append('questions', JSON.stringify(data));
        request.post('/vocab/insertWord.php', payload).then((res) => setSaveStates('Đã thêm thành công'));
    };

    const toReadFile = () => {
        let reader = new FileReader();
        reader.onload = function (e) {
            const workbook = xlsx.read(e.target.result);
            setData(xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
        };
        reader.readAsArrayBuffer(document.getElementById('file').files[0]);
    };

    const toExport = () => {
        request.get('/vocab/getWord.php').then((res) => {
            const worksheet = xlsx.utils.json_to_sheet(res);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'vocab');
            xlsx.writeFile(workbook, 'vocab.xlsx');
        });
    };

    if (getCookie().isadminlogin) {
        return (
            <div id="captain">
                <Header path="/dynamic/vocab/file" />
                <div className={cx('btn-wrapper')}>
                    <Popup
                        modal
                        trigger={<button className={cx('btn')}>Thêm câu hỏi</button>}
                        onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                    >
                        {(close) => (
                            <div className="popup-wrapper">
                                <p>Bạn có muốn thêm không?</p>
                                <div className={cx('popup-header')}>
                                    <button className="popup-btn wrong-color" onClick={close}>
                                        Không
                                    </button>
                                    <button className="popup-btn correct-color" onClick={() => toInsert()}>
                                        Có
                                    </button>
                                </div>
                                {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                            </div>
                        )}
                    </Popup>
                    <Popup
                        modal
                        trigger={<button className={cx('btn')}>Sửa câu hỏi</button>}
                        onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                    >
                        {(close) => (
                            <div className="popup-wrapper">
                                <p>Bạn có muốn sửa không?</p>
                                <div className={cx('popup-header')}>
                                    <button className="popup-btn wrong-color" onClick={close}>
                                        Không
                                    </button>
                                    <button className="popup-btn correct-color" onClick={() => toUpdate()}>
                                        Có
                                    </button>
                                </div>
                                {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                            </div>
                        )}
                    </Popup>
                    <Popup
                        modal
                        trigger={<button className={cx('btn')}>Xóa câu hỏi</button>}
                        onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                    >
                        {(close) => (
                            <div className="popup-wrapper">
                                <p>Bạn có muốn xóa không?</p>
                                <div className={cx('popup-header')}>
                                    <button className="popup-btn wrong-color" onClick={close}>
                                        Không
                                    </button>
                                    <button className="popup-btn correct-color" onClick={() => toDelete()}>
                                        Có
                                    </button>
                                </div>
                                {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                            </div>
                        )}
                    </Popup>
                    <button className={cx('btn')} onClick={() => toExport()}>
                        Xuất câu hỏi
                    </button>
                </div>
                <input type="file" id="file" onChange={() => toReadFile()} />
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default File;
