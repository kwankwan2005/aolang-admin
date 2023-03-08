import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import VocabRecord from '../../../Component/Question/VocabRecord';
import Page from '../../../Component/Page';
import { request, useDebounce, getCookie } from '../../../warehouse';
import styles from './Vocab.module.scss';
import Header from '../../../Component/Header';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import ConfirmPopup from '../../../Component/ConfirmPopup';

const cx = classNames.bind(styles);

function Website() {
    const [start, setStart] = useState(0);
    const [limit, setLimit] = useState(1);
    const [numberQues, setNumberQues] = useState('');
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({
        word: '',
        mean: '',
        partOfSpeech: '',
        sentence: '',
    });
    const [saveStates, setSaveStates] = useState('');
    const [done, setDone] = useState(false);
    const [search, setSearch] = useState('');

    const searchDebounce = useDebounce(search, 700);

    const navigate = useNavigate();

    useEffect(() => {
        const payload = new FormData();
        payload.append('start', start);
        payload.append('limit', limit);
        payload.append('search', searchDebounce);
        request.post('/vocab/searchAWord.php', payload).then((res) => setQuestions(res));
    }, [searchDebounce, start, limit, done]);

    useEffect(() => {
        const payload = new FormData();
        payload.append('start', start);
        payload.append('limit', limit);
        payload.append('search', searchDebounce);
        request.post('/vocab/searchAWordNumber.php', payload).then((res) => setNumberQues(res));
    }, [searchDebounce, done]);

    const toUpdateQuestion = () => {
        const payload = new FormData();
        question.questionId = question.id;
        payload.append('question', JSON.stringify(question));
        request.post('/vocab/updateAWord.php', payload).then((res) => {
            setSaveStates('Đã sửa thành công');
        });
    };

    const toDeleteQuestion = () => {
        const payload = new FormData();
        payload.append('id', question.id);
        request.post('/vocab/deleteAWord.php', payload).then((res) => {
            setSaveStates('Đã xóa thành công');
            setDone((prev) => !prev);
            document.getElementById('captain').classList.remove('popupOpen');
        });
    };

    if (getCookie().isadminlogin) {
        return (
            <div id="captain">
                <Header path={'/dynamic/vocab/website'} />
                <div className={cx('btn-wrapper')}>
                    <input className={cx('text-input')} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className={cx('btn-wrapper')}>
                    <ConfirmPopup
                        document={document}
                        trigger={<button className={cx('btn', 'update-btn')}>Sửa câu hỏi</button>}
                        handling={toUpdateQuestion}
                        question="Bạn có muốn sửa không?"
                        saveStates={saveStates}
                        setSaveStates={setSaveStates}
                    />
                    <ConfirmPopup
                        document={document}
                        trigger={<button className={cx('btn', 'delete-btn')}>Xóa câu hỏi</button>}
                        handling={toDeleteQuestion}
                        question="Bạn có thực sự muốn xóa không?"
                        saveStates={saveStates}
                        setSaveStates={setSaveStates}
                    />
                </div>
                {questions.map((question) => (
                    <div key={question.id}>
                        <VocabRecord aQuestion={question} setQuestion={setQuestion} />
                    </div>
                ))}
                <Page totalRecords={numberQues} setStart={setStart} setLimit={setLimit} />
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Website;
