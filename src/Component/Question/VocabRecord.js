import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { getCookie, request, HOST_URL } from '../../warehouse';
import CustomizeAudio from '../../Component/CustomizeAudio';
import classNames from 'classnames/bind';
import styles from './Question.module.scss';

const cx = classNames.bind(styles);

function VocabRecord({ aQuestion, setQuestion }) {
    useEffect(() => {
        setQuestion(aQuestion);
    }, []);

    const cookies = useRef(getCookie());

    const updateQuestion = (value, position) => {
        aQuestion[position] = value;
        setQuestion(aQuestion);
    };

    return (
        <div className={cx('type-area')} id="question-captain" key={aQuestion.id}>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Từ</label>
                <textarea
                    className={cx('field-input', 'answer-input')}
                    defaultValue={aQuestion.word}
                    onChange={(e) => updateQuestion(e.target.value, 'word')}
                ></textarea>
            </div>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Từ loại</label>
                <textarea
                    className={cx('field-input', 'answer-input')}
                    defaultValue={aQuestion.partOfSpeech}
                    onChange={(e) => updateQuestion(e.target.value, 'partOfSpeech')}
                ></textarea>
            </div>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Nghĩa</label>
                <textarea
                    className={cx('field-input', 'answer-input')}
                    defaultValue={aQuestion.mean}
                    onChange={(e) => updateQuestion(e.target.value, 'mean')}
                ></textarea>
            </div>
            <div className={cx('field-wrapper')}>
                <label className={cx('field-label')}>Câu ví dụ</label>
                <textarea
                    className={cx('field-input', 'answer-input')}
                    defaultValue={aQuestion.sentence}
                    onChange={(e) => updateQuestion(e.target.value, 'sentence')}
                ></textarea>
            </div>
        </div>
    );
}

export default VocabRecord;
