import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Question from '../../../Component/Question';
import Page from '../../../Component/Page';
import { request, useDebounce, getCookie } from '../../../warehouse';
import styles from './Marahurd.module.scss';
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
        id: 0,
        question: '',
        answer: '',
        image: '',
        audio: '',
        explanation: '',
        keyWords: '',
        credit: '',
        difficulty: 10,
        type: 'marathon',
        isInclusive: 0,
        questionId: '',
    });
    const [saveStates, setSaveStates] = useState('');
    const [done, setDone] = useState(false);
    const [mode, setMode] = useState('');
    const [search, setSearch] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [choseTag, setChoseTag] = useState('0');

    const searchDebounced = useDebounce(search, 700);

    const navigate = useNavigate();

    useEffect(() => {
        setSaveStates('');
        const payload = new FormData();
        payload.append('search', searchDebounced);
        payload.append('start', start);
        payload.append('limit', limit);
        payload.append('mode', mode);
        payload.append('tagId', choseTag);
        if (search === '' && choseTag !== '0') {
            switch (choseTag) {
                case 'none':
                    request.post('/question/getQuestionDontHaveTags.php', payload).then((res) => setQuestions(res));
                    break;
                case 'many':
                    request.post('/question/getQuestionHasManyTags.php', payload).then((res) => setQuestions(res));
                    break;
                default:
                    request.post('/question/getQuestionByTag.php', payload).then((res) => setQuestions(res));
            }
        } else {
            request.post('/question/searchQuestion.php', payload).then((res) => setQuestions(res));
        }
    }, [searchDebounced, start, limit, mode, done, choseTag]);

    useEffect(() => {
        setSaveStates('');
        const payload = new FormData();
        payload.append('search', searchDebounced);
        payload.append('start', start);
        payload.append('limit', limit);
        payload.append('mode', mode);
        payload.append('tagId', choseTag);
        if (search === '' && choseTag !== '0') {
            switch (choseTag) {
                case 'none':
                    request
                        .post('/question/getQuestionDontHaveTagsNumber.php', payload)
                        .then((res) => setNumberQues(res));
                    break;
                case 'many':
                    request
                        .post('/question/getQuestionHasManyTagsNumber.php', payload)
                        .then((res) => setNumberQues(res));
                    break;
                default:
                    request.post('/question/getQuestionByTagNumber.php', payload).then((res) => setNumberQues(res));
            }
        } else {
            request.post('/question/searchQuestionNumber.php', payload).then((res) => setNumberQues(res));
        }
    }, [searchDebounced, mode, done, choseTag]);

    useEffect(() => {
        request.get('/tag/getListTags2.php').then((res) => setAllTags(res));
    }, []);

    const toUpdateQuestion = () => {
        const payload = new FormData();
        payload.append('question', JSON.stringify(question));
        request.post('/question/updateAQuestion.php', payload).then((res) => {
            setSaveStates('Đã sửa thành công');
        });
    };

    const toDeleteQuestion = () => {
        const payload = new FormData();
        payload.append('id', question.id);
        request.post('/question/deleteAQuestion.php', payload).then((res) => {
            setSaveStates('Đã xóa thành công');
            setDone((prev) => !prev);
            document.getElementById('captain').classList.remove('popupOpen');
        });
    };

    if (getCookie().isadminlogin) {
        return (
            <div id="captain">
                <Header path={'/dynamic/marahurd/website'} />
                <div className={cx('btn-wrapper')}>
                    <button className={cx('btn')} onClick={() => setMode('marathon')}>
                        Marathon
                    </button>
                    <button className={cx('btn')} onClick={() => setMode('hurdling')}>
                        Hurdling
                    </button>
                    <button className={cx('btn')} onClick={() => setMode('')}>
                        Cả hai
                    </button>
                    <select value={choseTag} onChange={(e) => setChoseTag(e.target.value)}>
                        <option value="0">Tổng hợp</option>
                        {allTags.map((allTag, index) => (
                            <option key={index} value={allTag.id}>
                                {allTag.tagname}
                            </option>
                        ))}
                        <option value="none">Không lĩnh vực</option>
                        <option value="many">Đa lĩnh vực</option>
                    </select>
                </div>
                <div className={cx('btn-wrapper')}>
                    <input className={cx('text-input')} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className={cx('btn-wrapper')}>
                    <ConfirmPopup
                        document={document}
                        handling={toUpdateQuestion}
                        question="Bạn có muốn sửa không?"
                        trigger={<button className={cx('btn', 'update-btn')}>Sửa câu hỏi</button>}
                        saveStates={saveStates}
                        setSaveStates={setSaveStates}
                    />
                    <ConfirmPopup
                        document={document}
                        handling={toDeleteQuestion}
                        question="Bạn thực sự muốn xóa không?"
                        trigger={<button className={cx('btn', 'delete-btn')}>Xóa câu hỏi</button>}
                        saveStates={saveStates}
                        setSaveStates={setSaveStates}
                    />
                </div>
                {questions.map((question) => {
                    question.questionId = question.id;
                    return (
                        <div key={question.questionId}>
                            <Question aQuestion={question} setQuestion={setQuestion} />
                        </div>
                    );
                })}

                <Page totalRecords={numberQues} setStart={setStart} setLimit={setLimit} />
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Website;
