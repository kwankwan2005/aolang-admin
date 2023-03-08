import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import ConfirmPopup from '../ConfirmPopup';
import { getCookie, request, HOST_URL } from '../../warehouse';
import CustomizeAudio from '../../Component/CustomizeAudio';
import classNames from 'classnames/bind';
import styles from './Question.module.scss';

const cx = classNames.bind(styles);

function Question({ aQuestion, setQuestion }) {
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [saveStates, setSaveStates] = useState('');

    useEffect(() => {
        setSaveStates('');
        setQuestion(aQuestion);
    }, []);

    useEffect(() => {
        if (aQuestion.questionId !== undefined) {
            request
                .get('/question/getTagsOfAQuestion.php', {
                    params: {
                        id: aQuestion.questionId,
                    },
                })
                .then((res) => {
                    setTags(res);
                });
        }
    }, []);

    useEffect(() => {
        request.get('/tag/getListTags2.php').then((res) => setAllTags(res));
    }, []);

    const cookies = useRef(getCookie());

    const updateQuestion = (value, position) => {
        aQuestion[position] = value;
        setQuestion(aQuestion);
    };

    const uploadMedia = (e) => {
        var file = document.getElementById('upload-media').files[0];
        if (file.size > 10485760) alert('File phải nhỏ hơn 10MB');
        else {
            const payload = new FormData(document.getElementById('upload-media-form'));
            payload.append('id', cookies.current.uid);
            request.post('/file/uploadFile.php', payload).then((res) => {
                if (res.path.indexOf('/') < 0) {
                    alert(res.path);
                } else {
                    document.getElementById('upload-' + res.type + '-link').value = HOST_URL + res.path;
                    updateQuestion(HOST_URL + res.path, res.type);
                    alert('Đã tải lên thành công');
                }
            });
        }
    };

    const toAddATag = () => {
        setTags([...tags, { questionId: aQuestion.id, tagId: '0' }]);
    };

    const toChangeTag = (value, index) => {
        let newTags = [...tags];
        newTags[index] = { questionId: aQuestion.id, tagId: value };
        setTags(newTags);
    };

    const toSaveTag = () => {
        let tagIds = [];
        for (let i = 0; i < tags.length; i++) tagIds.push(tags[i].tagId);
        const payload = new FormData();
        payload.append('questionId', aQuestion.questionId);
        payload.append('tagIds', JSON.stringify(tagIds));
        request.post('/question/saveTagsOfAQuestion.php', payload).then((res) => {
            setSaveStates('Đã lưu thành công');
        });
    };

    const toDeleteTags = (index) => {
        tags.splice(index, 1);
        setTags([...tags]);
    };

    return (
        <div className={cx('type-area')} id="question-captain" key={aQuestion.id}>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Câu hỏi</label>
                <textarea
                    className={cx('field-input', 'question-input')}
                    defaultValue={aQuestion.question}
                    onChange={(e) => updateQuestion(e.target.value, 'question')}
                ></textarea>
            </div>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Câu trả lời</label>
                <textarea
                    className={cx('field-input', 'answer-input')}
                    defaultValue={aQuestion.answer}
                    onChange={(e) => updateQuestion(e.target.value, 'answer')}
                ></textarea>
            </div>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Giải thích</label>
                <textarea
                    className={cx('field-input', 'question-input')}
                    defaultValue={aQuestion.explanation}
                    onChange={(e) => updateQuestion(e.target.value, 'explanation')}
                ></textarea>
            </div>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Danh đề</label>
                <textarea
                    className={cx('field-input', 'answer-input')}
                    defaultValue={aQuestion.credit}
                    onChange={(e) => updateQuestion(e.target.value, 'credit')}
                ></textarea>
            </div>
            <div className={cx('small-text-wrapper')}>
                <div className={cx('field-wrapper')}>
                    <label className={cx('media-label')}>Link ảnh</label>
                    <textarea
                        id="upload-image-link"
                        className={cx('field-input', 'media-input')}
                        defaultValue={aQuestion.image}
                        onChange={(e) => updateQuestion(e.target.value, 'image')}
                    ></textarea>
                </div>
                <div className={cx('field-wrapper')}>
                    <label className={cx('media-label')}>Link âm thanh</label>
                    <textarea
                        id="upload-audio-link"
                        className={cx('field-input', 'media-input')}
                        defaultValue={aQuestion.audio}
                        onChange={(e) => updateQuestion(e.target.value, 'audio')}
                    ></textarea>
                </div>
                <div className={cx('file-input-wrapper')}>
                    <form id="upload-media-form" encType="multipart/form-data">
                        <label className={cx('add-btn-upload')} htmlFor="upload-media">
                            <FontAwesomeIcon icon={faFileArrowUp} />
                        </label>
                        <input type="file" id="upload-media" name="myFile" onChange={(e) => uploadMedia(e)} />
                    </form>
                </div>
                <div className={cx('file-input-wrapper')}>
                    <Popup
                        modal
                        trigger={
                            <button className={cx('add-btn-upload')}>
                                <FontAwesomeIcon icon={faPhotoFilm} />
                            </button>
                        }
                        onOpen={() => document.getElementById('question-captain').classList.add('popupOpen')}
                        onClose={() => document.getElementById('question-captain').classList.remove('popupOpen')}
                    >
                        {(close) => (
                            <div
                                className={cx('file-popup-wrapper', {
                                    'popup-wrapper': true,
                                })}
                            >
                                <button className="close" onClick={close}>
                                    &times;
                                </button>
                                {aQuestion.image && (
                                    <img className={cx('preview-image')} src={aQuestion.image} alt="ảnh câu hỏi" />
                                )}
                                {aQuestion.audio && <CustomizeAudio src={aQuestion.audio} autoplay={false} />}
                            </div>
                        )}
                    </Popup>
                </div>
            </div>
            <div className={cx('dropdown-wrapper')}>
                <div className={cx('field-wrapper')}>
                    <label className={cx('media-label')}>Từ khóa tìm kiếm</label>
                    <textarea
                        className={cx('field-input')}
                        defaultValue={aQuestion.keyWords}
                        onChange={(e) => updateQuestion(e.target.value, 'keyWords')}
                    ></textarea>
                </div>
                <div className={cx('field-wrapper')}>
                    <label className={cx('field-label')}>Độ khó</label>
                    <select
                        defaultValue={aQuestion.difficulty}
                        className={cx('dropdown-input')}
                        onChange={(e) => updateQuestion(e.target.value, 'difficulty')}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                    </select>
                </div>
                <div className={cx('field-wrapper')}>
                    <label className={cx('field-label')}>Vòng thi</label>
                    <select
                        defaultValue={aQuestion.type}
                        className={cx('dropdown-input')}
                        onChange={(e) => updateQuestion(e.target.value, 'type')}
                    >
                        <option value="marathon">Marathon</option>
                        <option value="hurdling">Hurdling</option>
                    </select>
                </div>
                <div className={cx('field-wrapper')}>
                    <label className={cx('field-label')}>Gộp vào Tổng hợp</label>
                    <select
                        defaultValue={aQuestion.isInclusive}
                        className={cx('dropdown-input')}
                        onChange={(e) => updateQuestion(e.target.value, 'isInclusive')}
                    >
                        <option value={1}>Có gộp</option>
                        <option value={0}>Không gộp</option>
                    </select>
                </div>
            </div>
            {aQuestion.questionId !== undefined && (
                <>
                    <div className={cx('tag-wrapper')}>
                        {tags.map((tag, index) => (
                            <div key={index}>
                                <select
                                    className={cx('tag')}
                                    value={tag.tagId}
                                    onChange={(e) => toChangeTag(e.target.value, index)}
                                >
                                    <option value="0" disabled></option>
                                    {allTags.map((allTag, index) => (
                                        <option key={index} value={allTag.id}>
                                            {allTag.tagname}
                                        </option>
                                    ))}
                                </select>
                                <button className={cx('btn', 'delete-btn')} onClick={() => toDeleteTags(index)}>
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={cx('btn-wrapper')}>
                        <button className={cx('btn')} onClick={() => toAddATag()}>
                            Thêm một lĩnh vực
                        </button>
                        <ConfirmPopup
                            document={document}
                            trigger={<button className={cx('btn')}>Lưu lĩnh vực</button>}
                            saveStates={saveStates}
                            setSaveStates={setSaveStates}
                            question="Bạn thực sự muốn lưu danh sách lĩnh vực không?"
                            handling={toSaveTag}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Question;
