import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import classNames from 'classnames/bind';
import styles from './Marahurd.module.scss';
import Header from '../../../Component/Header';
import { request } from '../../../warehouse';
import Page from '../../../Component/Page';

const cx = classNames.bind(styles);

function Tag() {
    const [allTags, setAllTags] = useState([]);
    const [choseTag, setChoseTag] = useState(0);
    const [start, setStart] = useState(0);
    const [limit, setLimit] = useState(1);
    const [questions, setQuestions] = useState([]);
    const [questionByTags, setQuestionByTags] = useState([]);
    const [numberQues, setNumberQues] = useState('');
    const [totalNumber, setTotalNumber] = useState(0);
    const [newTagName, setNewTagName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [saveStates, setSaveStates] = useState('');
    const [done, setDone] = useState(false);
    const [deleted, setDeleted] = useState([]);
    const [added, setAdded] = useState([]);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        const payload = new FormData();
        payload.append('search', '');
        payload.append('mode', '');
        request.post('/question/searchQuestionNumber.php', payload).then((res) => {
            setTotalNumber(res);
            setNumberQues(res);
        });
    }, []);

    useEffect(() => {
        request.get('/tag/getListTags2.php').then((res) => setAllTags(res));
    }, [done]);

    useEffect(() => {
        if (remove) {
            const payload = new FormData();
            payload.append('start', start);
            payload.append('limit', limit);
            payload.append('mode', '');
            payload.append('tagId', choseTag);
            request.post('/question/getQuestionByTag.php', payload).then((res) => setQuestions(res));
        } else {
            request
                .get('/question/getQuestion2.php', {
                    params: {
                        start: start,
                        limit: limit,
                    },
                })
                .then((res) => setQuestions(res));
        }
    }, [start, limit, choseTag, remove]);

    useEffect(() => {
        if (remove && choseTag !== '0') {
            const payload = new FormData();
            payload.append('mode', '');
            payload.append('tagId', choseTag);
            request.post('/question/getQuestionByTagNumber.php', payload).then((res) => setNumberQues(res));
        } else {
            setNumberQues(totalNumber);
        }
    }, [choseTag, remove]);

    useEffect(() => {
        setDeleted([]);
        setAdded([]);
        request
            .get('/question/getQuestionByTag2.php', {
                params: {
                    tagId: choseTag,
                },
            })
            .then((res) => setQuestionByTags(res));
    }, [choseTag]);

    const toAddPackage = () => {
        const payload = new FormData();
        payload.append('tagname', newTagName);
        payload.append('price', newPrice);
        request.post('/tag/addNewTag.php', payload).then((res) => {
            setDone((prev) => !prev);
            setSaveStates('Đã thêm gói thành công');
        });
    };

    const changeListQuestion = (id, isAdd) => {
        if (isAdd) {
            if (added.indexOf(id) === -1) setAdded((prev) => [...prev, id]);
            setQuestionByTags((prev) => [...prev, id]);
        } else {
            if (deleted.indexOf(id) === -1) setDeleted((prev) => [...prev, id]);
            let temp = [...questionByTags];
            const index = temp.indexOf(id);
            temp.splice(index, 1);
            setQuestionByTags(temp);
        }
    };

    const toSaveQuestion = () => {
        const payload = new FormData();
        payload.append('deleted', JSON.stringify(deleted));
        payload.append('added', JSON.stringify(added));
        payload.append('tagId', choseTag);
        request
            .post('/question/saveTag2.php', payload)
            .then((res) => setSaveStates('Đã lưu sự thay đổi câu hỏi thành công'));
    };

    return (
        <div id="captain">
            <Header path="dynamic/marahurd/addtag" />
            <div className={cx('btn-wrapper', 'fixed', 'top1')}>
                <select value={choseTag} onChange={(e) => setChoseTag(e.target.value)}>
                    <option value="0" disabled></option>
                    {allTags.map((allTag, index) => (
                        <option key={index} value={allTag.id}>
                            {allTag.tagname}
                        </option>
                    ))}
                </select>
                <input
                    className={cx('text-input')}
                    placeholder="tên gói mới"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                />
                <input
                    className={cx('small-text-input')}
                    placeholder="giá của gói"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    type="number"
                />
                <Popup
                    modal
                    trigger={<button className={cx('btn')}>Thêm một gói</button>}
                    onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                    onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                >
                    {(close) => (
                        <div className="popup-wrapper">
                            <p>Bạn có muốn thêm gói {newTagName} không?</p>
                            <div className={cx('popup-header')}>
                                <button className="popup-btn wrong-color" onClick={close}>
                                    Không
                                </button>
                                <button className="popup-btn correct-color" onClick={() => toAddPackage()}>
                                    Có
                                </button>
                            </div>
                            {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                        </div>
                    )}
                </Popup>
            </div>
            <div className={cx('btn-wrapper', 'fixed', 'small-wrapper', 'top2')}>
                <Popup
                    modal
                    trigger={<button className={cx('btn')}>Lưu danh sách câu hỏi</button>}
                    onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                    onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                >
                    {(close) => (
                        <div className="popup-wrapper">
                            <p>Bạn có muốn lưu các câu hỏi ở gói này không?</p>
                            <div className={cx('popup-header')}>
                                <button className="popup-btn wrong-color" onClick={close}>
                                    Không
                                </button>
                                <button className="popup-btn correct-color" onClick={() => toSaveQuestion()}>
                                    Có
                                </button>
                            </div>
                            {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                        </div>
                    )}
                </Popup>
                <div>
                    <input type="checkbox" checked={remove} onChange={(e) => setRemove(e.target.checked)} />
                    Loại bỏ câu không cùng gói
                </div>
            </div>
            <div className={cx('list-question')}>
                {questions.map((question, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            checked={questionByTags.indexOf(question.id) >= 0}
                            className={cx('checkbox')}
                            value={question.id}
                            onChange={(e) => changeListQuestion(e.target.value, e.target.checked)}
                        />
                        {question.question}
                    </div>
                ))}
            </div>

            <Page setStart={setStart} setLimit={setLimit} totalRecords={numberQues} />
        </div>
    );
}

export default Tag;
