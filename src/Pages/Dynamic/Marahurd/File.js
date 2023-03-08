import classNames from 'classnames/bind';
import * as xlsx from 'xlsx';
import styles from './Marahurd.module.scss';
import Header from '../../../Component/Header';
import { useState } from 'react';
import { request, getCookie } from '../../../warehouse';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import ConfirmPopup from '../../../Component/ConfirmPopup';

const cx = classNames.bind(styles);

function File() {
    const [saveStates, setSaveStates] = useState('');
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    const toUpdate = () => {
        const payload = new FormData();
        payload.append('questions', JSON.stringify(data));
        request.post('/question/updateQuestion.php', payload).then((res) => setSaveStates('Đã sửa thành công'));
    };

    const toDelete = () => {
        const payload = new FormData();
        payload.append('questions', JSON.stringify(data));
        request.post('/question/deleteQuestion.php', payload).then((res) => setSaveStates('Đã xóa thành công'));
    };

    const toInsert = () => {
        const payload = new FormData();
        payload.append('questions', JSON.stringify(data));
        request.post('/question/insertQuestion.php', payload).then((res) => setSaveStates('Đã thêm thành công'));
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
        request.get('/question/getQuestion.php').then((res) => {
            const worksheet = xlsx.utils.json_to_sheet(res);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'questions');
            xlsx.writeFile(workbook, 'questions.xlsx');
        });
    };

    if (getCookie().isadminlogin) {
        return (
            <div id="captain">
                <Header path="/dynamic/marahurd/file" />
                <div className={cx('btn-wrapper')}>
                    <ConfirmPopup
                        document={document}
                        handling={toInsert}
                        trigger={<button className={cx('btn')}>Thêm câu hỏi</button>}
                        saveStates={saveStates}
                        setSaveStates={setSaveStates}
                        question="Bạn có muốn thêm không?"
                    />
                    <ConfirmPopup
                        document={document}
                        handling={toUpdate}
                        trigger={<button className={cx('btn')}>Sửa câu hỏi</button>}
                        saveStates={saveStates}
                        setSaveStates={setSaveStates}
                        question="Bạn có muốn sửa không?"
                    />
                    <ConfirmPopup
                        document={document}
                        handling={toDelete}
                        trigger={<button className={cx('btn')}>Xóa câu hỏi</button>}
                        saveStates={saveStates}
                        setSaveStates={setSaveStates}
                        question="Bạn có muốn xóa không?"
                    />
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
