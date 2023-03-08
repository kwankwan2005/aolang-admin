import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Question from '../../../Component/Question';
import Page from '../../../Component/Page';
import { request, getCookie } from '../../../warehouse';
import styles from '../Approve.module.scss';
import Header from '../../../Component/Header';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import ConfirmPopup from '../../../Component/ConfirmPopup';

const cx = classNames.bind(styles);

function Marahurd() {
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
    });
    const [message, setMessage] = useState('');
    const [saveStates, setSaveStates] = useState('');
    const [done, setDone] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        request.get('/report/getNumberofReport.php').then((res) => setNumberQues(res));
    }, []);

    useEffect(() => {
        setMessage('');
        setSaveStates('');
        request
            .get('/report/getReport.php', {
                params: {
                    start: start,
                    limit: limit,
                },
            })
            .then((res) => {
                setQuestions(res);
            });
    }, [start, limit, done]);

    const toApprove = (id, approvement) => {
        const payload = new FormData();
        payload.append('id', id);
        payload.append('approvement', approvement);
        payload.append('message', message);
        request.post('/report/approveReport.php', payload).then((res) => {
            if (res) setSaveStates('Bạn đã thực hiện thành công');
            setDone((prev) => !prev);
            setNumberQues((prev) => prev - 1);
            toSaveQuestion();
        });
        if (approvement === 2) {
            addLotus();
        }
    };

    const toSaveQuestion = () => {
        const payload = new FormData();
        payload.append('question', JSON.stringify(question));
        request.post('/question/updateAQuestion.php', payload).then((res) => {});
    };

    const addLotus = () => {
        const payload = new FormData();
        payload.append('lotus', 2);
        payload.append('username', question.username);
        request.post('/user/lotus.php', payload).then((res) => {});
    };

    const confirmYes = () => {
        toApprove(question.id, 2);
        document.getElementById('captain').classList.remove('popupOpen');
    };

    const confirmNo = () => {
        toApprove(question.id, 1);
        document.getElementById('captain').classList.remove('popupOpen');
    };

    if (getCookie().isadminlogin) {
        return (
            <div id="captain">
                <Header path={'/approve/report/marahurd'} />
                {questions.map((question) => (
                    <div key={question.reportId}>
                        <Question aQuestion={question} setQuestion={setQuestion} />
                        <div>
                            <ConfirmPopup
                                document={document}
                                handling={confirmYes}
                                question="Bạn thực sự muốn duyệt không?"
                                saveStates={saveStates}
                                setSaveStates={setSaveStates}
                                trigger={<button className={cx('approve-btn', 'yes-btn')}>Duyệt</button>}
                            />
                            <ConfirmPopup
                                document={document}
                                handling={confirmNo}
                                question="Bạn thực sự muốn từ chối không?"
                                saveStates={saveStates}
                                setSaveStates={setSaveStates}
                                trigger={<button className={cx('approve-btn', 'yes-btn')}>Không duyệt</button>}
                            />
                            <p className={cx('report-info-item')}>Báo cáo: {question.report}</p>
                            <p className={cx('report-info-item')}>Tên đăng nhập: {question.username}</p>
                            <p className={cx('report-info-item')}>Tên: {question.fullname}</p>
                            <p className={cx('report-info-item')}>Thời gian: {question.time}</p>
                            <div className={cx('report-info-item')}>
                                <p>Tin nhắn</p>
                                <textarea
                                    className={cx('message')}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                ))}
                <Page totalRecords={numberQues} setStart={setStart} setLimit={setLimit} />
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Marahurd;
